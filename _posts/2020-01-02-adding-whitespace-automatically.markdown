---
layout: post
title: "用 textlint 自动排版"
date: 2020-01-02 14:16:59 +0800
comments: true
categories: 

- tips
- tools-i-use
---

作为一名工程师，平时写的大部分文档都会有中英文的混排。

中文文档的排版本来就有很多的[讲究](https://github.com/mzlogin/chinese-copywriting-guidelines)。

当中英文混排的时候，一个主要却挺有门槛的讲究是要用空格对中英文进行隔断。

正确：

>我们接下来会使用 SLI/SLO 进行关键路径的指标梳理。

错误：

>我们接下来会使用SLI/SLO进行关键路径的指标梳理。

很多人会嫌这样的要求太龟毛，但 [pangu.js](https://github.com/vinta/pangu.js) 的作者 vinta 有句话说得好：

>「有研究顯示，打字的時候不喜歡在中文和英文之間加空格的人，感情路都走得很辛苦，有七成的比例會在 34 歲的時候跟自己不愛的人結婚，而其餘三成的人最後只能把遺產留給自己的貓。畢竟愛情跟書寫都需要適時地留白。」

打算好好做人了吧？

但确实挺有门槛，即使强迫症如本座，每次输入英文的时候要手工隔断也觉得很烦。

一方面，写一篇文档得多敲几百次空格；一方面，思路也感觉遭到了隔断。

考虑到这个普遍存在的问题，国产输入法大多数都提供自动敲空格的功能。

但国产输入法我都不太敢用，哪怕是 MAC 版。

最近吐槽这个问题的时候稍微研究了一下，发现有个日本友人写了一个 npm 包叫 textlint。

安装之后，你就可以安装并配置一系列的[规则包](https://github.com/textlint/textlint/wiki/Collection-of-textlint-rule)。

目前主要的规则包都是日语和英文的，非常复杂，简单用用可以先从下面的入手：

- 检查感叹号使用
- 检查空格使用
- 检查句子太长（需要配置阈值）
- 检查顿号、逗号太多（需要配置阈值）
- 检查错别字（需要配字典）
- 检查错拼术语（需要自己建术语库）

我先安装了空格检查的规则：

```
npm install textlint-rule-ja-space-between-half-and-full-width --global
```

然后在文档的根目录做一下初始化：

```
textlint --init
```

这会生成一个`textlint.rc`的文件，修改它的内容为：

```
{
  "filters": {},
      "rules": {
          "ja-space-between-half-and-full-width": {
          "space": "always"
        }
      }
}
```

这样，对目录下的一些或者特定文档就可以运行`textlint`命令来进行扫描了。

```
textlint .

_posts/2020-01-02-adding-whitespace-automatically.markdown
  26:66  ✓ error  原則として、全角文字と半角文字の間にスペースを入れます。  ja-space-between-half-and-full-width
  26:71  ✓ error  原則として、全角文字と半角文字の間にスペースを入れます。  ja-space-between-half-and-full-width

✖ 2 problems (2 errors, 0 warnings)
✓ 2 fixable problems.
Try to run: $ textlint --fix [file]
```

正如末尾一行的友情提示所说，textlint 妙就妙在提供了`fix`开关进行自动修正。

因为是用 iA Writer 作为 Markdown 编辑器，所以本座自定义了一个快捷键，对当前 iA Writer 应用里最前台（其实就是正在编辑）的文档，调用 textlint 扫描然后自动修复：

```
source_file=$(osascript -e 'tell application "iA Writer" to set filepath to file of document 1' -e 'POSIX path of filepath')
textlint $source_file
textlint --fix $source_file
```
