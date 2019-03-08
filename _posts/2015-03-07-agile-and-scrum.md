---
layout: post
title: "Agile and Scrum, The Love Story"
date: 2015-03-07 03:05:36 +0800
comments: true
categories: 

- rants

---

![Vhost threshold](/downloads/images/2015_03/minime.png "Don't touch me...")

本次吐槽献给Scrum Master们。毕竟了解了软件社区其实对Agile和Scrum的情绪已经有些像走到结尾的爱情故事，也许可以让大家在工作中不要把自己和大家SM得太惨。加上我们进新公司之后也在推行敏捷流程，不如整理一下本座对这套东西好鬼复杂的情绪...

Agile，中文翻译为“敏捷”，是在90年代逐渐引起广泛关注的一系列新型软件开发方法的总称。其中“敏捷”的语义主要是指应对快速变化的需求。

敏捷思想发展到顶峰的标志是[Agile Manifesto](http://www.agilemanifesto.org/history.html)的正式定稿。当时大概谁也没有想到，2001年二月这群敏捷方法发起者和实践者在美国犹他州雪鸟滑雪圣地的一次聚会后的产物，能在软件工程和方法论范畴独领风骚这么多年。

但敏捷再好，它毕竟是人写的不是神写的，也会随着技术的不断革新慢慢变得过时。类似的，[Scrum](http://en.wikipedia.org/wiki/Scrum_(software_development)这种用于实践敏捷的开发流程虽然也大红大紫了这么多年，但它也暴露出了不少缺陷。

## 瀑布文档过多，敏捷文档过少

世界[变平了](http://book.douban.com/subject/1867642/)之后，大多数的公司团队是分散在多处的。即便是TestBird这样没有超过100人的公司，办公地点也分布在多个国家和地区。而在编写Agile指南的2001年，<del>本座还细皮嫩肉</del>，Subversion还是新鲜货，Git还没有被发明，Skype这类VoIP的方案还没有出现，云还仅仅是用来下雨的。因此[里面说到](http://www.agilemanifesto.org/principles.html)：

<blockquote>
<p>在开发小组中最有效率也最有效果的信息传达方式是面对面的交谈</p>
</blockquote>

当然，值得一提的是强调沟通本来就不是Agile的发明。在Agile Manifesto刚刚被编写出来时还占据着主流的[瀑布式开发](http://en.wikipedia.org/wiki/Waterfall_model)里，要求编码开始前撰写非常详细的文档，然后再对这些文档进行充分的评审：沟通和讲解其实是完成这些工作的前提。只不过Agile不但高度推崇面对面的交流，而且鄙视文档活动，结果虽然在一定程度上减少了瀑布流程里面写文档写到程序员晕厥的状况，但又对公司造成了新一轮的伤害。

### 讨论之后还得多写写

在软件开发中，有些工作通过口头交流本身就是低效的。

当然有适合面对面讨论的部分：比如对关键模块的技术选型，比如对业务流程和需求的澄清。

但进入设计和实现阶段的活动，应该是看得见摸得着版本化可回溯的，所谓"a wireframe is worthy than one thousand words，a prototype is worth a thousand wireframes"。

比如下面是一次提交之后Gitlab上提供的查看diff的界面：通过这样的方式review整个改动，比小伙伴坐在自己怀里结对编码要清楚得多（而且小伙伴坐在怀里的时候引发的羞赧常常让你难以把他的错误直接打到他脸上不是么）：

![Vhost threshold](/downloads/images/2015_03/gitlab_diff.png "Don't touch me...")

所以我会经常在公司里面鼓动大家把输出都落到代码和文档里面。经过一段时间，就会慢慢看到有人在群里面问“那个什么什么是怎么回事”的时候，后面的回复是“你去看看confluence上xxx页面”或者是“这个是jira的xxx问题单讨论的”。

![Vhost threshold](/downloads/images/2015_03/written_words_is_better.png "Don't touch me...")

如果你的员工经常需要重复回答同一个问题，包括来个新员工这个环境怎么配那个Wifi的密码还需要人告诉他/她，你也好意思说自己是敏捷的？

### 讨论之前最好多写写

强调面对面沟通，而弱化文档和代码本身在沟通中的作用，造成的一个更严重后果是面对一个问题，大家不仔细思考就开会讨论。结果会上随便放炮，下来各不认账。

我在M记做PM的时候，项目组里面有几位韩国同事。因为是远程办公，每天除开代码之外，我们只能通过Skype交流。这里面有个叫Jason的同事，无论分给他什么活，他不但做得飞快，而且还会以[Confluence](https://www.atlassian.com/software/confluence)上一篇甚至几篇洋洋洒洒的文章作为交付。

在回顾那个项目的时候我发现，我和他没有每日站会，没有Sprint结尾的demo，但我们之间的沟通是整个团队里面最高效的：每天查看他提交的代码和文档，我就非常清楚他的进度和问题了。

这样做的收益并不仅仅是我们之间沟通的高效。

在他第三个小孩儿出生之后一周，他搞定了一个非常复杂的调研任务。聊天的时候我问他怎么可以在那么多私事需要处理的情况下弄得这么快。他说，有很多时候在confluence上写着写着，自己的思路就清晰了。

这也是我自己的感受。很多次我在写邮件问其他人问题的时候，邮件写完自己就有了答案。我自己呆过的团队，厉害的工程师都非常能写：他们的区别不过是有些人只记录给自己看，有些人会写给大家看。

## 流程、工具和个体究竟谁更重要

前面说了技术的革新使“面对面沟通”的重要性变得过时和有害。那么下面这个Agile核心思想呢：

<blockquote>
<p>个体和个体间的交流比流程和工具更重要</p>
</blockquote>

我自己对这种“人定胜天”的论调天生有抗拒感。就像当年主席发明这句话是因为大家日子过得足够糟一样，只有你为团队提供的工具足够糟才需要这么去忽悠大家。

软件开发是一项和工具高度相关的工作。除去你的生产活动的效率很大程度上取决于你对工具的熟悉程度以外，你还需要使用工具参与到流程中：和其他人交流、配环境、提单、解bug、记录工作时间等等，都离不开工具。

无论你的团队好好工作的意愿多么强烈，如果你还在用sametime而不是slack，还在用破破烂烂自己开发的测试用例管理工具而不是rally，你的开发流程就是不如别人顺畅。

因为使用的工具可以“塑造”你的团队沟通的方式（反过来你团队沟通的方式也可以塑造[他们使用工具的方式](http://haacked.com/archive/2013/05/13/applying-conways-law.aspx/)）。

这也就是[Marshall McLuhan](http://en.wikipedia.org/wiki/Marshall_McLuhan)的著名论断`The medium is the message` （[Wired](http://www.wired.com)杂志把他视为办刊的精神导师，我觉得搞互联网的人都该看看他的书）:

![Vhost threshold](/downloads/images/2015_03/mcluhan.jpg "Don't touch me...")

## Daily StandUp or Daily FuckUp

<blockquote>
<p>市场销售人员和开发人员应该在整个项目过程中每天都在一起工作</p>
</blockquote>

首先，严格的区分市场销售人员和开发人员本身就是个糟糕的主意。

其次，“每天都在一起”也是奇怪的号召，而在Scrum流程中，这种奇怪的号召被具体化，成了每日站会。我经常在参与站会的时候听到小兄弟们说的其实是“我昨天说我要三天做完的事情，真的还要两天”。作为职业玩家，职业程度很多时候就体现在不需要每天都告诉其他人自己要怎么做。可以想象一下830每天开个站会，然后梅西说，我今天可能需要在训练里面给伊涅斯塔传5个过顶球，你做好胸部停球转身抽射的准备……

## 敏捷文化

我本身是挺讨厌“方法论”者和他们发明的术语的。当然，可能也不是我一个人讨厌。参与了Agile Manifesto制定的Dave Thomas在[Agile Is Dead](http://pragdave.me/blog/2014/03/04/time-to-kill-agile/)里面说过：

<blockquote>
<p>I haven’t participated in any Agile events, I haven’t affiliated with the Agile Alliance, and I haven’t done any “agile” consultancy. I didn’t attend the 10th anniversary celebrations.</p>
<p>Why? Because I didn’t think that any of these things were in the spirit of the manifesto we produced...</p>
<p>The word “agile” has been subverted to the point where it is effectively meaningless, and what passes for an agile community seems to be largely an arena for consultants and vendors to hawk services and products.</p>
</blockquote>

在我看来，就好比真正明白某个知识的人总是能用大白话把你讲明白一样，在敏捷开发流程里面被某些公司鼓吹的那些活动和术语在我看来都是些没有价值的东西（ThoughtWorks，说你呢！）。

比如Scrum，我从来不说我们用Scrum，而说我们搞迭代（如果和老外我也说iteration而不是Scrum）。
比如Sprint，我从来不喜欢说我们这个Sprint，而是说我们这个迭代。
迭代本身是个有语义的好词语，为什么不用它呢。

就像Gregg Caines在[这篇文章](http://caines.ca/blog/2014/12/02/i-dont-miss-the-sprint/)里面说的一样：

<blockquote>
<p>when you want to get people to change the way they work, and you want them to understand the completely foreign concepts you’re bringing to them, it’s absolutely crucial that you name the thing in a way that also explains what it is not.</p>
</blockquote>

然后他还说：

<blockquote>
<p>In Scrum, it’s also common to have a “sprint commitment” where the team “commits” to a body of work to accomplish in that time frame. The commitment is meant to be a rough estimate for the sake of planning purposes, and if a team doesn’t get that work done in that time, it tries to learn from the estimate and be more realistic in the next sprint. Developers are not supposed to be chastized [sic] for not meeting the sprint commitment — it’s just an extra piece of information to improve upon and to use for future planning. Obviously naming is hugely important here too, because in every other use of the word, a “commitment” is a pledge or a binding agreement, and this misnomer <em>really</em> influences the way people (mis)understand the concept of sprints. Let’s face it: if people see sprints as just more frequent deadlines (including those implementing them), the fault can’t be entirely theirs.</p>
</blockquote>

的确，问工程师要个estimation然后把它当成commitment，这不是耍流氓么。不仅仅是Scrum，大多数的组织里面推行一年半载的敏捷流程，大多数人还是对它究竟每个阶段在干什么迷迷糊糊。即便是靠培训敏捷流程混饭的公司也[承认](http://martinfowler.com/articles/agileFluency.html)要把他们鼓吹的流程落地是非常难的：

<blockquote>
<p>In our experience, it takes a team two to six months to become fluent at the one-star level. About 45% of the teams we talk to say they’re fluent at this level.</p>
<p>Reaching the two-star level takes another three to 24 months, depending on the amount of technical debt in the code. About 35% of teams report fluency at this level.</p>
<p>Three-star teams are much more rare. About 5% of teams report fluency at this level. We’ve heard reports ranging from a year to five years to reach this level of fluency.</p>
</blockquote>

## 我们的选择

敏捷开发的很多思想是有益的，但我们没有用Scrum和它那堆奇怪的活动（standup、sprint planning等等）。我们鼓励少开会，多通过[异步的方式沟通](http://tomayko.com/writings/adopt-an-open-source-process-constraints)而不是经常让大家停下手里的工作来进行讨论。我们也从来不对estimation之类的东西认真，更不去做什么burndown或者计算点数，因为Agile Manifesto里面说过：

<blockquote>
<p>可以工作的软件是进度的主要度量标准</p>
</blockquote>

自动化测试、持续集成、自动部署、有效的监控和运维，让你的软件随时可以发布，才是产品可以不断演进的根基。