---
layout: post
title: "Fix Python after upgrade to Maverick"
date: 2013-10-24 22:02
comments: true
categories: 
- python
- tips
---

升级到最新的osx版本Maverick之后，打开iTerm2就报错：


```bash
Traceback (most recent call last):
  File "<string>", line 1, in <module>
ImportError: No module named virtualenvwrapper.hook_loader
virtualenvwrapper.sh: There was a problem running the initialization hooks.
If Python could not import the module virtualenvwrapper.hook_loader,
check that virtualenv has been installed for
VIRTUALENVWRAPPER_PYTHON=/usr/bin/python and that PATH is
set properly.
```

敲pip之后也报错：


```bash
Traceback (most recent call last):
  File "/usr/local/bin/pip", line 5, in <module>
    from pkg_resources import load_entry_point
  File "/System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python/pkg_resources.py", line 2603, in <module>
    working_set.require(__requires__)
  File "/System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python/pkg_resources.py", line 666, in require
    needed = self.resolve(parse_requirements(requirements))
  File "/System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python/pkg_resources.py", line 565, in resolve
    raise DistributionNotFound(req)  # XXX put more info here
pkg_resources.DistributionNotFound: pip==1.3.1
```

这坨`pkg_resources.DistributionNotFound`的错正好前两天装CentOS的机器[看到过](http://stackoverflow.com/questions/7446187/no-module-named-pkg-resources)。

运行下面的命令更新了`setuptools`之后重装了`pip`和`virtualenv`、`virtualenvwrapper`就好了：

```bash
wget https://bitbucket.org/pypa/setuptools/raw/bootstrap/ez_setup.py
sudo python ez_setup.py
sudo easy_install -U pip
```