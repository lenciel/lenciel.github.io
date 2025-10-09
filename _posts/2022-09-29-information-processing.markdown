---
layout: post
comments: true
description: "...我为什么觉得绣像本好呢？因为书应该越写越厚，然后越写越薄。好的书写，不是法律，法律负责追究意义，而好的书写应该是呈现，是逃避意义的..."
title: "信息获取、整理和检索"
date: 2022-09-29 21:08:04 +0800
categories: 

- xiaobao
- reading-list
---

之前有同学留言问：

> 可以给介绍一下你的搜索方法是什么吗？或者是讲讲你的信息检索的思路是怎么样的？

这篇就分两部分简单说说：一个是怎么搜索公开信息，来解决问题；一个是怎么获取、整理和形成自己的知识库，以方便检索。因为这里面涉及蛮多的工具和个人偏好，所以，有那么一两个地方对大家有点启发，就足够了。

**I）搜索公开信息**

**搜索，我用 Google，然后通常会搭配一些它支持的语法来缩小搜索的范围，尽快搜到高质量的结果**。

只要百度和 Google 都用过，就会对它们搜索质量上的差异很难忍受。当然，用 Google 你得有一个稳定的梯子。

然后，我常用的语法包括：

- 用引号来表示「完全匹配」（默认 Google 会用空格把关键字拆开加权重去找）
- 用减号去掉信噪比非常低的网站（比如百度百科、知乎、CSDN...）
- 用「site:」来指定某个网站（比如维基百科）
- 用「filetype:」来指定文件格式（比如 ppt、pdf 通常是严肃的产物）
- 用「before:YYYY-MM-DD」或者「after:YYYY-MM-DD」或者 both，来限定时间区域（比如 after:2019 来搜索最近两年的结果）

相比之下，星号用来通配等等语法，我用得不那么多。**如果想要探索更多 Google 支持的语法，其实可以看它的**[**文档**](https://support.google.com/websearch/answer/134479?hl=en){:target="_blank"}**。**

**II）检索个人资料库**

所有脑力工作者，都有自己的资料库。因此有很多整理资料的方法，历史挺悠久了。比如启发了 Roam、Obsidian 等工具的 Zettelkästen 笔记法，其实是 [Niklas Luhmann](https://zh.wikipedia.org/wiki/%E5%B0%BC%E5%85%8B%E6%8B%89%E6%96%AF%C2%B7%E5%8D%A2%E6%9B%BC){:target="_blank"} 在上世纪四十年代发明的。

只是，随着技术的发展，资料库的打造引入了越来越多的数字化的工具，从的 PIM（ Personal-Information-Management）发展到 PKM（Personal-Knowledge-Management）发展到现在挺火的所谓[第二大脑](https://www.buildingasecondbrain.com/){:target="_blank"}：计算机实在太适合干这个了。

**但，万变不离其宗，还是「获取-整理-检索」这么几个步骤。**

**1）获取**

出来卖报的时候其实[介绍过](/2022/03/start-a-newsletter/#%E5%86%85%E5%AE%B9){:target="_blank"}，我主要是通过跟人聊天，[看书](/2020/02/how-to-read-the-books-part-2/){:target="_blank"}和订阅的 RSS 来获取信息。所有基于推荐的信息流应用，无论文字语音视频，我都不用：feed 这个词就很吓人不是吗...

书，我买了不少实体和电子的，也在 [Zlibrary](https://book4you.org/){:target="_blank"} 等网站上找书看。电子书，都会放在自己编译的一个 [Calibre](https://calibre-ebook.com/){:target="_blank"} 版本里管理和阅读。

RSS 是从 Blog 时代攒过来的。看到觉得有点意思但还没有那么需要进一步消化的东西，我会用 pinboard 打个 tag（我的 [pinboard](https://pinboard.in/u:lenciel){:target="_blank"}，也支持 rss）。如果是觉得比较有用的，我会用保存下来精读：以前这 一步我用 [Evernote](/2014/12/how-i-use-evernote/){:target="_blank"}。但随着它们的产品越做越烂，我很担心它们倒闭，所以切到了 [Joplin](https://joplinapp.org/){:target="_blank"}，以 makrdown 的格式打上 tag 同步到 onedrive 存储。

读到这里你可能会觉得工具有点太多，这跟我的工作流有关系：我一般在干完大活奖励自己的时候，去看书或者看 RSS。因此这个阶段，一方面是看得会比较泛比较多（以 RSS 为例，我订阅的 source 每天会有 600-700 个的更新），另一方面脑子也没那么全神贯注（通常是晚上）。所以 Joplin 对我来说主要起到「摘录下来空了细看」的作用：大概每天只会摘那么三五篇，在第二天早上精读。

至于每天脑子里蹦出来的比较碎的想法，我会打上 tag 放到 [flomo](https://flomoapp.com/){:target="_blank"} 里面。

**2）整理**

定期，我会把 flomo、Joplin 等等地方记录的内容，进一步地整理和扩充。

这步我用 VSCode + [foam](https://foambubble.github.io/foam/){:target="_blank"}，因为：

1.  我自己经常也写代码，纯文本的，有版本控制（其实也就有了分布式存储），可以用上 VSCode 支持的各种搜索语法的笔记对我来说是最方便的；
2.  笔记本身，除开基础的 markdown 语法，只要对图片和双向链接支持得好，对我就足够了：而实际上 foam 提供的远不止这些。

另外，因为我自己用 Alfred 做 launcher，所以我在里面定义了一些快捷模板，来进一步增强。

所以，典型情况下，我开始一个 foam 里面正式的笔记：

- 先 'zid' 生成一个用 {date:yyyyMMdd}{time:HHmmss} 生成的 14 位的 ID 并复制；
- 然后 'zk' 会自动生成模板定义的笔记框架，并且把刚才复制的 ID 填进去；
- 笔记主体完成后：
    - metadata 里面的 tag 用来做分类
    - Links 里面是跟这个比较关联的笔记的入口
- 那个14位的 ID 因为开头是年月日，比较好在我做关联的时候用「 \[\[ 」来唤起
    

**3）检索**

从上面的动图前几帧你可以看到，我的整个资料库是用的 PARA（Projects-Areas-Resources-Archive）结构来组织的，它的介绍在这里：[link](https://fortelabs.com/blog/para/){:target="_blank"}。除此之外，我有在各个系统里面比较一致的一级和二级 tag 来帮我做比较快速的定位。最后，很显然，纯文本的笔记可以用包括正则在内的各种搜索。

以上就是全部内容。具体怎么打造一个适合自己的从信息获取、整理到检索的流程和资料库，是因人而异的，希望能够给大家一点点启发吧。
