---
layout: post
title: "Android开发中使用ProGuard"
date: 2012-02-27 22:46
comments: true
categories: 
- android
- maven
- proguard
- tutorials
---

今天被同事问到怎么在release版本里面所有的日志都去掉的时候，竟然只能回忆起用`ProGuard`做过这个，完全忘记怎么做的了，特立此存照。文章里面使用的例子放在<a class="network" href="https://github.com/lenciel/AMP" rel="me"><img src="/downloads/images/github_button.png" alt="" width="16" height="16" /> Android-Maven-ProGuard-Sample-App</a>。

#### ProGuard简介

在移动设备上面开发应用程序，性能是一个很关键的指标。你的老板走过来要你提高性能的时候，你的第一反应有可能是抓起熟悉的工具花几个小时profile自己的应用，找出那些时间都花在哪里了。在使用这么终极的手段之前，千万不要忘记了先试试ProGuard。

做Android之前就是Java程序员的可能早就已经对ProGuard很熟悉了。简单的来说，ProGuard就是一个Java的class文件处理器，主要的功能类似奥运会口号：

*   让你的程序变得更小更快 
*   让你的程序变得更难被反向工程 

尽管ProGuard不是专用于Android开发的，但是在Android的SDK里面已经包括了这个工具，路径是`ANDROID_HOME/tools/proguard`，文档可以在<http://proguard.sourceforge.net>看到。

让程序变得更小更快的好处是不言而喻的。ProGuard通过对bytecode进行优化，优化手段包括去掉无用的代码，去掉内联方法的调用，对类的继承结构进行优化，把所有能加上的`final`和`static`加上，以及对算术运算进行<a href="http://en.wikipedia.org/wiki/Peephole_optimization" target="_blank">Peephole optimization</a>等等。

让程序变得更难被反向工程就不一定是每个人都需要的了。一般情况下，对Android的反向工程是把Dalvik的bytecode转换成Java的bytecode，然后使用传统的Java反向工具转成成Java源代码。如果你的项目是开源的，显然也没有必要防止别人反向。但是如果是下面几种情况，你就很可能需要它了： 

* 你在源文件里面有一些不想被别人看到的信息，如密码等 
* 你的代码里面有自己或者公司的赖以生存的知识产权 
* 你的甲方有明确的要求 
* 你的程序按license等方式收费，你不想被别人把licens检查的部分去掉重新编译个版本 

ProGuard可以帮助通过对类，方法和成员名称进行混淆，同时通过去掉结构化的信息，如文件名或者行号表等，来使得代码从理论上变得不可被反向工程。

如此看来，ProGuard真是美好事物一枚。但是ProGuard也不是随手一点药到病除的，也有一点学习曲线。

#### 启用ProGuard

如果你使用Eclipse的ADT，每个新建的项目都会生成一个`proguard.cfg`文件在项目的根目录。你对ProGuard的所有设定就是在这个文件里面完成的。要想在项目里面启用Proguard，只需要把同样在项目根目录的`default.properties`里面加上：

```bash
proguard.config=proguard.cfg
```

当然，如果你蛋疼到要自己去移动cfg文件的位置，也要记得去改等号后面的部分。然后，在所有的release版本的build里，你的Proguard就已经生效了。对于使用Eclipse的同学来说，release的build就是指通过选择Android Tools>Export Signed/Unsigned Application Package来进行。

因为在大多数开发中我们都会使用Ant或者是Maven来对项目进行管理，所以一般不会直接用Eclipse来进行release版本的编译，所以通常我们还要掌握如何在不使用ADT的情况下使用ProGuard。对于Maven而言，可以通过使用Maven Android plugin来完成。同时，由于ProGuard已经完全集成到Android的工具链里面了，所以Android的Ant任务里面也有一个专门的private任务叫做`-obfuscate`，会把激活并使用ProGuard作为release这个target的一部分，所以使用Ant的话只要一个ant release就可以了。

当ProGuard执行以后，会产生几个特别重要的文件：

