# vue源码解读

于2020-02-21从https://github.com/vuejs/vue处clone的版本

* [目录结构](#目录结构)
* [初始化过程](#初始化过程)
* vue实例
    * [initMixin](#initMixin)

## 目录结构

1. 参考链接

    [人人都能懂的Vue源码系列(一)—Vue源码目录结构](http://www.imooc.com/article/29087)

2. 详解

    ![directory](./vueDirectory.jpg)

## 初始化过程

1. 参考链接

    [vue源码分析系列一：new Vue的初始化过程](https://blog.csdn.net/a419419/article/details/90764860)

    [vue组件初始化过程](https://www.cnblogs.com/gerry2019/p/12051148.html)

    [vue简介和初始化过程](https://www.jianshu.com/p/523b4c12eafb)

    [入口开始，解读Vue源码（一）—— 造物创世](https://blog.csdn.net/JohnnieZhu/article/details/87341753)

2. 详解

    vue源码使用了flow语法，类似typescript，可以类型检测。

    * 原始类型包括：Boolean、Null(void)、Undefined、Number、String、Symbol、Object

    * 特殊类型包括：?(可选类型)、mixed(混合类型，使用前需要typeof判断类型才能使用)、any(任意类型)、interface(接口类型)、Array\<Type>(数组类型)

    一切从core下的index.js说起。

    * 概况

        * 引入了vue实例，实例位于/core/instance下，入口文件为index.js，其包括initMixin、stateMixin、eventsMixin、lifecycleMixin、renderMixin即从初始化到渲染完成的流程

        * initGlobalAPI定义全局函数，包括Vue.extend、Vue.nextTick、Vue.use、Vue.mixin等，更多查看[官方文档](https://cn.vuejs.org/v2/api/#%E5%85%A8%E5%B1%80-API)

        * 定义服务器端渲染配置：$isServer、$ssrContext，暴露接口FunctionalRenderContext，更多查看[官方文档](https://ssr.vuejs.org/zh/guide/head.html)

## vue实例

### initMixin

1. 参考链接

    [浅析Vue源码（二）—— initMixin(上)](https://blog.csdn.net/Wangxinlei_King/article/details/101222605)

    [浅析Vue源码（三）—— initMixin(下)](https://blog.csdn.net/Wangxinlei_King/article/details/101222605)

    [深入理解Vue源码系列-2.initMixin干了什么(上)](https://blog.csdn.net/weixin_33908217/article/details/91440310)

    [深入理解Vue源码系列-3.initMixin干了什么(中)](https://blog.csdn.net/weixin_33766168/article/details/91427721)

    [深入理解Vue源码系列-4.initMixin干了什么(下)](https://blog.csdn.net/weixin_34284188/article/details/91454374)

2. 详解

