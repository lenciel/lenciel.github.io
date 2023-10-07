---
layout: post
comments: true
mathjax: true
description: "这次加上对「Side Note」和「Margin Note」的支持，是因为发现自己写东西越来越多使用到 Markdown 默认支持的脚注。但其实脚注不是一个很好的设计。我很仰慕的，跨了不知道多少学科的数据可视化泰斗 Edward Tufte 干脆就觉得它是个很糟的设计，所以在著名的 Tufte-CSS 里基本上只强调边注的使用..."
title: "支持 Side Note 和 Margin Note"
date: 2023-09-27 17:45:20 +0800
categories: 
- blog
- admin
- side-note
- margin-note
---

这个 Blog 有很多东西都是我自己弄的，甚至连模板也是[自己写的](https://github.com/lenciel/jekyll-lenciel-theme)。因为除开用于碎碎念之外，这个 Blog 的作用之一就是让我保持一点跟前端的联系。

所以一直有在[维护和更新](/categories/blog/)。

这次加上对「Side Note」和「Margin Note」的支持，是因为发现自己写东西越来越多使用到 Markdown 默认支持的[脚注](https://markdown.com.cn/extended-syntax/footnotes.html)。

但其实脚注或者尾注{% sidenote 'sn-id-0' 'Side Note 和 Margin Note 可以统称为「边注」，两者的区别基本上只在于有没有编号。而脚注/尾注则分别叫 Foot Note 和 End Note，它们的区别详见[这里](https://en.wikipedia.org/wiki/Note_(typography))的解释。' %}不是一个很好的设计。我很仰慕的，跨了不知道多少学科的数据可视化泰斗 [Edward Tufte](https://en.wikipedia.org/wiki/Edward_Tufte) 干脆就觉得它是个很糟的设计，所以他自己的书里面大量使用了边注{% sidenote 'sn-id-1' ' 他还维护了一个 [Tufte-CSS](https://edwardtufte.github.io/tufte-css/) 项目，提供使用 Edward Tufte 的书籍和讲义所展示的想法来设计 Web 文章样式的工具。里面也专门[强调了边注](https://edwardtufte.github.io/tufte-css/#sidenotes)的使用。' %}：

![side_note_sample_3](/downloads/images/2023_09/side_note_sample_3.png --alt Don't touch me...)
\
我觉得他嫌弃得很有道理。

首先，脚注/尾注和边注都来自实体书。但谁读实体书的时候会去翻脚注/尾注呢？可能最勤奋的那些人是这么干的，反正我基本没读过。

在电脑或者 Kindle 上看电子书或者文档时，因为脚注/尾注通常有便捷的跳转方式，提高了我使用它的频率。但仍然有两个问题，使得它比不上边注带来的舒适度：

- 在看文章/文档的时候需要不停地跳来跳去其实是一个挺烦人的体验；
- 随着屏幕越来越大，文档大部分时候都会在屏幕中间，两边有大量的空白其实没有被使用；

哪些东西会在「注」里面？可能是参考材料，可能是拓展内容，甚至可能是作者当时脑子里冒出的俏皮话。这些本身都是对原文很好的补充，但是如果需要不断地在文本中来回移动，那么很可能：

- 它们没有被真正读过；
- 它们还带来了对原文的干扰；

所以另外一位同样我很仰慕，跨了很多科的 [Robert Bringhurst](https://en.wikipedia.org/wiki/Robert_Bringhurst) 在他著名的《[字体排版精要](https://book.douban.com/subject/1466932/)》中，花了蛮多篇幅分析各种「注」的优缺点，然后推荐了边注，并且在书里实实在在地用了很多：

![side_note_sample_1](/downloads/images/2023_09/side_note_sample_1.png --alt Don't touch me...)\
不需要我介绍的 Knuth 则是 Margin Note 的爱好者。所以 $$\LaTeX$$ 对它们的支持很好，他自己在《[具体数学](https://book.douban.com/subject/21323941/)》和 TAOCP 系列里都用了很多：

![side_note_sample_4](/downloads/images/2023_09/side_note_sample_4.webp --alt Don't touch me...)\
所以，我也就给自己加上了。

看起来，边注无非是正文旁边的一些文字片段，似乎很好实现。但是设计上必须考虑的地方包括：

- 放在哪边，是否需要点击什么才会出现，是否可以折叠？
- 是否使用 Javascript，如果用了怎么处理错误？
- 在移动设备上如何显示{% sidenote 'sn-id-2' '目前这个 Blog 使用 [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) 在移动端动态调整样式，连边框都没有，更别说边注了' %}？

还有一些更小的需要想的地方：

- 比如如果比较密集或者边注内容较多，如何处理重叠？
- 如何对现有的没有边注的文档隐藏边注栏全屏显示？

最终决定不使用 Javascript，基于 Tufte-CSS 完成了主体框架，显示在右侧边栏。

在电脑上显示的时候，是标准的边注形式，有编号且尽可能对齐：

![side_note_sample_2](/downloads/images/2023_09/side_note_sample_2.png --alt Don't touch me...)\
在手机上显示的时候，结合 `media query` 和 `container query` 把样式和计数改掉，变成一个可以被点击用来控制「显示」和「隐藏」状态的灯泡：

![side_note_sample_5](/downloads/images/2023_09/side_note_sample_5.jpeg --alt Don't touch me...)\
目前还没有精力去各种设备上测试，我自己能够用上的设备运行得好像还行。所以各位朋友可以帮忙测试一下{% sidenote 'sn-id-3' '反正你现在就能看到它' %}，如果有问题请给我留言或者邮件，谢谢😄~
