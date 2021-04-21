# nodejs常见问题

- [nodejs复合函数与中间件](#nodejs复合函数与中间件)
- [nodejs垃圾回收gc机制](#nodejs垃圾回收gc机制)
- [deno和nodejs区别](#deno和nodejs区别)
- [获取命令行传来的参数](#获取命令行传来的参数)
- [fs文件操作](#fs文件操作)
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
- [公钥加密私钥解密](#公钥加密私钥解密)
- [koa1和koa2区别](#koa1和koa2区别)
- [nodejs特点与应用场景](#nodejs特点与应用场景)
- [child_process](#child_process)
- [Nodemailer发送邮件](#Nodemailer发送邮件)
- [domain模块捕捉异常](#domain模块捕捉异常)

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

### 公钥加密私钥解密

1. 参考链接：

   [一篇文章构建你的 NodeJS 知识体系](https://juejin.im/post/6844903767926636558#heading-13)

2. 详解：
    
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