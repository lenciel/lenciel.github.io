---
layout: post
comments: true
description: "...长期看，如果做通用一点的功能，比如更好的记忆，更好的调度，更好的治理，最多就是被收购，不被收购就会被折叠。如果做垂直一点的功能，咋一看似乎有点数据上业务上的壁垒。但原来这些市场里大家就已经是抡着膀子互相卷了，现在直接提着 AI 互相卷，最终是啥场面？我想起没有电商的时候，大家卖东西只愁村口那家也打折，甚至村里就没有第二家。有电商了之后，天下再也没有好做的生意..."
title: "Thoughts On AI In Early 2026 (1)"
date: 2026-03-24 21:24:59 +0800
categories: 
- AI
- rants
- programming
---


<h3>目录</h3>

- TOC
{:toc}

### 背景

最近发生了几件事：

- 本月 [TGO](https://tgo.infoq.cn/){:target="_blank"} 聚会，有位 00 后才俊分享了他用龙虾调度的[一人公司](https://baike.baidu.com/item/%E4%B8%80%E4%BA%BA%E5%85%AC%E5%8F%B8/67142772){:target="_blank"}。我看他非常疲惫，和他分享了 Andrej Karpathy 等人最近常说的，因为大脑处理不来 AI 那么多输出的 [brain fry](https://hbr.org/2026/03/when-using-ai-leads-to-brain-fry){:target="_blank"} 的症状；

- 一个在美国的华人团队拿了顶级 VC 的钱做 AI 硬件，江湖救急需要尽快搭建工程团队，辗转找到我帮忙看看。人拉齐第一次开会 CEO 就说三周上线 iOS 客户端太慢了，我会后私聊对方试图解释如果是生产环境，人月神话可能仍然成立，agent(s) 也没改变 no silver bullet。结果对方问我（大意）：「老登你的 LinkdenIn 我看过了，你创业是哪年？知道今年是哪年吗？」{% sidenote 'sn-id-1' '我知道创业的压力，也知道很多硅谷的团队在学国内 996，跟上一条里那位「一人」小哥一样，和 AI 肩并肩没日没夜地干。所以我淡淡地停止了合作，并且没有感到太多被攻击后的情绪。因为，你看看下面那条就知道，现在对 AI 过于乐观的人实在是太多了。' %}；

- 越来越多的老板跑来说，能不能用 Claude Code 干掉程序员，用 [Stitch](https://stitch.withgoogle.com/){:target="_blank"} 干掉设计和前端，用各种虾干掉电脑前面坐着的各种人...与此同时，真的有很多人被干掉了;

AI 演进的速度很快，技术圈的态度也愈发割裂，但降临派似乎已经战胜拯救派。

Nolan Lawson 那篇流传甚广的《[We mourn our craft](https://nolanlawson.com/2026/02/07/we-mourn-our-craft/){:target="_blank"}》不像战斗檄文，更像是程序员们的《[过零丁洋](https://www.gushiwen.cn/shiwenv.aspx?id=5796865dca4a){:target="_blank"}》。

最近一两周，既有[历来高调的](https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04){:target="_blank"} Steve Yegg 在播客里和 Tim O’Reilly 大大方方把人[分八等](https://www.oreilly.com/radar/steve-yegge-wants-you-to-stop-looking-at-your-code/){:target="_blank"}，并且放出了那句名言：

> Code is a liquid. You spray it through hoses. You don’t freaking look at it.

也有 Pandas 的作者 Wes McKinney 直言自己每个月 10 亿 token 用量，早就不自己编码了{% sidenote 'sn-id-2' '但如果你仔细看，就会发现 Steve Yegg 在不停强调「品味」的重要性，而 Wes McKinney 干脆写了篇《[The Mythical Agent-Month](https://wesmckinney.com/blog/mythical-agent-month/){:target="_blank"}》，专门讨论人月神话对 agent 仍然成立，并且当 AI 自己把 repo 搞出十万行以上的代码，就会遇到瓶颈。' %}。

所以，作为从业 20 年左右的老家伙，定期记录一下自己的[看法](/categories/ai/){:target="_blank"}和[想法](/2024/01/ai-the-past-the-current-the-future/){:target="_blank"}，还是挺有必要的。

哪怕是留下点儿眼看着蒸汽机逐步普及时，一匹老马的心情。

### 个人使用

在完成下面这些任务的时候，我用 AI{% sidenote 'sn-id-3' '如今 AI 两个字母等同于 LLM 出现之后的各种模态的生成式 AI。' %} 大概到什么程度？

#### 搜索

这应该是大家都用得比较多的场景。

我没再上过 Stack Overflow，也变得很少查文档。遇到不太知道或者不太确定的东西，先问问它已经成了习惯，并且只有非常认真的话题，才会去检查一下它回复的真实性。

有一种观点认为这种行为模式会影响「深入学习」的能力，但我的感觉是反的：生活中大部分事情都没必要深入去学习。有个专家告诉我剪哪根线安全的概率大，我就可以三秒钟拆完面前的炸弹，去深入应该深入的部分了。

所以百度的竞价广告应该是受 AI 冲击最大的——这实在是令人弹冠相庆。

#### 编码

我用 AI 做了一些碎片式的代码。比如 umami 升级后数据不兼容的处理，比如 Valine 迁移到 [Waline](/2026/03/valine-to-waline/){:target="_blank"}。

我还尝试用它去构建大型的项目或者完成一些经营流程。不管是所谓的 [DDD](https://documentdrivendevelopment.com/){:target="_blank"} 以及围绕 Skills 的一些最佳实践，还是热门的 [superpowers](https://github.com/obra/superpowers){:target="_blank"}，[get-shit-done](https://github.com/gsd-build/get-shit-done){:target="_blank"}，[paperclip](https://github.com/paperclipai/paperclip){:target="_blank"}。

我的结论是 AI 驾驭大型生产项目还不够 ready（当然也可能是我技能还没有跟上）。并且个人要运作起这些系统，确实很耗精力（以及 token）。

这是 OpenClaw 流行起来的核心原因{% sidenote 'sn-id-4' '当然，这还因为很多人没用过 Claude 的产品。' %}，但长期看 harness 应该还是对普通用户隐藏起来才对：**就好像世界上最早开车的 10 个人应该啥部位坏了都知道咋换，而我连轮胎咋换都不知道**。

这部分花最多时间去研究，是因为变化太快，能做的就是「反着自己人性操作」：

- 如果你跟我一样是个怀疑者或者干脆是悲观者，那就该多试试它是不是带来了一些实际的变化；
- 相反，如果你是个乐观者甚至降临派，那么也应该多去验证它是不是创造了一些实际的价值；

#### 分析

丹尼尔·卡尼曼[说](https://www.madewill.com/thinking-model/dual-system-thinking-model.html){:target="_blank"}，我们做反应有时用系统一，有时候用系统二。

所有涉及系统二的决定，AI 都可以作为一个助手参与分析。它像个知识极度渊博，逻辑和理性非常在线，并且几乎毫无情绪有求必应的朋友，陪我随时脑暴。

因为搜索和编码在我目前的生活和工作里比重不高，这应该是 AI 给我带来最多价值的部分。

当然，推理模型的优势是理解语义，融合信息，之后驾驭超出人脑子处理范围的数据进行逻辑推理。但即使是一些别的场景，听听它咋想，也常常有惊喜。

比如，我们的一个业务需要在区域间根据不断更新的货源结构调车。这种强实时，优化精度都要求到多少多少米，并且是固定约束的问题，感觉上不太适合大模型。但是我把数据扔给它，它还是能够给我不少人工调度没有的视角。

#### ~~写作等~~

不管是工作还是生活里写任何东西（小到一篇博客，大到业务 BRD），我都不用 AI。

我最后一次用 AI 生成图片还是四年前，给治哥生成了我们东郊 FC 印在参赛证上的 logo。

**一句话，想当成作品的东西，背后承载的不管是自己的思考还是情绪，如果有了 AI 帮忙，都觉得没劲。**

如果不想当成作品，又何必浪费那些电力，反正人人都能几秒钟生成一堆。

### 创业机会

因为工作性质的原因，我除开自己要在工作中根据相关公司的场景落地 AI，也看一些 AI 项目。

总体上，当 AI 进入了多个 agent 协同的阶段，特别是 OpenClaw 把 Claude 做得最好的 harness 部分变得平民化了之后，好像很多人都找到了一些可以上手创业的感觉。

但其实难度大大上升了。

因为如果你同意多 agent 协同就跟汽车里各个部件协同，根本不是用户应该关心的事儿的话，那究竟是谁把车机、OBD、数据总线这些东西搓出来呢？好像只有主机厂自己。

所以短期内因为很多人非常焦虑，卖卖课装装小龙虾赚点儿钱是可能的。

长期看，如果做通用一点的功能，比如更好的记忆，更好的调度，更好的治理，最多就是被收购，不被收购就会被折叠。

如果做垂直一点的功能，乍一看似乎有点数据上业务上的壁垒。但这些市场里面，本来大家就已经是抡着膀子在互相卷了，现在直接抡着 AI 互相卷，最终是啥场面？

我想起没有电商的时候，大家卖东西只愁村口那家也打折，甚至村里就没有第二家。

有电商了之后，天下再也没有好做的生意。
