---
layout: post
comments: true
description: "...老规矩，各位朋友可以帮忙测试一下，如果有问题请给我留言或者邮件，谢谢😄~..."
title: "真的有了搜索"
date: 2024-12-01 10:13:55 +0800
categories: 

- admin
- blog
- tools-i-use
- search
---

本站一直有个小秘密，就是右上角的那个搜索框其实是假的：无论你搜什么，我都会带你去看那个卖萌的 [404 页面](/404){:target="_blank"}。

这是因为前面[有说过](/2023/09/support-side-note/){:target="_blank"}，为了保持一点前端开发的体感，本站从一开张，不管是 Jekyll 模板（[它](https://github.com/lenciel/jekyll-lenciel-theme){:target="_blank"}居然得到了我持续地更新）还是编译部署脚本（[它](https://github.com/lenciel/lenciel.github.io/blob/source/Rakefile){:target="_blank"}也已经是个颇为壮观的 Rakefile 了）都是手搓的。而当时尝试了一下 Lunr 等方案后，感觉把任何支持中文分词的本地搜索整合进这套工作流实在是太麻烦，于是铤而走险，行骗至今。

随着文章数量的增加（更可能是记忆力衰退），本座常常需要借助 Google 的索引来找到某个我「好像写过的东西」。加上最近看到 [pagefind](https://pagefind.app/){:target="_blank"} 似乎颇为可用{% sidenote 'sn-id-1' '因为我发现 xkcd 使用了它作为搜索的[解决方案](https://xkcd.pagefind.app/){:target="_blank"}。' %}，这个周末就尝试了一下。

Pagefind 的 slogan 是「static low-bandwidth search at scale」，从试用的情况看，它基本上做到了。当然，要把它集成进来还是要花点功夫。

首先，需要安装一个 `extended` 版本，来支持中文。

然后，默认索引出来的日志标题都是错的（会变成网站名），需要按照文档[里面说的](https://pagefind.app/docs/ui-usage/#overriding-the-title-or-image-of-a-result){:target="_blank"}做一下 override，比如我是在 `post/page` 模板里加上 metadata：

```      
<h1 class="entry-title" data-pagefind-meta="title">...</h1>
```

同时，为了让 Pagefind 不去索引标签页等特殊页面，我还设了一些全局配置给它：

```
force_language: cn
site: _site
glob: "*[!s]/**/*.{html}"
exclude_selectors:
  - "#links"
  - "#recent-posts"
  - "footer"
```

最后，因为 Pagefind 默认提供的是一个搜索页面，而我是一个搜索框，所以我需要把查询词提交和结果显示的逻辑和页面拆开。

当然，这些都是在本地的工作。根据发布方式的不同，往往还需要在工作流里面增加相应的任务。比如我是在 Rakefile 里面再增加一个任务，在发布之前调用：

```ruby
desc "Build Pagefind Index"
task :build_pagefind do
  puts "## Building Pagefind Index"
  system("pagefind_extended")
end
```

老规矩，各位朋友可以帮忙测试一下，如果有问题请给我留言或者邮件，谢谢😄~
