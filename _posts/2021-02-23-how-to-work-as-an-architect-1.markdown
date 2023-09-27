---
layout: post
sidenote: false
comments: true
title: "如何干好架构师(1)"
date: 2021-02-23 10:01:07 +0800
categories:

- career
- architect
- tips

---

在很多技术团队里，「架构师」好像是一个「岗位」或者「职称」。

甚至有些地方把它作为职级：你从「初级工程师」干到「高级工程师」，再往上就是「架构师」了。

所以，在简历里经常可以看到某位同学在某个公司担任「架构师」或者「首席架构师」。

很多研发也就自然把「架构师」当成职业通道的下一站，花很多时间甚至报培训班，想要成为「架构师」。

从我过往的经验来看，这样的岗位或者职级设置通常带来的问题比收益多。

就连这个流量很小的 blog，也可以[在评论里](/2020/05/how-to-do-estimation/)里看到一些对架构师的吐槽。

本系列面向所有「架构师」或者希望成为「架构师」的同学，聊聊怎样干好这个似乎是「码农」的进阶，却又不太容易讨巧的角色。

第一篇我们争取先说清楚什么是我心里面的「架构师」。

<h3>目录</h3>

- TOC
{:toc}

「师」在中文里的意思很多。

「架构师」里的「师」是掌握某领域专门的技术或知识，可以作为其他人学习对象的人，和「医师」或者「巫师」的「师」类似。

因此，就跟要讲清楚如何成为「巫师」得先定义我们在说的「巫」是什么一样，我们得先定义「架构」，才能说清楚，「架构师」是什么。

## 什么是「架构」

不幸的是，对于「架构」的定义没有一个标准意见。大体上，我把它分成「学界定义」和「业界定义」两大分支。

### 学界定义

「学界」主要是指「计算机科学」里面有一个专门的分支「软件工程（Software Engineering）」。在它的定义里，主要强调「架构」要说清楚：

- 系统由哪些要素构成
- 这些构成要素之间的关系

