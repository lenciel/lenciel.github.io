---
layout: post
title: "update android sdk with shadowsocks proxy"
date: 2014-09-02 02:30:35 +0800
comments: true
categories: 

- gfw
- tips
- tools-i-use

---

博格坎普说，我们android项目的build挂了。

去Jenkins看了一下，日志里面的错误是：

```
[android] $ /usr/local/share/gradle-1.11/bin/gradle clean build
Creating properties on demand (a.k.a. dynamic properties) has been deprecated and is scheduled to be removed in Gradle 2.0. Please read http://gradle.org/docs/current/dsl/org.gradle.api.plugins.ExtraPropertiesExtension.html for information on the replacement for dynamic properties.
Deprecated dynamic property: "buildName" on "ProductFlavorDsl_Decorated{name=main, minSdkVersion=null, targetSdkVersion=null, renderscriptTargetApi=-1, renderscriptSupportMode=null, renderscriptNdkMode=null, versionCode=-1, versionName=null, applicationId=null, testApplicationId=null, testInstrumentationRunner=null, testHandleProfiling=null, testFunctionalTest=null, signingConfig=null, resConfig=null}", value: "1.0.97".

FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':app'.
> Could not resolve all dependencies for configuration ':app:_debugCompile'.
   > Could not find com.android.support:appcompat-v7:20.0.0.
     Required by:
         android:app:unspecified

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output.s
```

这其实在天朝是蛮常见的现象，因为`dl-ssl.google.com`被封了，所以你总是会因为下面的错误无法更新Android的SDK：

```bash
Failed connect to dl-ssl.google.com:443;
```

Jenkins服务器配置代理
-------------------------

这里之所以选择[shadowsocks](http://shadowsocks.org/)，是因为可以用自己在[Google的VM](https://developers.google.com/appengine/)上配置的shadowsocks代理服务器（顺便广告一下，Google的VM在做活动，几乎是最高配的机器都不要钱，而且第一跳就在美帝，用来做代理非常爽）。

安装shadowsocks的pythohn client:

```bash
$ pip install shadowsocks

Downloading/unpacking shadowsocks
  Running setup.py egg_info for package shadowsocks

    warning: manifest_maker: MANIFEST.in, line 1: 'recursive-include' expects <dir> <pattern1> <pattern2> ...

Installing collected packages: shadowsocks
  Running setup.py install for shadowsocks

    warning: manifest_maker: MANIFEST.in, line 1: 'recursive-include' expects <dir> <pattern1> <pattern2> ...

    Installing sslocal script to /usr/local/bin
    Installing ssserver script to /usr/local/bin
Successfully installed shadowsocks
Cleaning up...
```

可以看到安装完之后有两个可执行文件，运行其中的`sslocal`就可以启动shadowsocks的客户端了：

```bash
root@palm4fun-core-1:~/install# sslocal -h
usage: sslocal [-h] -s SERVER_ADDR [-p SERVER_PORT]
               [-b LOCAL_ADDR] [-l LOCAL_PORT] -k PASSWORD [-m METHOD]
               [-t TIMEOUT] [-c CONFIG] [--fast-open] [-v] [-q]

optional arguments:
  -h, --help            show this help message and exit
  -s SERVER_ADDR        server address
  -p SERVER_PORT        server port, default: 8388
  -b LOCAL_ADDR         local binding address, default: 127.0.0.1
  -l LOCAL_PORT         local port, default: 1080
  -k PASSWORD           password
  -m METHOD             encryption method, default: aes-256-cfb
  -t TIMEOUT            timeout in seconds, default: 300
  -c CONFIG             path to config file
  --fast-open           use TCP_FASTOPEN, requires Linux 3.7+
  -v, -vv               verbose mode
  -q, -qq               quiet mode, only show warnings/errors

Online help: <https://github.com/clowwindy/shadowsocks>
```

最简单的办法就是新建一个配置文件：

```javascript ~/.shadowconfig
{
    "server":"my_server_ip",
    "server_port":8388,
    "local_port":1080,
    "password":"barfoo!",
    "timeout":600,
    "method":"table"
}
```

记得在防火墙打开你配置的本地端口，然后运行下面的命令：

```bash
root@palm4fun-core-1:~/install# sslocal -c ~/.shadowconfig
INFO: loading config from /root/.shadowconfig
shadowsocks 2.1.0
2014-09-02 00:27:53 INFO     starting local at 127.0.0.1:1080
```


命令行更新android sdk
-------------------------

先配置java命令使用的代理，然后
从命令行更新android sdk。只需要到tools目录下面去跑(`-u`是不显示GUI，`-s`是指定不使用ssl链接)：

```bash
$ export _JAVA_OPTIONS="-DsocksProxyHost=127.0.0.1"
$ android update sdk -u -s --all
```

注意`socksProxyHost`的默认端口就是1080，如果你使用了其他端口不能只配ip。

另外，`--all`是比较猛烈的选项（人家的硬盘就是大，人家的代理就是快嘛），你可以在命令行里面通过filter来安装你需要的东西。

When shit happens
----------------------

运行起来之后更新非常慢，可以`android`命令报timeout，而代理那边打出日志：

```bash
2014-09-02 00:27:53 INFO     starting local at 127.0.0.1:1080
2014-09-02 00:28:04 INFO     connecting 74.125.237.1:80
2014-09-02 00:28:04 INFO     connecting 74.125.237.1:80
2014-09-02 00:28:04 INFO     connecting 74.125.237.1:80
```

因为本座平时上网也是在用Google VM上的这个代理，没理由这么慢。所以就怀疑那个74.125.237.1的地址是被谁在`/etc/hosts`里面给配了固定ip。打开一看果然有：

```bash
dl-ssl.google.com 74.125.237.1
```

估计是之前配置的基友搜索到了类似[这样的文章](http://www.programering.com/a/MjM4YTMwATA.html)。这也是为什么我从来不用也不推荐别人用修改hosts文件的方法来翻墙的原因：它们总是在过期。

Last but not the least, Fuck you, GFW.




