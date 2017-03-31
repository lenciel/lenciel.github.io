---
layout: post
title: "打开pip的download cache"
date: 2013-10-17 13:25
comments: true
categories: 
- python
- pip
- tips
---

Python的标准库实在是[不够用](http://lenciel.com/2013/10/recharging-the-python-standard-library/)，所以一个很常见的情况是我们需要在每个项目使用的`virtualenv`里面都安装一些常用的库。

为了加速安装的过程，有两个小窍门。

一个是使用国内的源，比如[v2ex](http://www.v2ex.com/)提供的。只需要新建或者编辑`~/.pip/pip.conf`，加入一行：

```
[global]
index-url = http://pypi.v2ex.com/simple

```

另一个就是打开pip的`download cache`，这样可以避免pip每次都去下载相同的东西。只需要在`.bashrc`或者是`.zshrc`里面加入一行：

```
export PIP_DOWNLOAD_CACHE=$HOME/.pip-download-cache

```

