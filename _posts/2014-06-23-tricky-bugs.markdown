---
layout: post
title: "Tricky Bugs are tricky"
date: 2014-06-23 13:05:33 +0800
comments: true
categories:
- front-end
- development
---

最近接连遇到非常 tricky 的 bug。

首先是跟[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)有关的。话说自从 google 被墙，我们使用了 google map 或者 google font 的网站就被客户不停投诉各种打不开。本座只好去找国内可用的 CDN，居然发现[360的CDN](http://libs.useso.com/)不但有常用的 jquery 库和 fontawsome 这些资源，还对 google font 做了镜像，于是就用了它。

结果用了 CDN 之后，[fontawsome](fortawesome.github.io/)的图标在 firefox 下显示不正常。curl 了一下，发现 360 的基友们没有正确添加"Access-Control-Allow-Origin"的 Header：这就使得像 Firefox 这样的默认不支持 CORS 的浏览器拒绝加载不在网站自己域名下的 CORS 资源。

把 fontawsome 切换到[staticfiles的CDN](http://www.staticfile.org/)，问题解决了。

接下来的一个更加 tricky，我们的蔡天王在写代码的过程中发现表单被填了怪怪的内容，如下图：

![chrome auto fill](/downloads/images/2014_06/chrome_auto_fill.png --alt Don't touch me)

他检查了 js 和 html，发现这些值不是我们处理表单的时候填的，WTF？

专治各种疑难杂症的小弟拿到这个 bug，首先怀疑的是浏览器那些自动填表的插件，比如[LastPass](https://lastpass.com/)，结果用一个禁用了所有插件的 Chrome 重现了，WTF？

于是我尝试着把`form`和里面的`input`声明成`autocomplete="off"`的，结果仍然能重现，WTFFFF？

但是试过了几下变换表单里面的项的位置发现 bug 的行为模式是：

1. password 这个 input 总是会被用户的密码填写
2. password 上面那个 input 总是会被用用户的用户名填写（哪怕那个 input 是别的）

于是就感觉是 Chrome 的 password mananger 在干坏事了。google 了一下，发现[这么个消息](http://www.theregister.co.uk/2014/04/09/chrome_makes_new_password_grab_in_version_34/)：


{% blockquote %}

Chrome 34 will now offer to remember and fill password fields in the presence of autocomplete=off.」 That means that if a website turns off automatic password collection, Chrome will offer to do it anyway if password manager is enabled.

{% endblockquote %}

古德，瓦力瓦力古德。看了如果一个网站你选择了「记住密码」，Chrome 的密码管理器就会被这个域名下包含了`$('input[name=password]')`的表单激活。并且它居然蠢到直接去找`password`上面一个 input 来填入用户名，how convenient...

要 fix 这种行为只能通过在出事的表单里面加上占位用的`input`来欺骗浏览器。比如我们是在 django 里面使用`django-crispy-form`生成表单，就可以重载它的 Layout：

```python
    self.helper.layout =  Layout(
        HTML('<input style="display:none" type="text" name="fakeusernameremembered"/><input style="display:none" type="password" name="fakepasswordremembered"/>'),
        'name',
        'email',
        'phone',
        'qq',
        InlineCheckboxes('user_permissions'),
        'password', 'confirm_password'
    )
```

更多的相关信息（我希望你知道怎么翻墙），可以看看这里[^1]，或者这里[^2]，或者这里[^3]。

[^1]: [PSA: Ignoring autocomplete='off' by default for password manager](https://groups.google.com/a/chromium.org/forum/#!msg/security-dev/wYGThW5WRrE/qiWrKwJ79S4J).
[^2]: [Issue 352347 - chromium - Don't autofill passwords where autocomplete='off'](https://groups.google.com/a/chromium.org/forum/#!topic/chromium-dev/zhhj7hCip5c).
[^3]: [The war against autocomplete=off: let my browser remember passwords](https://blog.0xbadc0de.be/archives/124).


