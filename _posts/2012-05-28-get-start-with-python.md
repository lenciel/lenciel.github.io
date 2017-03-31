---
layout: post
title: "Getting Start With Python"
date: 2012-05-28 22:15
comments: true
categories: 
- python
- tutorial
---

刚刚开始使用Python开发的新手，遇到的第一个瓶颈（常常）就是缺乏对整个Python生态系统的理解。大家总是在网上搜索完成这件事或者那件事的“标准做法”，就像我们使用其他编程语言的时候常常需要掌握的一样。

在和几个朋友开始iDVR的开发的时候，我们在内部Wiki上维护过一个Python中常见问题列表。我们的目标是随着项目的不断进步，这个内部的wiki能够变成一个豪华的Q&A索引，但是事实证明项目一忙起来就没有人去写Wiki了。

最近陆续有朋友问一些Python相关的问题，想想其实要用三言两语说清楚并不容易，就决定在那份wiki的基础上自己写一个版本，给那些刚开始使用Python（从来没有编过程的读起来可能没啥帮助）的同学。

#### **Warning**

Python编程是个大话题，不是这里讨论的内容。如果你没有太多编程经验，应该先去看一点儿Python的<a href="http://learnpythonthehardway.org/" target="_blank">入门书籍</a>。

另外，这片文章是基于Windows（最好是Win7 32bit）操作系统。潮人请不要问为啥不是Mac或者Linux，因为本座主要用的机器（包括码这篇Blog）都是用Win7 32bit。不过除开环境搭建，这里提到的大部分概念对其他系统都是适用的。

如果你有环境搭建上的问题，最靠谱的提问的地方不是CSDN或者百度知道，是<a href="http://stackoverflow.com/" target="_blank">Stack Overflow</a>。

版本选择
-------

本座在某软件公司面试的时候别人看到简历上有Python就问，Python3用过吗？本座老实回答没有，结果面试官就停下他正在笔记本上google的微操，在脸上流露出一丝嘲讽…

不过，除了Python这门语言本身的开发者，大多数像本座这种使用Python的人，都没有紧跟Python3的步伐。Python3（或者叫Py3K）是一个大多数我熟悉的包，框架和工具都还没有完备支持的版本（在未来的数年本座也看不到希望）。如果不是想研究Python3的新特性或者具体实现，个人觉得初学的开发者使用2.7.x是最安全的版本（本座还在用进M公司就装好的2.6版本）。

如果你比较熟悉Python但是不确定该不该升级到Python3，不妨先去观赏一下[Python 3 Wall of Shame][1] (墙外，你们懂的)。

VM选择
------

Python是<a href="http://zh.wikipedia.org/zh-hk/%E8%84%9A%E6%9C%AC%E8%AF%AD%E8%A8%80" target="_blank">脚本语言</a>，因此需要VM。CPython是最主流的选择，也被当成其他VM实现时的参考。其他常见的还有用Python实现的[PyPy][2]，用Java实现的[Jython][3] 以及用Microsoft .Net CLR实现的[IronPython][4]。如果你不是非常非常确定你自己要选用别的，就安装CPython吧。

换句话说，前面这堆关于VM和版本选择的建议在你看来不知所云，你需要的就是<a href="http://www.python.org/getit/" target="_blank">CPython 2.7.x版本</a>。

Python安装
----------

下载之后的.exe安装文件安装的时候有一个地方需要注意：如果你是在Vista/Win7这样的C盘权限控制异常严格的操作系统，最好用右键“Run as administrator”。这点也适用于你下载到的被其他人编译成exe发布的Python package。嗯，什么是package？

理解Package
-------------

Python没有一个内置的package管理体系。实际上Python下面一个package是什么也是一个很“不具体”的概念。就像前面提到的，Python下面的代码是以module为单位存在的。每个module既可以是一个只有一个函数的文件，也可以是一个包含了一个或者多个子module的目录。而module和package之间的区别是非常模糊的，每个module都可以被认为是一个package。

和所有的编程环境一样，在Python下面有一些函数和类是全局可见的（`str`，`len`，`Exception`等等），而另外一些需要通过`import`语句导入，比如：

``` python
>>>import os
>>>from os.path import basename, dirname
```

这里`import`被调用的时候，Python是从哪里把这些module导入的呢？其实，在你安装Python的时候，module的导入路径已经被自动设置过了。这个过程的具体实现是跟你运行的平台相关的，你可以通过`sys.path`来查看被设置的路径究竟是什么。比如本座的是：

