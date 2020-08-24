# uniapp简结

* 参考链接

    [uniapp官网](https://uniapp.dcloud.io)

    [白话uni-app 【也是html、vue、小程序的区别】](https://ask.dcloud.net.cn/article/35657)

    [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

* [概述](#概述)
    * [架构](#架构)
    * [目录结构](#目录结构)
* [组件/标签的变化](#组件/标签的变化)
    * [html标签和uni-app内置组件的映射表](#html标签和uni-app内置组件的映射表)
    * [新增了一批手机端常用的新组件](#新增了一批手机端常用的新组件)
    * [js的变化](#js的变化)
    * [css的变化](#css的变化)
    * [标签详解](#标签详解)
    * [API](#API)
* [原生组件说明](#原生组件说明)
    * [混合渲染模式下原生组件的使用限制](#混合渲染模式下原生组件的使用限制)
    * [其他原生界面元素](#其他原生界面元素)
    * [vue页面层级覆盖解决方案](#vue页面层级覆盖解决方案)
    * [App的nvue页面层级问题](#App的nvue页面层级问题)
    * [Android系统主题字体对原生组件渲染的影响](#Android系统主题字体对原生组件渲染的影响)
* [生命周期](#生命周期)
    * [应用生命周期](#应用生命周期)
    * [页面生命周期](#页面生命周期)
    * [组件生命周期](#组件生命周期)
* [路由跳转](#路由跳转)
* [页面样式与布局](#页面样式与布局)
    * [尺寸单位](#尺寸单位)
    * [内置CSS变量](#内置CSS变量)
    * [自定义组件](#自定义组件)
* [配置](#配置)
    * [pages.json](#pages.json)
    * [manifest.json](#manifest.json)
    * [package.json](#package.json)
    * [vue.config.js](#vue.config.js)
    * [uni.scss](#uni.scss)
    * [App.vue](#App.vue)
    * [main.js](#main.js)
* [页面通讯](#页面通讯)
* [测试](#测试)
* [使用问题](#使用问题)
    * [uni-app启动微信开发者工具](#uni-app启动微信开发者工具)
    * [sass/scss插件安装失败](#sass/scss插件安装失败)
    * [微信小程序分享](#微信小程序分享)
    * [h5请求跨域解决方案](#h5请求跨域解决方案)
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
├─wxcomponents          微信小程序自定义组件存放目录
│   └──custom           微信小程序自定义组件
│        ├─index.js
│        ├─index.wxml
│        ├─index.json
│        └─index.wxss
├─mycomponents          支付宝小程序自定义组件存放目录
│   └──custom           支付宝小程序自定义组件
│        ├─index.js
│        ├─index.axml
│        ├─index.json
│        └─index.wxss
├─swancomponents        百度小程序自定义组件存放目录
│   └──custom           百度小程序自定义组件
│        ├─index.js
│        ├─index.swan
│        ├─index.json
│        └
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
// #ifdef APP-PLUS
需条件编译的代码
// #endif
```

注意

* Android 和 iOS 平台不支持通过条件编译来区分，如果需要区分 Android、iOS 平台，请通过调用 uni.getSystemInfo 来获取平台信息。支持ifios、ifAndroid代码块，可方便编写判断。
* 有些跨端工具可以提供js的条件编译或多态，但这对于实际开发远远不够。uni-app不止是处理js，任何代码都可以多端条件编译，才能真正解决实际项目的跨端问题。另外所谓多态在实际开发中会造成大量冗余代码，很不利于复用和维护。举例，微信小程序主题色是绿色，而百度支付宝小程序是蓝色，你的应用想分平台适配颜色，只有条件编译是代码量最低、最容易维护的。
* 有些公司的产品运营总是给不同平台提不同需求，但这不是拒绝uni-app的理由。关键在于项目里，复用的代码多还是个性的代码多，正常都是复用的代码多，所以仍然应该多端。而个性的代码放到不同平台的目录下，差异化维护。

运行环境判断

```js
if(process.env.NODE_ENV === 'development'){
    console.log('开发环境')
}else{
    console.log('生产环境')
}
```

运行期判断

```js
switch(uni.getSystemInfoSync().platform){
    case 'android':
       console.log('运行Android上')
       break;
    case 'ios':
       console.log('运行iOS上')
       break;
    default:
       console.log('运行在开发者工具上')
       break;
}
```

### css的变化

标准的css基本都是支持的。

选择器有2个变化：*选择器不支持；元素选择器里没有body，改为了page。

单位方面，px无法动态适应不同宽度的屏幕，rem无法用于nvue/weex。如果想使用根据屏幕宽度自适应的单位，推荐使用rpx，全端支持。详见[页面样式与布局](#页面样式与布局)中的[尺寸单位](#尺寸单位)

### 标签详解

* 视图容器

    * view:类似div，可设置hover相关属性：hover-class，hover-stop-propagation(是否阻止本节点的祖先节点出现点击态)，hover-start-time，hover-stay-time
    * scroll-view:可滚动视图区域。在webview渲染的页面中，区域滚动的性能不及页面滚动。可设置滚动方向、位置、上下拉等属性和事件。

        ```html
        <view>
            <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
            @scroll="scroll">
                <view id="demo1" class="scroll-view-item uni-bg-red">A</view>
                <view id="demo2" class="scroll-view-item uni-bg-green">B</view>
                <view id="demo3" class="scroll-view-item uni-bg-blue">C</view>
            </scroll-view>
        </view>
        ```

    * swiper:轮播图。可设置导航点、动画时长、交互事件

        注意：
        
        使用竖向滚动时，需要给 scroll-view 一个固定高度，通过 css 设置 height

        其中只可放置 swiper-item 组件，否则会导致未定义的行为

        竖向的swiper内嵌视频可实现抖音、映客等视频垂直拖动切换效果

        同时监听 change transition，开始滑动时触发transition, 放开手后，在ios平台触发顺序为 transition... change，Android/微信小程序/支付宝为 transition... change transition...

        ```html
        <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
            <swiper-item>
                <view class="swiper-item uni-bg-red">A</view>
            </swiper-item>
            <swiper-item>
                <view class="swiper-item uni-bg-green">B</view>
            </swiper-item>
            <swiper-item>
                <view class="swiper-item uni-bg-blue">C</view>
            </swiper-item>
        </swiper>
        ```

    * movable-area:可拖动区域组件。内嵌movable-view组件用于指示可拖动的滑块(默认宽高为10px)。scale-area属性为true时支持双指缩放。还可设置其他移动和缩放的属性和事件。

        ```html
        <movable-area>
            <movable-view :x="x" :y="y" direction="all" @change="onChange">text</movable-view>
        </movable-area>
        ```

    * cover-view:覆盖在原生组件上的文本视图。仅可覆盖video、map
    * cover-image:覆盖在原生组件上的图片视图。支持click，不支持position: fixed、opacity、overflow、padding、linebreak、white-space

        ```html
        <view class="page">
            <video class="video" id="demoVideo" :controls="false" :enable-progress-gesture="false" :show-center-play-btn="disable" src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126-lite.m4v">
                <cover-view class="controls-title">简单的自定义 controls</cover-view>
                <cover-image class="controls-play img" @click="play" src="/static/play.png"></cover-image>
                <cover-image class="controls-pause img" @click="pause" src="/static/pause.png"></cover-image>
            </video>
        </view>
        ```

* 基础内容

    * icon:图标。可设置类型、大小、颜色。

        类型：

        * App、H5、微信小程序、QQ小程序：success, success_no_circle, info, warn, waiting, cancel, download, search, clear
        * 支付宝小程序：info, warn, waiting, cancel, download, search, clear, success, success_no_circle,loading
        * 百度小程序：success, info, warn, waiting, success_no_circle, clear, search, personal, setting, top, close, cancel, download, checkboxSelected, radioSelected, radioUnselect

    * text:文本组件。可设置是否可选、空格类型(ensp中文字符空格一半大小/emsp中文字符空格大小/nbsp根据字体设置的空格大小)、是否解码。
    * rich-text:富文本。在富文本区域里显示的 HTML/文本 节点。
    * progress:进度条。可设置百分比、样式、动画

* 表单组件

    * button:按钮。可设置样式、loading、是否触发submit、按钮事件

        * size 有效值：default默认大小、mini小尺寸
        * type 有效值：primary微信小程序、360小程序为绿色，App、H5、百度小程序、支付宝小程序、快应用为蓝色，字节跳动小程序为红色，QQ小程序为浅蓝色。如想在多端统一颜色，请改用default，然后自行写样式；default	白色；warn红色
        * form-type 有效值：submit提交表单、reset重置表单

    * checkbox-group和checkbox:多项选择器，内部由多个 checkbox 组成。

        ```html
        <checkbox-group>
            <label>
                <checkbox value="cb" checked="true" />选中
            </label>
            <label>
                <checkbox value="cb" />未选中
            </label>
        </checkbox-group>
        ```

    * editor:富文本编辑器，可以对图片、文字格式进行编辑和混排。只有H5、App的vue页面和微信支持，其他端平台自身为提供editor组件，只能使用webview加载web页面，或查看插件市场。

        * 不满足的标签会被忽略，div会被转行为p储存。
        * 行内元素:span/strong/b/ins/em/i/u/a/del/s/sub/sup/img
        * 块级元素:p/h1/h2/h3/h4/h5/h6/hr/ol/ul/li
        * 块级样式:text-align direction margin margin-top margin-left margin-right margin-bottom padding padding-top padding-left padding-right padding-bottom line-height text-indent
        * 行内样式:font font-size font-style font-variant font-weight font-family letter-spacing text-decoration color background-color

        ```html
        <editor id="editor" class="ql-container" :placeholder="placeholder" @ready="onEditorReady"></editor>
        ```

    * form:表单，与html相同
    * input:输入框。多了confirm-type用于设置键盘右下角按钮的文字(send发送/search搜索/next下一个/go前往/done完成)，仅在 type="text" 时生效。APP平台兼容可查文档
    * label:用来改进表单组件的可用性，使用for属性找到对应的id，或者将控件放在该标签下，当点击时，就会触发对应的控件。目前可以绑定的控件有：button, checkbox, radio, switch。
    * picker:从底部弹起的滚动选择器。支持五种选择器，通过mode来区分，分别是普通选择器，多列选择器，时间选择器，日期选择器，省市区选择器，默认是普通选择器。
    
        mode为 selector 或 multiSelector(多列选择器) 时，range 有效

        当 range 是一个 Array＜Object＞ 时，通过 range-key 来指定 Object 中 key 的值作为选择器显示内容

        value 的值表示选择了 range 中的第几个（下标从 0 开始）

        可监听change和cancel事件，可禁用

        mode = time时间选择器，可设置起止时间

        mode = region省市区选择器，不支持app和h5，需用picker-view自行填充

    * picker-view:嵌入页面的滚动选择器。

        ```html
        <picker-view v-if="visible" :indicator-style="indicatorStyle" :value="value" @change="bindChange">
            <picker-view-column>
                <view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
            </picker-view-column>
            <picker-view-column>
                <view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
            </picker-view-column>
            <picker-view-column>
                <view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
            </picker-view-column>
        </picker-view>
        ```

    * radio-group:单项选择器，内部由多个 radio 组成。通过把多个radio包裹在一个radio-group下，实现这些radio的单选。

        ```html
        <radio-group @change="radioChange">
            <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
                <view>
                    <radio :value="item.value" :checked="index === current" />
                </view>
                <view>{{item.name}}</view>
            </label>
        </radio-group>
        ```

    * slider:滑动选择器。可设置范围值、步长、样式、改变事件。

        ```html
        <slider value="60" @change="sliderChange" step="5" />
        ```

    * switch:开关选择器。
    * textarea:多行输入框。
    
        textarea 的 blur 事件会晚于页面上的 tap 事件，如果需要在 button 的点击事件获取 textarea，可以使用 form 的 @submit。

        微信小程序、百度小程序、字节跳动小程序中，textarea是原生组件，层级高于前端组件，请勿在 scroll-view、swiper、picker-view、movable-view 中使用 textarea 组件。覆盖textarea需要使用cover-view。

        小程序端 css 动画对 textarea 组件无效。

        如需禁止点击其他位置收起键盘的默认行为，可以监听touch事件并使用prevent修饰符

* 导航navigator见[路由跳转](#路由跳转)

* 媒体组件

    * audio:音频。
    * camera:页面内嵌的区域相机组件。注意这不是点击后全屏打开的相机。
    * image:图片。比h5多了图片裁剪缩放、懒加载设置、动画。
    * video:视频播放组件。能设置弹幕、手势、缓冲。
    * live-player:实时音视频播放，也称直播拉流。
    * live-pusher:实时音视频录制，也称直播推流。

* 地图map

* 画布canvas

* webview:web-view 是一个 web 浏览器组件(类似iframe)，可以用来承载网页的容器，会自动铺满整个页面

* 广告ad:应用内展示的广告组件，可用于banner或信息流。

* 开放能力组件

    * official-account:微信公众号关注组件。当用户扫小程序码打开小程序时，开发者可在小程序内配置公众号关注组件，方便用户快捷关注公众号，可嵌套在原生组件内。
    * open-data:用于展示平台开放的数据。

        ```html
        <open-data type="userNickName"></open-data>
        ```

* app nvue专用组件

    * Barcode:app端nvue专用的扫码组件。
    * list:app端nvue专用组件。在app-nvue下，如果是长列表，使用list组件的性能高于使用view或scroll-view的滚动。原因在于list在不可见部分的渲染资源回收有特殊的优化处理。
    * cell:app端nvue专用组件。它的重要价值在于告诉原生引擎，哪些部分是可重用的。Cell 支持添加任意类型的组件作为自己的子组件，但是请不要再内部添加滚动容器了。
    * recycle-list:一个新的列表容器，具有回收和复用的能力，可以大幅优化内存占用和渲染性能。它的性能比list组件更高，但写法受限制。它除了会释放不可见区域的渲染资源，在非渲染的数据结构上也有更多优化。
    * waterfall:瀑布流布局的核心组件。
    * refresh:为容器提供下拉刷新功能

* 拓展组件

    * uni-ui:DCloud提供的一个跨端ui库，它是基于vue组件的、flex布局的、无dom的跨全端ui框架。
    * Badge:数字角标
    * Calendar:日历
    * Card:卡片
    * Collapse:折叠面板
    * Combox:组合框
    * CountDown:倒计时
    * Drawer:抽屉
    * Fab:悬浮按钮
    * Fav:收藏按钮
    * GoodsNav:商品导航
    * Grid:宫格
    * Icons:图标
    * IndexedList:索引列表
    * List:列表
    * LoadMore:加载更多
    * NavBar:自定义导航栏
    * NoticeBar:通告栏
    * NumberBox:数字输入框
    * Pagination:分页器
    * PopUp:弹出层
    * Rate:评分
    * SearchBar:搜索栏
    * SegmentedControl:分段器
    * Steps:步骤条
    * SwipeAction:滑动操作
    * SwiperDot:轮播图指示点
    * Tag:标签

* 导航栏navigation-bar:页面导航条配置节点，用于指定导航栏的一些属性。只能是 page-meta 组件内的第一个节点，需要配合它一同使用。
* 页面属性配置:page-meta

### API

* 基础

    * console日志打印:与h5相同
    * 定时器:与h5相同
    * base64与arrayBuffer互转:uni.arrayBufferToBase64(arrayBuffer)/uni.base64ToArrayBuffer(base64) 仅支持app和微信小程序
    * 应用级事件:

        * uni.onPageNotFound(funciton callback):监听应用要打开的页面不存在事件。该事件与 App.onPageNotFound 的回调时机一致
        * uni.onError(funciton callback):监听小程序错误事件
        * uni.onAppShow(function callback):监听应用切前台事件
        * uni.onAppHide(function callback):监听应用切后台事件
        * uni.offPageNotFound(function callback):取消监听应用要打开的页面不存在事件
        * uni.offError(funciton callback):取消监听应用错误事件
        * uni.offAppShow(function callback):取消监听小程序切前台事件
        * uni.offAppHide(function callback):取消监听小程序切后台事件

* 网络

    * uni.request(OBJECT):发起网络请求。

        ```js
        uni.request({
            url: 'https://www.example.com/request', //仅为示例，并非真实接口地址。
            data: {
                text: 'uni.request'
            },
            header: {
                'custom-header': 'hello' //自定义请求头信息
            },
            success: (res) => {
                console.log(res.data);
                this.text = 'request success';
            }
        });
        ```

    * uni.uploadFile(OBJECT):上传

        ```js
        uni.chooseImage({
            success: (chooseImageRes) => {
                const tempFilePaths = chooseImageRes.tempFilePaths;
                uni.uploadFile({
                    url: 'https://www.example.com/upload', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'user': 'test'
                    },
                    success: (uploadFileRes) => {
                        console.log(uploadFileRes.data);
                    }
                });
            }
        });
        ```
        上传进度
        ```js
        uni.chooseImage({
            success: (chooseImageRes) => {
                const tempFilePaths = chooseImageRes.tempFilePaths;
                const uploadTask = uni.uploadFile({
                    url: 'https://www.example.com/upload', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'user': 'test'
                    },
                    success: (uploadFileRes) => {
                        console.log(uploadFileRes.data);
                    }
                });

                uploadTask.onProgressUpdate((res) => {
                    console.log('上传进度' + res.progress);
                    console.log('已经上传的数据长度' + res.totalBytesSent);
                    console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

                    // 测试条件，取消上传任务。
                    if (res.progress > 50) {
                        uploadTask.abort();
                    }
                });
            }
        });
        ```

    * uni.downloadFile(OBJECT):下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径。

        ```js
        uni.downloadFile({
            url: 'https://www.example.com/file/test', //仅为示例，并非真实的资源
            success: (res) => {
                if (res.statusCode === 200) {
                    console.log('下载成功');
                }
            }
        });
        ```
        下载进度
        ```js
        const downloadTask = uni.downloadFile({
            url: 'http://www.example.com/file/test', //仅为示例，并非真实的资源
            success: (res) => {
                if (res.statusCode === 200) {
                    console.log('下载成功');
                }
            }
        });

        downloadTask.onProgressUpdate((res) => {
            console.log('下载进度' + res.progress);
            console.log('已经下载的数据长度' + res.totalBytesWritten);
            console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);

            // 测试条件，取消下载任务。
            if (res.progress > 50) {
                downloadTask.abort();
            }
        });
        ```

    * websocket

        * uni.connectSocket(OBJECT):创建一个 WebSocket 连接。

            ```js
            uni.connectSocket({
                url: 'wss://www.example.com/socket',
                data() {
                    return {
                        x: '',
                        y: ''
                    };
                },
                header: {
                    'content-type': 'application/json'
                },
                protocols: ['protocol1'],
                method: 'GET',
                success: ()=> {}
            });
            ```

        * uni.onSocketOpen(CALLBACK):监听WebSocket连接打开事件。

        * uni.onSocketError(CALLBACK):监听WebSocket错误。

        * uni.sendSocketMessage(OBJECT):通过 WebSocket 连接发送数据

            需要先 uni.connectSocket，并在 uni.onSocketOpen 回调之后才能发送。
            ```js
            var socketOpen = false;
            var socketMsgQueue = [];

            uni.connectSocket({
                url: 'wss://www.example.com/socket'
            });

            uni.onSocketOpen(function (res) {
                socketOpen = true;
                for (var i = 0; i < socketMsgQueue.length; i++) {
                    sendSocketMessage(socketMsgQueue[i]);
                }
                socketMsgQueue = [];
            });

            function sendSocketMessage(msg) {
                if (socketOpen) {
                    uni.sendSocketMessage({
                    data: msg
                    });
                } else {
                    socketMsgQueue.push(msg);
                }
            }
            ```

        * uni.onSocketMessage(CALLBACK):监听WebSocket接受到服务器的消息事件。

        * uni.closeSocket(OBJECT):监听WebSocket关闭。

        * SocketTask.onMessage(CALLBACK):监听 WebSocket 接受到服务器的消息事件

        * SocketTask.send(OBJECT):通过 WebSocket 连接发送数据

        * SocketTask.close(OBJECT):关闭 WebSocket 连接

        * SocketTask.onOpen(CALLBACK):监听 WebSocket 连接打开事件

        * SocketTask.onClose(CALLBACK):监听 WebSocket 连接关闭事件

        * SocketTask.onError(CALLBACK):监听 WebSocket 错误事件

* 数据缓存

    * uni.setStorage(OBJECT):将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口。

        ```js
        uni.setStorage({
            key: 'storage_key',
            data: 'hello',
            success: function () {
                console.log('success');
            }
        });
        ```

    * uni.setStorageSync(KEY,DATA):将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。

        ```js
        try {
            uni.setStorageSync('storage_key', 'hello');
        } catch (e) {
            // error
        }
        ```

    * uni.getStorage(OBJECT):从本地缓存中异步获取指定 key 对应的内容。

        ```js
        uni.getStorage({
            key: 'storage_key',
            success: function (res) {
                console.log(res.data);
            }
        });
        ```

    * uni.getStorageSync(KEY):从本地缓存中同步获取指定 key 对应的内容。

        ```js
        try {
            const value = uni.getStorageSync('storage_key');
            if (value) {
                console.log(value);
            }
        } catch (e) {
            // error
        }
        ```

    * uni.getStorageInfo(OBJECT):异步获取当前 storage 的相关信息。

        ```js
        uni.getStorageInfo({
            success: function (res) {
                console.log(res.keys);
                console.log(res.currentSize);
                console.log(res.limitSize);
            }
        });
        ```

    * uni.getStorageInfoSync():同步获取当前 storage 的相关信息。

        ```js
        try {
            const res = uni.getStorageInfoSync();
            console.log(res.keys);
            console.log(res.currentSize);
            console.log(res.limitSize);
        } catch (e) {
            // error
        }
        ```

    * uni.removeStorage(OBJECT):从本地缓存中异步移除指定 key。

        ```js
        uni.removeStorage({
            key: 'storage_key',
            success: function (res) {
                console.log('success');
            }
        });
        ```

    * uni.removeStorageSync(KEY):从本地缓存中同步移除指定 key。

        ```js
        try {
            uni.removeStorageSync('storage_key');
        } catch (e) {
            // error
        }
        ```

    * uni.clearStorage():清理本地数据缓存。

    * uni.clearStorageSync():同步清理本地数据缓存。

    * 注意：

        * H5端为localStorage，浏览器限制5M大小，是缓存概念，可能会被清理

        * 微信小程序单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。

* 位置

    * uni.getLocation(OBJECT):获取当前的地理位置、速度。

        ```js
        uni.getLocation({
            type: 'wgs84',
            success: function (res) {
                console.log('当前位置的经度：' + res.longitude);
                console.log('当前位置的纬度：' + res.latitude);
            }
        });
        ```

    * uni.chooseLocation(OBJECT):打开地图选择位置。

        ```js
        uni.chooseLocation({
            success: function (res) {
                console.log('位置名称：' + res.name);
                console.log('详细地址：' + res.address);
                console.log('纬度：' + res.latitude);
                console.log('经度：' + res.longitude);
            }
        });
        ```

    * uni.openLocation(OBJECT):使用应用内置地图查看位置。

        ```js
        uni.getLocation({
            type: 'gcj02', //返回可以用于uni.openLocation的经纬度
            success: function (res) {
                const latitude = res.latitude;
                const longitude = res.longitude;
                uni.openLocation({
                    latitude: latitude,
                    longitude: longitude,
                    success: function () {
                        console.log('success');
                    }
                });
            }
        });
        ```

    * uni.createMapContext(mapId,this):创建并返回 map 上下文 mapContext 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 \<map> 组件。

* 媒体

    * 图片

        * uni.chooseImage(OBJECT):从本地相册选择图片或使用相机拍照。

            ```js
            uni.chooseImage({
                count: 6, //默认9
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album'], //从相册选择
                success: function (res) {
                    console.log(JSON.stringify(res.tempFilePaths));
                }
            });
            ```

        * uni.previewImage(OBJECT):预览图片。

            ```js
            uni.chooseImage({
                count: 6,
                sizeType: ['original', 'compressed'],
                sourceType: ['album'],
                success: function(res) {
                    // 预览图片
                    uni.previewImage({
                        urls: res.tempFilePaths,
                        longPressActions: {
                            itemList: ['发送给朋友', '保存图片', '收藏'],
                            success: function(data) {
                                console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
                            },
                            fail: function(err) {
                                console.log(err.errMsg);
                            }
                        }
                    });
                }
            });
            ```

        * uni.getImageInfo(OBJECT):获取图片信息。

            ```js
            uni.chooseImage({
                count: 1,
                sourceType: ['album'],
                success: function (res) {
                    uni.getImageInfo({
                        src: res.tempFilePaths[0],
                        success: function (image) {
                            console.log(image.width);
                            console.log(image.height);
                        }
                    });
                }
            });
            ```

        * uni.saveImageToPhotosAlbum(OBJECT):保存图片到系统相册。

            ```js
            uni.chooseImage({
                count: 1,
                sourceType: ['camera'],
                success: function (res) {
                    uni.saveImageToPhotosAlbum({
                        filePath: res.tempFilePaths[0],
                        success: function () {
                            console.log('save success');
                        }
                    });
                }
            });
            ```

        * uni.compressImage(OBJECT):压缩图片接口，可选压缩质量

            ```js
            uni.compressImage({
                src: '/static/logo.jpg',
                quality: 80,
                success: res => {
                    console.log(res.tempFilePath)
                }
            })
            ```

        * wx.chooseMessageFile(OBJECT):从微信聊天会话中选择文件。

    * 录音

        * uni.getRecorderManager():获取全局唯一的录音管理器 recorderManager

            ```js
            const recorderManager = uni.getRecorderManager();
            const innerAudioContext = uni.createInnerAudioContext();

            innerAudioContext.autoplay = true;

            export default {
                data: {
                    text: 'uni-app',
                    voicePath: ''
                },
                onLoad() {
                    let self = this;
                    recorderManager.onStop(function (res) {
                        console.log('recorder stop' + JSON.stringify(res));
                        self.voicePath = res.tempFilePath;
                    });
                },
                methods: {
                    startRecord() {
                        console.log('开始录音');

                        recorderManager.start();
                    },
                    endRecord() {
                        console.log('录音结束');
                        recorderManager.stop();
                    },
                    playVoice() {
                        console.log('播放录音');

                        if (this.voicePath) {
                            innerAudioContext.src = this.voicePath;
                            innerAudioContext.play();
                        }
                    }
                }
            }
            ```

    * 音频

        * uni.getBackgroundAudioManager():获取全局唯一的背景音频管理器 backgroundAudioManager

            ```js
            const bgAudioMannager = uni.getBackgroundAudioManager();
            bgAudioMannager.title = '致爱丽丝';
            bgAudioMannager.singer = '暂无';
            bgAudioMannager.coverImgUrl = 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.jpg';
            bgAudioMannager.src = 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3';
            ```

        * uni.createInnerAudioContext():创建并返回内部 audio 上下文 innerAudioContext 对象

            ```js
            const innerAudioContext = uni.createInnerAudioContext();
            innerAudioContext.autoplay = true;
            innerAudioContext.src = 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3';
            innerAudioContext.onPlay(() => {
                console.log('开始播放');
            });
            innerAudioContext.onError((res) => {
                console.log(res.errMsg);
                console.log(res.errCode);
            });
            ```

    * 视频

        * uni.chooseVideo(OBJECT):拍摄视频或从手机相册中选视频，返回视频的临时文件路径。

            ```js
            uni.chooseVideo({
                count: 1,
                sourceType: ['camera', 'album'],
                success: function (res) {
                    self.src = res.tempFilePath;
                }
            });
            ```

        * uni.chooseMedia(OBJECT):拍摄或从手机相册中选择图片或视频。

            ```js
            uni.chooseMedia({
                count: 9,
                mediaType: ['image','video'],
                sourceType: ['album', 'camera'],
                maxDuration: 30,
                camera: 'back',
                success(res) {
                    console.log(res.tempFilest)
                }
            })
            ```

        * uni.saveVideoToPhotosAlbum(OBJECT):保存视频到系统相册

            ```js
            uni.chooseVideo({
                count: 1,
                sourceType: ['camera'],
                success: function (res) {
                    self.src = res.tempFilePath;

                    uni.saveVideoToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function () {
                            console.log('save success');
                        }
                    });
                }
            });
            ```

        * uni.getVideoInfo(OBJECT):获取视频详细信息

        * uni.compressVideo(OBJECT):压缩视频接口。

        * uni.openVideoEditor(OBJECT):打开视频编辑器

        * uni.createVideoContext(videoId, this):创建并返回 video 上下文 videoContext 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 \<video> 组件。

    * 相机

        * uni.createCameraContext():创建并返回 camera 组件的上下文 cameraContext 对象

    * 直播

        * uni.createLivePlayerContext(livePlayerId, this):创建 live-player 上下文 livePlayerContext 对象。注意是直播的播放而不是推流。

        * uni.createLivePusherContext(livePusherId, this):创建 live-pusher 上下文 livePusherContext 对象

    * 富文本

        * editorContext:editor 组件对应的 editorContext 实例，可通过 uni.createSelectorQuery 获取。

        * editorContext.format(name, value):修改样式

        * editorContext.insertDivider(OBJECT):插入分割线

        * editorContext.insertImage(OBJECT):插入图片

        * editorContext.insertText(OBJECT):覆盖当前选区，设置一段文本

        * editorContext.setContents(OBJECT):初始化编辑器内容

        * editorContext.getContents(OBJECT):获取编辑器内容

        * editorContext.clear(OBJECT):清空编辑器内容

        * editorContext.removeFormat(OBJECT):清除当前选区的样式

        * editorContext.undo(OBJECT):撤销

        * editorContext.redo(OBJECT):恢复

    * 音视频合成

        * uni.createMediaContainer():创建音视频处理容器，最终可将容器中的轨道合成一个视频 ，返回 MediaContainer 对象

        * MediaContainer.addTrack(track):将音频或视频轨道添加到容器

        * MediaContainer.destroy():将容器销毁，释放资源

        * MediaContainer.export():将容器内的轨道合并并导出视频文件

        * MediaContainer.extractDataSource(object):将容器内的轨道合并并导出视频文件 ,返回 MediaTrack 对象

        * MediaContainer.removeTrack(track):将音频或视频轨道添加到容器

        * MediaTrack:音频或视频轨道，可以对轨道进行一些操作，可通过 MediaContainer.extractDataSource 返回

* 设备信息

    * uni.getSystemInfo(OBJECT):获取系统信息(手机品牌、屏幕宽高、导航、电量、wifi、蓝牙等)

        ```js
        uni.getSystemInfo({
            success: function (res) {
                console.log(res.model);
                console.log(res.pixelRatio);
                console.log(res.windowWidth);
                console.log(res.windowHeight);
                console.log(res.language);
                console.log(res.version);
                console.log(res.platform);
            }
        });
        ```

    * uni.getSystemInfoSync():获取系统信息同步接口

        ```js
        try {
            const res = uni.getSystemInfoSync();
            console.log(res.model);
            console.log(res.pixelRatio);
            console.log(res.windowWidth);
            console.log(res.windowHeight);
            console.log(res.language);
            console.log(res.version);
            console.log(res.platform);
        } catch (e) {
            // error
        }
        ```

    * uni.canIUse(String):判断应用的 API，回调，参数，组件等是否在当前版本可用

        ```js
        uni.canIUse('getSystemInfoSync.return.screenWidth');
        uni.canIUse('getSystemInfo.success.screenWidth');
        uni.canIUse('showToast.object.image');
        uni.canIUse('request.object.method.GET');
        uni.canIUse('live-player');
        uni.canIUse('text.selectable');
        uni.canIUse('button.open-type.contact');
        ```

    * uni.onMemoryWarning(CALLBACK):监听内存不足告警事件

    * uni.getNetworkType(OBJECT):获取网络类型

        ```js
        uni.getNetworkType({
            success: function (res) {
                console.log(res.networkType);
            }
        });
        ```

    * uni.onNetworkStatusChange(CALLBACK):监听网络状态变化。

        ```js
        uni.onNetworkStatusChange(function (res) {
            console.log(res.isConnected);
            console.log(res.networkType);
        });
        ```

    * uni.onUIStyleChange(CALLBACK):监听系统主题状态变化。

        ```js
        uni.onUIStyleChange(function (res) {
            console.log(res.style);
        });
        ```

    * uni.onAccelerometerChange(CALLBACK):监听加速度数据，频率：5次/秒，接口调用后会自动开始监听，可使用 uni.stopAccelerometer 停止监听。

        ```js
        uni.onAccelerometerChange(function (res) {
            console.log(res.x);
            console.log(res.y);
            console.log(res.z);
        });
        ```

    * uni.startAccelerometer(OBJECT):开始监听加速度数据,包含回调函数

    * uni.stopAccelerometer(OBJECT):停止监听加速度数据,包含回调函数

    * uni.onCompassChange(CALLBACK):监听罗盘数据，频率：5次/秒，接口调用后会自动开始监听，可使用 uni.stopCompass 停止监听。

    * uni.startCompass(OBJECT):开始监听罗盘数据,包含回调函数

    * uni.stopCompass(OBJECT):停止监听罗盘数据,包含回调函数

    * uni.onGyroscopeChange(CALLBACK):监听陀螺仪数据变化事件。

    * uni.startGyroscope(OBJECT):开始监听陀螺仪数据,包含回调函数

    * uni.stopGyroscope(OBJECT):停止监听陀螺仪数据,包含回调函数

    * uni.makePhoneCall(OBJECT):拨打电话

        ```js
        uni.makePhoneCall({
            phoneNumber: '114' //仅为示例
        });
        ```

    * uni.scanCode(OBJECT):调起客户端扫码界面，扫码成功后返回对应的结果。

        ```js
        // 允许从相机和相册扫码
        uni.scanCode({
            success: function (res) {
                console.log('条码类型：' + res.scanType);
                console.log('条码内容：' + res.result);
            }
        });

        // 只允许通过相机扫码
        uni.scanCode({
            onlyFromCamera: true,
            success: function (res) {
                console.log('条码类型：' + res.scanType);
                console.log('条码内容：' + res.result);
            }
        });

        // 调起条码扫描
        uni.scanCode({
            scanType: ['barCode'],
            success: function (res) {
                console.log('条码类型：' + res.scanType);
                console.log('条码内容：' + res.result);
            }
        });
        ```

    * uni.setClipboardData(OBJECT):设置系统剪贴板的内容。

        ```js
        uni.setClipboardData({
            data: 'hello',
            success: function () {
                console.log('success');
            }
        });
        ```

    * uni.getClipboardData(OBJECT):获取系统剪贴板内容

        ```js
        uni.getClipboardData({
            success: function (res) {
                console.log(res.data);
            }
        });
        ```

    * uni.setScreenBrightness(OBJECT):设置屏幕亮度

        ```js
        uni.setScreenBrightness({
            value: 0.5,
            success: function () {
                console.log('success');
            }
        });
        ```

    * uni.getScreenBrightness(OBJECT):获取屏幕亮度

        ```js
        uni.getScreenBrightness({
            success: function (res) {
                console.log('屏幕亮度值：' + res.value);
            }
        });
        ```

    * uni.setKeepScreenOn(OBJECT):设置是否保持常亮状态。仅在当前应用生效，离开应用后设置失效。

        ```js
        uni.setKeepScreenOn({
            keepScreenOn: true
        });
        ```

    * uni.onUserCaptureScreen(CALLBACK):监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件。

    * uni.vibrate(OBJECT):使手机发生振动。

        ```js
        uni.vibrate({
            success: function () {
                console.log('success');
            }
        });
        ```

    * uni.vibrateLong(OBJECT):使手机发生较长时间的振动（400ms）。

        ```js
        uni.vibrateLong({
            success: function () {
                console.log('success');
            }
        });
        ```

    * uni.vibrateShort(OBJECT):使手机发生较短时间的振动（15ms）。

        ```js
        uni.vibrateShort({
            success: function () {
                console.log('success');
            }
        });
        ```

    * uni.addPhoneContact(OBJECT):调用后，用户可以选择将该表单以“新增联系人”或“添加到已有联系人”的方式（APP端目前没有选择步骤，将直接写入），写入手机系统通讯录，完成手机通讯录联系人和联系方式的增加。

        ```js
        uni.addPhoneContact({
            nickName: '昵称',
            lastName: '姓',
            firstName: '名',
            remark: '备注',
            mobilePhoneNumber: '114',
            weChatNumber: 'wx123',
            success: function () {
                console.log('success');
            },
            fail: function () {
                console.log('fail');
            }
        });
        ```

    * uni.openBluetoothAdapter(OBJECT):初始化蓝牙模块

        其他蓝牙相关 API 必须在 uni.openBluetoothAdapter 调用之后使用。否则 API 会返回错误（errCode=10000）。

        在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用 uni.openBluetoothAdapter 会返回错误（errCode=10001），表示手机蓝牙功能不可用。此时APP蓝牙模块已经初始化完成，可通过 uni.onBluetoothAdapterStateChange 监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。

        ```js
        uni.openBluetoothAdapter({
            success(res) {
                console.log(res)
            }
        })
        ```

    * uni.startBluetoothDevicesDiscovery(OBJECT):开始搜寻附近的蓝牙外围设备。此操作比较耗费系统资源，请在搜索并连接到设备后调用 uni.stopBluetoothDevicesDiscovery 方法停止搜索。

        ```js
        uni.startBluetoothDevicesDiscovery({
            services: ['FEE7'],
            success(res) {
                console.log(res)
            }
        })
        ```

    * uni.onBluetoothDeviceFound(CALLBACK):监听寻找到新设备的事件

    * uni.stopBluetoothDevicesDiscovery(OBJECT):停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。

        ```js
        uni.stopBluetoothDevicesDiscovery({
            success(res) {
                console.log(res)
            }
        })
        ```

    * uni.onBluetoothAdapterStateChange(CALLBACK):监听蓝牙适配器状态变化事件

    * uni.getConnectedBluetoothDevices(OBJECT):根据 uuid 获取处于已连接状态的设备。

        ```js
        uni.getConnectedBluetoothDevices({
            success(res) {
                console.log(res)
            }
        })
        ```

    * uni.getBluetoothDevices(OBJECT):获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。

        ```js
        uni.getBluetoothDevices({
            success(res) {
                console.log(res)
            }
        })
        ```

    * uni.getBluetoothAdapterState(OBJECT):获取本机蓝牙适配器状态。

        ```js
        uni.getBluetoothAdapterState({
            success(res) {
                console.log(res)
            }
        })
        ```
    
    * uni.closeBluetoothAdapter(OBJECT):关闭蓝牙模块。调用该方法将断开所有已建立的连接并释放系统资源。建议在使用蓝牙流程后，与 uni.openBluetoothAdapter 成对调用。

        ```js
        uni.closeBluetoothAdapter({
            success(res) {
                console.log(res)
            }
        })
        ```

    * uni.setBLEMTU(OBJECT):设置蓝牙最大传输单元。需在 uni.createBLEConnection调用成功后调用，mtu 设置范围 (22,512)。安卓5.1以上有效。

    * uni.writeBLECharacteristicValue(OBJECT):向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用。

        ```js
        // 向蓝牙设备发送一个0x00的16进制数据
        const buffer = new ArrayBuffer(1)
        const dataView = new DataView(buffer)
        dataView.setUint8(0, 0)
        uni.writeBLECharacteristicValue({
            // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
            deviceId,
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId,
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId,
            // 这里的value是ArrayBuffer类型
            value: buffer,
            success(res) {
                console.log('writeBLECharacteristicValue success', res.errMsg)
            }
        })
        ```

    * uni.readBLECharacteristicValue(OBJECT):读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用。

        ```js
        // 必须在这里的回调才能获取
        uni.onBLECharacteristicValueChange(function (characteristic) {
        console.log('characteristic value comed:', characteristic)
        })
        uni.readBLECharacteristicValue({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId,
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId,
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId,
            success(res) {
                console.log('readBLECharacteristicValue:', res.errCode)
            }
        })
        ```

    * uni.onBLEConnectionStateChange(CALLBACK):监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等

    * uni.onBLECharacteristicValueChange(CALLBACK):监听低功耗蓝牙设备的特征值变化事件。必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。

    * uni.notifyBLECharacteristicValueChange(OBJECT):启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。 另外，必须先启用 notifyBLECharacteristicValueChange 才能监听到设备 characteristicValueChange 事件

        ```js
        uni.notifyBLECharacteristicValueChange({
            state: true, // 启用 notify 功能
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId,
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId,
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId,
            success(res) {
                console.log('notifyBLECharacteristicValueChange success', res.errMsg)
            }
        })
        ```

    * uni.getBLEDeviceServices(OBJECT):获取蓝牙设备所有服务(service)。

        ```js
        uni.getBLEDeviceServices({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId,
            success(res) {
                console.log('device services:', res.services)
            }
        })
        ```

    * uni.getBLEDeviceRSSI(OBJECT):获取蓝牙设备的信号强度。

    * uni.getBLEDeviceCharacteristics(OBJECT):获取蓝牙设备某个服务中所有特征值(characteristic)。

    * uni.createBLEConnection(OBJECT):连接低功耗蓝牙设备。

        若APP在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备，无需进行搜索操作。

        ```js
        uni.createBLEConnection({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId,
            success(res) {
                console.log(res)
            }
        })
        ```

    * uni.closeBLEConnection(OBJECT):断开与低功耗蓝牙设备的连接。

        ```js
        uni.closeBLEConnection({
            deviceId,
            success(res) {
                console.log(res)
            }
        })
        ```

    * 还可以获取iBeacon、wifi、电量、NFC、设备方向、生物认证(人脸、指纹)等信息

* 键盘

    * uni.hideKeyboard():隐藏已经显示的软键盘

    * uni.onKeyboardHeightChange(CALLBACK):监听键盘高度变化

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

## 生命周期

### 应用生命周期

* onLaunch:当uni-app 初始化完成时触发（全局只触发一次）
* onShow:当 uni-app 启动，或从后台进入前台显示
* onHide:当 uni-app 从前台进入后台
* onError:当 uni-app 报错时触发
* onUniNViewMessage:对 nvue 页面发送的数据进行监听，可参考 nvue 向 vue 通讯
* onUnhandledRejection:对未处理的 Promise 拒绝事件监听函数
* onPageNotFound:页面不存在监听函数
* onThemeChange:监听系统主题变化

### 页面生命周期

* onLoad:监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
* onShow:监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
* onReady:监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发
* onHide:监听页面隐藏
* onUnload:监听页面卸载
* onResize:监听窗口尺寸变化,App、微信小程序
* onPullDownRefresh:监听用户下拉动作，一般用于下拉刷新
* onReachBottom:页面上拉触底事件的处理函数

    可在pages.json里定义具体页面底部的触发距离onReachBottomDistance，比如设为50，那么滚动页面到距离底部50px时，就会触发onReachBottom事件。

    如使用scroll-view导致页面没有滚动，则触底事件不会被触发。scroll-view滚动到底部的事件请参考scroll-view的文档

* onTabItemTap:点击 tab 时触发，参数为Object，具体见下方注意事项,微信小程序、百度小程序、H5、App（自定义组件模式）
* onShareAppMessage:用户点击右上角分享,微信小程序、百度小程序、字节跳动小程序、支付宝小程序
* onPageScroll:监听页面滚动，参数为Object
* onNavigationBarButtonTap:监听原生标题栏按钮点击事件，参数为Object,5+ App、H5
* onBackPress:监听页面返回，返回 event = {from:backbutton、 navigateBack} ，backbutton 表示来源是左上角返回按钮或 android 返回键；navigateBack表示来源是 uni.navigateBack ,App、H5
* onNavigationBarSearchInputChanged:监听原生标题栏搜索输入框输入内容变化事件,App、H5
* onNavigationBarSearchInputConfirmed:监听原生标题栏搜索输入框搜索事件，用户点击软键盘上的“搜索”按钮时触发。App、H5
* onNavigationBarSearchInputClicked:监听原生标题栏搜索输入框点击事件,App、H5
* onShareTimeline:监听用户点击右上角转发到朋友圈,微信小程序
* onAddToFavorites:监听用户点击右上角收藏,微信小程序
* onPageScroll(scrollTop:Number(页面在垂直方向已滚动的距离（单位px）))页面滚动事件

    ```js
    onPageScroll:function(e){
        console.log('屏幕滚动事件');
        console.log(e.scrollTop);
        
        if(e.scrollTop >= 110) {...}
    }
    ```

    * onPageScroll里不要写交互复杂的js，比如频繁修改页面。因为这个生命周期是在渲染层触发的，在非h5端，js是在逻辑层执行的，两层之间通信是有损耗的。如果在滚动过程中，频发触发两层之间的数据交换，可能会造成卡顿。
    * 如果想实现滚动时标题栏透明渐变，在App和H5下，可在pages.json中配置titleNView下的type为transparent。
    * 如果需要滚动吸顶固定某些元素，推荐使用css的粘性布局，参考插件市场。插件市场也有其他js实现的吸顶插件，但性能不佳，需要时可自行搜索。
    * 在App、微信小程序、H5中，也可以使用wxs监听滚动；在app-nvue中，可以使用bindingx监听滚动。
    * onBackPress上不可使用async，会导致无法阻止默认返回

* onTabItemTap(index:String(被点击tabItem的序号，从0开始),pagePath:String(被点击tabItem的页面路径),text:String(被点击tabItem的按钮文字))点击底部tab事件

    * onTabItemTap常用于点击当前tabitem，滚动或刷新当前页面。如果是点击不同的tabitem，一定会触发页面切换。
    * 如果想在App端实现点击某个tabitem不跳转页面，不能使用onTabItemTap，可以使用plus.nativeObj.view放一个区块盖住原先的tabitem，并拦截点击事件。
    * onTabItemTap在App端，从HBuilderX 1.9 的自定义组件编译模式开始支持。
    * 避免在 onShow 里使用需要权限的 API（比如 setScreenBrightness() 等需要手机权限）, 可能会再次触发onShow造成死循环。

* onNavigationBarButtonTap(index:Number(原生标题栏按钮数组的下标))原生标题栏按钮点击

* onBackPress(from:String)触发返回行为的来源：'backbutton'——左上角导航栏按钮及安卓返回键；'navigateBack'——uni.navigateBack() 方法。

    ```js
    export default {
        data() {
            return {};
        },
        onBackPress(options) {
            console.log('from:' + options.from)
        }
    }
    ```

### 组件生命周期

与vue标准组件的生命周期相同,这里没有页面级的onLoad等生命周期

beforeCreate/created/beforeMount/mounted/beforeUpdate/updated/beforeDestroy/destroyed

其中beforeUpdate/updated仅H5平台支持

## 路由跳转

### 路由

uni-app页面路由为框架统一管理，开发者需要在pages.json里配置每个路由页面的路径及页面样式。类似小程序在app.json中配置页面路由一样。所以 uni-app 的路由用法与 Vue Router 不同，如仍希望采用 Vue Router 方式管理路由，可在插件市场搜索 Vue-Router。

### 路由跳转

* 初始化:uni-app 打开的第一个页面
* 打开新页面:调用 API   uni.navigateTo  、使用组件  \<navigator open-type="navigate"/>
* 页面重定向:调用 API   uni.redirectTo  、使用组件  \<navigator open-type="redirectTo"/>
* 页面返回:调用 API  uni.navigateBack   、使用组件 \<navigator open-type="navigateBack"/> 、用户按左上角返回按钮、安卓用户点击物理back按键
* Tab 切换:调用 API  uni.switchTab  、使用组件  \<navigator open-type="switchTab"/>  、用户切换 Tab
* 重加载:调用 API  uni.reLaunch  、使用组件  \<navigator open-type="reLaunch"/>
* 预加载页面:uni.preloadPage(OBJECT)仅app和h5支持uni.preloadPage({url: "/pages/test/test"});
* 窗口动画:仅app支持

    ```js
    uni.navigateTo({
        url: '../test/test',
        animationType: 'pop-in',
        animationDuration: 200
    });
    uni.navigateBack({
        delta: 1,
        animationType: 'pop-out',
        animationDuration: 200
    });
    ```

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

### 内置CSS变量

* --status-bar-height

    系统状态栏高度,app为系统栏高度，nvue不支持，小程序为25px，h5为0

    当设置 "navigationStyle":"custom" 取消原生导航栏后，由于窗体为沉浸式，占据了状态栏位置。此时可以使用一个高度为 var(--status-bar-height) 的 view 放在页面顶部，避免页面内容出现在状态栏。

    nvue 在App端，还不支持 --status-bar-height变量，替代方案是在页面onLoad时通过uni.getSystemInfoSync().statusBarHeight获取状态栏高度，然后通过style绑定方式给占位view设定高度。

    ```html
    <template>
        <!-- HBuilderX 2.6.3+ 新增 page-meta, 详情：https://uniapp.dcloud.io/component/page-meta -->
        <page-meta>
            <navigation-bar />
        </page-meta>
        <view>
            <view class="status_bar">
                <!-- 这里是状态栏 -->
            </view>
            <view> 状态栏下的文字 </view>
        </view>
    </template>
    <style>
        .status_bar {
            height: var(--status-bar-height);
            width: 100%;
        }
        .toTop {
            bottom: calc(var(--window-bottom) + 10px)
        }
    </style>
    <script>
        export default {
            data() {
                return {
                    iStatusBarHeight:0
                }
            },
            onLoad() {
                this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight
            }
        }
    </script>
    ```

* -window-top

    内容区域距离顶部的距离，只有h5是NavigationBar 的高度(导航栏固定44px)，其余平台为0

* --window-bottom

    内容区域距离底部的距离，只有h5是TabBar 的高度(底部选项卡默认50px，可修改)，其余平台为0

    由于在H5端，不存在原生导航栏和tabbar，也是前端div模拟。如果设置了一个固定位置的居底view，在小程序和App端是在tabbar上方，但在H5端会与tabbar重叠。此时可使用--window-bottom，不管在哪个端，都是固定在tabbar上方。

### 自定义组件

小程序组件的性能，不如vue组件。使用小程序组件，需要自己手动setData，很难自动管理差量数据更新。而使用vue组件会自动diff更新差量数据。所以如无明显必要，建议使用vue组件而不是小程序组件。比如某些小程序ui组件，完全可以用更高性能的uni ui替代。

当需要在 vue 组件中使用小程序组件时，注意在 pages.json 的 globalStyle 中配置 usingComponents，而不是页面级配置。


## 配置

### pages.json

用来对 uni-app 进行全局配置，决定页面文件的路径(路由)、窗口样式、原生的导航栏、底部的原生tabbar 

全局样式包括：导航栏样式、下拉样式、上拉样式、横屏设置、窗口动画、特定平台样式

样例

```json
{
    "pages": [{
        "path": "pages/component/index",
        "style": {
            "navigationBarTitleText": "组件"
        }
    }, {
        "path": "pages/API/index",
        "style": {
            "navigationBarTitleText": "接口"
        }
    }, {
        "path": "pages/component/view/index",
        "style": {
            "navigationBarTitleText": "view"
        }
    }],
    "condition": { //模式配置，仅开发期间生效
        "current": 0, //当前激活的模式（list 的索引项）
        "list": [{
            "name": "test", //模式名称
            "path": "pages/component/view/index" //启动页面，必选
        }]
    },
    "globalStyle": {
        "navigationBarTextStyle": "black",
        "navigationBarTitleText": "演示",
        "navigationBarBackgroundColor": "#F8F8F8",
        "backgroundColor": "#F8F8F8",
        "usingComponents":{
            "collapse-tree-item":"/components/collapse-tree-item"
        },
        "renderingMode": "seperated", // 仅微信小程序，webrtc 无法正常时尝试强制关闭同层渲染
        "pageOrientation": "portrait"//横屏配置，全局屏幕旋转设置(仅 APP/微信/QQ小程序)，支持 auto / portrait / landscape
    },
    "tabBar": {
        "color": "#7A7E83",
        "selectedColor": "#3cc51f",
        "borderStyle": "black",
        "backgroundColor": "#ffffff",
        "height": "50px",
        "fontSize": "10px",
        "iconWidth": "24px",
        "spacing": "3px",
        "list": [{
            "pagePath": "pages/component/index",
            "iconPath": "static/image/icon_component.png",
            "selectedIconPath": "static/image/icon_component_HL.png",
            "text": "组件"
        }, {
            "pagePath": "pages/API/index",
            "iconPath": "static/image/icon_API.png",
            "selectedIconPath": "static/image/icon_API_HL.png",
            "text": "接口"
        }],
        "midButton": {
            "width": "80px",
            "height": "50px",
            "text": "文字",
            "iconPath": "static/image/midButton_iconPath.png",
            "iconWidth": "24px",
            "backgroundImage": "static/image/midButton_backgroundImage.png"
        }
    },
  "easycom": {
    "autoscan": true, //是否自动扫描组件
    "custom": {//自定义扫描规则
      "^uni-(.*)": "@/components/uni-$1.vue"
    }
  }
}
```

### manifest.json

用于配置应用信息(名称、appid、版本号等)、网络超时时间(request、connectSocket、uploadFile、downloadFile)、是否开启 debug 模式、是否开启 [uni 统计](https://tongji.dcloud.net.cn/)、app页面与手机权限

uni统计功能包括：渠道推广质量(拉新、留存、导量)、内容统计(访问人数、访问次数、停留时长)、自定义统计事件、错误分析、小程序场景分析

app相关：启动界面信息、启动封面、蓝牙、通信录、指纹、语音识别、三方支付、授权登录等

自定义模板

* 调整页面 head 中的 meta 配置
* 补充 SEO 相关的一些配置（仅首页）
* 加入百度统计等三方js

```html
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <title>
            <%= htmlWebpackPlugin.options.title %>
        </title>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                document.documentElement.style.fontSize = document.documentElement.clientWidth / 20 + 'px'
            })
        </script>
        <link rel="stylesheet" href="<%= BASE_URL %>static/index.<%= VUE_APP_INDEX_CSS_HASH %>.css" />
    </head>
    <body>
        <noscript>
            <strong>Please enable JavaScript to continue.</strong>
        </noscript>
        <div id="app"></div>
        <!-- built files will be auto injected -->
    </body>
</html>
```

h5可使用vue配置，也可配置路由

各平台小程序延用官方配置，微信小程序有额外的编译配置(是否检查安全域名和 TLS 版本、ES6 转 ES5、上传代码时样式是否自动补全、上传代码时是否自动压缩)、优化配置(是否开启分包优化),百度小程序有优化配置、字节跳动小程序有额外的编译配置、优化配置，QQ小程序有优化配置

如果需要使用微信小程序的云开发，需要在 mp-weixin 配置云开发目录
```json
"mp-weixin":{
  // ...
   "cloudfunctionRoot": "cloudfunctions/", // 配置云开发目录
  // ...
}
```
配置目录之后，需要在项目根目录新建 vue.config.js 配置对应的文件编译规则
```js
{
plugins: [
     new CopyWebpackPlugin([
       {
         from: path.join(__dirname, '../cloudfunctions'),
         to: path.join(__dirname, 'unpackage', 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'cloudfunctions'),
       },
     ]),
   ],
}
```

完整样例
```json
{
    "appid": "__UNI__XXXXXX，创建应用时云端分配的，不要修改。",
    "name": "应用名称，如uni-app",
    "description": "应用描述",
    "versionName": "1.0.0",
    "versionCode": "100",
    // 是否全局关闭uni统计
    "uniStatistics": {  
        "enable": false//全局关闭  
    },
    // app-plus 节点是 App 特有配置，推荐在 HBuilderX 的 manifest.json 可视化界面操作完成配置。
    "app-plus": {
        // HBuilderX->manifest.json->模块权限配置
    "optimization": {
      "subPackages": true // HBuilderX 2.7.12+ 支持
    },
        "modules": {
            "Contacts": {},
            "Fingerprint": {},
            "Maps": {},
            "Messaging": {},
            "OAuth": {},
            "Payment": {},
            "Push": {},
            "Share": {},
            "Speech": {},
            "Statistic": {},
            "VideoPlayer": {},
            "LivePusher": {}
        },
        "distribute": {
            // Android 与 iOS 证书相关信息均在打包时完成配置
            "android": {
                "packagename": "Android应用包名，如io.dcloud.uniapp",
                "keystore": "Android应用打包使用的密钥库文件",
                "password": "Android应用打包使用密钥库中证书的密码",
                "aliasname": "Android应用打包使用密钥库中证书的别名",
                "schemes": [
                    "应用支持的scheme，大小写相关，推荐使用小写"
                ],
                "theme": "程序使用的主题",
                "android:name": "自定义程序入口类名",
                "custompermissions": "Boolean类型，是否自定义android权限，true表示自定义权限，只使用permissions下指定的android权限，不根据用户使用的5+模块自动添加android权限，false表示自动根据用户使用的5+模块自动添加android权限",
                "permissions": [
                    "要添加的额外的android权限，如<uses-permission android:name=\"com.android.launcher.permission.INSTALL_SHORTCUT\" />",
                    "<uses-permission android:name=\"com.android.launcher.permission.UNINSTALL_SHORTCUT\" />"
                ],
                "minSdkVersion": "apk支持的最低版本，默认值为14",
                "targetSdkVersion": "apk的目标版本，默认值为21"
            },
            "ios": {
                "appid": "iOS应用标识，苹果开发网站申请的appid，如io.dcloud.uniapp",
                "mobileprovision": "iOS应用打包配置文件",
                "password": "iOS应用打包个人证书导入密码",
                "p12": "iOS应用打包个人证书，打包配置文件关联的个人证书",
                "devices": "iOS应用支持的设备类型，可取值iphone/ipad/universal",
                "urltypes": [{
                        "urlschemes": [
                            "hbuilder",
                            "必选，程序所支持的自定义协议名称"
                        ],
                        "id": "可选，自定义协议的标识",
                        "icon": "可选，打开程序时显示的图标"
                    },
                    {
                        "urlschemes": [
                            "http",
                            "https",
                            "必选，程序所支持的自定义协议名称，大小写无关，推荐使用小写"
                        ],
                        "id": "可选，自定义协议的标识",
                        "icon": "可选，打开程序时显示的图标"
                    }
                ],
                "frameworks": ["使用native.js调用API要引用的库文件名称，如CoreLocation.framework", "QuartzCore.framework"],
                "idfa": "true|false，是否使用广告标识符，默认值为false",
                "plistcmds": [
                    "Set :权限 使用权限的原因",
                    "Set :NSCameraUsageDescription 说明使用用户相机的原因"
                ]
            },
            // HBuilderX->manifest.json->SDK配置
            "sdkConfigs": {
                "maps": {
                    // 地图只能选一个，这里选的是百度。
                    "baidu": {
                        "appkey_ios": "",
                        "appkey_android": ""
                    }
                },
                "oauth": {
                    // 微信登录
                    "weixin": {
                        "appid": "",
                        "appsecret": ""
                    },
                    // QQ登录
                    "qq": {
                        "appid": ""
                    },
                    // 新浪微博登录
                    "sina": {
                        "appkey": "",
                        "appsecret": "",
                        "redirect_uri": ""
                    },
                    // 小米登录
                    "xiaomi": {
                        "appid_ios": "",
                        "appsecret_ios": "",
                        "redirect_uri_ios": "",
                        "appid_android": "",
                        "appsecret_android": "",
                        "redirect_uri_android": ""
                    }
                },
                "payment": {
                    // Apple应用内支付
                    "appleiap": {},
                    // 支付宝支付
                    "alipay": {
                        "scheme": ""
                    },
                    // 微信支付
                    "weixin": {
                        "appid": ""
                    }
                },
                "push": {
                    // 推送只能选择一个，这里选的是个推。
                    "igexin": {
                        "appid": "",
                        "appkey": "",
                        "appsecret": ""
                    }
                },
                "share": {
                    // 微信分享
                    "weixin": {
                        "appid": ""
                    },
                    // 新浪微博分享
                    "sina": {
                        "appkey": "",
                        "appsecret": "",
                        "redirect_uri": ""
                    },
                    // 分享到QQ
                    "qq": {
                        "appid": ""
                    }
                },
                "statics": {
                    // 友盟统计
                    "umeng": {
                        "appkey_ios": "",
                        "channelid_ios": "",
                        "appkey_android": "",
                        "channelid_android": ""
                    }
                }
            },
            // 屏幕方向 需要云打包/本地打包/自定义基座生效
            "orientation": [
                "portrait-primary",
                "landscape-primary",
                "portrait-secondary",
                "landscape-secondary"
            ],
            // HBuilderX->manifest.json->图标配置
            "icons": {
                "ios": {
                    "appstore": "必选, 1024x1024, 提交app sotre使用的图标",
                    "iphone": {
                        "app@2x": "可选，120x120，iOS7-11程序图标（iPhone4S/5/6/7/8）",
                        "app@3x": "可选，180x180，iOS7-11程序图标（iPhone6plus/7plus/8plus/X）",
                        "spotlight@2x": "可选，80x80，iOS7-11 Spotlight搜索图标（iPhone5/6/7/8）",
                        "spotlight@3x": "可选，120x120，iOS7-11 Spotlight搜索图标（iPhone6plus/7plus/8plus/X）",
                        "settings@2x": "可选，58x58，iOS5-11 Settings设置图标（iPhone5/6/7/8）",
                        "settings@3x": "可选，87x87，iOS5-11 Settings设置图标（iPhone6plus/7plus/8plus/X）",
                        "notification@2x": "可选，40x40，iOS7-11 通知栏图标（iPhone5/6/7/8）",
                        "notification@3x": "可选，60x60，iOS7-11 通知栏图标（iPhone6plus/7plus/8plus/X）"
                    },
                    "ipad": {
                        "app": "可选，76x76，iOS7-11程序图标",
                        "app@2x": "可选，152x152，iOS7-11程序图标（高分屏）",
                        "proapp@2x": "可选，167x167，iOS9-11程序图标（iPad Pro）",
                        "spotlight": "可选，40x40，iOS7-11 Spotlight搜索图标",
                        "spotlight@2x": "可选，80x80，iOS7-11 Spotlight搜索图标（高分屏）",
                        "settings": "可选，29x29，iOS5-11 设置图标",
                        "settings@2x": "可选，58x58，iOS5-11 设置图标（高分屏）",
                        "notification": "可选，20x20，iOS7-11 通知栏图标",
                        "notification@2x": "可选，40x40，iOS7-11 通知栏图标（高分屏）"
                    }
                },
                "android": {
                    "mdpi": "必选，48x48，普通屏程序图标",
                    "ldpi": "必选，48x48，大屏程序图标",
                    "hdpi": "必选，72x72，高分屏程序图标",
                    "xhdpi": "必选，96x96，720P高分屏程序图标",
                    "xxhdpi": "必选，144x144，1080P高分屏程序图标",
                    "xxxhdpi": "可选，192x192"
                }
            },
            // HBuilderX->manifest.json->启动图配置
            "splashscreen": {
                "ios": {
                    "iphone": {
                        "retina35": "可选，640x960，3.5英寸设备(iPhone4)启动图片",
                        "retina40": "可选，640x1136，4.0英寸设备(iPhone5)启动图片",
                        "retina40l": "可选，1136x640，4.0英寸设备(iPhone5)横屏启动图片",
                        "retina47": "可选，750x1334，4.7英寸设备（iPhone6）启动图片",
                        "retina47l": "可选，1334x750，4.7英寸设备（iPhone6）横屏启动图片",
                        "retina55": "可选，1242x2208，5.5英寸设备（iPhone6Plus）启动图片",
                        "retina55l": "可选，2208x1242，5.5英寸设备（iPhone6Plus）横屏启动图片",
                        "iphonex": "可选，1125x2436，iPhoneX启动图片",
                        "iphonexl": "可选，2436x1125，iPhoneX横屏启动图片"
                    },
                    "ipad": {
                        "portrait": "可选，768x1004，需支持iPad时必选，iPad竖屏启动图片",
                        "portrait-retina": "可选，1536x2008，需支持iPad时必选，iPad高分屏竖屏图片",
                        "landscape": "可选，1024x748，需支持iPad时必选，iPad横屏启动图片",
                        "landscape-retina": "可选，2048x1496，需支持iPad时必选，iPad高分屏横屏启动图片",
                        "portrait7": "可选，768x1024，需支持iPad iOS7时必选，iPad竖屏启动图片",
                        "portrait-retina7": "可选，1536x2048，需支持iPad iOS7时必选，iPad高分屏竖屏图片",
                        "landscape7": "可选，1024x768，需支持iPad iOS7时必选，iPad横屏启动图片",
                        "landscape-retina7": "可选，2048x1536，需支持iPad iOS7时必选，iPad高分屏横屏启动图片"
                    }
                },
                "android": {
                    "mdpi": "必选，240x282，普通屏启动图片",
                    "ldpi": "必选，320x442，大屏启动图片",
                    "hdpi": "必选，480x762，高分屏启动图片",
                    "xhdpi": "必选，720x1242，720P高分屏启动图片",
                    "xxhdpi": "必选，1080x1882，1080P高分屏启动图片"
                }
            }
        },
        // HBuilderX->manifest.json->启动图配置->启动界面选项
        "splashscreen": {
            "waiting": true,
            "autoclose": true,
            "delay": 0
        },
        "error": {
            "url": "页面加载错误时打开的页面地址，可以是网络地址，也可以是本地地址"
        },
        "useragent": {
            "value": "自定义ua字符串",
            "concatenate": "是否为追加模式"
        },
        "useragent_ios": {
            "value": "与useragent的value一致，仅在iOS平台生效，当useragent和useragent_ios同时存在时优先级useragent_ios>useragent",
            "concatenate": "与useragent的concatenate一致，仅iOS平台生效"
        },
        "useragent_android": {
            "value": "与useragent的value一致，仅在Android平台生效，当useragent和useragent_android同时存在时优先级useragent_android>useragent",
            "concatenate": "与useragent的concatenate一致，仅Android平台生效"
        },
        "ssl": "accept|refuse|warning，访问https网络时对非受信证书的处理逻辑",
        "runmode": "normal",
        "appWhitelist": [
            "Android平台下载apk地址白名单列表",
            "iOS平台跳转appstore地址白名单列表"
        ],
        "schemeWhitelist": [
            "URL Scheme白名单列表，如：mqq" //iOS要求预先指定要打开的App名单，不能随意调用任何App
        ],
        "channel": "渠道标记，可在DCloud开发者中心查看各渠道应用的统计数据",
        "adid": "广告联盟会员id，在DCloud开发者中心申请后填写",
        "safearea": { //安全区域配置，仅iOS平台生效  
            "background": "#CCCCCC", //安全区域外的背景颜色，默认值为"#FFFFFF"  
            "bottom": { // 底部安全区域配置  
                "offset": "none|auto" // 底部安全区域偏移，"none"表示不空出安全区域，"auto"自动计算空出安全区域，默认值为"none"  
            },
            "left": { //左侧安全区域配置（横屏显示时有效）  
                "offset": "none|auto"
            },
            "right": { //右侧安全区域配置（横屏显示时有效）  
                "offset": "none|auto"
            }
        },
        "softinput": {
            "navBar": "auto", //是否显示iOS软键盘上的“完成”导航条
            "mode": "adjustResize|adjustPan" //软键盘弹出模式，
        },
    "popGesture": "none" //iOS上是否支持屏幕左边滑动关闭当前页面。默认是可关闭。设为none则不响应左滑动画。
    },
    // 快应用特有配置
    "quickapp": {},
    // 微信小程序特有配置
    "mp-weixin": {
        "appid": "wx开头的微信小程序appid",
        "uniStatistics": {
            "enable": false//仅微信小程序关闭uni统计
        },
    },
    // 百度小程序特有配置
    "mp-baidu": {
        "appid": "百度小程序appid"
    },
    // 字节跳动小程序特有配置
    "mp-toutiao": {
        "appid": "字节跳动小程序appid"
    },
    "h5": {
        "title": "演示", //页面标题，默认使用 manifest.json 的 name
        "template": "index.html", //index.html模板路径，相对于应用根目录，可定制生成的 html 代码
        "router": {
            "mode": "history", //路由跳转模式，支持 hash|history ,默认 hash
            "base": "/hello/" //应用基础路径，例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"
        },
        "async": { //页面js异步加载配置
            "loading": "AsyncLoading", //页面js加载时使用的组件（需注册为全局组件）
            "error": "AsyncError", //页面js加载失败时使用的组件（需注册为全局组件）
            "delay": 200, //展示 loading 加载组件的延时时间（页面 js 若在 delay 时间内加载完成，则不会显示 loading 组件）
            "timeout": 3000 //页面js加载超时时间（超时后展示 error 对应的组件）
        }
    }
}
```

### package.json

在package.json文件中增加uni-app扩展节点，可实现自定义条件编译平台（如钉钉小程序、微信服务号等平台）

文件中不允许出现注释，否则扩展配置无效,vue-cli需更新到最新版
```js
{
    /**
     package.json其它原有配置
     */
    "uni-app": {// 扩展配置
        "scripts": {
            "custom-platform": { //自定义编译平台配置，可通过cli方式调用
                "title":"自定义扩展名称", // 在HBuilderX中会显示在 运行/发行 菜单中
                "BROWSER":"",  //运行到的目标浏览器，仅当UNI_PLATFORM为h5时有效(Chrome、Firefox、IE、Edge、Safari、HBuilderX)
                "env": {//环境变量
                    "UNI_PLATFORM": ""  //基准平台(h5、mp-weixin、mp-alipay、mp-baidu、mp-toutiao、mp-qq)
                 },
                "define": { //自定义条件编译
                    "CUSTOM-CONST": true //自定义条件编译常量，建议为大写
                }
            }
        }
    }
}
```

样例：钉钉小程序

```json
"uni-app": {
    "scripts": {
        "mp-dingtalk": { 
            "title":"钉钉小程序", 
            "env": { 
                "UNI_PLATFORM": "mp-alipay" 
            },
            "define": { 
                "MP-DINGTALK": true 
            }
        }
    }
}
```
条件编译
```js
// #ifdef MP-DINGTALK
钉钉平台特有代码
// #endif
```
运行及发布项目(vue-cli开发者可通过如下命令，启动钉钉小程序平台的编译)
```js
npm run dev:custom mp-dingtalk 
npm run build:custom mp-dingtalk
```
HBuilderX会根据package.json的扩展配置，在运行、发行菜单下，生成自定义菜单（钉钉小程序），开发者点击对应菜单编译运行即可

钉钉小程序编译目录依然是mp-alipay，需通过支付宝开发者工具，选择“钉钉小程序”，然后打开该目录进行预览及发布。

### vue.config.js

配置仅vue页面生效，部分配置项会被编译配置覆盖：

* publicPath 不支持，如果需要配置，请在 manifest.json->h5->router->base 中配置，参考文档：h5-router
* outputDir 不支持
* assetsDir 固定 static
* pages 不支持
* runtimeCompiler 固定 false
* productionSourceMap 固定 false
* css.extract H5 平台固定 false，其他平台固定 true
* parallel 固定 false
* 使用cli项目时，默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在transpileDependencies中列出来。

样例

```js
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin') //最新版本copy-webpack-plugin插件暂不兼容，推荐v5.0.0
const webpack = require('webpack')

module.exports = {
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.join(__dirname, 'src/images'),
                    to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'images')
                }
            ]),
            new webpack.ProvidePlugin({
                'localStorage': ['mp-storage', 'localStorage'],
                'window.localStorage': ['mp-storage', 'localStorage']
            })
        ]
    },
    chainWebpack: (config) => {
        // 发行或运行时启用了压缩时会生效
        config.optimization.minimizer('terser').tap((args) => {
            const compress = args[0].terserOptions.compress
            // 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
            compress.drop_console = true
            compress.pure_funcs = [
                '__f__', // App 平台 vue 移除日志代码
                // 'console.debug' // 可移除指定的 console 方法
            ]
            return args
        })
    }
}
```

### uni.scss

在代码中无需 import 这个文件即可在scss代码中使用这里的样式变量。uni-app的编译器在webpack配置中特殊处理了这个uni.scss，使得每个scss文件都被注入这个uni.scss，达到全局可用的效果。

使用scss的方法：

* 在 HBuilderX 里面安装 scss 插件
* 在 style 节点上加上 lang="scss"
* pages.json不支持scss，原生导航栏和tabbar的动态修改只能使用js api

### App.vue

App.vue是uni-app的主组件，所有页面都是在App.vue下进行切换的，是页面入口文件。但App.vue本身不是页面，这里不能编写视图元素。

这个文件的作用包括：调用应用生命周期函数、配置全局样式、配置全局的存储globalData

1. 应用生命周期仅可在App.vue中监听，在页面监听无效。

```html
<script>  
    export default {  
        onLaunch: function() {  
            console.log('App Launch，app启动')  
        },  
        onShow: function() {  
            console.log('App Show，app展现在前台')  
        },  
        onHide: function() {  
            console.log('App Hide，app不再展现在前台')  
        }  
    }  
</script>
```

2. 全局变量

* getApp/$scope/globalData

小程序有globalData，这是一种简单的全局变量机制。

```html
<script>  
    export default {  
        globalData: {  
            text: 'text'  
        }
    }  
</script>
```

js中操作globalData的方式如下： getApp().globalData.text = 'test'

在应用onLaunch时，getApp对象还未获取，暂时可以使用this.$scope.globalData获取globalData。

如果需要把globalData的数据绑定到页面上，可在页面的onShow页面生命周期里进行变量重赋值。

nvue的weex编译模式中使用globalData的话，由于weex生命周期不支持onShow，但熟悉5+的话，可利用监听webview的addEventListener show事件实现onShow效果，或者直接使用weex生命周期中的beforeCreate。但建议开发者使用uni-app编译模式，而不是weex编译模式。

globalData是简单的全局变量，如果使用状态管理，请使用vuex（main.js中定义）

v3模式加速了首页nvue的启动速度，当在首页nvue中使用getApp()不一定可以获取真正的App对象。对此v3版本提供了const app = getApp({allowDefault: true})用来获取原始的App对象，可以用来在首页对globalData等初始化

* getCurrentPages

用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。

getCurrentPages()仅用于展示页面栈的情况，请勿修改页面栈，以免造成页面状态错误。

page.$getAppWebview() 获取当前app页面的webview对象实例

page.route 获取当前页面的路由

navigateTo, redirectTo 只能打开非 tabBar 页面。

switchTab 只能打开 tabBar 页面。

reLaunch 可以打开任意页面。

页面底部的 tabBar 由页面决定，即只要是定义为 tabBar 的页面，底部都有 tabBar。

不能在 App.vue 里面进行页面跳转。

* $getAppWebview

此方法仅 App 支持,可以得到当前webview的对象实例

3. 全局样式

在App.vue中，可以一些定义全局通用样式，例如需要加一个通用的背景色，首屏页面渲染的动画等都可以写在App.vue中。

注意如果工程下同时有vue和nvue文件，全局样式的所有css会应用于所有文件，而nvue支持的css有限，编译器会在控制台报警，提示某些css无法在nvue中支持。此时需要把nvue不支持的css写在单独的条件编译里。

```html
<style>
    /* #ifndef APP-PLUS-NVUE */
    @import './common/uni.css';
    /* #endif*/
</style>
```

### main.js

main.js是uni-app的入口文件，主要作用是初始化vue实例、定义全局组件、使用需要的插件如vuex。

使用Vue.use引用插件，使用Vue.prototype添加全局变量，使用Vue.component注册全局组件。

无法使用vue-router，路由须在pages.json中进行配置。如果开发者坚持使用vue-router，可以在插件市场找到转换插件。

nvue 暂不支持在 main.js 注册全局组件


## 页面通讯

* uni.$emit(eventName,OBJECT)

触发事件

```js
uni.$emit('update',{msg:'页面更新'})
```

* uni.$on(eventName,callback)

监听事件

```js
uni.$on('update',function(data){
    console.log('监听到事件来自 update ，携带参数 msg 为：' + data.msg);
})
```

* uni.$once(eventName,callback)

只触发一次事件

```js
uni.$once('update',function(data){
    console.log('监听到事件来自 update ，携带参数 msg 为：' + data.msg);
})
```

* uni.$off([eventName, callback])

移除事件

## 测试

创建 cli 工程：vue create -p dcloudio/uni-preset-vue#alpha my-project

如果之前是HBuilderX工程，则把HBuilderX工程内的文件（除 unpackage、node_modules 目录）拷贝至 vue-cli 工程的 src 目录。 在 vue-cli 工程内重新安装 npm 依赖

cli创建项目时若选择hello uni-app模板，可看到其中已经自带部分测试例

安装puppeteer：npm install puppeteer --save-dev 需nodejs > v10.18.1

根据API编写测试的js代码，配置jest.config.js

运行测试：npm run test:***

## 使用问题

### uni-app启动微信开发者工具

1. 参考链接

    [uni-app启动微信开发者工具](https://blog.csdn.net/qq_24147051/article/details/104943611)

2. 详解

    第一次运行会出现打开失败的情况，需要在微信小程序开发工具中的"设置"-"安全设置"-"安全"-"开启服务端口"，在HBuilderX重新运行即可

### sass/scss插件安装失败

1. 参考链接

    [uni-app|Windows: sass/scss插件安装问题的解决方案](http://www.laiketui.com/13494.html)

2. 详解

    [见附件的zip压缩包](http://ask.dcloud.net.cn/file/download/file_name-Y29tcGlsZS1ub2RlLXNhc3Muemlw__url-Ly9pbWctY2RuLXFpbml1LmRjbG91ZC5uZXQuY24vdXBsb2Fkcy9hcnRpY2xlLzIwMTkwMjE0L2ZiMmUxZGI3YzgyNWVkNGY2YzFlOTgzNWY4NWFmYzRi)

    将压缩包里的compile-node-sass目录解压到HBuilderX安装目录下的\plugins目录。

### 微信小程序分享

1. 参考链接

    [uni-app 关于微信小程序分享，app微信聊天界面和朋友圈分享](https://blog.csdn.net/weixin_44143975/article/details/90721569)

2. 详解

    ```html
    <!-- #ifdef MP-WEIXIN -->
    <button class="share-btn" open-type="share">立即分享</button>
    <!-- #endif -->
    ```

    ```js
    onShareAppMessage(res) {
        return {
            title: '微信小程序测试分享',
            path: '/pages/common/login'
        }
    }
    ```

### h5请求跨域解决方案

1. 参考链接

    [解决h5版的uniapp请求跨域问题](https://www.cnblogs.com/murenziwei/p/11660735.html)

    [uni-app学习笔记-请求接口跨域问题（八）](https://www.jianshu.com/p/aea58ee405b8)

2. 详解

    修改manifest.json,在devServer下配置proxy
    
    ```js
    "h5" : {
        "template" : "template.h5.html",
        "router" : {
            "mode" : "history",
            "base" : "/h5/"
        },
        "sdkConfigs" : {
            "maps" : {
                "qqmap" : {
                    "key" : ""
                }
            }
        },
        "async" : {
            "timeout" : 20000
        },
        "uniStatistics" : {
            "enable" : true
        },
        "optimization" : {
            "treeShaking" : {
                "enable" : true
            }
        },
        "devServer": {
            "proxy": {
                "/api": {
                    "target":"http://www.intmote.com",
                    "changeOrigin": true,//是否跨域
                    "secure": false,// 设置支持https协议的代理
                    "pathRewrite":{"^/api":"/"}
                }
            }
        }
    },
    ```