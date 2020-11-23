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
* [new](#new)
* [new](#new)
* [new](#new)
* [new](#new)

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
    function debounce(fn, wait, immediate, ...args) {
    let timer = null;
    let one = immediate;
    return function () {
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

function handle(...a) {
    console.log(a, Math.random());
}

window.addEventListener("click", debounce(handle, 1000, true, 1,2,3));
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

## 