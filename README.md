# source of my blog


TODO: try native jekyll plugins like jekyll-compose etc.

## Installation

install dependencies:

```ruby
bundle install
```

## Blogging flow

```ruby
rake new_post['test']
```

or:

```ruby
rake new_page['test']
```

this will isolate the new file and we can now serve to preview:

```ruby
rake preview
```

And then execute `prepare_deploy` which will generate all site and minify html :

```ruby
rake prepare_deploy
```

`prepare_deploy` 结束时会自动把 `_ftp/downloads`、`_ftp/resized_images` 里新增或改动的文件上传到阿里云 OSS，并且以 `material` 模式跑一遍 `wxmp:upload`，把 `downloads` 里新增的图片作为**永久素材**传进公众号素材库（这样后台素材管理里直接就能选图）。两者都要求对应的凭据齐全，缺哪个就跳过哪个并打印一行提示。也可以单独跑：

```ruby
rake upload_oss
rake wxmp:upload            # 单独跑默认是图床模式，不受部署默认值影响
```

部署里想临时改成刷图床（不占素材库配额的那套）：`WXMP_MODE=uploadimg rake prepare_deploy`。

环境变量：

| 变量 | 说明 |
| --- | --- |
| `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET` | 必填。建议用只对这两个前缀有 `oss:PutObject` 权限的 RAM 子账号（想跳过 OSS 上已有的对象再加 `oss:GetObject`） |
| `OSS_ENDPOINT` | 必填（或用 `OSS_REGION`，如 `cn-shanghai`），如 `oss-cn-shanghai.aliyuncs.com` |
| `OSS_BUCKETS` | `目录=bucket[:key前缀]` 列表，如 `downloads=my-bucket,resized_images=my-bucket`；前缀默认等于目录名，保证 key 与站点 URL 一致 |
| `OSS_BUCKET` | 两个目录都放同一个 bucket 时，可用它代替 `OSS_BUCKETS` |
| `OSS_DOMAIN` | 只用于打印示例 URL，默认取 `_config.yml` 的 `static_base` |
| `OSS_VERIFY` | 默认 `1`：本地没有记录的文件先 HEAD 一次，OSS 上已有同名同内容的对象就跳过；`0` 关闭（不访问 OSS，按本地记录判断） |
| `OSS_FORCE` | 设为 `1` 时忽略本地记录，全部重传 |
| `OSS_MANIFEST` | 已上传记录文件路径，默认 `.oss-upload.json` |

判断顺序：同一个 bucket/key 且内容 SHA-256 与本地记录一致 → 跳过（不访问 OSS）；否则 HEAD 一次，对象已在 OSS 上且内容一致 → 也跳过，并写进本地记录（单段上传的 ETag 就是 MD5，可直接比对；multipart/加密对象的 ETag 不是 MD5，此时退化为只比大小）；否则上传。因此第一次运行不会重传 OSS 上已有的图片，之后每次运行只需读本地记录与一次哈希。RAM 权限只有 `PutObject` 时 HEAD 会 403，此时自动退化为直接上传。CDN 缓存刷新仍需按需在阿里云控制台处理（`app.js`/`screen.css` 这类带 hash 的文件名不用管）。

公众号正文里的外链图片会被微信过滤，发出去之前得先过一遍微信的图床：

```ruby
rake wxmp:upload                  # 默认：正文图床
WXMP_MODE=material rake wxmp:upload   # 永久素材
```

扫 `downloads` 下新增或改动的图片上传，把微信返回的 `mmbiz.qpic.cn` URL（`material` 模式下还有 `media_id`）写进 `.wxmp-upload.json`。这个文件应该提交：微信没有列出已传图片的办法，而且同一张图重复上传会拿到一个**新的 URL**，记录丢了就找不回来。

两种模式：

| `WXMP_MODE` | 接口 | 后台可见 | 用途与代价 |
| --- | --- | --- | --- |
| `uploadimg`（默认） | `cgi-bin/media/uploadimg`（官方「上传发表内容中的图片」） | ❌ 素材管理里没有，只有 CDN 上的 URL | 返回的 URL 直接嵌正文；不占素材库配额 |
| `material` | `cgi-bin/material/add_material?type=image` | ✅ 素材管理里能看到（名字就是文件名） | 返回 `media_id` + URL，`media_id` 可当封面 `thumb_media_id`；占 10 万张图片素材配额，官方说 URL 仅在腾讯系域名内可用 |

记录带 `mode` 标记，两种模式的产物不通用，所以换模式跑会把该模式下还没传过的图片重传一遍。

环境变量：

| 变量 | 说明 |
| --- | --- |
| `WXMP_APPID` / `WXMP_APPSECRET` | 必填。调用机器的 IP 必须在公众号后台的 IP 白名单里；没有待传文件时不会取 access_token，也不需要填 |
| `WXMP_MODE` | `uploadimg`（默认）或 `material` |
| `WXMP_FORCE` | 设为 `1` 时忽略本地记录，全部重传 |
| `WXMP_MANIFEST` | 已上传记录文件路径，默认 `.wxmp-upload.json` |

传之前按**文件内容**（magic bytes）判断格式，不信扩展名：微信也是这么判断的，仓库里有若干 webp 被存成了 `.png`/`.jpg`，按扩展名传会被 `40137` 打回来。只传 jpg/png/gif（官方文档写的是 jpg/png 且小于 1MB，实测 gif 和 1.7MB 的 png 也能过），webp 一定不行（`40005`，`resized_images` 里全是 webp），这类文件会被跳过并列出来。扩展名和内容对不上的文件也会单独列一行，方便排查。

配额：每个接口有每日调用上限（官方《接口调用额度说明》），打满之后该接口的所有调用都返回 `45009`。两个接口的额度是分开算的——实测同一天 `uploadimg` 已经 45009 时 `add_material` 仍然能正常传。任务碰到 45009 会立刻停掉剩余队列（不会再空转打接口）并明确提示：额度可在公众号后台开发者中心查看、手动清零（每账号每月 10 次），或者第二天直接 rerun `rake wxmp:upload` 续传——已经传成功的那部分已写进清单，不会重传。这天这个号在累计约 1200 次 `uploadimg` 调用后触顶（准确上限以后台页面显示的为准）。

then just

```bash
$ git checkout master
$ mv _site .site
$ rm -rf *
$ mv .site/* *
```

## License

The theme is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
