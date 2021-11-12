---
layout: post
title: "Quartz Composer和Origami试玩"
date: 2014-06-26 22:57:05 +0800
comments: true
categories:
- tools-i-use
- prototyping
- design
---

这篇不是教程，不会讲述怎么安装需要的软件，怎么用它们来做软件原型。只是记录分享一下我对这套东西的感受和评价。

动态设计，也就是[Motion Design](http://v.youku.com/v_show/id_XMzIyNTk1NTMy.html)或者是[Motion Graphic Design](http://en.wikipedia.org/wiki/Motion_graphic_design)其实已经火了很长一段时间了：你只要经常去 Dribble 上逛就可以看到很多非常优秀的作品。国内的团队经过一段时间的学习和追赶，目前这方面的水平也很不错：从去年开始，BAT 的大多数 App 的 splash 或者 tutorial 都已经不再是静态的图片而是动态图了。

当然，除开看起来更加狂炫帅富屌的 splash、tutorial，本座看重动态设计的原因其实是它在原型阶段的作用：如果 UX 的团队会制作动态图，就能展示软件实际的操作流程，效果比传统的需要脑补的静态 Wireframe 要好太多。

不过从本座开始关注这种设计方法到现在，主流的动态设计流程一直是先在 PS 里面做静态资源，然后在 AE 里面导入静态资源做动画，最后生成 mp4 格式视频，然后配合 QuickTime 或者别的什么软件生成 gif（比较详细的描述可以看看[这篇文章](http://www.uisdc.com/the-internet-motion-graphic))。

这种方式对本座来说上手就略显太重，换句话说，不是财大气粗的 BAT，需要考虑：

1. PS+AE 很贵
2. 会这两个东西的 UX 人才很贵

接下来事情似乎有了转机：[Quartz Composer](http://quartzcomposer.com/)和[Origami](http://facebook.github.io/origami/)的组合自从 Facebook 的 Paper 推出之后在网络上被风风火火的讨论了一把，然后不久[Facebook就开源了后者](http://www.fastcodesign.com/3025932/facebook-develops-a-photoshop-for-interaction-design-and-its-free-for-anyone-to-use)。

在有 Origami 之前，本座就看 Facebook 的设计主管说他们内部用 QC 做原型设计就去学习了一下，结果感觉实在是云里雾里。这次又了 Origami 之后，经过几个小时的试玩，我得到的感受如下。

首先，这套免费的工具非常给力：除开不要钱，不难用之外，给力主要是因为 QC 的 patch 设计带来的高度可重用性：其实 Origami 从根本上来说就是一堆 patch 而已。

其次，这套工具也称不上「photoshop for interaction design」。你仍然需要使用 PS（或者 Sketch 等等做图的软件）做上游，把静态资源做好，然后导入到 QC 里面完成动态效果。这种"设计-切图-导入-动态化"的模式其实还蛮像一度风靡网络的 flash 的制作流程。

最后，如果你是程序员，习惯了写 CSS/JS 来控制界面，要适应 QC 的图形化编程（类似 VB 那样先选控件再改属性然后绑事件）还是蛮蛋疼的。比如它里面的设定偏移量来定位元素的方式，就让本座觉得用起来非常虐心。

<video playsInline autoplay loop muted>
    <source src="{{ site.static_base }}/downloads/images/2014_06/qc_yx_intro.mp4" type="video/mp4">
    <p>Your browser doesn't support this embedded video.</p>
</video>

<video playsInline autoplay loop muted>
    <source src="{{ site.static_base }}/downloads/images/2014_06/qc_yx_bd.mp4" type="video/mp4">
    <p>Your browser doesn't support this embedded video.</p>
</video>
