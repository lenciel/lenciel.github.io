---
layout: post
title: "升级到Jekyll 4"
date: 2020-03-07 17:45:08 +0800
categories:

- tools-i-use
- jekyll

---

这个 Blog 的[模板](https://github.com/lenciel/jekyll-lenciel-theme)是我自己写的。

上一次比较大的[改写](/2017/03/migrating-from-octopress-to-jekyll/)是从扔掉 Octopress 。

单单是因为要写点东西当然犯不着这么折腾。这么做，主要是尝试跟上永远停不下来的前端[^0]。最近看了一下 [Gatsby](https://www.gatsbyjs.org/)，觉得非常值得一试。但在这之前，决定先升级到 [Jekyll 4](https://jekyllrb.com/news/2019/08/20/jekyll-4-0-0-released/) ，顺便做了一些性能优化[^1]：

### 字体

- 去掉了需要用户下载的自定义字体 PT Sans，优先使用用户平台上最优的黑体[^2]。
- 整体字体使用自适应计算大小，加上一些局部字体大小的调整。朋友你不来[和我一起玩](https://github.com/lenciel/jekyll-lenciel-theme/blob/master/sass/custom/_resfont.scss)怎么可能相信人类可以写出下面这样的 CSS 属性：

```CSS
font-size: calc(#{$min-font-size} + #{strip-unit($max-font-size - $min-font-size)} * ((100vw - #{$min-vw}) / #{strip-unit($max-vw - $min-vw)}));
```

### 图片

- 使用了 [jekyll_picture_tag](https://github.com/rbuchberger/jekyll_picture_tag) 来完成自适应图片的生成（相比之下 [jekyll-responsive-image](https://github.com/wildlyinaccurate/jekyll-responsive-image) 的自定义功能很弱，不能和我自己写的插件很好的合作）。
- 使用七牛的免费 CDN 作为图床[^3]。
- 写了一个小的 mixin 来让 `serve` 命令方便的自动选择是用七牛的图片还是本地图片。
- 写了一个 python 脚本来进行本地增量的静态文件上传。
- 支持了 [lazyLoad](https://github.com/verlok/lazyload)。

### CSS

- 在模板生成过程中更好的 uncss 去掉冗余。
- 去掉了大量影响性能的设置。
- 修改了 `table` 相关设置让表格可以见人。

现在这个 Blog访问起来应该是又快了超过1秒了。

[^0]: 收益还不止是这些，比如学会怎么跟各种开源库保持同步等等。
[^1]: 这些顺便的部分花得时间比升级多得多。
[^2]: 知乎上的这个讨论让我学习了很多。
[^3]: 七牛的对象存储本身跟大厂比并不差，就是后台和 API 设计，差了不少。但是我发现我在七牛有一笔9年前的充值所以…