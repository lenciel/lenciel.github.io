---
layout: post
comments: true
description: "...Fuck AI crawlers..."
title: "Nginx 挡爬虫"
date: 2026-01-07 00:23:49 +0800
categories: 
- blog
- tools-i-use
- nginx
- crawler
---


<h3>目录</h3>

- TOC
{:toc}

### Why

这个小破站每年服务器+CDN+SSL证书还是花了点儿钱。

其实也有些流量，但我从来没有想过要做大做强。

首先，它主要服务于我。

我活着的时候，有写点儿东西的需要。如果其他人看了有两三句产生些共鸣，那也挺好。

我死了之后，孩子们有个地方，知道我想过什么，怎么想的，比去扫墓更实在也更方便。

其次，它多少起到点儿保持和开发者世界同步的作用。

麻雀虽小，从前到后该有的都有，比如也 host 了一个 [umami](https://umami.is/){:target="_blank"} 实例做点儿轻量的统计。

因此我非常清楚，除开来自于网友们的浏览器和 RSS 阅读器，还有很多 RSS 聚合器在访问这里，抓取数据去做自己的合集（就像[这里](https://www.boyouquan.com/home){:target="_blank"}，或者[这里](https://bf.zzxworld.com/){:target="_blank"}，或者[这里](zhubai.wiki){:target="_blank"}）。

我不介意，反而挺希望这些聚合器做大做强的：毕竟，在这个短视频推送霸占注意力的年代，这些有点「古朴」的服务如果运行良好，总归好像说明点儿什么。

一年多前，爬虫的主力开始逐渐变成了各种公司的 bot。

没办法，AI 时代，最缺的其实是数据。

自己写的东西被采集拿去炼丹，绝不会有被网友看了之后共鸣的可能，所以多少让人有些不舒服。

但我一个草民，肯定没有到宫崎骏被 OpenAI 搞得那么不舒服，也就一直懒得管。

直到最近看 Rob Pike 收到一封由 AI 编写的感谢信之后[大爆粗口](https://simonwillison.net/2025/Dec/26/slop-acts-of-kindness/){:target="_blank"}：

> Fuck you people. Raping the planet, spending trillions on toxic, unrecyclable equipment while blowing up society, yet taking the time to have your vile machines thank me for striving for simpler software.
> 
> Just fuck you. Fuck you all.
> 
> I can’t remember the last time I was this angry.

可不是吗。Fuck You！

### How

#### Nginx

用 Nginx 只是因为我就用了 Nginx 来 host 博客。

看了一下， [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt){:target="_blank"} 这个项目基本上可以满足所有的需要。

##### robots.txt

robots.txt 是 Robots Exclusion Protocol ([RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html){:target="_blank"}) 的一个实现。

基本上就是告诉爬虫们在访问网站的时候应该采取什么样的规矩。

对绝大部分 AI 爬虫，显然只有一个规矩，那就是完全拒绝：

> Disallow: /

具体的写法可以参考 repo 里的[robots.txt](https://github.com/ai-robots-txt/ai.robots.txt/blob/main/robots.txt){:target="_blank"} 文件。

##### UA 拦截

由于大部分的AI 爬虫都不会按 robots.txt 里的规矩办事， repo 里还有一个 [nginx-block-ai-bots.conf](https://github.com/ai-robots-txt/ai.robots.txt/blob/main/nginx-block-ai-bots.conf){:target="_blank"} 文件。它的任务就是根据访问的 UA 来识别是不是爬虫，然后干掉它们：

```bash
set $block 0;

if ($http_user_agent ~* "(AddSearchBot|AI2Bot|AI2Bot...)") {
    set $block 1;
}

if ($request_uri = "/robots.txt") {
    set $block 0;
}

if ($block) {
    return 403;
}
```

我写了一个脚本定期去更新这个配置文件，然后在我的 blog 的 virtualhost 配置里引用它：

```conf
# nginx.conf
server {
    include /home/blog/source/ai-robots-txt/nginx.conf;
    # ... 
    # the rest of my nginx config
}
```

然后通过 curl 就可以验证对于守规矩的比如 Google搜索引擎收录网页的 bot，仍然放行：

```bash
$ curl -I -A "Googlebot" https://lenciel.com

HTTP/2 200
server: nginx/1.18.0 (Ubuntu)
date: Wed, 07 Jan 2026 00:42:35 GMT
content-type: text/html
content-length: 35753
...

```

但是对于不守规矩的就挡掉：

```bash
$ curl -I -A "Sogou web spider" https://lenciel.com

HTTP/2 403
server: nginx/1.18.0 (Ubuntu)
date: Wed, 07 Jan 2026 00:41:53 GMT
content-type: text/html
content-length: 162
```

##### 限制频率

写过爬虫都知道伪装一下 UA，所以光是从 UA 识别肯定是挡不完的，可以再结合一下对访问频次的限制，毕竟人类看和机器看的主要区别就是这个。

先声明一下：

```conf
#nginx conf http block
...
    limit_req_zone $binary_remote_addr zone=anti_spider:10m rate=5r/s;
    limit_conn_zone $binary_remote_addr zone=perip:10m;
...
```

然后在virtualhost配置中引用：

```conf
#nginx virtual host server block
...
    limit_conn perip 5;
    limit_req zone=anti_spider burst=10 nodelay;
...
```

#### fail2ban

虽然回复了一个 403， 但我每月花钱的服务器仍然被爬虫在访问，怎么办？

所以我把这些挡掉的访问拆到一个单独的日志去记录：

```conf
#nginx conf http block
...
	log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
	log_format spider '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for" [SPIDER_BLOCKED]';
        limit_req_zone $binary_remote_addr zone=anti_spider:10m rate=5r/s;
...
```

```conf
...
#nginx virtual host server block
	    access_log /var/log/nginx/spider_block.log spider if=$block;
	    access_log /var/log/nginx/lenciel.access.log main if=!$block;
	    error_log /var/log/nginx/lenciel.error.log;
...
```

很快这个 spider_block.log 就开始有数据了：

```bash
$ awk '{print $1 $12$13$14}' /var/log/nginx/spider_block.log | sort | uniq -c | sort -nr | head -n 10

      4 18.206.242.175"TerraCottahttps://github.com/CeramicTeam/CeramicTerracotta""-"
      2 82.156.203.36"Mozilla/5.0(compatible;Boyouquanspider/1.0;
      1 98.83.177.42"Mozilla/5.0AppleWebKit/537.36(KHTML,
      1 66.249.66.66"Mozilla/5.0(Linux;Android
      1 66.249.66.65"Mozilla/5.0(Linux;Android
      1 66.249.66.4"Mozilla/5.0(Linux;Android
      1 66.249.66.43"Mozilla/5.0(Linux;Android
      1 66.249.66.43"Mozilla/5.0AppleWebKit/537.36(KHTML,
      1 66.249.66.204"Mozilla/5.0AppleWebKit/537.36(KHTML,
      1 65.21.113.201"Mozilla/5.0(compatible;AwarioBot/1.0;
```

把这个文件作为输入给到 fail2ban：

```conf

#/etc/fail2ban/jail.local
...

[nginx-spider]
enabled = true
filter = nginx-spider
logpath = /var/log/nginx/spider_block.log
maxretry = 1
action = iptables-allports[name=nginx-spider, chain=INPUT]
```

声明的 filter 需要配置一下：

```conf

#/etc/fail2ban/filter.d/nginx-spider.conf

[Definition]
failregex = ^<HOST> -.*\[SPIDER_BLOCKED\]$
ignoreregex = 192.168.1.1 10.0.0.1
```

重启服务之后就可以看到 nginx-spider 在工作了：

```bash

$ systemctl restart fail2ban

$ fail2ban-client status nginx-spider
Status for the jail: nginx-spider
|- Filter
|  |- Currently failed:	0
|  |- Total failed:	24
|  `- File list:	/var/log/nginx/spider_block.log
`- Actions
   |- Currently banned:	24
   |- Total banned:	24
   `- Banned IP list:	18.206.242.175 107.22.208.39 222.189.173.253 54.204.12.115 34.203.111.15 82.156.203.36 66.249.66.43 114.119.136.109 223.109.211.219 123.182.49.58 106.8.138.96 220.181.108.110 114.119.138.235 106.8.139.2 114.119.135.232 44.193.102.198 23.23.103.31 66.249.66.66 114.119.134.146 114.119.148.160 106.8.139.14 110.249.201.178 223.109.211.198 114.119.150.190 66.249.66.65 114.119.155.205 106.8.130.121 123.182.48.123 223.109.211.172 49.86.41.90 223.109.207.80
```

Again, Fuck AI crawlers...
