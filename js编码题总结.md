# js编码题总结

* [循环闭包实现let](#循环闭包实现let)
* [实现const](#实现const)
* [lazyman](#lazyman)
* [隐式调用与api](#隐式调用与api)
* [call和apply](#call和apply)
* [bind](#bind)
* [new](#new)
* [instanceof](#instanceof)
* [object.create](#object.create)
* [深复制](#深复制)
* [防抖节流](#防抖节流)
* [函数柯里化](#函数柯里化)
* [依赖注入](#依赖注入)
* [寄生组合继承](#寄生组合继承)
* [工厂模式](#工厂模式)
* [单例模式](#单例模式)
* [发布订阅观察者](#发布订阅观察者)
* [Promise](#Promise)
* [promise.all](#promise.all)
* [promise.race](#promise.race)
* [promise.finally](#promise.finally)
* [promise.allSettled](#promise.allSettled)
* [失败重试maxRequest次再reject](#失败重试maxRequest次再reject)
* [链式调用](#链式调用)
* [原生发送请求的几种方式](#原生发送请求的几种方式)
* [实现ajax](#实现ajax)
* [发送跨域请求](#发送跨域请求)
* [继发和并发](#继发和并发)
* [async函数实现](#async函数实现)
* [统计词频](#统计词频)
* [双向数据绑定](#双向数据绑定)
* [数据格式处理](#数据格式处理)
* [图片懒加载](#图片懒加载)
* [正则获取URL参数](#正则获取URL参数)
* [操作cookie](#操作cookie)
* [文件切片上传](#文件切片上传)
* [活动倒计时](#活动倒计时)
* [监听url变化](#监听url变化)
* [koa2洋葱模型compose](#koa2洋葱模型compose)

---

## 循环闭包实现let

```js
for (var i = 0; i < 10; i++) {
    (function (i) {
        //闭包缓存
        setTimeout(() => {
            console.log(i);
        }, 0);
    })(i);
}
```

## 实现const

```js
function _const(key, value) {
    const desc = {
        value,
        writable: false,
    };
    Object.defineProperty(window, key, desc);
}

_const("obj", { a: 1 }); //定义obj
obj.b = 2; //可以正常给obj的属性赋值
obj = {}; //抛出错误，提示对象read-only
```

## lazyman

考察对象使用，链式调用，闭包缓存参数，函数队列，事件循环

题目

```txt
实现一个LazyMan，可以按照以下方式调用:
LazyMan(“Hank”)输出:
Hi! This is Hank!

LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
Hi! This is Hank!
//等待10秒..
Wake up after 10
Eat dinner~

LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
Hi This is Hank!
Eat dinner~
Eat supper~

LazyMan(“Hank”).sleepFirst(5).eat(“supper”)输出
//等待5秒
Wake up after 5
Hi This is Hank!
Eat supper
```

```js
function Lazyman(name) {
    return new _Lazyman(name);
}
class _Lazyman {
constructor(name) {
    this.tasks = []; //设置任务队列
    let self = this;
    let task = (function (name) {
        return function () {
            console.log("Hello I'm " + name);
            self.next(); //因为没法for循环执行，所以只能console完就调用next来执行下一个
        };
    })(name); //闭包传参能缓存参数，最终返回函数，否则无法在next中向function传参
    this.tasks.push(task);
    //此时首次进入构造函数，tasks为[f]，调用方式为tasks[0]()
    //通过settimeout的方法，先执行链式调用和传参，最后才执行next()
    setTimeout(function () {
    self.next();
    }, 0);
}
next() {
    //取出一个任务并执行
    let task = this.tasks.shift();
    if (task) {
        task();
    }
}
eat(food) {
    let self = this;
    let task = (function (food) {
        return function () {
            console.log("Eat " + food);
            self.next();
        };
    })(food);
    this.tasks.push(task);
    return this; //链式调用
}
sleep(time) {
    let self = this;
    let task = (function (time) {
        return function () {
            setTimeout(function () {
            console.log("Wake up after " + time + " s!");
            self.next(); //setTimeout执行完才能执行下一个
            }, time * 1000);
        };
    })(time);
    this.tasks.push(task);
    return this;
}
sleepFirst(time) {
    let self = this;
    let task = (function (time) {
        return function () {
            setTimeout(function () {
            console.log("Wake up after " + time + " s!");
            self.next();
            }, time * 1000);
        };
    })(time);
    this.tasks.unshift(task); //函数最先执行，向队列头部插入函数
    return this;
}
}
// Lazyman('Hank');
// Lazyman('Hank').sleep(5).eat('dinner');
// Lazyman('Hank').eat('dinner').eat('supper');
Lazyman("Hank").sleepFirst(5).eat("supper");
```

## 隐式调用与api

让(a==1&&a==2&&a==3)为true
    
1. toString

    ```js
    let a = {
        i : 1,
        toString: function(){
            return a.i++
        }
    }
    if(a==1&&a==2&&a==3){
        console.log('success')
    } else {
        console.log('fail')
    }
    ```

2. defineProperty

    ```js
    var val = 0;
    Object.defineProperty(window, 'a', {
        get: function() {
            return ++val;
        }
    });
    if (a == 1 && a == 2 && a == 3) {
        console.log('yay');
    }
    ```

3. Array.join

    ```js
    let a = [1,2,3];
    a.join = a.shift;
    if(a==1&&a==2&&a==3){
        console.log('success')
    } else {
        console.log('fail')
    }
    ```

## call和apply

call,apply 用于改变函数执行的作用域，即改变函数体内 this 的指向。区别在于：call 的第二个参数起要逐一列出，apply 第二个参数可以是 array 或 arguments

```js
var person = {
    fullName: function (txt) {
    console.log(txt + this.firstName + " " + this.lastName);
    },
};
var person1 = {
    firstName: "John",
    lastName: "Doe",
};
person.fullName.call(person1, "Hello, ");
person.fullName.apply(person1, ["Hello, "]);
Function.prototype._apply = function (targetObject, argsArray) {
    // 是否传入执行上下文，若没有指定，则指向 window
    targetObject = targetObject || window;
    // 若是没有传递，则置为空数组
    argsArray = argsArray || [];
    // 利用Symbol的特性，设置为key
    const targetFnKey = Symbol("key");
    // 将调用_apply的函数赋值
    targetObject[targetFnKey] = this;
    // 执行函数，并在删除之后返回
    const result = targetObject[targetFnKey](...argsArray);
    delete targetObject[targetFnKey];
    return result;
};
Function.prototype._call = function (targetObject, ...argsArray) {
    // 是否传入执行上下文，若没有指定，则指向 window
    targetObject = targetObject || window;
    // 利用Symbol的特性，设置为key
    const targetFnKey = Symbol("key");
    // 将调用_call的函数赋值
    targetObject[targetFnKey] = this;
    // 执行函数，并在删除之后返回
    const result = targetObject[targetFnKey](...argsArray);
    delete targetObject[targetFnKey];
    return result;
};
//以下为es5版本
Function.prototype.myOwnCall = function (context) {
    context = context || window; //如果第一个参数传入的是null的情况下，this会指向window
    //防止与原对象方法重名
    var uniqueID = "00" + Math.random();
    while (context.hasOwnProperty(uniqueID)) {
        uniqueID = "00" + Math.random();
    }
    context[uniqueID] = this; //记录为调用的函数
    //Array.from(arguments).slice(1)
    var args = [];
    for (var i = 1; i < arguments.length; i++) {
        args.push("arguments[" + i + "]");
    }
    var result = eval("context[uniqueID](" + args + ")"); //传入参数，执行函数，处理函数返回值
    delete context[uniqueID]; //清除给原对象新增的方法
    return result;
};
Function.prototype.myOwnApply = function (context, arr) {
    context = context || window; //如果第一个参数传入的是null的情况下，this会指向window
    //防止与原对象方法重名
    var uniqueID = "00" + Math.random();
    while (context.hasOwnProperty(uniqueID)) {
        uniqueID = "00" + Math.random();
    }
    context[uniqueID] = this; //记录为调用的函数

    var args = [];
    var result = null;

    if (!arr) {
        result = context[uniqueID](); //没有第二个参数的情况
    } else {
        //有第二个参数的情况
        //Array.from(arguments).slice(1)
        for (var i = 0; i < arr.length; i++) {
            args.push("arr[" + i + "]");
        }
        result = eval("context[uniqueID](" + args + ")");
    }
    delete context[uniqueID]; //清除给原对象新增的方法
    return result;
};
person.fullName.myOwnCall(person1, "Hello, ");
person.fullName.myOwnApply(person1, ["Hello, "]);
```

## bind

bind方法会创建一个函数实例,this会被绑定到传给bind()函数的值

f.bind(obj)，实际上可以理解为obj.f()

从第二个参数起，会依次传递给原始函数

```js
window.color = 'red'
var o = {
    color:'blue'
}
function sayColor(color){
    console.log(this.color)
}
var objSayColor = sayColor.bind(o);
objSayColor(); //blue
```

```js
Function.prototype.my_bind = function(context,...args) {
    var self = this;
    context = context || window;
    args = args || [];
    return function(...rest) {
        self.apply(context, args.concat(rest));
    }
}
//以下为es5
// 方法一，只可绑定，不可传参
Function.prototype.my_bind = function(context){
    var self = this;
    return function(){
        self.apply(context,arguments);
    }
}
Function.prototype.my_bind = function() {
    // 保存原函数
    var self = this,
    // 保存需要绑定的this上下文(获取传入的第一个参数),等价于 context = [].shift.call(arguments);
    context = Array.prototype.shift.call(arguments),
    // 剩余的参数转为数组
    args = Array.prototype.slice.call(arguments);
    // 返回一个新函数
    return function() {
        //处理a.my_bind(b, 7, 8)(9)多次传参的情况;
        //此处的arguments与上方的arguments，不是同一个arguments
        self.apply(context, Array.prototype.concat.call(args, Array.prototype.slice.call(arguments)));
    }
}
```

## new

new运算符背后的步骤：
    
* 创建一个空对象
* 链接到原型
* 绑定this值
* 返回新对象

```js
class a1{
  constructor(val){
    this.val = val
    this.a1 = function(){
      console.log(this.val)
    }
  }
  a2(){

  }
}
function a(val){
  this.val = val;
  this.a1 = function(){
    console.log(this.val)
  }
}
a.prototype.a2 = function(){}
let b = new a1(1);
let c = _new(a,1);//传a1会报错，es6的class必须new，否则apply报错:Uncaught TypeError: Class constructor a1 cannot be invoked without 'new'
console.log(b,c)
```
```js
function _new() {
    let target = {};
    let [constructor, ...args] = [...arguments];
    console.log(constructor,args)
    target.__proto__ = constructor.prototype;
    let result = constructor.apply(target,args);
    if(result && (typeof result == 'object' || typeof result == 'function')) return result;
    return target;
}
```
```js
function create(){
    //创建一个空对象
    let obj = new Object();
    //获取构造函数
    let fn = [].shift.call(arguments);
    //链接到原型
    obj.__proto__ = fn.prototype;
    //绑定this值
    let result = fn.apply(obj,arguments);//使用apply，将构造函数中的this指向新对象，这样新对象就可以访问构造函数中的属性和方法
    //返回新对象
    return typeof result === "object" ? result : obj;//如果返回值是一个对象就返回该对象，否则返回构造函数的一个实例对象
}
```

## instanceof

a instanceof b ,判断a是否b的实例，即a从b处new出来

```js
function instanceOf(left,right) {
    let proto = left.__proto__;
    let prototype = right.prototype;
    while(true) {
        if(proto === null) return false
        if(proto === prototype) return true
        proto = proto.__proto__;
    }
}
```

## object.create

会将参数对象作为一个新创建的空对象的原型, 并返回这个空对象，且继承原对象

```js
function _create(obj){
    function C(){}
    C.prototype = obj;
    return new C();
}

var obj1 = {name: "Lilei"};
var lilei = _create(obj1);
lilei; // {}
lilei.name; // "Lilei"
```

## 深复制

```js
function deepClone(obj, hash = new WeakMap()) {
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Date) return new Date(obj);
    if (obj === null || typeof obj !== "object") return obj;
    if (hash.has(obj)) {
        return hash.get(obj);
    }
    //obj为Array，相当于new Array()
    //obj为Object，相当于new Object()
    let constr = new obj.constructor();
    hash.set(obj, constr);
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            constr[key] = deepClone(obj[key], hash);
        }
    }
    return constr;
}
var o1 = new Object();
var o2 = new Object();
o1.next = o2;
o2.next = o1;
var target = [
    0,
    null,
    undefined,
    NaN,
    [1, 2],
    { name: "a", obj: { a: 1 } },
    function a() {
    return 1;
    },
    new Date("2020-01-01"),
    new RegExp(/aaa/),
    o1,
];
```

序列化法(只能处理数组和对象，且对象不能成环)

```js
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
```

## 防抖节流

防抖:触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
```js
function debounce(fn, wait, immediate) {
    let timer = null;
    let one = immediate;
    return function (...args) {
    if (one) {
        one = false;
        fn(...args);
    } else {
        if (timer !== null) {
        clearTimeout(timer);
        }
        timer = setTimeout(() => {
        fn(...args);
        }, wait);
    }
    };
}
var handle = debounce(function (val) {
    console.log("搜索了" + val);
}, 1000,true)
window.onclick = function () {
    handle(Math.random())
}
```

节流:连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率。
```js
function throttle(fn, wait, isDate, ...args) {
    let previous = 0;
    let timer = null;

    return function () {
        if (isDate) {
            let now = new Date().getTime();
            if (now - previous > wait) {
                previous = now;
                fn(...args);
            }
        } else {
        if (timer === null) {
            timer = setTimeout(() => {
                timer = null;
                fn(...args);
            }, wait);
        }
        }
    };
}

function handle(...a) {
    console.log(a, Math.random());
}

window.addEventListener("click", throttle(handle, 1000, true, 1,2,3));
```

## 函数柯里化

Currying 是把接受多个参数的函数变换成接受一个单一参数的函数，并且返回接受余下的参数而且返回结果的新函数的技术。参数复用,延迟执行,固定易变因素

```js
// 支持多参数传递
const curry = (fn, ...args) =>
    args.length < fn.length
    ? (...arguments) => curry(fn, ...args, ...arguments)
    : fn(...args);

function sumFn(a, b, c) {
    return a + b + c;
}
var sum = curry(sumFn);
sum(1, 2, 3);
sum(1)(2, 3);
sum(1)(2)(3);
```

反柯里化：把原来已经固定的参数或者 this 上下文等当作参数延迟到未来传递

```js
function add() {
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = Array.prototype.slice.call(arguments);
    console.log(1, arguments, _args);
    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var _adder = function () {
    _args.push(...arguments);
    console.log(2, arguments, _args);
    return _adder;
    };

    // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
    _adder.toString = function () {
        console.log(3, _args);
        return _args.reduce(function (a, b) {
            console.log(4, _args, a, b);
            return a + b;
        });
    };
    console.log(5, _args);
    return _adder;
}

add(1)(2)(3) = 6;
add(1, 2, 3)(4) = 10;
add(1)(2)(3)(4)(5) = 15;
add(1, 2, 3)(4, 5)(6) = 21;
/*
1 Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ] (3) [1, 2, 3]
5 (3) [1, 2, 3]
2 Arguments(2) [4, 5, callee: ƒ, Symbol(Symbol.iterator): ƒ] (5) [1, 2, 3, 4, 5]
2 Arguments [6, callee: ƒ, Symbol(Symbol.iterator): ƒ] (6) [1, 2, 3, 4, 5, 6]
3 (6) [1, 2, 3, 4, 5, 6]
4 (6) [1, 2, 3, 4, 5, 6] 1 2
4 (6) [1, 2, 3, 4, 5, 6] 3 3
4 (6) [1, 2, 3, 4, 5, 6] 6 4
4 (6) [1, 2, 3, 4, 5, 6] 10 5
4 (6) [1, 2, 3, 4, 5, 6] 15 6
ƒ 21
*/
```

## 依赖注入

A 想调用 B 的某些方法，于是 A 里面就要 new 一个 B，后来 A 不用 B 了，想用 C，于是就需要改 A 的代码，new B 变为 new C，代码耦合性高。

因此，如果有一个容器能给到 A，A 就能用到 B、C、D...的方法，而且没经调用的方法，不实例化对象，同样 B 也能通过容器用到其它方法，于是就用到依赖注入与控制反转。

```js
//es6
class injector{
    constructor(){
        this.hadinstance = true;
        console.log('实例化injector,只有hadinstance:',this.hadinstance);
    }
    A(){
        console.log('实例化A');
        return new A();
    }
    B(){
        console.log('实例化B');
        return new B();
    }
}
class myClass1{
    constructor(injector){
        this.myInjector = injector;
    }
}
class A{
    constructor(){
        this.a = 'a';
        this.say=function(){
            alert('A');
        }
    }
}
class B{
    constructor(){
        this.b = 'b';
        this.say=function(){
            alert('B');
        }
    }
}
let test = new myClass1(new injector());//实例化injector,只有hadinstance: true
Object.getOwnPropertyNames(test);//["myContainer"]
Object.getOwnPropertyNames(injector.prototype);//(3) ["constructor", "A", "B"]
Object.getOwnPropertyNames(new injector());//["hadinstance"]
Object.getOwnPropertyNames(new A());//(2) ["a", "say"]
test.myInjector.A().say();//实例化A
test.myInjector.B().b;//实例化B
//es5
function injector(){
    this.hadinstance = true;
    console.log('实例化injector,只有hadinstance:',this.hadinstance);
}
injector.prototype.A = function(){
    console.log('实例化A');
    return new A();
};
injector.prototype.B = function(){
    console.log('实例化B');
    return new B();
};
function myClass1(injector){
    this.myInjector = injector;
}
function A(){
    this.a = 'a';
    this.say=function(){
        alert('A');
    }
}
function B(){
    this.b = 'b';
    this.say=function(){
        alert('B');
    }
}

let test = new myClass1(new injector());//实例化injector,只有hadinstance: true
Object.getOwnPropertyNames(test);//["myContainer"]
Object.getOwnPropertyNames(injector.prototype);//(3) ["constructor", "A", "B"]
Object.getOwnPropertyNames(new injector());//["hadinstance"]
Object.getOwnPropertyNames(new A());//(2) ["a", "say"]
test.myInjector.A().say();//实例化A
test.myInjector.B().b;//实例化B
```

## 寄生组合继承

```js
let Point = class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }

    //属性名
    [methodName]() {

    }

    //不可继承的静态方法
    static classMethod() {
        return 'hello';
    }

    get prop() {
        return 'getter';
    }
    set prop(value) {
        console.log('setter: '+value);
    }
}

let ColorPoint = class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y); // 调用父类的constructor(x, y),super后才能使用this
        this.color = color;
    }

    toString() {
        return this.color + ' ' + super.toString(); // 调用父类的toString()
    }
}

let colorPoint = new ColorPoint(1,2,'red');
console.log(colorPoint.toString());
```

```js
function createObject(o){
    function fn(){}
    fn.prototype = o;
    return new fn();
}
function Son(){
    Father.call(this)
}
Son.prototype = createObject(Father.prototype)
Son.prototype.constructor = Son;
var son = new Son('son');
console.log(son.sleep()) // son正在睡觉
console.log(son.look('TV')) // son正在看TV
```

## 工厂模式

把相同代码放到一个函数中，每次使用相同的功能或类，不需要重新编写代码
```js
function createPerson(name, age) {
    var obj = {};
    obj.name = name;
    obj.age = age;
    obj.say = function () {
        console.log('hello' + this.name);
    }
    return obj;
}
var p1 = createPerson('aaa' , 26);
p1.say();
```

## 单例模式

避免实例化多个对象
```js
class People {
    constructor(name) {
        if (typeof People.instance === 'object') {
            return People.instance;
        }
        People.instance = this;
        this.name = name;
        return this;
    }
}
var a = new People('a');//People {name: "a"}
var b = new People('b');//People {name: "a"}
console.log(a===b);//true
//es5
function People(name) {
    this.name = name;
}

People.getInstance = function(name) {
    if (!this.instance) {
        this.instance = new People(name);
    }
    return this.instance;
}

var a = People.getInstance('a');//People{name: "a"}
var b = People.getInstance('b');//People{name: "a"}
console.log(a===b);//true

function Animal(name) {
    this.name = name
}

const AnimalSingle = (function () {
    let animalSingle = null

    return function (name) {
        if(animalSingle){
            return animalSingle
        }
        return animalSingle = new Animal(name)
    }
})();

const animal1 = new AnimalSingle('dog')
const animal2 = new AnimalSingle('cat')

console.log(animal1.name); // dog
console.log(animal2.name); // dog
```

## 发布订阅观察者

- 观察者模式

    观察者注入被观察目标，被观察目标数据变化，通知观察者更新

- 发布、订阅模式

    订阅者订阅(注入)调度中心，发布者发布事件到调度中心，调度中心调用订阅者方法

当一个对象的状态发生变化时，能够自动通知其他关联对象，自动刷新对象状态
```js
class PubSub {
    constructor() {
        this.handles = {};
    }

    // 订阅事件
    on(eventType, handle) {
        if (!this.handles.hasOwnProperty(eventType)) {
            this.handles[eventType] = [];
        }
        if (typeof handle == 'function') {
            this.handles[eventType].push(handle);
        }
        else {
            throw new Error('缺少回调函数');
        }
        return this;
    }

    // 发布事件
    emit(eventType, ...args) {
        if (this.handles.hasOwnProperty(eventType)) {
            this.handles[eventType].forEach((item, key, arr) => {
                item.apply(null, args);
            })
        }
        else {
            throw new Error(`"${eventType}"事件未注册`);
        }
        return this;
    }

    // 删除事件
    off(eventType, handle) {
        if (!this.handles.hasOwnProperty(eventType)) {
            throw new Error(`"${eventType}"事件未注册`);
        }
        else if (typeof handle != 'function') {
            throw new Error('缺少回调函数');
        }
        else {
            this.handles[eventType].forEach((item, key, arr) => {
                if (item == handle) {
                    arr.splice(key, 1);
                }
            })
        }
        return this; // 实现链式操作
    }
}

let callback = function () {
    console.log('you are so nice');
}

let pubsub = new PubSub();
pubsub.on('completed', (...args) => {
    console.log(args.join(' '));
}).on('completed', callback);

pubsub.emit('completed', '1', '2', '3');
pubsub.off('completed', callback);
pubsub.emit('completed', '4', '5');
```

```js
const EventEmit = function() {
    this.events = {};
    this.on = function(name, cb) {
        if (this.events[name]) {
            this.events[name].push(cb);
        } else {
            this.events[name] = [cb];
        }
    };
    this.trigger = function(name, ...arg) {
        if (this.events[name]) {
            this.events[name].forEach(eventListener => {
                eventListener(...arg);
            });
        }
    };
};
//业务
let event = new EventEmit();
event.trigger('success');
MessageCenter.fetch() {
    event.on('success', () => {
        console.log('更新消息中心');
    });
}
Order.update() {
    event.on('success', () => {
        console.log('更新订单信息');
    });
}
Checker.alert() {
    event.on('success', () => {
        console.log('通知管理员');
    });
}
```

## Promise

Promise A+规范

```js
class Promise {
    constructor(executor) {
    this.status = "pending"; // 初始化状态
    this.value = undefined; // 初始化成功返回的值
    this.reason = undefined; // 初始化失败返回的原因

    // 解决处理异步的resolve
    this.onResolvedCallbacks = []; // 存放所有成功的resolve
    this.onRejectedCallbacks = []; // 存放所有失败的reject

    /**
    * @param {*} value 成功返回值
    * 定义resolve方法
    * 注意：状态只能从pending->fulfilled和pending->rejected两个
    */
    const resolve = (value) => {
        if (this.status === "pending") {
            this.status = "fulfilled"; // 成功时将状态转换为成功态fulfilled
            this.value = value; // 将成功返回的值赋值给promise
            // 为了解决异步resolve以及返回多层promise
            this.onResolvedCallbacks.forEach((fn) => {
                fn(); // 当状态变为成功态依次执行所有的resolve函数
            });
        }
    };
    const reject = (reason) => {
        if (this.status === "pending") {
            this.status = "rejected"; // 失败时将状态转换为成功态失败态rejected
            this.reason = reason; // 将失败返回的原因赋值给promise
            this.onRejectedCallbacks.forEach((fn) => {
                fn(); // 当状态变为失败态依次执行所有的reject函数
            });
        }
    };
    executor(resolve, reject); // 执行promise传的回调函数
    }
    /**
    * 定义promise的then方法
    * @param {*} onFulfilled 成功的回调
    * @param {*} onRejected 失败的回调
    */
    then(onFulfilled, onRejected) {
    // 为了解决then方法返回Promise的情况
    const promise2 = new Promise((resolve, reject) => {
        if (this.status === "fulfilled") {
            // 如果状态为fulfilled时则将值传给这个成功的回调
            setTimeout(() => {
                const x = onFulfilled(this.value); // x的值有可能为 promise || 123 || '123'...
                // 注意：此时调用promise2时还没有返回值，要用setTimeout模拟进入第二次事件循环；先有鸡先有蛋
                resolvePromise(promise2, x, resolve, reject);
            }, 0);
        }
        if (this.status === "rejected") {
            setTimeout(() => {
                const x = onRejected(this.reason); // 如果状态为rejected时则将视频的原因传给失败的回调
                resolvePromise(promise2, x, resolve, reject);
            }, 0);
        }
        if (this.status === "pending") {
            // 记录-》解决异步
            this.onResolvedCallbacks.push(() => {
                setTimeout(() => {
                const x = onFulfilled(this.value);
                resolvePromise(promise2, x, resolve, reject);
                }, 0);
            });
            this.onRejectedCallbacks.push(() => {
                setTimeout(() => {
                const x = onRejected(this.reason);
                resolvePromise(promise2, x, resolve, reject);
                }, 0);
            });
        }
    });
    return promise2; // 解决多次链式调用的问题
    }
}

const resolvePromise = (promise2, x, resolve, reject) => {
    // console.log(promise2, x, resolve, reject)
    if (promise2 === x) {
    // 如果返回的值与then方法返回的值相同时
    throw TypeError("循环引用");
    }
    // 判断x是不是promise;注意：null的typeof也是object要排除
    if (typeof x === "function" || (typeof x === "object" && x !== null)) {
        try {
            const then = x.then; // 获取返回值x上的then方法；注意方法会报错要捕获异常；原因111
            if (typeof then === "function") {
                // 就认为是promise
                then.call(
                    x,
                    (y) => {
                    // resolve(y)
                    // 递归解析 ; 有可能返回多个嵌套的promise
                    resolvePromise(promise2, y, resolve, reject);
                    },
                    (r) => {
                    reject(r);
                    }
                );
            }
        } catch (e) {
            reject(e);
        }
    } else {
        resolve(x);
    }
};
module.exports = Promise;
```

## promise.all

promise.all

- 功能

    - Promise.all(iterable) 返回新 Promise
    - iterable 中存在参数不为 promise，视此参数 resolve
    - 所有 promise 都 resolve，返回 resolve
    - 存在 promise reject，返回第一个 reject

- 特点

    - 如果传入的参数为空的可迭代对象， Promise.all 会 同步 返回一个已完成状态的 promise
    - 如果传入的参数中不包含任何 promise, Promise.all 会 异步 返回一个已完成状态的 promise
    - 其它情况下， Promise.all 返回一个 处理中（pending） 状态的 promise

- 状态

    - 如果传入的参数中的 promise 都变成完成状态， Promise.all 返回的 promise 异步变为完成
    - 如果传入的参数中，有一个 promise 失败， Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成
    - 在任何情况下， Promise.all 返回的 promise 的完成状态的结果都是一个数组

- 实现

```js
Promise.all = function (promises) {
    //省略参数合法性检查
    return new Promise((resolve, reject) => {
        promises = Array.from(promises);
        if (promises.length === 0) {
            resolve([]);
        } else {
            let result = [];
            let index = 0;
            for (let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(
                    (data) => {
                        result[i] = data;
                        if (++index === promises.length) {
                            resolve(result);
                        }
                    },
                    (err) => {
                        reject(err);
                        return;
                    }
                );
            }
        }
    });
};
var p = Promise.all([1, 2, 3]);
// Promise {<resolved>: Array(3)}
// __proto__: Promise
// [[PromiseStatus]]: "resolved"
// [[PromiseValue]]: Array(3)
// 0: 1
// 1: 2
// 2: 3
// length: 3
// __proto__: Array(0)
var p2 = Promise.all([1, 2, 3, Promise.resolve(444)]);
// Promise {<resolved>: Array(4)}
// __proto__: Promise
// [[PromiseStatus]]: "resolved"
// [[PromiseValue]]: Array(4)
var p3 = Promise.all([1, 2, 3, Promise.reject(555)]);
// Promise {<rejected>: 555}
// __proto__: Promise
// [[PromiseStatus]]: "rejected"
// [[PromiseValue]]: 555
```

## promise.race

- 功能

Promise.race 返回的仍然是一个 Promise，它的状态与第一个完成的 Promise 的状态相同；如果传入的参数是不可迭代的，那么将会抛出错误。

- 实现

```js
Promise.ra_ce = function (promises) {
    promises = Array.from(promises);
    return new Promise((resolve, reject) => {
        if (promises.length === 0) {
            return;
        } else {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(
                (data) => {
                    resolve(data);
                    return;
                },
                (err) => {
                    reject(err);
                    return;
                }
            );
        }
        }
    });
};
```

## promise.finally

- 功能

不管成功还是失败，都会走到 finally 中,并且 finally 之后，还可以继续 then。并且会将值原封不动的传递给后面的 then。

- 实现

```js
Promise.prototype.finally = function (callback) {
    return this.then(
        (value) => {
            return Promise.resolve(callback()).then(() => {
                return value;
            });
        },
        (err) => {
            return Promise.resolve(callback()).then(() => {
                throw err;
            });
        }
    );
};
```

## promise.allSettled

- 功能

返回一个promise，该promise在所有给定的promise已被解析或被拒绝后解析，并且每个对象都描述每个promise的结果。

- 实现

```js
Promise.allSettled = function(promises) {
    let count = 0
    let result = []
    return new Promise((resolve, reject) => {
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(res => {
                result[index] = {
                    value: res,
                    reason: null,
                }
            }, err => {
                result[index] = {
                    value: null,
                    reason: err,
                }
            }).finally(() => {
                count++
                if (count === promises.length) {
                    resolve(result)
                }
            })
        })
    })
}
```

## 失败重试maxRequest次再reject

```js
function maxRequest(fn, maxNum) {
    return new Promise((resolve, reject) => {
        if (maxNum === 0) {
            reject('max request number')
            return
        }
        Promise.resolve(fn()).then(value => {
            resolve(value)
        }).catch(() => {
            return maxRequest(fn, maxNum - 1)
        })
    })
}
```

## 链式调用

方法链，当方法的返回值是一个对象，这个对象就可以继续调用它的方法。一般当函数不需要返回值时，直接 return this，余下的方法就可以基于此继续调用。

```js
var obj = {};
obj.a = function () {
    console.log("a");
    return this;
};
obj.b = function () {
    console.log("b");
    return this;
};
obj.c = function () {
    console.log("c");
    console.log(this);
    return this;
};
obj.a().b().c();
```

## 原生发送请求的几种方式

* xhr

```js
sendXHR(url,data,async){
    var params = new URLSearchParams();
    for(let key in data){
        params.set(key,JSON.stringify(data[key]));
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, async);// 第三个参数false表示同步发送
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // 上传完成后的回调函数
    xhr.onreadystatechange = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
        } else {
            console.log("上传出错");
        }
    };
    // 获取上传进度
    xhr.upload.onprogress = function (event) {
        console.log(event.loaded);
        console.log(event.total);
        if (event.lengthComputable) {
            var percent = Math.floor((event.loaded / event.total) * 100);
            document.querySelector("#progress .progress-item").style.width =
                percent + "%";
            // 设置进度显示
            console.log(percent);
        }
    };
    xhr.send(params);
    xhr.onload = (response) => {
        console.log(response);
    }
    xhr.onerror = (error) => {
        console.log(error);
    }
}
```

* navigator.sendBeacon

```js
navigator.sendBeacon(url, blob/jsonString);
```

* fetch

```js
fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
    'user-agent': 'Mozilla/4.0 MDN Example',
    'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
})
.then(response => response.json()) // parses response to JSON
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', response));
```

## 实现ajax

```js
function ajax(url, data, method='POST', async=true) {
    return new Promise((resolve, reject) {
        // 第一步，创建xmlHttpRequest
        let xhr = new XMLHttpRequest()

        // 第二步，设置请求方式
        xhr.open(method, url, async)
        //设置需要返回的数据类型
        xhr.responseType = 'text';//json,blob,arrayBuffer

        // 第三步， 调用回调函数
        xhr.onreadyStateChange = function() {
            //0初始化
            //1请求已提出
            //2请求已发送
            //3请求处理中
            //4请求已完成
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {//服务器状态码
                    resolve(xhr.responseText)//响应文本
                    //responseXML响应XML/DOM
                    //responseBody响应主题
                    //responseStream响应数据流
                } else {
                    reject(xhr.statusText)//状态码对应文本
                }
            } else {
                reject(xhr.statusText)
            }
        }

        // 第四步， 发送请求
        xhr.send(data)
        //abort()停止当前请求
        //getAllResponseHeaders()所有响应请求头以键值形式返回
        //getResponseHeader("header")返回指定头部值
        //setRequestHeader("header","value")设置请求头一起发送
    })
}
```

```js
function ajax({ url, methods, body, headers }) {
    return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open(url, methods);
    for (let key in headers) {
        let value = headers[key];
        request.setRequestHeader(key, value);
    }
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
        if (request.status >= "200" && request.status < 300) {
            resolve(request.responeText);
        } else {
            reject(request);
        }
        }
    };
    request.send(body);
    });
}
```

## 发送跨域请求

- ajax 版

```js
$.ajax({
    type: "get",
    async: false,
    url: "...",
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "jsonhandle", //回调函数(参数值)
    success: function (data) {},
});
```

- promise 版

```js
function p(url){
    let json;
    let script = '<script id="jsonp" src="'+url+?callback=fn+'"></script>';
    window.fn = function(data){
        json = data;
    }
    //当script被插入文档中时，src中的资源就会开始加载
    $(body).append(script);

    return new Promise((resolve,reject)=>{
        $("#jsonp").on("load",function(e){
            resolve(json);
        })
        $("#jsonp").on("error",function(e){
            reject(json);
        })
    });
}
p('http://localhost:8082').then(data=>{
    console.log(data);
    throw('err before then');
}).catch(err => {
    //可以捕捉到then里的err befor then也可以捕捉到new Promise里的err in promise。
    console.log(err)
});
```

## 继发和并发

```js
//继发关系比较耗时
async function dbFuc(db) {
    let foo = await getFoo();
    let bar = await getBar();
}
//应该采用并发
async function dbFuc(db) {
    // 写法一
    let [foo, bar] = await Promise.all([getFoo(), getBar()]);
    // 写法二
    let fooPromise = getFoo();
    let barPromise = getBar();
    let foo = await fooPromise;
    let bar = await barPromise;
}
//完整样例
let func1 = () => {
    return new Promise((res, rej) => {
    setTimeout(() => {
        res(1);
    }, 3000);
    });
};
let func2 = () => {
    return new Promise((res, rej) => {
    setTimeout(() => {
        res(2);
    }, 2000);
    });
};
let func3 = () => {
    return new Promise((res, rej) => {
    setTimeout(() => {
        res(3);
    }, 1000);
    });
};
let post = async () => {
    let f1Promise = func1();
    let f2Promise = func2();
    let f3Promise = func3();
    let f1 = await f1Promise;
    console.log(f1);
    let f2 = await f2Promise;
    console.log(f2);
    let f3 = await f3Promise;
    console.log(f3);
    return [f1, f2, f3];
};
window.onload = () => {
    post().then((data) => {
    console.log(data);
    });
};
```

带缓冲区的继发请求

```js
let getResult = (time = 1000) => {
    return new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(time);
    }, time);
    });
};
let problem2 = (bufferCount, totalCount) => {
    let myTotalCount = totalCount;
    let myBufferCount = bufferCount;
    let result = [];

    //async await 带缓冲区继发请求，套娃无法错误重发
    let next = async () => {
        myBufferCount--;
        myTotalCount--;
        let response = await getResult(parseInt(Math.random() * 1000));
        result.push(response);
        myBufferCount++;
        console.log("next1", myBufferCount, myTotalCount, result);
        if (myTotalCount > 0) {
            next();
        }
    };
    let perform = async () => {
        myBufferCount--;
        myTotalCount--;
        console.log("perform1", myBufferCount, myTotalCount, result);
        let response = await getResult(parseInt(Math.random() * 1000));
        result.push(response);
        myBufferCount++;
        console.log("perform2", myBufferCount, myTotalCount, result);
        if (myTotalCount > 0) {
            next();
        }
    };
    for (let i = 0; i < bufferCount; i++) {
        perform();
    }

    //promise 带缓冲区继发请求，套娃无法错误重发
    let cb = () => {
        console.log("call cb");
        myBufferCount--;
        myTotalCount--;
        getResult(parseInt(Math.random() * 1000)).then((data) => {
            result.push(data);
            myBufferCount++;
            console.log("cb1", myBufferCount, myTotalCount, result);
            if (myTotalCount > 0) {
                cb();
            }
        });
    };
    let post = () => {
        myBufferCount--;
        myTotalCount--;
        console.log("post1", myBufferCount, myTotalCount, result);
        getResult(parseInt(Math.random() * 1000)).then((data) => {
            result.push(data);
            myBufferCount++;
            console.log("post2", myBufferCount, myTotalCount, result);
            if (myTotalCount > 0) {
                cb();
            }
        });
    };
    for (let i = 0; i < bufferCount; i++) {
        post();
    }

    //setInterval 带缓冲区继发请求，可错误重发，但速度没上面2种快
    let timer = setInterval(() => {
    if (myTotalCount <= 0) {
        clearInterval(timer);
    }
    if (myBufferCount > 0 && myTotalCount > 0) {
        let response = getResult(parseInt(Math.random() * 1000));
        myBufferCount--;
        myTotalCount--;
        response.then((data) => {
        myBufferCount++;
        result.push(data);
        console.log(
            2,
            myBufferCount,
            myTotalCount,
            result,
            result.length
        );
        });
    }
    console.log(1, myBufferCount, myTotalCount, result, result.length);
    }, 500);
};
problem2(3, 10);
```

多个异步操作，可 await Promise.all

```js
async function dbFuc(db) {
    let docs = [{}, {}, {}];
    let promises = docs.map((doc) => db.post(doc));

    let results = await Promise.all(promises);
    console.log(results);
}

async function dbFuc(db) {
    let docs = [{}, {}, {}];
    let promises = docs.map((doc) => db.post(doc));

    let results = [];
    for (let promise of promises) {
        results.push(await promise);
    }
    console.log(results);
}
```

## async函数实现

```js
async function fn(args) {
    // ...
}

// 等同于
function fn(args) {
  return spawn(function* () {
    // ...
  });
}
function spawn(genF) {
  //genF为*
  return new Promise(function (resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch (e) {
        return reject(e);
      }
      if (next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(
        function (v) {
          step(function () {
            return gen.next(v);
          });
        },
        function (e) {
          step(function () {
            return gen.throw(e);
          });
        }
      );
    }
    step(function () {
      return gen.next(undefined);
    });
  });
}
```

## 统计词频

```js
let words = [
  "plpaboutit",
  "jnoqzdute",
  "sfvkdqf",
  "mjc",
  "nkpllqzjzp",
  "foqqenbey",
  "ssnanizsav",
  "nkpllqzjzp",
  "sfvkdqf",
  "isnjmy",
  "pnqsz",
  "hhqpvvt",
  "fvvdtpnzx",
  "jkqonvenhx",
  "cyxwlef",
  "hhqpvvt",
  "fvvdtpnzx",
  "plpaboutit",
  "sfvkdqf",
  "mjc",
  "fvvdtpnzx",
  "bwumsj",
  "foqqenbey",
  "isnjmy",
  "nkpllqzjzp",
  "hhqpvvt",
  "foqqenbey",
  "fvvdtpnzx",
  "bwumsj",
  "hhqpvvt",
  "fvvdtpnzx",
  "jkqonvenhx",
  "jnoqzdute",
  "foqqenbey",
  "jnoqzdute",
  "foqqenbey",
  "hhqpvvt",
  "ssnanizsav",
  "mjc",
  "foqqenbey",
  "bwumsj",
  "ssnanizsav",
  "fvvdtpnzx",
  "nkpllqzjzp",
  "jkqonvenhx",
  "hhqpvvt",
  "mjc",
  "isnjmy",
  "bwumsj",
  "pnqsz",
  "hhqpvvt",
  "nkpllqzjzp",
  "jnoqzdute",
  "pnqsz",
  "nkpllqzjzp",
  "jnoqzdute",
  "foqqenbey",
  "nkpllqzjzp",
  "hhqpvvt",
  "fvvdtpnzx",
  "plpaboutit",
  "jnoqzdute",
  "sfvkdqf",
  "fvvdtpnzx",
  "jkqonvenhx",
  "jnoqzdute",
  "nkpllqzjzp",
  "jnoqzdute",
  "fvvdtpnzx",
  "jkqonvenhx",
  "hhqpvvt",
  "isnjmy",
  "jkqonvenhx",
  "ssnanizsav",
  "jnoqzdute",
  "jkqonvenhx",
  "fvvdtpnzx",
  "hhqpvvt",
  "bwumsj",
  "nkpllqzjzp",
  "bwumsj",
  "jkqonvenhx",
  "jnoqzdute",
  "pnqsz",
  "foqqenbey",
  "sfvkdqf",
  "sfvkdqf",
];
let dictionary = new Array();
for (let i = 0; i < words.length; i++) {
  if (!dictionary[words[i]]) {
    dictionary[words[i]] = 1;
  } else {
    dictionary[words[i]]++;
  }
}
let result = Object.keys(dictionary).sort((a, b) => {
  if (dictionary[a] == dictionary[b]) {
    if (a > b) {
      return 1;
    } else {
      return -1;
    }
  }
  return dictionary[b] - dictionary[a];
});
for (let value of result) {
  console.log(value, dictionary[value]);
}
```

## 双向数据绑定

```js
<input id="input" />;
const data = {};
const input = document.getElementById("input");
Object.defineProperty(data, "text", {
    set(value) {
    input.value = value;
    this.value = value;
    },
});
input.onchange = function (e) {
    data.text = e.target.value;
};
```

## 数据格式处理

- 嵌套数组扁平化

es6 flat(扁平层数)

```js
var testArr = [10, 2, [3, 4, [5, [55]]]];
testArr.flat(Infinity);
```

toString

```js
var testArr = [10, 2, [3, 4, [5, [55]]]]
[...testArr.toString().split(',')]
```

join/split/map

```js
var testArr = [10, 2, [3, 4, [5, [55]]]];
testArr.toString().split(",").map(Number);
testArr.join().split(",").map(Number);
```

包含非数字类型

```js
const flattern = (arr) => {
const result = [];
arr.forEach((item) => {
    if (Array.isArray(item)) {
    result.push(...flattern(item));
    } else {
    result.push(item);
    }
});
return result;
};
```

- 嵌套对象的扁平化和反扁平化

扁平化输入

```js
var obj = {
a: {
    b: {
    c: {
        d: 1,
    },
    },
},
aa: 2,
c: [1, 2],
};
```

输出

```js
{ 'a.b.c.d': 1, 'aa': 2, 'c[0]': 1, 'c[1]': 2 }
```

扁平化 1

```js
let str = "";
let o = {};
function objFlatten(obj) {
Object.keys(obj).map((item) => {
    if (Object.prototype.toString.call(obj[item]) === "[object Object]") {
    //如果是对象，记录"item1.item2.",不断递归
    str += item + ".";
    objFlatten(obj[item]);
    } else if (
    Object.prototype.toString.call(obj[item]) === "[object Array]"
    ) {
    //如果是数组，向对象循环添加属性，o.c[0]，o.c[1]
    obj[item].forEach((ele, index) => (o[item + `[${index}]`] = ele));
    } else {
    //如果是基础类型,加入最后的item变为"item1.item2.item3",向o添加str记录的属性并赋值，清空str
    str += item;
    o[str] = obj[item];
    str = "";
    }
});
}
```

扁平化 2

```js
Object.flatten = function (obj) {
var result = {};

function recurse(src, prop) {
    var toString = Object.prototype.toString;
    if (toString.call(src) == "[object Object]") {
    var isEmpty = true;
    for (var p in src) {
        isEmpty = false;
        recurse(src[p], prop ? prop + "." + p : p);
    }
    if (isEmpty && prop) {
        result[prop] = {};
    }
    } else if (toString.call(src) == "[object Array]") {
    var len = src.length;
    if (len > 0) {
        src.forEach(function (item, index) {
        recurse(item, prop ? prop + ".[" + index + "]" : index);
        });
    } else {
        result[prop] = [];
    }
    } else {
    result[prop] = src;
    }
}
recurse(obj, "");

return result;
};
```

反扁平化 1

```js
Object.unflatten = function (data) {
if (Object(data) !== data || Array.isArray(data)) return data;
var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
    resultholder = {};
for (var p in data) {
    var cur = resultholder,
    prop = "",
    m;
    while ((m = regex.exec(p))) {
    cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
    prop = m[2] || m[1];
    }
    cur[prop] = data[p];
}
return resultholder[""] || resultholder;
};
```

反扁平化 2

```js
Object.unflatten2 = function (data) {
if (Object(data) !== data || Array.isArray(data)) return data;
var result = {},
    cur,
    prop,
    idx,
    last,
    temp;
for (var p in data) {
    (cur = result), (prop = ""), (last = 0);
    do {
    idx = p.indexOf(".", last);
    temp = p.substring(last, idx !== -1 ? idx : undefined);
    cur = cur[prop] || (cur[prop] = !isNaN(parseInt(temp)) ? [] : {});
    prop = temp;
    last = idx + 1;
    } while (idx >= 0);
    cur[prop] = data[p];
}
return result[""];
};
```

- 数组去重

set

```js
var testArr = [1,2,2,3,4,4]
[... new Set(testArr)]
```

处理对象

```js
let arr1 = [
{ id: 1, name: "汤小梦" },
{ id: 2, name: "石小明" },
{ id: 3, name: "前端开发" },
{ id: 1, name: "web前端" },
];
const unique = (arr, key) => {
return [...new Map(arr.map((item) => [item[key], item])).values()];
};
console.log(unique(arr1, "id"));
```

- 合并数组

es5

```js
let arr5 = arr3.concat(arr4);
```

es6

```js
let arr6 = [...arr3, ...arr4];
```

- 是否为数组

instanceof

```js
console.log(arr instanceof Array);
```

constructor

```js
console.log(arr.constructor === Array);
```

是否数组的方法

```js
console.log(!!arr.push && !!arr.concat);
```

toString

```js
console.log(Object.prototype.toString.call(arr) === "[object Array]");
```

isArray

```js
console.log(Array.isArray(arr));
```

- 交换两个数

```js
a = a + b;
b = a - b;
a = a - b;
//或
a = a ^ b;
b = a ^ b;
a = a ^ b;
```

- 快速浮点数转整数

```js
console.log(23.9 | 0); // Result: 23
console.log(-23.9 | 0); // Result: -23
```

- 删除最后一个数字

```js
let str = "1553";
Number(str.substring(0, str.length - 1));

console.log((1553 / 10) | 0); // Result: 155
console.log((1553 / 100) | 0); // Result: 15
console.log((1553 / 1000) | 0); // Result: 1
```

- 去除数组中的空值,假值

```js
var u = [undefined, undefined, 1, "", "false", false, true, null, "null"];
u.filter((d) => d);
```

- Set 实现并集（Union）、交集（Intersect）和差集（Difference）

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter((x) => b.has(x))); //ES6
var intersect = new Set(
[...a].filter(function (x) {
    return b.has(x);
})
);
// set {2, 3}

// 差集
let difference = new Set([...a].filter((x) => !b.has(x)));
// Set {1}
```

- 对象数组去重

```js
let arr = [
{ a: 1, b: 2 },
{ b: 2, a: 1 },
{ a: 2, b: 2 },
{ a: "1", b: "2" },
];
let sortObjectByKeys = (obj) => {
let keys = Object.keys(obj).sort();
let newObj = {};
keys.forEach((value, index, array) => {
    newObj[value] = obj[value];
});
return newObj;
};
let uniqueObjectArray = (arr) => {
let set = new Set();
arr.forEach((value, index, array) => {
    let newValue = sortObjectByKeys(value);
    set.add(JSON.stringify(newValue));
});
let newArr = [...set];
newArr.forEach((value, index, array) => {
    newArr[index] = JSON.parse(value);
});
return newArr;
};
console.log(uniqueObjectArray(arr));
```

- 平滑滚动到页面顶部

```js
function scrollToTop() {
var c = document.documentElement.scrollTop || document.body.scrollTop;

if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
}
}
```

- 日期格式转换

```js
Date.prototype.format = function (formatStr) {
var str = formatStr;
var Week = ["日", "一", "二", "三", "四", "五", "六"];
str = str.replace(/yyyy|YYYY/, this.getFullYear());
str = str.replace(
    /yy|YY/,
    this.getYear() % 100 > 9
    ? (this.getYear() % 100).toString()
    : "0" + (this.getYear() % 100)
);
str = str.replace(
    /MM/,
    this.getMonth() + 1 > 9
    ? (this.getMonth() + 1).toString()
    : "0" + (this.getMonth() + 1)
);
str = str.replace(/M/g, this.getMonth() + 1);
str = str.replace(/w|W/g, Week[this.getDay()]);
str = str.replace(
    /dd|DD/,
    this.getDate() > 9 ? this.getDate().toString() : "0" + this.getDate()
);
str = str.replace(/d|D/g, this.getDate());
str = str.replace(
    /hh|HH/,
    this.getHours() > 9
    ? this.getHours().toString()
    : "0" + this.getHours()
);
str = str.replace(/h|H/g, this.getHours());
str = str.replace(
    /mm/,
    this.getMinutes() > 9
    ? this.getMinutes().toString()
    : "0" + this.getMinutes()
);
str = str.replace(/m/g, this.getMinutes());
str = str.replace(
    /ss|SS/,
    this.getSeconds() > 9
    ? this.getSeconds().toString()
    : "0" + this.getSeconds()
);
str = str.replace(/s|S/g, this.getSeconds());
return str;
};

// 或
Date.prototype.format = function (format) {
var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //day
    "h+": this.getHours(), //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds(), //millisecond
};
if (/(y+)/.test(format))
    format = format.replace(
    RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
for (var k in o) {
    if (new RegExp("(" + k + ")").test(format))
    format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1
        ? o[k]
        : ("00" + o[k]).substr(("" + o[k]).length)
    );
}
return format;
};

alert(new Date().format("yyyy-MM-dd hh:mm:ss"));
```

- 返回日期数列里与目标数列最近的日期下标

```js
const getNearestDateIndex = (targetDate, dates) => {
    if (!targetDate || !dates) {
        throw new Error('Argument(s) is illegal !')
    }
    if (!dates.length) {
        return -1
    }
    const distances = dates.map(date => Math.abs(date - targetDate))
    return distances.indexOf(Math.min(...distances))
}

// e.g.
const targetDate = new Date(2019, 7, 20)
const dates = [
new Date(2018, 0, 1),
new Date(2019, 0, 1),
new Date(2020, 0, 1),
]
getNearestDateIndex(targetDate, dates) // 2
```

- 返回日期数列里最小的日期

```js
const getMinDate = dates => {
    if (!dates) {
        throw new Error('Argument(s) is illegal !')
    }
    if (!dates.length) {
        return dates
}
    return new Date(Math.min.apply(null, dates)).toISOString()
}

// e.g.
const dates = [
new Date(2018, 3, 10),
new Date(2019, 3, 10),
new Date(2020, 3, 10),
]
getMinDate(dates) // 2018-04-09T16:00:00.000Z
```

- 打乱数组

```js
const arrayShuffle = array => {
    if (!Array.isArray(array)) {
        throw new Error('Argument must be an array')
}
    let end = array.length
    if (!end) {
        return array
    }
    while (end) {
        let start = Math.floor(Math.random() * end--);
        [array[start], array[end]] = [array[end], array[start]]
    }
    return array
}

// e.g.
arrayShuffle([1, 2, 3])
```

- 判断是否支持webp图片格式

```js
const canUseWebp = () => (document.createElement('canvas').toDataURL('image/webp', 0.5).indexOf('data:image/webp') === 0)

// e.g.
canUseWebp() // 新版的chrome里为true，火狐里为false
```

- 连字符与驼峰互转

```js
const toCamelCase = (str = '', separator = '-') => {
    if (typeof str !== 'string') {
        throw new Error('Argument must be a string')
    }
    if (str === '') {
        return str
    }
    const newExp = new RegExp('\\-\(\\w\)', 'g')
    return str.replace(newExp, (matched, $1) => {
        return $1.toUpperCase()
    })
}

// e.g.
toCamelCase('hello-world') // helloWorld

const fromCamelCase = (str = '', separator = '-') => {
    if (typeof str !== 'string') {
        throw new Error('Argument must be a string')
    }
    if (str === '') {
        return str
    }
    return str.replace(/([A-Z])/g, `${separator}$1`).toLowerCase()
}

// e.g.
fromCamelCase('helloWorld') // hello-world
```

- 等级判断

```js
const getLevel = (value = 0, ratio = 50, levels = '一二三四五') => {
    if (typeof value !== 'number') {
        throw new Error('Argument must be a number')
    }
    const levelHash = '一二三四五'.split('')
const max = levelHash[levelHash.length - 1]
return levelHash[Math.floor(value / ratio)] || max
}

// e.g.
getLevel(0) // 一
getLevel(40) // 一
getLevel(77) // 二
```

- 判断dom是否相等

```js
const isEqualNode = (dom1, dom2) => dom1.isEqualNode(dom2)
```

- 文件尺寸格式化

```js
const formatSize = size => {
    if (typeof +size !== 'number') {
        throw new Error('Argument(s) is illegal !')
    }
    const unitsHash = 'B,KB,MB,GB'.split(',')
    let index = 0
    while (size > 1024 && index < unitsHash.length) {
        size /= 1024
        index++
    }
    return Math.round(size * 100) / 100 + unitsHash[index]
}
formatSize('10240') // 10KB
formatSize('10240000') // 9.77MB
```

- 复杂类型数组去重

1. 如传入的数组元素为 [123, "meili", "123", "mogu", 123] ，则输出： [123, "meili", "123", "mogu"]
2. 如传入的数组元素为 [123, [1, 2, 3], [1, "2", 3], [1, 2, 3], "meili"] ，则输出： [123, [1, 2, 3], [1, "2", 3], "meili"]
3. 如传入的数组元素为 [123, {a: 1}, {a: {b: 1}}, {a: "1"}, {a: {b: 1}}, "meili"] ，则输出： [123, {a: 1}, {a: {b: 1}}, {a: "1"}, "meili"]
4. 如传入的数组元素为 [{a:1, b:2}, {b:2, a:1}] ，则输出： [{a: 1, b: 2}]

* 解决思路：

一个数组（包含对象等类型元素）去重函数，需要在基础类型判断相等条件下满足以下条件：

如果元素是数组类型，则需要数组中的每一项相等
如果元素是对象类型，则需要对象中的每个键值对相等
去重本身就是遍历数组，然后比较数组中的每一项是否相等而已，所以关键步骤有两步：比较、去重

* 比较：

首先判断类型是否一致，类型不一致则返回认为两个数组元素是不同的，否则继续
如果是数组类型，则递归比较数组中的每个元素是否相等
如果是对象类型，则递归比较对象中的每个键值对是否相等
否则，直接 === 比较

* 去重：

采用 reduce 去重，初始 accumulator 为 []
采用 findIndex 找到 accumulator 是否包含相同元素，如果不包含则加入，否则不加入
返回最终的 accumulator ，则为去重后的数组

```js
// 获取类型
const getType = (function() {
    const class2type = { '[object Boolean]': 'boolean', '[object Number]': 'number', '[object String]': 'string', '[object Function]': 'function', '[object Array]': 'array', '[object Date]': 'date', '[object RegExp]': 'regexp', '[object Object]': 'object', '[object Error]': 'error', '[object Symbol]': 'symbol' }

    return function getType(obj) {
        if (obj == null) {
            return obj + ''
        }
        // javascript高级程序设计中提供了一种方法,可以通用的来判断原始数据类型和引用数据类型
        const str = Object.prototype.toString.call(obj)
        return typeof obj === 'object' || typeof obj === 'function' ? class2type[str] || 'object' : typeof obj
    };
})();

/**
* 判断两个元素是否相等
* @param {any} o1 比较元素
* @param {any} o2 其他元素
* @returns {Boolean} 是否相等
*/
const isEqual = (o1, o2) => {
    const t1 = getType(o1)
    const t2 = getType(o2)

    // 比较类型是否一致
    if (t1 !== t2) return false
    
    // 类型一致
    if (t1 === 'array') {
        // 首先判断数组包含元素个数是否相等
        if (o1.length !== o2.length) return false 
        // 比较两个数组中的每个元素
        return o1.every((item, i) => {
            // return item === target
            return isEqual(item, o2[i])
        })
    }

    if (t2 === 'object') {
        // object类型比较类似数组
        const keysArr = Object.keys(o1)
        if (keysArr.length !== Object.keys(o2).length) return false
        // 比较每一个元素
        return keysArr.every(k => {
            return isEqual(o1[k], o2[k])
        })
    }

    return o1 === o2
}

// 数组去重
const removeDuplicates = (arr) => {
    return arr.reduce((accumulator, current) => {
        const hasIndex = accumulator.findIndex(item => isEqual(current, item))
        if (hasIndex === -1) {
            accumulator.push(current)
        }
        return accumulator
    }, [])
}

// 测试
removeDuplicates([123, {a: 1}, {a: {b: 1}}, {a: "1"}, {a: {b: 1}}, "meili", {a:1, b:2}, {b:2, a:1}])
// [123, {a: 1}, a: {b: 1}, {a: "1"}, "meili", {a: 1, b: 2}]
```

## 图片懒加载

```html
<div class="imgList">
<img class="lazy" src="img/loading.gif" data-src="img/pic1" alt="pic" />
<img class="lazy" src="img/loading.gif" data-src="img/pic2" alt="pic" />
<img class="lazy" src="img/loading.gif" data-src="img/pic3" alt="pic" />
</div>
<script>
$(() => {
    let lazyload = () => {
    for (let i = 0; i < $(".lazy").length; i++) {
        if (
        $(".lazy").eq(i).offset().top <=
        $(window).height() + $(window).scrollTop()
        ) {
        $(".lazy").eq(i).attr("src", $(".lazy").eq(i).data("src"));
        }
    }
    };
    lazyload();
    $(window).on("scroll", function () {
    lazyload();
    });
});
</script>
```

## 正则获取URL参数

- 获取指定 URL 参数

```js
function getUrlParams(name) {
    //(^|&)从头开始或匹配字符&,([^&]*)匹配不是&的任何内容,(&|$)遇到下一个&或者结束
    //在正则表达式中，增加一个()代表着匹配数组中增加一个值, 因此代码中的正则匹配后数组中应包含4个值(完整匹配+3个括号)
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); //获取([^&]*)的结果
    return null;
}

window.location = "http://www.baidu.com?name=elephant&age=25&sex=male";
var name = getUrlParams("name"); //elephant
var age = getUrlParams("age"); //25
var sex = getUrlParams("sex"); //male
```

- 获取所有的 URL 参数

```js
function parse_url(_url) {
    //定义函数
    var pattern = /(\w+)=(\w+)/gi; //定义正则表达式
    var parames = {}; //定义数组
    url.replace(pattern, function (a, b, c) {
    //替换函数(完整匹配+2个括号)
    parames[b] = c;
    });
    return parames; //返回这个数组.
}

var url = "http://www.baidu.com?name=elephant&age=25&sex=male";
var params = parse_url(url); // ["name=elephant", "age=25", "sex=male"]
```

## 操作cookie

- 获取

```js
function getCookie(name) {
    var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
}
```

- 设置/添加

```js
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie =
    name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
```

- 更新

```js
function updateCookie(name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var currentValue = getCookie(name);
    if (currentValue != null) {
    document.cookie =
        name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }
}
```

- 删除

```js
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
```

## 文件切片上传

```html
<input id="in" type="file" />
<script>
    $(function () {
    let pieceSize = 10;
    var totalSize = 0;

    $("#in").on("change", function () {
        handleFiles(this.files);
    });

    async function handleFiles(fileList) {
        var i = 0;
        while (i < fileList.length) {
        console.log("=================================================");
        console.log(
            "开始处理第" +
            i +
            "个文件, 文件是" +
            fileList[i]["name"] +
            "大小是:" +
            fileList[i]["size"]
        );
        var targetFile = fileList[i];
        totalSize += targetFile.size;
        await uploadFile(targetFile, i);
        i++;
        if (i == fileList.length) return;
        }
    }

    async function uploadFile(targetFile, index) {
        //console.log(targetFile);
        var tmp = targetFile.name.split(".");
        //var filename = "file-" + guid() + '.' + tmp[tmp.length - 1];
        var fileSize = targetFile.size;
        var total = Math.ceil(fileSize / pieceSize);

        await handle();

        async function handle() {
        var i = 0;
        var start = (end = 0);
        while (i < total) {
            end = start + pieceSize;

            if (end >= fileSize) {
            end = fileSize;
            }

            console.log(
            "文件的index:" + index + "| 处理文件切片 i:" + i,
            "start:" + start,
            "end:" + end
            );
            var frag = targetFile.slice(start, end);

            var filename = "file-" + i + "." + tmp[tmp.length - 1];

            await send(filename, frag, i, total, function () {
            console.log(
                "文件的index:" + index + "| 切片上传完成 回调 res111",
                i
            );
            });

            start = end;
            i++;
        }
        }
    }

    //send
    async function send(filename, frag, index, total, cb) {
        var formData = new FormData();
        var fragname = "frag-" + index;

        formData.append("filename", filename);
        formData.append("fragname", fragname);
        formData.append("file", frag);
        formData.append("fragindex", index);
        formData.append("total", total);

        await $.ajax({
        url: "/cms/test1",
        type: "POST",
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        })
        .done(function (res) {
            //console.log('res:' + index);
            cb && cb();
        })
        .fail(function (res) {});
    }
    });
</script>
```

## 活动倒计时

```js
var future = "2017-04-04";

var calculationTime = function (future) {
    var s1 = new Date(future.replace(/-/g, "/")),
    s2 = new Date(),
    runTime = parseInt((s1.getTime() - s2.getTime()) / 1000);
    var year = Math.floor(runTime / 86400 / 365);
    runTime = runTime % (86400 * 365);
    var month = Math.floor(runTime / 86400 / 30);
    runTime = runTime % (86400 * 30);
    var day = Math.floor(runTime / 86400);
    runTime = runTime % 86400;
    var hour = Math.floor(runTime / 3600);
    runTime = runTime % 3600;
    var minute = Math.floor(runTime / 60);
    runTime = runTime % 60;
    var second = runTime;
    return [year, month, day, hour, minute, second];
};
setInterval(function () {
    var result = calculationTime(future);
    //更新视图
}, 1000);
```

## 监听url变化

* 监听hashchange:#改变触发

```js
window.onhashchange=function(event){
    console.log(event);
}
//或者
window.addEventListener('hashchange',function(event){
    console.log(event);
})
```

* 监听popstate:前进后退触发

```js
window.addEventListener('popstate', function(event) {
    console.log(event);
})
```

* 自定义事件replaceState和pushState行为的监听:单页面应用url改变能生效

```js
let historyEvent = function(type) {
    let origin = history[type];
    return function() {
        let result = origin.apply(this, arguments);
        let event = new Event(type);
        event.arguments = arguments;
        window.dispatchEvent(event);
        return result;
    };
};
history.pushState = historyEvent('pushState');
history.replaceState = historyEvent('replaceState');

window.addEventListener('replaceState', function(e) {
    console.log('THEY DID IT AGAIN! replaceState 111111');
});
window.addEventListener('pushState', function(e) {
    console.log('THEY DID IT AGAIN! pushState 2222222');
});
```

## koa2洋葱模型compose

* 异步函数组合

```js
async function fn1(next) {
    console.log('fn1')
    next && await next()
    console.log('fn1 end')
}
async function fn2(next) {
    console.log('fn2')
    next && await next()
    console.log('fn2 end')
}
async function fn3(next) {
    console.log('fn3')
    next && await next()
    console.log('fn3 end')
}
//fn3(fn2(fn1()))
function compose(middlewares) {
    return function () {
        return dispatch(0)
        function dispatch(i) {
            let fn = middlewares[i]
            if (!fn) {
                return Promise.resolve()
            }
            return Promise.resolve(
                fn(function next() {
                    return dispatch(i + 1)
                })
            )
        }
    }
}

const middlewares = [fn1, fn2, fn3]
const finalFn = compose(middlewares)
finalFn()
//fn1
//fn2
//fn3
//fn1 end
//fn2 end
//fn3 end
```

* 同步函数组合

```js
function fn1() {
    console.log('fn1')
    console.log('fn1 end')
}
function fn2() {
    console.log('fn2')
    console.log('fn2 end')
}
function fn3() {
    console.log('fn3')
    console.log('fn3 end')
}
//fn3(fn2(fn1()))
const compose = (middlewares) => () => {
    [first, ...others] = middlewares
    let ret = first()
    others.forEach(fn => {
        ret = fn(ret)
    })
    return ret
}

const middlewares = [fn1, fn2, fn3]
const finalFn = compose(middlewares)
finalFn()
//fn1
//fn1 end
//fn2
//fn2 end
//fn3
//fn3 end
```

```js
const compose = require('koa-compose');

const composes = [];

function use(fun) {
    composes.push(fun);
}

use(async (ctx, next) => {
    console.log('第一个中间件');
    await next();
    console.log('1->END');
});

use(async (ctx, next) => {
    console.log('第二个中间件');
    await next();
    console.log('2->END');
});

use(async (ctx, next) => {
    console.log('第三个中间件');
    await next();
    console.log('3->END');
});

const exec = compose(composes);

(async () => {
    const ctx = {};
    await exec(ctx, async () => {
        console.log('END');
    });
})();

//输出：
//第一个中间件
//第二个中间件
//第三个中间件
//END
//3->END
//2->END
//1->END
```

