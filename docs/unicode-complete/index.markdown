---
layout: page
title: "Unicode漫游指南"
date: 2008-06-25 13:12
comments: true
sharing: true
footer: true
---

十年之前，Lenciel拿到人生中第一个黄色游戏<a href="http://www.google.com/search?hl=en&rlz=1B3GGGL_zh-CN___CN231&q=%E5%8F%B0%E6%B9%BE+%E6%99%BA%E5%86%A0+%E9%87%91%E9%99%B5%E5%8D%81%E4%BA%8C%E9%92%97+&btnG=Search&aq=f&oq=" target="_blank">《金陵十二钗》</a>的时候，异常兴奋的打开了它，却看到了乱码。还好，有<a href="http://www.njstar.com/cms/cn/" target="_blank">南极星</a>来帮忙。

十年过的很快，i18n，l10n现在被每个软件公司挂在嘴边。但你会惊奇的发现我们看到乱码的概率丝毫没有比当年降低：看片的时候导入一个繁体的字幕，乱码；打开gmail，乱码；用一个第三方的python库抓网页，乱码……

不过，不用不好意思，并不是菜鸟们才不懂unicode。如果你打开那些记载PHP或者Python的前世今生的<a href="http://ca3.php.net/manual/en/language.types.string.php" target="_blank">网页</a>，你会惊奇的发现这些语言在设计之初对字符的编解码处理是那样的粗糙，你开发一个国际化软件的办法几乎只能是到处<a href="http://www.baidu.com/s?wd=python+can%27t+decode+byte&sourceid=Mozilla-search" target="_blank">求助</a>和<a href="http://blog.ianbicking.org/why-python-unicode-sucks.html" target="_blank">骂娘</a>。

当然，要在电脑上编写出让周杰伦和张伯伦都能看懂的软件的确是需要一些技巧的。而且国际邮件组里面有很多老鸟一辈子都没有见过<a href="http://en.wikipedia.org/wiki/CJK" target="_blank">CJK</a>，他们经常像《<a href="http://www.mtime.com/movie/68393/" target="_blank">The Mist</a>》里面那个疯婆子一样，只会唠叨“source code=plain text=ascii=8 bits characters”。

这当然是像地心说一样过时的错误的观点。本座看到很多亚洲人的反击，说现在“很多代码都可以是unicode的了，那是16个bit的哦”。有的人还为抓到别人话里面的漏洞很兴奋，在信里damn一下对方或者语言设计者。

这，当然也是错误的。unicode和16bit从来就没有必然联系。

## **治学先治史**

最初计算机可以读的，是小箭猪打孔机处理过的卡片。不久，<a href="http://en.wikipedia.org/wiki/EBCDIC" target="_blank">EBCDIC</a>编码方式得到了使用。这些东西，和现代的计算机编码解码已经无关。

<img src="/downloads/images/ascii_table.png" align="right" />

很快，就在Unix出现，K&R开始<a href="http://cm.bell-labs.com/cm/cs/cbook/" target="_blank">写书</a>的时候，EBCDIC退朝，右图所示的<a href="http://www.asciitable.com/" target="_blank">ASCII</a>上位了。ASCII的想法是用32到127之间的数字表示所有的英文字母符号，而0到31位是放控制字。比如7是让电脑“beep”一声等等。因为当时的电脑大都是8位的，ASCII只能用掉7位，有的兽欲无法得到满足的程序员还会在剩余的一位加入自己的邪念：比如当年著名的编辑器WordStar就用每个byte的最高一位来表示后面7位表示的字母是不是一个单词里面的最后一个字母。因为这样华丽的用掉了1位，WordStar变得只能编辑英文，不过那个时候的用户都是讲英文的，所以也就没什么抱怨的声音。


问题就出在，对剩下那个bit，也就是128-255这些码位有邪念的可不是WordStar作者一人。从81年开始，IBM在做IBM-PC的时候，就把它们用来表示一些欧洲的带音调的字母和横条竖条这样的用来做框的记号。因为是出厂的时候做到硬件里面的，所以被称为如右下图所示的<a href="http://en.wikipedia.org/wiki/Code_page_437" target="_blank">OEM</a>的字符集（OEM这个叫法也是这么来的）。

<img src="/downloads/images/oem.png" align="right" />

这些电脑很快被卖到了世界各地，于是各种各样的OEM字符集被创造出来，用高128位表示各自需要的字符。例如，完成殖民生活回到英国的奥利弗勋爵就会发现自己发给印度老朋友的电子邮件被抱怨有些字显示不正确。而负责冷战的FBI们更是发现，在自己的机器上打开苏联的文档几乎不可能：对俄语的编码方式实在是太多了。


ANSI（美国国家标准学会）用`code pages`[^1]来表示这种按地域区分的字符集。比如`cp936`是中文简体，`cp862`是突厥人用，`cp737`是希腊人用等等。因此，没有安装某国字符集的电脑在dos里面是<a href="http://www.baidu.com/s?ie=gb2312&bs=EBCDIC&sr=&z=&cl=3&f=8&wd=%D6%D0%CE%C4+cp936&ct=0" target="_blank">看不到</a>你熟悉的语言的。

当亚洲人开始用电脑了之后，事情变得更加混乱。比如天朝文字，是绝对不可能用高128位来放完的。于是`DBCS`（double byte character set）又来救场：用16个bit位对字符进行编码。

但是对于大多数写程序的人来说，他们仍然认为一个字符是8bit，因为他们很少需要把一种语言的字符拿到另一种语言的平台上去处理。不过，当世界很多角落都已经通了internet之后，世界变平了。人们看到了满坑满谷的乱码，于是`Unicode`出现了。

## **Unicode**

