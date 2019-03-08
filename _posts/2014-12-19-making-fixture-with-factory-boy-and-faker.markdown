---
layout: post
title: "Making fixture with factory boy and faker"
date: 2014-12-20 03:14:59 +0800
comments: true
categories:

- django
- testing
- tools-i-use

---

我们在Django项目的开发和测试过程中经常需要mock一些数据作为[fixture](https://docs.djangoproject.com/en/1.7/howto/initial-data/)，比较常见的做法是：

1. 进行一些操作创建测试数据
2. 使用`dumpdata`命令导出json格式的数据
3. 以导出的json为模板构造测试数据用`loaddata`命令导入到数据库

这样对于大多数场景也算够用了，但是你总会遇到某一天客户走来说：“我想看看那个报表生成出来啥样，能不能创建两千条记录？”

这种时候你大概你第一反应是把之前那个json搞来copy-paste出两千份数据。但很快你就会意识到那是不行的：要构建一个对象，你常常需要先构建它外键的对象，而实际上线的项目它的数据库结构是非常复杂的（数据库结构图的生成见[这里](http://lenciel.com/2014/12/integrate-schemaspy-with-sphinx-build-for-django-database-design-visualization/)），所以构建两千条记录的工作量会远远超过你的想象：

![schemaSpy](/downloads/images/2014_12/database_design_visualization.png "schemaSpy...")

最近本座试用了[factory boy](https://github.com/rbarrois/factory_boy/)和[faker](https://github.com/joke2k/faker)的组合，感觉还比较好用。

## Factory Boy

最开始找这类批量生成测试数据的库，主要考察的是[Model Mommy](https://github.com/vandersonmota/model_mommy)和[Factory Boy](https://github.com/rbarrois/factory_boy/)。看了一下文档感觉两者的差别并不算很大，但是[Factory Girl](http://movie.douban.com/subject/1898357/)里面的[Sienna Miller](http://movie.douban.com/celebrity/1003485/)实在是让人过目不忘所以有什么好犹豫的呢？

Factories的文档上说明了基本的用法，需要注意的主要是如何生成有一定依赖关系的一组测试对象。

### 数据构造

Factory Boy下的数据构造主要是通过`Sequence`和`Fuzz`两个包来完成。

`Sequence`故名思议是顺序生成的，比如你要让生成的数据有规律的用户名和电话号码，这样你看到电话`13000000001`就是是对应`user0001`：

``` python

user = Sequence(lambda n: u'user%04d' % n)
phone = Sequence(lambda n: u'1300000%04d' % n)

```

而`Fuzz`则是随机的，主要用来构造像学校、专业或者生日这样的数据：

``` python

card_bank = FuzzyChoice([u'中国银行', u'中国招商银行', u'中国工商银行',
                      u'中国建设银行', u'成都银行'])
major = FuzzyChoice([u'地球物理学', u'大气科学', u'海洋科学', u'力学',
                  u'农业工程', u'环境科学', u'心理学', u'统计学',
                  u'系统科学', u'地矿', u'机械', u'仪器仪表',
                  u'能源动力', u'电气信息', u'土建', u'测绘',
                  u'环境与安全', u'化工与制药', u'交通运输', u'海洋工程;',
                  u'航空航天', u'武器', u'工程力学', u'生物工程',
                  u'公安技术', u'材料科学', u'材料', u'水利',
                  u'林业工程', u'轻工纺织食品', u'电子信息科学', u'其他'])
birthday = FuzzyNaiveDateTime(dt.datetime(1992, 1, 1), dt.datetime(1996, 1, 1))

```

当然，有的字段，比如姓名、地址这类通过顺序或者是随机的从某个设定的集合抽取效果都不够理想，后面会看到怎么用[faker](https://github.com/joke2k/faker)来构造它们。

### 关联对象生成

关联对象的关系有很多种(1:1, 1:n, n:1, n:n)，主要都是通过组合运用`SubFactory`和`RelatedFactory`两者来生成，但具体的构造方式和先构造谁都要以实际情况而定。比如我们有User和Tester这样的1:1的关系：

``` python

class Tester(TimeBaseModel):

    user = models.OneToOneField(User,
                                verbose_name=u'账号',
                                related_name='tester')
    ...

```

这里在考虑是在`TesterFactory`里面把`User`作为`SubFactory`来生成，还是在`UserFactory`里面把`Tester`作为`RelatedFactory`来生成，主要就是看先后关系。很显然，在这里我们应该先构造系统里的User：

``` python

class TestUserFactory(UserFactory):
    ...
    tester = RelatedFactory('apps.tester.factories.TesterFactory', 'user')

```

这段代码告诉系统，在每个`TestUser`被构造的时候，用构造出来的`user`来创建一个1:1的`Tester`。这个`Tester`的构造会在`user`的`save`之前完成。

然后在`Tester`的构造过程中你可以直接通过`SelfAttribute`使用传入的`user`:

``` python

class TesterFactory(DjangoModelFactory):
    ...
    phone = SelfAttribute('user.phone')
    nick_name = SelfAttribute('user.nick_name')
    creator = SelfAttribute('user')

```

再比如，我们的`Tester`和`PlatformTask`都会关联到测试任务`TesterTask`，它们俩看起来都是`ForeinKey`。

```python

class TesterTask(TestingDeviceMixin, TimeBaseModel):
    owner = models.ForeignKey(Tester,
                              verbose_name=u'测试人', )

    platform_task = models.ForeignKey(PlatformTask,
                                      verbose_name=u'任务',
                                      related_name=u'tester_tasks')

```

但对生成数据而言，我们的目标会是每个`Tester`在被创建的时候，都给它创建一个以这个`Tester`为`owner`的`TesterTask`，并且给这个`TesterTask`创建一个关联的`PlatformTask`。

于是我们的写法就会是，首先在`TesterFactory`里面使用`RelatedFactory`来创建`TesterTask`:

``` python

class TesterFactory(DjangoModelFactory):
    ...
    tester_task = RelatedFactory('apps.tester.factories.TesterTaskFactory', 'owner')
    ...

```

然后在`TesterTaskFactory`里面创建`PlatformTask`，并且在构造的时候使用传入的`owner`的参数：

``` python

class TesterTaskFactory(DjangoModelFactory):
    ...
    platform_task = SubFactory('apps.platformtask.factories.PlatformTaskFactory',
                               company=SelfAttribute('..owner.user.company'),
                               owner=SelfAttribute('..owner.user'))
    ...

```



## faker

有很多字段，比如姓名、地址这些，纯粹用Fuzz的办法很难做到“贴近真实”。[faker](https://github.com/joke2k/faker)就是用来解决这类字段的。

``` python

from faker import Factory
fake = Factory.create()

fake.name()
# 'Lucy Cechtelar'

fake.address()
# "426 Jordy Lodge
#  Cartwrightshire, SC 88120-6700"

fake.text()
# Sint velit eveniet. Rerum atque repellat voluptatem quia rerum. Numquam excepturi
# beatae sint laudantium consequatur. Magni occaecati itaque sint et sit tempore. Nesciunt
# amet quidem. Iusto deleniti cum autem ad quia aperiam.
# A consectetur quos aliquam. In iste aliquid et aut similique suscipit. Consequatur qui
# quaerat iste minus hic expedita. Consequuntur error magni et laboriosam. Aut aspernatur
# voluptatem sit aliquam. Dolores voluptatum est.
# Aut molestias et maxime. Fugit autem facilis quos vero. Eius quibusdam possimus est.
# Ea quaerat et quisquam. Deleniti sunt quam. Adipisci consequatur id in occaecati.
# Et sint et. Ut ducimus quod nemo ab voluptatum.

```

这个包最可爱的地方就是支持本地化，比如一个随机的中文姓名可以这么去构造：

``` python

faker = FakerFactory.create('zh_CN')
name = lazy_attribute(lambda x: faker.name())

```

## 生成fixture

因为[factory boy](https://github.com/rbarrois/factory_boy/)和[faker](https://github.com/joke2k/faker)主要的作用是在测试里面去mock数据，所以要用它们生成fixture不是那么容易。这是因为Django的整个设计上就很注意避免你把测试的数据写到生产的数据库，所以测试都会在一个在`Setup`阶段被创建，在`TearDown`阶段被删除的临时数据库里面进行（我看了一下，在开发版本的Django上已经加了一个`--keepdb`的参数使得你可以[保留你用来运行测试的数据库了](https://docs.djangoproject.com/en/dev/ref/django-admin/#django-admin-option---keepdb)）。

所以我们可以在一个测试的`Setup`阶段把数据生成后，直接调用`dumpdata`命令来把数据`dump`出去：

``` python

def setUp(self):
    company = CompanyFactory.create(id=3)
    TestUserFactory.create(company=company, id=3000)
    TestUserFactory.create_batch(company=company, size=1500)

    #for test_user in test_users:

    create_fixture('tester', 'tester.json')
    create_fixture('account', 'account.json')

```

注意，这里在创建的时候指定id主要是为了让初始的id比较大，避免和系统里面已经有的id撞车导致你构造的测试数据在`loaddata`的时候报错或者覆盖现有数据。

其中，`create_fixture`函数内容如下：

``` python
def create_fixture(app_name, filename):
    buf = StringIO()
    management.call_command('dumpdata', app_name, indent=4, stdout=buf)
    buf.seek(0)
    with open(filename, 'w') as f:
        f.write(buf.read().encode('utf-8'))
```

