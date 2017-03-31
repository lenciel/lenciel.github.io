---
layout: post
title: "Mac上使用Suite Fusion管理字体"
date: 2014-07-26 11:36:48 +0800
comments: true
categories: 
- tools-i-use
- font
---

对于从事设计工作的人员，难免要和字体打交道：因为[设计主要就是Typography的设计](http://lenciel.com/2013/08/buttericks-practical-typography/)，而Typography的基础就是字体。

随着完成的项目越来越多，机器上的字体也就慢慢多起来，如何快速的找到自己想要的字体变成了问题。特别是大多数设计软件里，字体选择的界面都是一个下拉框：如果你有几百个字体加载到系统，几乎每次选择字体都是一场灾难。

这种情况下，难免会希望：

* 对于特定的项目，能够选择特定的字体库
* 对于特定的文档类型，能够选择特定的字体库

使用Suite Fusion管理字体就可以到达这两个目的。

Mac上的字体集和安装路径
--------------------------

过去在Windows平台上工作的时候，字体都是放在一个地方的，而在Mac下面字体主要是下面三部分字体集组成：

* System：位于`/System/Library/Fonts`， 是系统的字体库，所有登录的用户都可以使用，最好不要随便改动
* Local：位于 `/Library/Fonts`，和System字体一样也是所有登录的用户都可以使用的。只是它们基本不是随系统安装，而是其他软件装上去的，比如MS Word等等
* User：位于 `~/Library/Fonts`，仅对当前登录的用户可用，可以是第三方软件安装的时候安装的（如果你选择了只对当前用户可用），也可以是用户自己安装的字体

启用Suite Fusion的Font Vault
-----------------------------

Suite Fusion提供了一个可以自己定义路径的Font Vault。然后你如果在`Preferences`里面把`Copy added fonts into the vault`勾上，那么所有添加到Suite Fusion的字体都会被放在一个地方。这样的好处是管理方便：保证字体没有重复，并且很容易备份。

一旦你的字体都在Font Vault里面了，就可以使用Suitcase Fusion删除原来放在各个地方的字体了。在字体清理好之后，你就可以根据不同的项目或者是文档类型建立Set，根据需要来激活它们。

添加字体和创建字体库
---------------------

只需要使用快捷键"Cmd+L"就可以添加字体到字体库。如果默认的字体库不符合你的要求还可以自己新建。添加字体的过程中，SF会扫描字体，提取字体信息，检测是否有错（注意，Suite Fusion不支持orphan outline和orphan bitmap字体）。

并且，如果你本来是用目录来组织字体的，Suite Fusion在支持顶级目录导入，再自动以子目录名创建相应的字体库。

整理字体的界面可以参考下面的截图：

![suite fusion 5](/downloads/images/2014_07/suite_fusion_5.png "Don't touch me...")

建立的这些字体库可以根据你打开的文档类型来进行激活和去激活。并且Suite Fusion提供了很多常见设计软件（比如Photoshop、Sketch等）的插件，让你直接在这些软件里面操作字体库。


