---
layout: post
title: "How To Define Viewport For Mobile"
date: 2012-08-09 22:39
comments: true
categories:
- mobile
- viewport
- tips
dsq_thread_id:
- 847922295
---


#### **概念：设备像素和CSS像素**

首先要明白CSS像素和设备像素之间的区别。

设备像素是定义了我们使用的设备的分辨率，一般来说可以通过`screen.width/height`来得到。

如果我们在浏览器里面创建一个`width:128px`的元素，而我们的屏幕是1024px宽，那么在浏览器最大化的时候，浏览器的宽度应该是这个元素的八倍（大概八倍，暂时忽略那些tricky的bits）。

如果用户使用滚轮放大或者缩小页面(Zooming)，那么这个关系就会变化。一般来说，现在的浏览器对Zomming的实现都是通过伸缩像素，也就是当用户Zoom到200%的时候，你的`128px`宽的元素宽度并不会变成`256px`，而是每个像素的宽度翻倍了：这个元素还是`128px`的宽度，但是占据了256个设备像素。

也就是说，zoom到200%其实会让一个CSS像素从一个设备像素变成四个设备像素的大小（长宽各翻一倍，面积就变成了4倍）。

&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; 原始(zoom 100%)&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; 开始放大(zoom in)&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; 开始缩小(zoom out)

<img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="csspixels_100" border="0" alt="csspixels_100" src="/downloads/images/2012_08/csspixels_100.gif" width="208" height="208" />&#160; <img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="csspixels_in" border="0" alt="csspixels_in" src="/downloads/images/2012_08/csspixels_in.gif" width="208" height="208" />&#160; <img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="csspixels_out" border="0" alt="csspixels_out" src="/downloads/images/2012_08/csspixels_out.gif" width="208" height="208" /> 

从这里可以看出，我们在使用css像素值在css文件里面定义宽度时，不需要考虑设备像素，因为在zoom的时候css像素值是不变的。用户在缩放的时候，浏览器负责放大缩小那些元素，但是整个layout是不变的。 

#### **屏幕大小** 

`screen.width`和`screen.height`可以获取用户屏幕的尺寸。获得的尺寸值的单位是设备像素，换句话说，它们是不变的(可以看成是显示器的硬件指标，而不随浏览器窗口缩放而变化)。 

<img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="desktop_screen" border="0" alt="desktop_screen" src="/downloads/images/2012_08/desktop_screen.jpg" width="604" height="379" /> 

一般来说，用户的屏幕大小对我们是无用的信息。很少有人使用它（除开统计站点访问信息时）。 

#### **窗口大小**

####  

窗口大小表示了当前你的CSS layout可以占用的空间大小。可以通过`window.innerWidth`和`window.innerHeight`来获取它们。

<img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="desktop_inner" border="0" alt="desktop_inner" src="/downloads/images/2012_08/desktop_inner.jpg" width="604" height="379" /> 

很显然，窗口大小的单位是CSS像素值。当用户用滚轮放大缩小自己的窗口大小的时候，`window.innerWidth/Height`会相应的变化，这样你就知道自己的layout有多大空间可用了。

注意：Opera是一个例外，它的`window.innerWidth/Height`不会因为缩放变化，而是取的设备像素值。这点对于桌面操作系统上的应用很讨厌，但是就像后面会说到的，对于手机来说很关键。 

#### **Scrolling offset** 

`window.pageXOffset/pageYOffset`代表了当前的document在横向和纵向上的偏移量。这样你就知道用户scroll了多少内容。

<img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="desktop_page" border="0" alt="desktop_page" src="/downloads/images/2012_08/desktop_page.jpg" width="604" height="519" /> 

这些值也是CSS像素，理论上，当用户做缩放的时候，`window.pageXOffset/pageYOffset`也会变化。但是实际上，浏览器一般会在用户缩放的时候保证置顶的元素不变，所以在缩放的时候，一般来说这两个值基本是不变的。 

#### **概念：Viewport** 

`Viewport`的主要作用是限定`<html>`元素，也就是整个页面的最高级元素的大小。这样说比较含糊，我们来看一个详尽的例子：假设你有一个页面，侧栏的宽度是10%。在你缩放浏览器窗口大小的时候，这个侧边栏也会自动缩放。这是如果实现的？

技术上讲，按照设置，侧边栏会自动占据自己的父元素（这里我们可以假设是`<body>`）宽度的10%。那么`<body>`的宽度呢？又会取它的父元素`<html>`的宽度的100%——因为理论上所有的HTML的block-level元素都会自动取父元素宽度的100%（有些例外情况，我们这里忽略它们）。

