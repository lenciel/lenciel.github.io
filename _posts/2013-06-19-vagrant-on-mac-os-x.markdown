---
layout: post
sidenote: false
title: "Vagrant for Django I: Basic"
date: 2013-06-19 15:19
comments: true
categories:
-  tools
-  tips
-  tutorials
-  vagrant
-  django
---

Vagrant[最近支持了VMWare](http://www.vagrantup.com/vmware)，但是要钱的东西我们玩不起。本系列主要分享一下 Vagrant+VirtualBox 搭配起来如何使用。

安装VirtualBox
---------------

VirtualBox 是 Oracle 的动态创建、可配置、可移植的轻量虚拟机系统。在 Windows、MacOSX、Linux 和 Solaris 上都发行了相应版本。

目前 Vagrant 支持的是 VirtualBox4.0.x、4.1.x 和 4.2.x 版本

```bash
http://www.virtualbox.org/wiki/Downloads
```

安装Vagrant
------------

```bash
http://downloads.vagrantup.com/
```

Windows 和 Mac OS X 下面安装完毕后要把 `vagrant` 命令放到 `PATH` 下面，而其他系统下面需要把整个 `/opt/vagrant/bin` 放到 PATH 下面。
完成后可以先安装一个 32 位的 ubuntu10.04 版本来测试一下：

```bash
vagrant box add lucid32 http://files.vagrantup.com/lucid32.box
vagrant init lucid32
vagrant up
```

Vagrant的好处
------------

软件开发，特别是 Web 应用的开发正处于环境异常复杂的年代。为了在开发和实际部署的环境直接做到无缝切换，虚拟化技术被大规模的使用。与此同时，自动的配置管理，如 `Chef` 或者 `Puppet` 也在发挥着巨大的作用。Vagrant 就是在这些技术的基础上进行了集成，从而完成（虚拟化+自动配置管理）的效果。

*对个人开发者*

对于开发者来说要想使用一个开发环境应付所有的开发任务变得非常困难了。每个项目都有自己独特的依赖，如类库，消息队列，数据库，框架等等。每个依赖也常常有版本上的差异。Vagrant 提供了方便，可以为每个项目创建独立的开发环境，并且只在项目需要的时候把这些环境运行起来。

*对项目组*

同一个项目组的组员理论上都是有相同的开发环境的：同样的依赖，每个依赖都是同样的版本，采用同样的配置等等。但是现实往往不是这样。比如采用了 ORM 框架的 Django，同一个项目组可能有人用着 `sqlite3` ，有人用 `mysql` 。而且每个人自己开发环境中服务器的配置也常常是不同的。这种异构的环境往往最终会带来大大小小的麻烦。Vagrant 提供了一个方便，让大家都被强制的使用统一的开发环境。

*对公司*

如果管理过大型项目，你就知道新人和新设计的引入往往是非常大的考验。大量的环境搭建工作，都可以由 Vagrant 来代替。并且 Vagrant 的配置只需要写一次，然后分发给大家用就行了，省掉了大量的时间。

Vagrant可执行文件
----------------

Vagrant 安装好之后，主要是通过命令行使用。 `vagrant` 命令带很多子命令，如 `vagrant up` ， `vagrant ssh` ， `vagrant package` 等等。敲 `vagrant` 就可以看到有哪些可用的命令。

Vagrantfile配置文件
------------------

`Vagrantfile` 对于 Vagrant 就像 `Makefile` 对 Make 的作用一样：它被放置在每个 Vagrant 项目的根目录，用来配置 Vagrant 以及它创建的虚拟机的行为。一个最简单的配置文件如下：

```ruby
Vagrant:Config.run do |config|
     # setup the box
     config.vim.box="my_box"
end
```

可以看到，`Vagrantfile` 是用标准的 Ruby 代码写成的。需要注意的是在大版本之间` Vagrantfile` 是不兼容的。

基本setup
---------

首选创建项目目录，然后在项目目录中初始化：

```bash
mkdir vagrant_guide
cd vagrant_guide
vagrant init
```

init 命令会创建一个基本的 Vagrantfile，暂时先不修改它。下一篇我们来看如何添加 Django 开发需要的配置以及如果 build 一个 `base box` 来给其他人使用。
