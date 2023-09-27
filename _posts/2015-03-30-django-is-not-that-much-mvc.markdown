---
layout: post
sidenote: false
title: "Django其实不是MVC"
date: 2015-03-30 11:36:24 +0800
comments: true
categories:

- django
- thoughts

---


![Vhost threshold](/downloads/images/2015_03/mvc.jpg --alt Don't touch me)

很多时候[Django](https://www.djangoproject.com/)都被称为是一个 MVC 框架 — `Model-View-Controller`。这样说的人要么就是已经熟悉过其他的 MVC 框架，所以看到 Django 有自己的 Template 系统和`views.py`来放各种逻辑代码，就想当然的认为 Django 也是；要么就是其实没有真正实践过 Django，从各种其他的错误文档里面看到或者是听说的。

MVC 框架，是针对`状态`的。为了明白这个，我们假设你是在编辑一个图片：

- 你得在内存里面保存这张图片 (Model)
- 你得在屏幕上显示这张图片 (View)
- 你得有办法让用户改变图片 (Controller)
- 当用户改变图片后，你得更新显示：`Controller`通知`Model`更新状态，然后`Model`通知`View`刷新显示（最好是通过某种 pub/sub 机制，让 View 和 Model 之间是没有耦合的)

MVC 框架主要是管理状态，让 MVC 三者是同步的：这三部分同时在内存（可能跑在不同的线程甚至进程）里，有各自的状态，相互之间进行交互，让变动同步到各方。

Django 的`Model-View-Template`有很大的不同。

首先是没有状态。大多数的 HTTP GET 请求，拿到的数据库里面的数据，都被当成是 immutable 的不可重入的输入，而没有状态。而在一般的 Web 应用开发中，HTTP 上有状态的交互可以通过：

1. 修改保存在服务器端数据库里的数据
2. 修改保存在客户端的数据（比如 cookies）

共同来完成。因此一次状态的变化并不是在一个 page 的 view 里面保持的：状态一半放在当前的 page 和 cookies 里面，一半放在 session 数据库里面。

但是处理 HTTP 请求的时候，Django 的 MVT 是完全无状态的。这里首先要说明的是，`views.py`这个名字本身是有一点儿误导的，因为给人的感觉是它只做"读"操作而不去"写"数据库（也就是说只是处理 GET 请求而不是 POST 请求）。但实际上`GET/POST`请求都会被放在`views.py`里面处理，所以更好的名字其实应该是`handler.py`：大多数 Django 的 REST 框架都是这样命名的。

处理 GET 请求的时候，如前面分析，本身就没有状态，而只是对输入的请求和服务器返回的数据进行展示。其次，当涉及数据修改的 POST 请求时，Django 的处理其实是非常类似于老式的 Web 应用的。

所谓的老式的 Web 应用是指，过去的网站上当后台的数据发生变化的时候，其实是需要用户在前端自己点击刷新按钮来刷新的（最典型的刷新按钮就是浏览器里面那个刷新按钮）。这个动作背后发生的事情其实是：

1. 除开标识当前是哪个用户在浏览哪部分数据的信息（当前的 url，用户的 identity 等等 cookies 里面的数据），把浏览器里面其他的状态都丢弃
2. 发起一个全新的请求，获取所有的数据，再次重建页面

说 Django 和老派的 Web 应用类似，是指一旦数据变更（比如一次 SQL 的 INSERT 或者是 UPDATE），你需要返回一个 redirect 再做一次 GET："有数据的状态变化了，让我们重头再来一次"。

这也是为什么[Django的ORM里面是没有一个"identity mapper"的](https://code.djangoproject.com/ticket/17)。`Model`处理状态变化的办法就是完全的无视它：当你觉得数据改变了时，直接重新获取一次数据重建页面。

这和大多数经典的 MVC 框架（比如 AngularJS）是和这完全相反的套路：在设计上做了很多事情来避免"从头再来"，而是通过建立 MVC 之间的消息机制，来通知各方的状态变化，做到同步。

MVC 还有一部分是关于如何分隔代码。如果你把 MVC 当成："把存储数据，显示数据和处理数据的代码分离"，那 Django 的设计的确是符合这个模式的。

但是实际上这是一个粒度非常粗的描述，因此就把 Django 说成是 MVC 的其实会带来很多误会。

比如，Django 是基于 HTTP 的，所以理解它的 MVT，最好的办法就是实践它：看它的`view`里面是如何处理一个 HTTP 的请求并返回一个 HTTP 的 response。如果你脑子里面有其他的不是基于 HTTP 这层次的 MVC 框架，用来类比学习 Django，你大概会哭...

其次，Django 的框架，它的 app 里面文件的组织和使用，和很多别的 MVC 框架也是不同的。

最近有个特别火的日志是 Hynek Schlawack 的[Know Your Models](https://hynek.me/articles/know-your-models/)。它是基于经典的 MVC 框架来假设，实际上 Django 并不是适用于这套假设的。

比如他觉得应该有`pure`的 models，从而把 M、V、C 分离开做到可以独立进行处理。

但其实 Django 里面很多 app 都仅仅是数据库的简单 wrapper。这种情况下其实没必要有`pure`的 M，然后再加上一堆 V 和 C。其实这是 Django 的美好之处：以`admin`这个 app 为例，它的设计初衷就是要在数据库上面封装一个足够简单的编辑层，以致于 95%的代码都是可以自动生成的。

把`Model`通过 API 暴露出来给`View`用，当然也是正确的思路。但我自己写代码的时候，就很喜欢把所有的直接调用`.filter()`的代码都放到`models.py`里面，这样一来`models.py`就是独立可测的。

并且，如果你写了一个`pure`的 Model，而把逻辑代码从 Model 里面抽取出来放到别的地方去，那你在`admin`和其他`ModelForms`里面就没法重用了。

总的来说，在 Django 里面，model 在创建的时候，就是有业务逻辑贯穿在里面的。如果你每个`customer`只能有一个`email`，那么你的 model 就得包含这个限制。如果你要改变这个规则，那么就不仅仅是 MVT 的某一方要改，而是从上到下都得修改。

甚至我个人认为 MVC 里面说的"逻辑和数据分离"这种思路本来就挺奇怪的。除非你把数据存储当成`key-value`这样的东西，那么你怎么可能在一个不是为了某个业务逻辑设计的数据库上开发出一个应用呢？

数据就是数据，是`gloabl data`而不是`gloabal state`。在整个 HTTP 请求被处理的过程中，它被认为是没有变化的：如果有，就应该再发一条请求来取最新的数据再去重画。

当我们开发 Django 的应用时，为了满足实际上的业务逻辑的需要，数据库的 schema 一般一直在变。这样 Django 的 model 就可以作为 API 的一个良好的基石，把往上走的事情做得尽量简单。

这涉及到软件开发里最基本的一个设计要点：你把数据库仅仅当成应用里面的持久化层，还是当成应用的一部分，甚至是最重要的一部分。

我其实一直偏向于后者：喂，把像 Postgres 这样 RDMS 当成一个持久层未免也太不尊重了吧！所以在使用 Django 设计 app 的时候，不但要思考"model layer"，还要综合考虑其他数据库可以做的事情：比如 contraint checking, transactions, triggers 等等。同样，在测试的时候也不仅仅是测试那些字段和 model 之间的关系，而是要考虑对业务逻辑的测试。
