---
layout: post
sidenote: false
comments: true
description: "摘要"
title: "给老款 Sonos 加上 AirPlay"
date: 2023-08-01 07:24:32 +0800
categories:

- tools-i-use
- raspberry-pi
- airplay
- music

---

多年前受 Rudey 的蛊惑，我买了人生的第一套 Sonos。

我自己还用 Raspberry Pi 挂了个 1T 的移动硬盘跑着些服务[^1]：

- [transmission](https://transmissionbt.com/)：我看电影主要是通过它下载到移动硬盘上；
- [NFS Server](https://www.redhat.com/sysadmin/configure-nfs-linux)：绝大部分设备都良好的支持 NFS 协议，包括投影仪上的 Kodi 或者 Sonos；
- [Samba Server](https://www.samba.org/)：给小朋友或者朋友的设备共享硬盘上有限的目录；

这么设计是因为折腾 NAS 对我这样经常搬家的人来说太重了。但什么东西放云上，什么东西放本地，我又有自己的需求：

- 手机上的照片、视频之类的，一方面文件有多又大且基本是**贵重的冷数据**（不会常常打开来看，但一旦丢了就很心疼），一方面大厂的备份加送了有 AI 支持的排序和检索，所以我选择相信 Google、Apple（海外）的线上备份服务的[^2]。
- 电影、音乐、书等等，我一直不太相信线上服务，因为这么多年下来，看到了太多线上服务倒下或者歌曲灰掉，所以：
	- **音乐：**有研究说人主要会反复听自己 14 岁到 18 岁的时候听的歌。我没有那么绝对[^3]，但这么多年下来，也就攒了个 100 来 G 的 MP3 文件夹。我在移动硬盘、电脑和手机上都有这个文件夹，并且云上也做了备份（因为一旦本地的存储和备份出问题，要再收集一次这些音乐就没太痛苦了）；
	- **书：**最近几年我养成了看电子书的习惯。大部分书我都不会保存。所以只是在电脑和手机上同步，移动硬盘和云上都没有；
	- **电影：**除非觉得要二刷，一般看完就删除了。所以只在移动硬盘上有，偶尔拷一两部出差路上看看；

这套系统，我上班它下载，一点儿不耽误。并且因为就俩盒子，我每到一个地方，几分钟就能让投影仪或者 Sonos 把硬盘上的电影和音乐播放起来，所以多年以来，我十分满意。

{% picture /downloads/images/2023_08/sonos_music_library.png --img width="50%" alt="Don't touch me..." %}

可娃越来越大，听什么歌逐渐有了自己的主意。我开始以为给他们各建一个目录，维护一个他们的歌单也不麻烦。但很快就发现，小朋友的爱好是按月变化的。今天还在《爱如火》，明天就要《山丘》，一会儿是 Stephanie Beatriz，下一秒就要周杰伦全套...于是搜索然后推流变成了刚需。

有一个看起来比较容易的解决方案就是在 Sonos 上绑定 QQ 音乐或者网易云音乐的账号。不过，这些客户端上越来越多的歌灰掉了，变得不太好用。所以我准备用类似于[洛雪](https://github.com/lyswhut/lx-music-desktop)这样的客户端搜索然后 AirPlay[^4]推流给 Sonos。

看了一下，有两种方案。一种是通过 [AirConnect](https://github.com/philippe44/AirConnect)，一种是通过 [SharePoint Sync](https://github.com/mikebrady/shairport-sync)。后者有限支持 AirPlay2，适合需要把 Sonos 集成到类似于 [HA](https://community.home-assistant.io/t/add-support-for-tuneblade-windows-airplay-multi-room/103642) 生态里的用户，但配置相对复杂很多。而 AirConnect 就是一个可执行文件，下载运行：

```bash
wget https://github.com/philippe44/AirConnect/raw/master/bin/aircast-linux-arm
chmod a+x aircast-linux-arm
./aircast-linux-arm-static -l 1000:2000 -f aircast.log -d all
```

如果没有出错，手机和电脑就可以找到这个设备了：

{% picture /downloads/images/2023_08/sonos_airplay.png --img width="50%" alt="Don't touch me..." %}

然后就可以在 Raspberry Pi 上增加一个[系统服务](https://github.com/philippe44/AirConnect#start-automatically-in-linux)，让它自动启动。实际用下来，除开会在一开始有几秒钟起跑的时间，其他都还挺正常的。

[^1]: 当然，除开服务，也有一些基础的配置。比如安全设置和 ssh 的登录，绑定固定 IP ，有基础的编译软件包和写 Python 脚本的环境等等。
[^2]: 追求极致「self-host」的同学，当然可以自建 NAS 然后搭 [immich](https://github.com/immich-app/immich) 这样的服务，但对我来说收益很小。
[^3]: 比如窦唯我就是是这几年开始经常听的。
[^4]: 因为我主要是苹果的设备。