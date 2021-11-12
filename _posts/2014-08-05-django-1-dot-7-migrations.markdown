---
layout: post
title: "Data Migration in Django 1.7 (1)"
date: 2014-08-05 11:12:41 +0800
comments: true
categories:
- django
- tutorial
---

Django 1.7 已经发布一段时间了，基本上这个版本最主要的改动就是加入了`migrations`。

在过去，几乎所有的 Django 项目都是用 South 来处理数据变更的。而在 Django1.7 版本，South 的作者 Andrew Godwin 把`migrations`加到了 Django Core 里面。

So...

Migrations是什么？
=============

Migrations 其实就是一堆帮助你完成数据库变更和数据迁移的命令，使得你可以用「Django」的方式来管理和变更数据库的 schema。比如，当你的 model 改变了，你需要在数据库里面去重命名一列时，你不会想跑到命令行下面去敲 SQL 吧？特别是，如果你要变更的数据库是线上的，有几百万用户数据，你应该更不愿意搭上这种活了吧？

Migrations 让事情变得简单可控：

1. 它使得数据库 schema 的调整可以通过 Django 命令来完成
2. 它使得数据库的 schema 和对应的 model 的变更被 track 起来：整个历史都可以版本化在 Git 里面
3. 提供了一套匹配 schema 和对应的 fixture 的机制
4. 如何和 CI 搭配起来，可以保证代码和数据一致性

Migrations上手
=============

创建测试项目
-------------

首先创建一个 virtualenv 和 django 项目：

```bash
$ mkvirtualenv django17
$ pip install https://www.djangoproject.com/download/1.7c2/tarball/
$ django-admin.py startproject django_migration_test
$ cd django_migration_test
$ python manage.py startapp ts_data
```

然后创建一个 model 到 subl ts_data/models.py：

```python
from django.db import models

# Create your models here.
class PingPongPrice(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)
```

subl django_migration_test/settings.py

```python
INSTALLED_APPS = (
    ...
    'ts_data',
)
```



创建Migrations
----------------

使用下面的命令可以创建 ts_data 这个 app 的 Migrations。当然，和大多数 Django 命令一样，如果你不显式的指定，就

```
(django17) ○ python manage.py makemigrations ts_data
Migrations for 'ts_data':
  0001_initial.py:
    - Create model PingPongPrice
```


应用Migrations
----------------

```bash
(django17) ○ python manage.py migrate
Operations to perform:
  Apply all migrations: admin, contenttypes, ts_data, auth, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying sessions.0001_initial... OK
  Applying ts_data.0001_initial... OK
```

注意，因为是一个全新的 app，这条命令会先建表，换句话说，之前版本的`syncdb`命令可以不用了。整个使用流程应该变成：

1. 建立或者更新一个 model
2. 运行`python manage.py makemigrations <app_name>`
3. 运行`python mange.py migrate <app_name`来应用创建的 Migrations
4. 重复前面的步骤

不是新建的项目如何使用
===================

大多数情况下我们都是从旧版本的 Django 迁移过来，也就意味着是从 South 迁移过来。这种情况下需要：

1. 删除所有的 South 创建的 migration 文件
2. 运行 `./manage.py makemigrations`，Django 会根据你当前 model 来创建那份`initial migrations file`
3. 运行`./manage.py migrate`，Django 会把已经存在的数据库 table 当成是 migration 的产物，完成整个 migration

如果你运行上面的命令遇到错误，就需要运行 `./manage.py migrate --fake <appname>` 做一个 fake 的 migration。

