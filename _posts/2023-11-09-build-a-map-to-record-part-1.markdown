---
layout: post
comments: true
description: "前几天瞎逛，看到个北欧的公司 Fjelltopp 的海报很好看。正好自己也才去了一趟木里，就觉得，我是不是也可以画一张好看的地图。结果，就掉进了兔子洞里..."
title: "打造一张自驾地图（1）"
date: 2023-11-09 22:24:29 +0800
categories: 

- rabbit-hole
- maps
- GIS

---

> 这是「[兔子洞](/categories/rabbit-hole/)」 系列之，如何画地图的第一部分...

前几天瞎逛，看到个北欧的公司 [Fjelltopp](https://en.fjelltopp.com/)，它的[海报作品](https://en.fjelltopp.com/collections/altitud)很有设计感：

{% picture /downloads/images/2023_11/fjelltopp_poster_1.jpg --alt fjelltopp_poster_1 %}

<small>图 1. 赫马万和塔纳比山谷</small> 

{% picture /downloads/images/2023_11/fjelltopp_poster_2.jpg --alt fjelltopp_poster_2 %}

<small>图 2. Galdhøpiggen 的等高线</small> 

当我看到它网站上的口号时{% sidenote 'sn-id-1' '人家的口号是：「Find your favorite mountain and bring the serenity of the mountains home with you.」' %}，就想：「木里周围海拔差也很大，说不定，我也可以画出一些挺好看的地图...」。

事后发现，这个[兔子洞](/categories/rabbit-hole/)还真是够深的。

<h3>目录</h3>

- TOC
{:toc}

### Toolchain

一些 all-in-one 的 GIS 软件，比如 [QGIS](https://www.qgis.org/)，显然是能拿来做地图的。但是如果对里面大量的要素（包括比例、中心位置、不同元素的颜色、湖泊和边界有没有阴影等等）都希望自己可控，使用一个陌生而复杂的软件就很容易让人感觉无从下手。

因此我决定用 [D3](https://d3js.org/) ：虽然少了很多脚手架，但是好处是可以在 SVG 或者 Canvas 上一点点把地图画出来，整个过程完全是通过代码就可以控制的。

至于具体是 SVG 还是 Canvas，在这个场景里面偏个人喜好。比如我就很喜欢 Canvas 里可以用类似于`context.shadowBlur` 和 `context.shadowColor` 这样的声明直接控制阴影宽度和大小，但我很不喜欢 Canvas 里做各种切割和覆盖的时候要自己去控制 `save` 和 `restore` 的顺序。

反正最后选了 SVG。
 
### 准备画布

海报一般按照长、宽和 DPI 来确定画布的大小和清晰度。对应到屏幕上的画布，需要一个从折算。

比如，我希望以 300 的 DPI 来打印这张海报，海报的大小是 60cm x 70cm，留的边框是 3cm，那么应该是这么去声明：

```javascript

const W = 708.7 //60cm
const H = 826.8 //70cm
const CM = 11.8 //300dpi下的1cm

const MARGIN = 3 * CM
const WIDTH = W - 2 * MARGIN
const HEIGHT = H - 2 * MARGIN
```

然后用这些数值来画出画布和画框。这里用 `clipPath` 去声明画框是因为后面绘制的超出画框范围内的东西可以更方便地切掉：

```javascript

function drawFrame(clipId) {

    const g = svg.append("g").attr("id", MAIN_MAP_ID + '-frame')
    g.append("clipPath")
        .attr("id", clipId)
        .append("rect")
        .attr("x", MARGIN)
        .attr("y", MARGIN)
        .attr("width", W - 2 * MARGIN)
        .attr("height", H - 2 * MARGIN)
    g.append("rect")
        .attr("x", MARGIN)
        .attr("y", MARGIN)
        .attr("width", W - 2 * MARGIN)
        .attr("height", H - 2 * MARGIN)
        .attr('fill', COLOR_INNER_BACKGROUND);
}

```

得到的是下面的结果：

{% picture /downloads/images/2023_11/how_to_map_1.png --parent style="border:none !important" %}

<small>图 3. 70cm x 60cm 画布</small>

### 绘制主要行政区域

这次自驾主要是在「泸沽湖-木里」这条线上，在丽江、凉山、攀枝花三个行政区域内，所以首先要把这片区域画出来。

D3 的 geo 模块是专门处理相关功能的模块，使用之前需要搞清楚三个东西：

- **Data**
- **Projection**
- **Path Generator**

#### Data

D3 原生支持的数据格式是 [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON)。如果下载的是 TopoJSON{% sidenote 'sn-id-2' '可以理解为加入了拓扑信息的 GeoJSON 的扩展。' %}，D3 提供了一些[帮助函数](https://observablehq.com/@didoesdigital/about-map-data-geojson-and-topojson-with-d3)。

另外，无论 GeoJSON 还是 TopoJSON，对它们的切割和合并最好不要直接编辑文件，尽量使用 GDAL{% sidenote 'sn-id-2' '这是一个 [OSGEO](https://www.osgeo.org/) 基金会的开源项目，提供了很多操作数据的函数。' %}这样的包，里面已经处理了各种 edge case。

这里，我先在 [OSM](https://www.openstreetmap.org/) 上下载了三个区域的 GeoJSON 数据。

每个 GeoJSON 里面的原子数据集是一个个的 feature，每个 feature 主要是两部分数据：

- **geometry**：多边形和点构成；
- **properties**：各种附加信息，比如名称、ID、数据；

D3 已经处理了大部分 GeoJSON 的细节，所以只需要对它有基础了解就可以使用数据了。

最新版的 D3 支持了 Promise，所以加载数据可以用下面的方式：

```javascript

var promises = [];

DATA_FILES.forEach(function (url) {
    promises.push(d3.json(url))
});

Promise.all(promises).then(function (values) {
    //do something with the data values
});
```

另外，虽然你可以单独加载和绘制每个区域，用 [GDAL](https://www.gdal.org/) 里面提供的 `ogrmerge.py` 合并这几个城市的数据会更好：

```bash

> ogrmerge.py *.geojson -o merged_distinct.geojson -f GeoJSON -single`

```


#### Projection

要在一个平面上绘图，就需要一个从纬度/经度坐标到 (x,y) 坐标的转换，这就是一个 projection 函数。

问题是，人类已经发明了很多办法来干这个事情，光是 D3 支持的就有三大类总共十来种：

- [方位角投影](https://d3js.org/d3-geo/azimuthal)
- [圆锥投影](https://d3js.org/d3-geo/conic)
- [圆柱投影](https://d3js.org/d3-geo/cylindrical)

不存在完美的投影函数，因为在形状、面积、距离和/或方向这些要素里，每种算法都是对某个或某些属性精确度的选择和权衡的结果。在实际的选择中，除开去对应自己的需要，还得注意两个地方。

首先是适配数据本身的投影格式。比如打开我们下载的 GeoJSON 文件，可以看到它里面有一个[WSG84](https://en.wikipedia.org/wiki/Web_Mercator_projection#:~:text=Web%20Mercator%2C%20Google%20Web%20Mercator,Maps%20adopted%20it%20in%202005)的声明，这其实就对应了 `geoMercator` 的投影。如果你想要使用其他投影方式来展示这份数据，需要先通过工具改变它的投影（后面会说到）。

然后就是这个投影函数的一些可调参数，一般用来指定数据投影的范围等等。

有两种做法。一种是 D3 提供的 `fitExtent` 或者 `clipExtent` 函数，它们可以直接让你把数据用选中的投影函数填充或者是以某个路径切割成对应的形状：

```javascript

var geoProjectionLS = d3.geoMercator()
          .fitExtent([[3 * MARGIN, 3 * MARGIN], [WIDTH, HEIGHT]], land);
//or
var geoProjectionLS = d3.geoMercator()
          .clipExtent([[MARGIN, MARGIN], [WIDTH, HEIGHT]], land);
```

另一种是直接指定 `scale/center/translate/rotate` 这些参数来更细颗粒度地控制：

```javascript

const SCALE = 6587 // for print just increase this
const CENTER = [101.02, 26.53] // [lon,lat]

var geoProjectionLS = d3.geoMercator()
    .scale(SCALE * 1.5)
    .center(CENTER)
    .translate([WIDTH * 0.5, HEIGHT * 0.5])
```

#### Path Generator

这个函数负责将 GeoJSON 转换为 SVG 下的 `path` 。通常的做法是使用 `d3.geoPath()` 并指定一个 `projection` 来获得：

```javascript
  var geoGenerator = d3.geoPath(projection);
```

最终渲染到 SVG 的时候我写了一个 warpper，封装掉细节，只暴露样式：

```javascript
function drawMap(
  geoData,
  {
    width,
    height,
    marginTop = 1,
    marginLeft = 1,
    marginBottom = 1,
    marginRight = 1,
    padding = 30,
    projection = d3.geoIdentity().reflectY(true),
    fill = "none",
    stroke = "black",
    strokeWidth = 0.75,
    strokeLinejoin = "round",
    clipId = "none",
    mapRectId = "none",
    shadowId = "none",
    debug = false,
  } = {}
) {
  var geoGenerator = d3.geoPath(projection);
  var mapRect = d3.select("svg").append("g").attr("id", mapRectId);

  const canvas = mapRect.append("g").attr("class", "features");

  if (debug) {
    canvas
      .append("rect")
      .attr("fill", "none")
      .attr("stroke", "#f0f")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - (marginLeft + marginRight))
      .attr("height", height - (marginTop + marginBottom));
    canvas
      .append("rect")
      .attr("fill", "none")
      .attr("stroke", "#f0f")
      .attr("x", marginLeft + padding)
      .attr("y", marginTop + padding)
      .attr("width", width - (marginLeft + marginRight + 2 * padding))
      .attr("height", height - (marginTop + marginBottom + 2 * padding));
  }

  canvas
    .append("path")
    .datum(geoData)
    .attr("clip-path", "url(#" + clipId + ")")
    .attr("filter", "url(#" + shadowId + ")")
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth)
    .attr("stroke-linejoin", strokeLinejoin)
    .attr("d", geoGenerator);

  return Object.assign(mapRect, {
    props: {
      projection,
      width,
      height,
      marginTop,
      marginLeft,
      marginBottom,
      marginRight,
      padding,
      geoData,
      clipId,
      mapRectId,
    },
  });
}
```

到这一步，地图出来了：

{% picture /downloads/images/2023_11/how_to_map_2.png --alt how_to_map_2 %}

<small>图 4. 绘制主要区域</small>


### 绘制水域和道路

OSM 或者国内的一些公开数据集里有到区县一级的[道路和水系水域](https://www.poi86.com/poi/amap/city/513400.html)，下载之后可以直接使用。颜色上，蓝色表示水系水域，白色表示道路：

{% picture /downloads/images/2023_11/how_to_map_3.png --alt how_to_map_3 %}

<small>图 5. 绘制水域和道路</small>

### 添加阴影

Fjelltopp 的地图之所以好看，一个很重要的原因是对阴影的使用。

在 SVG 上面添加阴影有很多办法。我选择先声明一个带 id 的阴影定义：

```html
<svg>
    <defs>
        <filter id='shadow' color-interpolation-filters="sRGB">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.5" />
        </filter>
    </defs>
</svg>
```

这样我在调用 wrapper 的时候只需要通过是否指定，指定哪个 id 的阴影，就可以控制阴影的样式：

```javascript
// lake
drawPath(geoData[1], {
    projection: geoProjectionLS,
    stroke: COLOR_WATER,
    strokeWidth: 0.5,
    clipId: OUTTER_CLIP_FRAME_ID,
    shadowId: SHADOW_FILTER_ID, //湖有阴影
    mapRectId: MAIN_MAP_ID,
})

// river
drawPath(geoData[2], {
    projection: geoProjectionLS,
    stroke: COLOR_WATER,
    strokeWidth: 0.5,
    clipId: OUTTER_CLIP_FRAME_ID,//河没有阴影
    mapRectId: MAIN_MAP_ID,
})
```


{% picture /downloads/images/2023_11/how_to_map_4.png --alt how_to_map_4 %}

<small>图 6. 添加阴影</small>

### 绘制画中画

前面的地图应该给人一种下面很空的感觉。这其实是通过调整投影中心点专门空出来了一块，用来绘制画中画。

因为实际上主要的活动轨迹虽然横跨三个区域，但核心就在丽江宁蒗，凉山木里和盐源这几个地方。所以下面的位置用来放这个区域放大的画中画，以及一些图例。

整个画中画区域从形成边界到绘制道路和水系，跟主体类似。需要注意的是一些坐标的转换，因为这里投射的中心点，以及画框，都不是从常规意义上 (0,0) 坐标点开始的：

```javascript

const MULI_FRAME_WIDTH = 20 * CM;
const MULI_FRAME_HEIGHT = 22 * CM;
const MULI_FRAME_MARGIN = 2 * CM;

const DEGREE_STEP_MULI = [0.5, 0.5]
const GRATICULE_INNER_PRECISION = 0.4

const CENTER_MULI = [101.03, 29.85] // [lon,lat]

const INNER_CLIP_FRAME_ID = 'id-inner-clip-frame'
const MULI_MAP_ID = 'id-muli-map'

var geoProjectionMuLi = d3.geoMercator()
    .scale(SCALE * 1.8)
    .center(CENTER_MULI)
    .translate([WIDTH * 0.22, HEIGHT * 0.24])
//for better control we use projection above instead of fitExtent
// .fitExtent([[3 * MARGIN, 3 * MARGIN], [WIDTH, HEIGHT]], land)
```

这样我们就可以得到一个带画中画的地图了：

{% picture /downloads/images/2023_11/how_to_map_5.png --alt how_to_map_5 %}

<small>图 7. 添加画中画</small>

### 绘制经纬线和坐标轴

画框里面没有地图的部分，虽然会被最后加上的图例等等零星填充，但还是有大片空白，显得有点无聊，加上经线和纬线作为标记会精神很多。

这里核心的思路是通过指定起始点的坐标和间距，在画布上进行经纬线的绘制（为了美观画了一粗一细两根）：

```javascript
function drawBiGraticules(
  mapRect,
  {
    step = [1, 1],
    graticulePrecision = 2.5,
    stroke = "#999",
    minorStrokeWidth = 0.15,
    minorOpacity = 0.4,
    majorStrokeWidth = 0.25,
    majorOpacity = 0.6,
    debug = false,
  } = {}
) {
  const {
    projection,
    marginTop,
    marginRight,
    marginLeft,
    marginBottom,
    height,
    width,
    padding,
    mapRectId,
    clipId,
  } = mapRect.props;

  var graticuleRect = d3
    .select("svg")
    .append("g")
    .attr("id", mapRectId + "-graticule-rect");

  var geoGenerator = d3.geoPath().projection(projection);

  // Thinner lines at half the step intervals
  var graticulesMinor = d3
    .geoGraticule()
    .step([step[0] / 2, step[1] / 2])
    .precision(graticulePrecision)();

  graticuleRect
    .append("g")
    .attr("class", "graticules")
    .append("path")
    .attr("class", "minor-graticules")
    .attr("class", "graticule")
    .attr("clip-path", "url(#" + clipId + ")")
    .attr("stroke", stroke)
    .attr("fill", "none")
    .attr("stroke-width", minorStrokeWidth)
    .attr("opacity", minorOpacity)
    .attr("d", geoGenerator(graticulesMinor));

  // Thicker lines at step intervals
  var graticulesMajor = d3
    .geoGraticule()
    .step(step)
    .precision(graticulePrecision)();

  graticuleRect
    .append("g")
    .attr("class", "graticules")
    .append("path")
    .attr("class", "major-graticules")
    .attr("clip-path", "url(#" + clipId + ")")
    .attr("stroke", stroke)
    .attr("fill", "none")
    .attr("stroke-width", majorStrokeWidth)
    .attr("opacity", majorOpacity)
    .attr("d", geoGenerator(graticulesMajor));
}
```

并且，通过坐标点反算出经纬度，作为轴上显示的取值：

```javascript
function viewportAsGeo({
  projection,
  width,
  height,
  marginTop = 0,
  marginRight = 0,
  marginLeft = 0,
  marginBottom = 0,
  precision = 2.5,
} = {}) {
  const p1 = [marginLeft, marginTop];
  const p2 = [width - marginRight, marginTop];
  const p3 = [width - marginRight, height - marginBottom];
  const p4 = [marginLeft, height - marginBottom];

  const vertices = [p1, p2, p3, p4, p1];
  const viewportSize = Math.min(
    width - marginRight - marginLeft,
    height - marginTop - marginBottom
  );
  const parts = Math.floor(viewportSize / precision);

  let lines = pairUp(vertices);

  lines = lines
    .flatMap(([p1, p2]) => partitionLine(...p1, ...p2, parts))
    .map((l) => l[0]);

  lines = [...lines, p1];
  return {
    type: "Polygon",
    coordinates: [lines.map((p) => projection.invert(p))],
  };
}
```

当然，这个值是数值形式的，直接用来显示不够美观，还需要格式化成我们常见的「时分秒+NSEW」的样式：

```javascript

...

d.type === "longitude" ? formatLongitude(d[0]) : formatLatitude(d[1])
...

function formatLongitude(x) {
  return x < 0 ? formatDigtalToDMS(x) + "W" : formatDigtalToDMS(x) + "E";
}

function formatLatitude(x) {
  return x < 0 ? formatDigtalToDMS(x) + "S" : formatDigtalToDMS(x) + "N";
}

function formatDigtalToDMS(x) {
  deg = 0 | (x < 0 ? (x = -x) : x);
  min = 0 | (((x += 1e-9) % 1) * 60);
  sec = (0 | (((x * 60) % 1) * 6000)) / 100;
  return deg + "°" + min + "'" + sec + '"';
}
```

到这里就得到了一张下面的地图：

{% picture /downloads/images/2023_11/how_to_map_6.png --alt how_to_map_6 %}

<small>图 8. 增加经纬度和坐标轴</small>

和 Fjelltopp 的海报比，这张地图上缺少的东西包括：

- 等高线；
- 区域的地名；
- 比例尺等图例；

我还想加的东西包括：

- 实际的自驾轨迹；
- 关键景点的标记；

限于篇幅，放到[下篇](/2023/11/build-a-map-to-record-part-2/)来记录。