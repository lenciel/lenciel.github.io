---
layout: post
title: "使用dnsmasq配置本地开发环境"
date: 2014-04-25 14:53:37 +0800
comments: true
categories:
- dnsmasq
- dev
- tips
---

做 Web 开发的时候经常需要修改`/etc/hosts`文件把`dev.cool.project`或者`cool.project.dev`这样的域名指向 127.0.0.1(如果你从来没有这么做过那你可以跳过后面的内容了但, seriously? you are a web dev and never did this before?）。这样做有些麻烦：

* 每个项目需要修改 hosts 文件
* 需要 root 权限才能修改这个文件

这里记一下如何用[dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html)把所有`dev`结尾的域名都指向`127.0.0.1`。

#### 安装dnsmasq

在 Mac 下安装什么东西本座都用[homebrew](http://brew.sh/)，先更新 brew:

```bash
    $ brew up
```

然后安装 dnsmasq。注意安装命令的输出，结尾是有配置的简单说明的。因为我用了[boxen](https://lenciel.com/2013/03/boxen-introduction/)所以路径不一定对每个人都适用，以你自己的输出为准：

```bash
    $ brew install dnsmasq
==> make install PREFIX=/opt/boxen/homebrew/Cellar/dnsmasq/2.69
==> Caveats
To configure dnsmasq, copy the example configuration to /opt/boxen/homebrew/etc/dnsmasq.conf
and edit to taste.
  cp /opt/boxen/homebrew/opt/dnsmasq/dnsmasq.conf.example /opt/boxen/homebrew/etc/dnsmasq.conf
To have launchd start dnsmasq at startup:
    sudo cp -fv /opt/boxen/homebrew/opt/dnsmasq/*.plist /Library/LaunchDaemons
Then to load dnsmasq now:
    sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.dnsmasq.plist
==> Summary
/opt/boxen/homebrew/Cellar/dnsmasq/2.69: 7 files, 488K, built in 22 seconds
```

#### 配置dnsmasq

在`dnsmasq.conf`里面添加一个配置`dev`的配置：

```bash
address=/dev/127.0.0.1
```

重启 dnsmasq 服务:

```bash
$ sudo launchctl stop homebrew.mxcl.dnsmasq
$ sudo launchctl start homebrew.mxcl.dnsmasq
```


#### 配置OSX

安装了 dnsmasq 之后你有两个选择：

  1. 把操作系统所有的 DNS 查询都由 dnsmasq 处理
  2. 把`.dev`的 DNS 查询交给 dnsmasq 处理

第一个比较简单，在`System Preferences`里面配置一下就可以了。
第二个需要用/etc/reslov.conf 文件来更精细的控制 DNS 查询:

```bash
$ sudo mkdir -p /etc/resolver
$ sudo touch /etc/resolver/dev
$ sudo vi /etc/resolver/dev
```

在`/etc/resolver/dev`里面添加一行`nameserver 127.0.0.1`就可以了。

### 测试效果

```bash

    $ ping -c 1 www.sina.com.cn
    PING newscd.sina.com.cn (221.236.31.145): 56 data bytes

    $ ping -c 1 this.is.a.test.dev
    PING this.is.a.test.dev (127.0.0.1): 56 data bytes

    $ ping -c 1 this.is.cool.dev
    PING this.is.cool.dev (127.0.0.1): 56 data bytes
```

嗯哼~


