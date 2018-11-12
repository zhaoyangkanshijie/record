# Promise

在JavaScript的世界中，所有代码都是单线程执行的，这导致所有网络操作，浏览器事件，都必须是异步执行，最常见的是ajax的success和fail的回调，但它不利于代码复用，如果能用链式写法，先统一执行AJAX逻辑，不关心如何处理结果，然后，根据结果是成功还是失败，在将来的某个时候调用success函数或fail函数，就能把执行代码和处理结果的代码清晰地分离了。此时可以使用ES6+的Promise。

1. 基本使用
```js
function test(resolve, reject) {
    var timeOut = Math.random() * 2;
    log('set timeout to: ' + timeOut + ' seconds.');
    setTimeout(function () {
        if (timeOut < 1) {
            log('call resolve()...');
            resolve('200 OK');//成功返回的内容
        }
        else {
            log('call reject()...');
            reject('timeout in ' + timeOut + ' seconds.');//失败返回的内容
        }
    }, timeOut * 1000);
}
var p1 = new Promise(test).then(function (result) {
    console.log('成功：' + result);
}).catch(function (reason) {
    console.log('失败：' + reason);
});
```

2. 链式调用
```js
// 0.5秒后返回input*input的计算结果:
function multiply(input) {
    return new Promise(function (resolve, reject) {
        log('calculating ' + input + ' x ' + input + '...');
        setTimeout(resolve, 500, input * input);
    });
}

// 0.5秒后返回input+input的计算结果:
function add(input) {
    return new Promise(function (resolve, reject) {
        log('calculating ' + input + ' + ' + input + '...');
        setTimeout(resolve, 500, input + input);
    });
}

var p = new Promise(function (resolve, reject) {
    log('start new Promise...');
    resolve(123);
});

p.then(multiply)
 .then(add)
 .then(multiply)
 .then(add)
 .then(function (result) {
    log('Got value: ' + result);
});

```

3. 并行方法
```js
var p1 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 500, 'P1');
});
var p2 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 600, 'P2');
});
// 同时执行p1和p2，并在它们都完成后执行then:
Promise.all([p1, p2]).then(function (results) {
    console.log(results); // 获得一个Array: ['P1', 'P2']
});
//多个异步任务为了容错。如同时向两个URL读取用户的个人信息，只需要获得先返回的结果即可。这种情况下，用Promise.race()
Promise.race([p1, p2]).then(function (result) {
    console.log(result); // 返回先执行完成的结果，丢弃较慢的结果
});
```