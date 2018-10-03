---
layout: post
title: "技术团队的绩效提升"
date: 2018-08-16 15:47:41 +0800
comments: true
categories: 

- management
- agile
- productivity
- performance

---

接着上一篇，我们谈了技术团队怎么去进行[绩效的度量](/2018/08/how-to-measure-tech-organization-performance)。通过这些度量可以看到，从行业和我们自己的结果数据来看，提高生产率并不会牺牲质量，相反，产出越高效的团队，在各个指标上会全面领先。并且，好的团队和差的团队的差距在逐步拉开：

![Vhost threshold](/downloads/images/2018_08/software_team_metrix.jpg "Don't touch me...")

 那么，这些指标如何进行提高呢？

### 文化建设

要通过前面提到的指标来度量团队的绩效，首先需要注意的就是文化。

如果你的团队文化是开放的、学习的，那么用前面那些指标进行绩效的度量才是有效的。[Deming](https://en.wikipedia.org/wiki/W._Edwards_Deming)在《Humble》里面说过：

> "Whenever there is fear, you get the wrong number"。

所以在准备落地这些衡量标准之前，我们要先确认团队有什么样的文化，是否需要改进。

#### 文化的度量

如果你问一个码农，为什么在现在的公司工作，他的回答多半跟文化有关。

但文化是看不见的，要怎么度量呢？我们可以参考北欧社会学家[Ron Westrum](https://en.wikipedia.org/wiki/Ron_Westrum)的模型（[相关论文](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1765804/pdf/v013p0ii22.pdf)）：

- Pathological（power-oriented)：屁股大的人说了算。组织里面对信息的分享和流动有恐惧感，会因为政治原因隐藏或者是更改信息。
- Bureaucratic（rule-oriented）：每个部门都希望能够按照自己的规则来，“自己的”规则意味着厚重的部门墙。
- Generative（performance-oriented）：关注点在目标达成。如何才能高效的达成目标是唯一的核心诉求。

如何使用这个模型进行文化的度量在行业里面已经有很多[可借鉴的实践](https://www.andykelk.net/devops/using-the-westrum-typology-to-measure-culture)了。以Google为例，花了两年针对180+个团队的250个属性进行的跟踪并且做了几百场访谈，并且把[结论](https://rework.withgoogle.com/blog/five-keys-to-a-successful-google-team/)和使用的[工具](https://rework.withgoogle.com/guides/understanding-team-effectiveness/steps/help-teams-determine-their-needs/)都大方公布出来了。

![Vhost threshold](/downloads/images/2018_08/google_survey.jpg "Don't touch me...")

这些结论里令人印象特别深刻的是：团队里面有没有超级明星不那么重要，而是团队成员间的互动，工作的分工和架构，以及贡献如何被衡量，是最重要的。

贡献怎么被衡量我想特别多说两句，那就是犯错也应该被当成“一种贡献”。在有的组织里，针对问题的RCA或者复盘会都会定责到人并且进行惩罚和处分。但我们现在构建的大型系统里，问题通常不是某个人通过自己的专业能力就能预见并且处置和避免的。找到责任人只是第一步，如何让信息被其他人更早的获取？如何提供工具帮大家更好处置问题？这些都是作为技术管理者真正应该关心的事情，也体现了一个组织有没有正确的文化。

### 最佳实践

[John Shook](https://www.lean.org/WhoWeAre/LeanPerson.cfm?LeanPersonId=4)说过：

> “The way to change culture is not to first change how people think, but instead to start by changing how people behave—what they do.”

因此要真正的改变文化，除开一些口号，还要真正落实最佳实践。但软件开发领域的最佳实践何其多，究竟选哪些做呢？

实际上[Agile Manifesto](http://agilemanifesto.org/)在2001年发布时，XP（[Extreme Programming](http://www.extremeprogramming.org/)）还正在巅峰。

十多年过去了，我们回头来看，XP强调的其实主要是一些技术上的最佳实践：测试驱动开发/持续集成/持续部署，而敏捷特别是Scrum则主要是一些团队协作和管理方面的最佳实践：怎么开会，怎么计划，怎么验收...从效果上来看，个人觉得技术方面的最佳实践对文化改造发挥的效果才是最大的。

- 自动化：Manual Work is Bug。机器干重复的工作，人解决有价值的问题
- 配置管理：可以完全自动化的生成环境，开发/测试/部署流程工具化/自动化
- 持续部署：让任何变更（新功能/配置变更/bug fix/新功能探索）都能够安全的、迅速地、可持续性的发布到生产环境
- 持续集成：trunk/branch能够高效的集成，每个变更能够触发自动build和测试
- 持续测试：在各个阶段都应该有测试。monitoring is testing
- 版本管理：不仅仅是代码，你的测试环境在不在git上？dockerfile呢？
- 测试数据管理：不仅仅是自动化测试的数据/现在有工具可以从生产环境录制数据
- 基于分支的flow：三个以上的分支就多了，且分支存活应该低于一天（大家都是全职工作不宜使用[Github flow](https://guides.github.com/introduction/flow/)，它更适合开源项目，大家都是parttime，branch可能需要长期存在），存活时间越短，集成和发布的成本越低
- 安全和质量：内建的信息安全能力和质量控制，会提高效率而不是降低

有了这些技术上最佳实践的真正落地，员工才有更多的时间花在处理用户问题和重构上，同时也会增强员工对团队的认可度（我在一个很牛的地方上班）。

### 管理进化

落地了技术上的最佳实践，敏捷流程也像模像样的跑起来了，接下来还需要管理上做一些改变和进化。

#### 服务心态 

互联网发展到今天，绝大多数工作，特别是创新性的工作，都是一线员工主导的。作为技术管理者，要有良好的服务心态。这听起来很虚，但其实有很多具体的事情可做。

比如关注员工的[Burnout](https://lenciel.com/2015/10/the-myth-of-work-life-balance/)，成立一些兴趣小组，既有放技术委员会里的技术类的，也有体育棋牌歌舞类的。

再比如让变更决策更轻量化：有一些组织进行各种系统变更都需要管理层或者流程层层决策。一方面工作效率低，更重要的是大家觉得老板拍了跟自己没关系，久而久之就认真思考的氛围了。


#### 管理可视化

现在是数据驱动的时代，所有的管理要尽量可视化。

一方面要关注生产环境数据：DevOps也好，微服务也好，很多这些年看起来的技术风潮，本质上都是建立在一种关注生产环境，关注数据的组织文化上的。

另一方面，哪怕是对内的管理工作，根据自己所在的阶段、团队特点和业务规模时刻确认了指标之后，也要让它变得可视化。要让团队里面的人都有明确的努力方向和荣誉感。

最后，这里提到的各种办法，某一个单一的维度进行提升，对整个团队的提升效果非常有限。就像没有一个好的系统是设计出来的一样，要真正地下功夫提高团队绩效，也需要考虑各种tradeoff，各个维度的方法组合使用，并且不断打磨和调整。