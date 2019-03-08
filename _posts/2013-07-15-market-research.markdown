---
layout: post
title: "Market Research, Wireframing and Desgin"
date: 2013-07-15 15:04
comments: true
categories: 
- startup
- course
---

#### **点子，执行力和市场**

Quora上有一个著名的[问答](http://www.quora.com/Startup-Advice-and-Strategy/As-first-time-entrepreneurs-what-part-of-the-process-are-people-often-completely-blind-to/answer/Mike-Sellers)，Mike Sellers的答案里面有一部分在江湖上流传很广：

{% blockquote %}
An idea is not a mockup
A mockup is not a prototype 
A prototype is not a program 
A program is not a product 
A product is not a business 
And a business is not profits
{% endblockquote %}

这里描述了一个从点子到产品到盈利的状态机，在每个阶段，都有很多人失败了，无法进入下一个阶段。失败的原因，主要是因为面对的系统足够复杂时，可能会有不可预见的各种[缺陷](http://www.maa.org/devlin/devlin_05_03.html)。特别是对我们搞技术的而言，虽然可能走完Program这个阶段，但是后面的三个阶段才是真正考验的开始。

| 阶段      |  完成的条件      | 完成需要的最短时间 |
| ---------| ----------------|-----------------|
| Idea     | 有一个赚钱的点子  | 1分钟  |
| Mockup   | 所有流程的Wireframe          | 1天+  |
| Prototype| 跑通最关键流程的一个丑陋的实现          | 1周+  |
| Program  | 有测试并覆盖了所有流程的完整实现          | 2-4周+  |
| Product  | 工业设计，专利，定价，生产等          | 3-6月+  |
| Business | 注册，监管机构备案，工资公司准备金等          | 6-12月+  |
| Profits  | 以超过成本的价格售出产品          | 1年-正无穷|  

从完成各个stage需要的时间可以看出，成功的企业都不是只有一个好点子：在状态机的前端，一定是一大堆好的点子。这些点子中的致命缺陷一定要在下面的某个stage才会暴露出来，但足够多的点子是基础。建议有一个专门的地方，`Google Docs` 也好， `OmniFocus` 也好，就是个简单的txt也好，保存和整理自己的点子，并且记录这些点子被推动到哪个阶段了。

##### **点子**

一说到开自己的公司，最重要的似乎就是一个好的点子。这就是为什么很多人觉得自己和扎克伯格之间就差一个点子而已[^1]；也是为什么那么多完全不生产产品的[知识产权风投公司](http://www.npr.org/blogs/money/2013/06/07/188370495/when-patents-attack-part-two)靠着专利费[活得好好](http://www.plainsite.org/articles/article.html?id=2)的。换句话来说，在很多人看来，只要有了好点子，如何实现并且推向市场就只是一些细节的问题了。

##### **执行力**

[Bob Metcalfe](http://www.wired.com/wired/archive//6.11/metcalfe_pr.html)，以太网的发明者，3Com的创始人却有另一种认识：

{% blockquote %}
Metcalfe says his proudest accomplishment at the company was as head of sales and marketing. He claims credit for bringing revenue from zero to more than $1 million a month by 1984. And he's careful to point out that it was this aptitude - not his skill as an inventor - that earned him his fortune.

"Flocks of MIT engineers come over here," Metcalfe tells me, leading me up the back staircase at Beacon Street. "I love them, so I invite them. They look at this and say, 'Wow! What a great house! I want to invent something like Ethernet."' The walls of the narrow stairway are lined with photos and framed documents, like the first stock certificate issued at 3Com, four Ethernet patents, a photo of Metcalfe and Boggs, and articles Metcalfe has written for The New York Times and The Wall Street Journal.

"I have to sit'em down for an hour and say, 'No, I don't have this house because I invented Ethernet. I have this house because I went to Cleveland and Schenectady and places like that. I sold Ethernet for a decade. That's why I have this house. It had nothing to do with that brainstorm in 1973."'
{% endblockquote %}

从一定程度上这种认识反应了另一种普遍的观点： **执行力，而不是点子，才是创业的关键** 。这种在Hacker News上被[一而再再而三的提及](https://www.google.com.hk/search?q=site%3Anews.ycombinator.com+idea+not+execution&qscrl=1)的观点确实是有道理的：冒出一个“创建社交网络”的点子很简单，但是要把它涉及的各种细节，大到是采用[对称](https://www.facebook.com/)还是[非对称](https://twitter.com/)的社交网络小到“Poke”应该怎么实现，考虑清楚，就不那么容易了。而即使考虑清楚上线后用户也很多，怎么把流行转化成盈利就更加艰难了：看看Second Life或者Digg的下场多么凄惨。

所以如果你开始创业，不妨提醒一下自己：点子或者甚至是专利并没必要放在那么至高无上的位置，能work的prototype要重要得多。可能在你游说投资者的时候，专利显得你的技术比较有门槛有防御性。但是一方面，如果你的东西被别人听到或者看过就能很容易的复制，可能也确实说明了产品的技术门槛比较低。另一方面，“我有一个创建养宠物的人的社交网络的点子”和“我开发了一个可以让养宠物的人快速找到信赖的兽医的系统“相比，后者对投资人的说服力要大多了。

因此创业的时候，你的点子可以大方的拿出来和周围的人讨论，他们会给你一些你意想不到的角度的意见。当然，有一种讨论是例外的，那就是在类似[Hacker News](https://news.ycombinator.com/item?id=3639175)这样的创业社区里面。除非你的开发已经到了适合曝光原型的阶段，一般来说最好不要太早曝光你在做的事情。

这也是另一个对创业者来说执行力比点子更重要的原因：一旦你的点子被市场证明是可行的，就会有模仿者。不管多么伟大的社会，一旦一种商业模式被验证，就会有人开始跟进：这是因为找到一个solution比[验证一个solution](http://en.wikipedia.org/wiki/Primality_test)难多了。所有跟进的人在抄袭你的核心功能时，都会加上他们自己独特的改进，这个竞争的过程中你必须有很强的执行力才能保持领先并脱颖而出。从Google战胜AltaVista，Facebook战胜Myspace和Friendster的过程都验证了这点。这也是为什么保持专注，不断努力的实现[product-market fit](http://www.ashmaurya.com/2009/11/achievingproductmarketfit/)而不要惊动竞争对手显得特别关键的原因。

##### **市场**

除开前面两个观点之外，还有一种观点。站在投资者角度，可以把"点子"对应到"产品"，把"执行力"对应到"团队"。也就是说，一个足够好的团队是可以推动各种执行层面的细节（财务上的，商务上的，技术上的，法律上的），把一个好的点子落实成一个产品的。但是这些仍然不是全部。用[Marc Andreessen](http://pmarchive.com/guide_to_startups_part4.html)的话来说：

{% blockquote %}
Personally, I’ll take the third position – I’ll assert that market is the most impor- tant factor in a startup’s success or failure.

Why?

In a great market – a market with lots of real potential customers – the market pulls product out of the startup. The market needs to be fulfilled and the market will be fulfilled, by the first viable product that comes along. The product doesn’t need to be great; it just has to basically work. And, the market doesn’t care how good the team is, as long as the team can produce that viable product.
{% endblockquote %}


##### **那么究竟什么是最重要的：产品/点子，执行力/团队，还是市场?**

任何有一点儿[机器学习](http://cs229.stanford.edu/materials.html)知识的人都能明白这三者是没有绝对的优先顺序的：它们都是关键因子，我们需要挨个解决。首先，我们要解决的问题是如何找到一个好点子？

##### **点子迷宫**

一个好的创始人不应该只是有个好点子，他/她应该具备鸟瞰“点子迷宫”的能力。把解决一个需求的各种点子想象成迷宫里面的各条道路，作为消费者很可能只看到了拿出了产品的公司走的那条路。而作为好的创始人需要了解其他的公司是死在什么样的路上以及它们遇到了什么样的无法解决的问题。下图就是一个迷宫的例子：

![example of idea maze](/downloads/images/example_of_idea_maze.png "Don't touch me...")

有时候你不经过前一个迷宫有所积累，就没法到达下一个迷宫并走出去（比如Google是在search上有所收获之后，在[eamil](http://googlepress.blogspot.com/2004/04/google-gets-message-launches-gmail.html)上也开始有了建树）。有时候迷宫自己也会随着时间变化（比如[Pandora的iPhone版本](http://readwrite.com/2012/09/24/pandora-internet-radio-fairness-act#awesm=~obLCTtNRcPEnuA)）。有时候别的公司无法解决的问题被其他一些公司解决了（[Webvan失败了](http://www.gartner.com/id%3D334368)，但是[Amazon](http://fresh.amazon.com/welcome;jsessionid=555BD9DF6EBBE824BCB76464FB768B3C)、[Walmart](http://delivery.walmart.com/usd-estore/index.jsp?referrer=cookiesDetecting)和[Safeway](http://shop.safeway.com/ecom/home)成功的建立了送鲜货的物流）。有的时候解决前面的公司遇到的问题就形成了新公司进入迷宫时手里最有利的武器（比如Google的Pagerank灵感正是来源于Alta Vista在[1991年](http://home.web.cern.ch/about/birth-web)还不那么明显的[问题](https://news.ycombinator.com/item?id=3925089)）。

就像其他迷宫一样，大多数人都能找到创业迷宫的入口，但是能看到整个局面的人就不那么多了。拿前面图里面的例子来说，一个平庸的创始人可能就看到了"电影音乐分享"或者是"照片分享"的迷宫的入口，但是却看不清这个产业的历史，竞争对手的状况，[失败的例子](http://www.barrysookman.com/2010/05/13/blogged-what-do-limewire-napster-kazaa-and-isohunt-all-have-in-common/)和能够让自己脱颖而出的技术。

因此，好的创始人要有能力鸟瞰整个迷宫，了解所有可能的路径和可能的问题。如果你能够使用示例中图表的形式详细的描述整个问题域，分析各种决策树上的各个分支，解释为什么你的计划能够顺利通过迷宫到达出口而不会遇到前面20个公司遇到的这样那样的问题，你可能就真的有一个不错的点子了。这就是为什么了解行业历史和做足够市场调查是那么重要。

##### **执行力**

有了好的点子之后，如何建立执行力？其实简单来说，执行力无非是把todo list上的下一个东西做了。这是一个说起来很容易，但做起来非常有难度的事情：你要学会对其他人说不，你要学会对干扰说不，聚精会神地完成你的任务。

在各种保持专注力的方法论中，最好的是Thiel的 [One thing](http://blog.idonethis.com/post/37113345206/peter-thiels-unorthodox-management-philosophy-of) ：组织里面每个人在任何时间都应该不仅知道自己首要的任务是什么，同时也要明白别人手里首要任务是什么。Marc Andreessen的 [anti-todo list](http://blog.idonethis.com/post/34170232603/marc-andreessens-productivity-trick-to-feeling) 也[值得一试](http://lencie.cn/blog/2013/03/15/use-done-list-rather-than-todo-list/)。

#### **你的目标市场**

##### **创业公司 vs. 小型企业**

清楚创业公司和小企业之间的[区别](http://www.kauffman.org/uploadedFiles/DownLoadableResources/a-tale-of-two-entrepreneurs.pdf)是非常重要的。一个创业公司关注的是增长：如何引领行业，如何从小做大，如何创造丰厚的利润。Google，Facebook，Square，AirBnB等，这些公司都是标志性的创业公司。相比而言，小企业的目标可能不是那么宏伟：它们建立的基础多半是在一定地域内的某个行业有一些特别的优势，比如咖啡店，洗衣店等。

这也是为什么创业公司常常出现在互联网领域：这个领域的很多资源是虚拟化的，而虚拟化的资源从1扩展到1亿可比实体的资源要容易多了。比较一下37Signals的扩张和麦当劳星巴克的扩张你就会发现很多不同之处。

另一个明显的区别是小企业一般在很短的时间内就必须开始盈利。否则，会在很短时间内因为止损而关门大吉。创业公司则不同：可能会有很长一段时间是亏损的状态，直到顺利翻盘或者是倒闭。

另外创业公司需要锻炼的就是和资本打交道的能力。VC的钱既可能造成[严重的问题](http://mystartuphas30daystolive.tumblr.com/)，也可能让创业公司一飞冲天。做出决定的最核心的考量在于你的野心和你承受失败的能力：如果你不能承受从0开始，那就不要希望做到很大（[1](http://diffle-history.blogspot.com/),[2](http://www.paulgraham.com/startupmistakes.html),[3](http://www.businessinsider.com/33-startups-that-died-reveal-why-they-failed-2013-6?op=1)）。

##### **创业公司必须清楚自己的成本和利润**

如果你是有一飞冲天的雄心也准备好了迎接失败，那么投身到一个行业之前，也要先调查清楚你的产品是不是能够承载你的梦想。

我们都知道产品的成本会随着产量的增大变低。假设产量、成本和利润的关系如下表所示：

| 产品产量      |  单位产品成本      | 单位产品利润 |
| ---------| ----------------|-----------------|
| 0<=n<=00     | 1200  | 1000  |
| 101<=n<=1000   | 975          | 1000  |
| 1001<=n| 700          | 1000  |

凭着这张表你就可以筹到大约 `$50000` 启动资金来完成最初的100个订单，然后准备 `$24,7500` 用于后续的1000个订单的完成。经过这两个阶段性胜利之后，你大概才仅仅把成本捞回来而已。

这些简单的计算告诉我们：首先，降成本是非常关键的，比如通过使用软件把单位产品的成本变成固定的成本。其次，把整个事情做起来需要的资本是要提前计算的，这也是VC们需要的数据之一。最后，定价也是需要技巧的。由于一开始没有竞争，你可以定一个相对高的价格来赚取足够的成本。而且，[研究证明](http://innovatobase.wordpress.com/2013/03/04/loyal-customers-vs-groupon-csutomers/)免费或者是以极低折扣拿到产品的用户是没有忠诚度的。那些给钱的用户会认为自己也参与了产品的过程（比如提出建议等）。


##### **创业公司必须清楚经济体的规模**

当有了一个从数据上看起来不错的产品之后，你还要研究所处的市场是什么样一个规模。

``` bash
市场规模 = 年均消费总数 x 产品平均价格
```

很明显，你如果梦想拥有年销售额10亿的事业，这个市场要不就是产品价格很高，要不就是消费总数很大。下面的一些例子说明了10亿的事业可以如何被构建出来：

- 均价$1，总数超过10亿: Coca Cola
- 均价$10，总数超过1亿: Johnson and Johnson 
- 均价$100，总数超过千万: Blizzard
- 均价$1000，总数超过百万: Lenovo
- 均价$10,000，总数超过十万: Toyota
- 均价$100,000，总数超过一万: Oracle
- 均价$1,000,000，总数超过1,000: Countrywide

当然，现在全球化程度高，很多市场是超过了10亿的，比如汽车。每年汽车市场大概是[1亿的产量](https://en.wikipedia.org/wiki/Automotive_industry#World_motor_vehicle_production)，均价大概是$10000。这就是为什么Google花大价钱研究[无人驾驶车](http://www.forbes.com/sites/chunkamui/2013/01/22/fasten-your-seatbelts-googles-driverless-car-is-worth-trillions/)背后的商业考虑：这是个比搜索潜力要大很多的市场。

另外需要注意的是均价低的产品需要自动化程度极高的生产和稳定的质量才会有利润。如果你$1的可乐经常被消费者投诉你是没有办法做下去的。相对的，低价的产品对销售的需求也降低了：你不需要售楼小姐那样巧舌如簧的队伍也能把可乐卖出去，不是吗？

#### **市场调查**

在了解了市场调查的重要性之后，我们究竟如何能够掌握一个市场的规模以及相应的我们的产品需要多少财力人力的投入呢？

##### **市场调查工具**

假设你现在对一个市场有了兴趣。比如，你相信新闻里面说的[人民币](http://www.scmp.com/business/money/markets-investing/article/1076500/yuan-hailed-world-reserve-currency)最终会取代美元成为[世界通用币](http://online.wsj.com/article/SB10001424052702303561504577496233362694486.html)。于是你想做一个服务让人们可以方便的把USD换成RMB。你如何验证你的构想是否成立？

1. 首先，你要从媒体的报道里面抓取信息，形成一个总体框架。除开媒体，Google Books，美国的[SEC flings](http://www.sec.gov/edgar.shtml)和维基百科都会非常有用。
2. 然后，你要学会从Google的商业数据搜索引擎里能拿到的数据中，算出一个市场规模。
3. 熟悉Google的[Keyword Planner](https://adwords.google.com/um/Signup/Home)和Facebook的[Advertiser Tools](https://www.facebook.com/ads/create/)。
4. 如果前面的研究表明这个市场的确是可以预期的，你可以创建一个类似[Launchrock](http://launchrock.co/)的首页，做一些基本的[SEO](http://moz.com/beginners-guide-to-seo)。如果你真的要理清并向别人展示你的想法，你可以还需要画一些wireframe。
5. 最后，你可以去Google的[Adwords](https://adwords.google.com/um/Signup/Home)或者是Facebook [Ads](https://www.facebook.com/advertising)上投放一些广告看看可能的效果。

这些步骤主要的目的就是，在你开始投入时间和金钱进行所谓的MVP([Minimum Viable Product](http://en.wikipedia.org/wiki/Minimum_viable_product))开发之前，需要验证市场的存在性。了解市场这件事情要从数据入手，也是一个重要原则。就像福特说的一样，如果他只是去问每个消费者他们想要什么，可能他们的回答会是：一匹更快的马。

##### **如何确定产品层次**

在你有了点子，也调查清楚了市场，如果进行你产品的市场定位？首先可以读读Kickstarter的[product tiers](http://blog.boundforanything.com/2012/02/how-to-set-tiers-on-kickstarter/)和[trends](http://www.kickstarter.com/blog/trends-in-pricing-and-duration)。

这里的思路是，假设你的市场调查面向的市场是一个70亿人的全球市场。那么你的市场调查的表格每一行代表一个人，N列代表一个个他们的属性（地域、职业等），K列代表产品的属性（产品的版本等）。通过[Google Consumer Research Surveys](http://www.google.com/insights/consumersurveys/home)或者是[Launchrock landing](http://answers.onstartups.com/questions/44163/lean-startup-landing-page-test-how-do-i-measure-success) pages这样的产品，你可以从受访人群中取样得到自己的产品要如何设计。

当然，如果你是认真的要开始一个startup，付费给专业的机构进行市场调查可能比使用这些产品对你来说性价比更高。

#### **Wireframe，Copywriting和Design**

一旦确定了要动手，你就得首先设计你的产品网站的mockup，也就是所谓的wireframe。

##### **Wireframe**

优秀的Wireframe工具很多，特别是下面几个：

- [Omnigraffle Pro](http://www.omnigroup.com/products/omnigraffle/)特别适合专业UX
- [Lucidchart](https://www.lucidchart.com/google_drive/prompt)对团队合作支持很好
- [Jetstrap](https://jetstrap.com/)可以把最终的设计转成Twitter Bootstrap
- [POP](http://thenextweb.com/apps/2012/11/17/pop-this-iphone-app-is-every-designers-missing-puzzle-piece-for-prototyping-on-paper/)可以方便的导入手绘的流程图

熟练掌握上面的一两个就足够了，Wireframe的目的是为了得到一个全站的[架构和流程示意](http://wireframes.linowski.ca/2009/12/omnigraffle-wireflows/)。

##### **Copywriting**

筑造品牌形象的一些原则：

- 通过主页表达：你的核心竞争力和品牌价值必须要在主页里面体现。不要指望用户会点到其他页面。
- 通过媒体发布：Amazon在进入产品阶段之前就[先发媒体稿](http://aws.amazon.com/about-aws/whats-new/)。通过搜集反馈，很快就能知道究竟什么是用户期待的新功能，什么是自己制造的噪声。
- 研究对手扬长避短：我们在进行技术选型时常常[这么做](http://en.wikipedia.org/wiki/Comparison_of_relational_database_management_systems#Fundamental_features)。了解你的竞争对手的缺陷和你的优势，会让你明白究竟什么是你脱颖而出的关键。
- 数据说话，案例说话：没有什么比市场里面的数据和成功案例更有说服力。

##### **Design**

设计的一些原则：

- **Vector和Raster图片** ：首先你要明白[vector](http://en.wikipedia.org/wiki/Vector_graphics)和[raster](http://en.wikipedia.org/wiki/Raster_graphics)的区别。如果可能的话，尽量使用vector，特别是在早期MVP阶段。
- **对齐，对比度等**：Robin Williams的《[Non-Designer's Desgin Book](http://www.amazon.com/The-Non-Designers-Design-Book-Typographic/dp/1566091594)》值得一读。特别是其中提到的[4个基本原则](http://www.nurelm.com/themanual/2009/07/07/designing-for-the-non-designer-part-i-the-basics/)：[Alignment](http://www.vanseodesign.com/web-design/design-basics-alignment/)，[Repetition](http://www.vanseodesign.com/web-design/design-basics-repetition/)，[Contrast](http://www.vanseodesign.com/web-design/design-basics-contrast/)，[Proximity](http://www.vanseodesign.com/web-design/design-basics-proximity-to-know-what-belongs-with-what/)。
- **字体和图标** ：尽量使用字体来表达设计。因为字体是矢量图，并且在所有的浏览器里面都可以用 `CSS`
进行控制和调整。现在还非常集成了矢量的图标的字体库，比如[FontAwesome](http://fortawesome.github.io/Font-Awesome/)。 
- **视频，动画**：宁缺毋滥。一定要精心制作，能给客户留下深刻印象同时又深入解析了产品的特性的。
- **使用Bootstrap，Themeforest，99Designs，Dribble**：当把wireframe变成网页时，不要重新造轮子。Bootstrap是一个免费的框架，和前面提到的Jetstrap合用很有威力。[Themeforest](http://themeforest.net/)上的服务要贵一些，一般是$9到$12的模板。而[99Designs](http://99designs.com/)这样的专业设计所要大概几百到几千刀。[Dribble](http://dribbble.com/)是需找合适Designer的很好的地方。

[^1]: 事实上Facebook的系统之大，后台涉及的技术是非常复杂的：[1](https://www.facebook.com/notes/facebook-engineering/tao-the-power-of-the-graph/10151525983993920)，[2](https://www.facebook.com/note.php?note_id=76191543919)，[3](https://www.facebook.com/notes/facebook-engineering/under-the-hood-indexing-and-ranking-in-graph-search/10151361720763920)。即便是它看起来不那么复杂的前端，也不是你有一个点子就能做好的：你的用户可是几十亿形形色色的人。
