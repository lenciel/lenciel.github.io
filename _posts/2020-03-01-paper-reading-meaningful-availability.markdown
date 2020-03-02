---
layout: post
title: "更有意义的可用性"
date: 2020-03-01 11:26:49 +0800
comments: true
mathjax: true
categories:

- papers-i-read
- metrics
---

最近 Google 发了一篇论文：《[更有意义的可用性](https://www.usenix.org/system/files/nsdi20spring_hauer_prepub.pdf)》。

技术管理圈子里有句玩笑话，「只要选对了指标，就没有搞不垮的团队」。

选择正确的指标来考核研发团队的绩效非常关键。

同时也非常困难。

我在两三年前开始使用发布频率、lead time、MTTR、回滚率等四个指标来[考核团队绩效](https://lenciel.com/2018/08/how-to-measure-tech-organization-performance/)，并且把发布频率当成北极星指标。

这四个指标里，发布频率和 lead time 主要表征效率，而 MTTR 和回滚率则主要表征可用性和质量。

在使用过程中一直有点问题的是 MTTR。

## 可用性是好指标吗？

一提到可用性大家就会想到那几个 9。

|可靠性级别|允许的故障时间<br/>（每年）|允许的故障时间<br/>（每季度）|允许的故障时间<br/>（每 28 天）|
|---|---|---|---|
| 90%  |  36 天 12 小时  | 9 天  | 2 天 19 小时 12 分 |
| 95% | 18 天 6 小时  | 4 天 12 小时  | 1 天 9 小时 36 分  |
|  99% | 3 天 15 小时 35 分 |  21 小时 36 分 | 6 小时 43 分 12 秒  |
| 99.5%  | 1 天 19 小时 48 分  | 10 小时 48 分  | 3 小时 21 分 36 秒  |
| 99.9%  |  8 小时 45 分 36 秒 |  2h 9 分 36 秒 |  40 分 19 秒 |
| 99.95%  |  4 小时 22 分 48 秒 |  1 小时 4 分 48 秒 | 20 分 10 秒  |
|  99.99% |  52 分 33.6 秒 | 12 分 57.6 秒 | 4 分 1.9 秒  |
|  99.999% | 5 分 15.4 秒  | 1 分 17.8 秒 | 24.2 秒 |

<br/>
在国内技术圈你还经常可以看到或者听到「高可用」这个词。

从[畅销书的名字](https://search.jd.com/Search?keyword=%E9%AB%98%E5%8F%AF%E7%94%A8&enc=utf-8)就能看出来「可用」是多么重要。

但实际上，「可用性」只是软件系统的核心设计指标「[RAMS](https://en.wikipedia.org/wiki/RAMS)」里面的一个：

- Reliability
- Availability
- Maintainability
- Safety

甚至在我很喜欢的《[Designing Data-Intensive Applications](https://www.amazon.com/dp/B06XPJML5D/)》里，它提到的应用系统主要追求的三个方面就直接没有「可用性」，而是：

- Reliability
- Scalability
- Maintainability

我觉得这里的原因，主要是「可用」更多是用户纬度的一个感受（系统在运行的过程中有多少时间是可以被用户使用的）。它本身是以「可靠性」（系统在出故障的情况十分能够完成工作）和「可维护性」（系统进行定期维护和故障处理十分方便）等其他工程纬度的指标为基础的[^1]。

按照 Google 那本 SRE 书里面的说法，好的指标应该有三个特性：

- Meaningful
- Proportional
- Actionable

很明显，「可用性」这个指标不太符合第三点：因为你要想让系统更可用，主要是通过提高其他指标表征的工程能力。

但更重要的问题是，「可用性」在「Meaningful」方面也有些问题。

## 意义不够明确

### 基于时间计算的问题

考虑可用性很容易想到的首先是基于时间的计算方式：

> Availability = Uptime / (Uptime + Downtime)

但是系统怎样算「运行」怎样算「失效」？比如，可以登录添加购物车不能结账算「运行」还是「失效」？

相信每一个奋战过双十一的人都有自己的看法。

所以有了一个看起来更好的计算方式：

> Availability = MTTF / (MTTF + MTTR)

北京正常成都打不开算什么？有意的服务降级算哪边？究竟处理什么样的问题算 MTTR？

相信每一个做分布式系统的人都明白，「partial failure」根本避免不了。

而且，系统处于高峰前的不可用和没有流量时不可用，很明显应该有所区分。

为了尝试克服这里面的歧义，一些公司转向了基于次数的计算方式。

### 基于次数计算的问题

为了克服基于时间计算可用性的问题，最常见的改进是：

> Availability = Successful requests / Total requests

这比以时间为基础的指标更加合理，但也存在一些问题:

1. 它主要说明的是高频用户的体验(不同用户的活动水平可以有 3 个数量级的差异)。
2. 它很难对应到最终用户的实际体验。
3. 当用户感知到系统故障时，请求会大量减少，这会带来数据上的巨大偏差。

## 更有意义的指标

基于时间和基于次数计算都有各自的问题，因此我们实际上没有办法统计类似于下面这样的可用性指标：

- 每小时最高 10 秒的不良可用性
- 每季度最高使用时间 6 小时的不良可用性

Google 的做法从概念上来讲不复杂：就是把 uptime 考察对象从系统切换到用户，一个用户的 uptime 可以是另一个用户的 downtime。然后综合所有用户的统计数据，就可以综合基于时间和基于次数计算的优势，得到一个 user uptime：

$$user \ uptime =\frac{ \sum_{u \in users} uptime(u) }{ \sum_{u \in users} uptime(u) + downtime(u) }$$

难点在于，如何获得每个用户的 uptime 和 downtime：

- 如果是通过探针，那么你很难去对每个用户都做一个不断发送请求的探针。
- 如果是通过统计用户真实请求，那么你会遇上用户请求稀疏造成数据失效。

Google 在论文里面提出的计算方法是：

> After a successful (or failing) operation, assume that the system is up (or down) until the user sees evidence to the contrary.

另外，还有一个概念是「截止期」（cutoff time）：用户平均请求时间间隔的 99 分位。如果一个用户发送了一个请求，然后在截止期内没有再发送请求，则既不计入 uptime 也不计入 downtime，而是计入 inactive time：

![image holder](/downloads/images/2020_02/meaningful_availability_fig_5.jpeg "Don't touch me...")

这个指标显然是 meaningful 并且 proportional 的，那么它是 actionable 的吗？

## 可操作性

为了增强指标对操作层面的指导意义，Google 的做法是：

> To make availability information actionable, we want to be able to distinguish between outages of different durations (e.g. one user outage of 1000 minutes, vs 1000 outages of 1 minute). In general, the bigger the window you examine availability over, the better the availability figure looks. To address this, windowed user-uptime combines information from all timescales (window sizes) simultaneously. For a given window size w, availability is computed by enumerating all windows of size w, computing the availability of each, and then taking the lowest value. Taken together the results are called the minimal cumulative ratio or MCR.

所以，MCR 是枚举固定大小的时间窗口，计算每个窗口的可用性，然后取最小值来计算的。

我们来看论文里面的例子：

![image holder](/downloads/images/2020_02/meaningful_availability_fig_9.jpeg "Don't touch me...")

和别的可用性指标的图表不同，这里的信息变得非常丰富:

- 本季度的总体可用率约为 4 个 9
- 没有一分钟或更长的时间窗口可用性低于 92%，并且
- 根据曲线的拐点(大约 2 小时的时间窗) ，我们可以推断出有持续两小时左右的故障，使可用性下降到 92%

曲线的拐点还告诉我们应该对什么大小的窗口感兴趣，技术团队应该怎样去解决：

![image holder](/downloads/images/2020_02/meaningful_availability_fig_10.jpeg "Don't touch me...")

然后，在文章的 5.2 节，提出了一个简化的计算方式：保持窗口大小线性倍增(例如 2 的幂)来采样。

最后，在文章的第 6 节，以实例说明了所有讨论过的基于时间和基于计数的指标的可用性指标的限制，并给出了 计算窗口化的 user uptime 的实际例子：

![image holder](/downloads/images/2020_02/meaningful_availability_fig_20.jpeg "Don't touch me...")

可以看到 Hangouts 的可用性受到了一个 4 小时事件的影响(曲线拐点) ，而 Drive 没有明显的拐点。这表明 Google 云盘的系统不是单一的宕机引起的可用性差，而是频繁的短故障：这往往意味着如果不解决系统层面的问题，故障时间根本降不下来。

论文的最后一句话是：

> …we are confident that windowed user-uptime is broadly applicable: any cloud service provider should be able to implement it.

所以我们也试试吧。

[^1]: [American Society for Quality](https://asq.org/quality-resources/quality-glossary/r) 2011 年版本
