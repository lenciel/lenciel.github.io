---
layout: post
title: "简单验证码的快速识别"
date: 2016-06-16 18:48:14 +0800
comments: true
categories: 

- tools-i-use
- python
- imagemagick

---

昨天饭局上聊起来自动化测试或者是别的奇怪事业里经常需要面对的一个问题：验证码识别。

其实验证码的识别，技术上来说可以作为古老的OCR（Optical Character Recognition）问题的一个子集：因为OCR其实就是从图片上把文字认出来嘛。

但它的有趣之处在于，验证码，也就是CAPTCHA，本身就是'Completely Automated Public Turing test to tell Computers and Humans Apart'的缩写，也就是说在设计上它的目的就是要：

1. 让人很容易认识出来
2. 让机器很难认识出来

所以如果你电脑识别出来了验证码，要么就是它特别容易不符合#2的要求，要么就是你实现了很不错的人工智能算法，这篇文章是讲第一种情况。

传统的做法来识别OCR，主要需要处理的是下面三个环节：

1. 图片二值化
2. 字符的分割
3. 字符的识别

### 二值化怎么做

所谓的“二值化”，就是图片上的像素要么灰度是255（白），要么是0（黑）。大致的思路就是把灰度大于或等于阈值的像素判为属于你关注的文字，置成0；其他的像素点灰度置为255。

具体的操作，我一般使用下面几种方式：

