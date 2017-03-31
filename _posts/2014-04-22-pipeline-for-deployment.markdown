---
layout: post
title: "构建Deployment系统 (1)"
date: 2014-04-22 02:49:38 +0800
comments: true
categories: 
- deployment
- tutorials
- tips
- CI
---

对软件公司，特别是互联网软件公司来说，发布流程是企业的[核心竞争力](http://lenciel.com/2013/05/the-importance-of-deploy-as-will/)。

那么什么是一个好的发布流程呢？Github（别忘了它本身也是一家软件公司）的CTO在介绍[Boxen
](http://lenciel.com/2013/03/boxen-introduction/)的时候说过，他们公司新员工从拿电脑到可以开始编码只要30分钟，这给混过几家10w+员工公司的我带来的震撼特别强烈。

所以我觉得，一个好的软件发布流程应该是：

  1. 新员工在第一天入职就能push改动到production
  2. 新员工在第一天入职就能学会怎么从production撤销一个错误的改动
  3. 整个deployment流程是可预测的，也是可追溯的

那么，如果你到了一个新公司，推开门发现那是一个蛮荒之地，应该怎么办呢？这篇先理一下基本的概念，然后后面分节描述一下讲到的这些工具具体要怎么配置怎么用。

# 善其器

先check一下东西齐不齐活:

  1. 代码repo是放在哪里： ([git][1], [hg][2], …),
  2. hook到repo的一套有review功能的管理系统: ([ReviewBoard](http://www.reviewboard.org), [Gitlab][13], [gerrit][3], [bitbucket][4], [github][5], …),
  3. hook到repo的一套CI管理系统:  ([Jenkins][6], [Travis CI][7], …),
  4. 自动部署代码到服务器的系统 ([Puppet][14], [chef][8], [clusto][9], …).


![Deployment Phases](/downloads/images/2014_04/deployment_phases.png "Don't touch me...")

你选择的工具当然对后面的流程有很大的影响。我们公司是采用`git`+`Gitlab`+`Reviewboard`+`Jenkins`+`fabric`来做部署。在搭建这套东西之前我也试过很多其他的东西，有的东西我放弃了是因为太复杂不够轻量(比如Puppet)，有的东西我放弃了是因为，长得太丑(比如Gerrit)。

# 开发者视角

假设你今天入职，写了段代码，从你的视角看到的deployment流程:

  1. 提交到本地repo。
  2. 运行[RBTools](http://www.reviewboard.org/docs/rbtools/dev/)生成一个Reviewboard的`review request`
  3. 代码通过了review拿到提交许可后，把代码merge然后push到Gitlab上的`alpha`分支
  4. Jenkins拿到change后做自动测试，然后部署到test服务器，发邮件通知QA
  5. QA或者是开发者自己玩一下test服务器，发现没有问题，手动运行Jenkins脚本。脚本会对代码打tag，并部署改动到staging服务器，发邮件通知QA和PO
  6. PO确认某个版本的所有代码都到了staging，QA做回归测试
  7. 测试通过后，手动运行Jenkins脚本，脚本会部署某个staging服务器的版本到production服务器
  8. 部署完毕后，Jenkins运行相应的冒烟测试，测试通过后邮件关键人士，表明production音容宛在

整个流程里面，如果你是一个靠谱的开发者，需要花时间参与的步骤很少。但是如果是一个习惯不好的开发者，可能被review代码的人，Jenkins的自动测试，QA的集成测试或者是回归测试不断修理，惨痛的教训一定会让你成长起来的。

# 机器视角

很多重复性的事情，都是机器在干:

1. Reviewboard上被通过的代码被push上Gitlab的`alpha`分支后，Jenkins自动运行:
    1. 静态扫描工具
    2. 单元测试
    3. 有报错发邮件通知事主。没有报错， 部署`alpha`分支到test服务器
    4. 部署test服务器后，运行集成测试集
    
2. 有人手工触发staging的build:
    1. merge`alpha`分支到`staging`分支
    2. 部署`staging`分支到staging服务器
    3. 部署服务器后，运行集成测试集

3. 有人手工触发production的build:
    1. merge`staging`分支到`production`分支
    2. 部署`production`分支到production服务器
    3. after deployment, runs integration tests against production

这里很多具体的步骤需要通过Jenkins和它的插件甚至是自己写的各种脚本来配合完成

# 考虑扩展性

未知的未来，你可能会发现项目换了开发语言，项目换了JS框架，项目自动化测试改成手动了...在架构整套部署系统的时候，要做好和具体语言具体流程的解耦。

一些可能会有用的思路:

  1. 项目组足够小，成员能力足够好，可以不用review代码直接checkin到公共repo(成员能力足够好至少意味着，他有写靠谱的UT)
  2. 你构建出来的系统，每个不同的build应该可以很容易的绑定不同的工具:
    1. 静态扫描工具是很好 (比如 [pylint][10], [pep8][11]或者[jshint][12])，但最好项目一开始就用它们。如果是旧项目不要往上套，费时费力
    2. 如果是用precommit的hook来跑测试，开发者本地可以不跑
    3. 如果是有特别要求的项目（安全性，健壮性等），可以很容易绑定其他的工具
  3. 每个项目对应不同的deployment环境有不同的build配置
  4. 三驾马车的服务器配置 (test, staging, production)什么时候应该祭出？个人经验是，如果研发团队超过3人了，再怎么省也得有两个(test+production)。如果有专职的QA团队，并且希望有稳定的版本部署出去，那三种环境的配置几乎是必须的。
  5. 手动触发test到staging以及staging到production主要是为了手动测试的时间窗，让版本发布更可控。你也可以结合项目的具体情况决定要不要把这两步也自动化。

如果是用了Jenkins，上面这些就非常方便了，因为说白了每个build不过就是当特定条件满足时执行的一堆特定脚本而已：当然，如果你发现公司还在用Ubuntu 12.04做build server，可能也没有那么方便。

# Rants

  1. _什么时候需要考虑上这种流程?_ 如果是三个人的车库队伍，然后就队伍里面又没人有兴趣做对运维，那就算了吧。如果是正经开门做生意的公司，都该上。
  2. _能不能允许"加急"?_ 和很多大公司比，这套流程虽然已经精简了，但是总有时候我们有非常"紧急的"改动，能不能不走这套流程直接上？ 简单的回答就是，不能。如果你发现了有人要求加急，一定是目前的流程太慢。这种情况，一定是有什么东西坏掉了吧。比如之前的代码check不严格，很严重的错误很容易就到了production，或者你的员工们写的UT跑一年都跑不完或者是在build server上根本没法跑。
  3. _为什么不自动部署?_ 是，这里描述的流程只有到test服务器是自动部署的，后面到staging和production都是手动部署。因为据说，把自动merge和自动测试的代码部署到production服务器，是一个很容易让你半夜接到电话的举动，而且很多CEO鬓角的白头发都是因为这样的部署长出来的。当然如果你的manager已经在他老板那里夸口说你来了整个手动测试team都可以解散了，我就只能祝你好运了。
  4. 静态扫描的工具（无论是lint还是style的检查），常常都会给团队带来比UT更好的提升：很多时候你在review的时候要不断告诉同事特别是新手同事你这段代码连style都不对，对两个人都是伤害...如果有个无情的机器用不妥协地负责做这件事情，嗯哼...

Hope you have fun when setting up the pipeline for your company.

   [1]: http://git-scm.com/ (Git)
   [2]: http://mercurial.selenic.com/ (Mercurial)
   [3]: https://code.google.com/p/gerrit/ (Gerrit)
   [4]: https://bitbucket.org/ (BitBucket)
   [5]: https://github.com/ (Github)
   [6]: http://jenkins-ci.org/ (Jenkins)
   [7]: https://travis-ci.org/ (Travis CI)
   [8]: http://www.getchef.com/chef/ (Chef)
   [9]: http://clusto.org/ (Clusto)
   [10]: http://www.pylint.org/ (PyLint)
   [11]: https://github.com/jcrocholl/pep8 (pep8.py)
   [12]: http://www.jshint.com/ (JSHint)
   [13]: https://www.gitlab.com/‎ (Gitlab)
   [14]: https://puppetlabs.com/‎ (Puppet)



