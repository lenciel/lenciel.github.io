---
layout: post
title: "使用Chrome自定义搜索引擎快速查找资源"
date: 2016-02-20 11:53:34 +0800
comments: true
categories: 

- tools-i-use
- tips

---

这篇文章讨论的办法，主要是结合使用`带参数Google搜索`+`Chrome快捷搜索入口`，鉴于众所周知的原因，如果你不会翻墙可能不能直接使用。

但是鉴于国内搜索引擎功能上多少都有借鉴Google，浏览器多少都有借鉴Chrome，所以这里讨论的办法也许用其他"搜索"+"浏览器"组合也可以使用。只是我们都知道国内搜索引擎索引出来的结果有多离奇，所以效果上可能会打一些折扣。

### 带参数Google搜索

Google可以带参数搜索一般用户可能不太用到，但其实对找东西很有用。完整的说明可以自己找来看，对普通用户也非常有用的有：

#### 双引号

把搜索词放在双引号中，代表完全匹配搜索，也就是说搜索结果返回的页面包含双引号中出现的所有的词，连顺序也必须完全匹配。

比如搜索代码里面的抛出的错误，你直接把错误行扔进去，往往不如加上引号来完全匹配准确。

#### filetype

用于搜索特定文件格式，比如搜索`filetype:pdf`，那么就只返回所有包含关键词的pdf文件。

#### site

用来搜索某个域名下的所有文件，比如在百度网盘里面搜索名字包含Hadoop的文件，就可以搜索`Hadoop site:pan.baidu.com`。

#### 减号

代表搜索不包含减号后面的词的页面。使用这个指令时减号前面必须是空格，减号后面紧跟着需要排除的词。


熟练掌握并且综合使用上面这些语法，你就可以非常快速地找到你需要的东西了。

### Chrome快捷搜索入口

Chrome为你提供了快捷方式来使用搜索。`Cmd+L`（Windows平台大概是`Ctrl+L`）进入地址栏，然后输入要搜索的内容，回车，就会使用你的默认搜索引擎进行搜索。

假如你要切换一个搜索引擎，比如你的默认引擎是Google，偶尔你需要用百度来搜索，只需要在地址栏里面先敲`baidu`，然后按`Tab`键，然后输入你需要搜索的关键字并回车，就可以了。

Chrome里面你可以这样使用的搜索引擎数量其实是远超你想象的。

在地址栏里面敲入`chrome://settings/`，然后进入搜索引擎的配置你就可以看到它们：

![Vhost threshold](/downloads/images/2016_02/manage_search_engine.png "Don't touch me...")


### 创建使用自定义搜索引擎

一旦开始使用自定义搜索，你就会发现有些搜索使用频率相当高。

比如在百度盘里面搜索某个文件。

再比如在[Quora](http://quora.com/)或者[知乎](http://zhihu.com)里面搜索包含某个关键字的问答。

这个时候你只需要在搜索引擎列表的末尾添加一个自定义项：

![Vhost threshold](/downloads/images/2016_02/custom_search_engine.png "Don't touch me...")

比如我们添加一个`Keyword`是`panb`的搜索引擎，它的URL是：

```
https://www.google.com.hk/search?q=%s+site%3Apan.baidu.com
```

注意URL这个参数需要做[urlencode](https://docs.oracle.com/javase/7/docs/api/java/net/URLEncoder.html)，所以空格变成了`+`，`site:pan.baidu.com`变成了`site%3Apan.baidu.com`。

如果你不知道`urlencode`怎么做，可以先到Google上完成一次目标搜索，然后从地址栏上面复制下来。

定义好了自定义搜索引擎以后，你只需要在地址栏里面输入Keyword（panb），然后按`Tab`键，再输入你需要查找的资源，回车，就可以看到结果了。

具体使用过程请参考下面这个视频（略需要几秒加载）：

{% video http://lenciel.com/downloads/video/chrome_custom_search.mp4 640 320 http://lenciel.com/downloads/images/2016_02/chrome_custom_search.png %}


