---
layout: post
comments: true
title: "Python in 2020 (1) - 环境搭建"
date: 2020-07-23 22:25:41 +0800
categories:

- python
- notes

---

<h3>目录</h3>

- TOC
{:toc}

## 简介

最近两年做工具都在逼自己用刚学不久的 Go 和 Rust ，对 Python/Django 有些疏远了。最近想做一个 OKR 管理和对齐的工具，想着 Python 2 总算[正式退役](https://www.python.org/doc/sunset-python-2/)了， virtualenv 也改名 venv [成了标配](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/#:~:text=venv%20is%20included%20in%20the,and%20requires%20no%20additional%20installation.&text=virtualenv%20is%20used%20to%20manage,can%20install%20virtualenv%20using%20pip)，不如宠幸一把试试感觉。

结果光是包和依赖管理，就有 pip-tools/pyenv/Anaconda/pipenv/poetry/pipx/…，WTF，贵圈是被前端社区统治了吗…

![python_environment.png](/downloads/images/2020_07/python_environment.png --alt Don't touch me)

大概看了一下各路的妖魔鬼怪，我觉得可以选一套自己还比较满意的工具链记录和分享一下。分为下面几个部分：

1. [环境搭建](/2020/07/python-in-2020-part1-env-setup/)
2. [测试框架](/2020/07/python-in-2020-part2-testing-framework/)
3. [静态检查](/2020/07/python-in-2020-part3-linting-setup/)
4. [类型检查](/2020/07/python-in-2020-part4-type-checking/)

## 环境搭建

我的需求：

- 为各种不同项目管理和隔离它们的运行时环境（主要是 Python 版本）和依赖
- 保持 Mac 系统本身的干净，包括自动的 Python 不被覆盖，全局生效的 zsh 配置等尽量不动
- 部署项目的时候尽量使用 Docker ，但是在使用上它又慢又重又容易撞墙

## 配置

### 1. pyenv

#### 选择的原因

[pyenv](https://github.com/pyenv/pyenv) 应该主要是借鉴了 [nodenv](https://github.com/nodenv/nodenv)，让你：

- 可以安装多个 Python 版本然后根据需要在全局或者为每个项目配置
- 可以和 [tox](https://pypi.org/project/tox/) 结合测试你的应用在不同 Python 版本下的运行情况
- 可以结合 [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv) 对虚拟环境进行管理（我没有用，因为 Poetry 自带的对 venv 功能的封装足够用了）

#### 安装

可以使用 brew 来安装 pyenv，但是我希望对它更可控所以选择直接：

```
$ git clone https://github.com/pyenv/pyenv.git 〜/.pyenv
```

因为我使用 zsh，所以在 ~/.zshrc 里面可以加上：

```
$ echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
$ echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
$ echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.bash_profile
```

然后就可以安装不同版本的 Python 了：

```
$ pyenv install 3.8.1
$ pyenv install 3.7.2
```

查看有哪些可用版本然后配置全局优先使用 3.8.2 版本：

```
$ pyenv versions
  system
  3.7.2
  3.8.1
$ pyenv global 3.8.1
```

然后可以选择安装 [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv)，但是我打算用 poetry 来创建和激活虚拟环境，所以就没有安装。


### 2. Poetry

#### 选择的原因

[Poetry](https://python-poetry.org/) 使用了类似于前端生态里的 yarn 或者 bundler 的架构来做三件事情：

- 管理依赖
- 打包应用
- 管理虚拟环境

如果你不想被 docker 拖垮可以试试这个。


#### 安装

使用 curl 安装然后配置环境变量：

```
$ curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python

$ echo 'export PATH="$HOME/.poetry/bin:$PATH"' >> ~/.zshrc
```

安装后可以把生成虚拟环境的路径指定到项目的根目录：

```
$ poetry config virtualenvs.in-project true
```

新建一个测试项目：

```
$ poetry init --no-interaction
```

这会创建一个 `pyproject.toml` 文件：

```ini
[tool.poetry]
name = "test"
version = "0.1.0"
description = ""
authors = ["lenciel <lenciel@gmail.com>"]

[tool.poetry.dependencies]
python = "^3.8"

[tool.poetry.dev-dependencies]

[build-system]
requires = ["poetry>=0.12"]
build-backend = "poetry.masonry.api"
```

然后你就可以用 [TOML](https://github.com/toml-lang/toml) 语法来编辑这个文件了。

#### 创建虚拟环境

virtualenv 被收编后改名为 venv，在我们声明了一个项目之后，通过下面的命令就会自动创建一个跟项目关联的虚拟环境：

```

$ poetry install
Creating virtualenv test in /Users/lenciel/Projects/engineering/test/.venv
Updating dependencies
Resolving dependencies... (0.1s)

Writing lock file

No dependencies to install or update
```

在这个虚拟环境下面运行程序可以使用：

```
$ poetry run python test.py
```

另外，可以通过配置让虚拟环境的目录就生成在项目的根目录来方便查看：

```
$ poetry config virtualenvs.in-project true
```

#### 管理依赖

可以通过 `add` 命令来添加依赖：

```
$ poetry add django

Using version ^3.0.8 for django

Updating dependencies
Resolving dependencies... (1.1s)

Writing lock file


Package operations: 4 installs, 0 updates, 0 removals

  - Installing asgiref (3.2.10)
  - Installing pytz (2020.1)
  - Installing sqlparse (0.3.1)
  - Installing django (3.0.8)
```

这个操作其实会：

- 下载并安装所有的依赖包到虚拟环境
- 安装好后依赖的详细信息会被注册到 `poetry.lock` 文件
- 依赖的版本信息会被注册到 `pyproject.toml`

如果你熟悉前端的工具链这个就很像对 gem 的管理。包括 `pyproject.toml` 的依赖[版本描述](https://python-poetry.org/docs/versions/)语法，比如 `^1.3.0` 表示不低于 1.3.0 的版本。而 `poetry.lock` 文件里的版本则是具体被安装的版本，它可以用来保持整个团队的版本一致性，以及生产环境和开发环境的[版本一致性](https://12factor.net/dev-prod-parity)。

当需要更新某个依赖的时候，你即可以用 `update` 命令，也可以用类似 `poetry add django^3.0.1` 来指定更新到具体的版本。

### 3. pipx

#### 选择的原因

pipx 和 pip 不一样的是它不仅仅是一个包管理工具，它会创建一个虚拟环境，然后让你很容易的运行某个制定的程序而不用担心影响到其他地方。基本上你可以把它理解成 `pipsi` 的续篇就好

#### 安装使用

保障干净（YMMV）的安装方法：

```
$ python -m pip install pipx
```

#### 基本使用


```
$ pipx install sphinx
```

`inject` 可以让你在 REPL 里面安装额外的包并直接 `import`:

```
$ pipx inject sphinx sphinx_rtd_theme
```

### 4. Docker

Docker 其实跟 Python 的环境搭建和依赖管理没有任何直接关系，但是大家经常在这种讨论中谈到它，因为容器技术的一大用途就是进行开发环境的搭建。

前面讨论的以及后面会讨论的所有东西，当然都可以安装到容器里面。而且说实话，你要为每个 Python 的应用建一个容器，那虚拟环境可能都不需要了。但我个人觉得，Docker 也有下面的缺点：

- 比较重，从安装到使用到运行需要的资源
- 调试起来需要大量的配置和对工具链额外的投入
- 安装很多跟系统底层相关的依赖时比较麻烦
- 实际上还是需要你至少使用 `pip` 等来管理依赖，换句话说，你只是在容器里面去执行前面说的那些命令而已

所以如果不是公司在容器化上有足够投入，并且你开发的应用也不涉及到 Python 以外的组件和依赖（例如，你开发的是 Django 的应用，还涉及 数据库，Nginx ，Gunicorn 等等别的依赖，Docker 可能就挺好用的），我是不推荐使用 Docker 的，可以做一个具体的对比：

|                | 安装 Python 包 | 安装非 Python 包 | 管理多个 Python 版本 | 管理虚拟环境 | 环境重建便利 |
| :------------- | :------------- | :--------------- | :------------------- | :----------- | :----------- |
| pip            | ✔              | *[^1]            |                      |              |              |
| venv           |                |                  |                      | ✔            |              |
| piptools       |                |                  |                      |              | ✔            |
| pyenv          |                |                  | ✔                    |              |              |
| Conda          | ✔              | ✔[^2]            | ✔                    | ✔            |              |
| pipenv + pyenv | ✔              | ✔                | ✔                    | ✔            | ✔            |
| Poetry + pyenv | ✔              | ✔                | ✔                    | ✔            | ✔            |
| Docker         |                |                  |                      |              | ✔[^3]        |

[^1]:pip 虽然搞不定，但是 pip wheels 可以安装大部分非 Python 的依赖。
[^2]: Conda 并不能代替系统的包管理软件，如 yum 或者 apt-get，所以在不同的平台你可能需要做很多额外的工作。
[^3]: 如前所述，Docker 对里面的 Python 怎么运行怎么进行包管理是无感的，所以你需要在 Docker 里面安装上面那些东西。

### 5. 不再使用的

下面两个是在之前工具链里面被直接去掉的：

- virtualenv（Python 3.0 自带 venv）
- pipsi （pipx 比它好用）

还有一个就是 `virtualenvwrapper` ，但我比较怀念在目录切换的时候自动 activate/deactivate 相应的虚拟环境，并且在 zsh 的 prompt 上有一个提示，这个可以用脚本：

```bash
#!/usr/bin/env zsh
ZSH_POETRY_AUTO_ACTIVATE=${ZSH_POETRY_AUTO_ACTIVATE:-1}
ZSH_POETRY_AUTO_DEACTIVATE=${ZSH_POETRY_AUTO_DEACTIVATE:-1}
ZSH_POETRY_OVERRIDE_SHELL=${ZSH_POETRY_OVERRIDE_SHELL:-1}

autoload -U add-zsh-hook

_zp_current_project=

_zp_check_poetry_venv() {
  local venv
  if [[ -z $VIRTUAL_ENV ]] && [[ -n "${_zp_current_project}" ]]; then
    _zp_current_project=
  fi
  if [[ -f pyproject.toml ]] \
      && [[ "${PWD}" != "${_zp_current_project}" ]]; then
    venv="$(command poetry debug 2>/dev/null | sed -n "s/Path:\ *\(.*\)/\1/p")"
    if [[ -d "$venv" ]] && [[ "$venv" != "$VIRTUAL_ENV" ]]; then
      source "$venv"/bin/activate || return $?
      _zp_current_project="${PWD}"
      return 0
    fi
  elif [[ -n $VIRTUAL_ENV ]] \
      && [[ -n $ZSH_POETRY_AUTO_DEACTIVATE ]] \
      && [[ "${PWD}" != "${_zp_current_project}" ]] \
      && [[ "${PWD}" != "${_zp_current_project}"/* ]]; then
    deactivate
    _zp_current_project=
    return $?
  fi
  return 1
}
add-zsh-hook chpwd _zp_check_poetry_venv

poetry-shell() {
  _zp_check_poetry_venv
}

if [[ -n $ZSH_POETRY_OVERRIDE_SHELL ]]; then
  poetry() {
    if [[ $1 == "shell" ]]; then
      _zp_check_poetry_venv || (
        echo 'pyproject.toml file not found' >&2;
        exit 1
      )
      return $?
    fi
    command poetry "$@"
  }
fi

[[ -n $ZSH_POETRY_AUTO_ACTIVATE ]] && _zp_check_poetry_venv
```

环境搭建就是这样，[接下来](/2020/07/python-in-2020-part2-testing-framework/)是测试框架的选择和配置。