`Unicode`组织和天朝搞奥运会一样，一出来就是打着同一个世界，同一个字符集的口号。不过，和航空爱好者普遍以为“太空没有重力”一样，有很多`Unicode`的支持者都以为`Unicode`是一种16位的字符集，**这种想法其实是不对的**。

实际上Unicode是对世界上所有的字符分配了一个所谓`code point`的码位。

![unicode](/downloads/images/apple_code_table.jpg "Don't touch me...")

你可以在Windows的命令行输入`charmap`来查看这些码位。比如字母A，它的unicode码位是`+U0041`，而不幸被本座选中的汉字是`U+04C7`。

![unicode](/downloads/images/unicode.png "Don't touch me...")

由于世界上有如此多的字符，实际上0到65535的code point早就已经被用光了。也就是说，16个bit并不能装下所有的Unicode。

而且，在内存或者硬盘上，字符究竟是以什么样的bit位的形式存在的，其实还要看这些字符是怎么被编码的。比如我们查到“全部”这个词的Unicode码位：

```
> 全：  +U5168
> 部： +U90E8
```

那么这两坨`u5168\u90e8`怎么在内存中放置，还要看你是用的哪种编码才能确定。

## **编码**

Unicode的编码，最先被想到也是最容易被想到的，就是使用两个byte，16个bit（这也是后来造成unicode是双字节的误会的起源）。比如我们前面说了“全部”：

```
> 全部 :  +U5168 +U90E8
```

那么用

```
> 51 68 90 E8
```

来表示不就可以了。但是，你也许会想，下面的编码为啥不行呢：

```
> 68 51 E8 90
```

是啊，这个软件开发中古老的<a href="http://www.google.com/search?q=%E5%A4%A7%E5%B0%8F%E7%AB%AF%E5%AF%B9%E9%BD%90%E9%97%AE%E9%A2%98&sourceid=navclient-ff&ie=UTF-8&rlz=1B3GGGL_zh-CN___CN231&aq=h" target="_blank">大小端对齐问题</a>又冒出来了。于是人们开始用`FE FF`这个格式的`Unicode Byte Order Mark`(简称`BOM`）来进行标识：从文件头里面读出`FF FE`的兄弟们知道，后面所有字符的大小端都要进行互换。需要注意的是，`FE FF`只是`BOM`的一种，而且，不是每个文件都那么守规矩：有的会没有`BOM`标志。


世界清静了一段时间，每个人都过得幸福美满。但是不久，使用英语的主流程序员队伍看到内存里面大片大片的`00`（英文的Unicode都是`+U00FF`以下的，记得吗？），就难免有希望处理稀疏矩阵的怨念。也难怪，他们又不是中国的官僚，看到那么多旧格式的文档需要转换，看到同样的英文文档保存的大小翻倍了，他们当然会怨念。于是，`Unicode`组织也和天朝首次申奥一样，在相当长的一段时间内被人淡忘了。

## **UTF-8**

UTF-8[^2]的思想一句话就能说清：对code point分段进行编码。从0-127的用8个bit，后面的用16个、24个、32个…

同时，人们把过去那种编码方式称为UTF-16（因为是用16个bit）或者UCS-2（因为是2个byte）。
<img src="/downloads/images/utf8.png" align="right" />可以看出来，UTF-8的编码方式中，英文字母的编码和ASCII中是一致的。对于美国的软件工程师而言，使用UTF-8工作和ASCII工作的差异被抹去了。而且你也不需要像UCS-2那样去分辨它是大端对齐还是小端对齐的了。

当然，对Unicode的编码方式还远不只这两种。我们常常可以看到UTF-7，UCS-4这样的编码方式（后面这种腐败的编码方式，估计是天朝的乡长发明的）。

由于很多旧的`encoding`方式下，有的Unicode的码位没有包含，比如传统的欧洲字符集`ISO-8859-1`[^3] ，如果你要它显示中文，就会看到一串的问号。而UTF-x则都包括了所有的Unicode的`code point`。

## **你只要记住一点点**

你居然读到了这里……好吧，我知道，不是每个人都需要知道上面的东西。作为程序员你只需要知道一件事情：

> **字符是使用什么编码方式被编码的**

如果你在看到乱码的时候，那些七七八八的字符在内存或者文件里面是用什么方式保存的你都不清楚的话，那[ms-dos窗口乱码](http://www.google.com/search?q=ms-dos%E7%AA%97%E5%8F%A3%E4%B9%B1%E7%A0%81&sourceid=navclient-ff&ie=UTF-8&rlz=1B3GGGL_zh-CN___CN231&aq=h)了，[输出的文件乱码](http://www.google.com/search?hl=en&rlz=1B3GGGL_zh-CN___CN231&q=%E8%BE%93%E5%87%BA%E7%9A%84%E6%96%87%E4%BB%B6%E4%B9%B1%E7%A0%81&btnG=Search&aq=f&oq=)了，[eclipse的console乱码](http://www.google.com/search?hl=en&rlz=1B3GGGL_zh-CN___CN231&q=eclipse%E7%9A%84console%E4%B9%B1%E7%A0%81&btnG=Search&aq=f&oq=)了，的确会让你觉得号称平了的世界挺不友好的。这篇文章介绍了一点基本知识，并不是对症下药。希望你看完了本文，能够做到心中有码。

下面是一些有趣的Unicode码，来自[这里](http://wiki.secondlife.com/wiki/Unicode_In_5_Minutes)：

![unicode fun](/downloads/images/unicode_fun.png "Don't touch me...")

 [^1]: http://www.i18nguy.com/unicode/codepages.html#msftdos     
 [^2]: http://www.ietf.org/rfc/rfc3629.txt    
 [^3]: http://www.htmlhelp.com/reference/charset/    
