---
layout: post
title: "Butterick的实用字体设计"
date: 2013-08-26 11:11
comments: true
categories: 
- typography
- design
- web
---

最近和一个朋友聊天，他说最近几年大概是Flat流行网页上除开字就没别的了，字体设计被各种强调。

这位老大在上海经营自己的网页设计公司，但是大家够熟，本座就冒着班门弄斧的危险纠正了他一嘴：很多年前，[Oliver Reichenstein](http://www.theverge.com/2012/7/24/3177332/ia-oliver-reichenstein-writer-interview-good-design-is-invisible)就说过"[Web设计95%是字体设计](http://ia.net/blog/the-web-is-all-about-typography-period/)"了。而且这种观点还一直被[反复强调](http://www.smashingmagazine.com/2012/07/24/one-more-time-typography-is-the-foundation-of-web-design/)。

当然，设计师的世界里面可能这些都没有问题。但是现实是，设计师设计的Web只是Web中的%0.5，世界上还有大量的网页是被朋友这种小公司，甚至是程序员们自己设计出来的。而且，网页上可选的中文字体先天可选项就很少，所以字体设计或者说`Typography`虽然如此重要，其实主要是靠下面两个途径解决的：

- 研究开源的template
- 看淘宝、百度这些大站的设定

但是借鉴得再多，不花时间总结，还是难成系统。最近看到一本Butterick的[好书](http://practicaltypography.com/typography-in-ten-minutes.html)，对字体设计的原则做了一番高度归纳，并且声称：

{% blockquote %}
this is a bold claim, but i stand be­hind it: if you learn and fol­low these five ty­pog­ra­phy rules, you will be a bet­ter ty­pog­ra­ph­er than 95% of pro­fes­sion­al writ­ers and 70% of pro­fes­sion­al de­sign­ers. (The rest of this book will raise you to the 99th per­centile in both categories.)
{% endblockquote %}

归纳出来的原则共有5条：

* 文档的字体设计主要取决于你`body`部分的设计。所以在任何一个项目里面，先把`body`部分弄好看了再花时间去看别的地方。

   而`body`部分好看与否，主要取决于下面的四个方面：

* `point size`是指字体的大小。在印刷品中，最舒适的是10–12个point，而网页上则是15–25个pixels。不是每个font在指定的`point size`下大小都是一致的，所以有的适合需要对究竟用多大进行调整。

* `line spacing`是垂直方向上行间距。它的合理取值是字体的`point size`的120–145%。在文字处理器中不要用比值定行距，因为单行距太窄，1½又太松了。­在网页上用CSS的`line-height`来控制.

* `line length`是水平方向上文字块的宽度，它的合理取值是­­平均每行45–90个字，为了方便你可以用小写字母表来占位，一般来说2-3个排列是合适的：

   ```
   abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd
   ```

   在印刷品中，这一般意味着page的margin比传统的1个inch宽。
   在网页上，这主要是控制text block不要在页面上溢出。

* 最后是字体的选择。可能对一般设计者最简单高效的方法是停止使用系统自带的那些免费字体，购买专业字体设计公司的作品：这些专业的字体设计优良，而且通常也不贵。

  即使你不愿意付费，试试在免费字体里面找找看，比如Google提供的字体。实在不行，至少不要用Times New Roman或者Arial了：这是懒惰的人才会不假思索考虑的字体。

很有兴趣知道，中文设计圈子里面有没有类似的准则被归纳出来，毕竟12px宋体一统江湖这么多年了。简单Google之后看起来是没有什么变化的：

 - [网页常用字体有哪些 - 知乎](http://www.zhihu.com/question/19680724)
 - [中文的网页用什么字体最合适 - 知乎](http://www.zhihu.com/question/20404847)
