---
layout: page
title: "深入Linux启动流程"
date: 2006-02-17 13:24
comments: true
sharing: true
footer: true
---

> 一个Linux®系统的boot包括了几个阶段。但不管是x86上的标准桌面还是一个嵌入式的PowerPC® ，大部分系统的boot流程都是完全类似的。这篇日志会深入解释从最初的bootstrap到第一个用户程序运行起来的整个过程。你会看到所有的与boot过程相关的概念，如boot loader，kernel decompression，initial RAM disk等等。

在古代（当然，是计算机的古代），启动一个计算机通常使用包含启动程序的打孔纸带载入或者是手动从前置面板上的地址、数据、控制开关上手动加载启动程序。我们现在使用的计算机使用了多种手段来简化启动过程，但是整个启动过程实质上并不是看起来那么简单。

在下面的部分，我们先从总体上看看Linux的启动过程，做到心中有数。然后再对每个步骤进行深入的解释。结合后面给出的参考代码，就可以对整个kernel的相关部分有比较深刻的理解了。

概览
-----

下图可以给你一个概览（真的是很概&#8230;览）

![Linux启动过程概览](/downloads/images/2008_08/fig1.gif "Don't touch me...")

<a name="fig2">图1. Linux启动过程概览</a>

当系统首次启动或重启时，处理器将执行一段特殊位置上的代码：对于PC机而言，是在主板的flash片子上保存的基本输入输出系统（`BIOS`），对于嵌入式系统，则是由CPU激活一个`reset vector`，启动flash或者ROM里面的一段特定程序。两种类型的过程是相似的，只是对于PC来说，哪些设备将会在启动过程中被使用有相当的灵活性（可以从硬盘、光盘、USB设备等等），因此需要由BIOS来选取设备。这里面的细节后面会讲到。

当启动使用的设备找到之后，所谓的`first-stage boot loader`就加载到RAM中执行了。这个boot loader的长度小于512bytes（一个磁盘的sector大小，记得吗？），它的任务就是加载后面的`second-stage boot loader`。

当所谓的second-stage boot loader加载并执行之后，Linux和一个可选的初始化RAM盘（临时的根文件系统）就被载入到内存中。然后控制权就从该boot loader转交给kernel映像。然后，kernel解压并初始化。这个过程中，boot loader检查系统上挂载的硬件，mount好root设备，并加载好必需的kernel module。完成这些工作之后，第一个user-space的程序（init）就开始运行，进行更高级别的初始化工作。

这些就是一个简要的linux系统启动过程。下面我们深入到每个部分。


系统启动
---------

系统启动时的动作和Linux最终运行的硬件平台有关。对于嵌入式系统而言，一个bootstrap环境，如U-Boot、RedBoot、MicroMonitor等，会在系统上电或复位后运行。具体来说，和嵌入式系统一起发布的flash特殊位置中的boot monitor会在上电或复位后，将Linux kernel映像加载到flash中，然后执行它。同时，这个boot monitor还会负责一部分系统测试和硬件初始化工作。也就是说嵌入式环境中，一个boot monitor会执行两个stage的boot loader的任务。

在PC中，加载Linux是从BIOS的`0xFFFF0`地址开始的。首先我们需要知道，BIOS中的程序按功能不同分为两类，一类是用来`POST`（power-on self test），即上电的硬件自检用的。一类用来提供实时服务。Linux在PC上的加载，第一步就是完成POST，接着这部分代码会从内存中冲掉，而服务模块会继续保留来为将要加载的系统服务。在加载的第二步，即本地设备的自检和初始化中，正是服务模块对CMOS中设定的提供启动服务的设备进行扫描。可用来提供启动服务的设备包括了软盘、CD-ROM、硬盘、USB和网络设备等等，但是最常用的还是从硬盘启动。

硬盘上，会有一个位于硬盘的第一个sector（也就是cylinder 0，head 0的sector1）的叫MBR（Master Boot Record）的地方，保存着primary boot loader。一旦这个boot loader加载到RAM，BIOS就把控制权交给它。

Extracting the MBR
-------------------

使用下面的命令可以查看MBR的内容:

```
# dd if=/dev/hda of=mbr.bin bs=512 count=1 
# od -xa mbr.bin
```

命令`dd`必须由root执行，它读取`/dev/hda`（了解linux的朋友应该知道，这是系统上的第一个IDE设备）中的第一个512bytes，然后把它写到`mbr.bin`文件中。命令`od`则是按照`hex`和`ASCII`两种格式把这个二进制文件打印出来。

Stage 1 boot loader
---------------------------