``` bash
['',
'C:\\Python26\\lib\\site-packages\\demjson-1.4-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\anyjson-0.2.5-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\pmw-1.3.2-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\paramiko-1.7.6-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\treewidgets-1.0a1-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\mechanize-0.2.3-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\pylint-0.22.0-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\logilab_astng-0.21.0-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\logilab_common-0.53.0-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\unittest2-0.5.1-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\virtualenv-1.5.1-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\django_staticfiles-0.3.2-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\django_attachments-0.3dev-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\django_ajax_validation-0.1.4-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\django_email_confirmation-0.2.dev4-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\distribute-0.6.10-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\django_timezones-0.2.dev1-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\django-1.3-py2.6.egg',
'C:\ \Python26\\lib\\site-packages\\rbtools-0.3.2-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\django_debug_toolbar-0.8.4-py2.6.egg',
'C:\\Python26\\lib\\site-packages\\suds-0.4-py2.6.egg',
'C:\\Windows\\system32\\python26.zip',
'C:\\Python26\\DLLs',
'C:\\Python26\\lib',
'C:\\Python26\\lib\\plat-win',
'C:\\Python26\\lib\\lib-tk',
'C:\\Python26',
'C:\\Python26\\lib\\site-packages',
'C:\\Python26\\lib\\site-packages\\PIL',
'C:\\Python26\\lib\\site-packages\\wx-2.8-msw-unicode']
```

Python在导入的module的时候，是按照这个列表“自顶向下，见好就收”的方式运作的。也就是说如果你正好机器上有两个路径下面安装了同样名称的module，先被搜索到的那个就会被导入。有的时候，你确信自己受到了这种机制的干扰，也可以通过下面的办法来hack回来：

``` python
sys.path.insert(, 'path\\to\\your\\packages')
```

进行一段时间的Python开发过后你总是会有很多的包，于是这个办法你会觉得非常的方便。但是，请结合后面的内容默默记住，不到万不得已，不要这样hack。

##### **The PYTHONPATH**

`PYTHONPATH`是一个环境变量（可以win+break到高级设置里面去设置），可以简单的理解它就是Windows下面的`PATH`变量，不过只是对Python可见而已。在很多Python的教程里面，会说所有你想要让Python搜索module的路径，都应该加到这个变量对应的列表里面。

其实前面提到过，在Python安装的时候搜索路径已经被自动设置过一次。所以`PYTHONPATH`这个变量并不是必须加的。而且，作为开发环境满坑满谷的程序员，我们都喜欢把Path里面搞得干干净净的（比如本座干活都习惯在bat里面先设置相关的路径再起相应的Eclipse）。这种一启动就load一堆的办法，自己喜欢也可以用，但是更推荐后面会说的`virtualenv`。

##### **第三方package**

首先，入门之后要开始正经干活，你总是需要安装一些第三方的Package。安装的办法有：

1.  下载别人编译好的Windows的版本exe
2.  使用`pip`或者`easy_install`
3.  自己从代码安装

三种办法干的事情都是类似的：下载package的依赖包，编译（需要的话）和拷贝目标文件到一个默认的第三方Package路径。那么，哪里去找安装需要的文件呢？一般来说：

