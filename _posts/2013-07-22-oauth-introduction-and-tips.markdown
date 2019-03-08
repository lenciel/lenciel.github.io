---
layout: post
title: "Oauth: Introduction and Tips"
date: 2013-07-22 09:53
comments: true
categories: 
- oauth
- tips
- toturials
---

## Terminology / Reference

* Signed / Signature
  - 由一系列的HTTP request元素组成的一个字符串。

  这里说的HTTP request元素一般包括了`Request Method` `&` `URL Query` `&` `Parameters`, 并且这些元素用(`consumer_secret` `&` `token_secret`)组成的key进行了加密。In some cases this may be the key, plaintext, or may use simply the `consumer_secret`, for RSA encryption.
* Consumer Secret
  - 由应用提供出来作为OAuth握手的保密的token
* Consumer Key
  - 由应用随Consumer Secret一起提供，用来做OAuth的握手的key
* Nonce / UID
  - 通常`32`个字符长度，由`a-zA-Z0-9`中的字符生成的一个独一无二的ID
* OAuth Token
  - 由服务器或者是其他Endpoint发送的，用来作为Request或者Access的token
* OAuth Token Secret
  - 作为特定token的响应被发送，用来进行 `exchanges / refreshing`.
* Query
  - URL中的用 `?` 符号隔开的一些键值对部分。键和值之间用 `=` 分隔，例如 `?query=looks&like=this`
* Parameter / Argument
  - 一般指Query中的键，比如 `oauth_token="helloWorld"` 中 `oauth_token` 被称为一个 `parameter` 或者 `argument` 而 `helloWorld` 则是它的值。
* PLAINTEXT
  - 使用普通文本作为Signature的保存方式
* HMAC-SHA1 [^8]
  - Signature的保存方式，基于Secure Hash Algorithm(1)，是加密的文本
* RSA-SHA1 [^9]
  - Signature的保存方式，基于Secure Hash Algorithm(1)，由一对public/ private的key组成。
* Service
  - 服务方指信息的提供者，在OAuth语境中，Facebook/Twitter/腾讯/新浪等就是一个个的Service
* Signature Method
  - OAuth接受的加密算法，包括: PLAINTEXT, HMAC-SHA1和RSA-SHA1
* Value
  - 键值对中的值
* URL / URI
  - URL是URI的一种，你应该懂的吧
  
### Signed Requests

> 本章描述的是OAuth 1.0

对request签名(Sign)是非常重要的，本章主要解释签名流程和各个参数的作用。从数据流上来说，签名的过程就是把应用所获取和所生成的信息放到一个地方去：可以是通过 `OAuth` 头，也可以是 `Query` 字符串。

#### Signature Base String

