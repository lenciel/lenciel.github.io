---
layout: post
comments: true
title: "Python in 2020 (3) - 静态扫描"
date: 2020-07-24 04:06:18 +0800
categories: 

- python
- notes

---

静态扫描其实会干很多事情：代码格式的纠错，静态分析等等。它会被很多人忽视，但其实无论是对提高个体的代码质量，还是提高整个团队的沟通质量，静态扫描都非常重要，我写 markdown [都会用](https://lenciel.com/2020/01/adding-whitespace-automatically/)静态扫描工具。

Python 静态扫描一般是通过 [pylint](https://www.pylint.org/) 配合一些聚合器比如 [flake8](http://flake8.pycqa.org/)，[pylarma](https://github.com/klen/pylama) 或者 [prospector](https://prospector.readthedocs.io/) 来完成的。这里主要讲 flake8 的使用。

<h3>目录</h3>

- TOC
{:toc}

### Flake8

在 Nox 里面配置一个 session 来运行 Flake8：

```python
# noxfile.py
locations = "src", "tests", "noxfile.py"


@nox.session(python=["3.8", "3.7"])
def lint(session):
    args = session.posargs or locations
    session.install("flake8")
    session.run("flake8", *args)
```

可以看到，我们对代码目录、测试目录和 noxfile.py 进行静态扫描。Flake8 底层使用很多的工具完成整个扫描后，会汇总成一个报告：

- `F`的是 [pyflakes](https://github.com/PyCQA/pyflakes) 扫描出来的 error。
- `W` 和 `E` 是 [pycodestyle](https://github.com/pycqa/pycodestyle) 扫描出来的违反了 [PEP8](http://www.python.org/dev/peps/pep-0008/) 的 warning 和 error。
- `C` 的是根据配置的复杂度检查开关使用 [mccabe](https://github.com/PyCQA/mccabe) 检查出来的 violation。

为了控制这个报告的内容可以自行编辑 `.flake8` 配置文件，比如：

```ini
# .flake8
[flake8]
select = C,E,F,W
max-complexity = 10
```

这样，就可以使用 nox 来运行静态扫描了：

```
$ nox -rs lint
```

Flake8 主要的威力就是它的[插件体系](https://github.com/DmytroLitvinov/awesome-flake8-extensions)，可以花一些时间熟悉并学会配置它们。

### 格式化代码：Black

在静态扫描过程中还可以用上的是 [Black](https://github.com/psf/black)， 这个工具的特点就是没有可配置性：事关格式，非黑即白。
 
在 Nox 里面添加一个 session：
 
 ``` python
 # noxfile.py
@nox.session(python="3.8")
def black(session):
    args = session.posargs or locations
    session.install("black")
    session.run("black", *args)
```

然后运行就好：

```
$ nox -rs black

nox > black src tests noxfile.py
reformatted noxfile.py
All done! ✨ 🍰 ✨
1 file reformatted.
nox > Session black was successful.
```

另外，如果想要知道 Black 究竟会怎么改代码的格式，可以使用 [flake8-black](https://github.com/peterjc/flake8-black) 插件来提前检测：


```python
# noxfile.py
@nox.session(python=["3.8", "3.7"])
def lint(session):
    args = session.posargs or locations
    session.install("flake8", "flake8-black")
    session.run("flake8", *args)
```

然后你可以在 .flake8 文件里面去掉你不希望被改正的错误：

```ini
# .flake8
[flake8]
select = BLK,C,E,F,W
ignore = E203,W503
max-line-length = 88
```

### 检查包的引用：flake8-import-order

在 PEP8 里面明确规定了包应该按照系统自带、第三方和本地包三个优先级来引用。这个可以通过 [flake8-import-order](https://github.com/PyCQA/flake8-import-order) 来检查。

在 Flake8  插件声明里面再增加一个插件：

```python
# noxfile.py
@nox.session(python=["3.8", "3.7"])
def lint(session):
    args = session.posargs or locations
    session.install("flake8", "flake8-black", "flake8-import-order")
    session.run("flake8", *args)
```

然后编辑配置文件：

```
# .flake8
[flake8]

# 增加 I 类型的告警
select = BLK,C,E,F,I,W

# 声明本地包有哪些
application-import-names = tests

# 声明使用 google 风格
import-order-style = google
```

### 其他 Flake8 插件

上面这些只是 Flake8 插件生态中的一部分。值得尝试的还有安全方面的：[Safety](https://github.com/pyupio/safety)，[flake8-bandit](https://github.com/tylerwince/flake8-bandit)，代码逻辑方面的[flake8-bugbear](https://github.com/PyCQA/flake8-bugbear)等等。

### 结合Poetry

测试一个很核心的要点就是可重入。

任何时间、任何人在任何机器上能够重入，先决条件是一个稳定的环境和输入。

比如使用 Nox 的时候，我们做了一些依赖的声明，比如：

```python
session.install("flake8")
```

因为 Flake8 自己会不断升级，在不同时间运行测试代码完全可能会得到不同的输出结果。

如果写成下面这样会好一些：

```python
session.install("flake8==3.7.9")
```

但是：

- 这样只声明了顶层依赖，它的二级依赖仍然有可能是不同版本
- 这样没有利用 Poetry 在唯一的地方把包和依赖管理起来

我们如果直接用类似处理 Poetry 的方式把 Flake8 声明成外部依赖呢：

```
session.run("flake8", "install", external=True)
```

这样一个很明显的问题就是在静态扫描的 session 里面将会引入大量我们不想要的东西，比如包依赖关系，比如一些根本不需要的包（比如测试相关的）。

如果通过 `session.install` 安装一个包，但是又用 Poetry 来统一管理它们？可以借助 pip 的 [requirements.txt](https://pip.pypa.io/en/stable/user_guide/#constraints-files) 文件配合 poetry 的 [export](https://python-poetry.org/docs/cli/#export) 命令来完成：

```python
# noxfile.py
def install_with_constraints(session, *args, **kwargs):
    with tempfile.NamedTemporaryFile() as requirements:
        session.run(
            "poetry",
            "export",
            "--dev",
            "--format=requirements.txt",
            f"--output={requirements.name}",
            external=True,
        )
        session.install(f"--constraint={requirements.name}", *args, **kwargs)
```

这样就可以在声明 session 的时候使用 install with _constraints 了：

```python
@nox.session(python="3.8")
def black(session):
    args = session.posargs or locations
    install_with_constraints(session, "black")
    session.run("black", *args)


@nox.session(python=["3.8", "3.7"])
def lint(session):
    args = session.posargs or locations
    install_with_constraints(
        session,
        "flake8",
        "flake8-bandit",
        "flake8-black",
        "flake8-bugbear",
        "flake8-import-order",
    )
    session.run("flake8", *args)


@nox.session(python="3.8")
def safety(session):
    with tempfile.NamedTemporaryFile() as requirements:
        session.run(
            "poetry",
            "export",
            "--dev",
            "--format=requirements.txt",
            "--without-hashes",
            f"--output={requirements.name}",
            external=True,
        )
        install_with_constraints(session, "safety")
        session.run("safety", "check", f"--file={requirements.name}", "--full-report")
```

然后对于测试部分则可以只使用测试相关的包：

```python
@nox.session(python=["3.8", "3.7"])
def tests(session):
    args = session.posargs or ["--cov", "-m", "not e2e"]
    session.run("poetry", "install", "--no-dev", external=True)
    install_with_constraints(
        session, "coverage[toml]", "pytest", "pytest-cov", "pytest-mock"
    )
    session.run("pytest", *args)
```

这样，主要在项目组内分享这些配置文件，每个人的环境就是完全一致的了。

### 什么时候运行：pre-commit

配置了静态扫描，什么时间运行它们？

公司的 CI/CD 服务器通常会干这件事情，但是当你把代码提交上去才看到这些信息然后进行修改肯定是太晚了。比较好的时间利用 Git 的提供的 [hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)。

使用 pipx 安装 pre-commit：

```
$ pipx install pre-commit
```

然后在你的 repo 的根目录编辑 `.pre-commit-config.yaml` 配置文件。需要注意的是，因为你是先在本地环境运行扫描，所以需要使用[本地的 hook](https://github.com/pre-commit/pre-commit-hooks)：

```
# .pre-commit-config.yaml
repos:
-   repo: local
    hooks:
    -   id: black
        name: black
        entry: poetry run black
        language: system
        types: [python]
    -   id: flake8
        name: flake8
        entry: poetry run flake8
        language: system
        types: [python]
```

这样运行速度也会比直接跑 nox 命令快，因为只会扫描改动了的文件。