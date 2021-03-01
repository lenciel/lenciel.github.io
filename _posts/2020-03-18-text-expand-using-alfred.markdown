---
layout: post
comments: true
title: "使用 Alfred 完成文本扩展"
date: 2020-03-18 17:09:19 +0800
categories:

- tools-i-use
- alfred
- text-expanding

---

有很多文本片段是可复用的，它们被称为 snippets 。

收快递的地址，手机号，身份证号是一类：格式和内容都固定。

Markdown/Jekyll 里面各种宏是一类，格式不变，内容变化:

{% raw %}

{% highlight javascript %}<br>
/* Some pointless Javascript */<br>
var rawr = ["r", "a", "w", "r"];<br>
{% endhighlight %}<br>

{% endraw %}

再比如会议纪要这类文档，框架也是固定的，日期、参会人、内容等具体内容是变化的。

如果只是把它们放在某个地方，每次用的时候搞出来拷来拷去，显然效率很低。所以市面上有「[文本扩展](http://carlcheo.com/best-text-expanders)」类的工具专门解决这个问题。

过去我用 [TextExpander](https://textexpander.com/)，它的功能很强大，除开简单的格式，还支持了各种宏。

但是自从它改成按月订阅付费，并且每个月要好几十块钱，我就转到了 mac 自带的「shortcut」：

![keyboard_shortcut.jpg](/downloads/images/2020_03/keyboard_shortcut.jpg --alt Don't touch me)

它的功能很简陋，特别是不支持宏（后面可以看到有它没它区别多大）。

这两天迁移到新机器，偶然发现我掏钱的另一个软件 Alfred（没它我真是不知道怎么活）有了一个 `Snippets` 功能。

试用了一下，发现基本够用了，如果能做一个导入 TextExpander 库的功能就好了。

拿写 markdown 的文档时经常要插入图片这件事情举个例子。我们可以在 Alfred 里面建一个类别，Prefix 为「.」，keyword 为「mki」，然后它的公式是：

> \![{clipboard:0}]\(/downloads/images/{date:yyyy/MM}/{clipboard:0} --alt Don't touch me\)

这里：

- `{clipboard:0}`这个宏是取你剪切板堆栈里最靠前的内容，简单说就是你刚刚复制的内容。
- `{data:yyyy_MM}`是取当前年月日并格式化为`2020_03`，因为我有一个 [Hazel](https://www.noodlesoft.com/) 脚本，写 Blog 用的图片扔进一个目录，就会被自动按照「年+月」的这个格式归档。

于是，每次要往 Blog 里面插入一个图片的时候，只需要复制文件名，然后在编辑器里面敲击 `.mki` 就可以了：

<video playsInline autoplay loop muted>
    <source src="{{ site.static_base }}/downloads/video/mki.mp4" type="video/mp4">
    <p>Your browser doesn't support this embedded video.</p>
</video>

Alfred 支持了非常丰富的宏定义，满足工作中的大部分需要足够了。