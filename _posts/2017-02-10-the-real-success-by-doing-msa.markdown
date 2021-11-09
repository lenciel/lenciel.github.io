---
layout: post
title: "推行微服务架构的最大收益"
date: 2017-02-10 17:58:52 +0800
comments: true
categories:
- microservice
- hcb
- MSA
- event-driven
- architecture
---

作为行业里面最火热的名词之一，「微服务架构」在[Amazon](http://www.zdnet.com/article/soa-done-right-the-amazon-strategy/)、[Netflix](http://nginx.com/blog/microservices-at-netflix-architectural-best-practices/)等大厂取得的成功，大家算是耳熟能详了。

但是作为CTO、技术VP或者架构师，要把你服务的公司或者项目加入到「实践微服务并取得成功」的列表上，难度其实是很大的。仅仅是把自己的系统打散成多个服务，就有很大的[成本](https://www.slideshare.net/ceposta/camel-microservicesfabric8)。所以Martin Flower也[提醒过](http://martinfowler.com/articles/microservice-trade-offs.html)要当心入坑。

所以看到各种会议，博客，社交媒体上实施微服务架构的经验分享时，要明白这里面真正的成功并不在于对各种技术的应用，或者说，在成功利用Docker、Kubernets或者SpringBoot等等性感的技术之外，微服务架构带来的最大的收益并不简简单单是技术的落地。

## 最大的收益

微服务架构真正的收益在于形成小而美，能胜任各种职能的扁平化，自组织，自管理的团队，完成在传统组织架构下无法完成的拓展性和创新性工作。

### 两个披萨的团队

Amazon的「团队规模应该控制在点两个披萨就可以吃饱」的规则很有名，Jeff Bezos[自己说](http://99u.com/articles/7255/the-jeff-bezos-school-of-long-term-thinking)：

> Managers: We need more communication on and between our teams
> Bezos: No. Communication is terrible」

要构建自组织的，创新的团队，需要的不是「更多」的沟通而是 [更有效的沟通](http://blog.idonethis.com/two-pizza-team/)。这点说起来容易也很好听懂，但要做到其实非常难，只要看看你自己手机上那50多个工作原因拉的微信群就知道。

但我们可以在团队规模较小的时候开始尝试。所有人一起办公，培养起友谊和信任，产生化学反应互相激发：这样发生[group think](https://en.wikipedia.org/wiki/Groupthink)或者[social loafing](https://en.wikipedia.org/wiki/Social_loafing)的几率就会变小很多。

[J Richard Hackman](http://hackman.socialpsychology.org/)在研究了团队和组织之后指出，团队里面的人之间的沟通和人数的关系是：

> (n*n-1)/2

如果人数n不断增加，顺畅沟通的难度就会变大，团队的效率就会降低。

Hackman建议的人数是10人以内，Amazon一般是6-8个人，海军陆战队是4人一个编组：也就是说，人数不需要那么死板的规定，只是应该比较少。

其实要感受这个不需要那么多理论，回忆一下参加一个婚礼时在餐桌上沟通的质量，和跟两三个朋友喝个茶沟通的质量对比一下，就明白小团队的优势。但我还是推荐好好读读Hackman关于[团队的文章](http://econ.au.dk/fileadmin/Economics_Business/Currently/Events/PhDFinance/Kauttu_Why-Teams-Dont-Work-by-J.-Richard-Hackman.pdf)。

### 多功能团队

为什么我们需要一个团队有各种功能，而不是负责开发、测试、产品、运维的某个单一方面？

> Bad behavior arises when you abstract people away from the consequences of their actions

创建团队在功能上的清晰分界，就跟告诉住宾馆的人弄脏了房间是服务员来打扫一样，是在鼓励「坏行为」的发生。一个优秀的程序员应该在编写质量上乘的代码的同时，关注可测试性、易维护性、安全性、性能、可扩展性和易用性等多个方面的问题。如果你划分了DBA、OPS、QA等职能团队，开发自然而然的就会认为自己把功能实现出来，工作就完毕了，下面的话就会出来：

- 「我哪有时间测试，那是测试做的」
- 「数据库的变更找DBA」
- 「我只负责这个功能的实现，基础设施和运维负责它的高可用」

要防止这些对话发生在你的团队，就需要引导和宣扬「一专多能」的文化。在很多成功的公司里面（Amazon，Netflix，Facebook，Google）都很强调这点，比如Amazon著名的「谁编写，谁负责」。现在行业里面很流行另外一个热词DevOps，实际上DevOps的本质是Dev在前的，甚至[不应该有专职的DevOps部门](https://www.rallydev.com/blog/engineering/you-don-t-need-devops-team-you-need-tools-team)。

### 康威定律

软件开发里面，技术问题远没有人的问题难解决。所以康威说：

> organizations which design systems … are constrained to produce designs which are copies of the communication structures of these organizations

要如何打破内部各个团队之间的壁垒呢？除开自顶向下的进行组织架构的变更，还可以尝试内部开源。

### 内部开源

一旦你打破职能壁垒，构建起小的，多职能的团队，就能够看到这些人为了构造一个高质量的软件系统，一起努力。他们的工作形态其实挺像开源组织的：大家都可以发表意见，都可以贡献代码，对最终的发布负责。

这样的团队形成之后，在他们的输出基本稳定成形后，就可以开始尝试内部开源。

## 总结

微服务架构的各种成功案例和大家拥抱它的热切姿态，很容易让我们觉得它解决了很大的问题。

其实微服务架构里面很多基本指导原则，SOA里面都有。但后者最终的失败就在于，虽然技术上有一整套WS-*的规范，但是却没有在组织结构上做相应的适配，所以陷入了康威定律指出的死路。

技术和流程当然很重要，但是它们的推动，永远是靠人的，因此，组织结构先行，全员参与，共同为建设能够输出高质量系统，快速响应需求变更的团队努力， 这才是实践微服务架构或者DevOps对一个公司最大的收益。


