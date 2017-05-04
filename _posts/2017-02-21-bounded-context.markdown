---
layout: post
title: "Bounded Context"
date: 2017-02-21 04:58:52 +0800
comments: true
categories: 

- Bounded-Context
- DDD
- architecture
- bliki

---

## 定义

Bounded Context是领域驱动设计中战略设计的重要组成部分，一定程度上决定了系统的逻辑架构以及集成方式。

基于康威定律，Bounded Context的划分还可能会影响进行项目开发实施的组织的结构。

DDD社区将Bounded Context定义为：

> 应该显式地定义某个模型所应用的上下文。还应该在团队组织、应用中特定部分的使用以及像代码库和数据库模式等物理表现等方面显式地设定边界。要保持边界中模型的严格一致，而不要受外界问题的影响与干扰。

这段话在说的无非是“边界”，通过为领域模型划定合理的边界，就可以降低设计与开发的复杂度。此外，边界还能够划分知识的层次，例如对外而言，可以只保障暴露在边界外接口的一致性，以及关注它们之间的集成方式。边界之内则自成一体，可以独立演化，甚至可以包容一到多个遗留模块。

## 常见问题

正是因为Bounded Context带来的隔离性，[Juelin Lerman](https://msdn.microsoft.com/en-us/magazine/jj883952.aspx)才认为：“把一个将大量的类放在一个上下文中的独立模型分解为多个较小的模型是有好处的。Bounded Context创建的模型较小，而且内聚性更高，同时维持了模型之间的边界。”

好处听起来都是好的，但是难免会有下面这些问题：

如何确定或划分Bounded Context？
Bounded Context是否具有层次？
Bounded Context划分的边界是逻辑的，还是物理的？
Bounded Context之间的通信方式？

也难怪在文章《[DDD: The Bounded Context Explained](http://www.sapiensworks.com/blog/post/2012/04/17/DDD-The-Bounded-Context-Explained.aspx)》中Mike要说，Bounded Context是DDD中最难解释的原则，但或许也是最重要的原则。可以说，没有BC，就不能做DDD。在了解Aggregate Root、Aggregate、Entity等概念之前，需要先了解BC。

Vaughn Vernon的[Implementing Domain-Driven Design](http://book.douban.com/subject/25844633/)解释如下：

> Bounded Context是一个显式的边界，领域模型便存在于这个边界之内。领域模型把通用语言表达成软件模型。创建边界的原因在于，每一个模型概念，包括它的属性和操作，在边界之内都具有特殊的含义。


这里是从设计原则上来规约出Bounded Context的定义：

- 它是模型概念，与实现无关，是高层的抽象机制
- 具有自己独立的边界，是自治的，遵循高内聚、松耦合
- 不同的Bounded Context之间的关系决定它们之间的协作与通信方式
- 它与Domain应为一一对应关系
- 一个上下文意味着一个专有的职责

## Reference

1. [BoundedContext by Martin Fowler](https://martinfowler.com/bliki/BoundedContext.html)
2. [Implementing Domain-Driven Design](https://www.amazon.com/gp/product/0321834577?ie=UTF8&tag=martinfowlerc-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321834577)
3. [Shared Data Model using Bounded Context](https://msdn.microsoft.com/en-us/magazine/jj883952.aspx) 


