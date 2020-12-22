# js开发常见问题

- [unicode 和 utf 编解码的原理和不同](#unicode和utf编解码的原理和不同)
- [base64 和二进制的不同](#base64和二进制的不同)
- [持久化存储](#持久化存储)
- [for-in,for-of,foreach 区别](#for-in,for-of,foreach区别)
- [arguments,...values,callee,caller,this,call,apply,bind 用法](#arguments,...values,callee,caller,this,call,apply,bind用法)
- [深复制的实现](#深复制的实现)
- [节流和防抖](#节流和防抖)
- [js 函数柯里化](#js函数柯里化)
- [js 依赖注入与控制反转](js依赖注入与控制反转)
- [用户查找、光标、右键功能行为](#用户查找、光标、右键功能行为)
- [表单输入重置与 hover 提示文字](#表单输入重置与hover提示文字)
- [特殊事件与自定义事件](#特殊事件与自定义事件)
- [媒体查询匹配](#媒体查询匹配)
- [浏览器对话与打印](#浏览器对话与打印)
- [人工标注文档 Range](#人工标注文档Range)
- [height 和 top 与 y](#height和top与y)
- [delete 操作符](#delete操作符)
- [js 设计模式](#js设计模式)
- [变量的解构赋值](#变量的解构赋值)
- [深入理解promise](#深入理解promise)
- [可迭代对象](#可迭代对象)
- [reflect](#reflect)
- [深冻结](#深冻结)
- [发布订阅和观察者](#发布订阅和观察者)
- [实现链式调用](#实现链式调用)
- [数组的理解](#数组的理解)
- [typescript](#typescript)
- [MutationObserver](#MutationObserver)
- [blob](#blob)
- [webApi](#webApi)
- [video深入理解](#video深入理解)
- [获取浏览器的唯一标识](#获取浏览器的唯一标识)
- [全部替代一个子串为另一个子串](#全部替代一个子串为另一个子串)
- [isNaN和Number.isNaN函数的区别](#isNaN和Number.isNaN函数的区别)
- [three.js基本使用](#three.js基本使用)
- [跨源通信](#跨源通信)
- [ChromeBug:FontBoosting](#ChromeBug:FontBoosting)

---

### unicode 和 utf 编解码的原理和不同

1. 参考链接：

   [Unicode 和 UTF-8 字符串编码解码原理](https://blog.csdn.net/Enl0ve/article/details/82844484)

   [Unicode 和 UTF-8、UTF-16 之间的区别](https://blog.csdn.net/zengchen__acmer/article/details/75332190)

   [【编码】ASCII、Unicode、GBK 和 UTF-8 字符编码的区别联系](https://blog.csdn.net/u010262331/article/details/46013905)

   [各种常见编码的转换算法](https://blog.csdn.net/xiaolongwang2010/article/details/10311397)

2. 详解：

   Unicode 是字符集，而 UTF-8 是编码规则

   字符集为每一个字符分配一个唯一的 ID(学名为码位/码点/Code Point)，而「编码规则」则是将「码位」转换为字节序列的规则。

   起初 Unicode 规定每个字符都是用 2 个字节来表示，但是由于英文字符等只需要一个字节就可以表，那就造成了在保存英文文本时，就会浪费一倍的空间。

   UTF-8 是一种变长的编码方式。它可以使用 1~4 个字节表示一个符号，根据不同的符号而变化字节长度，当字符在 ASCII 码的范围时，就用一个字节表示，保留了 ASCII 字符一个字节的编码做为它的一部分，注意的是 unicode 一个中文字符占 2 个字节，而 UTF-8 一个中文字符占 3 个字节。从 unicode 到 uft-8 并不是直接的对应，而是要过一些算法和规则来转换。

   ```txt
   例如「田」的码位是30000，记作U+7530(30000的16进制为0x7530)。
   U+ 0000 ~ U+ 007F: 0XXXXXXX
   U+ 0080 ~ U+ 07FF: 110XXXXX 10XXXXXX
   U+ 0800 ~ U+ FFFF: 1110XXXX 10XXXXXX 10XXXXXX
   U+10000 ~ U+1FFFF: 11110XXX 10XXXXXX 10XXXXXX 10XXXXXX

   根据上表中的编码规则，之前的「田」字的码位 U+7530 属于第三行的范围：

       7    5    3    0
       0111 0101 0011 0000    二进制的 7530
   --------------------------
       0111   011111   100101 二进制的 77E5
   1110XXXX 10XXXXXX 10XXXXXX 模版（上表第三行）
   11100111 10010100 10110000 代入模版
   E   7    9   4    B   0

   这就是将 U+7530 按照 UTF-8 编码为字节序列 E794B0 的过程。反之亦然。
   ```

   UTF-8 就是每次 8 个位传输数据，而 UTF-16 就是每次 16 个位。

### base64 和二进制的不同

1. 参考链接：

   [让你完全理解 base64 是怎么回事](https://www.cnblogs.com/sweeeper/p/8462077.html)

   [一篇文章彻底弄懂 Base64 编码原理](https://blog.csdn.net/wo541075754/article/details/81734770)

   [JavaScript 用 btoa 和 atob 来编码解码 Base64](https://my.oschina.net/itblog/blog/1613977)

   [原生 JS 实现 base64 解码与编码](https://imweb.io/topic/5b8ea5327cd95ea86319358a)

2. 详解：

   Base64 编码可以将任意一组字节转换为较长的常见文本字符序列,将用户输入或二进制数据，打包成一种安全格式发送出去，无须担心其中包含冒号、换行符或二进制值等特殊字符。

   ```txt
   例子：输入Ow!

   (1) 字符串"Ow!"被拆分成3个8位的字节(0x4F、0x77、0x21)

   (2) 这3个字节构成了一个24为的二进制01001111 01110111 00100001

   (3) 这些为被划分为一些6位的序列010011、110111、011100、100001,(若不能正好平均分成每段6位，则按6和8的最小公倍数在末尾补0，位数为6和8的最小公倍数，000000用填充码=表示)

   (4) 每个6位值都表示了从0～63之间的数字，对应base64字母表中的64个字符之一。得到的base64编码字符串是4个字符的字符串“T3ch”。然后就可以通过线路将这个字符串作为“安全的”8位字符传送出去，因为只用了一些移植性最好的字符(字母、数字等)。

   a:a -- 011000 010011 101001 100001 -- YTph

   a:aa -- 011000 010011 101001 100001 011000 01xxxx xxxxxx xxxxxx -- YTphYQ==

   a:aaa -- 011000 010011 101001 100001 011000 010110 0001xx xxxxxx -- YTphYWE=

   a:aaaa -- 011000 010011 101001 100001 011000 010110 000101 100001 -- YTphYWFh
   ```

   ```txt
   编码表：

   0　A　　17　R　　　34　i　　　51　z

   1　B　　18　S　　　35　j　　　52　0

   2　C　　19　T　　　36　k　　　53　1

   3　D　　20　U　　　37　l　　　54　2

   4　E　　21　V　　　38　m　　　55　3

   5　F　　22　W　　　39　n　　　56　4

   6　G　　23　X　　　40　o　　　57　5

   7　H　　24　Y　　　41　p　　　58　6

   8　I　　25　Z　　　42　q　　　59　7

   9　J　　26　a　　　43　r　　　60　8

   10　K　　27　b　　　44　s　　　61　9

   11　L　　28　c　　　45　t　　　62　+

   12　M　　29　d　　　46　u　　　63　/

   13　N　　30　e　　　47　v

   14　O　　31　f　　　48　w　　　

   15　P　　32　g　　　49　x

   16　Q　　33　h　　　50　y
   ```

   btoa 和 atob 是 window 对象的两个函数，其中 btoa 是 binary to ascii，用于将 binary 的数据用 ascii 码表示，即 Base64 的编码过程，而 atob 则是 ascii to binary，用于将 ascii 码解析成 binary 数据

   ```js
   //方法实现
   var a = "Hello World!";
   var encodedString = btoa(string);
   console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"
   var decodedString = atob(encodedString);
   console.log(decodedString); // Outputs: "Hello World!"
   //涉及中文时，需要encodeURIComponent
   var b = "Hello, 中国！";
   //"SGVsbG8lMkMlMjAlRTQlQjglQUQlRTUlOUIlQkQlRUYlQkMlODE="
   var encodedString2 = btoa(encodeURIComponent(b));
   var decodedString2 = decodeURIComponent(atob(encodedString2));
   console.log(decodedString2); //"Hello, 中国！"
   ```


### 持久化存储

1. 参考链接：

   [持久化存储与 HTTP 缓存](https://www.jianshu.com/p/71163b408940)

   [理解 cookie、session、localStorage、sessionStorage 之不同](https://blog.csdn.net/qq_35585701/article/details/81393361)

   [浏览器数据库 IndexedDB 入门教程](http://www.ruanyifeng.com/blog/2018/07/indexeddb.html)

2. 详解：

   - LocalStorage

     关闭浏览器后，数据不会丢失

     ```js
     //1. 添加键、值
     localStorage.setItem(key, value);
     //2. 获得键、值
     localStorage.getItem(key);
     //3.清空localStorage
     localStorage.clear();
     ```

     特点：

     - LocalStorage 跟 HTTP 无关，发送请求不会带上 LocalStorage 的值
     - 只有相同域名的页面才能互相读取 LocalStorage
     - 每个域名 localStorage 最大存储量为 5Mb 左右（每个浏览器不一样）
     - 常用场景：浏览器端储存数据（不能记录密码等敏感信息）
     - LocalStorage 永久有效，除非用户清理缓存

   - SessionStorage

     会话结束后，数据丢失

     ```js
     //1. 添加键、值
     sessionStorage.setItem(key, value);
     //2. 获得键、值
     sessionStorage.getItem(key);
     //3.清空sessionStorage
     sessionStorage.clear();
     ```

     特点同上

   - indexdb

     - 描述

       IndexedDB 就是浏览器提供的本地数据库，它可以被网页脚本创建和操作。IndexedDB 允许储存大量数据，提供查找接口，还能建立索引。这些都是 LocalStorage 所不具备的。就数据库类型而言，IndexedDB 不属于关系型数据库（不支持 SQL 查询语句），更接近 NoSQL 数据库。

     - 特点

       1. 键值对储存
       2. 异步
       3. 支持事务（transaction）
       4. 同源限制
       5. 储存空间大
       6. 支持二进制储存

     - 储存路径

       1. windows 版本

       C:\Users\用户\AppData\Local\Google\Chrome\User Data\Default\IndexedDB

       2. linux 版本

       /home/用户/.config/google-chrome/Default/IndexedDB/

     - 操作

       ```js
       //打开数据库
       var request = window.indexedDB.open(databaseName, version);
       request.onerror = function (event) {
         console.log("数据库打开报错");
       };
       var db;
       request.onsuccess = function (event) {
         db = request.result;
         console.log("数据库打开成功");
       };
       var db;
       //如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件(数据库从无到有的新建过程也触发此事件)
       request.onupgradeneeded = function (event) {
         //新建数据库
         db = event.target.result;
         //新建表
         var objectStore;
         if (!db.objectStoreNames.contains("person")) {
           objectStore = db.createObjectStore(
             "person",
             { keyPath: "id" }, //主键是id
             { autoIncrement: true } //自增
           );
           //创建索引
           objectStore.createIndex("name", "name", { unique: false });
           objectStore.createIndex("email", "email", { unique: true });
         }
       };
       //通过事务添加数据
       function add() {
         var request = db
           .transaction(["person"], "readwrite")
           .objectStore("person")
           .add({
             id: 1,
             name: "张三",
             age: 24,
             email: "zhangsan@example.com",
           });

         request.onsuccess = function (event) {
           console.log("数据写入成功");
         };

         request.onerror = function (event) {
           console.log("数据写入失败");
         };
       }
       //读取数据
       function read() {
         var transaction = db.transaction(["person"]);
         var objectStore = transaction.objectStore("person");
         var request = objectStore.get(1);

         request.onerror = function (event) {
           console.log("事务失败");
         };

         request.onsuccess = function (event) {
           if (request.result) {
             console.log("Name: " + request.result.name);
             console.log("Age: " + request.result.age);
             console.log("Email: " + request.result.email);
           } else {
             console.log("未获得数据记录");
           }
         };
       }
       //遍历数据
       function readAll() {
         var objectStore = db.transaction("person").objectStore("person");

         objectStore.openCursor().onsuccess = function (event) {
           var cursor = event.target.result;

           if (cursor) {
             console.log("Id: " + cursor.key);
             console.log("Name: " + cursor.value.name);
             console.log("Age: " + cursor.value.age);
             console.log("Email: " + cursor.value.email);
             cursor.continue();
           } else {
             console.log("没有更多数据了！");
           }
         };
       }
       //更新数据
       function update() {
         var request = db
           .transaction(["person"], "readwrite")
           .objectStore("person")
           .put({ id: 1, name: "李四", age: 35, email: "lisi@example.com" });

         request.onsuccess = function (event) {
           console.log("数据更新成功");
         };

         request.onerror = function (event) {
           console.log("数据更新失败");
         };
       }
       //删除数据
       function remove() {
         var request = db
           .transaction(["person"], "readwrite")
           .objectStore("person")
           .delete(1);

         request.onsuccess = function (event) {
           console.log("数据删除成功");
         };
       }
       //使用索引
       var transaction = db.transaction(["person"], "readonly");
       var store = transaction.objectStore("person");
       var index = store.index("name");
       var request = index.get("李四");

       request.onsuccess = function (e) {
         var result = e.target.result;
         if (result) {
           // ...
         } else {
           // ...
         }
       };
       ```

   - Cookie

     Cookie 是存放在浏览器端的数据，每次都随请求发送给 Server。存储 cookie 是浏览器提供的功能。cookie 其实是存储在浏览器中的纯文本，浏览器的安装目录下会专门有一个 cookie 文件夹来存放各个域下设置的 cookie。

     特点：

     - 服务器通过 Set-Cookie 头给客户端一串字符串
     - 客户端每次访问相同域名的网页时，必须带上这段字符串
     - 客户端要在一段时间内保存这个 Cookie
     - Cookie 默认在用户关闭页面后就失效，代码可以任意设置 Cookie 的过期时间，max-age 和 Expires
     - 大小大概在 4kb 以内

     ```js
     function setCookie(cname, cvalue, exdays) {
       var d = new Date();
       d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
       var expires = "expires=" + d.toGMTString();
       document.cookie = cname + "=" + cvalue + "; " + expires;
     }

     function getCookie(cname) {
       var name = cname + "=";
       var ca = document.cookie.split(";");
       for (var i = 0; i < ca.length; i++) {
         var c = ca[i].trim();
         if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
       }
       return "";
     }

     function delete(cname) {
       var date = new Date();
       date.setTime(date.getTime() - 10000);
       document.cookie = cname + "=; expires =" + date.toGMTString();
     }
     ```

   - Session

     Session 是基于 Cookie 实现的，它利用一个 sessionId 把用户的敏感数据隐藏起来，在 Set-Cookie 上，使用随机数来做 sessionId,最终只是把这串随机数暴露给外界，而真正的信息却保存在了服务器端的 sessions 对象里面。它就像一个密码簿一样，有效的信息与 sessionId 一一对应,当下次用户访问该网站的其他页面的时候，就会带着登录时服务器给的这个 sessionId。

     特点：

     - 将 SessionID（随机数）通过 Cookie 发给客户端
     - 客户端访问服务器时，服务器读取 SessionID
     - 服务器有一块内存（哈希表）保存了所有 session
     - 通过 SessionID 可以得到对应用户的隐私信息
     - 这块内存（哈希表）就是服务器上的所有 session

   - 注意

     cookie、localstorage、sessionstorage 不可跨域：在不同同源 url 下，获取到不同的数据，只有同源 url 才共享数据。



### for-in,for-of,foreach 区别

1. 参考链接：

   [for、for in 和 for of 和 forEach 的区别](http://blog.sina.com.cn/s/blog_c112a2980102xqg9.html)

2. 详解：

   - for 一般用于循环数组
   - for-in 可循环数组、对象，会循环出下标、键值，可通过 data[key]访问
   - for-of 在 Array、Object、Set、Map 中都可以使用，会循环出值，直接访问 value 即可
   - forEach 循环在 Array、Set、Map 中都可以使用，用法：\*\*.forEach(function(value,key){})

### arguments,...values,callee,caller,call,apply,bind 用法

1. 参考链接：

   [callee、caller、call、apply、bind 这些方法的含义和使用](https://blog.csdn.net/yc123h/article/details/52729484)

   [Javascript arguments 详解](https://www.cnblogs.com/caoyc/p/5735299.html)

   [JS 中 this 到底指向谁？](https://www.cnblogs.com/huangwentian/p/6854472.html)

   [彻底搞懂 JS 中 this 机制](https://blog.csdn.net/cjgeng88/article/details/79846670)

   [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/function)

   [jQuery 源码中大量 push.call();splice.call();](https://www.jianshu.com/p/3d837e8d817d)

   [前端面试题——自己实现 call 和 apply](https://zhuanlan.zhihu.com/p/83523272)

   [JavaScript 直接调用函数与 call 调用的区别](https://blog.csdn.net/q5706503/article/details/82893277)

   [JS 中 new 运算符的实现原理](https://www.cnblogs.com/YiNongLee/p/9336609.html)

   [js 手动实现 new 方法](https://www.jianshu.com/p/9cee6a703e01)

   [前端面试大厂手写源码系列（上）](https://juejin.im/post/5e77888ff265da57187c7278#heading-8)

   [8 个原生 JS 知识点 | 面试高频](https://mp.weixin.qq.com/s/tIasEjYJRaVqFMN_aVtpiw)

   [一张图看懂Function和Object的关系及简述instanceof运算符](https://www.cnblogs.com/shuiyi/p/5343399.html)

   [面试造火箭，看下这些大厂原题](https://juejin.im/post/6859121743869509646)

2. 详解：

   - arguments

   arguments 用在函数内部,arguments.length 表示传入参数的个数，arguments.callee.length 表示函数自身参数的个数，可用 for in 或 for of 或 for 0~length-1 遍历参数

   ```js
   function add(a, b) {
     console.log(arguments, arguments.length, arguments.callee.length);
   }
   //add(1,2,3)
   //Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]
   // 3
   // 2
   ```

   - ...values

   ...values 是 es6 语法，可替代 arguments，数组储存传入的参数,for of 遍历参数较为方便

   ```js
   function add(...values) {
     console.log(values);
   }
   add(1, "a", [0], { a: 1 }, function () {});
   //[1, "a", Array(1), {…}, ƒ]
   ```

   - callee

   callee 指向函数自身，用在函数内部，用于解耦或配合 arguments 使用

   ```js
   //正常递归
   function factorial(num) {
     if (num <= 1) {
       return 1;
     } else {
       return num * factorial(num - 1);
     }
   }
   //下面的不规范行为，导致函数指向错误
   var testFactorial = factorial;
   factorial = function () {
     return 0;
   };
   testFactorial(5); //0
   //修改方法
   function factorial(num) {
     if (num <= 1) {
       return 1;
     } else {
       return num * arguments.callee(num - 1);
     }
   }

   var testFactorial = factorial;
   factorial = function () {
     return 0;
   };
   console.log(testFactorial(5)); //120
   ```

   - caller

   caller 用法是：函数名.caller，如果函数是顶层函数（没有外层函数调用），则为 null，如果有外层函数，则指向外层函数。

   ```js
   function outer() {
     inner();
   }
   function inner() {
     console.log(inner.caller);
   }
   outer(); //显示outer的源代码
   ```

   - this

     this 指向的对象为函数的上下文 context，即函数的调用者。

     - 默认绑定：window 回调函数:函数名()调用或 window 函数回调（setTimeout、setInterval），this 指向 window
     - 隐式绑定：多层调用链:函数作为数组的一个元素，通过数组下标调用，this 指向这个数组，对象 1.对象 2.函数名()调用，this 指向对象 2
     - new 绑定：函数作为构造函数，用 new 关键字调用，this 指向新 new 出的对象
     - 显式绑定:call,apply 导致 this 指向第一个参数指定的地方，对于 null 和 undefined 的绑定将不会生效
     - 箭头函数只取决于外层（函数或全局）的作用域，对于前面的 4 种绑定规则是不会生效，因此需要外层 var that = this，供箭头函数内部使用

     注意：function 中嵌 function，this 全指向 window。使用 axios 和\$ajax 对象，需保存外部 this，避免指向对象本身。

   - call,apply

     call,apply 用于改变函数执行的作用域，即改变函数体内 this 的指向。区别在于：call 的第二个参数起要逐一列出，apply 第二个参数可以是 array 或 arguments

     ```js
     window.color = "red";
     var o = {
       color: "blue",
     };
     function sayColor(color) {
       console.log(this.color + " param:" + color);
     }
     sayColor("black"); //red param:black

     sayColor.call(window, "black"); //red param:black
     sayColor.apply(window, ["black"]); //red param:black

     sayColor.call(o, "black"); //blue param:black
     sayColor.apply(o, ["black"]); //blue param:black
     ```

     - 合并数组

       ```js
       var arr1 = [1, 2, 3];
       var arr2 = [4, 5, 6];
       var arr3 = Array.prototype.push.call(arr1, arr2);
       console.log(arr3);
       console.log(arr1);
       console.log(arr2);
       4(4)[(1, 2, 3, Array(3))](3)[(4, 5, 6)];

       var arr1 = [1, 2, 3];
       var arr2 = [4, 5, 6];
       var arr3 = Array.prototype.push.apply(arr1, arr2);
       console.log(arr3);
       console.log(arr1);
       console.log(arr2);
       6(6)[(1, 2, 3, 4, 5, 6)](3)[(4, 5, 6)];

       //造成输出的区别，是因为call的第二个参数起是枚举，apply的第二个参数是数组
       var arr1 = [1, 2, 3];
       var arr2 = [4, 5, 6];
       var arr3 = Array.prototype.push.call(arr1, ...arr2);
       console.log(arr3);
       console.log(arr1);
       console.log(arr2);
       4(6)[(1, 2, 3, 4, 5, 6)](3)[(4, 5, 6)];
       ```

     - 对象转数组

       ```js
       var obj = { 0: "hello", 1: "world", length: 2 };
       console.log(Array.prototype.slice.call(obj));
       (2)[("hello", "world")];

       var obj = { 0: "hello", 1: "world", length: 2 };
       console.log(Array.prototype.slice.apply(obj));
       (2)[("hello", "world")];
       ```

     - 获取索引

       ```js
       var arr = [1, 2, 3];
       console.log(Array.prototype.indexOf.call(arr, 2));
       1;

       var arr = [1, 2, 3];
       console.log(Array.prototype.indexOf.apply(arr, [2]));
       1;
       ```

     - 自己实现 call 和 apply

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
        ```


    * 直接调用与call、apply区别
    
        1. 情景1：使用自身对象不存在的方法，无法直接调用，如arguments想使用Array.prototype.slice
    
        2. 情景2：改变this指向，产生于直接调用不同的结果
    
            ```js
            var x = "我是全局变量";
            function a(){
                this.x = "我是在函数类结构a中声明的哦";
            }
            function f(){
                alert (this.x);
            }
            f();//输出：“我是全局变量”
            f.call(new a());//输出：“我是在函数类结构a中声明的哦”
            ```
    
        3. 情景3：上面2种情况都不是，和直接调用没区别
    
    * bind
    
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
    Function.prototype.my_bind = function(context,...args) {
        var self = this;
        context = context || window;
        args = args || [];
        return function(...rest) {
            self.apply(context, args.concat(rest));
        }
    }
    ```
    
    * new
    
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

    * typeof

    对于 typeof, 可以正确判断除了null之外的所有基本类型，而对于引用类型，除了函数外其他都会被判断为object。
    ```js
    // 输出 function
    console.log(typeof (() => {}))

    // 输出 object
    console.log(typeof ['前端有的玩','公众号'])

    // 输出 object
    console.log(typeof null)

    // 输出 undefined
    console.log(typeof undefined)

    // 输出 function 
    console.log(typeof Function.prototype)
    ```
    
    * instanceof
  
      简写:a instanceof b ,判断a是否b的实例，即a从b处new出来
      ```js
      a.__proto__ == b.prototype 或
      a.constructor == b
      ```
  
      详细:[]是Array实例，也是Object实例
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

      对于instanceof,无法判断基本类型，但可以正确判断引用类型
      ```js
      Function instanceof Object;//true
      Object instanceof Function;//true
      
      //①构造器Function的构造器是它自身
      Function.constructor=== Function;//true

      //构造器Object的构造器是Function（由此可知所有构造器的constructor都指向Function）
      Object.constructor === Function;//true

      //③构造器Function的__proto__是一个特殊的匿名函数function() {}
      console.log(Function.__proto__);//function() {}

      //这个特殊的匿名函数的__proto__指向Object的prototype原型。
      Function.__proto__.__proto__ === Object.prototype//true

      //Object的__proto__指向Function的prototype，也就是上面③中所述的特殊匿名函数
      Object.__proto__ === Function.prototype;//true
      Function.prototype === Function.__proto__;//true

      Function.__proto__.__proto__ === Object.prototype;//true
      Object.__proto__ === Function.prototype;//true

      //1、所有的构造器的constructor都指向Function
      //2、Function的prototype指向一个特殊匿名函数，而这个特殊匿名函数的__proto__指向Object.prototype

      // 输出 false
      console.log('子君' instanceof String)

      // 输出 true
      console.log(new Date() instanceof Date)
      ```
    
    * object.create
    
      会将参数对象作为一个新创建的空对象的原型, 并返回这个空对象，且继承原对象
  
      使用方式
      ```js
      function Person(name, sex) {
        this.name = name;
        this.sex = sex;
      }
      Person.prototype.getInfo = function() {
        console.log('getInfo: [name:' + this.name + ', sex:' + this.sex + ']');
      }
      var a = new Person('jojo', 'femal');
      var b = Object.create(Person.prototype, {
        name: {
          value: 'coco',
          writable: true,
          configurable: true,
          enumerable: true,
        },
        sex: {
          enumerable: true,
          get: function(){ return 'hello sex'},
          set: function(val){console.log('set value:' + val)}
        }
      });
      console.log(a,b)
      ```
      手写
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


### 深复制的实现

1. 参考链接：

   [深入 js 深拷贝对象](https://www.jianshu.com/p/b08bc61714c7)

   [JS 如何进行对象的深克隆（深拷贝）？](https://www.cnblogs.com/tangjiao/p/9313829.html)

2. 详解：

   - 递归法(简单常用，可复制原型链属性**proto**，无法处理对象成环、特殊类型 symbol、不可枚举属性 get/set)

   ```js
   function deepClone(obj) {
     if (typeof obj !== "object") {
       throw new Error("obj 不是一个对象！");
     }

     let isArray = Array.isArray(obj);
     let cloneObj = isArray ? [] : {};
     for (let key in obj) {
       cloneObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key];
     }

     return cloneObj;
   }
   ```

   - 代理法(可 symbol，无法处理对象成环、不可复制原型链属性**proto**、不可枚举属性 get/set)

   ```js
   function deepClone(obj) {
     if (typeof obj !== "object") {
       throw new Error("obj 不是一个对象！");
     }

     let isArray = Array.isArray(obj);
     let cloneObj = isArray ? [...obj] : { ...obj };
     Reflect.ownKeys(cloneObj).forEach((key) => {
       cloneObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key];
     });

     return cloneObj;
   }
   ```

   ```js
   function deepClone(obj) {
     if (obj == null) {
       return null;
     }
     var result = Array.isArray(obj) ? [] : {};
     for (let key in obj) {
       if (obj.hasOwnProperty(key)) {
         if (typeof obj[key] === "object") {
           result[key] = deepClone(obj[key]); // 如果是对象，再次调用该方法自身
         } else {
           result[key] = obj[key];
         }
       }
     }
     return result;
   }
   ```

   - 序列化法(只能处理数组和对象，且对象不能成环)

   ```js
   function deepClone(obj) {
     return JSON.parse(JSON.stringify(obj));
   }
   ```

   提示:JSON.stringify 有 3 个参数，第一个是常用的，需要序列化的对象，第二个是存在时，根据输入返回对象属性的值，第三个参数控制序列化后每个级别缩进指定数量空格

   - lodash 法(较完善)

   ```js
   let result = _.cloneDeep(test);
   ```

   - 组合法(无法处理日期和正则，Object.getOwnPropertyDescriptor 的 value 是浅拷贝)

   ```js
   function cloneDeep(obj) {
     let family = {};
     let parent = Object.getPrototypeOf(obj);

     while (parent != null) {
       family = completeAssign(deepClone(family), parent);
       parent = Object.getPrototypeOf(parent);
     }

     function completeAssign(target, ...sources) {
       sources.forEach((source) => {
         let descriptors = Object.keys(source).reduce((descriptors, key) => {
           descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
           return descriptors;
         }, {});

         // Object.assign 默认也会拷贝可枚举的Symbols
         Object.getOwnPropertySymbols(source).forEach((sym) => {
           let descriptor = Object.getOwnPropertyDescriptor(source, sym);
           if (descriptor.enumerable) {
             descriptors[sym] = descriptor;
           }
         });
         Object.defineProperties(target, descriptors);
       });
       return target;
     }

     return completeAssign(deepClone(obj), family);
   }
   ```

   专门针对特殊类型

   ```js
   var clone = function (obj) {
     if (obj === null) return null;
     if (obj.constructor !== "object") return obj;
     if (obj.constructor === Date) return new Date(obj);
     if (obj.constructor === RegExp) return new RegExp(obj);
     var newObj = new obj.constructor(); //保持继承的原型
     for (var key in obj) {
       if (obj.hasOwnProperty(key)) {
         var val = obj[key];
         newObj[key] = typeof val === "object" ? arguments.callee(val) : val;
       }
     }
     return newObj;
   };
   ```

   特殊类型+成环

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

### 节流和防抖

1. 参考链接：

   [函数防抖和节流](https://www.jianshu.com/p/c8b86b09daf0)

   [js 防抖和节流](https://www.cnblogs.com/momo798/p/9177767.html)

2. 详解：

   - 防抖（debounce）

     触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。

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
      console.log(val);
    }, 1000,true)
    window.onclick = function () {
      handle(Math.random())
    }
     ```

   - 节流（throttle）

     连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率。

      ```js
      function throttle(fn, wait, isDate) {
        let previous = 0;
        let timer = null;

        return function (...args) {
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
      var handle = throttle(function (val) {
        console.log(val);
      }, 1000, true)
      window.onclick = function () {
        handle(Math.random())
      }
      ```


### js 函数柯里化

1. 参考链接：

   [详解 JS 函数柯里化](https://www.jianshu.com/p/2975c25e4d71)

   [前端柯里化的三种作用](https://blog.csdn.net/qq_39674542/article/details/82657109)

2. 详解：

   Currying 是把接受多个参数的函数变换成接受一个单一参数的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

   - 柯里化:高阶函数

     ```js
     function add(x, y) {
       return x + y;
     }
     function curryingAdd(x) {
       return function (y) {
         return x + y;
       };
     }
     add(1, 2); // 3
     curryingAdd(1)(2); // 3
     ```

   - 好处：

     - 参数复用

       ```js
       function check(reg, txt) {
         return reg.test(txt);
       }

       check(/\d+/g, "test"); //false
       check(/[a-z]+/g, "test"); //true

       function curryingCheck(reg) {
         return function (txt) {
           return reg.test(txt);
         };
       }
       var hasNumber = curryingCheck(/\d+/g);
       var hasLetter = curryingCheck(/[a-z]+/g);

       hasNumber("test1"); // true
       hasNumber("testtest"); // false
       hasLetter("21212"); // false
       ```

     - 延迟执行：累积传入的参数，最后执行
     - 固定易变因素：传参固定下来，生成一个更明确的应用函数。如 bind 函数用以固定 this 这个易变对象。

   - 封装

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

   - 反柯里化：把原来已经固定的参数或者 this 上下文等当作参数延迟到未来传递

   - 题目

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

### js 依赖注入与控制反转

1. 参考链接：

   [细数 Javascript 技术栈中的四种依赖注入](https://www.cnblogs.com/front-end-ralph/p/5208045.html)

2. 详解：

   - 场景

     A 想调用 B 的某些方法，于是 A 里面就要 new 一个 B，后来 A 不用 B 了，想用 C，于是就需要改 A 的代码，new B 变为 new C，代码耦合性高。

     因此，如果有一个容器能给到 A，A 就能用到 B、C、D...的方法，而且没经调用的方法，不实例化对象，同样 B 也能通过容器用到其它方法，于是就用到依赖注入与控制反转。

   - 依赖注入与控制反转

     依赖注入与控制反转描述的是同一件事情，A 靠注入的容器获取外部资源，容器反过来控制了 A 想获得的资源。

   - 实现


        ```js
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
        ```


### 用户查找、光标、右键功能行为

1. 参考链接：

   [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)

2. 详解：

   - 浏览器搜索功能(ctrl F 或 js window.find),无需遍历 json 或后台处理

   ```js
   //有bug，未来可能废弃
   window.find(
     要搜索的字符串,
     true区分大小写,
     true向上搜索,
     true循环搜索,
     true全字匹配搜索(该参数无效),
     true会搜索框架内的文本,
     true弹出一个搜索对话框
   );
   ```

   - 用户选择的文本范围或光标的当前位置(window.getSelection 或 Document.getSelection())

   ```js
   const selection = window.getSelection();
   const selection2 = document.getSelection();
   //属性
   //Selection {anchorNode: text, anchorOffset: 37, focusNode: text, focusOffset: 41, isCollapsed: false, …}
   //>anchorNode: text 选区开始位置所属的节点
   //>anchorOffset: 37 选区开始位置
   //>baseNode: text
   //>baseOffset: 37
   //>extentNode: text
   //>extentOffset: 41
   //>focusNode: text 选区结束位置所属的节点
   //>focusOffset: 41 选区结束位置
   //>isCollapsed: false 选区的起始点和终止点是否位于一个位置
   //>rangeCount: 1 选区中range对象数量(跨越多少个标签)
   //>type: "Range" 选区类型
   //方法
   //containsNode()判断指定的节点是否包含在Selection中
   //更多方法查看mdn
   ```

   - 禁用右键功能

   ```js
   window.oncontextmenu = function () {
     return false;
   };
   ```

   - 禁止选中文本

   ```js
   window.onselectstart = function () {
     return false;
   };
   ```

   - 禁止复制

   ```js
   document.oncopy = function () {
     return false;
   };
   ```

### 表单输入重置与 hover 提示文字

1. 参考链接：

   [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)

2. 详解：

   - 表单重置

     Form.reset()或点击 input type=reset

   - 提交按钮使用图片

     input type=image src

   - hover 显示提示文字

     title 属性

### 特殊事件与自定义事件

1. 参考链接：

   [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)

2. 详解：

   - 浏览器失去/正常网络连接,navigator.onLine 为 false/true 时，触发事件 offline/online
   - 设备的纵横方向改变事件:orientationchange
   - 存储区域（localStorage 或 sessionStorage）被修改,触发 storage 事件
   - Promise 被 reject 且没有 reject 处理,触发 unhandledrejection,值兼容 chrome，edge，firefox
   - 自定义事件 CustomEvent

   ```js
   obj.addEventListener("cat", function (e) {
     process(e.detail);
   });

   //事件名称：cat，配置项：bubbles默认false不冒泡，cancelable默认false事件不可取消，detail事件初始化时传递的数据.
   var event = new CustomEvent("cat", {
     detail: {
       hazcheeseburger: true,
     },
   });
   //继承event所有属性和方法
   //bubbles: false
   //cancelBubble: false
   //cancelable: false
   //composed: false
   //currentTarget: null
   //defaultPrevented: false
   //detail: {hazcheeseburger: true}
   //eventPhase: 0
   //isTrusted: false
   //path: []
   //returnValue: true
   //srcElement: null
   //target: null
   //timeStamp: 480928.11999982223
   //type: "cat"
   //Event.composedPath()
   //Event.preventDefault()
   //Event.stopImmediatePropagation()
   //Event.stopPropagation()
   obj.dispatchEvent(event);
   ```



### 媒体查询匹配

1. 参考链接：

   [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)

2. 详解：

   ```js
   window.matchMedia("(min-width: 400px)");
   //matches: true
   //media: "(min-width: 400px)"
   //onchange: null
   //__proto__: MediaQueryList
   ```

### 浏览器对话与打印

1. 参考链接：

   [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)

2. 详解：

   - window.prompt 对话框

   ```js
   用户输入文字 = window.prompt(提示用户输入文字, 文本输入框默认值);
   ```

   - console.assert()断言

   ```js
   const errorMsg = "the # is not even";
   for (let number = 2; number <= 5; number += 1) {
     console.log("the # is " + number);
     console.assert(number % 2 === 0, { number: number, errorMsg: errorMsg });
     // 或者使用 ES2015 对象简写:
     // console.assert(number % 2 === 0, {number, errorMsg});
   }
   // 输出:
   // the # is 2
   // the # is 3
   // Assertion failed: {number: 3, errorMsg: "the # is not even"}
   // the # is 4
   // the # is 5
   // Assertion failed: {number: 5, errorMsg: "the # is not even"}
   ```

   - Console.count() Console.countReset() 输出计数

   ```js
   var user = "";

   function greet() {
     console.count();
     return "hi " + user;
   }

   user = "bob";
   greet();
   user = "alice";
   greet();
   greet();
   console.count();
   console.countReset();
   // 输出:
   // "default: 1"
   // "default: 2"
   // "default: 3"
   // "default: 1"
   // "default: 0"
   var user = "";

   function greet() {
     console.count(user);
     return "hi " + user;
   }

   user = "bob";
   greet();
   user = "alice";
   greet();
   greet();
   console.countReset("bob");
   console.count("alice");
   // 输出:
   // "bob: 1"
   // "alice: 1"
   // "alice: 2"
   // "bob: 0"
   // "alice: 3"
   ```

   - console.dir 打印对象树

   ```js
   console.dir(object);
   ```

   - Console.dirxml()显示 xml/html 交互树(可折叠拉伸的标签)

   ```js
   console.dir(object);
   ```

   - console.log console.info console.warn console.error console.debug 输出不同级别信息

   ```js
   console.log(obj1,obj2...)
   console.info(obj1,obj2...)
   console.warn(obj1,obj2...)
   console.error(obj1,obj2...)
   console.debug(obj1,obj2...)
   console.log('String: %s, Int: %d,Float: %f, Object: %o, Style: %c', "字符串", "整数", "浮点数", "对象", "样式")
   console.log('the word is %s try number %d', 'foo', 123)
   console.log(`temp的值为: ${temp}`)
   console.log("%c3D Text"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em")
   ```

   - console.group console.groupCollapsed console.groupEnd()输出分组

     - console.group 创建新的分组.内容输出当前分组,直到调用 console.groupEnd()之后,结束分组
     - console.groupCollapsed 与 group 的区别是输出内容不折叠
     - console.groupEnd 结束分组

   - Console.table 打印表格

   ```js
   //可点击列名排序
   console.table([
     ["John", "Smith"],
     ["Jane", "Doe"],
     ["Emily", "Jones"],
   ]);
   //可隐藏指定列
   console.table(
     [
       ["John", "Smith"],
       ["Jane", "Doe"],
       ["Emily", "Jones"],
     ],
     ["1"]
   );
   ```

   - console.time console.timeEnd console.timeLog 打印占用时长

     - console.time(timerName)计时开始
     - console.timeEnd(timerName)计时结束，打印经过的时间
     - console.timeLog(timerName)计时结束，打印经过的时间,并带上 timer 名

   - console.trace()输出堆栈跟踪

### 人工标注文档 Range

1. 参考链接：

   [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)

   [JS Range 对象的使用](https://blog.csdn.net/m0_37885651/article/details/88353305)

   [JavaScript 之 Range--或许会有点用](https://segmentfault.com/a/1190000015142374)

2. 详解：

   - 应用场景：文档标注

   - range 储存网页选中文字位置

     - window.getSelection().getRangeAt(0) Selection 转 Range

     ```js
     collapsed: false//是否起始点和结束点是同一个位置
     commonAncestorContainer: text//返回目标节点的共有祖先节点
     endContainer: text//返回结束的Node
     endOffset: 96//返回结束位置在目标节点起始的偏移值
     startContainer: text//返回开始的Node
     startOffset: 19//返回开始位置在目标节点起始的偏移值
     __proto__: Range
     //方法
     Range.cloneContents()//返回DocumentFragment，可用于插入节点
     Range.cloneRange()//返回被克隆range
     Range.selectNode()//设置range包含整个节点
     Range.selectNodeContents()//设置Range包含节点的内容
     Range.collapse(bool)//设置起始点和结束点是否折叠
     Range.compareBoundaryPoints(how, sourceRange)//返回边界节点与指定范围对比
     //how:
     //Range.END_TO_END尾与尾对比
     //Range.END_TO_START尾与始对比
     //Range.START_TO_END始与尾对比
     //Range.START_TO_START始与始对比
     //返回值：-1,0,1表示前于，相同，后于
     Range.comparePoint(新节点，偏移量)//节点与新节点的偏移量比较，返回值：-1,0,1表示前于，相同，后于
     Range.createContextualFragment(string)//字符串转DocumentFragment
     Range.deleteContents()//移除内容
     Range.detach()//使range锁定或解锁
     documentFragment = range.extractContents()//range转documentFragment
     boundingRect = range.getBoundingClientRect()//返回矩形
     rectList = range.getClientRects()//返回矩形列表
     Range.insertNode(新节点)//在Range的起始位置插入节点
     bool = range.intersectsNode(节点)//判断节点与范围是否相交
     bool = range.isPointInRange(新节点，偏移量)//判断节点的偏移量与范围是否相交
     Range.setEnd(新节点，偏移量)//设置Range结束位置
     Range.setEndAfter(节点)//设置Range结束位置在指定节点之后
     Range.setEndBefore(节点)//设置Range结束位置在指定节点之前
     Range.setStart(新节点，偏移量)//设置Range起始位置
     Range.setStartAfter(节点)//设置Range起始位置在指定节点之后
     Range.setStartBefore(节点)//设置Range起始位置在指定节点之前
     Range.surroundContents(新节点)//将Range内容移动到新节点
     text = range.toString()//Range序列化字符串
     ```

     - 手动创建 Range

     ```js
     var range = document.createRange();
     range.setStart(startContainer, startOffset);
     range.setEnd(endContainer, endOffset);
     ```

     - xpath(xml 路径语言)和 range 互转

     ```js
     function getElementXPath(element) {
       if (!element) return null;

       if (element.id) {
         return `//*[@id=${element.id}]`;
       } else if (element.tagName === "BODY") {
         return "/html/body";
       } else {
         const sameTagSiblings = Array.from(
           element.parentNode.childNodes
         ).filter((e) => e.nodeName === element.nodeName);
         const idx = sameTagSiblings.indexOf(element);

         return (
           getElementXPath(element.parentNode) +
           "/" +
           element.tagName.toLowerCase() +
           (sameTagSiblings.length > 1 ? `[${idx + 1}]` : "")
         );
       }
     }
     function createRangeFromXPathRange(xpathRange) {
       var startContainer,
         endContainer,
         endOffset,
         evaluator = new XPathEvaluator();

       // must have legal start and end container nodes
       startContainer = evaluator.evaluate(
         xpathRange.startContainerPath,
         document.documentElement,
         null,
         XPathResult.FIRST_ORDERED_NODE_TYPE,
         null
       );
       if (!startContainer.singleNodeValue) {
         return null;
       }

       if (xpathRange.collapsed || !xpathRange.endContainerPath) {
         endContainer = startContainer;
         endOffset = xpathRange.startOffset;
       } else {
         endContainer = evaluator.evaluate(
           xpathRange.endContainerPath,
           document.documentElement,
           null,
           XPathResult.FIRST_ORDERED_NODE_TYPE,
           null
         );
         if (!endContainer.singleNodeValue) {
           return null;
         }

         endOffset = xpathRange.endOffset;
       }

       // map to range object
       var range = document.createRange();
       range.setStart(startContainer.singleNodeValue, xpathRange.startOffset);
       range.setEnd(endContainer.singleNodeValue, endOffset);
       return range;
     }
     ```

### height 和 top 与 y

1. 参考链接：

   [Measuring Element Dimension and Location with CSSOM in Windows Internet Explorer 9](<https://docs.microsoft.com/en-us/previous-versions/hh781509(v=vs.85)>)

   [getBoundingClientRect 的用法](https://www.cnblogs.com/Songyc/p/4458570.html)

   [js 窗口尺寸获取常用属性](https://blog.csdn.net/csdnxcn/article/details/77886499)

2. 详解：

   外层蓝色父元素与包裹内层红色子元素，虚线与实线间为 margin，深色区为 border-width，内虚线到深色区为 padding，内层灰色区为滚动区。

   ![position1](./position1.png)
   ![position2](./position2.png)
   ![position3](./position3.png)

   - object.getBoundingClientRect()

     获取元素相对于视窗的位置集合，集合中有 top, right, bottom, left 等属性。

     ![getBoundingClientRect](./getBoundingClientRect.jpg)

   - height 相关

     - box-sizing:border-box 怪异模式

       totalHeight=contentHeight(padding 向内收)+margin

     - box-sizing:content-box 标准模式

       totalHeight=contentHeight+padding(padding 向外张)+border+margin

   - scroll 相关

     - scrollTop:距离滚动区顶部距离
     - scrollHeight:滚动区高度

   - offset 相关

     - offsetTop:距离父元素顶部距离(不包含边线)
     - offsetHeight:距离父元素顶部距离(包含边线)
     - offsetY:指针距离元素顶部距离(不含 border，旋转不变)

   - layer 相关

     - layerY:指针距离元素顶部距离(含 border，旋转不变)

   - client 相关

     - clientTop:边框厚度，相当于 borderTopWidth
     - clientHeight:包含 padding 的内容高度，不包括滚动
     - clientY:指针距离可视区顶部距离

   - page 相关

     - pageY:指针距离文档顶部距离

   - screen 相关

     - screenY:指针距离屏幕顶部距离

   - y:指针相对于当前文档 y 坐标


### delete 操作符

1. 参考链接：

   [delete 操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete)

2. 详解：

   ```js
   //delete 操作符用于删除对象的某个属性；如果没有指向这个属性的引用，那它最终会被释放。
   //delete object.property
   //delete object['property']
   //对于所有情况都是true，除非属性是一个自己不可配置的属性，在这种情况下，非严格模式返回 false。
   //不可设置的(Non-configurable)属性不能被移除。Math, Array, Object内置对象的属性以及使用Object.defineProperty()方法设置为不可设置的属性不能被删除,返回false。
   //非对象类型，使用delete会返回false。
   const Employee = {
     firstname: "John",
     lastname: "Doe",
   };

   console.log(Employee.firstname);
   // expected output: "John"

   delete Employee.firstname;

   console.log(Employee.firstname);
   // expected output: undefined
   ```



### js 设计模式

1. 参考链接：

   - [Java 设计模式：23 种设计模式全面解析（超级详细）](http://c.biancheng.net/design_pattern/)
   - [JS 设计模式](https://www.cnblogs.com/panrui1994/p/9402831.html)
   - [23 种 JavaScript 设计模式](https://www.cnblogs.com/qiu-freedom/p/9135129.html)
   - [js 继承的 6 种方式](https://www.cnblogs.com/ranyonsue/p/11201730.html)
   - [JS 继承的几种方式](https://zhuanlan.zhihu.com/p/62278342)
   - [ECMAScript 6 入门](https://es6.ruanyifeng.com/?search=class&x=0&y=0#docs/class)
   - [理解 es6 中 class 构造以及继承的底层实现原理](https://www.cnblogs.com/memphis-f/p/12029574.html)
   - [前端渣渣唠嗑一下前端中的设计模式（真实场景例子）](https://juejin.im/post/5e0eaff4e51d45413b7b77f3)
   - [8 个原生 JS 知识点 | 面试高频](https://mp.weixin.qq.com/s/tIasEjYJRaVqFMN_aVtpiw)
   - [“浅尝”JavaScript设计模式](https://juejin.im/post/5eb3be806fb9a043426818c7#heading-5)
   - [proxy-polyfill](https://github.com/linsk1998/proxy-polyfill/blob/master/proxy.js)
   - [进阶必读：深入理解 JavaScript 原型](https://juejin.cn/post/6901494216074100750)

2. 详解：

    * 原型链

      * 定义

        原型对象上有一个 constructor 属性指向构造函数；实例对象上有一*proto* 属性指向原型对象，通过*proto*可以一直往上寻找原型对象，直到为 null，由*proto*串起来的路径就是原型链。

      * 作用

        在访问一个对象的属性时，实际上是在查询原型链。这个对象是原型链的第一个元素，先检查它是否包含属性名，如果包含则返回属性值，否则检查原型链上的第二个元素，以此类推。

      * 关于prototype

        对象分 2 种：函数对象和普通对象，只有函数对象拥有原型对象（prototype），prototype 的本质是普通对象，new 操作得到的对象是普通对象。



    * 继承的实现

      父类

      ```js
      function Father(name) {
        // 属性
        (this.name = name || "father"),
          // 实例方法
          (this.sleep = function () {
            console.log(this.name + "正在睡觉");
          });
      }
      // 原型方法
      Father.prototype.look = function (book) {
        console.log(this.name + "正在看:" + book);
      };
      ```

      1. 原型链

        ```js
        function Son(){

        }
        Son.prototype = new Father();  // 相当于重写了Son的原型
        Son.prototype.constructor = Son; //  一定要把Son原型上的contructor重新指向Son

        var son = new Son();
        console.log(son.sleep()); // father正在睡觉
        console.log(son.look('TV')); // father正在看TV
        ```

        缺点：无法向父构造函数传参，共享父类属性
  
      2. 借用构造函数
  
          ```js
          function Son(name){
              Father.call(this);
              this.name = name;
          }
          var son = new Son('son')
          console.log(son.sleep()) //son正在睡觉
          console.log(son.look('TV')) // son正在看TV
          ```
          缺点：只继承构造函数属性，没继承构造父类原型属性，没法复用，新实例都调用父构造函数。
  
      3. 冒充对象继承
  
          ```js
          function Son(){
              var temp = new Father()
              for(var k in temp){
                  this[k] = temp[k]
              }
              temp = null
          }
  
          var son = new Son()
          console.log(son.sleep()) // father正在睡觉
          console.log(son.look('TV')) // father正在看TV
          ```
          缺点：遍历繁琐，没解决向父构造函数传参问题
  
      4. 组合继承(原型链+call)
  
          ```js
          function Son(){
              Father.call(this)
          }
          Son.prototype = new Father();
          Son.prototype.constructor = Son;
  
          var son = new Son()
          console.log(son.sleep()) // father正在睡觉
          console.log(son.look('TV')) // father正在看TV
          ```
          缺点：调用了两次父类构造函数（耗内存），子类的构造函数会代替原型上的那个父类构造函数。
  
      5. 原型式继承
  
          通过 Object.create 或者 Object.setPrototypeOf 显式继承另一个对象，将它设置为原型。

          通过 constructor 构造函数，在使用 new 关键字实例化时，会自动继承 constructor 的 prototype 对象，作为实例的原型。

          ```js
          function createObject(o){
              function fn(){}
              fn.prototype = o;
              return new fn();
          }
          var father = new Father();
          var son = createObject(father);
          console.log(son.sleep()) // father正在睡觉
          console.log(son.look('TV')) // father正在看TV
          ```
          缺点：所有实例都会继承原型上的属性。无法实现复用。（新实例属性都是后面添加的）
  
      6. 寄生式继承
  
          ```js
          function createObject(o){
              function fn(){}
              fn.prototype = o;
              return new fn();
          }
          var father = new Father();
          function Son(o){
              var son = createObject(o);
              son.name = 'son';
              return son;
          }
          var son = Son(father);
          console.log(son.sleep()) // son正在睡觉
          console.log(son.look('TV')) // son正在看TV
          ```
          缺点：没用到原型，无法复用。
  
      7. 最佳：寄生组合继承

          ConstructorB 如何继承 ConstructorA

          编写新的 constructor，将两个 constructor 通过 call/apply 的方式，合并它们的属性初始化。按照超类优先的顺序进行。

          取出超类和子类的原型对象，通过 Object.create/Object.setPrototypeOf 显式原型继承的方式，设置子类的原型为超类原型。
  
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
  
      8. es6class继承
  
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
  
          * class原理(使用babel理解)：组合寄生继承
  
          super() 等同于Parent.prototype.construtor()
  
          ```js
          class Parent {
              constructor(a){
                  this.filed1 = a;
              }
              filed2 = 2;
              func1 = function(){}
          }
          class Child extends Parent {
              constructor(a,b) {
                  super(a);
                  this.filed3 = b;
              }
              filed4 = 1;
              func2 = function(){}
          }
  
          function _classCallCheck(instance, Constructor) {
              // instanceof 检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
              if (!(instance instanceof Constructor)) {
                  throw new TypeError("Cannot call a class as a function");
              }
          }
          var Parent = function Parent(a) {
              _classCallCheck(this, Parent);
  
              this.filed2 = 2;
  
              this.func1 = function () { };
  
              this.filed1 = a;
          };
          var Child = function (_Parent) {
              _inherits(Child, _Parent);
  
              function Child(a, b) {
                  _classCallCheck(this, Child);
  
                  var _this = _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).call(this, a));
  
                  _this.filed4 = 1;
  
                  _this.func2 = function () {};
  
                  _this.filed3 = b;
                  return _this;
              }
  
              return Child;
          }(Parent);
          function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                  throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, {
                  constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
              });
              if (superClass)
                  Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
              }
          }
          ```
    
    * 设计模式总览
        1. 创建型模式
            * 抽象工厂模式
            * 生成器模式
            * 工厂方法模式
            * 单例模式
            * 原型模式
        2. 结构型模式
            * 适配器模式
            * 桥接模式
            * 组合模式
            * 装饰者模式
            * 外观模式
            * 享元模式
            * 代理模式
        3. 行为型模式
            * 责任链模式
            * 命令模式
            * 解释器模式
            * 迭代器模式
            * 中介者模式
            * 备忘录模式
            * 观察者模式
            * 状态模式
            * 策略模式
            * 模板方法模式
            * 访问者模式
    
    * 抽象工厂模式(接口)
    
        不需要建具体类，就可以对一堆类建模
        ```js
        class IHeroFactory {
            createAbilities() {}
            createEquipment() {}
            createSkills() {}
        }
    
        class SwordsmanFactory extends IHeroFactory {
            createAbilities() {
                return new SwordsmanAbility();
            }
            createEquipment() {
                return new SwordsmanEquipment();
            }
            createSkills() {
                return new SwordsmanSkill();
            }
        }
        //es5
        //function SwordsmanFactory(){}
        //SwordsmanFactory.prototype = new IHeroFactory();
        //SwordsmanFactory.prototype.createAbilities = function(){return new SwordsmanAbility();}
        ```
    
    * 生成器模式(构造函数)
    
        用于创建由其他对象组合构成的对象的模式，生成器知道所有的细节，且创建细节完全对其他相关类屏蔽。
        ```js
        class Person{
            constructor(name,age,job){
                this.name = name;
                this.age = age;
                this.job = "job:" + job;
                this.speak = function(){
                    console.log(this.name);
                };
            }
        }
        function Person(name,age,job){
            this.name = name;
            this.age = age;
            this.job = "job:" + job;
            this.speak = function(){
                console.log(this.name);
            };
        }
        var person1 = new Person("Alice", 23, "a");
        var person2 = new Person("Bruce", 22, "b");
        ```
    
    * 工厂模式
    
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
    
    * 单例模式
    
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
    
    * 原型模式
    
        通过克隆或拷贝对象来生成对象,所有实例就共用了同一些方法或属性。
        ```js
        //写法1
        function Person(){
            Person.prototype.name = "aaa";
            Person.prototype.sayName = function(){
                alert(this.name);
            }
        };
        var person1 = new Person();
        person1.sayName();//"aaa"
        var person2 = new Person();
        person2.sayName();//"aaa"
    
        person1.name = "bbb";
        alert(person1.name);//bbb
        alert(person2.name);//aaa来自原型
        delete person1.name;
        alert(person1.name);//aaa来自原型
    
        //写法2
        var Person = {
            name: 'aaa',
            sayName: function(){
                alert(this.name);
            }
        };
        var person1 = Object.create(Person);
        person1.sayName();//"aaa"
        var person2 = Object.create(Person);
        person2.sayName();//"aaa"
    
        person1.name = "bbb";
        alert(person1.name);//bbb
        alert(person2.name);//aaa来自原型
        delete person1.name;
        alert(person1.name);//aaa来自原型
        ```
    
    * 适配器模式
    
        允许使用任何现有接口适配为目标接口
        ```js
        //方法适配
        var a = {
            say1: function(){
                console.log('a');
            }
        };
        var b = {
            say2: function(){
                console.log('b');
            }
        };
        var bAdapter = {
            say1: function(){
                return a.say1();
            }
        };
        var c = function(letter){
            if (letter.say1 instanceof Function){
                letter.say1();
            }
        };
        c(a);
        c(bAdapter);
    
        //数据适配
        let arr = ['a', 'b', 'c', 'd']
        function arr2objAdapter(arr) {
            return {
                e: arr[0],
                f: arr[1],
                g: arr[2],
                h: arr[3]
            }
        }
        let adapterData = arr2objAdapter(arr)；
        ```
    
    * 桥接模式
    
        提取多个底层功能模块，将抽象部分与它的实现部分分离
        ```js
        class Speed {
            constructor(x, y) {
                this.x = x
                this.y = y
            }
            run() {
                console.log(`运动起来 ${this.x} + ${this.y}`)
            }
        }
    
        class Color {
            constructor(cl) {
                this.color = cl
            }
            draw() {
                console.log(`绘制颜色 ${this.color}`)
            }
        }
    
        class Speak {
            constructor(wd) {
                this.word = wd
            }
            say() {
                console.log(`说话 ${this.word}`)
            }
        }
    
        class Ball {
            constructor(x, y, cl) {
                this.speed = new Speed(x, y)
                this.color = new Color(cl)
            }
            init() {
                this.speed.run()
                this.color.draw()
            }
        }
    
        class Man {
            constructor(x, y, wd) {
                this.speed = new Speed(x, y)
                this.speak = new Speak(wd)
            }
            init() {
                this.speed.run()
                this.speak.say()
            }
        }
    
        const man = new Man(1, 2, 'hehe?')
        man.init()
        ```
        ```js
        //一个事件的监听,点击元素获得id，根据获得的id我们发送请求查询对应id的猫
        element.addEventListener('click',getCatById)
        var getCatById = function(e){
          var id = this.id
          asyncRequst('Get',`cat.url?id=${id}`,function(resp){
              console.log('我已经获取了信息')
          })
        }
        //getCatById这个api函数我们可以理解为抽象 而点击这个过程是实现的效果
        //getCatById是一个只能工作在浏览器中的API,事件对象自然会被作为第一个参数传递给这个函数
        //任何一个API都不应该把它与任何特定环境搅在一起
        //改为：
        element.addEventListener('click',getCatByIdBridge)
        var getCatByIdBridge(e){ // getCatByIdBridge 桥接元素
            getCatById(this.id,function(cat){
                console.log('request cat')
            })
        }
        //getCatById这个API的使用范围就大大的拓宽了，没有与事件对象捆绑在了一起
        ```
    
    * 组合模式
    
        用小的子对象来构建更大的对象，以表示“部分-整体”的层次结构
        ```js
        //DOM树的整体与节点对象的部分，jquery的addClass是个例子
        var addClass = function (eles, className) {
            if (eles instanceof NodeList) {
                for (var i = 0, length = eles.length; i < length; i++) {
                    eles[i].nodeType === 1 && (eles[i].className += (' ' + className + ' '));
                }
            }
            else if (eles instanceof Node) {
                eles.nodeType === 1 && (eles.className += (' ' + className + ' '));
            }
            else {
                throw "eles is not a html node";
            }
        }
        addClass(document.getElementById("div3"), "test");
        addClass(document.querySelectorAll(".div"), "test");
        ```
    
    * 装饰模式
    
        不使用继承且在不改变对象现有结构的情况下添加附加功能
        ```js
        var decorator = function(input,fn){
            var button = document.getElementById('button1');
            if(typeof button.onclick === 'function'){
                var oldClickFn = button.onclick;
                button.onclick = function(){
                    oldClickFn();
                    fn();//不改变对象现有结构的情况下添加附加功能
                }
            }else{
                button.onclick = fn;
            }
        }
        ```
        ```js
        const kuanWrite = function() {
            this.writeChinese = function() {
                console.log('我只会写中文');
            };
        };
    
        // 通过装饰器给阿宽加上写英文的能力
        const Decorator = function(old) {
            this.oldWrite = old.writeChinese;
            this.writeEnglish = function() {
                console.log('给阿宽赋予写英文的能力');
            };
            this.newWrite = function() {
                this.oldWrite();
                this.writeEnglish();
            };
        };
    
        const oldKuanWrite = new kuanWrite();
        const decorator = new Decorator(oldKuanWrite);
        decorator.newWrite();
        ```
    
    * 外观模式
    
        为子系统的接口提供更高层次的接口
        ```js
        //高层次接口解决浏览器兼容性问题
        function addEvent(dom, type, fn) {
            if (dom.addEventListener) {
                dom.addEventListener(type, fn, false);
            }
            else if (dom.attachEvent) {
                dom.attachEvent('on' + type, fn);
            }
            else {
                dom['on' + type] = fn;
            }
        }
        const myInput = document.getElementById('myinput')
        addEvent(myInput, 'click', function() {console.log('绑定 click 事件')})
        ```
    
    * 享元模式
    
        主要用于减少创建对象的数量，以减少内存占用和提高性能
        ```js
        const Model = function(gender,underwear){
            this.gender = gender
            this.underwear = underwear
        }
        Model.prototype.takephoto = function(){
            console.log(`${this.gender}穿着${this.underwear}`);
        }
        for(let i=1;i<51;i++){
            const maleModel = new Model('male',`第${i}款衣服`)
            maleModel.takephoto()
        }
        for(let i =1;i<51;i++){
            const female = new Model('female',`第${i}款衣服`)
            female.takephoto()
        }
        //↓享元模式：只new了2个对象
        const Model = function(gender){
            this.gender = gender
        }
        Model.prototype.takephoto = function(){
            console.log(`${this.gender}穿着${this.underwear}`)
        }
        const maleModel = new Model('male')
        const femaleModel = new Model('female')
        for(let i =1;i<51;i++){
            maleModel.underwear = `第${i}款衣服`
            maleModel.takephoto()
        }
        for(let i =1; i<51;i++){
            femaleModel.underwear = `第${i}款衣服`
            femaleModel.takephoto()
        }
        //↓享元模式改进：引入工厂模式，但缺少了可读性
        const Model = function (gender) {
            this.gender = gender
        }
        Model.prototype.takephoto = function () {
            console.log(`${this.gender}穿着${this.underwear}`)
        }
        const modelFactory = (function () {
            const modelGender = {}
            return {
                createModel: function (gender) {
                    if (modelGender[gender]) {
                        return modelGender[gender]
                    }
                    return modelGender[gender] = new Model(gender)
                }
            }
        }())
        const modelManager = (function () {
            const modelObj = {}
            return {
                add: function (gender, i) {
                    modelObj[i] = {
                        underwear: `第${i}款衣服`
                    }
                    return modelFactory.createModel(gender)
                },
                copy: function (model, i) {
                    model.underwear = modelObj[i].underwear
                }
            }
        }())
        for (let i = 1; i < 51; i++) {
            const maleModel = modelManager.add('male', i)
            modelManager.copy(maleModel, i)
            maleModel.takephoto()
            console.log(maleModel,modelManager)
        }
        for (let i = 1; i < 51; i++) {
            const femaleModel = modelManager.add('female', i)
            modelManager.copy(femaleModel, i)
            femaleModel.takephoto()
            console.log(femaleModel,modelManager)
        }
        ```
    
    * 代理模式
    
        * 使用条件
    
            1. 模块职责单一且可复用
            2. 两个模块间的交互需要一定限制关系
    
        为一个对象找一个替代对象，以便对原对象进行访问限制
        ```js
        //虚拟代理是把一些开销很大的对象，延迟到真正需要它的时候才去创建执行
        // 图片懒加载
        var myImage = (function(){
            var imgNode = document.createElement('img')
            document.body.appendChild(imgNode)
            return {
                setSrc: function(src) {
                    imgNode.src = src
                }
            }
        })();
        var proxyImage = (function() {
            var img = new Image();
            img.onload = function() {
                myImage.setSrc(this.src)
            }
            return {
                setSrc: function(src) {
                    myImage.setSrc('blank.gif');//设置等待时的图片
                    img.src = src;//onload时才设置图片路径，实现懒加载
                }
            }
        })();
        proxyImage.setSrc('http://seopic.699pic.com/photo/40006/7735.jpg_wh1200.jpg')
    
        //缓存代理可以为一些开销大的运算结果提供暂时的存储，下次运算时，如果传递进来参数跟之前一致，则可以直接返回前面存储的运算结果。
        const getFib = (number) => {
            if (number <= 2) {
                return 1;
            }
            else {
                return getFib(number - 1) + getFib(number - 2);
            }
        }
        const getCacheProxy = (fn, cache = new Map()) => {
            //
            return new Proxy(fn, {
                apply(target, context, args) {
                    console.log(target, context, args)
                    //target为fn函数
                    //fn内没有属性，context为undefined
                    //args为传入的参数
                    const argsString = args.join(' ');
                    if (cache.has(argsString)) {
                        // 如果有缓存,直接返回缓存数据
                        return cache.get(argsString);
                    }
                    const result = fn(...args);
                    cache.set(argsString, result);
    
                    return result;
                }
            })
        }
        const getFibProxy = getCacheProxy(getFib);
        getFibProxy(40);
        ```
    
        附Proxy使用方法：
        * Proxy(代理对象，对象(属性为自定义代理函数))
        * 代理函数：(target为要代理的对象,propKey为对象属性值,value为值,receiver为Proxy或继承Proxy的对象)
            * get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
            * set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
            * has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
            * deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
            * ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
            * getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
            * defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
            * preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
            * getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
            * isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
            * setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
            * apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
            * construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
        * 样例
            ```js
            var obj = new Proxy({}, {
                get: function (target, propKey, receiver) {
                    console.log(`getting ${propKey}!`);
                    //让Object操作都变成函数行为
                    //Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法。
                    return Reflect.get(target, propKey, receiver);
                },
                set: function (target, propKey, value, receiver) {
                    console.log(`setting ${propKey}!`);
                    return Reflect.set(target, propKey, value, receiver);
                }
            });
            obj.count = 1
            //  setting count!
            ++obj.count
            //  getting count!
            //  setting count!
            //  2
            ```
    
        proxy与defineProperty对比
        * Proxy可以直接监听对象而非属性，Proxy可以劫持整个对象,并返回一个新对象
        * Proxy可以直接监听数组的变化，对数组进行操作(push、shift、splice等)时，会触发对应的方法名称和length的变化
        * Proxy有多达13种拦截方法,不限于apply、ownKeys、deleteProperty、has
        * Proxy时es6语法，不兼容低版本浏览器，如ie9

        proxy polyfill
        ```js
        if(!this.Proxy){
          (function(window){
            var seq=0;
            var dfGetter=function(target, property, receiver){
              return target[property];
            };
            var dfSetter=function(target, property, value,  receiver){
              target[property]=value;
            };
            var afterRevoke=function(){
              throw "illegal operation attempted on a revoked proxy";
            };
            if(Object.defineProperties){
              window.Proxy=function(target, handler){
                var me=this;
                if(!handler.get){
                  handler.get=dfGetter;
                }
                if(!handler.set){
                  handler.set=dfSetter;
                }
                Object.keys(target).forEach(function(key){
                  Object.defineProperty(me,key,{
                    enumerable:true,
                    get:function(){
                      return handler.get(target,key,me);
                    },
                    set:function(value){
                      if(handler.set(target,key,value,me)===false){
                        throw new TypeError("'set' on proxy: trap returned falsish for property '"+key+"'");
                      }
                    }
                  });
                });
              };
            }else if(window.execScript){
              //从avalon学到的方式，通过VB
              window.VBProxySetter=function(target, property, value, receiver, handler){
                if(handler.set(target, property, value, receiver)===false){
                  throw new TypeError("'set' on proxy: trap returned falsish for property '"+key+"'");
                }
              };
              window.VBProxyGetter=function(target,property, receiver, handler){
                return handler.get(target,property, receiver);
              };
              window.VBProxyPool=new Map();
              window.VBProxyFactory=function(target,handler){
                var className=VBProxyPool.get(target);
                if(!className){
                  className="VBClass_"+(seq++);
                  VBProxyPool.set(target,className);
                  var buffer=["Class "+className];
                  buffer.push('Public [__target__]');
                  buffer.push('Public [__handler__]');
                  Object.keys(target).forEach(function(key){
                    if(key.match(/[a-zA-Z0-9_$]/)){
                      buffer.push(
                        'Public Property Let ['+key+'](var)',
                        '	Call VBProxySetter([__target__],"'+key+'",var,Me,[__handler__])',
                        'End Property',
                        'Public Property Set ['+key+'](var)',
                        '	Call VBProxySetter([__target__],"'+key+'",var,Me,[__handler__])',
                        'End Property',
                        'Public Property Get ['+key+']',
                        '	On Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
                        '	Set ['+key+']=VBProxyGetter([__target__],"'+key+'",Me,[__handler__])',
                        '	If Err.Number <> 0 Then',
                        '		['+key+']=VBProxyGetter([__target__],"'+key+'",Me,[__handler__])',
                        '	End If',
                        '	On Error Goto 0',
                        'End Property');
                    }
                  });
                  buffer.push('End Class');
                  buffer.push(
                    'Function '+className+'_Factory(target,handler)',
                    '	Dim o',
                    '	Set o = New '+className,
                    '	Set o.[__target__]=target',
                    '	Set o.[__handler__]=handler',
                    '	Set '+className+'_Factory=o',
                    'End Function'
                  );
                  try{
                    window.execScript(buffer.join('\n'), 'VBScript');
                  }catch(e){
                    alert(buffer.join('\n'));
                  }
                }
                return window[className+'_Factory'](target,handler); //得到其产品
              };
              window.Proxy=function(target, handler){
                if(!handler.get){
                  handler.get=dfGetter;
                }
                if(!handler.set){
                  handler.set=dfSetter;
                }
                var me=VBProxyFactory(target,handler);
                return me;
              };
            }
            Proxy.revocable=function(target,handler){
              var r={};
              r.proxy=new Proxy(target,handler);
              r.revoke=function(){
                handler.get=handler.set=afterRevoke;
              };
              return r;
            };
          })(this);
        }
        ```
    
    * 责任链模式
    
        * 定义
    
            避免请求发送者与接收者耦合在一起，让多个对象都有可能接收请求，将这些对象连接成一条链，并且沿着这条链传递请求，直到有对象处理它为止。
    
        * 好处
    
            1. 解耦了各节点关系，之前的方式是 A 里边要写 B，B 里边写 C，但是这里不同了，可以在 B 里边啥都不写
            2. 各节点灵活拆分重组
    
        * 使用条件
    
            1. 负责的是一个完整流程，或你只负责流程中的某个环节
            2. 各环节可复用
            3. 各环节有一定的执行顺序
            4. 各环节可重组
    
        * 例子1
    
        多个对象递进处理数据，处理完成则返回结果，不能处理则传递到下一层。可用于优化多重嵌套的if-else
        ```js
        var order = function(orderType, isPaid, stock) {
            if(orderType === 1) {
                if(isPaid) {
                    console.log("500元定金预购，得到100优惠券");
                }
                else {
                    if(stock > 0) {
                        console.log("普通购买，无优惠券");
                    }
                    else {
                        console.log("库存不足");
                    }
                }
            }
            else if(orderType === 2) {
                if(isPaid) {
                    console.log("200元定金预购，得到50优惠券");
                }
                else {
                    if(stock > 0) {
                        console.log("普通购买，无优惠券");
                    }
                    else {
                        console.log("库存不足");
                    }
                }
            }
            else {
                if(stock > 0) {
                    console.log("普通购买，无优惠券");
                }
                else {
                    console.log("库存不足");
                }
            }
        }
        order(1, true, 500);
        //↓责任链模式
        var order500 = function(orderType, isPaid, stock) {
            if(orderType === 1 && isPaid === true) {
                console.log("500元定金预购，得到100优惠券");
            }
            else {
                return "next";
            }
        };
        var order200 = function(orderType, isPaid, stock) {
            if(orderType === 2 && isPaid === true) {
                console.log("200元定金预购，得到50优惠券");
            }
            else {
                return "next";
            }
        };
        var orderNormal = function(orderType, isPaid, stock) {
            if(stock > 0) {
                console.log("普通购买，无优惠券");
            }
            else {
                console.log("库存不足");
            }
        };
        Function.prototype.after = function(fn) {
            var self = this;
            return function() {
                var result = self.apply(this, arguments);
                if(result === "next") {
                    return fn.apply(this, arguments);
                }
                return result;
            };
        }
        var order = order500.after(order200).after(orderNormal);
        order(1, true, 500);
        ```
    
        * 例子2
    
            耦合写法：上一个成功，才能执行下一个
            ```js
            function applyDevice(data) {
                // 处理巴拉巴拉...
                let devices = {};
                let nextData = Object.assign({}, data, devices);
                // 执行选择收货地址
                selectAddress(nextData);
            }
    
            function selectAddress(data) {
                // 处理巴拉巴拉...
                let address = {};
                let nextData = Object.assign({}, data, address);
                // 执行选择责任人
                selectChecker(nextData);
            }
    
            function selectChecker(data) {
                // 处理巴拉巴拉...
                let checker = {};
                let nextData = Object.assign({}, data, checker);
                // 还有更多
            }
            ```
            责任链
            ```js
            const Chain = function(fn) {
                this.fn = fn;
                this.setNext = function() {}
                this.run = function() {...}
            }
    
            const applyDevice = function() {...}
            const chainApplyDevice = new Chain(applyDevice);
    
            const selectAddress = function() {...}
            const chainSelectAddress = new Chain(selectAddress);
    
            const selectChecker = function() {...}
            const chainSelectChecker = new Chain(selectChecker);
    
            // 运用责任链模式实现上边功能
            chainApplyDevice.setNext(chainSelectAddress).setNext(chainSelectChecker);
            chainApplyDevice.run();
            ```
            额外新增的步骤
            ```js
            const applyLincense = function() {...}
            const chainApplyLincense = new Chain(applyLincense);
    
            const selectChecker = function() {...}
            const chainSelectChecker = new Chain(selectChecker);
    
            // 运用责任链模式实现上边功能
            chainApplyLincense.setNext(chainSelectChecker);
            chainApplyLincense.run();
            ```
    
    * 命令模式
    
        客户方需要向接收方发送一系列指令，此时希望用一种松耦合的方式来设计程序，使得指令列表形成一个队列，可以方便地实现指令记入日志、指令撤销重做以及接收方决定是否执行指令。
        ```js
        var up = {
            execute: function(){
                console.log('up');
            }
        };
        var down = {
            execute: function(){
                console.log('down');
            }
        };
        var left = {
            execute: function(){
                console.log('left');
            }
        };
        var right = {
            execute: function(){
                console.log('right');
            }
        };
        var command = function(){
            return {
                commandsList: [],
                add: function(command){
                    this.commandsList.push(command);
                },
                execute: function(){
                    let command;
                    while(command = this.commandsList.shift()){
                        command.execute();
                    }
                }
            }
        };
        var c = command();
        c.add(up);
        c.add(down);
        c.add(left);
        c.execute();
        ```
    
    * 解释器模式
    
        将数据的一种表示转换为另一种表示
        ```js
        function Context() {
            this.sum = 0;
            this.list = [];
            this.getSum = function() {
                return this.sum;
            }
            this.setSum = function(sum) {
                this.sum = sum;
            }
            this.add = function(eps) {
                this.list.push(eps);
            }
            this.getList = function() {
                return this.list;
            }
        }
    
        function PlusExpression() {
            this.interpret = function(context) {
                let sum = context.getSum();
                sum++;
                context.setSum(sum);
            }
        }
    
        function MinusExpression() {
            this.interpret = function(context) {
                let sum = context.getSum();
                sum--;
                context.setSum(sum);
            }
        }
    
        let context = new Context();
        context.setSum(20);
        context.add(new PlusExpression());
        context.add(new PlusExpression());
        context.add(new MinusExpression());
        let list = context.getList();
        for (let i = 0; i < list.length; i++)
        {
            let expression = list[i];
            expression.interpret(context);
        }
        console.log(context.getSum());
        ```
    
    * 迭代器模式
    
        提供统一的方式来循环遍历这些不同类型的集合(Array，ArrayList和HashTable)
        ```js
        class Iterator {
            constructor(container) {
                this.list = container.list;
                this.index = 0;
            }
            next() {
                if (this.hasNext()) {
                    return this.list[this.index++];
                }
                return null;
            }
            hasNext() {
                if (this.index >= this.list.length) {
                    return false;
                }
                return true;
            }
        }
    
        class Container {
            constructor(list) {
                this.list = list;
            }
            getIterator() {
                return new Iterator(this);
            }
        }
    
        let arr = [1, 2, 3, 4, 5, 6];
        let container = new Container(arr);
        let iterator = container.getIterator()
        while(iterator.hasNext()){
            console.log(iterator.next())
        }
        ```
    
    * 中介者模式
    
        通信由中介者完成，通信双方不需要了解对方的任何信息。中介者模式的作用就是解除对象与对象之间的紧耦合关系。对象与对象中的通信以中介者为媒介触发。中介者使各对象之间耦合松散，而且可以独立地改变它们之间的交互。中介者模式使网状的多对多关系变成了相对简单的一对多关系。
        ```js
        function A(mediator) {
            this.mediator = mediator;
        }
        A.prototype = {
            send: function(msg,receiver) {
                this.mediator.send(msg,'A',receiver);
            },
            receiveMsg: function(msg,sender) {
                console.log(sender+" say:"+msg)
            }
        }
    
        function B(mediator) {
            this.mediator = mediator;
        }
        B.prototype = {
            send: function(msg,receiver) {
                this.mediator.send(msg,'B',receiver);
            },
            receiveMsg: function(msg,sender) {
                console.log(sender+" say:"+msg)
            }
        }
        function Mediator() {
            this.A = new A(this);
            this.B = new B(this);
        }
        Mediator.prototype = {
            send: function(msg,sender,receiver) {
                try {
                    this[receiver].receiveMsg(msg,sender);
                }
                catch(err) {
                    console.log('receiver '+receiver+' is not exsit');
                    this[sender].receiveMsg('receiver '+ receiver +' is not exsit','mediator');
                }
            }
        }
    
        var _mediator = new Mediator();
        var _a = new A(_mediator);
        var _b = new B(_mediator);
        _a.send('hello i am A','B');
        _b.send('hello i am B','A');
        ```
    
    * 备忘录模式
    
        在不破坏对象的封装性的前提下，在对象之外捕获并保存该对象内部的状态以便日后对象使用或者对象恢复到以前的某个状态
        ```js
        // 分页缓存伪代码
        var Page = function () {
            // 通过cache对象缓存数据
            var cache = {}
            return function (page, fn) {
                if (cache[page]) {
                    showPage(page, cache[page])
                }
                else {
                    $.post('/url', function (data) {
                        showPage(page, data)
                        cache[page] = data
                    })
                }
                fn && fn()
            }
        }
        ```
    
    * 观察者模式
    
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
    
        * 使用条件
    
            1. 各模块相互独立
            2. 存在一对多的依赖关系
            3. 依赖模块不稳定、依赖关系不稳定
            4. 各模块由不同的人员、团队开发
    
        * 使用场景
    
            对接方模块逻辑修改或未写完，导致我方代码被迫修改函数调用名或注释
    
        * 缺点
    
            过多的使用发布订阅，就会导致难以维护调用关系
    
        * 例子
    
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
    
    * 状态模式
    
        对象可以通过管理其状态从而使得应用程序作出相应的变化
        ```js
        class SuperMarry {
            constructor() {
                this._currentState = []
                this.states = {
                    jump() {console.log('跳跃!')},
                    move() {console.log('移动!')},
                    shoot() {console.log('射击!')},
                    squat() {console.log('蹲下!')}
                }
            }
    
            change(arr) {  // 更改当前动作
                this._currentState = arr
                return this
            }
    
            go() {
                console.log('触发动作')
                this._currentState.forEach(T => this.states[T] && this.states[T]())
                return this
            }
        }
    
        new SuperMarry()
            .change(['jump', 'shoot'])
            .go()                    // 触发动作  跳跃!  射击!
            .go()                    // 触发动作  跳跃!  射击!
            .change(['squat'])
            .go()                    // 触发动作  蹲下!
        ```
    
    * 策略模式
    
        将算法的使用和实现分离出来
        ```js
        var calculateBouns = function(salary,level) {
            if(level === 'A') {
                return salary * 4;
            }
            if(level === 'B') {
                return salary * 3;
            }
            if(level === 'C') {
                return salary * 2;
            }
        };
        console.log(calculateBouns(4000,'A')); // 16000
        console.log(calculateBouns(2500,'B')); // 7500
        //↓改为策略模式
        var obj = {
            "A": function(salary) {
                return salary * 4;
            },
            "B" : function(salary) {
                return salary * 3;
            },
            "C" : function(salary) {
                return salary * 2;
            }
        };
        var calculateBouns =function(level,salary) {
            return obj[level](salary);
        };
        console.log(calculateBouns('A',10000)); // 40000
        ```
    
        * 使用条件
    
            1. 各判断条件下的策略相互独立且可复用
            2. 策略内部逻辑相对复杂
            3. 策略需要灵活组合
    
        * 使用场景
    
            1. 权限逻辑
            2. 表单验证
    
        * 例子
    
            ```js
            //以下代码的问题
            //checkAuth 函数会爆炸
            //策略项无法复用
            //违反开闭原则
            function checkAuth(data) {
                if (data.role !== 'juejin') {
                    console.log('不是掘金用户');
                    return false;
                }
                if (data.grade < 1) {
                    console.log('掘金等级小于 1 级');
                    return false;
                }
                if (data.job !== 'FE') {
                    console.log('不是前端开发');
                    return false;
                }
                if (data.type !== 'eat melons') {
                    console.log('不是吃瓜群众');
                    return false;
                }
            }
            ```
    
            修正：策略 + 组合
            ```js
            // 维护权限列表
            const jobList = ['FE', 'BE'];
    
            // 策略
            var strategies = {
                checkRole: function(value) {
                    if (value === 'juejin') {
                        return true;
                    }
                    return false;
                },
                checkGrade: function(value) {
                    if (value >= 1) {
                        return true;
                    }
                    return false;
                },
                checkJob: function(value) {
                    if (jobList.indexOf(value) > 1) {
                        return true;
                    }
                    return false;
                },
                checkEatType: function(value) {
                    if (value === 'eat melons') {
                        return true;
                    }
                    return false;
                }
            };
            // 校验规则
            var Validator = function() {
                this.cache = [];
    
                // 添加策略事件
                this.add = function(value, method) {
                    this.cache.push(function() {
                        return strategies[method](value);
                    });
                };
    
                // 检查
                this.check = function() {
                    for (let i = 0; i < this.cache.length; i++) {
                        let valiFn = this.cache[i];
                        var data = valiFn(); // 开始检查
                        if (!data) {
                            return false;
                        }
                    }
                    return true;
                };
            };
            //验证条件1
            var compose1 = function() {
                var validator = new Validator();
                const data1 = {
                    role: 'juejin',
                    grade: 3
                };
                validator.add(data1.role, 'checkRole');
                validator.add(data1.grade, 'checkGrade');
                const result = validator.check();
                return result;
            };
            //验证条件2
            var compose2 = function() {
                var validator = new Validator();
                const data2 = {
                    role: 'juejin',
                    job: 'FE'
                };
                validator.add(data2.role, 'checkRole');
                validator.add(data2.job, 'checkJob');
                const result = validator.check();
                return result;
            };
            ```
    
    * 模板方法模式
    
        抽取共同点作为抽象父类，再具体实现一系列子类
        ```js
        var Interview = function(){};
        Interview.prototype.writtenTest = function(){
            console.log("笔试");
        };
        Interview.prototype.technicalInterview = function(){
            console.log("技术面试");
        };
        Interview.prototype.leader = function(){
            console.log("leader面试");
        };
        Interview.prototype.waitNotice = function(){
            console.log("等待通知");
        };
        Interview.prototype.init = function(){
            this.writtenTest();
            this.technicalInterview();
            this.leader();
            this.waitNotice();
        };
        var AInterview = function(){};
        AInterview.prototype = new Interview();
        AInterview.prototype.writtenTest = function(){
            console.log("笔试a");
        }
        AInterview.prototype.technicalInterview = function(){
            console.log("技术面试a");
        }
        AInterview.prototype.leader = function(){
            console.log("leader面试a");
        }
        AInterview.prototype.waitNotice = function(){
            console.log("等待通知a");
        }
        var aInterview = new BaiDuInterview();
        AInterview.init();
        ```
    
    * 访问者模式
    
        在不改变该对象的前提下访问其结构中元素的新方法
        ```js
        var Visitor = (function() {
            return {
                splice: function(){
                    var args = Array.prototype.splice.call(arguments, 1)
                    return Array.prototype.splice.apply(arguments[0], args)
                },
                push: function(){
                    var len = arguments[0].length || 0
                    var args = this.splice(arguments, 1)
                    arguments[0].length = len + arguments.length - 1
                    return Array.prototype.push.apply(arguments[0], args)
                },
                pop: function(){
                    return Array.prototype.pop.apply(arguments[0])
                }
            }
        })()
    
        var a = new Object()
        console.log(a.length)
        Visitor.push(a, 1, 2, 3, 4)
        console.log(a.length)
        Visitor.push(a, 4, 5, 6)
        console.log(a.length)
        Visitor.pop(a)
        console.log(a)
        console.log(a.length)
        Visitor.splice(a, 2)
        console.log(a)
        ```




### 变量的解构赋值

1. 参考链接：

   - [变量的解构赋值](http://es6.ruanyifeng.com/#docs/destructuring)

2. 详解

   ES6 允许等号双方按照相同格式，从数组和对象中提取值，对变量进行赋值，这被称为解构

   ```js
   //数组
   let [a, b, c] = [1, 2, 3];
   a;//1
   let [foo, [[bar], baz]] = [1, [[2], 3]];
   baz;//3
   let [ , , third] = ["foo", "bar", "baz"];
   third;//"baz"
   let [x, y, ...z] = ['a'];
   x;//"a"
   y;//undefined 解构不成功为undefined
   z;//[]
   let [foo] = 1;//报错
   let [x, y, z] = new Set(['a', 'b', 'c']);
   x;//"a"
   let [foo = true] = [];
   foo;//true 因为使用了默认值
   let [x = 1] = [undefined];
   x；//1
   let [x = 1] = [null];
   x；//null 对null不生效

   //对象
   let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
   foo；//"aaa"
   let x;
   {x} = {x: 1};// SyntaxError: syntax error
   let x;
   ({x} = {x: 1});
   x;//1

   //字符串
   const [a, b, c, d, e] = 'hello';
   a；//"h"
   let {length : len} = 'hello';
   len；//5

   //数值和布尔值
   let {toString: s} = 123;
   s === Number.prototype.toString;//true
   let {toString: s} = true;
   s === Boolean.prototype.toString;//true
   let { prop: x } = undefined;//TypeError 右边无法转换为对象
   let { prop: y } = null;//TypeError 右边无法转换为对象

   //函数参数
   function add([x = 0, y = 1]){
       return x + y;
   }
   add([1, 2]);//3

   //圆括号报错
   let [(a)] = [1];//error
   let {x: (c)} = {};//error
   let ({x: c}) = {};//error
   let {(x: c)} = {};//error
   let {(x): c} = {};//error
   let { o: ({ p: p }) } = { o: { p: 2 } };//error
   function f([(z)]) { return z; }//error
   function f([z,(x)]) { return x; }//error
   ({ p: a }) = { p: 42 };//error
   ([a]) = [5];//error
   [({ p: a }), { x: c }] = [{}, {}];//error

   //圆括号正确
   [(b)] = [3];
   b;//3
   ({ p: (d) } = {});
   d;//undefined
   [(parseInt.prop)] = [3];
   parseInt.prop;//3

   //用途
   //（1）交换变量的值
   let x = 1;
   let y = 2;
   [x, y] = [y, x];
   //（2）从函数返回多个值
   function example() {
       return [1, 2, 3];
   }
   let [a, b, c] = example();
   //（3）函数参数的定义和默认值
   function f({x=0, y=0, z=0}) { ... }
   f({z: 3, y: 2, x: 1});//可无序
   //（4）提取 JSON 数据
   let jsonData = {
       id: 42,
       status: "OK",
       data: [867, 5309]
   };
   let { id, status, data: number } = jsonData;
   //（5）遍历 特殊 结构
   const map = new Map();
   map.set('first', 'hello');
   map.set('second', 'world');
   for (let [key, value] of map) {
       console.log(key + " is " + value);
   }
   //（6）输入模块的指定方法
   const { SourceMapConsumer, SourceNode } = require("source-map");
   ```



### 深入理解promise

1. 参考链接：

   - [20 行实现一个 Promise](https://mp.weixin.qq.com/s/oHBv7r6x7tVOwm-LsnIbgA)

   - [前端常见 20 道高频面试题深入解析](https://mp.weixin.qq.com/s/jx-4p32EA9cHkDzll3BoYQ)

   - [实现 Promise.all、Promise.race、Promise.finally](https://blog.csdn.net/zl13015214442/article/details/96744447)

   - [前端面试大厂手写源码系列（上）](https://juejin.im/post/5e77888ff265da57187c7278#heading-9)

   - [手写Promise核心原理，再也不怕面试官问我Promise原理](https://juejin.im/post/6856213486633304078#heading-0)

   - [Promise 中的三兄弟 .all(), .race(), .allSettled()](https://segmentfault.com/a/1190000020034361)

   - [15道ES6 Promise实战练习题，助你快速理解Promise](https://mp.weixin.qq.com/s/ON4m0uNF6u-FjLHYih8JIA)

2. 详解

   - promise

     - 功能

       异步链式调用

     - 实现

       ```js
       function myPromise(excutor) {
         var self = this;
         self.onResolvedCallback = []; // Promise resolve时的回调函数集

         // 传递给Promise处理函数的resolve
         // 这里直接往实例上挂个data
         // 然后把onResolvedCallback数组里的函数依次执行一遍就可以
         function resolve(value) {
           // 注意promise的then函数需要异步执行
           setTimeout(() => {
             self.data = value;
             self.onResolvedCallback.forEach((callback) => callback(value));
           });
         }

         // 执行用户传入的函数
         // resolve => {
         //     ...
         //     resolve(1)
         // }
         excutor(resolve.bind(self));
       }
       // data => {
       //     ...
       // }
       myPromise.prototype.then = function (onResolved) {
         // 保存上下文，哪个promise调用的then，就指向哪个promise。
         var self = this;

         return new myPromise((resolve) => {
           self.onResolvedCallback.push(function () {
             // onResolved就对应then传入的函数,执行此函数，得到return的结果
             var result = onResolved(self.data);
             // 如果return的是promise，则继续then
             if (result instanceof Promise) {
               // 那么直接把promise2的resolve决定权交给了user promise
               result.then(resolve);
             }
             // 否则，异步(setTimeout)执行任务队列
             else {
               resolve(result);
             }
           });
         });
       };
       // 调用then的promise
       new myPromise((resolve) => {
         resolve(1);
       })
         // then2
         .then((data) => {
           // user promise
           console.log(data);
           return new Promise((resolve) => {
             resolve(2);
           });
         })
         // then3
         .then((data) => {
           console.log(data);
         });
       ```

     - Promise A+规范

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

     - 手写过程

        1. 书写结构

          ```js
          (function (window) {
              /*
              Promise构造函数
              executor:执行器函数
              */
              function Promise(executor) {

              }

              /*
              Promise原型对象的then
              指定一个成功/失败的回调函数
              返回一个新的promise对象
              */
              Promise.prototype.then = function(onResolved,onRejected){

              }

              /*
              Promise原型对象的.catch
              指定一个失败的回调函数
              返回一个新的promise对象
              */
              Promise.prototype.catch = function(onRejected){

              }

              /*
              Promise函数对象的resovle方法
              返回一个指定结果的promise对象
              */
              Promise.resolve = function(value){

              }

              /*
              Promise函数对象的reject方法
              返回一个指定reason的失败状态的promise对象
              */
              Promise.reject = function(value){

              }

              /*
              Promise函数对象的all方法
              返回一个promise对象，只有当所有promise都成功时返回的promise状态才成功
              */
              Promise.all = function(value){

              }

              /*
              Promise函数对象的race方法
              返回一个promise对象，状态由第一个完成的promise决定
              */
              Promise.race = function(value){

              }

              // 向外暴露Promise
              window.Promise = Promise
          })()
          ```

        2. 实现构造函数

          1. 传入函数，执行resolve和reject，说明构造函数里有resolve和reject方法
          2. 每个promise都有一个状态可能为pending或resolved，rejected。初始状态都为pending。需要添加个status来表示当前promise的状态.。并且每个promise有自己的data。
          3. pending状态要把then里面的回调函数保存起来，需要callbacks数组，收集方法为push
          4. pending到resolved会有等待问题，需要使用定时器
          5. promise的状态只能改变一次，执行callbacks里的函数，并保存data，并将当前promise状态改为resolved
          6. reject同理，当在执行executor的时候，如果执行异常，这个promise的状态会直接执行reject方法,使用try catch

          ```js
          function Promise(executor) {

              var self = this

              self.status = 'pending' // 给promise对象指定status属性，初始值为pending
              self.data = undefined // 给promise对象指定一个存储结果的data
              新增代码
              self.callbacks = []  // 每个元素的结构：{onResolved(){}，onRejected(){}}


              function resolve(value) {
                  // 如果当前状态不是pending，则不执行
                  if(this.status !== 'pending'){
                      return 
                  }
                  // 将状态改为resolved
                  this.status = 'resolved'
                  // 保存value的值
                  this.data = value

                  // 如果有待执行的callback函数，立即异步执行回调函数onResolved
                  if (this.callbacks.length>0){
                      setTimeout(()=>{
                          this.callbacks.forEach(callbackObj=>{ A
                              callbackObj.onResolved(value)
                          })
                      })
                  }
              }
              function reject(value) {
                  // 如果当前状态不是pending，则不执行
                  if(self.status !== 'pending'){
                      return
                  }
                  // 将状态改为rejected
                  self.status = 'rejected'
                  // 保存value的值
                  self.data = value

                  // 如果有待执行的callback函数，立即异步执行回调函数onResolved
                  if (self.callbacks.length>0){
                    self.callbacks.forEach(callbackObj=>{
                        callbackObj.onRejected(value)
                    })
                  }
              }


              // 立即同步执行executor
              try{
                  // 立即同步执行executor
                  executor(resolve,reject)
              }catch (e) { // 如果执行器抛出异常，promise对象变为rejected状态
                  reject(e)
              }
          }
          ```

        3. 实现then

          1. pending时，要把then里的回调函数保存起来
          2. resolved和rejected时，异步执行onResolved和onRejected
          3. 如果回调函数返回的不是promise，return的promise的状态是resolved，value就是返回的值
          4. 如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
          5. 如果这个promise执行了resolve，返回的新的promise的状态则是resolved。否则为rejected
          6. .then 或者 .catch 的参数期望是函数，传入非函数则会保存上一个的promise.data

          ```js
          Promise.prototype.then = function(onResolved,onRejected){
              onResolved = typeof onResolved === 'function'? onResolved: value => value
              onRejected = typeof onRejected === 'function'? onRejected: reason => {throw reason}
              var self = this

              return new Promise((resolve,reject)=>{

                  /*
                  调用指定回调函数的处理，根据执行结果。改变return的promise状态
                  */
                  function handle(callback) {
                      try{
                          const result = callback(self.data)
                          if (result instanceof Promise){
                              // 2. 如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
                              result.then(
                                  value => {resolve(value)},
                                  reason => {reject(reason)}
                              )
                          } else {
                              // 1. 如果回调函数返回的不是promise，return的promise的状态是resolved，value就是返回的值。
                              resolve(result)
                          }
                      }catch (e) {
                          //  3.如果执行onResolved的时候抛出错误，则返回的promise的状态为rejected
                          reject(e)
                      }
                  }
                  if(self.status === 'pending'){
                      // promise当前状态还是pending状态，将回调函数保存起来
                      self.callbacks.push({
                          onResolved(){
                              handle(onResolved)
                          },
                          onRejected(){
                              handle(onRejected)
                          }
                      })
                  }else if(self.status === 'resolved'){
                      setTimeout(()=>{
                          handle(onResolved)
                      })
                  }else{ // 当status === 'rejected'
                      setTimeout(()=>{
                          handle(onRejected)
                      })
                  }
              })

          }
          ```

        4. 实现then

          与then实现相同，只是没有了onResolved函数

          ```js
          Promise.prototype.catch = function(onRejected){
              return this.then(undefined,onRejected)
          }
          ```

        5. 实现resolve

          3中传值：非promise，成功promise，失败promise

          ```js
          Promise.resolve = function(value){
            return new Promise((resolve,reject)=>{
                if (value instanceof Promise){
                    // 如果value 是promise
                    value.then(
                        value => {resolve(value)},
                        reason => {reject(reason)}
                    )
                } else{
                    // 如果value不是promise
                    resolve(value)
                }
            }
          }
          ```

        6. 实现reject

          返回一个状态为rejected的promise

          ```js
          /*
          Promise函数对象的reject方法
          返回一个指定reason的失败状态的promise对象
          */
          Promise.reject = function(reason){
              return new Promise((resolve,reject)=>{
                  reject(reason)
              })
          }
          ```

        7. 实现all、race、finally见下方

   - promise.all

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

   - promise.race

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

     - 提示

       Promsie.all 和 Promise.race 都只接受可迭代的数据结构，否则会报错，所以在不确定传入的 promises 是否为可迭代数据结构的情况下可以通过以下加以判断：

       ```js
       if (typeof promises[Symbol.iterator] !== "function") {
         Promise.reject("args is not iteratable!");
       }
       ```

       一个数据结构只要具有 Symbol.iterator 属性(Symbol.iterator 方法对应的是遍历器生成函数，返回的是一个遍历器对象)，那么就可以其认为是可迭代的。

   - promise.finally

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

   - promise.allSettled

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

   - promise事件循环执行顺序

      Promise 构造函数是同步执行的，promise.then 中的函数是异步执行的。
      ```js
      const promise = new Promise((resolve, reject) => {
          console.log(1)
          resolve()
          console.log(2)
      })
      promise.then(() => {
          console.log(3)
      })
      console.log(4)
      
      // => 1
      // => 2
      // => 4
      // => 3
      ```

      同步->异步(微任务(nexttick->promise)->宏任务(setTimeout,setInterval,setImmediate))
      ```js
      const first = () => (new Promise((resolve, reject) => {
          console.log(3);
          let p = new Promise((resolve, reject) => {
              console.log(7);
              setTimeout(() => {
                  console.log(5);
                  resolve(6);
              }, 0)
              resolve(1);
          });
          resolve(2);
          p.then((arg) => {
              console.log(arg);
          });

      }));

      first().then((arg) => {
          console.log(arg);
      });
      console.log(4);
      
      // => 3
      // => 7
      // => 4
      // => 1
      // => 2
      // => 5
      ```
      ```js
      process.nextTick(() => {
        console.log('nextTick')
      })
      Promise.resolve()
        .then(() => {
          console.log('then')
        })
      setImmediate(() => {
        console.log('setImmediate')
      })
      console.log('end')

      //end
      //nextTick
      //then
      //setImmediate
      ```

   - promise的3种状态

      promise 有 3 种状态：pending、fulfilled 或 rejected。状态改变只能是 pending->fulfilled 或者 pending->rejected，状态一旦改变则不能再变，除非返回新promise
      ```js
      const promise1 = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('success')
        }, 1000)
      })
      const promise2 = promise1.then(() => {
        throw new Error('error!!!')
      })

      console.log('promise1', promise1)
      console.log('promise2', promise2)

      setTimeout(() => {
        console.log('promise1', promise1)
        console.log('promise2', promise2)
      }, 2000)
      
      //promise1 Promise {<pending>}
      //promise2 Promise {<pending>}
      //Uncaught (in promise) Error: error!!!
      //    at <anonymous>
      //promise1 Promise {<resolved>: "success"}
      //promise2 Promise {<rejected>: Error: error!!!
      //    at <anonymous>}
      ```

      promise 内部状态一经改变，并且有了一个值，那么后续每次调用 .then 或者 .catch 都会直接拿到该值。
      ```js
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('once')
          resolve('success')
        }, 1000)
      })

      const start = Date.now()
      promise.then((res) => {
        console.log(res, Date.now() - start)
      })
      promise.then((res) => {
        console.log(res, Date.now() - start)
      })
      
      //once
      //success 1005
      //success 1007
      ```

   - resolve和reject的单次有效性

      构造函数中的 resolve 或 reject 只有第一次执行有效，多次调用没有任何作用
      ```js
      const promise = new Promise((resolve, reject) => {
        resolve('success1')
        reject('error')
        resolve('success2')
      })

      promise
        .then((res) => {
          console.log('then: ', res)
        })
        .catch((err) => {
          console.log('catch: ', err)
        })

      //then: success1
      ```

   - promise链式调用

      promise 每次调用 .then 或者 .catch 都会返回一个新的 promise，从而实现了链式调用。
      ```js
      Promise.resolve(1)
        .then((res) => {
          console.log(res)
          return 2
        })
        .catch((err) => {
          return 3
        })
        .then((res) => {
          console.log(res)
        })
       
      //1
      //2
      ```

   - promise抛出错误机制

      .then 或者 .catch 中 return 一个 error 对象并不会抛出错误，所以不会被后续的 .catch 捕获
      ```js
      Promise.resolve()
        .then(() => {
          return new Error('error!!!')
        })
        .then((res) => {
          console.log('then: ', res)
        })
        .catch((err) => {
          console.log('catch: ', err)
        })
        
      //then:  Error: error!!!
      //    at <anonymous>

      //需要改成其中一种，才能被后续的 .catch 捕获
      //return Promise.reject(new Error('error!!!'))
      //throw new Error('error!!!')
      ```

   - promise返回机制

      .then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环
      ```js
      const promise = Promise.resolve()
        .then(() => {
          return promise
        })
      promise.catch(console.error)

      //TypeError: Chaining cycle detected for promise #<Promise>
      ```

      .then 或者 .catch 的参数期望是函数，传入非函数则会发生值穿透
      ```js
      Promise.resolve(1)
        .then(2)
        .then(Promise.resolve(3))
        .then(console.log)

      //1
      ```

      .then 可以接收两个参数，第一个是处理成功的函数，第二个是处理错误的函数。.then 的第二个处理错误的函数捕获不了第一个处理成功的函数抛出的错误，而后续的 .catch 可以捕获之前的错误。
      ```js
      Promise.resolve()
        .then(function success (res) {
          throw new Error('error')
        }, function fail1 (e) {
          console.error('fail1: ', e)
        })
        .catch(function fail2 (e) {
          console.error('fail2: ', e)
        })
        
      //fail2:  Error: error
      //    at success (<anonymous>)
      ```

   - 题目

      红灯3秒亮一次，绿灯1秒亮一次，黄灯2秒亮一次；如何使用Promise让三个灯不断交替重复亮灯？
      ```js
      function red() {
        console.log('red');
      }
      function green() {
        console.log('green');
      }
      function yellow() {
        console.log('yellow');
      }
      let myLight = (timer, cb) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            cb();
            resolve();
          }, timer);
        });
      };
      let myStep = () => {
        Promise.resolve().then(() => {
          return myLight(3000, red);
        }).then(() => {
          return myLight(2000, green);
        }).then(()=>{
          return myLight(1000, yellow);
        }).then(()=>{
          myStep();
        })
      };
      myStep();

      // output:
      // => red
      // => green
      // => yellow
      // => red
      // => green
      // => yellow
      // => red
      ```

      实现一个mergePromise函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组data中
      ```js
      const timeout = ms => new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve();
          }, ms);
      });
      const ajax1 = () => timeout(2000).then(() => {
          console.log('1');
          return 1;
      });
      const ajax2 = () => timeout(1000).then(() => {
          console.log('2');
          return 2;
      });
      const ajax3 = () => timeout(2000).then(() => {
          console.log('3');
          return 3;
      });
      const mergePromise = ajaxArray => {
        // 在这里实现你的代码
        // 保存数组中的函数执行后的结果
        var data = [];
        // Promise.resolve方法调用时不带参数，直接返回一个resolved状态的 Promise 对象。
        var sequence = Promise.resolve();
        ajaxArray.forEach(item => {
          // 第一次的 then 方法用来执行数组中的每个函数，
          // 第二次的 then 方法接受数组中的函数执行后返回的结果，
          // 并把结果添加到 data 中，然后把 data 返回。
          sequence = sequence.then(item).then(res => {
            data.push(res);
            return data;
          });
        });
      // 遍历结束后，返回一个 Promise，也就是 sequence， 他的 [[PromiseValue]] 值就是 data，
      // 而 data（保存数组中的函数执行后的结果） 也会作为参数，传入下次调用的 then 方法中。
        return sequence;
      };
      mergePromise([ajax1, ajax2, ajax3]).then(data => {
          console.log('done');
          console.log(data); // data 为 [1, 2, 3]
      });
      // 要求分别输出
      // 1
      // 2
      // 3
      // done
      // [1, 2, 3]
      ```

      现有8个图片资源的url，已经存储在数组urls中，且已有一个函数function loading，输入一个url链接，返回一个Promise，该Promise在图片下载完成的时候resolve，下载失败则reject。要求：任何时刻同时下载的链接数量不可以超过3个。
      ```js
      var urls = ['https://www.kkkk1000.com/images/getImgData/getImgDatadata.jpg', 'https://www.kkkk1000.com/images/getImgData/gray.gif', 'https://www.kkkk1000.com/images/getImgData/Particle.gif', 'https://www.kkkk1000.com/images/getImgData/arithmetic.png', 'https://www.kkkk1000.com/images/getImgData/arithmetic2.gif', 'https://www.kkkk1000.com/images/getImgData/getImgDataError.jpg', 'https://www.kkkk1000.com/images/getImgData/arithmetic.gif', 'https://www.kkkk1000.com/images/wxQrCode2.png'];

      function loadImg(url) {
          return new Promise((resolve, reject) => {
              const img = new Image()
              img.onload = () => {
                  console.log('一张图片加载完成');
                  resolve();
              }
              img.onerror = reject;
              img.src = url;
          })
      };

      function limitLoad(urls, handler, limit) {
        // 对数组做一个拷贝
          const sequence = […urls];

        let promises = [];

        //并发请求到最大数
        promises = sequence.splice(0, limit).map((url, index) => {
          // 这里返回的 index 是任务在 promises 的脚标，用于在 Promise.race 之后找到完成的任务脚标
          return handler(url).then(() => {
            return index;
          });
        });

        // 利用数组的 reduce 方法来以队列的形式执行
        return sequence.reduce((last, url, currentIndex) => {
          return last.then(() => {
            // 返回最快改变状态的 Promise
            return Promise.race(promises)
          }).catch(err => {
            // 这里的 catch 不仅用来捕获前面 then 方法抛出的错误
            // 更重要的是防止中断整个链式调用
            console.error(err)
          }).then((res) => {
            // 用新的 Promise 替换掉最快改变状态的 Promise
            promises[res] = handler(sequence[currentIndex]).then(() => {
              return res
            });
          })
        }, Promise.resolve()).then(() => {
          return Promise.all(promises)
        })

      }

      limitLoad(urls, loadImg, 3);

      /*
      因为 limitLoad 函数也返回一个 Promise，所以当 所有图片加载完成后，可以继续链式调用

      limitLoad(urls, loadImg, 3).then(() => {
          console.log('所有图片加载完成');
      }).catch(err => {
          console.error(err);
      })
      */
      ```

      封装一个异步加载图片的方法
      ```js
      function loadImageAsync(url) {
          return new Promise(function(resolve,reject) {
              var image = new Image();
              image.onload = function() {
                  resolve(image) 
              };
              image.onerror = function() {
                  reject(new Error('Could not load image at' + url));
              };
              image.src = url;
          });
      }
      ```

### 可迭代对象

1. 参考链接：

   - [前端常见 20 道高频面试题深入解析](https://mp.weixin.qq.com/s/jx-4p32EA9cHkDzll3BoYQ)

2. 详解

   一个数据结构只要具有 Symbol.iterator 属性( Symbol.iterator 方法对应的是遍历器生成函数，返回的是一个遍历器对象)，那么就可以其认为是可迭代的。

   特点：

   - 具有 Symbol.iterator 属性， Symbol.iterator() 返回的是一个遍历器对象
   - 可以使用 for...of 进行循环
   - 通过被 Array.from 转换为数组

   数据结构：

   - Array
   - Map
   - Set
   - String
   - TypedArray
   - 函数的 arguments 对象
   - NodeList 对象


### reflect

1. 参考链接

   [ES6 之 Reflect](https://www.jianshu.com/p/4a5eca0536c3)

   [ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/reflect)

   [12 道腾讯前端面试真题及答案整理](https://mp.weixin.qq.com/s/mouL2lrCvttHpMwP4iesKw)

2. 详解

   - 描述

     Reflect 是内置对象，而不是普通的 function 对象，因此不能使用 new

   - 作用

     1. 同 proxy，为操作对象而提供的新 API，可以从 Reflect 对象上拿 Object 对象内部方法

     2. 老 Object 方法 报错的情况，改为返回 false

        ```js
        try {
          Object.defineProperty(target, property, attributes);
          // success
        } catch (e) {
          // failure
        }
        //改为
        if (Reflect.defineProperty(target, property, attributes)) {
          // success
        } else {
          // failure
        }
        ```

     3. 让 Object 操作变成函数行为

        ```js
        "name" in Object; //true
        delete obj.name;
        let person = new Person("chen");

        Reflect.has(Object, "name"); //true
        Reflect.deleteProperty(obj, "name");
        let person = Reflect.construct(Person, ["chen"]);
        ```

     4. Reflect 与 Proxy 是相辅相成的，在 Proxy 上有的方法，在 Reflect 就一定有，不管 Proxy 怎么修改默认行为，总可以在 Reflect 上获取 默认行为。

        ```js
        let target = {};
        let handler = {
          set(target, proName, proValue, receiver) {
            //确认对象的属性赋值成功
            let isSuccess = Reflect.set(target, proName, proValue, receiver);
            if (isSuccess) {
              console.log("成功");
            }
            return isSuccess;
          },
        };
        let proxy = new Proxy(target, handler);
        ```

   - 使用

     ```js
     Reflect.apply(target, thisArg, args);
     Reflect.construct(target, args);
     Reflect.get(target, name, receiver);
     Reflect.set(target, name, value, receiver);
     Reflect.defineProperty(target, name, desc);
     Reflect.deleteProperty(target, name);
     Reflect.has(target, name);
     Reflect.ownKeys(target);
     Reflect.isExtensible(target);
     Reflect.preventExtensions(target);
     Reflect.getOwnPropertyDescriptor(target, name);
     Reflect.getPrototypeOf(target);
     Reflect.setPrototypeOf(target, prototype);
     ```

### 深冻结

1. 参考链接

   [Object.freeze 的使用](https://blog.csdn.net/Merciwen/article/details/86544917)

2. 详解

   Object.freeze() 方法可以冻结一个对象最外层的自定义和自带的属性和值，不能修改或删除。该方法返回被冻结的对象。

   - 基本用法

     ```js
     var obj = {
       prop: function () {},
       foo: "bar",
     };
     var o = Object.freeze(obj);
     Object.isFrozen(obj); // === true
     //赋值、defineProperty、设置__proto__、数组push等均报错
     ```

   - 浅冻结(可以修改内层属性和值)

     ```js
     obj1 = {
       internal: {},
     };

     Object.freeze(obj1);
     obj1.internal.a = "aValue";

     obj1.internal.a; // 'aValue'
     ```

   - 深冻结

     ```js
     function deepFreeze(obj) {
       var propNames = Object.getOwnPropertyNames(obj);
       propNames.forEach(function (name) {
         var prop = obj[name];

         if (typeof prop == "object" && prop !== null) deepFreeze(prop);
       });
       return Object.freeze(obj);
     }
     ```

### 发布订阅和观察者

1. 参考链接

   [观察者模式（Observer）和发布（Publish/订阅模式（Subscribe）的区别](https://blog.csdn.net/qq_39877296/article/details/79103206)

   [vue 发布订阅者模式$emit、$on](https://blog.csdn.net/qq_42778001/article/details/96692000)

2. 详解

   - 观察者模式

     观察者注入被观察目标，被观察目标数据变化，通知观察者更新

   - 发布、订阅模式

     订阅者订阅(注入)调度中心，发布者发布事件到调度中心，调度中心调用订阅者方法

     ```js
     function Center() {
       this.subscriptionCenter = {};
     }
     //on和emit都是公共方法
     Center.prototype.on = function (eventName, callback) {
       if (this.subscriptionCenter[eventName]) {
         this.subscriptionCenter[eventName].push(callback);
       } else {
         this.subscriptionCenter[eventName] = [callback];
       }
     };
     Center.prototype.emit = function (eventName, ...publishInfo) {
       if (this.subscriptionCenter[eventName]) {
         this.subscriptionCenter[eventName].forEach((cb) => cb(...publishInfo));
       }
     };
     var center = new Center();
     center.on("subscription", function event1(time) {
       console.log("event1");
     });
     center.on("subscription", function event2(time) {
       console.log("event2");
     });
     center.on("subscription", function event3(time) {
       console.log("event3");
     });
     center.emit("subscription", "hello");
     ```

### 实现链式调用

1. 参考链接

   [JS 如何实现链式调用](https://www.jianshu.com/p/c097d75b526a)

2. 详解

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

### 数组的理解

1. 参考链接：

   - [十道大厂面试题(含答案)总结](https://mp.weixin.qq.com/s/o553cr1FHLz40PpxbO8oOw)

2. 详解：

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

### typescript

1. 参考链接：

   [TypeScript 入门简单进阶难，梳理下要攻克的重难点](https://mp.weixin.qq.com/s/t_jBDHJ7d9kjoBWDq72wCg)

   [Typescript 中的 interface 和 type 到底有什么区别](https://www.jqhtml.com/24056.html)

   [在网页中使用typescript生成的代码](https://blog.csdn.net/deping_chen/article/details/93467654)

   [一份不可多得的 TS 学习指南（1.8W字）](https://juejin.im/post/6872111128135073806#heading-110)

2. 详解

   - tsconfig.json配置样例

      使用tsc --init生成
      ```json
      {
        "compilerOptions": {

          /* 基本选项 */
          "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
          "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
          "lib": [],                             // 指定要包含在编译中的库文件
          "allowJs": true,                       // 允许编译 javascript 文件
          "checkJs": true,                       // 报告 javascript 文件中的错误
          "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
          "declaration": true,                   // 生成相应的 '.d.ts' 文件
          "sourceMap": true,                     // 生成相应的 '.map' 文件
          "outFile": "./",                       // 将输出文件合并为一个文件
          "outDir": "./",                        // 指定输出目录
          "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
          "removeComments": true,                // 删除编译后的所有的注释
          "noEmit": true,                        // 不生成输出文件
          "importHelpers": true,                 // 从 tslib 导入辅助工具函数
          "isolatedModules": true,               // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

          /* 严格的类型检查选项 */
          "strict": true,                        // 启用所有严格类型检查选项
          "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
          "strictNullChecks": true,              // 启用严格的 null 检查
          "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
          "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

          /* 额外的检查 */
          "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
          "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
          "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
          "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

          /* 模块解析选项 */
          "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
          "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
          "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
          "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
          "typeRoots": [],                       // 包含类型声明的文件列表
          "types": [],                           // 需要包含的类型声明文件名列表
          "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

          /* Source Map Options */
          "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
          "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
          "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
          "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

          /* 其他选项 */
          "experimentalDecorators": true,        // 启用装饰器
          "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
        }
      }
      ```

   - interface 与 type 区别

     - 共同点

       1. 都可以描述一个对象或者函数
       2. 都允许拓展（extends）

     - type 可以而 interface 不行

       type 可以声明基本类型别名，联合类型，元组等类型

     - interface 可以而 type 不行

       interface 能够声明合并

   - interface

     同名的 interface 自动聚合，也可以跟同名的 class 自动聚合

     只能表示 object、class、function 类型

     ```ts
     interface StringArray {
       readonly [index: number]: string; //可设置为只读
     }

     let myArray: StringArray;
     myArray = ["Bob", "Fred"];

     let myStr: string = myArray[0];
     ```

     implement 实现接口不可继承

     ```ts
     interface Point {
       x: number;
       y: number;
     }

     class SomePoint implements Point {
       x: 1;
       y: 2;
     }

     type Point2 = {
       x: number;
       y: number;
     };

     class SomePoint2 implements Point2 {
       x: 1;
       y: 2;
     }

     type PartialPoint = { x: number } | { y: number };

     class SomePartialPoint implements PartialPoint {
       x: 1;
       y: 2;
     }
     ```

     给函数挂载属性

     ```ts
     interface FuncWithAttachment {
       (param: string): boolean;
       someProperty: number;
     }

     const testFunc: FuncWithAttachment = function (param: string) {
       return param.indexOf("Neal") > -1;
     };
     const result = testFunc("Nealyang"); // 有类型提醒
     testFunc.someProperty = 4;
     ```

     - extends 继承

     ```ts
     type num = {
       num: number;
     };

     interface IStrNum extends num {
       str: string;
     }

     // 与上面等价
     type TStrNum = A & {
       str: string;
     };

     type IsEqualType<A, B> = A extends B
       ? B extends A
         ? true
         : false
       : false;

     type NumberEqualsToString = IsEqualType<number, string>; // false
     type NumberEqualsToNumber = IsEqualType<number, number>; // true
     ```

   - type

     不仅仅能够表示 object、class、function

     不能重名（自然不存在同名聚合了），扩展已有的 type 需要创建新 type

     支持复杂的类型操作

     ```ts
     interface Point {
       x: number;
       y: number;
     }

     interface SetPoint {
       (x: number, y: number): void;
     }

     type Point = {
       x: number;
       y: number;
     };

     type SetPoint = (x: number, y: number) => void;

     type Name = string;

     type PartialPointX = { x: number };
     type PartialPointY = { y: number };

     type PartialPoint = PartialPointX | PartialPointY;

     type Data = [number, string, boolean];
     ```

     interface 和 type 不互斥

     ```ts
     interface PartialPointX {x:number;};
     interface Point extends PartialPointX {y:number;};

     type PartialPointX = {x:number;};
     type Point = PartialPointX & {y:number;};

     type PartialPointX = {x:number;};
     interface Point extends PartialPointX {y:number;};

     interface ParticalPointX = {x:number;};
     type Point = ParticalPointX & {y:number};
     ```

   - 声明合并

     ```ts
     interface Point {
       x: number;
     }
     interface Point {
       y: number;
     }

     const point: Pint = { x: 1, y: 2 };
     ```

   - 交叉类型

     ```ts
     interface IA{
         a:string;
         b:string;
     }

     type TB{
         b:number;
         c:number [];
     }

     type TC = TA | TB;// TC 的 key，包含 ab 或者 bc 即可，当然，包含 bac 也可以
     type TD = TA & TB;// TD 的 可以,必须包含 abc

     interface A{
         name:string;
         age:number;
         sayName:(name:string)=>void
     }

     interface B{
         name:string;
         gender:string;
         sayGender:(gender:string)=>void
     }

     let a:A&B;
     ```

   - keyof 是索引类型操作符,用来获取类型

     ```ts
     interface IQZQD {
       cnName: string;
       age: number;
       author: string;
     }
     type ant = keyof IQZQD;

     interface Map<T> {
       [key: string]: T;
     }

     //T[U]是索引访问操作符;U是一个属性名称。
     let keys: keyof Map<number>; //string | number
     let value: Map<number>["antzone"]; //number
     ```

   - 泛型(不能应用于类的静态成员)不预先确定的数据类型，具体的类型在使用的时候再确定的一种类型约束规范

     泛型的好处：

     1. 函数和类可以轻松的支持多种类型，增强程序的扩展性
     2. 不必写多条函数重载，冗长的联合类型声明，增强代码的可读性
     3. 灵活控制类型之间的约束

     ```ts
     function log<T>(value: T): T {
       console.log(value);
       return value;
     }

     // 两种调用方式
     log<string[]>(["a", ",b", "c"]);
     log(["a", ",b", "c"]);
     log("Nealyang");

     type Log = <T>(value: T) => T;
     let myLog: Log = log;

     interface Log<T> {
       (value: T): T;
     }
     let myLog: Log<number> = log; // 泛型约束了整个接口，实现的时候必须指定类型。如果不指定类型，就在定义的之后指定一个默认的类型
     myLog(1);

     class Log<T> {
       // 泛型不能应用于类的静态成员
       run(value: T) {
         console.log(value);
         return value;
       }
     }

     let log1 = new Log<number>(); //实例化的时候可以显示的传入泛型的类型
     log1.run(1);
     let log2 = new Log();
     log2.run({ a: 1 }); //也可以不传入类型参数，当不指定的时候，value 的值就可以是任意的值

     //类型约束，需预定义一个接口
     interface Length {
       length: number;
     }
     function logAdvance<T extends Length>(value: T): T {
       console.log(value, value.length);
       return value;
     }

     // 输入的参数不管是什么类型，都必须具有 length 属性
     logAdvance([1]);
     logAdvance("123");
     logAdvance({ length: 3 });
     ```

   - 属性相关

     - Required 传入的属性变为必选项

     - Readonly 属性变为只读选项

     - Record 将 K 中所有的属性的值转化为 T 类型

     ```ts
     /**
      * Construct a type with a set of properties K of type T
      */
     type Record<K extends keyof any, T> = {
       [P in K]: T;
     };
     type T11 = Record<"a" | "b" | "c", Person>; // -> { a: Person; b: Person; c: Person; }
     ```

     - Pick 从 T 中取出 一系列 K 的属性

     ```ts
     /**
      * From T, pick a set of properties whose keys are in the union K
      */
     type Pick<T, K extends keyof T> = {
       [P in K]: T[P];
     };
     ```

     - Exclude 将某个类型中属于另一个的类型移除掉

     ```ts
     /**
      * Exclude from T those types that are assignable to U
      */
     type Exclude<T, U> = T extends U ? never : T;
     type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">; // -> 'b' | 'd'
     ```

     - Extract 从 T 中提取出 U

     ```ts
     /**
      * Extract from T those types that are assignable to U
      */
     type Extract<T, U> = T extends U ? T : never;
     type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">; // -> 'a' | 'c'
     ```

     - Omit:Pick 和 Exclude 进行组合, 实现忽略对象某些属性功能

     ```ts
     /**
      * Construct a type with the properties of T except for those in type K.
      */
     type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
     type Foo = Omit<{ name: string; age: number }, "name">; // -> { age: number }
     ```

   - 类型断言:any 大法好

     ```ts
     const nealyang = {};
     nealyang.enName = 'Nealyang'; // Error: 'enName' 属性不存在于 ‘{}’
     nealyang.cnName = '一凨'; // Error: 'cnName' 属性不存在于 '{}'
     interface INealyang = {
         enName:string;
         cnName：string;
     }

     const nealyang = {} as INealyang; // const nealyang = <INealyang>{};
     nealyang.enName = 'Nealyang';
     nealyang.cnName = '一凨';
     ```

   - 函数重载

     ```ts
     declare function test(a: number): number;
     declare function test(a: string): string;

     const resS = test("Hello World"); // resS 被推断出类型为 string；
     const resN = test(1234); // resN 被推断出类型为 number;
     ```



### MutationObserver

1.  参考链接：

    [打开控制台也删不掉的元素，前端都吓尿了](https://juejin.im/post/5ecaa70451882542fc624245#heading-3)

    [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)

2.  详解

    * 定义

        MutationObserver: 提供了监视对DOM树所做更改的能力。它被设计为旧的Mutation Events功能的替代品，该功能是DOM3 Events规范的一部分。兼容至IE11。

    * 使用场景

        长列表优化、水印放删改

    * 实现指定节点防止删改

        ```js
        function observeSelector(element) {
          if (element) {
            const parentNode = element.parentNode || document.body;
            // 为什么这么做？因为这是最原始的节点了
            // 如果直接拿element去replace只能拿到具有最新属性的节点
            const newClonedNode = element.cloneNode(true);
            new MutationObserver(mutations => {
              mutations.forEach(mutationRecord => {
                const currentTarget = mutationRecord.target;
                const removedNode = mutationRecord.removedNodes[0];
                // 修改属性的时候，target就是当前元素
                if (currentTarget === element) {
                  //改一下就replace回去
                  const replaceNode = newClonedNode.cloneNode(true);
                  parentNode.replaceChild(replaceNode, element);
                  element = replaceNode;
                } else {
                  // 删除元素的时候，removedNodes是一个数组，只删它一个，那第一个就是当前元素
                  if (removedNode === element) {
                    //删一个就append回去
                    element = element.cloneNode(true);
                    parentNode.appendChild(element);
                  }
                }
              });
            }).observe(document.body, {
              attributes: true,
              childList: true,
              subtree: true, // 监听后代节点变化
            });
          }
        }
        ```

### blob

1.  参考链接：

  [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)

  [《你不知道的 Blob》番外篇](https://segmentfault.com/a/1190000022875544)

  [谁说前端不需要懂二进制](https://mp.weixin.qq.com/s/tFi74DRJRFQjWlCVcSzHmg)

2.  详解

  * 概念

    Blob 对象表示一个不可变、原始数据的类文件对象。File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。要获取用户文件系统上的文件对应的 Blob 对象，使用 File 。

    从其他非blob对象和数据构造一个 Blob，使用 Blob() 构造函数。创建一个 blob 数据的子集 blob，使用 slice() 方法。

    Blob 由一个可选字符串 type 和 blobParts 组成，type 通常为 MIME 类型。

    MIME（Multipurpose Internet Mail Extensions）多用途互联网邮件扩展类型，常见有：超文本标记语言文本 .html text/html 、PNG图像 .png image/png 、普通文本 .txt text/plain  等。

  * 构造函数

    const myBlob = new Blob(blobParts[, options])

    * blobParts：由 ArrayBuffer，ArrayBufferView，Blob，DOMString 等对象构成的数组。DOMStrings 会被编码为 UTF-8。

    * options ：一个可选的对象，包含以下两个属性：

      * type ：默认值为 "" ，表示将会被放入到 blob 中的数组内容的 MIME 类型。
      * endings ：默认值为 "transparent"，用于指定包含行结束符 \n 的字符串如何被写入。它是以下两个值中的一个："native"，代表行结束符会被更改为适合宿主操作系统文件系统的换行符，或者 "transparent"，代表会保持 blob 中保存的结束符不变。

  * 属性

    * size ：只读，表示 Blob 对象中所包含的数据大小（以字节为单位）；
    * type ：只读，值为字符串，表示该 Blob 对象所包含数据的 MIME 类型。若类型未知，则该属性值为空字符串。

  * 方法

    * slice([start[, end[, contentType]]]) ：返回一个新的 Blob 对象，包含了源 Blob 对象中指定范围内的数据。
    * stream()：返回一个能读取 Blob 内容的 ReadableStream 。
    * text()：返回一个 Promise 对象且包含 Blob 所有内容的 UTF-8 格式的 USVString 。
    * arrayBuffer()：返回一个 Promise 对象且包含 Blob 所有内容的二进制格式的 ArrayBuffer 。

    注意： Blob 对象是不可改变的，但是可以进行分割，并创建出新的 Blob 对象，将它们混合到一个新的 Blob  中。类似于 JavaScript 字符串：我们无法更改字符串中的字符，但可以创建新的更正后的字符串。

  * 使用

    1. 从字符串创建 Blob

      ```js
      let myBlobParts = ['<html><h2>Hello Leo</h2></html>']; // 一个包含DOMString的数组
      let myBlob = new Blob(myBlobParts, {type : 'text/html', endings: "transparent"}); // 得到 blob

      console.log(myBlob.size + " bytes size");
      // Output: 31 bytes size
      console.log(myBlob.type + " is the type");
      // Output: text/html is the type
      ```

    2. 从类型化数组和字符串创建 Blob

      JavaScript类型化数组是一种类似数组的对象，并提供了一种用于 访问原始二进制数据的机制 。并且在类型数组上调用 Array.isArray() 会返回 false 。
      ```js
      let hello = new Uint8Array([72, 101, 108, 108, 111]); // 二进制格式的 "hello"
      let blob = new Blob([hello, ' ', 'leo'], {type: 'text/plain'});
      // Output: "Hello leo"
      ```

    3. 组装新的 Blob

      ```js
      let blob1 = new Blob(['<html><h2>Hello Leo</h2></html>'], 
        {type : 'text/html', endings: "transparent"});
      let blob2 = new Blob(['<html><h2>Happy Boy!</h2></html>'], 
        {type : 'text/html', endings: "transparent"});
      let slice1 = blob1.slice(16);
      let slice2 = blob2.slice(0, 16);

      await slice1.text();
      // currtent slice1 value: "Leo</h2></html>"
      await slice2.text();
      // currtent slice2 value: "<html><h2>Happy "

      let newBlob = new Blob([slice2, slice1], 
        {type : 'text/html', endings: "transparent"});
      await newBlob.text();
      // currtent newBlob value: "<html><h2>Happy Leo</h2></html>"
      ```

  * 场景

    1. 图片本地预览 + 分片上传 + 暂停 + 续传

      ```html
      <body>
          <input type="file" accept="image/*" onchange="selectFile(event)">
          <button onclick="upload()">上传</button>
          <button onclick="pause()">暂停</button>
          <button onclick="continues()">继续</button>
          <img id="output" src="" alt="">

          <script>
              const chunkSize = 30000;
              let start = 0, curFile, isPause = false;
              const url = "https://httpbin.org/post";
              async function selectFile(){
                  const reader = new FileReader();
                  reader.onload = function(){
                      const output = document.querySelector("#output")
                      output.src = reader.result;
                  }
                  reader.readAsDataURL(event.target.files[0]);
                  curFile = event.target.files[0];
              }
              async function upload(){
                  const file = curFile;
                  for(start; start < file.size; start += chunkSize){
                      if(isPause) return;
                      const chunk = file.slice(start, start + chunkSize + 1);
                      const fd = new FormData();
                      fd.append("data", chunk);
                      await fetch(url, { method: "post", body: fd }).then((res) =>{
                              res.text()
                          }
                      );
                      if(chunk.size < chunkSize){
                          uploadSuccess();
                          return;
                      }
                  }
              }
              function pause(){
                  isPause = true;
              }
              function continues(){
                  isPause = false;
                  upload();
              }
              function uploadSuccess(){
                  isPause = false;
                  start = 0;
              }
          </script>
      </body>
      ```

    2. 从互联网下载数据

      ```html
      <body>
          <button onclick="download1()">使用 XMLHttpRequest 下载</button>
          <button onclick="download2()">使用 fetch 下载</button>
          <img id="pingan">
          <script>
              const url = "http://images.pingan8787.com/TinyCompiler/111.png";
              const pingan = document.querySelector('#pingan');
              function download1 (){
                  const xhr = new XMLHttpRequest();
                  xhr.open('GET', url);
                  xhr.responseType = 'blob';
                  xhr.onload = () => {
                      renderImage(xhr.response);
                  }
                  xhr.send(null);
              }
              function download2 (){
                  fetch(url).then(res => {
                      return res.blob();
                  }).then(myBlob => {
                      renderImage(myBlob);
                  })
              }

              function renderImage (data){
                  let objectURL = URL.createObjectURL(data);
                  pingan.src = objectURL;
                  // 根据业务需要手动调用 URL.revokeObjectURL(imgUrl)释放对象
              }
          </script>
      </body>
      ```

    3. 下载文件

      ```html
      <body>
          <button onclick="download()">Blob 文件下载</button>

          <script>
              function download(){
                  const fileName= "Blob文件.txt";
                  const myBlob = new Blob(["一文彻底掌握 Blob Web API"], { type: "text/plain" });
                  downloadFun(fileName, myBlob);
              }
              function downloadFun(fileName, blob){
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = fileName;
                  link.click();
                  link.remove();
                  URL.revokeObjectURL(link.href);//释放对象
              }
          </script>
      </body>
      ```

    4. 图片压缩

      Canvas 的 toDataURL(type,encoderOptions) 实现

      type 表示图片格式，默认为 image/png

      encoderOptions 表示图片质量，在指定图片格式为 image/jpeg 或 image/webp 的情况下，可以从 0 到 1 区间内选择图片质量。如果超出取值范围，将会使用默认值 0.92，其他参数会被忽略。

      ```html
      <body>
          <input type="file" accept="image/*" onchange="loadFile(event)" />
          <script>
              // compress.js
              const MAX_WIDTH = 800; // 图片最大宽度
                // 图片压缩方法
              function compress(base64, quality, mimeType) {
                  let canvas = document.createElement("canvas");
                  let img = document.createElement("img");
                  img.crossOrigin = "anonymous";
                  return new Promise((resolve, reject) => {
                      img.src = base64;
                      img.onload = () => {
                          let targetWidth, targetHeight;
                          if (img.width > MAX_WIDTH) {
                              targetWidth = MAX_WIDTH;
                              targetHeight = (img.height * MAX_WIDTH) / img.width;
                          } else {
                              targetWidth = img.width;
                              targetHeight = img.height;
                          }
                          canvas.width = targetWidth;
                          canvas.height = targetHeight;
                          let ctx = canvas.getContext("2d");
                          ctx.clearRect(0, 0, targetWidth, targetHeight); // 清除画布
                          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                          let imageData = canvas.toDataURL(mimeType, quality / 100); // 设置图片质量
                          resolve(imageData);
                      };
                  });
              }

              // 为了进一步减少传输的数据量，我们可以把它转换为 Blob 对象
              function dataUrlToBlob(base64, mimeType) {
                  let bytes = window.atob(base64.split(",")[1]);
                  let ab = new ArrayBuffer(bytes.length);
                  let ia = new Uint8Array(ab);
                  for (let i = 0; i < bytes.length; i++) {
                      ia[i] = bytes.charCodeAt(i);
                  }
                  return new Blob([ab], { type: mimeType });
              }

              // 通过 AJAX 提交到服务器
              function uploadFile(url, blob) {
                  let formData = new FormData();
                  let request = new XMLHttpRequest();
                  formData.append("image", blob);
                  request.open("POST", url, true);
                  request.send(formData);
              }

              function loadFile(event) {
                  const reader = new FileReader();
                  reader.onload = async function () {
                      let compressedDataURL = await compress(
                          reader.result,
                          90,
                          "image/jpeg"
                      );
                      let compressedImageBlob = dataUrlToBlob(compressedDataURL);
                      uploadFile("https://httpbin.org/post", compressedImageBlob);
                  };
                  reader.readAsDataURL(event.target.files[0]);
              };
          </script>
      </body>
      ```

      canvas.toBlob(callback, mimeType, qualityArgument)

      和 toDataURL() 方法相比，toBlob() 方法是异步的，因此多了个 callback 参数，这个 callback 回调方法默认的第一个参数就是转换好的 blob文件信息。

    5. 生成 PDF 文档

      ```html
      <body>
        <h3>客户端生成 PDF 示例</h3>
        <script src="https://unpkg.com/jspdf@latest/dist/jspdf.min.js"></script>
        <script>
          (function generatePdf() {
            const doc = new jsPDF();
            doc.text("Hello semlinker!", 66, 88);
            const blob = new Blob([doc.output()], { type: "application/pdf" });
            blob.text().then((blobAsText) => {
              console.log(blobAsText);
            });
          })();

          //带图片
          let imgData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/...'
          let doc = new jsPDF();

          doc.setFontSize(40);
          doc.text(35, 25, 'Paranyan loves jsPDF');
          doc.addImage(imgData, 'JPEG', 15, 40, 180, 160);
        </script>
      </body>
      ```

  * Blob 与 ArrayBuffer

    1. 区别

      ArrayBuffer 对象用于表示通用的，固定长度的原始二进制数据缓冲区。且不能直接操纵 ArrayBuffer 的内容，需要创建一个类型化数组对象或 DataView 对象，该对象以特定格式表示缓冲区，并使用该对象读取和写入缓冲区的内容。

      Blob 类型的对象表示不可变的类似文件对象的原始数据。

      Blob 类型只有 slice 方法，用于返回一个新的 Blob 对象，包含了源 Blob 对象中指定范围内的数据。

      ArrayBuffer 的数据，是可以按照字节去操作的，通过 TypedArrays 或 DataView 操作,而 Blob 只能作为一个完整对象去处理。

      Blob 可以位于磁盘、高速缓存内存和其他不同用位置，而 ArrayBuffer 存在内存中

      需要使用写入/编辑操作时使用 ArrayBuffer，否则使用 Blob 即可

    2. 转换

      ArrayBuffer 转 Blob

      ```js
      const buffer = new ArrayBuffer(16);
      const blob = new Blob([buffer]);
      ```

      Blob 转 ArrayBuffer

      ```js
      const blob = new Blob([1,2,3,4,5]);
      const reader = new FileReader();

      reader.onload = function() {
          console.log(this.result);
      }
      reader.readAsArrayBuffer(blob);
      ```

    3. ajax中的使用

      ```js
      function GET(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer'; // or xhr.responseType = "blob";
        xhr.send();

        xhr.onload = function(e) {
          if (xhr.status != 200) {
            alert("Unexpected status code " + xhr.status + " for " + url);
            return false;
          }
          callback(new Uint8Array(xhr.response)); // or new Blob([xhr.response]);
        };
      }
      ```

  * Blob URL 和 Data URL

    * 区别

      1. 格式

        ```txt
        Blob URL 格式如 blob:域名/uuid ， Data URL 格式如： data:[<mediatype>][;base64],<data>
        mediatype 是个 MIME 类型的字符串，例如 "image/jpeg" 表示 JPEG 图像文件。如果被省略，则默认值为 text/plain;charset=US-ASCII。
        ```

      2. 长度

        Blob URL 一般长度较短，而 Data URL 因为直接存储图片 base64 编码后的数据，往往比较长。

      3. xhr

        Blob URL  可以很方便使用 XMLHttpRequest 获取源数据（ xhr.responseType = 'blob' ），而 Data URL 并不是所有浏览器都支持通过 XMLHttpRequest 获取源数据的。

      4. 使用场景

        Blob URL 只能在当前应用内使用，把 Blob URL 复制到浏览器地址栏是无法获取数据，而 Data URL 则可以在任意浏览器中使用。

  * 二进制相关数据类型

    ArrayBuffer，TypedArray，Blob，DataURL，ObjectURL，Text

    * TypedArray

      抽象类/接口，不可以被实例化，不可访问，有如下数据类型：Uint8Array/Int8Array/Uint16Array/Int16Array,uint表示无符号，数字表示长度

      实现类数组concat
      ```js
      function concatenate(constructor, ...arrays) {
          let length = 0;
          for (let arr of arrays) {
            length += arr.length;
          }
          let result = new constructor(length);
          let offset = 0;
          for (let arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
          }
          return result;
      }

      concatenate(Uint8Array, new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6]))
      ```

    * ArrayBuffer

      二进制数据结构，只读，需要转化为 TypedArray 进行写操作，直接new TypedArray下的具体类型即可

    * FileReader

      可以把 Blob 转化为其它数据

      * FileReader.prototype.readAsArrayBuffer
      * FileReader.prototype.readAsText
      * FileReader.prototype.readAsDataURL
      * FileReader.prototype.readAsBinaryString

      ```js
      const blob = new Blob('hello'.split(''))

      // 表示文件的大小
      blob.size

      const array = new Uint8Array([128, 128, 128])
      const blob2 = new Blob([array])

      function readBlob (blob, type) {
        return new Promise(resolve => {
          const reader = new FileReader()
          reader.onload = function (e) {
            resolve(e.target.result)
          }
          reader.readAsArrayBuffer(blob)
        })
      }

      readBlob(blob, 'DataURL').then(url => console.log(url))
      ```

    * base64编解码

      使用 atob(编码) 和 btoa(解码) 编码解码数据，a表示ascii，b表示binary

    * 拼接两个音频文件

      fetch请求音频资源 -> ArrayBuffer -> TypedArray -> 拼接成一个 TypedArray -> ArrayBuffer -> Blob -> Object URL

    * 把 json 数据转化为 demo.json 并下载文件

      ```js
      const json = {
        a: 3,
        b: 4,
        c: 5
      }
      const str = JSON.stringify(json, null, 2)

      // 方案一：Text -> DataURL
      const dataUrl = `data:,${str}`
      download(dataUrl, 'demo.json')

      // 方案二：Text -> Blob -> ObjectURL
      const url = URL.createObjectURL(new Blob(str.split('')))
      download(url, 'demo1.json')
      ```

### webApi

1. 参考链接：

  [10个打开了我新世界大门的 WebAPI](https://juejin.im/post/5ee8c60ef265da76ed486e20#heading-10)

  [Web Audio API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API)

  [Fullscreen_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fullscreen_API)

  [Web Speech API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API)

  [Web Bluetooth API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Bluetooth_API)

  [Channel Messaging API](https://developer.mozilla.org/zh-CN/docs/Web/API/Channel_Messaging_API)

  [Vibration API](https://developer.mozilla.org/zh-CN/docs/Web/API/Vibration_API)

  [Broadcast_Channel_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Broadcast_Channel_API)

  [Payment_Request_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Payment_Request_API)

  [Resize_Observer_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Resize_Observer_API)

  [Pointer_Lock_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Pointer_Lock_API)

2. 详解

    web api 对 IE 完全不兼容，其它浏览器页需要较新版本

    * Web Audio API

    audio 元素传递到 AudioContext,创建一个媒体源 createMediaElementSource(audio),createGain 创建音量节点 volNode,使用 StereoPannerNode 设置声像效果

    ```html
    <body>
        <header>
            <h2>Web APIs<h2>
        </header>
        <div class="web-api-cnt">
            <div class="web-api-card">
                <div class="web-api-card-head"> Demo - Audio </div>
                <div class="web-api-card-body">
                    <div id="error" class="close"></div>
                    <div>
                        <audio controls src="./lovely.mp4" id="audio"></audio>
                    </div>
                    <div>
                        <button onclick="audioFromAudioFile.init()">Init</button>
                        <button onclick="audioFromAudioFile.play()">Play</button>
                        <button onclick="audioFromAudioFile.pause()">Pause</button>
                        <button onclick="audioFromAudioFile.stop()">Stop</button>
                    </div>
                    <div>
                        <span>Vol: <input onchange="audioFromAudioFile.changeVolume()" type="range" id="vol" min="1" max="3"
                                step="0.01" value="1" /></span>
                        <span>Pan: <input onchange="audioFromAudioFile.changePan()" type="range" id="panner" min="-1"
                                max="1" step="0.01" value="0" /></span>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <script>
        const l = console.log
        let audioFromAudioFile = (function () {
            var audioContext
            var volNode
            var pannerNode
            var mediaSource

            function init() {
                l("Init")
                try {
                    audioContext = new AudioContext()
                    mediaSource = audioContext.createMediaElementSource(audio)
                    volNode = audioContext.createGain()
                    volNode.gain.value = 1
                    pannerNode = new StereoPannerNode(audioContext, { pan: 0 })

                    mediaSource.connect(volNode).connect(pannerNode).connect(audioContext.destination)
                    console.log(volNode)
                }
                catch (e) {
                    error.innerHTML = "The Web Audio API is not supported in this device."
                    error.classList.remove("close")
                }
            }
            function play() {
                audio.play()
            }

            function pause() {
                audio.pause()
            }

            function stop() {
                audio.stop()
            }

            function changeVolume() {
                volNode.gain.value = document.getElementById('vol').value
            }

            function changePan() {
                pannerNode.gain.value = tdocument.getElementById('panner').value
            }

            return {
                init,
                play,
                pause,
                stop,
                changePan,
                changeVolume
            }
        })()
    </script>
    ```

    * Fullscreen API

    全屏播放

    ```html
    <script>
        function toggle() {
            const videoStageEl = document.querySelector(".video-stage")
            console.log(videoStageEl.requestFullscreen)
            if (videoStageEl.requestFullscreen) {
                if (!document.fullscreenElement) {
                    videoStageEl.requestFullscreen()
                }
                else {
                    document.exitFullscreen()
                }
            } else {
                error.innerHTML = "Fullscreen API not supported in this device."
                error.classList.remove("close")
            }
        }
    </script>
    ```

    * Web Speech API

    将语音合成和语音识别功能添加到Web应用中，能够向Web应用发出语音命令，实现文本到语音和语音到文本的转换。

    实例化 SpeechSynthesisUtterance() 对象，将输入框中输入的文本转换为语音，调用语音对象 SpeechSynthesis 的 speak 函数，使输入框中的文本在我们的扬声器中放出。

    实例化 SpeechRecognition，然后注册事件处理程序和回调。在语音识别开始时调用 onstart，在发生错误时调用 onerror 。每当语音识别捕获到一条线时，就会调用 onresult,提取文本并将其设置到文本区域。

    ```html
    <body>
        <header>
            <h2>Web APIs<h2>
        </header>
        <div class="web-api-cnt">
            <div id="error" class="close"></div>
            <div class="web-api-card">
                <div class="web-api-card-head"> Demo - Text to Speech </div>
                <div class="web-api-card-body">
                    <div>
                        <input placeholder="Enter text here" type="text" id="textToSpeech" />
                    </div>
                    <div>
                        <button onclick="speak()">Tap to Speak</button>
                    </div>
                </div>
            </div>
            <div class="web-api-card">
                <div class="web-api-card-head"> Demo - Speech to Text </div>
                <div class="web-api-card-body">
                    <div>
                        <textarea placeholder="Text will appear here when you start speeaking."
                            id="speechToText"></textarea>
                    </div>
                    <div>
                        <button onclick="tapToSpeak()">Tap and Speak into Mic</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <script>

        try {
            var speech = new SpeechSynthesisUtterance()
            var recognition = new SpeechRecognition()
        } catch (e) {
            error.innerHTML = "Web Speech API not supported in this device."
            error.classList.remove("close")
        }

        function speak() {
            speech.text = textToSpeech.value
            speech.volume = 1
            speech.rate = 1
            speech.pitch = 1
            alert(window.speechSynthesis)
            window.speechSynthesis.speak(speech)
        }

        function tapToSpeak() {
            recognition.onstart = function () { }

            recognition.onresult = function (event) {
                const curr = event.resultIndex
                const transcript = event.results[curr][0].transcript
                speechToText.value = transcript
            }

            recognition.onerror = function (ev) {
                console.error(ev)
            }

            recognition.start()
        }

    </script>
    ```

    * Bluetooth API

    访问手机上的低功耗蓝牙设备，并使用它来将网页中的数据共享到另一台设备上。

    基础 API 是 navigator.bluetooth.requestDevice。调用它将使浏览器提示用户选择一个设备，使他们可以选择一个设备或取消请求。

    navigator.bluetooth.requestDevice 需要一个对象。该对象定义了用于返回与过滤器匹配的蓝牙设备的过滤器。

    ```html
    <body>
        <header>
            <h2>Web APIs<h2>
        </header>
        <div class="web-api-cnt">
            <div class="web-api-card">
                <div class="web-api-card-head"> Demo - Bluetooth </div>
                <div class="web-api-card-body">
                    <div id="error" class="close"></div>
                    <div>
                        <div>Device Name: <span id="dname"></span></div>
                        <div>Device ID: <span id="did"></span></div>
                        <div>Device Connected: <span id="dconnected"></span></div>
                    </div>
                    <div>
                        <button onclick="bluetoothAction()">Get BLE Device</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <script>
        function bluetoothAction() {
            if (navigator.bluetooth) {
                navigator.bluetooth.requestDevice({
                    acceptAllDevices: true
                }).then(device => {
                    dname.innerHTML = device.name
                    did.innerHTML = device.id
                    dconnected.innerHTML = device.connected
                }).catch(err => {
                    error.innerHTML = "Oh my!! Something went wrong."
                    error.classList.remove("close")
                })
            } else {
                error.innerHTML = "Bluetooth is not supported."
                error.classList.remove("close")
            }
        }
    </script>
    ```

    * Channel Messaging API

    允许两个不同的脚本运行在同一个文档的不同浏览器上下文（比如两个 iframe，或者文档主体和一个 iframe，或者两个 worker）来直接通讯，在每端使用一个端口（port）通过双向频道（channel）向彼此传递消息。

    首先创建一个 MessageChannel 实例,返回一个 MessagePort 对象（通讯信道）,通过 MessagePort.port1 或 MessageChannel.port2 设置端口。

    每个浏览器上下文都使用 Message.onmessage 监听消息，并使用事件的 data 属性获取消息内容。

    ```html
    <body>
        <header>
            <h2>Web APIs<h2>
        </header>
        <div class="web-api-cnt">
            <div class="web-api-card">
                <div class="web-api-card-head"> Demo - MessageChannel </div>
                <div class="web-api-card-body">
                    <div id="error" class="close"></div>
                    <div id="displayMsg">
                    </div>
                    <div>
                        <input id="input" type="text" placeholder="Send message to iframe" />
                    </div>
                    <div>
                        <button onclick="sendMsg()">Send Msg</button>
                    </div>
                    <div>
                        <iframe id="iframe" src="./iframe.content.html"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <script>
        try {
            var channel = new MessageChannel()
            var port1 = channel.port1
        } catch (e) {
            error.innerHTML = "MessageChannel API not supported in this device."
            error.classList.remove("close")
        }

        iframe.addEventListener("load", onLoad)

        function onLoad() {
            port1.onmessage = onMessage
            iframe.contentWindow.postMessage("load", '*', [channel.port2])
        }

        function onMessage(e) {
            const newHTML = "<div>" + e.data + "</div>"
            displayMsg.innerHTML = displayMsg.innerHTML + newHTML
        }

        function sendMsg() {
            port1.postMessage(input.value)
        }
    </script>
    ```
    ```html
    <body>
        <div class="web-api-cnt">

            <div class="web-api-card">
                <div class="web-api-card-head">
                    Running inside an <i>iframe</i>
                </div>
                <div class="web-api-card-body">
                    <div id="iframeDisplayMsg">
                    </div>
                    <div>
                        <input placeholder="Type message.." id="iframeInput" />
                    </div>

                    <div>
                        <button onclick="sendMsgiframe()">Send Msg from <i>iframe</i></button>
                    </div>

                </div>
            </div>

        </div>
    </body>

    <script>
        var port2
        window.addEventListener("message", function(e) {
            port2 = e.ports[0]
            port2.onmessage = onMessage
        })

        function onMessage(e) {
            const newHTML = "<div>"+e.data+"</div>"
            iframeDisplayMsg.innerHTML = iframeDisplayMsg.innerHTML + newHTML
        }

        function sendMsgiframe(){
            port2.postMessage(iframeInput.value)
        }
    </script>
    ```

    * Vibration API

    为 Web 应用程序提供访问移动设备振动硬件

    navigator.vibrate(pattern) 控制振动，pattern 是描述振动模式的单个数字或数字数组。

    navigator.vibrate（[200，300，400]）使设备振动200毫秒，暂停300毫秒，振动400毫秒，然后停止。

    可以通过传递0，[]，[0,0,0]（全零数组）来停止振动。

    ```html
    <body>
        <header>
            <h2>Web APIs<h2>
        </header>
        <div class="web-api-cnt">

            <div class="web-api-card">
                <div class="web-api-card-head">
                    Demo - Vibration
                </div>
                <div class="web-api-card-body">
                    <div id="error" class="close"></div>
                    <div>
                        <input id="vibTime" type="number" placeholder="Vibration time" />
                    </div>

                    <div>
                        <button onclick="vibrate()">Vibrate</button>
                    </div>

                </div>
            </div>

        </div>
    </body>

    <script>
        if(navigator.vibrate) {
            function vibrate() {
                const time = vibTime.value
                if(time != "")
                    navigator.vibrate(time)
            }
        } else {
            error.innerHTML = "Vibrate API not supported in this device."
            error.classList.remove("close")
        }
    </script>
    ```

    * Broadcast Channel API

    Broadcast Channel API 允许相同源下的不同浏览上下文的消息或数据进行通信。浏览上下文可以是窗口、iframe 等

    BroadcastChannel 类用于创建或加入频道。const politicsChannel = new BroadcastChannel("politics")，politics 将是频道的名称。任何通过 politics 来初始化 BroadcastChannel 构造函数的上下文都将加入频道，它将接收在该频道上发送的任何消息，并且可以将消息发送到该频道。

    发布到频道，使用 BroadcastChannel.postMessageAPI

    订阅频道（收听消息），使用 BroadcastChannel.onmessage 事件。

    ```html
    <body>
        <header>
            <h2>Web APIs<h2>
        </header>
        <div class="web-api-cnt">
            <div class="web-api-card">
                <div class="web-api-card-head"> Demo - BroadcastChannel </div>
                <div class="web-api-card-body">
                    <div class="page-info">Open this page in another <i>tab</i>, <i>window</i> or <i>iframe</i> to chat with
                        them.</div>
                    <div id="error" class="close"></div>
                    <div id="displayMsg" style="font-size:19px;text-align:left;">
                    </div>
                    <div class="chatArea">
                        <input id="input" type="text" placeholder="Type your message" />
                        <button onclick="sendMsg()">Send Msg to Channel</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <script>
        const l = console.log;
        try {
            var politicsChannel = new BroadcastChannel("politics")
            politicsChannel.onmessage = onMessage
            var userId = Date.now()
        } catch (e) {
            error.innerHTML = "BroadcastChannel API not supported in this device."
            error.classList.remove("close")
        }

        input.addEventListener("keydown", (e) => {
            if (e.keyCode === 13 && e.target.value.trim().length > 0) {
                sendMsg()
            }
        })

        function onMessage(e) {
            const { msg, id } = e.data
            const newHTML = "<div class='chat-msg'><span><i>" + id + "</i>: " + msg + "</span></div>"
            displayMsg.innerHTML = displayMsg.innerHTML + newHTML
            displayMsg.scrollTop = displayMsg.scrollHeight
        }

        function sendMsg() {
            politicsChannel.postMessage({ msg: input.value, id: userId })

            const newHTML = "<div class='chat-msg'><span><i>Me</i>: " + input.value + "</span></div>"
            displayMsg.innerHTML = displayMsg.innerHTML + newHTML

            input.value = ""

            displayMsg.scrollTop = displayMsg.scrollHeight
        }  
    </script>
    ```

    * Payment Request API

    提供了为商品和服务选择支付途径的方法。

    该 API 提供了一种一致的方式来向不同的商家提供付款细节，而无需用户再次输入细节。

    它向商家提供账单地址，收货地址，卡详细信息等信息。

    ```html
    <body>
        <header>
            <h2>Web APIs<h2>
        </header>
        <div class="web-api-cnt">
            <div class="web-api-card">
                <div class="web-api-card-head"> Demo - Credit Card Payment </div>
                <div class="web-api-card-body">
                    <div id="error" class="close"></div>
                    <div>
                        <button onclick="buy()">Buy</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <script>
        const networks = ["visa", "amex"]
        const types = ["debit", "credit"]

        const supportedInstruments = [
            {
                supportedMethods: "basic-card",
                data: {
                    supportedNetworks: networks,
                    supportedTypes: types
                }
            }
        ]

        const details = {
            total: {
                label: "Total",
                amount: {
                    currency: "USD",
                    value: "100"
                }
            },
            displayItems: [
                {
                    label: "Item 1",
                    amount: {
                        currency: "USD",
                        value: "50"
                    }
                },
                {
                    label: "Item 2",
                    amount: {
                        currency: "USD",
                        value: "50"
                    }
                },
            ]
        }

        try {
            var paymentRequest = new PaymentRequest(supportedInstruments, details)
        } catch (e) {
            error.innerHTML = "PaymentRequest API not supported in this device."
            error.classList.remove("close")
        }

        function buy() {
            paymentRequest.show().then(response => {
                console.log(response)
            })
        }
    </script>
    ```

    * Resize Observer API

    以任何方式调整了注册观察者的元素的大小，都通知观察者。

    ```html
    <body>
        <header>
            <h2>Web APIs<h2>
        </header>
        <div class="web-api-cnt">

            <div class="web-api-card">
                <div class="web-api-card-head">
                    Demo - ResizeObserver
                </div>
                <div class="web-api-card-body">
                    <div id="error" class="close"></div>
                    <div id="stat"></div>

                    <div id="resizeBoxCnt">
                        <div id="resizeBox"></div>
                    </div>

                    <div>
                        <span>Resize Width:<input onchange="resizeWidth(this.value)" type="range" min="0" max="100" value="0" /></span>
                    </div>

                    <div>
                        <span>Resize Height:<input onchange="resizeHeight(this.value)" type="range" min="0" max="100" value="0" /></span>
                    </div>

                </div>
            </div>

        </div>
    </body>

    <script>
        try {
            var resizeObserver = new ResizeObserver(entries => {
                for(const entry of entries) {
                        stat.innerHTML = "Box re-sized. Height:" + entry.target.style.height + " - Width:" + entry.target.style.width
                }
            })
            resizeObserver.observe(resizeBox)
        } catch(e) {
            error.innerHTML = "ResizeObserver API not supported in this device."
            error.classList.remove("close")        
        }

        function resizeWidth(e) {
            resizeBox.style.width = `${e}px`
        }

        function resizeHeight(e) {
            resizeBox.style.height = `${e}px`
        }
    </script>
    ```

    * Pointer Lock API

    对于需要大量的鼠标输入来控制运动，旋转物体，以及更改项目的应用程序来说非常有用。对高度视觉化的应用程序尤其重要，例如那些使用第一人称视角的应用程序，以及 3D 视图和建模。

    requestPointerLock：此方法将从浏览器中删除鼠标并发送鼠标状态事件。这将持续到调用 document.exitPointerLock 为止。

    document.exitPointerLock：此 API 释放鼠标指针锁定并恢复鼠标光标。

    ```html
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <style>
            #box {
                background-color: green;
                width: 100%;
                height: 400px;
                position: relative;
            }

            #ball {
                border-radius: 50%;
                background-color: red;
                width: 50px;
                height: 50px;
                position: absolute;
            }
        </style>
    </head>

    <body>
        <header>
            <h2>Web APIs<h2>
        </header>
        <div class="web-api-cnt">
            <div class="web-api-card">
                <div class="web-api-card-head"> Demo - PointerLock </div>
                <div class="web-api-card-body">
                    <div id="error" class="close"></div>
                    <div id="box">
                        <div id="ball"></div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <script>
        const l = console.log
        box.addEventListener("click", () => {
            if (box.requestPointerLock)
                box.requestPointerLock()
            else {
                error.innerHTML = "PointerLock API not supported in this device."
                error.classList.remove("close")
            }
        })

        document.addEventListener("pointerlockchange", (e) => {
            document.addEventListener("mousemove", (e) => {
                const { movementX, movementY } = e
                ball.style.top = movementX + "px"
                ball.style.left = movementY + "px"
            })
        })
    </script>

    </html>
    ```

### video深入理解

1.  参考链接：

  [「1.4万字」玩转前端 Video 播放器 | 多图预警](https://juejin.im/post/5f0e52fe518825742109d9ee#heading-4)

  [hls.js](https://github.com/video-dev/hls.js)

  [video-hls-encrypt](https://github.com/hauk0101/video-hls-encrypt)

  [flv.js](https://github.com/Bilibili/flv.js/)

  [MediaSource](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaSource)

2.  详解

  * range从服务器端请求特定的范围

    * 单一范围

      request添加header“Range:bytes=0-1023”，服务端返回响应码206 Partial Content，响应Content-Length表示请求范围，响应Content-Range内容在整个资源中所处的位置

    * 多重范围

      request添加“Range: bytes=0-50, 100-150”，会产生2部分的单一范围响应

    * 条件式范围请求

      当重新开始请求更多资源片段的时候，必须确保自从上一个片段被接收之后该资源没有进行过修改。

      If-Range请求首部可以用来生成条件式范围请求：

      请求条件满足：返回状态码为 206 Partial 的响应，以及相应的消息主体

      请求条件不满足：返回状态码为 「200 OK」 的响应，同时返回整个资源

      请求范围越界：返回 416 Requested Range Not Satisfiable 请求的范围无法满足

      If-Range可以与 Last-Modified 或者 ETag 一起使用，但是二者不能同时使用

  * 流媒体

    * 流媒体协议

      ```txt
      HTTP+FLV TCP 用于直播/点播，兼容性好，低延时，保密性不强
      HLS TCP 用于点播，apple支持度高，移动端兼容性好，延时高
      RTMP TCP 用于直播，adobe支持度高，低延迟，有累积延迟
      RTMFP TCP 用于直播，带宽消耗低，数据传输速率高，需flash支持
      RTSP+RTP TCP+UDP 用于IPTV，支持组播，效率较高，存在丢包问题，浏览器不支持
      ```

      * HLS

        HTTP Live Streaming，工作原理是把整个流分成一个个小的基于 HTTP 的文件来下载。

        HLS 是一种自适应比特率流协议，可以动态地使视频分辨率自适应每个人的网络状况。当媒体流正在播放时，客户端可以选择从许多不同的备用源中以不同的速率下载同样的资源，允许流媒体会话适应不同的数据速率。

        HLS 的传输/封装格式是 MPEG-2 TS（MPEG-2 Transport Stream），是一种传输和存储包含视频、音频与通信协议各种数据的标准格式，用于数字电视广播系统，如 DVB、ATSC、IPTV 等等。
        
        可以把多个 TS 文件合并为 mp4 格式的视频文件。视频版权保护，可以考虑使用对称加密算法，如 AES-128 对切片进行对称加密。当客户端进行播放时，先根据 m3u8 文件中配置的密钥服务器地址，获取对称加密的密钥，然后再下载分片，当分片下载完成后再使用匹配的对称加密算法进行解密播放。demo见参考链接3。

        * 特性

          * HLS 将播放使用 H.264 或 HEVC / H.265 编解码器编码的视频。
          * HLS 将播放使用 AAC 或 MP3 编解码器编码的音频。
          * HLS 视频流一般被切成 10 秒的片段。
          * HLS 的传输/封装格式是 MPEG-2 TS。
          * HLS 支持 DRM（数字版权管理）。
          * HLS 支持各种广告标准，例如 VAST 和 VPAID。
          
      * DASH

        Dynamic Adaptive Streaming over HTTP，基于 HTTP 的动态自适应流，一种自适应比特率流技术，使高质量流媒体可以通过传统的 HTTP 网络服务器以互联网传递。

        当内容被 MPEG-DASH 客户端回放时，客户端将根据当前网络条件自动选择下载和播放哪一个备选方案。客户端将选择可及时下载的最高比特率片段进行播放，从而避免播放卡顿或重新缓冲事件。

        DASH 不关心编解码器，因此它可以接受任何编码格式编码的内容，如 H.265、H.264、VP9 等。

        HTML5 不直接支持 MPEG-DASH，通常用于视频播放器(字节跳动-西瓜视频)。

      * FLV

        FLASH Video，文件极小、加载速度极快

        ![flv结构](./flv.png)

        flv.js见参考链接4

        * 特性

          * 支持播放 H.264 + AAC / MP3 编码的 FLV 文件；
          * 支持播放多段分段视频；支持播放 HTTP FLV 低延迟实时流；
          * 支持播放基于 WebSocket 传输的 FLV 实时流；
          * 兼容 Chrome，FireFox，Safari 10，IE11 和 Edge；
          * 极低的开销，支持浏览器的硬件加速。

        * 限制

          * MP3 音频编解码器无法在 IE11/Edge 上运行；
          * HTTP FLV 直播流不支持所有的浏览器。

        * 使用

          ```html
          <script src="flv.min.js"></script>
          <video id="videoElement"></video>
          <script>
              if (flvjs.isSupported()) {
                  var videoElement = document.getElementById('videoElement');
                  var flvPlayer = flvjs.createPlayer({
                      type: 'flv',
                      url: 'http://example.com/flv/video.flv'
                  });
                  flvPlayer.attachMediaElement(videoElement);
                  flvPlayer.load();
                  flvPlayer.play();
              }
          </script>
          ```

        * 工作原理

          将 FLV 文件流转换为 ISO BMFF（Fragmented MP4）片段，然后通过 Media Source Extensions API 将 mp4 段给 HTML5 video

      * MSE API

        媒体源扩展 API（Media Source Extensions） 提供了实现无插件且基于 Web 的流媒体的功能。使用 MSE，媒体串流能够通过 JavaScript 创建，并且能通过使用 audio 和 video 元素进行播放。

        MSE 使我们可以把通常的单个媒体文件的 src 值替换成引用 MediaSource 对象（一个包含即将播放的媒体文件的准备状态等信息的容器），以及引用多个 SourceBuffer 对象（代表多个组成整个串流的不同媒体块）的元素。

        使用方法见参考链接1或参考链接5

    * 多媒体封装格式

      * 封装格式

        AVI、RMVB、MKV、ASF、WMV、MP4、3GP、FLV

      * 视频编码格式

        H.264，HEVC，VP9 和 AV1

      * 音频编码格式

        MP3、AAC 和 Opus

      * 多媒体容器

        MP4，MOV，TS，FLV，MKV

      * 视频播放基本处理流程

        1. 解协议

          从原始的流媒体协议数据中删除信令数据，只保留音视频数据，如采用 RTMP 协议传输的数据，经过解协议后输出 flv 格式的数据。

        2. 解封装

          例如 FLV 格式的数据经过解封装后输出 H.264 编码的视频码流和 AAC 编码的音频码流。

        3. 解码

          视频，音频压缩编码数据，还原成非压缩的视频，音频原始数据，音频的压缩编码标准包括 AAC，MP3，AC-3 等，视频压缩编码标准包含 H.264，MPEG2，VC-1 等经过解码得到非压缩的视频颜色数据如 YUV420P，RGB 和非压缩的音频数据如 PCM 等。
          
        4. 音视频同步

          将同步解码出来的音频和视频数据分别送至系统声卡和显卡播放。

  * 视频本地预览

    URL.createObjectURL()
    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>视频本地预览示例</title>
      </head>
      <body>
        <h3>视频本地预览示例</h3>
        <input type="file" accept="video/*" onchange="loadFile(event)" />
        <video
          id="previewContainer"
          controls
          width="480"
          height="270"
          style="display: none;"
        ></video>

        <script>
          const loadFile = function (event) {
            const reader = new FileReader();
            reader.onload = function () {
              const output = document.querySelector("#previewContainer");
              output.style.display = "block";
              output.src = URL.createObjectURL(new Blob([reader.result]));
            };
            reader.readAsArrayBuffer(event.target.files[0]);
          };
        </script>
      </body>
    </html>
    ```

  * 播放器截图

    CanvasRenderingContext2D.drawImage()
    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>播放器截图示例</title>
      </head>
      <body>
        <h3>播放器截图示例</h3>
        <video id="video" controls="controls" width="460" height="270" crossorigin="anonymous">
          <!-- 请替换为实际视频地址 -->
          <source src="https://xxx.com/vid_159411468092581" />
        </video>
        <button onclick="captureVideo()">截图</button>
        <script>
          let video = document.querySelector("#video");
          let canvas = document.createElement("canvas");
          let img = document.createElement("img");
          img.crossOrigin = "";
          let ctx = canvas.getContext("2d");

          function captureVideo() {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            img.src = canvas.toDataURL();
            document.body.append(img);
          }
        </script>
      </body>
    </html>
    ```

  * Canvas 播放视频

    开发者可以动态地更改每一帧图像的显示内容，如加入弹幕

    ctx.drawImage(video, x, y, width, height)
    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>使用 Canvas 播放视频</title>
      </head>
      <body>
        <h3>使用 Canvas 播放视频</h3>
        <video id="video" controls="controls" style="display: none;">
          <!-- 请替换为实际视频地址 -->
          <source src="https://xxx.com/vid_159411468092581" />
        </video>
        <canvas
          id="myCanvas"
          width="460"
          height="270"
          style="border: 1px solid blue;"
        ></canvas>
        <div>
          <button id="playBtn">播放</button>
          <button id="pauseBtn">暂停</button>
        </div>
        <script>
          const video = document.querySelector("#video");
          const canvas = document.querySelector("#myCanvas");
          const playBtn = document.querySelector("#playBtn");
          const pauseBtn = document.querySelector("#pauseBtn");
          const context = canvas.getContext("2d");
          let timerId = null;

          function draw() {
            if (video.paused || video.ended) return;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            timerId = setTimeout(draw, 0);
          }

          playBtn.addEventListener("click", () => {
            if (!video.paused) return;
            video.play();
            draw();
          });

          pauseBtn.addEventListener("click", () => {
            if (video.paused) return;
            video.pause();
            clearTimeout(timerId);
          });
        </script>
      </body>
    </html>
    ```

  * 色度键控（绿屏效果）

    把被拍摄的人物或物体放置于绿幕的前面，并进行去背后，将其替换成其他的背景。此技术在电影、电视剧及游戏制作中被大量使用，色键也是虚拟摄影棚（Virtual studio）与视觉效果（Visual effects）当中的一个重要环节。

    ```js
    processor.computeFrame = function computeFrame() {
        this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
        let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
        let l = frame.data.length / 4;

        for (let i = 0; i < l; i++) {
          let r = frame.data[i * 4 + 0];
          let g = frame.data[i * 4 + 1];
          let b = frame.data[i * 4 + 2];
          if (g > 100 && r > 100 && b < 43)
            frame.data[i * 4 + 3] = 0;
        }
        this.ctx2.putImageData(frame, 0, 0);
        return;
    }
    ```

### 获取浏览器的唯一标识

1.  参考链接：

  [几个常见面试题，工作中也经常用到](https://mp.weixin.qq.com/s/IvWGkm5pn3vjbLUB-SvXkQ)

2.  详解

  由于不同的系统显卡绘制 canvas 时渲染参数、抗锯齿等算法不同，因此绘制成图片数据的 CRC 校验也不一样。

  绘制 canvas，获取 base64 的 dataurl,对 dataurl 这个字符串进行 md5 摘要计算，得到指纹信息。
  ```js
  function getCanvasFp () {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = '14px Arial'
    ctx.fillStyle = '#ccc'
    ctx.fillText('hello, shanyue', 2, 2)
    return canvas.toDataURL('image/jpeg')
  }
  ```

  可使用fingerprintjs2库,指纹依据信息:canvas/webgl/UserAgent/AudioContext/新式 API 的支持程度
  ```js
  requestIdleCallback(function () {
    Fingerprint2.get((components) => {
      const values = components.map((component) => component.value)
      const fp = Fingerprint2.x64hash128(values.join(''), 31)
    })
  })
  ```
  browser independent component：有些 component 同一设备跨浏览器也可以得到相同的值，有些独立浏览器，得到不同的值
  stable component: 有些 component 刷新后值就会发生变化，称为不稳定组件

### 全部替代一个子串为另一个子串

1.  参考链接：

  [几个常见面试题，工作中也经常用到](https://mp.weixin.qq.com/s/IvWGkm5pn3vjbLUB-SvXkQ)

2.  详解

  * replace+正则

    ```js
    const s = 'foo foo foo'
    s.replce(/foo/g, 'bar')
    ```

  * split+join

    ```js
    'hello. hello. hello. '.split('hello. ').join('A')
    ```

  * es2020 replaceAll

    ```js
    'aabbcc'.replaceAll('b', '.');
    ```

### isNaN和Number.isNaN函数的区别

1. 参考链接：

  [12 道腾讯前端面试真题及答案整理](https://mp.weixin.qq.com/s/mouL2lrCvttHpMwP4iesKw)

2. 详解

  * isNaN:传入任何非数字值均为NaN
  * Number.isNaN:先判断是否数字，再判断NaN

  ```js
  isNaN('a')//true
  Number.isNaN('a')//false
  ```

### three.js基本使用

1. 参考链接：

  [十分钟快速实战Three.js](https://mp.weixin.qq.com/s/CAn2JhweJ4wbJoa1M6ULMw)

2. 详解

* 场景对象

```js
var scene = new THREE.Scene();
```

* 几何对象

```js
var geometry = new THREE.BoxGeometry(200, 200, 200); //创建一个立方体几何对象Geometry
```

* 材质

```js
var material = new THREE.MeshLambertMaterial({
  color: '#f4f4f4',
}); //材质对象Material
```

* 网格模型

```js
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh); //网格模型添加到场景中
```

* 光源

```js
var point = new THREE.PointLight('#fff'); //点光源
point.position.set(300, 100, 200); //点光源位置
scene.add(point); //点光源添加到场景中

var ambient = new THREE.AmbientLight('#333');//环境光
scene.add(ambient); //环境光添加到场景中
```

* 相机

```js
var width = window.innerWidth; //窗口宽度
var height = window.innerHeight; //窗口高度
var k = width / height; //窗口宽高比
var s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
//创建相机对象
var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(200, 300, 200); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
```

* 渲染器对象

```js
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height); //设置渲染区域尺寸
renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
```

* 渲染操作

```js
renderer.render(scene, camera); //指定场景、相机作为参数
document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
```

* 结合

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>three.js小案例</title>
    <style>
      body {
        margin: 0;
        overflow: hidden;
      }
    </style>
    <!--引入three.js-->
    <script src="https://unpkg.com/three@0.122.0/build/three.js"></script>
  </head>

  <body>
  <script>  
      /*
       * 创建场景对象
       */
      var scene = new THREE.Scene();
      /*
       * 创建网格模型
       */
      var geometry = new THREE.BoxGeometry(200, 200, 200); //创建一个立方体几何对象Geometry
      var material = new THREE.MeshLambertMaterial({
        color: '#f4f4f4',
      }); //材质对象Material
      var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      scene.add(mesh); //网格模型添加到场景中
      /*
       * 设置光源
       */
      var point = new THREE.PointLight('#fff'); //点光源
      point.position.set(300, 100, 200); //点光源位置
      scene.add(point); //点光源添加到场景中
      var ambient = new THREE.AmbientLight('#333');//环境光
      scene.add(ambient); //环境光添加到场景中
      /*
       * 设置相机
       */
      var width = window.innerWidth; //窗口宽度
      var height = window.innerHeight; //窗口高度
      var k = width / height; //窗口宽高比
      var s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
      //创建相机对象
      var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
      camera.position.set(200, 300, 200); //设置相机位置
      camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
      /*
       * 创建渲染器对象
       */
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height); //设置渲染区域尺寸
      renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
      /*
       * 执行渲染操作  
       */ 
      renderer.render(scene, camera); //指定场景、相机作为参数
      document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
    </script>
  </body>
</html>
```

### 跨源通信

1. 参考链接：

  [window.postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)

2. 详解

* 与app通信
  ```js
  isAndroid() {
      return window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Adr') > -1;
  }
  isIOS() {
      return !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  }
  try{
      //myFunction为约定的函数名
      if (this.isAndroid()) {
          window.android.myFunction(this.state.data);
      }
      if (this.isIOS()) {
          window.webkit.messageHandlers.myFunction.postMessage(this.state.data);
      }
  }
  catch(e){
      //console.log(e)
  }
  ```

* 跨源通信

  window.postMessage() 方法可以安全地实现跨源通信。

  通常，对于两个不同页面的脚本，只有当执行它们同源时，这两个脚本才能相互通信。window.postMessage() 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。

  兼容性:IE10+

  用法
  ```js
  otherWindow.postMessage(message, targetOrigin, [transfer]);
  ```
  * otherWindow:其他窗口的一个引用,如iframe.contentWindow或window.opener
  * message:数据会自动序列化
  * targetOrigin:"*"（表示无限制）或者一个URI,如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的targetOrigin，而不是\*。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。
  * transfer:可选,是一串和message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

  样例
  ```js
  /*
  * A窗口的域名是<http://example.com:8080>，以下是A窗口的script标签下的代码：
  */

  var popup = window.open(...popup details...);

  // 如果弹出框没有被阻止且加载完成

  // 这行语句没有发送信息出去，即使假设当前页面没有改变location（因为targetOrigin设置不对）
  popup.postMessage("The user is 'bob' and the password is 'secret'", "https://secure.example.net");

  // 假设当前页面没有改变location，这条语句会成功添加message到发送队列中去（targetOrigin设置对了）
  popup.postMessage("hello there!", "http://example.org");

  function receiveMessage(event)
  {
    // 我们能相信信息的发送者吗?  (也许这个发送者和我们最初打开的不是同一个页面).
    if (event.origin !== "http://example.org") return;

    // event.source 是我们通过window.open打开的弹出页面 popup
    // event.data 是 popup发送给当前页面的消息 "hi there yourself!  the secret response is: rheeeeet!"
  }
  window.addEventListener("message", receiveMessage, false);


  /*
  * 弹出页 popup 域名是<http://example.org>，以下是script标签中的代码:
  */

  //当A页面postMessage被调用后，这个function被addEventListener调用
  function receiveMessage(event)
  {
    // 我们能信任信息来源吗？
    if (event.origin !== "http://example.com:8080") return;

    // event.source 就当前弹出页的来源页面
    // event.data 是 "hello there!"

    // 假设你已经验证了所受到信息的origin (任何时候你都应该这样做), 一个很方便的方式就是把event.source
    // 作为回信的对象，并且把event.origin作为targetOrigin
    event.source.postMessage("hi there yourself!  the secret response is: rheeeeet!", event.origin);
  }

  window.addEventListener("message", receiveMessage, false);
  ```

### ChromeBug:FontBoosting

1. 参考链接：

  [Font Boosting](http://www.360doc.com/content/16/0224/12/19291760_536900294.shtml)

  [flexible.js字体大小诡异现象解析及解决方案](https://www.cnblogs.com/axl234/p/5895347.html)

2. 详解

  * 情景

    在dpr为2和3时，原本指定的字体大小是24px，但是最终计算出来的却是53px

  * 原因

    当页面中的标签数量或者文本数量大于某一个值，或者当CSS定义的字体大小落在某个区间时，这个问题才会被触发。而且字体变大后的值也随着原始定义的字体大小而改变。

  * Font Boosting

    Webkit 给移动端浏览器提供的一个特性：当我们在手机上浏览网页时，很可能因为原始页面宽度较大，在手机屏幕上缩小后就看不清其中的文字了。而 Font Boosting 特性在这时会自动将其中的文字字体变大，保证在即不需要左右滑动屏幕，也不需要双击放大屏幕内容的前提下，也可以让人们方便的阅读页面中的文本。

    * 触发条件

      1. viewport width设为默认值
      2. 未给文本元素指定宽高，可通过加max-height解决，比如body * { max-height: 999999px; }
      3. WebKit 中应该有判断如果initial-scale=1时，不触发Font Boosting，可设置如下代码

        ```html
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- 或 -->
        <meta name ="viewport" content ="initial-scale=1, maximum-scale=1, minimum-scale=1">
        ```

    * 实现

      ```C++
      multiplier = Math.max(1, deviceScaleAdjustment * textScalingSlider * systemFontScale * clusterWidth / screenWidth);
      if (originFontSize < 16) {
          computedFontSize = originFontSize * multiplier;
      }
      else if (16 <= originFontSize <= (32 * multiplier - 16)) {
          computedFontSize = (originFontSize / 2) + (16 * multiplier - 8);
      }
      else if (originFontSize > (32 * multiplier - 16)) {
          computedFontSize = originFontSize;
      }
      ```

    * 更多讨论

    [Webkit Bug 84186](https://bugs.webkit.org/show_bug.cgi?id=FontBoosting) Webkit Bugs 上记录的这个问题，最早从 2012 年 4 月份就开始讨论这个问题了，但好像都没有引起我们的任何关注。
    [Chromium's Text Autosizer](https://docs.google.com/document/d/1PPcEwAhXJJ1TQShor29KWB17KJJq7UJOM34oHwYP3Zg) 关于 Font Boosting 最重要的一篇文章，更确切的说是论文。
    [Font boosting in mobile browsers](http://sysmagazine.com/posts/214559/)
    [Font Boosting](http://www.patrickcatanzariti.com/2013/03/font-boosting/) 一个俄国人用英文写的文章。