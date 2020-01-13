# angular新手详解

## 参考教程
* [AngularJS 教程](http://www.angularjs.net.cn/tutorial/)
* [angular快速上手](https://www.angular.cn/guide/quickstart)

## 命令解析
* 创建新项目：ng new {项目名}
* 本地浏览：ng serve ,后面加上--open可自动打开浏览器
* 生成服务器文件：ng build

    如果想看index.html，可删除里面的
    ```html
    <base href="/">
    ```
* 生成组件：ng generate component {组件名} ,后面加上--inline-style，CLI 就会定义一个空的 styles 数组
* 生成服务：ng generate service {服务名} ,后面加上--module=app让 CLI 自动把它提供给 AppModule
* 生成模块：ng generate module {模块名}, 后面加上--flat会把这个文件放进了 src/app 中，而不是单独的目录中, 加上--module=app告诉 CLI 把它注册到 AppModule 的 imports 数组中。
* 生成类：ng generate class {类名}
* 生成指令：ng generate directive {名称}
* 测试：ng test

## 知识点

### 项目架构
* app --单页应用
    * 模块1
        * 子模块1
            * html --页面模板
            * css --样式
            * ts --数据和生命周期控制
                * @Component --声明组件
                * constructor --构造器,传入服务
                * @Input() --用于外部组件绑定
                * ngOnInit --生命周期：初始化,还有更多的生命周期事件
                * subscribe --订阅，异步获取服务observable数据，类似于jquery ajax的success
                * 其它自定义的方法和变量
        * 子模块2
        * 子模块3
    * 模块2
    * 模块3
    * 路由模块 --前端路由控制(后端不再路由)
        * forRoot(routes)和path --定义默认路由和常规路由，可使用通配符，如：/:id
    * 服务 --数据增删改与传递
        * @Injectable() --依赖注入
        * constructor --构造器，引入其它服务和模块，如$http
        * http.get(url) --get请求获取数据，也可用post,delete,put等
        * httpOptions --设置特殊头部HttpHeaders({ 'Content-Type': 'application/json' })
        * .pipe() --扩展 Observable 的结果,()内用操作符
            * catchError(function) --错误处理
            * tap() --该操作符会查看 Observable 中的值，使用那些值做一些事情，并且把它们传出来。 这种 tap 回调不会改变这些值本身
            * map() --对 Observable 的结果进行处理,相当于return
            * debounceTime(300) --在传出最终字符串之前，debounceTime(300) 将会等待，直到新增字符串的事件暂停了 300 毫秒
            *  distinctUntilChanged() --确保只在过滤条件变化时才发送请求
            * switchMap() --为每个从 debounce 和 distinctUntilChanged 中通过的搜索词调用搜索服务。 它会取消并丢弃以前的搜索可观察对象，只保留最近的。
        * Observable.of(...) --返回observable对象
        * `id=${id}` --模板字符串字面量,生成可变字符串
        * 其它自定义的变量和方法,如错误处理函数和打印函数等

### 关于import
1. import { Injectable } from '@angular/core';
2. import { HttpClient, HttpHeaders, HttpClientModule  } from '@angular/common/http';
3. import { BrowserModule }  from '@angular/platform-browser';
4. import { FormsModule,ReactiveFormsModule,FormControl, FormGroup, Validators }    from '@angular/forms';
5. import { Observable} from 'rxjs';
6. import { catchError, map, tap } from 'rxjs/operators';
7. import { InMemoryDbService } from 'angular-in-memory-web-api';
8. import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
9. import { Directive, ElementRef } from '@angular/core';
10. import { Pipe, PipeTransform } from '@angular/core';
11. import { Component, EventEmitter, Input, Output } from '@angular/core';
12. import { AnimationEvent } from '@angular/animations';
13. import { animate, state, style, transition, trigger } from '@angular/animations';
14. import { NgModule } from '@angular/core';
15. import { Router, NavigationStart, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
16. import { filter } from 'rxjs/operators';

### 语法基础
1. 条件判断 *ngIf="..."

    条件为真，则渲染下面内容

2. 循环 *ngFor="let i of/in is"

    for in遍历的是数组的索引（即键名），而for of遍历的是数组元素值。

    带索引：
    ```html
    <div *ngFor="let hero of heroes; let i=index">{{i + 1}} - {{hero.name}}</div>
    ```

3. 数据双向绑定 [(ngModel)]="..."

    需导入FormsModule，配合@Input()使用

4. 点击事件 (click)="..."

5. a路由跳转 routerLink="..."

6. 模板引用变量 #var

    \#phone 的意思就是声明一个名叫 phone 的变量来引用 \<input\> 元素。
    ```html
    <input #phone placeholder="phone number">
    <button (click)="callPhone(phone.value)">Call</button>
    ```

    优点：代替$event

    例子：获取用户输入

    $event:
    把整个 DOM 事件传到方法中，因为这样组件会知道太多模板的信息。 只有当它知道更多它本不应了解的 HTML 实现细节时，它才能提取信息。 这就违反了模板（用户看到的）和组件（应用如何处理用户数据）之间的分离关注原则。
    ```typescript
    template: `
    <input (keyup)="onKey($event)">
    <p>{{values}}</p>
    `
    export class KeyUpComponent_v1 {
        values = '';


        onKey(event: KeyboardEvent) { // with type info
            this.values += (<HTMLInputElement>event.target).value + ' | ';
        }
    }
    ```
    #var
    ```typescript
    @Component({
    selector: 'app-key-up2',
    template: `
        <input #box (keyup)="onKey(box.value)">
        <p>{{values}}</p>
    `
    })
    export class KeyUpComponent_v2 {
    values = '';
    onKey(value: string) {
        this.values += value + ' | ';
    }
    }
    ```

7. form 与 input

    (1) 事件：
    ```typescript
    @Component({
    selector: 'app-key-up4',
    template: `
        <input #box
        (keyup.enter)="update(box.value)"
        (blur)="update(box.value)">

        <p>{{value}}</p>
    `
    })
    export class KeyUpComponent_v4 {
    value = '';
    update(value: string) { this.value = value; }
    }
    ```

    (2) 通过 ngModel 跟踪修改状态与有效性验证
    |     状态     |  为真时的 CSS 类  |  为假时的 CSS 类  |  
    |-------------|------------------|-----------------|
    |控件被访问过。  |     ng-touched  |   ng-untouched  |
    |控件的值变化了。|     ng-dirty    |   ng-pristine   |
    |控件的值有效。  |     ng-valid    |   ng-invalid    |

    查看以上类的方法：
    ```typescript
    <input type="text" class="form-control" id="name"
    required
    [(ngModel)]="model.name" name="name"
    #spy>
    <br>TODO: remove this: {{spy.className}}
    ```

    自定义css
    ```css
    .ng-valid[required], .ng-valid.required  {
    border-left: 5px solid #42A948; /* green */
    }

    .ng-invalid:not(form)  {
    border-left: 5px solid #a94442; /* red */
    }
    ```

    显示和隐藏验证错误信息
    ```html
    <label for="name">Name</label>
    <input type="text" class="form-control" id="name"
        required
        [(ngModel)]="model.name" name="name"
        #name="ngModel">这里把 name 设置为 ngModel 是因为 ngModel 指令的 exportAs 属性设置成了 “ngModel”。
    <div [hidden]="name.valid || name.pristine"
        class="alert alert-danger">
    Name is required
    </div>
    ```

    (3) ngSubmit 提交表单
    ```html
    <form (ngSubmit)="onSubmit()" #heroForm="ngForm">
    <button type="submit" class="btn btn-success" [disabled]="!heroForm.form.valid">Submit</button>
    ```

    (4) 表单验证

    * 模板驱动验证
    ```html
    <input id="name" name="name" class="form-control"
       required minlength="4" appForbiddenName="bob"
       [(ngModel)]="hero.name" #name="ngModel" >

    <div *ngIf="name.invalid && (name.dirty || name.touched)"
        class="alert alert-danger">对 dirty 和 touched 的检查可以避免在用户还没编辑表单就给他们显示错误提示。改变控件的值会改变控件的 dirty（脏）状态，而当控件失去焦点时，就会改变控件的 touched（碰过）状态。

    <div *ngIf="name.errors.required">
        Name is required.
    </div>
    <div *ngIf="name.errors.minlength">
        Name must be at least 4 characters long.
    </div>
    <div *ngIf="name.errors.forbiddenName">
        Name cannot be Bob.
    </div>

    </div>
    ```

    * 内置验证器

    由于这些验证器都是同步验证器，因此要把它们作为第二个参数传进去。

    可以通过把这些函数放进一个数组后传进去，可以支持多重验证器。

    这个例子添加了一些 getter 方法。在响应式表单中，你通常会通过它所属的控件组（FormGroup）的 get 方法来访问表单控件，但有时候为模板定义一些 getter 作为简短形式。

    ```typescript
    ngOnInit(): void {
    this.heroForm = new FormGroup({
        'name': new FormControl(this.hero.name, [
        Validators.required,
        Validators.minLength(4),
        forbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator.
        ]),
        'alterEgo': new FormControl(this.hero.alterEgo),
        'power': new FormControl(this.hero.power, Validators.required)
    });
    }

    get name() { return this.heroForm.get('name'); }

    get power() { return this.heroForm.get('power'); }
    ```
    ```html
    <input id="name" class="form-control"
        formControlName="name" required >

    <div *ngIf="name.invalid && (name.dirty || name.touched)"
        class="alert alert-danger">

    <div *ngIf="name.errors.required">
        Name is required.
    </div>
    <div *ngIf="name.errors.minlength">
        Name must be at least 4 characters long.
    </div>
    <div *ngIf="name.errors.forbiddenName">
        Name cannot be Bob.
    </div>
    </div>
    ```

    * 自定义验证器
    这个函数是一个工厂，它接受一个用来检测指定名字是否已被禁用的正则表达式，并返回一个验证器函数。
    ```typescript
    export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? {'forbiddenName': {value: control.value}} : null;
    };
    }
    ```
    ```ts
    this.heroForm = new FormGroup({
    'name': new FormControl(this.hero.name, [
        Validators.required,
        Validators.minLength(4),
        forbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator.
    ]),
    'alterEgo': new FormControl(this.hero.alterEgo),
    'power': new FormControl(this.hero.power, Validators.required)
    });
    ```
    ```ts
    @Directive({
        selector: '[appForbiddenName]',
        providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true}]
    })
    export class ForbiddenValidatorDirective implements Validator {
    @Input('appForbiddenName') forbiddenName: string;
    
    validate(control: AbstractControl): {[key: string]: any} {
        return this.forbiddenName ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control)
                                : null;
    }
    }
    ```
    ```html
    <input id="name" name="name" class="form-control"
       required minlength="4" appForbiddenName="bob"
       [(ngModel)]="hero.name" #name="ngModel" >
    ```

    (5) 表单类

    * AbstractControl是这三个具体表单类的抽象基类。 并为它们提供了一些共同的行为和属性。

    * FormControl 用于跟踪一个单独的表单控件的值和有效性状态。它对应于一个 HTML 表单控件，比如 \<input\> 或 \<select\>。

        属性
        * myControl.value：FormControl 的值。

        * myControl.status：FormControl 的有效性。可能的值有 VALID、INVALID、PENDING 或 DISABLED。

        * myControl.pristine：如果用户尚未改变过这个控件的值，则为 true。它总是与 myControl.dirty 相反。

        * myControl.untouched：如果用户尚未进入这个 HTML 控件，也没有触发过它的 blur（失去焦点）事件，则为 true。 它是 myControl.touched 的反义词。

        ```html
        <p>Name value: {{ heroForm.get('name').value }}</p>
        <p>Street value: {{ heroForm.get('address.street').value}}</p>
        ```


    * FormGroup用于 跟踪一组AbstractControl 的实例的值和有效性状态。 该组的属性中包含了它的子控件。 组件中的顶级表单就是一个 FormGroup。

        方法
        * setValue() 方法会在赋值给任何表单控件之前先检查数据对象的值。它不会接受一个与 FormGroup 结构不同或缺少表单组中任何一个控件的数据对象。
        ```ts
        this.heroForm.setValue({
            name:    this.hero.name,
            address: this.hero.addresses[0] || new Address()
        });
        ```

        * patchValue()，可以通过提供一个只包含要更新的控件的键值对象来把值赋给 FormGroup 中的指定控件。
        ```ts
        this.heroForm.patchValue({
            name: this.hero.name
        });
        ```
    
    ```ts
    import { Component }              from '@angular/core';
    import { FormControl, FormGroup } from '@angular/forms';

    export class HeroDetailComponent2 {
        heroForm = new FormGroup ({
            name: new FormControl()
        });
    }
    ```
    
    ```html
    <h2>Hero Detail</h2>
    <h3><i>FormControl in a FormGroup</i></h3>
    <form [formGroup]="heroForm">
    <div class="form-group">
        <label class="center-block">Name:
        <input class="form-control" formControlName="name">
        </label>
    </div>
    </form>
    ```
        
    * FormArray用于跟踪 AbstractControl 实例组成的有序数组的值和有效性状态。

    ```html
    <div formArrayName="secretLairs" class="well well-lg">
        <div *ngFor="let address of secretLairs.controls; let i=index" [formGroupName]="i" >
            <!-- The repeated address template -->
        </div>
    </div>
    ```

    * FormBuilder 类能通过处理控件创建的细节问题来帮你减少重复劳动。
    ```ts
    export class HeroDetailComponent3 {
        heroForm: FormGroup; // <--- heroForm is of type FormGroup

        constructor(private fb: FormBuilder) { // <--- inject FormBuilder
            this.createForm();
        }

        createForm() {
            this.heroForm = this.fb.group({
            name: '', // <--- the FormControl called "name"
            });
        }
    }
    ```
    FormBuilder.group 是一个用来创建 FormGroup 的工厂方法，它接受一个对象，对象的键和值分别是 FormControl 的名字和它的定义。 在这个例子中，name 控件的初始值是空字符串。

    把一组控件定义在一个单一对象中，可以让代码更加紧凑、易读。 因为不必写一系列重复的 new FormControl(...) 语句。

    (6) 在ngOnChanges设置/重置表单模型的值
    ```ts
    ngOnChanges() {
        this.rebuildForm();
    }
    ```

8. 管道符 |

    用于表达式结果转换,如lowercase,uppercase,json,date

    自定义
    ```typescript
    import { Pipe, PipeTransform } from '@angular/core';
    /*
    * Raise the value exponentially
    * Takes an exponent argument that defaults to 1.
    * Usage:
    *   value | exponentialStrength:exponent
    * Example:
    *   {{ 2 | exponentialStrength:10 }}
    *   formats to: 1024
    */
    @Pipe({name: 'exponentialStrength'})
    export class ExponentialStrengthPipe implements PipeTransform {
    transform(value: number, exponent: string): number {
        let exp = parseFloat(exponent);
        return Math.pow(value, isNaN(exp) ? 1 : exp);
    }
    }
    ```

9. style
    ```typescript
    encapsulation: ViewEncapsulation.Native 定义封装模式(具体见“概念梳理2”)
    @import './hero-details-box.css';可导入css文件
    @Component({
        selector: 'app-root',
        template: `
            <style>内联样式
                button {
                    background-color: white;
                    border: 1px solid #777;
                }
            </style>
            <link rel="stylesheet" href="../assets/hero-team.component.css">可使用link标签
            <h1>Tour of Heroes</h1>
            <app-hero-main [hero]="hero"></app-hero-main>
        `,
        styles: ['h1 { font-weight: normal; }']元数据样式
        styleUrls: ['./hero-app.component.css']加载外部样式
        styleUrls: ['./app.component.scss']如果使用 CLI 进行构建，可以用 sass、less 或 stylus 来编写样式
    })
    ```

10. 分组元素(不会在DOM中)

    ```html
    <p>
        I turned the corner
        <ng-container *ngIf="hero">
            and saw {{hero.name}}. I waved
        </ng-container>
        and continued on my way.
    </p>
    ```

### 语法详解
1. 属性绑定
    ``` html
    <img [src]="...">
    <button [disabled]="...">..</button>
    <div [ngClass]="...">..</div> //同时添加或移除多个 CSS 类,NgStyle同理s
    <div class="special"
    [class.special]="!isSpecial">..</div>
    <button [style.color]="isSpecial ? 'red': 'green'">Red</button>
    ```

    * 更多关于数据绑定

    |数据方向|语法|绑定类型|解析|
    |-------|---|-------|---|
    |数据源到视图|{{expression}}<br>[target]="expression"<br>bind-target="expression"|插值表达式<br>属性<br>Attribute<br>CSS 类<br>样式|数据改变影响视图|
    |视图到数据源|(target)="statement"<br>on-target="statement"|事件|视图触发数据改变|
    |双向|[(target)]="expression"<br>bindon-target="expression"|双向|视图和数据同时改变|

2. 通信：输入输出与服务
    ```typescript
    @Component({
        inputs: ['hero'],
        outputs: ['deleteRequest'],
    })
    @Input()  hero: Hero;
    @Output() deleteRequest = new EventEmitter<Hero>();
    ```
    ```html
    <hero-detail [hero]="currentHero" (deleteRequest)="deleteHero($event)">
    ```
    HeroDetailComponent.hero 是个输入属性， 因为数据流从模板绑定表达式流入那个属性。

    HeroDetailComponent.deleteRequest 是个输出属性， 因为事件从那个属性流出，流向模板绑定语句中的处理器。

    更多组件交互：https://www.angular.cn/guide/component-interaction

3. 安全操作

    * 安全导航操作符(?.)
    ```html
    The current hero's name is {{currentHero?.name}}
    ```
    若currentHero为null，不使用安全导航操作符会报错：
    TypeError: Cannot read property 'name' of null in [null].

    * 非空断言操作符(!)
    ```html
    <div *ngIf="hero">
        The hero's name is {{hero!.name}}
    </div>
    ```
    一般用于if后

    * 类型转换函数 $any
    ```html
    <div>
        The hero's marker is {{$any(hero).marker}}
    </div>
    ```
    防止类型报错

4. 模板引用变量 ( #var )

    ```html
    <input #phone placeholder="phone number">
    <button (click)="callPhone(phone.value)">Call</button>
    ```
    声明在 input 上的 phone 变量就是在模板另一侧的 button 上使用

5. 组件样式

    (2:host用来选择组件宿主(父组件)元素中的元素
    ```css
    :host(.active) {
        order-width: 3px;
    }
    ```
    (2):host-context它在当前组件宿主元素的祖先节点中查找CSS 类， 直到文档的根节点为止。
    ```css
    :host-context(.theme-light) h2 {
        background-color: #eef;
    }
    ```
    (3)废弃：/deep/、>>> 和 ::ng-deep(将来兼容) 强制一个样式对各级子组件的视图也生效.
    ```css
    :host /deep/ h3 {
        font-style: italic;
    }
    ```
6. 动态组件(样例：弹窗服务)

    (1) popup.component.ts 定义了一个简单的弹窗元素，用于显示一条输入消息，附带一些动画和样式。
    ```typescript
    import { Component, EventEmitter, Input, Output } from '@angular/core';
    import { AnimationEvent } from '@angular/animations';
    import { animate, state, style, transition, trigger } from '@angular/animations';
    
    @Component({
    selector: 'my-popup',
    template: 'Popup: {{message}}',
    host: {
        '[@state]': 'state',
        '(@state.done)': 'onAnimationDone($event)',
    },
    animations: [
        trigger('state', [
        state('opened', style({transform: 'translateY(0%)'})),
        state('void, closed', style({transform: 'translateY(100%)', opacity: 0})),
        transition('* => *', animate('100ms ease-in')),
        ])
    ],
    styles: [`
        :host {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #009cff;
        height: 48px;
        padding: 16px;
        display: flex;
        align-items: center;
        border-top: 1px solid black;
        font-size: 24px;
        }
    `]
    })
    
    export class PopupComponent {
    private state: 'opened' | 'closed' = 'closed';
    
    @Input()
    set message(message: string) {
        this._message = message;
        this.state = 'opened';
    
        setTimeout(() => this.state = 'closed', 2000);
    }
    get message(): string { return this._message; }
    _message: string;
    
    @Output()
    closed = new EventEmitter();
    
    onAnimationDone(e: AnimationEvent) {
        if (e.toState === 'closed') {
        this.closed.next();
        }
    }
    }
    ```

    (2) popup.service.ts 创建了一个可注入的服务，它提供了两种方式来执行 PopupComponent：作为动态组件或作为自定义元素。
    ```typescript
    import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
    
    import { PopupComponent } from './popup.component';
    import { NgElementConstructor } from '../elements-dist';
    
    @Injectable()
    export class PopupService {
    constructor(private injector: Injector,
                private applicationRef: ApplicationRef,
                private componentFactoryResolver: ComponentFactoryResolver) {}
    
    // Previous dynamic-loading method required you to set up infrastructure
    // before adding the popup to the DOM.
    showAsComponent(message: string) {
        // Create element
        const popup = document.createElement('popup-component');
    
        // Create the component and wire it up with the element
        const factory = this.componentFactoryResolver.resolveComponentFactory(PopupComponent);
        const popupComponentRef = factory.create(this.injector, [], popup);
    
        // Attach to the view so that the change detector knows to run
        this.applicationRef.attachView(popupComponentRef.hostView);
    
        // Listen to the close event
        popupComponentRef.instance.closed.subscribe(() => {
        document.body.removeChild(popup);
        this.applicationRef.detachView(popupComponentRef.hostView);
        });
    
        // Set the message
        popupComponentRef.instance.message = message;
    
        // Add to the DOM
        document.body.appendChild(popup);
    }
    
    // This uses the new custom-element method to add the popup to the DOM.
    showAsElement(message: string) {
        // Create element
        const popupEl = document.createElement('popup-element');
    
        // Listen to the close event
        popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    
        // Set the message
        popupEl.message = message;
    
        // Add to the DOM
        document.body.appendChild(popupEl);
    }
    }
    ```

    (3) app.module.ts 把 PopupComponent 添加到模块的 entryComponents 列表中，而从编译过程中排除它，以消除启动时的警告和错误。
    ```typescript
    import { BrowserModule } from '@angular/platform-browser';
    import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
    import { NgModule } from '@angular/core';
    
    import { AppComponent } from './app.component';
    import { PopupService } from './popup.service';
    import { PopupComponent } from './popup.component';
    
    // include the PopupService provider,
    // but exclude PopupComponent from compilation,
    // because it will be added dynamically
    
    @NgModule({
    declarations: [AppComponent, PopupComponent],
    imports: [BrowserModule, BrowserAnimationsModule],
    providers: [PopupService],
    bootstrap: [AppComponent],
    entryComponents: [PopupComponent],
    })
    
    export class AppModule {}
    ```

    (4) app.component.ts 定义了该应用的根组件，它借助 PopupService 在运行时把这个弹窗添加到 DOM 中。在应用运行期间，根组件的构造函数会把 PopupComponent 转换成自定义元素。
    ```typescript
    import { Component, Injector } from '@angular/core';
    import { createNgElementConstructor } from '../elements-dist';
    import { PopupService } from './popup.service';
    import { PopupComponent } from './popup.component';
    
    @Component({
    selector: 'app-root',
    template: `
        <input #input value="Message">
        <button (click)="popup.showAsComponent(input.value)">
            Show as component </button>
        <button (click)="popup.showAsElement(input.value)">
            Show as element </button>
    `
    })
    
    export class AppComponent {
    constructor(private injector: Injector, public popup: PopupService) {
        // on init, convert PopupComponent to a custom element
        const PopupElement =
    createNgElementConstructor(PopupComponent, {injector: this.injector});
        // register the custom element with the browser.
        customElements.define('popup-element', PopupElement);
    }
    }
    ```

7. 指令 directive

* 属性型指令

    (1) 直接改变元素样式
    ```typescript
    import { Directive, ElementRef } from '@angular/core';

    @Directive({
    selector: '[appHighlight]'
    })
    export class HighlightDirective {
        constructor(el: ElementRef) {
        el.nativeElement.style.backgroundColor = 'yellow';
        }
    }
    ```
    ```html
    <p appHighlight>Highlight me!</p>
    ```

    (2)用户触发
    ```typescript
    import { Directive, ElementRef, HostListener } from '@angular/core';
    
    @Directive({
    selector: '[appHighlight]'
    })
    export class HighlightDirective {
    constructor(private el: ElementRef) { }
    
    @HostListener('mouseenter') onMouseEnter() {
        this.highlight('yellow');
    }
    
    @HostListener('mouseleave') onMouseLeave() {
        this.highlight(null);
    }
    
    private highlight(color: string) {
        this.el.nativeElement.style.backgroundColor = color;
    }
    ```

    (3)带输入值
    ```typescript
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
    }
    ```
    ```html
    <p appHighlight highlightColor="yellow">Highlighted in yellow</p>
    <p appHighlight [highlightColor]="'orange'">Highlighted in orange</p>
    ```

* 结构型指令
    ```typescript
    import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

    /**
    * Add the template content to the DOM unless the condition is true.
    */
    @Directive({ selector: '[appUnless]'})
    export class UnlessDirective {
    private hasView = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef) { }

    @Input() set appUnless(condition: boolean) {
        if (!condition && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
        } else if (condition && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
        }
    }
    }
    ```
    ```html
    <p *appUnless="condition" class="unless a">
    (A) This paragraph is displayed because the condition is false.
    </p>
    ```

8. 动画

    ```typescript
    import { BrowserModule } from '@angular/platform-browser';
    import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
    
    import { Hero } from './hero.service';
    
    @Component({
    selector: 'app-hero-list-basic',
    template: `
        <ul>
        <li *ngFor="let hero of heroes"
            [@heroState]="hero.state"
            (click)="hero.toggleState()">
            {{hero.name}}
        </li>
        </ul>
    `,
    styleUrls: ['./hero-list.component.css'],
    animations: [
        动画触发器
        trigger('heroState', [
        state('inactive', style({
            backgroundColor: '#eee',
            transform: 'scale(1)'
        })),
        state('active',   style({
            backgroundColor: '#cfd8dc',
            transform: 'scale(1.1)'
        })),
        transition('inactive => active', animate('100ms ease-in')),
        transition('active => inactive', animate('100ms ease-out'))
        ])
    ]
    })
    export class HeroListBasicComponent {
    @Input() heroes: Hero[];
    }
    ```
    transition('inactive => active, active => inactive',animate('100ms ease-out')),多个时间线

    transition('inactive <=> active', animate('100ms ease-out'))双向
    也可使用*(通配符)匹配任何动画状态。

    有一种叫做 void 的特殊状态，它可以应用在任何动画中。它表示元素没有被附加到视图。这种情况可能是由于它尚未被添加进来或者已经被移除了。 void 状态在定义“进场”和“离场”的动画时会非常有用。

    进场：void => *

    离场：* => void

    ```typescript
    animations: [
    trigger('heroState', [
        state('inactive', style({transform: 'translateX(0) scale(1)'})),
        state('active',   style({transform: 'translateX(0) scale(1.1)'})),
        transition('inactive => active', animate('100ms ease-in')),
        transition('active => inactive', animate('100ms ease-out')),
        transition('void => inactive', [
        style({transform: 'translateX(-100%) scale(1)'}),
        animate(100)
        ]),
        transition('inactive => void', [
        animate(100, style({transform: 'translateX(100%) scale(1)'}))
        ]),
        transition('void => active', [
        style({transform: 'translateX(0) scale(0)'}),
        animate(200)
        ]),
        transition('active => void', [
        animate(200, style({transform: 'translateX(0) scale(0)'}))
        ])
    ])
    ]
    ```

    可动的(Animatable)属性与单位:位置(position)、大小(size)、变换(transform)、颜色(color)、边框(border)等

    尺寸类属性(如位置、大小、边框等)包括一个数字值和一个用来定义长度单位的后缀:'50px','3em','100%'

    动画时间线:持续时间(duration)、延迟(delay)和缓动(easing)函数

    持续时间控制动画从开始到结束要花多长时间。可以用三种方式定义持续时间：

    * 作为一个普通数字，以毫秒为单位，如：100

    * 作为一个字符串，以毫秒为单位，如：'100ms'

    * 作为一个字符串，以秒为单位，如：'0.1s'

    延迟：等待 100 毫秒，然后运行 200 毫秒：'0.2s 100ms'。

    缓动函数

    * 等待 100 毫秒，然后运行 200 毫秒，并且带缓动：'0.2s 100ms ease-out'

    * 运行 200 毫秒，并且带缓动：'0.2s ease-in-out'

    基于关键帧(Keyframes)的多阶段动画,通过offset实现，取值[0,1],表示动画起点到终点
    ```typescript
    animations: [
    trigger('flyInOut', [
        state('in', style({transform: 'translateX(0)'})),
        transition('void => *', [
        animate(300, keyframes([
            style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
            style({opacity: 1, transform: 'translateX(15px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
        ]))
        ]),
        transition('* => void', [
        animate(300, keyframes([
            style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
            style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
            style({opacity: 0, transform: 'translateX(100%)',  offset: 1.0})
        ]))
        ])
    ])
    ]
    ```

    并行动画组(Group):只要把它们都放进同一个 style() 定义中
    ```typescript
    animations: [
    trigger('flyInOut', [
        state('in', style({width: 120, transform: 'translateX(0)', opacity: 1})),
        transition('void => *', [
        style({width: 10, transform: 'translateX(50px)', opacity: 0}),
        group([
            animate('0.3s 0.1s ease', style({
            transform: 'translateX(0)',
            width: 120
            })),
            animate('0.3s ease', style({
            opacity: 1
            }))
        ])
        ]),
        transition('* => void', [
        group([
            animate('0.3s ease', style({
            transform: 'translateX(50px)',
            width: 10
            })),
            animate('0.3s 0.2s ease', style({
            opacity: 0
            }))
        ])
        ])
    ])
    ]
    ```

    动画回调:当动画开始和结束时，会触发一个回调。对于例子中的这个关键帧，你有一个叫做 @flyInOut 的 trigger。在那里你可以挂钩到那些回调,回调接收一个 AnimationTransitionEvent 参数，它包含一些有用的属性，例如 fromState，toState 和 totalTime。
    ```typescript
    template: `
    <ul>
        <li *ngFor="let hero of heroes"
            (@flyInOut.start)="animationStarted($event)"
            (@flyInOut.done)="animationDone($event)"
            [@flyInOut]="'in'">
        {{hero.name}}
        </li>
    </ul>
    `,
    ```

9. 观察者(observer)与订阅者(subscriber)

    * 代码样例：
    ```ts
    // Create an Observable that will start listening to geolocation updates
    // when a consumer subscribes.

    const locations = new Observable((observer) => {

        // Get the next and error callbacks. These will be passed in when the consumer subscribes.

        //observer这个对象定义了一些回调函数来处理可观察对象可能会发来的三种通知:
        //next	必要。用来处理每个送达值。在开始执行后可能执行零次或多次。
        //error	可选。用来处理错误通知。错误会中断这个可观察对象实例的执行过程。
        //complete	可选。用来处理执行完毕（complete）通知。当执行完毕后，这些值就会继续传给下一个处理器。

        const {next, error} = observer;
        let watchId;

        // Simple geolocation API check provides values to publish


        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(next, error);
        } else {
            error('Geolocation not available');
        }

        // When the consumer unsubscribes, clean up data ready for next subscription.

        return {unsubscribe() { navigator.geolocation.clearWatch(watchId); }};
        });

        // Call subscribe() to start listening for updates.
        //只有当有人订阅 Observable 的实例时，它才会开始发布值。 订阅时要先调用该实例的 subscribe() 方法，并把一个观察者对象传给它，用来接收通知。

        const locationsSubscription = locations.subscribe({
        next(position) { console.log('Current Position: ', position); },
        error(msg) { console.log('Error Getting Location: ', msg); }
    });

    // Stop listening for location after 10 seconds
    setTimeout(() => { locationsSubscription.unsubscribe(); }, 10000);
    ```
    ```ts
    // Create simple observable that emits three values

    //可观察对象有一个构造函数可以用来创建新实例，也可以使用 Observable 上定义的一些静态方法来创建一些常用的简单可观察对象：
    //Observable.of(...items) —— 返回一个 Observable 实例，它用同步的方式把参数中提供的这些值发送出来。
    //Observable.from(iterable) —— 把它的参数转换成一个 Observable 实例。 该方法通常用于把一个数组转换成一个（发送多个值的）可观察对象。

    const myObservable = Observable.of(1, 2, 3);
    
    // Create observer object

    const myObserver = {
        next: x => console.log('Observer got a next value: ' + x),
        error: err => console.error('Observer got an error: ' + err),
        complete: () => console.log('Observer got a complete notification'),
    };
    
    // Execute with the observer object

    myObservable.subscribe(myObserver);

    // Logs:
    // Observer got a next value: 1
    // Observer got a next value: 2
    // Observer got a next value: 3
    // Observer got a complete notification
    
    ```
    ```ts
    // This function runs when subscribe() is called
    // 同上等价形式

    function sequenceSubscriber(observer) {

        // synchronously deliver 1, 2, and 3, then complete

        observer.next(1);
        observer.next(2);
        observer.next(3);
        observer.complete();
        
        // unsubscribe function doesn't need to do anything in this
        // because values are delivered synchronously

        return {unsubscribe() {}};

    }
    
    // Create a new Observable that will deliver the above sequence
    const sequence = new Observable(sequenceSubscriber);
    
    // execute the Observable and print the result of each notification

    sequence.subscribe({
        next(num) { console.log(num); },
        complete() { console.log('Finished sequence'); }
    });

    // Logs:
    // 1
    // 2
    // 3
    // Finished sequence
    ```
    ```ts
    //subscribe() 方法还可以接收定义在同一行中的回调函数

    myObservable.subscribe(
        x => console.log('Observer got a next value: ' + x),
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification')
    );
    ```
    ```ts
    //用来发布事件的可观察对象

    function fromEvent(target, eventName) {
        return new Observable((observer) => {
            const handler = (e) => observer.next(e);
        
            // Add the event handler to the target

            target.addEventListener(eventName, handler);
        
            return () => {
                // Detach the event handler from the target

                target.removeEventListener(eventName, handler);

            };
        });
    }
    ```
    ```ts
    //创建可发布 keydown 事件的可观察对象

    const ESC_KEY = 27;
    const nameInput = document.getElementById('name') as HTMLInputElement;

    const subscription = fromEvent(nameInput, 'keydown')
    .subscribe((e: KeyboardEvent) => {
        if (e.keyCode === ESC_KEY) {
            nameInput.value = '';
        }
    });
    ```

    * 多播
    
    用来让可观察对象在一次执行中同时广播给多个订阅者。借助支持多播的可观察对象，你不必注册多个监听器，而是复用第一个（next）监听器，并且把值发送给各个订阅者。

    ```ts
    function multicastSequenceSubscriber() {
    const seq = [1, 2, 3];
    // Keep track of each observer (one for every active subscription)

    const observers = [];

    // Still a single timeoutId because there will only ever be one
    // set of values being generated, multicasted to each subscriber

    let timeoutId;
    
    // Return the subscriber function (runs when subscribe()
    // function is invoked)

    return (observer) => {
        observers.push(observer);

        // When this is the first subscription, start the sequence

        if (observers.length === 1) {
        timeoutId = doSequence({
            next(val) {

                // Iterate through observers and notify all subscriptions

                observers.forEach(obs => obs.next(val));
            },
            complete() {

                // Notify all complete callbacks

                observers.forEach(obs => obs.complete());
            }
        }, seq, 0);
        }
    
        return {
            unsubscribe() {

                // Remove from the observers array so it's no longer notified

                observers.splice(observers.indexOf(observer), 1);

                // If there's no more listeners, do cleanup

                if (observers.length === 0) {
                    clearTimeout(timeoutId);
                }
            }
        };
    };
    }
    
    // Run through an array of numbers, emitting one value
    // per second until it gets to the end of the array.

    function doSequence(observer, arr, idx) {
        return setTimeout(() => {
            observer.next(arr[idx]);
            if (idx === arr.length - 1) {
            observer.complete();
            } else {
            doSequence(observer, arr, idx++);
            }
        }, 1000);
    }
    
    // Create a new Observable that will deliver the above sequence

    const multicastSequence = new Observable(multicastSequenceSubscriber);
    
    // Subscribe starts the clock, and begins to emit after 1 second

    multicastSequence.subscribe({
        next(num) { console.log('1st subscribe: ' + num); },
        complete() { console.log('1st sequence finished.'); }
    });
    
    // After 1 1/2 seconds, subscribe again (should "miss" the first value).

    setTimeout(() => {
        multicastSequence.subscribe({
            next(num) { console.log('2nd subscribe: ' + num); },
            complete() { console.log('2nd sequence finished.'); }
        });
    }, 1500);
    
    // Logs:
    // (at 1 second): 1st subscribe: 1
    // (at 2 seconds): 1st subscribe: 2
    // (at 2 seconds): 2nd subscribe: 2
    // (at 3 seconds): 1st subscribe: 3
    // (at 3 seconds): 1st sequence finished
    // (at 3 seconds): 2nd subscribe: 3
    // (at 3 seconds): 2nd sequence finished
    ```

    * RxJS 库

    可以简化事件、定时器、承诺等创建可观察对象的过程

    ```ts
    //承诺

    import { fromPromise } from 'rxjs';

    // Create an Observable out of a promise

    const data = fromPromise(fetch('/api/endpoint'));

    // Subscribe to begin listening for async result

    data.subscribe({
        next(response) { console.log(response); },
        error(err) { console.error('Error: ' + err); },
        complete() { console.log('Completed'); }
    });
    ```
    ```ts
    //定时器

    import { interval } from 'rxjs';

    // Create an Observable that will publish a value on an interval

    const secondsCounter = interval(1000);

    // Subscribe to begin publishing values

    secondsCounter.subscribe(n =>
        console.log(`It's been ${n} seconds since subscribing!`));
    ```

    ```ts
    //事件

    import { fromEvent } from 'rxjs';
    const el = document.getElementById('my-element');
    
    // Create an Observable that will publish mouse movements

    const mouseMoves = fromEvent(el, 'mousemove');
    
    // Subscribe to start listening for mouse-move events

    const subscription = mouseMoves.subscribe((evt: MouseEvent) => {
        // Log coords of mouse movements

        console.log(`Coords: ${evt.clientX} X ${evt.clientY}`);
        
        // When the mouse is over the upper-left of the screen,
        // unsubscribe to stop listening for mouse movements
        
        if (evt.clientX < 40 && evt.clientY < 40) {
            subscription.unsubscribe();
        }
    });
    ```
    ```ts
    //ajax

    import { ajax } from 'rxjs/ajax';

    // Create an Observable that will create an AJAX request

    const apiData = ajax('/api/data');

    // Subscribe to create the request

    apiData.subscribe(res => console.log(res.status, res.response));
    ```

    RxJS 定义了一些操作符，比如 map()、filter()、concat() 和 flatMap()。

    常用操作符

    创建	from , fromPromise , fromEvent , of

    组合	combineLatest , concat , merge , startWith , withLatestFrom , zip

    过滤	debounceTime , distinctUntilChanged , filter , take , takeUntil

    转换	bufferTime , concatMap , map , mergeMap , scan , switchMap

    工具	tap

    多播	share

    ```ts
    import { map } from 'rxjs/operators';
 
    const nums = of(1, 2, 3);
    
    //map会观察来源可观察对象中发出的值，转换它们，并返回由转换后的值组成的新的可观察对象

    const squareValues = map((val: number) => val * val);
    const squaredNums = squareValues(nums);
    
    squaredNums.subscribe(x => console.log(x));
    
    // Logs
    // 1
    // 4
    // 9
    ```
    ```ts
    import { filter, map } from 'rxjs/operators';
 
    const nums = of(1, 2, 3, 4, 5);
    
    // Create a function that accepts an Observable.
    //pipe() 函数以你要组合的这些函数作为参数，并且返回一个新的函数，当执行这个新函数时，就会顺序执行那些被组合进去的函数。

    const squareOddVals = pipe(
        filter(n => n % 2),
        map(n => n * n)
    );

    //可简写为

    const squareOdd = of(1, 2, 3, 4, 5)
    .pipe(
        filter(n => n % 2 !== 0),
        map(n => n * n)
    );
    
    // Create an Observable that will run the filter and map functions

    const squareOdd = squareOddVals(nums);
    
    // Suscribe to run the combined functions

    squareOdd.subscribe(x => console.log(x));

    ```
    ```ts
    import { ajax } from 'rxjs/ajax';
    import { map, retry, catchError } from 'rxjs/operators';
    
    const apiData = ajax('/api/data').pipe(
        //错误重试3次

        retry(3), 
        map(res => {
            if (!res.response) {
            throw new Error('Value expected!');
            }
            return res.response;
        }),
        //错误处理

        catchError(err => of([]))
    );
    
    apiData.subscribe({
        next(x) { console.log('data: ', x); },
        error(err) { console.log('errors already caught... will not run'); }
    });
    ```
    ```ts
    import { Component } from '@angular/core';
    import { Observable } from 'rxjs';
    
    @Component({
    selector: 'app-stopwatch',
    templateUrl: './stopwatch.component.html'
    })
    export class StopwatchComponent {

        //命名约定：可观察对象一般以$结尾，属性储存不带$

        stopwatchValue: number;
        stopwatchValue$: Observable<number>;
        
        start() {
            this.stopwatchValue$.subscribe(num =>
                this.stopwatchValue = num
            );
        }
    }
    ```

    * 更多可观察对象

    事件发送器 EventEmitter 用来从组件的 @Output() 属性中发布一些值。

    HTTP http.get(‘/api’) 就会返回可观察对象。

    AsyncPipe 会订阅一个可观察对象或承诺，并返回其发出的最后一个值。

    路由器 (router) 可以使用 RxJS 中的 filter() 操作符来找到感兴趣的事件，并且订阅它们，以便根据浏览过程中产生的事件序列作出决定。

    ```ts
    import { Router, NavigationStart } from '@angular/router';
    import { filter } from 'rxjs/operators';
    
    @Component({
    selector: 'app-routable',
    templateUrl: './routable.component.html',
    styleUrls: ['./routable.component.css']
    })
    export class Routable1Component implements OnInit {
    
        navStart: Observable<NavigationStart>;
        
        constructor(private router: Router) {
            
            // Create a new Observable the publishes only the NavigationStart event

            this.navStart = router.events.pipe(
            filter(evt => evt instanceof NavigationStart)
            ) as Observable<NavigationStart>;
        }
        
        ngOnInit() {
            this.navStart.subscribe(evt => console.log('Navigation Started!'));
        }
    }
    ```

    ActivatedRoute 是一个可注入的路由器服务，它使用可观察对象来获取关于路由路径和路由参数的信息。比如，ActivateRoute.url 包含一个用于汇报路由路径的可观察对象。

    ```ts
    import { ActivatedRoute } from '@angular/router';

    @Component({
    selector: 'app-routable',
    templateUrl: './routable.component.html',
    styleUrls: ['./routable.component.css']
    })
    export class Routable2Component implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.url
        .subscribe(url => console.log('The URL changed to: ' + url));
    }
    }
    ```

    响应式表单 (reactive forms) FormControl 的 valueChanges 属性和 statusChanges 属性包含了会发出变更事件的可观察对象。订阅可观察的表单控件属性是在组件类中触发应用逻辑的途径之一。
    ```ts
    import { FormGroup } from '@angular/forms';

    @Component({
    selector: 'my-component',
    template: 'MyComponent Template'
    })
    export class MyComponent implements OnInit {
    nameChangeLog: string[] = [];
    heroForm: FormGroup;

    ngOnInit() {
        this.logNameChange();
    }
    logNameChange() {
        const nameControl = this.heroForm.get('name');
        nameControl.valueChanges.forEach(
        (value: string) => this.nameChangeLog.push(value)
        );
    }
    }
    ```

    * 用法场景

    (1)输入提示（type-ahead）建议：

        从输入中监听数据。

        移除输入值前后的空白字符，并确认它达到了最小长度。

        防抖（这样才能防止连续按键时每次按键都发起 API 请求，而应该等到按键出现停顿时才发起）

        如果输入值没有变化，则不要发起请求（比如按某个字符，然后快速按退格）。

        如果已发出的 AJAX 请求的结果会因为后续的修改而变得无效，那就取消它。

    ```ts
    import { fromEvent } from 'rxjs';
    import { ajax } from 'rxjs/ajax';
    import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

    const searchBox = document.getElementById('search-box');

    const typeahead = fromEvent(searchBox, 'input').pipe(
    map((e: KeyboardEvent) => e.target.value),
    filter(text => text.length > 2),
    debounceTime(10),
    distinctUntilChanged(),
    switchMap(() => ajax('/api/endpoint'))
    );

    typeahead.subscribe(data => {
        // Handle the data from the API
    });
    ```

    (2)指数化退避

    指数化退避是一种失败后重试 API 的技巧，它会在每次连续的失败之后让重试时间逐渐变长，超过最大重试次数之后就会彻底放弃。

    ```ts
    import { pipe, range, timer, zip } from 'rxjs';
    import { ajax } from 'rxjs/ajax';
    import { retryWhen, map, mergeMap } from 'rxjs/operators';

    function backoff(maxTries, ms) {
    return pipe(
    retryWhen(attempts => range(1, maxTries)
        .pipe(
        zip(attempts, (i) => i),
        map(i => i * i),
        mergeMap(i =>  timer(i * ms))
        )
    )
    );
    }

    ajax('/api/endpoint')
    .pipe(backoff(3, 250))
    .subscribe(data => handleData(data));

    function handleData(data) {
    // ...
    }
    ```

10. 依赖注入

    A类需要使用B类，所以B类是A类的外部资源，不用依赖注入时，B类的改动(如构造函数多了个参数)都会导致A类的改动。依赖注入模式中，A类向注入容器拿B类实例,注入容器把B类注入A类中。

    依赖注入(Dependency Injection,DI):A类依赖容器注入外部资源B类。

    控制反转(Inversion Of Control,IOC):容器反向控制A类的外部资源B类。

    ```ts
    import { Injectable } from '@angular/core';

    @Injectable({
        providedIn: 'root',
    })
    export class HeroService {
        constructor() { }
    }
    ```
    ```ts
    import { Component } from '@angular/core';
    import { HeroService } from './hero.service';

    @Component({
        selector: 'app-heroes',
        providers: [ HeroService ],

        //[{ provide: Logger, useClass: Logger }]上方简写：请求 Logger 时，返回 Logger
        //[{ provide: Logger, useClass: BetterLogger }]用于备选的类提供商的情况

        template: `
            <h2>Heroes</h2>
            <app-hero-list></app-hero-list>
        `
    })
    export class HeroesComponent { }
    ```
    备选的类提供商
    ```ts
    @Injectable()
    export class EvenBetterLogger extends Logger {
        constructor(private userService: UserService) { super(); }

        log(message: string) {
            let name = this.userService.user.name;
            super.log(`Message to ${name}: ${message}`);
        }
    }
    ```
    别名类提供商:解决接口相同，功能不同的服务
    ```ts
    [ NewLogger,{ provide: OldLogger, useClass: NewLogger}]改为下面写法
    [ NewLogger,{ provide: OldLogger, useExisting: NewLogger}]
    ```
    值提供商
    ```ts
    export function SilentLoggerFn() {}

    const silentLogger = {
        logs: ['Silent logger says "Shhhhh!". Provided via "useValue"'],
        log: SilentLoggerFn
    };
    ```
    ```ts
    [{ provide: Logger, useValue: silentLogger }]
    ```
    工厂提供商
    ```ts
    constructor(
        private logger: Logger,
        private isAuthorized: boolean) { }

    getHeroes() {
        let auth = this.isAuthorized ? 'authorized ' : 'unauthorized';
        this.logger.log(`Getting heroes for ${auth} user.`);
        return HEROES.filter(hero => this.isAuthorized || !hero.isSecret);
    }
    ```
    ```ts
    let heroServiceFactory = (logger: Logger, userService: UserService) => {
        return new HeroService(logger, userService.user.isAuthorized);
    };
    ```
    ```ts
    export let heroServiceProvider =
    { provide: HeroService,
        useFactory: heroServiceFactory,
        deps: [Logger, UserService]
    };
    ```
    服务需要别的服务:用构造函数注入模式，来添加一个带有参数的构造函数。
    ```ts
    import { Injectable } from '@angular/core';
    import { HEROES }     from './mock-heroes';
    import { Logger }     from '../logger.service';

    @Injectable({
        providedIn: 'root',
    })
    export class HeroService {

        constructor(private logger: Logger) {  }

        getHeroes() {
            this.logger.log('Getting heroes ...');
            return HEROES;
        }
    }
    ```
    ```ts
    import { Injectable } from '@angular/core';

    @Injectable()
    export class Logger {
        logs: string[] = []; // capture logs for testing

        log(message: string) {
            this.logs.push(message);
            console.log(message);
        }
    }
    ```
    非类依赖:InjectionToken 值
    ```ts
    import { InjectionToken } from '@angular/core';
    export const TOKEN = new InjectionToken('desc');
    ```
    创建 InjectionToken 时直接配置一个提供商。该提供商的配置会决定由哪个注入器来提供这个令牌，以及如何创建它的值。 这和 @Injectable 的用法很像，不过你没法用 InjectionToken 来定义标准提供商（比如 useClass 或 useFactory），而要指定一个工厂函数，该函数直接返回想要提供的值。
    ```ts
    export const TOKEN = new InjectionToken('desc', { providedIn: 'root', factory: () => new AppConfig(), })
    ```
    配置对象注入
    ```ts
    constructor(@Inject(TOKEN));
    ```
    可选依赖
    ```ts
    constructor(@Inject(Token, null));
    ```
    工厂函数需要访问其它的 DI 令牌
    ```ts
    const TOKEN = new InjectionToken('tree-shakeable token', { providedIn: 'root', factory: () => new AppConfig(inject(Parameter1), inject(Paremeter2)), });
    ```
    直接使用注入器
    ```ts
    @Component({
        selector: 'app-injectors',
        template: `
        <h2>Other Injections</h2>
        <div id="car">{{car.drive()}}</div>
        <div id="hero">{{hero.name}}</div>
        <div id="rodent">{{rodent}}</div>
        `,
        providers: [Car, Engine, Tires, heroServiceProvider, Logger]
    })
    export class InjectorComponent implements OnInit {
        car: Car;

        heroService: HeroService;
        hero: Hero;

        constructor(private injector: Injector) { }

        ngOnInit() {
            this.car = this.injector.get(Car);
            /*这些服务本身没有注入到组件，它们是通过调用 injector.get() 获得的。
            get() 方法如果不能解析所请求的服务，会抛出异常。 调用 get() 时，还可以使用第二个参数，一旦获取的服务没有在当前或任何祖先注入器中注册过， 就把它作为返回值。
            */
            this.heroService = this.injector.get(HeroService);
            this.hero = this.heroService.getHeroes()[0];
        }

        get rodent() {
            let rousDontExist = `R.O.U.S.'s? I don't think they exist!`;
            return this.injector.get(ROUS, rousDontExist);
        }
    }
    ```
    当 Angular 找不到依赖时，@Optional 装饰器会告诉 Angular 继续执行。Angular 把此注入参数设置为 null(而不用默认的抛出错误的行为)。

    @Host 装饰器将把往上搜索的行为截止在宿主组件
    ```ts
    @Component({
        selector: 'app-hero-bios-and-contacts',
        template: `
            <app-hero-bio [heroId]="1"> <app-hero-contact></app-hero-contact> </app-hero-bio>
            <app-hero-bio [heroId]="2"> <app-hero-contact></app-hero-contact> </app-hero-bio>
            <app-hero-bio [heroId]="3"> <app-hero-contact></app-hero-contact> </app-hero-bio>`,
        providers: [HeroService]
    })
    export class HeroBiosAndContactsComponent {
        constructor(logger: LoggerService) {
            logger.logInfo('Creating HeroBiosAndContactsComponent');
        }
    }
    ```
    ```ts
    @Component({
        selector: 'app-hero-contact',
        template: `
        <div>Phone #: {{phoneNumber}}
        <span *ngIf="hasLogger">!!!</span></div>`
    })
    export class HeroContactComponent {

    hasLogger = false;

    constructor(
        @Host() /* limit to the host component's instance of the HeroCacheService */
        private heroCache: HeroCacheService,

        @Host()     /* limit search for logger; hides the application-wide logger*/
        @Optional() /* ok if the logger doesn't exist */
        private loggerService: LoggerService
    ) {
        if (loggerService) {
        this.hasLogger = true;
        loggerService.logInfo('HeroContactComponent can log!');
        }
    }

    get phoneNumber() { return this.heroCache.hero.phone; }

    }
    ```
    注入组件的 DOM 元素
    ```ts
    import { Directive, ElementRef, HostListener, Input } from '@angular/core';

    @Directive({
        selector: '[appHighlight]'
    })
    export class HighlightDirective {

        @Input('appHighlight') highlightColor: string;

        private el: HTMLElement;

        constructor(el: ElementRef) {
            this.el = el.nativeElement;
        }

        @HostListener('mouseenter') onMouseEnter() {
            this.highlight(this.highlightColor || 'cyan');
        }

        @HostListener('mouseleave') onMouseLeave() {
            this.highlight(null);
        }

        private highlight(color: string) {
            this.el.style.backgroundColor = color;
        }
    }
    ```
    解决依赖循环 @SkipSelf
    ```ts
    constructor( @SkipSelf() @Optional() public parent: Parent ) { }
    ```
    provideParent()助手函数：编写父组件相同的各种别名提供商很快就会变得啰嗦，在用forwardRef的时候尤其绕口。使用一个前向引用(forwardRef)来打破循环
    ```ts
    providers: [{ provide: Parent, useExisting: forwardRef(() => AlexComponent) }],

    改为:

    const provideParent =(component: any) => {
    return { provide: Parent, useExisting: forwardRef(() => component) };};

    providers:  [ provideParent(AliceComponent) ]

    默认接口：

    const provideParent = (component: any, parentType?: any) => {
    return { provide: parentType || Parent, useExisting: forwardRef(() => component) };};

    providers:  [ provideParent(BethComponent, DifferentParent) ]
    ```
    
11. HttpClient

    (1)根模块 AppModule 导入
    ```ts
    import { NgModule }         from '@angular/core';
    import { BrowserModule }    from '@angular/platform-browser';
    import { HttpClientModule } from '@angular/common/http';

    @NgModule({
        imports: [
            BrowserModule,
            HttpClientModule,
        ],
        declarations: [
            AppComponent,
        ],
        bootstrap: [ AppComponent ]
    })
    export class AppModule {}
    ```

    (2)注入到应用,并通过http.get获取特定资源，如这里的json文件
    ```ts
    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';

    @Injectable()
    export class ConfigService {
        constructor(private http: HttpClient) { }

        configUrl = 'assets/config.json';

        getConfig() {
            匿名对象，需要data['heroesUrl']获取数据
            return this.http.get(this.configUrl);
            带类型get，可data.heroesUrl获取数据
            return this.http.get<Config>(this.configUrl);
        }
    }
    ```
    (3)调用方法。这个服务方法返回配置数据的 Observable 对象，所以组件要订阅（subscribe） 该方法的返回值。订阅时的回调函数会把这些数据字段复制到组件的 config 对象中，它会在组件的模板中绑定，以供显示。
    ```ts
    showConfig() {
        this.configService.getConfig()
            .subscribe((data: Config) => this.config = {
                heroesUrl: data['heroesUrl'],
                textfile:  data['textfile']
            });
    }
    ```
    (4)读取完整的响应体，包含响应头或状态码
    ```ts
    getConfigResponse(): Observable<HttpResponse<Config>> {
        return this.http.get<Config>(
            this.configUrl, { observe: 'response' });
    }
    ```
    ```ts
    showConfigResponse() {
        this.configService.getConfigResponse()
            .subscribe(resp => {
                const keys = resp.headers.keys();
                this.headers = keys.map(key =>
                    `${key}: ${resp.headers.get(key)}`);

                this.config = { ... resp.body };
            });
    }
    ```
    (5)错误处理
    ```ts
    showConfig() {
    this.configService.getConfig()
        .subscribe(
        (data: Config) => this.config = { ...data }, 
        error => this.error = error 
        );
    }
    ```
    (6)错误处理器
    ```ts
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        return throwError(
            'Something bad happened; please try again later.');
    };
    ```
    (7)错误通过管道传给处理器,可用retry重试
    ```ts
    getConfig() {
        return this.http.get<Config>(this.configUrl)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }
    ```
    (8)请求非 JSON 格式的数据,如txt
    ```ts
    getTextFile(filename: string) {
        return this.http.get(filename, {responseType: 'text'})
            .pipe(
                tap(
                    data => this.log(filename, data),
                    error => this.logError(filename, error)
                )
            );
    }
    ```
    ```ts
    download() {
        this.downloaderService.getTextFile('assets/textfile.txt')
            .subscribe(results => this.contents = results);
    }
    ```
    (9)数据发送到服务器
    ```ts
    import { HttpHeaders } from '@angular/common/http';
    
    const httpOptions = {
        添加请求头
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'my-auth-token'
        })
    };
    配置请求头
    httpOptions.headers =
    httpOptions.headers.set('Authorization', 'my-new-auth-token');

    addHero (hero: Hero): Observable<Hero> {
         POST 请求
        return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
            .pipe(
                catchError(this.handleError('addHero', hero))
            );
    }

    对应订阅
    this.heroesService.addHero(newHero)
        .subscribe(hero => this.heroes.push(hero));

    deleteHero (id: number): Observable<{}> {
        DELETE 请求
        const url = `${this.heroesUrl}/${id}`; 
        return this.http.delete(url, httpOptions)
            .pipe(
                catchError(this.handleError('deleteHero'))
            );
    }

    对应订阅
    this.heroesService.deleteHero(hero.id).subscribe();
    该组件不会等待删除操作的结果，所以它的 subscribe 中没有回调函数。不过就算你不关心结果，也仍然要订阅它。调用 subscribe() 方法会执行这个可观察对象，这时才会真的发起 DELETE 请求。

    updateHero (hero: Hero): Observable<Hero> {
         PUT 请求
        return this.http.put<Hero>(this.heroesUrl, hero, httpOptions)
            .pipe(
                catchError(this.handleError('updateHero', hero))
            );
    }

    searchHeroes(term: string): Observable<Hero[]> {
        term = term.trim();

        URL 参数：HttpParams 是不可变的，所以你也要使用 set() 方法来修改这些选项。
        const options = term ?
        { params: new HttpParams().set('name', term) } : {};

        return this.http.get<Hero[]>(this.heroesUrl, options)
            .pipe(
            catchError(this.handleError<Hero[]>('searchHeroes', []))
            );
    }
    ```
    (10)请求的防抖（debounce）(keyup) 事件绑定把每次击键都发送一次请求就太昂贵了。 最好能等到用户停止输入时才发送请求。
    ```html
    <input (keyup)="search($event.target.value)" id="name" placeholder="Search"/>

    <ul>
        <li *ngFor="let package of packages$ | async">
            <b>{{package.name}} v.{{package.version}}</b> -
            <i>{{package.description}}</i>
        </li>
    </ul>
    ```
    ```ts
    withRefresh = false;
    packages$: Observable<NpmPackageInfo[]>;

    searchText$ 是一个序列，包含用户输入到搜索框中的所有值。 它定义成了 RxJS 的 Subject 对象，这表示它是一个多播 Observable，同时还可以自行调用 next(value) 来产生值。

    private searchText$ = new Subject<string>();

    search(packageName: string) {
        this.searchText$.next(packageName);
    }

    ngOnInit() {

        效果：只有当用户停止了输入且搜索值和以前不一样的时候，搜索值才会传给服务。

        this.packages$ = this.searchText$.pipe(

            debounceTime(500),等待500ms，直到用户停止输入

            distinctUntilChanged(),等待，直到搜索内容发生了变化

            下面switchMap()它的参数是一个返回 Observable 的函数。如果以前的搜索结果仍然是在途状态（这会出现在慢速网络中），它会取消那个请求，并发起这个新的搜索。它会按照原始的请求顺序返回这些服务的响应，而不用关心服务器实际上是以乱序返回的它们。

            switchMap(packageName =>
                this.searchService.search(packageName, this.withRefresh))
            把搜索请求发送给服务
        );
    }

    constructor(private searchService: PackageSearchService) { }
    ```
    (11)拦截请求和响应

    空白拦截器，它只会不做任何修改的传递这个请求
    ```ts
    import { Injectable } from '@angular/core';
    import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
    } from '@angular/common/http';

    import { Observable } from 'rxjs';

    /** Pass untouched request through to the next request handler. */
    @Injectable()
    export class NoopInterceptor implements HttpInterceptor {

        intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
            return next.handle(req);
        }
    }
    ```
    提供拦截器,并把它加到 AppModule 的 providers 数组中
    ```ts
    import { HTTP_INTERCEPTORS } from '@angular/common/http';

    import { NoopInterceptor } from './noop-interceptor';

    /**  HTTP_INTERCEPTORS 是一个多重提供商的令牌 */
    export const httpInterceptorProviders = [
        { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
    ];
    ```
    ```ts
    providers: [
        httpInterceptorProviders
    ],
    ```
    拦截器的顺序:提供拦截器的顺序是A->B->C，请求阶段的执行顺序就是 A->B->C，而响应阶段的执行顺序则是 C->B->A

    拦截器有能力改变请求和响应，但 HttpRequest 和 HttpResponse 实例的属性却是只读（readonly）的。要想修改该请求，就要先克隆它，并修改这个克隆体，然后再把这个克隆体传给 next.handle()。
    ```ts
    const secureReq = req.clone({
        url: req.url.replace('http://', 'https://')
    });
    return next.handle(secureReq);
    ```

    readonly 这种赋值保护，无法防范深修改（修改子对象的属性），也不能防范你修改请求体对象中的属性。如果你必须修改请求体，那么就要先复制它，然后修改这个复本，clone() 这个请求，然后把这个请求体的复本作为新的请求体.
    ```ts
    const newBody = { ...body, name: body.name.trim() };
    const newReq = req.clone({ body: newBody });
    return next.handle(newReq);
    ```
    清空请求体
    ```ts
    newReq = req.clone({ body: null });
    ```
    设置默认请求头
    ```ts
    import { AuthService } from '../auth.service';

    @Injectable()
    export class AuthInterceptor implements HttpInterceptor {

        constructor(private auth: AuthService) {}

        intercept(req: HttpRequest<any>, next: HttpHandler) {
            const authToken = this.auth.getAuthorizationToken();

            const authReq = req.clone({
                headers: req.headers.set('Authorization', authToken)
            });
            也可：
            const authReq = req.clone({ setHeaders: { Authorization: authToken } });

            return next.handle(authReq);
        }
    }
    ```
    记日志
    ```ts
    import { finalize, tap } from 'rxjs/operators';
    import { MessageService } from '../message.service';

    @Injectable()
    export class LoggingInterceptor implements HttpInterceptor {
        constructor(private messenger: MessageService) {}

        intercept(req: HttpRequest<any>, next: HttpHandler) {
            const started = Date.now();
            let ok: string;

            return next.handle(req)
            .pipe(
                会捕获请求成功了还是失败了
                tap(
                    event => ok = event instanceof HttpResponse ? 'succeeded' : '',
                    error => ok = 'failed'
                ),
                无论在响应成功还是失败时都会调用
                finalize(() => {
                    const elapsed = Date.now() - started;
                    const msg = `${req.method} "${req.urlWithParams}"
                        ${ok} in ${elapsed} ms.`;
                    this.messenger.add(msg);
                })
            );
        }
    }
    ```
    缓存
    ```ts
    @Injectable()
    export class CachingInterceptor implements HttpInterceptor {
        constructor(private cache: RequestCache) {}

        intercept(req: HttpRequest<any>, next: HttpHandler) {
            if (!isCachable(req)) { return next.handle(req); }

            const cachedResponse = this.cache.get(req);
            return cachedResponse ?
            of(cachedResponse) : sendRequest(req, next, this.cache);
        }

        function sendRequest(
            req: HttpRequest<any>,
            next: HttpHandler,
            cache: RequestCache): Observable<HttpEvent<any>> {
            
                const noHeaderReq = req.clone({ headers: new HttpHeaders() });
                
                return next.handle(noHeaderReq).pipe(
                    tap(event => {
                        if (event instanceof HttpResponse) {
                            cache.put(req, event);
                        }
                    })
                );
            }
        )
    }
    ```
    返回多值可观察对象
    ```ts
    if (req.headers.get('x-refresh')) {
        const results$ = sendRequest(req, next, this.cache);
        return cachedResponse ?
            results$.pipe( startWith(cachedResponse) ) :
            results$;
    }
    return cachedResponse ?
        of(cachedResponse) : sendRequest(req, next, this.cache);
    ```
    (12)监听进度事件(文件上传)
    ```ts
    private getEventMessage(event: HttpEvent<any>, file: File) {
        switch (event.type) {
            case HttpEventType.Sent:
            return `Uploading file "${file.name}" of size ${file.size}.`;

            case HttpEventType.UploadProgress:
            const percentDone = Math.round(100 * event.loaded / event.total);
            return `File "${file.name}" is ${percentDone}% uploaded.`;

            case HttpEventType.Response:
            return `File "${file.name}" was completely uploaded!`;

            default:
            return `File "${file.name}" surprising upload event: ${event.type}.`;
        }
    }

    const req = new HttpRequest('POST', '/upload/file', file, {
        reportProgress: true
    });

    return this.http.request(req).pipe(
        map(event => this.getEventMessage(event, file)),
        tap(message => this.showProgress(message)),
        last(), 
        catchError(this.handleError(file))
    );
    ```

12. 路由router

    (1)常用样例
    ```ts
    app.module.ts:
    path 不能以斜杠（/）开头
    const appRoutes: Routes = [
        { path: 'crisis-center', component: CrisisListComponent },
        { path: 'hero/:id',      component: HeroDetailComponent },
        {
            path: 'heroes',
            component: HeroListComponent,
            data: { title: 'Heroes List' }
        },
        空路径（''）表示应用的默认路径，当 URL 为空时就会访问那里
        { path: '',
            redirectTo: '/heroes',
            pathMatch: 'full'
        },
        当所请求的 URL 不匹配前面定义的路由表中的任何路径时，路由器就会选择此路由。 这个特性可用于显示“404 - Not Found”页，或自动重定向到其它路由。
        { path: '**', component: PageNotFoundComponent }
    ];

    @NgModule({
        imports: [
            RouterModule.forRoot(
            appRoutes,
            它会把每个导航生命周期中的事件输出到浏览器的控制台
            { enableTracing: true }
            )
        ],
        ...
    })
    export class AppModule { }
    ```
    ```html
    <h1>Angular Router</h1>
    <nav>
        <a routerLink="/crisis-center" routerLinkActive="active">Crisis Center</a>
        <a routerLink="/heroes" routerLinkActive="active">Heroes</a>
    </nav>
    <router-outlet></router-outlet>路由出口
    ```
    也可把路由设置为单独模块,在app.module.ts的import和imports引用即可
    ```ts
    import { NgModule }              from '@angular/core';
    import { RouterModule, Routes }  from '@angular/router';

    import { CrisisListComponent }   from './crisis-list.component';
    import { HeroListComponent }     from './hero-list.component';
    import { PageNotFoundComponent } from './not-found.component';

    const appRoutes: Routes = [
        { path: 'crisis-center', component: CrisisListComponent },
        { path: 'heroes',        component: HeroListComponent },
        { path: '',   redirectTo: '/heroes', pathMatch: 'full' },
        { path: '**', component: PageNotFoundComponent }
    ];

    @NgModule({
        imports: [
            RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } 
            )
        ],
        exports: [
            RouterModule
        ]
    })
    export class AppRoutingModule {}
    ```
    只在根模块 AppRoutingModule 中调用 RouterModule.forRoot（如果在 AppModule 中注册应用的顶级路由，那就在 AppModule 中调用）。 在其它模块中，你就必须调用RouterModule.forChild方法来注册附属路由。
    ```ts
    @NgModule({
        imports: [
            RouterModule.forChild(heroesRoutes)
        ],
        exports: [
            RouterModule
        ]
    })
    ```
    如有顺序很重要，先匹配的先跳转，通配符应放到后面。

    (2)路由属性
    * url

        路由路径的 Observable 对象，是一个由路由路径中的各个部分组成的字符串数组。

    * data

        一个 Observable，其中包含提供给路由的 data 对象。也包含由解析守卫（resolve guard）解析而来的值。

    * paramMap

        一个 Observable，其中包含一个由当前路由的必要参数和可选参数组成的map对象。用这个 map 可以获取来自同名参数的单一值或多重值。

    * queryParamMap

        一个 Observable，其中包含一个对所有路由都有效的查询参数组成的map对象。 用这个 map 可以获取来自查询参数的单一值或多重值。

    * fragment

        一个适用于所有路由的 URL 的 fragment（片段）的 Observable。

    * outlet

        要把该路由渲染到的 RouterOutlet 的名字。对于无名路由，它的路由名是 primary，而不是空串。

    * routeConfig

        用于该路由的路由配置信息，其中包含原始路径。

    * parent

        当该路由是一个子路由时，表示该路由的父级 ActivatedRoute。

    * firstChild

        包含该路由的子路由列表中的第一个 ActivatedRoute。

    * children

        包含当前路由下所有已激活的子路由。

    (3)路由事件

    * NavigationStart

        本事件会在导航开始时触发。

    * RoutesRecognized

        本事件会在路由器解析完 URL，并识别出了相应的路由时触发

    * RouteConfigLoadStart

        本事件会在 Router 对一个路由配置进行惰性加载之前触发。

    * RouteConfigLoadEnd

        本事件会在路由被惰性加载之后触发。

    * NavigationEnd

        本事件会在导航成功结束之后触发。

    * NavigationCancel

        本事件会在导航被取消之后触发。 这可能是因为在导航期间某个路由守卫返回了 false。

    * NavigationError

        这个事件会在导航由于意料之外的错误而失败时触发。

    (4)路由器部件

    * Router（路由器）

        为激活的 URL 显示应用组件。管理从一个组件到另一个组件的导航

    * RouterModule

        一个独立的 Angular 模块，用于提供所需的服务提供商，以及用来在应用视图之间进行导航的指令。

    * Routes（路由数组）

        定义了一个路由数组，每一个都会把一个 URL 路径映射到一个组件。

    * Route（路由）

        定义路由器该如何根据 URL 模式（pattern）来导航到组件。大多数路由都由路径和组件类构成。

    * RouterOutlet（路由出口）

        该指令（<router-outlet>）用来标记出路由器该在哪里显示视图。

    * RouterLink（路由链接）

        这个指令把可点击的 HTML 元素绑定到某个路由。点击带有 routerLink 指令（绑定到字符串或链接参数数组）的元素时就会触发一次导航。

    * RouterLinkActive（活动路由链接）

        当 HTML 元素上或元素内的routerLink变为激活或非激活状态时，该指令为这个 HTML 元素添加或移除 CSS 类。

    * ActivatedRoute（激活的路由）

        为每个路由组件提供提供的一个服务，它包含特定于路由的信息，比如路由参数、静态数据、解析数据、全局查询参数和全局碎片（fragment）。

    * RouterState（路由器状态）

        路由器的当前状态包含了一棵由程序中激活的路由构成的树。它包含一些用于遍历路由树的快捷方法。

    * 链接参数数组

        这个数组会被路由器解释成一个路由操作指南。你可以把一个RouterLink绑定到该数组，或者把它作为参数传给Router.navigate方法。

    * 路由组件

        一个带有RouterOutlet的 Angular 组件，它根据路由器的导航来显示相应的视图。

    (5)获取参数

    用 ActivatedRoute 服务来接收路由的参数，从参数中取得 id
    ```ts
    ngOnInit() {
        this.hero$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.service.getHero(params.get('id')))
        );
    }
    ```

    ParamMap API:

    * has(name)

        如果参数名位于参数列表中，就返回 true 。

    * get(name)

        如果这个 map 中有参数名对应的参数值（字符串），就返回它，否则返回 null。如果参数值实际上是一个数组，就返回它的第一个元素。

    * getAll(name)

        如果这个 map 中有参数名对应的值，就返回一个字符串数组，否则返回空数组。当一个参数名可能对应多个值的时候，请使用 getAll。

    * keys

        返回这个 map 中的所有参数名组成的字符串数组。

    如果很确定组件不会被复用，可用snapshot
    ```ts
    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');

        this.hero$ = this.service.getHero(id);
    }
    ```

    (6)导航跳转
    ```ts
    gotoHeroes() {
        this.router.navigate(['/heroes']);
    }
    ```

    (7)路由动画
    ```ts
    import { animate, state, style, transition, trigger } from '@angular/animations';

    export const slideInDownAnimation =
    trigger('routeAnimation', [
        state('*',
            style({
                opacity: 1,
                transform: 'translateX(0)'
            })
        ),
        transition(':enter', [
            style({
                opacity: 0,
                transform: 'translateX(-100%)'
            }),
            animate('0.2s ease-in')
        ]),
        transition(':leave', [
            animate('0.5s ease-out', style({
                opacity: 0,
                transform: 'translateY(100%)'
            }))
        ])
    ]);
    ```

    (8)子路由
    ```ts
    import { NgModule }             from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';

    import { CrisisCenterHomeComponent } from './crisis-center-home.component';
    import { CrisisListComponent }       from './crisis-list.component';
    import { CrisisCenterComponent }     from './crisis-center.component';
    import { CrisisDetailComponent }     from './crisis-detail.component';

    要导航到 CrisisCenterHomeComponent，完整的 URL 是 /crisis-center (/crisis-center + '' + '')。
    要导航到 CrisisDetailComponent，完整的 URL 是 /crisis-center/2 (/crisis-center + '' + '/2')。
    const crisisCenterRoutes: Routes = [
    {
        path: 'crisis-center',
        component: CrisisCenterComponent,
        children: [
        {
            path: '',
            component: CrisisListComponent,
            children: [
            {
                path: ':id',
                component: CrisisDetailComponent
            },
            {
                path: '',
                component: CrisisCenterHomeComponent
            }
            ]
        }
        ]
    }
    ];

    @NgModule({
    imports: [
        RouterModule.forChild(crisisCenterRoutes)
    ],
    exports: [
        RouterModule
    ]
    })
    export class CrisisCenterRoutingModule { }
    ```
    (9)相对导航
    ```ts
    ./ 或 无前导斜线 形式是相对于当前级别的。
    ../ 会回到当前路由路径的上一级。
    this.router.navigate(['../', { id: crisisId, foo: 'foo' }], { relativeTo: this.route });
    ```
    (10)用命名出口（outlet）显示多重路由:解决弹出框路由问题
    ```html
    <a [routerLink]="[{ outlets: { popup: ['compose'] } }]">Contact</a>
    <router-outlet></router-outlet>
    <router-outlet name="popup"></router-outlet>
    ```
    ```ts
    import { Component, HostBinding } from '@angular/core';
    import { Router }                 from '@angular/router';

    import { slideInDownAnimation }   from './animations';

    @Component({
        templateUrl: './compose-message.component.html',
        styles: [ ':host { position: relative; bottom: 10%; }' ],
        animations: [ slideInDownAnimation ]
    })
    export class ComposeMessageComponent {
        @HostBinding('@routeAnimation') routeAnimation = true;
        @HostBinding('style.display')   display = 'block';
        @HostBinding('style.position')  position = 'absolute';

        details: string;
        sending = false;

        constructor(private router: Router) {}

        send() {
            this.sending = true;
            this.details = 'Sending Message...';

            setTimeout(() => {
            this.sending = false;
            this.closePopup();
            }, 1000);
        }

        cancel() {
            this.closePopup();
        }

        closePopup() {
            this.router.navigate([{ outlets: { popup: null }}]);
        }
    }
    ```
    (11)认证:CanActivate,CanActivateChild,解决登录保护问题
    ```ts
    import { Injectable }       from '@angular/core';
    import {
        CanActivate, Router,
        ActivatedRouteSnapshot,
        RouterStateSnapshot,
        CanActivateChild
    }                           from '@angular/router';
    import { AuthService }      from './auth.service';

    @Injectable()
    export class AuthGuard implements CanActivate, CanActivateChild {
        constructor(private authService: AuthService, private router: Router) {}

        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
            let url: string = state.url;

            return this.checkLogin(url);
        }

        canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
            return this.canActivate(route, state);
        }

        /* . . . */
    }
    ```
    ```ts
    const adminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [
        {
            path: '',
            canActivateChild: [AuthGuard],
            children: [
            { path: 'crises', component: ManageCrisesComponent },
            { path: 'heroes', component: ManageHeroesComponent },
            { path: '', component: AdminDashboardComponent }
            ]
        }
        ]
    }
    ];

    @NgModule({
    imports: [
        RouterModule.forChild(adminRoutes)
    ],
    exports: [
        RouterModule
    ]
    })
    export class AdminRoutingModule {}
    ```
    ```ts
    import { Injectable } from '@angular/core';

    import { Observable, of } from 'rxjs';
    import { tap, delay } from 'rxjs/operators';

    @Injectable()
    export class AuthService {
        isLoggedIn = false;

        login(): Observable<boolean> {
            return of(true).pipe(
            delay(1000),
            tap(val => this.isLoggedIn = true)
            );
        }

        logout(): void {
            this.isLoggedIn = false;
        }
    }
    ```
    (12)CanDeactivate：处理未保存的更改
    ```ts
    import { Injectable }           from '@angular/core';
    import { Observable }           from 'rxjs';
    import { CanDeactivate,
            ActivatedRouteSnapshot,
            RouterStateSnapshot }  from '@angular/router';

    import { CrisisDetailComponent } from './crisis-center/crisis-detail.component';

    @Injectable()
    export class CanDeactivateGuard implements CanDeactivate<CrisisDetailComponent> {

        canDeactivate(
            component: CrisisDetailComponent,
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
        ): Observable<boolean> | boolean {
            console.log(route.paramMap.get('id'));

            console.log(state.url);

            if (!component.crisis || component.crisis.name === component.editName) {
            return true;
            }
            return component.dialogService.confirm('Discard changes?');
        }
    }
    ```
    ```ts
    import { NgModule }             from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';

    import { CrisisCenterHomeComponent } from './crisis-center-home.component';
    import { CrisisListComponent }       from './crisis-list.component';
    import { CrisisCenterComponent }     from './crisis-center.component';
    import { CrisisDetailComponent }     from './crisis-detail.component';

    import { CanDeactivateGuard }    from '../can-deactivate-guard.service';

    const crisisCenterRoutes: Routes = [
    {
        path: '',
        redirectTo: '/crisis-center',
        pathMatch: 'full'
    },
    {
        path: 'crisis-center',
        component: CrisisCenterComponent,
        children: [
        {
            path: '',
            component: CrisisListComponent,
            children: [
            {
                path: ':id',
                component: CrisisDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            },
            {
                path: '',
                component: CrisisCenterHomeComponent
            }
            ]
        }
        ]
    }
    ];

    @NgModule({
        imports: [
            RouterModule.forChild(crisisCenterRoutes)
        ],
        exports: [
            RouterModule
        ]
    })
    export class CrisisCenterRoutingModule { }
    ```
    (13)Resolve: 预先获取组件数据
    ```ts
    import { Injectable }             from '@angular/core';
    import { Router, Resolve, RouterStateSnapshot,
            ActivatedRouteSnapshot } from '@angular/router';
    import { Observable }             from 'rxjs';
    import { map, take }              from 'rxjs/operators';

    import { Crisis, CrisisService }  from './crisis.service';

    @Injectable()
    export class CrisisDetailResolver implements Resolve<Crisis> {
        constructor(private cs: CrisisService, private router: Router) {}

        resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Crisis> {
            let id = route.paramMap.get('id');

            return this.cs.getCrisis(id).pipe(
                take(1),
                map(crisis => {
                    if (crisis) {
                        return crisis;
                    } else {
                        this.router.navigate(['/crisis-center']);
                        return null;
                    }
                })
            );
        }
    }
    ```
    (14)NavigationExtras:查询参数及片段
    ```ts
    import { Injectable }       from '@angular/core';
    import {
        CanActivate, Router,
        ActivatedRouteSnapshot,
        RouterStateSnapshot,
        CanActivateChild,
        NavigationExtras
    }                           from '@angular/router';
    import { AuthService }      from './auth.service';

    @Injectable()
    export class AuthGuard implements CanActivate, CanActivateChild {
        constructor(private authService: AuthService, private router: Router) {}

        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
            let url: string = state.url;

            return this.checkLogin(url);
        }

        canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
            return this.canActivate(route, state);
        }

        checkLogin(url: string): boolean {
            if (this.authService.isLoggedIn) { return true; }

            this.authService.redirectUrl = url;

            let sessionId = 123456789;

            let navigationExtras: NavigationExtras = {
                queryParams: { 'session_id': sessionId },
                fragment: 'anchor'
            };

            this.router.navigate(['/login'], navigationExtras);
            return false;
        }
    }
    ```
    (15)懒加载与预加载
    ```ts
    import { NgModule }     from '@angular/core';
    import {
    RouterModule, Routes,
    } from '@angular/router';

    import { ComposeMessageComponent } from './compose-message.component';
    import { PageNotFoundComponent }   from './not-found.component';

    import { CanDeactivateGuard }      from './can-deactivate-guard.service';
    import { AuthGuard }               from './auth-guard.service';

    const appRoutes: Routes = [
        弹窗
        {
            path: 'compose',
            component: ComposeMessageComponent,
            outlet: 'popup'
        },

        PreloadAllModules 预加载策略不会加载被CanLoad守卫所保护的特性区。
        {
            path: 'admin',
            loadChildren: 'app/admin/admin.module#AdminModule',
            canLoad: [AuthGuard]
        },

        给它一个 loadChildren 属性（注意不是 children 属性），把它设置为 AdminModule 的地址。 该地址是 AdminModule 的文件路径（相对于 app 目录的），加上一个 # 分隔符，再加上导出模块的类名 AdminModule。

        当路由器导航到这个路由时，它会用 loadChildren 字符串来动态加载 AdminModule，然后把 AdminModule 添加到当前的路由配置中， 最后，它把所请求的路由加载到目标 admin 组件中。

        惰性加载和重新配置工作只会发生一次，也就是在该路由首次被请求时。在后续的请求中，该模块和路由都是立即可用的。
        {
            path: 'crisis-center',
            loadChildren: 'app/crisis-center/crisis-center.module#CrisisCenterModule'
        },
        { path: '',   redirectTo: '/heroes', pathMatch: 'full' },
        { path: '**', component: PageNotFoundComponent }
    ];

    @NgModule({
    imports: [
        RouterModule.forRoot(
        appRoutes,
        )
    ],
    exports: [
        RouterModule
    ],
    providers: [
        CanDeactivateGuard
    ]
    })
    export class AppRoutingModule {}
    ```
    自定义预加载策略
    ```ts
    import { Injectable } from '@angular/core';
    import { PreloadingStrategy, Route } from '@angular/router';
    import { Observable, of } from 'rxjs';

    @Injectable()
    export class SelectivePreloadingStrategy implements PreloadingStrategy {
    preloadedModules: string[] = [];

    preload(route: Route, load: () => Observable<any>): Observable<any> {
        if (route.data && route.data['preload']) {
            this.preloadedModules.push(route.path);

            console.log('Preloaded: ' + route.path);

            return load();
        } else {
            return of(null);
        }
    }
    }
    ```
    ```ts
    import { Component, OnInit }    from '@angular/core';
    import { ActivatedRoute }       from '@angular/router';
    import { Observable }           from 'rxjs';
    import { map }                  from 'rxjs/operators';

    import { SelectivePreloadingStrategy } from '../selective-preloading-strategy';


    @Component({
    template:  `
        <p>Dashboard</p>

        <p>Session ID: {{ sessionId | async }}</p>
        <a id="anchor"></a>
        <p>Token: {{ token | async }}</p>

        Preloaded Modules
        <ul>
        <li *ngFor="let module of modules">{{ module }}</li>
        </ul>
    `
    })
    export class AdminDashboardComponent implements OnInit {
        sessionId: Observable<string>;
        token: Observable<string>;
        modules: string[];

        constructor(
            private route: ActivatedRoute,
            private preloadStrategy: SelectivePreloadingStrategy
        ) {
            this.modules = preloadStrategy.preloadedModules;
        }

        ngOnInit() {
            this.sessionId = this.route
            .queryParamMap
            .pipe(map(params => params.get('session_id') || 'None'));

            this.token = this.route
            .fragment
            .pipe(map(fragment => fragment || 'None'));
        }
    }
    ```

13. 测试

    测试文件的扩展名必须是 .spec.ts，这样工具才能识别出它是一个测试文件，也叫规约（spec）文件。

    (1)端到端

    component-interaction/e2e/src/app.e2e-spec.ts

    ```javascript
    let _heroNames = ['Mr. IQ', 'Magneta', 'Bombasto'];
    let _masterName = 'Master';
    
    it('should pass properties to children properly', function () {
        let parent = element.all(by.tagName('app-hero-parent')).get(0);
        let heroes = parent.all(by.tagName('app-hero-child'));
        
        for (let i = 0; i < _heroNames.length; i++) {
            let childTitle = heroes.get(i).element(by.tagName('h3')).getText();
            let childDetail = heroes.get(i).element(by.tagName('p')).getText();
            expect(childTitle).toEqual(_heroNames[i] + ' says:');
            expect(childDetail).toContain(_masterName);
        }
    });
    ```
    AngularJs是不直接操作DOM的，但是在平时的开发当中，我们有的时候还是需要操作一些DOM的，如果使用原生的JS的话操作过于麻烦，所以大家一般都是使用jQuery，jQuery虽然好用，但是AngularJs是不建议和JQuery同时使用的，所以AngularJs给我们也提供了一些操作DOM的方法———Jqlite

    查阅官方提供的api，可以看到使用方法是angular.element(ele)，其中，允许传入的参数ele的类型是“HTML string or DOMElement to be wrapped into jQuery.”一般传入参数DOMElement。

    angular.element：将DOM元素或者HTML字符串一包装成一个jQuery元素。

    用法：
    ```js
    angular.element('#testID2').find(’.test2‘).removeClass(’.test3‘);
    angular.element(document.querySelector("#span1")).addClass('test1');
    ```

    angular.element(ele).更多函数：
    * addClass()-为每个匹配的元素添加指定的样式类名
    * after()-在匹配元素集合中的每个元素后面插入参数所指定的内容，作为其兄弟节点
    * append()-在每个匹配元素里面的末尾处插入参数内容
    * attr() - 获取匹配的元素集合中的第一个元素的属性的值
    * bind() - 为一个元素绑定一个事件处理程序
    * children() - 获得匹配元素集合中每个元素的子元素，选择器选择性筛选
    * clone()-创建一个匹配的元素集合的深度拷贝副本
    * contents()-获得匹配元素集合中每个元素的子元素，包括文字和注释节点
    * css() - 获取匹配元素集合中的第一个元素的样式属性的值
    * data()-在匹配元素上存储任意相关数据
    * detach()-从DOM中去掉所有匹配的元素
    * empty()-从DOM中移除集合中匹配元素的所有子节点
    * eq()-减少匹配元素的集合为指定的索引的哪一个元素
    * find() - 通过一个选择器，jQuery对象，或元素过滤，得到当前匹配的元素集合中每个元素的后代
    * hasClass()-确定任何一个匹配元素是否有被分配给定的（样式）类
    * html()-获取集合中第一个匹配元素的HTML内容
    * next() - 取得匹配的元素集合中每一个元素紧邻的后面同辈元素的元素集合。如果提供一个选择器，那么只有紧跟着的兄弟元素满足选择器时，才会返回此元素
    * on() - 在选定的元素上绑定一个或多个事件处理函数
    * off() - 移除一个事件处理函数
    * one() - 为元素的事件添加处理函数。处理函数在每个元素上每种事件类型最多执行一次
    * parent() - 取得匹配元素集合中，每个元素的父元素，可以提供一个可选的选择器
    * prepend()-将参数内容插入到每个匹配元素的前面（元素内部）
    * prop()-获取匹配的元素集中第一个元素的属性（property）值
    * ready()-当DOM准备就绪时，指定一个函数来执行
    * remove()-将匹配元素集合从DOM中删除。（同时移除元素上的事件及 jQuery 数据。）
    * removeAttr()-为匹配的元素集合中的每个元素中移除一个属性（attribute）
    * removeClass()-移除集合中每个匹配元素上一个，多个或全部样式
    * removeData()-在元素上移除绑定的数据
    * replaceWith()-用提供的内容替换集合中所有匹配的元素并且返回被删除元素的集合
    * text()-得到匹配元素集合中每个元素的合并文本，包括他们的后代
    * toggleClass()-在匹配的元素集合中的每个元素上添加或删除一个或多个样式类,取决于这个样式类是否存在或值切换属性。即：如果存在（不存在）就删除（添加）一个类
    * triggerHandler() -为一个事件执行附加到元素的所有处理程序
    * unbind() - 从元素上删除一个以前附加事件处理程序
    * val()-获取匹配的元素集合中第一个元素的当前值
    * wrap()-在每个匹配的元素外层包上一个html元素

    (2)普通测试
    * 服务
    ```ts
    describe('ValueService', () => {
        let service: ValueService;
        beforeEach(() => { service = new ValueService(); });

        it('#getValue should return real value', () => {
            expect(service.getValue()).toBe('real value');
        });

        it('#getObservableValue should return value from observable',
            (done: DoneFn) => {
            service.getObservableValue().subscribe(value => {
            expect(value).toBe('observable value');
            done();
            });
        });

        it('#getPromiseValue should return value from a promise',
            (done: DoneFn) => {
            service.getPromiseValue().then(value => {
            expect(value).toBe('promise value');
            done();
            });
        });
    });
    ```
    带有依赖的服务
    ```ts
    @Injectable()
    export class MasterService {
        constructor(private valueService: ValueService) { }
        getValue() { return this.valueService.getValue(); }
    }
    ```
    ```ts
    describe('MasterService without Angular testing support', () => {
        let masterService: MasterService;

        it('#getValue should return real value from the real service', () => {
            masterService = new MasterService(new ValueService());
            expect(masterService.getValue()).toBe('real value');
        });

        it('#getValue should return faked value from a fakeService', () => {
            masterService = new MasterService(new FakeValueService());
            expect(masterService.getValue()).toBe('faked service value');
        });

        it('#getValue should return faked value from a fake object', () => {
            const fake =  { getValue: () => 'fake value' };
            masterService = new MasterService(fake as ValueService);
            expect(masterService.getValue()).toBe('fake value');
        });

        it('#getValue should return stubbed value from a spy', () => {
            const valueServiceSpy =
            jasmine.createSpyObj('ValueService', ['getValue']);

            const stubValue = 'stub value';
            valueServiceSpy.getValue.and.returnValue(stubValue);

            masterService = new MasterService(valueServiceSpy);

            expect(masterService.getValue())
            .toBe(stubValue, 'service returned stub value');
            expect(valueServiceSpy.getValue.calls.count())
            .toBe(1, 'spy method was called once');
            expect(valueServiceSpy.getValue.calls.mostRecent().returnValue)
            .toBe(stubValue);
        });
    });
    ```
    HTTP 服务
    ```ts
    let httpClientSpy: { get: jasmine.Spy };
    let heroService: HeroService;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        heroService = new HeroService(<any> httpClientSpy);
    });

    it('should return expected heroes (HttpClient called once)', () => {
        const expectedHeroes: Hero[] =
            [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];

        httpClientSpy.get.and.returnValue(asyncData(expectedHeroes));

        heroService.getHeroes().subscribe(
            heroes => expect(heroes).toEqual(expectedHeroes, 'expected heroes'),
            fail
        );
        expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
        });

        it('should return an error when the server returns a 404', () => {
        const errorResponse = new HttpErrorResponse({
            error: 'test 404 error',
            status: 404, statusText: 'Not Found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));

        heroService.getHeroes().subscribe(
            heroes => fail('expected an error, not heroes'),
            error  => expect(error.message).toContain('test 404 error')
        );
    });
    ```

    * 组件
    单独测试组件类
    ```ts
    @Component({
        selector: 'lightswitch-comp',
        template: `
            <button (click)="clicked()">Click me!</button>
            <span>{{message}}</span>`
    })
    export class LightswitchComponent {
        isOn = false;
        clicked() { this.isOn = !this.isOn; }
        get message() { return `The light is ${this.isOn ? 'On' : 'Off'}`; }
    }
    ```
    ```ts
    describe('LightswitchComp', () => {
        it('#clicked() should toggle #isOn', () => {
            const comp = new LightswitchComponent();
            expect(comp.isOn).toBe(false, 'off at first');
            comp.clicked();
            expect(comp.isOn).toBe(true, 'on after click');
            comp.clicked();
            expect(comp.isOn).toBe(false, 'off after second click');
        });

        it('#clicked() should set #message to "is on"', () => {
            const comp = new LightswitchComponent();
            expect(comp.message).toMatch(/is off/i, 'off at first');
            comp.clicked();
            expect(comp.message).toMatch(/is on/i, 'on after clicked');
        });
    });
    ```
    ```ts
    export class DashboardHeroComponent {
        @Input() hero: Hero;
        @Output() selected = new EventEmitter<Hero>();
        click() { this.selected.emit(this.hero); }
    }
    ```
    ```ts
    it('raises the selected event when clicked', () => {
        const comp = new DashboardHeroComponent();
        const hero: Hero = { id: 42, name: 'Test' };
        comp.hero = hero;

        comp.selected.subscribe(selectedHero => expect(selectedHero).toBe(hero));
        comp.click();
    });
    ```
    ```ts
    export class WelcomeComponent  implements OnInit {
        welcome: string;
        constructor(private userService: UserService) { }

        ngOnInit(): void {
            this.welcome = this.userService.isLoggedIn ?
            'Welcome, ' + this.userService.user.name : 'Please log in.';
        }
    }
    ```
    ```ts
    class MockUserService {
        isLoggedIn = true;
        user = { name: 'Test User'};
    };
    ```
    ```ts
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
            WelcomeComponent,
            { provide: UserService, useClass: MockUserService }
            ]
        });
        comp = TestBed.get(WelcomeComponent);
        userService = TestBed.get(UserService);
    });

    it('should not have welcome message after construction', () => {
        expect(comp.welcome).toBeUndefined();
    });

    it('should welcome logged in user after Angular calls ngOnInit', () => {
        comp.ngOnInit();
        expect(comp.welcome).toContain(userService.user.name);
    });

    it('should ask user to log in if not logged in after ngOnInit', () => {
        userService.isLoggedIn = false;
        comp.ngOnInit();
        expect(comp.welcome).not.toContain(userService.user.name);
        expect(comp.welcome).toContain('log in');
    });
    ```
    组件绑定
    ```ts
    @Component({
        selector: 'app-banner',
        template: '<h1>{{title}}</h1>',
        styles: ['h1 { color: green; font-size: 350%}']
    })
    export class BannerComponent {
        title = 'Test Tour of Heroes';
    }
    ```
    ```ts
    let component: BannerComponent;
    let fixture:   ComponentFixture<BannerComponent>;
    let h1:        HTMLElement;

    TestBed.configureTestingModule({
        declarations: [ BannerComponent ],
        providers: [
            { provide: ComponentFixtureAutoDetect, useValue: true }
        ]
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ BannerComponent ],
        });
        fixture = TestBed.createComponent(BannerComponent);
        component = fixture.componentInstance; 
        h1 = fixture.nativeElement.querySelector('h1');
    });

    it('no title in the DOM after createComponent()', () => {
        expect(h1.textContent).toEqual('');
    });

    it('should display a different test title', () => {
        component.title = 'Test Title';
        fixture.detectChanges();
        expect(h1.textContent).toContain('Test Title');
    });
    ```
    使用 dispatchEvent() 修改输入值

    模拟用户输入，就要找到 \<input\> 元素并设置它的 value 属性。要调用 fixture.detectChanges() 来触发 Angular 的变更检测。
    ```ts
    it('should convert hero name to Title Case', () => {
        const hostElement = fixture.nativeElement;
        const nameInput: HTMLInputElement = hostElement.querySelector('input');
        const nameDisplay: HTMLElement = hostElement.querySelector('span');

        nameInput.value = 'quick BROWN  fOx';

        nameInput.dispatchEvent(newEvent('input'));

        fixture.detectChanges();

        expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
    });
    ```
    获取注入的服务
    ```ts
    userService = fixture.debugElement.injector.get(UserService);
    ```
    带有异步服务的组件,使用间谍（Spy）进行测试
    ```ts
    beforeEach(() => {
        testQuote = 'Test Quote';

        const twainService = jasmine.createSpyObj('TwainService', ['getQuote']);
        getQuoteSpy = twainService.getQuote.and.returnValue( of(testQuote) );

        TestBed.configureTestingModule({
            declarations: [ TwainComponent ],
            providers:    [
            { provide: TwainService, useValue: twainService }
            ]
        });

        fixture = TestBed.createComponent(TwainComponent);
        component = fixture.componentInstance;
        quoteEl = fixture.nativeElement.querySelector('.twain');
    });
    ```
    同步测试
    ```ts
    it('should show quote after component initialized', () => {
        fixture.detectChanges();

        expect(quoteEl.textContent).toBe(testQuote);
        expect(getQuoteSpy.calls.any()).toBe(true, 'getQuote called');
    });
    ```
    使用 fakeAsync() 进行异步测试
    ```ts
    it('should display error when TwainService fails', fakeAsync(() => {
        getQuoteSpy.and.returnValue(
            throwError('TwainService test failure'));

        fixture.detectChanges(); 

        tick(); 

        fixture.detectChanges();

        expect(errorMessage()).toMatch(/test failure/, 'should display error');
        expect(quoteEl.textContent).toBe('...', 'should show placeholder');
    }));
    ```
    带有输入输出参数的组件
    ```html
    <dashboard-hero *ngFor="let hero of heroes"  class="col-1-4"
        [hero]=hero  (selected)="gotoDetail($event)" >
    </dashboard-hero>
    ```
    ```ts
    @Component({
        selector: 'dashboard-hero',
        template: `
            <div (click)="click()" class="hero">
            {{hero.name | uppercase}}
            </div>`,
        styleUrls: [ './dashboard-hero.component.css' ]
    })
    export class DashboardHeroComponent {
        @Input() hero: Hero;
        @Output() selected = new EventEmitter<Hero>();
        click() { this.selected.emit(this.hero); }
    }
    ```
    ```ts
    TestBed.configureTestingModule({
    declarations: [ DashboardHeroComponent ]
    })
    fixture = TestBed.createComponent(DashboardHeroComponent);
    comp    = fixture.componentInstance;

    heroDe  = fixture.debugElement.query(By.css('.hero'));
    heroEl = heroDe.nativeElement;

    expectedHero = { id: 42, name: 'Test Name' };

    comp.hero = expectedHero;

    fixture.detectChanges();

    it('should display hero name in uppercase', () => {
        const expectedPipedName = expectedHero.name.toUpperCase();
        expect(heroEl.textContent).toContain(expectedPipedName);
    });

    it('should raise selected event when clicked (triggerEventHandler)', () => {
        let selectedHero: Hero;
        comp.selected.subscribe((hero: Hero) => selectedHero = hero);

        heroDe.triggerEventHandler('click', null);
        expect(selectedHero).toBe(expectedHero);
    });

    it('should raise selected event when clicked (element.click)', () => {
        let selectedHero: Hero;
        comp.selected.subscribe((hero: Hero) => selectedHero = hero);

        heroEl.click();
        expect(selectedHero).toBe(expectedHero);
    });
    ```
    位于测试宿主中的组件
    ```ts
    @Component({
        template: `
            <dashboard-hero
            [hero]="hero" (selected)="onSelected($event)">
            </dashboard-hero>`
    })
    class TestHostComponent {
        hero: Hero = {id: 42, name: 'Test Name' };
        selectedHero: Hero;
        onSelected(hero: Hero) { this.selectedHero = hero; }
    }
    ```
    ```ts
    TestBed.configureTestingModule({
        declarations: [ DashboardHeroComponent, TestHostComponent ]
    })
    fixture  = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    heroEl   = fixture.nativeElement.querySelector('.hero');
    fixture.detectChanges(); 

    it('should display hero name', () => {
        const expectedPipedName = testHost.hero.name.toUpperCase();
        expect(heroEl.textContent).toContain(expectedPipedName);
    });

    it('should raise selected event when clicked', () => {
        click(heroEl);
        expect(testHost.selectedHero).toBe(testHost.hero);
    });
    ```
    路由组件
    ```ts
    constructor(
        private router: Router,
        private heroService: HeroService) {}
    )
    gotoDetail(hero: Hero) {
        let url = `/heroes/${hero.id}`;
        this.router.navigateByUrl(url);
    }
    ```
    ```ts
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroes']);

    TestBed.configureTestingModule({
        providers: [
            { provide: HeroService, useValue: heroServiceSpy },
            { provide: Router,      useValue: routerSpy }
        ]
    })

    it('should tell ROUTER to navigate when hero clicked', () => {

        heroClick();

        const spy = router.navigateByUrl as jasmine.Spy;
        const navArgs = spy.calls.first().args[0];

        const id = comp.heroes[0].id;
        expect(navArgs).toBe('/heroes/' + id,
            'should nav to HeroDetail for first hero');
    });
    ```
    路由目标组件
    ```ts
    constructor(
        private heroDetailService: HeroDetailService,
        private route:  ActivatedRoute,
        private router: Router) {}
    )
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => this.getHero(pmap.get('id')));
    }
    ```
    需要测试替身
    ```ts
    import { convertToParamMap, ParamMap, Params } from '@angular/router';
    import { ReplaySubject } from 'rxjs';

    export class ActivatedRouteStub {
        private subject = new ReplaySubject<ParamMap>();

        constructor(initialParams?: Params) {
            this.setParamMap(initialParams);
        }

        readonly paramMap = this.subject.asObservable();

        setParamMap(params?: Params) {
            this.subject.next(convertToParamMap(params));
        };
    }
    ```
    ```ts
    describe('when navigate to existing hero', () => {
        let expectedHero: Hero;

        beforeEach(async(() => {
            expectedHero = firstHero;
            activatedRoute.setParamMap({ id: expectedHero.id });
            createComponent();
        }));

        it('should display that hero\'s name', () => {
            expect(page.nameDisplay.textContent).toBe(expectedHero.name);
        });
    });

    describe('when navigate to non-existent hero id', () => {
        beforeEach(async(() => {
            activatedRoute.setParamMap({ id: 99999 });
            createComponent();
        }));

        it('should try to navigate back to hero list', () => {
            expect(page.gotoListSpy.calls.any()).toBe(true, 'comp.gotoList called');
            expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');
        });
    });

    describe('when navigate with no hero id', () => {
        beforeEach(async( createComponent ));

        it('should have hero.id === 0', () => {
            expect(component.hero.id).toBe(0);
        });

        it('should display empty hero name', () => {
            expect(page.nameDisplay.textContent).toBe('');
        });
    });
    ```
    对嵌套组件的测试
    ```html
    <app-banner></app-banner>
    <app-welcome></app-welcome>
    <nav>
        <a routerLink="/dashboard">Dashboard</a>
        <a routerLink="/heroes">Heroes</a>
        <a routerLink="/about">About</a>
    </nav>
    <router-outlet></router-outlet>
    ```
    ```ts
    @Component({selector: 'app-banner', template: ''})
    class BannerStubComponent {}

    @Component({selector: 'router-outlet', template: ''})
    class RouterOutletStubComponent { }

    @Component({selector: 'app-welcome', template: ''})
    class WelcomeStubComponent {}

    TestBed.configureTestingModule({
        declarations: [
            AppComponent,
            BannerStubComponent,
            RouterLinkDirectiveStub
        ],
        schemas: [ NO_ERRORS_SCHEMA ]
    })
    ```
    带有 RouterLink 的组件
    ```html
    <nav>
        <a routerLink="/dashboard">Dashboard</a>
        <a routerLink="/heroes">Heroes</a>
        <a routerLink="/about">About</a>
    </nav>
    ```
    ```ts
    @Directive({
        selector: '[routerLink]',
        host: { '(click)': 'onClick()' }
    })
    export class RouterLinkDirectiveStub {
        @Input('routerLink') linkParams: any;
        navigatedTo: any = null;

        onClick() {
            this.navigatedTo = this.linkParams;
        }
    }
    ```
    ```ts
    beforeEach(() => {
        fixture.detectChanges(); 
        By.directive 来定位一个带附属指令的链接元素
        linkDes = fixture.debugElement
            .queryAll(By.directive(RouterLinkDirectiveStub));

        routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
    });

    it('can get RouterLinks from template', () => {
        expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
        expect(routerLinks[0].linkParams).toBe('/dashboard');
        expect(routerLinks[1].linkParams).toBe('/heroes');
        expect(routerLinks[2].linkParams).toBe('/about');
    });

    it('can click Heroes link in template', () => {
        const heroesLinkDe = linkDes[1];   // heroes link DebugElement
        const heroesLink = routerLinks[1]; // heroes link directive

        expect(heroesLink.navigatedTo).toBeNull('should not have navigated yet');

        heroesLinkDe.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(heroesLink.navigatedTo).toBe('/heroes');
    });
    ```
    使用页面（page）对象
    ```html
    <div *ngIf="hero">
        <h2><span>{{hero.name | titlecase}}</span> Details</h2>
        <div>
            <label>id: </label>{{hero.id}}</div>
        <div>
            <label for="name">name: </label>
            <input id="name" [(ngModel)]="hero.name" placeholder="name" />
        </div>
        <button (click)="save()">Save</button>
        <button (click)="cancel()">Cancel</button>
    </div>
    ```
    ```ts
    class Page {
        get buttons()     { return this.queryAll<HTMLButtonElement>('button'); }
        get saveBtn()     { return this.buttons[0]; }
        get cancelBtn()   { return this.buttons[1]; }
        get nameDisplay() { return this.query<HTMLElement>('span'); }
        get nameInput()   { return this.query<HTMLInputElement>('input'); }

        gotoListSpy: jasmine.Spy;
        navigateSpy:  jasmine.Spy;

        constructor(fixture: ComponentFixture<HeroDetailComponent>) {
            const routerSpy = <any> fixture.debugElement.injector.get(Router);
            this.navigateSpy = routerSpy.navigate;

            const component = fixture.componentInstance;
            this.gotoListSpy = spyOn(component, 'gotoList').and.callThrough();
        }

        private query<T>(selector: string): T {
            return fixture.nativeElement.querySelector(selector);
        }

        private queryAll<T>(selector: string): T[] {
            return fixture.nativeElement.querySelectorAll(selector);
        }
    }

    function createComponent() {
        fixture = TestBed.createComponent(HeroDetailComponent);
        component = fixture.componentInstance;
        page = new Page(fixture);

        fixture.detectChanges();
        return fixture.whenStable().then(() => {
            fixture.detectChanges();
        });
    }

    it('should display that hero\'s name', () => {
        expect(page.nameDisplay.textContent).toBe(expectedHero.name);
    });

    it('should navigate when click cancel', () => {
        click(page.cancelBtn);
        expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');
    });

    it('should save when click save but not navigate immediately', () => {
        const hds = fixture.debugElement.injector.get(HeroDetailService);
        const saveSpy = spyOn(hds, 'saveHero').and.callThrough();

        click(page.saveBtn);
        expect(saveSpy.calls.any()).toBe(true, 'HeroDetailService.save called');
        expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    });

    it('should navigate when click save and save resolves', fakeAsync(() => {
        click(page.saveBtn);
        tick();
        expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');
    }));

    it('should convert hero name to Title Case', () => {
        const hostElement = fixture.nativeElement;
        const nameInput: HTMLInputElement = hostElement.querySelector('input');
        const nameDisplay: HTMLElement = hostElement.querySelector('span');

        nameInput.value = 'quick BROWN  fOx';

        nameInput.dispatchEvent(newEvent('input'));

        fixture.detectChanges();

        expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
    });
    ```

    * 指令
    ```ts
    import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

    @Directive({ selector: '[highlight]' })
    export class HighlightDirective implements OnChanges {

        defaultColor =  'rgb(211, 211, 211)'; 

        @Input('highlight') bgColor: string;

        constructor(private el: ElementRef) {
            el.nativeElement.style.customProperty = true;
        }

        ngOnChanges() {
            this.el.nativeElement.style.backgroundColor = this.bgColor || this.defaultColor;
        }
    }
    ```
    ```ts
    import { Component } from '@angular/core';
    @Component({
        template: `
        <h2 highlight="skyblue">About</h2>
        <h3>Quote of the day:</h3>
        <twain-quote></twain-quote>
        `
    })
    export class AboutComponent { }
    ```
    ```ts
    beforeEach(() => {
    fixture = TestBed.configureTestingModule({
        declarations: [ HighlightDirective, TestComponent ]
    })
    .createComponent(TestComponent);

    fixture.detectChanges();

    des = fixture.debugElement.queryAll(By.directive(HighlightDirective));

    bareH2 = fixture.debugElement.query(By.css('h2:not([highlight])'));
    });

    it('should have three highlighted elements', () => {
        expect(des.length).toBe(3);
    });

    it('should color 1st <h2> background "yellow"', () => {
        const bgColor = des[0].nativeElement.style.backgroundColor;
        expect(bgColor).toBe('yellow');
    });

    it('should color 2nd <h2> background w/ default color', () => {
        const dir = des[1].injector.get(HighlightDirective) as HighlightDirective;
        const bgColor = des[1].nativeElement.style.backgroundColor;
        expect(bgColor).toBe(dir.defaultColor);
    });

    it('should bind <input> background to value color', () => {
        const input = des[2].nativeElement as HTMLInputElement;
        expect(input.style.backgroundColor).toBe('cyan', 'initial backgroundColor');

        input.value = 'green';
        input.dispatchEvent(newEvent('input'));
        fixture.detectChanges();

        expect(input.style.backgroundColor).toBe('green', 'changed backgroundColor');
    });


    it('bare <h2> should not have a customProperty', () => {
        expect(bareH2.properties['customProperty']).toBeUndefined();
    });
    ```

    * 管道
    ```ts
    import { Pipe, PipeTransform } from '@angular/core';

    @Pipe({name: 'titlecase', pure: true})
    export class TitleCasePipe implements PipeTransform {
        transform(input: string): string {
            return input.length === 0 ? '' :
            input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ));
        }
    }
    ```
    ```ts
    describe('TitleCasePipe', () => {
        let pipe = new TitleCasePipe();

        it('transforms "abc" to "Abc"', () => {
            expect(pipe.transform('abc')).toBe('Abc');
        });

        it('transforms "abc def" to "Abc Def"', () => {
            expect(pipe.transform('abc def')).toBe('Abc Def');
        });

        // ... more tests ...

    });
    ```
    ```ts
    it('should convert hero name to Title Case', () => {
        const hostElement = fixture.nativeElement;
        const nameInput: HTMLInputElement = hostElement.querySelector('input');
        const nameDisplay: HTMLElement = hostElement.querySelector('span');

        nameInput.value = 'quick BROWN  fOx';

        nameInput.dispatchEvent(newEvent('input'));

        fixture.detectChanges();

        expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
    });
    ```

    * spec
    
    在浏览器中，像调试应用一样调试测试程序 spec。

        显示 Karma 的浏览器窗口（之前被隐藏了）。

        点击“DEBUG”按钮；它打开一页新浏览器标签并重新开始运行测试程序

        打开浏览器的“Developer Tools”(Windows 上的 Ctrl-Shift-I 或者 OSX 上的 `Command-Option-I)。

        选择“sources”页

        打开 1st.spec.ts 测试文件（Control/Command-P, 然后输入文件名字）。

        在测试程序中设置断点。

        刷新浏览器...然后它就会停在断点上。


    (3)测试工具 API
    * async

        在一个特殊的 async 测试区域中运行测试（it）的函数体或准备函数（beforeEach）。 参见前面的讨论。
        ```ts
        it('should show quote after getQuote (async)', async(() => {
            fixture.detectChanges();
            expect(quoteEl.textContent).toBe('...', 'should show placeholder');

            fixture.whenStable().then(() => { 
                fixture.detectChanges();
                expect(quoteEl.textContent).toBe(testQuote);
                expect(errorMessage()).toBeNull('should not show error');
            });
        }));
        ```

    * fakeAsync

        在一个特殊的 fakeAsync 测试区域中运行测试（it）的函数体，以便启用线性风格的控制流。 参见前面的讨论。

    * tick

        通过在 fakeAsync 测试区域中刷新定时器和微任务（micro-task）队列来仿真时间的流逝以及异步活动的完成。

        好奇和执着的读者可能会喜欢这篇长博客： "Tasks, microtasks, queues and schedules".

        接受一个可选参数，它可以把虚拟时钟往前推进特定的微秒数。 清除调度到那个时间帧中的异步活动。 参见前面的讨论。

    * inject

        从当前的 TestBed 注入器中把一个或多个服务注入到一个测试函数中。 它不能用于注入组件自身提供的服务。 参见 debugElement.injector 部分的讨论。

    * discardPeriodicTasks

        当 fakeAsync 测试程序以正在运行的计时器事件任务（排队中的 setTimeOut 和 setInterval 的回调）结束时， 测试会失败，并显示一条明确的错误信息。

        一般来讲，测试程序应该以无排队任务结束。 当待执行计时器任务存在时，调用 discardPeriodicTasks 来触发任务队列，防止该错误发生。

    * flushMicrotasks

        当 fakeAsync 测试程序以待执行微任务（比如未解析的承诺）结束时，测试会失败并显示明确的错误信息。

        一般来说，测试应该等待微任务结束。 当待执行微任务存在时，调用 flushMicrotasks 来触发微任务队列，防止该错误发生。

    * ComponentFixtureAutoDetect

        一个服务提供商令牌，用于开启自动变更检测。

    * getTestBed

        获取当前 TestBed 实例。 通常用不上，因为 TestBed 的静态类方法已经够用。 TestBed 实例有一些很少需要用到的方法，它们没有对应的静态方法。

    TestBed 类
    * configureTestingModule

        测试垫片（karma-test-shim, browser-test-shim）创建了初始测试环境和默认测试模块。 默认测试模块是使用基本声明和一些 Angular 服务替代品，它们是所有测试程序都需要的。

        调用 configureTestingModule 来为一套特定的测试定义测试模块配置，添加和删除导入、（组件、指令和管道的）声明和服务提供商。

    * compileComponents

        在配置好测试模块之后，异步编译它。 如果测试模块中的任何一个组件具有 templateUrl 或 styleUrls，那么你必须调用这个方法，因为获取组件的模板或样式文件必须是异步的。 参见前面的讨论。

        调用完 compileComponents 之后，TestBed 的配置就会在当前测试期间被冻结。

    * createComponent

        基于当前 TestBed 的配置创建一个类型为 T 的组件实例。 一旦调用，TestBed 的配置就会在当前测试期间被冻结。

        ```ts
        const fixture = TestBed.createComponent(BannerComponent);
        ```

    * overrideModule

        替换指定的 NgModule 的元数据。回想一下，模块可以导入其他模块。 overrideModule 方法可以深入到当前测试模块深处，修改其中一个内部模块。

    * overrideComponent

        替换指定组件类的元数据，该组件类可能嵌套在一个很深的内部模块中。

    * overrideDirective

        替换指定指令类的元数据，该指令可能嵌套在一个很深的内部模块中。

    * overridePipe

        替换指定管道类的元数据，该管道可能嵌套在一个很深的内部模块中。


    * get

        从当前 TestBed 注入器获取一个服务。

        inject 函数通常都能胜任这项工作，但是如果它没法提供该服务时就会抛出一个异常。

        如果该服务是可选的呢？

        TestBed.get() 方法可以接受可选的第二参数，当 Angular 找不到指定的服务提供商时，就会返回该对象service = TestBed.get(NotProvided, null); 

        一旦调用，TestBed 的配置就会在当前测试期间被冻结。
        ```ts
        userService = TestBed.get(UserService);
        ```

    * initTestEnvironment

        为整套测试的运行初始化测试环境。

        测试垫片(karma-test-shim, browser-test-shim)会为你调用它，所以你很少需要自己调用它。

        这个方法只能被调用一次。如果确实需要在测试程序运行期间改变这个默认设置，那么先调用 resetTestEnvironment。

        指定 Angular 编译器工厂，PlatformRef，和默认 Angular 测试模块。 以 @angular/platform-<platform_name>/testing/<platform_name> 的形式提供非浏览器平台的替代品。

    * resetTestEnvironment

        重设初始测试环境，包括默认测试模块在内。

    ComponentFixture 类

    TestBed.createComponent<T> 会创建一个组件 T 的实例，并为该组件返回一个强类型的 ComponentFixture。

    ComponentFixture 的属性和方法提供了对组件、它的 DOM 和它的 Angular 环境方面的访问。

    属性
    * componentInstance

        被 TestBed.createComponent 创建的组件类实例。

    * debugElement

        与组件根元素关联的 DebugElement。

        debugElement 提供了在测试和调试期间深入探查组件及其 DOM 元素的功能。 它对于测试者是一个极其重要的属性。它的大多数主要成员在后面都有讲解。
        ```ts
        const bannerDe: DebugElement = fixture.debugElement;
        ```

    * nativeElement

        组件的原生根 DOM 元素。
        ```ts
        it('should have <p> with "banner works!"', () => {
            const bannerElement: HTMLElement = fixture.nativeElement;
            const p = bannerElement.querySelector('p');
            expect(p.textContent).toEqual('banner works!');
        });
        ```
        ```ts
        it('should find the <p> with fixture.debugElement.query(By.css)', () => {
            const bannerDe: DebugElement = fixture.debugElement;
            const paragraphDe = bannerDe.query(By.css('p'));
            const p: HTMLElement = paragraphDe.nativeElement;
            expect(p.textContent).toEqual('banner works!');
        });
        ```

    * changeDetectorRef

        组件的 ChangeDetectorRef。

        在测试一个拥有 ChangeDetectionStrategy.OnPush 的组件，或者在组件的变化测试在你的程序控制下时，ChangeDetectorRef 是最重要的。   

    方法

    fixture 方法使 Angular 对组件树执行某些任务。 在触发 Angular 行为来模拟的用户行为时，调用这些方法。
    * detectChanges

        为组件触发一轮变化检查。

        调用它来初始化组件（它调用 ngOnInit）。或者在你的测试代码改变了组件的数据绑定属性值后调用它。 Angular 不能检测到你已经改变了 personComponent.name 属性，也不会更新 name 的绑定，直到你调用了 detectChanges。

        之后，运行 checkNoChanges，来确认没有循环更新，除非它被这样调用：detectChanges(false)。

    * autoDetectChanges

        设置 fixture 是否应该自动试图检测变化。

        当自动检测打开时，测试 fixture 监听 zone 事件，并调用 detectChanges。 当你的测试代码直接修改了组件属性值时，你还是要调用 fixture.detectChanges 来触发数据绑定更新。

        默认值是 false，喜欢对测试行为进行精细控制的测试者一般保持它为 false。

    * checkNoChanges

        运行一次变更检测来确认没有待处理的变化。如果有未处理的变化，它将抛出一个错误。

    * isStable

        如果 fixture 当前是稳定的，则返回 true。 如果有异步任务没有完成，则返回 false。

    * whenStable

        返回一个承诺，在 fixture 稳定时解析。

        要想在完成了异步活动或异步变更检测之后再继续测试，可以对那个承诺对象进行挂钩。 参见 前面。

    * destroy

        触发组件的销毁。

    DebugElement：提供了对组件的 DOM 的访问。

    * nativeElement

        与浏览器中 DOM 元素对应（WebWorkers 时，值为 null）。

    * query

        调用 query(predicate: Predicate<DebugElement>) 会在子树的任意深度中查找能和谓词函数匹配的第一个 DebugElement。

    * queryAll

        调用 queryAll(predicate: Predicate<DebugElement>) 会在子树的任意深度中查找能和谓词函数匹配的所有 DebugElement。

    * injector

        宿主依赖注入器。 比如，根元素的组件实例注入器。

    * componentInstance

        元素自己的组件实例（如果有）。

    * context

        为元素提供父级上下文的对象。 通常是控制该元素的祖级组件实例。

        当一个元素被 *ngFor 重复，它的上下文为 NgForRow，它的 $implicit 属性值是该行的实例值。 比如，*ngFor="let hero of heroes" 里的 hero。

    * children

        DebugElement 的直接子元素。可以通过继续深入 children 来遍历这棵树。

        DebugElement 还有 childNodes，即 DebugNode 对象列表。 DebugElement 从 DebugNode 对象衍生，而且通常节点（node）比元素多。测试者通常忽略赤裸节点。

    * parent

    DebugElement 的父级。如果 DebugElement 是根元素，parent 为 null。

    * name

        元素的标签名字，如果它是一个元素的话。

    * triggerEventHandler

        如果在该元素的 listeners 集合中有相应的监听器，就根据名字触发这个事件。

        如果事件缺乏监听器，或者有其它问题，考虑调用 nativeElement.dispatchEvent(eventObject)。

    * listeners

        元素的 @Output 属性以及/或者元素的事件属性所附带的回调函数。

    * providerTokens

        组件注入器的查询令牌。 包括组件自己的令牌和组件的 providers 元数据中列出来的令牌。

    * source

        source 是在源组件模板中查询这个元素的处所。

    * references

        与模板本地变量（比如 #foo）关联的词典对象，关键字与本地变量名字配对。


