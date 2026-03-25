---
layout: post
comments: true
description: "先说结论，在 AI 消灭人类之前，不会消灭程序员。但 AI 绝对可以解放和发展现有的生产力。 就个体而言：不去动手研究 AI 的管理者特别是技术管理者是不合格的；不去掌握和应用 AI 的程序员也是不合格的；就公司而言：仅仅用 AI 降低成本的，会被真正用 AI 拓展能力的打垮；应该优先考虑清楚 AI 层面的交互然后再构建其他的交互。"
title: "AI 究竟能不能替代程序员? (1)"
date: 2025-06-08 14:21:02 +0800
categories: 
- AI
- programming
- rants
---

最近在董事会汇报，进入「any questions？」环节，一位董事问：「我们现在还有这么多研发，是不是可以考虑用 AI 替换？我现在投的好几个公司自从用 Cursor 之后，效率都提高了 30% 到 40%{% sidenote 'sn-id-0' '我没有和他争论他是不是被骗了，是不是我更加成熟了？' %}。」

这是一个我这两年被反复问过的问题：在美帝的设计师朋友问过我，是不是现在有个点子就能用 AI 写代码创业；在基金里的同学问过我，是不是 Cursor 这类产品产出会超过程序员；当然，最多的还是类似于董事会上这种场景，公司究竟能不能通过这些技术，替代那些昂贵的程序员。

受限于讨论这个问题的时间、场合和提问人的知识背景，我应该给了虽然意思相对统一，但都不太完整的答案。而且，三年前系统对[类似问题](/2022/09/what-could-happen-after-ism/){:target="_blank"}的观点现在确实有更新，所以不如再整理一次。


<h3>目录</h3>

- TOC
{:toc}

### 先说结论

我认为：

1. 在 AI 消灭人类之前，不会消灭程序员；
2. 但 AI 绝对可以解放和发展现有的生产力；
3. 就个体而言：\
	a. 不去动手研究 AI 的管理者特别是技术管理者是不合格的；\
	b. 不去掌握和应用 AI 的程序员也是不合格的；
4. 就公司而言:\
	a. 仅仅用 AI 降低成本的，会被真正用 AI 拓展能力的打垮；\
	b. 应该优先考虑清楚 AI 层面的交互然后再构建其他的交互；

### 为什么消灭不了程序员

程序员的工作如果粗略分成编码和非编码两部分，我们来看看究竟 AI 能替代里面的哪些。

####  非编码工作

不同层级的工程师花在非编码工作的时间是不同的。但即便是最基层的自称「码农」的工程师，编码在整个工作中的占比不会超过 50%。还会有大量的时间用于沟通评审（需求、测试用例、交互设计）、文档写作、环境配置等工作（摸鱼这些非工作的我就不提了）。

