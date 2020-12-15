# 混合app相关问题

* [jsBridge是如何做到h5和原生应用的交互](#jsBridge是如何做到h5和原生应用的交互)
* [webview性能优化](#webview性能优化)
* [腾讯x5内核](#腾讯x5内核)

---

## jsBridge是如何做到h5和原生应用的交互

1. 参考链接

[jsBridge H5和原生交互](https://blog.csdn.net/weixin_40404336/article/details/103575203)

[IOS、Android与H5通信-JsBridge原理(总结)](https://blog.csdn.net/sunhonghui9527/article/details/107213790)

[iOS下JS与OC互相调用（三）--MessageHandler](https://blog.csdn.net/u011619283/article/details/52135988)

[WebView之app与h5间的交互](https://blog.csdn.net/u012587024/article/details/82970536)

2. 详解

    * 实现

    ```js
    js调用原生约定方法名encyclopedia 注意需要判断设备类型 然后调用方法如下
    
    ios：window.webkit.messageHandlers.encyclopedia.postMessage({});同步返回值
    
    android：window.android.encyclopedia();
    
    原生调用js 方法 window.testBridge = function() {
        //do something
    }
    ```

    * MessageHandler 是什么？

    WKWebView 初始化时，有一个参数叫configuration，它是WKWebViewConfiguration类型的参数。
    
    WKWebViewConfiguration有一个属性叫userContentController，它又是WKUserContentController类型的参数。
    
    WKUserContentController对象有一个方法- addScriptMessageHandler:name:，把这个功能简称为MessageHandler。
    
    addScriptMessageHandler:name:有两个参数，第一个参数是userContentController的代理对象，第二个参数是JS里发送postMessage的对象。

    * window.android原理

    app初始化设置开启javascript
    ```java
    WebSettings mSettings = this.getSettings();
    mSettings.setJavaScriptEnabled(true);   //开启javascript
    ```
    添加js接口
    ```java
    //第二个字段是WebViewJsInterface接口的对象名，在h5调用时需要用到
    mWebView.addJavascriptInterface(new WebViewJsInterface(), "android");
    ```
    定义接口方法，给h5调用
    ```java
    public class WebViewJsInterface {
        @JavascriptInterface
        public void actionShare(String json) {
        //TODO
        }
    }
    ```
    在h5页面加载完后注入js代码（让h5能够识别当前是android调用还是ios调用）
    ```java
    mWebView.setWebViewCallback(new ProgressWebView.WebViewCallback() {
        @Override
        public void onPageFinished(WebView view, String url) {
            //加载一个js，返回当前的平台信息：android
            view.loadUrl("javascript:function qlClient(){return \"android\";}");
            //TODO
        }

        @Override
        public void onShouldOverrideUrlLoading(WebView view, String url) {
        }
    });
    ```
    h5端调用
    ```js
    window.android.actionShare(json)
    ```

    * JsBridge原理

    H5和原生app（ios，android）交互的载体基本都是基于Webview，可以把Webview看作是一个性能打八折的移动浏览器。

    * ios调用Javascript

    1. WKWebView：最新，IOS8+，建议使用
    2. UIWebView：第一代，较老
    3. JavaScriptCore：IOS7+，能执行js代码，小程序、react native使用

    * Javascript 调用 ios（oc、swift）

    通过拦截URL，在webview发起特殊请求，如jsbridge://...，被native捕捉到，发现特殊请求就执行相应逻辑

    ```js
    var src= 'jsbridge://method?参数1=value1&参数2=value2';
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = src;
    document.body.appendChild(iframe);
    //再删除iframesetTimeout(function() {
        iframe.remove();
    }, 50);
    ```

    * Android调用JS代码

    1. WebView的loadUrl

    2. WebView的evaluateJavascript

    * JS调用Android代码

    1. WebView的addJavascriptInterface进行对象映射

    2. WebViewClient 的 shouldOverrideUrlLoading 方法回调拦截 url

    3. WebChromeClient 的onJsAlert、onJsConfirm、onJsPrompt方法回调拦截JS对话框alert()、confirm()、prompt() 消息

## webview性能优化

1. 参考链接

[WebView优化提升H5加载速度方案](https://blog.csdn.net/ljphhj/article/details/103870628)

2. 详解

    * WebView加载H5经历的过程

        WebView初始化->建立连接，接收页面、样式、渲染(白屏，对应浏览器打开url过程)->解析执行脚本、获取后端数据(加载中)->渲染展示

    * 优化

        1. 客户端启动后，就初始化一个全局WebView，隐藏起来备用

            因为二次初始化webview时间，比首次初始化快40ms左右

        2. 数据预请求
        
            WebView初始化慢，可以通过客户端预先或者同时先请求数据，让后端和网络不要闲着等待WebView初始化。

        3. 离线包

            离线包由h5提供，包里面的结构基本和线上一致，本身我们的h5网页就是放在cdn上，这次只不过是拿出来，打成压缩包，放在Android的apk包里，从网上拿资源改为本地拿资源

## 腾讯x5内核

1. 参考链接

[腾讯x5内核集成，优化web加载速度](https://blog.csdn.net/rickyengineer/article/details/79869423)

2. 详解

    1) 速度快：相比系统webview的网页打开速度有30+%的提升；
    2) 省流量：使用云端优化技术使流量节省20+%；
    3) 更安全：安全问题可以在24小时内修复；
    4) 更稳定：经过亿级用户的使用考验，CRASH率低于0.15%；
    5) 兼容好：无系统内核的碎片化问题，更少的兼容性问题；
    6) 体验优：支持夜间模式、适屏排版、字体设置等浏览增强功能；
    7) 功能全：在Html5、ES6上有更完整支持；
    8) 更强大：集成强大的视频播放器，支持视频格式远多于系统webview；
    9) 视频和文件格式的支持x5内核多于系统内核
    10) 防劫持

---

## 公共参考链接

[前端面试知识点汇总](https://juejin.cn/post/6905635299897032718)