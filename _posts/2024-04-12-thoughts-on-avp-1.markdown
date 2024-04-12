---
layout: post
comments: true
description: "包括高保真 passthrough 在内的在显示方面的堆叠，是 AVP 通过硬件实现的第一个杀手锏，并且很可能变成一个行业标杆：就好像 iPhone 出来之后，薄在一段时间成了移动手机的标杆指标一样，显示这部分，特别是 VST 能做到多好，估计会变成 VR 的一个标杆指标。"
title: "AVP 初印象 - 硬件"
date: 2024-04-12 03:00:48 +0800
categories:

- AVP
- VR
- XR
- review

---

经过一段时间不太密集的使用{% sidenote 'sn-id-1' ' 之前有挺多评测博主每天戴着它几个小时甚至更长时间，我是有点不知道这么长时间能够干嘛。' %}，对 Apple Vision Pro（后面简称 AVP）算是有了些初步的感受和想法，立此存照。

进入内容之前先介绍一下我的背景，这样你就知道我大概会有什么样的偏见：

- 二十年左右的软件开发经验，从存储到嵌入式到手机到基础设施到各种应用；

- 是 Oculus 初代的用户（感谢 studyboy），持续关注 XR 领域{% sidenote 'sn-id-2' 'XR 泛指 VR/AR/MR/Spatial Computing 在内的各种概念。也许不是一个特别好的词，因为太笼统了，但又是个无法不用的词，因为贵圈太乱了。' %}
- 但真正入局大概半年左右：目前有一个十来人的小团队，研发的两款 VR 游戏[刚刚上线](https://www.initialfstudio.com/){:target="_blank"}；

- 对 XR 的硬件还处于看过文档拆过机的发烧友用户阶段，没有实际参与过硬件研发；

- 在 AVP 之前，已经试用过 Meta、Pico 的几款主要机型；

我假设读者已经对 AVP 有一些基础的了解，分硬件、软件、交互、内容四个部分，说点儿讨论得还不太多的东西。如果对 AVP 非常陌生，可以先看看类似于 [the Verge](https://www.theverge.com/24054862/apple-vision-pro-review-vr-ar-headset-features-price){:target="_blank"} 或者 [Wired](https://www.wired.com/review/apple-vision-pro/){:target="_blank"} 这类权威媒体的评测文章。

So, let's begin...

{% picture /downloads/images/2024_04/avp_lenciel.jpeg --alt avp_lenciel.jpeg %}

<h3>目录</h3>

- TOC
{:toc}

#### 核心亮点1：遥遥领先的显示能力

##### Facts

Apple 用一个让终端用户感觉挺陌生的词{% sidenote 'sn-id-3' '实际上在 1992 到 1993 年，罗伯特·雅各布森（Robert Jacobson）与 VR 教父之一的汤姆·弗内斯（Tom Furness）在共同创立华盛顿大学的 HMI 实验室的时候，就创造了「空间计算」这个词并将其投入商业用途。' %}——「Spatial Computing device（空间计算设备）」——来宣传 AVP，而不是消费者耳熟能详的 VR 或 AR，我想大概有两个原因：

- 虽然 AVP「主要」是台 VR 设备，但 Apple [一直以来](https://www.theverge.com/21077484/apple-tim-cook-ar-augmented-reality){:target="_blank"}都认为 AR 比 VR 靠谱（后面讲内容的部分会说到，这里的割裂带来了不少问题）；
- VR/AR 跟 AI 一样，经历了太多高开低走，从业者和消费者多少都有些疲了；

第一点值得多说几句（让我们暂时忽略 VR、AR 这些词本身就有的一些歧义，只讨论核心概念）：

- VR 是通过闭合了显示屏的头显在用户眼睛前来展示内容。它最大的问题就是所谓的「persence」不足：用户被封闭进一个和物理世界隔离的空间；
- AR 则是通过物理透明的显示屏（形态常常是眼镜镜片）对现实进行所谓的「增强」{% sidenote 'sn-id-4' '当然，AR 也不全是眼镜形态的。比如对 AR 有偏好的 Apple 就在 iOS 里提供了一些 AR 工具，并且在高端的 iPhone 和 iPad 里增加了 LiDAR 设备，让用户在屏幕上看到对摄像头拍摄出来的「现实」的增强。' %}，也就是所谓的 OST（Optical See Through）。它最大的问题是包括 FoV 在内的一堆跟人眼或者 VR 设备相比的物理限制，以及包括供电、交互、时空分辨率{% sidenote 'sn-id-5' '叠在现实世界带来了一个隐藏需求是高精度定位，不然设备都不知道自己在现实世界的哪里，而很多 AR 设备甚至还没有 SLAM。' %}在内的一堆软硬件限制；

AVP 实际上是个 VR 头显，通过高保真的 passthrough 来解决 VR 脱离物理世界的问题，也就是所谓的 VST（Video See Through）：

{% picture /downloads/images/2024_04/ost_vst.png --alt ost_vst.png %}\
<small>图 0. OST 和 VST 的差异，[source](https://www.researchgate.net/figure/Comparison-of-VST-and-OST-displays-under-a-typical-scenario-of-marker-based-AR_fig1_353226456){:target="_blank"}</small>


这个方案并不新鲜，比如 Meta 已经努力了三四年了，但是跟 Apple 最终交付的保真度比，多少[有点寒碜](https://x.com/rafamolone/status/1758079480780771544?s=20){:target="_blank"}。

当然，这不是 Meta 做得有多差，而是 Apple 干得实在太好了：无论之前有没有使用过其他 VR 设备，你戴上 AVP 的时候都会为其效果之好，延时之低而感动。

**结论**：包括高保真 passthrough 在内的在显示方面的堆叠，是 AVP 通过硬件实现的第一个杀手锏，并且很可能变成一个行业标杆：就好像 iPhone 出来之后，薄在一段时间成了移动手机的标杆指标一样，显示这部分，特别是 VST 能做到多好，估计会变成 VR 的一个标杆指标。

说它是通过硬件实现因为：

- 它核心是 M2+R1 这套芯片搭配，毕竟两个 passthrough 对外拍，四个眼动对内拍，六个 world tracking 摄像头，两个 depth sensor，总共 14 个头子做实时计算，出两个眼睛 micro-LED 3000 PPI 的变态显示画面，还要以那样的频率刷新，这不是个软件能搞定的活了：

{% picture /downloads/images/2024_04/avp_sensors.png --alt avp_sensors.png%}\
<small>图 1. AVP 的大型堆料现场</small>

- 它还强依赖于包括 micro-OLED 在内的硬件在供应链这侧的成熟。iFixit 那篇很强悍的[拆机分析](https://www.ifixit.com/News/90409/vision-pro-teardown-part-2-whats-the-display-resolution){:target="_blank"}有一个使用显微镜制作的图，把 AVP 的 PPI 跟目前市面上一些最强的设备进行了对比，确实是遥遥领先：

<video playsInline autoplay loop muted>
    <source src="{{ site.static_base }}/downloads/video/avp_display.mp4" type="video/mp4">
    <p>Your browser doesn't support this embedded video.</p>
</video>
<small>图 2. AVP 的像素密度是 Quest3 的 3 倍，iPhone15 的 7.4 倍</small>

- 当然，也少不了软件上的巧思。Karl Guttag 有一篇对 AVP 显示的[很细的分析](https://kguttag.com/2024/03/01/apple-vision-pros-optics-blurrier-lower-contrast-than-meta-quest-3/){:target="_blank"}，里面就讲了一个很有趣的点：Apple 在 AVP 上通过降低显示分辨率（比本来分辨率更低的 Quest3 要更模糊），来使得画面更流畅并且没有 [door effect](https://pimax.com/what-is-the-screen-door-effect-in-vr/){:target="_blank"}：

{% picture /downloads/images/2024_04/avp_blur_feature.webp --alt avp_blur_feature.webp %}\
<small>图 3. AVP 采用了有意的模糊让成像更流畅</small>

##### Rants

Apple 可以搞专有芯片，可以上十几个摄像头，但是，它没法解决物理世界的问题，特别是光学上问题。

我在拿到设备之前看到不少美国先拿到机器的评测者，包括著名的 John Gruber，都说 passthrough 体验[天衣无缝](https://daringfireball.net/2023/06/first_impressions_of_vision_pro_and_visionos){:target="_blank"}，所以期望很高。

但拿到设备之后，发现 VR 镜头上常见的如眩光、运动模糊等问题，一个不差。特别是戴上它我就看不清自己的手机和电脑屏幕（而且戴上它还不能解锁手机，要操作手机只能取下来），一度以为是自己的设置有错误或者这台设备有毛病。

后来看了 [Snazzy Labs](https://www.youtube.com/watch?v=eOH33sWgds8){:target="_blank"} 的评测就觉得，对啊，怎么会指望 Apple 可以解决人类还解决不了的问题呢{% sidenote 'sn-id-6' '比如，虽然 AVP 有 3000 PPI，但是仍然不是 retina 的，因为它离眼睛实在是太近了， [PPD 仍然不够高](https://simulavr.com/blog/ppd-optics/){:target="_blank"}，并且应该很长时间内也没有变高的办法。' %}？

**结论**：包括高保真 passthrough 在内的各种显示上的增强让 AVP 具备 VR 设备从未到达过的高度，但是还没有好到可以在虚拟与现实间随意穿梭的地步，仍然需要在一代代的设备中不断迭代出新能力来渐进式地增强。

##### Thoughts

三万亿美金市值，有极高人才密度，并且对 AR 情有独钟的 Apple 在 AVP 上做出的选择，基本上说明了在很长一段时间内，人类没有解决 OST 做 AR 面临的核心问题的路径（因为这些问题大部分受物理定律限制，没有摩尔定律）。

所以 VR+VST 的穿戴设备形态，应该仍然是 XR 世界很长一段时间内的主力。而且不管它被叫成 MR 还是空间计算还是啥，其使用场景会是在一小段时间内解决某个具体需求（娱乐、学习、社交等等）的穿戴设备仍然是 XR 设备的主要出货形式。

**时刻使用的穿戴设备替代便携设备（手机、平板、笔记本），还不知道要多久。**

#### 核心亮点2：Apple 特有的味道

##### Facts

Apple 从不让用户失望的是开箱时的那些「aha moment」——虽然它在逐步衰减的过程中。

AVP 同样令人惊叹：首先金属和碳纤维的材质就跟历史上那堆塑料壳子的 VR 头显拉开了几条街的差距。

然后是跟其他 Apple 设备一脉相承，简约但不简单的设计感。比如整个 onboarding 流程，除开那个设置头带松紧的地方是手动的，其他所有流程都是经典的苹果范儿。

还有一些人觉得 AVP 比其他 VR 头显看起来更小更精神，这部分我倒没啥感觉：最新几代的 VR 设备都已经没有以前那个四四方方的前盖了。而且 AVP 要挂个尿袋，这算更精神还是更神经...

##### Rants

如果单纯是果粉，当然会赞美这台 AVP 仿佛是一个 iPhone、一个 Airpods Max、一个 Apple Watch 的合体。

如果跟我一样干过供应链，当然会觉得这可不就是把 iPhone、Airpods Max、Apple Watch 的一堆设计和物料重用了还要卖我几万块钱{% sidenote 'sn-id-7' '当然 Tim Cook 作为一个供应链出身的 CEO，经常干这事儿，我的备用机 iPhone Mini 不就是这么来的吗？' %}？

而且这样堆料的初代也确实出现一些设计上考虑不周的地方。比如那个编织的头带有比较严重的问题：AVP 头显这侧本来就比一般的 VR 设备重，这个头带还没有一个头顶的支撑，造成脸框和后颈压力都会很大。但是那个双带的版本好像又不够美，所以有了很多可以 3D 打印的增强配件（[比如](https://www.printables.com/model/760750-apple-vision-pro-dual-knit-band-strap){:target="_blank"}），或者，买一个：

{% picture /downloads/images/2024_04/avp_handband.png --alt avp_handband.png %}\
<small>图 4. 现在可以买到很多第三方头带</small>

##### Thoughts

因为操办过一点硬件的项目，这里我其实感触挺多的。

一个是如何做产品，包括怎么找 KSP，怎么做抉择和权衡，怎么跟供应链协作，怎么省钱等等，FITURE 人自有 FITURE 人的血泪，这里按下不表。

一个是如何做营销，这里稍微多写几笔。

为什么 AVP 的包装里面有两套头带？

我觉得这是因为单环的好看，但没法用；双环的将就能用，但不好看。

比如，你能想象下面这张图的模特带着头发上中分支撑的双环头带吗？

{% picture /downloads/images/2024_04/avp_headband_1.jpeg --alt avp_headband_1.jpeg %}\
<small>图 5. 优雅的用户不配用真实的头带</small>

上面那个勉强可以的话，那这位呢？

{% picture /downloads/images/2024_04/avp_headband_2.jpeg --alt avp_headband_2.jpeg %}\
<small>图 6. 这不是配不配而是能不能的问题了</small>

但真正有趣的地方是，你有没有会发现基本上所有人在分享自己使用的照片的时候，都用的是配重有明显问题的单环头带。比如 the Verge 的总编大人，这发型当然不适合双环：

{% picture /downloads/images/2024_04/vision_pro_VPavic.webp --alt vision_pro_VPavic.webp %}\
<small>图 7. Vjeran Pavic 算是用户分享时的标准造型</small>

今天，做消费品的一个挑战是人们获取信息的渠道极其分散：过去包下新闻联播前几分钟的广告可以触达几亿人，今天用户的时间散布在各种渠道各个平台。

于是我们在做营销的时候需要鼓励用户主动传播和分享对产品的使用。所以现在有一个指标叫做「成图率」，本质上是提供社交货币给用户，让他们在展示自己美好生活的过程里面，帮产品去种草。

苹果为了让用户主动去秀那根其实不太舒适的头带，在整个过程中持续宣传了这根头带的工艺，甚至在那个一分多钟毛片儿般的[介绍视频中](https://www.bilibili.com/video/BV1rk4y1D75w/?spm_id_from=333.337.search-card.all.click)拿出了相当多的时长给它。这里面的布局和考量，值得每个做营销的人好好学习。
