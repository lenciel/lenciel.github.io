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

then just

```bash
$ git checkout master
$ mv _site .site
$ rm -rf *
$ mv .site/* *
```

## License

The theme is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

