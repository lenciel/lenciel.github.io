---
layout: post
title: "Use Kaleidoscope as code review tool"
date: 2013-04-14 20:57
comments: true
categories:
- tools
- tips
---

个人觉得Mac上最好用的文件/文件夹比较工具应该就是Kaleidoscope了。在它的[新版本](http://kaleidoscopeapp.com/beta)中新增了 ``KSReview`` 功能，比较有用。

举个常见的场景：如果 ``master`` 分支下有两个人lenciel和ming在做事。如果ming的事情先做完，代码上了master分支。这个时候lenciel做diff的时候，因为主分支的文件已经发生过变化，那么我们diff的结果哪些是自己的开发分支与主分支的差异哪些是ming引入的，就要靠“人工智能”来肉身体察了。

而 ``KSReview`` 会只收集开发者自己的开发分支和主分支之间的差异，过滤掉无关的信息，这样改动就非常清晰了。它的安装方便，只需要在命令行里面敲入：

``` bash
git config --global alias.ksreview '!f() { local SHA=${1:-HEAD}; local BRANCH=${2:-master}; if [ $SHA == $BRANCH ]; then SHA=HEAD; fi; git difftool -y -t Kaleidoscope $BRANCH...$SHA; }; f'
```

安装完毕之后就可以用下面的命令来做diff了：

``` bash
git ksreview feature-branch-name-or-sha mainline-branch-name
```
