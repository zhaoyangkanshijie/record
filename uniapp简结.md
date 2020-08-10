# uniapp简结

* 参考链接

    [uniapp官网](https://uniapp.dcloud.io)

    [白话uni-app 【也是html、vue、小程序的区别】](https://ask.dcloud.net.cn/article/35657)

* [概述](#概述)
    * [架构](#架构)
    * [目录结构](#目录结构)
* [组件/标签的变化](#组件/标签的变化)
    * [html标签和uni-app内置组件的映射表](#html标签和uni-app内置组件的映射表)
    * [新增了一批手机端常用的新组件](#新增了一批手机端常用的新组件)
    * [js的变化](#js的变化)
    * [css的变化](#css的变化)
* [原生组件说明](#原生组件说明)
    * [混合渲染模式下原生组件的使用限制](#混合渲染模式下原生组件的使用限制)
    * [其他原生界面元素](#其他原生界面元素)
    * [vue页面层级覆盖解决方案](#vue页面层级覆盖解决方案)
    * [App的nvue页面层级问题](#App的nvue页面层级问题)
    * [Android系统主题字体对原生组件渲染的影响](#Android系统主题字体对原生组件渲染的影响)
* [页面样式与布局](#页面样式与布局)
    * [尺寸单位](#尺寸单位)

---

## 概述

uni-app 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到iOS、Android、H5、以及各种小程序（微信/支付宝/百度/头条/QQ/钉钉/淘宝）、快应用等多个平台。

开发者使用HBuilderX工具开发。

每个可显示的页面，都必须在 pages.json 中注册。如果你开发过小程序，那么pages.json类似app.json。如果你熟悉vue，这里没有vue的路由，都是在pages.json里管理。

uni-app的首页，是在pages.json里配的，page节点下第一个页面就是首页。一般在/pages/xx的目录下。

app和小程序中，为了提升体验，页面提供了原生的导航栏和底部tabbar，注意这些配置是在pages.json中做，而不是在vue页面里创建，但点击事件的监听在显示的vue页面中做。

在vue中，以前的js事件监听概念改为了生命周期概念。

如果你熟悉小程序开发的话，对比变化如下：

* 原来app.json被一拆为二。页面管理，被挪入了uni-app的pages.json；非页面管理，挪入了manifest.json
* 原来的app.js和app.wxss被合并到了app.vue中

### 架构

![架构](./uni-app-frame.png)

### 目录结构

```txt
┌─components            uni-app组件目录
│  └─comp-a.vue         可复用的a组件
├─hybrid                存放本地网页的目录
├─platforms             存放各平台专用页面的目录
├─pages                 业务页面文件存放的目录
│  ├─index
│  │  └─index.vue       index页面
│  └─list
│     └─list.vue        list页面
├─static                存放应用引用静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
├─wxcomponents          存放小程序组件的目录
├─main.js               Vue初始化入口文件
├─App.vue               应用配置，用来配置App全局样式以及监听 应用生命周期
├─manifest.json         配置应用名称、appid、logo、版本等打包信息
└─pages.json            配置页面路由、导航条、选项卡等页面类信息
```

## 组件/标签的变化

### html标签和uni-app内置组件的映射表

* div 改成 view
* span、font 改成 text
* a 改成 navigator
* img 改成 image
* input 还在，但type属性改成了confirmtype
* form、button、checkbox、radio、label、textarea、canvas、video 这些还在。
* select 改成 picker
* iframe 改成 web-view
* ul、li没有了，都用view替代
* audio 不再推荐使用，改成api方式，背景音频api文档

其实老的HTML标签也可以在uni-app里使用，uni-app编译器会在编译时把老标签转为新标签，比如把div编译成view。但不推荐这种用法，调试H5端时容易混乱。

### 新增了一批手机端常用的新组件

* scroll-view 可区域滚动视图容器
* swiper 可滑动区域视图容器
* icon 图标
* rich-text 富文本（不可执行js，但可渲染各种文字格式和图片）
* progress 进度条
* slider 滑块指示器
* switch 开关选择器
* camera 相机
* live-player 直播
* map 地图
* cover-view 可覆盖原生组件的视图容器 cover-view需要多强调几句，uni-app的非h5端的video、map、canvas、textarea是原生组件，层级高于其他组件。如需覆盖原生组件，则需要使用cover-view组件。详见[原生组件说明](#原生组件说明)

更多封装好的插件可到插件市场下载

### js的变化

h5端使用js，非h5端使用nodejs，因此window、document、navigator、location可能无法使用，其工具库如jquery也无法使用。

app和小程序支持web-view组件，里面可以加载标准HTML，这种页面仍然支持浏览器专用对象window、document、navigator、location。

以前的dom操作，改成vue的MVVM模式

因为uni-app的api是参考小程序的，所以和浏览器的js api有很多不同，如：

* alert,confirm 改成 uni.showmodel
* ajax 改成 uni.request
* cookie、session 没有了，local.storage 改成 uni.storage
* 更多的基本就是小程序的api，把wx.xxx改为uni.xxx即可，可查看[api](https://uniapp.dcloud.io/api/README)

跨端兼容:每个平台有自己的一些特性，因此会存在一些无法跨平台的情况，可使用[条件编译](https://uniapp.dcloud.io/platform)

写法：以 #ifdef 或 #ifndef 加 %PLATFORM% 开头，以 #endif 结尾。

```C
#ifdef APP-PLUS
需条件编译的代码
#endif
```

注意

* Android 和 iOS 平台不支持通过条件编译来区分，如果需要区分 Android、iOS 平台，请通过调用 uni.getSystemInfo 来获取平台信息。支持ifios、ifAndroid代码块，可方便编写判断。
* 有些跨端工具可以提供js的条件编译或多态，但这对于实际开发远远不够。uni-app不止是处理js，任何代码都可以多端条件编译，才能真正解决实际项目的跨端问题。另外所谓多态在实际开发中会造成大量冗余代码，很不利于复用和维护。举例，微信小程序主题色是绿色，而百度支付宝小程序是蓝色，你的应用想分平台适配颜色，只有条件编译是代码量最低、最容易维护的。
* 有些公司的产品运营总是给不同平台提不同需求，但这不是拒绝uni-app的理由。关键在于项目里，复用的代码多还是个性的代码多，正常都是复用的代码多，所以仍然应该多端。而个性的代码放到不同平台的目录下，差异化维护。

### css的变化

标准的css基本都是支持的。

选择器有2个变化：*选择器不支持；元素选择器里没有body，改为了page。

单位方面，px无法动态适应不同宽度的屏幕，rem无法用于nvue/weex。如果想使用根据屏幕宽度自适应的单位，推荐使用rpx，全端支持。详见[页面样式与布局](#页面样式与布局)中的[尺寸单位](#尺寸单位)

## 原生组件说明

小程序和App的vue页面，主体是webview渲染的。为了提升性能，小程序和App的vue页面下部分ui元素，比如导航栏、tabbar、video、map使用了原生控件。这种方式被称为混合渲染。

虽然提升了性能，但原生组件带来了其他问题：

1. 前端组件无法覆盖原生控件的层级问题
2. 原生组件不能嵌入特殊前端组件(如scroll-view)
3. 原生控件ui无法灵活自定义
4. 原生控件在Android上，字体会渲染为rom的主题字体，而webview如果不经过单独改造不会使用rom主题字体

H5、App的nvue页面，不存在混合渲染的情况，它们或者全部是前端渲染、或者全部是原生渲染，不涉及层级问题。

uni-app 中原生组件清单如下：

* map
* video
* camera（仅微信小程序、百度小程序支持）
* canvas（仅在微信小程序、百度小程序表现为原生组件）
* input（仅在微信小程序、支付宝小程序、字节跳动小程序、QQ小程序中且input置焦时表现为原生组件，其中支付宝小程序的input仅为text且置焦时才表现为原生组件）
* textarea（仅在微信小程序、百度小程序、字节跳动小程序表现为原生组件）
* live-player（仅微信小程序、百度小程序支持，App端直接使用video组件可同时实现拉流）
* live-pusher（仅微信小程序、百度小程序、app-nvue支持，app-vue使用plus.video.LivePusher可实现推流）
* cover-view
* cover-image
* ad (仅app、微信小程序、百度小程序、字节跳动小程序、QQ小程序支持)

### 混合渲染模式下原生组件的使用限制

由于原生组件脱离在 WebView 渲染流程外，因此在使用时有以下限制：

* 原生组件的层级是最高的，所以页面中的其他组件无论设置 z-index 为多少，都无法盖在原生组件上。后插入的原生组件可以覆盖之前的原生组件。
* 原生组件无法在 scroll-view、swiper、picker-view、movable-view 中使用。
* 同层渲染支持：微信基础库2.4.4起支持了video的同层渲染、微信基础库2.8.3支持map的同层渲染。支持同层渲染后，相关组件的时候不再有层级问题，无需再使用cover-view覆盖，也可以内嵌入swiper等组件。app-nvue 不涉及层级问题，天然所有组件都是同层渲染。
* 部分CSS样式无法应用于原生组件，例如：
    * 无法对原生组件设置 CSS 动画；
    * 无法定义原生组件为 position: fixed；
    * 不能在父级节点使用 overflow: hidden 来裁剪原生组件的显示区域。
* 在小程序端真机上，原生组件会遮挡 vConsole 弹出的调试面板。

### 其他原生界面元素

除了原生组件外，uni-app在非H5端还有其他原生界面元素，清单如下：

* 原生navigationBar和tabbar（pages.json里配置的）。
* web-view组件虽然不是原生的，但这个组件相当于一个原生webview覆盖在页面上，并且小程序上web-view组件是强制全屏的，无法在上面覆盖前端元素
* 弹出框：picker、showModal、showToast、showLoading、showActionSheet、previewImage、chooseImage、chooseVideo等弹出元素也无法被前端组件覆盖
* plus下的plus.nativeObj.view、plus.video.LivePusher、plus.nativeUI、plus.webview，层级均高于前端元素

注意：app的nvue页面里的组件虽然不涉及map、video等原生组件的层级遮挡问题，但pages.json中配置的原生tabbar、原生navigationBar，一样是nvue里的组件也无法遮挡的。

### vue页面层级覆盖解决方案

为了解决webview渲染中原生组件层级最高的限制，uni-app提供了 cover-view 和 cover-image 组件，让其覆盖在原生组件上。

除了跨端的cover-view，App端还提供了3种方案：plus.nativeObj.view、subNVue、新开半透明nvue页面。

* cover-view

只能覆盖原生组件，不能覆盖其他原生界面元素。比如cover-view可以覆盖video、map，但无法覆盖原生导航栏、tabbar、web-view。

微信小程序在基础库 2.4.0 起已支持 video 组件的同层渲染，2.7.0 起支持 map 组件的同层渲染。可以被前端元素通过调节zindex来遮挡，也支持在scroll-view等组件中内嵌这2个原生组件。但video全屏时，仍需要cover-view覆盖。

app-vue的cover-view相比小程序端还有一些限制

1. 无法嵌套
2. 无法内部滚动，即cover-view无法内部出现滚动条
3. 无法覆盖到视频的全屏界面。 app-nvue的cover-view无这些限制。

另外cover-view无论如何都无法解决原生导航栏、tabbar、web-view组件的覆盖，为此App端补充了2个层级覆盖方案plus.nativeObj.view和subNVue

* plus.nativeObj.view

它是一个原生的类画布的控件，其实cover-view也是用plus.nativeObj.view封装的，plus.nativeObj.view的API比较原生，可以画出任何界面，但plus.nativeObj.view有3个问题：

1. api很底层，开发比较复杂；
2. 不支持动画；
3. 不支持内部滚动。

* subNVue

subNVue是原生渲染的nvue子窗体，把一个nvue页面以半屏的方式覆盖在vue页面上。它解决了plus.nativeObj.view的不足，提供了强大的层级问题解决方案。

subNVue或弹出部分区域透明的nvue页面，会比plus.nativeObj.view多占用一些内存。所以如果你要覆盖的内容很简单，cover-view或plus.nativeObj.view可以简单实现的话，就没必要用subNVue或nvue。

所以如果你的层级覆盖问题比较简单，不用嵌套，且有跨端需求，就使用cover-view。

如果App端cover-view无法满足需求，且需要覆盖的原生界面比较简单，可以用plus.nativeObj.view。否则，就使用subnvue或部分区域透明的nvue吧。

关于subNVue和Webview的层级问题 subNVue的层级高于前端元素，但多个subNVue以及Webview，它们之间的也存在层级关系。

默认规则是，先创建的subNVue或webview在底部，后创建的会盖住之前的。

当然每个subNVue和webview，都支持Style参数配置，其中有一个zindex属性，可以调节它们的层级。

### App的nvue页面层级问题

nvue页面全部都是原生组件，互相之间没有层级问题。

但如果在pages.json里注册了原生导航栏和tabbar，nvue里的界面元素默认也无法覆盖这些，也需要plus.nativeObj.view或subNVue。

如果仅开发App，不跨端，不愿涉及层级问题，也可以不使用pages.json里的原生导航栏和tabbar，nvue页面不需要这些来强化性能。

### Android系统主题字体对原生组件渲染的影响

在Android手机上，调整系统主题字体，所有原生渲染的控件的字体都会变化，而webview渲染的字体则不会变化。

如果原生渲染和webview渲染出现在同一页面，就会发现字体不一致。

部分小程序通过修改了自带的webview内核，实现了webview也可以使用rom主题字体，比如微信、qq、支付宝；其他小程序及app-vue下，webview仍然无法渲染为rom主题字体。

不管Android字体问题、还是同层渲染问题，微信小程序都是依靠自带一个几十M的定制webview实现的，这对于App而言增加了太大的体积，不现实。

app端若在意字体不一致的问题，有2种解决建议：

1. 直接使用nvue。nvue是纯原生渲染，不存在webview渲染和原生字体不一致的问题。
2. app端不使用系统webview，而是使用x5浏览器内核。

## 页面样式与布局

### 尺寸单位

uni-app 支持的通用 css 单位包括 px(屏幕像素)、rpx(响应式px)

以750宽的屏幕为基准，750rpx恰好为屏幕宽度。屏幕变宽，rpx 实际显示效果会等比放大。

vue页面支持普通H5单位，但在nvue里不支持：

* rem 默认根字体大小为 屏幕宽度/20（微信小程序、字节跳动小程序、App、H5）
* vh viewpoint height，视窗高度，1vh等于视窗高度的1%
* vw viewpoint width，视窗宽度，1vw等于视窗宽度的1%
* nvue还不支持百分比单位。

App端，在 pages.json 里的 titleNView 或页面里写的 plus api 中涉及的单位，只支持 px。

nvue中，uni-app 模式可以使用 px 、rpx，表现与 vue 中一致。

weex 模式目前遵循weex的单位，它的单位比较特殊：

* px:，以750宽的屏幕为基准动态计算的长度单位，与 vue 页面中的 rpx 理念相同。（一定要注意 weex 模式的 px，和 vue 里的 px 逻辑不一样。）
* wx：与设备屏幕宽度无关的长度单位，与 vue 页面中的 px 理念相同

rpx换算：

* 设计稿 1px / 设计稿基准宽度 = 框架样式 1rpx / 750rpx
* 750 * 元素在设计稿中的宽度 / 设计稿基准宽度
* 若设计稿宽度为 750px，元素 A 在设计稿上的宽度为 100px，那么元素 A 在 uni-app 里面的宽度应该设为：750 * 100 / 750，结果为：100rpx。
* 若设计稿宽度为 640px，元素 A 在设计稿上的宽度为 100px，那么元素 A 在 uni-app 里面的宽度应该设为：750 * 100 / 640，结果为：117rpx。
* 若设计稿宽度为 375px，元素 B 在设计稿上的宽度为 200px，那么元素 B 在 uni-app 里面的宽度应该设为：750 * 200 / 375，结果为：400rpx。

注意：

* rpx 是和宽度相关的单位，屏幕越宽，该值实际像素越大。如不想根据屏幕宽度缩放，则应该使用 px 单位。
* 如果开发者在字体或高度中也使用了 rpx ，那么需注意这样的写法意味着随着屏幕变宽，字体会变大、高度会变大。如果你需要固定高度，则应该使用 px 。
* rpx不支持动态横竖屏切换计算，使用rpx建议锁定屏幕方向
* 设计师可以用 iPhone6 作为视觉稿的标准。
* 如果设计稿不是750px，HBuilderX提供了自动换算的工具
* App端，在 pages.json 里的 titleNView 或页面里写的 plus api 中涉及的单位，只支持 px，不支持 rpx。
