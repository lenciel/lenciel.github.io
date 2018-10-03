---
layout: post
title: "修复无法获取IP的MBP"
date: 2018-08-20 03:47:41 +0800
comments: true
categories: 

- mac
- tips
- self-assigned-ip
- firewall
- mDNSResponder

---

周末在家，掏出电脑要干活，发现机器关机了。

用mbp的人都知道，这机器基本上不用关，合上就走，打开就用。

用mbp的人也知道，这机器有时候你打开发现它关过，再开就行。

结果这次不太一样，连上wifi之后，分配了一个`169.254.175.53`的所谓`self-assigned`的IP。这个IP应该是苹果设计来在没有网络连接的情况下ad-hoc的。

立马把有线连上试了一下，排除是wifi的问题。结果一样：

![Vhost threshold](/downloads/images/2018_08/oops_self_assigned_ip.jpg "Don't touch me...")

当时其他设备都跑得很欢畅，路由器也设置了正确的DHCP方式，所以是本机的问题无疑了。Google了一下，发现官网有一个[十页的帖子](https://discussions.apple.com/message/10753369#10753369)，充满了血泪，但是没有解决方案。

然后发现还有很多别的帖子里有各种招数，比如更新DHCP Lease的，把网卡删了加上的，把上网的profile删了重加的，清空NVRAM/SMC的，重装系统的...

Hmmmm，重装系统...懒如狗的先tcpdump了一下网卡，问问它究竟是怎么想的：

``` bash
$ sudo tcpdump -i en0

11:10:18.118413 IP 172.16.95.124.bootps > 10.250.115.106.bootpc: BOOTP/DHCP, Reply, length 333
11:10:26.417237 IP 0.0.0.0.bootpc > 255.255.255.255.bootps: BOOTP/DHCP, Request from 8c:85:90:d1:82:a7 (oui Unknown), length 300
11:10:26.440460 IP 172.16.95.123.bootps > 10.250.113.2.bootpc: BOOTP/DHCP, Reply, length 333
11:10:26.440470 IP 172.16.95.124.bootps > 10.250.115.106.bootpc: BOOTP/DHCP, Reply, length 333
11:10:34.744781 IP 0.0.0.0.bootpc > 255.255.255.255.bootps: BOOTP/DHCP, Request from 8c:85:90:d1:82:a7 (oui Unknown), length 300
11:10:34.806267 IP 172.16.95.123.bootps > 10.250.113.2.bootpc: BOOTP/DHCP, Reply, length 333
11:10:34.806276 IP 172.16.95.124.bootps > 10.250.115.106.bootpc: BOOTP/DHCP, Reply, length 333
11:10:43.396784 IP 0.0.0.0.bootpc > 255.255.255.255.bootps: BOOTP/DHCP, Request from 8c:85:90:d1:82:a7 (oui Unknown), length 300
11:10:43.421706 IP 172.16.95.124.bootps > 10.250.115.106.bootpc: BOOTP/DHCP, Reply, length 333
11:10:43.421717 IP 172.16.95.123.bootps > 10.250.113.2.bootpc: BOOTP/DHCP, Reply, length 333
11:10:53.557959 ARP, Announcement 10.250.112.1, length 46
11:11:31.367397 IP 169.254.175.53.mdns > 224.0.0.251.mdns: 0 [18q] PTR (QM)? _raop._tcp.local. PTR (QM)? _airplay._tcp.local. PTR (QM)? _airport._tcp.local. PTR (QM)? _uscans._tcp.local. PTR (QM)? _ipp._tcp.local. PTR (QM)? _uscan._tcp.local. PTR (QM)? _ippusb._tcp.local. PTR (QM)? _scanner._tcp.local. PTR (QM)? _ipps._tcp.local. PTR (QM)? _printer._tcp.local. PTR (QM)? _pdl-datastream._tcp.local. PTR (QM)? _ptp._tcp.local. PTR (QM)? _companion-link._tcp.local. PTR (QM)? _afpovertcp._tcp.local. PTR (QM)? _smb._tcp.local. PTR (QM)? _rfb._tcp.local. PTR (QM)? _adisk._tcp.local. PTR (QM)? _sleep-proxy._udp.local. (290)
```

可以看到路由器分配了IP给机器，甚至还有[mDNS](https://en.wikipedia.org/wiki/Multicast_DNS)的查询发出，然后就没有反应了。

查了一下苹果分配给OS[预装应用的端口](https://support.apple.com/en-us/HT202944)，找到DHCP的端口是68和69，mDNS的端口是5353，check了一下，端口都在工作。

于是怀疑是防火墙的问题，关闭防火墙之后果然就好了。但是关着防火墙裸奔也不太好，于是本座把防火墙的配置文件`/Library/Preferences/com.apple.alf.plist`直接删了重启，这样会让防火墙恢复到原始配置。

重新开机怪事来了，弹了8个窗问我要不要放行，都是configd、netbiosd、mDNSResponder这类的，不知道MBP的同学是不是这个版本搞出bug了，这些系统应用需要手动放行。试了一下，放行前果然DHCP不能（估计是configd和mDNSResponder），放行后就可以。

值得吐槽的是Mac[推出SIP](https://support.apple.com/en-us/HT204899)之后，找个问题麻烦到不行。比如防火墙，默认是没有日志的 ，就算你敲[一堆命令](https://discussions.apple.com/thread/7849608)下去，拿到的也是个空文件。而它的配置界面上，又很大方的把绝大多数系统应用的设置隐藏了（默认勾选了通通放行），同时又很鬼畜地显示着里面的一两个（比如netbiosd和rapportd）：

![Vhost threshold](/downloads/images/2018_08/mac_firewall_1.jpg "Don't touch me...")

最后，我饶有兴致地查了一下防火墙突然抽风的原因，苹果的说法是：

> While configuration changes from migrating or restoring a system can lead to this problem, at other times major system crashes or power outages can do the same.​

所以，电脑上的防火墙还是能关的都关了吧，真需要的话，路由器那边下配置要靠谱得多。