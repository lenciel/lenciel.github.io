---
layout: post
sidenote: false
title: "关于微服务实践的一次分享"
date: 2017-03-11 14:39:44 +0800
categories:

- microservice
- hcb
- MSA
- distributed-system
---

最近在 EGO 里做了一次关于微服务架构的分享，[keynote](https://github.com/lenciel/talks/tree/master/slides/2017_03_19_ego_msa_in_practice)写好了，思路在这里梳理一下。

## 不讲干货

码农的四大错觉里面，排第一的就是干货有用。

我见过很多人在技术帖子或者技术大会里给其他人打「没有干货」的标签。

太「水」的东西大家是应该抵制。

但干货也是思维的结果，而非过程，对本座来说，就好像风干了之后的罐装海味，不好吃。

腾讯，阿里是怎么实施微服务架构的，介绍得再「干」，你听了再兴奋，拿回去多半也没法落地。

构建软件系统，看起来是一群理性的人，进行的一件理性的工作。

但人类的理性在于接受自身的不理性和事物的无规律：而不是照本宣科。

因为根本没有可以长期驻留的「本」，万事万物都在高速运动和变化着，没有什么方法论可以一直有效。

所以 Martin Fowler 说，「唯一成立的业务逻辑就是业务没有逻辑」。

好的系统，都不是被设计出来，而是被恰到好处的人在恰到好处的流程里慢慢抚育出来的。

所以主要是分享一些我们实施过程中的故事，遇到的问题和后续的一些想法。

## MSA是什么？

微服务架构（Microservice Architecture，简称 MSA）的思想其实不是 Martin Fowler 提出的，而是存在已久。只不过 Martin Fowler 和 James Lewis 在那篇[广为传颂的文章](https://martinfowler.com/articles/microservices.html)里给它下了个简明扼要的的定义：

> In short, the microservice architectural style is an approach to developing a single application as a suite of small services, each running in its own process and communicating with lightweight mechanisms, often an HTTP resource API. These services are built around business capabilities and independently deployable by fully automated deployment machinery. There is a bare minimum of centralized management of these services, which may be written in different programming languages and use different data storage technologies.

我经常跟同学们开玩笑说，随便在软件园拦住一个人，都可以跟你聊半个小时「微服务」，因为这里提到的一些说法看起来非常具体：

 - 细粒度的服务
 - 独立进程
 - 围绕业务建模
 - 轻量级通信
 - 去中心化管理

但一旦进入了实际操作，这些微言大义的概念，怎么落地到系统开发里面，就不是每个人都明白的了。其实回过头来看看，Martin Fowler 为什么说「microservice architectural style（微服务架构风格）」而不像很多人只是说「microservice（微服务）」，是很值得玩味的。


### 是风格不是教条

每个公司进行架构改造，都是[业务特点](/2017/02/handling-data-in-msa/)、[团队情况](/2017/02/the-real-success-by-doing-msa/)和技术栈等多方面因素综合决定的系统工程。微服务架构是一种「风格」，而不是可以按图索骥的「教条」。


### 不是什么新科技

MSA 里面提到的很多想法，追究起来都源远流长。「micro-web-service」的提法 2005 年就有，「microservice」这个叫法，也早在 2011 年威尼斯的软件会议里面就开始被使用了。

整个思路的形成和演进里面，「[Unix-like](https://en.wikipedia.org/wiki/Pipeline_(Unix)」或者是「Unix Way」被反复提及。James Lewis 第一个比较正式的关于微服务架构的演讲就叫「Microservices - Java, the Unix Way」。

这是因为 Unix 的很多设计哲学，比如「small is beautiful」或者「make each program do one thing well」，都深深的影响着微服务架构的设计思想。

甚至我觉得 Unix 的「everything is a file」，对应过来正好是「everything is a service」。

### 不是SOA换了个壳

很多像我一样从业已久的人，听到新名词的时候总是持抵抗和怀疑态度的。MSA 不过是 Thoughtworks 把 SOA 换了个名字出来坑钱而已，，是一个很容易入的坑。

实际上，它们确实有关系，但并不是 SOA 换了个壳。你可以把 MSA 想成是 SOA 的一种实践方式，正如 Scrum 是 Agile 的实践方式一样。只不过这种实践方式，和以前的各种实践方式相比，最大的不同就是去掉了 ESB 这样的总线，让系统的各个部分可以相对独立的被设计、开发、部署和运维。

## MSA究竟是什么？

  > Technology is the answer, but what was the question?
  > - Cedric Price (1965)

前面说了很多 MSA 不是什么，那么它究竟是什么？不妨从我们究竟为什么需要它这个维度来思考。

为什么单体的设计不能满足需要了？我们可以从率先进行 MSA 实施的公司来看。

Nike，Twitter，Netflix，以及从来不说自己在做微服务架构，但其实是做得最好的 Google，它们的业务差别其实很大。比如 Nike 和 Twitter，一个业务很复杂，一个业务很简单。

真正的共同之处在于它们构建的都是大型分布式系统。

### 什么是分布式系统

本座在面试的时候常常问，「请问，什么样的系统，是分布式系统？」

毕竟，我们不是所有人都在构建 Twitter 那样复杂的系统。

![Vhost threshold](/downloads/images/2017_03/twitter_services_deps.jpg --alt Don't touch me)

*fig1.1 Twitter的服务间依赖图*

有很多有趣的答案，但我们不妨看看图灵奖得主，分布式系统的先驱[Leslie Lamport](https://en.wikipedia.org/wiki/Leslie_Lamport)是怎么说的：

> A distributed system is one in which the failure of a computer you didn't know existed can render your own computer unusable.

这句话是几十年前说的，那时候有计算能力的设备还只有`computer`而已，现在把手机等各种设备都算上的话，如果一台你不知道的计算设备挂了，会影响你的设备的使用，就叫分布式系统的话，我们可以想想，有多少系统应该算是分布式系统呢？

淘宝，京东，腾讯，百度？

滴滴，知乎，摩拜，微信？

可以说，移动互联网发展到今天，几乎所有的系统，都是分布式系统。

### 分布式系统的难点

为什么系统都变成了分布式系统？

因为在处理和分析数据时，最理想的计算环境是这样的：一台有无限存储和计算能力的「超级计算机」，可以提供无穷大的存储容量，并且可以将计算时间降低至无穷小。

可是像《银河系漫游指南》里全宇宙全时空第二强的「深思」这样的计算机并不存在，因此现实里面我们需要进行两个维度的扩展：

- 纵向的：提升单个设备的软硬件处理能力，比如我们的各种超级计算机的研究
- 横向的：构建分布式系统，通过多台计算机来提供一个处理能力更强的系统

对于大多数的场景，横向的扩展显然是更加现实的。但这样的系统在构建过程中，有一些固有的难点，比如物理上的，比如理论上的。因为这些难点，分布式系统有两个很难解决的问题：异步性（Asynchrony）和局部失效（Partial Failure）。

#### 异步性

异步性表征的物理上的难点，也就是物理节点的增加带来的难点：

- 系统整体出错概率增大
- 节点间通信量增加
- 节点间距离增加

异步性会导致不确定性（Nondeterminism），包括 timing 上的，也包括 sorting 上的。

Grace Hopper（第一个编译器的作者），喜欢给自己每个学生发一条 11.8 英寸的电线：这是电一纳秒能够跑的距离，他想提醒学生脑子里面要有时延。

Jeff Dean 在斯坦福的那个[著名的讲座](https://static.googleusercontent.com/media/research.google.com/zh-CN//people/jeff/stanford-295-talk.pdf)里面提出了每个程序员都应该知道的[一些时延数据](https://www.quora.com/What-are-the-numbers-that-every-computer-engineer-should-know-according-to-Jeff-Dean)。

[There is no Now](http://queue.acm.org/detail.cfm?id=2745385)...


#### 局部失效

局部失效表征的是理论上的难点：

- 如何处理局部失效：节点失效、网络分区失效、拜占庭失效等情况下，系统的执行和操作不应受到失效的影响；
- 失效了如何保持一致:系统中相关数据间的逻辑关系应当是正确和完整的；

在 1985 年的时候，Fischer, Lynch 和 Patterson 就提出了分布式系统最重要的理论之一：[FLP不可能性](http://the-paper-trail.org/blog/a-brief-tour-of-flp-impossibility/)，毁灭了构建分布式超级计算机系统的幻想：

> 在假设网络可靠、计算节点只会因崩溃而失效的最小化异步模型系统中，仍然不存在一个可以解决一致性问题的确定性算法。

但随后，Eric Brewer 等人提出了 CAP 定理（如今它比 FLP 更加深入人心）：

> 分布式计算系统不可能同时确保一致性(Consistency)、可用性(Availability)和分区容忍性(Partition tolerance)。

在这种三者只能取其二的思想指导下，大量的系统和协议被构建出来。

#### 根本问题

无论是异步性还是局部失效，背后的根本问题是，任何软硬件系统都会崩坏。这两年 Google 的 Spanner 被很多人错误地称为「解决了分布式系统的一致性问题」。

实际上，Spanner 的 TrueTime 组件并不提供一个全局唯一的时钟：它给你一个当前值可能的偏差，并且在设计上它就明确，这个偏差可能在 1-7 毫秒。

换句话说，虽然是 Google，虽然它用上了 GPS+原子钟的方案，时延仍然是这样的大。如果再考虑 x86 的时钟会被负载、热量、功率等各种因素影响，可以认为，Google 的 Spanner 并不是尝试去解决分布式系统的问题：正好相反，它是承认，然后面对里面的问题。

所有的靠谱的系统设计者都知道面对这些问题才是正确的做法：以 Spanner 依赖的 GPS 时钟为例，它靠着 30 颗卫星保持运行，只需要其中的 4 颗就可以工作，并且每颗卫星的关键部件，比如原子钟，都是有冗余的。

### 微服务架构

可以认为，MSA 是在下面三个方面不断发展的基础上，渐渐坐实成为一种架构的：

- 必要的组件：服务注册与发现、熔断等等
- 有用的方法：DDD，SAGA，CQRS 等等
- 日益成熟的新技术：容器，No-SQL 等等

所以，MSA 的定义可以是：

> 在分布式系统建设中，为了应对需求的快速变更，在高增速的大公司内部构建高效、自治、响应迅速的「创业风格」团队的一些尝试。

换句话说，它是涵盖研发、测试、部署、监控、运维各方面的整个生命周期的生态，隐含着一些工具、方法和构建系统的思路。不仅意味着业务的切割，也要求技术栈的解构和重建。

## 如何实施


### 人

人永远是最重要的环节，因此在进行 MSA 的落地之前，不妨问问自己：

* 有多少研发？里面有多少懂运维？
* 有多少团队？他们互相信任吗？
* 有多少产品？多少业务系统？
* 哪些需要纳入微服务化的计划？
* 如何去在内部销售基础设施？

[康威定律](https://en.wikipedia.org/wiki/Conway%27s_law)的内容，值得每个架构师和技术管理者[学习](http://www.infoq.com/cn/articles/every-architect-should-study-conway-law)。

### 流程

#### CD/CI

MSA 技术层面上每一目的的达成，几乎都是多组件、多层级、多技术的共同作用。因此，要积极地、容易地接纳新业务，新平台，新技术栈，就必须有比较顺畅的流程，特别是 CD、CI 流程。

#### 测试

[The Hard Thing About Hard Things](http://www.audible.com/pd/Business/The-Hard-Thing-About-Hard-Things-Audiobook/B00I0AJC2Y?mkwid=DSAINTTitle_dc&pcrid=158258695668&pmt=b&pkw=&source_code=GO1GBSH07271690CB&cvosrc=ppc%20dynamic%20search.google.634950925&cvo_crid=158258695668&cvo_pid=33581432409&gclid=CjwKEAjw3KDIBRCz0KvZlJ7k4TgSJABDqOK7txc86bRc4oHeRJ69icgVvd0fOpt4CaUEUoaA9nLLRBoCGNnw_wcB)大家都可以去看看，非常有意思。

分布式系统的两大难题带来的是复杂度和状态空间的指数级增加。

比如一个单体的应用，了不起就是 5 个实例跑在一个 HA Proxy 背后，测试的时候你可以测 5 个实例。

如果它被拆成了 10 个服务，每个服务跑了 12 个 docker 实例起来呢？

传统的测试方法肯定是不行的。

因此，如何进行「契约测试」是测试技术发展的一个新动向，Lamport 本人就贡献了[TLA+](http://lamport.azurewebsites.net/tla/tla.html)来进行分布式系统的[形式化的验证](https://en.wikipedia.org/wiki/Formal_verification)。

如何这样的投入对于团队太奢侈了怎么办？感觉可以看看[这篇论文](https://www.usenix.org/system/files/conference/osdi14/osdi14-paper-yuan.pdf)，里面有很多数据非常有趣，看完之后对测试设计帮助很大：

> Three nodes or less can reproduce 98% of failures.
> 35% of catastrophic failures are caused by very basic things.
> Testing error handling code could have prevented 58% of catastrophic failures.

另外，除开常规的测试手段，分布式系统大量的使用 Fault Injection 或者 Game Days 这种方式来进行测试。比如 Netflix 就公布了自己的[Simian Army](https://github.com/Netflix/SimianArmy)工具，[Riemann](http://riemann.io/)的作者 Aphyr 还用 Clojure 写了个工具叫[Jepsen](https://github.com/jepsen-io/jepsen)。

Game Days 主要指通过演习来让 Partial Failure 确实发生。比较著名的有 Google 的 Wheel of Misfortune，再比如 Stripe 在自己的 Redis 主节点上来了一发`kill -9`之后发现了 Redis 的一个 bug，于是把这样的乱来变成了内部传统。

### 技术

解决了前面这两个方面的问题，要落地微服务其实已经成功了大半。

关于技术方面，详见 keynote 吧。


