---
layout: post
comments: true
description: "AVP 发布前，XR 从业者一个核心期待应该就是它的交互方式。毕竟， 17 年前 Apple 在 iPhone 推出时带来了多点触控，永远改变了手机这个行业（我甚至觉得它改变了人类这个物种，因为我家小孩在学会说话之前就学会了在屏幕上滑动手指）。这篇就来聊聊到底交互上有没有作业可以抄，然后打个「突如其来」的总结。"
title: "AVP 初印象 - 交互及总结"
date: 2024-04-16 01:25:01 +0800
categories: 

- AVP
- VR
- XR
- review

---

> 这是一个系列文章里的第四部分，前面我们聊了[硬件](/2024/04/thoughts-on-avp-1/){:target="_blank"}、 [visionOS](/2024/04/thoughts-on-avp-2/){:target="_blank"}、[系统软件](/2024/04/thoughts-on-avp-3/){:target="_blank"}...

AVP 发布前，XR 从业者一个核心期待应该就是它的交互方式。毕竟， 17 年前 Apple 在 iPhone 推出时带来了多点触控，永远改变了手机这个行业{% sidenote 'sn-id-1' '我甚至觉得它改变了人类这个物种，因为我家小孩在学会说话之前就学会了在屏幕上滑动手指。' %}。

这篇就来聊聊到底有没有作业可以抄，然后打个「突如其来」的总结。

### Look-and-Tap

#### Facts

用眼睛选中，用手去操作，是 Apple 为 AVP 定义的一种全新的交互方式。除开最常用的夹手指表示「单击」外，还支持一些别的手势：

{% picture /downloads/images/2024_04/avp_guestures.jpg --alt avp_guestures.jpg %}\
<small>图 1. AVP 支持的 6 种手势</small>

有人会觉得眼动追踪和手势识别在 XR 行业里面已经存在了很多年。

