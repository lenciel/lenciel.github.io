---
layout: post
comments: true
description: "...这五年里运行良好，唯一的担心就是这免费的服务别哪天没了。果然，墨菲定律法力无边，前两天看到了 LeanCloud 的停服公告..."
title: "Valine to Waline"
date: 2026-03-11 23:10:40 +0800
categories: 
- blog
- tools-i-use
---


<h3>目录</h3>

- TOC
{:toc}

### Why

[五年前](/2020/05/issues-are-fixed-and-gif-is-abandoned/){:target="_blank"}修改模板的时候我引入了 [Valine](https://valine.js.org/){:target="_blank"} 来提供评论功能。

主要是图方便：在 LeanCloud 上部署个免费服务，前端简单调调就行。

这五年里运行良好，唯一的担心就是这免费的服务别哪天没了。

果然，墨菲定律法力无边，前两天看到了 LeanCloud 的[停服公告](https://docs.leancloud.cn/sdk/announcements/sunset-announcement){:target="_blank"}{% sidenote 'sn-id-1' '国内做云做基础设施的团队很多都是老朋友了，大家这些年真的是因为选择的不同，过着天差地别的日子啊...' %}。

经过一点儿调查，选择了 Waline 作为下一站，继续折腾。 

### How

Waline 的官方文档对我没啥大用{% sidenote 'sn-id-2' 'Waline 之前也可以用 LeanCloud 做后台所以迁移数据的文档基本上是针对这种用法的，但好像 LeanCloud 停服的消息传开他们的文档也在更新中。' %}，因为我这次不想再依赖谁家的后台（Waline 真是支持[蛮多后台](https://waline.js.org/guide/deploy/){:target="_blank"}），甚至不想依赖docker compose 唤起的不透明的容器。

我得从头到尾独立部署它。

#### 数据导出和导入

在 LeanCloud 后台选择「导入导出 > 限定 Class > Comment > 导出」，之后会收到邮件（我把 User 也导出了，因为 Waline 看起来也有一张 `wl_Users` 表）。

然后官网上有一个把这个导出的 json 转成 csv 的工具。似乎是想说，不管后面用什么样的数据库，都可以把这个 csv 导入进去。

其实会有两个问题。

一个是 Valine 的数据库 schema 和 Waline [最新的设计](https://github.com/walinejs/waline/blob/c22448242cfd3170d8daad543a7eca86b13b11f7/assets/waline.sqlite.sql){:target="_blank"}并不兼容（比如 sticky等字段根本就没有），如果直接导入原来的表结构和数据作为 `wl_Comment` ，运行时会报错。

另一个就是，如果选择先用 Waline 的 schema 建表，再导入数据，那么 json 先转成 csv：
- 首先，显得有点儿多此一举；
- 其次，把字段缺失的 csv 往任何数据库里面导都是个付费软件才会提供的功能；

所以还不如直接写个脚本把 json 转成相应数据库的 sql 文件。

比如我选择 sqlite，数据导入其实就下面几步。

1.下载 Waline 最新版的 [schema](https://github.com/walinejs/waline/blob/c22448242cfd3170d8daad543a7eca86b13b11f7/assets/waline.sqlite.sql){:target="_blank"}，然后创建数据库：

```bash
$ sqlite3 /Users/lenciel/Downloads/waline.sqlite < /Users/lenciel/Downloads/waline.sqlite.sql
```

2.编写一个简单的脚本转换 json 到 sql（核心逻辑就是映射有的，放过没有的，对 Users 可以如法炮制）：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
读取 Comment.0.json（每行一个 JSON 对象），生成 INSERT SQL 插入到 wl_Comment 表。
只映射 JSON 中存在且 wl_Comment 表也有的字段，其余字段留空/使用默认值。
"""

import json
import sys
import os

# wl_Comment 表的所有字段（不含 id，因为是 AUTOINCREMENT）
WL_COMMENT_COLUMNS = [
    "user_id", "comment", "insertedAt", "ip", "link",
    "mail", "nick", "rid", "pid", "sticky",
    "status", "like", "ua", "url", "createdAt", "updatedAt"
]

# JSON key → wl_Comment 字段的直接映射（key 名一致的）
DIRECT_MAP = {
    "comment": "comment",
    "ip": "ip",
    "link": "link",
    "mail": "mail",
    "nick": "nick",
    "ua": "ua",
    "url": "url",
    "createdAt": "createdAt",
    "updatedAt": "updatedAt",
}

# 需要特殊处理的字段
# insertedAt 在 JSON 里是 {"__type": "Date", "iso": "..."}
# pid/rid 在 JSON 里是 objectId 字符串，但 wl_Comment 里是 INTEGER
# 这里先把 pid/rid 当字符串存（因为原始数据就是 objectId 字符串）

def escape_sql(value):
    """转义 SQL 字符串中的单引号"""
    if value is None:
        return "NULL"
    s = str(value)
    s = s.replace("'", "''")
    return f"'{s}'"


def extract_value(record, col):
    """从 JSON record 中提取对应 wl_Comment 字段的值"""

    if col == "insertedAt":
        v = record.get("insertedAt")
        if isinstance(v, dict):
            return v.get("iso")
        return v  # 如果不是 dict，直接用

    if col == "status":
        # wl_Comment.status 是 NOT NULL，JSON 里没有 status 字段，默认 approved
        return record.get("status", "approved")

    if col in DIRECT_MAP:
        json_key = DIRECT_MAP[col]
        return record.get(json_key)

    # pid, rid: JSON 里是 objectId 字符串，暂时直接存
    if col in ("pid", "rid"):
        return record.get(col)

    # user_id, sticky, like: JSON 里没有，返回 None
    return None


def record_to_insert_sql(record, table_name="wl_Comment"):
    """将一条 JSON 记录转为 INSERT SQL"""
    cols_with_values = []

    for col in WL_COMMENT_COLUMNS:
        val = extract_value(record, col)
        if val is not None:
            cols_with_values.append((col, val))

    if not cols_with_values:
        return None

    col_names = ", ".join([f'"{c}"' for c, _ in cols_with_values])
    col_values = ", ".join([escape_sql(v) for _, v in cols_with_values])

    return f'INSERT INTO "{table_name}" ({col_names}) VALUES ({col_values});'


def main():
    json_file = sys.argv[1] if len(sys.argv) > 1 else "Comment.0.json"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "import_comments.sql"

    if not os.path.exists(json_file):
        print(f"错误: 文件 {json_file} 不存在")
        return 1

    records = []
    with open(json_file, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                record = json.loads(line)
                records.append(record)
            except json.JSONDecodeError as e:
                print(f"警告: 第 {line_num} 行 JSON 解析失败: {e}")

    print(f"读取到 {len(records)} 条记录")

    sql_statements = []
    for record in records:
        sql = record_to_insert_sql(record)
        if sql:
            sql_statements.append(sql)

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("BEGIN TRANSACTION;\n")
        for sql in sql_statements:
            f.write(sql + "\n")
        f.write("COMMIT;\n")

    print(f"生成 {len(sql_statements)} 条 INSERT 语句，输出到 {output_file}")
    return 0


if __name__ == "__main__":
    exit(main())
```

3.把生成的 sql 文件再导入之前创建的数据库：

```bash
$ sqlite3 /Users/lenciel/Downloads/waline.sqlite < /Users/lenciel/Downloads/import_comments.sql
```

#### 部署服务端

看起来 Waline 还不支持 node 24，所以我用 nvm 安装了 node 18 给它（ npm audit fix 爽到爆炸）。

```bash
$ mkdir waline && cd waline
$ nvm install 18
```

安装可以按照[官方文档](https://waline.js.org/guide/deploy/vps.html#%E7%9B%B4%E6%8E%A5%E8%BF%90%E8%A1%8C-%E6%8E%A8%E8%8D%90){:target="_blank"}来，反正就是一行命令（但运行的时候不太可能直接用文档里那个 node 命令，这个后面会说）。但关于环境变量，特别是究竟有哪些环境变量，以及哪些配置在前端哪些在后端，很让我迷糊了一会儿。所以我推荐引入 dotenv，并且仔细看看[相关文档](https://waline.js.org/reference/server/env.html){:target="_blank"}：

```bash
$ npm install dotenv
$ vi .env
```

这里面最重要的当然是关于数据库和域名的配置，但还有一些没有写在文档里但使用起来大概也需要的东西，就主要靠江湖历练。比如[虽然说了](https://waline.js.org/reference/server/env.html#%E6%98%BE%E7%A4%BA){:target="_blank"} GRAVATAR_STR 是基于 `nunjucks` 语法，但不熟悉的朋友大概看了也不会知道究竟怎么去换 retro 或者其他风格的头像。

部署完成之后，最好通过反向代理给它一个独立的子域名。

#### 前端部署

在相应的地方加上类似于下面的片段即可完成前端的初始化（需要注意的是 `serverURL` 之外， `el` 和 `path` 还得根据自己的 Blog 系统来指定，比如 Jekyll 的 `path` 就是 `{% raw %}{{ page.url }}{% endraw %}`）：

```html
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline-meta.css" />

<script type="module">
  import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';
  const locale = {
    placeholder: '欢迎留言～',
  };
  init({
    el: '#vcomments',
    serverURL: 'https://comments.lenciel.com',
    path: '{% raw %}{{ page.url }}{% endraw %}',
    highlight: true,
    locale,
  });
</script>
```

#### 长期运行

上传本地生成的数据库文件之后，运行下面的命令验证安装没有问题：

```bash
$ node node_modules/@waline/vercel/vanilla.js
```

然后就可以写一个简单的启动脚本，交给 pm2 来管理。

```js
module.exports = {
  apps: [{
    name: "waline",        // 进程名
    script: "app.js",      // 启动脚本
    cwd: "/工作目录/waline",   // 工作目录
    interpreter: "../.nvm/versions/node/v18.20.8/bin/node",  // 替换为你的 Node 路径
    exec_mode: "fork",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "100M",  // 内存超限重启
    // 日志配置
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "/工作目录/waline/logs/error.log",
    out_file: "/工作目录/waline/logs/out.log",
    merge_logs: true,
    // 禁用 dotenv 提示（实在是多到刷屏）
    env: {
      DOTENV_SILENCE: "1",
      NODE_NO_WARNINGS: "1"
    }
  }]
};
```

比如每次更改了环境变量，就可以通过 pm2 来重启进程并观察日志：

```bash
$ pm2 restart waline
$ pm2 logs waline --lines 100
```

完成部署之后，我怀着从租房到买房的心情，愉快地调整了一些样式，因为看起来可以很多年都不需要为评论搬家了。



