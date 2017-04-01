---
layout: page
title: "Python2里面使用Unicode"
date: 2014-02-17 13:24
comments: true
sharing: true
footer: true
---

用Python的时候，为下面这样的报错苦恼？

```
> UnicodeDecodeError: ‘ascii’ codec can’t decode in position 10: ordinal not in range(128)...
```

嗯哼，本座在用lxml抓网页回来进行解析的时候，也遇到了类似的错误。从解决问题的过程来看，其实Python 2对unicode的支持已经很好了。你首先需要知道Unicode只是一种概念而不是一种实现（把字符表示到内存或者文件里面）。如果你还不清楚基本概念，可以[先学习一下][1]。然后，我们只需要了解python具体实现的一些细节：


encode/decode
------------------

* 在Python2中，有两种字符对象，`str`和`unicode`(可以用`type`函数查看字符串对象)
* `str`和`unicode`通过encode和decode方法可以互相转换(要确保encoding的正确)

Debug Part I 单纯字符串操作
-----------------------------

本座的开发工具是Eclipse3.3.1+pydev+python2.5，操作系统windows xp sp4。首先为了排除是开发环境的问题，写了一个utf8test.py：

```python
# -*- coding: utf-8 -*-
	
import sys
reload(sys)
sys.setdefaultencoding('utf8')
ss ="全部"
uu = u'全部'
CODEC = 'utf-8'
FILE = 'unicodetest.html'
 
f = open('archive.html', "r")
bytes_out = f.read().decode(CODEC)
bytes_in = bytes_out.encode(CODEC)
f = open(FILE, "w")
f.write(bytes_in)
f.close()
 
print repr(ss)
print repr(uu)
 
print("-------------------------------")
print ss.decode(CODEC )
print uu.encode(CODEC )
 
print("-------------------------------")
print repr(ss.decode(CODEC).encode('gbk'))
print uu
```

这段程序里面，有三个地方是跟编解码有关的。 

###1. 声明代码用utf-8编码保存：因为我们的代码里面有中文。

```
\# -\*- coding: utf-8 -\*-
```

这个声明必须在最开始的两行，在后面就没有用了。

###2. 指明在console显示中sys的编码

```python
import sys  
reload(sys)  
sys.setdefaultencoding(utf8) 
```

如果你的程序不需要在console打印中用utf-8编码，这个声明不必要（比如上面程序里没有那些print，只是写内容到文件的话）。

如果你指定了sys的encoding，但是在所用的console（如这里的Eclipse）里面没有设置成一致的选项，还是会报错。


![unicode](/downloads/images/python_unicode_output0.png "Don't touch me...")

###3. 对字符串进行的编码解码

这里我们分别打印了str对象和unicode对象，并对它们进行了一些转换操作。程序的输出是这样的：

![unicode](/downloads/images/python_unicode_output1.png "Don't touch me...")

可以看到，一切正常。python没有问题，本座的环境也是正常的。

很多的人在网上发帖的时候常说我在源文件加了`coding: utf-8`声明了，我的sys设置了`defaultencoding`了，我的console配置成xxx了，甚至还用了codec模块，还是乱码了。其实，是没有搞清楚这些步骤究竟是干啥用的表现。比如在很多地方本座都看到高手指导别人设置sys的编码。其实绝大多数的应用程序是不需要打印什么东西到console的，这样的声明反而会让你的程序在一些python安装包下面变得不可用。

Debug Part II lxml解析HTML
---------------------------

能够正常的打开和保存utf-8文件，那么错误可能就是出在lxml解析网页的过程中。本座一开始直接用了lxml.html里面那个parse方法，因为这个方法看起来很简洁：

```python

import urllib2
import lxml.html as H
from lxml.html.clean import Cleaner
 
if __name__ == '__main__':
    FILE = 'htmltest.html'
    stringUrl = 'http://lenciel.ycool.com/archive.html'
    req = urllib2.Request(stringUrl)
    req.add_header('User-agent', 'Ugrah/0.1')
    site = urllib2.urlopen(req)
    doc = H.parse(site)
    bytes_in = H.tostring(doc, pretty_print=True,encoding='utf-8')
    print(repr(bytes_in))
    f = open(FILE, "w")
    f.write(bytes_in)
    f.close()
    
```

