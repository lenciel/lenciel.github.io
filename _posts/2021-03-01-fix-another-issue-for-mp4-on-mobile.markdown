---
layout: post
comments: true
title: "移动端 MP4 无法加载"
date: 2021-03-01 16:30:06 +0800
categories: 

- blog
- mp4
- mobile

---

昨天因为讨论裸眼 3D 动效的实现，无意中打开一篇[之前的帖子](https://lenciel.com/2014/02/3d-gifs/)，发现所有的视频文件加载都有问题。

这是因为我之前做性能优化的[时候](https://lenciel.com/2020/05/issues-are-fixed-and-gif-is-abandoned/)，把所有的 GIF 文件转成了 MP4 用 CDN 部署之后，没有在各种环境下充分测试过。

大概看了一下，在桌面浏览器上都能正常显示，但是在移动设备上就不行。我用 Safari 的开发者模式调试自己 iPhone 上的网页，可以看到请求这些视频的时候，有一些报错。

一开始以为是七牛云对[ 「Range」 的处理出了问题](https://stackoverflow.com/questions/32996396/safari-9-0-can-not-play-mp4-video-on-the-storage-server)，但是我用 curl 查看服务器的返回都是对的。

在 Mac 上用 Safari 直接打开页面，也确实能够访问。

那么，就只剩下视频编码的问题了。我查了一下苹果的[文档](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/StreamingMediaGuide/FrequentlyAskedQuestions/FrequentlyAskedQuestions.html)，原来确认被支持的 H.264 Profile 只有：

> H.264 Baseline Level 3.0, Baseline Level 3.1, Main Level 3.1, and High Profile Level 4.1.

我看了一下自己的文件：

```Shell
$ ffmpeg -i false_start.mp4

  Duration: 00:00:03.00, start: 0.000000, bitrate: 139 kb/s
    Stream #0:0(und): Video: h264 (High 4:4:4 Predictive) (avc1 / 0x31637661), yuv444p, 500x269, 135 kb/s, 16.67 fps, 16.67 tbr, 12800 tbn, 33.33 tbc (default)
```

所以，我之前直接用 ffmpeg 把 GIF 转 MP4，得到的文件是 `High 4:4:4 Predictive` 的文件，于是在手机浏览器上 decode 失败了。

重新做一次转码，然后部署到七牛云并刷新缓存就 OK 了：

```Shell
for i in *.gif; do
    [ -f "$i" ] || break
        echo "this is ${i%%.*}"
        ffmpeg -f gif -i -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" $i ${i%%.*}.mp4
done
```

这件事教育了我，not all mp4 files are equal，也让我明白了，为啥七牛云上有一个服务是转换 GIF 为 MP4，当时我还纳闷，这还需要个服务，ffmpeg 一句命令还能出错么……

