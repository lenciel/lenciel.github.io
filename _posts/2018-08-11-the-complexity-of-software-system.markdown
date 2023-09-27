---
layout: post
sidenote: false
title: "软件的复杂度"
date: 2018-08-11 03:47:41 +0800
comments: true
categories:

- software-engineering
- writing

---

人类创造了很多复杂度极高的系统：社会、经济体、软件和网络等等。在处理这些复杂系统方面，科学理论和实践上的进步其实非常小。

查一下 ICCS（The International Conference on Complex Systems）的[2018会议](http://www.necsi.edu/events/iccs2018/)你会发现，无论研究对象是什么，大家背后的数学基础或者方法论还是高度趋同的。

比如[Natalia Komorova](https://www.math.uci.edu/~komarova/)关于癌症突变的人口动态以及它如何受到维数的影响的研究，跟[Cesar Hidalgo](https://www.media.mit.edu/people/hidalgo/overview/)关于[相关性原理](https://link.springer.com/chapter/10.1007/978-3-319-96661-8_46)和[经济地理学](https://en.wikipedia.org/wiki/Economic_geography)的讲座，思路都是基本一致的。

另一个例子是[Nassim Taleb](http://www.fooledbyrandomness.com/)和[Stephen Wolfram](https://en.wikipedia.org/wiki/Stephen_Wolfram)，两个超级大牛的研究和观点上有那么多的共同点，让人觉得好像是平行世界的两个实例被我们同时接触到了。

在软件开发这个领域，当我们提交代码的时候，常常会有「随便动了一个看似无关紧要的地方，整个系统就崩塌了」的体验。这种隐藏的耦合性，其实也说明了软件的复杂度之高，趋于一个有机体。

为什么整个软件工程，无论是架构还是实现的方方面面，都是在管理复杂度，但却没有人讨论它呢？哪怕是从业者，也有很多都不太知道[Postel定律](https://en.wikipedia.org/wiki/Robustness_principle)，[Conway定律](https://en.wikipedia.org/wiki/Conway%27s_law)或[抽象漏泄定律](https://en.wikipedia.org/wiki/Leaky_abstraction)。

我觉得这很可能跟计算机科学的数学基础有关系：整个学科是基于离散数学的，而离散的部分聚合时，其实需要连续的数学工具来理解其行为。实际上，现在也确实有一些团队在采用反馈和控制理论，来尝试对软件系统的复杂度做[更好的控制](https://thenewstack.io/a-tip-from-mechanical-engineering-use-control-theory-to-better-auto-scale-systems/)了。