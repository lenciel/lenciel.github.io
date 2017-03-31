---
layout: post
title: "Better Git Log"
date: 2013-06-08 23:42
comments: true
categories: 
- git
- tips
- cli
- tig
---

看烦了 `git log` 的白净输出？

![Raw git log output](/downloads/images/git_raw.png "Don't touch me...")

这个看起来如何？

![Git graph log output](/downloads/images/git_graph.png "Don't touch me...")

用起来其实很简单，只需要：

``` bash
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

这么长当然是记不住的，可以建shell的alias，也可以添加一个git alias：

``` bash
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

这样每次只需要：

```bash
git lg
```

如果你是想知道具体发生了哪些修改可以：

```bash
git lg -p
```

![Git graph log output with p](/downloads/images/git_p.png "Don't touch me...")

不过我现在更喜欢的是直接用[tig](https://github.com/jonas/tig)：

![Tig output](/downloads/images/tig.png "Don't touch me...")