但是这样在保存在本地的中文页面就会是乱码：

![unicode](/downloads/images/python_unicode_output2.png "Don't touch me...")

代码打印了bytes_in的保存方式，我们可以看到“全部”这两个汉字的编码是：


![unicode](/downloads/images/python_unicode_output3.png "Don't touch me...")

原来在序列化的时候，虽然指定了encoding是utf-8，但是两个汉字不知道为什么居然编出来了12个byte。本座也懒得去下序列化的源代码看里面究竟做了什么操作。反正lxml提供了一个从字符串里面解析出html对象树的方法，叫做`document_fromstring`。所以把自己知道格式的字符串传进去让它解析就对了：

```python

import urllib2
import lxml.html as H
from lxml.html.clean import Cleaner
 
if __name__ == '__main__':
 
    FILE = 'htmltest.html'
    stringUrl = 'http://lenciel.ycool.com/archive.html'
    req = urllib2.Request(stringUrl)
    req.add_header('User-agent', 'Ugrah/0.1')
    site = urllib2.urlopen(req).read()
 
    doc = H.document_fromstring(site.decode('utf-8'))
 
    for child in doc:
        print(child.tag)
    bytes_in = H.tostring(doc, pretty_print=True,encoding=unicode)
    print cleaner.clean_html(bytes_in).encode('utf-8')
    f = open(FILE, "w")
    f.write(bytes_in.encode('utf-8'))
    f.close()
    
```

总结
-----

* 处理任何编解码问题时我们都要牢记，unicode是为世界上所有的字符分配了一个码位（code point）的概念，而不是实现（字符在内存或者文件中的存在方式）。unicode占16位是绝对错误的（世界上语言如此多，码位早就超过百万个了）。

* 要对unicode对象进行保存或者打印前，你要对它进行编码（encode）才行。

* 在python里面把str转化成unicode的操作时，如果你知道str的编码方式，显式的指定它。如果你不知道，python会试着去自动完成。这是很多第三方moudle出现编解码问题的根本原因。

* 不要因为解决这样的问题随便使用`sys.setdefaultencoding(utf-8)`设定系统的编码方式。这样有可能造成你的软件在别的平台上不能使用。

* 正确的做法是，尽量早正确的decode一个str为unicode对象（如读入一个文件的内容，返回一个网页的内容等），并在你的程序里面全部使用unicode相关操作，直到你需要打印或者是写入文件时，再去encode它。

* python提供了codec来减少我们的代码行数，它不是你乱码的救星：

```python
f = open(&#8216;small.html&#8217;, "r")  
bytes_in=f.read()  
unicode\_in=bytes\_in.encode(utf-8)
 
===>fileObj = codecs.open( "small.html", "r", "utf-8" )
```

* BOM这东西对UTF-16和UTF-32（python不支持）是很关键的，但是对UTF-8而言可有可无，因为后者不需要大小端对齐（详情请看[这里][1]）。BOM在windows平台上见到得较多，长度2个bytes到4个bytes不等，codec提供了方法检验BOM：

```python
sample.startswith(codecs.BOM\_UTF16\_LE)  
sample.startswith(codecs.BOM\_UTF16\_BE)  
sample.startswith(codecs.BOM_UTF8) 
```

有时候我们是从文件读入内容进行解码，需要去除BOM部分。UTF-16的格式，python会自动去除BOM，UTF-8格式的需要显式调用：

```python
s.decode(utf-8-sig) 
```

* 文件或者网页使用的编码方式还没有很完美的方法进行检测。文件的话从BOM判断算是一个不错的选择。网页的话先查看header里面的`Content-Type`内容。

* 有些第三方库如果没有支持unicode功能的话，你要自己重写一部分wrapper。自己写的代码，在ut的时候一定要用unicode进行测试。

 [1]: http://lenciel.com/docs/unicode-complete/