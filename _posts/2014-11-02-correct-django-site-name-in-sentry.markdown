---
layout: post
title: "Correct Django Site Name During DB Migration"
date: 2014-11-02 16:50:40 +0800
comments: true
categories:

- django
- sentry
- pitfall
---

![Vhost threshold](/downloads/images/2014_11/sentry_incorrect_site.png "Don't touch me...")

Problem
==========

就像截图上显示的那样，真正上线过的Django项目都会好像被施放过诅咒一般，让你在某一天看到那个诡异的`example.com`。

它可能是在系统发出去的重置密码的邮件里面，可能是在Sentry显示的日志里面，也可能就在你用 `site_name` tag渲染的模板里面。

这个诅咒来自于Django的[sites framework](https://docs.djangoproject.com/en/1.6/ref/contrib/sites/)的设计。简单来说，它提供了一个Site对象的`manager`，来**方便**你用一套代码给多个部署环境使用。换句话说，虽然`settings.py`文件里面也有一个`SITE_NAME`，但其实用`Site.objects.get_current().name`或者是模板里面的`site_name`取到的不是那个值，而是数据库`django_site`里面某个`site_id`对应的Site对象的`name`。

而如果你`syncdb`之后没有手工修改过，`Site`的`domain`和`name`都被默认初始化为`example.com`，这就是问题所在了。

Solution
===========

stackoverflow上[得票最高的答案](http://stackoverflow.com/questions/3430451/using-django-settings-in-templates)这样把`site_name`放到`response`的`local()`里面或者是直接做个`context_processor`是可以的。但这样的坏处是完全抛弃了Django自带的`sites`，需要在用的地方都专门的处理。

如果要继续使用自带的`sites`，就得自己写类似下面的fixture：

```
[
  {
    "pk": 1,
    "model": "sites.site",
    "fields": {
      "name": "LeiFun Production",
      "domain": "leifun.net"
    }
  },
  {
    "pk": 2,
    "model": "sites.site",
    "fields": {
      "name": "LeiFun Stage",
      "domain": "stage.leifun.net"
    }
  },
  {
    "pk": 3,
    "model": "sites.site",
    "fields": {
      "name": "LeiFun Test",
      "domain": "test.leifun.net"
    }
  },

  {
    "pk": 4,
    "model": "sites.site",
    "fields": {
      "name": "LeiFun Local Dev",
      "domain": "yawp.dev:8000"
    }
  }
]
```

然后在部署的环境里面用`django_admin.py`或者`manage.py`运行`loaddata`。这样的坏处是`fixture`这东西本来主要是给本地测试生成mock数据的，所以`syncdb`命令其实不会发起fixture的导入，于是很多时候你部署了新版本之后，会忘记重新导入`fixture`（其实本来也不该导入fixture)，牛皮癣一样的`example.com`又回来了。

Solution 2
===========

通过修改某个现成app的`Migration`类的`forwards`方法，强制它读取一次`settings`文件里面的配置项：

```python
class Migration(DataMigration):

    def forwards(self, orm):
        Site = orm['sites.Site']
        site = Site.objects.get(id=settings.SITE_ID)
        site.domain = settings.DOMAIN_NAME
        site.name = settings.SITE_NAME
        site.save()
 ```

这样一来，就可以在`syncdb`的时候刷新`django_site`这张表的配置。

Solution Finally
==============

在Django 1.7里面，这个倒霉的设计[终于被改掉了](https://docs.djangoproject.com/en/dev/ref/contrib/sites/?from=olddocs)。

{% blockquote %}
To enable the sites framework, follow these steps:

1. Add 'django.contrib.sites' to your INSTALLED_APPS setting.
2. Define a SITE_ID setting
3. Run migrate.

django.contrib.sites registers a post_migrate signal handler which creates a default site named example.com with the domain example.com. This site will also be created after Django creates the test database. To set the correct name and domain for your project, you can use a data migration.
{% endblockquote %}

不但如此，Django 1.7 还引入了`django.contrib.sites.middleware.CurrentSiteMiddleware`， 如果启用，就可以直接使用`request.site`而不需要在你的`view`里面自己去调用`site = Site.objects.get_current()`了。
