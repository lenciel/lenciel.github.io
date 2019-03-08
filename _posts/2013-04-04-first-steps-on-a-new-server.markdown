---
layout: post
title: "First steps on a new server"
date: 2013-04-04 08:44
comments: true
categories: 
- tips
- tutorials
- server
- configuration
---

一般来说，新开张的小团队不会养专职的运维和部署团队。一般服务器开发的项目组会有人兼职做这部分的事情。刚开始的时候这部分的工作量一般也不大，但是随着租用的服务器越来越多，兼职的人就会发现自己是在打上甘岭战役————坡越来越陡。

因此，一个简单而有效的标准流程是非常必要的。ZooM团队的服务器都会配置两个固定的帐号： ``root`` 和 ``deploy`` 。 ``deploy``  这个用户具有 ``sudo`` 的权限。开发人员使用deploy但是不通过用户名密码登录而是用 ``public key`` 。这样一来，只需要保证所有机器的 ``authorized_keys`` 文件同步即可。后面要做的改进是：

* 在所有机器禁止通过 root 账号进行ssh
* 在所有机器上限制可以ssh的IP范围

这样的实施方案对 ``authorized_keys`` 的保密性和正确性要求是很高的，但是在没有专门IT的时候，对我们这样的小团队基本是够用的。下面是详细的步骤：

我们拿到的第一台机器是Ubuntu的，因为 ``Gitlab`` 只有Debian的版本。后面的机器大多会是CentOS，所以使用的命令可能会稍微有调整，但是意思是不变的。

更换root密码
------------

```bash
passwd
```

可以很长很复杂（反正也不需要记得），保存在某个地方在你忘记 ``sudo`` 密码或者是不能正常 ``ssh`` 的时候能找出来用就可以了。

更新系统
--------

```bash
apt-get update
apt-get upgrade
```

安装Fail2ban
------------

```bash
apt-get install fail2ban
```

Fail2ban是一个用来监控登录尝试的 ``daemon`` ，可以有效侦测和防止可疑行为的发生。这个工具文档很全，而且出厂配置就很齐全，几乎不需要定制就能投入使用了。

添加deploy用户
-------------

```bash
useradd deploy
mkdir /home/deploy
mkdir /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
```

配置 ``public key`` 
--------------------

使用密码的日子已经慢慢过时了，这方面Github很有[贡献](https://help.github.com/categories/56/articles)。只需要：

```bash
vim /home/deploy/.ssh/authorized_keys
```

把 ``id_rsa.pub`` 的内容拷贝进去。然后：

```bash
chmod 400 /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy -R
```

当然你也可以使用 ``id_rsa.pub`` 之外的key，然后在本地的 ``~/.ssh/config`` 里面对 ``IdentityFile`` 做指定。具体方式可以查看 ``~/.ssh/config``的说明。

测试deploy用户并赋予 ``Sudo`` 权限
----------------------------------

先测试deploy是否能够正常登录，然后使用 ``root`` 账号设置密码：

```bash
passwd deploy
```

这是团队要用来 ``sudo`` 的账号，所以要弄得有意义好记一点儿。接下来：

```bash
visudo
```

注释掉所以已经存在的用户、用户组权限，然后加上：

```bash
root    ALL=(ALL) ALL
deploy  ALL=(ALL) ALL
```

锁定SSH
-------

设置ssh，禁止使用密码ssh，禁止使用 ``root`` 账号ssh。

```bash
vim /etc/ssh/sshd_config
```

添加下面的设置：

```bash
PermitRootLogin no
PasswordAuthentication no
```

如果有需要还可以限定可以ssh的ip地址：

```bash
AllowUsers deploy@(your-ip) deploy@(another-ip-if-any)
```
重启ssh：

```bash
service ssh restart
```

设置防火墙
----------

Ubuntu提供了 ``ufw``，所以只需要：

```bash
ufw allow from {your-ip} to any port 22
ufw allow 80
ufw allow 443
ufw enable
```

打开自动安全更新
--------------

虽然很多习惯好的服务器使用者会知道运行`` apt-get update/upgrade`` 但是如果服务器很多，总会有一些不那么被经常登录的机器，系统会比较陈旧。特别是做负载均衡的机器，可能很少有人登录。为了保证所有的机器都有足够的安全性需要打开自动更新（作为习惯控制一切的开发人员，自动更新总是一件让我很抗拒的事情，但是安全漏洞更让人抗拒）：

```bash
apt-get install unattended-upgrades
vim /etc/apt/apt.conf.d/10periodic
```

在文件里面修改成：

```bash
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
```

接着修改：

```bash
vim /etc/apt/apt.conf.d/50unattended-upgrades
```

修改文件成：

```bash
Unattended-Upgrade::Allowed-Origins {        
    "Ubuntu lucid-security";
    //"Ubuntu lucid-updates"; 只更新安全更新
};
```

安装Logwatch
-------------

Logwatch是一个监控你的日志并发送邮件通知的daemon。

```bash
apt-get install logwatch
vim /etc/cron.daily/00logwatch
```

在文件中添加：

```bash
/usr/sbin/logwatch --output mail --mailto lenciel@gmail.com --detail high
```

What's Next
-------------

* 使用Puppet自动化这些配置
* 在基础的配置上，把一个fresh的机器如果配置成各种形态的（Django/Web/Database/LoadBalance/...)



