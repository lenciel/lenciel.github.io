---
layout: post
title: "给Python标准库充电"
date: 2013-10-17 12:27
comments: true
categories: 
- python
- tips
---

Python的自荐页面[About Python](http://www.python.org/about/)上号称自家的标准库是"batteries included"的，但实际情况却不是这样。对Python标准库的批评几乎从来没有中断过。著名的Python包[Requests](http://docs.python-requests.org/en/latest/)的作者甚至决定永久把Requests保持为第三方库而拒绝加入标准库，他的理由是：[加入标准库就会死翘翘](http://www.leancrew.com/all-this/2012/04/where-modules-go-to-die/)。

再举个例子，我们最近的项目里面都用到了[pytz](https://pypi.python.org/pypi/pytz/)。标准库里面的datetime是支持时区的（tzinfo类），但是并没有包含时区信息（tzinfo是抽象类需要自己实现）。遵照前人的经验使用pytz是最好的办法[^1][^2]。

所以不奇怪的是，几乎所有的Python项目都会引用一堆优秀的第三方库。为了管理这些依赖一般都会用上pip:

- 在项目里面用pip freeze生成一个`requirement.txt`文件
- 在创建`virtualenv`的时候使用之前生成的文件安装所有的依赖

为了不在每次运行`pip install -r requirements.txt`的时候都下载一堆依赖，你还可以打开pip的[download cache](http://lenciel.cn/2013/10/pip-download-cache/)。如果整个公司在做项目的时候都需要经常使用一些包，甚至可以考虑[做一个Pypi](https://github.com/wolever/pip2pi)的库来共享，类似于Maven的Repo。


[^1]: [保存时间和时区的最佳实践](http://stackoverflow.com/questions/2532729/daylight-saving-time-and-time-zone-best-practices/3404919#3404919).   
[^2]: [如何在datetime转换中保存时区信息](http://stackoverflow.com/questions/14762518/python-datetime-strptime-and-strftime-how-to-preserve-the-timezone-informat).    