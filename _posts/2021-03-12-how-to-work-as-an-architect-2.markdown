---
layout: post
sidenote: false
comments: true
title: "如何干好架构师(2)"
date: 2021-03-12 05:32:50 +0800
categories:

- career
- architect
- tips

---

这是本系列的第二篇，在[前面的一篇](https://lenciel.com/2021/02/how-to-work-as-an-architect-1/)里说了，什么是架构师：它是团队中负责推动所有涉众进行沟通和讨论，形成对系统要素的决策，并将这些团队的「共同理解」记录、维护和不断迭代的一个角色，它不是一个「岗位」或者「职称」。

接下来基于这个定义，我来说说怎么做好这个角色。

因为架构师的主要工作是跟各个[不同层次的涉众](https://lenciel.com/2021/02/how-to-work-as-an-architect-1/#%E9%82%A3%E7%A9%B6%E7%AB%9F%E4%BB%80%E4%B9%88%E6%98%AF%E6%9E%B6%E6%9E%84)进行沟通和讨论，所以，我把它分为三方面的工作内容，这些工作内容都需要相应的能力支撑：

|      | 工作内容 | 基础能力                                   | 时间分配 |
| :--- | :------- | :----------------------------------------- | :------- |
| 1    | 内部工作 | 基本功、业务思考力、信息处理和输出能力     | 50%      |
| 2    | 内部沟通 | 领域知识、最佳实践、倾听和提问             | 25%      |
| 3    | 外部沟通 | 不同层次各自的沟通语言、收集和讲述用户故事 | 25%      |

注意，这里的时间分配是一个需要去认真遵循的行业最佳实践。不这么做，你就可能成为下面两类常见的让大家头疼的架构师：

1. 在内部工作上花时间太多的，是 Kruchten 说的 「goldplating」架构师。虽然产出的设计和实现可能是「镀金」般华丽，但是总赶不上需求的变化无法很好的服务用户；
2. 在外部沟通上花时间太多的，则很容易变成「咨询顾问」式的架构师。虽然业务方可能对你很满意，内部的架构其实可能并没有对齐，并且因为自己不干活，可能做出很多拍脑袋的决策坑害工程师。

下面就具体说说第一部分，内部工作，要做什么和怎么做。

<h3>目录</h3>

- TOC
{:toc}

## 架构师必须编码

架构师只是一个角色，意味着我们没有给他们行政上的管理权。我们这么设计是因为**一个群体做出决定时，大家最好平等地讨论，威权可能压制有价值的意见**。

但没有威权，可以有权威。换句话说，架构师必须通过影响力来工作。怎么形成影响力呢？

1933 年，[Draper Kauffman](https://en.wikipedia.org/wiki/Draper_Kauffman) 被海军拒绝，理由是他的视力不好。十年后，他训练了一支特种部队，成为[海豹突击队](https://en.wikipedia.org/wiki/United_States_Navy_SEALs)的前身。

这支特种部队的训练，包含一个极为艰苦被称为「过滤器」的第一周，用 Kauffman 的话说，「Hell Week separated the men from the boys」。

在《[the Culture Code](https://www.amazon.com/Culture-Code-Secrets-Highly-Successful/dp/0804176981/ref=sr_1_1?dchild=1&keywords=The+Culture+Code&qid=1615539572&sr=8-1)》这本书里面，有一段关于这一周的描述：

> "We were testing Kauffman all along," wrote Dan Dillon, a member of the first demolition class, "but my respect for him deepened because a lot of the officers will tell you what to do, but they won't do it themselves. This man asks for suggestions. If they're good, he uses them. And he participates in everything. The dirtiest, rottenest jobs that we tackle, he is in there doing as well as the rest of us. How could you not respect him?"

负责推动决策的领导者，只有跳进肮脏的战壕，和大家一起把手弄脏，大家才会关心和尊重他/她的决策。没有人看得上「[宇航员架构师](https://www.joelonsoftware.com/2001/04/21/dont-let-architecture-astronauts-scare-you/)」，但作为架构师会花很多时间在沟通上，所以参与编码工作需要考虑方式方法：

- 交付值得信赖的脚手架工程，在里面证明自己是值得信赖的同行，并且了解并落地了最佳实践；
- 参与代码审核、bug fix、构建发布等工作，展示自己的技术判断力和对什么是好的代码实现的标准；
- 不要承担大块代码逻辑的实现，如果有也要能被其他人维护，因为你可能变成团队的瓶颈。

## 架构师必须有业务思考力

Martin Fowler 和 Ian Cartwright 把「业务思考力」称为「[The Elephant in the Architecture](https://martinfowler.com/articles/value-architectural-attribute.html)」，这显然是搭桥了「The Elephant in the Zoom」这个隐喻：它非常重要却又被大家故意避而不谈。

这篇文章已经讲得足够好了，我自己一点额外的体会是，大家可能并不是避而不谈，而是有业务思考力确实挺难的。

**本质上，现在经营企业变得困难，最主要的原因就是内外部环境变化太快**。因此架构师需要不断刷新两个维度的思维：

- 对整个业务的市场体量，规模效应，产业链结构，频次、客单价、渠道等方面的宏观上的理解；
- 对实现细节、资源规划、节奏路径、最佳实践等各方面的落地手感；

这的确很难。所以，如果你暂时没有完备的业务思考力，我觉得可以实践一点点控制理论：**在规划系统的时候，一定要设计好业务层面的数据通道和数据埋点，先感知，后预测，小步快跑，随时调整**。

## 架构师必须处理并输出有效信息

架构师的职责里面，很重要的一个任务就是，记录、维护和不断迭代大家对系统关键决策的「共同理解」，所以，要能够产出高质量的文档。

如果说让我选「The Elephant in the Architecture」，我会选文档写作：一个其实很重要，但市面上最被忽视的技能。

大体上如何写好一个架构文档我已经[说过了](/2021/01/how-to-write-system-design-docs/)，行业里面还有一些其他的教程可以[参考](https://www.writethedocs.org/guide/index.html)。

但写好架构文档，最难的地方是什么地方应该聚焦细节，什么地方应该拉远抽象。所以这里稍微补充三个技巧。

### 文档内容要具体

**重要的都是具体的**。

架构文档通常在系统还在设计的阶段被首次编写，如果这个阶段你就觉得自己能够做大量的，优美的抽象，你多半是个冒牌货。

抽象，从本质上来说，是在一堆具体概念之上才可以构建的。如果大家对具体概念，比如什么是「用户」，什么是「订单」，还没有一个很好的共识，就不要抽象，不要谈大框框。或者，就算你实在要这么干，简洁甚至是粗糙地提一下就好。

一份好的架构文档，应该是具体的，充满上下文和细节的。如果你发现自己大量使用类似于「中台」、「微服务化」、「赋能」等等大词的时候，就应该警惕自己是不是在编写一个糟糕的架构文档。

在《[Made to Stick](https://www.amazon.com/Made-Stick-Ideas-Survive-Others/dp/1400064287)》这本书里面， Heath 讲了很多让信息更容易被理解和记住的办法，虽然这些办法是针对车间里的生产制造的工人和那些设计蓝图的人之间的冲突设计的，但是架构师和其他工程师之间也是类似的问题：

> The manufacturing people were thinking, Why don't you just come down to the factory floor and show me where the part should go? And the engineering people were thinking, What do I need to do to make the drawings better?
> As Bechky notes, the physical machine was the most effective and relevant domain of communication. Everyone understands the machines fluently. Therefore problems should be solved at the level of the machine.
> …the moral of the story is to find a "universal language," one that everyone speaks fluently. Inevitably, that universal language will be concrete.

但研发工程师抱怨一个架构师的时候，通常是因为他/她设计的架构，对于他们手头要解决的问题来说不够具体。记住，和内部外部沟通应该占用你 50% 的时间，然后，你应该把解决方案和形成这些解决方案的上下文详细具体的记录下来。

### 架构图要简单清晰

架构文档的描述应该具体，那么是不是就不需要抽象呢？

很显然，写代码本身就是抽象：计算机通过处理器执行的是指令，我们写的是抽象过的函数、类等等。

现在我们构建的系统，特别是分布式系统已经太复杂，不太可能通过代码级别的抽象来沟通和讨论了。大部分时候，在架构文档里面这种抽象后的系统设计，是通过「架构图」来记录的。

但是行业里面常见的「架构图」是我特别想吐槽的。各种技术大会上，当 slides 里面出现这些架构图时，观众往往就会开始举起手机拍摄，用「系统架构图」做关键字 google 一下，它们大多数长这样：

![architecture-diagram-1](/downloads/images/2021_03/architecture-diagram-1.png --alt Don't touch me...)
图 1. 系统架构图

它们的鼻祖，应该是下面这些图：

![architecture-diagram-2](/downloads/images/2021_03/architecture-diagram-2.png --alt Don't touch me...)
图 2. 美国军方物流系统架构图

这些图最大的问题就是 TMI：Too Much Information。对于看的人来说，它不仅仅是显得宏大而无聊，更重要的麻烦是找不到有效信息的入口。

本质上，如果我们足够的抽象，所有的软件架构图都可以画成三层：

1. 表现层
2. 逻辑层
3. 数据层

在这个抽象层次和上面那些复杂的架构图之间，如何取一个最佳的平衡点？原则很简单：架构图是用来表达你的「规划」，不是用来述职你的「工作内容」的。每个框图至少应该对着一个一级域，不要把很细粒度的模块都扔上去。或者，你可以想象你的架构图只是一个「目录页」，它用来在大家讨论这个系统有什么顶层模块组成的时候，作为一个索引就好。

### 维护、迭代并接受「失真」

我们阅读架构文档的时候，常常发现实际的系统已经不是文档描述的那样：它已经「失真」或者说「过期」了。

于是软件行业里长期有一部分工程师对架构文档嗤之以鼻，「because the code doesn’t lie」，这成了大家不写架构文档的一个主要理由。

一方面，如前所述，抽象颗粒度要粗细结合，并且根据系统的变化，周期性地去更新架构文档，来缓解这个问题。另一方面，还需要在团队里宣扬这样的观念：**文档有一点儿失真其实没有关系**。

我们现在还没有工具可以把系统架构层面的抽象从代码直接生成，所以要保持架构文档随时和代码同步基本上是不可能的。但是如果你到了一个陌生的城市，只有 40% 准确性的地图仍然是很有用的。同理，一个有一部分失真的架构文档，对所有希望了解系统设计的上下文、决策原因和主要模块的人，仍然是很有用的。

反过来，如果你接手一个没有文档的系统，我们在读代码的时候，就需要花大量时间去猜测复杂的系统背后，原始设计者和开发者是怎么去思考的。

因此，任何设计文档都是有用的文档，它们就算过期也有助于我们理解当前系统。

## Summary

好的架构师，应该花 50% 的时间进行「内部工作」：

1. **培养自己的业务思考力，并在系统设计中反应出来；**
2. **不断夯实基本功，了解行业动态和最佳实践，并参与编码工作；**
3. **不断锻炼写作和画图的能力，编写清晰具体的架构设计文档并周期性的更新，不要怕文档过期或者失真。**





