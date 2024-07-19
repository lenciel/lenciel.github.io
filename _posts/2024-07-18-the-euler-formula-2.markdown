---
layout: post
comments: true
mathjax: true
description: "e 为什么是自然的？因为数学这个体系，从数字到运算，大部分是人类「定义」出来的。哪怕是无理数，我们定义圆的周长比上直径是 pi，我们定义 2 的平方根是根号 2。因为我们给了定义，所以它们很好理解——也所以，它们不是「自然」的。反观e，它无需人类定义，就躺在那里，等着人类去「发现」：数学史上这样的情况并不多，何况，这个发现过程是从对数和指数两个方向，不断靠近的..."
title: "欧拉恒等式是啥意思（2）"
date: 2024-07-18 21:56:42 +0800
categories:
- math
- questions-my-kids-asked
- data-visualization
---

[上次](/2024/07/the-euler-formula/)我们主要说了数系的基本概念，以及 $$e$$ 怎么被雅各布·伯努利在研究复利的过程中发现，又由欧拉在后续的研究中正式命名。

继续讲它跟三角函数、复平面的关系之前，有个不能绕过去的问题：大人们介绍 $$e$$ 的时候总说它是自然常数，因为是自然对数的底。但发现它的过程里为啥没有出现对数呢？而且，这么个无限不循环的数，又自然在哪里呢？

<h3>目录</h3>

- TOC
{:toc}

### 对数

知道 $$e$$ 是算复利的时候发现的，就明白先有「自然对数」，然后它的底被叫做「自然常数」是错误的理解。

是人们先把 $$e$$ 叫成了「自然常数」，然后它作底的对数才叫「自然对数」。

容易有这样的误会，是因为对数和指数是一对逆运算。很多人会觉得，它们应该是一起被发明，然后人们再研究里面包含了自然常数的特例。

实际上，对数先于指数，被独立发明。只不过像指数问题一样，$$e$$ 的身影也穿插在对数问题的研究过程中，始终闪闪发亮。

#### 对数的发明