### 生命周期
1. 钩子与用途

|钩子|用途及时机|
|--|--|
|ngOnChanges()|当 Angular（重新）设置数据绑定输入属性时响应。 该方法接受当前和上一属性值的 SimpleChanges 对象。当被绑定的输入属性的值发生变化时调用，首次调用一定会发生在 ngOnInit() 之前。|
|ngOnInit()|在构造函数之后马上执行复杂的初始化逻辑,或设置完输入属性之后，对该组件进行准备。在第一轮 ngOnChanges() 完成之后调用，只调用一次。|
|ngDoCheck()|检测并在发生Angular无法或不愿意自己检测的变化时作出反应。在每个 Angular 变更检测周期中调用，ngOnChanges() 和 ngOnInit() 之后。|
|ngAfterContentInit()|每次创建了组件的子视图后调用，只调用一次。|
|ngAfterContentChecked()|子视图中的每一次数据变更后调用。|
|ngAfterViewInit()|外来内容被投影到组件之后调用。应用：@ViewChild本地变量|
|ngAfterViewChecked()|外来内容被投影到组件发生变更之后调用。|
|ngOnDestroy()|该组件消失之前，可用来通知应用程序中其它部分的最后一个时间点。释放不会被垃圾收集器自动回收的资源的地方。取消那些对可观察对象和DOM事件的订阅。停止定时器。注销该指令曾注册到全局服务或应用级服务中的各种回调函数。如果不这么做，就会有导致内存泄露的风险。|

