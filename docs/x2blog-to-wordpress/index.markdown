---
layout: page
title: "x2blog搬迁到wordpress"
date: 2007-04-17 13:24
comments: true
sharing: true
footer: true
---

前面有讲对xml/html的库选择。既然<strike>例完假</strike>利完器，就要善其事了。其实x2blog提供了备份导出的功能，让整个事情变得非常简单。相比之下，歪酷本来有此功能现在却不知为何关闭了，让用户从歪酷搬走变得难上加难。

首先，x2blog导出的是按照月份为单位的日志，如下图所示：


![x2w1](/downloads/images/2008_09/x2w1.jpg "Don't touch me...")

每个xml文件的格式都是相同的，如下图所示：

![x2w1](/downloads/images/2008_09/x2w2.jpg "Don't touch me...")

可以从图里面看到，`Info`节点的title就是blog的名称，而每个Item对应着一篇日志。这里有点诡异的是所有日志的内容都在`Abstract`节点里面，而不是`Content`节点里面，估计是x2blog这个日志程序的bug。

有了这些信息，就可以去生成wordpress可以读懂的<a href="http://en.forums.wordpress.com/topic/what-is-an-wordpress-extended-rss-wxr-file" target="_blank">wxr文件</a>了。

首先做一个类，初始化的时候就生成那些通用的内容，如xml声明部分等：

```python
def __init__(self, input):
        """Creates the basic document."""
        self.input_tree = input
        self.site = ''
 
        self.xml = xml.dom.minidom.Document()
        self.rss = self._create_element('rss', self.xml)
        self.rss.setAttribute('xmlns:content',
                              'http://purl.org/rss/1.0/modules/content/')
        self.rss.setAttribute('xmlns:wfw',
                              'http://wellformedweb.org/CommentAPI/')
        self.rss.setAttribute('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
        self.rss.setAttribute('xmlns:wp', 'http://wordpress.org/export/1.0/')
        self.channel = self._create_element('channel', self.rss)
```

然后就需要分别生成wordpress的cata、tag、item、comment这四部分内容。不过x2blog的导出备份文件里面并没有tag信息（又是一个bug吧），所以tag先不管。

日志分类处理

```python
def create_category(self, nicename, name=""):
        """Creates a Category."""
        if name != "":
            category = self._create_element('wp:category', self.channel)
            self._create_element('wp:category_nicename', category, nicename)
            self._create_element('wp:category_parent', category)
            element = self._create_element('wp:cat_name', category)
            self._cdata(name, element)
```

日志

```python
def create_item(self, data):
        """Creates an item from the Item element in the tree."""
        linkpath = datetime.strptime(data[1].text,"%Y-%m-%d %H:%M:%S").strftime('%Y/%m/%d')
        link = "%s/%s/%s" % (self.site, linkpath, data[].text.encode("utf-8"))
        item = self._create_element('item', self.channel)
        self._create_element('title', item, data[].text.encode("utf-8"))
        self._create_element('link', item, link)
        self._create_element('pubDate', item,
                            datetime.strptime(data[1].text,"%Y-%m-%d %H:%M:%S").strftime('%a, %d %b %Y %H:%M%S +0000'))
        self._create_element('dc:creator', item, 'admin')
        self.item_categories(item, data[2].text.encode("utf-8"))
        #no tag info, just left there
        #self.item_tags(item, xxx)
        guid = self._create_element('guid', item, link)
        guid.setAttribute('isPermaLink', 'true')
        self._create_element('description', item)
        element = self._create_element('content:encoded', item)
        self._cdata(data[4].text.encode("utf-8"), element)
        #self._create_element('wp:post_id', item, data[0])
        self._create_element('wp:post_date', item, data[1].text)
        self._create_element('wp:post_date_gmt', item, data[1].text)
        comments = 'open'
        self._create_element('wp:comment_status', item, comments)
        self._create_element('wp:ping_status', item, 'open')
        self._create_element('wp:post_name', item, data[].text.encode("utf-8"))
        self._create_element('wp:status', item, 'publish')
        self._create_element('wp:post_parent', item, '0')
        self._create_element('wp:menu_item', item, '0')
        self._create_element('wp:post_type', item, 'post')
        self.item_comments(item, data[7])
```

评论

```python
def item_comments(self, item, comment_elems):
        """Creates comments for an item."""
        for elem in comment_elems:
            comment = self._create_element('wp:comment', item)
            #self._create_element('wp:comment_id', comment, elem[0])
            element = self._create_element('wp:comment_author', comment)
            self._cdata(elem[1].text.encode("utf-8"), element)
            self._create_element('wp:comment_author_email', comment, 'x@y.com')
            self._create_element('wp:comment_author_url', comment, 'http://xxx')
            self._create_element('wp:comment_author_IP', comment, elem[2].text.encode("utf-8"))
            self._create_element('wp:comment_date', comment, elem[3].text.encode("utf-8"))
            self._create_element('wp:comment_date_gmt', comment, elem[3].text.encode("utf-8"))
            self._create_element('wp:comment_content', comment, elem[].text.encode("utf-8"))
            self._create_element('wp:comment_approved', comment, '1')
            self._create_element('wp:comment_type', comment)
            self._create_element('wp:comment_parent', comment, '0')
```

实际的文件解析处理过程，都放到了另外一个类里面来使得结构清晰。完整的代码：

{% include_code x2wp.py lang:python %}

