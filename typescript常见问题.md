# typescript常见问题

## 参考链接

   [TypeScript 入门简单进阶难，梳理下要攻克的重难点](https://mp.weixin.qq.com/s/t_jBDHJ7d9kjoBWDq72wCg)

   [Typescript 中的 interface 和 type 到底有什么区别](https://www.jqhtml.com/24056.html)

   [在网页中使用typescript生成的代码](https://blog.csdn.net/deping_chen/article/details/93467654)

   [一份不可多得的 TS 学习指南（1.8W字）](https://juejin.im/post/6872111128135073806#heading-110)

   [Typescript开发学习总结（附大量代码）](https://juejin.cn/post/6937155970199978014)

   [TypeScript趁早学习提高职场竞争力](https://juejin.cn/post/6950052678927908901)

   [TypeScript 进阶经验总结](https://juejin.cn/post/6953592990770298887)

   [15 张前端高清知识地图，强烈建议收藏](https://juejin.cn/post/6976157870014332935)

   [gulp-typescript](https://github.com/ivogabe/gulp-typescript)

   [Ts高手篇：22个示例深入讲解Ts最晦涩难懂的高级类型工具](https://juejin.cn/post/6994102811218673700)

## 目录

* [tsconfig.json配置样例](#tsconfig.json配置样例)
* [基础类型](#基础类型)
* [引用类型](#引用类型)
* [类型断言](#类型断言)
* [使用webpack打包代码](#使用webpack打包代码)
* [使用gulp打包](#使用gulp打包)
* [结合构建工具](#结合构建工具)
* [typescript打包](#typescript打包)
* [对象书写](#对象书写)
* [接口书写](#接口书写)
* [interface与type区别](#interface与type区别)
* [interface](#interface)
* [extends继承](#extends继承)
* [type](#type)
* [声明合并](#声明合并)
* [交叉类型](#交叉类型)
* [keyof](#keyof)
* [泛型](#泛型)
* [属性相关](#属性相关)
* [类型断言:any大法好](#类型断言:any大法好)
* [函数重载](#函数重载)
* [compiler内部实现的类型](#compiler内部实现的类型)
* [自定义高级类型](#自定义高级类型)

---

### tsconfig.json配置样例

使用tsc --init生成
```json
{
    "include": ["./src/**/*"],               // 定义希望被编译文件所在的目录
    // ** 任意目录
    // * 任意文件
    "exclude": ["./src/hello/**/*"],         // 定义需要排除在外的目录；默认值["node_modules","bower_components","jspm_package"]
    "extends": "./configs/base",             // 定义被继承的配置文件
    "files": ["type.ts","dada.ts"],          // 指定被编译的列表，只有需要编译的文件少时才会用到
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
        "noEmitOnError": true,                 // 当有错误时不生成编译后的文件

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

### 基础类型

```ts
// 字符串类型声明，单引号/双引号不影响类型推断
let str: string = 'Hello World';

// 数字类型声明
let num: number = 120;
// 这些值也是合法的数字类型
let nan: number = NaN;
let max: number = Infinity;
let min: number = -Infinity;

// 布尔类型声明
let not: boolean = false;
// Typescript只对结果进行检查，!0最后得到true，因此不会报错
let yep: boolean = !0;

// symbol类型声明
let key: symbol = Symbol('key');

// never类型不能进行赋值
// 执行console.log(never === undefined)，执行结果为true
let never: never;
// 但即使never === undefined，赋值逻辑仍然会报错
never = undefined;

// unknown
let notSure: unknown = 4;
// void
let unusable: void = undefined;

// 除了never，未开启strictNullChecks时，其他类型变量赋值为null/undefined/void 0不报错
let always: boolean = true;
let isNull: null =  null;
// 不会报错
always = null;
isNull = undefined;

// 字面量
let color: 'red' | 'blue' | 'black';

// any
let d: any = 3;
d = 'jeskson';
```

### 引用类型

```ts
// 数组类型有Array<T>和T[]两种写法
let arr1: Array<number> = [1]
let arr2: number[] = [2]

// 未开启strictNullChecks时，赋值为null/undefined/void 0不报错
let arr3: number[] = null
// 编译时不会报错，运行时报错
arr3.push(1)

// tuple
let x: [string, number];
x = ["hello", 10];

// 元组类型
// 坐标表示
let coordiate: [ number, number ] = [114.256429,22.724147]

// 其他引用数据类型
let date: Date = new Date()
let pattern: RegExp = /\w/gi

// 类型声明在函数中的简单运用
// 函数表达式的写法
function fullName(firstName: string, lastName: string): string {
return firstName + ' ' + lastName
}
// 函数声明式的写法
const sayHello = (fullName: string): void => alert(`Hello, ${ fullName }`)

// 当你不知道函数的返回值，但又不想用any/unknown的时候可以试试这种类型声明的写法，不过不推荐
const sayHey: Function = (fullName: string) => alert(`Hey, ${ fullName }`)

// 赋值给数字不会报错
let one: Object = 1
// 也赋值给数组,但无法使用数组的push方法
let arr: Object = []
// 会报错
arr.push(1)

// 赋值会报错
let two: object = 2

// object作为类型声明时，赋值给对象时不会报错
let obj1: object = {}
let obj2: object = { name: '王五' } 
let Obj3: Object = {}

// 会报错
obj1.name = '张三'
obj1.toString()
obj2.name

// 不会报错
Obj3.name = '李四'
Obj3.toString()

// {} 等同于匿名形式的type
type UserType = { name: string; }

let user: UserType = { name: '李四' }
let data: { name: string; } = { name: '张三' }
```

### 类型断言

变量的类型对于我们来说是很明确的，但是TS编译器却并不清楚，此时，可以通过类型断言来告诉编译器变量的类型
```ts
let someValue: unknown = "jeskson 1024bibi.com";
let strlength: number = (someValue as string).length;
let someValue: unknown = "1024bibi.com";
```

### 使用webpack打包代码

使用命令：npm init -y

使用：cnpm i -D webpack webpack-cli typescript ts-loader

```js
// webpack.config.js
// 引入一个包
const path = require('path');

// webpack中的所有的配置信息都应该写在module.exports中
module.exports = {
    // 指定入口文件
    entry: "./src/index.ts",
    // 指定打包文件所在目录
    output: {
        // 指定打包文件的目录
        path: path.resolve(__dirname, 'dist'),
        // 打包后文件
        filename: "bundle.js"
    },

    // 指定webpack打包时要使用模块
    module: {
        // 指定要加载的规则
        rules: [
            {
                // test指定的是规则生效的文件
                test: /\.ts$/,
                // 要使用的Loader
                use: 'ts-loader',
                // 要排除的文件
                exclude: /node-modules/
            }
        ]
    }
};
```
```json
// tsconfig.json
{
    "compilerOptions": {
        "module": "ES2015",
        "target": "ES2015",
        "strict": true
    }
}
```
```json
// package.json
"scripts": {
    ...
    "bulid": "webpack"
}
```

### 使用gulp打包

npm install --global gulp-cli

npm install gulp@4

npm install gulp-typescript typescript

```js
var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('default', function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'output.js'
        }))
        .pipe(gulp.dest('built/local'));
});
```

```js
var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');  // Requires separate installation

gulp.task('scripts', function() {
    var tsResult = gulp.src('lib/**/*.ts')
        .pipe(ts({
            declaration: true
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest('release/definitions')),
        tsResult.js.pipe(gulp.dest('release/js'))
    ]);
});
```

```js
var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');

var tsProject = ts.createProject({
    declaration: true
});

gulp.task('scripts', function() {
    return gulp.src('lib/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts'], function() {
    gulp.watch('lib/*.ts', ['scripts']);
});
```

```js
var gulp = require('gulp')
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', function() {
    return gulp.src('lib/*.ts')
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(ts({
            // ...
        }))
        .pipe( ... ) // You can use other plugins that also support gulp-sourcemaps
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('dist'));
});
```

gulp3
```js
gulp.src(..)
  .pipe(ts(..))
  .on('error', () => { /* Ignore compiler errors */})
  .pipe(gulp.dest(..))
```

### 结合构建工具

npm i -D webpack webpack-cli webpack-dev-server typescript ts-loader clean-webpack-plugin

* webpack：构建工具webpack
* webpack-cli: webpack的命令行工具
* webpack-dev-server: webpack 的开发服务器
* typescript: ts编译器

```js
// webpack.config.js

// 引入html插件
const HTMLWebpackPlugiin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

// 配置webpack插件
plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
        title: "这是一个自定义title"
    }), // 自动的生成html文件
]

// 用来设置引用模块
resolve: {
    extensions: ['.ts', '.js']
}
```
```json
// package.json
"script": {
    ...
    "start": "webpack serve --open chrome.exe"
},
```

cnpm i -D @babel/core @babel/preset-env babel-loader core-js
```js
// 指定webpack打包时要使用模块
module: {
    // 指定要加载的规则
    rules: [
        {
            // test指定的是规则生效的文件
            test: /\.ts$/,
            // 要使用的Loader
            use: [
                {
                    loader: "babel-loader",
                    // 设置babel
                    options: {
                        presets: [
                            [
                                // 指定环境的插件
                                "@babel/preset-env",
                                // 配置信息
                                {
                                    targets: {
                                        "chrome":"88"
                                    }
                                    "corejs": "3",
                                    // 使用corejs的方式 usage表示按需加载
                                    "useBuiltIns":"usage"
                                }
                            ]
                        ]
                    }
                }
                
                'ts-loader'
            ]
            // 要排除的文件
            exclude: /node-modules/
        }
    ]
}
```

### typescript打包

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    optimization:{
        minimize: false // 关闭代码压缩，可选
    },

    entry: "./src/index.ts",

    devtool: "inline-source-map",

    devServer: {
        contentBase: './dist'
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        environment: {
            arrowFunction: false // 关闭webpack的箭头函数，可选
        }
    },

    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader"     
                },
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title:'TS测试'
        }),
    ]
}
```

### 对象书写

```ts
class Dog {
    name: string;
    age: number;

    // constructor 被称为构造函数
    // 构造函数会在对象创建时调用
    constructor(name: string, age: number) {
        // 在实例方法中，this就表示当前的实例
        // 在构造函数中当前对象就是当前新建的那个对象
        // 可以通过this向新建的对象中添加属性
        this.name = name;
        this.age = age;
    }
    bark() {
        alert('1024bibi.com');
        // 在方法中可以通过this来表示当前调用方法的对象
        console.log(this.name);
    }
}
class Dog extends Animal{
    age: number,
    constructor(name: string, age: number){
        // 如果在子类中写了构造函数，在子类构造函数中必须对父类引用
        super(name); // 调用父类的构造函数
        this.age = age;
    }
    sayHello() {
        // 在类的方法中 super 就表示当前类的父类
        // super.sayHello();
    }
}
abstract class Animal{
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    // 定义一个抽象方法
    // 抽象方法使用abstract开头，没有方法体
    // 抽象方法只能定义在抽象类中，子类必须对抽象方法进行重写
    abstract sayHello():void;
}
```

### 接口书写

```js
interface myInter{
    name: string;
    sayHello(): void;
}
// 定义类时，可以使类去实现一个接口
// 实现接口就是使类满足接口的要求
class MyClass implements myInter {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayHello(){
        // 接口就是就类的限制，定义规范
    }
}
```

### interface与type区别

* 共同点

    1. 都可以描述一个对象或者函数
    2. 都允许拓展（extends）

* type 可以而 interface 不行

    type 可以声明基本类型别名，联合类型，元组等类型

* interface 可以而 type 不行

    interface 能够声明合并

### interface

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

### extends继承

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

### type

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

类型别名

```ts
type Props = TextProps
```

### 声明合并

```ts
interface Point {
    x: number;
}
interface Point {
    y: number;
}

const point: Point = { x: 1, y: 2 };
```

### 交叉类型

```ts
interface TA {
    a: string;
    b: string;
}

type TB = {
    b: number;
    c: number[];
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

```ts
type Form1Type = { name: string; } & { gender: number; }
// 等于 type Form1Type = { name: string; gender: number; }
type Form2Type = { name: string; } | { gender: number; }
// 等于 type Form2Type = { name?: string; gender?: number; }

let form1: Form1Type = { name: '王五' } // 提示缺少gender参数
let form2: Form2Type = { name: '刘六' } // 验证通过


type Form3Type = { name: string; } & { name?: string; gender: number; }
// 等于 type Form3Type = { name: string; gender: number; }
type Form4Type = { name: string; } | { name?: string; gender: number; }
// 等于 type Form4Type = { name?: string; gender: number; }

let form3: Form3Type = { gender: 1 } // 提示缺少name参数
let form4: Form4Type = { gender: 1 } // 验证通过


type Form5Type = { name: string; } & { name?: number; gender: number; }
// 等于 type Form5Type = { name: never; gender: number; }
type Form6Type = { name: string; } | { name?: number; gender: number; }
// 等于 type Form6Type = { name?: string | number; gender: number; }

let form5: Form5Type = { name: '张三', gender: 1 } // 提示name的类型为never，不能进行赋值
let form6: Form6Type = { name: '张三', gender: 1 } // 验证通过
```

### keyof

是索引类型操作符,用来获取类型

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

```ts
interface Person {
    name: string
    age: number
}

type PersonKey = keyof Person // "name" | "age"
```

### 泛型

(不能应用于类的静态成员)不预先确定的数据类型，具体的类型在使用的时候再确定的一种类型约束规范

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

### 属性相关

* typeof 是获取一个对象/实例的类型

* extends 主要作用是添加泛型约束

* NonNullable<T> 从T中除去undefined null

* Parameters 获取函数的参数类型，将每个参数类型放在一个元组中。

```ts
/**
 * @desc 具体实现
 */
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

/**
 * @example
 * type Eg = [arg1: string, arg2: number];
 */
type Eg = Parameters<(arg1: string, arg2: number) => void>;
```
* inter关键词作用是让Ts自己推导类型，并将推导结果存储在其参数绑定的类型上。只能在extends条件类型上使用。

```ts
/**
 * 约束参数T为数组类型，
 * 判断T是否为数组，如果是数组类型则推导数组元素的类型
 */
type FalttenArray<T extends Array<any>> = T extends Array<infer P> ? P : never;

/**
 * type Eg1 = number | string;
 */
type Eg1 = FalttenArray<[number, string]>
/**
 * type Eg2 = 1 | 'asd';
 */
type Eg2 = FalttenArray<[1, 'asd']>
```

* ReturnType<T> 获取函数的返回值类型

```ts
/**
 * @desc ReturnType的实现其实和Parameters的基本一样
 * 无非是使用infer R的位置不一样。
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

* ConstructorParameters 可以获取类的构造函数的参数类型，存在一个元组中。

```ts
/**
 * 核心实现还是利用infer进行推导构造函数的参数类型
 */
type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : never;


/**
 * @example
 * type Eg = string;
 */
interface ErrorConstructor {
  new(message?: string): Error;
  (message?: string): Error;
  readonly prototype: Error;
}
type Eg = ConstructorParameters<ErrorConstructor>;

/**
 * @example
 * type Eg2 = [name: string, sex?: number];
 */
class People {
  constructor(public name: string, sex?: number) {}
}
type Eg2 = ConstructorParameters<typeof People>
```

* Partial 将某个类型里的属性全部变为可选项

```ts
// 实现：全部变可选
type Partial<T> = {
    [P in keyof T]?: T[P]
}

interface Animal {
    canFly: boolean
    canSwim: boolean
}

// 变可选，可以只赋值部分属性
let animal: Partial<Animal> = {
    canFly: false,
}
```

* Required 传入的属性变为必选项

```ts
// 实现：全部变必选
type Required<T> = {
    [P in keyof T]-?: T[P]
}
interface Person {
    name?: string
    age?: number
}

// Property 'age' is missing in type '{ name: string; }' but required in type 'Required<Person>'.
let person: Required<Person> = {
    name: 'jacky',
    // 没写 age 属性会提示错误
}
```

* Readonly 属性变为只读选项

```ts
// 实现：全部变只读
type Readonly<T> = {
    readonly [P in keyof T]: T[P]
}

interface Person {
    name: string
    age: number
}

let person: Readonly<Person> = {
    name: 'jacky',
    age: 24,
}
person.name = 'jack' // Cannot assign to 'name' because it is a read-only property.
```

* Record 将 K 中所有的属性的值转化为 T 类型

```ts
// 实现：K 中所有属性值转化为 T 类型
type Record<K extends keyof any, T> = {
    [P in K]: T
}

interface DatabaseInfo {
    id: string
}

type DataSource = 'user' | 'detail' | 'list'

const x: Record<DataSource, DatabaseInfo> = {
    user: { id: '1' },
    detail: { id: '2' },
    list: { id: '3' },
}
```

* Pick 从 T 中取出 一系列 K 的属性

```ts
// 实现：通过从Type中选择属性Keys的集合来构造类型
type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}

interface Animal {
    canFly: boolean
    canSwim: boolean
}

let person: Pick<Animal, 'canSwim'> = {
    canSwim: true,
}
```

* Exclude 将某个类型中属于另一个的类型移除掉

```ts
// 实现：如果 T 中的类型在 U 不存在，则返回，否则不返回
type Exclude<T, U> = T extends U ? never : T

interface Programmer {
    name: string
    age: number
    isWork: boolean
    isStudy: boolean
}

interface Student {
    name: string
    age: number
    isStudy: boolean
}

type ExcludeKeys = Exclude<keyof Programmer, keyof Student>
// type ExcludeKeys = "isWork"
```

* Extract 从 T 中提取出 U

```ts
/**
* Extract from T those types that are assignable to U
*/
type Extract<T, U> = T extends U ? T : never;
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">; // -> 'a' | 'c'
```

* Omit:Pick 和 Exclude 进行组合, 实现忽略对象某些属性功能

```ts
// 实现：去除类型 T 中包含 K 的键值对。
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

interface Animal {
    canFly: boolean
    canSwim: boolean
}

let person1: Pick<Animal, 'canSwim'> = {
    canSwim: true,
}

let person2: Omit<Animal, 'canFly'> = {
    canSwim: true,
}
```

* ReturnType 获取函数返回值类型

```ts
// 实现：获取 T 类型(函数)对应的返回值类型
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any

function bar(x: string | number): string | number {
    return 'hello'
}
type FooType = ReturnType<typeof bar> // string | number
```

### 类型断言:any大法好

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

### 函数重载

tsconfig.json
```json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

```ts
declare function test(a: number): number;
declare function test(a: string): string;

const resS = test("Hello World"); // resS 被推断出类型为 string；
const resN = test(1234); // resN 被推断出类型为 number;
```

### 装饰器

```ts
function f() {
    console.log("f(): evaluated");
    return function (target:any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    }
}

function g() {
    console.log("g(): evaluated");
    return function (target:any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("g(): called");
    }
}

class C {
    @f()
    @g()
    method() {}
}

// f(): evaluated
// g(): evaluated
// g(): called
// f(): called

@sealed
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
        newProperty = "new property";
        hello = "override";
    }
}

@classDecorator
class Greeter2 {
    property = "property";
    hello: string;
    constructor(m: string) {
        this.hello = m;
    }
}

console.log(new Greeter("world"));

class Greeter3 {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }

    @enumerable(false)
    greet() {
        return "Hello, " + this.greeting;
    }
}

function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}

class Point2 {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    @configurable(false)
    get x() { return this._x; }

    @configurable(false)
    get y() { return this._y; }
}

function configurable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };
}
```

### compiler内部实现的类型

* Uppercase

```ts
/**
 * @desc 构造一个将字符串转大写的类型
 * @example
 * type Eg1 = 'ABCD';
 */
type Eg1 = Uppercase<'abcd'>;
```

* Lowercase

```ts
/**
 * @desc 构造一个将字符串转小大写的类型
 * @example
 * type Eg2 = 'abcd';
 */
type Eg2 = Lowercase<'ABCD'>;
```

* Capitalize

```ts
/**
 * @desc 构造一个将字符串首字符转大写的类型
 * @example
 * type Eg3 = 'abcd';
 */
type Eg3 = Capitalize<'Abcd'>;
```

* Uncapitalize

```ts
/**
 * @desc 构造一个将字符串首字符转小写的类型
 * @example
 * type Eg4 = 'ABCD';
 */
type Eg4 = Uncapitalize<'aBCD'>;
```

### 自定义高级类型

* SymmetricDifference

获取没有同时存在于T和U内的类型。

```ts
/**
 * SetDifference的实现和Exclude一样
 */
type SymmetricDifference<T, U> = Exclude<T | U, T & U>;

/**
 * @example
 * type Eg = '1' | '4';
 */
type Eg = SymmetricDifference<'1' | '2' | '3', '2' | '3' | '4'>

```

* FunctionKeys

获取T中所有类型为函数的key组成的联合类型。

```ts
/**
 * @desc NonUndefined判断T是否为undefined
 */
type NonUndefined<T> = T extends undefined ? never : T;

/**
 * @desc 核心实现
 */
type FunctionKeys<T extends object> = {
  [K in keyof T]: NonUndefined<T[K]> extends Function ? K : never;
}[keyof T];

/**
 * @example
 * type Eg = 'key2' | 'key3';
 */
type AType = {
    key1: string,
    key2: () => void,
    key3: Function,
};
type Eg = FunctionKeys<AType>;
```

工厂实现
```ts
type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;

/**
 * @desc 用于创建获取指定类型工具的类型工厂
 * @param T 待提取的类型
 * @param P 要创建的类型
 * @param IsCheckNon 是否要进行null和undefined检查
 */
type KeysFactory<T, P extends Primitive | Function | object, IsCheckNon extends boolean> = {
  [K in keyof T]: IsCheckNon extends true
    ? (NonUndefined<T[K]> extends P ? K : never)
    : (T[K] extends P ? K : never);
}[keyof T];

/**
 * @example
 * 例如上述KeysFactory就可以通过工厂类型进行创建了
 */
type FunctionKeys<T> = KeysFactory<T, Function, true>;
type StringKeys<T> = KeysFactory<T, string, true>;
type NumberKeys<T> = KeysFactory<T, string, true>;
```

* MutableKeys

查找T所有可选类型的key组成的联合类型。

```ts
/**
 * 核心实现
 */
type MutableKeys<T extends object> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >;
}[keyof T];

/**
 * @desc 一个辅助类型，判断X和Y是否类型相同，
 * @returns 是则返回A，否则返回B
 */
type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? A
  : B;
```

* OptionalKeys

提取T中所有可选类型的key组成的联合类型。

```ts
type OptionalKeys<T> = {
  [P in keyof T]: {} extends Pick<T, P> ? P : never
}[keyof T];

type Eg = OptionalKeys<{key1?: string, key2: number}>
// Eg2 = false
type Eg2 = {} extends {key1: string} ? true : false;
// Eg3 = true
type Eg3 = {} extends {key1?: string} ? true : false;
```

* 增强Pick

PickByValue提取指定值的类型
```ts
// 辅助函数，用于获取T中类型不能never的key组成的联合类型
type TypeKeys<T> = T[keyof T];

/**
 * 核心实现
 */
type PickByValue<T, V> = Pick<T,
  TypeKeys<{[P in keyof T]: T[P] extends V ? P : never}>
>;

/**
 * @example
 *  type Eg = {
 *    key1: number;
 *    key3: number;
 *  }
 */
type Eg = PickByValue<{key1: number, key2: string, key3: number}, number>;
```

PickByValueExact精准的提取指定值的类型
```ts
/**
 * 核心实现
 */
type PickByValueExact<T, V> = Pick<T,
  TypeKeys<{[P in keyof T]: [T[P]] extends [V]
    ? ([V] extends [T[P]] ? P : never)
    : never;
  }>
>

// type Eg1 = { b: number };
type Eg1 = PickByValueExact<{a: string, b: number}, number>
// type Eg2 = { b: number; c: number | undefined }
type Eg2 = PickByValueExact<{a: string, b: number, c: number | undefined}, number>
```

* Intersection

从T中提取存在于U中的key和对应的类型

```ts
/**
 * 核心思路利用Pick提取指定的key组成的类型
 */
type Intersection<T extends object, U extends object> = Pick<T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>

type Eg = Intersection<{key1: string}, {key1:string, key2: number}>
```

* Diff

从T中排除存在于U中的key和类型

```ts
type Diff<T extends object, U extends object> = Pick<
  T,
  Exclude<keyof T, keyof U>
>;
```

* Overwrite

从U中的同名属性的类型覆盖T中的同名属性类型

```ts
/**
 * Overwrite实现
 * 获取前者独有的key和类型，再取两者共有的key和该key在后者中的类型，最后合并。
 */
type Overwrite<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T>
> = Pick<I, keyof I>;

/**
 * @example
 * type Eg1 = { key1: number; }
 */
type Eg1 = Overwrite<{key1: string}, {key1: number, other: boolean}>
```

* Assign

类似于Object.assign()合并

```ts
// 实现
type Assign<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T> & Diff<U, T>
> = Pick<I, keyof I>;

/**
 * @example
 * type Eg = {
 *   name: string;
 *   age: string;
 *   other: string;
 * }
 */
type Eg = Assign<
  { name: string; age: number; },
  { age: string; other: string; }
>;
```

* DeepRequired

将T的转换成必须属性

```ts
/**
 * DeepRequired实现
 */
type DeepRequired<T> = T extends (...args: any[]) => any
  ? T
  : T extends Array<any>
    ? _DeepRequiredArray<T[number]>
    : T extends object
      ? _DeepRequiredObject<T>
      : T;

// 辅助工具，递归遍历数组将每一项转换成必选
interface _DeepRequiredArray<T> extends Array<DeepRequired<NonUndefined<T>>> {}

// 辅助工具，递归遍历对象将每一项转换成必选
type _DeepRequiredObject<T extends object> = {
  [P in keyof T]-?: DeepRequired<NonUndefined<T[P]>>
}
```

* DeepReadonlyArray

将T的转换成只读的

```ts
/**
 * DeepReadonly实现
 */
type DeepReadonly<T> = T extends ((...args: any[]) => any) | Primitive
  ? T
  : T extends _DeepReadonlyArray<infer U>
  ? _DeepReadonlyArray<U>
  : T extends _DeepReadonlyObject<infer V>
  ? _DeepReadonlyObject<V>
  : T;

/**
 * 工具类型，构造一个只读数组
 */
interface _DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

/**
 * 工具类型，构造一个只读对象
 */
type _DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
```

* UnionToIntersection

将联合类型转变成交叉类型

```ts
type UnionToIntersection<T> = (T extends any
  ? (arg: T) => void
  : never
) extends (arg: infer U) => void ? U : never
type Eg = UnionToIntersection<{ key1: string } | { key2: number }>
```

