---
layout: post
comments: true
title: "开启 OCSP Stapling"
date: 2020-09-28 11:50:55 +0800
categories: 

- admin
- blog

---

之前有人抱怨这个小破站打开慢。

我想我这种 lighthouse 打满分的同学，怎么可能…结果发现，是因为 Let’s Enrypt 用来做 OCSP 验证的域名被众所周知的力量污染了（目前是 `ocsp.int-x3.letsencrypt.org` 的 CName 域名 `a771.dscq.akamai.net` 受到了干扰），所以 iOS 客户端的同学都会卡几秒钟做校验。

网上有很多通过打开 [OCSP Stapling](https://en.wikipedia.org/wiki/OCSP_stapling) 来解决问题的帖子。但实际上，如果你的服务器在国内，是拿不到 OCSP Response 的。

当时我乐观地觉得，这种让所有 Let’s Encrypt 证书网站都不要玩儿的污染持续不了多久，先不管它吧。

然后三个月过去了。

所以在国内服务器上，如果你和我一样使用 nginx，只是正常开启 OCSP Stapling 的话：

```
# OSCP
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/lenciel.com/chain.pem;
```

重启 nginx 之后你用 openssl 的命令检查 OSCP Stapling 是否开启（可以用 [SSL Labs](https://www.ssllabs.com/) 但是比较慢）会看到下面的输出，表明开启失败：

```bash
$ openssl s_client -connect lenciel.com:443 -servername lenciel.com -status -tlsextdebug < /dev/null 2>&1 | grep -i "OCSP response"

OCSP response: no response sent
```

我看网上很多同学在苦苦追问为啥失败。其实不是你的配置失败，而是你的服务器的户口所在地比较失败，如果去 Nginx 的日志里面检查就会看到大量因为收不到 responder 的报错：

```
2020/09/28 11:27:39 [error] 22565#0: OCSP responder timed out (110: Connection timed out) while requesting certificate status, responder: ocsp.int-x3.letsencrypt.org, peer: 108.160.167.30:80, certificate: "/etc/letsencrypt/live/lenciel.com-0001/fullchain.pem"
2020/09/28 11:35:29 [error] 22564#0: OCSP responder timed out (110: Connection timed out) while requesting certificate status, responder: ocsp.int-x3.letsencrypt.org, peer: 108.160.167.30:80, certificate: "/etc/letsencrypt/live/lenciel.com-0001/fullchain.pem"
```

解决起来有各种办法，说白了就是要让你这台服务器正常访问到 ocsp.int-x3.letsencrypt.org。我选择了 [doh-proxy](https://pypi.org/project/doh-proxy/)。

再检查就可以看到访问成功了：

```bash
$ openssl s_client -connect lenciel.com:443 -servername lenciel.com -status -tlsextdebug < /dev/null 2>&1 | grep -i "OCSP response"
OCSP response:
OCSP Response Data:
    OCSP Response Status: successful (0x0)
    Response Type: Basic OCSP Response
```

需要注意的是，和所有缓存一样，它设置成功之后需要几次访问才会刷新，以及，它会过期…通过一些简单的脚本可以把这部分也自动化了。