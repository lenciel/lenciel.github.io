---
layout: post
title: "使用paramiko进行ssh工作"
date: 2009-04-23 00:37
comments: true
categories: 
-  python
-  ssh
-  cli
-  paramiko
---

最近在单位写一个自动build的小工具。因为clearcase的`setview`命令实际上是激活一个新的`shell`，所以用简单的“串通”`shell`的脚本很难做到。

因为在邮件组里面看到有同样问题的Matt说用`paramiko`解决了问题，就试了试，过程还颇有点艰辛。

首先，`paramiko`没有直接的`msi`或者`exe`版本给`Windows`用户下载，而是需要在本地进行编译。而且`python`的`easy_install`工具在Vista下面会报错，所以至少花了十几分钟才算安装完毕。

结果在用test.py验证安装的时候就报错了，说什么：

```python
paramiko.SSHException: No suitable address
```

安装是我自己一步步弄得，难道搞错了？只好照着demo写了一个sftp的脚本，发现是可以跑的，干。

只好丢了封信给邮件组，然后自己开始找是啥问题。丢给邮件组的信至今没有回音（人气不行啊，`paramiko`），问题还是找到了。原来是1.7.5的`paramiko`增加了对ipv6的支持，结果引入了错误。更新了`client.py`后重新编译就可以用了。

最后，虽然demo的例子也挺多，但是好像没有说清楚怎么用invoke_shell和get_pty以及照例奉上一段代码。

{% include_code paramiko_sample.py lang:python %}