2. 通过侦探(spy)，窥探生命周期内部细节：
```typescript
let nextId = 1;

// Spy on any element to which it is applied.
// Usage: <div mySpy>...</div>
@Directive({selector: '[mySpy]'})
export class SpyDirective implements OnInit, OnDestroy {

  constructor(private logger: LoggerService) { }

  ngOnInit()    { this.logIt(`onInit`); }

  ngOnDestroy() { this.logIt(`onDestroy`); }

  private logIt(msg: string) {
    this.logger.log(`Spy #${nextId++} ${msg}`);
  }
}
```
```html
<div *ngFor="let hero of heroes" mySpy class="heroes">
    {{hero}}
</div>
```

3. 输入属性变化：
```typescript
ngOnChanges(changes: SimpleChanges) {
  for (let propName in changes) {
    let chng = changes[propName];
    let cur  = JSON.stringify(chng.currentValue);
    let prev = JSON.stringify(chng.previousValue);
    this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
  }
}
```

4. 特殊更改,如input的hover，click，输入，由于调用频繁，故逻辑尽量简化
```typescript
ngDoCheck() {
  if (this.hero.name !== this.oldHeroName) {
    this.changeDetected = true;
    this.changeLog.push(`DoCheck: Hero name changed to "${this.hero.name}" from "${this.oldHeroName}"`);
    this.oldHeroName = this.hero.name;
  }
}
```

5. 外来内容占位符：
```html
<ng-content></ng-content>
```

### 概念梳理
1. HTML attribute 与 DOM property 的对比

    attribute 是由 HTML 定义的。property 是由 DOM (Document Object Model) 定义的。
    * 少量 HTML attribute 和 property 之间有着 1:1 的映射，如 id。
    * 有些 HTML attribute 没有对应的 property，如 colspan。
    * 有些 DOM property 没有对应的 attribute，如 textContent。
    * 大量 HTML attribute 看起来映射到了 property…… 但却不像你想的那样！
    * 最后一类尤其让人困惑…… 除非你能理解这个普遍原则：

    attribute 初始化 DOM property，然后它们的任务就完成了。property 的值可以改变；attribute 的值不能改变。

    1.1

    例如，当浏览器渲染 ``` <input type="text" value="Bob"> ```时，它将创建相应 DOM 节点， 它的 value 这个 property 被初始化为 “Bob”。

    当用户在输入框中输入 “Sally” 时，DOM 元素的 value 这个 property 变成了 “Sally”。 但是该 HTML 的 value 这个 attribute 保持不变。如果你读取 input 元素的 attribute，就会发现确实没变： ```input.getAttribute('value') // 返回 "Bob"```，因此需要用到```document.getElementById("demo1").value;```。

    HTML 的 value 这个 attribute 指定了初始值；DOM 的 value 这个 property 是当前值。

    1.2

    disabled 这个 attribute 是另一种特例。按钮的 disabled 这个 property 是 false，因为默认情况下按钮是可用的。 当你添加 disabled 这个 attribute 时，只要它出现了按钮的 disabled 这个 property 就初始化为 true，于是按钮就被禁用了。

    添加或删除 disabled 这个 attribute 会禁用或启用这个按钮。但 attribute 的值无关紧要，这就是你为什么没法通过 ```<button disabled="false">仍被禁用</button> ```这种写法来启用按钮。

    设置按钮的 disabled 这个 property（如，通过 Angular 绑定）可以禁用或启用这个按钮。 这就是 property 的价值。

    就算名字相同，HTML attribute 和 DOM property 也不是同一样东西。

    ---

    所以，在 Angular 的世界中，attribute 唯一的作用是用来初始化元素和指令的状态。 当进行数据绑定时，只是在与元素和指令的 property 和事件打交道。

    设置attribute的办法：```<tr><td [attr.colspan]="1 + 1">One-Two</td></tr>```

