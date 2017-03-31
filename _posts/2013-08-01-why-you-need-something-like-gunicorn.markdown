---
layout: post
title: "uWSGI, Gunincorn, 啥玩意儿?"
date: 2013-08-01 14:36
comments: true
categories:
- notes
- server
- gunicorn
- wsgi
- uwsgi
- django
---

因为nginx等优秀的开源项目，有不少本来不是做服务器的同学也可以写很多服务器端的程序了。但是在聊天中会发现，大家虽然写了不少代码，但是对wsgi是什么，gunicorn是什么，反向代理又是什么并不了解，也就是说对基本概念并没有一个全局的了解。

### 服务器

到了服务器组你会发现原来有各种各样的服务器，那些叫法很多是有历史沉淀的，不需要太深究能对上号就行，因为本来也是乱七八糟的。

#### HTTP服务器

如果网站是HTML/CSS/JS（不包括node.js这种[SSJS](http://en.wikipedia.org/wiki/Comparison_of_server-side_JavaScript_solutions)）组成的，那么这是一个静态的网站。

用户访问这个网站的时候，HTTP请求被浏览器发送，经过DNS等被送到网站的服务器。服务器处理HTTP请求，将浏览器能够处理的响应返回给用户的浏览器。所以这个场景下的服务器一般被称为HTTP服务器，常见的有Apache的httpd和Nginx。

#### Application服务器

如果你的网站是动态的，比如是用Django写的。

那么客户端上来的请求要能够被Djano的Application处理。WSGI就是这样的[一个协议](http://en.wikipedia.org/wiki/Web_Server_Gateway_Interface)：它是一个Python程序和用户请求之间的接口。WSGI服务器的作用就是接受并分析用户的请求，调用相应的python对象完成对请求的处理，然后返回相应的结果。

WSGI服务器的选择很多，包括uWSGI和gunicorn。它们都可以处理所有的请求，包括确实应该由python对象处理的，也包括不该python对象处理的，比如静态的图像，css，js等文件。所以理论上你可以把整个动态网站都用WSGI服务器承载起来，也就是整个应用完全跑在Application服务器上。

#### 代理服务器

代理无非是A来做B干的事情。在服务器语境下，代理就是一台服务器干另外一台服务器的事情。这个是平常不会有很多人聊到的，多说两句。

##### 前向代理服务器

大多数的代理都是前向代理。假设网络上有三台机器:

* X：你的电脑
* Y：代理服务器，proxy.eg.org
* Z：你实际想访问的服务器，www.eg.org

没有代理的情况下，访问是 `X--->Z`，但是在某些情况下，访问者会先让代理服务器从实际放内容的服务器把数据取回来，也就是`X--->Y`，然后`Y---->Z`，最后`X---->Y` 。

这里说的某些情况下典型的包括（作为天朝网民你居然没有领悟我很失望）：

X的网络管理员封了Z

* Z可能是一个臭名昭著的病毒网站：`familypostcard2008.com`等
* Z可能是一个让你上班精力分散的网站：`Facebook.com`等
* Z可能是一个让你明白真相的网站：Hmmmm

Z的网络管理员封了X

* Z可能是一个论坛或者blog什么的，X在对它进行扫描

##### 反向代理服务器

没有代理的情况下，访问仍然是 `X--->Z`，但是在某些情况下，Z的管理者决定限制资源被直接访问。用户必须现在Y上做访问，Y再访问Z。整个流程是`X--->Y`，然后`Y---->Z`，最后`X---->Y` 。

没错，细心的你注意到了，前向和反向代理服务器的流程都是`X-->Y-->Z`。没办法，代理就是这么个意思。它们两者的核心区别在于，用户对反向代理服务器的存在是无感的。换句话说，X不需要做特别的配置甚至不需要察觉Y的存在，就可以使用Y这个反向代理。这种请求方无感而被请求方反过来提供代理服务就是“反向”的意义所在。

使用反向代理的典型场景当然是Z希望所有发给自己特定请求都从Y过一遍：

1. Z可能是一个超大的网站，每天有全世界各地的用户在访问。于是Z搭建了一个反向代理，把某个地域的用户的访问导入到离他最近的服务器上去处理。没有错，这就是CDN。
2. Z可能是一个坏坏的网站。它的拥有者希望把坏坏的数据放到特定的服务器，然后核心数据放到别的服务器。比如黄色网站，一般那些色情的内容放在一些专门的服务器上，即使被查封，也不会对其业务产生决定性的影响。

继续我们前面的例子，很快你会发现uWSGI等应用服务器处理静态文件的请求的performance很废材，于是开始寻找直接用nginx来处理静态内容的办法。那么你就需要区分哪些请求是请求的静态页面，哪些是请求的动态内容。

然后你就会发现，原来nginx不止是一个HTTP服务器，它还是一个[反向代理服务器](http://en.wikipedia.org/wiki/Reverse_proxy)：它可以把请求重定向到uWSGI或者任何别的服务器，然后把下游服务器的响应集成再返回给用户。于是你就可以配置对静态内容的请求直接在nginx完成，而动态内容的请求发送给uWSGI服务器。

#### 负载均衡服务器

在我自己的心中，负责均衡服务器不过是反向代理的一种（你看CDN我也觉得是反向代理的一种），但是很多地方这种服务器是被拿出来专门讨论的。

随着你的网站访问量不断增大，你用一个nginx集中所有的请求再分发就显得性能不够了。这个时候你可以配置专门用于进行请求分发处理的负载均衡服务器，比如[HAProxy](http://haproxy.1wt.eu/)，而负载均衡服务器背后是集群。

#### 缓存服务器

随着网站访问量的继续增大，你的VPS流量又扛不住了。你调查发现有一些多媒体文件被经常请求，这个时候你部署了缓存服务器。

"缓存"这个经常被提到的术语，核心就是把常用的信息放在一个读取成本很低地方(比如内存中或者是虚拟内存中），从而避免每次查找它的时候昂贵的操作。比如HTTP缓存解决的是在服务器上找信息的过程，而Redis或者Memcached这些缓存则是解决在数据库里面找信息的过程。

### 那，我们为什么需要uwsgi或者gunicorn?

一句话：因为你需要有东西在服务器上运行Python，但是Python不是处理所有的请求都很强。

那么是选uWSGI还是Gunicorn？我觉得都可以，还是那句老话，不是它们好不好的问题，是你够不够好的问题，毕竟代码都摆在那里的。

不过Gunicorn可以多说几句。它的崛起在我看来是有时代背景的：在过去，我们部署一个应用的时候，几乎总是要分布在多台机器的（比如4台HTTP服务器把动态请求分发到两台Application服务器上，并且它们都访问一个数据库服务器）。但是随着机器的能力在增强，而互联网应用的覆盖面从业务逻辑极其复杂的银行业电信业到了送盒饭选泡面的小行业，越来越多的Application服务器和Web服务器合体了（以django圈子举例，有httpd+mod_wsgi或者Nginx+mod_uwsgi）。而且很多时候这种小应用的数据库也host在同一台机器上。

Gunicorn（从Ruby下面的Unicorn得到的启发）应运而生：依赖Nginx的代理行为，同Nginx进行功能上的分离。由于不需要直接处理用户来的请求（都被Nginx先处理），Gunicorn不需要完成相关的功能，其内部逻辑非常简单：接受从Nginx来的动态请求，处理完之后返回给Nginx，由后者返回给用户。

由于功能定位很明确，Gunicorn得以用纯Python开发：大大缩短了开发时间的同时，性能上也不会很掉链子。同时，它也可以配合Nginx的代理之外的别的Proxy模块工作，其配置也相应比较简单。

配置上的简单，大概是它流行的最大的原因。

### Good Refs

#### 正向代理服务器软件

- [cgi-proxy](http://www.jmarshall.com/tools/cgiproxy/)
- [phproxy](http://sourceforge.net/projects/poxy) (中断了)
- [glype](http://www.glype.com/)
- [Internet censorship wiki: List of Web Proxies](http://en.cship.org/wiki/Category%3aWebproxy)

#### 反向代理服务器软件

- [apache mod_proxy](http://wiki.apache.org/cocoon/ApacheModProxy)
- [squid](http://www.squid-cache.org/)
- [HAProxy](http://nginx.net/)
- [perlbal](http://www.danga.com/perlbal/)
- [portfusion](http://portfusion.sf.net/)
- [pound](http://www.apsis.ch/pound/)

#### TCP上的反向代理服务器软件

- [balance](http://www.inlab.de/balance.html)
- [delegate](http://www.delegate.org/delegate/nvproxy/)
- [pen](http://siag.nu/pen/)
- [portfusion](http://portfusion.sf.net/)
- [pure load balancer](http://web.archive.org/web/20080113185334/http://plb.sunsite.dk/index.html)
- [python director](http://pythondirector.sourceforge.net/)

#### 其他

- [Wikipedia - Content Delivery Network](http://en.wikipedia.org/wiki/Content_Delivery_Network)
- [Wikipedia - Category:Reverse_proxy](http://en.wikipedia.org/wiki/Category%3aReverse_proxy)
- [Wikipedia - Load Balancing](http://en.wikipedia.org/wiki/Load_balancing_%28computing%29)
- [Wikipedia - Scalability](http://en.wikipedia.org/wiki/Scalability)

