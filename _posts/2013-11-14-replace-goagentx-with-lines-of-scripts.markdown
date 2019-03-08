---
layout: post
title: "Mac下后台运行goagent"
date: 2013-11-14 13:22
comments: true
categories: 
- tips
- goagent
- gfw
---


几年过去了，[Goagent](https://code.google.com/p/goagent/)是本座翻墙唯一的选择。在Mac上使用它最开始我用了[GoAgentX](https://github.com/ohdarling/GoAgentX)，但使用了一段时间之后发现几个不太满意的地方：

* 不是简单给GoAgent做了个界面，而是集成了多个翻墙工具，选项挺多挺乱的（可能对其他用户是一个好事）
* 每次GoAgent更新之后，GoAgentX更新的时间都比较滞后
* GoAgentX更新之后，经常无法工作，需要做这样那样的调整

但其实用GoAgent我们需要的无非是`python proxy.py`，有很多办法让它运行起来。本座比较喜欢的是用tmux把这个任务跑在一个detach了的session，如果连接有问题再attach上去看看是什么问题。具体流程如下：

先装[tmuxinator](https://github.com/aziz/tmuxinator)，看名字不知道是不是受了ubuntu下面terminator的启发。然后新建一个项目用来跑goagent:

```bash
$ mux new goagent
```

项目配置文件（假设你的goagent放在`~/bin/goagent/local`）：

```ruby
name: goagent
root: ~/bin/goagent/local


windows:
  - shell: python proxy.py
```

这样就只需要你在需要翻墙的时候`mux goagent`一下即可，detach或者attach到这个session也非常方便。当然不使用tmuxinator而是直接用shell脚本写一堆tmux命令也可以达到一样的效果，用tmuxinator是因为本座自己还有一堆别的Django项目的tmuxinator项目。