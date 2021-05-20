# nodejs常见问题

- [nodejs复合函数与中间件](#nodejs复合函数与中间件)
- [nodejs垃圾回收gc机制](#nodejs垃圾回收gc机制)
- [deno和nodejs区别](#deno和nodejs区别)
- [获取命令行传来的参数](#获取命令行传来的参数)
- [fs文件操作](#fs文件操作)
- [path文件路径](#path文件路径)
- [url模块](#url模块)
- [express中app.get、app.use、app.all的区别](#express中app.get、app.use、app.all的区别)
- [express中response常用方法](#express中response常用方法)
- [node利用多核CPU创建集群](#node利用多核CPU创建集群)
- [node是支持https](#node是支持https)
- [node和客户端解决跨域的问题](#node和客户端解决跨域的问题)
- [node应用内存泄漏处理](#node应用内存泄漏处理)
- [两个node程序交互](#两个node程序交互)
- [process](#process)
- [获取本地IP](#获取本地IP)
- [crypto](#crypto)
- [koa1和koa2区别](#koa1和koa2区别)
- [nodejs特点与应用场景](#nodejs特点与应用场景)
- [child_process](#child_process)
- [Nodemailer发送邮件](#Nodemailer发送邮件)
- [domain模块捕捉异常](#domain模块捕捉异常)
- [nodejs请求响应](#nodejs请求响应)
- [事件触发器](#事件触发器)
- [readline逐行读取](#readline逐行读取)
- [stream流](#stream流)
- [zlib压缩](#zlib压缩)
- [获取操作系统信息](#获取操作系统信息)
- [性能钩子](#性能钩子)
- [inspect调试器](#inspect调试器)
- [Buffer缓冲器](#Buffer缓冲器)
- [ORM框架](#ORM框架)
- [定时任务框架](#定时任务框架)

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

   [通过【垃圾回收机制】的角度认识【Map与WeakMap】的区别](https://mp.weixin.qq.com/s/1ORX2Ftd5Eo_Oc3IEn2R2g)

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

    * nodejs相关api

        * global.gc()手动调用一次垃圾回收。需要在运行js文件时候增加命令 --expose-gc，一般环境下不推荐使用
        * process.memoryUsage()查看Node进程的内存占用情况。

            返回值为对象其中包含五个属性 rss，heapTotal，heapUsed，external，arrayBuffers；

            其中主要属性是 heapTotal和heapUsed对应的是V8的堆内存信息。

            heapTotal是堆中总共申请的内存量，heapUsed表示目前堆中使用的内存量。单位都为字节。

    * 通过gc了解map与weakmap区别

        WeakMap
        ```js
        // index.js
        // 第一次手动清理垃圾以确保为最新状态，观察内存情况
        global.gc();
        console.log(`第一次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`);
        const wm = new WeakMap();

        let key = {};
        // 给 WeakMap实例 赋值一个 占领内存足够大的 键值对
        wm.set(key, new Array(114514 * 19));
        // 手动清理一下垃圾 观察内存占用情况
        global.gc();
        console.log(`第二次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`);

        // 此时把 key键 的引用进行断开，并观察内存占用情况
        key = null;
        // key = new Array();  
        // 这种改变引用地址写法也可以引起 弱映射，因为引用地址不再是同块内存地址 WeakMap内对应的value也会被垃圾回收

        global.gc();
        console.log(`第三次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`);

        $ node --expose-gc index.js

        第一次垃圾回收，当前内存使用情况：1.66MB
        第二次垃圾回收，当前内存使用情况：18.45MB
        第三次垃圾回收，当前内存使用情况：1.84MB
        ```

        Map
        ```js
        // index.js
        // 第一次手动清理垃圾以确保为最新状态，观察内存情况
        global.gc();
        console.log(
        `第一次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`
        );
        const m = new Map();

        let key = {};
        m.set(key, new Array(114514 * 19));
        // 手动清理一下垃圾 观察内存占用情况
        global.gc();
        console.log(
        `第二次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB，
        当前Map的长度: ${m.size}`
        );

        // 此时把 key键 的引用进行断开，并观察内存占用情况
        key = null;
        global.gc();
        console.log(
        `第三次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB，
        当前Map的长度: ${m.size}`
        );

        // 清除Map所有键值对
        m.clear();

        global.gc();
        console.log(
        `第四次垃圾回收，当前内存使用情况：${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB，
        当前Map的长度: ${m.size}`
        );
        $ node --expose-gc index.js
        第一次垃圾回收，当前内存使用情况：1.66MB
        第二次垃圾回收，当前内存使用情况：18.45MB，当前Map的长度: 1
        第三次垃圾回收，当前内存使用情况：18.45MB，当前Map的长度: 1
        第四次垃圾回收，当前内存使用情况：1.85MB，当前Map的长度: 0
        ```

        总结：Map所构建的实例是需要手动清理，才能被垃圾回收清除，而WeakMap只要外部的引用消失，所对应的键值对就会自动被垃圾回收清除。

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

### fs文件操作

1. 参考链接：

   [面试官问你关于node的那些事（基础篇）](https://juejin.im/post/5eeec838e51d4574134ac467)

   [fs（文件系统）](http://nodejs.cn/api/fs.html#fs_synchronous_example)

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

    * 创建文件和读写

        * fs.exists不稳定，已弃用，改用fs.stat/fs.access
        * 不建议在调用 fs.open()、 fs.readFile() 或 fs.writeFile() 之前使用 fs.stat() 检查文件的存在性。 而是应该直接地打开、读取或写入文件，如果文件不可用，则处理引发的错误。
        * 不要在调用 fs.open()、 fs.readFile() 或 fs.writeFile() 之前使用 fs.access() 检查文件的可访问性。 这样做会引入竞态条件，因为其他进程可能会在两个调用之间更改文件的状态。 而是，应该直接打开、读取或写入文件，并且当文件无法访问时处理引发的错误。
        * fs.mkdir(dirname, callback)目录必须一级一级创建，否则报错

        ```js
        const fs = require('fs');
        const path = require('path');

        const file = './data/17/1017.txt';
        const fileContent = '\n hello world';
        writeFileByUser(file,fileContent);

        function writeFileByUser(filePath,data){
            if (fs.existsSync(filePath)) {
                console.log('该路径已存在');
            }else{
                console.log('该路径不存在');
                mkdir(filePath);
            }
            fs.appendFile(filePath,data,'utf8',function(err){  
                if(err)  {  
                    console.log(err);  
                } else {
                    console.log('appendFile 成功了')
                }
            })
        }

        function mkdir(filePath) {
            const dirCache={};
            const arr=filePath.split('/');
            let dir=arr[0];
            for(let i=1;i<arr.length;i++){
                if(!dirCache[dir]&&!fs.existsSync(dir)){
                    dirCache[dir]=true;
                    fs.mkdirSync(dir);
                }
                dir=dir+'/'+arr[i];
            }
            fs.writeFileSync(filePath, '')
        }
        ```

        如果文件已存在，则覆盖文件，不存在则创建
        ```js
        const fs = require('fs');
        const data = new Uint8Array(Buffer.from('Node.js 中文网'));
        fs.writeFile('文件.txt', data, (err) => {
            if (err) throw err;
            console.log('文件已被保存');
        });
        ```

    * 文件重命名、查看文件属性

        ```js
        const fs = require('fs');
        fs.rename('./tmp/hello', './tmp/world', (err) => {
            if (err) throw err;
            fs.stat('./tmp/world', (err, stats) => {
                if (err) throw err;
                console.log(`文件属性: ${JSON.stringify(stats)}`);
            });
        });
        ```

        ```js
        const fs = require('fs/promises');
        (async function (from, to) {
            try {
                await fs.rename(from, to);
                const stats = await fs.stat(to);
                console.log(`文件属性: ${JSON.stringify(stats)}`);
            } catch (error) {
                console.error('有一个错误：', error.message);
            }
        })('./tmp/world', './tmp/hello');
        ```

    * 打开关闭文件、查看文件属性

        ```js
        const fs = require('fs');
        fs.open('./tmp/hello/file.txt', 'r', (err, fd) => {
            if (err) throw err;
            fs.fstat(fd, (err, stat) => {
                if (err) throw err;
                // 使用文件属性。
                console.log(stat)
                // 始终关闭文件描述符！
                fs.close(fd, (err) => {
                    if (err) throw err;
                });
            });
        });
        ```

    * 文件目录
    
        打印目录下所有文件
        ```js
        const fs = require('fs');
        async function print(path) {
            const dir = await fs.promises.opendir(path);
            for await (const dirent of dir) {
                console.log(dirent.name);
            }
        }
        print('./').catch(console.error);
        ```

        创建目录
        ```js
        // 创建 `/目录1/目录2/目录3`，不管 `/目录1` 和 `/目录1/目录2` 是否存在。
        fs.mkdir('/目录1/目录2/目录3', { recursive: true }, (err) => {
            if (err) throw err;
        });
        ```

    * 监听文件变化

        ```js
        const fs = require('fs');
        fs.watch('./tmp/hello/file.txt', { encoding: 'buffer' }, (eventType, filename) => {
            if (filename) {
                console.log(eventType,filename);
                // 打印: <Buffer ...>
            }
        });
        ```

    * 追加文件内容(文件不存在自动创建)

        ```js
        const fs = require('fs');
        fs.open('./tmp/hello/file.txt', 'a', (err, fd) => {
            if (err) throw err;
            fs.appendFile(fd, '追加的数据', 'utf8', (err) => {
                fs.close(fd, (err) => {
                    if (err) throw err;
                });
                if (err) throw err;
            });
        });
        ```

        ```js
        const fs = require('fs');
        let fd;
        try {
            fd = fs.openSync('./tmp/hello/file.txt', 'a');
            fs.appendFileSync(fd, '追加的数据', 'utf8');
        } catch (err) {
            /* 处理错误 */
        } finally {
            if (fd !== undefined)
                fs.closeSync(fd);
        }
        ```

    * 修改文件权限

        ```js
        const fs = require('fs');
        fs.chmod('./tmp/hello/file.txt', 0o775, (err) => {
            if (err) throw err;
            console.log('文件 “file.txt” 的权限已被更改');
        });
        ```

        * 常量 八进制值 说明
            * fs.constants.S_IRUSR 0o400    所有者可读
            * fs.constants.S_IWUSR 0o200    所有者可写
            * fs.constants.S_IXUSR 0o100    所有者可执行或搜索
            * fs.constants.S_IRGRP 0o40     群组可读
            * fs.constants.S_IWGRP 0o20     群组可写
            * fs.constants.S_IXGRP 0o10     群组可执行或搜索
            * fs.constants.S_IROTH 0o4      其他人可读
            * fs.constants.S_IWOTH 0o2      其他人可写
            * fs.constants.S_IXOTH 0o1      其他人可执行或搜索

        * 更简单的方法是使用三个八进制数字的序列

            最左边的数字（示例中的 7）指定文件所有者的权限。 中间的数字（示例中的 6）指定群组的权限。 最右边的数字（示例中的 5）指定其他人的权限

            * 7 可读、可写、可执行
            * 6 可读、可写
            * 5 可读、可执行
            * 4 只读
            * 3 可写、可执行
            * 2 只写
            * 1 只可执行
            * 0 没有权限

    * 文件复制

        ```js
        const fs = require('fs');
        const { COPYFILE_EXCL } = fs.constants;
        function callback(err) {
            if (err) throw err;
            console.log('源文件已拷贝到目标文件');
        }
        // 默认情况下将创建或覆盖目标文件。
        fs.copyFile('./tmp/hello/file.txt', 'file.txt', callback);
        // 通过使用 COPYFILE_EXCL，如果目标文件存在，则操作将失败。
        fs.copyFile('./tmp/hello/file.txt', 'file.txt', COPYFILE_EXCL, callback);
        // 默认情况下将创建或覆盖目标文件。
        fs.copyFileSync('源文件.txt', '目标文件.txt');
        console.log('源文件已拷贝到目标文件');
        // 通过使用 COPYFILE_EXCL，如果目标文件存在，则操作将失败。
        fs.copyFileSync('源文件.txt', '目标文件.txt', COPYFILE_EXCL);
        ```

    * 文件截断、文件读取

        ```js
        const fs = require('fs');
        console.log(fs.readFileSync('./tmp/hello/file.txt', 'utf8'));
        // 获取要截断的文件的文件描述符。
        const fd = fs.openSync('./tmp/hello/file.txt', 'r+');
        // 将文件截断为前 4 个字节。
        fs.ftruncate(fd, 4, (err) => {
            console.log(fs.readFileSync('./tmp/hello/file.txt', 'utf8'));
        });
        fs.ftruncate(fd, 10, (err) => {
            console.log(fs.readFileSync('./tmp/hello/file.txt'));
        });
        ```

    * 文件删除

        ```js
        const fs = require('fs');
        fs.unlink('./tmp/hello/file.txt', (err) => {
            if (err) throw err;
            console.log('文件已被删除');
        });
        ```

### path文件路径

1. 参考链接：

   [path](http://nodejs.cn/api/path.html)

2. 详解：

    * 返回路径最后一部分

        ```js
        const path = require('path');

        // 在 POSIX 上:
        path.basename('C:\\temp\\myfile.html');
        // 返回: 'C:\\temp\\myfile.html'

        // 在 Windows 上:
        path.basename('C:\\temp\\myfile.html');
        // 返回: 'myfile.html'

        // 在 POSIX 和 Windows 上:
        path.win32.basename('C:\\temp\\myfile.html');
        // 返回: 'myfile.html'

        path.basename('/目录1/目录2/文件.html');
        // 返回: '文件.html'

        path.basename('/目录1/目录2/文件.html', '.html');
        // 返回: '文件'

        path.win32.basename('C:\\文件.html', '.html');
        // 返回: '文件'

        path.win32.basename('C:\\文件.HTML', '.html');
        // 返回: '文件.HTML'
        ```

    * 路径定界符

        POSIX冒号
        ```js
        console.log(process.env.PATH);
        // 打印: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

        process.env.PATH.split(path.delimiter);
        // 返回: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
        ```

        Windows分号
        ```js
        console.log(process.env.PATH);
        // 打印: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

        process.env.PATH.split(path.delimiter);
        // 返回: ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
        ```

    * 目录

        ```js
        path.dirname('/目录1/目录2/目录3');
        // 返回: '/目录1/目录2'
        ```

    * 扩展名

        ```js
        path.extname('index.html');
        // 返回: '.html'

        path.extname('index.coffee.md');
        // 返回: '.md'

        path.extname('index.');
        // 返回: '.'

        path.extname('index');
        // 返回: ''

        path.extname('.index');
        // 返回: ''

        path.extname('.index.md');
        // 返回: '.md'
        ```

    * 路径格式化

        POSIX
        ```js
        // 如果提供了 `dir`、 `root` 和 `base`，
        // 则返回 `${dir}${path.sep}${base}`。
        // `root` 会被忽略。
        path.format({
            root: '/ignored',
            dir: '/home/user/dir',
            base: 'file.txt'
        });
        // 返回: '/home/user/dir/file.txt'

        // 如果未指定 `dir`，则使用 `root`。 
        // 如果只提供 `root`，或 'dir` 等于 `root`，则将不包括平台分隔符。 
        // `ext` 将被忽略。
        path.format({
            root: '/',
            base: 'file.txt',
            ext: 'ignored'
        });
        // 返回: '/file.txt'

        // 如果未指定 `base`，则使用 `name` + `ext`。
        path.format({
            root: '/',
            name: 'file',
            ext: '.txt'
        });
        // 返回: '/file.txt'
        ```

        Windows
        ```js
        path.format({
            dir: 'C:\\path\\dir',
            base: 'file.txt'
        });
        // 返回: 'C:\\path\\dir\\file.txt'
        ```

    * 路径连接

        ```js
        path.join('/目录1', '目录2', '目录3/目录4', '目录5', '..');
        // 返回: '/目录1/目录2/目录3/目录4'

        path.join('目录1', {}, '目录2');
        // 抛出 'TypeError: Path must be a string. Received {}'
        ```

    * 路径规范化

        ```js
        path.normalize('/foo/bar//baz/asdf/quux/..');
        // 返回: '/foo/bar/baz/asdf'
        path.normalize('C:\\temp\\\\foo\\bar\\..\\');
        // 返回: 'C:\\temp\\foo\\'
        path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
        // 返回: 'C:\\temp\\foo\\bar'
        ```

    * 路径解析

        ```js
        path.parse('/目录1/目录2/文件.txt');
        // 返回:
        // { root: '/',
        //   dir: '/目录1/目录2',
        //   base: '文件.txt',
        //   ext: '.txt',
        //   name: '文件' }
        path.parse('C:\\目录1\\目录2\\文件.txt');
        // 返回:
        // { root: 'C:\\',
        //   dir: 'C:\\目录1\\目录2',
        //   base: '文件.txt',
        //   ext: '.txt',
        //   name: '文件' }
        ```

    * from 到 to 的相对路径

        ```js
        path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
        // 返回: '../../impl/bbb'
        path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
        // 返回: '..\\..\\impl\\bbb'
        ```

    * 路径片段的序列解析为绝对路径

        ```js
        path.resolve('/目录1/目录2', './目录3');
        // 返回: '/目录1/目录2/目录3'

        path.resolve('/目录1/目录2', '/目录3/目录4/');
        // 返回: '/目录3/目录4'

        path.resolve('目录1', '目录2/目录3/', '../目录4/文件.gif');
        // 如果当前工作目录是 /目录A/目录B，
        // 则返回 '/目录A/目录B/目录1/目录2/目录4/文件.gif'
        ```

    * 路径片段分隔符

        POSIX 上是 /
        ```js
        'foo/bar/baz'.split(path.sep);
        // 返回: ['foo', 'bar', 'baz']
        ```

        Windows 上是 \
        ```js
        'foo\\bar\\baz'.split(path.sep);
        // 返回: ['foo', 'bar', 'baz']
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

### express中app.get、app.use、app.all的区别

1. 参考链接：

   [面试官问你关于node的那些事（进阶篇）](https://juejin.im/post/5ef57aca6fb9a07e5f516814)

2. 详解：

    ```js
    const express = require('express');
    const app = express();

    app.use(middleware);

    app.use("/user",function(req,res,next){
        console.log(1);
        next();
    })

    app.all("/user",function(req,res){
        res.send('2');
    })

    ...
    ```

    * app.use

        用来调用中间件的方法,通常不处理请求和响应，只处理输入数据，并将其交给队列中的下一个处理程序,上面代码只要路径以 /user 开始即可匹配。

    * app.all

        路由中指代所有的请求方式，用作路由处理，匹配完整路径，在app.use之后 可以理解为包含了app.get、app.post等的定义。

### express中response常用方法

1. 参考链接：

   [面试官问你关于node的那些事（进阶篇）](https://juejin.im/post/5ef57aca6fb9a07e5f516814)

2. 详解：

    * res.end()

        如果服务端没有数据回传给客户端则可以直接用res.end返回，以此来结束响应过程

    * res.send(body)

        如果服务端有数据可以使用res.send,body参数可以是一个Buffer对象，一个String对象或一个Array

    * res.render(view,locals, callback)

        用来渲染模板文件:

        * view：模板的路径
        * locals：渲染模板时传进去的本地变量
        * callback：如果定义了回调函数，则当渲染工作完成时才被调用，返回渲染好的字符串（正确）或者错误信息

        配置
        
        ```js
        app.set('views', path.join(__dirname, 'views')); // views：模版文件存放的位置，默认是在项目根目录下
        app.set('view engine', 'ejs'); // view engine：使用什么模版引擎
        ```

    * res.redirect(httpCode, url)

        重定义到path所指定的URL，同时也可以重定向时定义好HTTP状态码（默认为302）

### node利用多核CPU创建集群

1. 参考链接：

   [面试官问你关于node的那些事（进阶篇）](https://juejin.im/post/5ef57aca6fb9a07e5f516814)

2. 详解：

    cluster模块用于nodejs多核处理，同时可以通过它来搭建一个用于负载均衡的node服务集群。

    ```js
    const cluster = require('cluster');
    const os = require('os');
    const express = require('express');
    const path = require('path');
    const ejs = require('ejs');
    const app = express();

    const numCPUs = os.cpus().length;

    if(cluster.isMaster){
        console.log(`Master ${process.pid} is running`);
        for(let i = 0;i < numCPUs;i++){
            cluster.fork();//产生工作进程,只能主进程调用
        }
        cluster.on('exit',(worker,code,signal)=>{
            console.log(`worker${worker.process.pid} exit.`)
        });
        cluster.on('fork',(worker)=>{
            console.log(`fork：worker${worker.id}`)
        });
        cluster.on('listening',(worker,addr)=>{
            console.log(`worker${worker.id} listening on ${addr.address}:${addr.port}`)
        });
        cluster.on('online',(worker)=>{
            console.log(`worker${worker.id} is online now`)
        });
    }
    else{
        app.set('views',path.join(__dirname,'views'));
        app.set('views engine','ejs');

        app.get('/',function(req,res,next){
            res.render('index.ejs',{title:'ejs'});
        });
        app.listen(3000,function(){
            console.log(`worker ${process.pid} started`);
        });
    }
    ```

### node是支持https

1. 参考链接：

   [面试官问你关于node的那些事（进阶篇）](https://juejin.im/post/5ef57aca6fb9a07e5f516814)

2. 详解：

    ```js
    const express = require('express');
    const https = require('https');
    const fs = require('fs');

    const options = {
        key: fs.readFileSync('./keys/server.key'),
        cert: fs.readFileSync('./keys/server.crt')
    }

    const app = express();
    const httpsServer = https.createServer(options,app);

    app.get('/',function(req,res,next){
        res.send('1');
    });

    httpServer.listen(3000);
    ```

### node和客户端解决跨域的问题

1. 参考链接：

   [面试官问你关于node的那些事（进阶篇）](https://juejin.im/post/5ef57aca6fb9a07e5f516814)

2. 详解：

    ```js
    const express = require('express');
    const app = express();

    app.all('*',function(req,res,next){
        res.header("Assess-Control-Allow-Origin","*");
        res.header("Assess-Control-Allow-Headers","X-Requested-With");
        res.header("Assess-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Content-Type","application/json;charset=utf-8");
        next();
    });
    ```

### node应用内存泄漏处理

1. 参考链接：

   [面试官问你关于node的那些事（进阶篇）](https://juejin.im/post/5ef57aca6fb9a07e5f516814)

2. 详解：

    * 现象

        内存持续占用过高，服务器响应慢，程序奔溃

    * 原因

        * 全局变量没有手动销毁，因为全局变量不会被回收
        * 闭包：闭包中的变量被全局对象引用，则闭包中的局部变量不能释放
        * 监听事件添加后，没有移除，会导致内存泄漏

    * 检测

        * 通过内存快照，可以使用node-heapdump [官方文档](https://github.com/bnoordhuis/node-heapdump)获得内存快照进行对比，查找内存溢出
        * 可视化内存泄漏检查工具 Easy-Monitor [官方文档](https://github.com/hyj1991/easy-monitor#readme)

### 两个node程序交互

1. 参考链接：

   [面试官问你关于node的那些事（进阶篇）](https://juejin.im/post/5ef57aca6fb9a07e5f516814)

2. 详解：

    通过fork，原理是子程序用process.on来监听父程序的消息，用 process.send给子程序发消息，父程序里用child.on,child.send进行交互，来实现父进程和子进程互相发送消息

    ```js
    //parent.js
    const cp = require('child_process');
    const child = cp.fork('./children.js');
    child.on('message',function(msg){
        console.log(msg);
    });
    child.send('1');

    //children.js
    process.on('message',function(msg){
        console.log(msg);
        process.send('2');
    });
    ```

    child_process模块:提供了衍生子进程的功能，包括cluster底层实现

    child_process模块主要包括以下几个异步进程函数:

    1. fork：实现父进程和子进程互相发送消息的方法，通过fork可以在父进程和子进程之间开放一个IPC通道，使得不同的node进程间可以进行消息通信。
    2.exec: 衍生一个 shell 并在该 shell 中运行命令，当完成时则将stdout 和 stderr 传给回调函数
    3. spawn

### process

1. 参考链接：

   [一篇文章构建你的 NodeJS 知识体系](https://juejin.im/post/6844903767926636558#heading-13)

2. 详解：

    ```js
    //查看 PATH
    console.log(process.env.PATH.split(':').join('\n'));
    //设置 PATH
    process.env.PATH += ':/a_new_path_to_executables';
    //获取信息
    // 获取平台信息
    process.arch // x64
    process.platform // darwin
    // 获取内存使用情况
    process.memoryUsage();
    // 获取命令行参数
    process.argv
    //process.nextTick 方法把一个回调放在下一次时间轮询队列的头上，结果比 setTimeout 更有效率
    const EventEmitter = require('events').EventEmitter;

    function complexOperations() {
        const events = new EventEmitter();

        process.nextTick(function () {
            events.emit('success');
        });

        return events;
    }

    complexOperations().on('success', function () {
        console.log('success!');
    });
    ```

### 获取本地IP

1. 参考链接：

   [一篇文章构建你的 NodeJS 知识体系](https://juejin.im/post/6844903767926636558#heading-13)

2. 详解：

    ```js
    function get_local_ip() {
        const interfaces = require('os').networkInterfaces();
        let IPAdress = '';
        for (const devName in interfaces) {
            const iface = interfaces[devName];
            for (let i = 0; i < iface.length; i++) {
                const alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    IPAdress = alias.address;
                }
            }
        }
        return IPAdress;
    }
    ```

### crypto

1. 参考链接：

   [一篇文章构建你的 NodeJS 知识体系](https://juejin.im/post/6844903767926636558#heading-13)

   [crypto](http://nodejs.cn/api/crypto.html)

2. 详解：
    
    * 公钥加密私钥解密

        生成公钥私钥
        ```txt
        利用 openssl 生成公钥私钥 
        生成公钥：openssl genrsa -out rsa_private_key.pem 1024 
        生成私钥：openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
        ```

        crypto 使用
        ```js
        const crypto = require('crypto');
        const fs = require('fs');

        const publicKey = fs.readFileSync(`${__dirname}/rsa_public_key.pem`).toString('ascii');
        const privateKey = fs.readFileSync(`${__dirname}/rsa_private_key.pem`).toString('ascii');
        console.log(publicKey);
        console.log(privateKey);
        const data = 'Chenng';
        console.log('content: ', data);

        //公钥加密
        const encodeData = crypto.publicEncrypt(
            publicKey,
            Buffer.from(data),
        ).toString('base64');
        console.log('encode: ', encodeData);

        //私钥解密
        const decodeData = crypto.privateDecrypt(
            privateKey,
            Buffer.from(encodeData, 'base64'),
        );
        console.log('decode: ', decodeData.toString());
        ```

        生成公钥私钥
        ```js
        const { generateKeyPair } = require('crypto');
        generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'top secret'
            }
        }, (err, publicKey, privateKey) => {
            // Handle errors and use the generated key pair.
            console.log(publicKey, privateKey)
        });
        ```

        ```js
        const { generateKeyPairSync } = require('crypto');
        const { publicKey, privateKey } = generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'top secret'
            }
        });
        ```

        pbkdf2 伪随机函数以导出密钥
        ```js
        const crypto = require('crypto');
        crypto.DEFAULT_ENCODING = 'hex';
        crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', (err, derivedKey) => {
            if (err) throw err;
            console.log(derivedKey);  // '3745e48...aa39b34'
        });
        ```

        ```js
        const crypto = require('crypto');
        crypto.DEFAULT_ENCODING = 'hex';
        const key = crypto.pbkdf2Sync('secret', 'salt', 100000, 512, 'sha512');
        console.log(key);  // '3745e48...aa39b34'
        ```

    * Cipher加密

        使用 Cipher 对象作为流
        ```js
        const crypto = require('crypto');

        const algorithm = 'aes-192-cbc';
        const password = '用于生成密钥的密码';
        // 密钥长度取决于算法。 
        // 在此示例中，对于 aes192，它是 24 个字节（192 位）。
        // 改为使用异步的 `crypto.scrypt()`。
        const key = crypto.scryptSync(password, '盐值', 24);
        // 使用 `crypto.randomBytes()` 生成随机的 iv 而不是此处显示的静态的 iv。
        const iv = Buffer.alloc(16, 0); // 初始化向量。

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encrypted = '';
        cipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = cipher.read())) {
                encrypted += chunk.toString('hex');
            }
        });
        cipher.on('end', () => {
            console.log(encrypted);
            // 9d47959b80d428936beef61216ef0b7653b5d23a670e082bd739f6cebcb6038f
        });

        cipher.write('要加密的数据');
        cipher.end();
        ```

        使用 Cipher 和管道流
        ```js
        const crypto = require('crypto');
        const fs = require('fs');

        const algorithm = 'aes-192-cbc';
        const password = '用于生成密钥的密码';
        // 改为使用异步的 `crypto.scrypt()`。
        const key = crypto.scryptSync(password, '盐值', 24);
        // 使用 `crypto.randomBytes()` 生成随机的 iv 而不是此处显示的静态的 iv。
        const iv = Buffer.alloc(16, 0); // 初始化向量。

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        const input = fs.createReadStream('要加密的数据.txt');
        const output = fs.createWriteStream('加密后的数据.enc');

        input.pipe(cipher).pipe(output);
        ```

        使用 cipher.update() 和 cipher.final()
        ```js
        const crypto = require('crypto');

        const algorithm = 'aes-192-cbc';
        const password = '用于生成密钥的密码';
        // 改为使用异步的 `crypto.scrypt()`。
        const key = crypto.scryptSync(password, '盐值', 24);
        // 使用 `crypto.randomBytes()` 生成随机的 iv 而不是此处显示的静态的 iv。
        const iv = Buffer.alloc(16, 0); // 初始化向量。

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encrypted = cipher.update('要加密的数据', 'utf8', 'hex');
        encrypted += cipher.final('hex');
        console.log(encrypted);
        // 9d47959b80d428936beef61216ef0b7653b5d23a670e082bd739f6cebcb6038f
        ```

    * Decipher 解密

        使用 Decipher 对象作为流
        ```js
        const crypto = require('crypto');

        const algorithm = 'aes-192-cbc';
        const password = '用于生成密钥的密码';
        // 密钥长度取决于算法。 
        // 在此示例中，对于 aes192，它是 24 个字节（192 位）。
        // 改为使用异步的 `crypto.scrypt()`。
        const key = crypto.scryptSync(password, '盐值', 24);
        // IV 通常与密文一起传递。
        const iv = Buffer.alloc(16, 0); // 初始化向量。

        const decipher = crypto.createDecipheriv(algorithm, key, iv);

        let decrypted = '';
        decipher.on('readable', () => {
            while (null !== (chunk = decipher.read())) {
                decrypted += chunk.toString('utf8');
            }
        });
        decipher.on('end', () => {
            console.log(decrypted);
            // 要加密的数据
        });

        // 使用相同的算法、密钥和 iv 进行加密。
        const encrypted = '9d47959b80d428936beef61216ef0b7653b5d23a670e082bd739f6cebcb6038f';
        decipher.write(encrypted, 'hex');
        decipher.end();
        ```

        使用 Decipher 和管道流
        ```js
        const crypto = require('crypto');
        const fs = require('fs');

        const algorithm = 'aes-192-cbc';
        const password = '用于生成密钥的密码';
        // 改为使用异步的 `crypto.scrypt()`。
        const key = crypto.scryptSync(password, '盐值', 24);
        // IV 通常与密文一起传递。
        const iv = Buffer.alloc(16, 0); // 初始化向量。

        const decipher = crypto.createDecipheriv(algorithm, key, iv);

        const input = fs.createReadStream('要解密的数据.enc');
        const output = fs.createWriteStream('解密后的数据.js');

        input.pipe(decipher).pipe(output);
        ```

        使用 decipher.update() 和 decipher.final()
        ```js
        const crypto = require('crypto');

        const algorithm = 'aes-192-cbc';
        const password = '用于生成密钥的密码';
        // 改为使用异步的 `crypto.scrypt()`。
        const key = crypto.scryptSync(password, '盐值', 24);
        // IV 通常与密文一起传递。
        const iv = Buffer.alloc(16, 0); // 初始化向量。

        const decipher = crypto.createDecipheriv(algorithm, key, iv);

        // 使用相同的算法、密钥和 iv 进行加密。
        const encrypted =
        '9d47959b80d428936beef61216ef0b7653b5d23a670e082bd739f6cebcb6038f';
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        console.log(decrypted);
        // 打印: 要加密的数据
        ```

    * DiffieHellman 键交换

        普通
        ```js
        const crypto = require('crypto');

        // 生成 Alice 的密钥。
        const alice = crypto.createDiffieHellman(2048);
        const aliceKey = alice.generateKeys();

        // 生成 Bob 的密钥。
        const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
        const bobKey = bob.generateKeys();

        // 交换并生成密钥。
        const aliceSecret = alice.computeSecret(bobKey);
        const bobSecret = bob.computeSecret(aliceKey);

        // 完成。
        console.log(aliceSecret.toString('hex')==bobSecret.toString('hex'));
        ```

        椭圆曲线 Elliptic Curve Diffie-Hellman（ECDH）键交换
        ```js
        const crypto = require('crypto');

        // 生成 Alice 的密钥。
        const alice = crypto.createECDH('secp521r1');
        const aliceKey = alice.generateKeys();

        // 生成 Bob 的密钥。
        const bob = crypto.createECDH('secp521r1');
        const bobKey = bob.generateKeys();

        // 交换并生成密钥。
        const aliceSecret = alice.computeSecret(bobKey);
        const bobSecret = bob.computeSecret(aliceKey);

        // 完成。
        console.log(aliceSecret.toString('hex')==bobSecret.toString('hex'));
        ```

        解压
        ```js
        const { createECDH, ECDH } = require('crypto');

        const ecdh = createECDH('secp256k1');
        ecdh.generateKeys();

        const compressedKey = ecdh.getPublicKey('hex', 'compressed');

        const uncompressedKey = ECDH.convertKey(compressedKey, 'secp256k1', 'hex', 'hex', 'uncompressed');

        // The converted key and the uncompressed public key should be the same
        console.log(uncompressedKey,uncompressedKey === ecdh.getPublicKey('hex'));
        ```

    * Hash

        用于创建数据的哈希摘要，不带key，可带salt

        使用 Hash 对象作为流
        ```js
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');

        hash.on('readable', () => {
            // 哈希流只会生成一个元素。
            const data = hash.read();
            if (data) {
                console.log(data.toString('hex'));
                // 打印:
                //   164345eba9bccbafb94b27b8299d49cc2d80627fc9995b03230965e6d8bcbf56
            }
        });

        hash.write('要创建哈希摘要的数据');
        hash.end();
        ```

        使用 Hash 和管道流
        ```js
        const crypto = require('crypto');
        const fs = require('fs');
        const hash = crypto.createHash('sha256');

        const input = fs.createReadStream('要创建哈希摘要的数据.txt');
        input.pipe(hash).setEncoding('hex').pipe(process.stdout);
        ```

        使用 hash.update() 和 hash.digest()
        ```js
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');

        hash.update('要创建哈希摘要的数据');
        console.log(hash.digest('hex'));
        // 164345eba9bccbafb94b27b8299d49cc2d80627fc9995b03230965e6d8bcbf56
        ```

    * HMAC

        用于创建加密的 HMAC 摘要，带key，更安全

        使用 Hmac 对象作为流
        ```js
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', '密钥');

        hmac.on('readable', () => {
            // 哈希流只会生成一个元素。
            const data = hmac.read();
            if (data) {
                console.log(data.toString('hex'));
                // 打印:
                //   d0b5490ab4beb8e6545fe284f484d0d595e46086cb8e6ef2291af12ac684102f
            }
        });

        hmac.write('要创建哈希的数据');
        hmac.end();
        ```

        使用 Hmac 和管道流
        ```js
        const crypto = require('crypto');
        const fs = require('fs');
        const hmac = crypto.createHmac('sha256', '密钥');

        const input = fs.createReadStream('要创建哈希的数据.txt');
        input.pipe(hmac).pipe(process.stdout);
        ```

        使用 hmac.update() 和 hmac.digest()
        ```js
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', '密钥');

        hmac.update('要创建哈希的数据');
        console.log(hmac.digest('hex'));
        // d0b5490ab4beb8e6545fe284f484d0d595e46086cb8e6ef2291af12ac684102f
        ```

    * Sign 生成签名

        使用 Sign 和 Verify 对象作为流
        ```js
        const crypto = require('crypto');

        const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
            namedCurve: 'sect239k1'
        });

        const sign = crypto.createSign('SHA256');
        sign.write('要生成签名的数据');
        sign.end();
        const signature = sign.sign(privateKey, 'hex');

        const verify = crypto.createVerify('SHA256');
        verify.write('要生成签名的数据');
        verify.end();
        console.log(verify.verify(publicKey, signature, 'hex'));
        // 打印 true
        ```

        使用 sign.update() 和 verify.update()
        ```js
        const crypto = require('crypto');

        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
        });

        const sign = crypto.createSign('SHA256');
        sign.update('要生成签名的数据');
        sign.end();
        const signature = sign.sign(privateKey);

        const verify = crypto.createVerify('SHA256');
        verify.update('要生成签名的数据');
        verify.end();
        console.log(verify.verify(publicKey, signature));
        // 打印: true
        ```

    * 生成加密强伪随机数据

        ```js
        // 异步的。
        const crypto = require('crypto');
        crypto.randomBytes(256, (err, buf) => {
            if (err) throw err;
            console.log(`${buf.length} 位的随机数据: ${buf.toString('hex')}`);
        });
        ```

        ```js
        // 同步的。
        const buf = crypto.randomBytes(256);
        console.log(`${buf.length} 位的随机数据: ${buf.toString('hex')}`);
        ```

        ```js
        const a = new Uint32Array(10);
        console.log(Buffer.from(crypto.randomFillSync(a).buffer, a.byteOffset, a.byteLength).toString('hex'));

        const b = new Float64Array(10);
        console.log(Buffer.from(crypto.randomFillSync(b).buffer, b.byteOffset, b.byteLength).toString('hex'));

        const c = new DataView(new ArrayBuffer(10));
        console.log(Buffer.from(crypto.randomFillSync(c).buffer, c.byteOffset, c.byteLength).toString('hex'));
        ```

        ```js
        const a = new Uint32Array(10);
        crypto.randomFill(a, (err, buf) => {
            if (err) throw err;
            console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength).toString('hex'));
        });

        const b = new Float64Array(10);
        crypto.randomFill(b, (err, buf) => {
            if (err) throw err;
            console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength).toString('hex'));
        });

        const c = new DataView(new ArrayBuffer(10));
        crypto.randomFill(c, (err, buf) => {
            if (err) throw err;
            console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength).toString('hex'));
        });
        ```

    * 随机整数

        ```js
        // Asynchronous
        crypto.randomInt(3, (err, n) => {
            if (err) throw err;
            console.log(`Random number chosen from (0, 1, 2): ${n}`);
        });
        // Synchronous
        const n = crypto.randomInt(3);
        console.log(`Random number chosen from (0, 1, 2): ${n}`);
        // With `min` argument
        const n = crypto.randomInt(1, 7);
        console.log(`The dice rolled: ${n}`);
        ```

### koa1和koa2区别

1. 参考链接：

   [koa](https://www.liaoxuefeng.com/wiki/1022910821149312/1023025933764960)

   [koa2、koa1、express比较](https://www.jianshu.com/p/a518c3d9c56d)

2. 详解：

    koa2与koa1的最大区别是koa2实现异步是通过async/awaite，koa1实现异步是通过generator/yield，而express实现异步是通过回调函数的方式

    在koa中，一切的流程都是中间件，数据流向遵循洋葱模型，先入后出，是按照类似堆栈的方式组织和执行的

    express
    ```js
    var express = require('express');
    var app = express();

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });

    app.get('/test', function (req, res) {
        fs.readFile('/file1', function (err, data) {
            if (err) {
                res.status(500).send('read file1 error');
            }
            fs.readFile('/file2', function (err, data) {
                if (err) {
                    res.status(500).send('read file2 error');
                }
                res.type('text/plain');
                res.send(data);
            });
        });
    });
    ```

    koa1
    ```js
    var koa = require('koa');
    var app = koa();

    app.use('/test', function *() {
        yield doReadFile1();
        var data = yield doReadFile2();
        this.body = data;
    });

    app.listen(3000);
    ```

    koa2
    ```js
    app.use(async (ctx, next) => {
        await next();
        var data = await doReadFile();
        ctx.response.type = 'text/plain';
        ctx.response.body = data;
    });
    ```

### koa2项目结构

1. 参考链接：

   [nodeJs 进阶Koa项目结构详解](https://www.cnblogs.com/wangjiahui/p/12660093.html)

   [koa生成器一键生成koa项目](https://www.jianshu.com/p/8611da03101e)

   [koa2目录结构分享及制作](https://www.jianshu.com/p/8cf2dd99f222)

2. 详解：

    npm 生成
    ```txt
    npm install koa-generator -g
    koa2 projectName
    ```

    项目结构
    ```txt
    bin
        www             --入口文件
    node_modules
    app
        controller      --接收请求处理逻辑
        model           --数据库表结构
        service         --数据库CRUD操作
    config              --配置文件，如数据库连接密码
    middleware          --中间件
    public
        images
        javascripts
        stylesheets
    routes              --路由
        ***.js
    views               --视图
        ***.pug
    app.js              --主程序配置
    package.json
    ```

### nodejs特点与应用场景

1. 参考链接：

   [浅谈Node.js 特点与应用场景](https://mp.weixin.qq.com/s/MozQiOu2kTbQm9c9BaJSRg)

2. 详解：

* 特点

    1. 非阻塞异步io

        访问数据库取得数据代码放在回调函数中，不会产生阻塞

    2. 单线程

        在 Java、PHP 或者 .net 等服务器端语言中，会为每一个客户端连接创建一个新的线程。而每个线程需要耗费大约2MB内存。也就是说，理论上，一个8GB内存的服务器可以同时连接的最大用户数为4000个左右。要让Web应用程序支持更多的用户，就需要增加服务器的数量，而 Web 应用程序的硬件成本当然就上升了。

        Node.js不为每个客户连接创建一个新的线程，而仅仅使用一个线程。当有用户连接了，就触发一个内部事件，通过非阻塞I/O、事件驱动机制，让 Node.js 程序宏观上也是并行的。使用 Node.js ，一个8GB内存的服务器，可以同时处理超过4万用户的连接。

        另外，单线程带来的好处，操作系统完全不再有线程创建、销毁的时间开销。

    3. 事件驱动

        事件循环机制

    4. 跨平台

* 缺点与解决方案

    1. 单线程

        * 无法利用多核CPU

            pm2，forever，child_process创建多进程
            
            cluster主从模式

        * 错误会引起整个应用退出无法继续调用异步I/O

            Nginx反向代理，负载均衡，开多个进程，绑定多个端口

            pm2，forever实现进程监控，错误自动重启

            开多个进程监听同一个端口，使用cluster

            child_process,创建多子线程监听一个端口

        * 大量计算占用CPU导致无法继续调用异步I/O

            拆分成多个子线程计算

    2. 调试困难，没stack trace

    3. npm包良莠不齐

* 应用场景

    善于I/O，不善于计算，应用程序内部并不需要进行非常复杂的处理的时候，Node.js非常适合。Node.js也非常适合与websocket配合，开发长连接的实时交互应用程序。

    1. 用户表单收集系统、后台管理系统、实时交互系统、考试系统、联网软件、高并发量的web应用程序
    2. 基于web、canvas等多人联网游戏
    3. 基于web的多人实时聊天客户端、聊天室、图文直播
    4. 单页面浏览器应用程序
    5. 操作数据库、为前端和移动端提供基于json的API

### child_process

1. 参考链接：

   [前端面试知识点汇总](https://juejin.cn/post/6905635299897032718)

   [nodejs中 spawn 、fork、exec、execFile的区别](https://www.cnblogs.com/eret9616/p/11105840.html)

2. 详解：

* spawn、exec、execFile、fork

这四个都可以用来创建子进程

fork与spawn类似，spawn和fork都是返回一个基于流的子进程对象，不同在于fork创建子进程需要执行js文件，返回的子进程对象可以和父进程对象进行通信，通过send和on方法。

exec和execFile可以在回调中拿到返回的buffer的内容（执行成功或失败的输出）

exec是创建子shell去执行命令，用来直接执行shell命令  。execFile是去创建任意你指定的文件的进程

spawn与exec和execFile不同的是，后两者创建时可以指定timeout属性设置超时时间，一旦进程超时就会被杀死；

exec与execFile不同的是，exec执行的是已有命令，execFile执行的是文件。

* pm2

pm2常用命令：参考:koa2Example->生产环境pm2相关

-i 参数，启动多线程；watch，-w，监听文件改变

pm2配置文件，可以配置多个app，apps数组，启动 pm2 start pm2.connfig.js —only=one-app-name

### Nodemailer发送邮件

1. 参考链接：

   [NODEMAILER](https://nodemailer.com/about/)

   [如何使用nodejs自动发送邮件?](https://juejin.cn/post/6930170631031881741)

2. 详解：

    * 版本要求

        Node.js v6.0.0或更高版本

    * 优点

        * 具有零依赖关系的单一模块, 代码容易审核，没有死角
        * Unicode支持使用任何字符，包括表情符号💪
        * 邮件内容既支持普通文本, 还支持自定义html
        * 支持自定义附件
        * 支持安全可靠的SSL/STARTTLS邮件发送
        * 支持自定义插件处理邮件消息

    * 案例

        ```js
        "use strict";
        const nodemailer = require("nodemailer");

        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // 如果你没有一个真实邮箱的话可以使用该方法创建一个测试邮箱
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        // 创建Nodemailer传输器 SMTP 或者 其他 运输机制
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: "bar@example.com, baz@example.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().catch(console.error);
        ```

    * 邮箱配置

        * 开启SMTP服务
        * 授权管理：获取SMTP服务器和密码

    * 消息配置

        * from 发件人的电子邮件地址。所有电子邮件地址都可以是纯'sender@server.com“或格式化”‘发送者名称’sender@server.com'
        * to 逗号分隔的列表或收件人的电子邮件地址的排列
        * cc 逗号分隔的列表或将显示在“抄送”字段中的收件人电子邮件地址数组
        * bcc 逗号分隔的列表或将显示在“密件抄送：”字段中的收件人电子邮件地址数组
        * subject 电子邮件的主题
        * text 消息的文本内容
        * html 消息的html内容, 如果定义了html, 将忽略text
        * attachments 附件内容

### domain模块捕捉异常

1. 参考链接：

   [Node.js 异常捕获的一些实践](http://www.alloyteam.com/2013/12/node-js-series-exception-caught/)

   [Node.js 异步异常的处理与domain模块解析](http://deadhorse.me/nodejs/2013/04/13/exception_and_domain.html)

2. 详解：

    * try/catch的问题

        * try/catch 无法捕捉异步回调里的异常
        * Node.js 原生提供 uncaughtException 事件挂到 process 对象上，用于捕获所有未处理的异常，而不是 catch 块
        * uncaughtException 虽然能够捕获异常，但是此时错误的上下文已经丢失，即使看到错误也不知道哪儿报的错
        * 一旦 uncaughtException 事件触发，整个 node 进程将 crash 掉

    * 使用 domain 模块捕捉异常

        * Node.js v0.8 版本发布了一个 domain（域）模块，专门用于处理异步回调的异常
        * 被 domain 捕获到的错误，uncaughtException 回调并不会执行

    * 样例

        ```js
        process.on('uncaughtException', function(err) {
            console.error('Error caught in uncaughtException event:', err);
        });
        
        var d = domain.create();
        
        //domain 没有绑定 error 事件的话，node 会直接抛出错误，即使 uncaughtException 绑定了也没有用
        d.on('error', function(err) {
            console.error('Error caught by domain:', err);
        });
        
        d.run(function() {
            process.nextTick(function() {
                fs.readFile('non_existent.js', function(err, str) {
                    if(err) throw err;
                    else console.log(str);
                });
            });
        });

        fs.readFile('non_existent.js', d.bind(function(err, buf) {
            if(err) throw err;
            else res.end(buf.toString());
        }));

        fs.readFile('non_existent.js', d.intercept(function(buf) {
            console.log(buf);
        }));
        ```

        ```js
        var domain = require('domain');

        //引入一个domain的中间件，将每一个请求都包裹在一个独立的domain中
        //domain来处理异常
        app.use(function (req,res, next) {
            var d = domain.create();
            //监听domain的错误事件
            d.on('error', function (err) {
                logger.error(err);
                res.statusCode = 500;
                res.json({sucess:false, messag: '服务器异常'});
                d.dispose();
            });

            d.add(req);
            d.add(res);
            d.run(next);
        });

        app.get('/index', function (req, res) {
            //处理业务
        });
        ```

        对于事件分发器，应该养成先绑定（on()或 addEventListener()）后触发（emit()）的习惯。在执行事件回调的时候，对于有可能抛异常的情况，应该把 emit 放到 domain 里去
        ```js
        var d = domain.create();
        var e = new events.EventEmitter();
        
        d.on('error', function(err) {
            console.error('Error caught by domain:', err);
        });
        
        e.on('data', function(err) {
            if(err) throw err;
        });
        
        if(Math.random() > 0.5) {
            d.run(function() {
                e.emit('data', new Error('Error in domain runtime.'));
            });
        } else {
            e.emit('data', new Error('Error without domain.'));
        }
        ```

    * 测试

        ```js
        // domain was not exists by default
        should.not.exist(process.domain);
        
        var d = domain.create();
        
        d.on('error', function(err) {
            console.log(err);
        });
        
        d.enter(); // makes d the current domain
        
        process.domain.should.be.an.Object;
        process.domain.should.equal(domain.active);
        
        d.exit(); // makes d inactive
        
        should.not.exist(process.domain);
        ```

### nodejs请求响应

1. 参考链接：

   [https](http://nodejs.cn/api/https.html)

   [http2](http://nodejs.cn/api/http2.html)

   [http](http://nodejs.cn/api/http.html)

2. 详解：

    * https

        * 创建服务器

            ```js
            // curl -k https://localhost:8000/
            const https = require('https');
            const fs = require('fs');

            const options = {
                key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
                cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem');
            };

            https.createServer(options, (req, res) => {
                res.writeHead(200);
                res.end('你好，世界\n');
            }).listen(8000);
            ```

            ```js
            const https = require('https');
            const fs = require('fs');

            const options = {
                pfx: fs.readFileSync('test/fixtures/test_cert.pfx'),
                passphrase: '密码'
            };

            https.createServer(options, (req, res) => {
                res.writeHead(200);
                res.end('你好，世界\n');
            }).listen(8000);
            ```

        * get请求

            ```js
            const https = require('https');

            https.get('https://encrypted.google.com/', (res) => {
                console.log('状态码:', res.statusCode);
                console.log('请求头:', res.headers);

                res.on('data', (d) => {
                    process.stdout.write(d);
                });

            }).on('error', (e) => {
                console.error(e);
            });
            ```

        * 请求

            tls.connect()
            ```js
            const https = require('https');

            const options = {
                hostname: 'encrypted.google.com',
                port: 443,
                path: '/',
                method: 'GET'
            };

            const req = https.request(options, (res) => {
                console.log('状态码:', res.statusCode);
                console.log('请求头:', res.headers);

                res.on('data', (d) => {
                    process.stdout.write(d);
                });
            });

            req.on('error', (e) => {
                console.error(e);
            });
            req.end();
            ```

            ```js
            const options = {
                hostname: 'encrypted.google.com',
                port: 443,
                path: '/',
                method: 'GET',
                key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
                cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
            };
            options.agent = new https.Agent(options);

            const req = https.request(options, (res) => {
                // ...
            });
            ```

            不使用agent
            ```js
            const options = {
                hostname: 'encrypted.google.com',
                port: 443,
                path: '/',
                method: 'GET',
                key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
                cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem'),
                agent: false
            };

            const req = https.request(options, (res) => {
                // ...
            });
            ```

            url作为option
            ```js
            const options = new URL('https://abc:xyz@example.com');

            const req = https.request(options, (res) => {
                // ...
            });
            ```

            固定证书指纹或公钥
            ```js
            const tls = require('tls');
            const https = require('https');
            const crypto = require('crypto');

            function sha256(s) {
                return crypto.createHash('sha256').update(s).digest('base64');
            }
            const options = {
                hostname: 'github.com',
                port: 443,
                path: '/',
                method: 'GET',
                checkServerIdentity: function (host, cert) {
                    // 确保将证书颁发给所连接的主机。
                    const err = tls.checkServerIdentity(host, cert);
                    if (err) {
                        return err;
                    }

                    // 固定公钥，类似于固定的 HPKP pin-sha25。
                    const pubkey256 = 'pL1+qb9HTMRZJmuC/bB/ZI9d302BYrrqiVuRyW+DGrU=';
                    if (sha256(cert.pubkey) !== pubkey256) {
                        const msg = '证书验证错误: ' +
                            `'${cert.subject.CN}' 的公钥` +
                            '与固定的指纹不符';
                        return new Error(msg);
                    }

                    // 固定确切的证书，而不是公钥。
                    const cert256 = '25:FE:39:32:D9:63:8C:8A:FC:A1:9A:29:87:' +
                        'D8:3E:4C:1D:98:DB:71:E4:1A:48:03:98:EA:22:6A:BD:8B:93:16';
                    if (cert.fingerprint256 !== cert256) {
                        const msg = '证书验证错误: ' +
                            `'${cert.subject.CN}' 的证书` +
                            '与固定的指纹不符';
                        return new Error(msg);
                    }

                    // 此循环仅供参考。
                    // 打印链条中所有证书的证书与公钥指纹。 
                    // 通常，将发行人的公钥固定在公共互联网上，同时将服务的公钥固定在私密的环境中。
                    do {
                        console.log('主体的常用名称:', cert.subject.CN);
                        console.log('  证书的 SHA256 指纹:', cert.fingerprint256);

                        hash = crypto.createHash('sha256');
                        console.log('  公钥的 ping-sha256:', sha256(cert.pubkey));

                        lastprint256 = cert.fingerprint256;
                        cert = cert.issuerCertificate;
                    } while (cert.fingerprint256 !== lastprint256);

                },
            };

            options.agent = new https.Agent(options);
            const req = https.request(options, (res) => {
                console.log('一切正常。服务器与固定的证书或公钥相匹配。');
                console.log('状态码:', res.statusCode);
                // 打印 HPKP 的值。
                console.log('请求头:', res.headers['public-key-pins']);

                res.on('data', (d) => { });
            });

            req.on('error', (e) => {
                console.error(e.message);
            });
            req.end();
            ```

    * http2

        * 服务器端,流

            证书和密钥
            ```cmd
            openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \ -keyout 密钥.pem -out 证书.pem
            ```

            ```js
            const http2 = require('http2');
            const fs = require('fs');

            const server = http2.createSecureServer({
                key: fs.readFileSync('密钥.pem'),
                cert: fs.readFileSync('证书.pem')
            });
            server.on('error', (err) => console.error(err));

            server.on('stream', (stream, headers) => {
                // 流是一个双工流。
                stream.respond({
                    'content-type': 'text/html; charset=utf-8',
                    ':status': 200
                });
                stream.end('<h1>你好世界</h1>');
            });

            server.listen(8443);
            ```

        * 客户端

            ```js
            const http2 = require('http2');
            const fs = require('fs');
            const client = http2.connect('https://localhost:8443', {
                ca: fs.readFileSync('证书.pem')
            });
            client.on('error', (err) => console.error(err));

            const req = client.request({ ':path': '/' });

            req.on('response', (headers, flags) => {
                for (const name in headers) {
                    console.log(`${name}: ${headers[name]}`);
                }
            });

            req.setEncoding('utf8');
            let data = '';
            req.on('data', (chunk) => { data += chunk; });
            req.on('end', () => {
                console.log(`\n${data}`);
                client.close();
            });
            req.end();
            ```

        * 指定备选服务器

            ```js
            const http2 = require('http2');
            const options = getSecureOptionsSomehow();
            const server = http2.createSecureServer(options);
            server.on('stream', (stream) => {
                stream.respond();
                stream.end('ok');
            });
            server.on('session', (session) => {
                session.origin('https://example.com', 'https://example.org');
            });
            ```

            ```js
            const http2 = require('http2');
            const options = getSecureOptionsSomehow();
            options.origins = ['https://example.com', 'https://example.org'];
            const server = http2.createSecureServer(options);
            server.on('stream', (stream) => {
                stream.respond();
                stream.end('ok');
            });
            ```

        * 推送流到客户端

            ```js
            const http2 = require('http2');
            const client = http2.connect('http://localhost');
            client.on('stream', (pushedStream, requestHeaders) => {
                pushedStream.on('push', (responseHeaders) => {
                    // Process response headers
                });
                pushedStream.on('data', (chunk) => { /* handle pushed data */ });
            });
            const req = client.request({ ':path': '/' });
            ```

        * socket

            ```js
            const net = require('net');
            const server = net.createServer((socket) => {
                let name = '';
                socket.setEncoding('utf8');
                socket.on('data', (chunk) => name += chunk);
                socket.on('end', () => socket.end(`hello ${name}`));
            });
            server.listen(8000);
            ```

            ```js
            const http2 = require('http2');
            const { NGHTTP2_REFUSED_STREAM } = http2.constants;
            const net = require('net');
            const proxy = http2.createServer();
            proxy.on('stream', (stream, headers) => {
                if (headers[':method'] !== 'CONNECT') {
                    // Only accept CONNECT requests
                    stream.close(NGHTTP2_REFUSED_STREAM);
                    return;
                }
                const auth = new URL(`tcp://${headers[':authority']}`);
                // It's a very good idea to verify that hostname and port are
                // things this proxy should be connecting to.
                const socket = net.connect(auth.port, auth.hostname, () => {
                    stream.respond();
                    socket.pipe(stream);
                    stream.pipe(socket);
                });
                socket.on('error', (error) => {
                    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
                });
            });
            proxy.listen(8001);
            ```

            ```js
            const http2 = require('http2');
            const client = http2.connect('http://localhost:8001');
            // Must not specify the ':path' and ':scheme' headers
            // for CONNECT requests or an error will be thrown.
            const req = client.request({
                ':method': 'CONNECT',
                ':authority': `localhost:${port}`
            });
            req.on('response', (headers) => {
                console.log(headers[http2.constants.HTTP2_HEADER_STATUS]);
            });
            let data = '';
            req.setEncoding('utf8');
            req.on('data', (chunk) => data += chunk);
            req.on('end', () => {
                console.log(`The server says: ${data}`);
                client.close();
            });
            req.end('Jane');
            ```

        * 采集 HTTP/2 性能指标

            ```js
            const { PerformanceObserver } = require('perf_hooks');
            const obs = new PerformanceObserver((items) => {
                const entry = items.getEntries()[0];
                console.log(entry.entryType);  // prints 'http2'
                if (entry.name === 'Http2Session') {
                    // Entry contains statistics about the Http2Session
                } else if (entry.name === 'Http2Stream') {
                    // Entry contains statistics about the Http2Stream
                }
            });
            obs.observe({ entryTypes: ['http2'] });
            ```

    * http

        * Agent 负责管理 HTTP 客户端的连接持久性和重用。 它为给定的主机和端口维护一个待处理请求队列，为每个请求重用单独的套接字连接，直到队列为空，此时套接字被销毁或放入连接池，以便再次用于请求到同一个主机和端口。

            ```js
            http.get(options, (res) => {
                // 做些事情。
            }).on('socket', (socket) => {
                socket.emit('agentRemove');
            });
            ```

            ```js
            http.get({
                hostname: 'localhost',
                port: 80,
                path: '/',
                agent: false  // 仅为此一个请求创建一个新代理。
            }, (res) => {
                // 用响应做些事情。
            });
            ```

        * 创建服务器

            ```js
            const http = require('http');
            const net = require('net');
            const { URL } = require('url');

            // 创建 HTTP 隧道代理。
            const proxy = http.createServer((req, res) => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('响应内容');
            });
            proxy.on('connect', (req, clientSocket, head) => {
                // 连接到原始服务器。
                const { port, hostname } = new URL(`http://${req.url}`);
                const serverSocket = net.connect(port || 80, hostname, () => {
                    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                        'Proxy-agent: Node.js-Proxy\r\n' +
                        '\r\n');
                    serverSocket.write(head);
                    serverSocket.pipe(clientSocket);
                    clientSocket.pipe(serverSocket);
                });
            });

            // 代理正在运行。
            proxy.listen(1337, '127.0.0.1', () => {

                // 向隧道代理发出请求。
                const options = {
                    port: 1337,
                    host: '127.0.0.1',
                    method: 'CONNECT',
                    path: 'nodejs.cn:80'
                };

                const req = http.request(options);
                req.end();

                req.on('information', (info) => {
                    console.log(`获得主响应之前的信息: ${info.statusCode}`);
                });

                req.on('upgrade', (res, socket, upgradeHead) => {
                    console.log('接收到响应');
                    socket.end();
                    process.exit(0);
                });

                req.on('connect', (res, socket, head) => {
                    console.log('已连接');

                    // 通过 HTTP 隧道发出请求。
                    socket.write('GET / HTTP/1.1\r\n' +
                        'Host: nodejs.cn:80\r\n' +
                        'Connection: close\r\n' +
                        '\r\n');
                    socket.on('data', (chunk) => {
                        console.log(chunk.toString());
                    });
                    socket.on('end', () => {
                        proxy.close();
                    });
                });
            });
            ```

        * 请求头

            ```js
            request.setHeader('content-type', 'text/html');
            request.setHeader('Content-Length', Buffer.byteLength(body));
            request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
            const contentType = request.getHeader('Content-Type');
            // 'contentType' 是 'text/html'。
            const contentLength = request.getHeader('Content-Length');
            // 'contentLength' 的类型为数值。
            const cookie = request.getHeader('Cookie');
            // 'cookie' 的类型为字符串数组。
            ```

### 事件触发器

1. 参考链接：

   [事件触发器](http://nodejs.cn/api/events.html)

2. 详解：

    * 基本使用

        ```js
        const EventEmitter = require('events');
        class MyEmitter extends EventEmitter { }
        const myEmitter = new MyEmitter();
        myEmitter.on('event', function (a, b) {
            console.log(a, b, this, this === myEmitter);
            // 打印:
            //   a b MyEmitter {
            //     domain: null,
            //     _events: { event: [Function] },
            //     _eventsCount: 1,
            //     _maxListeners: undefined } true
        });
        myEmitter.emit('event', 'a', 'b');
        ```

    * 仅处理事件一次

        ```js
        const EventEmitter = require('events');
        class MyEmitter extends EventEmitter { }
        const myEmitter = new MyEmitter();
        let m = 0;
        myEmitter.on('event', () => {
            console.log(++m);
        });
        myEmitter.emit('event');
        // 打印: 1
        myEmitter.emit('event');
        // 打印: 2
        ```

    * 错误事件

        ```js
        const EventEmitter = require('events');
        class MyEmitter extends EventEmitter { }
        const myEmitter = new MyEmitter();
        myEmitter.on('error', (err) => {
            console.error('错误信息');
        });
        myEmitter.emit('error', new Error('错误'));
        // 打印: 错误信息
        ```

    * 执行顺序

        ```js
        const EventEmitter = require('events');
        const myEmitter = new EventEmitter();

        // 第一个监听器。
        myEmitter.on('event', function firstListener() {
            console.log('第一个监听器');
        });
        // 第二个监听器。
        myEmitter.on('event', function secondListener(arg1, arg2) {
            console.log(`第二个监听器中的事件有参数 ${arg1}、${arg2}`);
        });
        // 第三个监听器
        myEmitter.on('event', function thirdListener(...args) {
            const parameters = args.join(', ');
            console.log(`第三个监听器中的事件有参数 ${parameters}`);
        });

        console.log(myEmitter.listeners('event'));

        myEmitter.emit('event', 1, 2, 3, 4, 5);

        // Prints:
        // [
        //   [Function: firstListener],
        //   [Function: secondListener],
        //   [Function: thirdListener]
        // ]
        // 第一个监听器
        // 第二个监听器中的事件有参数 1、2
        // 第三个监听器中的事件有参数 1, 2, 3, 4, 5
        ```

    * 事件移除

        ```js
        const EventEmitter = require('events');
        class MyEmitter extends EventEmitter { }
        const myEmitter = new MyEmitter();

        const callbackA = () => {
            console.log('A');
            myEmitter.removeListener('event', callbackB);
        };

        const callbackB = () => {
            console.log('B');
        };

        myEmitter.on('event', callbackA);

        myEmitter.on('event', callbackB);

        // callbackA 移除了监听器 callbackB，但它依然会被调用。
        // 触发时内部的监听器数组为 [callbackA, callbackB]
        myEmitter.emit('event');
        // 打印:
        //   A
        //   B

        // callbackB 现已被移除。
        // 内部的监听器数组为 [callbackA]
        myEmitter.emit('event');
        // 打印:
        //   A
        ```

### readline逐行读取

1. 参考链接：

   [readline](http://nodejs.cn/api/readline.html)

2. 详解：

    * 基本用法

        ```js
        const readline = require('readline');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('你如何看待 Node.js 中文网？', (answer) => {
            // TODO：将答案记录在数据库中。
            console.log(`感谢您的宝贵意见：${answer}`);

            rl.close();
        });
        ```

    * 微型 CLI

        ```js
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '请输入> '
        });

        rl.prompt();

        rl.on('line', (line) => {
            switch (line.trim()) {
                case 'hello':
                    console.log('world!');
                    break;
                default:
                    console.log(`你输入的是：'${line.trim()}'`);
                    break;
            }
            rl.prompt();
        }).on('close', () => {
            console.log('再见!');
            process.exit(0);
        });
        ```

    * 逐行读取文件流

        ```js
        const fs = require('fs');
        const readline = require('readline');

        async function processLineByLine() {
            const fileStream = fs.createReadStream('input.txt');

            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
            // 注意：我们使用 crlfDelay 选项将 input.txt 中的所有 CR LF 实例（'\r\n'）识别为单个换行符。

            for await (const line of rl) {
                // input.txt 中的每一行在这里将会被连续地用作 `line`。
                console.log(`Line from file: ${line}`);
            }
        }

        processLineByLine();
        ```

        ```js
        const fs = require('fs');
        const readline = require('readline');

        const rl = readline.createInterface({
            input: fs.createReadStream('sample.txt'),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            console.log(`文件中的每一行: ${line}`);
        });
        ```

        ```js
        const { once } = require('events');
        const { createReadStream } = require('fs');
        const { createInterface } = require('readline');

        (async function processLineByLine() {
            try {
                const rl = createInterface({
                    input: createReadStream('big-file.txt'),
                    crlfDelay: Infinity
                });

                rl.on('line', (line) => {
                    // 处理行。
                });

                await once(rl, 'close');

                console.log('文件已处理');
            } catch (err) {
                console.error(err);
            }
        })();
        ```

### stream流

1. 参考链接：

   [stream](http://nodejs.cn/api/stream.html)

2. 详解：

    * 可写流

        ```js
        // 先写入 'hello, '，结束前再写入 'world!'。
        const fs = require('fs');
        const file = fs.createWriteStream('例子.txt');
        file.write('hello, ');
        file.end('world!');
        // 后面不允许再写入数据！
        ```

    * 可读流

        ```js
        const fs = require('fs');
        const rr = fs.createReadStream('foo.txt');
        rr.on('readable', () => {
            console.log(`读取的数据: ${rr.read()}`);
        });
        rr.on('end', () => {
            console.log('结束');
        });
        ```

    * 双工流与转换流

        ```js
        const fs = require('fs');
        const { finished } = require('stream');
        const rs = fs.createReadStream('archive.tar');
        finished(rs, (err) => {
            if (err) {
                console.error('流读取失败', err);
            } else {
                console.log('流已完成读取');
            }
        });
        rs.resume(); // 排空流。
        ```

        ```js
        const { pipeline } = require('stream');
        const fs = require('fs');
        const zlib = require('zlib');
        // 使用 pipeline API 轻松地将一系列的流通过管道一起传送，并在管道完全地完成时获得通知。
        // 使用 pipeline 可以有效地压缩一个可能很大的 tar 文件：
        pipeline(
            fs.createReadStream('archive.tar'),
            zlib.createGzip(),
            fs.createWriteStream('archive.tar.gz'),
            (err) => {
                if (err) {
                    console.error('管道传送失败', err);
                } else {
                    console.log('管道传送成功');
                }
            }
        );
        ```

### zlib压缩

1. 参考链接：

   [zlib](http://nodejs.cn/api/zlib.html)

2. 详解：

    * 压缩成gz

        ```js
        const { createGzip } = require('zlib');
        const { pipeline } = require('stream');
        const {
            createReadStream,
            createWriteStream
        } = require('fs');

        const gzip = createGzip();
        const source = createReadStream('input.txt');
        const destination = createWriteStream('input.txt.gz');

        pipeline(source, gzip, destination, (err) => {
            if (err) {
                console.error('发生错误:', err);
                process.exitCode = 1;
            }
        });

        // 或 Promise 化：

        const { promisify } = require('util');
        const pipe = promisify(pipeline);

        async function do_gzip(input, output) {
            const gzip = createGzip();
            const source = createReadStream(input);
            const destination = createWriteStream(output);
            await pipe(source, gzip, destination);
        }

        do_gzip('input.txt', 'input.txt.gz')
            .catch((err) => {
                console.error('发生错误:', err);
                process.exitCode = 1;
            });
        ```

    * 解压

        ```js
        const { deflate, unzip } = require('zlib');

        const input = '.................................';
        deflate(input, (err, buffer) => {
            if (err) {
                console.error('发生错误:', err);
                process.exitCode = 1;
            }
            console.log(buffer.toString('base64'));
        });

        const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
        unzip(buffer, (err, buffer) => {
            if (err) {
                console.error('发生错误:', err);
                process.exitCode = 1;
            }
            console.log(buffer.toString());
        });

        // 或 Promise 化：

        const { promisify } = require('util');
        const do_unzip = promisify(unzip);

        do_unzip(buffer)
            .then((buf) => console.log(buf.toString()))
            .catch((err) => {
                console.error('发生错误:', err);
                process.exitCode = 1;
            });
        ```

    * 压缩 HTTP 的请求和响应

        ```js
        // 客户端请求示例。
        const zlib = require('zlib');
        const http = require('http');
        const fs = require('fs');
        const { pipeline } = require('stream');

        const request = http.get({
            host: 'example.com',
            path: '/',
            port: 80,
            headers: { 'Accept-Encoding': 'br,gzip,deflate' }
        });
        request.on('response', (response) => {
            const output = fs.createWriteStream('example.com_index.html');

            const onError = (err) => {
                if (err) {
                    console.error('发生错误:', err);
                    process.exitCode = 1;
                }
            };

            switch (response.headers['content-encoding']) {
                case 'br':
                    pipeline(response, zlib.createBrotliDecompress(), output, onError);
                    break;
                // 或者, 只是使用 zlib.createUnzip() 方法去处理这两种情况：
                case 'gzip':
                    pipeline(response, zlib.createGunzip(), output, onError);
                    break;
                case 'deflate':
                    pipeline(response, zlib.createInflate(), output, onError);
                    break;
                default:
                    pipeline(response, output, onError);
                    break;
            }
        });
        ```

        ```js
        // 服务端示例。
        // 对每一个请求运行 gzip 操作的成本是十分高昂的。
        // 缓存已压缩的 buffer 是更加高效的方式。
        const zlib = require('zlib');
        const http = require('http');
        const fs = require('fs');
        const { pipeline } = require('stream');

        http.createServer((request, response) => {
            const raw = fs.createReadStream('index.html');
            // 存储资源的压缩版本和未压缩版本。
            response.setHeader('Vary', 'Accept-Encoding');
            let acceptEncoding = request.headers['accept-encoding'];
            if (!acceptEncoding) {
                acceptEncoding = '';
            }

            const onError = (err) => {
                if (err) {
                    // 如果发生错误，则我们将会无能为力，
                    // 因为服务器已经发送了 200 响应码，
                    // 并且已经向客户端发送了一些数据。 
                    // 我们能做的最好就是立即终止响应并记录错误。
                    response.end();
                    console.error('发生错误:', err);
                }
            };

            // 注意：这不是一个合适的 accept-encoding 解析器。
            // 查阅 https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
            if (/\bdeflate\b/.test(acceptEncoding)) {
                response.writeHead(200, { 'Content-Encoding': 'deflate' });
                pipeline(raw, zlib.createDeflate(), response, onError);
            } else if (/\bgzip\b/.test(acceptEncoding)) {
                response.writeHead(200, { 'Content-Encoding': 'gzip' });
                pipeline(raw, zlib.createGzip(), response, onError);
            } else if (/\bbr\b/.test(acceptEncoding)) {
                response.writeHead(200, { 'Content-Encoding': 'br' });
                pipeline(raw, zlib.createBrotliCompress(), response, onError);
            } else {
                response.writeHead(200, {});
                pipeline(raw, response, onError);
            }
        }).listen(1337);
        ```

        flush()刷新
        ```js
        const zlib = require('zlib');
        const http = require('http');
        const { pipeline } = require('stream');

        http.createServer((request, response) => {
            // 为了简单起见，省略了对 Accept-Encoding 的检测。
            response.writeHead(200, { 'content-encoding': 'gzip' });
            const output = zlib.createGzip();
            let i;

            pipeline(output, response, (err) => {
                if (err) {
                    // 如果发生错误，则我们将会无能为力，
                    // 因为服务器已经发送了 200 响应码，
                    // 并且已经向客户端发送了一些数据。 
                    // 我们能做的最好就是立即终止响应并记录错误。
                    clearInterval(i);
                    response.end();
                    console.error('发生错误:', err);
                }
            });

            i = setInterval(() => {
                output.write(`The current time is ${Date()}\n`, () => {
                    // 数据已经传递给了 zlib，但压缩算法看能已经决定缓存数据以便得到更高的压缩效率。
                    // 一旦客户端准备接收数据，调用 .flush() 将会使数据可用。
                    output.flush();
                });
            }, 1000);
        }).listen(1337);
        ```

### 获取操作系统信息

1. 参考链接：

   [os](http://nodejs.cn/api/os.html)

2. 详解：

    * cpu

        ```js
        const os = require('os');
        console.log(os.cpus())
        [
            {
                model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
                speed: 2926,//兆赫兹
                times: {
                    user: 252020,//用户模式下花费的毫秒数
                    nice: 0,//良好模式下花费的毫秒数
                    sys: 30340,//系统模式下花费的毫秒数
                    idle: 1070356870,//空闲模式下花费的毫秒数
                    irq: 0//中断请求模式下花费的毫秒数
                }
            },
            {
                model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
                speed: 2926,
                times: {
                    user: 306960,
                    nice: 0,
                    sys: 26980,
                    idle: 1071569080,
                    irq: 0
                }
            },
            {
                model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
                speed: 2926,
                times: {
                    user: 248450,
                    nice: 0,
                    sys: 21750,
                    idle: 1070919370,
                    irq: 0
                }
            },
            {
                model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
                speed: 2926,
                times: {
                    user: 256880,
                    nice: 0,
                    sys: 19430,
                    idle: 1070905480,
                    irq: 20
                }
            }
        ]
        ```

    * 网络地址

        ```js
        const os = require('os');
        console.log(os.networkInterfaces())
        {
            lo: [
                {
                    address: '127.0.0.1',// IPv4 或 IPv6 地址
                    netmask: '255.0.0.0',// IPv4 或 IPv6 的子网掩码
                    family: 'IPv4',// IPv4 或 IPv6
                    mac: '00:00:00:00:00:00',// 网络接口的 MAC 地址
                    internal: true,// 如果网络接口是不可远程访问的环回接口或类似接口，则为 true，否则为 false
                    cidr: '127.0.0.1/8'// 以 CIDR 表示法分配的带有路由前缀的 IPv4 或 IPv6 地址。如果 netmask 无效，则此属性会被设为 null。
                },
                {
                    address: '::1',
                    netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
                    family: 'IPv6',
                    mac: '00:00:00:00:00:00',
                    scopeid: 0,// 数值型的 IPv6 作用域 ID,仅当 family 为 IPv6 时指定
                    internal: true,
                    cidr: '::1/128'
                }
            ],
            eth0: [
                {
                    address: '192.168.1.108',
                    netmask: '255.255.255.0',
                    family: 'IPv4',
                    mac: '01:02:03:0a:0b:0c',
                    internal: false,
                    cidr: '192.168.1.108/24'
                },
                {
                    address: 'fe80::a00:27ff:fe4e:66a1',
                    netmask: 'ffff:ffff:ffff:ffff::',
                    family: 'IPv6',
                    mac: '01:02:03:0a:0b:0c',
                    scopeid: 1,
                    internal: false,
                    cidr: 'fe80::a00:27ff:fe4e:66a1/64'
                }
            ]
        }
        ```

### 性能钩子

1. 参考链接：

   [perf_hooks](http://nodejs.cn/api/perf_hooks.html)

2. 详解：

    * 测量异步操作的时长

        ```js
        const async_hooks = require('async_hooks');
        const {
            performance,
            PerformanceObserver
        } = require('perf_hooks');

        const set = new Set();
        const hook = async_hooks.createHook({
            init(id, type) {
                if (type === 'Timeout') {
                    performance.mark(`Timeout-${id}-Init`);
                    set.add(id);
                }
            },
            destroy(id) {
                if (set.has(id)) {
                    set.delete(id);
                    performance.mark(`Timeout-${id}-Destroy`);
                    performance.measure(`Timeout-${id}`,
                        `Timeout-${id}-Init`,
                        `Timeout-${id}-Destroy`);
                }
            }
        });
        hook.enable();

        const obs = new PerformanceObserver((list, observer) => {
            console.log(list.getEntries()[0]);
            performance.clearMarks();
            observer.disconnect();
        });
        obs.observe({ entryTypes: ['measure'], buffered: true });

        setTimeout(() => { }, 1000);
        ```

    * 测量加载依赖的耗时

        ```js
        const {
            performance,
            PerformanceObserver
        } = require('perf_hooks');
        const mod = require('module');

        // Monkey patch the require function
        mod.Module.prototype.require =
            performance.timerify(mod.Module.prototype.require);
        require = performance.timerify(require);

        // Activate the observer
        const obs = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                console.log(`require('${entry[0]}')`, entry.duration);
            });
            obs.disconnect();
        });
        obs.observe({ entryTypes: ['function'], buffered: true });

        require('path');
        ```

### inspect调试器

1. 参考链接：

   [debugger](http://nodejs.cn/api/debugger.html)

2. 详解：

    要调试的代码
    ```js
    // myscript.js
    global.x = 5;
    setTimeout(() => {
        debugger;
        console.log('世界');
    }, 1000);
    console.log('你好');
    ```

    调试示例
    ```js
    $ node inspect myscript.js
    < Debugger listening on ws://127.0.0.1:9229/80e7a814-7cd3-49fb-921a-2e02228cd5ba
    < For help, see: https://nodejs.org/en/docs/inspector
    < Debugger attached.
    Break on start in myscript.js:1
    > 1 (function (exports, require, module, __filename, __dirname) { global.x = 5;
    2 setTimeout(() => {
    3   debugger;
    debug> cont
    < 你好
    break in myscript.js:3
    1 (function (exports, require, module, __filename, __dirname) { global.x = 5;
    2 setTimeout(() => {
    > 3   debugger;
    4   console.log('世界');
    5 }, 1000);
    debug> next
    break in myscript.js:4
    2 setTimeout(() => {
    3   debugger;
    > 4   console.log('世界');
    5 }, 1000);
    6 console.log('你好');
    debug> repl
    Press Ctrl + C to leave debug repl
    > x
    5
    > 2 + 2
    4
    debug> next
    < 世界
    break in myscript.js:5
    3   debugger;
    4   console.log('世界');
    > 5 }, 1000);
    6 console.log('你好');
    7
    debug> .exit
    ```

    命令
    ```txt
    cont, c: 继续执行。
    next, n: 单步执行下一行。
    step, s: 单步进入。
    out, o: 单步退出。
    pause: 暂停运行中的代码。
    setBreakpoint(), sb(): 在当前行上设置断点。
    setBreakpoint(line), sb(line): 在指定行上设置断点。
    setBreakpoint('fn()'), sb(...): 在函数体的第一个语句上设置断点。
    setBreakpoint('script.js', 1)、 sb(...): 在 script.js 的第一行上设置断点。
    setBreakpoint('script.js', 1, 'num < 4')、 sb(...): 在 script.js 的第一行上设置条件断点，仅当 num < 4 计算为 true 时才会中断。
    clearBreakpoint('script.js', 1), cb(...): 清除 script.js 中第一行上的断点。
    backtrace, bt: 打印当前执行帧的回溯。
    list(5): 列出脚本源码的 5 行上下文（前后各 5 行）。
    watch(expr): 将表达式添加到监视列表。
    unwatch(expr): 从监视列表中移除表达式。
    watchers: 列出所有的监视器和它们的值（在每个断点上自动地列出）。
    repl: 打开调试器的 repl，用于调试脚本的上下文中的执行。
    exec expr: 在调试脚本的上下文中执行一个表达式。
    run: 运行脚本（在调试器启动时自动地运行）。
    restart: 重启脚本。
    kill: 杀死脚本。
    scripts: 列出所有已加载的脚本。
    version: 显示 V8 的版本。
    ```

### Buffer缓冲器

1. 参考链接：

   [Buffer](http://nodejs.cn/api/buffer.html)

2. 详解：

    * Buffer 在全局作用域中,无需require

        ```js
        // 创建一个长度为 10、以零填充的 Buffer。
        const buf1 = Buffer.alloc(10);

        // 创建一个长度为 10 的 Buffer，
        // 其中全部填充了值为 `1` 的字节。
        const buf2 = Buffer.alloc(10, 1);

        // 创建一个长度为 10、且未初始化的 buffer。
        // 这个方法比调用 Buffer.alloc() 更快，
        // 但返回的 Buffer 实例可能包含旧数据，
        // 因此需要使用 fill()、write() 或其他能填充 Buffer 的内容的函数进行重写。
        const buf3 = Buffer.allocUnsafe(10);

        // 创建一个包含字节 [1, 2, 3] 的 Buffer。
        const buf4 = Buffer.from([1, 2, 3]);

        // 创建一个包含字节 [1, 1, 1, 1] 的 Buffer，
        // 其中所有条目均使用 `(value & 255)` 进行截断以符合 0-255 的范围。
        const buf5 = Buffer.from([257, 257.5, -255, '1']);

        // 创建一个 Buffer，其中包含字符串 'tést' 的 UTF-8 编码字节：
        // [0x74, 0xc3, 0xa9, 0x73, 0x74]（以十六进制表示）
        // [116, 195, 169, 115, 116]（以十进制表示）
        const buf6 = Buffer.from('tést');

        // 创建一个包含 Latin-1 字节 [0x74, 0xe9, 0x73, 0x74] 的 Buffer。
        const buf7 = Buffer.from('tést', 'latin1');

        const b = Buffer.allocUnsafe(50).fill('h');
        console.log(b.toString());
        // 打印: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

        // 使用在 UTF-8 中占用两个字节的字符来填充 `Buffer`。
        console.log(Buffer.allocUnsafe(5).fill('\u0222'));
        // 打印: <Buffer c8 a2 c8 a2 c8>

        const buf = Buffer.allocUnsafe(5);
        console.log(buf.fill('a'));
        // 打印: <Buffer 61 61 61 61 61>
        console.log(buf.fill('aazz', 'hex'));
        // 打印: <Buffer aa aa aa aa aa>
        console.log(buf.fill('zz', 'hex'));
        // 抛出异常。
        ```

    * 字符编码

        ```js
        const buf = Buffer.from('hello world', 'utf8');

        console.log(buf.toString('hex'));
        // 打印: 68656c6c6f20776f726c64
        console.log(buf.toString('base64'));
        // 打印: aGVsbG8gd29ybGQ=

        console.log(Buffer.from('fhqwhgads', 'utf8'));
        // 打印: <Buffer 66 68 71 77 68 67 61 64 73>
        console.log(Buffer.from('fhqwhgads', 'utf16le'));
        // 打印: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>

        Buffer.from('1ag', 'hex');
        // 打印 <Buffer 1a>，当遇到第一个非十六进制的值（'g'）时，则数据会被截断。

        Buffer.from('1a7g', 'hex');
        // 打印 <Buffer 1a>，当数据以一个数字（'7'）结尾时，则数据会被截断。

        Buffer.from('1634', 'hex');
        // 打印 <Buffer 16 34>，所有数据均可用。
        ```

    * TypedArray

        Uint32Array
        ```js
        const buf = Buffer.from([1, 2, 3, 4]);
        const uint32array = new Uint32Array(buf);
        console.log(uint32array);
        // 打印: Uint32Array(4) [ 1, 2, 3, 4 ]
        ```

        Uint16Array
        ```js
        const buf = Buffer.from('hello', 'utf16le');
        const uint16array = new Uint16Array(buf.buffer,buf.byteOffset,buf.length / Uint16Array.BYTES_PER_ELEMENT);
        console.log(uint16array);
        // 打印: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
        ```

    * 迭代器

        ```js
        const buf = Buffer.from([1, 2, 3]);
        for (const b of buf) {
            console.log(b);
        }
        // 打印:
        //   1
        //   2
        //   3
        ```

        ```js
        const buf = Buffer.from('buffer');

        for (const pair of buf.entries()) {
            console.log(pair);
        }
        // 打印:
        //   [0, 98]
        //   [1, 117]
        //   [2, 102]
        //   [3, 102]
        //   [4, 101]
        //   [5, 114]
        ```

        ```js
        const buf = Buffer.from('buffer');

        for (const key of buf.keys()) {
            console.log(key);
        }
        // 打印:
        //   0
        //   1
        //   2
        //   3
        //   4
        //   5
        ```

        ```js
        const buf = Buffer.from('buffer');

        for (const value of buf.values()) {
        console.log(value);
        }
        // 打印:
        //   98
        //   117
        //   102
        //   102
        //   101
        //   114

        for (const value of buf) {
        console.log(value);
        }
        // 打印:
        //   98
        //   117
        //   102
        //   102
        //   101
        //   114
        ```

    * 字节长度

        当 string 是一个 Buffer/DataView/TypedArray/ArrayBuffer/SharedArrayBuffer 时，返回 .byteLength 报告的字节长度。
        ```js
        const str = '\u00bd + \u00bc = \u00be';
        console.log(`${str}: ${str.length} 个字符, ` + `${Buffer.byteLength(str, 'utf8')} 个字节`);
        // 打印: ½ + ¼ = ¾: 9 个字符, 12 个字节
        ```

        ```js
        const buf = Buffer.alloc(1234);

        console.log(buf.length);
        // 打印: 1234

        buf.write('http://nodejs.cn/', 0, 'utf8');

        console.log(buf.length);
        // 打印: 1234
        ```

    * 比较排序

        ```js
        const buf1 = Buffer.from('1234');
        const buf2 = Buffer.from('0123');
        const arr = [buf1, buf2];
        console.log(arr.sort(Buffer.compare));
        // 打印: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
        // (结果相当于: [buf2, buf1])
        ```
        ```js
        const buf1 = Buffer.from('ABC');
        const buf2 = Buffer.from('BCD');
        const buf3 = Buffer.from('ABCD');

        console.log(buf1.compare(buf1));
        // 打印: 0
        console.log(buf1.compare(buf2));
        // 打印: -1
        console.log(buf1.compare(buf3));
        // 打印: -1
        console.log(buf2.compare(buf1));
        // 打印: 1
        console.log(buf2.compare(buf3));
        // 打印: 1
        console.log([buf1, buf2, buf3].sort(Buffer.compare));
        // 打印: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
        // (相当于: [buf1, buf3, buf2])
        ```

        ```js
        const buf1 = Buffer.from('ABC');
        const buf2 = Buffer.from('414243', 'hex');
        const buf3 = Buffer.from('ABCD');

        console.log(buf1.equals(buf2));
        // 打印: true
        console.log(buf1.equals(buf3));
        // 打印: false
        ```

    * 合并

        ```js
        const buf1 = Buffer.alloc(10);
        const buf2 = Buffer.alloc(14);
        const buf3 = Buffer.alloc(18);
        const totalLength = buf1.length + buf2.length + buf3.length;

        console.log(totalLength);
        // 打印: 42

        const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

        console.log(bufA);
        // 打印: <Buffer 00 00 00 00 ...>
        console.log(bufA.length);
        // 打印: 42
        ```

    * 复制

        ```js
        const buf1 = Buffer.allocUnsafe(26);
        const buf2 = Buffer.allocUnsafe(26).fill('!');

        for (let i = 0; i < 26; i++) {
            // 97 是 'a' 的十进制 ASCII 值。
            buf1[i] = i + 97;
        }

        // 拷贝 `buf1` 中第 16 至 19 字节偏移量的数据到 `buf2` 第 8 字节偏移量开始。
        buf1.copy(buf2, 8, 16, 20);
        // 这等效于：
        // buf2.set(buf1.subarray(16, 20), 8);

        console.log(buf2.toString('ascii', 0, 25));
        // 打印: !!!!!!!!qrst!!!!!!!!!!!!!
        ```

        ```js
        const buf = Buffer.allocUnsafe(26);

        for (let i = 0; i < 26; i++) {
        // 97 是 'a' 的十进制 ASCII 值。
        buf[i] = i + 97;
        }

        buf.copy(buf, 0, 4, 10);

        console.log(buf.toString());
        // 打印: efghijghijklmnopqrstuvwxyz
        ```

    * 搜索

        ```js
        const buf = Buffer.from('this is a buffer');

        console.log(buf.includes('this'));
        // 打印: true
        console.log(buf.includes('is'));
        // 打印: true
        console.log(buf.includes(Buffer.from('a buffer')));
        // 打印: true
        console.log(buf.includes(97));
        // 打印: true（97 是 'a' 的十进制 ASCII 值）
        console.log(buf.includes(Buffer.from('a buffer example')));
        // 打印: false
        console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
        // 打印: true
        console.log(buf.includes('this', 4));
        // 打印: false
        ```

        ```js
        const buf = Buffer.from('this is a buffer');

        console.log(buf.indexOf('this'));
        // 打印: 0
        console.log(buf.indexOf('is'));
        // 打印: 2
        console.log(buf.indexOf(Buffer.from('a buffer')));
        // 打印: 8
        console.log(buf.indexOf(97));
        // 打印: 8（97 是 'a' 的十进制 ASCII 值）
        console.log(buf.indexOf(Buffer.from('a buffer example')));
        // 打印: -1
        console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
        // 打印: 8

        const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

        console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
        // 打印: 4
        console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
        // 打印: 6
        ```

        ```js
        const b = Buffer.from('abcdef');

        // 传入一个数值，但不是有效的字节。
        // 打印：2，相当于查找 99 或 'c'。
        console.log(b.indexOf(99.9));
        console.log(b.indexOf(256 + 99));

        // 传入被转换成 NaN 或 0 的 byteOffset。
        // 打印：1，查找整个 buffer。
        console.log(b.indexOf('b', undefined));
        console.log(b.indexOf('b', {}));
        console.log(b.indexOf('b', null));
        console.log(b.indexOf('b', []));
        ```

        ```js
        const buf = Buffer.from('this buffer is a buffer');

        console.log(buf.lastIndexOf('this'));
        // 打印: 0
        console.log(buf.lastIndexOf('buffer'));
        // 打印: 17
        console.log(buf.lastIndexOf(Buffer.from('buffer')));
        // 打印: 17
        console.log(buf.lastIndexOf(97));
        // 打印: 15（97 是 'a' 的十进制 ASCII 值）
        console.log(buf.lastIndexOf(Buffer.from('yolo')));
        // 打印: -1
        console.log(buf.lastIndexOf('buffer', 5));
        // 打印: 5
        console.log(buf.lastIndexOf('buffer', 4));
        // 打印: -1

        const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

        console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
        // 打印: 6
        console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
        // 打印: 4
        ```

        ```js
        const b = Buffer.from('abcdef');

        // 传入一个数值，但不是一个有效的字节。
        // 输出：2，相当于查找 99 或 'c'。
        console.log(b.lastIndexOf(99.9));
        console.log(b.lastIndexOf(256 + 99));

        // 传入被转换成 NaN 的 byteOffset。
        // 输出：1，查找整个 buffer。
        console.log(b.lastIndexOf('b', undefined));
        console.log(b.lastIndexOf('b', {}));

        // 传入被转换成 0 的 byteOffset。
        // 输出：-1，相当于传入 0。
        console.log(b.lastIndexOf('b', null));
        console.log(b.lastIndexOf('b', []));
        ```

    * 切片

        ```js
        const buf = Buffer.from('buffer');

        const copiedBuf = Uint8Array.prototype.slice.call(buf);
        copiedBuf[0]++;
        console.log(copiedBuf.toString());
        // 打印: cuffer

        console.log(buf.toString());
        // 打印: buffer
        ```

    * 类型转换

        ```js
        const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

        console.log(buf1);
        // 打印: <Buffer 01 02 03 04 05 06 07 08>

        buf1.swap16();

        console.log(buf1);
        // 打印: <Buffer 02 01 04 03 06 05 08 07>

        const buf2 = Buffer.from([0x1, 0x2, 0x3]);

        buf2.swap16();
        // 抛出异常 ERR_INVALID_BUFFER_SIZE。
        ```

        ```js
        const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

        console.log(buf1);
        // 打印: <Buffer 01 02 03 04 05 06 07 08>

        buf1.swap32();

        console.log(buf1);
        // 打印: <Buffer 04 03 02 01 08 07 06 05>

        const buf2 = Buffer.from([0x1, 0x2, 0x3]);

        buf2.swap32();
        // 抛出异常 ERR_INVALID_BUFFER_SIZE。
        ```

        ```js
        const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

        console.log(buf1);
        // 打印: <Buffer 01 02 03 04 05 06 07 08>

        buf1.swap64();

        console.log(buf1);
        // 打印: <Buffer 08 07 06 05 04 03 02 01>

        const buf2 = Buffer.from([0x1, 0x2, 0x3]);

        buf2.swap64();
        // 抛出异常 ERR_INVALID_BUFFER_SIZE。
        ```

        ```js
        const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
        const json = JSON.stringify(buf);

        console.log(json);
        // 打印: {"type":"Buffer","data":[1,2,3,4,5]}

        const copy = JSON.parse(json, (key, value) => {
            return value && value.type === 'Buffer' ?
                Buffer.from(value) :
                value;
        });

        console.log(copy);
        // 打印: <Buffer 01 02 03 04 05>
        ```

        ```js
        const buf1 = Buffer.allocUnsafe(26);

        for (let i = 0; i < 26; i++) {
            // 97 是 'a' 的十进制 ASCII 值。
            buf1[i] = i + 97;
        }

        console.log(buf1.toString('utf8'));
        // 打印: abcdefghijklmnopqrstuvwxyz
        console.log(buf1.toString('utf8', 0, 5));
        // 打印: abcde

        const buf2 = Buffer.from('tést');

        console.log(buf2.toString('hex'));
        // 打印: 74c3a97374
        console.log(buf2.toString('utf8', 0, 3));
        // 打印: té
        console.log(buf2.toString(undefined, 0, 3));
        // 打印: té
        ```

    * 写入

        ```js
        const buf = Buffer.alloc(256);

        const len = buf.write('\u00bd + \u00bc = \u00be', 0);

        console.log(`${len} 个字节: ${buf.toString('utf8', 0, len)}`);
        // 打印: 12 个字节: ½ + ¼ = ¾

        const buffer = Buffer.alloc(10);

        const length = buffer.write('abcd', 8);

        console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
        // 打印: 2 个字节 : ab
        ```

### ORM框架

1. 参考链接：

   [Nodejs之ORM框架](https://www.jianshu.com/p/0738e29d8af3)

   [TypeORM 中文文档](https://typeorm.biunav.com/zh/#%E5%AE%89%E8%A3%85)

   [Sequelize](https://sequelize.org/)

   [node-orm2](https://github.com/dresende/node-orm2)

2. 详解：

    * ORM

        Object Relational Mapping，对象-关系-映射

        用面向对象的方式和目前的关系型数据库做匹配

    * ORM的两种模式

        1. Active Record 模式
        
            活动记录模式，一个模型类对应关系型数据库中的一个表，模型类的一个实例对应表中的一行记录。

        2. Data Mapper 模式
        
            数据映射模式，领域模型对象和数据表是松耦合关系，只进行业务逻辑的处理，和数据层解耦，需要一个实体管理器来将模型和持久化层做对应。

    * ORM框架

        1. TypeORM

            TypeORM 借鉴了hibernate，采用装饰类的方式，使用typescript

            * cli

                ```txt
                npm install typeorm -g

                typeorm init --name MyProject --database mysql
                ```

            * 生成文档结构

                ```txt
                MyProject
                ├── src              // TypeScript 代码
                │   ├── entity       // 存储实体（数据库模型）的位置
                │   │   └── User.ts  // 示例 entity
                │   ├── migration    // 存储迁移的目录
                │   └── index.ts     // 程序执行主文件
                ├── .gitignore       // gitignore文件
                ├── ormconfig.json   // ORM和数据库连接配置
                ├── package.json     // node module 依赖
                ├── README.md        // 简单的 readme 文件
                └── tsconfig.json    // TypeScript 编译选项
                ```

            * 实体类

                ```ts
                import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
                @Entity()
                export class User {
                ​    @PrimaryGeneratedColumn()
                ​    id: number;

                ​    @Column()
                ​    firstName: string;

                ​    @Column()
                ​    lastName: string;

                ​    @Column()
                ​    age: number;
                }
                ```

            * CRUD操作

                ```ts
                import "reflect-metadata";
                import {createConnection} from "typeorm";
                import {User} from "./entity/User";

                createConnection().then(async connection => {
                ​    console.log("Inserting a new user into the database...");
                ​    const user = new User();
                ​    user.firstName = "Timber";
                ​    user.lastName = "Saw";
                ​    user.age = 25;
                ​    await connection.manager.save(user);
                ​    console.log("Saved a new user with id: " + user.id);
                ​    console.log("Loading users from the database...");
                ​    const users = await connection.manager.find(User);
                ​    console.log("Loaded users: ", users);
                ​    console.log("Here you can setup and run express/koa/any other framework.");
                }).catch(error => console.log(error));
                ```

        2. Sequelize

            没有cli

            * 安装

                ```txt
                $ npm install --save sequelize
                $ npm install --save mysql2
                ```

            * 数据库的配置文件config.js

                ```js
                module.exports = {
                ​    database: {
                ​        dbName: 'TEST',
                ​        host: 'localhost',
                ​        port: 3306,
                ​        user: 'root',
                ​        password: '123456'
                ​    }
                }
                ```

            * 数据库访问公共文件db.js

                ```js
                const Sequelize = require('sequelize')
                const {
                ​    dbName,
                ​    host,
                ​    port,
                ​    user,
                ​    password
                } = require('../config').database

                const sequelize = new Sequelize(dbName, user, password, {
                ​    dialect: 'mysql',
                ​    host,
                ​    port,
                ​    logging: true,
                ​    timezone: '+08:00',
                ​    define: {
                ​        // create_time && update_time
                ​        timestamps: true,
                ​        // delete_time
                ​        paranoid: true,
                ​        createdAt: 'created_at',
                ​        updatedAt: 'updated_at',
                ​        deletedAt: 'deleted_at',
                ​        // 把驼峰命名转换为下划线
                ​        underscored: true,
                ​        scopes: {
                ​            bh: {
                ​                attributes: {
                ​                    exclude: ['password', 'updated_at', 'deleted_at', 'created_at']
                ​                }
                ​            },
                ​            iv: {
                ​                attributes: {
                ​                    exclude: ['content', 'password', 'updated_at', 'deleted_at']
                ​                }
                ​            }
                ​        }
                ​    }
                })
                // 创建模型
                sequelize.sync({
                ​    force: false
                })
                module.exports = {
                ​    sequelize
                }
                ```

            * model

                ```js
                const {Sequelize, Model} = require('sequelize')
                const {db} = require('../../db')

                class User extends Model {}
                User.init({
                    // attributes
                    firstName: {
                        type: Sequelize.STRING,
                        allowNull: false
                    },
                    lastName: {
                        type: Sequelize.STRING
                        // allowNull defaults to true
                    }
                }, {
                    db,
                    modelName: 'user'
                    // options
                });
                ```

            * CRUD操作

                ```js
                // Find all users
                User.findAll().then(users => {
                    console.log("All users:", JSON.stringify(users, null, 4));
                });
                // Create a new user
                User.create({ firstName: "Jane", lastName: "Doe" }).then(jane => {
                    console.log("Jane's auto-generated ID:", jane.id);
                });
                // Delete everyone named "Jane"
                User.destroy({
                    where: {
                        firstName: "Jane"
                    }
                }).then(() => {
                    console.log("Done");
                });
                // Change everyone without a last name to "Doe"
                User.update({ lastName: "Doe" }, {
                    where: {
                        lastName: null
                    }
                }).then(() => {
                    console.log("Done");
                });
                ```

        3. node-orm2

            配合express回调，npm install orm

            * 数据库连接

                ```js
                var orm = require("orm");
                orm.connect("mysql://username:password@host/database", 
                    function (err, db) {
                    // ...
                });
                ```

            * model

                ```js
                var Person = db.define('person', {
                    name: String,
                    surname: String,
                    age: String,
                    male: boolean
                }, {
                    identityCache : true
                });
                ```

            * CRUD操作

                ```js
                Person.create([
                    {
                        name: "John",
                        surname: "Doe",
                        age: 25,
                        male: true
                    },
                    {
                        name: "Liza",
                        surname: "Kollan",
                        age: 19,
                        male: false
                    }
                ], function (err, items) {
                    // err - description of the error or null
                    // items - array of inserted items
                });

                Person.get(1, function (err, John) {
                    John.name = "Joe";
                    John.surname = "Doe";
                    John.save(function (err) {
                        console.log("saved!");
                    });//保存
                    Person.find({ surname: "Doe" }).remove(function (err) {
                    // Does gone..
                    });//删除
                });

                Person.find({
                    name: "admin"})
                    .limit(3)
                    .offset(2)//跳过
                    .only("name", "age")//返回字段
                    .run(function(err, data) {
                
                });
                ```

        4. 其它

            * bookshelf(也常用)
            * persistencejs
            * waterline
            * mongoose
            * node-mysql
            * knex

### 定时任务框架

1. 参考链接：

   [Nodejs 定时执行(node-cron)](https://blog.csdn.net/m0_37263637/article/details/83862250)

   [Nodejs学习笔记（十二）--- 定时任务（node-schedule）](https://www.cnblogs.com/zhongweiv/p/node_schedule.html)

   [[Node] Agenda 中文文档 定时任务调度系统[基础篇]](https://blog.csdn.net/github_36749622/article/details/76595489)

   [nodejs bull 实现延时队列](https://www.cnblogs.com/xiaosongJiang/p/13047500.html)

2. 详解：

    * 时间语法

        * 时间取值范围

            ```txt
            秒：0-59
            分钟：0-59
            小时：0-23
            天：1-31
            月份：0-11（1月至12月）
            星期几：0-6（周日至周六）
            ```

        * 排列顺序

            ```txt
            *为通配符
            -为时间段连接符
            ,号为分隔符，可以在某一节输入多个值
            /号为步进符
            ```

        * 例子

            每秒都执行
            ```txt
            * * * * * *
            ```

            在每次分钟时间为10的时候执行(每次分钟为10的 那60秒 每秒都执行)
            ```txt
            * 10 * * * *
            ```

            在秒为10,分钟为3执行
            ```txt
            10 03 * * * *
            ```

            每天14点05分10秒时执行
            ```txt
            10 05 14 * * *
            ```

            每天14-17点的05分10秒时执行
            ```txt
            10 05 14-17 * * *
            ```

            每分钟的11 秒 22秒 25秒执行
            ```txt
            11,22,25 * * * * *
            ``` 

            间隔3秒执行
            ```txt
            */3 * * * * *
            ```

            间隔两分钟执行
            ```txt
            0 */2 * * * *
            ```

    * 框架

        1. node-cron

            ```js
            var CronJob = require('cron').CronJob;
            new CronJob('10 * * * * *', function() {
                const d = new Date();
                console.log(d);
            }, null, true);
            ```

        2. node-schedule

            npm install node-schedule
            ```js
            var schedule = require('node-schedule');

            function scheduleCronstyle(){
                schedule.scheduleJob('30 * * * * *', function(){
                    console.log('scheduleCronstyle:' + new Date());
                }); 
            }

            scheduleCronstyle();
            ```

            ```js
            var schedule = require('node-schedule');

            function scheduleRecurrenceRule(){
                var rule = new schedule.RecurrenceRule();
                // rule.dayOfWeek = 2;
                // rule.month = 3;
                // rule.dayOfMonth = 1;
                // rule.hour = 1;
                // rule.minute = 42;
                rule.second = 0;
                
                schedule.scheduleJob(rule, function(){
                console.log('scheduleRecurrenceRule:' + new Date());
                });
            }

            scheduleRecurrenceRule();
            ```

            ```js
            var schedule = require('node-schedule');

            function scheduleObjectLiteralSyntax(){
                //dayOfWeek
                //month
                //dayOfMonth
                //hour
                //minute
                //second

                schedule.scheduleJob({hour: 16, minute: 11, dayOfWeek: 1}, function(){
                    console.log('scheduleObjectLiteralSyntax:' + new Date());
                });
            }

            scheduleObjectLiteralSyntax();
            ```

            取消定时器
            ```js
            var schedule = require('node-schedule');

            function scheduleCancel(){
                var counter = 1;
                var j = schedule.scheduleJob('* * * * * *', function(){
                    console.log('定时器触发次数：' + counter);
                    counter++;
                });
                setTimeout(function() {
                    console.log('定时器取消')
                    j.cancel();
                }, 5000);
            }

            scheduleCancel();
            ```

        3. 其它

            * Agenda
            * bull

