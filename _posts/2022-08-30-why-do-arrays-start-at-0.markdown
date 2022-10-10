---
layout: post
comments: true
description: "摘要"
title: "为什么数组下标从0开始？"
date: 2022-08-30 11:19:47 +0800
categories: 

- why
- questions-my-kids-asked
- science
- computer-science
- rabbit-hole

---

又是个我不知道答案，但又不想用「历史原因」来糊弄的问题。

### 现成的答案质量都一般

如果用劣质搜索引擎，你会看到一堆下面这样的原因。

但实际上，不是[这个原因](https://cloud.tencent.com/developer/article/1359222)，也不是[这个原因](https://mendylee.gitbooks.io/geeker-study-courses/content/zhuan-ye-ji-chu-pian/li-lun-xue-ke/shu-ju-jie-gou-yu-suan-fa/shu-zu-ff1a-wei-shi-yao-shu-zu-de-xia-biao-cong-0-kai-shi-bian-hao-ff1f.html)，更不是[这个原因](https://segmentfault.com/a/1190000020843066)。

如果搜索手法稍微上档次一点，你可能会看到类似于[这篇文章](http://cenalulu.github.io/linux/why-array-start-from-zero/)的观点：其实是讲解了 Mike Hoye ——用文章里的话来说——[追根刨地的科学精神][^0](http://exple.tive.org/blarg/2013/10/22/citation-needed/)找到的答案。

但是我读了 Mike Hoye 这篇文章，是花了挺大功夫考据，但他的论证过程基本上是：

1. 最初编程语言中的下标范围要不是从 1 开始，要不就是随意指定的（比如可以是-1:35)
2. Martin Richards 为了设计一种 IBM 7094 上可以快速编译的专用语言，做了大量优化，其中一个就是让数组下标变成从 0 开始。
3. 这种叫做 BCPL 的语言，启发了 B 语言，而 B 语言又启发了 C 语言。
4. C 语言大流行后，这种从 0 开始的数组下标就变成了默认的规矩。

他还举了两个例子说明之前是没有 0 开始但是有 1 开始和任意指定的：

> Algol 60 uses one-indexed arrays, and arrays in Fortran are arbitrarily indexed – they’re just a range from X to Y, and X and Y don’t even need to be positive integers.

首先，他弄反了。Algol 60 可以任意指定范围，而 Fortran 才是从 1 开始的。
其次，0 开始的数组也不是 BCPL 的发明：LISP 1.5 这些更早的语言都有从 0 开始的数组。
最后，这个论述方式让我读他有一段话的时候有点懵：

> So if your answer started with “because in C…”, you’ve been repeating a good story you heard one time, without ever asking yourself if it’s true. 

怎么说呢，你看，基本上他整篇文章浓缩一下，就是在说：

> 如果有人给你解释，这是因为 C 语言怎样怎样造成的，他就是没有好好研究。我经过了仔细研究才发现，这是因为 C 语言继承了 BCPL 的这种做法，然后流行了，造成的。


### 那么究竟是怎么回事？

我自己觉得，可能是计算机作为一个学科逐渐形成，里面的标准逐渐固化的一个体现[^1]。

对于蒙爷这代人，计算机作为一个学科存在的时间并不长是很反直觉的事情。但实际上，最早从事计算机领域的人，都来自于别的学科：数学、物理、心理学等等。

如果你看数学或者物理的材料，会发现从 0 开始和从 1 开始的索引很常见：比如多项式里大多是从 0 开始，而矩阵预算或者枚举大部分是 1 开始。

因此，在没有标准的阶段，0、1或者是任意指定的范围，都是被广泛使用的。

那么标准为什么逐渐往 0 收拢呢？

BCPL 的作者自己说过：

> BCPL was essentially designed as typeless language close to machine code. Just as in machine code registers are typically all the same size and contain values that represent almost anything, such as integers, machine addresses, truth values, characters, etc. 

也就是说，Richards 自己解释了，这样的设计更符合计算机的语义，而不是像 Mike 说的那样，仅仅是为了编译效率。

其实在更早的时间，1982 年，Dijkstra 就已经[写文章批判](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD831.html)了 ALGOL 60(他自己的宝贝)和 Pascal 使用 1 或者任意范围是错误的。

然后，可以看到也是在 C 语言之前， EBDIC 和 ASCII 等都已经是从 0 开始标记的。

再比如同一时期 APL 虽然同时支持 0 或者 1，但 [Kenneth Iverson](https://en.wikipedia.org/wiki/Kenneth_E._Iverson) 在他的《A Programming Language》[^2]里面举例时基本上都是 0 开始。

所以，可以看到，随着计算机承担的工作越来越多越来越复杂，大家开始逐渐往最符合机器语义的标准在聚拢：这也使得协作更加简单(你不需要知道引入的库的格式)。

### References

[^0]: 实际上，科学的精神不应该仅仅是竭尽全力找支撑自己论点的论据，还要尽可能站在反方试试自己能不能驳倒自己的论点。
[^1]: 但因为不是硬性的标准，所以还是有例外，比如 TLA+ 就仍然是从 1 开始的。
[^2]: [《A Programming Language》](https://www.amazon.com/Programming-Language-Kenneth-Iverson/dp/0471430145#:~:text=Iverson%2C%20explores%20how%20programming%20language,explicit%20and%20concise%20programming%20languages)是本好书。