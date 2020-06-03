# angular 简结

- [angular 项目结构](#angular项目结构)
- [angular 自带属性和指令与装饰器](#angular自带属性和指令与装饰器)
- [angular 命令](#angular命令)
- [angular 自定义属性指令 directive](#angular自定义属性指令directive)
- [angular 生命周期](#angular生命周期)
- [angular 双向数据绑定原理](#angular双向数据绑定原理)
- [请求后台资源](#请求后台资源rxjs与axios)
- [angular 路由](#angular路由与鉴权)
- [父子组件通信](#父子组件通信)
- [组件间通信 service 依赖注入](#组件间通信service依赖注入)
- [页面传参与获取](#页面传参与获取)
- [使用 cookie](#使用cookie)
- [宿主事件监听器](#宿主事件监听器)
- [请求响应拦截](#请求响应拦截)
- [rxjs](#rxjs)
- [引入外部 js](#引入外部js)
- [结构指令和属性指令](#结构指令和属性指令)
- [组件中的声明和提供与导入](#组件中的声明和提供与导入)
- [构建块](#构建块)
- [组件和指令的区别](#组件和指令的区别)
- [ngBootstrap](#ngBootstrap)
- [路由守卫](#路由守卫)

## angular 项目结构

- e2e 文件夹：end to end，测试目录，主要用于集成测试。
- node_modules：项目的模块依赖目录。
- src：项目的源代码。
  - app：项目的主组件目录。
    - components：组件。
    - directives：自定义指令。
    - modules：自定义模块。
    - pages：页面。
    - services：服务。
    - app-routing.module.ts：组件路由配置文件。
    - app.component.css：组件私有 css 样式文件。
    - app.component.html：组件的模板文件。
    - app.component.spec.ts：组件的单元测试文件。
    - app.compenent.ts：组件 typescript 配置文件。
    - app.module.ts：组件模型配置文件。
  - assets：项目的资源目录。
  - environments：项目的环境配置目录
  - index.html：主页面。
  - karma.conf.js：karma 测试的配置文件。
  - main.ts：脚本入口文件。
  - polyfills.ts：兼容性检测配置文件。
  - style.css：全局 css 样式文件。
  - test.ts：单元测试入口文件。
- .editorconfig：编辑器配置文件。
- .gitignore: git 版本控制时忽略的文件（此文件中配置的文件不纳入版本控制）。
- .angular.json：angular 配置文件。
- .package-lock.json：锁定项目依赖模块的版本号。
- .package.json：配置项目依赖模块。
- .README.md：项目说明文件
- .tsconfig.json：typescript 配置文件。
- .tslint.json：typescript 代码检测配置文件。

- 构建块：组件、模板、元数据、数据绑定、指令、服务、依赖注入

## angular 自带属性和指令与装饰器

- 条件判断 \*ngIf="..."
- 显示隐藏 [hidden]=""
- 循环 \*ngFor="let i of/in is"
  - for in 遍历的是数组的索引（即键名），而 for of 遍历的是数组元素值。
  - 带索引：
  ```html
  <div *ngFor="let hero of heroes; let i=index">{{i + 1}} - {{hero.name}}</div>
  ```
- NgSwitch

```html
<div [ngSwitch]="hero?.emotion">
  <app-happy-hero *ngSwitchCase="'happy'" [hero]="hero"></app-happy-hero>
  <app-sad-hero *ngSwitchCase="'sad'" [hero]="hero"></app-sad-hero>
  <app-confused-hero
    *ngSwitchCase="'app-confused'"
    [hero]="hero"
  ></app-confused-hero>
  <app-unknown-hero *ngSwitchDefault [hero]="hero"></app-unknown-hero>
</div>
```

- 数据双向绑定 [(ngModel)]="..."

  需导入 FormsModule，配合@Input()使用

- 点击事件 (click)="..."
- 属性绑定 [id]="id" [title]="msg"
- a 路由跳转 routerLink="..."
- 模板引用变量 #var
- 管道 |
- [ngClass]、[ngStyle]

```html
public flag=false;
<div [ngClass]="{'red': flag, 'blue': !flag}">
  这是一个 div
</div>
public attr='red';
<div [ngStyle]="{'background-color':attr}">你好 ngStyle</div>
```

- 装饰器负责把元数据附加到类上

  常用装饰器：@Component,@Input,@Output,@Directive,@viewChildren,@HostListener,@Injectable

## angular 命令

- 创建新项目：ng new {项目名}
  本地浏览：ng serve ,后面加上--open 可自动打开浏览器
- 生成服务器文件：ng build
- 生成组件：ng generate component {(路径/)组件名} ,后面加上--inline-style，CLI 就会定义一个空的 styles 数组
- 生成服务：ng generate service {(路径/)服务名} ,后面加上--module=app 让 CLI 自动把它提供给 AppModule
- 生成模块：ng generate module {(路径/)模块名}, 后面加上--flat 会把这个文件放进了 src/app 中，而不是单独的目录中, 加上--module=app 告诉 CLI 把它注册到 AppModule 的 imports 数组中。
- 生成类：ng generate class {(路径/)类名}
- 生成指令：ng generate directive {(路径/)名称}
- 测试：ng test

  其中 generate 可省略为 g

## angular 自定义属性指令 directive

directive 可以对 DOM 元素添加行为，且可以添加多个，但它没有 view

```ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
selector: '[appHighlight]'
})
export class HighlightDirective {

constructor(private el: ElementRef) { }

@Input('appHighlight') highlightColor: string;

@HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || 'red');
}

@HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
}

private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
}
```

## angular 生命周期

- ngOnInit() 用于初始化属性，ajax
- ngOnChanges() 用于监听组件传值变化、绑定数据变化，!!注意：首次调用一定会发生在 ngOnInit()之前，整个输入对象改变才能触发，只改变对象属性值不能触发
- ngDoCheck() 发生 Angular 无法或不愿意自己检测的变化时作出反应。脏检查触发，触发场景多不建议用。
- ngAfterContentInit() 当父组件向子组件投影内容的时.在子组件内会初始化父组件的投影内容,此时会调用
- ngAfterContentChecked() 当父组件向子组件的投影内容发生改变时会调用
- ngAfterViewInit() 可 dom 操作
- ngAfterViewChecked() 初始化完组件视图及其子视图之后调用
- ngOnDestroy() 每次销毁指令/组件之前调用

## angular 双向数据绑定原理

Angular 通过脏检测来进行双向数据绑定，在\$digest cycle 流程里面，会从 rootscope 开始遍历，检查每个元素绑定的 watcher。

Angular 只有指定事件触发，才会进入\$digest cycle：

- DOM 事件，比如用户输入文本，点击按钮等.
- ajax 事件
- 浏览器 location 变更事件
- Timer 事件($timeout,$interval)
- 执行$scope.$digest();或$scope.$apply()

## 请求后台资源 rxjs 与 axios

- rxjs 是一种针对异步数据流的编程，它将一切数据，包括 HTTP 请求，DOM 事件或者普通数据等包装成流的形式，使你能以同步编程的方式处理异步数据。

  - 异步处理数据

  ```ts
  let stream = new Observable < any > (observer = >{
      let count = 0;
      setInterval(() = >{
          observer.next(count++);
      },
      1000);
  });
  stream.filter(val = >val % 2 == 0).subscribe(value => console.log("filter>" + value));
  stream.map(value = >{
      return value * value
  }).subscribe(value = >console.log("map>" + value));
  ```

  - 请求数据

  ```js
  import {HttpClient} from "@angular/common/http";

  constructor(public http:HttpClient) { }

  //get
  var api = "http://a.itying.com/api/productlist";
  this.http.get(api).subscribe(response => {console.log(response);});

  //post
  doLogin() {
      // 手动设置请求类型
      const httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          })
      };
      var api = "http://127.0.0.1:3000/doLogin";

      this.http.post(api, {
          username: '张三',
          age: '20'
      },httpOptions).subscribe(response = >{
          console.log(response);
      });
  }

  //jsonp
  this.http.jsonp(api,'callback').subscribe(response => {console.log(response); });
  ```

- axios

```ts
axios
  .get("/user?ID=12345")
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error console.log(error);
  })
  .then(function () {
    // always executed
  });
```

## angular 路由与鉴权

- 路由与子路由

```ts
const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" }, //路径为空
  { path: "home", component: HomeComponent },
  {
    path: "product/:id",
    component: ProductComponent,
    children: [
      { path: "", component: ProductDescComponent },
      { path: "seller/:id", component: SellerInfoComponent },
    ],
  },
  { path: "**", component: Code404Component },
];
```

- 路由守卫

```ts
const routes: Routes = [
  {
    path: '**', component: ***,
    canActivate: [LoginGuard],//进入守卫
    canDeactivate: [UnsaveGuard]//离开守卫
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoginGuard,UnsaveGuard]
})
export class AppRoutingModule { }
```

```ts
import { CanActivate } from "@angular/router";
export class LoginGuard implements CanActivate {
  canActivate() {
    let loggedIn: boolean = Math.random() < 0.5;
    if (!loggedIn) {
      console.log("用户未登录");
    }
    return loggedIn;
  }
}
```

```js
import { CanDeactivate } from "@angular/router";
import { ProductComponent } from "../product/product.component";

export class UnsaveGuard implements CanDeactivate<ProductComponent> {
  //第一个参数 范型类型的组件
  //根据当前要保护组件 的状态 判断当前用户是否能够离开
  canDeactivate(component: ProductComponent) {
    return window.confirm("你还没有保存，确定要离开吗？");
  }
}
```

## 父子组件通信

子组件

```html
<h1>{{childTitle}}</h1>
```

```ts
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-child",
  templateUrl: "./child.component.html",
  styleUrls: ["./child.component.sass"],
})
export class ChildComponent implements OnInit {
  private _childTitle: string = "子组件标题";

  //用于供父组件读写
  @Input()
  set childTitle(childTitle: string) {
    this._childTitle = childTitle;
  }
  get childTitle(): string {
    return this._childTitle;
  }
  //向父组件发送事件
  @Output()
  initEmit = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {
    this.initEmit.emit("子组件初始化成功");
  }

  childPrint() {
    alert("来自子组件的打印");
  }
}
```

父组件

```html
<p>
  parent-and-child works!
</p>
<!--父组件调用子组件的方法，接收事件-->
<app-child
  childTitle="可设置子组件标题"
  (initEmit)="accept($event)"
  #child
></app-child>
<button (click)="child.childPrint()"></button>
```

```ts
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-parent",
  templateUrl: "./parent-and-child.component.html",
  styleUrls: ["./parent-and-child.component.sass"],
})
export class ParentAndChildComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  accept(msg: string) {
    console.log(msg);
  }
}
```

## 组件间通信 service 依赖注入

- 服务

```ts
import { Component, Injectable, EventEmitter } from "@angular/core";
@Injectable()
export class myService {
  public info: string = "";
  constructor() {}
}
```

- 组件 1

```ts
<p>child1 work</p>
<button (click)="showInfo()"></button>
import { Component, OnInit} from '@angular/core';
import { myService } from '../../../service/myService..service';

@Component({
  selector: 'app-child',
  templateUrl: './child1.component.html',
  styleUrls: ['./child1.component.sass']
})
export class Child1Component implements OnInit {

  constructor(
    public service: myService
  ) { }

  ngOnInit() {

  }
  showInfo() {
    alert(this.service.info);
  }
}
```

- 组件 2

```ts
<p>child2 works!</p>
<button (click)="changeInfo()"></button>
import { Component, OnInit} from '@angular/core';
import { myService } from '../../service/myService..service';

@Component({
  selector: 'app-child2',
  templateUrl: './child2.component.html',
  styleUrls: ['./child2.component.sass']
})
export class Child2Component implements OnInit {

  constructor(
    public service: myService
  ) { }

  ngOnInit() {

  }
  changeInfo() {
    this.service.info = this.service.info + "1234";
  }
}
```

## 页面传参与获取

- 使用 routerLink 跳转

```html
<a routerLink=["/exampledetail",id]></a>url为/exampledetail/id，使用snapshot.params获取参数
<a routerLink=["/exampledetail",{queryParams:object}] ></a>url为/exampledetail?...=...&...，使用snapshot.queryParams获取参数
```

- 使用 navigate 跳转

```ts
this.router.navigate(['user', 1]);//使用snapshot.params
以根路由为起点跳转

this.router.navigate(['user', 1],{relativeTo: route});
默认值为根路由，设置后相对当前路由跳转，route是ActivatedRoute的实例，使用需要导入ActivatedRoute

this.router.navigate(['user', 1],{ queryParams: {id: '1',status: true});//使用snapshot.queryParams
路由中传参数 /user/1?id=1

this.router.navigate(['user', 1],{ queryParams: {id: '1',status: true},skipLocationChange: true });
路由中传参数同上,但url不会变化

this.router.navigate(['user', 1],{ fragment: 'top' });
路由中锚点跳转 /user/1#top
```

- 获取参数

  - snapshot

  ```ts
  import { ActivatedRoute } from '@angular/router';
  constructor( public activatedRoute: ActivatedRoute ) { };
  ngOnInit(){
      this.id= this.activatedRoute.snapshot.params['id'];
  };
  ```

  - queryParams

  ```ts
  id: number = 0;
  status: boolean = false;
  ngOnInit() {
      this.route.queryParams
      .subscribe((params: Params) => {
          this.id = params['id'];
          this.status = params['status'];
      })
  }
  ```

- 注意

  跟 vue 不同无法通过 router.push 做到既传参数，url 又不显示参数

## 使用 cookie

1. npm install ngx-cookie-service
2. 根模块引入

```ts
import { CookieService } from "ngx-cookie-service";
providers: [CookieService];
```

3. 子模块使用

```ts
import { CookieService } from 'ngx-cookie-service';
constructor( private cookieService: CookieService ) { }
ngOnInit() {
    this.cookieService.set( name, value, time );
    this.cookieService.get( name );
}
```

## 宿主事件监听器

当宿主元素发出特定的事件时，Angular 就会执行所提供的处理器方法，并使用其结果更新所绑定到的元素。 如果该事件处理器返回 false，则在所绑定的元素上执行 preventDefault。

屏幕滚动监听

```ts
public isScollDown : boolean = false;
@HostListener('window:scroll', ['$event'])
public onScroll = (e) => {
    if(document.documentElement.scrollTop > 252){
        this.isScollDown = true;
    }
}
```

## 请求响应拦截

1. http 拦截器

实现 HttpInterceptor 接口

```ts
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/internal/operators";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";

import { AuthService } from "./../app.service";
import { environment } from "src/environments/environment";

/** Pass untouched request through to the next request handler. */
@Injectable()
export class MyInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AppService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // 获取本地存储的token值，
    const authToken = this.authService.getAuthorizationToken();
    // 若token存在，则对请求添加请求头
    // 并格式化处理url地址，简化service中接口地址的编辑
    if (authToken) {
      const authReq = req.clone({
        headers: req.headers.set("Authorization", "bearer" + authToken),
        url: environment.api_endpoint + req.url,
      });
      return (
        next
          // 返回处理后的请求
          .handle(authReq)
          // 返回结果错误处理
          .pipe(catchError((error) => this.auth.handleError(error)))
      );
    }
    // 若token不存在，则不对请求进行处理
    return next
      .handle(req)
      .pipe(catchError((err: HttpErrorResponse) => this.handleData(err)));
  }

  private handleData(
    res: HttpResponse<any> | HttpErrorResponse
  ): Observable<any> {
    // 业务处理：一些通用操作
    switch (res.status) {
      case 401:
        console.log("not login");
        this.router.navigate(["/"]);
        return of(res);
        break;
      default:
    }
    return throwError(res);
  }
}
```

在 app.module.ts 中 provide

```ts
providers: [
{provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi:true}
],
```

2. axios 拦截器

在 angular-cli 项目的 src/ 文件夹下新建一个文件夹为 plugins，然后在 plugins/ 下新建 config.js 文件，写入如下代码

```ts
import axios from 'axios';//引入axios依赖

axios.defaults.timeout = 5000;
axios.defaults.baseURL ='';

// 定义加载动画
let loading = null
let loadingShow = false

//http request 封装请求头拦截器
axios.interceptors.request.use(
  config => {
    if (!loadingShow) {
      loadingShow = true
      loading = message.loading('数据加载中...', 0)
    }

    // 设置 token 判断是否存在token，如果存在的话，则每个http header都加上token
    if (sessionStorage.getItem('auth')) {
      conf.headers['Authorize'] = sessionStorage.getItem('auth')

    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

//http response 封装后台返回拦截器
axios.interceptors.response.use(
  response => {
    //当返回信息为未登录或者登录失效的时候重定向为登录页面
    if(response.data.code == 'W_100004' || response.data.message == '用户未登录或登录超时，请登录！'){
      // todo
    }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)

// 移除拦截器
// var myInterceptor = axios.interceptors.request.use(function () {/*...*/});
// axios.interceptors.request.eject(myInterceptor);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function fetch(url,params={}){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.post(url,data)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}
/**
 * 封装导出Excal文件请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function exportExcel(url,data = {}){
  return new Promise((resolve,reject) => {
    axios({
      method: 'post',
      url: url, // 请求地址
      data: data, // 参数
      responseType: 'blob' // 表明返回服务器返回的数据类型
    })
    .then(response => {
      resolve(response.data);
      let blob = new Blob([response.data], {type: "application/vnd.ms-excel"});
      let fileName = "订单列表_"+Date.parse(new Date())+".xls" ;
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
    },err => {
      reject(err)
    })
  })
}
/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
      .then(response => {
        resolve(response.data);
      },err => {
        reject(err)
      })
  })
}
```

在组件中 import 以上文件并使用 axios

```ts
import axios from '../../Plugins/axios';

getSomething() {
  axios.get(...)
}
```

## rxjs

- 引入

```ts
import { Observable, fromEvent, from, of, interval, throwError } from "rxjs";
import {
  mapTo,
  map,
  scan,
  mergeMap,
  concatMap,
  bufferTime,
  take,
  reduce,
  filter,
  throttleTime,
  throttle,
  distinctUntilChanged,
  debounce,
  debounceTime,
} from "rxjs/operators";
```

- 使用

从 rxjs6 版本往后，所有的操作符需要再 pipe 中执行

```ts
ObservableObject.pipe(funcA,funcB,...).subscribe(...)
```

- 创建操作符

1. fromEvent: 创建一个 Observable，该 Observable 发出来自给定事件对象的指定类型事件

```ts
// 获取html元素
const btnElem = document.querySelector("button#rxjsBtn");
// 创建按钮的点击事件为可观察对象
fromEvent(btnElem, "click")
  .pipe(scan((count) => count + 1, 0)) // count为定义的变量；逗号后面的0为count的初始值；箭头后面的语句值为scan返回的值；
  .subscribe((count) => {
    console.log("fromEvent" + count);
  });
// 第一次点击输出: fromEvent1；第二次点击输出fromEvent2;依次同理
```

2. from: 将各种其他对象和数据类型转化为 Observables

```ts
const arrayData = [5, 6];
from(arrayData)
  .pipe(
    scan((scanData, item) => (scanData += item), 10),
    map((item) => item * 2)
  )
  .subscribe((data: any) => {
    console.log("from:" + data); //from:30 from:42
  });
```

3. of: 创建一个 Observable，它会依次发出由你提供的参数，最后发出完成通知。

```ts
of("value1", "value2").subscribe((data: any) => {
  console.log("of：" + data); //of：value1 of: value2
});
```

4. interval: 返回一个无线自增的序列整数

```ts
const numbers = interval(1000);
numbers.subscribe((x) => console.log("interval:" + x));
// 浏览器输出: interval:1 interval2 依次增加
```

5. create: 创建 Observable 对象, 当观察者( Observer )订阅该 Observable 时，它会执行指定的函数

```ts
new Observable((obsever) => {
  obsever.next("add");
  obsever.next("upt");
  obsever.complete();
  obsever.next("del");
})
  .pipe(map((data) => data + "Map"))
  .subscribe((data: any) => {
    console.log(data);
  });
// 浏览器输出: addMap uptMap
```

- 转换操作符

1. Map: 把每个源值传递给转化函数以获得相应的输出值

```ts
from([1, 2]).pipe(.map((item) => item * 2))
.subscribe((data: any) => { console.log('map:' + data);});
// 浏览器输出: map: 2 map: 4
```

2. MergeMap: 将每个源值投射成 Observable ，该 Observable 会合并到输出 Observable 中,可用于串联请求

```ts
const mergeA = of(1, 2, 3);
const mergeB = mergeA.pipe(
  map((r) => of(r)),
  mergeMap((r) => r)
);
mergeB.subscribe((c) => console.log("mergeMap:" + c));
// 浏览器输出: mergeMap1 mergeMap2 mergeMap3
```

3. MapTo: 类似于 map，但它每一次都把源值映射成同一个输出值。

```ts
of(1, 2, 3)
  .pipe(mapTo(33))
  .subscribe((data) => {
    console.log(data);
  });
// 浏览器输出: 3个33
```

4. scan: 对源 Observable 使用累加器函数，返回生成的中间值，可选的初始值

```ts
from([1, 2])
  .pipe(scan((acc, item) => (acc += item), 10)) // acc为一个新变量，item为[1,2]中的每一项， 10为新变量acc的默认初始值；返回新生成的中间值acc reduce同理
  .subscribe((v) => console.log(v));
//  浏览器输出 11  13
```

5. reduce: 和 scan 同理；只不过中间变量的值不会清 0，会保留上一次源操作之后的得到的中间值；并且只会输出最后一个值；

```ts
from([1, 2])
  .pipe(reduce((acc, item) => (acc += item), 10))
  .subscribe((v) => console.log(v));
// 输出13
```

- 过滤操作符

1. filter: 数据进行过滤返回你想要的数据

```ts
from([2, 3, 4])
  .pipe(filter((item) => item <= 3))
  .subscribe((v) => console.log(v));
// 浏览器输出: 2 3
```

2. throttleTime: 在一定时间范围内不管产生了多少事件，它只放第一个过去，剩下的都将舍弃

```ts
@ViewChild('child') child;

ngAfterViewInit() {
  this.do()
}

do() {
  // 一秒内只触发一次点击事件
  fromEvent(this.child.nativeElement, 'click').pipe(
    throttleTime(1000),
    scan(count => count + 1, 0))
    .subscribe(data => {
      console.log('点击了' + data + '次');
    });
}
```

3. distinctUntilChanged: 把相同的元素过滤掉，如果提供了比较器功能，则将为每个项目调用它以测试是否应该发出该值。如果未提供比较器功能，则默认使用相等性检查

```ts
of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4)
  .pipe(distinctUntilChanged())
  .subscribe((val) => {
    console.log(val);
  });
//1 2 1 2 3 4
```

4. throttle: 以某个时间间隔为阈值，在 durationSelector 完成前将抑制新值的发出

```ts
const source = interval(1000);
// 节流2秒后才发出最新值
const example = source.pipe(throttle((val) => interval(2000)));
// 输出: 0...3...6...9
const subscribe = example.subscribe((val) => console.log(val));
```

5. debounce: 根据一个选择器函数，舍弃掉在两次输出之间小于指定时间的发出值。

```ts
// 每1秒发出值, 示例: 0...1...2
const interval$ = interval(1000);
// 每1秒都将 debounce 的时间增加200毫秒
const debouncedInterval = interval$.pipe(
  debounce((val) => interval(val * 200))
);
/*
  5秒后，debounce 的时间会大于 interval 的时间，之后所有的值都将被丢弃
  输出: 0...1...2...3...4......(debounce 的时间大于1秒后则不再发出值)
*/
const subscribe = debouncedInterval.subscribe((val) =>
  console.log(`Example Two: ${val}`)
);
```

6. debounceTime: 舍弃掉在两次输出之间小于指定时间的发出值。

```ts
@ViewChild('child') child;

ngAfterViewInit() {
  this.do()
}

do() {
  // 一秒内只触发一次点击事件
  fromEvent(this.child.nativeElement, 'click').pipe(
    debounceTime(1000),
    scan(count => count + 1, 0))
    .subscribe(data => {
      console.log('点击了' + data + '次');
    });
}
```

### 引入外部 js

参考链接：[Angular 引入外部 js 文件的方法（引入 jQuery）](https://segmentfault.com/a/1190000020051868)

1. tsconfig.json

   在 compilerOptions 下新增："allowJs":true

2. 外部 js 文件放置

   例如放在：assets/lib/jquery-3.4.1.js

3. angular.json

   找到 architect 下的 scripts，加入"src/assets/lib/jquery-3.4.1.js"

4. 调用

   import \* as ejs from 'src/assets/lib/jquery-3.4.1.js';

   console.log(ejs("body").height());

## 结构指令和属性指令

结构指令用于通过删除和添加 DOM 元素来更改 DOM 布局。示例是 NgFor 和 Nglf。

属性指令用作元素的特征,如 NgStyle。

## 组件中的声明和提供与导入

- 声明：selector 使当前组件可用于其他组件
- 提供：provider 用于依赖注入，例如向构造函数注入服务用来通信
- 导入：import 用于导入其它模块，使当前模块可用

## 构建块

- 组件
- template
- 元数据:@Component/@ViewChild/@ViewChildren/@HostListener/@Input/@Output/@Pipe/@Directive
- 数据绑定
- 指令
- 服务
- 依赖注入

## 组件和指令的区别

- 组件使用@Component 声明，指令用@Directive 声明
- 指令用于向现有 DOM 元素添加行为，如判断是否点击元素外部
- DOM 元素可使用多个指令
- 指令没有 view

## ng Bootstrap

ng Do Bootstrap 是 Angular 7 中添加的新生命周期挂钩, Do Bootstrap 是接口。

```js
//ng Do Bootstrap - Life-Cycle Hook Interface
classApp Module implements Do Bootstrap {
  ng Do Bootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(AppComponent);
  }
}
```

## 路由守卫

auth.guard.ts
```ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private storage: StorageService) {}

    // 路由守卫
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //console.log(next,state)
        if (navigator.userAgent.indexOf('Mobile') >-1){
            window.location.href = 'https://www.baidu.com';
        }
        this.storage.sendMessage({message: 'sendMessage', goToURL: state.url});
        return true;
    }
}
```
app-routing.module.ts
```ts
const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    canActivate: [AuthGuard]
  }
]
```
storage.service.ts
```ts
import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private subject = new Subject<any>();
  
  sendMessage(message){
    this.subject.next(message);
  }

  clearMessage(){
    this.subject.next();
  }

  getMessage():Observable<any> {
    return this.subject.asObservable();
  }

  constructor(){}
}
```
某页面
```ts
ngAfterViewInit() {
    this.subscription = this.storage.getMessage().subscribe(
      msg => {
        console.log(msg);
      }
    )
```