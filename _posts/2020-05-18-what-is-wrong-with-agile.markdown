---
layout: post
comments: true
title: "你戴着眼罩吗？"
date: 2020-05-18 13:38:45 +0800
categories:

- rants
- agile
- product

---


<h3>目录</h3>

- TOC
{:toc}

在老早之前，我就对敏捷产生了一些[怀疑](https://lenciel.com/2015/03/agile-and-scrum/)甚至是[质疑](https://lenciel.com/2018/08/the-cost-of-agile/)。

在我心中，它甚至不如我们读大学的时候流行过一下的 XP（Extreme Programming ）： XP 更多还是强调技术上的最佳实践，比如代码审核，CI/CD 。实践 XP 虽然也需要各方面的努力，但总体来说是比较「科学」的：输入、方式方法和输出都相对清晰。

而敏捷，更多的是组织沟通和管理上的一些最佳实践。操练起来好像是比较「艺术」的：全世界这么多搞敏捷的公司，我怀疑就没有两家公司的输入、方式方法和输出是一样的。

于是难免乱七八糟。

有类似感觉的人应该是[很多的](https://medium.com/@cliffberg/agile-is-broken-b448328f168c)，当年 17 罗汉里的 Ron Jeffries 也说：[搞什么敏捷别搞了](https://ronjeffries.com/articles/018-01ff/abandon-1/#fn:agile)。

最近有几个朋友抱怨在大厂里搞研发不带劲儿甚至有人就出来创业了，正好我在公司里又拉通管产研了，开跨职能的会略多，好像我突然想通了一件事：敏捷搞飞了的公司，核心问题可能出在程序员的自主权丧失上。

### 传统流程搞不定需求变更

在软件工程领域，人们首先采用是「瀑布」模式。

这很好理解，瀑布里的每个步骤就是一个标准化工厂里的车间。通过把整个研发过程单元化，交付的质量变得非常可控，交付的速度也可以通过优化每个「车间」的吞吐量来完成。

但「瀑布」面临两个无解的问题：一方面，软件的需求常常是由「错误」的人在收集：真正的开发者在瀑布的底部，他们离用户很远。

另一方面，软件的需求本身也很不稳定：要把造牛仔裤的工厂拿来造超短裙，非常费劲。

不过，这个阶段因为软件服务的还大都是航空航天、通讯、金融等行业，系统部署的成本非常高，所以瀑布的劣势被容忍了。

自从互联网出现，软件就不再是几个 Geek 在车库里较劲改变世界的行业了。

软件的部署成本变得越来越低，[复杂度](/2018/08/the-complexity-of-software-system/)却指数级增长。

市场的变化越来越快，竞争对手按月甚至按周而不是按年跟你打仗。

所以从 XP 的阶段开始，就有一个叫「[On Site Customer](http://www.extremeprogramming.org/rules/customer.html)」的概念，强调在整个软件的构建过程中，最好有一个用户就在现场，能够随时面对面进行沟通。

这个美好的愿望最终还是失败了。站在今天来看里面的原因，我觉得软件系统的价值有三段：

- 识别或者是设计用户价值（产品设计）
- 实现用户价值（系统研发）
- 传递用户价值（销售运营）

在 XP 阶段，希望通过把开发人员和某个用户弄到一个屋子来更快地完成具备用户价值的软件产品，但大部分开发都没有识别或者设计用户价值的能力。

大部分用户更没有。

这两位坐一起整出来的东西，可以想象。

### 敏捷与产品经理的崛起

 敏捷，或者我们缩小范围到 Scrum 流程，它并不像 XP 那样去规范系统是怎么被研发出来的：它不关心工程领域的实践，而是去规范：

 - 如何管理要构建的是什么系统。
 - 如何管理构建过程中人们怎么进行交互，特别是怎么开会。

 同样，站在今天来看，我觉得它的流行可能仅仅因为一点：它定义了 PO（Product Owner）这个角色。

 研发团队不再像过去那样「拥有」自己开发的系统，PO 负责和用户、营销部门以及管理层沟通，并决定研发团队做什么不做什么。

 大部分开发人员对这种变化是高兴的：一方面很多研发对寻找用户价值既缺乏灵感也缺乏兴趣。更重要的是，这个阶段程序员的收入开始起飞：只用好好写代码就可以赚钱，有什么不高兴的呢？

 接下来，在一些大公司，PO 被推向更大的舞台，成为产品经理（Product Manager）。围绕这个角色，各大公司开始构建敏捷的，自组织的团队，构建出一个个成功的产品。于是其他公司开始纷纷效仿，大部分的做法都是把 Scrum 里的 PO 直接拿去做产品经理：以至于今天在 90% 的公司里面，PO 和产品经理是一个意思。

### 从构建者到蒙头驴

 在我管理过的所有团队，刚刚实施敏捷的时候，研发都很高兴：他们不需要跟那些普通人类沟通了，并且有人负责明确需求是什么。

 但很快，研发尝到了交出控制权的后果：尽管工资还是不断在涨，他们觉得每天都在构建他们不理解甚至不认可的系统。当偶尔参与到他们认可的系统的构建中去的时候，他们发现自己没有影响力。

 大家都知道微信是张小龙的作品，好像理所当然。但你只要想想 Linus 在 Linux 上的影响力就能感受到这是两个时代：就好像电影从当年的制作人中心制变更到今天的导演中心制一样影响深远。

 很快研发就会发现自己失去的不仅仅控制权。

 在敏捷中，产品经理维护 「backlog」来确定现在和将来研发做什么。

这个词的原意就是「积压的工作」。

它背后的隐喻是：如果研发完成了积压在那里的产品经理的规划，产品就会成功。

但在操作中，渐渐地这不再是一个隐喻：

- 研发被当成一种「资源」，工作目标变成「按时保质」交付，对需求的质量不能也不用负责。
- 产品经理总是可以抱怨研发的交付速度太慢；研发总是可以抱怨产品的需求很渣。

但尽管网络上流行着各种各样产品经理和研发之间冲突的段子，这个框架却流行开来。

我觉得是因为大家都找到了跟公司交代的理由：

- 产品经理总是规划超出研发产能的 backlog，然后宣称这些功能只要实现了，就能成；
- CTO 们根据 backlog 告诉管理层，如果我们招聘更多的研发，就能做完这些功能；

每个人都把用户价值的问题变成了一个资源问题，并且这个问题还不是靠自己可以解决的，真好。

这里比较可怜的是研发：既然是一种资源，那么对企业来说，资源的利用率当然是越高越好的。

于是人们开始担心研发在偷懒，开始做各种人效提升，开始发明和推行 996 之类的措施。

于是人们削减本来应该投入在研发的时间和资源，对造成的后果美其名曰「技术债务」：先不管那些工程上的最佳实践，将来再来还债。

研发的收入仍然不断在提升，但干起活来，就像被戴上眼罩拉磨的驴。

区别可能是，这副眼罩是纯金的。

![dev_donkey.jpg](/downloads/images/2020_05/dev_donkey.jpg "Don't touch me...")

### 我们能改变什么？

大部分技术债务都是产品通过自己的「信用」来抵押，牺牲留给研发的时间，来获得更快的上线造成的。

但放债的是产品，还债的却是技术，这就是控制权的威力。

我们能改变什么？从个人的角度，我觉得可以多从用户价值的角度去思考，学会说「不」。

乔布斯说自己当年在苹果干掉了很多团队引以为傲的功能设计：

> "But Apple suffered for several years from lousy engineering management. And there were people that were going off in 18 different directions - doing arguably interesting things in each one of them. Good engineers. Lousy management. And what happened was, you look at the farm that's been created, with all these different animals going in different directions, and it doesn't add up. The total is less than the sum of the parts. And so, we had to decide: What are the fundamental directions we're going in? And what makes sense and what doesn't? And there were a bunch of things that didn't. And microcosmically they might have made sense; macrocosmically they made no sense. You know the hardest thing is ...When you think about focusing, you think, well, focusing is about saying yes. No! [And] you’ve got to say No, No, No … and you say no [and] you piss off people […] You want to be nice […] The result of that focus is gonna be some really great products where the sum is much greater than the sum of the parts […] Focusing is about saying no."

但敏捷带来的势能巨大的工作习惯不是一两个人说「不」就能解决的。

作为一个组织，我们在西瓜尝试一些不同的东西。

第一步，我们去除对研发「资源化」。我们从讨论人效、研发员工数量、燃尽图、截止日期和 backlog，到讨论 SLI、SLO、WIP、lead time，通过对研发团队的时间进行保护而不是进行榨取，通过让他们更加直接的感受和参与到用户体验的构建，来提升大家的[绩效](/2018/08/how-to-improve-tech-organization-performance/)和工作体验。

第二步，我们对产品考核「结果」。当产品是否成功是通过完成 backlog 来衡量的时候，能够获取资源完成尽量多任务的产品经理就混得最好。但 backlog 本质上只是给研发团队的输入，我们不能只看重输入：我们关注产品特性的**设计承诺**和**上线结果**。

第三步，我们训练整个组织从用户价值去思考的能力。从核心团队，到一级部门二级部门负责人，我们使用[北极星](/2020/03/how-to-write-business-strategy/)、共创会、OKR 等构建了一套围绕用户价值，从识别洞见，到形成战略，到制定目标并跟进的工作方法。

这个过程非常的困难，甚至很多时候是痛苦的：虽然这个世界上看过「第一性原理」，说过「用户价值第一」的人如此多，但是能够去思考和实践的人太少了。

但，你愿意一直戴着眼罩吗？哪怕它是金的？
