---
layout: post
title: "HTTPS WHAT?"
date: 2013-09-10 13:28
comments: true
categories: 
---

最近NSA相关话题很火。很多IT从业者都知道，HTTPS可以保护用户敏感的数据，但是说起HTTPS _到底_ 是如何工作的，其实心里并不清楚。

使用HTTPS之后，数据是如何被保护的？Client和Server之间如果有人在hacking，HTTPS建立的连接凭什么就是安全的？什么是安全证书？为什么有时候我们需要付钱才能买到一个？

### A Series of Tubes

当你访问网页的时候，你发出的请求其实要翻越各种网关走很长的路，这一路上都可能有妖魔鬼怪在等着搞你，的数据。

![A series of tubes](/downloads/images/series_of_tubes.png "Don't touch me…")


一般我们访问网页的时候，请求使用的是HTTP，也就是Client和Server之间的数据是明文传送的。[HTTP没有使用任何加密的原因有很多][3]:

  * 加密会消耗更多的计算能力
  * 加密会消耗更多的带宽
  * 加密破坏了Cache

当然，还有一个很多开发组织羞于承认的原因，加密增加了开发的难度。但是，只要是负责任的Web应用开发者，都不会让你的密码等关键信息以明文的方式传来传去。

### Transport Layer Security (TLS)

TLS作为SSL的前驱协议，常常被用来实现对HTTP连接的加密（比如用来实现HTTPS）。TLS是传输层的，因此在[OSI模型][4]里面比HTTP更底层，换句话说，在HTTP连接之前，先要进行TLS连接的建立。

TLS是一种混合型的加密系统，也就是说它使用了多种加密技术体系，比如：

> **Public Key Cryptography** 
>
> **Symmetric Key Cryptography** 

### Public Key Encryption

`Public Key Encryption`使用公钥私钥进行加密解密：通信中的各方都有一对公钥私钥。明文信息用公钥加密成密文，密文用私钥解密成明文。

这种加密系统理想之处在于，在一个公开的没有加密的连接中，可以迅速地为之前互不相干的通信双方建立起一个加密了的连接。

当一条消息被加密成密文之后，**只能使用**加密用的公钥对应的私钥才能解密。这些钥匙的命名也体现了它们的使用场景：公钥可以被公开，但是私钥一定要收好。

以CS架构的系统为例，Client和Server都可以使用自己的私钥，只要在session中双方都认可所谓的`shared secret key`。这样即使有人监听了Client和Server之间的通信，他也没法知道Client或者Server的私钥，同时也不知道session的密钥。

这是怎么做到的? 数学!

#### Diffie-Hellman

这种交换通常使用所谓的[Diffie-Hellman密钥交换流程][5]。这套流程主要是让Client和Server之间生成一个`shared secret key`。

假设Alice和Bob在做DH交换（不是Desperate Housewife），他们会先明文共享一个 `root`值 (一般是2、3或者5这样的整数)和一个大质数 (300%2B位整数)。

如前所述，Alice和Bob还有自己的私钥(100%2B位的整数)，他们不能告诉对方私钥，而是通过双方共享的`root`和大质数计算出一个`mixture`：

> Alice的mixture = (root的Alice私钥值次方) % 大质数
> Bob的mixture   = (root的Bob私钥值次方) % 大质数

注意这里的%是模运算

计算出`mixture`之后，Alice和Bob就把这个结果发送给对方，然后继续如下的计算：

> Alice这边：(Bob的mixture的Alice私钥值次方) % 大质数
> Bob这边：(Alice的Bob私钥值次方) % 大质数

这样在Bob和Alice两边独立计算，但得出的结果却是一致的：这就是`shared secret`了。可以看到这个流程的设计非常注意信息的保护：整个过程中双方没有交换自己的私钥，最后得到的`shared secret`也没在网络上发送。

对数学计算不感冒的同学，下面这张Wikipedia的配图非常直观：

![Diffie-Hellman Key Exchange][6]

从图里可以看到，双方一开始共享的黄色，在最后生成了共享的褐色，而这期间交换的只有被称为`mixture`的中间产物：即使有人监听并拿到，也无所谓。

