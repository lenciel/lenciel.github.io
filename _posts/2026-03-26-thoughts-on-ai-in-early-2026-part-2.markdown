---
layout: post
comments: true
description: "...其实，为了一碟醋每天狂包饺子的是也不在少数，但也有很多公司在项目里取得了实实在在的进展..."
title: "Thoughts On AI In Early 2026 (2)"
date: 2026-03-26 22:30:57 +0800
categories: 
- AI
- rants
- programming
---

[上篇](/2026/03/my-thoughts-on-ai-in-early-2026-part-1/){:target="_blank"}{:target="_blank"}{:target="_blank"}有同学留言问，怎么看待初级程序员的未来。

所以这篇写写这方面的想法。

<h3>目录</h3>

- TOC
{:toc}

### 行业趋势

AI 接下来会发展成啥样，大家都在开盲盒。

看到那个问题时，我脑海里浮现的是朴赞郁的《[无可奈何](https://movie.douban.com/subject/4092781/){:target="_blank"}{:target="_blank"}{:target="_blank"}》。

这部电影改编自 [Donald E. Westlake](http://www.donaldwestlake.com/){:target="_blank"}{:target="_blank"} 1997 年的黑色小说《AX》{% sidenote 'sn-id-1' '2025 年就被改成过一部不错的电影《[职场杀手](https://movie.douban.com/subject/1427862/){:target="_blank"}{:target="_blank"}{:target="_blank"}》。' %}，以造纸厂主管在技术革新被裁后，急转直下的人生作为主线。

Westlake 在回想创作动机时说，与他的父母在大萧条中被裁时大家的团结互助不同，当时「经济繁荣，失业率下降，股市飙升，很多人却被残忍地裁掉了」。 

那么程序员会是下一批造纸厂工人吗？我觉得不妨看看软件行业一些众所周知的定律在 AI 的冲击下是否还成立，来检验一下是否范式已经转换。

#### 人月神话

《人月神话》里有两个核心论点，一个是 **[Brooks 法则](https://cactus-proj.github.io/The-Mythical-Man-Month-zh/ch2.html){:target="_blank"}**：

> Adding manpower to a late software project makes it later.

它被通俗化成一个经常被技术负责人在跟老板、客户沟通项目预期时使用的类比：

> 十个姑娘一起努力，还是需要十个月才能生出一个小孩儿。

另外一个就是「**[No Silver Bullet](https://cactus-proj.github.io/The-Mythical-Man-Month-zh/ch16.html){:target="_blank"}**」：

> There is no single development, in either technology or management technique, which by itself promises even one order-of-magnitude improvement within a decade in productivity, in reliability, in simplicity.

AI 在一定程度上改观了软件开发的这些问题吗？是的。

因为软件开发里很多问题本质是解决复杂度。

加人短期内只会拖累项目，因为沟通是复杂的，每个人都有自己的想法、动机、情绪。两个 P8 带两个 P7 十来个 P6 干活，要做的很多沟通在 AI 的协同中是不需要的。

其次，问题和上下文还有复杂度。P7 需要花很多时间纠正 P6 的编码习惯，P6 对业务的洞见也需要传导机制才能让 P8 收到。这些 AI 也可以做得更好，因为出厂设置都不低，也很容易用一个规范去做沟通和产出。

但，这些限制被推翻了吗？

没有。Wes McKinney 有篇《[The Mythical Agent-Month](https://wesmckinney.com/blog/mythical-agent-month/){:target="_blank"}》很好的阐述了为什么没有。

我想核心是，敲打键盘的速度从来不是编写软件的核心瓶颈（不然人月神话应该不成立）。核心瓶颈从来都是究竟该做什么功能，究竟该做成什么样等等。

所以很长时间内，有这些判断力的程序员应该都还在岗。

#### 克尼根法则

这条经典法则核心是说编码应该更关注可维护性和可读性而不是有多精巧：

> Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.

Sussman 在传世经典《[SICP](https://dspace.mit.edu/handle/1721.1/6941){:target="_blank"}》里也说过：

> Programs must be written for people to read, and only incidentally for machines to execute.

很多人认为 AI 产生大量的代码，带来海量的[认知债务](https://addyosmani.com/blog/comprehension-debt/){:target="_blank"}，根本谈不上可读性{% sidenote 'sn-id-2' '因为 AI 的产出量太大，自己的 agent 写的都读不过来，还别说去读其他人提交的。' %}，大大降低了可维护性。

这点当前肯定是成立的，但我不确定会不会一直如此。

NVIDIA 把自己的[新产品](https://www.nvidia.com/en-us/data-center/grace-hopper-superchip/){:target="_blank"}用 [Grace Hopper](https://en.wikipedia.org/wiki/Grace_Hopper){:target="_blank"} 命名是有很深寓意的：作为人类第一个编译器的作者，她当时的目标就是从自然语言生成机器码。

我们看代码的时候，其实得做两个方面的检查：一部分跟编译器类似，看编码本身是否存在问题；一部分是从产品文档、接口规范等等需求角度，看是否相应功能得到了正确实现。

后面这部分本来就是自然语言的。而整个行业花了几十年时间推出的各种编程语言，我和大部分程序员掌握的手艺中很大的一部分，主要是前面这部分：但它确实只是个中间产物。

这部分机器可能确实比人类要强，特别是如果它使用一些更容易进行[形式化验证](https://en.wikipedia.org/wiki/Formal_verification){:target="_blank"}的语言，也许会大大改变这些法则。

#### Brain Fry & Slow Down

Brain Fry 的抱怨火热了几天之后，Mario Zechner 的《[Slowing the fuck down](https://mariozechner.at/posts/2026-03-25-thoughts-on-slowing-the-fuck-down/){:target="_blank"}》又成了热帖。

确实，目前使用 AI 的很多人，说他们是为了一碟醋每天狂包饺子并不为过。

但也有很多公司在项目里取得了实实在在的进展。

我想，这里面最核心的区别在于，使用 AI 的团队有多理解问题。

理解问题，才能解决问题，这点永远不会变。

如果一个问题很重要，但是拿着 AI 去捣鼓它的人来围绕它进行假设和判断的能力都没有，那只是把很多的时间和 token 浪费在无谓的尝试上了。

AI 辅助带来的变化在于，如果下定决心想去了解事物运作的原理，学习和探索比之前变得容易很多。

所以，我仍然觉得，现在是初级程序员最好的年代。只要找到真正感兴趣的领域，学习精进，透彻理解，就能取得很好的成就。