2. 控制视图的封装模式：原生 (Native)、仿真 (Emulated) 和无 (None)

    * Native 没有样式能进来，组件样式出不去。(只适用于有原生 Shadow DOM 支持的浏览器)
    * Emulated （默认值）全局样式能进来，组件样式出不去(会在DOM中加入特殊属性)
    * None 这跟把组件的样式直接放进 HTML 是一样的

3. 纯(pure)管道与非纯(impure)管道

    纯管道:只有在它检测到输入值发生了纯变更时才会执行纯管道。 纯变更是指对原始类型值(String、Number、Boolean、Symbol)的更改， 或者对对象引用(Date、Array、Function、Object)的更改。

    非纯管道:会在每个组件的变更检测周期中执行,非纯管道可能会被调用很多次，和每个按键或每次鼠标移动一样频繁。

4. 同步验证器和异步验证器

    同步验证器函数接受一个控件实例，然后返回一组验证错误或 null。你可以在实例化一个 FormControl 时把它作为构造函数的第二个参数传进去。

    异步验证器函数接受一个控件实例，并返回一个承诺（Promise）或可观察对象（Observable），它们稍后会发出一组验证错误或者 null。你可以在实例化一个 FormControl 时把它作为构造函数的第三个参数传进去。

    出于性能方面的考虑，只有在所有同步验证器都通过之后，Angular 才会运行异步验证器。当每一个异步验证器都执行完之后，才会设置这些验证错误。