对数大家公认是[约翰.纳皮尔](https://zh.wikipedia.org/zh-hans/%E7%B4%84%E7%BF%B0%C2%B7%E7%B4%8D%E7%9A%AE%E7%88%BE){:target="_blank"}发明的，比指数来得早一百多年，目的是为了简化计算。

人类像今天一样计算设备触手可及的历史并不长：你爷爷年轻的时候在地质队还得用计算尺，[好的计算器](/2019/01/hp-35/)卖得很贵。

所以几百年前，有些如天文学家、航海家的职业，每天手搓 25325233*1.3235456 这样的计算很多次，非常崩溃。这时候已经有人（比如开普勒的老师[第谷·布拉厄](https://zh.wikipedia.org/zh-cn/%E7%AC%AC%E8%B0%B7%C2%B7%E5%B8%83%E6%8B%89%E8%B5%AB){:target="_blank"}{% sidenote 'sn-id-1' '这兄弟据说是《哈姆雷特》的原型，八卦很多，有兴趣你可以[看看](https://www.sohu.com/a/503505380_574714){:target="_blank"}。' %}）用一些公式把乘除法变成加减法然后直接查三角函数表来简化计算：

> $$ 2\sin(A)\cos(B)=\sin(A+B) + \sin(A-B) $$

于是天文学家和数学家们就开始考虑更具普遍性的「乘除法变成加减法」。约翰.纳皮尔大概在 1594 年据传是从国王的御医那里了解到第谷的做法，二十年后，于 1614 年 6 月出版了《[A Description of the Admirable Table of Logarithmes](https://www.amazon.com/Description-Admirable-Table-Logarithmes/dp/1482618311){:target="_blank"}》（**为什么用了二十年？我猜他想法形成很快，但手搓了数百万次超大数字的乘法计算，花掉了二十年**）。

在这本书里，纳皮尔定义了所谓的「纳皮尔对数」{% sidenote 'sn-id-2' '从结构上不难猜到，这是滑动计算尺的祖先。' %}：

{% picture /downloads/images/2024_07/napier_log.png --alt napier_log.png %}\
<small>图 1. 纳皮尔书里对数定义的插图</small>

这张看起来有点不知所云的插图现代化一点的版本在[这篇文章](https://www.scirp.org/journal/paperinformation?paperid=120075){:target="_blank"}里面有：

{% picture /downloads/images/2024_07/napier_log_exp.png --alt napier_log_exp.png %}\
<small>图 2. 纳皮尔对数的现代化解释图</small>

首先，纳皮尔构造了两个运动的粒子{% sidenote 'sn-id-3' '有人觉得纳皮尔这样用运动模型去研究数学问题实在是匪夷所思。但我觉得这是因为他同时也研究天文的原因：这个模型本质上不就很类似于在绕着太阳转的地球上会看太阳吗。' %}。上面那个粒子 $$b$$ 在一条无穷长的射线上做匀速运动；下面那个粒子 $$\beta $$ 和它同时以同样速度出发，然后在下面那条有限长度的线段 $$\vec{\alpha\omega}$$ 上做变速运动，其运动速度取粒子到线段终点的距离 $$x$$ 的数值。

然后纳皮尔定义 $$b$$ 粒子距离起点 $$A$$ 的数值 $$y$$ ，就是 x 的纳皮尔对数：

> $$NapLog(x) = y$$

为了制作对数表，纳皮尔需要 $$\vec{\alpha\omega}$$ 的长度是个足够大的数字。参考当时的三角函数表是七位数字，纳皮尔最终把 $$\vec{\alpha\omega}$$ 的长度定为 $$10^7$$ （估计再大他这辈子也算不完了），得到：

> $$NapLog(x) = 10^7\ln(\frac{10^7}{x})$$

于是一个纳皮尔对数求底是：

> $$x = 10^7(1-10^{-7})^{NapLog(x)}$$

最终他给出的就是一张不满了密密麻麻数字可以正着查也可以反着查的对数表：

{% picture /downloads/images/2024_07/Napier's_Mirici_Logarithmorum_table_for_19_deg.agr.jpg --alt Napier's_Mirici_Logarithmorum_table_for_19_deg.agr.jpg %}\
<small>图 3. 纳皮尔二十年的心血主要就是这张表</small>

下面我们来试试这个对数表有多厉害。

任选两个 100000-2000000 之间的大数，求它们的乘积的平方根。然后，我们对比一下直接用它们的纳皮尔对数求和后平均，再求底的结果。

**看最后一行的红色误差可以看到，无论数字怎么变化，误差都不会超过 1**：

<div id="id-tex-container" class="ktexContainer">
<div class="ktexInsYellow ktexIns" id="id-tex-2-1"></div>
<div class="ktexInsGreen ktexIns" id="id-tex-2-2"></div>
<div class="ktexInsBlue ktexIns" id="id-tex-2-3"></div>
<div class="ktexInsBlue ktexIns" id="id-tex-2-4"></div>
<div class="ktexInsBlue ktexIns" id="id-tex-2-5"></div>
<div class="ktexInsRed ktexIns" id="id-tex-2-6"></div>
</div>

<div class="sliderContainer" id="id-slider-container-1">
<input type="text" id="id-slider-2-1" name="slider-1-name" value="" />
</div>
<div class="sliderContainer" id="id-slider-container-2">
<input type="text" id="id-slider-2-2" name="slider-2-name" value="" />
</div>
<link rel="stylesheet" type="text/css" href="{{ site.static_base }}/downloads/static/css/ion.rangeSlider.min.css" />
<link rel="stylesheet" type="text/css" href="{{ site.static_base }}/downloads/static/css/katex.min.css" />
<link rel="stylesheet" type="text/css" href="{{ site.static_base }}/downloads/static/css/euler2.css" />

<script type="text/javascript" src="{{ site.static_base }}/downloads/static/js/rangeslider.min.js"></script>
<script type="text/javascript" src="{{ site.static_base }}/downloads/static/js/katex.min.js"></script>
<script type="text/javascript" src="{{ site.static_base }}/downloads/static/js/p5.min.js"></script>
<script type="text/javascript" src="{{ site.static_base }}/downloads/static/js/euler2.js"></script>

#### 对数的发展

和纳皮尔几乎同时期，并且在很多地方被认为和纳皮尔是对数的共同发明人的[约斯特·比尔吉](https://zh.wikipedia.org/wiki/%E7%BA%A6%E6%96%AF%E7%89%B9%C2%B7%E6%AF%94%E5%B0%94%E5%90%89){:target="_blank"}，是一名瑞士钟表匠、天文仪器制作师和数学家。

他独立于纳皮尔发表了另一张对数表，两者实际上的区别是底数上的区别：纳皮尔使用了$$\textstyle (1-10^{-7})^{10^7}$$，而他使用了$$\textstyle (1+10^{-4})^{10^4}$$。

同时，英国数学家[亨利·布里格斯](https://en.wikipedia.org/wiki/Henry_Briggs_(mathematician)){:target="blank"}在纳皮尔的书出版了两年后，到爱丁堡拜访了他，然后于次年提出了一些改进意见，包括以 10 为底的对数的使用，也就是今天我们常说的标准对数$$\textstyle \log_{10}(x)$$ 或者记作 $$\textstyle \lg(x) $$。

1624 年，亨利·布里格斯出版了对开本《[Arithmetica Logarithmica](https://archive.org/details/arithmeticalogar00brig){:target="_blank"}》，其中包含三万个自然数的对数，精确到小数点后 14 位（$$\textstyle [1, 20000]$$ 和 $$\textstyle [90001, 100000]$$）。

荷兰数学家兼出版商[佛拉哥](https://en.wikipedia.org/wiki/Adriaan_Vlacq){:target="_blank"}在布里格斯的基础上加以改进（主要是补齐了 $$\textstyle [20001, 90000]$$ 的部分），他的这张对数表在欧洲迅速普及开来。

但这项关于数字覆盖量和精度的比赛还没有结束，比如[汤普森](https://en.wikipedia.org/wiki/Alexander_John_Thompson){:target="_blank"}在 1652 年发表了一张和佛拉哥同样范围的对数表，但通过插值算到了小数点后 20 位。

#### 自然常数与自然对数

对数发展到这里，大家对于大数乘除计算的需求基本被满足了，接下来事情的发展很有趣。

大约 1665 年，牛顿把 $$\textstyle {\frac {1}{1+x}}$$ 展开并逐项积分，得到了自然对数的无穷级数，但是他没把这东西叫做「自然对数」的无穷级数。

这个叫法最早见于[尼古拉斯·麦卡托](https://zh.wikipedia.org/zh-sg/%E5%B0%BC%E5%8F%A4%E6%8B%89%E6%96%AF%C2%B7%E9%BA%A5%E5%8D%A1%E6%89%98?oldformat=true){:target="_blank"}在 1668 年出版的著作《Logarithmo-technia》，他独立发现了同样的级数，即自然对数的麦卡托级数，也称为[牛顿-麦卡托级数](https://zh.wikipedia.org/w/index.php?title=%E5%A2%A8%E5%8D%A1%E6%89%98%E7%B4%9A%E6%95%B8&oldformat=true&variant=zh-sg){:target="_blank"}。

后来，在 1690-1691 年间，莱布尼兹给惠更斯的信中提到了自然对数的底，不过当时他用的字母是 $$b$$，因为那时候就没有标准，大家都随意使用自己选择的字母来表示。

接下来，上篇提到的欧拉，从 1727 年开始频繁使用 $$e$$ 来表示自然常数。

大约 1730 年，欧拉正式定义了互为逆函数的指数函数和自然对数{% sidenote 'sn-id-4' '但是今天这种 $$\ln(x)$$ 形式的记号又要等到 1893 年[皮亚诺](https://zh.wikipedia.org/wiki/%E6%9C%B1%E5%A1%9E%E4%BD%A9%C2%B7%E7%9A%AE%E4%BA%9E%E8%AB%BE){:target="_blank"}提出才有了。' %}：

> $$ e^{x}=\lim _{n\rightarrow \infty }\left(1+{\frac {x}{n}}\right)^{n}  \iff  \ln(x)=\lim _{n\rightarrow \infty }n\left(x^{\frac {1}{n}}-1\right) $$

**你看，完全是另外一条线的人，推导出了自然常数，然后最终定义了自然对数。理解这是怎么回事，也就理解了为什么 $$e$$ 是「自然」的。**

### $$e$$ 「自然」在哪里？

数学这个体系，从数字到运算，大部分是人类「定义」出来的。

哪怕是无理数，我们定义圆的周长比上直径是 $$\pi$$ ，我们定义 2 的平方根是 $$\sqrt{2}$$ 。

**因为我们给了定义，所以它们很好理解——也所以，它们不是「自然」的。**

反观 $$e$$，**它无需人类定义，就躺在那里，等着人类去「发现」**：数学史上这样的情况并不多，何况，这个发现过程是从对数和指数两个方向，不断靠近的。

#### 对数里的「自然」

纳皮尔、比尔吉、布里格斯这些人，他们弄对数的出发点是解决大数计算，需求就是对数字的覆盖面大，精度高。

他们构建整个体系，根据的是自己的经验：长期弄天文对运动的理解，代数到几何的映射等等。里面数字的选择，就更是这样了。

为啥纳皮尔要用 $$ 10^7 $$ 这么大的数字作为 $$\vec{\alpha\omega}$$ 的长度？因为他「发现」，这样做出来的对数表数字密度才够。

当时的纳皮尔没法理解的是，自己凭经验做的这些操作，实际上是选择了 $$\textstyle (1-10^{-7})^{10^7}$$ 作为底数：它非常接近于 $$\frac {1}{e}$$。

同样的，比尔吉也不知道，他选择的 $$\textstyle (1+10^{-4})^{10^4}$$，非常接近于 $$e$$ 。

**这个反过来想很好理解。** 比如以 2 为底的对数，逆运算其实是 2 为底的指数：

> $$ y = log_2 x \iff 2^x =y $$

因为 $$ 2^x $$ 增长很快，$$2^{10}$$ 就 1024 了，那么要查比如 798 的对数，可能就会查不到，这就是前面说的数字密度不够的问题。

很显然，要增加对数这边数字密度，就需要指数那边增长别太快，于是底数只能选比 1 稍微大一点的数。

所以，大家其实是沿着 $$\textstyle 1+{\frac {1}{10^n}}$$ 在找，只是 $$n$$ 取多大，就看当时人类手搓的上限了。

**当 $$n$$ 变得足够大，人们会发现什么呢？人们「自然」会发现 $$e$$** ：

> $$ e=\lim _{n\rightarrow \infty }\left(1+{\frac {1}{10^n}}\right)^{10^n} $$ 

#### 指数里的「自然」

 $$e$$ 被雅各布·伯努利在研究复利的过程中发现。
 
**被发现而不是被定义，仍然是称它「自然」的一个主要原因。**
 
但因为研究的是增长而不是大数计算，所以指数领域的 $$e$$ 有更自然的部分:

$$ e=\lim _{n\rightarrow \infty }\left(1+{\frac {1}{n}}\right)^{n} $$

**这个式子其实说明了，$$e$$ 是单位时间内翻倍增长所能达到的上限。**

正好，自然界的增长，比如细胞分裂等等，都是单位时间倍增的。

这大概就是为什么小到葵花籽排列，蜗牛或贝壳的花纹，大到低压气旋甚至星系旋臂都是[对数螺线](http://math0.bnu.edu.cn/~zhengc/material/Calculus%20B_I/curves/logarithmic%20spiral.pdf){:target="_blank"}的原因。

所以，雅各布·伯努利对对数螺线非常着迷，甚至要把它刻在自己的墓碑上。

只不过，那个时候的石匠没有你学习数学的条件，给他刻错了。

{% picture /downloads/images/2024_07/bernoulli_tomb.png --alt bernoulli_tomb.png %}\
<small>图 5. 伯努利想要死后继续倍增，结果被整成了等速</small>
