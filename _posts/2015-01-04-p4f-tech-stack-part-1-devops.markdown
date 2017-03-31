---
layout: post
title: "Goodbye Palm4fun, and the tech stack review Part I"
date: 2015-01-04 14:44:23 +0800
comments: true
categories:

- p4f
- tech-stack
- tools-i-use

---


![goodbye](/downloads/images/2015_01/goodbye_palm4fun.png "Don't touch me...")

大概两年前，和Bergkamp、194一次计划外的聊天之后，<strike>出于保护直肠的目的</strike>，本座离开了基友密布的[Myriad](http://www.myriadgroup.com/)，作为Palm4fun的联合创始人之一，开始捣鼓着自己创业。

在具体的研发工作方面，我主要是负责服务器端的开发。但因为被冠名CTO，我的工作还包括：

- 制定研发流程，管理运作研发团队（很幸运，团队都是气味相投的小伙伴并且平均水平很高）
- 搭建和维护各种IT系统让大家的工作更加轻松
- 对各种项目进行技术选型、风险评估和报价
- 培养有palm4fun自己特色的团队文化
- 甚至是，设计我们的logo和[T-Shirt](http://lenciel.com/2014/09/logo-test/)

别误会，并不是和写代码比，我更喜欢做这些事情：我做这些，主要是经过多年的折腾，已经对自己想在什么样的环境里进行软件开发有了自己的体会。所以，我当然愿意花时间和小伙伴们一起，把理想中的工作环境具体到实践。

经过这两年的时间，虽然我们有纯技术团队创业理应遭遇的各种捉襟见肘，但因为整个团队的坚持和付出，在活下来的同时，也完成了一定的技术积累。有一个可喜的现象是，我们自己参与开发孵化的项目，虽然有一些死掉了，但也有一些拿到了几百万的天使投资；而我们作为外包方参与研发的项目，客户都非常认可我们的项目质量和工作方式。很多客户不但和我们确定了长期合作的关系，还积极介绍自己朋友的项目给我们。

新年到来之际，随着我们被[Testbird](http://www.testbird.com/)收编，Palm4fun大部分成员即将投入到新公司的各条战线，Palm4fun作为一个组织也就此消亡了。回首这两年，我想说，如果你没有和我一起经历那说了你也不懂我还是不说了......

跨年的时候，茕茕孑立的本座画了张思维导图，主要目的是把过去两年palm4fun的积累整理一下。画出来之后很多朋友希望我分享高清无码图：因为整个图非常大，不太适合在移动设备上看。

![stack_all](/downloads/images/2015_01/p4f_stack_all.png "Don't touch me...")

其实在一开始选择这些的时候，基本上就是从运维支撑和测试部署工具、产品开发和数据管理、基础设施和功能模块以及商业工具四个维度出发，所以就拆成四个部分简单过一遍。特别声明：选择的依据和出发点主要是根据个人喜好，包括自己使用的体验以及眼缘，并没有特别的理由。比如我们用Reviewboard不用Phabricator，完全是因为团队中大多数人已经用习惯了。

## Build/Test/Deploy

![stack_devops_1](/downloads/images/2015_01/p4f_stack_devops_1.png "Don't touch me...")

- 我们没有用Gerrit或者Phabricator的原因是它们功能太多了
- Ngrok是做微信接口调试时意外发现的好物


## Monitoring

![stack_devops_2](/downloads/images/2015_01/p4f_stack_devops_2.png "Don't touch me...")

- Sentry帮我们在用户找到我们之前找到了很多问题
- 一开始我们用过Nagios，它的设计也很不错，就是界面太...
- Zabbix帮我们远离主机因为硬盘满了或者内存不够驾崩的场面
