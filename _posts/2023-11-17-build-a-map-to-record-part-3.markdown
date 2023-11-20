---
layout: post
comments: true
description: "周末了，接着上一篇，继续画地图..."
title: "打造一张自驾地图（3）"
date: 2023-11-17 20:31:37 +0800
categories: 
categories: 

- rabbit-hole
- maps
- GIS

---

> 周末了，接着[上一篇](/2023/11/build-a-map-to-record-part-2/)，继续画地图...

剩下的主要是一些偏标记的工作，基本上都是把某个经纬度转换到坐标，然后绘制相应的文字或者图例，但里面也有一些可以讨巧的地方。

<h3>目录</h3>

- TOC
{:toc}

### 区域和地名

查看下载的区域信息的 GeoJSON，可以看到每个 feature 下面的 `properties` 数组里， `name` 字段就是此区域的地名。那么，在图上的什么位置来画这个地名呢？

有两种方案，一个是通过每个 feature 下面的 `coordinates` 数组里的经纬度数据，算一个区域内合适显示的点，然后用投影函数得到坐标值，类似[这里的方法](https://stackoverflow.com/questions/37778561/inexplicable-inability-to-render-city-name-labels-on-a-d3-js-map-out-of-scope-n)。

还有一个办法是使用 D3 提供的求质心的函数：

```javascript

let geoGenerator = d3.geoPath().pointRadius(5).projection(projection);

geoData.features.forEach((feature) => {
	let centroid = geoGenerator.centroid(feature);
	...
}); //forEach
```

和前面的 `drawMap` 类似，这里封装了一个 `drawLabels` 函数，暴露各种跟样式相关的参数：

```javascript

// draw labels for main area distincts
drawLabels(geoData[0], {
    projection: geoProjectionLS,
    fontSize: "12px",
    strokeWidth: 0.2,
    stroke: "#4e5256",
    nameRectId: MAIN_MAP_ID + "-names",
});
```

得到的结果如下：

 {% picture /downloads/images/2023_11/how_to_map_8.png --alt how_to_map_8.png %}

<small>图 1. 绘制需要行政区域名称</small>

可以看到，一方面需要进行剪裁，一方面有一些靠得太近的行政区域需要在质心基础上进行一些偏移以便显示得更加美观。调整之后得到：

 {% picture /downloads/images/2023_11/how_to_map_9.png --alt how_to_map_9.png %}

<small>图 2.调整后的行政区域名称</small>

### 添加水体和山峰名称

#### 水体名称

OSM 的标准下，有各种水体，包括河流和湖泊{% sidenote 'sn-id-1' '可以查看这个 [Wiki](https://wiki.openstreetmap.org/wiki/Map_features) 来获取查询 OSM 数据的具体键值。' %}。用跟前面类似的处理方式绘制，会得到下面的图片：

 {% picture /downloads/images/2023_11/how_to_map_10.png --alt how_to_map_10.png %}

<small>图 3.绘制水体名称</small>

这里有几个问题。一方面，因为每条河有很多支流，每个都是一个单独的 feature 对象，所以出现了很多次重复的名字；一方面，需要对显示在地图上的水体做一些筛选。

后面这个好办，新定义一个参数传 filter 进去过滤就行。

前面这个，可以先把传入的 FeatureCollection 以每个 feature 的名称 groupBy{% sidenote 'sn-id-2' ' [Object.groupBy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy) 新加入标准不久。' %} :

```javascript

let featuresGroupByName = Object.groupBy(
		geoData.features,
		({ properties }) => properties.name
);

```

然后针对每条河做文章：

```javascript
for (const [key, value] of Object.entries(featuresGroupByName)) {
    ...
    value.sort((a, b) =>
      a.geometry.coordinates[0][0][1] < b.geometry.coordinates[0][0][1]);
      let nameArray = name.split("");
      var r = value.length/nameArray.length;
      if (r > 1) {
        var i;
        for (i = 0; i < nameArray.length; i++) {
          let feature = value[i*r];
          let centroid = geoGenerator.centroid(feature);
          feature.x = centroid[0];
          feature.y = centroid[1];
          feature.rotate = rotate;
          feature.properties.name = nameArray[i];
        }
```

这里我干了几件事，来在一条河的所有 feature 里面取合理数量和位置的质心进行打点：

- 首先按每个 feature 第一个点 `dy` 的大小，其实就是纬度的高低，做一个排序；
- 然后看整个数组的长度是名字长度的多少整数倍，作为步长。比如，「金沙江」对应的 feature 有 33 个，那么步长就是 10；
- 以这个步长从 feature 数组里面切出跟字符长度相对应的 feature，比如「金沙江」就取第 1 个，第 11 个，第 21 个；然后把 feature 的名字从完整的「金沙江」，改成对应字符，「金」、「沙」、「江」；

另外，为了美观，加入一些旋转和字体上的变化：

```javascript
// 调用时传入旋转和字体样式
drawLabels(geoData[2], {
    projection: geoProjectionLS,
    fill: COLOR_WATER_LABEL,
    fontStyle: "Italic",
    rotate: 70,
...

// 实现
...
    .attr(
      "transform",
      (d) => `rotate(${d.rotate} ${d.x},${d.y}) translate(${d.x},${d.y})`
    )    
```

这么费劲其实就是想得到下面的效果：

{% picture /downloads/images/2023_11/how_to_map_11.png --alt how_to_map_11.png %}

<small>图 4. 调整后的水体</small>

#### 道路和山峰

用这个办法同样可以绘制道路和山峰。

需要注意的是，道路和河流一样，同一条路会有很多不同的 feature。另外，推荐用 `ref` 字段而不是 `name` 字段来进行 group。因为后面这个存的是每条路的国家码，比如 G5、S308、X77 等等。所以它其实提供了两个信息：这条路的代码以及这条路的级别（国道、省道、乡道等）。因此，理论上可以对不同级别的道路用不同样式去绘制，这里不再赘述。

### 关键景点的标记

当然可以直接去编辑图片加上这些标记，但用 SVG 绘制仍然是更好的选择：因为它是矢量，可以随便缩放，在作为海报打印的时候，不会模糊。

可以把感兴趣的地点编写一个 GeoJSON 文件来存储并喂给 D3：

```javascript
{
    "type": "FeatureCollection",
    "name": "poi",
    "crs": {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
    },
    "features": [
        {
            "type": "Feature",
            "properties": {
                "tourism ": "attraction",
                "name": "木里大寺"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    100.856196,
                    28.167853
                ]
            }
        },//一个 POI 点的声明
    ...
}
```

这里每个 feature 的声明是这样来定义的：
- properties 数组
	- name 就是想要显示的名称；
	- 另一个字段是跟据 [OSM features 标准](https://wiki.openstreetmap.org/wiki/Map_features)，声明为 `tourism` 这个 key 下面的某个分类，比如 attraction 表示景点，hotel 表示酒店等等；
- geometry 数组
	- type 是点(Point);
	- 经纬度通过通过[这个网页](https://api.map.baidu.com/lbsapi/getpoint/index.html)反查;

准备好数据之后把它交给 D3 绘制出来即可。

### 实际的自驾轨迹

现在有各种手段记录自己的 GPS 轨迹，手机、手表、行车记录仪...如前所述，唯一需要注意的是投影方式的对齐，然后生成一个 EPSG:4326 的GeoJSON 文件。

如果像我一样，在旅途开始的时候没有想过要记录，可以尝试从 baidu 地图或者高德地图的导航路线上拿到路径的经纬度打点，然后喂给 GeoPath：

{% picture /downloads/images/2023_11/how_to_map_12.png --alt how_to_map_12.png %}

<small>图5. 添加自驾轨迹</small>

### 比例尺等图例

最后，添加上一些图例。

比如比例尺，指南针，这些的 SVG 绘制比较简单。

稍微有一点复杂的是国旗，但好在，已经有很多[现成的实现](https://github.com/chirsz-ever/cn-flag)了，基本上只需要调位置和大小。

最后稍微调整一下颜色，得到最终的地图：

{% picture /downloads/images/2023_11/how_to_map_13.png --alt how_to_map_13.png %}

<small>图6. 添加说明和图例</small>

这个兔子洞还是有点深的。不过，今后要再生成一张类似的地图，就会很快了。


