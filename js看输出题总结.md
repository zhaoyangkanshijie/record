# js看输出题总结

* [数组的理解](#数组的理解)
* [事件循环](#事件循环)
* [运算符优先级](#运算符优先级)
* [精度丢失](#精度丢失)
* [trycatchfinallyreturn执行顺序](#trycatchfinally执行顺序)
* [变量生命周期](#变量生命周期)
* [this的指向](#this的指向)
* [isNaN和Number.isNaN函数的区别](#isNaN和Number.isNaN函数的区别)

---

## 数组的理解

```js
var obj = {
    '2':3,
    '3':4,
    'length':2,
    'splice':Array.prototype.splice,
    'push':Array.prototype.push
}
obj.push(1)
obj.push(2)
obj.push(3)
console.log(obj)

{
    '2':1
    '3':2,
    '4':3,
    'length':5,
    'splice':Array.prototype.splice,
    'push':Array.prototype.push
}
```

- obj 有长度，相当于类数组
- 调用数组的 push，会在数组的最后加一项，每次长度加一
- push(key)时，会隐式调用 toString 方法转为字符串
- key 值相同被覆盖

## 事件循环

- 宏任务：setInterval()，setTimeout()，setImmediate()，xhr回调

- 微任务 1：new Promise()
    - Promise 是异步的，是指他的 then()和 catch()方法，Promise 本身还是同步的
    - 有 resolve()后，才能执行 then(),有 reject()，不执行 then()

- 微任务 2：async await
    - async function(){} 表示函数内存在异步操作
    - await 强制下面代码等待，直到这行代码得出结果(await setTimeout 无效，适用于 ajax)

- 事件优先级：同步任务>异步任务(微任务(process.nextTick优先)>宏任务(取决于延时时间))

- 浏览器和node的事件循环区别

    node会在每个阶段之间执行微任务，6个阶段:

    * timers 阶段：这个阶段执行 timer（setTimeout、setInterval）的回调
    * I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
    * idle, prepare 阶段：仅 node 内部使用
    * poll 阶段：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里
    * check 阶段：执行 setImmediate() 的回调
    * close callbacks 阶段：执行 socket 的 close 事件回调

    process.nextTick是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行

    ```js
    setTimeout(()=>{
        console.log('timer1')
        Promise.resolve().then(function() {
            console.log('promise1')
        })
    }, 0)
    setTimeout(()=>{
        console.log('timer2')
        Promise.resolve().then(function() {
            console.log('promise2')
        })
    }, 0)
    //浏览器:timer1=>promise1=>timer2=>promise2
    //node:timer1=>timer2=>promise1=>promise2
    ```

- 看输出
```js
//浏览器
(function () {
  setTimeout(() => {
    console.log(0);
  });

  new Promise((resolve) => {
    console.log(1);

    setTimeout(() => {
      resolve();
      Promise.resolve().then(() => {
        console.log(2);
        setTimeout(() => console.log(3));
        Promise.resolve().then(() => console.log(4));
      });
    });

    Promise.resolve().then(() => console.log(5));
  }).then(() => {
    console.log(6);
    Promise.resolve().then(() => console.log(7));
    setTimeout(() => console.log(8));
  });

  console.log(9);
})();
//1、9、5、0、6、2、7、4、8、3
//node.js
console.log("1");
setTimeout(function () {
  console.log("2");
  process.nextTick(function () {
    console.log("3");
  });
  new Promise(function (resolve) {
    console.log("4");
    resolve();
  }).then(function () {
    console.log("5");
  });
});
process.nextTick(function () {
  console.log("6");
});
new Promise(function (resolve) {
  console.log("7");
  resolve();
}).then(function () {
  console.log("8");
});
setTimeout(function () {
  console.log("9");
  process.nextTick(function () {
    console.log("10");
  });
  new Promise(function (resolve) {
    console.log("11");
    resolve();
  }).then(function () {
    console.log("12");
  });
});
//1，7，6，8，2，4，3，5，9，11，10，12
let test = async function () {
  await new Promise((resolve, reject) => {
    console.log(1);
    setTimeout(() => {
      resolve();
    }, 3000);
  }).then(() => {
    console.log(2);
  });
  console.log(3);
  await new Promise((resolve, reject) => {
    console.log(4);
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    console.log(5);
  });
  console.log(6);
};
test();
//1

//2
//3
//4

//5
//6
```

## 运算符优先级

```txt
('b' + 'a' + + 'a' + 'a').toLowerCase()
=('b' + 'a' + (+ 'a') + 'a').toLowerCase()//正号优先级大于加号
=('b' + 'a' + Number('a') + 'a').toLowerCase()//隐式转换
=('ba' + NaN + 'a').toLowerCase()
=('ba' + 'NaN' + 'a').toLowerCase()
=('baNaNa').toLowerCase()
='banana'
```

## 精度丢失

```js
0.1 + 0.2 === 0.3//false
(0.1 * 10 + 0.2 * 10) / 10) == 0.3; // true

function numbersequal(a,b){ return Math.abs(a-b)<Number.EPSILON; } 
Number.EPSILON=(function(){   //解决兼容性问题
    return Number.EPSILON?Number.EPSILON:Math.pow(2,-52);
})();
var a=0.1+0.2， b=0.3;
console.log(numbersequal(a,b)); //true
```

## trycatchfinallyreturn执行顺序

try 里面放 return，finally 会执行完再 return

```js
// return 执行了但是没有立即返回，而是先执行了finally
function kaimo() {
    try {
        return 0;
    } catch (err) {
        console.log(err);
    } finally {
        console.log("a");
    }
}

console.log(kaimo()); // a 0
// finally 中的 return 覆盖了 try 中的 return。
function kaimo() {
    try {
        return 0;
    } catch (err) {
        console.log(err);
    } finally {
        return 1;
    }
}

console.log(kaimo()); // 1
```

## 变量生命周期

```js
a; // undefined 变量提升
b; // ReferenceError 临时死区 const
c; // ReferenceError 临时死区 let

var a = "value";
const b = 3.14;
let c = true;

a; //'value'
b; //3.14
c; //true
```

```js
var a = 10;
function foo() {
    console.log(a); // undefined
    var a = 20; // 使上面的a变成局部作用域
}
foo();
```

```js
var a = 10;
function foo() {
    console.log(a); // ReferenceError
    let a = 20; // 使上面的a变成局部作用域
}
foo();
```

```js
var a = 10;
function foo() {
    console.log(a); // 全局作用域10
}
foo();
```

```js
var a = 10;
function foo() {
    console.log(a); // undefined
    var a = 20; // 使上面的a变成局部作用域
    console.log(a); //20
}
console.log(a); //10
foo();
```

## this的指向

```js
var x = 10; // global scope
var foo = {
    x: 90,
    getX: function () {
        return this.x;
    },
};
foo.getX(); // 90,函数里的this指向foo
let xGetter = foo.getX;
xGetter(); // 10,函数里的this指向window
let getFooX = foo.getX.bind(foo); //使用call和apply同理
getFooX(); // 90
```

```js
var num = 1;
let obj = {
    num: 2,
    add: function() {
        this.num = 3;
        // 这里的立即指向函数，因为我们没有手动去指定它的this指向，所以都会指向window
        (function() {
            // 所有这个 this.num 就等于 window.num
            console.log(this.num);
            this.num = 4;
        })();
        console.log(this.num);
    },
    sub: function() {
        console.log(this.num)
    }
}
// 下面逐行说明打印的内容

/**
* 在通过obj.add 调用add 函数时，函数的this指向的是obj,这时候第一个this.num=3
* 相当于 obj.num = 3 但是里面的立即指向函数this依然是window,
* 所以 立即执行函数里面console.log(this.num)输出1，同时 window.num = 4
*立即执行函数之后，再输出`this.num`,这时候`this`是`obj`,所以输出3
*/
obj.add() // 输出 1 3

// 通过上面`obj.add`的执行，obj.name 已经变成了3
console.log(obj.num) // 输出3
// 这个num是 window.num
console.log(num) // 输出4
// 如果将obj.sub 赋值给一个新的变量，那么这个函数的作用域将会变成新变量的作用域
const sub = obj.sub
// 作用域变成了window window.num 是 4
sub() // 输出4
```

## isNaN和Number.isNaN函数的区别

* isNaN:传入任何非数字值均为NaN
* Number.isNaN:先判断是否数字，再判断NaN

```js
isNaN('a')//true
Number.isNaN('a')//false
```
