---
layout: post
title: "关掉Zsh对指定命令的自动纠错"
date: 2013-07-23 14:47
comments: true
categories: 
- tips
- zsh
- shell
---

工作机器切换到Mac之后我一直在自用并在团队中推广 [`oh-my-zsh`](https://github.com/lenciel/oh-my-zsh)。99%的时间本座对它是如此满意，除开有的时候它的服务太主动了一些。

比如今天在用`curl`试用一个接口的时候，我测试用的payload放在一个`payload.json`文件里面，所以命令是：

```
curl -H "Content-Type: application/json" -X POST -d @payload.json  http://xxx.xxx.xxx/xxx/StartServiceServlet
```

然后它就一直提示：

```
zsh: correct '@payload.json' to 'payload.json' [nyae]?
```

一，直，提，示。

跑到代码里面去看了一下，要关掉这种自动纠错的提示可以配置 `~/.oh-my-zsh/lib/correction.zsh`：

```
alias curl='nocorrect curl'
```

整个世界清静了...