如果你不想丢掉过去的 South 维护的历史记录，可以同时使用 South 和 Django Migrations：升级 South 到 1.0，然后[参考这篇文章的做法](http://www.aeracode.org/2014/7/1/end-era/)。

South和Django Migrations比较
=====================

对比一下 South 和 Django Migrations 的 workflow，可能会更加清晰：

首次全新migrations
--------------------

South:

```python
./manage.py syncdb
./manage.py schemamigration <appname> --initial
```

Django Migrations:

```python
./manage.py makemigrations <appname>
```

应用migrations
--------------------

South:

```python
./manage.py migrate <appname>
```

Django Migrations:

```python
./manage.py migrate <appname>
```


非首次migrations
--------------------

South:

```python
./manage.py schemamigration <appname> --auto
```

Django Migrations:

```python
./manage.py makemigration <appname>
```

可以看到，大概是因为出自同一个作者的原因，Django Migrations 基本上 follow 了 South 的工作流程，只不过是命令更加简洁和清晰了。

更多细节
=============

哪些变化会被Django Migrations找到？
----------------------------------

如果你再次运行`python manage.py migrate`，会发现什么都没有发生：这是因为在项目的数据库中有一张`django_migrations`仍然被更新。表，记录了哪些 Migrations 已经被应用过了：无论是运行了 migrate 还是 fake 的，这个表都会被插入一条记录。比如从 South 升级到使用 Django 自带的 MigrationsDjango 会检查是否有更新。如果没有，它就 fake 一次，但`django_migrations`仍然被更新。

在少数情况下，确实有需要再次运行某个特定的 Migrations，我们可以在`django_migrations`里面把这个记录删除掉。

在极少数情况下，如果你有需要回退到特定的版本，比如最初的 zero 版本，可以用类似`python manage.py migrate <app_name> zero`的语法。


Migration 文件
-----------------

在我们运行`python manage.py migrate <app_name>`究竟发生了什么？实际上，Django 会创建一个 python 文件来描述如何完成这个 migration，以前面的 ts_data 为例，这个文件位于`ts_data/migrations/0001_initial.py`，内容如下：

```python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PingPongPrice',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('price', models.DecimalField(max_digits=5, decimal_places=2)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
```

可以看到，是完全可读的 Python 代码。这也是为什么推荐把整个`migrations`文件夹加入版本控制的原因：这样你的应用经过了怎样的变更就变得可以回溯了。

Migration Dependencies
-------------------------

上面的源代码有一些值得注意的地方。

首先，所有的 migration file 里面都有一个`Migration()`类，继承自`django.db.migrations.Migration`。在我们运行`migrate`命令的时候，运行的就是这个类。

这个类有两个 list，一个是`dependencies`，一个是`operations`。

`dependencies`定义了这个 migration 之前必须完成的操作，比如你的 model 里面包括一个外键，那么你得首先有对应的 table。比如，假设外键指向的 model 在`app_1`，那么`dependencies`会像这样：

```python
dependencies = [
   ('main', '__first__'),
]
```

如果没有前置条件，这个 list 可以为空。但大多数时候`dependencies`是指向其他的 migration 文件。比如：

```python
dependencies = [
    ('main', '0001_initial'),
]
```

这里使用 list 的结果是，所有的依赖是没有顺序的，也就是说你不需要按照 0001、0002、0003 的顺序来排列所有的依赖。

Migration Operations
----------------------

这个 list 定义的就是 migration 完成的操作，可以分为下面的这些种类：

* CreateModel
* DeleteModel
* RenameModel
* AlterModelTable
* AlterUniqueTogether
* AlteIndexTogether
* AddField
* RemoveField
* RenameField
* RunSQL
* RunPython

前面的那些操作是整个 Django Migrations 的核心：因为需要对各种不同的数据库做适配。而后面的两个操作则是灵活度非常高的，几乎可以干任何事情。

实例
======

让我们试试把`PingPongPrice`的`price`这个 field 的`max_digits`改成 8 位的（通货膨胀嘛），然后再次运`makemigrations`行命令:

```bash
(django17) ○ python manage.py makemigrations ts_data
Migrations for 'ts_data':
  0002_auto_20140805_1525.py:
    - Alter field price on PingPongPrice
```

可以看到这次生成的 migration 文件里面有`AlterField`操作：

```python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ts_data', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='PingPongPrice',
            name='price',
            field=models.DecimalField(max_digits=8, decimal_places=2),
        ),
    ]
```