这时在内存中运行的从MBR搞来的Primary boot loader，包括了程序代码和分区表两个部分，如图2所示。512bytes中的前446bytes用来放loader，其中既有可执行代码也有错误消息文件。接下来的64bytes是四个分区表，每个16bytes。最后是两个bytes的magic number（其实就是0xAA55），主要是用来校验这个MBR是不是有效。

![Linux启动过程概览](/downloads/images/2008_08/fig2.gif "Don't touch me...")

<a name="fig2">图2. MBR的内部结构</a>  

Primary boot loader的主要作用无非是把secondary boot loader (stage 2)加载进内存：它会顺序查看各个分区，当找到一个活动的分区时，它会检查一下其他的分区状态是不是都不是活动的。确定只有一个活动的分区后，该分区的boot record就会从设备上拷贝到RAM中执行。

Stage 2 boot loader
--------------------

Secondary或者说second-stage的boot loader其实就负责加载Linux kernel等。

我们常常把first-stage和second-stage的boot loaders合称为Linux Loader(LILO)或是x86 PC环境下的GRand Unified Bootloader (GRUB)。由于LILO有一些GRUB不具备的优点，所以大部分的时候我们是使用GRUB，因此主要讨论它 (你可以在本文后面的[Resources][1]部分找到更多关于GRUB、LILO等相关内容的资料) 。

GRUB的舒爽之处在于它能读懂Linux的文件系统，于是我们可以从ext2或者ext3文件系统加载Linux Kernel，而不像LILO那样，要从原始的sector中加载。实际上，GRUB是把前面说的两个stage的boot loader扩展到三个阶段，也就是在stage1之后，加入了stage1.5 boot loader，来完成对文件系统的认知的。比如`reiserfs_stage1_5` (从一个 Reiser文件系统)或者`e2fs_stage1_5` (从ext2或者ext3文件系统)加载。当这个stage 1.5 boot loader加载运行之后，stage 2 boot loader才加载。 

GRUB stage boot loaders
-------------------------

`/boot/grub` 目录下保存着`stage1`, `stage1.5`, 和 `stage2` 的boot loaders，以及很多其他的可选loader (比如供CR-ROMs使用的`iso9660_stage_1_5`)。

当stage 2 加载完毕，GRUB可以列出可用的kernel（在`/etc/grub.conf中定义`）。 你可以选择其中的一个，并且设置你选中的kernel的启动参数。如果你知道怎么写shell的话，显然可以通过GRUB更精确的控制整个启动过程的细节。

当second-stage的boot loader加载到内存后，默认的kernel映像和`initrd`映像会加载到内存中。这些映像加载完毕之后，second-stage的boot loader就会激活kernel映像。 

Manual boot in GRUB
---------------------

在GRUB的命令行下，你可以引导一个特定的kernel和特定名称的`initrd`映像:

```
grub> kernel /bzImage-2.6.14.2
   [Linux-bzImage, setup=0x1400, size=0x29672e]

grub> initrd /initrd-2.6.14.2.img
   [Linux-initrd @ 0x5f13000, 0xcc199 bytes]

grub> boot
Uncompressing Linux... Ok, booting the kernel.
```

如果你不知道将要用于加载的kernel的名称，可以在GRUB命令行中用/+Tab命令列出可用的kernel和`initrd映像。` 

Kernel
-------

当kernel映像加载到内存中，并从stage 2的boot loader手中接过了控制权之后，我们要知道，这个kernel一般还不是一个可执行的kernel，而是压缩过的kernel映像。通常这个映像使用zlib压缩为zImage (compressed image，小于512KB) 或者是bzImage (big compressed image，大于512KB)。在这个映像的初始部分是一个小模块，进行一些基本的硬件初始化工作，然后把可执行的kernel部分解压出来，放到内存高位。接下来，这个模块就调用kernel，开始kernel引导工作。 

以一个i386的映像为例，这个bzImage被激活后，会从位于`./arch/i386/boot/head.S`中的`start`函数开始执行(图三是基本步骤的流程图)。这个函数进行一些基本的硬件初始化，然后就调用`./arch/i386/boot/compressed/head.S`的`startup_32`函数。此函数配置基本环境，堆栈等，清空`Block Started by Symbol` (BSS)。接着`./arch/i386/boot/compressed/misc.c`中的`decompress_kernel`函数被调用，kernel解压到内存中。`./arch/i386/kernel/head.S`的另一个`startup_32`函数在解压完成之后得到调用。这个函数(也被称为`swapper`或者是`process 0`)完成分页表初始化，内存分页功能就绪。同时CPU类型和可用FPU情况被检测并保存起来，供后续使用。接下来位于`init/main.c`中的`start_kernel`函数被调用，这个函数从本质上可以被看作Linux kernel的main函数。 

![启动流程中的函数调用](/downloads/images/2008_08/fig3.gif "Don't touch me...")

