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

`prepare_deploy` 结束时会自动把 `_ftp/downloads`、`_ftp/resized_images` 里新增或改动的文件上传到阿里云 OSS（前提是环境变量里配好了凭据）。也可以单独跑：

```ruby
rake upload_oss
```

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

then just

```bash
$ git checkout master
$ mv _site .site
$ rm -rf *
$ mv .site/* *
```

## License

The theme is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
