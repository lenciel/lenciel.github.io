---
layout: post
title: "Web应用开发的七项原则"
date: 2014-11-17 22:30:42 +0800
comments: true
categories:
- tips
- architecture
---

本文源自Guillermo Rauch的[7 Principles of Rich Web Application][1]，经过他本人授权，我翻译了放在这里。

   [1]: http://rauchg.com/2014/7-principles-of-rich-web-applications/

这篇文章主要介绍构建使用Javascript来控制UI的网站在设计时的7个原则。它们是我作为一名开发人员的经验所得，也是我作为一名互联网资深用户的体会和总结。

Javascript毫无疑问早已成为了前端开发人员不可或缺的工具。但现在它的使用范围还在不断扩展到其他的领域，比如[服务器端][3]甚至是[微控制器][4]。在斯坦福这样的声望卓越的大学里面，它也已经被选为计算机科学[入门课程][5]的教学语言。 

   [3]: http://nodejs.org/
   [4]: https://tessel.io/
   [5]: http://web.stanford.edu/class/cs101/

即便如此，它在web开发中究竟应该扮演什么样的角色或者说负责哪方面的作用，仍然是个迷：即便对于很多框架和类库的作者而言也是如此：

  * JavaScript应该被用来替代像`history`，`navigation`和`page rendering` 这样的浏览器函数么？
  * 服务器端开发是不是到头了？是不是根本就不该在服务器端渲染HTML了？
  * Single Page Applications (SPAs) 是不是代表着未来的趋势?
  * 一个网站和一个Web应用之间的区别精确的描述起来究竟是什么? 是不是应该就是一个东西?
  * 在网站上，JS应该用来 _增强_ 页面的效果，而在Web应用中，则被用来 _渲染_ 整个页面?
  * 是否应该使用像PJAX或者TurboLinks这样的技术?

