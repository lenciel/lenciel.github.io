---
layout: post
comments: true
description: "为了给娃讲数学，又掉了一次兔子洞..."
title: "添了点儿讲数学的装备"
date: 2024-07-18 09:56:38 +0800
categories: 
- rabbit-hole
- tool-i-use
- blog
- admin
---

自上次[手搓地图](https://lenciel.com/2023/11/build-a-map-to-record-part-1/){:target="_blank"}之后，这次因为要讲数学，开始研究有没有类似于 Python 下面的 Manim 库那样的东西，结果发现并没有。

那就再手搓呗，这次选了 [p5js](https://p5js.org/){:target="_blank"}，结果，结果是我大概理解了为什么没有一个类似于 Manim 这样的前端库了：

- 要让数学公式，各种控件字体以及 p5js（背后是 canvas）良好的协作在各种尺寸的屏幕上，是很难的；
- 其实哪怕是我不想引入 JQuery 的前提下要有一个像样的可以控制好样式和行为的 rangeslider 都很难，所以只能自己 fork 出来[改一个](https://github.com/lenciel/ion.rangeSlider)；
- 所以 Manim 的输出大部分时候都考虑直接走 ffmpeg 生成视频肯定也是仔细考虑过的;

但还是大概知道怎么搞点线面体了，可能写个几年，添砖加瓦，我也最后可以得到个完整的库，就来控制整个版面？这不就是 Knuth 当年的路吗...