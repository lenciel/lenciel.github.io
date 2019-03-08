---
layout: post
title: "解决iowait过高的告警"
date: 2014-02-24 09:22
comments: true
categories: 

- tips
- iowait
- server
- linux
- devops

---

![warning letter](/downloads/images/2014_02/warning_letter.png "Don't touch me...")

从Nagios切到[Zabbix](https://www.zabbix.com)之后，经常大清早被iowait过高的告警邮件叫醒。因为这套Zabbix监控是本座搭的，所以解决这个问题就只有本座来了.....哎，不知道是不是把首席运营官给宠坏了。

iowait的定义和计算方式
--------------------

iowait的定义为：


{% blockquote %}
iowait is time that the processor/processors are waiting (i.e. is in an idle state and does nothing), during which there in fact was outstanding disk I/O requests.
{% endblockquote %}

也就是至少有一个I/O在进行时CPU处于`idle`状态的比例。

我们都知道用`vmstat`, `iostat`, `sar`等命令查看系统状况的时候，CPU有四种比较主要的状态：user, sys, idle和iowait。它们都是表示CPU处于此状态的一个平均比例（其中sar命令是可以用`-P`具体指定哪个CPU的，其他的命令一般是所有CPU的平均），通常相加应该就是1.

这个比例的统计其实是通过kernel不断的更新计数器然后计算出来的。当时钟中断发生的时候，kernel检查当前CPU是不是idle的。如果不是，就检查正在执行的指令是user space还是kernel space的。如果是user space就给`user`的计数器加1，kernel space就给`sys`计数器加1.

类似的，如果CPU是处于idle状态，kernel就检查是不是有I/O操作正在发生（可以是local disk也可以是`mount`的NFS），如果有就给`iowait`计数器加1，没有就给`idle`计数器加1.

当我们运行`vmstat`或者`sar`等命令查看时，它们会先读取当前这几个计数器的计数，然后在用户指定的时间里面等待，然后再次读取。因为用户指定的时间里面过去了多少个`tick`是可以计算的，然后前后计数器的增值也可以计算，就可以算出一个比值。比如如果用户运行的命令是`vmstat 2`，表示每两秒取样一次，那么：

1. tick是10ms一个，所以总共是200个ticks
2. 计数器的增量/200*100就是每个状态的百分比

iowait的意义
------------

这其实比它怎么计算要难理解一些。比如本座之前心里就有一个疑问：既然只是某个process在block，那么系统会schedule其他的事情，这对性能有什么大不了的影响呢？

来看几个例子。

### 例子一

假设一个程序进行批量的事务，每个事务都有一个10ms的计算任务，计算出的结果通过同步的方式写到磁盘。由于它写结果的文件是阻塞方式打开的，所以I/O完成之前写操作是不会`return`的。如果我们假设磁盘系统没有cache，每个物理的I/O需要20ms，那么一个事务需要30ms。也就是每秒33个事务（33 tps）。如果把系统算成只有一个CPU的话，很显然`iowait`就是66%。

这种情况下，如果我们能改进I/O子系统，比如启用磁盘的缓存，让每次物理的I/O只需要1ms的话，那么`iowait`就会迅速下降到8%左右。可见这种情况下，`iowait`直接影响着程序的performance。

### 例子二

假设一个磁盘检查的程序运行在系统上，每秒钟读4k的数据。我们假设这个程序的入口是main()，然后读磁盘的函数是read()，main()和read()都是用户态的。read()属于libc.a，会调用kread()这个系统调用来进行物理的I/O，这个时候就进入了kernel态。整个main(),read()和kread执行的时间加起来不长，我们假设是50微秒。而物理的I/O需要多久要看seek的数据有多远，假设需要2-20ms。这样就完全有可能当时钟中断的时候，cpu是idle的，而且I/O正在发生，于是`iowait`值就达到97-98% (如果每个I/O需要20ms就是99-100%)。

这种情况下，虽然`iowait`数值非常高，其实这个系统的性能是正常的。


### 例子三

假设有两个程序跑在同一个CPU上。一个程序写得有点儿问题，I/O会阻塞10秒左右。另一个则100%的时间都在做计算。由于当前一个程序阻塞起来的时候，后面这个程序被运行了，因此无论什么时候都没有CPU处于idle的状态等I/O，于是`iowait`一直是0，这时候其实系统的performance是有很大的问题的。



### 例子四

假设系统是4核的CPU，运行了6个程序。其中4个程序有70%时间在进行物理的I/O，30%的时间在进行计算任务（假设其中25%在用户态，5%在kernel态）。另外2个程序假设100%时间都在用户态进行计算任务，没有任何I/O操作。

如果我们查看系统的CPU状态，大概可能看到下面的状况:

         cpu    %usr    %sys    %iowait   %idle
          0       50      10      40       0
          1       50      10      40       0
          2      100       0       0       0
          3      100       0       0       0
          -       75       5      20       0

如果我们把相同的6个程序跑到一个6核的机器（相同的CPU和磁盘配置），那么可以简单的认为会有下面的结果：

         cpu    %usr    %sys    %iowait   %idle
          0       25       5      70       0
          1       25       5      70       0
          2       25       5      70       0
          3       25       5      70       0
          4      100       0       0       0
          5      100       0       0       0
          -       50       3      47       0

也就是说，同样的程序跑在不同的系统上，iowait增加了一倍多，而这个时候其实没有什么performance问题，只不过是系统还能做更多的计算工作。


### 结论

- CPU处于`iowait`状态，并不说明CPU不能运行其他的程序
- `iowait`偏高只能说明系统这个时刻还能进行更多的计算任务，至于是不是出现了performance问题，需要进一步分析才知道


找出造成问题的进程
-----------------

虽然每次都是6点半多少说明应该是某个cron任务（因为机器上没有其他自定义的定时任务）但没法具体知道究竟是哪个。

最简单的办法当然是出问题的时候用`iotop`命令来看了 。

```
 # iotop
 Total DISK READ: 8.00 M/s | Total DISK WRITE: 20.36 M/s
  TID PRIO USER DISK READ DISK WRITE SWAPIN IO> COMMAND
 15758 be/4 root 7.99 M/s 8.01 M/s 0.00 % 61.97 % bonnie++ -n 0 -u 0 -r 239 -s 478 -f -b -d /tmp
```

但是谁又会在6点多起来干这种事情。除开修改系统时间重现问题，还可以通过ps命令查看记录处于`D`状态的进程来找到。

`ps`命令输出里面对`PROCESS STATE CODES`的定义是：

```
 D uninterruptible sleep (usually IO)
 R running or runnable (on run queue)
 S interruptible sleep (waiting for an event to complete)
 T stopped, either by a job control signal or because it is being traced.
 W paging (not valid since the 2.6.xx kernel)
 X dead (should never be seen)
 Z defunct ("zombie") process, terminated but not reaped by its parent.
```

处于等待I/O完成状态的进程一般就是`D`，所以可以通过tmux起一个sessio来跑下面的命令：

```
	while true; do date; ps auxf | awk '{if($8=="D") print $0;}'; sleep 1; done > /var/log/ps.log
```

然后在又一个这样的6点半：

![warning letter](/downloads/images/2014_02/zabbix_cpu_util.png "Don't touch me...")

去日志里面查看：

```
$ cat /var/log/ps.log | grep D

root      7585  7.9  0.0   5904   812 ?        D    06:34   0:02                  \_ /usr/bin/updatedb.mlocate
root      7585  7.8  0.0   5904   812 ?        D    06:34   0:02                  \_ /usr/bin/updatedb.mlocate
root      7585  7.8  0.0   5904   812 ?        D    06:34   0:02                  \_ /usr/bin/updatedb.mlocate
root      7585  7.8  0.0   5944   944 ?        D    06:34   0:02                  \_ /usr/bin/updatedb.mlocate
root      7585  7.7  0.0   5944   944 ?        D    06:34   0:02                  \_ /usr/bin/updatedb.mlocate
root      7585  7.5  0.0   5944   944 ?        D    06:34   0:02                  \_ /usr/bin/updatedb.mlocate
root      7585  7.5  0.0   5944   944 ?        D    06:34   0:02                  \_ /usr/bin/updatedb.mlocate
root      7585  7.6  0.0   5944   944 ?        D    06:34   0:03                  \_ /usr/bin/updatedb.mlocate
root      7585  7.7  0.0   5944   944 ?        D    06:34   0:03                  \_ /usr/bin/updatedb.mlocate
root      7585  7.7  0.0   5944   944 ?        D    06:34   0:03                  \_ /usr/bin/updatedb.mlocate
root      7585  7.8  0.0   5944   944 ?        D    06:34   0:03                  \_ /usr/bin/updatedb.mlocate
root      7585  7.7  0.0   5944   944 ?        D    06:34   0:03                  \_ /usr/bin/updatedb.mlocate
root      7585  7.8  0.0   5944   944 ?        D    06:34   0:03                  \_ /usr/bin/updatedb.mlocate
root      7585  7.7  0.0   5944   944 ?        D    06:34   0:03                  \_ /usr/bin/updatedb.mlocate
root      7585  7.7  0.0   5944   944 ?        D    06:34   0:03                  \_ /usr/bin/updatedb.mlocate
root      7585  7.7  0.0   5944   944 ?        D    06:34   0:03                  \_ /usr/bin/updatedb.mlocate
root      7585  7.7  0.0   5944   944 ?        D    06:34   0:03                  \_ /usr/bin/updatedb.mlocate
root      7585  7.8  0.0   5944   944 ?        D    06:34   0:03                  \_ /usr/bin/updatedb.mlocate
root      7585  7.8  0.0   5944   944 ?        D    06:34   0:03                  \_ /usr/bin/updatedb.mlocate
root      7585  7.8  0.0   5944   944 ?        D    06:34   0:04                  \_ /usr/bin/updatedb.mlocate
root      7585  7.6  0.0   5944   944 ?        D    06:34   0:04                  \_ /usr/bin/updatedb.mlocate
root      7585  7.6  0.0   5944   944 ?        D    06:34   0:04                  \_ /usr/bin/updatedb.mlocate
root      7585  7.6  0.0   5944   944 ?        D    06:34   0:04                  \_ /usr/bin/updatedb.mlocate
root      7585  7.6  0.0   5944   944 ?        D    06:34   0:04                  \_ /usr/bin/updatedb.mlocate
root      7585  7.7  0.0   5944   944 ?        D    06:34   0:04                  \_ /usr/bin/updatedb.mlocate
root      7585  7.6  0.0   5944   944 ?        D    06:34   0:04                  \_ /usr/bin/updatedb.mlocate
root      7585  7.6  0.0   6000   968 ?        D    06:34   0:04                  \_ /usr/bin/updatedb.mlocate
root      7585  7.6  0.0   6000   968 ?        D    06:34   0:04                  \_ /usr/bin/updatedb.mlocate
```

嗯，原来是`/usr/bin/updatedb.mlocate`。Google了一下[^1][^2]发现其实关掉也没什么：

```
sudo killall updatedb.mlocate
sudo chmod -x /etc/cron.daily/mlocate
```

整个世界清静了。

[^1]: http://www.iasptk.com/ubuntuwp/can-i-disable-updatedb-mlocate/
[^2]: http://ubuntuforums.org/showthread.php?t=1243951&page=2&p=7844783#post7844783