下面就是我试着回答这些问题做的一些分析。我的分析是通过用户体验(UX)层面，特别是如何最小化用户拿到他们感兴趣的 _数据_ 的时间，作为切入点，来验证对Javascript的 _各种_ 使用方式。我会从网络通信的基础入手，一直说到对未来趋势的预测。

  1. [Server渲染页面仍然是必须的](#server-rendered-pages-are-not-optional)
  2. [对用户输入立刻响应](#act-immediately-on-user-input)
  3. [数据变更时的应对](#react-to-data-changes)
  4. [控制与服务器的数据交互](#control-the-data-exchange-with-the-server)
  5. [不要破坏history，增强它](#dont-break-history-enhance-it)
  6. [推送代码更新](#push-code-updates)
  7. [行为预测](#predict-behavior)

## 1. Server渲染页面仍然是必须的<a name="server-rendered-pages-are-not-optional"></a>

**TL;DR**: _服务器端渲染与SEO无关，它主要的考虑是性能：需要考虑的包括不在服务器渲染的话，请求脚本、页面样式、页面资源和API请求造成的额外的开销，以及考虑在HTTP2.0里加入的`PUSH of resources`_.

首先需要指出，在业界有一种错误的二分法："server-rendered apps" 和 "single-page apps"的对立。如果我们的目标是用户体验和性能的最优化，那么选择其中任何一个而抛弃另一个都是错误的决定。原因其实很明显：整个互联网用于传输页面的介质，有一个理论上可计算的速度局限。关于这点，Stuart Cheshire有个著名的文献 (或者说是吐槽？)，[“It’s the latency, stupid”][14] :

   [14]: http://rescomp.stanford.edu/~cheshire/rants/Latency.html

{% blockquote %}
The distance from Stanford to Boston is 4320km.
The speed of light in vacuum is 300 x 10^6 m/s.
The speed of light in fibre is roughly 66% of the speed of light in vacuum.
The speed of light in fibre is 300 x 10^6 m/s * 0.66 = 200 x 10^6 m/s.
The one-way delay to Boston is 4320 km / 200 x 10^6 m/s = 21.6ms.
The round-trip time to Boston and back is 43.2ms.
The current ping time from Stanford to Boston over today’s Internet is about 85ms (…)
So: the hardware of the Internet can currently achieve within a factor of two of the speed of light.
{% endblockquote %}

这里提到的从波士顿到斯坦福路上花费的85ms，当然会随着时间的推移不断的改善：如果你现在测试一下说不定已经大大增速了。但需要注意很重要的一点：就算达到了光速，这两个海岸间最少也需要 **50ms** 才能完成通信。

换句话说，用户间连接的带宽再怎么显著提高，花在传输路上的延迟总有无法突破的速度极限。所以，在页面上显示信息时减少请求次数，也就是减少信息被传输在路上的次数，对于良好的用户体验和出色的响应速度而言，至关重要。

这一点在Javascript驱动的Web应用流行起来之后显得尤为明显。这些应用一般`<body>`标签内什么东西都没有，只有`<script>`和`<link>`标签，被称为"Single Page Applications"或者"SPA"。就像它的名字所暗示的一样，服务器返回时一直在重用同一个页面，其他的页面内容都是在客户端被处理和渲染的。

考虑下面的这个场景：用户在浏览器上访问`http://app.com/orders/`，如果这是一个传统的网页，那么在后台处理这个请求的时，就会带回重要的 _信息_ ，用来完成页面的显示：比如，从数据库里面查询出订单，然后把它们的数据放在请求的返回里面。但如果这是一个SPA，那么第一次可能会立刻返回一个包含`<script>`标签的空页面，然后再跑一趟才能拿回用来渲染页面的内容和数据。


![SPA code breakdown](/downloads/images/2014_11/spa_code_breakdown.png "SPA code breakdown")
图1. 服务器端发送的SPA的每个页面组成结构分析

目前大多数的开发者都大方接受了这个额外的 _网络传输过程_ 是因为他们确信这只发生一次：后面反正是有cache的。也就是说，大家形成了这么一个共识，既然整个代码包一旦加载一次，就可以不用再请求其他的脚本和资源就完成对绝大多数的用户交互（包括跳转到应用的其他页面）的处理，那么这个开销就是可以接受的。

但实际上，虽然有cache，脚本解析和执行的时间仍然会带来性能上的下降。[“Is jQuery Too Big For Mobile?”][16] 这篇文章就探讨了即便是加载一个jQuery库，就会花去一些浏览器数百毫秒的时间。

   [16]: http://modernweb.com/2014/03/10/is-jquery-too-big-for-mobile/

更糟糕的是，和以前网速慢那种图片慢慢加载的效果不同，如果是脚本正在加载，用户什么都看不到：在整个页面被渲染出来之前，只能显示空白的页面。

最重要的是，目前互联网数据传输主要的协议TCP _建立_ 比较慢。

首先，我们知道，一个TCP连接先需要握手。如果处于安全考虑使用了SSL，就还需要额外的两个来回（客户端重用了session的话，也需要一个额外的来回）。这些流程完毕之后，服务器才能开始往客户端发送数据。换句话说，再小的代码包实际上也需要几个来回才能完成传输，这就让前面描述的问题变得更加糟糕。

其次，TCP协议里面有一个流控机制，被称为 `slow start`，也就是在连接建立过程中逐渐增加传输的分段(`segments`)大小，入下图所示：

![TCP segments chart](/downloads/images/2014_11/tcp_segments_chart.png "TCP segments chart")
图2. 服务器端在TCP连接的不同阶段能够发送的分段大小(KB)

这对SPA有两个很大的影响：

  1. 文件比较大的脚本，花在下载上的时间比你想象中的要长得多。Google的Ilya Grigorik在他的专著[“High Performance Browser Networking”][17] 里面说过，“4个来回(…)和数百毫秒的延迟都花在从服务器下载64KB的文件到客户端上了”，从前面的图也可以看到，基本是比较高速的网络连接，比如伦敦和纽约之间，一个TCP连接要达到最大速度，也需要花上大概225ms。

   [17]: http://chimera.labs.oreilly.com/books/1230000000545/ch02.html#thats_four_rou

  2. 因为前面说的延迟对首个页面访问也是有效的，所以你让什么数据最先被传输就显得非常重要了。Paul Irish在他的演讲[“Delivering the Goods”][18]给出的结论是，一个Web应用最开始的 **14kb** 数据是最重要的。

   [18]: https://docs.google.com/presentation/d/1MtDBNTH1g7CZzhwlJ1raEJagA8qM3uoV7ta6i66bO2M/present#slide=id.g3eb97ca8f_10


在足够短的时间窗内完成内容传输（哪怕只是呈现基本的没有数据的layout）的网站，就是响应良好的。这也是为什么对于很多习惯了在服务器端处理数据的软件开发者觉得Javascript很多时候根本没必要用，或者是在很有限的情况下用用就行了。当这些开发者使用的是配置良好的服务器和数据库，又有CDN来做部署和分发时，他们这种感觉会非常明显。

但是，服务器在辅助和加速页面内容的分发和渲染中应该被怎么使用，也是需要根据每个应用场景仔细分析的，绝对不是“把整个页面交给服务器渲染吧”那么简单的事情。在一些情况下，如果页面上的内容对用户并不是非看不可的，就可以不放在第一个响应中返回，而是让客户端在后面的操作中到服务器去取。

比如，有的应用会先把一个"壳"页面返回给客户端，然后在这个页面上并发的请求多个部分的数据。这样即使在后台连接速度较慢的情况下，仍然能够有较好的响应速度。还有的应用会把 “[浏览器里面的第一个整屏][20]” 显示的页面做预渲染。

   [20]: http://www.feedthebot.com/pagespeed/prioritize-visible-content.html

服务器能够根据当前处理的`session`，用户和URL对脚本和样式文件进行分类也是很重要的。举例来说，用来对订单进行分类的脚本，对于`/orders`这个URL显然是重要的，而处理"首选项"的逻辑的脚本就不那么重要。再比如说，我们可以对CSS样式表进行分类，比如区分“结构性的样式”和“皮肤和模板的样式”等。前面这类很可能对Javascript的正确运行是必须的，因此需要 _阻塞_ 的方式加载， 后面这类则可以用异步的方式加载。

到目前为止，在服务器端处理一部分或者所有的页面，仍然是避免过多客户端与服务器的交互的主要手段。[StackOverflow in 4096 bytes][21]很不错地展示了如何降低和服务器的来回交互次数。作为概念验证的SPA，它理论上可以做到在握手后的第一个TCP连接中完成加载！当然，要做到这些，它使用了[SPDY 或者 HTTP/2 server push][22]，因此可以在一个hop里面传输所有客户端可以缓存的代码。

   [21]: http://danlec.com/blog/stackoverflow-in-4096-bytes
   [22]: http://www.chromium.org/spdy/link-headers-and-server-hint

![StackOverflow clone in 4096 bytes](/downloads/images/2014_11/st4k.png "StackOverflow clone in 4096 bytes")

图3. 使用了内链CSS和JS技术的`Stackoverflow in 4096 bytes`

   [23]: https://cldup.com/NeV5qFDaVR.png (StackOverflow clone in 4096 bytes)

如果我们有一个足够灵活的系统，可以在浏览器和服务器直接共享渲染页面的代码（比如双方都是js），并且提供工具增量的加载脚本和样式，那么 _网站_ 和 _Web应用_ 就可以合一而不再是两个模棱两可难以区分的词了：它们本身就有一样的UX要素。比如一个博客页面和一个复杂的CRM，都有URL，都需要跳转，都展示数据，本质上并没有太大不同。即便是像数据表格这样复杂的东西，传统上主要是客户端提供的功能来完成对数据的处理，但也首先需要给用户展示那些需要他处理的数据 。降低客户端和服务器交互的次数，对实现我们说的这样的系统非常重要。

在我看来，我们看到的大量系统上采用了这样那样性能上的权宜之策，是因为整个技术栈的复杂度在不断累加。Javascript和CSS这样的技术是被逐渐加入到系统的，它们的风靡又花了一段时间。尽管有人希望在协议上做出改进，来增强性能（比如SPDY或者QUIC），但应用层显然才是最需要改进的地方。

要理解速度的重要性，去重温一下WWW和HTML创立之初的一些讨论是非常有用的。特别是在1997年提议在HTML里加入`img`这个标签的时候，Marc Andreessen在[下面这个邮件thread][24]里反复强调了提供信息的速度有多么重要： 

   [24]: http://1997.webhistory.org/www.lists/www-talk.1993q1/0260.html


{% blockquote %}
“If a document has to be pieced together on the fly, it could get arbitrarily complex, and even if that were limited, we’d certainly start experiencing major hits on performance for documents structured in this way. This essentially throws the **single-hop principle of WWW** out the door (well, IMG does that too, but for a very specific reason and in a very limited sense) — are we sure we want to do that?”
{% endblockquote %}

## 2. 对用户输入立刻响应<a name="act-immediately-on-user-input"></a>

**TL;DR**: _我们可以使用JavaScript来掩盖网络的延迟，把它作为设计原则，就可以在你自己的应用里面去掉绝大多数的`spinner`或者`loading`。使用PJAX和TurboLink的话，你就会失去了这些改善用户速度体验的机会。_.

第一个原则里，在描述为什么要尽量减少前端和后端之间数据来回传输的次数时，主要是基于传输速度有理论上限的事实。实际上另一个需要考虑的要素就是网络的质量。我们都知道，当网络连接状况不好时，就会有数据包需要被重传。所以，你觉得应该一个来回就传输完毕的数据，可能实际上要花去好几个。

在这方面，Javascript正好可以帮上忙：通过客户端的代码来驱动UI，人工的构造出零延迟，就可以_掩盖网络的延迟_，制造一切操作都很顺畅的假象。比如，网页和网页之间是通过超链接，`<a>`标签，链接在一起的。传统网页上，当一个链接被点击时，浏览器就发送一个可能会耗时很久的请求，然后处理请求并把内容呈现给用户。

但Javascript允许你**立刻响应**（有些地方把这个叫**乐观响应**）：当一个链接或者按钮被点击时，页面立刻做出响应而不需要去访问网络。这方面著名的例子就是Gmail（包括最近Google的新产品Inbox）的"邮件归档"功能。当你点击"归档"，UI上邮件立刻会被显示为归档状态，而服务器的请求和处理是异步进行的。

再比如，我们处理的是一个表单。也许你觉得一个表单在数据被提交到服务器，处理结果返回之前，不能做太多的事情。但其实当用户完成输入并点击提交的时候，我们就可以开始响应了。甚至有些做到极致的应用，比如Google搜索页面，当用户开始输入的时候，展示搜索结果的页面就已经开始渲染了。

![Google Homepage](/downloads/images/2014_11/google_homepage.gif "Google Homepage")

图4. Google在用户输入搜素关键字时就开始渲染搜索结果页面

这种行为被称为 _layout adaptation_。 它的思路是当前页面知道操作后状态的页面layout，所以在没有数据填充的情况下，它就可以过渡到下面那个状态的layout。这样的处理是"乐观"的，是因为有可能后面那个页面的数据一直没有返回，而这时候页面的layout已经画在那里了。

Google的主页的演进，非常清楚的说明了我们这里强调的第一和第二个原则。

首先，分析访问`www.google.com`时TCP连接的[包数据][27]可以看到整个首页的数据都被一次性发出来了。整个交互，包括关闭连接，耗时几十毫秒而已。而且，似乎在Google[一开始的版本][28]就做到了这点。

   [27]: https://gist.github.com/guille/3e1b2d7529009370b986
   [28]: http://en.wikipedia.org/wiki/Google#mediaviewer/File:Google1998.png

在2004年晚些时候, Google[标杆性地][29]使用了JavaScript完成`输入时动态提示`功能（和Gmail一样，也是一个20%创新时间产出的项目），这一功能也启发了很多网站开始大量的使用[AJAX][30]:

   [29]: http://googleblog.blogspot.com/2004/12/ive-got-suggestion.html
   [30]: http://www.adaptivepath.com/ideas/ajax-new-approach-web-applications/

{% blockquote %}
Take a look at Google Suggest. Watch the way the suggested terms update as you type, almost instantly with no waiting for pages to reload. Google Suggest and Google Maps are two examples of a new approach to web applications that we at Adaptive Path have been calling Ajax
{% endblockquote %}

到了2010年，Google又[推出了][32]_及时搜索_，也就是我们前面看到的效果：当用户输入关键字时，整个页面无需刷新就可以展示搜索的结果。

   [32]: http://googleblog.blogspot.com/2010/09/search-now-faster-than-speed-of-type.html

另一个例子是iOS。在很早期的版本，iPhone就要求开发者提供一个`default.png`图片，用来在应用被加载完成之前显示给用户:

![iPhone default](/downloads/images/2014_11/iphone_default_png.png "iPhone default")

图5. iPhone OS强制在应用加载前显示一个default.png

当然，这里OS不是在隐藏网络延迟，而是CPU处理延迟。对于iPhone初期版本来说，这样来弥补硬件的弱点非常重要。当然就和网页上使用提前加载一样，这种手法有可能会崩坏：当加载来的数据和`default.png`不匹配的时候。Marco Arment在2010年对它可能带来的影响进行了 [透彻的分析][34]。

   [34]: http://www.marco.org/2010/11/11/my-default-png-dilemma

除开处理表单和输入，Javascript还被大量用于处理**文件上传**。我们可以通过各种前端表现来满足用户上传文件的需求：拖拽，粘贴以及各种file picker。特别是有了[HTML5的新API][36]之后，我们可以在文件完成传输前就显示它的信息。在Cloudup网站的上传文件中，就使用了类似的实现。从图片中可以看到，在用户选择了文件之后，缩略图就立刻生成并显示在用户界面上了：

   [36]: https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications

![Cloudup upload](/downloads/images/2014_11/cldup_upload.gif "Cloudup upload")

图6. 在上传完成前图片就被显示出来并且加入了虚化效果

上面的方式都是采用前端技术来制造_速度的假象_，但这种方式其实在很多地方都被证明是有效的。[一个例子][38]是在美国休斯顿机场，通过_增加_到达乘客走到行李提取处的距离，而不是实际上的行李处理速度，就大大的_减少_了旅客抱怨行李领取太慢的问题。

   [38]: http://www.nytimes.com/2012/08/19/opinion/sunday/why-waiting-in-line-is-torture.html

运用了这种设计原则的应用，使用`spinners`或者`loading`提示符来提醒用户页面正在刷新的场景会非常少出现。整个页面的动线，都应该被_实际数据_来驱动。

当然，立即响应这个原则也不能被滥用。在特定的用户交互场景下，立即响应是有害的：比如用户在注销或者是支付的流程中，我们当然不能让他"乐观"的认为没有真正完成的操作已经完成了。但即使在这些场景下，使用`spinners`或者`loading`提示符也不应该**被提倡**。 只有在你觉得应该提醒用户这个操作会非常长，你可以去干别的事情时，才应该显示它们。那是多长？在UX设计中经常被引用的[Nielsen的研究报告][39]上是这么说的：

   [39]: http://www.nngroup.com/articles/response-times-3-important-limits/

{% blockquote %}
The basic advice regarding response times has been about the same for thirty years Miller 1968; Card et al. 1991:
0.1 second is about the limit for having the user feel that the system is reacting instantaneously, meaning that no special feedback is necessary except to display the result.
1.0 second is about the limit for the user’s flow of thought to stay uninterrupted, even though the user will notice the delay.Normally, no special feedback is necessary during delays of more than 0.1 but less than 1.0 second, but the user does lose the feeling of operating directly on the data.
10 seconds is about the limit for keeping the user’s attention focused on the dialogue. For longer delays, users will want to perform other tasks while waiting for the computer to finish.
{% endblockquote %}

像PJAX或者TurboLinks这样的技术，则很大程度上完全不具备提前渲染状态迁移后下一个页面的基础layout的能力。只有当服务器端的返回传输到客户端，客户端才能开始响应。

## 3. 数据变更时的应对<a name="react-to-data-changes"></a>

**TL;DR**: _当服务器的数据变化时，应该主动让用户知道。这样可以使得用户无需经常进行手动的刷新(F5, Cmd+R....)，也是一种性能上的改进措施。新的挑战是：(重)连接的管理，状态的一致性问题_.

第三个原则就是当数据源(一般是一个或者多个数据库)的数据有变更时，UI要_主动响应_。

给用户一个当前数据的静态的HTML快照，直到用户刷新页面（传统网页）或者操作页面元素（AJAX）已经逐渐变得过时。你的UI应该是**自刷新**的。当数据节点不断增加，我们设计时需要开始考虑包含手表、电话的各种移动设备和可穿戴设备时，这点尤其重要。

以Facebook初期对newsfeed的实现为例，因为用户都是用PC机在更新状态，把它实现成静态的网页未尝不可：一般来说，人们一天更新一次就差不多了。但现在我们生活在一个人们拍照后可以立刻分享，朋友们可以立刻发表评论的时代，对数据变化的实时响应成为了应用开发的基础需求。这不仅仅是因为我们的应用程序是多用户并发访问的，即便就考虑单用户的场景，实时更新也是很重要的。以用笔记本分享我们手机上的照片的场景为例：

![Concurrent Data Points](/downloads/images/2014_11/concurrent_data_points.gif "Concurrent Data Points")

图7. 即便是单个用户操作的场景，更好的响应性也能带来体验的提升

有的数据，比如**Session和登录状态的同步**，在多个页面间应该是非常实时的同步的。这样，当用户打开了多个tab，从其中的任何一个登出，其他的所有页面都应该登出。这点对保护用户的隐私是非常重要的，特别是我们有些设备是多个人在同时使用。

![Each page reacts to the session and login state](/downloads/images/2014_11/login_sync.gif "Login synchronization")

图8. 不同的页面间同步登录状态

一旦你的用户习惯了你的应用的数据是自动更新的，那么你就要考虑一个新的需求：**状态一致性**。当客户端收到一个原子的数据更新时，必须考虑即便在断网很长时间之后，也能够正确的完成更新。比如，你的笔记本突然没电了，几天后再打开，应用的数据是不是还正确？

![twitter数据一致性](/downloads/images/2014_11/twitter_data_reconciliation.png "twitter数据一致性")

图9. 长时间断线后重连的情况下twitter的页面

是不是能够保持数据的一致性也会影响你的应用在第一条原则上的表现。如果你想对首次请求的数据做优化，必须要考虑如果是断线后重连，那么第一个请求应该首先需要重新建立session。

## 4. 控制与服务器的数据交互<a name="control-the-data-exchange-with-the-server"></a>

**TL;DR**: _接下来主要讨论的是如何精细的控制客户端和服务器之间的交互。注意出错处理，自动重试，在后台同步数据并管理好离线的缓存。_

在互联网初期，客户端和服务器间的交互还仅仅有下面几种方式:

  1. 点击一个连接，会触发 `GET` 来获取一个新页面并重新渲染页面
  2. 提交一个表单，会触发一个 `POST` 或 `GET` 并重新渲染页面
  3. 嵌入一个图片或者对象，会触发一个异步的 `GET` 并重新渲染页面

这个模型以其简洁性显得很具吸引力，但是我们今天要明白服务器和客户端之间的数据交互，学习曲线就陡多了。最大的问题在第二点，如果不能在不刷新页面的情况下提交数据，毫无疑问是一个性能上的弱点。更重要的是，它会使得回退键不可用：

![Possibly the most annoying artifact of the old web](/downloads/images/2014_11/annoy_artifact.png "Annoy Artifact")

图10. 老一代网页上最让人讨厌的东西

把网站作为**应用平台** 来考虑，没有Javascript将是不可想象的事情。AJAX单单是在表单信息提交这方面，就让交互体验产生了一次_飞跃_。我们现在更是有了一堆各式各样的API (`XMLHttpRequest`, `WebSocket`, `EventSource`以及更多其他的) 来更好地更细致的控制数据流。不但可以在用户输入的时候就开始处理用户数据，还能够有机会提供更好的UX体验。其中一个和前面那个原则有关的UX体验上的改进就是显示当前_连接状态_。如果我们的用户觉得数据是应用自己去刷新不需要他手动操作，那么就应该显示_连接中断_以及_正在重试连接中..._等状态。

当发生连接中断时，最好先把数据存在内存（或者更好的，存到`localStorage`），以便在网络恢复后重新发送。 就像在[ServiceWorker][47]的介绍中提到的那样, 可以让Javascript应用在_后台运行_。

   [47]: http://jakearchibald.com/2014/using-serviceworker-today/

除开断网，当发送数据出现超时或者是错误时，也可以试着**自动重试**，只在确认无法成功了之后，才将问题抛给用户感知。当然，有些特别的错误还是需要额外小心的处理。比如一个`403`错误，通常说明用户的session过期了。这种情况下就该让用户重新登录，而不是继续重试了。

还要注意使用这种模式时，要屏蔽用户中断数据流的操作。这种操作有两种，第一种也是最明显的一种是用户尝试关闭当前页面，这种情况可以通过`beforeunload`这个`handler`来处理。

![The beforeunload browser warning](/downloads/images/2014_11/before_unload_warning.png "Before unload warning")

图11. 页面关闭之前弹出警告

另一种（不那么明显的）是那些触发页面转换的操作。比如点击页面上的链接，触发一个新的页面载入。这种时候你可以显示自己的弹出窗口。

## 5. 不要破坏history，增强它<a name="dont-break-history-enhance-it"></a>

**TL;DR**: _不使用浏览器来管理URL跳转和history，将带来新的挑战。我们必须保证用户在浏览时，应用的表现符合他的期望。可以自建缓存来提高响应速度。_

即使不考虑表单的提交，而是设计一个仅有超链接的Web应用，也需要考虑让前进/后退导航变得更可用。比如典型的`infinite pagination scenario`，也就是应用应该允许用户在页面上随便跳转，它的实现通常需要使用Javascript监听对链接的点击，然后注入数据或者HTML（还有个可选的步骤是调用`history.pushState`或者是`replaceState`，但不幸的是很多人都不没有使用它们）。

这就是我使用“破坏”来形容它的原因：在Web被设计之初，这种监听对链接的点击并注入数据的情况，并不在设计图景中，而是每个状态的变迁都需要URL的变化来驱动。但虽然这种既有模式被Javascript“破坏”了，另一方面，通过使用Javascript控制history，也出现了_提升_的机会。

一种提升的做法是Daniel Pipius提出的所谓[Fast Back][50]:

   [50]: https://medium.com/joys-of-javascript/beyond-pushstate-building-single-page-applications-4353246f4480

> 回退应该很快；用户默认数据不会有很大的变化，应该能很快回到上个页面。

我们可以近似的把回退按钮认为是一个在应用每个页面都可用的按钮，然后使用原则2来设计它：_对用户输入立刻响应_。这里要考虑的关键就变成了如何缓存前一个页面以便很快能再次渲染出来。接下来你就还可以想想原则3：如何在数据有了变化时，让用户感知到这些变化。

另外，有一些场景下，你没法控制缓存的行为。比如，如果用户在你渲染一个页面的时候跳到第三方网站上去了，然后他按回退键。这个时候就会遇到下面的这个bug：

![Pressing back incorrectly loads the initial HTML from the pageload](/downloads/images/2014_11/back_button_bug.gif "Back Button Bug")
图12. 按回退键时载入了原始页面的HTML而不是刷新后的

另一种破坏性的操作是忽略 _scrolling memory_。和之前那个问题一样，如果页面没有JS或者其他人工的history管理，多半就不会有这个问题。但局部动态刷新的页面多半就会遇到：我测试了最著名的Javascript驱动的网站，它们的newsfeeds都有_scrolling amnesia_的问题：

![Infinite pagination is usually susceptible to scrolling amnesia](/downloads/images/2014_11/back_button_bug.gif "Scrolling Amnesia")

图13. 滚动失忆问题

最后，要注意哪些状态应该被持久化。比如是不是需要展开显示文章的评论：

![Infinite pagination is usually susceptible to scrolling amnesia](/downloads/images/2014_11/back_button_bug.gif "Scrolling Amnesia")

图14. 在操作history来导航时，是否展开显示评论也被持久化了

因为是在应用内使用超链接触发的页面重渲染，用户的期望是回到这页时，他之前展开的评论树仍然是展开的。这个状态其实是_瞬态的_， 仅仅在history栈上的这页有这个状态。

## 6. 推送代码更新<a name="push-code-updates"></a>

**TL;DR**: _数据自动更新但代码的更新不是自动推送的应用是低效的。要避免API出错，增强性能。使用无状态的DOM来避免重画。_

让你的应用能够对_代码变更_进行推送是至关重要的。

首先，这样可以减少出错的可能并增强稳定性。当你的后台接口改变时，客户端的变更是_必须的_，否则客户端就没法处理服务器来的新格式的数据，或者上报一堆服务器没法理解的旧格式的数据。

考虑到原则3，代码更新的推送还有一个重要的原因：传统的网站，刷新页面一方面是为了加载新的数据，另一方面也常常是为了加载新的代码。一旦你的UI让用户觉得数据是自动刷新的，他们就不会有意识的再去刷新页面。这样仅仅有一套数据推送的机制是不够的，特别是考虑到现今很多应用一个页面要被打开很长的时间。

如果服务器本身有notification通道，那么可以在代码需要更新的时候推送通知给用户。如果没有，可以在客户端请求的HTTP头里面带一个版本号。服务器检查这个版本号，根据情况看要不要拒绝客户端的请求并要求它更新。

有了这些，应用就可以在加载数据或者代码时不再需要用户自主进行页面刷新了。比如，当一个页面[不可见][55]，表单的输入没有被填写的时候。

   [55]: https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API

但更好的做法是进行所谓的**代码热重载**。 这主要是指整个页面不需要进行重刷，而是特定的_模块_被替换并重新执行代码逻辑。

在很多已有的代码基础上要实现代码热重载是困难的。但从架构上把_行为_（代码）和_数据_（状态）隔离，也是非常值得考虑和探讨的。如果能这样解耦，就能很轻松的进行很多本来复杂的修改。

比如，你的应用需要建立一个事件总线（比如[socket.io][56]）。当总线接收到事件时，某个特定的模块就改变自己的行为，比如，根据新的数据状态来产生不同的DOM内容。

   [56]: http://socket.io/

理想状态下，我们能够以单个模块的粒度来更新代码。也就是说，仅仅因为要更新代码，没必要断开现有的socket连接。这样理想的代码能够热重载的架构就是_模块化_的。但是这里带来的挑战是模块的更新不能带来意料之外的副作用，为了实现这点，像[React][57]这样的优秀的框架被创造出来。当一个模块的代码更新后，它的代码逻辑能够静静地重新运行一次来更新DOM。 这方面的一些解释可以看看Dan Abramov的[文章][58].

   [57]: http://facebook.github.io/react/
   [58]: http://gaearon.github.io/react-hot-loader/

从根本上来说，代码热重载可以极大程度上帮助你基于DOM渲染页面。特别是当状态保持在DOM里面，或者是事件响应都是你自己手工创建的时候，更新代码是一个非常复杂的事情。

## 7. 行为预测<a name="predict-behavior"></a>

**TL;DR**: _通过行为预测来进一步减少延迟。_

一个Javascript的应用可以有预测_用户输入_的机制。

最常见的办法是在数据请求的动作被真正触发之前就进行数据的预获取。比如在用户hover到链接上而不是真正点击链接的时候就开始取数据。

另一个比较复杂的预测用户行为的办法是通过监听用户鼠标的运动，分析它的轨迹来预测它可能会去到的”可以操作元素“，比如是按钮。下面是一个[jQuery的例子][60]:

   [60]: https://medium.com/@cihadturhan/a-ux-idea-i-know-where-you-are-aiming-3e00d152afb2

![jQuery plugin that predicts the mouse trajectory](/downloads/images/2014_11/behavior_predict.gif "I know where you're aiming")

图12. jQuery鼠标运动轨迹预测插件

## 结论<a name="conclusion"></a>

网络过去和现在都是信息传递最通用的媒介。当我们不断让我们的页面变得更动态时，也要注意在引入新的特性时，能保持历史上确定的一些好的用户体验准则。

互相用超链接集结在一起的页面是各种类型的应用的组成单位。当用户浏览页面时，渐进地加载代码、样式表和标记，可以在保证性能的基础上不牺牲太多的交互性。

Javascript带来了新的契机，一旦被全面采用，将可以在保证最佳的用户体验基础上，构建前所未有的最广阔最开放的应用平台。

