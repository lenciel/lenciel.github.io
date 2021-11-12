---
layout: post
title: "How Does iBeacons Work"
date: 2014-05-14 15:19:59 +0800
comments: true
categories:
-  iBeacons
-  ble
-  tutorial
---

iBeacons 这个怪怪的单词[最近出镜率很高](https://www.google.com/search?q=%E6%9C%80%E8%BF%91%E5%87%BA%E9%95%9C%E7%8E%87%E5%BE%88%E9%AB%98+site%3A36kr.com&oq=%E6%9C%80%E8%BF%91%E5%87%BA%E9%95%9C%E7%8E%87%E5%BE%88%E9%AB%98+site%3A36kr.com&aqs=chrome..69i57.5408j0j7&sourceid=chrome&es_sm=91&ie=UTF-8#newwindow=1&q=ibeacons+site:36kr.com&safe=off)。它可以用的场景很多，考勤打卡，室内导航，各种关联位置的推送以及我们现在还想不到诡异的应用。但虽然满坑满谷的文章介绍如何应用 iBeacons，但它工作的原理究竟是什么样的呢？

Bluetooth LE
=============

[Bluetooth Low Energy](http://www.bluetooth.com/Pages/Low-Energy.aspx)，也就是低功耗蓝牙，经常被缩写成 BLE。它其实是 2010 年颁布的 Bluetooth 4.0 标准的一部分：说准确点儿就是由 Nokia 提出的本来叫`Wibree`的那部分。

话说 11 年本座给一个银行做押运的系统，需要在 Android 手机上加外设，让押运员持卡验明正身。当时考察了好些技术，蓝牙，NFC，IC 卡...蓝牙被放弃的原因就是供电太麻烦而 4.0 低功耗的设备市面上根本就找不到。因为虽然标准是 2010 年就颁布了，但是 4.0 的协议向下不兼容，设备更新没有那么快。一晃几年过去了，你还是能看到市面上有三种主要的蓝牙设备型号：

- Bluetooth: 仅支持`传统`蓝牙
- Bluetooth Smart Ready: `传统`和`低功耗`通吃的蓝牙
- Bluetooth Smart: 仅支持`低功耗`蓝牙

![bluetooth smart ready logo](/downloads/images/2014_05/bluetooth_smart_ready_logo.jpg --alt Don't touch me)

比较老的设备，以及大部分的汽车，家电等等，是仅支持传统意义上的 Bluetooth 的。

比较新的手机（iPhone 4S+，Samsung G3+），平板，笔记本等等都已经支持了完整的 Bluetooth 4.0，所以都可以算是"Smart Ready"的。

Beacons，如前面所述，是仅支持低功耗这部分的标准，所以就是"Smart"的。这些设备一般一颗纽扣电池就可以保证它运行 2 年左右，发射频率和传统蓝牙一样都是 2.4GHz-2.4835GHz，在无遮挡的情况下 100 米内都有信号，但传输速率比传统蓝牙慢：当然，低功耗蓝牙设计的目的也不是用来输送大量的数据。

BLE通信
==========

BLE 通信主要是两种模式：`Advertising`和`Connecting`。

`Advertising`是单向的。希望被发现的设备自主发射间隔从 20ms 到 10s 不等的数据包出来。发射间隔越短，电池寿命就会越短，但同时也会更快的被找到。数据包的组成为：

- 1 byte
- 4 bytes access adress
- 2-39 bytes advertising channel PDU
- 3 bytes CRC

![bluetooth le packet](/downloads/images/2014_05/bluetooth_le_packet.png --alt Don't touch me)

其中`access address`在这种模式下是固定的`0x8E89BED6`。换句话说，`Advertising`模式就是对外以一个固定的读取地址和固定的时间间隔不断的发送数据。

PDU 的 2 个 bytes 的头包含了`size/type`等 payload 的信息，接着是 device 的 MAC 地址，最后是最多 31 个 bytes 的实际 payload 数据。

当一个设备被找到之后，连接可以切换到`Connecting`模式。这种情况下，设备可以对外提供可读写的服务（被称为 GATT profile）。比如一个智能热水器，可以提供一个服务让你读取以及设置出水的温度。

关于`Connecting`到 BLE 设备，苹果的教程或者更专业的 EE times 的介绍都可以看看。但其实 beacons 没有使用`Connecting`模式，它只工作在`Advertising`模式下。

beacons如何使用BLE
=====================

beacons 仅仅工作在`Advertising`模式下。因此，可以说所谓的`iBeacons`就是 iOS 下对 BLE 的`Advertising`工作模式里数据的定义和封装。

以 Estimote 的 beacon 为例，下面是它的 PDU 数据（使用 XCode 的[插件](http://stackoverflow.com/questions/5863088/bluetooth-sniffer-preferably-mac-osx)可以对蓝牙设备抓包）：

```
02 01 06 1A FF 4C 00 02 15 B9 40 7F 30 F5 F8 46 6E AF F9 25 55 6B 57 FE 6D 00 49 00 0A C5
```

可以看到整个 payload 数据是 30bytes，非常符合协议最多 31bytes 的要求。实际上，这份数据的格式的确是苹果[精心设计](http://stackoverflow.com/questions/18906988/what-is-the-ibeacon-bluetooth-profile)了的：

```
02 01 06 1A FF 4C 00 02 15: iBeacon prefix (fixed)
B9 40 7F 30 F5 F8 46 6E AF F9 25 55 6B 57 FE 6D: proximity UUID (here: Estimote’s fixed UUID)
00 49: major
00 0A: minor
C5: 2’s complement of measured TX power
```


![bluetooth le ibeacon packet](/downloads/images/2014_05/bluetooth_le_ibeacon_packet.png --alt Don't touch me)

换句哈说，如果你想试玩一下 iBeacons 技术，在买到 beacon 之前，其实你手边的任何新一点儿的 iPhone 或者[Mac设备都可以拿来作为iBeacon](http://developer.radiusnetworks.com/2013/10/09/how-to-make-an-ibeacon-out-of-a-raspberry-pi.html)的发射端或者接收端。当然，[万能的树莓](http://developer.radiusnetworks.com/2013/10/09/how-to-make-an-ibeacon-out-of-a-raspberry-pi.html)也可以改造成 beacon。

iBeacon数据格式
================
`02 01 06 1A FF 4C 00 02 15`是固定不变的 prefix。

`Proximity UUID`用来标识 beacon。比如商店里面一批 beacon 都是用来提供打折活动的推送给顾客，那么这批 beacon 的 Proximity UUID 就应该是一样的。

`Major Number` (2 bytes，例子里面是`0×0049`，也就是 73) 是用来对一批 beacon 进行分组的。比如商店里面的所有的 beacon 可以配置成相同的`Major Number`。

`Minor Number` (2 bytes，例子里面是`0x000A`，也就是 10)用来标识单个的 beacon。因为商店里面每个 beacon 都有不同的`Minor Number`，才能知道顾客是处在什么位置。

测距
=====

数据里面的最后一位，`TX Power`，就是用来表征你离某个 beacon 的距离的。它测距离主要就是用所谓的 RSSI(Received Signal Strength Indication)去算，这个算法在 iOS 里面是已经集成了的，即便是需要在 Android 平台上面实现一遍[也不是那么的复杂](http://stackoverflow.com/questions/20416218/understanding-ibeacon-distancing)。

另外需要注意的就是，无线信号总会因为障碍物以及其他的信号源更快的衰减。所以测算出来的距离只是一个有大概。

iOS集成
=========

苹果既然敢在 beacon 前面加个 i 当然是做了很多增强的。对应用开发者来说，最主要的就是当用户靠近 iBeacons 设备的时候，App 即使不在前台也可以被唤醒，并发送 notification 给用户。

需要注意的是，因为 beacon 是周期性的发送，而手机在进入省电模式的时候探测蓝牙型号也是周期性的。这两个周期很可能会踩到边界，造成在实际应用中，有的手机[甚至会需要15分钟](http://developer.radiusnetworks.com/2013/11/13/ibeacon-monitoring-in-the-background-and-foreground.html)左右的时间才能找到 beacon。

iOS 下详细的应用开发教程可以见[这里](http://www.cocoanetics.com/2013/11/can-you-smell-the-ibeacon/)。更多的例子可以参考设备商 Estimote 的 iOS SDK 和 Android。

如何购买设备
============

现在整个供货情况还是接不上趟的。我的[Estimote](http://estimote.com/)已经订了 4 个多礼拜了还杳无音讯。因此最快的上手方案仍然是改造你的手机或者用 Raspberry Pi 自己搭个玩。但是如果你不满足（一般是满足不了的）这种玩法可以试试：

- 预订[Estimote](http://estimote.com/)的 beacon: 99 刀 3 个
- [Kontakt](http://kontakt.io/)的 beacon: 99 刀 4 个，279 刀 10 个
- [RadiusNetworks](http://www.radiusnetworks.com/)的树莓套件: 99 刀 1 个
- [RedBearLab](http://redbearlab.com/ibeacon/)的 Arduino 套件： 30 刀 1 个
- [Bleu](http://bleu.io/)的 USB 转 iBeacon 转接头：40 刀 1 个，150 刀 5 个

另外，高通也有做自己的解决方案叫[Gimbal](https://www.gimbal.com/)，不但提供了 Android 和 iOS 两套 SDK，价格也很平易近人：5 刀一个，值得拥有，:)
