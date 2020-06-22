# nodejs常见问题

- [nodejs复合函数与中间件](#nodejs复合函数与中间件)
- [nodejs垃圾回收gc机制](#nodejs垃圾回收gc机制)
- [deno和nodejs区别](#deno和nodejs区别)
- [获取命令行传来的参数](#获取命令行传来的参数)
- [文件路径](#文件路径)
- [url模块](#url模块)

---

### nodejs复合函数与中间件

1. 参考链接：

   [写一个例子理解koa-compose的用法及函数结果顺序](https://www.jianshu.com/p/bedd0b5385b6)

   [JS函数式编程中compose的实现](https://www.jianshu.com/p/eda918cf738a)

   [手写一个 Koa --- Koa 原理学习](https://www.jianshu.com/p/373a4a9c0664)

   [面试官问你关于node的那些事（基础篇）](https://juejin.im/post/5eeec838e51d4574134ac467)

2. 详解：

    * Express和Koa框架中间件有什么不同

        * express 中间件：是通过 next 的机制，即上一个中间件会通过 next 触发下一个中间件
        * koa2 中间件：是通过 async await 实现的，中间件执行顺序是“洋葱圈”模型（推荐）

    * koa中间件场景

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

    * 起源场景

        * 定义

            在数学里, 把函数 f(), g(), 和 h() 组合起来可以得到复合函数 f(g(h()))。

        * 函数特点

            函数执行顺序为从右向左，最右边的函数（最后一个参数）最先执行，执行完的结果作为参数传递给前一个函数（包裹它的函数），一直到整个函数执行完毕，返回一个函数，所以内部实现的原理类似多米诺骨牌，层层递进。

            哪怕再要增加或者删除一个参数（执行函数），只需增加或删除相应的参数和定义的函数即可，维护和扩展都十分方便。

        * 实现

            ```js
            function compose(...args) {
                var fns = args;
                return function (initialArg) {
                    var res = initialArg;
                    for (var i = fns.length - 1; i > -1; i--) {
                        res = fns[i](res);
                    }
                    return res;
                }
            }
            ```

    * koa中间件

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

### nodejs垃圾回收gc机制

1. 参考链接：

   [理解 Node.js 的 GC 机制](https://www.cnblogs.com/chaohangz/p/10963565.html)

   [NodeJS性能调优之GC调优](https://www.jianshu.com/p/1edea2f6fd4d)

2. 详解：

    * 背景

        浏览器中js运行时间短，随着进程的退出，内存会释放，几乎没有内存管理的必要。但随着 Node 在服务端的广泛应用，JavaScript 的内存管理需要引起我们的重视。

        在一般的后端开发语言中，在基本的内存使用上没有什么限制，然而在 Node 中通过 JavaScript 使用内存时就会发现只能使用部分内存（64位系统下约为1.4GB，32位系统下约为0.7GB）。在这样的限制下，将会导致 Node 无法直接操作大内存对象。

        造成这个问题的主要原因在于 Node 的 JavaScript 执行引擎 V8。

        在 V8 中，所有的 JavaScript 对象都是通过堆来进行分配的。Node 提供了 V8 中内存的使用量查看方法 process.memoryUsage()

        heapTotal 已申请到的堆内存，heapUsed 当前使用的堆内存

        限制内存原因：
        
        * V8 为浏览器而设计，不太可能遇到用大量内存的场景
        * V8 的垃圾回收机制的限制

        控制使用内存的大小选项：

        * node --max-old-space-size=1700 test.js 设置老生代内存空间最大值，单位为MB
        * node --max-new-space-size=1024 test.js 设置新生代内存空间最大值，单位为KB

    * V8 的垃圾回收机制

        策略主要基于分代式垃圾回收机制,内存分为新生代(存活时间较短的对象)和老生代两代(存活时间较长或常驻内存的对象),总体为堆的整体大小

        * 新生代

            新生代中的对象主要通过 Scavenge 算法进行垃圾回收。在 Scavenge 的具体实现中，主要采用了 Cheney 算法

            Cheney 算法是一种采用复制的方式实现的垃圾回收算法。它将堆内存一分为二，每一部分空间成为 semispace。在这两个 semispace 空间中，只有一个处于使用中，另一个处于闲置中。处于使用中的 semispace 空间成为 From 空间，处于闲置状态的空间成为 To 空间。当我们分配对象时，先是在 From 空间中进行分配。当开始进行垃圾回收时，会检查 From 空间中的存活对象，这些存活对象将被复制到 To 空间中，而非存活对象占用的空间将被释放。完成复制后， From 空间和 To 空间的角色发生对换。

            Scavenge 的缺点是只能使用堆内存的一半，但 Scavenge 由于只复制存活的对象，并且对于生命周期短的场景存活对象只占少部分，所以它在时间效率上表现优异。Scavenge 是典型的牺牲空间换取时间的算法，无法大规模地应用到所有的垃圾回收中，但非常适合应用在新生代中。

            在新生代中使用 Scavenge 算法进行垃圾回收，优点是速度快无内存碎片，缺点是占用双倍内存空间。

        * 老生代

            对象从新生代中移动到老生代中的过程称为晋升，晋升条件：

            * 对象是否经历过一次 Scavenge 回收

            *  空间已经使用超过 25%(原因：当这次 Scavenge 回收完成后，这个 To 空间将变成 From 空间，接下来的内存分配将在这个空间中进行，如果占比过高，会影响后续的内存分配)

            老生代中主要采用了 Mark-Sweep 和 Mark-Compact 相结合的方式进行垃圾回收

            Mark-Sweep 是标记清除的意思，它分为两个阶段，标记和清除。Mark-Sweep 在标记阶段遍历堆中的所有对象，并标记活着的对象，在随后的清除阶段中，只清除未被标记的对象。

            Mark-Sweep 最大的问题是在进行一次标记清除回收后，内存空间会出现不连续的状态。

            为了解决 Mark-Sweep 的内存碎片问题，Mark-Compact 被提出来。Mark-Compact是标记整理的意思，它们的差别在于对象在标记为死亡后，在整理过程中，将活着的对象往一端移动，移动完成后，直接清理掉边界外的内存。

            在老生代中将 Mark-Sweep 和 Mark-Compact 两种算法结合使用，主要使用 Mark-Sweep，优点的是无需移动对象，缺点是产生内存碎片。Mark-Compact 是对 Mark-Sweep 的补充，在空间不足以对新晋升的对象进行分配时整理内存，清除内存碎片，由于要移动对象，速度较慢。

        * Incremental Marking

            为了避免出现 JavaScript 应用逻辑与垃圾回收器看到的不一致的情况，垃圾回收的3种算法都需要将应用逻辑暂停下来，这种行为称为“全停顿” (stop-the-world)。

            由于新生代配置的空间较小，存活对象较少，全停顿对新生代影响不大。但老生代通常配置的空间较大，且存活对象较多，全堆垃圾回收（full 垃圾回收）的标记、清除、整理等动作造成的停顿就会比较可怕。

            为了降低全堆垃圾回收带来的停顿时间，V8 先从标记阶段入手，将原本要一口气停顿完成的动作改成增量标记(Incremental Marking)，也就是拆分为许多小“步进”，每做完一“步进”就让JavaScript应用逻辑执行一小会儿，垃圾回收和应用逻辑交替执行直到标记阶段完成。

            V8 使用 Incremental Marking 来减少全停顿带来的影响。

    * 查看GC日志

        在启动时添加 --trace_gc 参数

    * GC 调优与测试

        NodeJS在64位系统上，默认的semi space大小为16M。

        我们将 semi space 进行了3次调整，分别设为64M、128M、256M，对不同值情况下的服务进行了压测并获取了对应 GC Trace 和 CPU Profile。

        普通node服务
        ```cmd
        node index.js --max_semi_space_size=64
        ```

        PM2
        ```cmd
        node_args: '--max_semi_space_size=64',
        ```

        比较GC的CPU占比、3分钟内GC次数、Scavenge的次数、GC时间、GC平均暂停时间，指标相互影响，不一定空间越大越好

### deno和nodejs区别

1. 参考链接：

   [Deno 正式发布，彻底弄明白和 node 的区别](https://juejin.im/post/5ebcad19f265da7bb07656c7#heading-10)

2. 详解：

    1. 内置 API 引用方式不同

        nodejs
        ```js
        const fs = require("fs");
        fs.readFileSync("./data.txt");
        ```

        deno
        ```js
        Deno.readFileSync("./data.txt");
        ```

    2. 模块系统不同

        node 采用的是 CommonJS 规范(require)，而 deno 则是采用的 ES Module 的浏览器实现(import)

    3. 安全性不同

        node无安全限制，deno默认安全，访问环境变量，需要加上 --allow-env等参数

        deno
        ```js
        deno run --unstable --allow-env --allow-read --allow-net  index.js
        ```

    4. typescript支持

        node通过第三方支持，如ts-node，deno原生支持

    5. 包管理

        node通过npm + node_modules，deno原生支持，import url即可，没网时可把静态文件拷贝到本地服务器再import，--reload命令可更新缓存

    6. 异步操作

        node 用回调的方式处理异步操作
        ```js
        const fs = require("fs");
        fs.readFile("./data.txt", (err, data) => {
            if (err) throw err;
            console.log(data);
        });
        ```

        deno 则选择用 Promise
        ```js
        const { promisify } = require("es6-promisify");
        const fs = require("fs");

        // 没有 top-level-await，只能包一层
        async function main() {
            const readFile = promisify(fs.readFile);
            const data = await readFile("./data.txt");
            console.log(data);
        }

        main();
        ```

    7. 仓库去中心化

        node基于www.npmjs.com，deno通过 import url 的方式将互联网任何一处的代码都可以引用



### 获取命令行传来的参数

1. 参考链接：

   [面试官问你关于node的那些事（基础篇）](https://juejin.im/post/5eeec838e51d4574134ac467)

2. 详解：

    ```js
    // /usr/local/bin/node: src tree$ node test.js arg1 arg2 arg3
    // process.argv[0] : 返回启动Node.js进程的可执行文件所在的绝对路径
    // process.argv[1] : 为当前执行的JavaScript文件路径
    // process.argv.splice(2) : 移除前两者后，剩余的元素为其他命令行参数(也就是我们自定义部分)
    process.argv[0] // /usr/local/bin/node
    process.argv[1] // /Users/tree/Documents/infrastructure/KSDK/src/test.js
    process.argv[2] // ['arg1','arg2','arg3']
    ```

### 文件路径

1. 参考链接：

   [面试官问你关于node的那些事（基础篇）](https://juejin.im/post/5eeec838e51d4574134ac467)

2. 详解：

    * __dirname: 总是返回被执行的 js 所在文件夹的绝对路径
    * __filename: 总是返回被执行的 js 的绝对路径
    * process.cwd(): 总是返回运行 node 命令时所在的文件夹的绝对路径
    * path.dirname(__dirname)： 返回 path 的目录名
    * path.join()：所有给定的 path 片段连接到一起，然后规范化生成的路径
    * path.resolve()：方法会将路径或路径片段的序列解析为绝对路径，解析为相对于当前目录的绝对路径，相当于cd命令

        ```js
        //join是把各个path片段连接在一起， resolve把／当成根目录
        path.join('/a', '/b') // '/a/b'
        path.resolve('/a', '/b') //'/b'
        //join是直接拼接字段，resolve是解析路径并返回
        path.join("a","b")  // "a/b"
        path.resolve("a", "b") // "/Users/tree/Documents/infrastructure/KSDK/src/a/b"
        ```

### url模块

1. 参考链接：

   [面试官问你关于node的那些事（基础篇）](https://juejin.im/post/5eeec838e51d4574134ac467)

2. 详解：

    * url.parse：可以将一个url的字符串解析并返回一个url的对象
    * url.format:将传入的url对象编程一个url字符串并返回

    ```js
    Url {
        protocol: 'http:',
        slashes: true,
        auth: null,
        host: 'baidu.com:8080',
        port: '8080',
        hostname: 'baidu.com',
        hash: '#node',
        search: '?query=js',
        query: 'query=js',
        pathname: '/test/h',
        path: '/test/h?query=js',
        href: 'http://baidu.com:8080/test/h?query=js#node'
    }
    ```