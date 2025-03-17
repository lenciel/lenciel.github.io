---
layout: post
comments: true
description: "Python 依赖管理和打包工具之所以从 pip 开始一直做不好，其实是因为 Python 的使用方式太多，用户背景太复杂了..."
title: "从 pyenv/poetry/pipx 切换到 uv"
date: 2025-03-16 11:38:47 +0800
categories: 

- python
- uv
- tools-i-use
---

Why？

第一次看到 uv 的时候，难免觉得是不是什么东西人类都打算用 Rust 再来一遍。直到过去一年从 [Simon Willisom](https://simonwillison.net/) 开始，看到很多人都切了（比如[这里](https://bluesock.org/~willkg/blog/dev/switch_pyenv_to_uv.html)，[这里](https://valatka.dev/2025/01/12/on-killer-uv-feature.html)，和[这里](https://www.bitecode.dev/p/why-not-tell-people-to-simply-use)），所以最近几个月的 Python 项目都在试用。

首先，确实能打。

这篇文章的标题就很能说明问题：pyenv/poetry/pipx 是[我过去五年](/2020/07/python-in-2020-part1-env-setup/)挺稳定的工具链，但 uv 一个人干三个人的活，并且，还干得又快又好。

比如之前我要启动一个使用 Python 的 3.12 版本，有 requests 包作为依赖的项目简单爬虫程序 crawler.py，需要：

```bash
pyenv install 3.12
pyenv local 3.12
poetry init
poetry add requests
poetry install
python crawler.py
```

而使用 uv 只需要：

```bash
uv run --python 3.12 --with requests python crawler.py
```

但快速便捷还不是我们做这类切换的时候最核心的考虑。

Python 依赖管理和打包工具之所以从 pip 开始一直做不好，其实是因为 Python 的使用方式太多，用户背景太复杂，完成的任务也太多样了。很少有人用 JS 写 GIS 或者做量化，用 PHP 或者 Ruby 开发 AI 应用，但用 Python 干啥的都有，并且很多用户都不是专业的程序员。

uv 解决的核心思路是让简单的事情保持应有的简单（比如安装各种版本的 Python），让复杂的事情变得有可能相对简单（比如在不同操作系统上安装依赖项）。拿安装来说，uv 的实现方式是：

- 在不同 OS 间统一安装方式
- 无需管理员权限
- 独立于系统
- 多个版本被良好的管理起来
- 使用相同的 stdlib
- 包括 Pypy、No-GIL 和 TCO 版本
- 没有 shim，没有预编译，使用默认值

而且看起来，Astral 已经在这个项目上做了足够的投入{% sidenote 'sn-id-1' '他们好像收购了这个项目的前身，[python-build-standalone](https://github.com/astral-sh/python-build-standalone)。' %}，并打算持续下去。

最后，uv 还提供了简单的方式来迁移使用 poetry 管理的项目。只需要：

```bash
uvx pdm import pyproject.toml
```

然后把生成的文件做一些简单的调整（比如去掉 `tool.poetry` 开头的部分）即可。

Happy Pythoning...