那么`<html>`的宽度是怎么来的呢？所有的网页开发者都默认它就是浏览器的宽度。的确如此——在桌面浏览器上就是这样。实际上，就像我们已经提到过的，<html>的宽度是viewport限定的。在桌面上它就是整个浏览器窗口的宽度，而在手机上则要复杂得多。 

#### **手机浏览器** 

手机一个显而易见的特点就是屏幕小。如果我们原封不动的使用为桌面版浏览器开发的网站的文件，就会发现它们在手机浏览器上面目全非。但是大多数网站开发者是没有精力给手机用户专门维护另外一个网站的。因此手机浏览器制造商尽可能的通过技术手段让网站在手机上和在桌面浏览器里看起来“差不多”。 

#### **两个viewports** 

既然手机浏览器的viewport比较小，没法呈现所有css定义的元素，那么解决这个问题的办法就很明显了：扩大手机上的viewport。最终，手机浏览器通过`visual viewport`和`layout viewport`的合作来解决问题。

George在Stack Overflow上<a href="http://stackoverflow.com/questions/6333927/difference-between-visual-viewport-and-layout-viewport" target="_blank">解释</a>说：

layout viewport就像一个不改变大小和形状的大的图片。想象一下你透过一个小窗口去看这个大的图片，因为窗框的遮挡，你只能看到大图片的一部分。这部分就是visual viewport。你可以改变自己和这个窗口的位置（其实就是缩放），你也可以把窗口横放或者竖放，但是大图片本身（layout viewport）是不会改变的。

<img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="mobile_visualviewport" border="0" alt="mobile_visualviewport" src="/downloads/images/2012_08/mobile_visualviewport.jpg" width="404" height="549" />

要注意，CSS layout，特别是用百分比定义的layout，都是用layout viewport来算的，一般来说比visual viewport要宽很多。

因此，起始阶段<html>会占据整个layout viewport的宽度，你用CSS定义的元素的尺寸会比手机屏幕的尺寸要宽，这主要是要模拟网站在手机浏览器上的表现。

那么layout viewport究竟有多宽？这个要看具体的手机浏览器。Safari的iPhone版为980px，Opera是850px，Android的Webkit是800px，而IE是974px。还有一些其他的浏览器除开特别的宽度之外有特别的行为，比如Symbian上的Webkit会尽量保持layout viewport和visual viewport相同。当layout viewport超过了850px的时候，两者才会变得不同。 

#### **缩放** 

很明显，visual和layout两种viewport都使用了CSS像素，但是layout viewport是不会因为缩放操作变化的，而visual viewport会。很多的移动设备上的浏览器，在默认情况下都是以完全zoom-out的尺寸来显示页面的——结合前面的对两种viewport的简介，你可以认为这种时候你是把头伸到窗口(visual viewport)外在看窗外那副大图片(layout viewport)，这种情况下两个viewport也是相等的（没有被窗框遮住的部分）。

因此，layout viewport的宽和高等于在完全zoom-out的情况下screen上最大可显示的CSS像素值大小。因此在随后用户如果zoom-in了这个值是不会变化的。

下面的图表示了这个变化：在刚开始打开一个页面的时候，处于完全zoom-out的状态，layout viewport的值等于visual viewport的值。随后，当用户zoom-in（放大页面）时，每个CSS像素变成数倍于设备像素，而整个layout viewport的值不变（这样才保证你为页面定义的CSS长宽有意义），于是layout viewport的物理范围扩大了不少。

<img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="mobile_viewportzoomedout" border="0" alt="mobile_viewportzoomedout" src="/downloads/images/2012_08/mobile_viewportzoomedout.jpg" width="240" height="418" />&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; <img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="mobile_layoutviewport" border="0" alt="mobile_layoutviewport" src="/downloads/images/2012_08/mobile_layoutviewport.jpg" width="304" height="413" />

另外要注意的就是layout viewport的宽度是保持不变的。也就是说在默认情况下，竖屏转横屏的时候，虽然visual viewport变化了，但是浏览器会自动的zoom-in一些来使得layout viewport和visual viewport仍然相等。这种情况下，layout viewport的高度会变小，但是，对于web开发者而言，最重要的是宽度能保持不变。

<img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="mobile_viewportzoomedout" border="0" alt="mobile_viewportzoomedout" src="/downloads/images/2012_08/mobile_viewportzoomedout.jpg" width="240" height="418" />&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; <img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="mobile_layoutviewport_la" border="0" alt="mobile_layoutviewport_la" src="/downloads/images/2012_08/mobile_layoutviewport_la.jpg" width="362" height="298" />  

