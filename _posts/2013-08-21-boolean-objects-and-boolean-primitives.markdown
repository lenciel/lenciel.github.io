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

Javascript 有一个小陷阱：每个 primitive 都有自己的 constructor，但是这些 constructor 构造出来的却不是 primitive。

以 boolean 为例，大多数的代码里面用的是 primitive 值，比如：

```javascript
var primitiveTrue = true;
var primitiveFalse = false;
```

但实际上 javascript 里面还有 Boolean 函数，可以返回一个 boolean 的 primitive：

```javascript
var functionTrue = Boolean(true);
var functionFalse = Boolean(false);
```

不过，上面这个 Boolean 函数前面如果有`new`就是一个 constructor 了：

```javascript
var constructorTrue = new Boolean(true);
var constructorFalse = new Boolean(false);
```

比较 tricky 的地方在于，上面这种 constructor 返回的不是 primitive，而是对象：

```javascript
// Outputs: true
console.log(primitiveTrue);

// Outputs: true
console.log(functionTrue);

// Outputs: Boolean {}
console.log(constructorTrue);
```

由于 javascript 的类型转换比较 aggressive，比如你把一个 int 和 string 相加，这个 int 会自动转成 string：

```javascript
// Outputs: "22"
console.log("2" + 2);
```

所以使用 constructor 构造对象来作为条件判断的输入其实是比较危险的。因为一个对象被用来做条件判断时，它经常会被转成 true：

```javascript
// Outputs: "Objects coerce to true."
if ({}) { console.log("Objects coerce to true."); }
```

特别的，一个 Boolean 对象即使内部值是 false，也会被强制转换成 true：

```javascript
// Outputs: "My false Boolean object is truthy!"
if (constructorFalse) {
    console.log("My false Boolean object is truthy!");
} else {
    console.log("My false Boolean object is falsy!");
}
```

如果你实在是要取一个 Boolean 对象的值需要用`valueOf`方法：

```javascript
// Outputs: "The value of my false Boolean object is falsy!"
if (constructorFalse.valueOf()) {
    console.log("The value of my false Boolean object is truthy!");
} else {
    console.log("The value of my false Boolean object is falsy!");
}
```

但是由于 Boolean 对象这么 tricky，这种代码是非常不受欢迎的：事实上 JSHint 和 JSLint 这些工具发现你使用了 Boolean 的 constructor 就会报一个`potential error`。

如果你要把一个其他类型的值转成 boolean 值，也不要用 constructor，尽量直接用 Boolean 函数或者是用两个`!`操作符：

```javascript
// Two approaches to coercing 0 into false
var byFunction = Boolean(0);
var byNotNot = !!0;
```

两种做法都不错，但是如果你看 javascript 代码比较多会发现后面这种使用更普遍：可能是因为能少打点儿字。