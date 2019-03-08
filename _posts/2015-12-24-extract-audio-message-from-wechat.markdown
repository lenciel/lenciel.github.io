---
layout: post
title: "提取微信语音消息"
date: 2015-12-24 13:05:21 +0800
comments: true
categories: 

- tools-i-use

---

### Why?

Why not?

### How?

#### 导出原始微信的音频消息

- 使用iTunes创建一个不加密备份
- 导出备份中的微信应用文件夹（可以使用iExplorer试用版）
- 找到你需要转换的音频文件所在文件夹

#### 转换silk3编码音频为mp3

如果你是mac机器，只需要安装ffmpeg（推荐使用homebrew）然后运行脚本：

```python
    python wechat2mp3.py 待转换音频所在文件夹
```

如果你是其他系统，确认你装好了ffmpeg之后，需要[自己编译SILK解码库](https://github.com/gaozehua/SILKCodec)。

### Seriously Why?

常温常压下我并不需要导出微信的语音，之所以有这个需求是因为蒙爷在三亚经常用微信跟我们唠嗑：

<audio controls loop preload><source src="/downloads/audio/mm_voice.mp3"></audio>

听到这样销魂的声音你就算不想保存，也想要转发，对不对？

毕竟作为一名中国人，你已经有8个亲戚群了，对不对？

然后微信奇怪的生态圈构建方式就是，各种封闭。

微信公众号是世间少有的不允许外链的媒体，微信客户端是世间少有的不允许导出聊天记录的聊天工具。

它的想法大概是，你珍贵的瞬间都在我这里（微信专门做了“收藏”这个功能让你把这些片段上传到微信的服务器，打着不让它们丢失的旗号），那你就逃不出我的手掌心了。

### Seriously How?

使用iTunes创建一个不加密的备份，然后连接iExplorer，会看到打开iTunes备份的选项：

![Vhost threshold](/downloads/images/2015_12/extract_wechat_1.png "Don't touch me...")

打开后在`App`文件夹下面导出微信文件夹：

![Vhost threshold](/downloads/images/2015_12/extract_wechat_2.png "Don't touch me...")

在导出的文件夹下面有个Audio目录，你可以根据语音消息的数量大概确认需要导出的目录（目录是个hash），然后到`DB/MM.sqlite`下面去打开`Chat_[hash]`这个表里面，看看消息来确认：

![Vhost threshold](/downloads/images/2015_12/extract_wechat_3.png "Don't touch me...")

二进制查看其中的任意一个文件，可以看到是[SILK](https://en.wikipedia.org/wiki/SILK)编码的（skype早期版本包括lync都是使用的这种编码方式）：

![Vhost threshold](/downloads/images/2015_12/extract_wechat_4.png "Don't touch me...")

接下来你只需要按照[repo](https://github.com/lenciel/wechat2mp3)里面的指导(愿主保佑你是用Mac因为那最简单)来进行文件转换就可以了。

