---
layout: post
title: "tmux: Introduction and Tips"
date: 2013-07-21 14:02
comments: true
categories: 
- tmux
- tools-i-use
- tips
- tutorials
---

![tmux screenshot 1](/downloads/images/tmux_tips_1.png "Don't touch me...")

### **简介**

``tmux`` ,其实就是 ``terminal multiplexer`` 的简称。使用tmux你可以把多个任务同时运行起来，使用不同的 ``tmux`` 窗口来查看它们。你也可以 ``detach`` 一个 ``session``，也就是让一个窗口的活动，比如编译这种耗时你又不希望断开的活动，放到后台去运行。如果你使用过 ``screen`` 对 ``detach`` 一个 ``session`` 应该非常熟悉。其实初用 ``tmux`` 的时候，它很大程度上就像一个 ``GNU-Session`` 外加很多窗口管理的功能。而且由于 ``tmux`` 使用了 ``client-server`` 架构，我们可以在一个总控的地方去操作所有的窗口和pannel，甚至可以在一个窗口里面切换不同的 ``session``。

#### **tmux的安装**

用你的Linux package manager或者如果你和我一样在OSX可以用`brew`。另外，iTerm2[集成了](http://code.google.com/p/iterm2/wiki/TmuxIntegration)对`tmux`的支持，它也是很多Mac上的[程序员](http://tangledhelix.com/blog/2012/04/28/iterm2-keymaps-for-tmux/)最爱的Terminal。

#### **创建一个具名的Session**

由于使用 ``tmux`` 可以在一个电脑上创建多个 ``session`` ，为了更好的管理它们我们一般可以使用名字来辨识这些 ``session`` 。
比如下面的命令可以创建一个叫 ``basic`` 的 ``session``：

```bash
$ tmux -new -s basic
```

回车之后就会进入一个新的 `session` 里面。可以看到具名的`session`的`terminal`和正常打开`iTerm2`大致相同，没有特别之处。
这个时候我们敲`exit`就会回到原来的`terminal`中去。

#### **Detaching 和 Attaching**

使用`tmux`一大好处就是我们可以启动`terminal`，运行一个任务在后台，然后`detach`这个`session`。如果在一般的`session`里面工作，一旦我们关闭了窗口，跑在里面的所有程序都会被退出。
但是如果是使用了`detach`，我们可以再`attach`回去。下面演示一个例子。

在创建的具名`session` “basic”里面运行`top`，然后使用`Ctrl-b + d`来`detach`这个`session`。

首先来学习一下`Ctrl+b`这样的`Command Prefix`。因为`tmux`是一个terminal管家，我们需要有一个办法告诉`tmux`我们敲击的是需要`tmux`处理的命令还是传给terminal的。如果定义了`Ctrl-b`为命令前缀，就是说我们一定要先敲这个前缀，然后执行一个命令，比如`d`，表示我们要`detach`。要记住前缀输入之后要松开手，不要在不松手的情况下发命令给`tmux`。

由于这个前缀是可以自定义的，所以后面我们记为`Prefix`而不再用`Ctrl-b`。

然后我们可以使用下面的命令对`session`进行`list`、`attach`和`delete`：

```bash
$ tmux ls
0: 1 windows (created Thu Sep 27 10:16:16 2012) [121x22]
basic: 1 windows (created Thu Sep 27 14:32:50 2012) [122x22]
```

可以看到目前有两个存活的`session`，一个是刚刚创建的`basic`

```bash
$ tmux kill-session -t 0
```

杀掉我们不需要的那个

```bash
$ tmux ls
basic: 1 windows (created Thu Sep 27 14:32:50 2012) [122x22]
```

再次attach的时候可以不带`-t`，因为只有`basic`这个`session`还活着。

```bash
$ tmux attach
```

后面我们可以看到在session之间进行切换还有更多更方便的办法。

#### **窗口**

很多时候我们都需要打开窗口运行多个任务。这种情况比较适用于`tmux`的窗口概念：用起来和现代操作系统里面的`tab`类似。

新建一个窗口很容易

```bash
tmux new -s windows -n shell
``` 

`-s`是对`session`进行命名的，`-n`是用来对窗口进行命名的。

- 在当前的`session`里面新建一个窗口: `Prefix+C`
- 要给窗口命名：`Prefix+`
- 在已有的窗口间跳转： `Prefix+n/Prefix+p`
- 窗口较多的时候跳转： `Prefix+序列号`
- 要关掉窗口： `exit`或者`Prefix+&`
- 要搜索窗口：`Prefix+f`或者 `Prefix+w`

#### **分栏**

- 竖分: `Prefix+%`
- 横分: `Prefix+"`   
- 在分栏中切换: `Prefix+o`   
- 在分栏中切换: `Prefix+方向键`
- 在不同的布局间切换: `Prefix+space`
- 关闭: `Prefix+x`

#### **命令行模式**

`Prefix+:`

#### **取得所有的快捷键**

`Prefix+?`


二、配置tmux

首先在系统设置里面把`CapsLock`这枚废材按键map成`ctrl`。然后是把Prefix配置成`ctrl+a`而不是`ctrl+b`，这样主要是为了按起来方便顺手。

另外可以让窗口的序列号从1开始分配，这样初始窗口不会是0，那个你需要手伸很远才能按到的键。

```bash
set -g base-index 1
``` 

同理分栏的序列号也可以从1开始：

```bash
setw -g pane-base-index 1
``` 

另外一般需要把发送命令的延迟设置为没延迟

```bash
set -sg escape-time 1
``` 

完整的配置文件在[这里](https://github.com/lenciel/oh-my-zsh/blob/master/dot_files/tmux.conf)：

{% include_code tmux.conf lang:bash %}
