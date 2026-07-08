---
layout: post
comments: true
description: "...而乔布斯愤愤不平，没有获得应有的赞誉的 Rod Holt，从 1982 年《Revenge of the Nerds》到 2011 年这本乔布斯传记，在大量跟苹果有关的书籍和文章中被反复提及，也因此成为了世界上最有名的电源设计工程师..."
title: "苹果的电源"
date: 2026-07-08 11:12:34 +0800
categories: 
- questions-my-kids-asked
- why
- history
---

蒙爷昨天问我，和其他笔记本比起来，MBP 的电源为啥那么好。

苹果的电源是[不错](https://www.chargerlab.com/teardown-of-apple-140w-usb-c-power-adapter-a3607/){:target="_blank"}，但，动态调压？EMI 滤波？PFC 功率校正？是哪里的好被蒙爷发现了？

仔细一问，原来主要是说续航。

这不是靠电源或者电池，主要靠的是自研芯片为主的整个 SoC 功耗低，和一些软硬件协同的优化。

但蒙爷的这个问题倒是让我想起在 Walter Isaacson 那本《乔布斯传》里看到过一段关于电源的描写：

> Instead of a conventional linear power supply, Holt built one like those used in oscilloscopes. It switched the power on and off not sixty times per second, but thousands of times; this allowed it to store the power for far less time, and thus throw off less heat. "That switching power supply was as revolutionary as the Apple II logic board was," Jobs later said. "Rod doesn't get a lot of credit for this in the history books but he should. Every computer now uses switching power supplies, and they all rip off Rod Holt's design.

当时觉得，如果真如乔老爷子所言，「如今每台计算机都使用开关电源，而它们无一例外地借鉴了 Rod Holt 的设计」并且「Rod Holt 并未因此获得足够的赞誉」，好像我知道的一些硬件历史就该重新写了。

仔细一查，果然又是乔老爷经常性的「扭曲现实场」。

简单来说，电源分为「线性（linear）电源」和「开关（switching)电源」两种。

典型的线性电源使用笨重的变压器将 120V 交流电转换为低压交流电，再通过二极管桥将其转换为低压直流电，最后利用线性稳压器将电压降至所需水平。线性稳压器是一种基于晶体管、价格低廉且易于使用的元件，它通过将多余的电压转化为热量来产生稳定的输出，因此一个主要缺点是约 50-65%的电能以这种方式浪费掉了，并且需要散热器或风扇来散热。

开关电源的工作原理截然不同：它通过快速地开/关电源，而不是将多余的能量转化为热量来工作。在开关电源中，交流输入被转换为高压直流电，然后电源以每秒数千次的频率开关直流电，使输出电压平均达到所需值。与线性电源相比，开关电源效率更高，发热更少，体积更小，重量更轻。开关电源的主要缺点是它比线性电源复杂得多，设计难度也更大。此外，它对元件的要求更高，需要能够在高功率下高速开关的晶体管。

开关电源源头在上世纪[三十年代](https://books.google.com.hk/books?id=NXMJNAVXkzoC&redir_esc=y){:target="_blank"}，到了五六十年代随着航空航天里的应用逐渐成熟，主要是 [IBM](https://www.bitsavers.org/pdf/ibm/704/223-6818_704_CE_Manual/736_741_746_PwrSupply_CE_Oct58.pdf){:target="_blank"} 和 [GE](https://www.google.com/patents?id=PIpmAAAAEBAJ){:target="_blank"} 带来的进展。随后 Honeywell 等公司开始在计算机上使用这项技术。

[Robert Boschert](https://www.electronicdesign.com/technologies/industrial/boards/article/21795586/robert-boschert-a-man-of-many-hats-changes-the-world-of-power-supplies){:target="_blank"} 被公认为对开关电源的小型化做出了最突出的贡献。他在 1970 年开始专注于简化开关电源的设计，并在 1976 年推出了 80W 的版本，这背后主要是耐高压的晶体管开始量产。

Rod Holt 为 Apple II 设计的仍然是一种开关电源。其核心特点是使用了一种当时在 Bosert 公司生产的开关电源里已经被普遍使用的「离线反激式转换器拓扑」。在 Rod Holt 申请的专利里提到的主要改进是：1）安全启动振荡器的机制；2）通过变压器上的二极管将变压器多余能量进行回收。

这些改进都基于一些广泛研究的技术，并没有为电源设计带来任何飞跃，也不存在被后来所有计算机的开关电源都借鉴了：比如安全启动机制这些，很快就被控制电路取代了。

作为花花世界里一个不为人关注的角落，开关电源的名人堂除开前面说到的 Robert Boschert，还有发明了 PWC 控制电路的 [Robert Mammano](https://www.electronicdesign.com/content/article/21188360/lifetime-achievement-award-recipient-robert-mammano){:target="_blank"}，设计了卫星电源系统，专利号被印在 Apple II Plus 和 Osborne 1 电源电路板上的 Elliot Josephson。

前者拿到过《电力电子技术》杂志的终身成就奖，但并没有本人的维基百科页面。后者几乎完全不为人知，甚至没有一个我可以链接的网页。

而乔布斯愤愤不平，没有获得应有的赞誉的 Rod Holt，从 1982 年《Revenge of the Nerds》到 2011 年这本乔布斯传记，在大量跟苹果有关的书籍和文章中被反复提及，也因此成为了世界上最有名的电源设计工程师。

