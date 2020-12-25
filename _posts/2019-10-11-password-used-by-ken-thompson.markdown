---
layout: post
title: "他的密码原来是..."
date: 2019-10-11 11:29:44 +0800
comments: true
categories:
- memo
---

2014年左右，大叔们往 Github 上丢 BSD3 的源码时，放上了 `/etc/passwd` 文件，于是诸如 Ken Thompson，Dennis Ritchie，Brian W. Kernighan 这样的老司机就玉体横陈了，只不过关键部位，打了马赛克：

![call me by your name](/downloads/images/2019_10/passwd.jpg --alt Don't touch me)

众所周知，打马赛克的 `crypt` 函数是基于 DES 的，很弱。说众所周知是因为它的作者 Robert Morris 和 Ken Thompson 在 [manpage](http://man7.org/linux/man-pages/man3/crypt.3.html) 里面自己就是这么写的：

> The DES algorithm itself has a few quirks which make the use of the crypt() interface a very poor choice for anything other than password authentication. If you are planning on using the crypt() interface for a cryptography project, don't do it: get a good book on encryption and one of the widely available DES libraries.

我猜设计者这么实现是有它的“历史原因”的：那个年代大众能够获取的计算能力还非常弱搞不了什么暴力破解，以及OS的安全机制是分层的（比如这个文件本来要root才能打开看）。现在 `crypt` 早就是 obsolete 的了，大家至少都用基于 AES 的 `mcrypt` 或者 `ccrypt` 。

总之，现在大家的机器这么猛，只需要用 [hashcat](https://hashcat.net/wiki/) 这样的工具，就能很容易看到文件里面大多数人的明文密码了：所以你能想到Brian的密码是 `/.,/.,，` 么。

但是，这堆人里，Ken爷的密码就没有那么容易看到，一下子成了悬案。当时觉得因为这部分代码就是他写的，知道有多弱鸡，所以设密码的时候用了门槛很高的组合：毕竟弱如 DES ，如果努力混用大写字母和特殊字符，就算上GPU也得搞好几年才能出来的。

结果，今天偶然在订阅里看到[一个帖子](https://inbox.vuxu.org/tuhs/CACCFpdx_6oeyNkgH_5jgfxbxWbZ6VtOXQNKOsonHPF2=747ZOw@mail.gmail.com/)，上个月一个叫 Nigel Williams 的兄弟用一块 AMD （还能是谁的呢）的 [Radeon Vega64](https://www.amd.com/en/products/graphics/radeon-rx-vega-64) 把这个密码给破解了：

![call me by your name](/downloads/images/2019_10/ken_sovled.jpg --alt Don't touch me)

所有人看到这邮件的感觉应该都是，原来如此，但 `p/q2-q4!` ，这密码Ken爷你怎么记住的。

结果[有人解读](https://www.theregister.co.uk/2019/10/09/ken_thompsons_old_unix_password_cracked/)说，这是一种国际象棋[记谱子的方法](https://en.wikipedia.org/wiki/Descriptive_notation)，`p/q2-q4!` 表示了很常用的[Queen's Pawn开局](https://en.wikibooks.org/wiki/Chess_Opening_Theory/1._d4)。

嗯，Ken爷这样的计算机对弈的[先驱](https://www.chessprogramming.org/index.php?title=Ken_Thompson)，记住这样的密码应该不是难事吧。

他们真有趣，我们要学习。