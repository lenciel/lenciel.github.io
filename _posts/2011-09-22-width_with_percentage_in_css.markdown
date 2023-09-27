---
layout: post
sidenote: false
title: "CSS里的width:100%和width:auto"
date: 2011-09-22 09:53
comments: true
categories:
- web-dev
- tips
- css
---

{% picture /downloads/images/2011_09/width100css.jpg --img width="178" height="200" class="left" %}
这似乎是 CSS 里面最简单的一个概念：如果你希望一个 block-level 的元素填满整个父容器的所有空白，只需要为这个元素声明<font color="#0080ff">width:100%</font>这个属性就可以了。

但从个人经验和搜索结果看，大概很多 CSS 使用者都有过加上这个属性后挠头不已的惨痛回忆。最后很多人不得不经过反复试验后重新转回使用绝对值的长和宽。

的确，百分比在 CSS 里的真实作用，就像偶像派的苦瓜炒蛋，是属于「看起来简单，弄起来挺难」的东西。

其实Blocks不需要指定100%
-----------------------------------

大多数专业的 Web 开发者都清楚，block-level 的元素(如 div, p, ul 等)和 inline 的元素两者的区别就在于默认情况下，block 元素的宽度就会取填满父容器的宽度(减去自己的 margin 或者父容器的 padding)。

![block element is not needed](/downloads/images/2011_09/blockelementnoneed.jpg --alt Don't touch me)

这知识虽然初级，理解这点对我们明白百分比的实际作用很有帮助。

真实的含义
------------------

如果你在 CSS 中给一个元素 x%的宽度，其实就是定义：「把这个元素所占的区域扩成它父容器的绝对宽度的 x%，当然，必须它父容器有一个绝对宽度啊，亲。」比如你的元素放在一个 400px 宽度的容器里面，然后它的宽度定成了 100%，那么它在保证自己被渲染成 400px 宽度之后，还是会遵守自己被定义 margin/padding/border 的设置，所以最好出来的效果很可能就是下图那悲催样：

![just pull](/downloads/images/2011_09/childequal.jpg --alt Don't touch me)

Height(在所有的浏览器)也一样
-------------------------

是的，这是 CSS 比较坑人的地方：如果你的父容器没有一个显示声明的绝对值高度，那么你用百分比来定义它的高度希望它充满父容器是不行的。Height 和 Width 的唯一区别是对于 block-level 的 element 而言，不会自动去填满父容器，也就是说 height:100%是不能省略的。

当然，百分号的行为也是 CSS 里面难得不坑人的地方：所有的浏览器对百分比的渲染都是一致的。
