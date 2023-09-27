---
layout: post
sidenote: false
title: "增加ssl证书和对http2的支持"
date: 2017-03-22 14:39:44 +0800
categories:

- blogging
- tech
- web-dev

---

 Google 一直在致力于提醒用户[更加安全的上网](https://security.googleblog.com/2016/09/moving-towards-more-secure-web.html)，并从 Chrome 56 版本开始，把使用 HTTP 的网站直接[标记为「不安全的」](http://www.zdnet.com/article/chrome-56-google-starts-slapping-not-secure-on-http-payment-and-login-pages/)。随后 Firefox 等浏览器也宣布加入了类似的功能，来逼迫网站开发者逐步废弃使用 HTTP。

在过去，要支持 SSL 其实还是挺麻烦的，因为首先你需要[一个证书](https://www.digicert.com/ssl-certificate.htm)。这东西申请起来麻烦，但只要给钱就特别好办：为这个，Google 年初还以乱发了 3 万个证书为由宣布[不再信任Symantec签发的证书](https://arstechnica.com/security/2017/03/google-takes-symantec-to-the-woodshed-for-mis-issuing-30000-https-certs/)。

这也跟 Google 等一干巨头背后撑腰的免费证书发放机构[Let's Encrypt](https://letsencrypt.org/)做大了有些关系。从它的官网上的数据可以看到，一年下来，证书发放量相当感人：

![Vhost threshold](/downloads/images/2017_03/certs_num_by_year.jpg --alt Don't touch me)

但作为一名上年纪的人，本座已经不会再时间紧跟业界潮流：所以 Let's Encrypt 出来了很久，大概试过之后就一直在等待工具链成熟。这次正好[搬迁到Jekyll](/2017/03/migrating-from-octopress-to-jekyll/)，眼看着围绕着[certbot](https://certbot.eff.org/)构建的生态也非常完善，就做了切换。

把切换到 HTTP2 也一并做了。

HTTP2 的介绍文章已经[很多了](https://developers.google.com/web/fundamentals/performance/http2/)，毕竟已经占据了[超过8%](https://w3techs.com/technologies/details/ce-http2/all/all)的整体份额，感兴趣的同学可以去看看 Ilya Grigorik 的相关文章或者[讲座](https://docs.google.com/presentation/d/1r7QXGYOLCh4fcUq0jDdDwKJWNqWK1o4xMtYpKZCJYjM/edit#slide=id.g40fbe7d8c_051)。

这里主要讲怎么开启。

因为国内访问 github pages 随时被墙的原因，这次迁移到纯 Jekyll 是在 CentOS7 上用 Nginx 来做的 host。理论上来说，Nginx 1.9.5 及其以上版本的开启非常简单：

``` bash
server {
   listen 443 ssl http2;

   server_name lenciel.com www.lenciel.com;

   ssl_certificate /etc/letsencrypt/live/lenciel.com/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/lenciel.com/privkey.pem;

   ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
   ssl_prefer_server_ciphers on;
```

注意到第二行里面的`http2`了吗？加上它就可以了。用浏览器看看请求是不是都是走 HTTP2 了：

![Vhost threshold](/downloads/images/2017_03/http_orig_requests.jpg --alt Don't touch me)

咦？为什么没有起作用？查了一下，原来除开 Nginx 版本的要求，对 OpenSSL 和 ALPN 的版本[也有要求](https://www.nginx.com/blog/supporting-http2-google-chrome-users/)。看了一下 CentOS7 通过 yum 安装的 nginx 的参数：

``` bash
$ nginx -V
nginx version: nginx/1.10.2
built by gcc 4.8.5 20150623 (Red Hat 4.8.5-4) (GCC)
built with OpenSSL 1.0.1e-fips 11 Feb 2013
TLS SNI support enabled
```

OpenSSL 的版本果然是太低了，只好从源码来编译一个更新的版本：

``` bash
yum -y groupinstall 'Development Tools'
yum -y install wget openssl-devel libxml2-devel libxslt-devel gd-devel perl-ExtUtils-Embed GeoIP-devel rpmdevtools

OPENSSL="openssl-1.1.0-pre5"
NGINX_VERSION="1.11.13-1"
NJS_VERSION="1.11.13.0.1.10-1"

rpm -ivh http://nginx.org/packages/mainline/centos/7/SRPMS/nginx-$NGINX_VERSION.el7.ngx.src.rpm
rpm -ivh http://nginx.org/packages/mainline/centos/7/SRPMS/nginx-module-geoip-$NGINX_VERSION.el7.ngx.src.rpm
rpm -ivh http://nginx.org/packages/mainline/centos/7/SRPMS/nginx-module-image-filter-$NGINX_VERSION.el7.ngx.src.rpm
rpm -ivh http://nginx.org/packages/mainline/centos/7/SRPMS/nginx-module-njs-$NJS_VERSION.el7.ngx.src.rpm
rpm -ivh http://nginx.org/packages/mainline/centos/7/SRPMS/nginx-module-perl-$NGINX_VERSION.el7.ngx.src.rpm
rpm -ivh http://nginx.org/packages/mainline/centos/7/SRPMS/nginx-module-xslt-$NGINX_VERSION.el7.ngx.src.rpm

sed -i "/Source12: .*/a Source100: https://www.openssl.org/source/$OPENSSL.tar.gz" /root/rpmbuild/SPECS/nginx.spec
sed -i "s|--with-http_ssl_module|--with-http_ssl_module --with-openssl=$OPENSSL|g" /root/rpmbuild/SPECS/nginx.spec
sed -i '/%setup -q/a tar zxf %{SOURCE100}' /root/rpmbuild/SPECS/nginx.spec
sed -i '/.*Requires: openssl.*/d' /root/rpmbuild/SPECS/nginx.spec
sed -i 's|%define WITH_LD_OPT .*|%define WITH_LD_OPT ""|g' /root/rpmbuild/SPECS/nginx.spec
sed -i 's| -fPIC||g' /root/rpmbuild/SPECS/nginx.spec
spectool -g -R /root/rpmbuild/SPECS/nginx.spec
rpmbuild -ba /root/rpmbuild/SPECS/nginx.spec
rpmbuild -ba /root/rpmbuild/SPECS/nginx-module-geoip.spec
rpmbuild -ba /root/rpmbuild/SPECS/nginx-module-image-filter.spec
rpmbuild -ba /root/rpmbuild/SPECS/nginx-module-njs.spec
rpmbuild -ba /root/rpmbuild/SPECS/nginx-module-perl.spec
rpmbuild -ba /root/rpmbuild/SPECS/nginx-module-xslt.spec
```

然后再次检查：

``` bash
$ nginx -V
nginx version: nginx/1.11.13
built by gcc 4.8.5 20150623 (Red Hat 4.8.5-11) (GCC)
built with OpenSSL 1.0.2k  26 Jan 2017
TLS SNI support enabled
```

完成后，重启 nginx，再次检查访问的情况：

![Vhost threshold](/downloads/images/2017_03/http2_requests.jpg --alt Don't touch me)

然后从 Chrome 的`chrome://net-internals/#http2`入口进去，可以看到`lenciel.com`已经在列了：

![Vhost threshold](/downloads/images/2017_03/http2_internals.jpg --alt Don't touch me)