5. 可观察对象 vs. 承诺

    * 可观察对象是声明式的，在被订阅之前，它不会开始执行。承诺是在创建时就立即执行的。这让可观察对象可用于定义那些应该按需执行的功能。

    ```ts
    // declare a publishing operation
    new Observable((observer) => { subscriber_fn });
    // initiate execution
    observable.subscribe(() => {
        // observer handles notifications
    });
    // initiate execution
    new Promise((resolve, reject) => { executer_fn });
    // handle return value
    promise.then((value) => {
        // handle result here
    });
    ```


    * 可观察对象能提供多个值。承诺只提供一个。这让可观察对象可用于随着时间的推移获取多个值。

    * 可观察对象会区分串联处理和订阅语句。承诺只有 .then() 语句。这让可观察对象可用于创建供系统的其它部分使用而不希望立即执行的复杂功能。

        * observable.map((v) => 2*v);

        * promise.then((v) => 2*v);

    * 可观察对象的 subscribe() 会负责处理错误。承诺会把错误推送给它的子承诺。这让可观察对象可用于进行集中式、可预测的错误处理。

    ```ts
    obs.subscribe(() => {
        throw Error('my error');
    });
    promise.then(() => {
      throw Error('my error');
    });
    ```

    * 可观察对象的订阅是可取消的。取消订阅会移除监听器，使其不再接受将来的值，并通知订阅者函数取消正在进行的工作。承诺是不可取消的。
    ```ts
    const sub = obs.subscribe(...);
    sub.unsubscribe();
    ```

    下列代码片段揭示了同样的操作要如何分别使用可观察对象和承诺进行实现。

    * 创建

        可观察对象
        new Observable((observer) => {
            observer.next(123);
        });

        承诺
        new Promise((resolve, reject) => {
            resolve(123);
        });

    * 转换

        可观察对象
        obs.map((value) => value * 2 );

        承诺
        promise.then((value) => value * 2);

    * 订阅

        可观察对象
        sub = obs.subscribe((value) => {
        console.log(value)
        });

        承诺
        promise.then((value) => {
        console.log(value);
        });

    * 取消订阅

        可观察对象
        sub.unsubscribe();

        承诺被解析时隐式完成。

