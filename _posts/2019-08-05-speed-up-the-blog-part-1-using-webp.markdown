---
layout: post
title: "Blog加速：使用WebP图片格式"
date: 2019-08-05 14:38:29 +0800
comments: true
categories: 
---

这个 Blog 对本座来说，除开记录胡思乱想，最重要的作用就是保持和前端世界一点同步。最近打算在不使用 CDN 的情况下， [pagespeed](https://developers.google.com/speed/pagespeed/) 跑到100分，所以做一些早就想做但是一直没空的改造，排在最前面的就是使用 WebP 格式放正文图片。

### 什么是WebP

WebP 是 Google 开发的新图像格式，旨在以可接受的视觉质量为无损和有损压缩提供较小的文件大小，Google 报告称自己使用 WebP 代替其他有损压缩方案实现了 30% 至 35% 的流量节省。自问世以来，已经有包括 Netflix、Amazon、Quora、Yahoo、Walmart、Ebay 在内的许多大公司在生产环境中使用 WebP 来降低成本并缩短网页加载时间。

目前它最大的问题是浏览器兼容性，[根据 CanIUse.com](http://caniuse.com/webp) 可以看到 Chrome 和 Opera 对 WebP 提供原生支持。 Safari、Edge 和 Firefox 已经试用 WebP，但尚未在官方版本中进行使用。

以我最近用过的一张图片为例，使用 WebP 的效果是非常明显的：


![Vhost threshold](/downloads/images/2019_08/file_size_webp.png "Don't touch me...")

### 怎么办

既然不是所有用户的浏览器都支持，那么就得找到办法根据不同的浏览器展示不同的图片。万幸在浏览器和网站建立连接的第一个请求里面，会有一个声明浏览器能力的 [Accept Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation/List_of_default_Accept_values)。

于是，由于这个站是用 Nginx 来运行的，要做到这点分三步。

#### 让服务器认识WebP

在 `/etc/nginx/mime.types` 里加上：

```
image/webp  webp;
```

#### 根据访问者的请求头赋值变量

在`/etc/nginx/nginx.conf`里的 `http` 段落里面加一个：

```
map $http_accept $webp_suffix {
  default   "";
  "~*webp"  ".webp";
}
```

这里的作用主要是，如果 `$http_accept` （更多信息可以查看 [ngx_http_map_module](http://nginx.org/en/docs/http/ngx_http_map_module.html)）代表的访问者的头里面有 `webp`，那么 `$webp_suffix` 就赋值为 `.webp`，否则就是一个空字符串。

定义空字符串这种方法比较“硬编码”，但是这里不用 `rewrite` 来实现主要是出于性能方面的考虑：nginx的变量是 lazily calculated 的，所以使用这样的方式不会影响其他文件。

#### 根据变量值返回

在 Nginx 的配置文件 `server` 段落里面加上：

```
    # webp extension support if you are converting /uploads images to webp
	 location ~* \.(png|jpe?g)$ {
	   expires max;
	   add_header Vary "Accept-Encoding";
	   add_header Cache-Control "public, no-transform";
	   try_files $uri$webp_suffix $uri =404;
	 }
```

这里最主要的是 `try_files` 的部分：

- 如果有原请求+".webp"后缀的文件，就使用它返回
- 如果没有，返回原来请求的文件
- 如果都没有，返回404

更多 try_files 的用法可以看[这里](http://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)。

### 批量生成WebP文件

重启服务器之后，就可以看到已经工作了。在使用 Chrome 进行访问的时候，WebP 格式的图片会加载。

![Vhost threshold](/downloads/images/2019_08/webp_serving.jpg "Don't touch me...")

至于如何批量把现有的图片转换成 WebP 格式，有很多工具可以用，需要考虑的是在服务器端完成，还是在本地完成。