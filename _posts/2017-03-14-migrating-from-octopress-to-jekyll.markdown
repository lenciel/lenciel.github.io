---
layout: post
title: "从Octopress转到纯Jekyll"
date: 2017-03-14 13:45:00 +0800
comments: true
categories:
- blog
- tools-i-use
- jekyll
- octopress
---

离开Wordpress[改用Octopress](https://lenciel.com/2013/03/blog-with-octopress-and-github-pages/)写blog已经好些年了，本座甚至还写了一个自己的[Octopress模板](https://github.com/lenciel/octopress-theme-lenciel)。之所以要迁移主要是Octopress作为以Jekyll为基础的一套脚手架，自2011年发布以后进展非常缓慢，和Jekyll的快速更新很难对齐。

在近期跳票多次的[Octopress3](http://octopress.org/2015/01/15/octopress-3.0-is-coming/)终于发布了之后，看了一下没有什么值得迁移的新功能。所以不管是从功能、性能还是开发活跃度上，继续跟Octopress都不太明智，就决定转用纯Jekyll。

迁移过程还算比较平滑，主要是：

- Blog项目的迁移
- 模板项目的迁移

## Blog项目的迁移

本座主要的开发栈不是ruby，所以那套东西都放docker。配置好gem的镜像，安装最新的jekyll之后，创建一个干净的静态网站：

``` bash
$ gem install jekyll
$ jekyll new my-site && cd my-site
```

然后把blog的源文件以及一些静态文件放到对应的目录，然后按照新老项目的`_config.yml`文件内容，挨个的排查之前的插件和配置情况。

比如之前Octopress因为有自己的代码高亮和引用插件，你的日志里面可能有`codeblock`这样的不是默认支持的tag，在`jekyll build`过程中导致构建失败。

要解决这种问题有两个思路：

1. 把Octopress的插件移植一遍
2. 把日志改成使用默认支持的语法

实际过程里面本座的做法大概是一半一半。比如像插入gist，blockquote这些现在默认也支持得挺好的功能插件，就去掉了它们，然后通过正则表达式对`_posts`目录下的文章进行全局替换。


而有些个人觉得Octopress确实解决得不错的功能，就按照[新版Jekyll插件](https://jekyllrb.com/docs/plugins/)的语法进行了迁移，这部分包括对日期的处理，图片的插入等等。

这些大体修改完毕，然后安装相应的依赖（可以对比新旧的Gemfile，只需要安装自己的插件用到的依赖），这部分改动就大概完成了。

## 模板项目的迁移

因为Jekyll自己的模板是基于gem-based的，也就是说你首先得新建一个gem-based的项目：

1. 注册[rubygems](https://rubygems.org)的账号
2. 新建项目，并按照gem的方式组织代码并发布模板
3. 在Blog项目的`_config.yml`里面引用这个模板

最终的工作就是我又多了一个gem-based的[Jekyll模板项目](https://github.com/lenciel/jekyll-lenciel-theme)。

这部分要特别注意的就是Jekyll的模板项目默认能够发布的目录（也就是包含在gemfile里面，能够被你的Blog项目在安装路径找到的目录）非常有限：

> Jekyll will look first to your site’s content before looking to the theme’s defaults for any requested file in the following folders:
>
> /assets
> /_layouts
> /_includes
> /_sass

如果你有很多其他目录希望一起发布，可以修改`gemspec`里面的相关选项：

``` ruby
spec.files = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass|LICENSE|README|index)}i) }
```

还有一点就是这种发布和安装模板的方式，会破坏很多对静态资源的处理流程（如果有的话）。

比如我自己会对图片自动压缩，对css/js文件进行合并和uglify等等。这些工作的目标文件因为很多都在gem安装的模板里面，会变得比较tricky。最终本座只好对`jekyll build`之后的`_site`目录下的部署目标文件进行处理。

## 其他

虽然放弃了Octopress，但并不是说Octopress是个失败的项目。一方面，它的完成度很高，如果你不是有本座一些龟毛的要求（要自己搞模板，要对静态文件做优化，要支持各种国内才需要支持的定制），已经够用。作者一个人要跟上Jekyll一个社区的开发速度，本来就很难，是属于可以理解的不足。并且，通过看它的插件源代码，对我自己的模板实现也起到了很大帮助。

所以，感谢Octopress引进门，用了它，折腾Jekyll就容易多了。