#### **测量layout viewport** 

`document.documentElement.clientWidth/Height`得到的是layout viewport的数值。并且，如前所述，横竖屏转换时，只会影响Height不会影响Width取值。

> **document.documentElement.clientWidht/Height**：
> 
> *   Layout viewport 
> *   使用CSS像素值为单位 
> *   支持Opera、iPhone、Android、Symbian、Bolt、MicroB、Skyfire和Obigo 
> *   有一些问题： 
> 
> 1.  <div>
>       Samsung的Webkit的viewport只有当显式指定了<meta viewport>的时候才有效，否则返回的是<html>元素的长宽
>     </div>
> 
> 2.  <div>
>       Firefox返回的是以设备像素值为单位的结果
>     </div>
> 
> 3.  <div>
>       IE返回1024&#215;768，正确的信息要通过<code>document.body.clientWidth/Height</code>获取
>     </div>

#### **测量visual viewport** 

`window.innerHeight/Width`返回的是visual viewport。很显然，当用户缩放的时候，这两个值会变化，因为有更多或者更少的CSS像素适配到屏幕可见的部分中。

> **window.innerHeight/Width**：
> 
> *   visual viewport 
> *   使用CSS像素值为单位 
> *   支持iPhone、Symbian、BlackBerry 
> *   有一些问题： 
> 
> 1.  <div>
>       Samsung的Webkit返回的是layout viewport的取值只有当显式指定了<meta viewport>的时候才有效，否则返回的是<html>元素的长宽
>     </div>
> 
> 2.  <div>
>       Firefox和Opera返回的是以设备像素值为单位的结果
>     </div>
> 
> 3.  <div>
>       IE不支持，正确的信息要通过<code>document.documentElement.offsetWidth/Height</code>获取
>     </div>
> 
> 4.  <div>
>       其他的如Iris、Skyfire或者Obigo是有返回值到乱来的
>     </div>

#### **手机屏幕大小** 

前面提到过，在桌面系统，screen.width/hieght返回屏幕的大小，但是和桌面系统一样，开发者都不关心这个值：因为物理上屏幕多大并不重要，我们更关心多少个CSS像素能弄进这个屏幕。 

#### **<html>元素** 

通过`document.documentElement.offsetWidth/Height`可以获取`<html>`元素的CSS像素单位的尺寸。 

#### **缩放比例** 

当screen.width和window.innerWidth在你工作的平台都得到了正确实现的时候，两者相除就可以得到缩放的比例大小。 

#### **Media query** 

Media query的思想就是定义只在页面大于，等于或者是小于一定尺寸的时候，才被执行的CSS规则。比如：

```css
div.sidebar { 
    width: 300px; 
} 
 
@media all and (max-width: 400px) { 
    // styles assigned when width is smaller than 400px; 
    div.sidebar { 
        width: 100px; 
    } 
 
}
```
规则指定了当宽度小于400px的时候sidebar是100px，其余时候是300px。

需要注意的是在定义media query的时候可以用两套长宽：css里的width/height表示的是documentElement. clientWidth/Height取值，也就是viewport，单位是css像素。css里的device-width/height表示的是screen.width/height，单位是物理像素。

那么使用哪种值来定义media query甚至用不用它都是让人疑惑的问题。比如你用device-width的话 ，其实效果和使用<meta viewport>来定义是类似的。但是用width，仅仅是一个模糊的像素宽度，更加缺乏在各种设备上具体效果的准确预期。目前来看，用media query应该能比较正确的区分运行环境是桌面，手机还是平板，但是并不太能细致到是那款平板或者是什么手机。 

#### **Meta viewport** 

终于可以来讨论<meta name="viewport">了。这个最早是Apple的一个扩展，但是现在已经被各种浏览器抄去了。它主要的作用是用来重定义layout viewport的大小。

我们通过实例来解释：假设你开发了一个网站，没有写css，因此所有的元素没有width属性。打开页面的时候，它们会默认zoom-out到最大，看起来像这样：

<img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="mq_none" border="0" alt="mq_none" src="/downloads/images/2012_08/mq_none.jpg" width="258" height="455" />

