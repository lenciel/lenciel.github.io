---
layout: post
title: "从Markdown列表转换成脑图"
date: 2016-02-25 21:19:33 +0800
comments: true
categories: 

- til
- tools-i-use

---

去年过年整理了一次[p4f的技术栈](http://lenciel.com/2015/01/p4f-tech-stack-part-1-devops/)，最近受[StuQ](http://www.stuq.org/subject/skill-map/)和[leohxj](https://leohxj.gitbooks.io/front-end-database/content/interview/skill-path.html)的启发又开始整理适合我司的各个研发职位的技能图谱：这类树状的图片其实就是脑图(Mindmap)。

图片形式的文档都有一个麻烦的地方，就是不太好做版本控制和review。比如如果本座来整理Web前端技能图谱，总希望：

- 能够发给前端组的人review
- 能够放到代码库，让前端组维护起来，根据业界动态不断更新

如果是张图片，弄起来就比较麻烦，这个时候就需要Markdown出场了。其实最近这几年，用Markdown写文档大概也算Best Practice的一个了。好处确实很多，最重要的两个：

- 集成到现有的开发流程里面把文档也交叉review、版本化、自动部署
- 有个三长两短的时候，迁移成本非常低

只不过从Markdown生成脑图还是比较偏门，所以分享一下。

其实大多数的脑图软件（ 比如MindNode或者Mindjet MindManager）都支持把缩进好的文本直接导入生成图片。以我在用的MindNode为例，你可以把下面的格式：

```
- 研发团队
	- 前端组
	- 后端组
	- 运维组
	- 测试组
	- 平台组
		- 数据组
		- RIO组
```

这样贴到MindNode里面，就会生成下面的脑图：

![Vhost threshold](/downloads/images/2016_02/mindmap_1.png "Don't touch me...")

但是上面的格式，如果是以Markdown的格式放到代码库里面，有略显难看。所以更进一步，你可以先用Markdown的`#`来标不同层级，使得文档本身可以在网页上显示成规则的列表，[类似这样](http://lenciel.com/2014/05/web-development-skill-set-and-reading-list/)，它的原始Markdown文件在[这里](https://gist.github.com/lenciel/637812a7dcbe8341b07b)。

然后，通过脚本把文档里面的`#`转换成`\t`，就可以得到能够直接粘贴到MindNode里面生成脑图的文本了。如果你是使用Mac，还可以直接把转换脚本创建成一个`service`通过`Automator`安装，这样你在任何一个Markdown文档上选中需要生成脑图的部分，右键就可以了：

![Vhost threshold](/downloads/images/2016_02/mindmap_2.png "Don't touch me...")

还有个未尽事宜就是在转换脚本里面加一个步骤：Markdown里面的链接，生成图片的时候把方括号、圆括号以及圆括号里面的链接去掉，不然就太难看了：

![Vhost threshold](/downloads/images/2016_02/mindmap_3.png "Don't touch me...")




