---
layout: post
title: "Boxen introduction"
date: 2013-03-31 08:28
comments: true
categories: 
- tool
- osx
- tutorial
---

如果列举开发人员在工作中最讨厌的部分，估计搭建开发环境得票率肯定可以排进前三。年初Github开源了自己内部的Privision框架[Boxen](http://boxen.github.com/)，趁着新笔记本需要起轿，尝试了一把。

Boxen框架简介
----------------

Boxen基于大红大紫的[Puppet](https://puppetlabs.com/)，但和后者目前主要侧重于服务器的Privision不同，Boxen更主要是用于组织内工作人员使用的机器的配置和管理流程标准化。

配置流程标准化比较好理解：拿到一台机器，敲一个命令就把所有需要的软件装上并且把环境配置好。按Boxen主页上的说法，Github新员工入职后领到电脑后，用Boxen配置环境到开始写代码只需要30分钟。

管理流程标准化听起来比较抽象，你可以想象这么一个场景：如果公司里面所有的机器都是是用Boxen来配置的。当发现Chrome浏览器的Java插件会导致安全问题的时候，IT部门可以push一个禁用Chrome里Java插件的change到boxen repo。所有的员工只需要和repo做一次sync，自己的Chrome里的Java插件就被禁用了。这显然比传统的发邮件要求大家去禁用Chrome浏览器Java插件简单有效。

简单地概括Boxen的思路，就是像对待产品一样对待开发环境。使用包括版本控制，持续集成这些手段，在团队中维护一个开发环境的仓库。如果你想更深入地了解Boxen的设计哲学，可以看看这个slide：[BOXEN by Will Farrington](https://speakerdeck.com/wfarr/boxen)。

使用Boxen
---------

首先确保你的初始环境是干净的：

* 如果你手上是台新机器，它是干净的
* 如果不是一台新机器，请先备份，然后：

    - 卸载Homebrew
    - 删除所有的 ``dotfiles`` 和 ``vimfiles`` ，比如[Oh my zsh](https://github.com/robbyrussell/oh-my-zsh)或者[spf13 vim](https://github.com/spf13/spf13-vim)等
    - 删除 ``.rbenv`` 或者 ``.rvm`` 文件夹
    - ``chsh -s /bin/bash`` 把SHELL改回 ``bash``

接下来就是安装一些必须的软件，比如Git和Xcode的 ``Command Line Tools``。

###Xcode CLT###

* 升级Xcode
* 启动Xcode，在Preferences里面选择下载
* 安装"Command Line Tools"

![Xcode Command Line Tools](/downloads/images/xcode_clt.png "Don't touch me...")

###打开FireVault2###

Boxen默认会希望硬盘信息是被加密的：

![Turn on FireVault2](/downloads/images/turn_on_fire_vault.png "Don't touch me...")

###Fork our-boxen###

[our-boxen](https://github.com/boxen/our-boxen)是Boxen提供的基线repo，也是整个Boxen框架里面文档最全的一个repo。

首先按照repo说明中的方式来clone和配置本地repo：

``` bash
sudo mkdir -p /opt/boxen    
sudo chown ${USER}:admin /opt/boxen    
git clone https://github.com/boxen/our-boxen /opt/boxen/repo    
cd /opt/boxen/repo    
git remote rm origin    
git remote add origin     
git push -u origin master
```

这种clone下来再配置origin的方式类似于fork，区别是fork下来的repo一定是public的，而这样得到的repo可以是private的。可以想象如果你使用boxen来完成对公司电脑的配置，多少都会有一些敏感信息在repo里面，所以private的repo是非常必要的。

接下来在 ``/opt/boxen/repo`` 路径下运行 ``script/boxen`` 即可完成boxen默认的模块的安装。默认的模块定义在 `` /opt/boxen/repo/Puppetfile`` 中：

``` ruby
github "dnsmasq",  "1.0.0"
github "gcc",      "1.0.0"
github "git",      "1.0.0"
github "homebrew", "1.0.0"
github "hub",      "1.0.0"
github "inifile",  "0.9.0", :repo => "cprice-puppet/puppetlabs-inifile"
github "nginx",    "1.0.0"
github "nodejs",   "1.0.0"
github "nvm",      "1.0.0"
github "ruby",     "1.0.0"
github "stdlib",   "3.0.0", :repo => "puppetlabs/puppetlabs-stdlib"
github "sudo",     "1.0.0"
```

可以看到Github大量用到 ``ruby`` 和 ``nodejs`` 。在运行boxen的时候，可能会看到大量的警告信息：

```
Warning: Could not retrieve fact fqdn
Warning: Host is missing hostname and/or domain: suttlemac
```

然后伴随着 ``https://rubygems.org`` 失败。这些主要是因为GFW，你可以使用镜像，比如淘宝的。具体方式可以[查看这里](http://ruby.taobao.org/)。

注意你还应该把下面的脚本加到 ``~/.bashrc`` 或者 ``~/.zshrc`` :

``` bash
[ -f /opt/boxen/env.sh ] && source /opt/boxen/env.sh
```

然后新开一个shell运行 ``boxen --env``，结果一切正常你的box就配置完毕了。

自定义你的box
------------

默认安装的内容当然不一定对你的口味，如果你用过Puppet那么自定义Boxen的box是非常简单的。不过埋头开干之前还是可以check一下是不是已经[有人做好了](https://github.com/boxen)。这些做好的repo可以直接通过修改配置文件是用，因为Boxen对librarian-puppet做了wrapper，对fetch各种module也做了wrapper。

比如我们要安装Chrome和Skype，打开 ``/opt/boxen/repo/Puppetfile`` 并添加两行：

``` ruby
...
github "sudo",     "1.0.0"

# Add new modules
github "skype",    "1.0.2"
github "chrome",   "1.1.0"
```

这里安装的module的声明规则是 ``github "{name}", "{version}"``。 其中 ``name`` 的取法是在 ``Puppetfile`` 里面定义的：

``` ruby
def github(name, version, options = nil)
  options ||= {}
  options[:repo] ||= "boxen/puppet-#{name}"
  mod name, version, :github_tarball => options[:repo]
end
```

因此[puppet-skype](https://github.com/boxen/puppet-skype)对应的就是 ``skype`` 。

而 ``version`` 则是对应具体repo的tag，比如[puppet-skype](https://github.com/boxen/puppet-skype)对应的[tag](https://github.com/boxen/puppet-skype/tags)有：

![Version and tags](/downloads/images/version_tag.png "Don't touch me...")

如果你的repo不是在github也很简单，只需要指定repo的位置即可。比如如果你自己的Skype是放在Bitbucket上的:

``` ruby
   mod "skype", :git => "git@bitbucket.org:yourusername/puppet-skype.git" 
```

在 ``Puppetfile`` 里面完成的声明主要是让Boxen（实际上是Puppet）知道去哪里找安装和配置文件。要告诉Boxen安装Skype还需要在 ``manifests/site.pp`` 里面 ``include`` 需要安装的module：

``` ruby
...    
    node default {      
        include dnsmasq      
        include ruby      
        include git      
        include hub      
        include homebrew      
        include skype    
    }
...
```

接下来只需要运行 ``boxen`` (如果你运行了 ``boxen --env`` 命令会在可执行路径里)或者是 ``boxen --debug`` (如果你需要更多的verbose信息)，指定的软件就安装上了。

What's Next
------------

目前为止主要是解释了如何使用Boxen来安装一些基本软件。目前本座机器上使用Boxen安装的软件包括：


``` ruby
github "ccleaner", "1.0.1"
github "iterm2",   "1.0.2"
github "skype",    "1.0.2"
github "chrome",   "1.1.0"
github "sublime_text_2",   "1.1.0"
github "jumpcut",   "1.0.0"
```

接下来的计划就是建立项目组自己的repo，把诸如输入法、dotfiles、Java开发环境和Django开发环境这些东西的安装和配置都自动化了。