签名的基本组成有：request的 `Method`，request的 `URL` (如果是 `OAuth Echo`则是 `credentials uri`) 和 request的 `Query String`。没有加密前它看起来会是下面这样 (例子来自 [twitter](https://dev.twitter.com/docs/auth/creating-signature)):

```
POST&https%3A%2F%2Fapi.twitter.com%2F1%2Fstatuses%2Fupdate.json&include_entities%3Dtrue%26oauth_consumer_key%3Dxvz1evFS4wEEPTGEFPHBog%26oauth_nonce%3DkYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1318622958%26oauth_token%3D370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb%26oauth_version%3D1.0%26status%3DHello%2520Ladies%2520%252B%2520Gentlemen%252C%2520a%2520signed%2520OAuth%2520request%2521
```

##### Signing Key

上面的 `signature base` 字符串会被加密。加密时用到的key就是 *signing key* ， 是由OAuth `Consumer Secret` 和 `Token Secret` 用 `&` 字符连接起来组成的:

```
kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE
```

***

**Note:** 如果是使用RSA或者xAuth， `signing key` 可能只有 `Consumer Secret` 部分外加一个可以省略的 `&` 。 更多相关信息可以从mashape-oauth/lib/oauth.js的 [233](https://github.com/Mashape/mashape-oauth/blob/master/lib/oauth.js#L233)行和 [238](https://github.com/Mashape/mashape-oauth/blob/master/lib/oauth.js#L238)行了解。

***


#### Signature编码

有了 `signature base string` 和 `signature key` 之后，就需要从这两个字符串中提取信息完成编码。编码的方式共有三种：PLAINTEXT, HMAC, 或者是 RSA。

##### PLAINTEXT

没有任何编码，直接传 `Signature Key`


##### HMAC-SHA1

这种编码方式下，二进制格式的key被用来更新base，然后被编码成 `Base64` 放到`signature string`里面：

```
tnnArxj06cWHq44gCs1OSKk/jLY=
```

##### RSA-SHA1

这种更复杂但是更安全的方式是根据`Signature Base`来生成一对`private key`和`public key`进行加密。

然后在服务端，会用key来验证编码后的 `oauth_signature` 字段。

**Note:** mashape-oauth/tests/oauth.js的第[74](https://github.com/Mashape/mashape-oauth/blob/master/tests/oauth.js#L74)行说明了如何使用生成的`private key`来对`signature base`进行编码。


#### OAuth请求头

OAuth请求头包括了`oauth_signature` 和 `oauth_signature_method` 等参数及值。这些`oauth_*` 参数一般会用名字和其他[复杂的规则](https://github.com/Mashape/mashape-oauth/blob/master/lib/oauth.js#L111)排序，相互之间用 `,` 或者是空格分隔。下面是一个取得Twitter的Request Token的例子:

```http
POST /oauth/request_token HTTP/1.1
User-Agent: themattharris' HTTP Client
Host: api.twitter.com
Accept: */*
Authorization:
        OAuth oauth_callback="http%3A%2F%2Flocalhost%2Fsign-in-with-twitter%2F",
              oauth_consumer_key="cChZNFj6T5R0TigYB9yd1w",
              oauth_nonce="ea9ec8429b68d6b77cd5600adbbb0456",
              oauth_signature="F1Li3tvehgcraF8DMJ7OyxO4w9Y%3D",
              oauth_signature_method="HMAC-SHA1",
              oauth_timestamp="1318467427",
              oauth_version="1.0"
```

`oauth_callback` 是整个认证过程完毕后的回调地址，默认情况下服务方会提供一个 `oauth_callback_confirmed` token。

下面是一个`response`的例子：

```http
HTTP/1.1 200 OK
Date: Thu, 13 Oct 2011 00:57:06 GMT
Status: 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 146
Pragma: no-cache
Expires: Tue, 31 Mar 1981 05:00:00 GMT
Cache-Control: no-cache, no-store, must-revalidate, pre-check=0, post-check=0
Vary: Accept-Encoding
Server: tfe

oauth_token=NPcudxy0yU5T3tBzho7iCotZ3cnetKwcTIRlX0iwRl0&
oauth_token_secret=veNRnAWe6inFuo8o2u8SLLZLjolYDmDP7SzL0YfYI&
oauth_callback_confirmed=true
```

可以看到, `200` response 以及 `oauth_token`, `oauth_token_secret` 和 `oauth_callback_confirmed` 参数表示这次OAuth请求是成功的。接下来你就可以用 `oauth_token_secret` 来生成你的签名作为 `access token` 然后使用 `oauth_token`参数发送出去进行认证。

一般来说, `oauth_token` 发送的格式是 `?oauth_token=[token]` ，在认证的endpoint收到之后会进行一次 `3-Legged OAuth 1.0a` 并返回 `oauth_token` 和 `oauth_verifier`。返回的参数也会被用到 `Access Token` request[^1]中去。

## OAuth 1.0a (one-legged)

一般被叫成 `two-legged` 的OAuth其实是只有一步的。

<img src="/downloads/images/oauth_flow_1.png" align="right" />

1. 应用发送一个 **signed** request 到服务提供商，request里包括:
    - `oauth_token` *Empty String*
    - `oauth_consumer_key`
    - `oauth_timestamp`
    - `oauth_nonce`
    - `oauth_signature`
    - `oauth_signature_method`
    - `oauth_version` *Optional*
2. 服务提供商验证后，提供相应的资源供应用访问。
3. 应用请求可以访问的资源。

这种最简单的方式当然也是安全是漏洞最多的方式。通常如果你都已经想到要用OAuth了，就不该考虑这么简陋的方式了。

***

**Note:** Google 要求请求里面要带一个不是`oauth`开头的参数叫 `xoauth_requester_id`[^2]，这个要求在OAuth2里面过期了。

***

## OAuth 1.0a (two-legged)

真正的`two-legged`是1.0a版本的OAuth。

<img src="/downloads/images/oauth_flow_2.png" align="right" />

1. 应用发送一个 **signed** request到服务提供商请求一个 `Request Token`，request里包括:
    - `oauth_consumer_key`
    - `oauth_timestamp`
    - `oauth_nonce`
    - `oauth_signature`
    - `oauth_signature_method`
    - `oauth_version` *可选*
2. 服务提供商返回 `Request Token`:
    - `oauth_token`
    - `oauth_token_secret`
    - … 其他额外的参数
3. 应用再次发送**signed** request来用`Request Token`换`Access Token`，请求中包括：
    - `oauth_token` *Request Token*
    - `oauth_consumer_key`
    - `oauth_nonce`
    - `oauth_signature`
    - `oauth_signature_method`
    - `oauth_version`
3. 服务提供商返回 `Access Token` 和 `Token Secret`，整个payload的参数和第二步一样主要是`oauth_token`和`oauth_token_secret`。
4. 应用使用`oauth_token` 和 `oauth_token_secret` 来访问被权限保护的资源。

这里我们可以看到安全性被增强了，而应用开发者不会有太多的工作，用户更是完全觉察不到。

## OAuth 1.0a (three-legged)

最完备同时也是带来最多麻烦的一个版本，特别是引入了需要用户操作来确认的部分，增加了开发和交互上的复杂度。一开始推出的时候，让很多用户感到不知所措。

<img src="/downloads/images/oauth_flow_3.png" align="right" />

1. 应用发送一个 **signed** request到服务提供商请求一个 `Request Token`，request里包括:
    - `oauth_consumer_key`
    - `oauth_timestamp`
    - `oauth_nonce`
    - `oauth_signature`
    - `oauth_signature_method`
    - `oauth_version` *Optional*
    - `oauth_callback`
2. 服务提供商返回 `Request Token`:
    - `oauth_token`
    - `oauth_token_secret`
    - `oauth_callback_confirmed`
    - … Additional Parameters / Arguments
3. 返回包含下面参数的url
    - `oauth_token`
4. 弹出窗口访问返回的url，要求用户授权
5. 用户授权
6. 返回到应用中，并保存下面的参数:
    - `oauth_token`
    - `oauth_verifier`
7. 应用发送**signed** request，用`Request Token` / `Verifier` 换 `Access Token`, 请求中包括：
    - `oauth_token` *Request Token;*
    - `oauth_consumer_key`
    - `oauth_nonce`
    - `oauth_signature`
    - `oauth_signature_method`
    - `oauth_version`
    - `oauth_verifier`
8. 服务提供商返回 `Access Token` 和 `Token Secret`，整个payload的参数和第二步一样主要是`oauth_token`和`oauth_token_secret`。
9. 应用使用`oauth_token` 和 `oauth_token_secret` 来访问被权限保护的资源。

***

**Note:** 在*第6步* 如果 `oauth_verifier` 没有被发送，那么就会认证失败。只有极少数的实现可以接受只发送`oauth_token`，这样的服务提供商被认为是不完整的实现了OAuth 1.0a 3-Legged。

***


## OAuth 1.0a (Echo)

非主流的一种实现，但是确实是存在的：发明者是Twitter的Raffi。这种实现允许在首次发送的请求token里面多带两个header，这样可以通过代理的方式在代理服务商那里对原始服务商的用户进行认证。

<img src="/downloads/images/oauth_flow_4.png" align="right" />


1. 应用发送一个 **signed** request到代理服务提供商，request里包括:
    - `oauth_consumer_key`
    - `oauth_timestamp`
    - `oauth_nonce`
    - `oauth_signature`
    - `oauth_signature_method`
    - `oauth_version` *Optional*
    - `oauth_callback`
    
    还包括额外的header:
    - `X-Auth-Service-Provider`
    - `X-Verify-Credentials-Authorization`
2. 代理服务商拿到额外的header信息到原始服务商认证
3. 代理服务商认证通过后，可以返回受限资源的url给应用。

## OAuth 1.0a (xAuth)

xAuth是一种桌面程序或者手机程序（没有使用webview等控件不能完成完整流程的程序）使用的OAuth方式。它通过提供用户的`email`和`password`给服务器提供商来换取`access token`。 

这种方式返回的一般是具有只读性质的access token，并且这种token能操作的资源也是有限的。比如Twitter的DM（类似私信）就不能使用xAuth而必须用完整的`three-legged`流程获取token才能取到。

<img src="/downloads/images/oauth_flow_5.png" align="right" />

1. 应用请求用户的Credentials
2. 应用发送一个 **signed** request到服务提供商请求一个 `Access Token`，request里包括:
    - `oauth_consumer_key`
    - `oauth_timestamp`
    - `oauth_nonce`
    - `oauth_signature`
    - `oauth_signature_method`
    - `oauth_version` *Optional*
    - `oauth_callback`
    
    额外还包括:
    - `x_auth_mode` = `client_auth`
    - `x_auth_username`
    - `x_auth_password`
    - `x_auth_permission` *可选;*[^3]
2. 服务提供商验证用户的Credentials之后返回Access Token
    - `oauth_token`
    - `oauth_token_secret`
3. 应用使用`Access Token`来访问被权限保护的资源。


## OAuth 2 (two-legged)

目前为止最容易解释的一种流程，也被称为 *Client Credentials* 认证流程[^4]，也有一种 *Resource Owner Password* 流程属于这类。

### Client Credentials

1. 应用发送请求给服务提供商:
  - `grant_type` = `client_credentials`
  
  如果不是用的 `Authorization` header:
  - `client_id`
  - `client_secret`
2. 应用服务商返回 `Access Token`等信息:
    - `access_token`
    - `expires_in`
    - `token_type`

### Resource Owner Password

基本上就是 `OAuth 1.0a Echo` 流程，但是去掉了签名等复杂的部分。

1. 应用向resource owner（一般就是用户)请求credentials
    - `username`
    - `password`
2. 应用向服务提供商发送request，请求内容为:
    - `grant_type` = `password`
    - `username`
    - `password`
    
    其格式如下:

    ```
    grant_type=password&username=my_username&password=my_password
    ```
    
    如果不是用的 `Authorization` header, 下面的也需要被放到request里面:
    - `client_id`
    - `client_secret`
    
    整个加起来回是：

    ```
    grant_type=password&username=my_username&password=my_password&client_id=random_string&client_secret=random_secret
    ```

3. 应用服务商返回 `Access Token`等信息:
    - `access_token`
    - `expires_in`
    - `token_type`


## OAuth 2 (three-legged)

同样去掉了很多复杂的步骤。

1. 应用把用户引导到认证页面:
    - `client_id`
    - `redirect_uri`
    - `response_type`[^5]
    - `state` *可选;* 防止CSRF[^6]
    - `scope` *可选;* 你可以获取的资源范围
    
    一个例子（为了可读性没有进行Encode）:
    
    ```
https://oauth_service/login/oauth/authorize?client_id=3MVG9lKcPoNINVB&redirect_uri=http://localhost/oauth/code_callback&scope=user
    ```
2. 用户登录到服务中，批准应用申请权限。
3. 服务提供商把用户重定向到 `redirect_url` 并带上:
    - `code`
    - `state`
4. 应用使用 `code` 用来请求 `Access Token`:
    - `client_id`
    - `client_secret`
    - `code`
    - `redirect_uri` *可选;*[^7]
    - `grant_type` = `"authorization_code"` [^7]
2. 如果 `client_id` 和 `client_secret` 正确，服务提供商调用回调到 `redirect_url` 返回 `access_token`等信息:
    - `access_token`
    - `expires_in`
    - `refresh_token`
3. 应用保存 `access_token` 并使用。
    - 一般来说保存到session或者是cookie里，然后放在 `Authorization: [Bearer] access_token` header里面用，其中`[Bearer]`是 `Header Authorization Bearer Name`，如`Bearer`, `OAuth`, `MAC`等。

***

**有趣的事实:** 有些RFC里面的规定，比如scope的分隔符用空格等，根本没有人遵守。所以开发者根本不知道API会在下个版本变成什么样子。

***

## OAuth 2 (refresh token)

在OAuth2中，`access_token`一般是有有效期的。一个过期的token被使用时，服务器会返回一个token过期的错误，并带上`refresh_token`。应用使用`refresh token`获取新的`access_token`会比前面描述的流程简单得多。

1. 发送请求到服务提供商的`Refresh Token URI`:
   - `grant_type` = `"refresh_token"`
   - `scope` *可选;* 更新时不能指定之前没有的scope
   - `refresh_token`
   - `client_id`
   - `client_secret`
2. 服务提供商验证参数后返回:
   - `access_token`
   - `issued_at`

## Tips & Tricks

### 生成Access Token和Refresh Key

最好使用uuid，也就是固定长度的随机字符组成的字符串。

#### 例子

```javascript
var OAuth = require('mashape-oauth').OAuth,
    access_token = OAuth.nonce(/* Length, Default 32 */);
```

## References

1. [Authorizing with OAuth](http://www.flickr.com/services/api/auth.oauth.html) - Flickr Documentation
2. [OAuth on Bitbucket](https://confluence.atlassian.com/display/BITBUCKET/OAuth+on+Bitbucket) - Bitbucket Documentation
3. [OAuth Documentation](https://dev.twitter.com/docs/auth/oauth) - Twitter Documentation
4. [OAuth Extended Flows](http://2.bp.blogspot.com/-Va1Rp3-r898/TZiVh9xEJDI/AAAAAAAAAMw/8ImBIW_dXuY/s1600/OAuth-legs.png)
5. [2-Legged OAuth](https://code.google.com/p/oauth-php/wiki/ConsumerHowTo#Two-legged_OAuth) - OAuth-PHP
6. [OAuth for Consumer Requests](http://oauth.googlecode.com/svn/spec/ext/consumer_request/1.0/drafts/2/spec.html)
7. [OAuth Example](http://term.ie/oauth/example/) - term.ie
8. [OAuth 1.0 Guide](http://hueniverse.com/oauth/guide/) - Heuniverse
9. [OAuth 1.0a Diagram](http://oauth.net/core/diagram.png)
10. [OAuth Wiki](http://wiki.oauth.net)
11. [2-Legged OAuth 1.0 & 2.0](http://architects.dzone.com/articles/2-legged-oauth-oauth-10-and-20) - DZone
12. [OAuth](https://developers.google.com/accounts/docs/OAuth) & [OAuth2](https://developers.google.com/accounts/docs/OAuth2) - Google Documentation
13. [What is 2-legged OAuth?](http://blog.nerdbank.net/2011/06/what-is-2-legged-oauth.html) - Nerdbank
14. [List of Service Providers](http://en.wikipedia.org/wiki/OAuth#List_of_OAuth_service_providers) - Wikipedia
15. [OAuth Echo](http://developers.mobypicture.com/documentation/authentication/oauth-echo/) - mobypicture
16. [OAuth Echo](https://dev.twitter.com/docs/auth/oauth/oauth-echo) - Twitter
17. [Advanced API](http://developer.vimeo.com/apis/advanced) - Vimeo Developer();
18. [About xAuth](https://dev.twitter.com/docs/oauth/xauth) - Twitter xAuth Documentation
19. [Implementing Sign-in](https://dev.twitter.com/docs/auth/implementing-sign-twitter) - Twitter Sign-in Documentation
20. [RFC6749](http://tools.ietf.org/html/rfc6749) - IETF
21. [Web Application Flow](http://developer.github.com/v3/oauth/) - Github OAuth2
22. [OAuth2 Quickstart](http://www.salesforce.com/us/developer/docs/api_rest/Content/quickstart_oauth.htm) - Salesforce
23. [Authentication Mechanisms](https://developers.geoloqi.com/api/authentication) - Geoloqi
24. [Understanding Web Server OAuth Flow](http://www.salesforce.com/us/developer/docs/api_rest/Content/intro_understanding_web_server_oauth_flow.htm) - Salesforce
25. [CSRF & OAuth2](http://blog.springsource.org/2011/11/30/10317/) - Springsource
26. [OAuth v2-31](https://tools.ietf.org/html/draft-ietf-oauth-v2-31) - IETF
27. [Resource Owner Flow](http://techblog.hybris.com/2012/06/11/oauth2-resource-owner-password-flow/) - Hybris


[^1]: [Implementing sign twitter](https://dev.twitter.com/docs/auth/implementing-sign-twitter).
[^2]: [Oauth request url](https://developers.google.com/google-apps/gmail/oauth_protocol#oauth_request_url).
[^3]: [Vimeo API Advanced](http://developer.vimeo.com/apis/advanced)
[^4]: [IETF OATUH V2 Section 4.4](https://tools.ietf.org/html/draft-ietf-oauth-v2-31#section-4.4).
[^5]: [IETF OATUH V2 Section 4.1.1](http://tools.ietf.org/html/draft-ietf-oauth-v2-31#section-4.1.1).
[^6]: [CROSS SITE REQUEST FORGERY AND OAUTH2](http://blog.springsource.org/2011/11/30/10317/).
[^7]: [RFC6749](http://tools.ietf.org/html/rfc6749#section-4.1.3).
[^8]: [Hash based message authentication code](http://en.wikipedia.org/wiki/Hash-based_message_authentication_code).
[^9]: [RSA Algorithm](http://en.wikipedia.org/wiki/RSA_(algorithm\)).
