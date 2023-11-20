---
layout: post
comments: true
description: "感觉上要把剩下的东西弄出来不是那么麻烦，但其实从这里开始，就没有太多 D3 自己原生支持的东西可以用，真的变成自己「画」了，所以..."
title: "打造一张自驾地图（2）"
date: 2023-11-13 21:54:27 +0800
categories: 

- rabbit-hole
- maps
- GIS

---

> 接着[上一篇](/2023/11/build-a-map-to-record-part-1/)，继续画地图...

感觉上要把剩下的东西弄出来不是那么麻烦，但其实从这里开始，就没有太多 D3 自己原生支持的东西可以用，真的变成自己生成数据然后去「画」了。

这篇先说说等高线怎么画。

<h3>目录</h3>

- TOC
{:toc}

### 数据获取和处理

#### 获得原始数据

国内免费的等高线数据（DEM 数据）比较难找。

实际上，注册一个 NASA 的账号，就可以到 [earthdata](https://search.earthdata.nasa.gov/) 上面去下载 [ASTER GDEM](https://asterweb.jpl.nasa.gov/gdem.asp) 数据{% sidenote 'sn-id-1' '这是日本和美国在 2019 年联合发布的一个数据集。' %}：

{% picture /downloads/images/2023_11/search_earthdata_nasa.png --alt search_earthdata_nasa %}

<small>图 1. 查询感兴趣的位置并下载数据</small>

下载的数据是 TIF 格式的，可以把它合并成一个文件：

```bash
gdal_merge.py refs/contour/*.tif -o refs/contour/new.tif

0...10...20...30...40...50...60...70...80...90...100 - done.
```

可以先到[这个网站](https://app.geotiff.io/load)去检查一下合并后的 TIF 文件是不是包含了所有感兴趣的区域的 DEM 数据：

{% picture /downloads/images/2023_11/validation_new_projected_tif.png --alt validation_new_projected_tif %}

<small>图 2. 检查合并后的 TIF 覆盖范围</small>


用 `gdalsrsinfo` 去查看这个文件的一些属性数据：

```bash
gdalsrsinfo refs/contour/new.tif

PROJ.4 : +proj=longlat +datum=WGS84 +no_defs

OGC WKT2:2019 :
GEOGCRS["WGS 84"
    ...
    ID["EPSG",4326]]
```

而前面准备的 GeoJSON 文件里面的声明是：

```javascript
{
	"type": "FeatureCollection",
	"name": "merged",
	"crs": { 
		"type": "name",
		"properties": { "name":"urn:ogc:def:crs:OGC:1.3:CRS84" } 
	},
	...
```

它们的坐标体系一不一样？是不是需要对齐？

#### 数据对齐

##### WGS84

WGS84 是「World Geodetic System 1984」的缩写，它可能会带来最多的困惑。因为它实际上由四个东西组成：

- **一个椭球体**：由于地球不是完美的球形，地图需要创建一个近似地球曲率的椭球模型。各种系统根据该椭球体的形状而有所不同——赤道处的半径和两极处的平坦度是两个主要差异。所以如果上下文是关于这个的，那么 WGS84 可以简单理解为一个特定形状的椭球体。
- **一个水平基准**：水平基准用来描述如何用坐标系的两根轴来定义经纬度。通常会把赤道作为零线来描述南北（纬度），把格林威治子午线作为零线来描述东西（经度）。所以 WGS84 还可以指特定形状椭球体以及它上面锚定的锚点系统。
- **一个垂直基准**：地球上的点相对于 WGS84 定义的椭球体还会有高度上的起伏。因此 WGS84 还定义了一个用来计算这个高度差的参考水平面，这个就是垂直基准。比如有时候在无人机上拍照，会有一个 WGS84 海拔高度，这其实就是用这个基准计算的。
- **一个坐标系**：最后，我们看到的 WGS84 也可能是在说一个完整的「[地理坐标系](https://support.virtual-surveyor.com/support/solutions/articles/1000261350)」。一个地理坐标系由「水平基准+零线+角度单位」构成，并且在 EPSG{% sidenote 'sn-id-2' 'EPSG 是欧洲石油测量组织（European Petroleum Survey Group），专门维护了一个庞大的数据库，让每个坐标系、椭球体和单位都被分配唯一的编号，便于使用和转换。' %} 系统里面还有一个唯一的码号：4326。人们经常说 GPS 导航是基于 WGS84 的，说的其实就是 EPSG:4326。

再看看 `gdalsrsinfo` 命令的完整输出，会发现它很显然是一个坐标系的定义：

```bash
gdalsrsinfo refs/contour/new.tif

PROJ.4 : +proj=longlat +datum=WGS84 +no_defs

OGC WKT2:2019 :
GEOGCRS["WGS 84",
    ENSEMBLE["World Geodetic System 1984 ensemble",
        MEMBER["World Geodetic System 1984 (Transit)"],
        MEMBER["World Geodetic System 1984 (G730)"],
        MEMBER["World Geodetic System 1984 (G873)"],
        MEMBER["World Geodetic System 1984 (G1150)"],
        MEMBER["World Geodetic System 1984 (G1674)"],
        MEMBER["World Geodetic System 1984 (G1762)"],
        MEMBER["World Geodetic System 1984 (G2139)"],
        # 这里是椭球体的定义
        ELLIPSOID["WGS 84",6378137,298.257223563,
            LENGTHUNIT["metre",1]],
        ENSEMBLEACCURACY[2.0]],
    # 这里是零线和角度单位的定义
    PRIMEM["Greenwich",0,
        ANGLEUNIT["degree",0.0174532925199433]],
    CS[ellipsoidal,2],
        AXIS["geodetic latitude (Lat)",north,
            ORDER[1],
            ANGLEUNIT["degree",0.0174532925199433]],
        AXIS["geodetic longitude (Lon)",east,
            ORDER[2],
            ANGLEUNIT["degree",0.0174532925199433]],
    USAGE[
        SCOPE["Horizontal component of 3D system."],
        AREA["World."],
        BBOX[-90,-180,90,180]],
    # 这里是 EPSG 的代码，4326
    ID["EPSG",4326]]
```

##### SRS 与 CRS

然后， GeoJSON 里的 `CRS:84` 是什么？

在处理 GIS 信息的时候，会大量看到 CRS（Coordinate Reference System）和 SRS（Spatial Reference System），字面上理解它们分别是「坐标参考系」和「空间参考系」。

但就像前面说的，WGS84 表示的东西可能在这两个体系里来回跳。比如 EPSG:4326 是一个 WGS84 定义的 CRS，它由 WGS84 Geodetic Datum（EPSG:6326）和 椭球体坐标系统（EPSG:6422）组成，后面两者都是 SRS 体系的。

CRS:84，实际上跟 EPSG:4326 是[对齐的](http://mapserver.org/ogc/wms_server.html#coordinate-systems-and-axis-orientation)。

另外，对于不同的 geodetic CRS，例如 OSGB 1936 (EPSG:4277)，使用相同的投影参数，是可以得到一个有效的坐标的。但这类 CRS 大部分会被赋予较高的 EPSG 编号，因为它们经常是为了特殊用途临时的 ad-hoc，并未被 EPSG 正式采用。比如前面画地图用的投影方法，是 Google 的 Web Mercator，一开始就编号为 `EPSG:900913`，直到它被采用为 `EPSG:3857`{% sidenote 'sn-id-3' '目前除开 Google 地图， CARTO、Mapbox、Bing Maps、OpenStreetMap 和 Esri 等等都是用这个标准。要处理小范围的数据并且保留要素的形状，EPSG:3857 一般都是正确的选择。' %}。

##### EPSG:4326 和 EPSG:3857

现在手里的等高线数据是 `EPSG:4326` 的，GeoJSON 是 `CRS:84` 的，然后画图又用的是 `EPSG:3857`。要不要做一次转换？实际上，下面的命令是可以运行的，转换出来的数据也是对的：

```bash
gdalwarp -s_srs "+proj=longlat +datum=WGS84 +no_defs" -t_srs EPSG:3857 refs/contour/new.tif refs/contour/new_projected.tif
```

但需要理解，转换后的数据其实已经从地理坐标（经纬度）变成了平面坐标（x , y），并且采用的投影方式是 `Web Mercator` 。如果还要完成大量基于经纬度的操作，这个转换可能就做早了{% sidenote 'sn-id-4' 'GDAL 和 D3 都提供了很多基于经纬度操作数据的辅助函数，包括各种投影的 wrapper，就是这个原因。' %}。

比如目前等高线范围是个长方形。如果要基于 GeoJSON 里面定义的行政区域边界去做一个裁剪，使用这个转换后的 TIF，就需要把 GeoJSON 里的边界也算成投影后的数值，再绘制边界进行切割，这肯定是整麻烦了。

#### 裁剪目标区域

以凉山自治州的边界来裁剪等高线图为例。首先获取 GeoJSON 数据的 Extent：

```bash
ogrinfo refs/raw_data/main/凉山彝族自治州边界.geojson -so -al | grep Extent

Extent: (100.060168, 26.049272) - (103.875427, 29.306115)
```

然后就可以在这个矩形范围内进行裁剪了：

```bash
gdal_translate -a_ullr 100.060168 26.049272 103.875427 29.306115 refs/contour/new.tif refs/contour/ls_box.tif

gdalwarp -cutline refs/raw_data/main/凉山彝族自治州边界.geojson refs/contour/ls_box.tif refs/contour/ls_cutout.tif

Creating output file that is 7746P x 6612L.
Processing refs/contour/ls_box.tif [1/1] : 0Warning 1: the source raster dataset has a SRS, but the cutline features not.  We assume that the cutline coordinates are expressed in the destination SRS.
If not, cutline results may be incorrect.
...10...20...30...40...50...60...70...80...90...100 - done.
```

这里的警告信息其实是因为 GeoJSON 里面没有显式声明 SRS（虽然它们是对齐的）。如果有洁癖，可以编辑 GeoJSON 把它加上。

#### 生成、调试与合并

因为高度差比较大，不想线太密，所以取了 150 米的步长：

```bash

gdal_contour -a elev -3d -i 150.0 -f "GeoJSON" refs/contour/ls_cutout.tif  refs/contour/contours_3d_ls_box.geojson

0...10...20...30...40...50...60...70...80...90...100 - done.
```


{% picture /downloads/images/2023_11/liangshan_dem.png --alt liangshan_dem %}

<small>图 4. 凉山州原始等高线</small>

把凉山、丽江和攀枝花的等高线都用这个办法生成之后，可以在  [Mapshaper](https://mapshaper.org/) 上进行拼接并简化{% sidenote 'sn-id-5' '如果只是拼接命令行就够了。这里核心是要用 Mapshaper 提供的「simplify」功能，把等高线的数据做一些简化，不然得到的地图上就密密麻麻全是等高线了。' %}：

{% picture /downloads/images/2023_11/merged_dem.png --alt merge_dem_geojson %}

<small>图 5. 合并后的原始等高线</small>

### 绘制等高线

有了等高线的 GeoJSON 数据，可以做各种样式的绘制。甚至我觉得用 blender 渲染成 Fjelltopp 的那种 [3D 海报](https://en.fjelltopp.com/collections/norska-fjall/products/geiranger-poster-no-2-elevation)都是可以的：

{% picture /downloads/images/2023_11/fjelltopp_poster_3.png --alt fjelltopp_poster_3 %}

<small>图 6. Geiranger 海报</small>

但这个可以改天来，还是先回到我们的性冷淡风地图。不要使用 D3 提供的类似 `d3.contours()` 方法，而直接用同样的风格和 `clipPath` 来绘制： 

```javascript

// contour
drawPath(geoData[4], {
    projection: geoProjectionLS,
    stroke: COLOR_CONTOURS,
    strokeWidth: 0.2,
    clipId: OUTTER_CLIP_FRAME_ID,
    // shadowId: SHADOW_FILTER_ID,
    mapRectId: MAIN_MAP_ID
});
```

得到的带等高线的地图如下：

{% picture /downloads/images/2023_11/how_to_map_7.png --alt how_to_map_7.png %}

<small>图 7. 带等高线的地图</small>

接下来还需要完成：

- 区域的地名；
- 比例尺等图例；
- 实际的自驾轨迹；
- 关键景点的标记；
