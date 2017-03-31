---
layout: post
title: "Better Dictionary on Mac"
date: 2014-05-23 14:02:14 +0800
comments: true
categories: 
- tips
- mac
- tools-i-use
---

Mac上很贴心的提供了词典，并且还绑定了快捷键：在任何页面按下"Ctrl+Cmd+D"，就会有词义解释的界面弹出。不过内置的`New Oxford American Dictionary`比较的弱，给人的感觉词条的水准就像《新华字典》一样单薄，所以换成了编了好几十年又修订了好几十年的[韦氏词典](http://zh.wikipedia.org/wiki/%E9%9F%A6%E6%B0%8F%E8%AF%8D%E5%85%B8)，两者的差距还是明显的。

这是自带词典对pathos的解释：

{% blockquote %}
pathos /ˈpāˌTHäs/, a quality that evokes pity or sadness
{% endblockquote %}

这是《韦氏词典》的：

{% blockquote %}
pathos /ˈpāˌTHäs/, n. 

1. The quality or character of those emotions, traits, or experiences which are personal, and therefore restricted and evanescent; transitory and idiosyncratic dispositions or feelings as distinguished from those which are universal and deep-seated in character; — opposed to ethos.

2. That quality or property of anything which touches the feelings or excites emotions and passions, esp., that which awakens tender emotions, such as pity, sorrow, and the like; contagious warmth of feeling, action, or expression; pathetic quality; as, the pathos of a picture, of a poem, or of a cry.
{% endblockquote %}

安装的方法也挺简单：

* 如果下载的是[这样](http://pan.baidu.com/s/1o6z67dK#dir/path=%2Fdictionary)的`dictionary`文件，直接拷贝到`~/Library/Dictionaries`
* 如果是[这样](http://pan.baidu.com/s/1i35ik7N)的raw文件，需要运行DictUnifier应用编译

安装完毕运行`Dictionary`应用，勾选你期望出现的字典和顺序即可，我启用了《朗道英汉词典》、《韦氏词典》和《维基百科》:

<p><img src="/downloads/images/2014_05/apple_dict_effect.png" title="Apple Dict" alt="Don't touch me" width="60%"></p>

另外，词典的样式其实是用css定义的，就在每个字典文件的Contetns目录，比如：`~/Library/Dictionaries/dictd_www.dict.org_web1913.dictionary/Contents/DefaultStyle.css`。如果你不满意字典出来的样子，可以自定义格式。

最后，这些词典其实都是linux上著名的国产软件[stardict](http://en.wikipedia.org/wiki/StarDict)的文件格式（写到这里，又想起stardict的作者[胡正](http://www.huzheng.org/aboutme.php)），所以要在[手机上使用](https://itunes.apple.com/us/app/dictionary-universal/id312088272?mt=8)也是很容易的事情。


