---
layout: post
comments: true
title: "Python in 2020 (2) - 测试框架"
date: 2020-07-24 02:06:18 +0800
categories: 

- python
- notes

---

<h3>目录</h3>

- TOC
{:toc}

### 单元测试：pytest

虽然 Python 自带了 [unittest](https://docs.python.org/3/library/unittest.html) 框架，但是 [pytest](https://docs.pytest.org/en/latest/) 基本上是事实标准。

使用 Poetry 来安装 pytest：

```
$ poetry add --dev pytest
```

pytest 的具体用法这里不说了，只是在使用了 poetry 的情况下，记得用正确的方法来运行：

```
$ poetry run pytest
```

### 单元测试覆盖率：Coverage.py

在进行单元测试的时候，经常需要统计覆盖率，在 Python 开发中通常使用 [Coverage.py](https://coverage.readthedocs.io/) 。当选择了 pytest 作为测试框架的时候，可以安装 [pytest-cov](https://pytest-cov.readthedocs.io/en/latest/) 这个插件，它的底层就是 Coverage.py：

```
$ poetry add --dev coverage -E toml pytest-cov
```

这里 `toml` 的参数主要是为了后面让 Coverage.py 可以从 `pyproject.toml` 里面去读取一些配置。因为如果这个时候运行会发现它会统计所有项目路径下的测试覆盖率，包括虚拟环境里的：

```
$ poetry run pytest --cov
=========================================== test session starts ===========================================
platform darwin -- Python 3.8.1, pytest-5.4.3, py-1.9.0, pluggy-0.13.1
rootdir: /Users/lenciel/Projects/engineering/test
plugins: cov-2.10.0
collected 0 items


---------- coverage: platform darwin, python 3.8.1-final-0 -----------
Name                                                                Stmts   Miss  Cover
---------------------------------------------------------------------------------------
.venv/lib/python3.8/site-packages/_pytest/_argcomplete.py              37     36     3%
.venv/lib/python3.8/site-packages/_pytest/assertion/__init__.py        80     76     7%
---------------------------------------------------------------------------------------
TOTAL                                                               13060  11628    11%
```

这个时候就可以进行一些配置：

```
[tool.coverage.paths]
source = ["src", "*/site-packages"]

[tool.coverage.report]
show_missing = true
```

这里的路径就指定了扫描哪些目录下的测试覆盖率。另一个常用的配置是指定覆盖率到多少才不会 fail：

```
# pyproject.toml
[tool.coverage.report]
fail_under = 90
```

### 测试自动化：Nox

[Nox](https://nox.thea.codes/) 应该可以算是 [tox](https://tox.readthedocs.io/) 的后继，它很好的处理了各种依赖，可以在隔离的环境里完成各种任务。

使用 pipx 来安装 Nox：

```
$ pipx install nox
```

它使用声明式的语法来定义自动化测试：

```python
# noxfile.py
import nox


@nox.session(python=["3.8", "3.7"])
def tests(session):
    session.run("poetry", "install", external=True)
    session.run("pytest", "--cov")
```

这个文件声明了一个在两个不同版本（ 3.8 和 3.7 ）的 Python 中运行的测试 `session`。Nox 在处理这个文件的时候会做几件事情：

- 首先生成不同版本 Python 的虚拟环境
- 然后按照 session 声明运行命令：首先是安装依赖的包（注意  Poetry 是在 Nox 生成的虚拟环境外的，所以这里声明的时候带了个 exteranl 的参数）
- 接下来就是运行 pytest 并生成覆盖率报告

最终运行的结果会类似于：

```
$ nox

nox > Running session tests-3.8
nox > Creating virtual environment (virtualenv) using python3.8 in .nox/tests-3-8
nox > poetry install
Installing dependencies from lock file


Package operations: 16 installs, 0 updates, 0 removals

  - Installing pyparsing (2.4.7)
  - Installing six (1.15.0)
  
nox > pytest --cov
=========================================== test session starts ===========================================
platform darwin -- Python 3.8.5, pytest-5.4.3, py-1.9.0, pluggy-0.13.1
rootdir: /Users/lenciel/Projects/engineering/test/tests
plugins: cov-2.10.0
…
nox > Running session tests-3.7
nox > Creating virtual environment (virtualenv) using python3.7 in .nox/tests-3-7
nox > poetry install
Installing dependencies from lock file
…
```

Nox 创建虚拟环境还是需要点儿时间的，所以后面可以使用 `-r` 参数来反复使用这个虚拟环境：

```
$ nox -r
```

### 测试打桩：pytest-mock

打桩的目的主要是隔离依赖和提高执行速度，毕竟这是单元测试。

比如你的单元测试需要访问一些 API，那么如果是直接通过 requests 之类的包去访问这些 API，那么这些 API 自己的稳定性，网络等各种因素可能都会导致你的单元测试失败或者是运行时间很长。这个时候就需要打桩。

Python 自带的 [unittest.mock](https://docs.python.org/3/library/unittest.mock.html) 同样不灵，使用 pytest 的时候一般会用 [pytest-mock](https://github.com/pytest-dev/pytest-mock) 这个插件：

```
$ poetry add --dev pytest-mock
```

这个插件其实主要是提供一个叫 `mocker` 的 [fixture](https://docs.pytest.org/en/latest/fixture.html)，来作为整个 mocking 库的 wrapper。比如，我们刚才举的访问 API 的例子，可以写一个 如下的 fixture：

```python
# tests/test_req.py
@pytest.fixture
def mock_requests_get(mocker):
    mock.return_value.__enter__.return_value.json.return_value = {
        // the k-v pairs
    }
    return mock
```

那么这个 fixture 就可以直接在用例里面使用了：

```python
def test_main_succeeds(runner, mock_requests_get):
    ...
```

更详细的 pytest-mock 的用法可以看看文档。但核心需要理解的，就是通过打桩，可以让所有的依赖变得稳定、可控并且可重入，这正好服务于我们对于优质的单元测试的要求：[快速、隔离、可重入](http://agileinaflash.blogspot.com/2009/02/first.html)。

### 数据生成：fakes/factory_boy

mock 并不是 [doubles](https://blog.pragmatists.com/test-doubles-fakes-mocks-and-stubs-1a7491dfa3da) 的唯一方法。当然，很多人会弄不清 fakes, mocks 和 stubs 的区别。

当你的测试需要理解一个数据库的时候，对每个输入输出打桩不太现实，你可能更需要一个内存里的数据库，来「假装」真正的数据库。

对于简单的场景可以直接自己实现，对于复杂的场景可以考虑类似 [factory_boy](https://factoryboy.readthedocs.io/en/latest/) 这样的工具。但具体怎么实现不是这里的重点，我们假设通过 fake 的方法来实现了一个 API ：

```python

class FakeAPI:
    url = "http://localhost:5000/"

    @classmethod
    def create(cls):
        ...
    
    def shutdown(self):
        ...
        
```

直接在 fixture 里面使用是不行的：

```python
@pytest.fixture
def fake_api():
    return FakeAPI.create()
```

因为这个 API 在被 create 了之后，没有很好的地方可以 shutdown。这种情况下，你可以把它实现为一个 [generator](https://docs.python.org/3/tutorial/classes.html#generators)，并且通过 scope 的声明，让这个 fixture 对整个 session 可见：

```python
@pytest.fixture
def fake_api():
    api = FakeAPI.create()
    yield api
    api.shutdown()
```

### 端到端测试：pytest

pytest 并不仅仅是用来做单元测试的，可以通过扩展它的 [markers](https://docs.pytest.org/en/latest/example/markers.html) 来进行端到端的测试。

```python
# tests/test_console.py
@pytest.mark.e2e
def test_main_succeeds_in_production_env(runner):
    result = runner.invoke(console.main)
    assert result.exit_code == 0
```

然后可以在 `conftest.py` 这个 hook 文件里面去注册这个 marker：

```python
# tests/conftest.py
def pytest_configure(config):
    config.addinivalue_line("markers", "e2e: mark as end-to-end test.")
```

然后就可以直接在 nox 里面用了：

```python
# noxfile.py
import nox


@nox.session(python=["3.8", "3.7"])
def tests(session):
    args = session.posargs or ["--cov", "-m", "not e2e"]
    session.run("poetry", "install", external=True)
    session.run("pytest", *args)
```

运行生产环境端到端的测试只需要：

```
$ nox -rs tests-3.8 -- -m e2e
```

测试框架大概就是这些，接下里说一下[静态扫描](/2020/07/python-in-2020-part3-linting-setup/)。