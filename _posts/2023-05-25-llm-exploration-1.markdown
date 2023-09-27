---
layout: post
sidenote: false
comments: true
description: "我自己对 LLM 的看法是，它仍然类似于 AlphaGo 或深蓝，在一个领域接近甚至说超过了普通人的能力（比如AlphaGo下围棋或者深蓝下国际象棋），但它科学地推理和思考问题的能力，不会去想要不要把地球变成回形针：所以现在的 LLM 不是所谓的 AGI，也没有迹象会成为 AGI。

只不过，它擅长且超越凡人的这个能力——语言能力——和以前机器人掌握的能力有一个本质的区别，就是语言实际上编码了我们头脑中的世界，影响着我们对真实世界，而不是某个棋局或者某张图片，的理解、认知和判断。"
title: "LLM 调研（1）- 引言"
date: 2023-05-25 18:41:16 +0800
categories:
- AI
- LLM
- llm-exploration
---

> 本系列是，[LLM 调研](/categories/llm-exploration/)...说一下我对它的看法，以及它能做什么不能做什么

最近十年[^0]，基本上是神经网络一统 AI 江湖的十年：随着算力的增加，神经网络变得更大，训练它们的数据集也变得更大，AI 的几个主要领域（包括数字图像处理、计算机视觉、自然语言处理等）里传统的技术基本都被它取代了。但作为沾点科班边儿的 AI 爱好者，我[上一次写](https://lenciel.com/2016/03/alphago-and-ai/)相关的东西，还是 AlphaGo 战胜一众顶尖围棋选手[^1]。

然后就有了今年这股 AIGC 的风潮[^2]。

在目前的这些 AIGC 服务中，围绕「文本到文本」（主要是 GPT 相关）的讨论最多，并且不少人认为它有可能是 [AGI](https://en.wikipedia.org/wiki/Artificial_general_intelligence) 的起点。但正如 Wired 的文章《[Some Glimpse AGI in ChatGPT. Others Call It a Mirage](https://www.wired.com/story/chatgpt-agi-intelligence/)》所描述的那样，ChatGPT 发展到后面究竟会不会带来 AGI，无论是在民科还是在学界，仍然有很大的争议。

于是，ChatGPT 背后的关键技术——大语言模型（LLM），成为了技术史上一个非常独特的存在：一方面，它具备技术创新中非常少见的确定性。更大的算力和语料，更多的参数，往往就意味着训练出更好的模型。一方面，它具备非常少见的不确定性，就是那动辄千亿万亿级别的参数，它们究竟怎么工作，有什么产出，会带来什么影响，好像没有人可以讲清楚也很难共识。

我自己对 LLM 的看法是，它仍然类似于 AlphaGo 或深蓝，在一个领域接近甚至说超过了普通人的能力（比如AlphaGo下围棋或者深蓝下国际象棋），但它没有科学地推理和思考问题的能力，不会去想要不要把地球[变成回形针](https://www.lesswrong.com/tag/intelligence-explosion)[^3]：所以现在的 LLM 不是所谓的 AGI，也没有迹象会成为 AGI。

只不过，它擅长且超越凡人的这个能力——语言能力——和以前机器人掌握的能力有一个本质的区别，就是语言实际上编码了我们头脑中的世界，影响着我们对真实世界，而不是某个棋局或者某张图片，的理解、认知和判断。

可以说，关于 GPT 是不是带来 AGI 的很多争论，本身也是因为我们每个人对「心智」、「逻辑」、「推理」、「创造性」这些词有多种多样的定义，对「AGI」这种本来就没有稳定内涵和外延的术语，理解上就更是见仁见智了。

所以这些争论在我看来也挺有意思：用非常有限的「语言」，来讨论一个擅长「语言」的模型，它的能力是「有限」或「无限」的，这必然导致大量的讨论将要脱离技术范畴，进入伦理、哲学等范畴[^4]。

这个系列的主要目的，不是去参与这些热门的讨论。而是回到 LLM 被构建的初始目的，来看看：

1. 为什么涌现可能是一个误会？
2. LLM 究竟取得了怎样的进展？
3. LLM 究竟胜任什么样的工作？


[^0]: 目前供职于 OpenAI 的 Leo Gao 有一篇《[The Decade of Deep Learning](https://bmk.sh/2019/12/31/The-Decade-of-Deep-Learning/)》值得一看。
[^1]: 现在回看也花了不少篇幅去界定什么是「人工智能」，人类语言真是有局限性啊...
[^2]: AIGC 目前指通过文本（prompt）生成各种内容，包括文本到文本（如 [ChatGPT](https://openai.com/blog/chatgpt)），文本到图像（如 [Stable-Diffusion](https://stability.ai/blog/stable-diffusion-public-release)、[Midjourney](https://www.midjourney.com/home/?callbackUrl=%2Fapp%2F) ），文本到视频（如 [Visla](https://www.visla.us/ai-video-generator)，[Make a Video](https://makeavideo.studio/) ），文本到音乐，文本到 3D 或者文本到任务等等。
[^3]: 这是关于 AGI 带来的灾难性后果的一个有名的思想实验。即如果人类要具备 AGI 能力的机器人，找到最便宜的方式来获得回形针。机器人将最终通过纳米技术，把地球变成回形针。
[^4]: 「语言」这个技能的特殊性和多样性，还可以通过一个例子说明，就是 GPT 是根据现有的单词生成下一个单词的。有一些批评它的语言学家说，这是鹦鹉学舌，因为没有人实际上这样说话。但其实有一个很有名的作家 Tom Robbins 据说就是[这样写文章](https://web.archive.org/web/20120730190435/http://www.dareland.com/emulsionalproblems/robbins.htm)的。
