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

```shell
workon qiniu_upload
python downloads/code/upload_dir.py
```

注意这个过程重要是需要把`rake prepare_deploy`后生成的`_site`下的静态文件同步给七牛云。

如何做增量？如何做刷新是需要仔细去看的：

- [刷新缓存](https://portal.qiniu.com/domain/refresh?ref=developer.qiniu.com)针对 app.js/app.css 这类文件
- 增量上传主要针对resized 等目录下的图片文件

then just

```bash
$ git checkout master
$ mv _site .site
$ rm -rf *
$ mv .site/* *
```

## License

The theme is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

