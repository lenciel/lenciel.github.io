---
layout: post
title: "Integrate schemaSpy with Sphinx build"
date: 2014-12-18 00:26:32 +0800
comments: true
categories:

- tools-i-use
- tips

---


![schemaSpy](/downloads/images/2014_12/schemaSpy.png "schemaSpy...")

在做项目的时候，客户或者合作的部门常常问研发要“数据库设计”。在古代，瀑布式开发的第一个阶段是做架构设计和写文档，所以这样的需求一般都能被“充分满足”。而在我们现在的项目节奏和迭代速度都很快，数据库的设计在项目初期经常也在变化，如何能够比较方便的文档化这些变更？

对开发团队内部来说，我个人觉得Django的South或者是1.7之后加入的[Migration](http://lenciel.com/2014/08/django-1-dot-7-migrations/)里面每次变更生成的migration文件就已经足够开发人员了解底层的设计发生了什么变化。

而对外提供的文档，主要是在更高层级进行设计的沟通，所以之前我们一般是通过[django-extension](https://github.com/django-extensions/django-extensions)里面的`graph_models`命令来生成简单的关系图：

``` bash
# Create a PNG image file called my_project_visualized.png with application grouping
$ ./manage.py graph_models -a -g -o my_project_visualized.png
```

效果如下：

![django-extension-sample](/downloads/images/2014_12/django_extension.svg "django-extension-sample...")

这里的图是通过[graphviz](http://www.graphviz.org/)来完成的，可以看到一般的了解也足够了，但是缺点主要是：

1. 生成的关系图比较简陋
2. 由于是图片，一旦表比较多浏览起来并不是那么灵活

## 使用schemaSpy

于是在新的项目里面本座选用了看起来更美好的[schemaSpy](http://schemaspy.sourceforge.net/)，因为：

1. 轻量但支持多种数据库（jdbc），针对Django的test/stage/prod环境都可以使用
2. [功能非常强大](http://schemaspy.sourceforge.net/sample/)，并且有命令行支持，可以集成到CI

不过和大多数开源工具一样，它的文档也是乱糟糟的。以开发环境为例，我们一般使用sqlite作为数据库，要在Mac下面成功运行schemaSpy连接sqlite，你需要：

1. 下载最新的[SchemaSpy jar包](http://sourceforge.net/projects/schemaspy/files/)
2. 下载最新的[Xerial Sqlite JDBC jar](https://bitbucket.org/xerial/sqlite-jdbc
)包`sqlite-xerial.jar`
3. 创建一个`sqlite-xerial.properties`文件，内容如下：

    ```
    # Use -dp to override.
    description=SQLite
    connectionSpec=jdbc:sqlite:<db>
    db=database name
    driver=org.sqlite.JDBC
    #you may need to put the full path to the driver depending on your setup
    driverPath=sqlite-jdbc-3.8.7.jar
    selectTablesSql=.tables
    ```

4. 运行命令：

    ```
    java -jar schemaSpy_5.0.0.jar -t  sqlite-xerial.properties -db ../src/default.db  -o django-testbird -sso
    ```

会看到有`warning`，但是无需惊慌，我看了一下是schemaSpy的作者没有正确的处理`[]`。


## 集成到Sphinx

因为我们的项目都使用了Jenkins自动启动Sphinx来生成文档，所以理想的情况当然是：

1. 修改Django下某个app的`models.py`
2. `make migration`生成migrations文件
3. 代码提交并push到gitlab
4. Jenkins调用`django management command`完成表结构的变更
5. Jenkins自动更新包括数据库设计在内的文档

要实现#5，最简单的办法是在Sphinx文档目录下的`Makefile`里面加一个`target`：

``` java
dbv:
    java -jar schemaSpy_5.0.0.jar -t sqlite-xerial.properties -db ../src/default.db  -o _db_virtualization/django-testproject -sso
```

然后在Jenkins调用的脚本里面加上`make dbv`就可以了。
