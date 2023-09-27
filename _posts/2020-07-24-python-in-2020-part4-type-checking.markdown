---
layout: post
sidenote: false
comments: true
title: "Python in 2020 (4) - 类型检查"
date: 2020-07-24 12:06:18 +0800
categories:

- python
- notes

---

编程语音的[类型系统](/2016/09/types-in-programming-languages/)其实是非常重要的。

但作为一种弱类型语言，Python 的类型检查是非常困难的。但自从 3.5 版本加入了 [type annotation](https://docs.python.org/3/library/typing.html)，很多工具变得强大了起来。

目前，[mypy](http://mypy-lang.org/) 是这个领域最值得关注的。几个大厂也各自有自己的实现[^1]，有些 IDE 比如 PyCharm 还自带一个类型检查工具，但这里主要说一下 mypy 的使用。

<h3>目录</h3>

- TOC
{:toc}

### 静态类型检查

安装 mypy：

```
$ poetry add --dev mypy
```

在 Nox 里面添加一个 session：

 ``` python
@nox.session(python=["3.8", "3.7"])
def mypy(session):
    args = session.posargs or locations
    install_with_constraints(session, "mypy")
    session.run("mypy", *args)
```

然后就可以运行了：

```
$ nox -rs mypy
```

为了控制可以编辑 `‌mypy.ini` 配置文件，比如：

```ini
# mypy.ini
[mypy]

[mypy-nox.*,pytest]
ignore_missing_imports = True
```

### 类型声明和检查

如果类型检查只是装个工具扫描现有的类型意义就不大了。它更大的作用是支持自定义类型并检查。

假设我们有下面这样的函数，返回的是一个页面的 json 格式对象：

```python
def get_page(): ...
```

我们想要给它声明一个类型，但它不是 Python 自带的 str/list/dict 等类型可以覆盖的，所以我们可以声明为一个使用 [dataclasses](https://docs.python.org/3/library/dataclasses.html) 定义的 Page：

```python
from dataclasses import dataclass


@dataclass
class Page:
    title: str
    extract: str

def get_page() -> Page: ...
```

那么，在测试的时候如何进行 Page 的构造呢？可以使用 [marshallow](https://marshmallow.readthedocs.io/en/stable/) 和 [dessert](https://desert.readthedocs.io/) 。前者是一个数据序列化/反序列化的工具，后者则是以 marshallow 打底使用 dataclass 的 annotation 生成序列化 schema 的工具。

安装：

```
$ poetry add desert marshmallow
```

添加依赖：

```
# mypy.ini
[mypy-desert,marshmallow,nox.*,pytest]
ignore_missing_imports = True
```

这样我们就可以代码里面使用 dessert ：

```python
from dataclasses import dataclass

import click
import desert
import marshmallow
import requests


API_URL: str = "https://test.com/api/rest_v1/page/random/summary"


@dataclass
class Page:
    title: str
    extract: str


schema = desert.schema(Page, meta={"unknown": marshmallow.EXCLUDE})


def get_page() -> Page:
    url = API_URL.format()

    try:
        with requests.get(url) as response:
            response.raise_for_status()
            data = response.json()
            return schema.load(data)
    except (requests.RequestException, marshmallow.ValidationError) as error:
        message = str(error)
        raise click.ClickException(message)
```

这样在测试中也就可以直接进行类型检查了：

```python
# tests/test_get_page.py
def test_get_page(mock_requests_get):
    page = test.get_page()
    assert isinstance(page, test.Page)
```

