---
layout: post
comments: true
description: "...真正威胁创造力或者工匠精神的不是 LLM 或者历史上任何一个技术，而是一个奖励速度而非深度，追求规模而非成长，引入自动化但不提升工作意义只想着降成本的职场..."
title: "AI 究竟能不能替代程序员? (2)"
date: 2025-06-11 22:41:19 +0800
categories: 
- AI
- programming
- rants
---

接着[前面](/2025/06/the-cycle-of-replacing-developers-1/){:target="_blank"}，这篇主要打算聊聊技术管理者应该怎么看待这个问题。

为什么不聊程序员应该怎么看待这个问题？

Because they don't have the luxury of saying no...

2000 多年前，柏拉图曾经对刚刚兴起的「把想法书写记录下来」[大加批判](https://www.sohu.com/a/282709467_651325){% sidenote 'sn-id-0' '最核心的论点：This invention [writing] will produce forgetfulness in the minds of those who learn to use it, because they will not practice their memory. Their trust in writing, produced by external characters which are no part of themselves, will discourage the use of their own memory within them. You have invented an elixir not of memory, but of reminding; and you offer your pupils the appearance of wisdom, not true wisdom, for they will read many things without instruction and will therefore seem to know many things, when they are for the most part ignorant.' %}，认为这会使得学生们不再锻炼自己的记忆力，而且书写只提供了智慧的表象而没有口头讨论时传递的那些真正的智慧。

但他的这番话，正好是因为被他写进了《斐德罗》得以流传至今。

所以这篇文章主要针对技术管理者。

对新技术保持批判和怀疑是正确的态度。但我们要知道自己的判断和决策不能建立在无形的特权之上：当我们没有压力去使用某个工具时，拒绝它是很容易的。

大多数员工没有办法说「不」：他们的工作受绩效评估、迭代周期或我们这些管理者决策的影响，他们并不仅仅在技术原则上讨论是否使用 AI，他们在努力弄清楚如何保住工作。

如果我们不是真的站在他们的角度去使用和评估，仅仅用 AI 影响创造力或者初级程序员成长作为理由，草率地说「不」，那么这既不是勇气也不是智慧，而是一种傲慢{% sidenote 'sn-id-1' '代表这种态度的典型做法是用一种类比来抽象的分析，比如 AI [就像化纤](https://culture.ghost.io/genai-is-our-polyester/){:target="_blank"}终究会被有品味的人类抛弃，或者 AI [就像可卡因](https://makemeacto.substack.com/p/is-genai-digital-cocaine){:target="_blank"}终究会被证明是有毒的。' %}。

**真正威胁创造力或者工匠精神的不是 LLM 或者历史上任何一个技术，而是一个奖励速度而非深度，追求规模而非成长，引入自动化但不提升工作意义只想着降成本的职场。**

话说得略重，无非是希望听的人上心。

让我们切入正题。

目前对 AI 辅助编程有一左一右的两个态度{% sidenote 'sn-id-2' '并且它跟之前技术圈子里那种我觉得 rust 你觉得 go 更好完全不一样，各自的看法往往非常的绝对和极端。' %}。

近期支持一方最火的帖子应该是 Thomas Ptacek 的[这篇](https://fly.io/blog/youre-all-nuts/){:target="_blank"}，而反方最打到痛点的是苹果发表的[这篇论文](https://ml-site.cdn-apple.com/papers/the-illusion-of-thinking.pdf){% sidenote 'sn-id-3' '其实是之前的相关研究的[一个延续](https://garymarcus.substack.com/p/llms-dont-do-formal-reasoning-and){:target="_blank"}，所以这是不是石头姐觉得 Apple 在 AI 时代完全落后了的原因之一呢？' %}。

熟悉我的人可能知道，我[一直看空](https://lenciel.com/2024/01/ai-the-past-the-current-the-future/){:target="_blank"}所谓的 AGI，更不用说 LLM 会带领我们去到 AGI：因为神经网络在它们接触到的训练数据分布内泛化，但往往在该分布之外泛化就会失效，从未解决。

不用着急劝我，这反而对我采用 LLM 干活是一个积极的事情。

因为它就是个工具。

人工智能发展初期使用拟人化的表达（智能、学习等词汇）带来了很多混乱的讨论，所有的技术管理者应该对得起自己 title 里的「技术」两个字，按照李飞飞在自传里说的去补完课再出来聊 AI：

> 请大家不要每天只从arXiv下载最新的预印本作品了。去读一读拉塞尔和诺维格的著作，去读明斯基、麦卡锡和威诺格拉德的书，读哈特利和西塞曼的作品，读一读帕尔默写的东西。不要因为这些材料距离现在时间久就忽略它们。我们就是要多读一些以前的东西，他们的理念经得起时间的考验，依然非常重要。

理解和接受 LLM/LRM 以及基于它们的各种东西就是工具，会带来下面这些我觉得可能是可喜可贺的变化：

- **工具是有局限的**：LLM/LRM 有自己非常擅长的地方，比如在不断增加的推理长度下展开某种近似。理解局限性为什么时候用好这个工具奠定了基础，可以带来各个领域的进步——实际上我们发明计算机也是出于类似的原因；
- **工具是可控的**：人类可以少花一些精力在超出对工具如何被使用、误用或滥用范围的担忧。我真的厌倦了每天有这么多媒体更别说自媒体讨论哪个 AI 工具或者模型要划时代或者要送我们上西天了；
- **工具是可用的**：承认你在用它编程或者用它写作业不再变得可耻，开发个插件也不再需要面对那么大的监管压力{% sidenote 'sn-id-4' '我们这儿当然还得备案了。' %}。
- **工具不用交付那么高的期待**：AI 已经经历过两次寒冬了，期望与现实之间的不匹配会导致崩溃，不如大家一起降低一下这种风险。

因为不承认它的工具身份，我们今天看到各种吊诡的情况，比如一些老师花巨大的成本检查学生是不是使用了 LLM 完成作业，同时自己也忍不住用 LLM 做课件。

在我们公司，我不但鼓励所有人都使用 LLM，我还觉得面试程序员的时候都应该允许候选人使用 AI 辅助（其实我一直不太理解为啥我们的考场不能带计算器）。

我的面试题里面会加上：

- 现在各种 LLM 有什么特点，擅长什么，不擅长什么？
- 如果需要写需求文档，使用哪个 LLM？为什么？如果需要编码，使用哪个 LLM？为什么？
- 有没有自己的[提示词库](https://addyo.substack.com/p/the-prompt-engineering-playbook-for){:target="_blank"}？Cursor [配置文件](https://gist.github.com/boxabirds/4a8a8a16b1f8431fd64a790209452380){:target="_blank"}？
- 展示实际使用 AI 辅助生成代码的过程：是否理解生成的代码？能解释吗？能评价吗？品味如何？
- 知不知道 MCP，有没有自己构建过 agent，尝试什么方法进行知识管理？

就像上一篇说的，如果 AI 可以降低成为程序员的门槛，就意味着更多有品味，有产品工程思维，仅仅是缺乏编码实践的人，可以进入这个行业。

让我们把门打开。
