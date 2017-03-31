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

iBeacons这个怪怪的单词[最近出镜率很高](https://www.google.com/search?q=%E6%9C%80%E8%BF%91%E5%87%BA%E9%95%9C%E7%8E%87%E5%BE%88%E9%AB%98+site%3A36kr.com&oq=%E6%9C%80%E8%BF%91%E5%87%BA%E9%95%9C%E7%8E%87%E5%BE%88%E9%AB%98+site%3A36kr.com&aqs=chrome..69i57.5408j0j7&sourceid=chrome&es_sm=91&ie=UTF-8#newwindow=1&q=ibeacons+site:36kr.com&safe=off)。它可以用的场景很多，考勤打卡，室内导航，各种关联位置的推送以及我们现在还想不到诡异的应用。但虽然满坑满谷的文章介绍如何应用iBeacons，但它工作的原理究竟是什么样的呢？

Bluetooth LE
=============

[Bluetooth Low Energy](http://www.bluetooth.com/Pages/Low-Energy.aspx)，也就是低功耗蓝牙，经常被缩写成BLE。它其实是2010年颁布的Bluetooth 4.0标准的一部分：说准确点儿就是由Nokia提出的本来叫`Wibree`的那部分。

话说11年本座给一个银行做押运的系统，需要在Android手机上加外设，让押运员持卡验明正身。当时考察了好些技术，蓝牙，NFC，IC卡...蓝牙被放弃的原因就是供电太麻烦而4.0低功耗的设备市面上根本就找不到。因为虽然标准是2010年就颁布了，但是4.0的协议向下不兼容，设备更新没有那么快。一晃几年过去了，你还是能看到市面上有三种主要的蓝牙设备型号：

- Bluetooth: 仅支持`传统`蓝牙
- Bluetooth Smart Ready: `传统`和`低功耗`通吃的蓝牙
- Bluetooth Smart: 仅支持`低功耗`蓝牙

![bluetooth smart ready logo](/downloads/images/2014_05/bluetooth_smart_ready_logo.jpg "Don't touch me...")

比较老的设备，以及大部分的汽车，家电等等，是仅支持传统意义上的Bluetooth的。

比较新的手机（iPhone 4S+，Samsung G3+），平板，笔记本等等都已经支持了完整的Bluetooth 4.0，所以都可以算是"Smart Ready"的。

Beacons，如前面所述，是仅支持低功耗这部分的标准，所以就是"Smart"的。这些设备一般一颗纽扣电池就可以保证它运行2年左右，发射频率和传统蓝牙一样都是2.4GHz-2.4835GHz，在无遮挡的情况下100米内都有信号，但传输速率比传统蓝牙慢：当然，低功耗蓝牙设计的目的也不是用来输送大量的数据。

BLE通信
==========

BLE通信主要是两种模式：`Advertising`和`Connecting`。

`Advertising`是单向的。希望被发现的设备自主发射间隔从20ms到10s不等的数据包出来。发射间隔越短，电池寿命就会越短，但同时也会更快的被找到。数据包的组成为：

- 1 byte
- 4 bytes access adress
- 2-39 bytes advertising channel PDU
- 3 bytes CRC

![bluetooth le packet](/downloads/images/2014_05/bluetooth_le_packet.png "Don't touch me...")

其中`access address`在这种模式下是固定的`0x8E89BED6`。换句话说，`Advertising`模式就是对外以一个固定的读取地址和固定的时间间隔不断的发送数据。

PDU的2个bytes的头包含了`size/type`等payload的信息，接着是device的MAC地址，最后是最多31个bytes的实际payload数据。

当一个设备被找到之后，连接可以切换到`Connecting`模式。这种情况下，设备可以对外提供可读写的服务（被称为GATT profile）。比如一个智能热水器，可以提供一个服务让你读取以及设置出水的温度。

关于`Connecting`到BLE设备，苹果的教程或者更专业的EE times的介绍都可以看看。但其实beacons没有使用`Connecting`模式，它只工作在`Advertising`模式下。

beacons如何使用BLE
=====================

beacons仅仅工作在`Advertising`模式下。因此，可以说所谓的`iBeacons`就是iOS下对BLE的`Advertising`工作模式里数据的定义和封装。

以Estimote的beacon为例，下面是它的PDU数据（使用XCode的[插件](http://stackoverflow.com/questions/5863088/bluetooth-sniffer-preferably-mac-osx)可以对蓝牙设备抓包）：

```
02 01 06 1A FF 4C 00 02 15 B9 40 7F 30 F5 F8 46 6E AF F9 25 55 6B 57 FE 6D 00 49 00 0A C5
```

可以看到整个payload数据是30bytes，非常符合协议最多31bytes的要求。实际上，这份数据的格式的确是苹果[精心设计](http://stackoverflow.com/questions/18906988/what-is-the-ibeacon-bluetooth-profile)了的：

```
02 01 06 1A FF 4C 00 02 15: iBeacon prefix (fixed)
B9 40 7F 30 F5 F8 46 6E AF F9 25 55 6B 57 FE 6D: proximity UUID (here: Estimote’s fixed UUID)
00 49: major
00 0A: minor
C5: 2’s complement of measured TX power
```


![bluetooth le ibeacon packet](/downloads/images/2014_05/bluetooth_le_ibeacon_packet.png "Don't touch me...")

换句哈说，如果你想试玩一下iBeacons技术，在买到beacon之前，其实你手边的任何新一点儿的iPhone或者[Mac设备都可以拿来作为iBeacon](http://developer.radiusnetworks.com/2013/10/09/how-to-make-an-ibeacon-out-of-a-raspberry-pi.html)的发射端或者接收端。当然，[万能的树莓](http://developer.radiusnetworks.com/2013/10/09/how-to-make-an-ibeacon-out-of-a-raspberry-pi.html)也可以改造成beacon。

iBeacon数据格式
================
`02 01 06 1A FF 4C 00 02 15`是固定不变的prefix。

`Proximity UUID`用来标识beacon。比如商店里面一批beacon都是用来提供打折活动的推送给顾客，那么这批beacon的Proximity UUID就应该是一样的。

`Major Number` (2 bytes，例子里面是`0×0049`，也就是73) 是用来对一批beacon进行分组的。比如商店里面的所有的beacon可以配置成相同的`Major Number`。

`Minor Number` (2 bytes，例子里面是`0x000A`，也就是10)用来标识单个的beacon。因为商店里面每个beacon都有不同的`Minor Number`，才能知道顾客是处在什么位置。

测距
=====

数据里面的最后一位，`TX Power`，就是用来表征你离某个beacon的距离的。它测距离主要就是用所谓的RSSI(Received Signal Strength Indication)去算，这个算法在iOS里面是已经集成了的，即便是需要在Android平台上面实现一遍[也不是那么的复杂](http://stackoverflow.com/questions/20416218/understanding-ibeacon-distancing)。

另外需要注意的就是，无线信号总会因为障碍物以及其他的信号源更快的衰减。所以测算出来的距离只是一个有大概。

iOS集成
=========

苹果既然敢在beacon前面加个i当然是做了很多增强的。对应用开发者来说，最主要的就是当用户靠近iBeacons设备的时候，App即使不在前台也可以被唤醒，并发送notification给用户。

需要注意的是，因为beacon是周期性的发送，而手机在进入省电模式的时候探测蓝牙型号也是周期性的。这两个周期很可能会踩到边界，造成在实际应用中，有的手机[甚至会需要15分钟](http://developer.radiusnetworks.com/2013/11/13/ibeacon-monitoring-in-the-background-and-foreground.html)左右的时间才能找到beacon。

iOS下详细的应用开发教程可以见[这里](http://www.cocoanetics.com/2013/11/can-you-smell-the-ibeacon/)。更多的例子可以参考设备商Estimote的iOS SDK和Android。

如何购买设备
============

现在整个供货情况还是接不上趟的。我的[Estimote](http://estimote.com/)已经订了4个多礼拜了还杳无音讯。因此最快的上手方案仍然是改造你的手机或者用Raspberry Pi自己搭个玩。但是如果你不满足（一般是满足不了的）这种玩法可以试试：

- 预订[Estimote](http://estimote.com/)的beacon: 99刀3个
- [Kontakt](http://kontakt.io/)的beacon: 99刀4个，279刀10个
- [RadiusNetworks](http://www.radiusnetworks.com/)的树莓套件: 99刀1个
- [RedBearLab](http://redbearlab.com/ibeacon/)的Arduino套件： 30刀1个
- [Bleu](http://bleu.io/)的USB转iBeacon转接头：40刀1个，150刀5个

另外，高通也有做自己的解决方案叫[Gimbal](https://www.gimbal.com/)，不但提供了Android和iOS两套SDK，价格也很平易近人：5刀一个，值得拥有，:)