1.  Google
2.  [Python Package Index(or PyPI)][5]
3.  各种开源的代码库([Launchpad][6]/[GitHub][7]/[BitBucket][8]）

##### **安装别人编译好的exe**

注意下载的时候看清别人编译是在32还是64bit的Windows，Python的版本和你用的一致不一致。运行exe的时候注意右键Run as Administrator。就这么简单。

##### **使用pip**

`easy_install`已经慢慢失宠了，主要介绍一下它的替代品：`pip`。

`pip`是用来安装和管理Python Package的工具。它不是随Python默认安装的，因此需要额外安装。安装完毕之后我们就可以在命令行里面调用它来管理package了。比如你要安装`pygame`这个package，只需要：

<div class="wp_syntax">
  <div class="code">
    <pre class="python" style="font-family:monospace;">pip install pygame</pre>
  </div>
</div>

而如果你想删除它的话，则运行：

``` bash
pip uninstall pygame
```

`pip`默认会按照你指定的名字，搜索和安装最新的stable版本的包。但我们常常需要安装某个特定版本的包，这个时候需要你在命令行里面指定：

``` bash
pip install pygame==version_number
```

如果你安装的版本不对，可以通过`upgrade`命令升级/降级到指定版本：

``` bash
pip install pygame==version_number –upgrade
```

由于Python高度依赖开源团体，很多最新的package都没有在PyPI上面，我们常常需要从代码库直接安装package。在`pip`下面可以直接

``` bash 
$ pip install git+http://somedomain.com/path/to/git-repo#egg=packagename
$ pip install hg+http://somedomain.com/path/to/hg-repo#egg=packagename
$ pip install svn+http://somedomain.com/path/to/svn-repo#egg=packagename
```

当然，前提是git/hg/svn这些工具你都安装好了并且在命令行里面能够执行。

上面这些`egg`是什么蛋呢？你可以认为它们就是Package源代码和一些metadata打成的压缩包。`pip`会读取`egg`里面的`setup.py`文件，然后安装`egg`到你的文件系统。

##### **从Python源码安装**

从源代码安装虽然是最复杂的，但是也没那么复杂。把你下载的源代码解压之后，找到`setup.py`所在的路径，然后运行下面的命令：

``` bash
python setup.py install
```

也许你觉得这样也挺容易的，为啥要去用`pip`？因为：

*   省去你上网找源代码，解压，安装这些动作
*   更重要的是，`pip`不但装，而且管。你可以升级和降级一个Package。

##### **安装需要编译的package**

这种一般是因为Package里面有c/cpp的代码。如果你能找到别人编译好的exe文件或者用`pip`，最好不要自己折腾。只有非常非常罕见的情况下你需要自己编译，过程中一般来说都会需要用`cygwin`之类的东西，在前面几次你可以多看看每个Package的`readme`关于编译的说明。

开发环境
---------

##### **virtualenv**

`virtualenv`无疑是当前Python开发者心中“必知必会”类的工具了。`virtualenv`主要就是提供一个“独立的”Python开发环境。为什么需要“独立”的开发环境？在不知道`virtualenv`之前Python包满坑满谷的本座自然是有很多槽可以吐，不过最好的答案是`virtualenv`的文档里面说的：

{% blockquote %}
The basic problem being addressed is one of dependencies and versions, and indirectly permissions. Imagine you have an application that needs version 1 of LibFoo, but another application requires version 2. How can you use both these applications? If you install everything into /usr/lib/python2.7/site-packages (or whatever your platform’s standard location is), it’s easy to end up in a situation where you unintentionally upgrade an application that shouldn’t be upgraded.
{% endblockquote %}

简单来说，就是每个工程使用自己独立的`virtualenv`进行开发，所有该工程需要依赖的Package都安装在这个`virutalenv`里面。`virutalenv`的安装同样是使用`pip`：

``` bash
$ pip install virtualenv
```

然后就可以建立属于自己项目的开发环境：

``` bash
D:\Lenciel\Temp mkdir my_project_env
 
D:\Lenciel\Temp\virtualenv --distribute my_project_env
 
  New python executable in my_project_env\Scripts\python.exe
  Installing distribute.................done.
```

建立的目录下面会自动的安装好`pip`等工具：

``` bash
-my_project_env
  |-- Scripts # -- Python解释器的拷贝/pip脚本/activiate脚本/deactivate脚本等
  |-- Lib     # -- 所有库（包括激活后使用pip安装的库都会放在这里
```

在命令行执行activate脚本就可以激活你新建的环境。环境被激活后，主要通过下面两个功能保持独立完整性：

1.  当你在被激活的环境里面使用`pip`安装一个Package的时候，它只会被安装在这个工作目录下面
2.  当你`import`的时候，会先从工作目录下面去搜索，然后才会搜索系统目录下的

需要注意的是，在系统目录下面安装的包，对所有的`virtualenv`建立的环境都是可见的。如果你不想在你建立的`virtualenv`里面看到这些包，可以使用`--no-site-packages`参数建立开发环境：

``` bash
$ virtualenv my_project_venv --no-site-packages
```

其他的工具
---------

##### **编辑器**

在不同的项目里面本座用过Vim/Sublime text 2/Eclipse+PyDev/PyCharm。现在Vim和PyCharm用得比较多一点，PyDev一直有一些诡异的问题。比如那个“<a href="https://www.google.com.hk/search?num=30&hl=en&newwindow=1&c2coff=1&safe=strict&site=&source=hp&q=Unresolved+import+pydev&btnK=Google+Search&qscrl=1" target="_blank">Unresolved import</a>”从一开始到现在都好像没有被真正解决过。

##### **编码规范**

[PEP 0008][9]推荐了非常完整的一套编码规范，目的就是让全世界编写Python脚本的同学们用相同的方式去对齐代码，命名变量、类和函数。每个严肃的Pythoner都应该认真的学习和理解这些规范，并且贯彻执行。

##### **Python标准库**

Python的标准库提供了相当完备的功能。就像Java的工程师需要熟悉系统自带的API文档一样，了解标准库的用法是非常有好处的。另外，这些标准库都是很好的范例，特别是在支持跨平台使用这方面。

官方文档在<a href="http://docs.python.org/library/" target="_blank">这里</a>。

嗯哼
----

前面列了不少东西，只是希望给新手一个上路指引。Python下面有用的工具，有趣的包很多很多。随着你学习和应用这门语言，不断深入它，你会自己慢慢发觉那些你自己最需要/愿意熟悉的部分。

Python的另外一大财富就是它的开源社区，条件成熟的时候，你也应该参与到这样的开发活动里面去。

最后是每个Pythoner都津津乐道的Zen Of Python送给刚开始学习的朋友。

``` python
>>>import this
The Zen of Python, by Tim Peters
 
Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
```

Happy Pythoning…!!

 [1]: http://python3wos.appspot.com/
 [2]: http://pypy.org/
 [3]: http://www.jython.org/
 [4]: http://ironpython.net/
 [5]: http://pypi.python.org/pypi
 [6]: https://launchpad.net/
 [7]: http://github.com/
 [8]: https://bitbucket.org/
 [9]: http://www.python.org/dev/peps/pep-0008/