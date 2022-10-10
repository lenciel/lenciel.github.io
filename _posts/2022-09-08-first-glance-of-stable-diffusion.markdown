---
layout: post
comments: true
description: "在我的 M1 上试试 Stable-Diffusion，简单看了一下它有什么羊的问题，后面再写写这些合成技术可能带来的影响吧"
title: "Stable-Diffusion 试玩"
date: 2022-09-08 14:07:19 +0800
categories: 

- stable-diffusion
- TTI
- AI

---

<h3>目录</h3>

- TOC
{:toc}

我一直[挺关注](https://xiaobot.net/post/63d83bbe-45e8-49e4-9319-cb3e2604e572) 人工智能在内容合成（不管是图片、视频、文本，还是程序）方面的进展的[^0]。最近发现 Stability 刚刚[发布](https://stability.ai/blog/stable-diffusion-public-release)的 ISM（Image Synthesis Model） Stable Diffusion 可以[直接跑在 M1 芯片](https://replicate.com/blog/run-stable-diffusion-on-m1-mac)的 MBP 上，赶紧试玩了一下。

### 一些结果

![sd-work-1](/downloads/images/2022_09/sd-work-1.png --alt Don't touch me...)
![sd-work-2](/downloads/images/2022_09/sd-work-2.png --alt Don't touch me...)
![sd-work-3](/downloads/images/2022_09/sd-work-3.png --alt Don't touch me...)
![sd-work-4](/downloads/images/2022_09/sd-work-4.png --alt Don't touch me...)
![sd-work-5](/downloads/images/2022_09/sd-work-5.png --alt Don't touch me...)
![sd-work-6](/downloads/images/2022_09/sd-work-6.png --alt Don't touch me...)
![sd-work-7](/downloads/images/2022_09/sd-work-7.png --alt Don't touch me...)
![sd-work-8](/downloads/images/2022_09/sd-work-8.png --alt Don't touch me...)

各种风格各种题材手到擒来的感觉，是真好...那么 Stable-Diffusion 究竟做了什么呢？

### 一点历史

用深度学习进行图像合成，可以追溯到 2014 年的一些[研究](https://www.foldl.me/uploads/2015/conditional-gans-face-generation/paper.pdf)，到今年算是迎来了高峰：4 月份封在家里的时候，先是看到 OpenAI 发布了 [DALL·E 2](https://openai.com/dall-e-2/)，然后 [Meta](https://about.fb.com/news/2022/07/metas-new-ai-research-tool-turns-ideas-into-art/) 和 [Google](https://imagen.research.google/) 也立刻跟进；接下来 [Midjourney](https://www.midjourney.com/home/#about) 项目让你有一个 Discord 账号就能玩 TTI（Text-To-Image）。

然后就是 8 月 22 号 Stable-Diffusion 的发布。它和 DALL·E 2 最大的不同就是，虽然也有一个商业化的版本 [DreamStudio](https://beta.dreamstudio.ai/)，但是它的代码是开源的，任何人都可以修改和调试它。

因为使用门槛的降低，全世界人民，包括很多艺术家，都在[疯狂试玩](https://multimodal.art/news/1-week-of-stable-diffusion)它。

### 一点原理

目前大部分 ISM 都是基于[latent diffusion](https://arxiv.org/abs/2112.10752)的。通俗点儿解释它的主要的过程，就是通过在纯噪声中去识别自己熟悉的形状，与你给它的输入（Stable-Diffusion 里面叫 `prompt`）里的单词进行匹配，然后强化这些元素，最后「画出」一副图片。

要完成这个过程，首先要在海量数据集上进行训练：比如 Stable-Diffusion 使用了 [LAION-5B](https://laion.ai/blog/laion-5b/) 的一个子集，包括了 50 多亿来自各种网站（比如 Getty Images、Pinterest、 DeviantArt）的图片。

接下来，使用 OpenAI 的 [CLIP](https://openai.com/blog/clip/) （Contrastive Language–Image Pre-training）技术，把单词与图像联系起来。值得注意的是 Stable-Diffusion 大概[只花了60w 美金](https://twitter.com/EMostaque/status/1563870674111832066?s=20&t=ZyvYA5pRQrx5jJlyD7QpWg)就完成了这部分工作。

通过训练，Stable-Diffusion 会关联一些有色像素点的组合跟某些特定主题之间的联系。然后，很多看了最终产出的人无法相信的是，模型虽然还谈不上对颜色、形状等要素与某个绘画风格或者主题之间深度的理解，仅仅是通过这些训练建立起来的联系，就可以在**不复制原数据集中任何图像的基础上，完全从无到有在噪声中生成一副全新的图片**。

### 一点缺陷

目前看，最大的问题我感觉有三个[^1]：

- 肢体异常

目前看来，它经常生成两个头，三只手，六根手指这类畸形的图片。所以很多人在生成图片的时候只好增加数量从里面挑选「正常」的。

我感觉这个问题应该是出在训练数据集的标注上。一个好的人体要标注清楚不容易，得按照类似 `body>arm>hand>fingers>[sub digits + thumb]> [digit segments]>fingernails` 的颗粒度逐一标注。

可以想象「人工智能」里面「人工」这部分的质量，在这里是比较低的。特别是当标注的图片有很多是艺术作品的时候，要非常清晰地标出哪里是手指哪里是手掌哪里是指甲，误差是相当大的。

这部分的问题解决，要靠 OpenAI 的[内容过滤](https://beta.openai.com/docs/models/content-filter)这种做法，或者是，更好的数据集了。

- 分辨率受限

目前有很多 repo 开始把一些 upscaler，比如 [txt2imghd](https://github.com/jquesnelle/txt2imghd)，集成进去来解决这个问题。这种「先生成再整容」的做法，可以在一开始不要求那么奢侈的内存，基本上是现在唯一的办法。

- 自定义程度低

Stable-Diffusion 最值得期待的是你可以在现有模型上进行一些自定义风格的增量的训练。但也可以想象，往现有的模型里面加入你自己的特征，是挺难的，因为这是一个基于 50 亿张图片的训练结果。

目前看比较成功的例子[^2]开销也挺大的（比如 30GB 的显存你有吗？），能搞一搞的主要是对表面材质做一点贴膜，也就是 [Textual Inversion](https://textual-inversion.github.io/)。但同时，也可以看到这部分的进展也[非常迅速](https://colab.research.google.com/github/huggingface/notebooks/blob/main/diffusers/sd_textual_inversion_training.ipynb)，估计不久就可以用更低的算力实现。。

### 一点问题

Stable-Diffusion 目前面临了一些法律和道德上的问题。

法律上，因为索引了大量艺术家的图片，它模仿这些人的风格进行创作后，图片的版权怎么算？目前看，有一些艺术家表现得非常愤怒，但好像还找不到一条具体的法律可以去告 Stability。

道德上，如果用 AI 来生成色情的图片或者诽谤的图片会怎样？虽然现在 Stable-Diffusion 提供了一个 NSFW 的校验，把所有色情图片都处理掉，同时还在图片里面加了一个隐藏的水印，但，它是开源的...

[^0]: 包括 Disco Diffusion、DALL-E 2、Copilot 和 GPT-3 等等。
[^1]: 小问题就太多了。首先 Stable-Diffusion 并不官方支持 M1 芯片，所以我自己也 fork 了一个 repo 解决一些 image-to-image 中遇到的问题。
[^2]: 比如 [waifu-diffusion](https://huggingface.co/hakurei/waifu-diffusion)，用了 56000 张动漫图片进行训练。再比如官方的一个[例子](https://huggingface.co/sd-concepts-library/madhubani-art)。


