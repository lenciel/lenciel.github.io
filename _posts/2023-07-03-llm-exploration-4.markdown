---
layout: post
sidenote: false
comments: true
description: "更多的公司，应该跟我们一样，只是「利用」这项技术，来给自己的用户创造更多的价值。要达到这个目的，我觉得应该拆成下面几个部分：

1. 寻找合适的 LLM 作为基底模型；
2. 以较小的成本（包括时间成本）将自己业务相关的领域知识和数据作为输入，扩充 #1 选择的基础模型的能力；
3. 从工程角度结构化地提高这个过程的安全性和可控性；

从而最终迭代出在垂直领域商业化的 LLM 应用。

那么具体怎么做呢？
"
title: "LLM 调研（4）- 开发实践"
date: 2023-07-03 18:41:16 +0800
categories:
- AI
- LLM
- llm-exploration
---

> 本系列是，[LLM 调研](/categories/llm-exploration/)...说一下它能做什么不能做什么，能做的部分怎么做比较好。

上一篇讲完[历史](/2023/06/llm-exploration-3/)，本来应该接着讲 LLM 到底取得了什么进展。但因为：

- 在我心里 LLM 并没有取得「范式转换」级别的进展，更谈不上任何真正的「智能」[^0]；
- 比较好的中文综述已经有几篇了（比如 Mike 船长的[这篇](https://www.mikecaptain.com/2023/03/06/captain-aigc-2-llm/)，或者张俊林的一些[专栏文章](https://zhuanlan.zhihu.com/p/632795115)），英文材料就更不用说了，论文都摆在那里；
- 我们主要是结合自己的数据和需求做应用，既不会训练自己的 Base Model 也不会搭建相关的基础设施；

所以迟迟没有动笔。几周下来，能感觉身边聊 ChatGPT 的人明显少了。但行业里仍然热闹，每天都有新模型，新产品，新消息。我自己各种小规模的折腾还保持着，还去参加了老白的 [AGIA](https://github.com/TGO-AGIA/AGIA) ，获得了更大规模炼丹的资源。

FITURE 内部对 AIGC 的探索也在稳步推进：周博他们用 ChatGPT + Stable-Diffusion 做了一些设计方面的工作；[Edward](https://tyun.fun/) 他们借鉴微软 [semantic kernel sdk](https://github.com/microsoft/semantic-kernel) 里一些 Prompt Engineering 的思路，实现了基于对话选课的场景...

这篇就讲讲，在使用 LLM 搭建应用的过程中一些感受和遇到的问题，可能对大部分人来说，这比讲 LLM 的一些技术细节更有用。

<h3>目录</h3>

- TOC
{:toc}

### 做什么

2011 年，Andreessen Horowitz 说「[软件在吞噬整个世界](https://a16z.com/2011/08/20/why-software-is-eating-the-world/)」。2023 年，没有 AI 的软件都不好意思出来见人了[^1]。

但只要是软件，它就会有结构，有抽象，有分层。比如数据怎么获取、处理和存储，比如模块之间怎么通信，比如怎么保障安全。LLM 相关的软件系统也不例外，并且因为还在相对早期，前面说的每个部分都有待解决的问题，也都是机会。

不过，有些机会是普通公司特别是创业公司根本没法追逐的，比如提供芯片和算力，比如训练基底模型。有些机会则是适合创业公司去搞的，比如解决存储或者数据管道等基础设施（做矢量数据库的 Pinecone 就属于这类）。

更多的公司，应该跟我们一样，只是「利用」这项技术，来给自己的用户创造更多的价值。要达到这个目的，我觉得应该拆成下面几个部分：

1. 寻找合适的 LLM 作为基底模型；
2. 以较小的成本（包括时间成本）将自己业务相关的领域知识和数据作为输入，扩充 #1 选择的基础模型的能力；
3. 从工程角度结构化地提高这个过程的安全性和可控性；

从而最终迭代出在垂直领域商业化的 LLM 应用。

那么具体怎么做呢？

### 怎么做

#### 基底模型与扩展

选择什么样的基底模型，很大程度上决定了你能如何扩展它。

比如，如果直接用 OpenAI 的闭源模型——无论是 GPT-3.5 还是 GPT-4——你就只能使用它提供的 API 做 [Fine-tuning](https://platform.openai.com/docs/guides/fine-tuning) 或者 [Embedding](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings) 或者是直接 [Prompt Engineering](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-openai-api) 。

相对应的，如果你是用 [LLaMA](https://ai.facebook.com/blog/large-language-model-llama-meta-ai/), [Falcon](https://huggingface.co/tiiuae/falcon-40b), [StableLM](https://github.com/Stability-AI/StableLM) 或者 [ChatGLM-6B](https://github.com/THUDM/ChatGLM-6B) 这样的开源模型，那扩展它们的方式就大不一样了。

**我自己的建议是，你得花些时间好好试用 OpenAI 的各种服务（ChatGPT 的各个版本）和接口，同时也花些时间手搓一些开源模型，具备手感后，结合下面说的可控性和安全性相关的考量，结合自己的用户需求，最终做出决策**。

#### 可控性与安全性

##### 可控性

我们在前面讲[连接主义与神经网络](/2023/06/llm-exploration-3/#%E4%B8%8D%E8%B6%B3-1)时说过，它有可解释性不足的问题。

这造成一系列和传统意义上的软件开发不同的特点，特别在可控性方面。

**首先是输入的可控性差**。自然语言编写 prompt 可能对于终端用户的感受不错，但是在开发过程中，是很痛苦的：不要说基于它「写代码」，连提炼出可以培训员工的最佳实践都很困难。

**然后是输出的可控性差**。一方面，LLM 究竟以什么样的格式响应一个 prompt 是非常不固定的；一方面，LLM 究竟以什么内容响应一个 prompt 也是不固定的[^2]。

**最后是调试的可控性差**。在构建其他软件的时候，如果对于给定的输入，输出是预期外的，你可以通过断点调试甚至单步调试来搞明白究竟发生了什么，但使用 LLM 基本上只能靠猜。

因此，整个研发过程如何变得更可控，是一个系统工程，涉及如何对 prompt 做版本化管理，更[高效的 evaluation](https://arxiv.org/abs/2305.12900) ，更[及时的 optimization](https://github.com/openai/openai-cookbook/blob/main/techniques_to_improve_reliability.md#how-to-improve-reliability-on-complex-tasks) 等等问题，并且至今应该没有特别好的解法。

##### 安全性

 LLM 相关的业务是数据密集的，因此它的安全性至少包含：

- 数据如何安全地「获取」、「处理」和「存储」；
- 如何防止包括 [Prompt Injection](https://arxiv.org/abs/2306.05499) 在内的各种攻击；

同时，也包括你自己团队的「安全」：比如基于 OpenAI 开发如何合规，基于开源模型它们的 license 是否有坑等等。有一些问题看起来是创业阶段不用考虑的，其实你的服务上线第一天就有可能面临包括注入在内的各种挑战。

#### 架构与核心决策

当你从原理到工程化有了足够多的手感，仍然考虑围绕 LLM 开发一个自己的应用（放弃说不定才是正确的选择），核心的决策因素有哪些？我自己觉得包括下面这些。

##### C 端还是 B 端

LLM 生成的不是「答案」，而是「答案应该大概长成啥样」。所以不太能够用来作为交付物直接向 B 端提供服务。

同理，对 C 端提供服务，应该也不能直接用在真正「严肃」的场景：比如看病、心理咨询等等。顶天了，作为某个人类的辅助和参考，提供一点建议。

##### 是否「全生成式模型」

「全生成式模型」指用户所有的请求都用 LLM 进行响应。与之对应的是，通过意图识别对用户的请求进行分类和分流，让生成式模型和判别式模型一起来响应请求。

全生成式模型，首先成本是比较高的。背后如果调用 OpenAI，还有时延、QPS 和合规等一系列问题。而我们提供的大部分服务都是有限场景下的，因此，[结合传统](https://arxiv.org/pdf/2306.08302.pdf)的 NLP 解决方案，比如知识库，解决用户大部分真实请求，对不在上下文的请求判定并拒绝响应，仅仅对少量有用户价值且知识库解决不了的场景通过生成式模型来响应可能是最现实的做法。

当然这样做其实也考验系统架构的能力。

##### 具体选择哪种扩展方案

排名靠前的模型，都做了强化学习。但是成本高，而且方法还不稳定。

大部分公司的数据量，可能搞个百亿参数的 base model，结合精标数据做 SFT，效果就差不多了，还更容易控制结果。

排除掉自己做模型，你仍然有[很多条路](https://a16z.com/2023/06/20/emerging-architectures-for-llm-applications/)可以选。

比如 FITURE 的应用场景是搜索和推荐。它很适合用 「[Embeddings+矢量数据库](https://betterprogramming.pub/openais-embedding-model-with-vector-database-b69014f04433?gi=01ad090d8a14)」的方案来做。

### 总结

除开模型本身和相关基础设施，目前LLM 「周边产品」，主要是两个大类：某个领域的智能助手，或者某种风格的聊天机器人。

前者，如果没有某个领域长期的 NLP 的积累[^3]，并且找到了客户愿意支付溢价的场景，就没有必要做。而有这些数据，往往需要行业地位，所以，基本上不是初创公司的机会。

后者，它更偏娱乐化而不是功能性，目前最好的示例应该是 [character.ai](https://beta.character.ai/)。不过，这种项目的商业化成功与否，可能主要看金主们聊擦边球话题时，接得怎么样吧。

[^0]: 一个观察，好像愿意认真写综述的，都认为 LLM 具备「智能」，这可能也是他们洋洋洒洒几万字综述的核心动力吧。大家观点虽然不同，还是很感谢他们。
[^1]: 也难怪 Sam Altman 提出了所谓的「[新摩尔定律](https://www.theatlantic.com/technology/archive/2023/04/moores-law-defining-technological-progress/673809/#:~:text=In%20late%20February%2C%20Altman%20invoked,chief%20scientist%20for%20software%20engineering)」：宇宙中的「智能」每 18 个月翻一番。
[^2]: 虽然你可以通过调整参数，比如设置 temperature = 0 来对输出做一定的控制。
[^3]: 这里的积累不仅仅是技术，更主要的是结构化的数据和模型。