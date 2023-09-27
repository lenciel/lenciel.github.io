---
layout: post
sidenote: false
title: "Mac下后台运行goagent"
date: 2013-11-14 13:22
comments: true
categories:
- tips
- goagent
- gfw
---


几年过去了，[Goagent](https://code.google.com/p/goagent/)是本座翻墙唯一的选择。在 Mac 上使用它最开始我用了[GoAgentX](https://github.com/ohdarling/GoAgentX)，但使用了一段时间之后发现几个不太满意的地方：

* 不是简单给 GoAgent 做了个界面，而是集成了多个翻墙工具，选项挺多挺乱的（可能对其他用户是一个好事）
* 每次 GoAgent 更新之后，GoAgentX 更新的时间都比较滞后
* GoAgentX 更新之后，经常无法工作，需要做这样那样的调整

但其实用 GoAgent 我们需要的无非是`python proxy.py`，有很多办法让它运行起来。本座比较喜欢的是用 tmux 把这个任务跑在一个 detach 了的 session，如果连接有问题再 attach 上去看看是什么问题。具体流程如下：

先装[tmuxinator](https://github.com/aziz/tmuxinator)，看名字不知道是不是受了 ubuntu 下面 terminator 的启发。然后新建一个项目用来跑 goagent:

```bash
$ mux new goagent
```

项目配置文件（假设你的 goagent 放在`~/bin/goagent/local`）：

```ruby
name: goagent
root: ~/bin/goagent/local


windows:
  - shell: python proxy.py
```

这样就只需要你在需要翻墙的时候`mux goagent`一下即可，detach 或者 attach 到这个 session 也非常方便。当然不使用 tmuxinator 而是直接用 shell 脚本写一堆 tmux 命令也可以达到一样的效果，用 tmuxinator 是因为本座自己还有一堆别的 Django 项目的 tmuxinator 项目。