但就像熊彼特[说的](https://wiki.mbalib.com/wiki/%E7%86%8A%E5%BD%BC%E7%89%B9%E7%9A%84%E5%88%9B%E6%96%B0%E7%90%86%E8%AE%BA){:target="_blank"}，创新从来就不是无中生有，而是对「旧要素进行新组合」。

并且，Apple 做的绝不是简单的组合：为了把手眼追踪做到极致，AVP 给每个眼睛各配备了两个专用摄像头，加上宽视场的手部追踪系统，即使用户把手放下或者是放在桌子或者膝盖上休息，识别也很轻松{% sidenote 'sn-id-2' ' 是不是把手举在空中做动作是判断一个 AVP 用户是不是首次使用的有效判据。' %}。

**结论：打开 AVP 进行手部和眼部设置的那个引导流程绝对是一个「aha moment」，大部分用户都会感觉这套交互如此自然却又如此强大，仿佛自己突然有了超能力。**

#### Rants

人学习一套新交互是有成本的。所以学习的唯一动力就是它可以比现有方案工作得更加高效。一旦真的密集使用 AVP，就会发现不少问题：

- 传统的眼睛和鼠标配合的逻辑是：眼睛先看到下一个地方，然后手移动鼠标去到那里，然后手指点击。也就是说选中其实是分两个步骤的（眼睛先看选什么，手再去选中）。因此，眼睛直接选中：
	- 会让我觉得手总是慢半拍，因为手已经习惯了比眼睛慢半拍；
	- 会让我很焦虑，因为我看到的东西就会被选中；
	- 会有很多漂移，比如我打字的时候突然看到了某个地方，或者是看电影的时候手不小心动了一下；
	- 会让新手在进入一个应用的时候有很大概率触发「删除」消除，造成恐慌；
- 传统的鼠标滚轮被捏合手指拖动取代，这让我感觉到疲惫：
	- 滚轮操作手是没有位移的，但是捏着手指拖动动作还挺大的；
	- 特别是信息比较多的时候，很难定位到想要停下来的位置；
- 我还可以说半个小时...

**结论：因为看电影的时候好几次进度条被误操作，我把手势识别改成了只识别右手，然后在看电影的时候把右手放在裤兜里。这是整个问题有多么烦人的一个缩影{% sidenote 'sn-id-3' '难道 AVP 自带了 [QSPL 大法](https://www.pingwest.com/a/60004){:target="_blank"} ？' %}。**

#### Thoughts

和 XR 世界普遍采用的，被用户们戏称为「鸡腿」的手柄相比，Apple 发明的这套新交互方式，感觉还是跟前面说的发展路线有关系：
- Quest 的生态既然是靠 Unity 开发者，以游戏为主，就需要有手柄；
- Apple 的生态是以办公和看片切入，并且作为 AR 降临派，从 2017 年开始 ARkit 年年迭代（RealityKit 要晚几年），推出这种携带和学习成本更小，更自然的交互方式，也算水到渠成；

### 虚拟键盘

#### Facts

 输入文字时，会弹出一个和宣传册上看起来一样美观的虚拟键盘：

{% picture /downloads/images/2024_04/avp_virtual_keyboard.jpg --alt avp_virtual_keyboard.jpg %}\
<small>图 2. AVP 的虚拟键盘</small>

用户既可以伸出手指去戳键盘上的按钮，也可以用眼睛选中然后捏手点选。

#### Rants

事实证明，在悬浮的虚拟键盘上打字非常累：

- 有一部分的累是心理层面的：用户在敲击时没有感到应该有的反馈，而之前的任何键盘，哪怕是 iPhone 上虚拟的键盘，敲击的时候都有反馈；
- 另一部分的累是物理层面的：打字的时候手臂需要支撑，手腕才能有效得到放松；

#### Thoughts

**结论：除开输入（较短的）密码，这个虚拟键盘没法用来干任何别的事情。**

### Siri

Last but not least，很多场景下和 AVP 最好的交互方式，大概反而是语音。

这实际上也是我们在 FITURE 做镜子时的感受：和 AVP 相似，它没有可以触控的屏幕，没有鼠标、键盘、遥控器这些外设，并且用户在使用的时候，是希望全身心投入到内容里面去的。

### 总结

本来应该还有一篇是聊「内容」的。

Apple 为 AVP 准备了不少非常不错的内容。比如下面这个 [MLS Season Pass](https://www.roadtovr.com/apple-immersive-video-mls-season-pass-2023-playoffs/){:target="_blank"} 里面，真能看到队员在你面前进球、庆祝并举起奖杯：

{% picture /downloads/images/2024_04/avp_season_pass.jpg --alt avp_season_pass.jpg %}\
<small>图 3. MLS Season Pass 被我加入了必看列表</small>

但既然 AVP 截图都不让，本座也就懒得聊了，直接在这篇末尾打个总结吧。

因为 Apple 选择了我称之为「**VR 为体，AR 为用**」的路线，所以开箱后会发现，上面没有太多 VR 上的爆款游戏，但同时又没有足够多的 AR 应用或内容，它是真的，真的很想让你用它来办公。

但如果你放下 Mac，用 AVP 去办公，就会听到你的 Mac 开始唱歌。然后你的 AVP 在回嘴，两人你一句我一句，歌声绵绵不绝。在你的脑袋炸开之前，你听到了他们唱的是《阿妮快拿枪》里那首《Anything you can do I can do better》：

<video controls playsInline>
    <source src="{{ site.static_base }}/downloads/video/anything_you_can_do.mp4" type="video/mp4">
    <p>Your browser doesn't support this embedded video.</p>
</video>
<small>Howard Keel 和 Betty Hutton，就像是 Apple 现有的设备和 AVP</small>

大概有两类人是不会失望的用户：

1. 科技发烧友：AVP 仍然提供了一些极致体验。包括我已经提到的空间视频录制，包括 Apple TV 里面的那些使用 Apple Immersive 格式提供的内容等等。总会有一些人，愿意为其中的某一项买单；
2. 开发者：今年 AVP 的出货大概会到 40w 台左右。由于内容极度贫瘠（Youtube 等都还没有原厂应用），现在做个体验稍微比较浏览器好一点的套壳就能以美金的价格卖出好几万份。总还是有很多人，愿意为上去淘金做一些投入，而且我估计后面几代的 AVP 说不定没有这代硬件上配置这么豪迈；

而那些相信了 Apple 的[宣传](https://www.apple.com/apple-vision-pro/){:target="_blank"}，或者一些[使用者的宣传](https://www.linkedin.com/pulse/apple-vision-pro-future-productivity-erik-huddleston-3mjtc/){:target="_blank"}，准备迎接未来的用户，估计会在新鲜劲儿过后感到失望。

因为目前 AVP 带来的更多是未来感，而不是未来。

