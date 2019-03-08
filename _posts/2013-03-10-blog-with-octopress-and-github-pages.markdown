---
layout: post
title: "Blog with Octopress and Github pages"
date: 2013-03-10 22:15
comments: true
categories:
- github
- octopress
- blog
---

不知不觉，写blog好像从有电脑的人都要干的事情变成很小众的活动了。除了人到了一定年纪都会不愿意开口讲话之外，本座觉得还有个很大的原因就是：要找一个靠谱的blog服务商是非常麻烦的。岂止是是blog服务商，在天朝使用大多数web服务都很吊诡地只有两个选择：

* 没有被墙但很糟的；
* 很不错但被墙了的；

所以虽然知道[Github](http://github.com)可以免费host任何静态页面很久了，眼看着[Octopress](http://octopress.org/)也日益成熟，但一直都下定决心去试：谁知道哪天Github又被墙了呢？

不过，在最近自己的职业生涯发生了不小的变化，在可预见的未来，肯定要做很多跟code有关的笔记。[现在的blog](http://lenciel.com)系统是wordpress，虽然非常好用，但是比起markdown来说，写起code来速度就差太多了。所以今天下定决心试了一把Octopress+Github Pages，效果非常满意，特别记录一下过程，像大家做个推荐。

Jekyll&Octopress
----------------

[Octopress](http://octopress.org/)是在[Jekyll](https://github.com/mojombo/jekyll)基础上进行的开发。[Jekyll](https://github.com/mojombo/jekyll)作为Ruby开发的静态页面blog系统，吸引本座的地方在于：

* **静态页面**：由于Jekyll生成的都是静态页面，意味着这些页面可以在任何地方被host，比如Github Pages，Google Drive甚至是Dropbox都可以作为选择（当然它们也基本是被墙的）。
* **Markdown**：Jekyll的日志因为是用Markdown写的，相比传统的Blog系统如Wordpress而言，一方面在写的时候可以用你顺手的编辑器，另一方面储存和版本管理也方便得多。
* **代码插入方便美观**：Octopress对日志中嵌入代码提供了[各种方便](http://octopress.org/docs/blogging/code/)。

Mac下的安装设置过程
-----------------

###Xcode###

* 升级Xcode
* 启动Xcode，在Preferences里面选择下载
* 安装"Command Line Tools"

###Homebrew###

``` bash
brew update
brew outdated|xargs brew install
brew tap homebrew/dupes
brew install apple-gcc42 git
brew upgrade
```

###rbenv###

首先如果你本来是用rvm，需要删除：

``` ruby
rvm implode
```

然后安装rbenv以及Ruby1.9.3-p194:

``` bash
brew install rbenv
brew install ruby-build
eval "$(rbenv init -)"
rbenv install 1.9.3-p194
rbenv global 1.9.3-p194
```

安装完毕之后需要在你的环境变量中做一些设置，比如本座用的是oh-my-zsh，就需要在`~/.zshrc`里面加上：

``` bash
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"
# required for https://github.com/imathis/octopress/issues/144
export LC_CTYPE=en_US.UTF-8
export LANG=en_US.UTF-8
```

注意在环境变量设置完毕之后，最好把`$PATH`打出来看看，确保没有其他版本的Ruby被启用了，特别要注意`/Users/***/.gem/ruby/***/bin`这样的路径。

安装Octopress
-------------

首选在Github上创建一个repo来放blog，命名规则是username.github.com（比如本座的就是lenciel.github.com）。

然后在本地建立一个repo把octopress弄下来：

``` bash
git clone git://github.com/imathis/octopress.git lenciel.github.com
cd lenciel.github.com
ruby --version # should read ruby 1.9.3p194 (2012-04-20 revision 35410) [x86_64-darwin12.2.0]
gem install bundler
rbenv rehash
```

然后部署到刚才申请的repo上面去。虽然[Github Pages](http://pages.github.com/)自己有个废柴说明页面，但是看完之后一般你是不知道如何算是部署成功的。好在Octopress已经内建了交互式的配置和部署的命令：

``` ruby
rake setup_github_pages
# Example repo url: git@github.com:lenciel/lenciel.github.com
rake install
rake generate && rake deploy
```

然后你需要调整一下`.git/config`文件把自己的项目设置成新的origin：

```
[core]
  repositoryformatversion = 0
  filemode = true
  bare = false
  logallrefupdates = true
  ignorecase = true
[remote "origin"]
  fetch = +refs/heads/*:refs/remotes/origin/*
  url = git@github.com:lenciel/lenciel.github.com
[remote "octopress"]
  url = git://github.com/imathis/octopress.git
  fetch = +refs/heads/*:refs/remotes/octopress/*
[branch "master"]
  remote = origin
  merge = refs/heads/master
```

这样一来，你就即可以从`octopress/master`取到更新，又可以往`origin/master`去push自己最新的日志了。

使用Octopress
-------------

###新建文章###

``` 
rake new_post\["Blog with Octopress and Github Pages"\]
```

这里要注意使用zsh的时候，对`[]`要转义成`\[\]`不然会报错。

###编辑文章###

```
subl source/_posts/2013-03-10-blog-with-octopress-and-github-pages.markdown
```

subl是本座在mac上使用的编辑器`Sublime Text 2`的命令行命令，它的markdown插件`Markdown Editing`和`OmniMarkupPreview`非常好用。

####Markdown Editing####

[Markdown Editing](http://ttscoff.github.com/MarkdownEditing/)对语法高亮，粘贴超链接，样式化，加footnote等都做了很好的支持：

![Sublime with Markdown Editing](/downloads/images/sublime_with_markdown_editing.png "Don't touch me...")

####OmniMarkupPreview####

OmniMarkupPreview支持`Cmd+Alt+O`在你指定的浏览器里面预览并且动态刷新你正在编辑的Markup文档。这样你就可以不用不停的`rake preview`了。

###更多###

* [Octopress官方文档](http://octopress.org/docs/)
* [Markdown语法ref](http://daringfireball.net/projects/markdown/)
* [如何使用repo里面的图片](https://github.com/imathis/octopress/issues/701#issuecomment-7664070)



