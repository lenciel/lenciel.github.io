---
layout: post
title: "分布式系统介绍"
date: 2018-04-29 00:27:48 +0800
comments: true
categories: 

- distributed-system

---

基础设施团队在招聘工程师的JD上一般会有下面几项：

- 对于分布式系统关键特征和术语能基本掌握
- 对于分布式领域常见的算法和理论有基本认知
- 对于分布式系统在生产环境的常见问题有简单了解

那怎么看一个人是不是具备了这方面的能力呢？本座面试时总会从“什么是分布式系统”问起，大多数时候还是会听到各种稀奇古怪的答案，甚至屋子里一下子就安静了。

最怕世界突然安静。

年后又招人了，并且要开始做内部培训。这里梳理一下分布式系统的一些基础知识。参考了[aphyr](https://github.com/aphyr)的基础培训课程和Dan Creswell的[分布式系统必读指南](https://dancres.github.io/Pages/)，非常基础，非常必读，no rocket science。

Let's go。

## 1.0 什么是“分布式系统”?

Lamport, 1987:

>  A distributed system is one in which the failure of a computer
>  you didn't even know existed can render your own computer
>  unusable.

- 大多数物理服务器都运行着 \*nix 系统，通过TCP或者UDP进行进程间的通信：
  - 可以是云上的虚拟机
  - 也可以是通过[InfiniBand](https://en.wikipedia.org/wiki/InfiniBand)通信的系统
  - 可以是局域网里面，隔着几米的距离
  - 也可以是广域网，隔着几千公里距离
- 大多数移动App也是一个分布式系统里的一部分
  - 移动App工作的网络环境比服务器端更加恶劣
  - 其他桌面系统的浏览器以此类推的，也属于分布式系统
  - 所以并不是服务器才属于分布式系统，大部分客户端也是
- 更一般地来说，分布式系统涵盖：
  - 由相互之间需要通信的部件构成的
  - 通信速度“慢”
  - 通信还常常“不稳定”
  - 的任何系统
- 比如:
  - 飞机上冗余的CPU
  - ATM机和POS机终端
  - 空间站
  - 支付系统
  - 技术会议里的参会者
  - 喝醉了之后发微信的朋友
  - 写了情书让你帮忙寄出去的基友立

## 1.1 节点和网络

- 分布式系统里面的单个组成部分被称为**node**：“**节点**”
  - 文献里看到的**processes**，**agents**或者**actors**，多半也是描述同样的东西

### 1.1.1 节点

- 延迟特性
  - 节点内部的操作“很快”
  - 节点之间的操作“很慢”
  - 快和慢是相对的，度量标准取决于系统完成什么样的工作
- 可靠性
  - 可以失效，但失效的时候作为整体单元失效
  - 失效时是可以被感知的
  - 状态是连贯一致
  - 状态迁移是有序，优雅的
  - 通常是以单线程的状态机模型建模的
- 一个节点本身也有可能是一个分布式系统
  - 但只要对外作为一个整体，这个节点提供高速、一致的可操作接口，我们就认为它是一个节点
- 进程的形式化模型
  - Communicating Sequential Processes
  - Pi-calculus
  - Ambient calculus
  - Actor model
- 节点失效的形式化模型
  - Crash-stop
  - Crash-recover
  - Crash-amnesia
  - Byzantine

### 1.1.2 以消息流（message flow）的方式来思考网络（network）

- 节点之间通过**网络**进行交互
  - 人类通过语音相互沟通
  - 粒子通过场相互沟通
  - 计算机通过IP、UDP、SCTP等相互沟通
- 我们把这些交互建模为节点之间发送的离散的**消息**
- 消息需要**时间**来传播
  - 这就是分布式系统里面“慢”的那部分
  - 我们称其为“延迟”
- 消息常常都会丢
  - 这是分布式系统“不稳定”的又一个因素
- 网络不是同质的，资源均匀的
  - 有些网络连接比其他的连接要慢、带宽要窄、稳定性要差

### 1.1.3 因果图

- 我们可以把节点和它们之间的交互关系表示为一个视图
  - 时间轴是从左到右，或者从上到下的
  - 节点可以抽象为时间轴方向上的线段（它们在一个时间段内一直存在）
  - 消息是**连接**这些节点线段的有方向的路径

### 1.1.4 同步网络

- 节点执行是按时序来的：每个节点之间距离都是1
- 消息延迟是有边界的
- 有一个完美的全局时钟
- 很容易被证明的一件事情是
  - 同步网络几乎没法构造出来，你的系统多半不是

### 1.1.5 半同步网络

- 和同步网络类似，但是时钟不是固定距离为1，而是一个范围，比如 [c, 1]

### 1.1.6 异步网络

- 独立执行，互不依赖
- 消息的时延没有可控边界
- 没有全局时钟
- 比半同步或者同步网络要脆弱
  - 所以确定性算法（certain algorithm）不一定是有效的
  - 所以确定性算法可能是**无法实现**的
  - "[Efficiency of Semi-Synchronous vs Asynchronous Networks](http://www.cs.ucy.ac.cy/~mavronic/pdf/AM94.pdf)"
- IP网络肯定是异步的
  - 但在**实际操作中**并没有发生真正的pathological stuff
  - 大多数网络都可以在几秒到几周内恢复，不会永远down掉
    - 相反的, 人类的时间维度是从几秒到几周的
    - 因此我们不能假装问题不存在

## 1.2 当网络出问题时

- 异步网络允许发生
  - Duplicate
  - Delay
  - Drop
  - Reorder
- 丢包和时延是难以分辨的
- [拜占庭将军问题](https://en.wikipedia.org/wiki/Byzantine_fault_tolerance)
  - 包括对内容重写
  - 在真实网络里面大都不会发生
    - 我只是说大都...

## 1.3 底层协议

### 1.3.1 TCP

- TCP**一般就够用了** 
  - 如不确定，先用TCP
  - 但不完美，虽然可以对它进行加速
  - 但知道怎么做以及什么时候才需要做很关键
- 虽然单个TCP连接实际上有自带的duplicate和reorder治理
  - 但很可能会有多个连接打开
  - 而TCP连接总会失败
  - 当这种情况发生时，要不就会丢消息，要不就需要重试
  - 所以应该在TCP上自定义一个增量的序列号来编码，从而对乱掉的时序进行**重建**

### 1.3.2 UDP

- 和TCP相同的寻址规则，但是没有stream invariants
- 很多人使用UDP为了“更快的速度”
  - 不要认为路由器和节点会被丢弃
  - 不要认为包会重传
  - 或者重新排序
  - "But at least it's unbiased right?"
    - 并不是
  - 这些都造成一些破坏，比如在收集metrics的时候
  - 要debug也是非常的**困难**
  - TCP提供了流控，并且把logical messages重新打包成packets
    - UDP下需要自己来实现流控和背压
  - “TLS over UDP”是可以做的，但是开发难度很高
- UDP在TCP的FSM的overhead成本过于高昂的时，是有用的
  - 内存压力
  - 大量的生命周期很短的连接和socket的重用
- 在best-effort delivery已经能够很好地满足系统目标的时候特别好用
  - 语音通话：当对方听不清时，用户自己会道歉然后重传
  - 游戏: 延迟和卡顿，但会重新对齐
  - 高层的协议在底层已经乱掉的情况下仍然会继续工作假装什么都没有发生

## 1.4 时钟

- 当系统分割成多个独立部分的时候，我们仍然希望事件一定程度上是**有序**的
- 时钟帮助我们对事件进行排序：先这个，后那个

### 1.4.1 系统时钟

- 理论上，操作系统的时钟可以给系统产生的事件带来顺序
  - 然并卵: NTP可能没有你以为的工作那么理想
  - 然并卵: 在两个节点间的同步完成得并不好
  - 然并卵: 硬件也会有漂移
  - 然并卵: 大数还会带来[问题](http://rachelbythebay.com/w/2017/09/27/2153/)
  - 然并卵: POSIX 时钟从**设计**上就不是单调的
    - Cloudflare 2017: 因为leap second造成的[问题](https://blog.cloudflare.com/how-and-why-the-leap-second-affected-cloudflare-dns/)
    - 其实就是当时 Go 还不提供 `CLOCK_MONOTONIC` 的接口
    - 在计算出一个负的duration然后把它交给 `rand.int63n()` 后，就驾崩了
    - 造成了DNS解析失败: 1% 的 HTTP 访问被影响了好几个小时
  - 然并卵: The timescales you want to measure may not be attainable
  - 然并卵: 线程会睡
  - 然并卵: 运行时会跪
  - 然并卵: OS会退
  - 然并卵: 硬件会醉
- 怀疑人生了吧？

### 1.4.2 Lamport时钟

- Lamport 1977: "[Time, Clocks, and the Ordering of Events in a Distributed System](https://lamport.azurewebsites.net/pubs/time-clocks.pdf)"
  - 每个进程一个逻辑时钟
  - 每次状态迁移的时候单调递增: `t' = t + 1`
  - 每次消息发送的操作时间戳+1并带上改时间戳
  - 每次接收消息的操作：`t' = max(t, t_msg + 1)`
- 只要对所有的进程进行排序，我们就可以知道消息的顺序
  - 但是这个序列号看起来非常不直观
  - 并且无法表示同时发生的消息

### 1.4.3 向量时钟

- 把所有进程的时钟放到一个向量里
- `t_i' = max(t_i, t_msg_i)`
- 每次处理完内部事件，把向量里自己进程的逻辑时钟加1
- 向量时钟记录了逻辑时钟没有的因果关系，也就是偏序
  - 两个事件的因果关系为：
    - A < B 意味着A在B后发生
    - B < A 意味着B在A后发生 
    - 否则两者就是没有因果关系的
  - 如果所有的 A_i <= B_i，且至少有一个A_i < B_i，那么 A < B
  - 如果A和B比起来有的分量大，有的分量小，则可能是同时发生
- 棒棒棒: the past is shared; the present is independent
  - 当下各个节点的状态需要被保留
  - 过去的状态可以被丢弃
  - 如何对过去的状态做GC
- 向量空间里面有n个进程
  - GC的时候需要协调顺序
  - 或者不做GC，牺牲掉正确性，直接删掉旧的状态
- 变种：分布式系统中数据一般存在多个副本，多个副本的时钟可能被同时更新，引起副本间数据不一致
  - [Dotted Version Vectors](https://github.com/ricardobcl/Dotted-Version-Vectors)
  - [Interval Tree Clocks](https://github.com/ricardobcl/Interval-Tree-Clocks)

### 1.4.4 GPS和原子钟

- 比NTP要好很多
  - 全局分发，毫秒级精度，统一排序
  - 可以把一个异步的网络提升为半同步的
  - 解锁了很多更有效率的算法
- 目前只有Google有
  - Spanner: 全局强一致性的事务
  - 没有公开分享实现方式
- 比你想象的贵很多
  - 每个GPS接收器就要好一百多刀
  - 原子钟得多少钱？
  - 需要各种类型的GPS：制造商可能会搞出问题
  - 但未来的数据中心一定参考Google，通过硬件接口来解决bounded-accuracy time的供给问题


### 1.4.5 小结

分布式系统的基础，是它的底层构件：

- 节点之间通过网络进行消息传递
- 节点本身以及节点间的网络都有可能会崩坏
- TCP/UDP这样的协议使得跨进程的通信成为可能
- 通过时钟我们可以对事件进行排序

接下来看看分布式系统经常被讨论的一些**上层特性**。

## 1.5 Availabiliy

- 什么是**可用性**？就是对所有尝试过的操作里成功部分的比例衡量。
- 文献和报表里面常见的可用性表示什么？

### 1.5.1 Total availability

- 别幼稚: 分布式系统可以做到完全可用吗？
- 最多是所有还活着的节点上操作成功了
    - 失效的节点啥操作都不会成功

### 1.5.2 Sticky availability

- 比较懂分布式的人发明的词。
- 指对所有活着的节点进行的操作都成功了
  - 在特定的客户端都访问特定的节点的前提下（所以微信分set做高可用，还有大量别的系统通过session来让特定的客户端“粘住”特定的后端节点）

### 1.5.3 High availability

- 比较懂分布式的人发明的遮羞的词
- 高可用系统比不高可用系统总要好一些吧
- 衡量标准是系统最多在多长时间内不可用
- 意味着有一些操作失败了

### 1.5.4 Majority available

- 当支撑主要功能的节点运行良好时，由它们完成的操作是成功的
- 意味着有一些功能被降级了，用户可能在UI上根本看不到它们的入口了

### 1.5.5 如何量化可用性

- 业界标准 "uptime" 究竟对不对？
  - 系统在没有人用的时候一直up着真的好吗？
  - 高峰期该down的系统坚挺地up着真的好吗？
  - 能否通过测量某个时间窗口中请求数量？
  - 然后在多个时段对这样的窗口进行采样得到趋势图？
  - 注意这样来衡量可用性，uptime受时间轴单位的影响很大

## 1.6 Consistency

- 一致性模型其实就是对系统里面的事件进行“历史现场保护”的模型

### 1.6.1 Monotonic Reads

- 一旦本座读过，接下来所有的读操作返回的状态或者值都和本座读的一致

### 1.6.2 Monotonic Writes

- 一旦本座写过，接下来所有本座的写操作都会在这次写之后才**发生** 

### 1.6.3 Read Your Writes

- 一旦本座写过，接下来所有本座的读操作都返回本座最后一次写的值

### 1.6.4 Writes Follow Reads

- 一旦本座读过，接下来所有的写操作都在这次读之后才**发生** 

### 1.6.5 Serializability

- 所有的操作（事务）看起来都是原子的
- 虽然也会有顺序
  - 但顺序本身是什么样的没有约束
  - 所以读到了之前的状态也不会有问题

### 1.6.6 Causal consistency

- 所有的操作可以用一个DAG表示出因果关系
  - 无法在同一个DAG里面表示的操作就是**concurrent**的
- 局限性: 要完成一个操作前，节点上所有的其他操作必须完成
- 但是concurrent的操作可以自由排序

### 1.6.7 Sequential consistency

- 又是Lamport提出的：[How to Make a Multiprocessor Computer That Correctly Executes Multiprocess Programs](https://www.microsoft.com/en-us/research/publication/make-multiprocessor-computer-correctly-executes-multiprocess-programs/)
- 和causal的一致性类似，对操作的顺序有限制
- 所有操作看起来都是原子的
- 所有进程都遵从一个排序
  - 但仅能保证进程内
  - 节点可以瘫

### 1.6.8 Linearizability

- 有时候被称为atomic consistency或者strong consistency
- 所有的操作（事务）看起来都是原子的
- 所有进程都遵从一个排序
- 所有操作都有触发时间和结束时间来规约
- 看起来只是在sequential consistency只关心所有进程或者节点的偏序关系基础上, 加上了时间顺序
- 但实际上非常强大：[Sequential Consistency versus Linearizabiltiy](http://courses.csail.mit.edu/6.852/01/papers/p91-attiya.pdf)

### 1.6.9 ACID isolation levels

- ANSI SQL标准里定义的ACID隔离等级比较古怪
  - 主要是拿现有厂商的实现倒推出来的
  - 标准里很多地方定义模糊
- [Weak Consistency: A Generalized Theory and Optimistic Implementations for Distributed Transactions](http://www.csd.uoc.gr/~hy460/pdf/adya99weak.pdf)
  - 每个ANSI SQL的隔离等级都是为了防止出现特定状况设定的，要能对应起来
  - Read Uncommitted
    - 防止 *脏写* 的状况发生
      - w1(x) ... w2(x)
      - 在另外一个事务提交之前是不能覆盖其再进行写操作的
    - 当另外一个事务还在修改时能够读数据
    - 也能读取被事务回滚以后的数据
  - Read Committed
    - 防止**脏读**的状况发生
      - w1(x) ... r2(x)
      - 不能读一个事务还没有提交的数据，不管这个事务在修改或其他写操作
  - Repeatable Read
    - 防止**模糊读**或者叫**不可重入读**的状况发生
      - r1(x) ... w2(x)
      - 一旦一个事务读数据，直至这个事务提交之前，这个数据一直不会改变
  - Serializable
    - 防止**幻读**的状况发生
      - 给定预期P
      - r1(P) ... w2(y in P)
      - 一旦一个事务读取满足查询的元素集合，这个集合在事务提交前都不会改变
  - Cursor Stability
    - 事务有一个游标集合
      - 一个游标指向被事务访问的一个对象
    - 读锁一直保留到游标被移除或提交
      - 在提交时间，游标被升级为写锁
    - 能阻止lost-update
  - Snapshot Isolation
    - 事务总是能读取提交后的数据的一个快照，这些数据可以是在事务开始之前抓取准备好
    - 只有没有任何其他提交的事务被写入到任何我们想写的对象时，新的提交才能发生
      - first-committer-wins

### 1.6.10 这些有什么鸟用?

- 现实世界是不是没有那么“分布式”？
- 大多数公司用用Read Committed也就够了
- 但是网络攻击的人经常就是利用并发访问来找到系统漏洞
  - Poloniex发生过大量账号被盗事件
  - [Flexcoin](https://www.reddit.com/r/Bitcoin/comments/1zihb4/flexcoin_is_shutting_down_after_being_hacked/)被攻击得直接关站了
  - [Warszawski & Bailis 2017: Acidrain](http://www.bailis.org/papers/acidrain-sigmod2017.pdf)

## 1.7 Tradeoffs

- 如果可以的话，我们当然都想要系统同时具备total availability和linearizability
- 但保持一致意味着需要协调状态
  - 如果事件是顺序不敏感的，就不要过分追求
  - 如果事件是顺序敏感的，我们就需要协调状态
- 协调状态一般就得发消息进行通信，这是有成本的
  - 一致性越高的系统越慢
  - 一致性越高的系统越不直观
  - 一致性越高的系统越难高可用


### 1.7.1 Availability/Consistency

- CAP讲的就是linearizability或total availability只能要一个
- 仅仅了解CAP理论还不够
  - [Highly Available Transactions: Virtues and Limitations](https://dl.acm.org/citation.cfm?id=2732237)
  - 有些人完全不喜欢sticky available或者totally available
    - Strong serializable
    - Serializable
    - Repeatable Read
    - Cursor Stability
    - Snapshot Isolation
  - 有些人接受sticky available
    - Causal
    - PRAM
    - Read Your Writes
  - 有些人接受totally available
    - Read Uncommitted
    - Read Committed
    - Monotonic Atomic View
    - Writes Follow Reads
    - Monotonic Reads
    - Monotonic Writes

### 1.7.2 Harvest/Yield

- [Harvest, Yield, and Scalable Tolerant Systems](https://pdfs.semanticscholar.org/5015/8bc1a8a67295ab7bce0550886a9859000dc2.pdf)
  - Yield: 完成一个请求的可能性
  - Harvest: 代表不完整的响应数据
  - 例子
    - 搜索引擎一个节点失败后，让一些结果丢失
    - 数据更新反映在一些节点上，而其他节点没有更新
      - 在分区partition情况下考虑AP
      - 能写一些其他人不能读的数据
    - 流式视频会降级服务，比如降低分辨率以保障更低的延时
  - 取决于负载、硬件、网络拓扑等因素
  - 最好能够按每个请求为单位对harvest/yield进行调整

### 1.7.3 组合拳

- 一致性模型很多，怎么选？
  - 架构上，系统的不同部分通常有不同的需求
  - 选择满足需要的一致性要求最低的模型即可
    - 但是要考虑清楚临界点的情况
    - [Probabilistically Bounded Staleness in Dynamo Quorums](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2012/EECS-2012-4.pdf)
- 并不是所有的数据都用一个方案去处理
  - “大数据”反而优先级较低
  - “小”数据常常更加关键
  - 比如：微信上用户的各种操作有强一致性保证, 像朋友圈这种东西有最终一致性就可以了

### 1.7.4 小结

- 可用性就是度量操作的成功率
- 各种一致性模型就是对什么操作在什么时候能够发生的规定
- 一致性要求越高，通常就意味着可用性或者性能的下降

在有了这些理论基础之后，接下来我们看看如何进行工程实现。

## 1.8 可能的情况下尽量不要Consensus

### 1.8.1 CALM conjecture

- [CALM: consistency as logical monotonicity](http://bloom-lang.net/calm/)
  - [能够有最终一致性的系统一定是逻辑单调的，否则就必须使用诸如两段提交或者Paxos等方法进行协调](https://databeta.wordpress.com/2010/10/28/the-calm-conjecture-reasoning-about-consistency/)
  - 什么是所谓的“协调”？
  - 什么是所谓的“单调”？
- 单调就是不会被推翻重来的意思
  - 从已知的局部信息演绎出的结果从来不会因为新信息的引入失效
  - 无论是关系代数和Datalog没有negation将会是单调的
- [Relational transducers for declarative networking](https://arxiv.org/abs/1012.2858)
  - T理论说明在Datalog中可以不在意网络程度情况下节点处理服务器的协调能只以单调计算
    - This is not an easy read
  - 无需协调不意味着不用通信
    - Algo succeeds even in face of arbitrary horizontal partitions
- 使用不严谨的实践词语表达
  - 在思考问题的时候，看看它能不能被建模成只需要“增加”事实即可表达的
  - 当根据目前已知的事实计算出新的事实时，之前的是否会有需要被推翻的情况？
  - 有没有特别的事实可以作为“上封条”的事实，一旦出现，就意味着整个事实链条完整了
  - 这种“单调”的算法通常来说要好实现得多
  - Likely tradeoff: incomplete reads
- [Bloom语言](http://bloom-lang.net/)
  - 非序列化的编程语言
  - 自带流程分析
  - 能够看出哪里需要进行“协调”


### 1.8.2 Gossip

- 消息广播系统
- 在集群管理、服务发现、CDN等方面得到了广泛使用
- 非常弱的一致性
- 非常高的可用性
- 全局广播
  - 发送一个消息到其他每个节点
  - O(nodes)
- 网格化
  - 传染病模型
  - 与邻居玩击鼓传花
  - 按max-free-path进行传播
- 或者是使用spanning tree
  - 一个节点连接到其他另外节点
  - 减少多余信息
  - 降低延迟
  - [Plumtree](http://homepages.gsd.inesc-id.pt/~jleitao/pdf/srds07-leitao.pdf)

### 1.8.3 CRDTs

- 顺序无关的收敛数据类型
  - 如计数器，set，map等
- 对dupes/delays/reorders有较好容忍度
- 不像顺序一致的系统，顺序不依赖“单一来源”
- 但也不同于最终一致的系统，从来不会丢失信息
  - 除非显式地丢弃信息
- 在高可用系统中工作良好，比如
  - Web客户端/手机客户端
  - Dynamo
  - Gossip
- "[A comprehensive study of Convergent and Commutative Replicated Data Types](https://hal.inria.fr/inria-00555588/document)"
  - 假设有一个已经组合的数据类型 x 和merge函数m, 那么就有:
    - 可聚合: m(x1, m(x2, x3)) = m(m(x1, x2), x3)
    - 可交换: m(x1, x2) = m(x2, x1)
    - 幂等:  m(x1, x1) = m(x1)
- 易于构建，易于检验，解决了各种常见的让人头疼的问题
  - 通讯失败？再试一次，反正会聚集收敛
  - 消息乱了次序也没有关系
  - 两个副本需要同步? 直接merge了事
- 缺点
  - 有些算法 *依赖* 顺序，不能用CRDTs进行表达
  - 读操作可能会读到脏数据
  - 空间成本更高

### 1.8.4 HATs

- [Highly Available Transactions, Virtues and Limitations](https://dl.acm.org/citation.cfm?id=2732237)
  - 任何副本都会保证响应
  - 低延时 (比串行化协议速度快1-3个数量级)
  - Read Committed
  - Monotonic Atomic View
  - Excellent for commutative/monotonic systems
  - 多条目更新时有外键约束
  - 有限的唯一性约束
  - 对于给定任意有限时滞，可以保证收敛（所谓“最终一致性”）
  - 是地理上广阔分布系统的优秀候选方案
  - 最适合解决需要强事务机制的系统
  - 也不要忘了: COPS, Swift, Eiger, Calvin等等


## 1.9 Consensus躲不开

- 共识问题:
  - 三种进程类型
    - Proposers: 提议一个值
    - Acceptors: 通过相互协调，选择一个唯一的值
    - Learners: 读取被选中的值
  - acceptor的分类
    - N 总共存在的acceptor
    - F 可能进入失效状态的正常acceptor
    - M 失效的acceptor
  - 三条不变性定律:
    - Nontriviality: 只有被提议的值能被学习
    - Safety: 最多只有一个值能被学习
    - Liveness: 假设有一个P, 一个L, 和一个N-F的集合（即不包括失效状态的所有acceptor），并且它们都是无故障能彼此通讯的，那么如果P提议了一个值，就一定可以被L学习到。

- 大量的分布式系统其实都等效为共识问题
  - 各种锁
  - 有序日志
  - 可复制状态机

- FLP理论告诉我们在异步网络中实现共识一致性是不可能的
  - 只要在特定的时间杀死一个特定进程，就可以破坏任何共识算法
  - 但也不至于有这么糟糕因为现实情况下网络里的节点大都可以完成共识
  - 并且，FLP是基于确定性的
    - 真实计算机都**不**是确定性的
    - [Another Advantage of free choice](http://www.cs.cornell.edu/courses/cs5414/2017fa/papers/p27-ben-or.pdf)
      - 证明了如何在非确定性前提下完成共识

- [Tight Bounds for Asynchronous Consensus](http://ckeren.net.technion.ac.il/files/2016/02/AC07.pdf)
  - 异步共识的严格边界要求

### 1.9.1 Paxos

- Paxos是共识算法的金线
  - [The Part Time Parliament](https://lamport.azurewebsites.net/pubs/lamport-paxos.pdf)
    - 以虚构的希腊民主社会解析来演绎
  - [Paxos Made Simple](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf)
    - 把之前文章里面用希腊语表示的算法专门拿了一章来进行说明
  - [Paxos Made Live](https://static.googleusercontent.com/media/research.google.com/zh-CN//archive/paxos_made_live.pdf)
    - Google实现自己的锁服务的总结
  - [Paxos Made Moderately Complex](http://www.cs.cornell.edu/courses/cs7412/2011sp/paxos.pdf)
    - 一页伪代码大概得用几千行Cpp来实现
- 在独立proposal基础上实现最终的共识
- 一些优化后的变种
  - Multi-Paxos
  - Fast Paxos
  - Generalized Paxos
  - 大多数时候很难一下说清用哪个好，或者用哪些来组合是安全的
  - 每种算法的实现上也有细微的“口味不同”
  - 所以把Paxos描述成一个算法“系列”而不是一个算法可能合适一些
- 在大量的产品中用到
  - Chubby
  - Cassandra
  - Riak
  - FoundationDB
  - WANdisco SVN servers
- 新研究成果: [Flexible Paxos: Quorum intersection revisited](https://arxiv.org/abs/1608.06696)

### 1.9.2 ZAB

- ZAB：[Zookeeper Atomic Broadcast](https://pdfs.semanticscholar.org/fc11/031895c302dc52404d34de58af1a72f3b817.pdf)
- 提供顺序一致性 (线性写, 滞后的有序读)
  - 支撑了ZK客户端需要快速本地读的特性
  - 但是也有一个SYNC命令用来保持实时更新可知
  - (SYNC + op) 组合可以实现线性读
- 和Paxos一样，majority quorum, 5个或者7个节点

### 1.9.3 Humming Consensus

- [比较新](https://github.com/slfritchie/humming-consensus)
- 看起来略像[CORFU](http://www.cs.yale.edu/homes/mahesh/papers/corfumain-final.pdf)
- 以及[chain replication](http://dsrg.pdos.csail.mit.edu/2013/08/08/chain-replication/)

### 1.9.4 Viewstamped Replication

- 看起来是复制协议，其实也是共识算法
- 事务处理中加入了视图改变算法
- 大多数节点知道的值能保证活到将来
- 没有产品化
- 和Paxos一起对Raft产生了影响

### 1.9.5 Raft

- [In Search of an Understandable Consensus Algorithm](https://raft.github.io/raft.pdf)
- Lamport说Paxos很简单但是对大多数人来说并不是那样
  - 有没有一个大家都懂的共识算法？
- Paxos要解决独立决策的问题，但大多数时候我们只要处理好状态机就够了
  - 维持一个状态机切换事件副本到日志
- 同时提供了一个集群类成员身份转换的实现，这是大多数系统的核心问题
- 能够实现线性化的状态机
  - RethinkDB
  - etcd
  - Consul

### 1.9.6 小结

- 构建分布式系统的时候，首先考虑它是不是只增加而不推翻事实的系统，不要来就用共识算法
- 我们可以使用gossip来广播消息到其他进程，使用CRDT来merge节点的更新，使用HAT来处理弱隔离事务
- 有serializability/linearizability要求的系统需要共识处理，Paxos/ZAB/VR/Raft，选择哪个算法要看实际情况，特别是系统的**规模**，因为这常常和系统里的延迟有关

## 1.10 系统的延迟特性

- 延迟总是存在的：想想Grace Hopper手里那根11.78英寸的电缆
  - 带宽再怎么加还是有物理上限的
  - 延迟特性是系统设计时最重要的考量指标
     - 能承受多少网络请求其实也是这个起决定性作用
    - 不同的系统有不同的延迟
    - 不同的系统有不同的任务
    - 不同的算法有不同的特点

### 1.10.1 多核系统

- 多核系统特别是NUMA架构的，其实工作起来就是个分布式系统
  - 虽然每个core不会像分布式系统里面的node一样挂掉, 它彼此间的通信速度一般
  - 比如[Intel QPI](https://www.intel.com/content/www/us/en/io/quickpath-technology/quickpath-technology-general.html)这样的总线性质的同步网络
  - 使用了大量的硬件技术和底层协议，使得内存访问得以协调
  - [Non-temporal SSE](https://stackoverflow.com/questions/37070/what-is-the-meaning-of-non-temporal-memory-accesses-in-x86) (如MOVNTI)
- abstraction to distribution
  - MFENCE/SFENCE/LFENCE
    - Introduce a serialization point against load/store instructions
    - 典型的延迟特性是: ~100 cycles / ~30 ns
      - 强依赖硬件/缓存/系统指令集
  - [CMPXCHG Compare-and-Swap](https://en.wikipedia.org/wiki/Compare-and-swap) 
  - [LOCK](https://stackoverflow.com/questions/27837731/is-x86-cmpxchg-atomic)
    - 对整个内存加锁来保障一致性
- abstraction是有代价的
  - [hardware lock elision](https://software.intel.com/en-us/node/683688)有一些帮助但是帮助不大
  - [Mechanical Sympathy](https://mechanical-sympathy.blogspot.com/)
  - 尽量不要在多核之间进行协同任务
  - 进程或者线程的上下文切换成本可能会比较高
  - [processor affinity](https://en.wikipedia.org/wiki/Processor_affinity)
  - [High Performance Transaction Processing on Non-Uniform Hardware Topologies](https://infoscience.epfl.ch/record/219117/files/EPFL_TH7023.pdf)

### 1.10.2 局域网内

- 一般来说我们使用的云服务商提供的服务都类似于服务器就在一个LAN里面
- 延迟基本上可以控制到100ms以内
  - 但是一旦跨区就有可能时延显著增大
  - 时延还会有抖动，要提前准备好应对措施
- 和磁盘I/O比起来，网络延迟是一种怎样的延迟？
    - 云服务上的“磁盘”可能是其他的服务器在提供
    - 不是可能是，一定是吧
    - 就算不是，插在服务器上的物理硬盘也会有时延，不然I/O为什么需要“调度”？
- 但是和内存访问相比，网络的时延就相当可观了
  - 如果考虑的是吞吐量？
  - 但是使用分布式还可以是其他原因
    - 资源的sharding
    - 问题的isolating

### 1.10.3 多地多中心

- 做多地多中心的原因有
  - 终端用户感知的时延
    - 10ms的延迟人类就可以感知，最多可以忍受100ms的延迟
      - SH-BJ: 50ms
      - SH--CD: 100 ms
      - SH--GY: 200 ms
    - 如何打败光速：就近服务用户
  - 灾难恢复
- 很多人以为一个round就完成共识
  - 实际上可能需要是4个
    - 最坏情况下每次都需要4个如果对Paxos的实现不是很好（比如Cassandra）
  - 所以如果在数据中心之间搞Paxos，要考虑代价
  - 跨数据中心的时延是用户可以感知的
    - 缓存
    - 消息队列
    - 一致性不一定要那么强
    - CRDT来保障本地写
    - Causal consistency/HATs
- 非要强一致性？
  - 分区也许是个选择
    - 用户可能不会像货车帮的用户而是像滴滴的用户，不怎么跨省移动
    - 当用户跨区时，再在数据中心之间实现跨区访问
  - 当数据有更新时，放到哪个数据中心？
    - 最近的？
    - Facebook仍然所有的写操作先经过一个作为网关的数据中心
  - 当顺序一致是够用的，缓存本地读
    - 多地多中心时怎么做？

### 1.10.4 小结

这里讨论了三个不同维度的分布式系统：多核系统，在一个LAN里面部署的服务，以及通过专线互联的数个数据中心。如果说有什么可以总结的那就是，能够避免协调和共识就尽量避免，小到在一个CPU的核进行某个计算任务的闭环，大到当业务横跨广阔地域时对用户进行分区来做datacenter-pinned的方案，都是这个标准的体现。


## 1.11 常见分布式系统

### 1.11.1 Outsourced heaps

- Redis, memcached, ...
- 一般是内存里的数据结构，不会是很大规模的数据
- 如果选用的开发语言自己提供了很强的能力好像并不太需要
- 用来做缓存很棒
- 或者用来给多个平台之间进行一些“粗鲁”的数据分享
- 不是非常的安全

### 1.11.2 KV stores

- Riak, Couch, Mongo, Cassandra, RethinkDB, HDFS, ...
- 1维/2维/3维的key
- O(1)读
- 可存储大规模的数据集
- 可以认为有线性的scalability
- 可以认为没有事务机制
- 通常是linearizable/sequential的

### 1.11.3 SQL databases

- Postgres, MySQL, Percona XtraDB, Oracle, MSSQL, VoltDB, CockroachDB, ...
- 通过关系代数进行建模
- 可存储中等规模的数据集
- 处理事务特别是多条记录的事务
- 关系的维护和事务的完成需要协调机制，scalability一般
- 大多数系统提供了主从的failover切换
- 读操作的成本很大程度上受索引质量的影响
- 强一致性为主 (SI, serializable, strict serializable)

### 1.11.4 Search

- Elasticsearch, SolrCloud, ...
- 可存储中等到大型规模的数据集
- O(1)读, log-ish的搜索
- scalability很好
- 弱一致性为主

### 1.11.5 Coordination services

- Zookeeper, etcd, Consul, ...
- 可存储较小规模的数据集
- Useful as a coordination primitive for stateless services
- 强一致性为主 (sequential或者linearizable)

### 1.11.6 Streaming systems

- Storm, Spark...
- 通常是根据自己的需要自建的工具集来实现
- in-memory的数据卷，规模不会大
- 低延迟
- 高吞吐
- 弱一致性

### 1.11.7 Distributed queues

- Kafka, Kestrel, Rabbit, IronMQ, ActiveMQ, HornetQ, Beanstalk, SQS, Celery, ...
- 多节点上做持久化来确保有redundancy
- 对于可以分段执行的任务很有用
- 在无状态的服务之间进行数据传递很有用
- 唯一不会丢消息的是？Kafka？
  - 还是SQS?
- 消息队列并不会改善端到端的时延
  - 有任务立即处理掉总是比丢消息队列要快的
- 消息队列并不会改善平均吞吐量
  - 平均吞吐量总是和用户数正相关的
- 消息队列在用户有并发操作的时候并不能保证事件的顺序
  - 用户绝对会有并发操作
- 消息队列即使在用户的操作是异步的时候也不一定能保证事件的顺序
  - 比如网络问题导致事件到达顺序乱了
  - 所以不要依赖消息队列的事件顺序
- 消息队列提供了at-most-once或者at-least-once的消息投递机制
  - 任何号称做到了其他feature的消息队列（比如exactly-once）多半揣着别的东西
  - exactly-once的投递在消息被确认了之后，持久化之前接收者驾崩了会是什么情况？
  - 所以保证操作是冥等的很重要
- 消息队列对改善“尖峰时刻”的吞吐量是很有效的
  - 可以用来削峰
- 分布式消息队列在不丢数据的前提下还可以改善系统的容错性
  - 很可能只需要个TCP就够了
  - 很多人使用消息队列干的事情只是简单的IPC通信，用一个socket的write()就够
- 当runtime很挫的时候，消息队列可以帮忙

### 1.11.8 小结

分布式系统里面有各种各样的结构化的数据存储，它们是系统之间的胶水。KV和关系数据库一般用来存各种记录，KV虽然使用独立的key，用来存关系数据看起来不是那么合适，但是它提供了更好的scalability并且对partial failure有较好的承受力；相比之下，关系数据库提供了更丰富的查询功能和更强的事务机制。流式数据处理系统则主要用来进行低延迟，持续性的数据集的处理，架构上看起来更像是一套framework而不是一个数据存储。消息队列则顾名思义偏重在对**消息**的处理而不是对**变化**的处理。


## 1.12 A Pattern Language

- 开发分布式系统的一些要点
  - 一手经验
  - 他人的经验/最佳实践
  - 江湖传言
  - 只言片语
  - Cargo-culting
  - Stuff I just made up
  - YMMV

### 1.12.1 是不是可以不“分布式”

- 如果不是非搞不可，最好不搞
  - primitives/锁/线程/队列，凡此种种，没有分布式作业之前都是靠得住的
    - 在分布式系统里达到同样的功能要如何实现？
  - 什么样的计算任务需要分布式?
    - "这是大数据"
      - 现在云服务的机器有几个T的内存？
      - 现在云服务的机器有多“快”？
    - JVM可以处理什么量级的请求？50000每秒？
    - TCP上的PB呢？10000000每秒？
  - 是不是一个“可以挂掉”的服务？
  - 是不是可以做failover？
  - 是不是可以进行一些人工干预?

### 1.12.2 使用现有的系统

- 如果非分布式不可，是否需要自己来？
  - 是不是一个分布式数据库或者日志系统可以解决的？
  - 是不是用阿里云/腾讯云提供的基础设施能解决的？
  - 知道怎么开发/测试/运维/升级一个分布式系统吗？

### 1.12.3 用尽办法减少failure

- 都决定做了就买那些看起来贵得要死的机器吧
- 对软硬件的改动都要做足够的测试并且跟踪起来
  - 有staging环境吗？
- 硬件的问题总会有，但是通过花钱和找靠谱的人，可以把它发生的概率降到很低，从而使它成为一个“低优先级”的问题

### 1.12.4 但仍然要接受failure

- 分布式系统两个最大的难题之一就是**partial failure**
- 多大点儿事，对吧
  - SLA是？
  - 可以恢复吗？
  - 需要打电话给用户道歉赔钱吗？
  - 不要以为你是个伟大的程序员，你是提供服务的

### 1.12.5 备份

- 备份其实就是一个equential的一致性但
  - 只有在正确地备份了之后，才有备份
    - 有些备份程序没有保存状态，造成文件系统或者数据库崩溃
    - 外键失效/文件丢失，多搞过几次恢复你总能遇得上
    - 也不是使用分布式数据库就没事了，手一抖关键数据就被删除了
  - 但备份不仅仅是进行错误恢复，它可以进行场景重构
    - 对于理解和解决逻辑错误很有用

### 1.12.6 冗余

- 系统一定会挂
- 如何降低挂的概率？
- 在多个节点上尽量保持状态和数据的一致
  - 主备的failover是不够的
    - 备用系统不一定切得过去：缓存失效，磁盘坏的，软件版本不一致等等问题
    - 几乎没有见过大型生产系统在失效的时候能够切到备用系统
    - 尽量多活
      - 建设起来非常有难度
  - 有2份备份数据也是不够的
    - 除非这数据不重要
    - 所有备份都是3（数据中心，机房，甚至柴油发电机）
      - 特别重要的做个4/5份也没有什么关系
  - 常见的策略有哪些？
    - Camille Fournier[怎么部署zk](http://www.camilletalk.com/whilefalse/2013/05/zookeeper-and-distributed-operating.html)的？
- 只要错误是“不互相关联”的，冗余就可以增强系统的可用性
  - 所以下面的问题就算是冗余也解决不了
    - 如果同一个批次上线使用的磁盘集体驾崩了
    - 整个机架因为交换机一起挂了驾崩了
    - 停电后UPS不工作整个数据中心里的节点一起驾崩了
    - 地震这类天灾
    - 以及，如果在节点上运行的任务就是有问题的，这些节点也会一起驾崩
      - 慢查询
      - [list keys](https://stackoverflow.com/questions/41101124/list-all-keys-from-a-riak-kv-using-the-java-client)
      - [Cassandra doomstones](http://thelastpickle.com/blog/2016/07/27/about-deletes-and-tombstones.html)
    - 级联失效/雪崩
      - [Thundering-herd](https://en.wikipedia.org/wiki/Thundering_herd_problem)
      - [TCP incast](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.211.6055&rep=rep1&type=pdf)

### 1.12.7 分片

- 计算任务太大时做分片
- 一个节点上可以处理分片后的任务
  - 别太小: 太分散整体协调的overhead会增大
  - 别太大: 在各个节点之间会出现负载不均衡，又得进行调度
  - 10-100比较好
- 理想情况：计算任务是均匀的
  - 但会有hotspots
  - 但workload会因时而异
- 设计时要给出系统上限
    - 一个节点计算任务超过上限了，涌出来的任务会不会把其他的节点一个个淹死
- 分片如何进行分配？
  - 数据库内建的功能
  - ZK/Etcd
  - [Boundary's Ordasity](https://github.com/boundary/ordasity)

### 1.12.8 ID

- 你打造的分布式系统里还有东西没有唯一ID吗？
  - 考虑不同的access模式
    - Scans
    - Sorts
    - Shards
  - 如何避免协调：全局唯一，但本地生成
    - [Flake ID](http://yellerapp.com/posts/2015-02-09-flake-ids.html)
  - ID可以map到一个分片吗？
  - ID里要不要编码用户ID？

### 1.12.9 不可变值

- 永远不变的数据易于存储
  - 从不需要协调更改
  - 复制和恢复成本低
- Cassandra, Riak, 任何使用里LSM-tree的DB
  - 以及像Kafka这样的系统
- 易于验证：要不就是要不就不是
  - 传统的让人头疼的问题都没有了
  - 很容易做缓存
- 超高的可用性和持久性，可以对写操作的延时做调整和控制
  - 读操作延迟很低：可以从最近的一个副本直接读
  - 这对地理上分布广的系统非常有价值
- 需要GC
  - 但是有很多成熟的好方案了

### 1.12.10 可变的标识

- 指向不可变的值
- 指针很小，仅仅是元数据
  - 一个很小的数据库就可以放入大量的指针
  - 对于共识服务或关系数据库是好的数据结构
- 大多数时候系统里面也没有那么多指针
  - 整个数据库可能就分配一个指针来指向
  - [Datomic](https://www.datomic.com/)
- 基于标识的强一致性操作能够用不可变的HA高可用存储来实现
  - 利用CAP中AP存储的优点：低延时和可扩容
  - 利用有共识系统提供的基于小数据集的强一致性
  - 写操作可用性受存储的限制
    - 但是如果只需要读操作顺序一致，非常好做缓存
    - 如果只需要serializability还能做得更便宜
  - [Rich Hickey的演讲](https://vimeo.com/45136212)
  - Pat Helland[讲解Salesforce的存储](http://basho.com/posts/business/ricon-west-videos-keynotes/)

### 1.12.11 无冲突

- 文献里面的Conflict-free/Convergent/Commutative/Confluent是一个意思
- 顺序无关的系统总是更好构建和维护的
- 同时也减少了协调的工作量
- [CRDTs](https://github.com/mwhittaker/crdts)
- Immutable Value
- Streaming:
  - 先buffer，当知道可以compute+flush的时候再操作
  - 如果需要，对当前结果可以emit出去并且根据结果进行相应操作（监控体系）
  - 全量数据拿到后呢？
  - 银行交易系统怎么做的？
- [Behavior of Database Production Rules](https://theory.stanford.edu/~aiken/publications/papers/sigmod92.pdf)

### 1.12.12 背压与流控

- 服务之间很多时候是通过**队列**来交互的
- 服务和队列的容量是有限的
- 当负载无法被消化的时候怎么处理？
  1. 对请求进行分片，或者丢了不处理
  2. Reject，并且告知客户端系统在“维护”
  3. 采用[背压](https://github.com/ReactiveX/RxJava/wiki/Backpressure)：也就是告诉客户端缓些来
- 三种方式都是可以的
  - 但是背压可以大大减少需要重试的请求：根本没有发出来
- 背压把决定权交给了生产者，很compositional
  - 流控的设计模式，客户端永远不知道服务器咋了
  - 背压的设计模式，要流控也可以选
  - 如果异步系统最好实现背压机制，用户会少一些机会来羞辱你
- 核心:**对资源划分领域边界**
  - bounded time （比如简单的，给请求加上超时）
  - bounded use
  - Bounded queues
  - Bounded concurrency
- "[Everything Will Flow](https://www.youtube.com/watch?v=1bNOO3xxMc0)"

### 1.12.13 领域模型的服务

- 核心问题是每个domain在逻辑上都是碎片，它们之间如何完成交互
- 各个碎片有自己的技术栈，性能表现，存储需求
  - 单体应用很多采用里[多租户](https://en.wikipedia.org/wiki/Multitenancy)方式
    - 正确实现多租户很难
    - 拆成多个逻辑服务
- 如何拆分
  - 面向对象编程: 每个**名词**是个服务
    - 用户
    - 活动
    - 广告
  - 函数式编程: 每个**动词**是个服务
    - 认证
    - 搜索
    - 排序
    - 分发
  - 大型系统一般都会混合使用两种拆分方式
    - 以名词为核心构建的服务易于保障**datatype invariants**
    - 以动词为核心构建的服务易于保障**transformation invariants**
    - 所以我们经常看到一个用户服务被认证服务调用
  - 但是具体如何划分边界仍然是很tricky的
    - 服务开发和维护的成本不小，能少一个就少一个
    - 以是否构成一个完整的工作单元来衡量
    - 需要进行不同维度扩展的也分到不同的service为妙
    - 依赖项和延时特性比较一致的服务部署到一起
    - 资源（如CPU或者磁盘）互补的服务部署到一起
      - 比如: 在进行渲染的节点上使用memcache
      - 比如: Google Borg, Mesos, Kubernetes
  - 服务需要有较好的封装和抽象
    - 最好是树状结构不是网状结构
    - 暴露接口而不是暴露数据
  - 服务间进行协调需要新的协议
    - 对事务要重新进行定义
    - Sagas
      - 注意它是在单节点场景下被提出的: 针对分布式环境要小心
      - 事务必须是冥等的
    - [Typhon/Cerberus](http://www.cs.ucsb.edu/~vaibhavarora/Typhon-Ieee-Cloud-2017.pdf)
      - 多个data store上达到最终一致性的协议

### 1.12.14 康威定律

- 产品化的软件系统本质上是一个社会化的产物
- 一个团队来主导一个服务的开发
  - "[The Tyranny of Structurelessness](http://www.jofreeman.com/joreen/tyranny.htm)"
    - 权利与责任应该明确
    - 成员要进行任务的轮换
      - 增强彼此间的信息分享
    - 轮换不宜过于频繁
      - 软件研发的上下文切换成本很高
- 随着团队的不断壮大，它承担的任务和团队成员的思维会固化
  - 团队开发的服务和它们的边界也会固化
  - [Tushman & Romanelli, 1985: Organizational Evolution](https://books.google.com.ph/books?hl=zh-CN&lr=&id=JZ0rkeNvVkcC&oi=fnd&pg=PA174&dq=Tushman+%26+Romanelli,+1985:+Organizational+Evolution&ots=nQlfMeWNHk&sig=N7Vu6fccsCA6vgCy1PGQEQFKY9I&redir_esc=y#v=onepage&q=Tushman%20%26%20Romanelli%2C%201985%3A%20Organizational%20Evolution&f=false)
- 服务还是类库？
  - 不要轻易做服务，一开始先考虑类库
  - 边界良好划分的类库很容易就可以在需要的时候升级成一个服务
- 康威定律：组织边界决定了交付物的边界
  - 当类库的用户数较少或者团队的协作比较紧密时，变动较容易
  - 但是当跨多个团队时，各个用户的优先级都不一样，需要进行协调
  - 而且类库的更新需要用户自己来做（即使用Maven）
  - 服务可以使得团队间通过定义的API来进行协作，并且给这种协作加上强制约束
    - 如果是用类库的方式，需要通过很多的代码交叉review以及相应的工具才能有类似效果
- 服务提供中心化的控制力
  - 性能改进每个人都会立刻感知到
  - 技术选型更加独立可控
  - 可以先在单点进行服务的试用
  - 这些都是使用类库很难达到的
- 但服务有较大成本
  - 失效的情况复杂度高，还要考虑调用的网络延迟
  - 服务以来弄不好就是一锅粥
  - 很难进行静态的代码路径扫描
  - 测试和运维成本更高
  - 版本化是必须的但还不是技术而是艺术
- 但不要纠结服务还是类库：优秀的服务后面跑着的可以是优秀的类库

### 1.12.15 小结

- 如无必要，不要搞分布式，用一个node
- 如果要搞，弄好SLA，准备好天天下跪
- 当灾难性的问题发生时，唯一可以依靠的是备份，所以请备份
- 要提高可靠性，可以增加冗余性
- 要解决大规模的问题，可以分片
- 不可变值和可变的标识符结合使用，来构建大型的分布式系统
- 当系统越来越大时，每个模块必须独立scale，有些库可能升级成服务，要做好与此同时团队进行scale的工作

## 1.13 生产环境常见问题

- 大量“设计上”想不到的事情会发生
- 数学证明很重要，但真实系统还得I/O

### 1.13.1 分布式系统是需要企业文化作为支撑的

- 要构建/部署/运维分布式系统需要组织内各种角色相互紧密配合
  - 开发
  - 测试
  - 运维
- 同理心很重要
  - 开发需要关注环境和运维
  - 运维需要关注设计和实现
  - 好的沟通可以让问题解决得更快（我们自己推广微服务过程的经验）

### 1.13.2 测试

- 强类型语言可以很好的防止一些逻辑错误
  - 可以减少一些测试的工作量
- 但是并不能预测和控制运行时的performance
- 所以需要全面的测试能力和完备的测试集
  - 可以迅速执行完毕的基于用例的测试（example-based testing）
  - 可以在晚上跑的生成式的测试（property-based testing）
  - 可以模拟整个集群的行为进行测试
  - 可以模拟网络交互进行[concurrent interleaving](https://ieeexplore.ieee.org/document/1202441/)的控制
  - 可以自动化注入一些硬件方面的失效情况
- 测试分布式系统比测试一个本地的，单体的应用要难得多
  - 各种没想过/没听过的失效情况
  - 巨大的状态空间组合
  - 在大/中/小各个时间/空间/并发维度思考问题的能力
  - [Formal Verification](https://courses.cs.ttu.ee/pages/Formal_methods_in_model-based_testing_and_verification)
  - [Deterministic Simulation](https://www.youtube.com/watch?v=4fFDFbi3toc)

### 1.13.3 When "It's Slow"

- Jeff Hodges: [The worst bug you'll ever hear is "it's slow"](https://www.somethingsimilar.com/2013/01/14/notes-on-distributed-systems-for-young-bloods/)
  - 总会发生，很难定位
  - 因为系统是分布式的，需要对各个节点都做profile
    - 大多数的profiler都不支持这样的用法
    - [Dapper](https://research.google.com/pubs/pub36356.html)
    - [Zipkin](https://github.com/openzipkin/zipkin)
    - 其他工具方面的投资
  - Profiler的功能即使完备，也主要是发现CPU相关的问题
    - 但是出现“很慢”的情况，多数瓶颈在I/O而不是CPU
    - 存储
    - 网络
    - 消息队列
    - GC
  - 通过应用的metrics来找到问题
    - 然后深入到进程和OS层面来查看具体原因
  - 如果在同一个集群下面：
    - 1/3的节点: 多半是硬件或者配置问题
    - 大量的节点: 多半是逻辑问题，要看看分片大小/负载等关键指标
  - 尾延迟问题
    - [Jeff Dean, 2013: The Tail at Scale](https://research.google.com/pubs/pub40801.html)
    - 可以考虑[speculative parallelism](https://en.wikipedia.org/wiki/Speculative_multithreading)

### 1.13.4 监控系统

- 某种程度上监控就是一个持续的测试过程
  - 监控的性能要求高
    - 1ms量级的响应速度
      - TCP incast
    - 运维处理的响应速度：10秒内？1分钟内？能不能自动化？
  - And for capacity planning, hourly/daily seasonality is more useful
  - 按需进行设计
    - 哪些是重要的？
      - 对请求的响应是重要的
      - 节点的CPU没那么重要
    - 关键指标
      - Apdex: SLA范围内的成功响应次数
      - Latency: 0, 0.5, 0.95, 0.99, 1
        - 百分位，不是平均
        - 也不是百分位的平均
      - 负载
      - 消息队列的指标
      - 其他
        - 监控看起来没问题，用户说慢？
  - 普通的监控手段是无效的
    - trace
    - host机器的cpu/disk等metrics
    - APM
    - 很可能需要自己开发
      - 至少是metrics要自己开发
  - 分布式日志基础设施 (Zipkin, Dapper)
    - 需要极大的投入
    - [Mystery Machine](https://www.usenix.org/system/files/conference/osdi14/osdi14-paper-chow.pdf)
      - 通过日志自动关联事件
      - 找出关键路径
      - 对性能进行更好的预估和建模

### 1.13.5 日志

- 日志记录的是单个子系统的情况，在大规模系统里用处不大
  - 问题一般不是出在单个节点
    - 而一个请求往往是跨很多服务的，信息散布在多个日志文件里面
    - 需要对日志进行聚合
      - ELK, Splunk
  - 非结构化的信息很难聚合
    - 结构化所有的信息

### 1.13.6 流量投影

- 压力测试只有当模拟出来的流量和真实的流量特征一致时才有意义
- 如何从生产环境dump流量？
  - 招数1: 使用SIGUSR1杀掉进程来dump一个时间段的流量
  - 招数2: tcpdump/tcpreplay套件
  - 招数3: 从生产环境直接投影到测试环境
- [Envoy](https://github.com/envoyproxy/envoy)有一些相关的功能

### 1.13.7 版本管理

- 是艺术，不是技术
  - 意味着没有人真正知道是怎么做，但是做得好的就让你感觉美
  - 比如所有消息都有版本这个标签
  - 兼容好之前版本的逻辑
  - 通知客户的API版本过老
    - 如何进行强制升级？

### 1.13.8 发布机制

- 发布机制实际上决定了修复问题的速度
- 所以为自动化的，可控的发布做足够多的投入是值得的
  - 它是一个杠杆：做好了可以把其他各个部分的投入整体加成，反之亦然
  - 逐个节点发布，不要造成中断
    - 这意味着其实会有多个版本的应用同时在跑
      - “版本管理”一定要做好
  - 做好雪崩的防范
- 科学的进行灰度
  - 选取热心用户先灰度
  - 迅速甚至是高速的迭代
  - 考虑进行流量投影来比较新旧版本
    - 这是真正有效的检验新老版本性能的办法

### 1.13.9 功能开关

- 在一次变更之后，所有的更新如何可以比较受控的灰度到用户？
  - 把功能一个个打开，看看它们对metrics的影响
  - 逐渐把流量一个库一个库的加上去
  - 一旦出现问题可以动态关闭功能开关
- 当有些服务降级的时候，我们希望对用户而言关键的功能是可用的，所以需要动态关掉一些别的功能的能力
  - 在故障恢复的时候，先关掉一些功能也可以加快恢复的过程
- 进行功能开关设定的服务要足够健壮
  - 必须依赖足够少
    - 特别是要和主库解耦
  - 当这个服务失效时，如何做到[fail safe](http://www.codingthearchitecture.com/2010/03/23/fail_safe.html)

### 1.13.10 混沌测试

- 在生产环境进行错误注入时
  - 及时处理出现的问题，不要把演习搞成事故
  - 对关键路径的依赖进行识别
    - 关掉哪些通过API对外提供功能的服务要特别小心
  - 需要基础设施特别是监控和告警很健全，可以迅速衡量出影响并应对
  - 控制好影响范围
    - 不要动不动就想把整个数据中心弄没了看看是什么情况
      - 但也许每个季度来一次演习？
    - 不要把副本里面的太多节点一次性搞挂
    - 不要把大量的用户/请求一次性搞挂

### 1.13.11 消息队列通常是麻烦的源头

- 每个消息队列都有可能带来灾难性的问题
  - 没有一个节点的内存是无上限的，所以队列必须有“边界”
  - 边界是多少要通过埋点获取数据来进行规划，不要猜
- 消息队列主要是用来进行削峰的
  - 提高了吞吐量但是牺牲了响应时间
  - 一旦负载过大，超过了队列容量，就还是会挂，怎么办？
    - 分片
    - 背压
    - 注意埋点和监控
      - 当分片发生时，应该有告警
      - 当背压发生时，应该有告警
  - 注意消息队列的深度
    - 通常看深度就知道是不是应该扩容了
      - E2E的队列时延应该是小于平均波动
    - 增加队列的size往往是一个治标不治本的方案
  - 其实是特别复杂的工程难题：
    - Jeff Hodges[在RICON上的讲座](http://www.youtube.com/watch?v=BKqgGpAOv1w)
    - Zach Tellman的[Everything Will Flow](https://www.youtube.com/watch?v=1bNOO3xxMc0)

### 1.13.12 小结

- 一个分布式系统需要开发、测试和运维工程师通力合作
- 传统的测试手段，以及现在兴起的formal verification或者property-based的测试，可以对系统的正确性有不错的验证。但是要理解生产环境特别是生产环境的错误，一定要做好生产环境的埋点和端到端监控
- 成熟的分布式系统研发团队会投入很大的成本和精力进行工具打磨：[流量投影](http://blog.christianposta.com/microservices/traffic-shadowing-with-istio-reduce-the-risk-of-code-release/)，增量部署，功能开关化等等。

## 1.14 延伸阅读材料

- [Mixu的书](http://book.mixu.net/distsys/)
- [Jeff Hodges围绕产品环境的一些好建议](https://www.somethingsimilar.com/2013/01/14/notes-on-distributed-systems-for-young-bloods/)
- [The Fallacies of Distributed Computing](http://www.rgoarchitects.com/Files/fallacies.pdf) （实际上the fallacies系列都很棒）
- Christopher Meiklejohn的[精选论文集](http://christophermeiklejohn.com/distributed/systems/2013/07/12/readings-in-distributed-systems.html)
- Nancy Lynch的[Distributed Algorithms](https://books.google.com.ph/books/about/Distributed_Algorithms.html?id=2wsrLg-xBGgC&redir_esc=y)

