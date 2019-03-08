---
layout: post
title: "Boolean Objects和Boolean Primitives"
date: 2013-08-21 11:31
comments: true
categories: 
- javascript
- tip
- pitfall
---

Javascript有一个小陷阱：每个primitive都有自己的constructor，但是这些constructor构造出来的却不是primitive。

以boolean为例，大多数的代码里面用的是primitive值，比如：

```javascript
var primitiveTrue = true;
var primitiveFalse = false;
```

但实际上javascript里面还有Boolean函数，可以返回一个boolean的primitive：

```javascript
var functionTrue = Boolean(true);
var functionFalse = Boolean(false);
```

不过，上面这个Boolean函数前面如果有`new`就是一个constructor了：

```javascript
var constructorTrue = new Boolean(true);
var constructorFalse = new Boolean(false);
```

比较tricky的地方在于，上面这种constructor返回的不是primitive，而是对象：

```javascript
// Outputs: true
console.log(primitiveTrue);

// Outputs: true
console.log(functionTrue);

// Outputs: Boolean {}
console.log(constructorTrue);
```

由于javascript的类型转换比较aggressive，比如你把一个int和string相加，这个int会自动转成string：

```javascript
// Outputs: "22"
console.log("2" + 2);
```

所以使用constructor构造对象来作为条件判断的输入其实是比较危险的。因为一个对象被用来做条件判断时，它经常会被转成true：

```javascript
// Outputs: "Objects coerce to true."
if ({}) { console.log("Objects coerce to true."); }
```

特别的，一个Boolean对象即使内部值是false，也会被强制转换成true：

```javascript
// Outputs: "My false Boolean object is truthy!"
if (constructorFalse) {
    console.log("My false Boolean object is truthy!");
} else {
    console.log("My false Boolean object is falsy!");
}
```

如果你实在是要取一个Boolean对象的值需要用`valueOf`方法：

```javascript
// Outputs: "The value of my false Boolean object is falsy!"
if (constructorFalse.valueOf()) {
    console.log("The value of my false Boolean object is truthy!");
} else {
    console.log("The value of my false Boolean object is falsy!");
}
```

但是由于Boolean对象这么tricky，这种代码是非常不受欢迎的：事实上JSHint和JSLint这些工具发现你使用了Boolean的constructor就会报一个`potential error`。

如果你要把一个其他类型的值转成boolean值，也不要用constructor，尽量直接用Boolean函数或者是用两个`!`操作符：

```javascript
// Two approaches to coercing 0 into false
var byFunction = Boolean(0);
var byNotNot = !!0;
```

两种做法都不错，但是如果你看javascript代码比较多会发现后面这种使用更普遍：可能是因为能少打点儿字。