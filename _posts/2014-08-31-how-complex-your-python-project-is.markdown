---
layout: post
title: "How complex your python project is?"
date: 2014-08-31 21:04:47 +0800
comments: true
categories:

- tools-i-use
- python
- data-virtualization

---

最近诸事不顺，却也理所应当。

晚间时段迷上写字和画画，大概是因为之前看[《Cashback》](http://www.imdb.com/title/tt0460740/)印象太深刻，觉得这些是美好遗失前力挽狂澜的技艺。

除开纸上涂鸦，还用机器画了不少鸡零狗碎的东西：我想用python画点儿T恤图案，印出来送给大家，给大伙儿同时也给自己打打气。

一开始看中了基于[Graphviz](http://www.graphviz.org/)的[Snakefood](http://furius.ca/snakefood/)。

最开始接触Graphviz是因为[django-extensions](https://github.com/django-extensions/django-extensions)项目用它来画django model的[关系图](https://code.djangoproject.com/wiki/DjangoGraphviz)。我们用它冒充ER图，拿去跟那些喜欢看文档但其实又不专业的官僚客户们交差。

Snakefood更进一步，通过分析你的代码依赖，从而得出你代码的“复杂度”。

“复杂度”其实是用“代码行数”衡量码农工作效力被普遍吐槽之后，大公司发明出来折腾工程师的诸多metrics里面还算有点儿用的一个：至少你可以让要接手的人看看这项目大概是个什么规模，以及，大概要挠破几寸头皮才能看懂。

当然，Snakefood这种基于文件依赖的复杂度分析其实不算特别靠谱，这可不是什么[Cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)，更像是开飞机的时候边排查“事故征兆”边驾驶的辅助工具。作者自己是这么说的：

{% blockquote Martin Blais%}
Producing pretty graphs is fun, but I found the most leverage of it when I try to make my code simpler, I generate the graph and inspect unexpected dependencies and try to refactor my code to simply the dependency graph as much as possible. 
{% endblockquote %}

下面是本座心目中永远的"优雅Python代码第一名"[Requests](http://docs.python-requests.org/en/latest/)的分析结果：

![requests](/downloads/images/2014_08/requests.png "requests dependencies")

再来看看[Django](https://github.com/django/django)的最新版分析结果：

![django](/downloads/images/2014_08/django.png "django dependencies")

下面是本座最近撸完的一个项目，印到衣服上感觉还好吧：
![yawp](/downloads/images/2014_08/yawp.png "yawp dependencies")

结论
------

首先，本座挺喜欢Snakefood那种Unix范儿的：所有的命令都可以给其他命令来一管，比如：

```bash
    sfood ./src | sfood-graph -p | dot -Tps | pstopdf -i -o ./1.pdf
```

其次，本座开始计划是给每个人生成一个他们自己写的模块的依赖图，印到衣服上让大家自己穿。但试了之前几个项目之后，Hmmmm...有的同学大概是不会愿意的吧...

最后，T恤计划也没这么就打住：后来又发现了[nodebox](http://nodebox.net/)这种真正是拿来搞艺术的玩意儿，于是要生成一点儿敢往自己胸口放的东西变得方便多了，过两天如果公司没有倒闭，就把东西放出来让大家看看。