1. 如果是特别简单地处理，用PIL库
2. 如果是比较复杂的但是不需要很细致的控制，用[ImageMagick](http://imagemagick.sourceforge.net/)的`convert`命令
3. 如果是特别复杂，需要反复试验各种算法的，用OpenCV

所以下面这两个验证码，哪个的难度大一些？

<p style="font-size: 0.8em;
"><img src="/downloads/images/2016_06/orig_code.png" title="Don't touch me..." alt="Vhost threshold" data-pin-nopin="true"><br/>
图1. 微林的验证码</p>

<p style="font-size: 0.8em;
"><img src="/downloads/images/2016_06/orig_code_2.jpg" title="Don't touch me..." alt="Vhost threshold" data-pin-nopin="true"><br/>
图2. 饭局后J.Snow提供的验证码</p>

如果你脑子里面没有二值化的概念大概会觉得第一个难度大一些，因为以人眼的视线去考虑，好像第一张要“难分辨”一些。

但其实第一张图所有的噪声都是花花绿绿的颜色，而验证码本身是纯粹的黑色，这种图片处理起来是相对容易的。只需要找到验证码像素点的颜色，用这种颜色选取这些像素点，拷贝到一张全白的图片上面即可。

要获取验证码的像素颜色可以[参考这里](http://www.boyter.org/decoding-captchas/)的思路，把图片转成256色的，然后对所有的像素做一个统计然后标出它们在整个图片里面出现的频率。因为觉得原文里面的代码写得比较啰嗦（要学会写lamda啊）就做了一些修改：

```python
import sys
from PIL import Image


def get_top_pixels(file_path, min_pt_num):
    im = Image.open(file_path)
    im = im.convert("P")
    top_pixels = []

    for index in enumerate(im.histogram()):
        if index[1] > int(min_pt_num):
            top_pixels.append(index)

    return sorted(top_pixels, key=lambda x: x[1], reverse=True)


if __name__ == '__main__':
    print(get_top_pixels(sys.argv[1], sys.argv[2]))
```

这个程序运行的结果如下：

{% blockquote %}
$ python get_histdata.py regcode.png 30

[(0, 1471), (1, 214), (10, 110), (11, 97), (2, 85), (9, 83), (6, 66), (8, 58), (7, 49), (5, 37)]
{% endblockquote %}

拿到了颜色，就可以写一个简单的程序从图片里面拷贝这些像素到一张干净的图：

``` python
import sys
from PIL import Image


def clean_image(file_path, key_pix):
    im = Image.open(file_path)
    im = im.convert("P")
    im2 = Image.new("P", im.size, 255)

    for x in range(im.size[1]):
        for y in range(im.size[0]):
            pix = im.getpixel((y, x))
            # color of pixel to get
            if pix == key_pix:
                im2.putpixel((y, x), 0)

    im2.save("convert_%s.png" % key_pix)


if __name__ == '__main__':
    clean_image(sys.argv[1], sys.argv[2])

```


出现的最多的`0`显然是背景色，所以对`1`和`10`运行脚本：

{% blockquote %}
$ python convert_grayscale.py regcode.png 1
$ python convert_grayscale.py regcode.png 10
{% endblockquote %}

结果如下：

<p><img src="/downloads/images/2016_06/convert_1.png" title="Don't touch me..." alt="Vhost threshold" data-pin-nopin="true">&nbsp;&nbsp;&nbsp;&nbsp;<img src="/downloads/images/2016_06/convert_10.png" title="Don't touch me..." alt="Vhost threshold" data-pin-nopin="true"></p>

很明显目标像素是1而不是10。

而J. Snow的这张图，首先验证码本身就是幻彩的而不是均匀一致的颜色，然后噪声又都是用这些幻彩颜色来生成的，所以如果只是简单的对颜色排序，会得到下面的结果：

{% blockquote %}
[(225, 349), (139, 170), (182, 161), (219, 95), (224, 64), (189, 54), (175, 47), (218, 40), (90, 36), (96, 33)]
{% endblockquote %}

然后我们对排名靠前的像素进行提取会得到下面的结果：

<p><img src="/downloads/images/2016_06/convert_225.png" title="Don't touch me..." alt="Vhost threshold" data-pin-nopin="true"><img src="/downloads/images/2016_06/convert_139.png" title="Don't touch me..." alt="Vhost threshold" data-pin-nopin="true"><img src="/downloads/images/2016_06/convert_182.png" title="Don't touch me..." alt="Vhost threshold" data-pin-nopin="true"><img src="/downloads/images/2016_06/convert_219.png" title="Don't touch me..." alt="Vhost threshold" data-pin-nopin="true"></p>

这种情况下怎么办？直观观察一下验证码，会发现背景噪声点相比验证码像素点来说很少（这也正常，都是一个颜色如果太多就没法看了）， 很适合先做一些切割，然后进行模糊匹配（因为验证码的像素是幻彩的不是单一的，需要匹配相近像素点），然后再做二值化。

直接用IM的convert来处理比写代码简单：

``` bash
$ convert 1.pic.jpg -gravity Center -crop 48x16+0+0  +repage -fuzz 50% -fill white -opaque white -fill black +opaque white resultimage.jpg
```

效果如下：

<p><img src="/downloads/images/2016_06/orig_code_2.jpg" title="Don't touch me..." alt="Vhost threshold" data-pin-nopin="true">&nbsp;&nbsp;&nbsp;&nbsp;<img src="/downloads/images/2016_06/convert_im.jpg" title="Don't touch me..." alt="Vhost threshold" data-pin-nopin="true"></p>

### 字符怎么分割

其实整个验证码的识别里面，最难的是分割。特别是很多严肃的验证码，字体不是标准字体或者会变形，互相还可能粘连或者重叠，分割起来是非常难的。

但这里拿到的验证码相对简单，这部分不是问题就不展开了。

### 字符的识别

对于这里拿到的验证码而言，因为都是标准字体，可以直接使用OCR的开源工具读取，比如[tesseract](https://github.com/tesseract-ocr/tesseract/wiki)：

``` bash
$ tesseract resultimage.jpg -psm 7 output && cat output.txt

Tesseract Open Source OCR Engine v3.04.01 with Leptonica
Warning in pixReadMemJpeg: work-around: writing to a temp file

YLNU
```

如果不是标准字体的，因为分割完毕了就拿到了独立的字符，要识别就可以建一个模型，不断的训练它，来识别每个字符。

### 如果是更困难的呢？

可能你会觉得围棋电脑都会下了，那么认识验证码为什么还是比较难？

其实[随便搜一下](https://www.google.com.hk/search?safe=off&q=CNN+captcha&oq=CNN+captcha&gs_l=serp.3...1563.1932.0.2169.3.3.0.0.0.0.0.0..0.0....0...1c.1.64.serp..3.0.0.q4EdDQLrqyk)就会发现有很多人在做这方面的实验，主要的思路就是把n个字符组成的验证码当成有n个标签的图片来用CNN来解决。加上最近很多大公司开放了自己的人工智能平台，比如Google的Tensorflow，我们这些没有大量计算资源的普通人也可以用它们实现自己的想法了。

推荐参考链接：

1. [CNN辨认车牌](https://matthewearl.github.io/2016/05/06/cnn-anpr/)
2. [CNN验证码识别](http://www.cs.sjsu.edu/faculty/pollett/masters/Semesters/Spring15/geetika/CS298 Slides - PDF)

