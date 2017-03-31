---
layout: post
title: "Use Done List Instead Of To Do List"
date: 2013-03-15 21:25
comments: true
categories:
- productivity
- thoughts
---

![nerd sniping](/downloads/images/nerd_sniping.png "Don't touch me...")

## **起**

<a href="http://xkcd.com/730/" target="_blank">xkcd</a>一直是本座最喜欢的网站（嗯哼）。上面这幅图说了一个很有趣的现象，正好最近深有体会，就来这边吐槽一下。整个经过是：

大前天回到家感觉不算太忙，本座就开始家姐布置的家庭作业：做一个用于心理学测试的游戏。需求简单来说就是：

- 游戏开始后轮转播放图片、视频或者音频 （媒体库要容易换，播放的切换间隙也要能配置）
- 被试通过操控手中的手柄表达心理的反应，由程序转成可统计的数据（比如看到美女图按同时按下AB）   
- 程序得到的数据能够很容易的被统计，统计结果能够很优雅的呈现出来

为了让这个事情变得更有趣，本座在需求确定之后决定：

1. 用帅气的<a href="http://www.nintendo.co.uk/NOE/en_GB/systems/accessories_1243.html" target="_blank" class="broken_link">Wii Remote</a>来让被试表达自己（想想美女图片一出就甩或者是撸一下WiiRemote有多实在）   
2. 用<a href="http://www.pygame.org/news.html" target="_blank">pyGame</a>来写这个游戏（早就想学习pyGame了）   
3. 把统计数据的输出作为一个用<a href="http://www.r-project.org/" target="_blank">R语言</a>实现的统计绘图的界面的输入

接着就开始第一项。当程序把 `Wii Remote` 的蓝牙信号正确的转换成标准的手柄信号的时候，一看已经挺晚了，本座就只好把后面两个放在了 `todo list` 上。接着这两天都很忙这些东西就继续的呆在 `todo list` 。

然后今天又找到时间，本座就开始用 `pyGame` 写游戏本身部分，但突然觉得vim下面自动补全很烂，就开始google合适的插件。花了10分钟左右发觉不少人说 `pydict` 好，本座就又花了15分钟左右去配置。然后看着chrome里面为了搜索插件弹出的一堆tab突然本座发现：

经过了4天，本座把Wii Remote用蓝牙连到PC输出手柄信号，本座有了一个不错的vim下开发python的环境，本座还学习了一点儿R。唯一没有开始的就是，嗯，还没有开始写那个游戏。

## **承**

你的情况可能具体细节和我不一样，但是结果估计都是南辕北辙：你是网页设计师，在需要画 `wireframe` 的时候花了一大把时间去看搜索出来的新鲜的、华丽的 `CSS3` 效果；你上淘宝买手机结果研究移动电源用了4个小时；你想学怎么养花结果因为选盆子下面水漏的形状耽误了。

这种情况之所以对你的效率有很大的伤害是因为：

1. 你认为你是在完成自己 `todo list` 上的东西，所以你觉得自己是在“进展中”而不是“瞎逛”。   
2. 你认为的进展给你带来了更多 `todo list` 上的东西，而且有些确实对原来的目标是无益的。

人的精力是有限的，如果你长期处于这种状况（太正常了，如果你是玩电脑的话），可就要小心了。

## **转**

其实这种发散的工作方式并不是完全错误的。其实在我们这个行业，这种“总想追求更好”的想法，是整个Agile的基础。Facebook在自己的员工的邮件<a href="http://blogs.wsj.com/deals/2012/02/01/mark-zuckerbergs-letter-from-the-facebook-filing/" target="_blank">里面</a>写到：

> The Hacker Way is an approach to building that involves continuous improvement and iteration. Hackers believe that something can always be better, and that nothing is ever complete. They just have to go fix it — often in the face of people who say it’s impossible or are content with the status quo.

从本座自己的感觉而言，做事循规蹈矩的同事，完成一般难度的任务时，效率确实很高。但是那种真正非常困难的问题，常常是被喜欢“瞎逛”的人解决的。这当然也没什么奇怪的，所谓闭门造的车，出门就只能合辙。Richard Hamming也<a href="http://www.cs.virginia.edu/~robins/YouAndYourResearch.html" target="_blank">说</a>：

> I notice that if you have the door to your office closed, you get more work done today and tomorrow, and you are more productive than most. But 10 years later somehow you don&#8217;t know quite about what problems are worth working on … He who works with the door open gets all kinds of interruptions, but he also occasionally gets clues as to what the world is and what might be important. ….

## **合**

不能闭门造车，又需要有固定的输出值，怎么办？今天本座是这么办的：

1. 早上起来把今天最重要的事情从<a href="https://astrid.com/home" target="_blank">todo list</a>里面选出来。
2. 完成这些事情的过程中遇到任何有趣的东西或者想法，存到<a href="http://delicious.com/" target="_blank">delicious</a>或者<a href="http://www.evernote.com/" target="_blank">evernote</a>里面。
3. 使用<a href="https://idonethis.com" target="_blank">Done list</a>而不是todo list来标记自己今天的活动。

结果是今天3点钟就完成了所有重要的事情，能够来安心的写一篇blog，看起来是个不错的办法。
