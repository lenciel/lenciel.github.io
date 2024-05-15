---
layout: post
comments: true
description: "语音转文本再进行处理（记录、总结或者翻译）。由于目前的解决方案基本都是跑在服务器端的，所以也有一些问题。首先是不够安全。不管是私人的通话，还是工作的会议，把音频录制和处理交给第三方，特别是国内一些厂商，还是让人感觉有点害怕的。其次是不够灵活。比如，YouTube 自动加字幕的功能，依赖 Google 的服务。本地下载了一部冷门的电影，就还得老老实实花时间去找字幕。这些问题的解决，核心是下面两个方面..."
title: "不花钱的同声传译"
date: 2024-05-07 09:29:10 +0800
categories:

- tools-i-use
- LLM
- Whisper

---

最近参加一个技术会议，我请大家举手简单统计了一下参会者在 ChatGPT、Kimi 等产品上的活跃度，发现每天都用的人大大减少了。

这跟我[两年前](/2022/09/what-could-happen-after-ism/)的判断差不多： LLM 对搜索会有很大的冲击（因为用户脑子里有关键词，好写 prompt），但大部分时候，聊天仍然是个非常糟糕的用户界面（问什么怎么问，压力都在用户这边）。

如果让我总结使用 LLM 频度最高的场景，是嵌在飞书里的那些跟开会相关的功能：自动字幕，自动转文本，自动给总结等等。

如果让蒙爷总结，他的最核心场景会是 Youtube 上实时给视频的添加的中文字幕，一下子把他可以看懂的视频扩大了几个数量级。

这些功能都涉及语音转文本再进行处理（记录、总结或者翻译）。由于目前的解决方案基本都是跑在服务器端的，所以也有一些问题。

首先是不够安全。不管是私人的通话，还是工作的会议，把音频录制和处理交给第三方，特别是国内一些厂商，还是让人感觉有点害怕的。

其次是不够灵活。比如，YouTube 自动加字幕的功能，依赖 Google 的服务。本地下载了一部冷门的电影，就还得老老实实花时间去找字幕。

这些问题的解决，核心是下面两个方面：

- 有没有办法很容易的提取音轨或者转发音频流
- 有没有办法在本地对音轨或者音频流使用 LLM 进行处理

