---
layout: post
title: "如何不正确的殴打企鹅"
date: 2014-08-09 20:32:58 +0800
comments: true
categories: 
- just-4-fun
---

今天在微信朋友圈里面看了20来条这游戏的成绩分享，还有的群开始讨论心得。打开链接一看，原来是当年那个小范围流行了一下的[Penguin Ball](https://www.google.com/search?q=Penguin+Ball&oq=Penguin+Ball&aqs=chrome..69i57j69i60.972j0j4&sourceid=chrome&es_sm=91&ie=UTF-8)嘛（我记得后来有些人开始玩那个[血腥版](http://www.bloody-penguin.com/)，正常人就慢慢不玩这游戏了）。

不过，链接指向的那山寨游戏虽然没有再用flash，但是对手势事件的处理有问题（他们还是挺[大方的](http://game.2sky.cn/js/52/index.js)），所以确实还蛮难的：我打了五六次，最好成绩6000多一点。

然后，那个页面除开嵌入了一个“教你如何调情”的广告之外，一直在不停的要你分享，分享，分享......

那我就分享嘛~~~

去看了一下微信的分享是怎么弄出去的，原来有个非官方的叫`WeixinJSBridge`的东西：只要是通过微信应用内置的Webview打开的网页就可以调用到一组特别的接口，比如分享链接到朋友圈或者发送链接给朋友。这两个接口的参数非常类似：

* 分享链接消息里面的title image的url 
* title image的宽度和高度
* 标题
* 描述
* 链接指向的url
* 微信APPID

分享出来的链接，以这个“打企鹅”的游戏为例，是长成下面这样子的一条链接消息：

![Wechat Message](/downloads/images/2014_08/wechat_share_msg.jpg "Don't touch me...")

所以，要伪装一个“打企鹅”的高分数链接就只需要找到title image的url和链接指向的url（因为标题和描述照着编就是了）。

本座觉得，那么山寨的游戏作者，肯定是把所有的东西都放在页面上的吧，于是用Chrome打开了那个页面，果然没有被拒绝（一般来说，给微信浏览的页面至少应该根据访问上报的user-agent等参数判断它是不是移动设备浏览的，如果不是应该reject），并且源码里面我想要的都在（所以比较敏感的js什么的minify一下会好一些）：

```javascript
        var mebtnopenurl = 'http://game.2sky.cn/game/';
        var rankurl = mebtnopenurl;
        dataForWeixin = {
            "appId": "wx60c8c12f639f3ef4",
            "imgUrl": "http://game.2sky.cn/vapp/52/3.jpg",
            "url": "http://bingkafei.hnsdcpa.com/game/52/",
            "tTitle": "打企鹅-6e游戏",
            "tContent": "打企鹅-6e游戏"
        };  
        
        dataForWeixin.appId = "wx8820cdf5db680ffa";
        dataForWeixin.url = "http://weiapp.552200.com/game/"+_con["num"]+"/";

        function dp_share(){
            document.title ="你简直霸气侧漏，把企鹅击飞出"+myData.scoreName+"，谁还能超越我？";
            document.getElementById("share").style.display="";
            dataForWeixin.tTitle = document.title;
        }
```

当然，拿到这些了之后，也不是马上一句：

```javascript
WeixinJSBridge.invoke('shareTimeline',data,callback)
```

就能把你装神弄鬼消息分享出去的。前面说了，微信那边还是会检查整个事情是不是发生在微信内置的webview里面。但是，要绕开也不是那么麻烦，你懂的...

总体感觉微信的这api还是挺扯的，本来可以作为身份校验的appid其实填不填也无所谓，所以朋友圈里面的链接点起来还是谨慎一点儿吧，骚年们。