<a name="fig3"><b>Figure 3. Linux kernel i386 启动流程中的函数调用 </b></a>  


调用`start_kernel`会激活一系列的初始化函数，进行中断设置，内存设置和RAM初始化等工作。此后，位于`arch/i386/kernel/process.c`文件中的`kernel_thread`被调用，`init`函数随之运行。这是第一个用户空间的进程。最终，idle任务开始运行，调度函数获得控制权(这是在调用``cpu_idle`之后)。 

在整个kernel的启动中，在stage 2的boot loader载入到内存中的initial-RAM disk (`initrd`) 会被拷贝到RAM中，并挂载起来。它以一个临时的文件系统的身份在RAM中工作，使得kernel在没有任何物理设备挂载的情况下也可以完整的启动起来。正是由于所有与外围设备相关的交互都可以放到`initrd`中，kernel本身虽然很小，但却支持范围极其广的硬件设备。在kernel的启动完成之后，root文件系统就会回滚(通过`pivot_root`)，`initrd的`root文件系统被卸载，实际的root文件系统被挂载起来。 

Init
-------

kernel的启动和初始化完成后，kernel开始第一个用户空间程序。这也是整个过程中激活的第一个用标准C库编译的程序。 

对于一个桌面Linux系统而言，一般来说启动后运行的第一个程序是/sbin/init。但这显然不是必须的：很多嵌入式系统不需要init提供的那么多功能（看看/etc/inittab就知道有多复杂了），所以你可以运行一个简单的脚本启动嵌入式程序。 

总结
----

从上面的叙述我们知道，和Linux系统本身一样，Linux的启动过程是非常灵活的。最初的loadlin boot loader提供了简便的启动linux的可能。接下来的LILO boot loader扩展了启动功能，但是没有区分文件系统的能力。最新一代的boot loaders，如GRUB等，则支持从一系列文件系统（Minix到Reiser等）来启动Linux的功能。 

Resources
----------

**学习资料** 

*   Boot Records Revealed ，学习MBRs的好地方，同时提供了大量的boot loaders。同时，这里还讨论GRUB, LILO和各种版本的Windows boot loader。 
*   Disk Geometry是学习硬盘相关技术的好地方，它有一个不错的硬盘参数列表。 
*   [live CD][2]，玩过Linux的兄弟们应该再熟悉不过了。它是一个可以从CD或者DVD上引导的操作系统，你甚至不需要有硬盘。 
*   &#8220;[Boot loader showdown: Getting to know LILO and GRUB][3]&#8221; (developerWorks, August 2005) 描述了LILO和GRUB boot loader的很多细节。 
*   [Linux Professional Institute (LPI) exam prep][4]系列文章讨论了Linux的启动，同时还讨论了很多基础的Linux任务，如果你想成为Linux系统管理员，值得一看。 
*   [LILO][5]可以算是GRUB的&#8230;但是你仍然可以看到用它引导Linux的例子。 
*   [mkintrd][6]命令用来创建initial RAM disk image。 
*   在[Debian Linux Kernel Project][7]中，可以找到很多关于Linux的kernel，boot和嵌入式开发的技术内容。 </ul> 
                            
**产品技术** 
                            
*   <a href="http://www.linuxdevices.com/articles/AT8516113114.html" class="broken_link">MicroMonitor</a> 提供了多种目标环境的boot环境支持。你可以使用它在嵌入式环境中启动Linux系统。它支持ARM，XScale，MIPS，PowerPC，Coldfire和Hitachi&#8217;s Super-H。 
*   [GNU GRUB][8]，可选项极其丰富的boot shell 
*   [LinuxBIOS][9] ，其实它就是一个压缩后的kernel
*   [OpenBIOS][10] 也是一个跨平台可移植的BIOS项目。支持平台包括了x86, Alpha和AMD64
*   [kernel.org][11]那边可以看到最新的kernel树

 [1]: http://www.ibm.com/developerworks/linux/library/l-linuxboot/index.html?S_TACT=105AGX03&#038;S_CMP=ART#resources
 [2]: http://en.wikipedia.org/wiki/LiveCD
 [3]: http://www.ibm.com/developerworks/linux/library/l-bootload.html
 [4]: http://www.ibm.com/developerworks/linux/lpi/101.html?S_TACT=105AGX03&#038;S_CMP=art
 [5]: http://www.freshmeat.net/projects/lilo/
 [6]: http://www.netadmintools.com/html/mkinitrd.man.html
 [7]: http://debianlinux.net/linux.html
 [8]: http://www.gnu.org/software/grub/
 [9]: http://www.linuxbios.org/index.php/Main_Page
 [10]: http://www.openbios.org/
 [11]: http://www.kernel.org