如果是有钱人，我会推荐 [Rogue Amoeba](https://rogueamoeba.com/) 家的 Loopback 和 Audio Hijack。 Loopback 可以通过创建虚拟声卡对音频进行各种的控制和转发解决第一步。而 Audio Hijack 的新版本里内置了一个 [transcribe](https://rogueamoeba.com/support/manuals/audiohijack/?page=transcribe) 模块解决第二步{% sidenote 'sn-id-0' '实际上背后也是 OpenAI 的 Whisper ，精确版对应 large-v2 的模型。' %}：

{% picture /downloads/images/2024_05/advancedblocks-transcribe-frommic.png --alt advancedblocks-transcribe-frommic.png %}\
<small>图1. 从输入设备对音频流进行录制和转写</small>

如果稍微愿意动动手，我会推荐 [ffmpeg](https://ffmpeg.org/) +[VB-Cable](https://vb-audio.com/Cable/index.htm) 解决第一个问题，[whisper-cpp](https://github.com/ggerganov/whisper.cpp) 解决第二步：因为它们免费，并且开源，完全可控。

下面的步骤针对 Mac，但 Widnes 上相同的思路应该也是工作的。

### 安装 ffmpeg 和 VB-Cable

ffmpeg 主要用来处理音频文件，安装就直接用 Homebrew。

```bash
brew install ffmpeg
```

然后如果是现场的音频文件，需要处理成 16khz 的 WAV 文件：

```bash
ffmpeg -i audio.mp3 -acodec pcm_s16le -ac 1 -ar 16000 audio.wav
```

如果是视频，则需要抓取里面的音轨做转换：

```bash
ffmpeg -i vod.mp4 -hide_banner -vn -ar 16000 -ac 1 -c:a pcm_s16le -y vod-resampled.wav
```

VB-Cable 是一个安装文件，装好了之后可以看到在音频配置里面多了一块虚拟声卡：

{% picture /downloads/images/2024_05/vb-cable.jpg --alt vb-cable.jpg %}\
<small>图2. 输入输出里面都有，因此可以录也可以回放</small>

这个主要是用来捕获音频流的。

### 安装 whisper-cpp

虽然 Homebrew 提供了 formula 但是我选择了 clone 项目来编译。因为有一些平台相关的优化我不知道 Homebrew 的版本是怎么处理的。

比如，把 Apple Neural Engine (ANE) 用起来 whisper-cpp 能够快最少三倍，但是它需要做一些设置{% sidenote 'sn-id-1' '更多关于 whisper-cpp 对 Core ML 的支持，可以看[这里](https://github.com/ggerganov/whisper.cpp/pull/566)。' %}：

```bash
pip install ane_transformers
pip install openai-whisper
pip install coremltools
```

然后生成模型的 Core ML 版本，比如我使用了 `large-v3` 版本的模型：

```bash
./models/generate-coreml-model.sh large-v3
```

最后需要打开编译开关进行编译：

```bash
# using Makefile
make clean
WHISPER_COREML=1 make -j
```

当跑起来的时候提示 Core ML 模型正确加载了，就说明成功了：

```bash
./main -m models/ggml-large-v3-q5_0.bin ./samples/jfk.wav

...
whisper_init_state: kv cross size =  245.76 MB
whisper_init_state: loading Core ML model from 'models/ggml-large-v3-encoder.mlmodelc'
whisper_init_state: first run on a device may take a while ...
whisper_init_state: Core ML model loaded
ggml_backend_metal_buffer_type_alloc_buffer: allocated buffer, size =     8.80 MiB, ( 1490.55 / 12288.02)
```

### 处理音频文件

whisper-cpp 处理本地的音频文件就只需要组合使用参数，比如我要用 8 线程对一部法语电影的音轨做翻译并且生成字幕文件：

```bash
./main -m ./models/ggml-large-v3.bin -f samples/movie.wav -l fr -t 8 -osrt --translate
```

whisper-cpp 有很丰富的参数：

```bash
usage: whisper-cpp [options] file0.wav file1.wav ...

options:
  -h,        --help              [default] show this help message and exit
  -t N,      --threads N         [4      ] number of threads to use during computation
  -p N,      --processors N      [1      ] number of processors to use during computation
  -ot N,     --offset-t N        [0      ] time offset in milliseconds
  -on N,     --offset-n N        [0      ] segment index offset
  -d  N,     --duration N        [0      ] duration of audio to process in milliseconds
  -mc N,     --max-context N     [-1     ] maximum number of text context tokens to store
  -ml N,     --max-len N         [0      ] maximum segment length in characters
  -sow,      --split-on-word     [false  ] split on word rather than on token
  -bo N,     --best-of N         [5      ] number of best candidates to keep
  -bs N,     --beam-size N       [5      ] beam size for beam search
  -wt N,     --word-thold N      [0.01   ] word timestamp probability threshold
  -et N,     --entropy-thold N   [2.40   ] entropy threshold for decoder fail
  -lpt N,    --logprob-thold N   [-1.00  ] log probability threshold for decoder fail
  -debug,    --debug-mode        [false  ] enable debug mode (eg. dump log_mel)
  -tr,       --translate         [false  ] translate from source language to english
  -di,       --diarize           [false  ] stereo audio diarization
  -tdrz,     --tinydiarize       [false  ] enable tinydiarize (requires a tdrz model)
  -nf,       --no-fallback       [false  ] do not use temperature fallback while decoding
  -otxt,     --output-txt        [false  ] output result in a text file
  -ovtt,     --output-vtt        [false  ] output result in a vtt file
  -osrt,     --output-srt        [false  ] output result in a srt file
  -olrc,     --output-lrc        [false  ] output result in a lrc file
  -owts,     --output-words      [false  ] output script for generating karaoke video
  -fp,       --font-path         [/System/Library/Fonts/Supplemental/Courier New Bold.ttf] path to a monospace font for karaoke video
  -ocsv,     --output-csv        [false  ] output result in a CSV file
  -oj,       --output-json       [false  ] output result in a JSON file
  -ojf,      --output-json-full  [false  ] include more information in the JSON file
  -of FNAME, --output-file FNAME [       ] output file path (without file extension)
  -ps,       --print-special     [false  ] print special tokens
  -pc,       --print-colors      [false  ] print colors
  -pp,       --print-progress    [false  ] print progress
  -nt,       --no-timestamps     [false  ] do not print timestamps
  -l LANG,   --language LANG     [en     ] spoken language ('auto' for auto-detect)
  -dl,       --detect-language   [false  ] exit after automatically detecting language
             --prompt PROMPT     [       ] initial prompt
  -m FNAME,  --model FNAME       [models/ggml-base.en.bin] model path
  -f FNAME,  --file FNAME        [       ] input WAV file path
  -oved D,   --ov-e-device DNAME [CPU    ] the OpenVINO device used for encode inference
  -ls,       --log-score         [false  ] log best decoder scores of tokens
  -ng,       --no-gpu            [false  ] disable GPU
```

### 处理音频流

音频文件不能覆盖所有场景。如果想要在看各种网页或者视频的时候有一个「同声翻译」，或者是在开会的时候有「实时转录」，就涉及到处理音频流了。

把 VB-Cable 设置成输出之后，我们的所有音频就会转发到这个设备上（如果你同时还想听到，可以再甚至个输入）。然后编译 whisper-cpp 提供的 stream 进行监听：

```bash
brew install sdl2
make stream
./stream -m models/ggml-large-v3-q5_0.bin -t 8 --step 5000 --length 5000 -l zh
```

这里因为指定了输出语言是中文，所以如果你播放的是其他语言的内容，whisper-cpp 会尝试进行翻译：虽然效果一般，但是就像 YouTube 生成的自动字幕一样，能够帮助你大概看明白了。

### TODO

从音频转文字之后，还可以做一些额外的处理，比如把一个会议的内容交给模型做提纯做归纳总结等等。

相信在各个活菩萨公司开源的大模型的帮助下，端侧的更多场景会从可玩过渡到可用。
