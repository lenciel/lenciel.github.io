---
layout: post
title: "Palm4fun Tech Stack Review Part II"
date: 2015-02-20 14:11:19 +0800
comments: true
categories: 

- tools-i-use
- p4f
- tech-stack
---

距离[上篇](http://lenciel.com/2015/01/p4f-tech-stack-part-1-devops/)略久，主要最近很忙。

## Application & Data

和其他几个提供辅助的部分不同，App/Data这部分基本上就是产品本身了。

### Application Hosting

![stack_devops_1](/downloads/images/2015_01/p4f_stack_app_data_1.png "Don't touch me...")

我们在选择云的时候，也有试用过“久负盛名”的几家大的。

- 阿里因为性价比的原因直接被我忽略了
- AWS显然是成熟度最高的，但是在国内用起来确实比较憋屈，希望他们正式入华后有好转
- Google的Compute Engine和Windows Azure都属于开张不久，前者因为有打折劵最终被我用来做了很久的翻墙代理（但是也因为忘记关VPS收到了巨额账单，好在Google还比较厚道免单了）。后者因为在国内有部署，速度非常不错，但是整体比UCloud还是贵了不少。

最终我们选择了UCloud，他们的价钱比较公道，服务也做得非常棒。虽然我们机器并不是很多，但是仍然有24小时随叫随到的服务团队在跟，并且服务团队的技术实力在国内的服务提供商里面也非常突出。

平时还有一些抛弃型的原型我会放到Heroku或者Google App Engine上，因为它们用来部署Django应用非常便捷。

我们大多数项目都只是简单的管理后台，用Apache还是Nginx并没有明显区别。因为Apache在大多数OS自带，所以基本上都是以Apache+uwsgi+supervisor来进行部署。

### Languages & Frameworks

![stack_devops_1](/downloads/images/2015_01/p4f_stack_app_data_2.png "Don't touch me...")

这张图再画长一倍也不一定能画完，因为这部分特别是Web前端技术的变动实在是太大了。感觉JavaScript社区换框架、方法论、编译工具甚至是VM就像足球运动员换袜子一样勤。

所以我们的策略一直是不绑定到某个具体框架：那样很容易被绑架。从目前来看：

- React/Flux最近特别火，由Facebook内部使用并开源（特别是最近推出了React Native）。
- AngularJS，火了很长时间，由Google内部使用并开源。目前两个主要版本变动太大嘴炮很多，可以观望到尘埃落定再考虑深入学习。
- Backbone是非常不错的客户端MVC框架。
- node.js和io.js。目前它们是一样的东西，io.js只是node.js的一个fork（类似于Hudson和Jenkins的关系）。目前可以只学node.js但是得盯着io.js的发展，因为很多原来node.js的主力都在io.js这边。
- npm是Javascript目前最主要的package管理工具。目前你还会听说bower但几乎大家都已经确认这是个愚蠢的idea。另外你还会听说jspm，一个很新的系统，非常不错，值得留意。
- Browserify使得你可以在browser里面直接使用npm的module，而不仅仅是在server端。完全是一次革命，非常好用。
- Gulp和Grunt是build工具（类比Ant/Maven），Gulp更新而且设计上非常成熟，推荐学习和使用Gulp。
- express.js是服务器端JS应用开发需要学习的东西。
- Meteor是设计非常领先的一个全栈的框架（想想Django），整体上非常酷，目前也很流行。如果你想试试自己的学习能力和承受能力，值得一试。 
- jQuery之于JavaScript就好比少林寺之于中华武术。每个人都在学，都以为它就可以搞定整个武林，但那是错的。JQuery是用来对DOM做操作的，如果你用它在干别的，你多半错了。

### Assets & Media

![stack_devops_1](/downloads/images/2015_01/p4f_stack_app_data_3.png "Don't touch me...")

这方面没什么好说的，一开始我们用的就是UCloud自带的服务。后面为Testbird开发项目的时候接触到了七牛云。不得不吐槽一下七牛云还处于快速增长期，不论是提供的服务的稳定性，还是文档更新的及时性，都还有很多值得提高的地方。

### Data Storage

![stack_app_data_4](/downloads/images/2015_01/p4f_stack_app_data_4.png "Don't touch me...")

数据库我们一般本地开发用SQLite，stage和prod服务器用MySQL。之所以没有选择Postgresql是因为它那些很不错的功能我们在项目里面还没有需要，所以就偷懒选择了自己更熟悉的系统。

### Libraries

![stack_app_data_5](/downloads/images/2015_01/p4f_stack_app_data_5.png "Don't touch me...")

这张图也是很难画完整的，因为它一直在变。不过我们基本上用ACE封装了一套自己的UI框架，对提高开发效率还是非常有用的。

## Utilities

![stack_utilities](/downloads/images/2015_01/p4f_stack_utilities.png "Don't touch me...")

都是些中规中矩的选择，因为好的服务都在国内被封堵得比较彻底，不是吗？

比如统计，百度做得和Google还差几个数量级（你见过实时统计有百度那么不实时的么？），但是在国内因为墙的关系常常还是只能用。

再比如SMS网关，国外有大量的类似[Twilio](https://www.twilio.com/sms/toll-free)的优质服务，价格便宜，接口良好，但是...我们都用亿美。

值得一提的是推送消息服务，因为被百度坑过，我们一开始用了我浙大著名创业公司“个推”，结果质量低得还比较离谱。最后好死不死又换到了百度Push：原因还是因为Google原生的Push被墙。

## Business Tools

![stack_devops_1](/downloads/images/2015_01/p4f_stack_business_tools.png "Don't touch me...")

其实Trello和Slack这样的工具用好一个就足以撑起一家中等规模的公司了。可惜因为经常被墙，很多不能自己翻墙的同事或者客户用起来倍感艰辛。

整个公司的任务驱动主要还是靠Jira，知识分享和管理主要是靠Confluence。

阿勒！