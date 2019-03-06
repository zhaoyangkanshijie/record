# angular简结

* [angular项目结构](#angular项目结构)
* [angular自带属性和指令](#angular自带属性和指令)
* [angular命令](#angular命令)
* [angular自定义属性指令directive](#angular自定义属性指令directive)
* [angular生命周期](#angular生命周期)
* [angular双向数据绑定原理](#angular双向数据绑定原理)
* [请求后台资源](#请求后台资源rxjs与axios)
* [angular路由](#angular路由与鉴权)
* [父子组件通信](#父子组件通信)
* [组件间通信service依赖注入](#组件间通信service依赖注入)
* [页面传参与获取](#页面传参与获取)

## angular项目结构
* e2e文件夹：end to end，测试目录，主要用于集成测试。
* node_modules：项目的模块依赖目录。
* src：项目的源代码。
    * app：项目的主组件目录。
        * components：组件。
        * directives：自定义指令。
        * modules：自定义模块。
        * pages：页面。
        * services：服务。
        * app-routing.module.ts：组件路由配置文件。
        * app.component.css：组件私有css样式文件。
        * app.component.html：组件的模板文件。
        * app.component.spec.ts：组件的单元测试文件。
        * app.compenent.ts：组件typescript配置文件。
        * app.module.ts：组件模型配置文件。
    * assets：项目的资源目录。
    * environments：项目的环境配置目录
    * index.html：主页面。
    * karma.conf.js：karma测试的配置文件。
    * main.ts：脚本入口文件。
    * polyfills.ts：兼容性检测配置文件。
    * style.css：全局css样式文件。
    * test.ts：单元测试入口文件。
* .editorconfig：编辑器配置文件。
* .gitignore: git版本控制时忽略的文件（此文件中配置的文件不纳入版本控制）。
* .angular.json：angular配置文件。
* .package-lock.json：锁定项目依赖模块的版本号。
* .package.json：配置项目依赖模块。
* .README.md：项目说明文件
* .tsconfig.json：typescript配置文件。
* .tslint.json：typescript代码检测配置文件。

## angular自带属性和指令
* 条件判断 *ngIf="..."
* 循环 *ngFor="let i of/in is"
    * for in遍历的是数组的索引（即键名），而for of遍历的是数组元素值。
    * 带索引：
    ```html
    <div *ngFor="let hero of heroes; let i=index">{{i + 1}} - {{hero.name}}</div>
    ```
* NgSwitch
```html
<div [ngSwitch]="hero?.emotion">
  <app-happy-hero    *ngSwitchCase="'happy'"    [hero]="hero"></app-happy-hero>
  <app-sad-hero      *ngSwitchCase="'sad'"      [hero]="hero"></app-sad-hero>
  <app-confused-hero *ngSwitchCase="'app-confused'" [hero]="hero"></app-confused-hero>
  <app-unknown-hero  *ngSwitchDefault           [hero]="hero"></app-unknown-hero>
</div>
```
* 数据双向绑定 [(ngModel)]="..."

    需导入FormsModule，配合@Input()使用
* 点击事件 (click)="..."
* 属性绑定 [id]="id" [title]="msg"
* a路由跳转 routerLink="..."
* 模板引用变量 #var
* 管道 |
* [ngClass]、[ngStyle]
```html
public flag=false;
<div [ngClass]="{'red': flag, 'blue': !flag}">
这是一个 div </div>
public attr='red';
<div [ngStyle]="{'background-color':attr}">你好 ngStyle</div>
```

## angular命令
* 创建新项目：ng new {项目名}
本地浏览：ng serve ,后面加上--open可自动打开浏览器
* 生成服务器文件：ng build
* 生成组件：ng generate component {(路径/)组件名} ,后面加上--inline-style，CLI 就会定义一个空的 styles 数组
* 生成服务：ng generate service {(路径/)服务名} ,后面加上--module=app让 CLI 自动把它提供给 AppModule
* 生成模块：ng generate module {(路径/)模块名}, 后面加上--flat会把这个文件放进了 src/app 中，而不是单独的目录中, 加上--module=app告诉 CLI 把它注册到 AppModule 的 imports 数组中。
* 生成类：ng generate class {(路径/)类名}
* 生成指令：ng generate directive {(路径/)名称}
* 测试：ng test

    其中generate可省略为g

## angular自定义属性指令directive
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

## angular生命周期
* ngOnInit() 用于初始化属性，ajax
* ngOnChanges() 用于监听组件传值变化、绑定数据变化
* ngDoCheck() 发生Angular无法或不愿意自己检测的变化时作出反应。
* ngAfterContentInit() 当父组件向子组件投影内容的时.在子组件内会初始化父组件的投影内容,此时会调用
* ngAfterContentChecked() 当父组件向子组件的投影内容发生改变时会调用
* ngAfterViewInit() 可dom操作
* ngAfterViewChecked() 初始化完组件视图及其子视图之后调用
* ngOnDestroy() 每次销毁指令/组件之前调用

## angular双向数据绑定原理

Angular通过脏检测来进行双向数据绑定，在$digest cycle流程里面，会从rootscope开始遍历，检查所有的watcher。

Angular只有指定事件触发，才会进入$digest cycle：
* DOM事件，比如用户输入文本，点击按钮等.
* ajax事件
* 浏览器location变更事件
* Timer事件($timeout,$interval)
* 执行$scope.$digest();或$scope.$apply()

## 请求后台资源rxjs与axios

* rxjs是一种针对异步数据流的编程，它将一切数据，包括HTTP请求，DOM事件或者普通数据等包装成流的形式，使你能以同步编程的方式处理异步数据。
    * 异步处理数据
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
    * 请求数据
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

* axios
```ts
axios.get('/user?ID=12345').then(function(response) {
    // handle success
    console.log(response);
}).
catch(function(error) {
    // handle error console.log(error);
}).then(function() {
    // always executed 
});
```

## angular路由与鉴权
* 路由与子路由
```ts
const routes: Routes = [
  { path: '', redirectTo : 'home',pathMatch:'full' }, //路径为空
  { path: 'home', component: HomeComponent },
  { path: 'product/:id', component: ProductComponent, children:[
    { path: '', component : ProductDescComponent },
    { path: 'seller/:id', component : SellerInfoComponent }
  ] },
  { path: '**', component: Code404Component }
];
```

* 路由守卫
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
export class LoginGuard implements CanActivate{
    canActivate(){
        let loggedIn :boolean= Math.random()<0.5;
        if(!loggedIn){
            console.log("用户未登录");
        }
        return loggedIn;
    }
}
```
```js
import { CanDeactivate } from "@angular/router";
import { ProductComponent } from "../product/product.component";

export class UnsaveGuard implements CanDeactivate<ProductComponent>{
    //第一个参数 范型类型的组件
    //根据当前要保护组件 的状态 判断当前用户是否能够离开
    canDeactivate(component: ProductComponent){
        return window.confirm('你还没有保存，确定要离开吗？');
    }
}
```
## 父子组件通信

子组件
```html
<h1>{{childTitle}}</h1>
```
```ts
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.sass']
})
export class ChildComponent implements OnInit {

  private _childTitle: string = '子组件标题';

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

  constructor() { }

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
<app-child childTitle="可设置子组件标题" (initEmit)="accept($event)" #child></app-child>
<button (click)="child.childPrint()"></button>
```
```ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent-and-child.component.html',
  styleUrls: ['./parent-and-child.component.sass']
})
export class ParentAndChildComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

}
```

## 组件间通信service依赖注入
* 服务
```ts
import { Component, Injectable, EventEmitter } from '@angular/core';
@Injectable()
export class myService {
  public info:string = '';
  constructor() {}
}
```
* 组件1
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
* 组件2
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

* 使用routerLink跳转
```html
<a routerLink=["/exampledetail",id]></a>
<a routerLink=["/exampledetail",{queryParams:object}] ></a>
```
* 使用navigate跳转
```ts
this.router.navigate(['user', 1]);
以根路由为起点跳转

this.router.navigate(['user', 1],{relativeTo: route});
默认值为根路由，设置后相对当前路由跳转，route是ActivatedRoute的实例，使用需要导入ActivatedRoute

this.router.navigate(['user', 1],{ queryParams: {id: '1',status: true} });
路由中传参数 /user/1?id=1

this.router.navigate(['user', 1],{ fragment: 'top' });
路由中锚点跳转 /user/1#top
```

* 获取参数
    * snapshot
    ```ts
    constructor( public activeRoute: ActivateRoute ) { };
    ngOnInit(){
        this.id= this.activeRoute.snapshot.params['id'];
    };
    ```
    * queryParams
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