*   `mapping.txt`：保存了混淆后的名字和混淆前名字的对应关系。对于每次release的build，都要记得保存这个文件，要不然如果你收到release版本上报出的defect的时候，就等着哭吧。 
*   `seeds.txt`：ProGuard找到的你的程序的entrypoint列表。 
*   `usage.txt`：ProGuard觉得没有用所以移除了的一堆类，域和方法的list。要想学习写作“完美”的ProGuard规则的同学就要经常来这个文件看看自己定下的rule对ProGuard的行为究竟有什么样的影响。如果你有用的类出现在list里面了，说明你削得太猛了，反之亦然。

需要注意的是这些文件的输出目录。在使用Ant ProGuard target的时候，输出目录是`bin/proguard/`，但是如果是通过ADT(右键project>Android Tools>Export）的话，输出目录会是`proguard/`。

还有一个常见的困惑就是ProGuard是怎么找到那些需要处理的文件的。一般情况下，ProGuard希望你用`-injars`或者是`-libraryjars`来告诉它。但是对Android开发而言，Ant任务和ADT都会自动的查看你的`libs`，`output`和项目的`classpath`目录。

从执行过程的日志来看，ProGuard对类文件的操作分为三个步骤：shrink，optimize，obfuscate。每个步骤都是可选的，可以通过使用`-dontshrink`、`-dontoptimize`和`-dontobfuscate`来分别关掉。一般来说，不用因为结果“不如人意”就随意的关掉某个步骤。完整的进行三个步骤，然后不断的改变规则，直到达到最佳效果，是使用ProGuard的最佳方式。

#### 编写ProGuard规则

ProGuard和很多工具一样，其强大之处在于选项够多。作为Android开发者使用，首先心里要明白，没有一个唯一的最佳配置规则。在此基础上，去掌握一些对Android程序而言通常是适用的规则。然后，就像在文章里面已经反复强调过的一样，以这些规则为起点，反复的调整你的规则，找出一个对自己的程序最适用的规则。

当然，因为选项太多，ProGuard给初学者的感觉难免是千头万绪，无从下手。因此，我们可以从一个例子程序入手来找到对ProGuard的“感觉”。

这个例子本身没有任何特别之处，`MyButton`类继承自`Button`但是没有添加新的方法，可以通过它来观察ProGuard如何对继承结构进行压缩。Click的handler除开显示toast之外也没有特别的功能，可以通过它来观察ProGuard对方法名的混淆。`AMPSampleActivity`里面还专门有一个没有被调用的方法，可以通过它来观察ProGuard对这种情况的处理。下面是程序的入口Activity的实现：

我们期望ProGuard做的事情包括：

*   保留`AMPSampleActivity`类，因为它是我们在XML里面指定的程序入口 
*   保留`StringUtils`类和它的`repeat`方法 
*   保留`myClickHandler`方法 
*   保留`MyButton`类 
*   去掉`unusedMethod` 
*   除开XML里面引用的类（`AMPSampleActivity`和`MyButton`），其他的类名都需要被混淆 
*   除开XML里面引用的方法名（`myClickHandler`），其他的方法名都要被混淆 
*   完成一些对Android而言通常适用的优化（下面会仔细展开） 

ProGuard的规则是“白名单”的，也就是说ProGuard只会对你特别指定的类刀下开恩。这也就是说，对任何程序，我们都至少要写一条规则，来保留程序的入口类。因为是Android程序，我们可以这么写：

```java
-keep public class * extends android.app.Activity
```
这里我们可以看到ProGuard的rule用的语法基本上遵循了Java本身的语法（`extends`等等），但是它支持使用通配符。规则中的`-keep`告诉ProGuard不要删除也不要混淆任何从`android.app.Activity`继承的类。

很简单，不是吗？如果你这个时候运行程序，会看到： 

```java
org.lenciel.android/org.lenciel.android.AMPSampleActivity}: 
    ➥ android.view.InflateException: Binary XML file line #6: Error inflating 
    ➥ class org.lenciel.android.MyButton
```

为什么在inflate我们自定义的view的时候crash了呢？这是因为自定义的view是在XML里面被用到的，而不是在Java代码里面。因此ProGuard会认为这是没有用的代码而试着删除它。要保证这些自定义的view不被误删，就需要定义如下的规则：

```java
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet); 
} 
 
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet, int); 
}
```

这两条规则告诉ProGuard不要对定义了可能被`LayoutInflater`调用的构造函数的任何类进行优化。我们这里使用了`-keepclasseswithmembers`而不是`-keep`。

再次运行，会遇到下面的错误：

```java
java.lang.IllegalStateException: Could not find a method 
   ➥ myClickHandler(View) in the activity class org.lenciel.android.AMPSampleActivity for onClick handler on 
   ➥ view class org.lenciel.android.MyButton
```

去查看`usage.txt`你会发现`myClickHandler`又被干掉了。为什么在第一条规则里面我们告诉ProGuard不要动`AMPSampleActivity`里面的任何东西，还是会有这种情况发生？这是使用`-keep`的一个常见的误会。我们用`-keep`告诉ProGuard保留一个类的时候，没有提供任何类的“body”信息的话，ProGuard仅仅会保留这个类的名字。它仍然会对这个类内部的所有东西进行优化和混淆。要保留方法，我们需要这么写：

```java
-keep public class * extends android.app.Activity { 
    methods; 
}
```

但是这样写显然又太过于慷慨了。下面这条规则会好很多：

```java
-keepclassmembers class * extends android.app.Activity {
    public void *(android.view.View); 
}
```

这条规则告诉ProGuard，如果一个`Activity`在`shrink`阶段没有被去掉，那么就保留那些`public`的，没有返回值的，传入了`android.view.View`作为参数的方法。

可以看到，使用ProGuard存在一个不断调优的过程。他山之石，可以攻玉，已经有很多人使用ProGuard来优化Android程序了，于是也有了一些被普遍采用的规则和选项，我们下面来个简单说明。

#### 常用规则和选项

前面看到的规则对于例子程序就足够了。但是如果我们的程序使用了`Service`怎么办？和`Activity`一样，`Service`也是在manifest xml里面定义的，因此我们需要对`proguard.cfg`做一定的扩展。

下面的规则是针对Android程序一般来说都比较有效的。

一般来说，下面的Android framework class都是需要保留的：

```java
-keep public class * extends android.app.Activity 
-keep public class * extends android.app.Application 
-keep public class * extends android.app.Service 
-keep public class * extends android.content.BroadcastReceiver 
-keep public class * extends android.content.ContentProvider 
-keep public class * extends android.app.backup.BackupAgentHelper 
-keep public class * extends android.preference.Preference 
-keep public class com.android.vending.licensing.ILicensingService
```

虽然你的程序可能一开始没有使用其中的一些类，但是定义好全部这些规则也是有好处的：它可以避免你在使用ProGuard编出的版本crash之后去搞半天才发现有某个类似的规则需要更新但是你忘记了。

第二个有用的规则是保留`static`的`CREATOR`域，这个是Android用来parcel对象的。这个域由于是在运行的时候<a href="http://www.google.com.hk/url?sa=t&rct=j&q=introspection&source=web&cd=2&ved=0CDYQFjAB&url=http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FIntrospection&ei=_JhDT-6ADIGtiQfF46TMBA&usg=AFQjCNEEE1rrErPfi38AVCPjdN6ri-qROA" target="_blank">Instrospection</a>的，所以ProGuard会认为它是无用的域并把它去掉。下面这条rule可以防止这样的事情发生：

```java
-keepclassmembers class * implements android.os.Parcelable {
    static android.os.Parcelable$Creator CREATOR; 
}
```

在程序中如果你调用了native的code，比如你用JNI来调用了c的lib，由于在Java代码里面是一份方法的签名，而没有方法的实现，它必须被链接到native code上。这也就意味着这些函数名不能被ProGuard加以混淆了，不然链接的过程就会失败。下面的规则可以保证ProGuard不去动native的方法名：

```java
-keepclasseswithmembernames class * { 
     native methods; 
}
```

我们这里使用的`-keepclasseswithmembernames`是告诉ProGuard，被调用过的方法留着，没有调用过的都去掉。

前面的规则看起来都一目了然。下面这个可能要费解一些：

```java
-keepclassmembers enum * {   
     public static **[] values(); 
     public static ** valueOf(java.lang.String); 
}
```

这个规则是让ProGuard不要去动任何`Enum`的`values`和`valueOf`方法。这些方法之所以特殊是因为Java自己是通过发射机制来调用它们的。这可能也是Google<a href="https://developer.android.com/guide/practices/design/performance.html#avoid_enums" target="_blank">不建议使用</a>Java enum的原因吧：它们比`final class fields`的性能要低不少。如果你已经遵照Google的教诲停止使用`Enum`，那你也不需要这条规则了，恭喜。

下面来看看常用的选项：

```java
-dontusemixedcaseclassnames 
-dontskipnonpubliclibraryclasses 
-dontpreverify 
-verbose
```

第一个选项可以避免像Windows这样不区分大小写的操作系统不会因为类似`A.class`和`a.class`写到同一个文件里面就驾崩。

第二个选项是因为ProGuard默认不会处理任何非public的类。但是有时候我们会遇到public的类继承自内部的非public的类。所以打开这个选项可以更好的覆盖。

第三个选项是告诉ProGuard不要做`preverify`（预检验），因为这个只对J2ME或者是Java6的平台有用。

最后一个选项，你们懂的。

前面我们提到过ProGuard有一个优化代码（optimize）的过程。大多数时候ProGuard都会火力全开的对所有的代码做优化。这些优化操作有些时候是相当aggressive的，比如合并类的时候ProGuard会试着既从纵向上合并也从横向上合并，以便得到尽量少的类文件，也就可以得到尽量小的APK。同时它还会试着优化循环和代数运算。默认的ADT生成的ProGuard选项关掉了很多的优化选项：

```java
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*
```

Google并没有提供他们这么配置的依据。我们可以试着先禁用这个选项，看看程序运行起来会不会有问题。如果遇到了问题再试着慢慢的减弱优化，来“探底”。

同时ProGuard的优化是可以“递归”的，也就是优化完的结果可以作为下次优化的输入继续优化。你可以指定它反复进行多少次。但ProGuard如果发现已经没有什么可以优化，会自动停下来，不一定跑到你指定的次数。一般设置成5就够了：

```java
-optimizationpasses 5
```

#### 如果处理混淆后版本的错误报告

如果你发布了混淆的版本，有一个问题你就得面对：用户提交的问题单里面产生自这些类和方法都完全打乱过后的版本。为了展示这种问题，在Demo程序里面专门加了这么一个类：

```java
public class Bomb {
    public void explode() {
        throw new RuntimeException("Boom!");
    }
}
```

在onCreate方法里面它会被引爆：

```java
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);
    String toast = StringUtils.repeat("Hello ProGuard! ", 3);
    Toast.makeText(this, toast, Toast.LENGTH_SHORT).show();
    new Bomb().explode();
}
```

如果你运行程序，就会看到下面的错误：

```java
java.lang.RuntimeException: Unable to start activity ...MainActivity}: 
java.lang.RuntimeException: Boom!
...
Caused by: java.lang.RuntimeException: Boom!
   at org.lenciel.android.MainActivity.onCreate(Unknown Source)
   at android.app.Instrumentation.callActivityOnCreate(
   ➥ Instrumentation.java:1047)
   at android.app.ActivityThread.performLaunchActivity(
   ➥ ActivityThread.java:2627)
   ... 11 more
```

可以看到在错误出现位置的stack trace既没有行号也没有文件名。这是因为相关的信息都被ProGuard优化掉了。如果我们想避免这种情况，就要在`proguard.cfg`里面加上下面的选项：

```bash
-keepattributes SourceFile,LineNumberTable
```

显然，有了行号和文件名，还是解决不了方法被混淆的问题。我们这个例子程序里面方法很少，而`onCreate`方法因为是`Override`的，所以ProGuard不会去动它。如果是正式的工程，最好的办法还是用`retrace`工具来根据`mapping.txt`还原整个日志。

```bash
$ retrace proguard/mapping.txt stacktrace.txt
```
