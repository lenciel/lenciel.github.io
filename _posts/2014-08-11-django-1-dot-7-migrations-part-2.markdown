---
layout: post
title: "Data Migration in Django 1.7 (2)"
date: 2014-08-11 03:59:47 +0800
comments: true
categories: 
- django
- tutorial
---

在应用开发的过程中，我们会遇到migration主要分为：

1. Schema Migrations：数据库schema的变化，也就是我们前面[讨论的内容](http://lenciel.com/2014/08/django-1-dot-7-migrations/)
2. Data Migrations：数据的变化，比如需要批量变更数据或者备份在其他地方的历史数据

第二种是没法敲几条命令让Django自动帮你完成其他的事情的，而是需要手动使用`RunPython`，这里具体说一下做法。

还是以之前的那个项目来作为例子，我们首先创建一个migration file：

```bash
$ python manage.py makemigrations --empty ts_data

Migrations for ts_data:
  0003_auto_20140811_0110.py:
```

它的内容如下：

```python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ts_data', '0002_auto_20140805_1525'),
    ]

    operations = [
    ]
```

我们在里面加入一个`RunPython`的部分，来导入数据：

```python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from ts_data.models import PingPongPrice


def load_data(apps, schema_editor):
    PingPongPrice(date=date(2014,07,29),
         price=12.00,
         ).save()
    PingPongPrice(date=date(2014,01,29),
         price=8.00,
         ).save()


class Migration(migrations.Migration):

    dependencies = [
        ('ts_data', '0002_auto_20140805_1525'),
    ]

    operations = [migrations.RunPython(load_data)]
```

如果你觉得：咦，这样导入数据不是有点儿像用`syncdb`然后导入`fixture`么？的确，从效果上它们是一样的，个人觉得，对于测试环境我们可以继续使用fixture来保存mock的测试数据，然后使用`loaddata`命令手动加载测试数据。对生产环境使用migration来导入数据更好，和使用`loaddata`命令来导入fixture相比，它不需要手动操作，并且由于是通过`RunPython`来进行，实际上可以对数据进行各种需要的处理。


