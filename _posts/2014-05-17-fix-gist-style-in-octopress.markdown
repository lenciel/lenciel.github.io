---
layout: post
title: "Octopress里插入带中文Gist的问题和解决"
date: 2014-05-17 13:00:38 +0800
comments: true
categories: 
- octopress
- gist
- tips
---

[Gist](https://gist.github.com/)是Github提供用来管理和分享[代码片断](https://gist.github.com/lenciel/4105165)或者[文档片断](https://gist.github.com/lenciel/3462897)的服务。和传统的[snippet](http://en.wikipedia.org/wiki/Snippet_(programming))管理系统相比，Gist因为实际上依托了Github的实现技术，所以具有存储在云端、自动的版本化、语法高亮支持的语言种类齐全、分享的便利性高等等优势。

[Octopress](http://octopress.org)里面引用你创建的gist的好处是显而易见的：你需要分享的**内容**在Gist那边被更好的管理了，而在日志里面用下面这样的语句就可以很容易的插入gist里面的内容:
{% raw %}
<div class="highlight"><pre><code class="text">{% gist gist_id [filename] %}
</code></pre></div>
{% endraw %}

比如[上篇文章](http://lenciel.com/2014/05/web-development-skill-set-and-reading-list/)，理论上源代码就是这么一句：

{% raw %}
<div class="highlight"><pre><code class="text">{% gist lenciel/637812a7dcbe8341b07b web_skill_list.md %}
</code></pre></div>
{% endraw %}

当然之所以说理论上，是因为首先Octopress的markdown插件对unicode的支持[是有bug](http://tokkonopapa.github.io/blog/2013/02/23/octopress-toc/)的。所以直接插入带中文的gist在build的时候会看到`Liquid Exception`:

```bash
>>> Compass is watching for changes. Press Ctrl-C to Stop.
Liquid Exception: incompatible character encodings: UTF-8 and ASCII-8BIT in 2014-05-16-web-development-skill-set-and-reading-list.markdown
```

解决起来也很简单，只需要在`lib/jekyll/converters/markdown.rb`里面强制设定encoding就可以了：

```diff lib/jekyll/converters/markdown.rb
@@ -120,7 +120,7 @@ def convert(content)
           rd = RDiscount.new(content, *@rdiscount_extensions)
           html = rd.to_html
           if rd.generate_toc and html.include?(@config['rdiscount']['toc_token'])
-            html.gsub!(@config['rdiscount']['toc_token'], rd.toc_content)
+            html.gsub!(@config['rdiscount']['toc_token'], rd.toc_content.force_encoding('utf-8'))
           end
```

接下来就是render出来的效果，样子丑到让人无法直视：

![original gist render output](/downloads/images/2014_05/gist_render_output_orig.jpg "Don't touch me...")

大概看了一下Octopress的文档，原来代码片断的样式（包括gist的渲染样式）都在[_syntax.scss](https://github.com/imathis/octopress/blob/master/.themes/classic/sass/partials/_syntax.scss)里面。这个文件2012年就没有更新过了，但是github的gist输出在2013年有过变化，所以就有些不匹配了。

打开自己的模板，大概调了一下这个sass，主要是和其他的代码高亮一致：

![current gist render output](/downloads/images/2014_05/gist_render_output.jpg "Don't touch me...")

调整的地方见[这里](https://gist.github.com/lenciel/ecc8b3805ed346727abe):

```diff _sass/partials/_syntax.scss
diff --git a/46501e4:sass/partials/_syntax.scss b/02b0441:sass/partials/_syntax.scss
index 137d475..5465286 100644
--- a/46501e4:sass/partials/_syntax.scss
+++ b/02b0441:sass/partials/_syntax.scss
@@ -22,10 +22,6 @@
   @include border-radius(0);
 }
 
-.line-data {
-   font-size: 13px;
-}
-
 figure.code, .gist-file, pre {
   @include box-shadow(rgba(#000, .06) 0 0 10px);
   .highlight pre { @include box-shadow(none); }
@@ -43,10 +39,8 @@ html .gist .gist-file {
     margin-bottom: 0;
   }
   .gist-syntax {
-    background: #01222d !important;
-    color: #d5dee2 !important;
-    padding: 0 2em;
     border-bottom: 0 !important;
+    background: none !important;
     .gist-highlight {
       background: $base03 !important;
     }
@@ -57,17 +51,15 @@ html .gist .gist-file {
   }
   .gist-meta {
    padding: .6em 0.8em;
+   border: 1px solid lighten($base02, 2) !important;
+   color: $base01;
    font-size: .7em !important;
    @if $solarized == light {
-     color: $base01;
-     border: 1px solid lighten($base02, 2) !important;
      background: lighten($base03, 2) $noise-bg;
      border: 1px solid $pre-border !important;
      border-top: 1px solid lighten($base03, 2) !important;
    } @else {
-     background: #01222d $noise-bg;
-     text-shadow: none !important;
-     color: #d5dee2;
+     background: $base02 $noise-bg;
    }
    @extend .sans;
    line-height: 1.5em;
@@ -77,7 +69,7 @@ html .gist .gist-file {
       &:hover { color: $base1 !important; }
     }
     a[href*='#file'] {
-      position: absolute; top: 0; left:0; right:0px;
+      position: absolute; top: 0; left:0; right:-10px;
       color: #474747 !important;
       @extend .code-title;
       &:hover { color: $link-color !important; }
@@ -221,7 +213,7 @@ pre, .highlight, .gist-highlight {
   &::-webkit-scrollbar-thumb:horizontal { background: $solar-scroll-thumb;  -webkit-border-radius: 4px; border-radius: 4px }
 }
 
-.highlight code {
+.highlight code { 
   @extend .pre-code; background: #000;
 }
 figure.code {
@@ -267,11 +259,3 @@ figure.code {
   text-shadow: #cbcccc 0 1px 0;
   padding-left: 3em;
 }
-
-.gist-file {
-  font-size:.8em !important;
-}
-
-table.lines{
-  width: 100%;
-}
```

