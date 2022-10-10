---
layout: post
comments: true
description: "我们经常需要批量化重命名文件。其实在 zsh 里面内置了一个 zmv 工具，很适合用来干这个事情。本文结合我怎么处理下载回来的电影，讲讲 zmv 怎么使用。"
title: "用 zmv 批量重命名文件"
date: 2022-10-08 14:09:59 +0800
categories: 

- cli
- tools-i-use

---

我看电影主要靠下载[^1]。

这些年，好的电影网站越来越少：因为版权管得严了，似乎没啥好抱怨的。

还在经营的，很多都会在压片子的时候，加点儿自己的广告，顺道改改文件名：都要吃饭嘛，似乎也没啥好抱怨的。

但我每次要去看电影的时候，无论电脑还是投影仪，就经常陷入下图所示的「我究竟下了些什么」的迷茫中：

![finder_sample.jpg](/downloads/images/2022_10/finder_sample.jpg --alt Don't touch me...)

因为[我用 zsh](/2013/07/stop-specific-zsh-shell-auto-correct/)，所以就拿它自带的 zmv 来解决这个问题。

### 加载zmv

首先你需要加载这个命令：

```bash
$ which zmv
zmv not found
$ autoload -Uz zmv
$ which zmv
zmv () {
        # undefined
        builtin autoload -X
}
```

这里的 `undefined` 看起来可能有点吓人，但其实在 zsh 的 [autoloading functions](https://zsh.sourceforge.io/Doc/Release/Functions.html#Autoloading-Functions) 里这是很常见的 annotation。

如果你想让它常驻可以：

```bash
$ vi $HOME/.zshenv
autoload zmv
```

### 基础改名

zmv 的基础语法是：

```bash
zmv 'input_pattern' 'output_pattern'
```

举个例子，处理照片的时候我们经常要遍历整个目录和子目录，把所有的 `JPEG` 后缀的文件改成 `jpeg`。用 zmv 你只需要[^2]：

```bash
$ zmv -n -W '**/*.JPEG' '**/*.jpeg'
```

而如果是生写 bash 你大概需要：

```bash
$ for file in **/*.JPEG; do mv $file ${file/.JPEG/.jpeg}; done; 
```


### pattern/group

要解决我遇到的问题，当然可以使用粗暴点儿的办法，比如去掉开头的 8 个字符：

```bash
$ zmv -n '*' '$f[9,-1]'
```

但实际上，zmv 真正强大在于它支持匹配和分组：需要注意的是，虽然声明 group 也是用括号，但它用的不是正则而是[glob](https://en.wikipedia.org/wiki/Glob_(programming))。

比如你想去掉文件里面所有的`[]`起来的前缀，可以写成：

```bash
$ zmv -n '\[*\](*).(mkv|mp4)' '$1.$2'

mv -- '[电影天堂www.dytt89.com]灰影人-2022_蓝光中英双字.mp4' 灰影人-2022_蓝光中英双字.mp4
mv -- '[电影天堂www.dytt89.com]狩猎-2022_BD韩语中字.mp4' 狩猎-2022_BD韩语中字.mp4
```

这里的意思是，用`[]`扩起来的任何字符后面跟的如果是`.mkv`或者`.mp4`后缀，则把文件名作为第一个分组，把后缀作为第二个分组，用 `$1.$2` 引用这两个分组来生成修改后的文件名。

更多 zmv 的用法可以看它的[文档](https://github.com/zsh-users/zsh/blob/master/Functions/Misc/zmv)。

[^1]: 一个 raspberry pi 挂载个 NFS 的硬盘，上面再跑个 transmission，把管理页面暴露到指定的端口。这样给它种子或者磁力链，它自己下载了，家里的电脑和投影仪都可以访问。
[^2]: 这里的 `-n` 参数是 dry-run 的意思，通常情况下你应该先用这个参数看看它会把名字改成什么样，再真正运行命令。