6. 可观察对象 vs. 事件 API

    * 创建与取消

        可观察对象
        ```ts
        // Setup
        let clicks$ = fromEvent(buttonEl, ‘click’);
        // Begin listening
        let subscription = clicks$
        .subscribe(e => console.log(‘Clicked’, e))
        // Stop listening
        subscription.unsubscribe();
        function handler(e) {
        console.log(‘Clicked’, e);
        }
        ```

        事件 API
        ```js
        // Setup & begin listening
        button.addEventListener(‘click’, handler);
        // Stop listening
        button.removeEventListener(‘click’, handler);
        ```

    * 订阅

        可观察对象
        ```ts
        observable.subscribe(() => {
        // notification handlers here
        });
        ```

        事件 API
        ```js
        element.addEventListener(eventName, (event) => {
        // notification handler here
        });
        ```

    * 配置

        可观察对象
        监听按键，提供一个流来表示这些输入的值。
        ```ts
        fromEvent(inputEl, 'keydown').pipe(
        map(e => e.target.value)
        );
        ```

        事件 API
        不支持配置。
        ```js
        element.addEventListener(eventName, (event) => {
        // Cannot change the passed Event into another
        // value before it gets to the handler
        });
        ```

7. angular启动过程

    AppModule
    ```ts
    /* JavaScript imports */
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { FormsModule } from '@angular/forms';
    import { HttpModule } from '@angular/http';

    import { AppComponent } from './app.component';

    /* the AppModule class with the @NgModule decorator */
    @NgModule({
        //declarations —— 该应用所拥有的组件,当创建更多组件时，要把它们添加到 declarations 中

        declarations: [
            AppComponent
        ],
        //imports —— 导入 BrowserModule 以获取浏览器特有的服务，比如 DOM 渲染、无害化处理和位置（location）

        imports: [
            BrowserModule,
            FormsModule,
            HttpModule
        ],
        //providers —— 各种服务提供商

        providers: [],
        //bootstrap —— 根组件，Angular 创建它并插入 index.html 宿主页面

        bootstrap: [AppComponent]
    })
    export class AppModule { }
    ```

    创建指令
    ```ts
    import { Directive } from '@angular/core';

    @Directive({
    selector: '[appItem]'
    })
    export class ItemDirective {
    // code goes here
    constructor() { }

    }
    ```
    然后再app.module.ts中

    ```ts
    import { ItemDirective } from './item.directive';

    declarations: [
        AppComponent,
        ItemDirective
    ],
    ```

    服务提供
    ```ts
    import { Injectable } from '@angular/core';
    import { UserModule } from './user.module';

    @Injectable({
        providedIn: UserModule,
    })
    export class UserService {
    }
    ```

    路由
    ```ts
    import { NgModule } from '@angular/core';
    import { Routes, RouterModule } from '@angular/router';

    import { CustomerListComponent } from './customer-list/customer-list.component';

    const routes: Routes = [
        {
            path: '',
            component: CustomerListComponent
        }
    ];

    @NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
    export class CustomersRoutingModule { }
    ```

    