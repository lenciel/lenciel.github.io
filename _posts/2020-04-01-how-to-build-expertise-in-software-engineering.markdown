---
layout: post
sidenote: false
comments: true
title: "晋级技术专家的清单"
date: 2020-04-01 10:58:26 +0800
categories:

- career
- rants
---

<h3>目录</h3>

- TOC
{:toc}

## 「技术专家」是什么

最近公司开始整理职级通道。

大部分人上班其实就为两个东西在拼：职级和绩效。前面这个说明你的段位，决定了你的基本薪资（base 部分），后门这个说明你的表现，决定了你的浮动薪资（年终奖或者绩效等等）。

虽然结果的衡量主要看收入[^1]，但它们显然不仅仅是钱的问题。

国内大部分企业的职级是乱套的，相对来说，外企做得早一点，所以一般会规整一点[^2]。各个公司的职级发展到今天，已经逐渐标准化并且有了换算公式，你可以在[levels.fyi](https://www.levels.fyi/)上随时比较它们的要求和收入。

在国内离这样的标准和公开还有差距，只有一些坊间流传的匹配方式，并且大厂的职级这两年也在做一些优化。但靠着一线二线大公司牵头，产品研发运营等等岗位好像也是有了一个基本标准化的职级了。

本文所说的「技术专家」，主要是指软件工程师（包含开发、测试、运维等，但主要偏开发）：

- 在专业领域，对自己所从事的职业具备一定的前瞻的了解，在某个方面有独到见解，对公司关于此方面的技术或管理产生影响；
- 对于复杂问题的解决有自己的套路，对于问题的识别、优先级分配见解尤其有影响力，善于寻求资源解决问题；也常常因为对于工作的熟练而有创新的办法，表现出解决问题的能力；
- 可以带小团队，可以独立领导跨部门的项目；能够培训和教导新进员工；
- 在圈子里有点名气。

对于国内公司，大概对标阿里的 P7 或者腾讯的 T3.1-3.2，如果在外企，则对标 Senior 以上（Staff 或者 Principle）。

## 没有菜谱只是品味

没有一个可以被所有人复制的成为技术专家的「菜谱」：你只需要打点计时，添油加醋，事情就成了。

你可能需要一些好的[规划](/2019/10/how-to-treat-your-30-years-career-as-a-product/)和好的习惯，但更多还是来自于大量地练习。

练习通常是从模仿开始的。我希望你的心态是让自己成为一个顶级的诗人，而我要干的主要是做个《唐诗三百首》的集子，作为你鉴赏和模仿的起点：好的品味是成功的一半。

另外，鉴于国内分享交流的意愿和系统思考的习惯等等原因，我列出的大部分都是英文的内容。紫荆吴彦祖说除开唐诗宋词其他的书都不要看中文的，我大体上是同意的，特别是在我们讨论的这个领域。

## 你的圈子

软件开发在技术层面外，主要是一个社会工程（Social Engineering），不是大英雄们躲在车库改变世界的工作。你获取再多的行业信息，读再多的书或者博客，参加再多的会议买再多的极客时间（霍老板不要打我），都没有你和谁一起工作，被什么样的人指导和影响重要。

**如果你每周只有一个小时可以用来在职业发展的层面提高自己，滚出房间，约那些比你优秀的人聊聊**。

## 基本功

有一些更基本的东西，包括计算机的体系结构、数据库等等，就不在这里罗列了，默认你从入行干到现在这些都已经掌握了。

### 经典论文

很多人从学校毕业之后就不看论文了，有些工程师会在工作需要的时候，看一些特别经典的论文。我自己的感受是如果时间有限，读一篇高质量的论文，比读完某本书的一些段落要有意义得多。我是 ACM 的付费用户就因为它有类似于 [ACM SIGOPS Hall of Fame Award list](https://www.sigops.org/awards/hof/) 这样的精选集，[Papers We Love](https://paperswelove.org/)也是一个找论文翻翻的好地方， Adrian Colyer 的 [the morning paper](https://blog.acolyer.org/)也值得订阅。

下面这些是我觉得在这个分布式的时代从事软件行业一定要读的论文[^3]：

- [The Google File System](https://s3.amazonaws.com/systemsandpapers/papers/gfs.pdf)
- [CAP Twelve Years Later: How the Rules Have Changed](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed)
- [MapReduce: Simplified Data Processing on Large Clusters](https://s3.amazonaws.com/systemsandpapers/papers/mapreduce.pdf)
- [Dapper, a Large-Scale Distributed Systems Tracing Infrastructure](https://s3.amazonaws.com/systemsandpapers/papers/dapper.pdf)
- [Kafka: a Distributed Messaging System for Log Processing](https://s3.amazonaws.com/systemsandpapers/papers/Kafka.pdf)
- [Bigtable: A Distributed Storage System for Structured Data](https://static.googleusercontent.com/media/research.google.com/en//archive/bigtable-osdi06.pdf)
- [Large-scale cluster management at Google with Borg](https://s3.amazonaws.com/systemsandpapers/papers/borg.pdf)
- [Dynamo: Amazon's Highly Available Key-value Store](https://s3.amazonaws.com/systemsandpapers/papers/amazon-dynamo-sosp2007.pdf)
- [On Designing and Deploying Internet-Scale Services](https://s3.amazonaws.com/systemsandpapers/papers/hamilton.pdf)
- [No Silver Bullet - Essence and Accident in Software Engineering](https://s3.amazonaws.com/systemsandpapers/papers/Frederick_Brooks_87-No_Silver_Bullet_Essence_and_Accidents_of_Software_Engineering.pdf)
- [Out of the Tar Pit](https://s3.amazonaws.com/systemsandpapers/papers/outofthetarpit.pdf)
- [The Chubby lock service for loosely-coupled distributed systems](https://s3.amazonaws.com/systemsandpapers/papers/chubby-osdi06.pdf)
- [Raft: In Search of an Understandable Consensus Algorithm](https://s3.amazonaws.com/systemsandpapers/papers/raft.pdf)
- [Paxos Made Simple](https://s3.amazonaws.com/systemsandpapers/papers/paxos-made-simple.pdf)
- [SWIM: Scalable Weakly-consistent Infection-style Process Group Membership Protocol](https://s3.amazonaws.com/systemsandpapers/papers/swim.pdf)
- [Hints for Computer System Design](https://s3.amazonaws.com/systemsandpapers/papers/acrobat-17.pdf)
- [Big Ball of Mud](https://s3.amazonaws.com/systemsandpapers/papers/bigballofmud.pdf)
- [Harvest, Yield, and Scalable Tolerant Systems](https://s3.amazonaws.com/systemsandpapers/papers/FOX_Brewer_99-Harvest_Yield_and_Scalable_Tolerant_Systems.pdf)
- [Mesos: A Platform for Fine-Grained Resource Sharing in the Data Center](https://s3.amazonaws.com/systemsandpapers/papers/mesos.pdf)

### 书籍

论文、博客、讲座等等往往面向某个具体问题的解决。涉及到方法论或者体系化的知识，一般还得看书。下面这些是我觉得特别有用的，但是如果你还觉得不够，你在网上应该可以找到很多别的书单：

- [A Philosophy of Software Design](https://lethain.com/notes-philosophy-software-design/) - John Ousterhout
- [Thinking in Systems: A Primer](https://www.amazon.com/Thinking-Systems-Donella-H-Meadows/dp/1603580557) - Donella Meadows
- [Don't Think of An Elephant! Know Your Values and Frame the Debate](https://www.amazon.com/ALL-NEW-Dont-Think-Elephant-ebook/dp/B00NP9LHFA/ref=sr_1_1?s=books&ie=UTF8&qid=1532354336&sr=1-1&keywords=don%27t+think+of+an+elephant) - George Lakoff
- [The Goal: A Process of Ongoing Improvement](https://www.amazon.com/Goal-Process-Ongoing-Improvement-ebook/dp/B002LHRM2O/ref=sr_1_1?s=books&ie=UTF8&qid=1532354435&sr=1-1&keywords=the+goal) - Eliyahu Goldratt
- [Peopleware: Productive Projects and Teams](https://www.amazon.com/Peopleware-Productive-Projects-Teams-3rd/dp/0321934113/ref=sr_1_1?s=books&ie=UTF8&qid=1532354245&sr=1-1&keywords=peopleware) - DeMarco & Lister
- [The Innovator's Dilemma: When New Technologies Cause Great Firms to Fail](https://www.amazon.com/Innovators-Dilemma-Technologies-Management-Innovation-ebook/dp/B012BLTM6I/ref=sr_1_1?s=books&ie=UTF8&qid=1532438615&sr=1-1&keywords=the+innovator%27s+dilemma) - Clayton Christensen
- [Accelerate: Building and Scaling High Performing Technology Organizations](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations-ebook/dp/B07B9F83WM/ref=sr_1_1?s=books&ie=UTF8&qid=1532354658&sr=1-1&keywords=accelerate+devops) - Forsgren, Humble & Kim.
- [Becoming a Technical Leader: An Organic Problem-Solving Approach](https://www.amazon.com/Becoming-Technical-Leader-Gerald-Weinberg-ebook/dp/B004J4VV3I/ref=sr_1_2?s=digital-text&ie=UTF8&qid=1532438948&sr=1-2&keywords=becoming+a+technical+leader) - Gerald Weinberg
- [Good Strategy Bad Strategy: The Difference and Why it Matters](https://www.amazon.com/Good-Strategy-Bad-Difference-Matters-ebook/dp/B004J4WKEC/ref=sr_1_2?s=books&ie=UTF8&qid=1532354394&sr=1-2&keywords=good+strategy%2C+bad+strategy)
- [Building Evolutionary Architectures](https://lethain.com/building-evolutionary-architectures/) - Ford, Parsons & Kua
- [Escaping the Build Trap: How Effective Product Management Creates Real Value](https://www.amazon.com/dp/B07K3QBWG1/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1) - Melissa Perri
- [High Output Management eBook: Andrew S. Grove](https://www.amazon.com/dp/B015VACHOK/)
- [The Manager's Path: A Guide for Tech Leaders Navigating Growth and Change](https://www.amazon.com/Managers-Path-Leaders-Navigating-Growth-ebook/dp/B06XP3GJ7F/ref=sr_1_3?s=books&ie=UTF8&qid=1532438516&sr=1-3&keywords=high+output+management) - Camille Fournier
- [The Mythical Man-Month](https://www.amazon.com/Mythical-Man-Month-Software-Engineering-Anniversary/dp/0201835959/ref=sr_1_1?s=books&ie=UTF8&qid=1532354207&sr=1-1&keywords=mythical+man+month) - Fred Brooks
- [The Phoenix Project](https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business-ebook/dp/B078Y98RG8/ref=sr_1_1?s=books&ie=UTF8&qid=1532354475&sr=1-1&keywords=the+phoenix+project) - Kim, Behr & Spafford.
- [The Passionate Programmer](https://www.amazon.com/Passionate-Programmer-Remarkable-Development-Pragmatic-ebook/dp/B00AYQNR5U/ref=sr_1_1?keywords=chad+fowler&qid=1582836888&sr=8-1) - Chad Fowler
- [The Pragmatic Programmer](https://www.amazon.com/Pragmatic-Programmer-Journeyman-Master/dp/020161622X) - Andrew Hunt, David Thomas
- [Resilient Management](https://resilient-management.com/) - Lara Hogan
- [Software Design X-Rays: Fix Technical Debt with Behavioral Code Analysis](https://www.amazon.com/Software-Design-X-Rays-Technical-Behavioral-ebook/dp/B07BVRLZ87) - Adam Tornhill

## 认知

### 技术专家做什么

知道这个角色究竟是干什么工作的，是很有帮助的，有个[专门的网站](https://staffeng.com/)请一些优秀的工程师进行分享，此外下面的这些也不错：

- [On Being A Principal Engineer](https://blog.dbsmasher.com/2019/01/28/on-being-a-principal-engineer.html) - Silvia Botros
- [What a Senior Staff Software Engineer Actually Does, Part 1: The Role and My Tasks](https://medium.com/box-tech-blog/what-a-senior-staff-software-engineer-actually-does-f3fc140d5f33) and [Part 2: The Mindset and Focus of the Role](https://medium.com/box-tech-blog/what-a-senior-staff-software-engineer-actually-does-d55308fcdd41) - Joy Ebertz
- [What does Staff level mean at GitLab?](https://about.gitlab.com/blog/2020/02/18/staff-level-engineering-at-gitlab/)
- [On Being a Senior Engineer](https://www.kitchensoap.com/2012/10/25/on-being-a-senior-engineer/) - John Allspaw
- [Thriving on the Technical Leadership Path](https://keavy.com/work/thriving-on-the-technical-leadership-path/) - Keavy McMinn
- [What's a senior engineer's job?](https://jvns.ca/blog/senior-engineer/) - Julia Evans

### 如果成为技术专家

看看别人是怎么规划和发展的：

- [Becoming a Staff Engineer – Interview with Kristina Fox, Staff iOS Engineer at Intuit](https://elpha.com/posts/4j56np6p/becoming-a-staff-engineer-interview-with-kristina-fox-staff-ios-engineer-at-intuit) - Kaya Thomas
- [On becoming a senior technical leader](https://blog.coinbase.com/on-becoming-a-senior-technical-leader-14106f1383b8) - Jesse Pollak
- [On Mid-Career and Managers](https://www.ryn.works/blog/on-mid-career-and-managers) - Ryn Daniels
- [The Engineer/Manager Pendulum](https://charity.wtf/2017/05/11/the-engineer-manager-pendulum/) - Charity Majors

## 实操

当你有了技术专家的基本功和认知，在实际工作中怎么干：

- [Being Glue](https://noidea.dog/glue) - Tanya Reilly
- [Computers can be understood](https://blog.nelhage.com/post/computers-can-be-understood/) - Nelson Elhage
- [Effective Mental Models for Code and Systems](https://medium.com/@copyconstruct/effective-mental-models-for-code-and-systems-7c55918f1b3e) - Cindy Sridharan
- [「I Wouldn’t Start From Here」. How to Make a Big Technical Change](https://noidea.dog/blog/getting-there-from-here) - Tanya Reilly
- [Migrations: the sole scalable fix to tech-debt](https://lethain.com/migrations/)
- [On Mid-Career and Team Dynamics](https://www.ryn.works/blog/on-mid-career-and-team-dynamics) - Ryn Daniels
- [Reclaim unreasonable software](https://lethain.com/reclaim-unreasonable-software/) - Will Larson
- [Surviving the Organisational Side Quest](https://noidea.dog/blog/surviving-the-organisational-side-quest) - Tanya Reilly
- [Systems that defy detailed understanding](https://blog.nelhage.com/post/systems-that-defy-understanding/) - Nelson Elhage
- [Team Objectives](https://svpg.com/team-objectives-overview/) - Marty Cagan
- [Technical Decision Making](https://medium.com/@copyconstruct/technical-decision-making-9b2817c18da4) - Cindy Sridharan
- [Technical Research and Preparation](https://keavy.com/work/technical-preparation/) - Keavy McMinn
- [The Behind-the-scenes Work of Tech Leadership](https://blog.coleadership.com/behind-the-scenes-tech-leadership/) - Jean Hsu
- [Understanding Project Management Will Improve Your Developer Job](https://blog.danielna.com/understanding-project-management-will-improve-your-developer-job/) - Daniel Na
- [Where to Start](https://keavy.com/work/where-to-start/) - Keavy McMinn

这里有这么多内容，看起来有一些吓人。但是相信我，如果你带着问题去读这些东西，它们比大部分的材料都要有趣。

[^1]: 在这个问题上，让老板骗你或者自己骗自己都是不对的。不要被老板们夸你的话搞膨胀了，也不要太关注自己的 title 是不是响亮。他付给你的报酬，你在市场里的价位，才说明你真实的段位。
[^2]: 我觉得做得不太好的地方就是把 「Principal」 翻译成「首席」，搞得一个公司两三百个首席工程师，首席架构师。
[^3]: 读它们之前你可以先读读 Peter Klein 的[《如何读学术文章》](https://organizationsandmarkets.com/2010/08/31/how-to-read-an-academic-article/)或者 Keshav 的 [《怎么读论文》](https://blizzard.cs.uwaterloo.ca/keshav/home/Papers/data/07/paper-reading.pdf)。