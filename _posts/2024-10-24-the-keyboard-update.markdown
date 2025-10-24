---
layout: post
comments: true
description: "...可能读到这里你会感到疑惑：难道就因为打字机这样设计，当年设计电脑的人就不会改一下？毕竟 QWERTY 布局下英文最常见的 E 和 T 两个字母如此难按是显而易见的。但在计算机诞生之初，没有任何理由放弃打字机上默认的 QWERTY 布局：一方面，更重要的是让会打字的人快速把这个新设备用起来；另一方面，当时谁也不会想到将有个人电脑甚至笔记本电脑出现，让人类的大部分工作和娱乐都发生在这些设备上面..."
title: "程序员键盘升级指南"
date: 2024-10-24 19:55:06 +0800
categories: 

- keyboard
- tools-i-use
- RSI
- ergonomics
- 1KB
---

今天是 1024，按传统我该跟大家[交流点儿经验](/2019/10/how-to-treat-your-30-years-career-as-a-product/){:target="_blank"}当作礼物。这次就聊聊我用的键盘吧：毕竟程序员和其他很多工种比，大量使用键盘是个突出的特点。


<h3>目录</h3>

- TOC
{:toc}

### 背景和需求

我在二十年前开始用笔记本写代码，很快脖子就坏掉了：因为这玩意儿从设计上就很不符合人体工学。

