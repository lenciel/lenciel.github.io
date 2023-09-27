---
layout: post
sidenote: false
comments: true
title: "改了些错"
date: 2020-05-20 11:40:58 +0800
categories:

- blog
- theme
- gif
---

自从在上一次升级模板的时候集成了 [Valine](https://valine.js.org/)，这个 Blog 就又有人来评论了。

有时候留言的同学会提醒一些 typo，很感谢。

最近有位说，在 Firefox 下面 CSS 加载不对劲，非常感谢。

这两天有点时间把它们都 fix 了：Firefox 的问题出在我误会了[它对 preload 的支持](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)。

除此之外，这个版本还有两个挺大的改动。

一个是全面使用 MP4 替换 GIF[^1]。

GIF 很酷，Facebook 刚花了 4 亿美金[收购Giphy](https://www.theverge.com/interface/2020/5/19/21262451/facebook-giphy-acquisition-gif-instagram-whatsapp)。

我是 GIF [爱好者](https://lenciel.com/2014/02/3d-gifs/)，曾经有段时间，我用 ffmpeg 把电影里面喜欢的片段转成一个 .gif 文件[收藏起来](https://lenciel.com/categories/fu-guang-lue-ying/)。

[Steve Wilhite](https://en.wikipedia.org/wiki/Steve_Wilhite) 设计这种格式是为了提供气象图等动态图形内容：因为没有显示照片时需要的色彩细节方面的要求，GIF 格式限制了只能使用 8 位 256 色，但可以在一个文件中存储多个帧，并且可以无限制循环这些帧。

于是就被大家[玩坏了](https://www.wired.com/2017/05/gif-turns-30-ancient-format-changed-internet/)。

然而 GIF 有一个显著的缺点: 文件大小很惊人。

一个在用户看起来没有区别的内容，使用 MP4 可以比使用 GIF 缩小文件体积 95% 以上。

因此很多的服务提供商看起来允许你上传和使用 GIF，其实都是转码成 MP4 的。

我写了一些脚本来转换 .gif 文件到 .mp4 文件，核心就一个 ffmpeg 命令：

{% highlight javascript %}
for i in *.gif; do
    [ -f "$i" ] || break
        echo "this is ${i%%.*}"
        ffmpeg -f gif -i $i ${i%%.*}.mp4
done
{% endhighlight %}

然后在 markdown 里面把原来的图片标签置换成：

{% highlight html %}
<video playsInline autoplay loop muted>
    <source src="sample.mp4" type="video/mp4">
    <p>Your browser doesn't support the video embedded.</p>
</video>
{% endhighlight %}

这样的设置在用户体验上唯一跟使用 GIF 不同的是，如果  iOS 设备被设置为[省电模式](https://support.apple.com/en-us/HT205234)的时候，视频的自动播放会失效：用户必须手动播放视频。

另一个改动就是让自定义的图片元素支持靠左、居中和靠右对齐：之前因为没有支持这个，所有在对齐上比较特别的图片我都是直接嵌入 HTML 的。但是这样它们就没有办法被 [Jekyll-Picture-Tag](https://rbuchberger.github.io/jekyll_picture_tag/) 优化了。

[^1]: GIF 里 G 的发音是软音不是硬音（类似于 gene 里面而不是 game 里面的发音）。