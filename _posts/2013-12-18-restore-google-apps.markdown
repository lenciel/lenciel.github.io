---
layout: post
title: "定制机上恢复google原厂应用"
date: 2013-12-18 22:33
comments: true
categories: 
- tips
- android
- gapps
- jellybean
---

最近因为移动的手机丢了，正好宽带升级到100M送了两个电信的卡没地方用，入了一个Rick推荐的电信移动双卡双待的机器：[中兴N986](http://item.jd.com/824702.html)。

机器用来当小三机已经是非常不错了，唯一让本座纠结的就是电信的合约机老是喜欢把google账号干掉，而小弟的所有联系人又都在google（虽然现在看起来这么做可能也未必妥当）。

据Rick大大说，之前是可以用小米的[谷歌应用下载器](http://app.xiaomi.com/detail/36925)来直接把Google的一干应用装回来。但是好像因为[Google不太愿意](http://www.zhihu.com/question/21103129)自己的应用被未授权的雷总装来装去，这个应用已经没有更新了：青漾系统是4.2.1，下载回来的apk直接`adb install`会因为android版本不match报错。

于是只好去搜了[4.2.1的stock gapps包](http://www.teamandroid.com/gapps/)回来自己撸 - [百度盘分享了一份](http://pan.baidu.com/s/1iPXn)。

首先要root机器，然后把`/system/app`路径mount成rw的。

root就是刷recovery然后替换一些文件，当然大天朝有不少神器做得非常不错，比如[刷机大师](http://www.mgyun.com/)这种软件，感觉会摧毁电脑城刷机青年的就业机会。而修改目录权限这种事情，如果你对命令行不熟，好像有很多流行的文件夹管理应用可以用来更改目录的权限。

然后，直接把下载回来的gapps.zip解压，进入`system/app`路径，将自己需要的apk往`/system/app`路径push就行了。

以Google联系人同步为例，就是：

```bash
adb push GoogleContactsSyncAdapter.apk /system/app/.
```

这里要注意的就是所有Google的应用有些基础的依赖，要记得check一下/system/app下面是不是都有，比如`GoogleServicesFramework.apk`等等。