### Symmetric Key Encryption

前面说的这种流程每个session只用在初始化连接的时候发生一次。一旦生成了`shared secret`，Client和Server之间就可以使用[symmetric-key加密系统][7]了。

这种使用`shared secret`的加密通信会涉及一系列的[cipher suite][8]，也就是一系列的加密算法。

### 认证

Diffie-Hellman密钥交换流程没有解决认证的问题。这就好比我们拿起电话跟朋友打过去，先进行了DH交换，这样这次通话是其他人没法破解的。但是如果其实对方根本就不是朋友，那么还是白加密了。

为了解决认证的问题，我们需要 [Public Key Infrastructure][9] 来确保对方是我们要通信的对象。这些infrastructure用来创建，管理，发放和注销签名证书：没错，就是你花钱买了才能让你的网站可以使用HTTPS的可恶的证书。

证书是什么东西？为什么它可以让通信更安全？

### 证书

粗略地说，证书就是一个使用数字签名把机器的公钥和身份进行绑定的文件，来防止有人把自己的公钥亮出来冒充他人身份。在实际操作中，身份主要是通过域名来体现。

大多数的web浏览器都会检查证书有没有使用可信的`Certificate Authority`或者说`CA`授权的签名。CA在授权之前，会进行人工检查，看证书申请者是否:

  1. 实际存在的人或者组织
  2. 对自己声称的身份，比如域名，有所有权

一旦授权签名，就说明认定证书所有者的身份和它提供的公钥是绑定的。

我们的浏览器都会添加一堆可信的CA证书，而如果访问的服务器不能返回可信的CA证书，浏览器就会提示用户。换句话说，即使一个恶意网站生成了绑定自己机器公钥的证书声称自己是facebook.com，因为这个证书不是可信CA的，浏览器也不会相信它。


**增强型证书**

除开一般的`X.509`证书，还有一种[增强型证书][11]提供一种更强的身份校验。

要申请这种证书CA会进行更细致的检查，比如要求提供使用域名的账单等。一旦使用了这种证书，在有的浏览器工具栏上可以看到站点是绿色的。

**一个服务器多个站点**

一般如果多个网站使用同一个服务器来部署会使用`named virtual hosts`。但由于TLS握手发生在HTTP连接建立之前，所以可能会造出 [问题][12]。

因此如果你的网站需要HTTPS，空间提供者都会要求你租用独立IP的服务器。

—

最后，Wikipedia是研究这种东西的好去处, 也可以看看 [Coursera的这个课程][13] 。

   [2]: http://blog.hartleybrody.com/wp-content/uploads/2013/07/series-of-tubes.png
   [3]: http://security.stackexchange.com/a/18861/4327
   [4]: http://en.wikipedia.org/wiki/OSI_model#Examples
   [5]: http://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange
   [6]: http://blog.hartleybrody.com/wp-content/uploads/2013/07/Diffie-Hellman_Key_Exchange.png
   [7]: http://en.wikipedia.org/wiki/Symmetric-key_cryptography
   [8]: http://en.wikipedia.org/wiki/Cipher_suite
   [9]: http://en.wikipedia.org/wiki/Public_key_infrastructure
   [10]: http://blog.hartleybrody.com/wp-content/uploads/2013/07/https-security-warning.gif
   [11]: http://en.wikipedia.org/wiki/Extended_validation
   [12]: http://en.wikipedia.org/wiki/Transport_Layer_Security#Support_for_name-based_virtual_servers
   [13]: https://www.coursera.org/course/crypto
   [14]: http://security.stackexchange.com/
   [15]: https://news.ycombinator.com/item?id=6100626
   [16]: http://www.gravatar.com/avatar/0b3ac738e74f7fbda25fca0f754b0aad?s=100
   [17]: http://marketingforhackers.com/
   [18]: http://blog.hartleybrody.com/guide-to-web-scraping/
   [19]: http://blog.hartleybrody.com/https-certificates/javascript:void(0);
  