用户肯定会zoom-in，这时因为很多浏览器会保持每个元素的宽度仍然是100%的layout viewport，因此，很多文字就撑到visual viewport外面去了变得不可见了(Android原生的Webkit在这种情况下会自动调整text-containing元素的宽度来适配屏幕宽度）。

<img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="mq_none_zoomed" border="0" alt="mq_none_zoomed" src="/downloads/images/2012_08/mq_none_zoomed.jpg" width="336" height="406" /> 

为了避免这种情况，你可能会加上html {width:320px}的css规则。这样<html>的宽度，也就是大多数未定义宽度的元素继承到的宽度，是320px。这样的规则可以解决用户zoom-in放大页面之后溢出的问题，但是当用户刚打开页面的时候，大概又会看的下图的效果(因为300个CSS像素值在完全zoom-out的情况下是很窄的）：

<img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="mq_html300" border="0" alt="mq_html300" src="/downloads/images/2012_08/mq_html300.jpg" width="254" height="445" />

为了解决这种初始和用户缩放之后的不和谐，Apple定义了一个新的meta值。你可以用

```
<meta name="viewport" content="width=320"/>
```

来确定`layout viewport`的宽度。这样在初始的时候，整个页面看起来仍然是非常正确的：

<img style="border-right-width: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px" title="mq_yes" border="0" alt="mq_yes" src="/downloads/images/2012_08/mq_yes.jpg" width="254" height="448" />

meta中定义的layout viewport宽度甚至可以是device-width，也就是以设备像素值标定的`screen.width`取值。但是这里有一个陷阱，就是有时候正式的`screen.width`的取值并不是真的有实际意义，因为像素值可能太高。比如Nexus One的屏幕宽度是480px，但是Google的工程师觉得用`device-width`来定义`viewport`就让`layout viewport`取值480px太宽了，于是它们让device-width的返回值打了个2/3的折扣，只有320px，和iphone一致。这样一来，`device-width`的取值又有点儿CSS像素值的意思了。这种resolution标称的像素值和`device-width`的返回值之间的关系被称为`CSS pixel density`。

<table border="3" cellspacing="0" cellpadding="2" width="772">
  <tr>
    <td valign="top" width="158">
      <strong>Device</strong>
    </td>
    
    <td valign="top" width="170">
      <strong>resolution (px)</strong>
    </td>
    
    <td valign="top" width="442">
      <strong>device-width/ device-height (px)</strong>
    </td>
  </tr>
  
  <tr>
    <td valign="top" width="158">
      iPhone
    </td>
    
    <td valign="top" width="170">
      320 x 480
    </td>
    
    <td valign="top" width="442">
      320 x 480, portrait/landscape mode
    </td>
  </tr>
  
  <tr>
    <td valign="top" width="158">
      iPhone 4
    </td>
    
    <td valign="top" width="170">
      640 x 960
    </td>
    
    <td valign="top" width="442">
      <p>
        320 x 480, in both portrait and landscape mode
      
      
      <p>
        CSS pixel density&#160; = 2
      
    </td>
  </tr>
  
  <tr>
    <td valign="top" width="158">
      iPad 1 and 2
    </td>
    
    <td valign="top" width="170">
      768 x 1024
    </td>
    
    <td valign="top" width="442">
      768 x 1024, portrait/landscape mode
    </td>
  </tr>
  
  <tr>
    <td valign="top" width="158">
      new iPad
    </td>
    
    <td valign="top" width="170">
      1536 x 2048
    </td>
    
    <td valign="top" width="442">
      <p>
        768 x 1024, portrait/landscape mode
      
      
      <p>
        CSS pixel density = 2
      
    </td>
  </tr>
  
  <tr>
    <td valign="top" width="158">
      Samsung Galaxy S I and II
    </td>
    
    <td valign="top" width="170">
      480 x 800
    </td>
    
    <td valign="top" width="442">
      <p>
        320 x 533, portrait mode
      
      
      <p>
        CSS pixel density = 1.5
      
    </td>
  </tr>
  
  <tr>
    <td valign="top" width="158">
      Samsung Galaxy S III
    </td>
    
    <td valign="top" width="170">
      720 x 1280
    </td>
    
    <td valign="top" width="442">
      360? x 640?, portrait mode
    </td>
  </tr>
  
  <tr>
    <td valign="top" width="158">
      HTC Evo 3D
    </td>
    
    <td valign="top" width="170">
      540 x 960
    </td>
    
    <td valign="top" width="442">
      <p>
        360 x 640, portrait mode
      
      
      <p>
        CSS pixel density = 1.5
      
    </td>
  </tr>
  
  <tr>
    <td valign="top" width="158">
      Amazon Kindle Fire
    </td>
    
    <td valign="top" width="170">
      1024 x 600
    </td>
    
    <td valign="top" width="442">
      1024 x 600, landscape mode
    </td>
  </tr>
</table>