十多年前开始创业后，工作时间变得更长，脖子和背常常疼痛难忍。经过一番研究（至今知乎上「[程序员如何解决颈椎受损的问题？](https://www.zhihu.com/question/20721016/answer/15963670){:target="_blank"}」最多点赞的答案还是我给的），我开始用支架把笔记本高度调高，结合外置键盘和外接显示器来调整身体姿态。一段时间之后，勉强可以重新做人了{% sidenote 'sn-id-1' '当然，只是缓解疼痛，很难复原了。如果有时空旅行，我穿回去要给我说的第一句话应该就是，爱电脑可以，但请注意体位。' %}。

大概三五年前，我的手腕和手指在打字比较多的时候，也开始了抱怨。所以我又开始了研究，并且陆陆续续用了好些键盘，也大概搞明白了我自己的需求，基本就是下面这些。

#### 打字舒适且不扰民

我们现在使用的大部分键盘跟下图类似，其设计来源于打字机。它的布局实际上是由 row staggering 和 QWERTY 两个方面构成的。并且非常不幸的是，两个都不太好。

{% picture /downloads/images/2024_10/row_staggered_layout_60_percent.png --alt row_staggered_layout_60_percent.png %}\
<small>图 1. 常见键盘布局</small>

##### row staggering 及其改进

打字机的字母从纵向看，并不排成整齐的列，而是每行有一些位移的，这被称为 `row staggering` ：

{% picture /downloads/images/2024_10/printer_layout.png --alt printer_layout %}\
<small>图 2. 打字机键盘每行有偏移</small>

有一些地方会说这样的设计是为了打字更舒服，实际上这是打字机的机械结构决定的：打字的完成需要手指敲击的按键和敲击纸张的撞锤（上图扇形区域）两个部分前后协同完成。撞锤的宽度比按键要窄，并且和相应的按键通过机械臂连接（下图中的绿色部分可以想象成这个连接件），因此要完成连接件的排布，按键必须做出一些偏移量：

{% picture /downloads/images/2024_10/typewriter_keys_draft.jpg --alt typewriter_keys_draft.jpg %}\
<small>图 3. 没有偏移的连接件会撞车</small>

这个每行带位移的设计后来只是被无脑搬到了键盘上，跟打字舒服没有关系。恰恰相反，因为人的指关节是纵向弯曲的，在行错位的键盘上打字因为产生了很多不必要的位移，大量使用后就会带来手指和手腕的疼痛。

因此有不少人体工学键盘首先就会用所谓的 `ortholinear` 布局，让手指减少横向的移动：

{% picture /downloads/images/2024_10/ortho_layout_planck.png --alt ortho_layout_planck.png %}\
<small>图 4. ortholinear 布局</small>

但这种布局会遇到另一个问题：我们手指的初始位置都在同一行，但是手指的长度却不同。当我们在不同键位切换的时候，还是会有不少横向的移动。所以就产生了被称为 `column staggering` 的布局：在保持同一列按键垂直排列的同时，每一列产生适度位移，来让手指可以做到更少的移动：

{% picture /downloads/images/2024_10/atreus_default_layout.png --alt atreus_default_layout.png %}\
<small>图 5. column staggering 布局</small>

因此，选人体工学键盘，首先应该看看它的按键是不是 column staggering 的。

##### QWERTY 及其改进

手指移动的多少，除开受行列摆放方式影响，另一个因素就是字母的具体布局。我们目前最流行的键盘的字母布局被称为 QWERTY ——因为第一排左起前六个字母就是它们。

但是为什么这样设计？实际上还是因为打字机的物理限制：差不多同时敲击两个字母，打字机就会卡住。而人类在敲一些常见的二元组合如 th、he、in、en、nt、re、er、an、ti、es 时，经常相隔很短，造成卡壳。为了避免这种情况，设计师专门把这些字母相互之间的位置摆得尽量远，从而得到了 QWERTY 布局。

可能读到这里你会感到疑惑：难道就因为打字机这样设计，当年设计电脑的人就不会改一下？毕竟 QWERTY 布局下英文最常见的 `E` 和 `T` 两个字母如此难按是显而易见的。

但在计算机诞生之初，没有任何理由放弃打字机上默认的 QWERTY 布局：一方面，更重要的是让会打字的人快速把这个新设备用起来；另一方面，当时谁也不会想到将有个人电脑甚至笔记本电脑出现，让人类的大部分工作和娱乐都发生在这些设备上面。

如今，QWERTY 至少有两个非常流行的替代方案，分别是把最常用的元音字母放到左手主行，把最常用的辅音字母放在右手主行的 [Dvorak](https://en.wikipedia.org/wiki/Dvorak_keyboard_layout){:target="_blank"}：

{% picture /downloads/images/2024_10/dvorak_layout.png --alt dvorak_layout.png %}\
<small>图 6. Dvorak 布局</small>

以及把最常用的字母放到主行并尽量照顾二元组输入的 [Colemak](https://colemak.com/){:target="_blank"}：

{% picture /downloads/images/2024_10/colemak_layout.png --alt colemak_layout.png %}\
<small>图 7. Colemak 布局</small>

##### 是否分体

当使用一体的键盘时，我几乎没有见过谁真正严格做到了用正确的手指击键。我自己也非常习惯用错误的手指按数字「6」。但把左右手的按键彻底分开，这并不是分体键盘最大的作用，而是使用它之后，手指和手腕可以做到基本上只在垂直方向弯曲和移动。下面四张图片应该可以让你明白我的意思：

{% picture /downloads/images/2024_10/layout_comparison.png --alt layout_comparison.png %}\
<small>图 8. 各种布局下手指手腕的比较</small>

##### 轴的选择

因为我做事的环境常常有其他人在办公或者休息，不扰民又照顾自己感受的首选是 Cherry MX 的茶轴或者 Kailh Brown。

#### 自定义程度高且调整方便

这把外接的键盘应该在做工优良且满足前面说的调整的基础上，足够方便我定制。因为我还有下面那个需求，所以在找到一个在各种键盘之间切换都比较稳定的布局之前，会经常调整。

#### 各种环境尽量可用

我出差很多，不太可能随时拥有外接的显示器和键盘，大量的时间还是用 MBP 自带的键盘。因此外接键盘和 MBP 键盘的布局要基本一致，才不会总是切来切去。

### 解决方案

#### 主力键盘选择

在办公室这个我呆得最多的地方，我订了一把 [Ergodox EZ](https://ergodox-ez.com/){:target="_blank"}，因为前面说的全部需求它都满足：

{% picture /downloads/images/2024_10/ergodox_ez_1.png --alt ergodox_ez_1.png %}\
<small>图 9. Ergodox EZ 外观</small>

然后它有一个专门下发配置的工具网站，我在匹配 MBP 基础按键之外，做了一些宏：

{% picture /downloads/images/2024_10/ergodox_ez_3.png --alt ergodox_ez_3.png %}\
<small>图 10. Ergodox EZ 主要布局</small>

然后把编程时需要的一些按键放到了长按右手的 `⌘` 时激活的别的「层{% sidenote 'sn-id-2' '这是 Ergodox EZ 的一个概念，就是键盘可以激活多个逻辑层，对应不同的布局。' %}」。这么做主要是因为从图里可以看到，它右手的按键比 MBP 要少很多，为了几把键盘同步我需要一个兼容较少按键的设置：

{% picture /downloads/images/2024_10/ergodox_ez_4.png --alt ergodox_ez_4.png %}\
<small>图 11. 编程常用按键做了隔离</small>

当然，我还是偶尔需要用一下鼠标，所以在中间放了触摸板，可以在手指基本不离开键盘的情况下，用大拇指操作。有时候，比如画图，需要大量使用鼠标，所以右手还放了个鼠标，画图的主要快捷键都被我设置到了左边：

{% picture /downloads/images/2024_10/ergodox_ez_2.png --alt ergodox_ez_2.png %}\
<small>图 12. 垫高显示器和 MBP 后整体外观</small>

#### 切换到 Colemak

其实在前面图 9 里可以看到，它不是 QWERTY 的布局。因为在今年八月份我把它设置成了 Colemak 并且重新摆了键帽{% sidenote 'sn-id-3' '所有按键热插拔是 Ergodox EZ 的另一个优点。' %}：

{% picture /downloads/images/2024_10/enable_colemak.png --alt enable_colemak.png %}\
<small>图 13. 8 月 13 日切换到 Colemak</small>

使用 Colemak 而不是 Dvorak 的主要原因是它有个独立网站，看起来有一帮人很认真地在为它工作，并且我觉得这个单词比 Dvorak 更加顺耳。

当然，换个键盘的布局是个非常猛烈的切换，大部分时候需要跟自己的肌肉记忆作对。我的方法是在前面两周每天花 20 分钟去[这个网站](https://gnusenpai.net/colemakclub/){:target="_blank"}上练习，当 Level 6 可以打到 30wpm 的速度时，再完成下面说的对所有键盘的切换。

#### 不同键盘之间同步设置

前面说了，如果主力键盘使用了特殊布局，特别是键位上的大规模调整，那么这些改变最好在所有键盘上都镜像，才能避免自己陷入精神分裂。

除开 MBP，我在住处也是外接显示器、支架，以及一把陪了我很多年的无刻 HHBK{% sidenote 'sn-id-4' '现在我知道它的布局有哪些缺点了，但我用它打字大部分是写小说，字数有限，所以还好。当时选无刻除了觉得好看，也是因为按键怎么换都无所谓，这下真用上了。' %}：

{% picture /downloads/images/2024_10/hhkb-keyboard.jpg --alt hhkb-keyboard.jpg %}\
<small>图 14. 无刻 HHKB </small>

我使用 [Karabiner-Elements](https://karabiner-elements.pqrs.org/){:target="_blank"} 来完成这些键盘之间按键的同步。

为了追求一致性，不仅仅是字母改成了 Colemak 的布局，所有按键都强制和 Ergodox EZ 的设置对齐（于是右手禁用了挺多按钮）：

{% picture /downloads/images/2024_10/karabiner_mac.png --alt karabiner_mac.png %}\
<small>图 15. MBP 原生键盘的设置</small>

同样的，HHKB 也做了对齐和设置：

{% picture /downloads/images/2024_10/karabiner_hhkb.png --alt karabiner_hhkb.png %}\
<small>图 16. MBP 原生键盘的设置</small>

甚至长按右手的 `⌘` 时激活别的按钮等等都通过脚本做了对应的实现：

{% picture /downloads/images/2024_10/karabiner_special.png --alt karabiner_special.png %}\
<small>图 17. 通过脚本实现十字键和编程字符的隐射</small>

最终，切换两个月之后，用着感觉还挺舒服的。并且拜强制在各个地方使用新布局所赐，打字速度也完全恢复了。虽然是不是就能够彻底做到打字不痛，还需要观察，但跟我们国家的经济建设工作一样，大有希望。