比如你搜索「Software Architecture」，排名靠前的[维基百科的解释](https://en.wikipedia.org/w/index.php?title=Software_architecture&oldid=900802586)如下：

> Software architecture refers to the fundamental structures of a software system and the discipline of creating such structures and systems. Each structure comprises software elements, relations among them, and properties of both elements and relations.

这很明显是从《[Documenting Software Architectures: Views and Beyond](https://www.amazon.com/Documenting-Software-Architectures-Views-Beyond/dp/0321552687)》
里面摘抄的。这本书不那么好读，它的两位作者在另一本从名字看就好读多了的《[Software Architecture in Practice](https://www.amazon.com/Software-Architecture-Practice-3rd-Engineering/dp/0321815734)》里有一个类似的定义：

> The software architecture of a system is the set of structure needed to reason about the system, which comprises software elements, relations among them, and properties of both.

 如果你注意到这本书是属于一个叫 SEI Collections 的系列的话，就很容易发现，CMU 的 Software Engineering Institute（SEI）对这些软件工程领域的方法论和术语定义很用心。它们还有一个官方的「数字图书馆」，检索「架构」的定义[可以找到](https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=513807)一个和前面的定义非常类似，但是打了 IEEE 龙标的定义：

 > Architecture is the fundamental organization of a system embodied in its components, their relationships to each other, and to the environment, and the principles guiding its design and evolution. –IEEE 1471

学界的这些定义，最大的问题是，系统里组件怎么定义，它们之间的关系怎么形成，现实中其实并没有真正「工程化」的方法可以干好[^1]。

### 业界定义

业界进行实际生产作业的人，对「架构」的定义强调的是因为问题域的复杂多变，做了什么「决策」或者说「选择」。

比如，在我自己还很热衷于成为一个架构师，同时也是软件工程的各种方法论走红的年代，十八摸那本著名的《The Rational Unified Process: An Introduction》里，Kruchten 做了如下的定义：

> An architecture is the set of significant decisions about the organization of a software system, the selection of structural elements and their interfaces by which the system is composed, together with their behavior as specified in the collaborations among those elements, the composition of these elements into progressively larger subsystems, and the architectural style that guides this organization -- these elements and their interfaces, their collaborations, and their composition.

再比如 Jan Bosch 和 Anton Jansen 在[那篇著名的论文](https://ieeexplore.ieee.org/abstract/document/1620096/)里说的：

> We do not view a software architecture as a set of components and connectors, but rather as the composition of a set of architectural design decisions.

这种看法影响了很多人，比如 UML 它爹 Grady Booch 就说过：

> All architecture is design but not all design is architecture. Architecture represents the significant design decisions that shape a system, where significant is measured by cost of change.

既然「架构」是「决策」，那么「架构师」就是「做决策的人」。因此，这个定义被「架构师」们欢迎几乎是人性上无法避免的。

于是，在这些「架构师」定义的「架构」里，你几乎完全看不到跟系统实际功能或者模块有关的描述，主要是围绕一些系统的体系特征进行的设计：

- Availability
- Scalability
- Reliability
- Maintainability
- *bility

它导致的问题不仅仅在于公司里面开始出现「架构师」这样的职位，并且编码的同学把有朝一日成为「做决策」的人当成自己的奋斗目标。

更重要的是，很多不真正理解问题域也不参与编码的人，以「架构师」的特权进行各种各样的「决策」，迷恋「UML」或者「Design Pattern」这样的方法论，导致大量的资源浪费甚至是项目失败。

因此 Martin Fowler 在他那篇《[Who needs an architect](https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf)》里面引用 Ralph Johnson 的话有些嘲讽地说：

> Architecture is the decisions that you wish you could get right early in a project, but that you are not necessarily more likely to get them right than any other.

### 问题出在哪里

「架构」两个字，无论「学界定义」还是「业界定义」都带来了问题，为什么？

我觉得本质上是因为我们尝试「工程化」软件开发。

在其他的工程领域，我们依赖数学或者物理的理论体系，构建领域内的理论体系。

软件世界比数理世界要「软」。

一方面，我们的问题域在不断的变化，你今天觉得地球上有 50 万人拍视频，明年就 5 个亿了。

所以我们面对的其实是一个动态平衡的系统: 在任何给定的时间点它可能处于一个平衡状态，但长期看，它只会不断演进，前往下一个不平衡的状态。

另一方面，我们打算拿来构建理论体系所依赖的「公理」，在不断地，快速地失效[^2]。

许多关于软件架构的书籍都是在一个与当今世界几乎完全不同的时代写成的。新的实践、工具、度量方法、模式和大量其他变化在时时刻刻发生。我们必须根据改进的工程实践、操作系统生态、软件开发过程等等，去不断地质疑「基本公理」。

作为一个软件开发人员，和其他工匠一样，很容易迷恋某种特定的，自己熟悉的技术或方法，然后因为手里拿着这把锤子，看什么都是个钉子。

合格的架构师，必须清醒地理解现实世界在变，软件技术也在变，因此几乎没有任何方便的，拿来就用的，非错即对的二元选择：**要把软件开发看成一个对需要解决的问题和解决的技术进行学习的过程，把架构和代码都当成这个过程的副产品**。

## 那究竟什么是「架构」

我最喜欢的定义也来自 Ralph Johnson：

> In most successful software projects, the expert developers working on that project have a shared understanding of the system design. This shared understanding is called 'architecture' .

我喜欢这个定义的地方是：

1. 它强调了「架构」是为了体现大家的「共同理解」而不是体现某个智者的「决策」；
2. 它暗示了不用说大家也可以共同理解的东西，就没有必要写到「架构」里；
3. 它还暗示了「架构师」的职责是和所有涉众沟通，让大家达成「共同理解」。

关于最后一点，**成功的「架构」不是「架构师」自己想好写出来的，而是跟所有涉众沟通之后形成的「共同理解」**，我觉得可以多说几句。

在每个公司里面，其实一般有四个话语体系：

- 宏观层面
- 设计层面
- 构建层面
- 商业化层面

架构师要做好「架构」，就涉及跟这四个层面的人做好沟通。

怎么理解？

软件开发常常被类比成建筑行业，「architecture」这个词就这么用起来的，所以我用做门来打个比方。

第一个层面主要是跟客户、公司管理层或者业务负责人聊的。你们聊的可能是「门是空间的联通」这样有些凡尔赛的话，哪怕到细节，也是柯布为什么老用大旋转门，Zumthor 在老年公寓里做的门柜结合多么厉害，Bienefeld 那些古典比例的现代门如何引领了潮流。

第二个层面，主要是你在跟平级部门，深化产品、交互、系统等各个层面的设计细节。你开始说这是一道「防盗门」还是一扇「厕所门」，为了防火又美观中庭要不要有一扇卷帘，Lindt 博物馆里怎么做出来那么干净的大堂，罗氏、诺华那些精致的技术解决方案。基本上，在这块儿你能聊什么样的天，决定了你的整体段位：如果你轻易就被产品、设计等其他部门的人聊得无话可说，可能你的段位就还没有到。

第三种是构建工艺层面的，主要是对部门内部的沟通了。你这门，是无框的，隐框的，全玻璃的，平移的，下沉的，还是啥样的？柯布在萨伏依里面的大平移玻璃门，密斯在图根哈特别墅搞的大下沉窗，关门器、气密条、折页五金件，你得一清二楚。基本上，你这部分的基本功既决定了和下面同学们配合的愉快程度，其实也决定了你上面两个层面能到什么高度。比如下沉窗为什么会出现在图根哈特这么一个古典内核的建筑里，比如英国建筑师如何系统性的通过开窗与欧洲建筑师慢慢做出区分，没有搞明白，你去聊上面的那些天，容易穿帮露怯。

第四种是商业落地层面的，主要是对项目经理的沟通了。比如门窗就用旭格的，霍曼的，还是双流陈家的。是买过来装，还是需要二次开发局部定制。这部分，虽然往往不是你直接去找货给钱，但是往往你得脑子里面有方案：同样的门，粗野怎么做，极简怎么做，高技怎么做，低技怎么做，有钱怎么做，没钱怎么做。

所以，什么是「架构」？

架构不是最后那张设计图纸，而是你，怎么打通各个话语体系——从想法到落地，从前期到后期，从学术到实践，得到最后这张图纸。

所以，什么是「架构师」？

就是前脚标准构造尺寸倒背如流，后脚又开始聊建筑史观，左手柯布密斯怎么流畅，右手防火门该咋画还咋画的，这个能用一张嘴聊四套语言最后让大家形成共识的人。

**因此，在我的团队，一直推行把「架构师」作为一个「角色」而不是一个岗位。**

## Summary

要说清楚「如何干好架构师」，我决定先说清楚我定义的「架构」是什么。这里主要说了三点：

1. 架构在学界的定义围绕「系统的构成部分和这些构成部分之间的关系」展开，这个定义的问题是没有什么实操的工程办法可以真正设计和定义好系统由什么构成，它们的关系应该是怎样；
2. 架构在业界的定义围绕「系统的构建过程中做了什么选择和决策」展开，这个定义的问题是让架构师往往无视问题域的不断演进和软件技术的不断发展，倚仗自己角色的权威，做出脱离实际的「决策」；
3. 我觉得，「架构」就是在和四个不同层面的人进行充分沟通后，形成的对系统关键部分的「共同理解」。它是一个快照，会随着时间的变化变化。因此，「架构师」就是推动沟通并记录结论的一个角色，不是一个「岗位」或者「职称」。只不过你要进行这样的沟通，往往需要足够的经验和影响力，而已。

[^1]: 这也是我自己对「软件工程」的态度比较那啥的原因。它一直希望将软件开发从一门手艺转变为一个工程学科，这意味着可以清晰定义，严格执行，不断优化的可重复的流程。 但虽然有了一些进展，整体来看，软件开发离一个「工程学科」还有很大差距。
[^2]: 一个很好的例子是容器技术带来的变化，它对软件的设计、开发、测试和部署的方方面面都带来了很多变化，有些变化是颠覆性的。