这些工作需要很多上下文对齐，就像 Mozilla 的 Senior Staff [Chelsea Troy](https://chelseatroy.com/about/){:target="_blank"} 在一个反驳[这篇](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4945566){:target="_blank"}号称 AI 对编程提效 26%的论文时[说的那样](https://www.youtube.com/watch?v=bg4z70cOOF4){:target="_blank"}：

> Large language models have not wholesale wiped out programming jobs so much as they have called us to a more advanced, more contextually aware, and more communally oriented skill set that we frankly were already being called to anyway…. On relatively simple problems, we can get away with outsourcing some of our judgment. As the problems become more complicated, we can’t.

#### 编码工作

只要真正用过 Cursor、Windsurf 或类似产品，就得承认它们比大部分没写过十万行代码的程序员，都写得更快更好。

**这很像人类对化纤材料或者转基因技术的使用一样：虽然没有办法提高上限，但绝对大大提高了下限。**

不过，编码工作会被 AI 取代吗？

我仍然持怀疑态度。

倒并不是说有些代码的生产就会像羊绒一样永远雍容华贵，而是没有真正干过程序员的人没理解，整个编码工作如果往细了拆，仍然可以分解成写代码、读代码和调代码等部分，并且对象可以是自己的代码，但更可能是别人的代码。

##### 和已有代码交互

除开一些创业项目或者自己练手的 solo 项目，大部分公司里的编码工作都是所谓的「屎山雕花」：阅读调试修改其他人代码的时间远远超过自己写代码。

这部分工作，不仅时间上占比更高，难度也比自己撸高。《K&R C》和 AWK 的作者，Kernighan 在《The Elements of Programming Style》里说过一句我印象很深的话，它如此有名以至于被称为 Kernighan 定律{% sidenote 'sn-id-1' '这段话也一直很有争议：拥护者认为就应该尽量避免写那些「聪明」而难以理解和维护的代码，也就是 KISS 原则；而反对者认为开发的时候就应该挑战自己技术的极限，毕竟心流难得。' %}：

> Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.

消化一个代码库的架构和细节，搞清楚别人代码的逻辑和实现，「认知负担」确实挺高的。这些工作可以在 AI 的辅助下加速，但是很难被 AI 替代。

##### 自己新写的代码

自己写代码的时候借助 AI 生成和辅助，现在好像被叫做「vibe coding」{% sidenote 'sn-id-2' '我不知道有没有 vibe debugging 之类的。' %}。

这部分完全交给 AI 行不行？我看不行，理由如下。

###### 什么是「代码」

代码是资产还是负债？

差不多十年前，Kellan 在那篇可能是历史上关于「技术债」最精彩的[文章](https://kellanem.com/notes/towards-an-understanding-of-technical-debt){:target="_blank"}中指出，它既不是资产也不是债务，而是 liability：一个项目里的每一行代码，无论来自人还是 AI，都只代表了对待解决问题当前的最佳理解，都需要被测试、维护、确保安全。

并且如果你同意我[说的](/2021/02/how-to-work-as-an-architect-1/#%E9%97%AE%E9%A2%98%E5%87%BA%E5%9C%A8%E5%93%AA%E9%87%8C){:target="_blank"}：

> 要把软件开发看成一个对需要解决的问题和解决的技术进行学习的过程，把架构和代码都当成这个过程的副产品

那么，AI 使编写代码变得更快、更便宜，实际上只会以前所未有的速度创造技术债。因此可以看到，行业里管着一定规模的系统，需要长期维护和迭代的人，对 AI 编程会有一些声音：

- 比如 Gergely Orosz 认为，《人月神话》等书籍中描述的问题仍然存在，AI 无法改变它们；
- 比如 Camille Fournier 说，自己的公司一直很纠结要不要从初级程序员手里收回 AI 工具（我跟阿里、字节的一些管理者聊天也听到过类似的想法），因为这些同学如果没有通过自己编码形成的分析思考能力很难成长；
- 哪怕是走得非常前沿的推行 AI 编程的 Harper Reed 也说，他在回归瀑布模型，也就是在交给 AI 之前花大量的时间梳理需求文档、交互设计和测试用例，然后把这些内容以专门优化过的 propmt 给到 AI。

因此，我认为从长期看，完全让 AI 来写代码在大型项目里还是很难发生。 

###### 用自然语言也是「编程」

前几年，在 NoCode 或者 LowCode 或者 RPA 还很火的时候，我跟一些朋友开玩笑说，如果无代码或者低代码那套拖拉拽的东西就能完整解决问题，那它本质上就是图灵完备的，于是，它仍然是一门程序语言：你只是在用拖拉拽的方式 coding，谈不上 NoCode。

同理，如果像 Harper Reed 那样，用一个完整的瀑布流来给 AI 输入，然后不断调整、测试、上线...我认为他也在编码，只是用自然语言而已。

编程的两个核心，逻辑的梳理和数据的治理，被拆成过各种概念，运用了各种工具，万变不离其宗。

###### 可能会带来更多的「程序员」

最后，你读到这里可能会认为我很反对 AI 辅助编程（或者，我认为更合适的名称应该是 AI 辅助代码/文档/测试用例...生成），那请你相信我[前面的结论](/2025/06/the-cycle-of-replacing-developers/#%E5%85%88%E8%AF%B4%E7%BB%93%E8%AE%BA){:target="_blank"}。

只是，我不认为会替代程序员，而是更多的人，可能成为「程序员」。

因为历史上，从给纸片打孔至今，每一次计算机编程方面的进步，都在不断降低成为一名程序员的认知负担，都曾经引起过「这是不是可以取代程序员」的妄念或者是担忧，最终，都带来了更多的程序员。

我还记得我刚入行的时候，IBM 等公司正在推通过 UML{% sidenote 'sn-id-3' '现在的小朋友还知道什么是 UML 吗？' %}图生成代码取代程序员。

相信了的公司和个人都很惨。

后来是云计算，号称取代运维工程师。

还有自动化测试工具，号称取代测试工程师。

最后，运维升级为 DevOps，测试左移，大家只是变得更加「程序员」了而已。

这有点像 CNC 机器，它的出现只会让更多人成为木匠，而那些好的木匠成为很好的木匠，而不是消灭木匠。

那么，站在管理者和从业者角度，究竟应该在 AI 工具运用上怎么办？我们下次继续...