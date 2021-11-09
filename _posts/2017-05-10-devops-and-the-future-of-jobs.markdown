---
layout: post
title: "DevOps"
date: 2017-05-10 01:28:52 +0800
comments: true
categories:

- devops
- infrastructure
- bliki

---

## 定义

如果你的Manager对着一堆项目指点江山：「我们要在A项目里做DevOps，我们要B项目也做DevOps，哦，还有那个C项目。」

你心里面难免犯嘀咕：「做DevOps是做什么？」

这很正常。

本座见识过的各种DevOps布道，听众们往往不是大腿一拍醍醐灌顶的神态, 而是一脸困惑欲言又止想问又不知道从何问起的样子。

很多公司的DevOps落地就像我们提到的这位Manager，拉一堆人画一个圈，你们来做DevOps，好像就完成了。

从业多年的你已经有经验，所有没法被很好地翻译成中文的术语，都要小心。比如[Bounded Context](/2017/02/bounded-context/)，比如DevOps。

所以你去查，DevOps是什么？

网上有张流传甚广的图：

![Vhost threshold](/downloads/images/2017_05/devops.png --alt Don't touch me)

这张看起来颇有道理的图其实什么也没有说：测试、开发和运维这三种角色的工作，究竟有什么交集，可以被称为DevOps呢？

## 其实

DevOps从2009年被提出，算是顺势：敏捷流程在大量的公司落地以取代过去的瀑布流程。

实施敏捷流程一个主要的诉求就是尽快发布可用的版本，迭代试错。而当时的业务运维部门（Ops）的工作方式是满足不了这样的需要的。

传统的运维，主要考核指标是业务系统的「稳定运行」。所以他们会制定很多的流程甚至惩罚措施，来规避风险。而且，半夜出事儿了，第一时间被呼起来的是他们又不是开发，所以虽然私下里在机器上开了各种端口通了各种隧道方便自己在三亚休假时，也能把产品数据库的备份恢复，但是他们面对业务方总是「铁面无私」的。

开发当然会抱怨：上线慢啊，对线上系统接触不到啊，查个数据库都要找人啊...

但尽管研发流程「敏捷」了，也没有哪个决策者可以跳出来说运维部门制定出来的九九八十一步的流程可以不走，开发自己部署自己搞就好，因为：

1. 研发具备运维知识的人确实很少
2. 出了问题自己要背锅

但因为下面几个因素，造成运维这个环节不得不做出相应的改变：

1. 云相关的技术日益成熟之后，过去Ops团队需要负责的很多工作都交给了云服务提供商或者内部的基础设施团队
2. 随着分布式系统的日益普遍，微服务架构等各种把业务系统打散拆小搞自治的实践逐渐[成为主流](/2017/02/the-real-success-by-doing-msa/)，越来越多的团队[要求开发的人必须具备运维](https://speakerdeck.com/charity/keep-calm-and-carry-on-scaling-your-org-with-microservices)的技能
3. 随着容器等技术的成熟，镜像逐步替代软件包，成为了交付的主体：和软件包不同，它集成度更高（对外暴露的只是ip+端口），包含了配置信息，部署更加方便。随着「基础设施代码化」等工作落地，本地的开发环境和线上环境的差异也更小了，降低了部署工作的门槛

但面对业务运维日新月异的要求，运维工程师（大多数背景是系统管理员）的技能和视野往往是不够的。于是一种折衷的方案：把部署和运维软件的职责从运维团队开放给别的部门，权力下放的同时责任也共同承担，于是DevOps运动就出现了。

到2012年左右John Wills开始卖[《Cookbook of DevOps》这本书](http://itrevolution.com/the-convergence-of-devops/)时，就已经说，DevOps这词包括了：

- The Agile Infrastructure Thread
- The Velocity Thread
- The Lean Startup Thread

所以DevOps不是职称或者工种，也不特指某个具体内容的工作。

Wikipedia说它是[文化](https://zh.wikipedia.org/wiki/DevOps)，Amazon说它是[文化](https://aws.amazon.com/cn/devops/what-is-devops/)，Thoughtworks也说它是[文化](https://martinfowler.com/bliki/DevOpsCulture.html)。

文化是需要土壤的，软件团队的文化，生长的土壤主要指：

- 组织结构
- 开发流程
- 技术栈

如果没有相应的土壤，「文化」就只是「文化知识」。拿来对下面的人讲，很难讲清楚，更难落地。

这也是DevOps被很多人反对的原因。

Jeff Knupp觉得这就是在「[残杀Developer](https://jeffknupp.com/blog/2014/04/15/how-devops-is-killing-the-developer/)」，Twitter的基础架构工程师Cindy Sridharan也发文[抨击过](https://medium.com/@cindysridharan/what-is-devops-5b0181fdb953)把它当成一个工种或者工作内容。

所以，因为这些历史原因，即便是你跟头脑很清晰，认识很正确的人讨论DevOps，也需要问一下他/她的重点是指下面三方面的哪个方面：

- 设施：如何借助基础设施即服务、运维自动化等手段，加快代码部署到生产环境的速度
- 监控：如何借助日志和监控手段，及时把生产环境的情况反馈到开发团队。
- 运营：如何借助端到端的埋点、数据采集、分析和可视化，把用户行为反馈到业务


## 工种的未来

其实在我眼里，DevOps的出现很早。Google在2003年建SRE团队的时候，Ben Treynor就说（我觉得Ben关于SRE的每句话都值得[认真去看](https://landing.google.com/sre/interview/ben-treynor.html)），这个部门的定义是：

> "what happens when a software engineer is tasked with what used to be called operations."

所以，多看看大公司里面各种职位的演化，对年轻的朋友们开拓视野，规划自己的发展是很有益处的。

但赶时间的同学不妨听我来多嘴几句。

### 测试

在一线公司特别是互联网公司里面，测试的角色早已经发生变化了。Facebook、Google、Amazon的专职测试人员不断缩减，微软更是把SDET (Software Development Engineer in Test) 和SDE（Software Development Engineer）两个职位合并了。国内也是阿里走在前面，接下来各个龙头企业都在跟进。

为什么测试团队会缩编？因为就目前整个软件研发流程而言，软件工程师需要负责代码、单元测试和集成测试的开发。自测完毕代码提交后，CI上还会有自动化的回归测试，通过之后代码被CD系统部署进行功能验证或者灰度发布。

特别是互联网行业，一方面，要构建一个和生产环境一样的stage环境进行测试非常困难，要把生产环境上的问题测出来难度很大；一方面，整个部署和试错的成本，相对传统的如电信，存储软件这样的平台，相当可控，让用户当小白鼠未尝不可。于是，纯粹进行功能验证的测试团队，规模在不断缩减。而开发测试工具测试框架，CI和CD平台的团队慢慢成为了标配。

如果你是测试工程师，应该从聚焦在功能测试，转变为聚焦在测试工具和框架上了。

### 运维

先是很多公司效仿Google，把基础设施和运维团队进行了合并，称为SRE。他们的职责包括了构建基础设施，配置管理系统，日志管理系统，容器管理系统，监控等等。

Amazon能够搞出AWS，跟他们内部推崇人人都可以独立地完成编写代码，测试代码，版本管理，部署上线，进行服务监测等任务，从而把整个基础设施乃至整个技术栈都PaaS化了，有很大关系。

所以，随着DevOps运动不断深入，运维需要越来越多的承担起把整个公司的技术栈在开发测试环境和生产环境以PaaS的形式对其他部分交付的工作。

### 开发

我很喜欢的Esty的CTO，[John Allspaw](https://twitter.com/allspaw)在[一个采访](https://thenewstack.io/etsy-cto-qa-need-software-engineers-not-developers/)里面说过，我们不要开发（Developer），我们只要软件工程师（Software Engineer）。

这一句话，就可以抵一万句了。



