---
layout: post
title: "Raspberry Pi上使用HDMI转接VGA线"
date: 2013-08-20 15:19
comments: true
categories: 
- raspberry pi
- hardware
- tips
---

[Raspberry Pi](http://www.raspberrypi.org/‎)的默认提供了HDMI接口，遇到手边显示器比较老并且电视机也比较老就不好办。

如果直接买一根[HDMI转VGA的线](http://item.jd.com/674899.html)，直接连上去很可能是黑屏，这是因为默认的配置文件不支持这种连接方式，需要修改配置文件。

需要修改的是 `/boot/config.txt`里面的几个配置值，具体的讨论[在这里](http://www.raspberrypi.org/phpBB3/viewtopic.php?f=76&t=33477)：

```
disable_overscan=1
hdmi_group=2
hdmi_mode=35
hdmi_drive=2
```

修改完毕之后重新启动就可以看到画面了。