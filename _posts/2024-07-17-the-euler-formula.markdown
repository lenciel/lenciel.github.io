---
layout: post
comments: true
mathjax: true
description: "欧拉公式之所以也被称为「上帝公式」，是不是因为普通人记住它是这样的就行了，至于为什么，那是上帝才知道的事情？本系列尝试用娃能听懂的话，讲一下欧拉公式以及它的特例，欧拉恒等式…"
title: "欧拉恒等式是啥意思（1）"
date: 2024-07-17 01:05:08 +0800
categories:
- math
- questions-my-kids-asked
- data-visualization
---

欧拉公式的名号很多，比如「最美公式」，「上帝公式」...我俩都很喜欢的费曼称其为「我们的珍宝」和「数学中最非凡的公式」：

> $$e^{i\theta} = cos(\theta) + isin(\theta)$$

我给你看[Alan Becker](https://www.youtube.com/@alanbecker){:target="_blank"} 的视频{% sidenote 'sn-id-1' '不能翻墙的同学可以看看 B 站上的[搬运](https://b23.tv/wIu2f8U){:target="_blank"}。' %}时你第一次看到了「欧拉恒等式」，也就是欧拉公式当 $$\theta=\pi$$ 时的特定形式：

> $$e^{i\pi} + 1 = 0$$

后来你在别的书上又看到了，就来问：「有人说它最美是因为欧拉找出了数学里五个最重要的数字（$$e$$、$$\pi$$、$$i$$、$$0$$、$$1$$）如此简洁的关系。但，这个式子究竟啥意思？」

我说，这问题有个很简洁的答案：它之所以也被称为「上帝公式」是因为普通人记住它是这样的就行了，至于为什么，那是上帝才知道的事情，呵呵呵呵...

当然，这只是我为了好好回答这个问题争取点儿时间。下面我就试着用你能理解的方式{% sidenote 'sn-id-2' '正经的推导证明大概是把那三坨东西都泰勒展开，这个就以后你自己玩吧。' %}聊聊，欧拉公式究竟啥意思。


<h3>目录</h3>

- TOC
{:toc}

要理解欧拉公式，先要解决那两个你不太熟悉的数：

- 虚数单位：$$i$$
- 自然对数的底：$$e$$

为了搞明白它们，我们得先看看数系。

### 数系

数系就是数字的体系。

数学的发展，伴随着数系从掰手指头的自然数，往整数、有理数、无理数、实数、虚数等复杂体系的发展。

#### 自然数

「自然数」的英文是 Natural Numbers，使用 $$\mathbb{N}$$ 来表示，写成集合的形式就是：

> $$\mathbb{N} = \{1, 2, 3, 4, \dots \}$$

因为人们一开始只有加法，而这个计算对自然数来说是「封闭的」——也就是两个自然数怎么加也还是自然数——所以相当长一段时间，自然数就够用了。

但是减法的出现破坏了封闭性。比如  $$ 2-3 $$ 的结果显然没法用自然数来表示，于是整数出现了。

#### 整数

「整数」的英文是 Integer，但是记号却是 $$\mathbb{Z}$$ ，这是因为取了德语 [版本的首字母](https://de.wikipedia.org/wiki/Integer_(Datentyp){:target="_blank"})。它的集合形式是：

> $$\mathbb{Z} = \{ \dots, -2, -1, 0, 1, 2, \dots \}$$

整数的加减法计算都是封闭的，但是乘除出现之后，人们发现除运算是不封闭的，于是有理数出现了。

#### 有理数

「有理数」的英文是 Rational Numbers{% sidenote 'sn-id-3' '关于英文里用 rational 是不是从 ratio 来的，以及翻译成中文的时候为啥叫「有理」，一直有一些传说，我比较同意[这里的说法](https://zhuanlan.zhihu.com/p/174835489){:target="_blank"}。' %}，记号是 $$\mathbb{Q}$$ ，这是取了德语「商（Quotient）」的首字母，因为定义是分母非零的两个整数相除的商，表示成集合就是：

> $$\mathbb{Q} = \{ \frac{m}{n} \text{ : } m\in \mathbb{Z}, n\in \mathbb{Z}, n\neq 0 \}$$

有理数的加减乘除计算都是封闭的，但是乘方开方出现之后，人们发现开方运算是不封闭的，于是无理数出现了。

你可能会问，人们为啥不停发明这些破坏封闭性的运算方式呢？比如开方乘方，平时生活中好像没什么用。

因为这是公元前 500 年左右，当时搞数学是代数和几何一起搞的。比如毕达哥拉斯和他带领的以他名字命名的「毕达哥拉斯学派」，一天到晚都在倒腾线段、三角、矩形、圆...他们独立发现了勾股定理，当然就会用到乘方和开方{% sidenote 'sn-id-4' '开方的符号本来是拉丁语表示边长的「latus」的首字母变形。是后世的包括笛卡尔在内的数学家做了一些变化才写成了今天的样子。' %}：实际上正是这个学派的希帕索斯在计算等腰直角三角形的边长时，找到了第一个无理数 $$\sqrt{2}$$，触发所谓的「[第一次数学危机](https://m.thepaper.cn/newsDetail_forward_4258267){:target="_blank"}」，也给自己带来了厄运。

#### 无理数、实数、虚数和复数

「无理数」的英文是 Irrational Numbers，它无法表示成两个整数的比值，常被说成「无限不循环的小数」。

人们把「无理数」和「有理数」的集合被称为「实数」，英文是 Real Numbers，记作 $$\mathbb{R}$$ ，它可以表示一根数轴上的所有数，对当时大部分计算都够用了。但仍然有一些情况，比如求解一些一元高次方程的时候，会有负数开根号的情况出现。

到了十七世纪，笛卡尔把这些负数根称为虚数，英文是 Imaginary Numbers，表达它们没有意义。但很快，[棣莫弗](https://zh.wikipedia.org/zh-hans/%E4%BA%9E%E4%BC%AF%E6%8B%89%E7%BD%95%C2%B7%E6%A3%A3%E8%8E%AB%E5%BC%97){:target="_blank"}和欧拉觉得，如果把 $$\sqrt{-1}$$ 记为一个虚数单位，定义形式如下的数为复数（英文是 Complex Numbers）：

> $$\mathbb{C} = \{ a+b*\sqrt{-1} \text{ : } a\in \mathbb{Z}, b\in \mathbb{Z} \}$$

它也就从实数的一根数轴扩展为一个复平面。

后来欧拉觉得 $$\sqrt{-1}$$ 写起来复杂，简化成了 $$i$$，这就是 $$i$$ 的由来。

### 特殊的无理数

常用的无理数大都有特殊含义。有些比较好理解，比如圆周率 $$\pi$$，比如 $$\sin45°$$。

被称为「欧拉数」的，颇为拗口的「自然对数的底」 $$e$$ 又是什么意思，为啥它约等于 2.71828？

####  $$e$$ 与复利问题

实际上 $$e$$ 这个数不是欧拉发现的，而是 [Jacob Bernoulli](https://zh.wikipedia.org/wiki/%E9%9B%85%E5%90%84%E5%B8%83%C2%B7%E4%BC%AF%E5%8A%AA%E5%88%A9){:target="_blank"} 在研究复利的问题时算出来的：

> 在一年还清的利滚利业务中，借款利率和还款频率是比例关系（比如一年一次还款利率 100%，半年一次 50%，一个季度一次 25%，以此类推）。放贷的人想知道，如果把还款周期变得很短，虽然每个周期利息看起来很低，但总利息会不会变得很高，自己能靠这个发财。

这是个典型的复利问题。你借了 1 块钱，还款周期 1 年，那么还钱的时候总共的本息是：

> $$1+1*100\%=2$$

如果还款周期变成半年，利率也折半，那么半年时的本息总和为：

> $$1+1*\frac{100\%}{2}=1.5$$

年底的时候利滚利应还：

> $$(1+1*\frac{100\%}{2})^2=2.25$$

以此类推，如果还款周期变成一个季度，利率变成 25%，那么年底的时候利滚利应还：

> $$(1+1*\frac{100\%}{4})^4=2.44140625$$

这么看来，利息确实在不断增加，放贷的大哥想法好像是成立的。但如果实际去算算就会发现，在周期不断变小的过程中，利息增加的速度会迅速下降，超过 2.5 之后就增长非常缓慢了：

<link rel="stylesheet" type="text/css" href="{{ site.static_base }}/downloads/static/css/ion.rangeSlider.min.css" />
<link rel="stylesheet" type="text/css" href="{{ site.static_base }}/downloads/static/css/katex.min.css" />
<link rel="stylesheet" type="text/css" href="{{ site.static_base }}/downloads/static/css/euler.css" />

<script type="text/javascript" src="{{ site.static_base }}/downloads/static/js/rangeslider.min.js"></script>
<script type="text/javascript" src="{{ site.static_base }}/downloads/static/js/katex.min.js"></script>
<script type="text/javascript" src="{{ site.static_base }}/downloads/static/js/p5.min.js"></script>
<script type="text/javascript" src="{{ site.static_base }}/downloads/static/js/euler.js"></script>

<div id="id-canvas-container-1" class="canvasContainer"></div>

<div id="id-tex-container-1" class="ktexContainer">
<div id="id-tex-1"></div>
</div>

<div class="sliderContainer">
<input type="text" id="id-slider-1" name="slider-1-name" value="" />
</div>

Jacob Bernoulli 也发现了这点。他最终通过计算得出，总利息收益不会一直增加，而是收敛到 2.71828 附近，不信你也试试：

<div id="id-tex-container-2" class="ktexContainer">
<div id="id-tex-2"></div>
</div>

<div class="sliderContainer">
<input type="text" id="id-slider-2" name="slider-2-name" value="" />
</div>

这个数为什么被称为欧拉数{% sidenote 'sn-id-5' '在[这本书](https://press.princeton.edu/books/paperback/9780691168487/e-the-story-of-a-number){:target="_blank"}里面有详细的讲解，也推荐看看[这篇文章](https://www.scirp.org/journal/paperinformation?paperid=120075){:target="_blank"}。' %}？

首先是那个时候研究这个无理数的人很少。欧拉用自己名字的首字母 $$e$$ 表示这个无理数（虽然莱布尼茨在他之前用 $$b$$ ），然后在发表的文章以及给其他数学家的信件里大量使用，慢慢地其他人也就接受了。

其次，最重要的是，他确实在这个无理数的研究上做出了突出贡献。比如 1748 年，他在《[Introductio in Analysin infinitorum](https://en.wikipedia.org/wiki/Introductio_in_analysin_infinitorum){:target="_blank"}》里证明了：

> $$ e = 1 + \frac{1}{1!} + \frac{1}{2!} + \frac{1}{3!} + \frac{1}{4!} + ...  $$ 

在此基础上，他不但给出了 $$e$$ 小数点后 18 位的近似值，它与正弦和余弦函数的关系，还讨论了一些有趣的连分式展开{% sidenote 'sn-id-6' '还记得之前我们聊过的，连分式展开的主要作用就是用有理数表示无理数。' %}，比如：

> $$\frac{e-1}{2} = \cfrac{1}{1+\cfrac{1}{6+\cfrac{1}{10+\cfrac{1}{14+\cdots}}}} $$

这个看起来很不自然的数为什么又跟自然对数有关系，又怎么跟 $$\pi$$ 关联上的，最终出来了欧拉公式，我们就下回再说...



