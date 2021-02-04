# vue 简结

* [vue 自带指令](#vue自带指令)
* [vue 自定义指令](#vue自定义指令)
* [vue 生命周期](#vue生命周期)
* [自定义指令生命周期](#自定义指令生命周期)
* [vue 双向数据绑定原理](#vue双向数据绑定原理)
* [请求后台资源](#请求后台资源)
* [路由 vue-router](#路由vue-router)
* [自定义组件(创建组件步骤)](#自定义组件(创建组件步骤))
* [父子组件通信](#父子组件通信)
* [兄弟组件通信](#兄弟组件通信)
* [vuex 状态管理(组件间通信)](#vuex状态管理(组件间通信))
* [小型vuex:Vue.observable](#小型vuex:Vue.observable)
* [vue 与 jquery 的区别](#vue与jquery的区别)
* [vuejs 与 angularjs 以及 react 的区别](#vuejs与angularjs以及react的区别)
* [vue 源码结构](#vue源码结构)
* [vue2.0 和 3.0 的区别](#vue2.0和3.0的区别)
* [style 中 scoped 的作用](#style中scoped的作用)
* [子组件监听父组件数值变化](#子组件监听父组件数值变化)
* [取消watch监听](#取消watch监听)
* [页面传参与获取](#页面传参与获取)
* [不同 url 复用页面，且只刷新部分组件](#不同url复用页面，且只刷新部分组件)
* [method 与 computed 区别](#method与computed区别)
* [使用 cookie](#使用cookie)
* [使用插槽](#使用插槽)
* [axios 请求响应拦截](#axios请求响应拦截)
* [keep-alive](#keep-alive)
* [url 与 pushState](#url与pushState)
* [引入外部 js](#引入外部js)
* [从 defineProperty 到 proxy](#从defineProperty到proxy)
* [动态组件与异步组件](#动态组件与异步组件)
* [开启gzip模式](#开启gzip模式)
* [注意或优化的地方](#注意或优化的地方)
* [vue3.0 新特性](#vue3.0新特性)
* [vue-loader 原理](#vue-loader原理)
* [新增属性不能响应的问题](#新增属性不能响应的问题)
* [v-show与v-if](#v-show与v-if)
* [data为什么是一个函数](#data为什么是一个函数)
* [子组件为什么不可以修改父组件传递的Prop](#子组件为什么不可以修改父组件传递的Prop)
* [v-model是如何实现双向绑定](#v-model是如何实现双向绑定)
* [虚拟Dom以及key属性的作用](#虚拟Dom以及key属性的作用)
* [mixin](#mixin)
* [Vue模版编译原理](#Vue模版编译原理)
* [SSR](#SSR)
* [SPA单页面的理解](#SPA单页面的理解)
* [hookEvent](#hookEvent)
* [loading](#loading)
* [函数式组件](#函数式组件)
* [过滤器](#过滤器)
* [.sync语法糖](#.sync语法糖)
* [深层选择器](#深层选择器)
* [递归菜单](#递归菜单)
* [vue源码简述](#vue源码简述)
* [页面加载闪烁问题](#页面加载闪烁问题)
* [Vue3.0数据响应机制](#Vue3.0数据响应机制)
* [Vue3任意传送门Teleport](#Vue3任意传送门Teleport)
* [Vue3优化diff](#Vue3优化diff)
* [Vue Composition API 和 React Hooks](#VueCompositionAPI和ReactHooks)
* [vue常见问题解决方案](#vue常见问题解决方案)
* [Vue3是如何变快的](#Vue3是如何变快的)
* [vue-router4](#vue-router4)
* [循环条件动态class混合使用](#循环条件动态class混合使用)
* [typescript样例](#typescript样例)

---

## vue 自带指令

1. v-if 控制 dom 结构的显示隐藏，dom 结构消失
2. v-show 控制 dom 结构的显示隐藏，dom 结构不消失
3. v-for 循环显示数据
4. v-on 简写 @，@事件名
5. v-bind 简写 :，:属性，常用于样式，组件传值，如:style   :xxx
6. v-model 常用于 input 输入框中。修饰符 .trim 首尾空格过滤，.number 转数字 .lazy 与 change 事件同步，类似 onbulr 事件
7. v-once 只渲染元素或组件一次。dom 再次更新时会被当成静态内容跳过。
8. v-html 代码按 html 格式显示

## vue 自定义指令

参考：[分享8个非常实用的Vue自定义指令](https://juejin.cn/post/6906028995133833230)

* 全局定义指令：在 vue 对象的 directive 方法里面有两个参数，一个是指令名称，另外一个是函数。组件内定义指令：directives
* 钩子函数：bind（绑定事件触发）、inserted(节点插入的时候触发)、update（组件内相关更新）
* 钩子函数参数：el、binding

例子：

```js
Vue.directive("img", {
  inserted: function (el, binding) {
    let color = Math.floor(Math.random() * 1000000);
    el.style.backgroundColor = "#" + color; // 设置随机的背景色

    let img = new Image();
    img.src = binding.value; // 获得传给指令的值
    img.onload = function () {
      el.style.backgroundImage = "url(" + binding.value + ")";
    };
  },
});
```

* 批量注册指令
```js
import copy from './copy'
import longpress from './longpress'
// 自定义指令
const directives = {
  copy,
  longpress,
}

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  },
}
```

* main.js引用
```js
import Vue from 'vue'
import Directives from './JS/directives'
Vue.use(Directives)
```

* v-copy:实现一键复制文本内容，用于鼠标右键粘贴
```js
const copy = {
  bind(el, { value }) {
    el.$value = value
    el.handler = () => {
      if (!el.$value) {
        // 值为空的时候，给出提示。可根据项目UI仔细设计
        console.log('无复制内容')
        return
      }
      // 动态创建 textarea 标签
      const textarea = document.createElement('textarea')
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = el.$value
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea)
      // 选中值并复制
      textarea.select()
      const result = document.execCommand('Copy')
      if (result) {
        console.log('复制成功') // 可根据项目UI仔细设计
      }
      document.body.removeChild(textarea)
    }
    // 绑定点击事件，就是所谓的一键 copy 啦
    el.addEventListener('click', el.handler)
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value }) {
    el.$value = value
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', el.handler)
  },
}

export default copy
```
```html
<template>
  <button v-copy="copyText">复制</button>
</template>

<script>
  export default {
    data() {
      return {
        copyText: 'a copy directives',
      }
    },
  }
</script>
```

* v-longpress:用户需要按下并按住按钮几秒钟，触发相应的事件
```js
const longpress = {
  bind: function (el, binding, vNode) {
    if (typeof binding.value !== 'function') {
      throw 'callback must be a function'
    }
    // 定义变量
    let pressTimer = null
    // 创建计时器（ 2秒后执行函数 ）
    let start = (e) => {
      if (e.type === 'click' && e.button !== 0) {
        return
      }
      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          handler()
        }, 2000)
      }
    }
    // 取消计时器
    let cancel = (e) => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }
    // 运行函数
    const handler = (e) => {
      binding.value(e)
    }
    // 添加事件监听器
    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)
    // 取消计时器
    el.addEventListener('click', cancel)
    el.addEventListener('mouseout', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value }) {
    el.$value = value
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', el.handler)
  },
}

export default longpress
```
```html
<template>
  <button v-longpress="longpress">长按</button>
</template>

<script>
export default {
  methods: {
    longpress () {
      alert('长按指令生效')
    }
  }
}
</script>
```

* v-debounce:防抖
```js
const debounce = {
  inserted: function (el, binding) {
    let timer
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        binding.value()
      }, 1000)
    })
  },
}

export default debounce
```
```html
<template>
  <button v-debounce="debounceClick">防抖</button>
</template>

<script>
export default {
  methods: {
    debounceClick () {
      console.log('只触发一次')
    }
  }
}
</script>
```

* v-emoji:根据正则表达式，设计自定义处理表单输入规则的指令，禁止输入表情和特殊字符
```js
let findEle = (parent, type) => {
  return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type)
}

const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

const emoji = {
  bind: function (el, binding, vnode) {
    // 正则规则可根据需求自定义
    var regRule = /[^\u4E00-\u9FA5|\d|\a-zA-Z|\r\n\s,.?!，。？！…—&$=()-+/*{}[\]]|\s/g
    let $inp = findEle(el, 'input')
    el.$inp = $inp
    $inp.handle = function () {
      let val = $inp.value
      $inp.value = val.replace(regRule, '')

      trigger($inp, 'input')
    }
    $inp.addEventListener('keyup', $inp.handle)
  },
  unbind: function (el) {
    el.$inp.removeEventListener('keyup', el.$inp.handle)
  },
}

export default emoji
```
```html
<template>
  <input type="text" v-model="note" v-emoji />
</template>
```

* v-LazyLoad:图片懒加载,只加载浏览器可见区域的图片
```js
const LazyLoad = {
  // install方法
  install(Vue, options) {
    const defaultSrc = options.default
    Vue.directive('lazy', {
      bind(el, binding) {
        LazyLoad.init(el, binding.value, defaultSrc)
      },
      inserted(el) {
        if (IntersectionObserver) {
          LazyLoad.observe(el)
        } else {
          LazyLoad.listenerScroll(el)
        }
      },
    })
  },
  // 初始化
  init(el, val, def) {
    el.setAttribute('data-src', val)
    el.setAttribute('src', def)
  },
  // 利用IntersectionObserver监听el
  observe(el) {
    var io = new IntersectionObserver((entries) => {
      const realSrc = el.dataset.src
      if (entries[0].isIntersecting) {
        if (realSrc) {
          el.src = realSrc
          el.removeAttribute('data-src')
        }
      }
    })
    io.observe(el)
  },
  // 监听scroll事件
  listenerScroll(el) {
    const handler = LazyLoad.throttle(LazyLoad.load, 300)
    LazyLoad.load(el)
    window.addEventListener('scroll', () => {
      handler(el)
    })
  },
  // 加载真实图片
  load(el) {
    const windowHeight = document.documentElement.clientHeight
    const elTop = el.getBoundingClientRect().top
    const elBtm = el.getBoundingClientRect().bottom
    const realSrc = el.dataset.src
    if (elTop - windowHeight < 0 && elBtm > 0) {
      if (realSrc) {
        el.src = realSrc
        el.removeAttribute('data-src')
      }
    }
  },
  // 节流
  throttle(fn, delay) {
    let timer
    let prevTime
    return function (...args) {
      const currTime = Date.now()
      const context = this
      if (!prevTime) prevTime = currTime
      clearTimeout(timer)

      if (currTime - prevTime > delay) {
        prevTime = currTime
        fn.apply(context, args)
        clearTimeout(timer)
        return
      }

      timer = setTimeout(function () {
        prevTime = Date.now()
        timer = null
        fn.apply(context, args)
      }, delay)
    }
  },
}

export default LazyLoad
```
```html
<img v-LazyLoad="xxx.jpg" />
```

* v-permission:自定义一个权限指令，对需要权限判断的 Dom 进行显示隐藏
```js
function checkArray(key) {
  let arr = ['1', '2', '3', '4']
  let index = arr.indexOf(key)
  if (index > -1) {
    return true // 有权限
  } else {
    return false // 无权限
  }
}

const permission = {
  inserted: function (el, binding) {
    let permission = binding.value // 获取到 v-permission的值
    if (permission) {
      let hasPermission = checkArray(permission)
      if (!hasPermission) {
        // 没有权限 移除Dom元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  },
}

export default permission
```
```html
<div class="btns">
  <!-- 显示 -->
  <button v-permission="'1'">权限按钮1</button>
  <!-- 不显示 -->
  <button v-permission="'10'">权限按钮2</button>
</div>
```

* vue-waterMarker:给整个页面添加背景水印
```js
function addWaterMarker(str, parentNode, font, textColor) {
  // 水印文字，父元素，字体，文字颜色
  var can = document.createElement('canvas')
  parentNode.appendChild(can)
  can.width = 200
  can.height = 150
  can.style.display = 'none'
  var cans = can.getContext('2d')
  cans.rotate((-20 * Math.PI) / 180)
  cans.font = font || '16px Microsoft JhengHei'
  cans.fillStyle = textColor || 'rgba(180, 180, 180, 0.3)'
  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  cans.fillText(str, can.width / 10, can.height / 2)
  parentNode.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')'
}

const waterMarker = {
  bind: function (el, binding) {
    addWaterMarker(binding.value.text, el, binding.value.font, binding.value.textColor)
  },
}

export default waterMarker
```
```html
<template>
  <div v-waterMarker="{text:'lzg版权所有',textColor:'rgba(180, 180, 180, 0.4)'}"></div>
</template>
```

* v-draggable:拖拽指令，可在页面可视区域任意拖拽元素
```js
const draggable = {
  inserted: function (el) {
    el.style.cursor = 'move'
    el.onmousedown = function (e) {
      let disx = e.pageX - el.offsetLeft
      let disy = e.pageY - el.offsetTop
      document.onmousemove = function (e) {
        let x = e.pageX - disx
        let y = e.pageY - disy
        let maxX = document.body.clientWidth - parseInt(window.getComputedStyle(el).width)
        let maxY = document.body.clientHeight - parseInt(window.getComputedStyle(el).height)
        if (x < 0) {
          x = 0
        } else if (x > maxX) {
          x = maxX
        }

        if (y < 0) {
          y = 0
        } else if (y > maxY) {
          y = maxY
        }

        el.style.left = x + 'px'
        el.style.top = y + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null
      }
    }
  },
}
export default draggable
```
```html
<template>
  <div class="el-dialog" v-draggable></div>
</template>
```

## vue 生命周期

* 创建前/后：

  * beforeCreate：vue 实例的挂载元素\$el 和数据对象 data 都为 undefined，还未初始化，无法获取 data，props 数据。
  * created：vue 实例的数据对象 data 有了，\$el 还没有，可以获取 data，props 值，可以进行 ajax 请求，但请求信息过多，会长时间白屏。

* 载入前/后：

  * beforeMount：vue 实例的\$el 和 data 都初始化了，但还是挂载之前为虚拟的 dom 节点，data.message 还未替换。
  * mounted：vue 实例挂载完成，data.message 成功渲染，可以获取 dom 结构，可以进行 ajax 请求，也一般在此时请求。

* 更新前/后：

  * 当 data 变化时，会触发 beforeUpdate 和 updated 方法。

* keep-alive 组件激活/停用时调用(在服务器端渲染期间不被调用)

  * activated
  * deactivated

* 销毁前/后：
  * 在执行 destroy 方法后，对 data 的改变不会再触发周期函数，说明此时 vue 实例已经解除了事件监听以及和 dom 的绑定，但是 dom 结构依然存在

## 自定义指令生命周期

* bind:指令第一次绑定到元素时调用，定义绑定时执行一次的初始化动作。

* inserted:被绑定元素插入父节点时调用

* update:被绑定于元素所在的模板更新时调用，而无论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新。

* componentUpdated:被绑定元素所在模板完成一次更新周期时调用。

* unbind:只调用一次，指令与元素解绑时调用。

## vue 双向数据绑定原理

* [探讨 vue 的双向绑定原理及实现](https://www.cnblogs.com/zhouyideboke/p/9626804.html)

vue 采用数据劫持结合发布者-订阅者模式的方式实现双向数据绑定。通过 Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

* Object.defineProperty()

  Object.defineProperty(对象, 属性名, 属性描述符对象)

  属性描述符：

  * configurable：描述符是否能被改变
  * enumerable：描述符是否能枚举
  * value：属性值
  * writable：value 能否被赋值
  * get：获取 value 执行的函数
  * set：设置 value 执行的函数

* 消息队列

  用于应对修改大量数据导致变慢的情况，使用订阅者和发布者模式，发布者在数据改变时，消息传递给订阅者，依次作出相应变化，消息订阅器采用队列的方式添加订阅者。

* DocumentFragments

  DocumentFragments 是 DOM 节点。它们不是主 DOM 树的一部分。通常的用例是创建文档片段，将元素附加到文档片段，然后将文档片段附加到 DOM 树。在 DOM 树中，文档片段被其所有的子元素所代替。

  因为文档片段存在于内存中，并不在 DOM 树中，所以将子元素插入到文档片段时不会引起页面对元素位置和几何上的计算。因此，使用文档片段通常会带来更好的性能。

* 具体步骤：

1. observe 数据对象(即 data)进行递归遍历，包括子属性对象的属性，都加上 setter 和 getter。给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化,在 set 函数中通知订阅者 watcher。

2. compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图。

* document.createDocumentFragment(); 创建文档片段(虚拟 DOM)，以便操作完成后，挂载到真实 DOM(就像创建一堆 li，再挂载到实际存在的 ul 中)
* 解析元素节点指令
* /\{\{(.\*)\}\}/，正则筛选模板语法，把表达式数据处理到虚拟 DOM

3. Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要做的事情是:

   * 在自身实例化时往属性订阅器(dep)里面添加自己
   * 自身必须有一个 update()方法
   * 待属性变动 dep.notice()通知时，能调用自身的 update()方法，并触发 Compile 中绑定的回调，则功成身退。

   dep 下使用 subs[]消息队列,保存 watcher，dep 定义通知更新的方法

4. MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据 model 变更的双向绑定效果。

## 请求后台资源

* 使用 axios：

1. npm install axios
2. import axios from 'axios'
3. get 请求

```js
// Make a request for a user with a given ID
axios
  .get("/user?ID=12345")
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

// Optionally the request above could also be done as
axios
  .get("/user", {
    params: {
      ID: 12345,
    },
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

4. post 请求

```js
axios
  .post("/user", {
    firstName: "Fred",
    lastName: "Flintstone",
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

5. 同时发起多个请求

```js
function getUserAccount() {
  return axios.get("/user/12345");
}

function getUserPermissions() {
  return axios.get("/user/12345/permissions");
}

axios.all([getUserAccount(), getUserPermissions()]).then(
  axios.spread(function (acct, perms) {
    // Both requests are now complete
  })
);
```

6. axios api

```js
// 发起一个POST请求
axios({
  method: "post",
  url: "/user/12345",
  data: {
    firstName: "Fred",
    lastName: "Flintstone",
  },
});
// 获取远程图片
axios({
  method: "get",
  url: "http://bit.ly/2mTM3nY",
  responseType: "stream",
}).then(function (response) {
  response.data.pipe(fs.createWriteStream("ada_lovelace.jpg"));
});
```

7. 跨域配置/config/index.js

```js
proxyTable: {
      '/api': {
        target: 'http://121.41.130.58:9090',//设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      }
    }
```

* 使用 resource

1. npm install vue-resource
2. 引入

```js
import Vue from "vue";
import VueResource from "vue-resource";
Vue.use(VueResource);
```

3. get 请求

```js
// 传统写法
this.$http.get("/someUrl", [options]).then(
  function (response) {
    // 响应成功回调
  },
  function (response) {
    // 响应错误回调
  }
);

// Lambda写法
this.$http.get("/someUrl", [options]).then(
  (response) => {
    // 响应成功回调
  },
  (response) => {
    // 响应错误回调
  }
);
```

4. restful API

```js
get(url, [options]);
head(url, [options]);
delete (url, [options]);
jsonp(url, [options]);
post(url, [body], [options]);
put(url, [body], [options]);
patch(url, [body], [options]);
```

* options 包含：
  * url
  * method(get/post 等)
  * body
  * params 参数
  * headers
  * timeout
  * before(类似 jquery 的 beforeSend 函数)
  * progress(ProgressEvent 回调处理函数)
  * credientials(bool,跨域请求是否需要凭证)
  * emulateHTTP(bool,发送 put,patch,delete 请求时以 post 发送，请求头：X-HTTP-Method-Override)
  * emulateJSON(bool,body 以 application/x-www-form-urlencoded content type 发送)

## 路由 vue-router

* 链接跳转

```html
<router-link to="/">hello world</router-link>
```

* history 模式

用于消除 url 中的"#"，它利用了 history.pushState API 来完成 URL 的跳转而不需要重新加载页面。

这种模式充分

```js
export default new Router({
  mode: 'history',
  routes: [...]
})
```

* 动态路由、子路由

在 router 目录下的 index.js 文件中，对 path 属性加上/:id。

```js
const router = new VueRouter({
  routes: [
    {
      path: "/user/:id",
      component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: "profile",
          component: UserProfile,
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: "posts",
          component: UserPosts,
        },
      ],
    },
  ],
});
```

* vue-router 导航钩子

1. 全局导航钩子 router.beforeEach/afterEach(to,from,next)，用来跳转前/后进行权限判断。

```js
const router = new VueRouter({ ... });
router.beforeEach((to, from, next) => {
    let token = router.app.$storage.fetch("token");
    let needAuth = to.matched.some(item => item.meta.login);
    if(!token && needAuth) return next({path: "/login"});
    next();
});
```

这三个参数 to 、from 、next 分别的作用：

1. to: Route，代表要进入的目标，它是一个路由对象
2. from: Route，代表当前正要离开的路由，同样也是一个路由对象
3. next: Function，这是一个必须需要调用的方法，而具体的执行效果则依赖 next 方法调用的参数

* next()：进入管道中的下一个钩子，如果全部的钩子执行完了，则导航的状态就是 confirmed（确认的）
* next(false)：这代表中断掉当前的导航，即 to 代表的路由对象不会进入，被中断，此时该表 URL 地址会被重置到 from 路由对应的地址
* next(‘/’) 和 next({path: ‘/’})：在中断掉当前导航的同时，跳转到一个不同的地址
* next(error)：如果传入参数是一个 Error 实例，那么导航被终止的同时会将错误传递给 router.onError() 注册过的回调

2. 组件内的钩子

```js
export default {
  data() {
    return {};
  },
  methods: {
    go() {
      this.$router.push({ name: "HelloWorld" });
    },
  },
  beforeRouteEnter(to, from, next) {
    console.log(this, "beforeRouteEnter"); // undefined
    console.log(to, "组件独享守卫beforeRouteEnter第一个参数");
    console.log(from, "组件独享守卫beforeRouteEnter第二个参数");
    console.log(next, "组件独享守卫beforeRouteEnter第三个参数");
    next((vm) => {
      //因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      console.log(vm); //当前组件的实例
    });
  },
  beforeRouteUpdate(to, from, next) {
    //在当前路由改变，但是该组件被复用时调用
    //对于一个带有动态参数的路径 /good/:id，在 /good/1 和 /good/2 之间跳转的时候，
    // 由于会渲染同样的good组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    console.log(this, "beforeRouteUpdate"); //当前组件实例
    console.log(to, "组件独享守卫beforeRouteUpdate第一个参数");
    console.log(from, "组件独享守beforeRouteUpdate卫第二个参数");
    console.log(next, "组件独享守beforeRouteUpdate卫第三个参数");
    next();
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    console.log(this, "beforeRouteLeave"); //当前组件实例
    console.log(to, "组件独享守卫beforeRouteLeave第一个参数");
    console.log(from, "组件独享守卫beforeRouteLeave第二个参数");
    console.log(next, "组件独享守卫beforeRouteLeave第三个参数");
    next();
  },
};
```

3. 单独路由独享组件

```js
const router = new VueRouter({
  routes: [
    {
      path: "/login",
      component: Login,
      beforeEnter: (to, from, next) => {
        // ...
      },
      beforeLeave: (to, from, next) => {
        // ...
      },
    },
  ],
});
```

* vue3 router

参考：[Vue3中 router 带来了哪些变化？](https://mp.weixin.qq.com/s/lud0TD63gkkX25LERzf3uQ)
```js
import { createRouter, createWebHistory } from 'vue-next-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/user/:a:catchAll(.*)', component: component },
  ],
})
```

## 自定义组件(创建组件步骤)

1. 在 components 目录新建组件文件（smithButton.vue），export default {...}
2. 在需要用组件的页面中导入：import smithButton from ‘../components/smithButton.vue’
3. 注入到 vue 的子组件的 components 属性上面,components:{smithButton}
4. 在 template 视图 view 中使用，<smith-button>

## 父子组件通信

1. 父传子

```html
<子组件名 传给子组件定值名="789" :传给子组件变量名="message" @子组件事件1="message += 2" @子组件事件2="message += $event（子组件传来的数值）" @子组件事件3="onEnlargeText（父组件的函数）"></子组件名>
<syntaxchild message="789" :data="message2" @aaa="message2 += 2" @bbb="message2 += $event" @ccc="onEnlargeText"></syntaxchild>
```

2. 子传父

```html
<button @click="$emit('事件名',数值)">{{count}}</button>
<button @click="$emit('ccc',4)">{{count}}</button>
```

```js
props: [
    'message',
    'data'
],
```

3. 父传孙(继承关系跨任意级传值)

* 父

```js
export default {
  name: "el-select",
  provide() {
    return {
      select: this,
    };
  },
};
```

* 孙

```js
export default {
  name: "el-option",
  inject: ["select"],
  created() {
    if (this.select.value === this.value) {
      this.select.label = this.label;
    }
  },
};
```

## 兄弟组件通信

1. 父元素中介

父元素与子元素 A/B 通过 props 和 emit 通信,A 的 emit 通过父元素改变 B 的 props 传值，B 同理

缺点：大型项目父元素变得混乱

2. eventbus

通过创建新的 vue 实例，在兄弟组件之间引入，即可使用 vue 的$on和$emit

```js
// main.js
import Vue from "vue";
import App from "./App";

export const eventBus = new Vue();

new Vue({
  el: "#app",
  render: (h) => h(App),
});
```

```vue
<!-* SisterCard.vue -->
<template>
  <div class="message">
    <div class="message-header">
      <h5 v-text="theCardTitle"></h5>
    </div>
    <div class="message-body">
      <p class="message-text">我是Sister组件</p>
      <button @click="messageBrother" class="btn">给哥哥发消息</button>

      <div v-if="fromBrother" class="alert" v-html="fromBrother"></div>
    </div>
  </div>
</template>

<script>
import { eventBus } from "../main";

export default {
  name: "SisterCard",
  data: () => ({
    theCardTitle: "Sister Card",
    fromBrother: "",
  }),
  methods: {
    messageBrother() {
      eventBus.$emit("sisterSaid", "妈妈说，该做作业了！(^_^)!!!");
    },
  },
  created() {
    eventBus.$on("brotherSaid", (message) => {
      this.fromBrother = message;
    });
  },
};
</script>
```

```vue
<!-* BrotherCard.vue -->
<template>
  <div class="message">
    <div class="message-header">
      <h5 v-text="theCardTitle"></h5>
    </div>
    <div class="message-body">
      <p class="message-text">我是Brother组件</p>
      <button @click="messageSister" class="btn">给妹妹发消息</button>

      <div v-if="fromSister" class="alert" v-html="fromSister"></div>
    </div>
  </div>
</template>

<script>
import { eventBus } from "../main.js";

export default {
  name: "BrotherCard",
  data: () => ({
    theCardTitle: "Brother Card",
    fromSister: "",
  }),
  methods: {
    messageSister() {
      eventBus.$emit("brotherSaid", "妈妈说，该做作业了！(^_^)!!!");
    },
  },
  created() {
    eventBus.$on("sisterSaid", (message) => {
      this.fromSister = message;
    });
  },
};
</script>
```

## vuex 状态管理(组件间通信)

Store 是 Vuex 的一个仓库。组件一般在计算属性（computed）获取 state 的数据（return this.\$store.state.name）,当组件从 store 中读取状态（state），若状态发生更新时，它会及时的响应给其他的组件（类似双向数据绑定），而且不能直接改变 store 的状态，改变状态的唯一方法就是提交更改（mutations）

* state：用来存放组件之间共享的数据。他跟组件的 data 选项类似，只不过 data 选项是用来存放组件的私有数据。
* getters：state 的数据的筛选和过滤，可以把 getters 看成是 store 的计算属性。getters 下的函数接收接收 state 作为第一个参数。过滤的数据会存放到\$store.getters 对象中。
* mutations：实际改变状态(state) 的唯一方式是通过提交(commit) 一个 mutation。mutations 下的函数接收 state 作为参数，接收 payload（载荷）作为第二个参数，用来记录开发者使用该函数的一些信息，如提交了什么，提交的东西用来干什么，包含多个字段，所以载荷一般是对象，mutations 方法必须是同步方法。
* actions：mutations 只能处理同步函数，actions 处理异步函数。actions 提交的是 mutations，而不是直接变更状态。actions 可以包含任意异步操作：ajax、setTimeout、setInterval。actions 通过 store.dispatch(方法名) 触发

问题：vuex 为什么用 action 进行异步操作，而不在 mutation 一起处理？

1. vuex 文档说法

   一条重要的原则就是要记住 mutation 必须是同步函数。

   ```js
     mutations: {
       someMutation (state) {
         api.callAsyncMethod(() => {
           state.count++
         })
       }
     }
   ```

   现在想象，我们正在 debug 一个 app 并且观察 devtool 中的 mutation 日志。每一条 mutation 被记录，devtools 都需要捕捉到前一状态和后一状态的快照。然而，在上面的例子中 mutation 中的异步函数中的回调让这不可能完成：因为当 mutation 触发的时候，回调函数还没有被调用，devtools 不知道什么时候回调函数实际上被调用——实质上任何在回调函数中进行的状态的改变都是不可追踪的。

   在 mutation 中混合异步调用会导致你的程序很难调试。例如，当你调用了两个包含异步回调的 mutation 来改变状态，你怎么知道什么时候回调和哪个先回调呢？这就是为什么我们要区分这两个概念。在 Vuex 中，mutation 都是同步事务。

2. 尤雨溪(vue 作者)说法

   中文翻译可能有些偏差（不是我翻的）。区分 actions 和 mutations 并不是为了解决竞态问题，而是为了能用 devtools 追踪状态变化。

   事实上在 vuex 里面 actions 只是一个架构性的概念，并不是必须的，说到底只是一个函数，你在里面想干嘛都可以，只要最后触发 mutation 就行。异步竞态怎么处理那是用户自己的事情。vuex 真正限制你的只有 mutation 必须是同步的这一点（在 redux 里面就好像 reducer 必须同步返回下一个状态一样）。

   同步的意义在于这样每一个 mutation 执行完成后都可以对应到一个新的状态（和 reducer 一样），这样 devtools 就可以打个 snapshot 存下来，然后就可以随便 time-travel 了。

   如果你开着 devtool 调用一个异步的 action，你可以清楚地看到它所调用的 mutation 是何时被记录下来的，并且可以立刻查看它们对应的状态。其实我有个点子一直没时间做，那就是把记录下来的 mutations 做成类似 rx-marble 那样的时间线图，对于理解应用的异步状态变化很有帮助。

问题2：Vuex和单纯的全局对象有什么区别

1. Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

2. 不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

```js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  count: 1,
};

const getters = {
  count: (state) => state.count,
};

const actions = {
  count(context) {
    context.commit("count");
  },
};

const mutations = {
  add(state, n) {
    state.count += n;
  },
  reduce(state) {
    state.count -= 1;
  },
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
```

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

命名空间

```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

动态注册

```js
// 注册模块 `myModule`
store.registerModule("myModule", {
  // ...
});
// 注册嵌套模块 `nested/myModule`
store.registerModule(["nested", "myModule"], {
  // ...
});
```

问题3：vuex与v-model是否冲突？

v-model会去修改state的值，但是vuex数据修改又必须经过mutation，这样就冲突了

解决办法：拆开v-model语法糖，在@input中使用commit提交数据

问题4：什么场景下使用vuex，而不是localstorage？

Vuex 的状态存储是响应式的，当多个组件拥有同一个状态的时候，vuex能够很好的帮我们处理

Vuex 可以很好的使用vue开发者工具调试vuex的状态 这些优势是localStorage不能够很好的模拟的

## 小型vuex:Vue.observable

项目规模不大，可以使用Vue2.6提供的新API Vue.observable手动打造一个Vuex

```js
import Vue from 'vue'

// 通过Vue.observable创建一个可响应的对象
export const store = Vue.observable({
  userInfo: {},
  roleIds: []
})

// 定义 mutations, 修改属性
export const mutations = {
  setUserInfo(userInfo) {
    store.userInfo = userInfo
  },
  setRoleIds(roleIds) {
    store.roleIds = roleIds
  }
}
```
```html
<template>
  <div>
    {{ userInfo.name }}
  </div>
</template>
<script>
import { store, mutations } from '../store'
export default {
  computed: {
    userInfo() {
      return store.userInfo
    }
  },
  created() {
    mutations.setUserInfo({
      name: '子君'
    })
  }
}
</script>
```

## vue 与 jquery 的区别

vue 是一个 mvvm（model+view+viewModel）框架，数据驱动，通过数据来显示视图层，而不是 jquery 的事件驱动进行节点操作。vue 适用于数据操作比较多的场景。

## vuejs 与 angularjs 以及 react 的区别

* 学习难度：vue < angular < react
* 社区成熟度：vue < angular、react
* vue 轻量级框架。使用 jsx。
* angular 较完善框架，由 google 开发，包含服务，模板，数据双向绑定（脏检查），模块化，路由，过滤器，依赖注入等所有功能。使用 typescript。
* react 由 facebook 开发，通过对 DOM 的模拟（虚拟 dom），最大限度地减少与 DOM 的交互。使用 jsx。

## vue 源码结构

vue2 结构

```txt
|-* build                            // 项目构建(webpack)相关代码
|   |-* build.js                     // 生产环境构建代码
|   |-* check-version.js             // 检查node、npm等版本
|   |-* utils.js                     // 构建工具相关
|   |-* vue-loader.conf.js           // webpack loader配置
|   |-* webpack.base.conf.js         // webpack基础配置
|   |-* webpack.dev.conf.js          // webpack开发环境配置,构建开发本地服务器
|   |-* webpack.prod.conf.js         // webpack生产环境配置
|-* config                           // 项目开发环境配置
|   |-* dev.env.js                   // 开发环境变量
|   |-* index.js                     // 项目一些配置变量
|   |-* prod.env.js                  // 生产环境变量
|-* src                              // 源码目录
|   |-* assets                       // 资源文件(字体、图片)
|   |-* components                   // vue公共组件
|   |-* pages                        // vue页面
|   |-* router                       // vue的路由管理
|   |-* scss                         // 样式文件
|   |-* store                        // vuex状态管理
|   |-* App.vue                      // 页面入口文件
|   |-* main.js                      // 程序入口文件，加载各种公共组件
|-* static                           // 静态文件，比如一些图片，json数据等
|-* .babelrc                         // ES6语法编译配置
|-* .editorconfig                    // 定义代码格式
|-* .gitignore                       // git上传需要忽略的文件格式
|-* .postcsssrc                      // postcss配置文件
|-* README.md                        // 项目说明
|-* index.html                       // 入口页面
|-* package.json                     // 项目基本信息,包依赖信息等
```

## vue2.0 和 3.0 的区别

* 安装命令调整

原来：

```txt
npm install -g vue-cli
vue init <template-name> <project-name>
```

现在：

```txt
npm install -g @vue/cli
# or
yarn global add @vue/cli

vue create my-project
```

* 项目结构变化

```txt
│  package-lock.json
│  package.json
│  vue.config.js
├─public
│      favicon.ico
│      index.html
└─src
    │  App.vue
    │  main.js
    │  router.js
    │  store.js
    ├─assets
    │      logo.png
    └─components
            HelloWorld.vue
```

vue-cli3.0 默认项目目录与 2.0 的相比，更精简:

1. 移除的配置文件根目录下的，build 和 config 等目录
2. 移除了 static 文件夹，新增了 public 文件夹，并且 index.html 移动到 public 中
3. 在 src 文件夹中新增了 views 文件夹，用于分类 视图组件 和 公共组件
4. 大部分配置 都集成到 vue.config.js 这里,在项目根目录下

* 运行命令改变

原来：

```txt
npm run dev/npm run build
```

现在：

```txt
npm run serve/npm run build
```

## style 中 scoped 的作用

* 添加 scoped 来使得当前样式只作用于当前组件的节点，其它组件不能设置此组件样式,因此 App.vue 引用公共组件不使用 scoped。

* 在背后做的工作是将当前组件的节点添加一个像 data-v-1233
  这样唯一属性的标识，当然也会给当前 style 的所有样式添加[data-v-1233]

## 子组件监听父组件数值变化

这就是观察订阅者模式，vue 的实现采用了 watch 方法。

* 父组件

```html
<template>
  <load-list :param="param" cate="hide"></load-list>
</template>
```

param 是 data 函数里面的一个对象,子组件需要使用监听对象的 watch 写法

* 子组件

1. 普通类型的数据

```js
data() {  
    return {  
        param: 0      
    }  
},  
watch: {  
    param(newValue, oldValue) {  
        console.log(newValue)  
    }  
}
```

2. 数组

```js
data() {  
    return {  
        param: new Array(11).fill(0)      
    }  
},  
watch: {  
   param(newValue, oldValue) {  
       handler(newValue, oldValue) {  
　　　　　　for (let i = 0; i < newValue.length; i++) {  
　　　　　　　　if (oldValue[i] != newValue[i]) {  
　　　　　　　　　　console.log(newValue)  
　　　　　　　　}
          }
　　　　}  
　　},  
　　deep: true
}
```

3. 对象

```js
data() {  
    return {  
        param: {
　　　　　　pokerState: 53,
　　　　　　pokerHistory: 'local'
　　　　}
    }  
},  
watch: {  
   param(newValue, oldValue) {  
        console.log(newValue)  
　　},  
　　deep: true
}
```

4. 对象具体属性

```js
data() {  
    return {  
        param: {
　　　　　　pokerState: 53,
　　　　　　pokerHistory: 'local'
　　　　}
    }  
},
computed: {
　　pokerHistory() {
　　　　return this.param.pokerHistory
　　}
},
watch: {  
　　pokerHistory(newValue, oldValue) {  
        console.log(newValue)  
　　}
}
```

## 取消watch监听

this.$watch返回了一个值unwatch,是一个函数，在需要取消的时候，执行 unwatch()
```js
export default {
  data() {
    return {
      formData: {
        name: '',
        age: 0
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      const unwatch = this.$watch(
        'formData',
        () => {
          console.log('数据发生了变化')
        },
        {
          deep: true
        }
      )
    }
  }
}
```

## 页面传参与获取

1. 传参

* 方法 1

```js
this.$router.push({
  path: "/world",
  name: "world",
  params: {
    id: id,
  },
});
```

* 方法 2

```html
<router-link :to="{path:'/home',query:{id:'aaa'}}">跳转</router-link>
```

2. 获取

```js
export default {
  name: "",
  data() {
    return {
      id: "",
    };
  },
  created() {
    this.getParams();
  },
  methods: {
    getParams() {
      // 取到路由带过来的参数
      var routerParams = this.$route.params.id;
      // 将数据放在当前组件的数据内
      this.id = routerParams;
    },
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: "getParams",
  },
};
```

3. 路由器参数解耦

```js
const router = new VueRouter({
  routes: [{
    path: '/:id',
    component: Component,
    props: true
  }]
})
//或
const router = new VueRouter({
  routes: [{
    path: '/:id',
    component: Component,
    props: router => ({ id: route.query.id })
  }]
})
```
```js
export default {
  props: ['id'],
  methods: {
    getParamsId() {
      return this.id
    }
  }
}
```

## 不同 url 复用页面，且只刷新部分组件

场景：登录页面中，有忘记密码功能，所填的信息仅有部分不同，但为了区分功能，url 需要改变。
方法：watch+\$route(to,from)

* router

```js
{
  path: '/login',
  name: 'login',
  component: Login
},
{
  path: '/forgetAccount',
  name: 'forgetAccount',
  component: Login
},
{
  path: '/forgetPassword',
  name: 'forgetPassword',
  component: Login
}
```

```html
<div class="login" v-else-if="page == 'login'">
  <div class="login2">
    <router-link to="/login">跳转</router-link>
    <router-link to="/forgetAccount">跳转1</router-link>
    <router-link to="/forgetPassword">跳转2</router-link>
  </div>
</div>
<div class="forgetAccount" v-else-if="page == 'forgetAccount'">
  <div class="forget">
    <router-link to="/login">跳转</router-link>
    <router-link to="/forgetAccount">跳转a</router-link>
    <router-link to="/forgetPassword">跳转b</router-link>
  </div>
</div>
<div class="forgetPassword" v-else-if="page == 'forgetPassword'">
  <div class="forget">
    <router-link to="/login">跳转</router-link>
    <router-link to="/forgetAccount">跳转A</router-link>
    <router-link to="/forgetPassword">跳转B</router-link>
  </div>
</div>
```

```js
data () {
    return {
      page: 'login'
    }
  },
  watch: {
    '$route' (to, from) {
      this.page = to.name;
    }
  }
```

## method 与 computed 区别

1. computed 是属性调用，而 methods 是函数调用，computed 要有返回值

```html
<p class="test2-3">{{methodTest()}}</p>
<p class="test3-1">{{computedTest}}</p>
```

2. computed 带有缓存功能，而 methods 不是

computed 依赖于 data 中的数据，只有在它的相关依赖数据发生改变时才会重新求值，官方文档反复强调：对于任何复杂逻辑，都应当使用计算属性。

简单来说：data 中依赖的值不变，刷新视图，method 会重新计算，computed 不会（节省内存）。

## 使用 cookie

1. npm install vue-cookies
2. main.js 文件

```js
const $cookies = require("vue-cookies");
Vue.use($cookies);
```

3. 子组件引用

```js
this.$cookies.set(name, value, time);
this.$cookies.get(name);
```

## 使用插槽

* slot 插槽

子组件

```html
<template>
  <div class="child">
    <slot name="slot1"></slot
    ><!-* 具名插槽 -->
    <slot></slot
    ><!-* 匿名插槽 -->
    <slot name="slot2"></slot>
  </div>
</template>
```

父组件

```html
<template>
  <div class="father">
    <child>
      <div class="tmpl" slot="slot1">
        <span>菜单1</span>
      </div>
      <div class="tmpl">
        <span>菜单2</span>
      </div>
      <div class="tmpl" slot="slot2">
        <span>菜单3</span>
      </div>
    </child>
  </div>
</template>
```

* slot-scope 带数据插槽

子组件

```html
<template>
  <div class="child">
    <slot :data="data"></slot>
  </div>
</template>

export default { data: function(){ return { data:
['zhangsan','lisi','wanwu','zhaoliu','tianqi','xiaoba'] } } }
```

父组件

```html
<template>
  <div class="father">
    <child>
      <template slot-scope="user">
        <ul>
          <li v-for="item in user.data">{{item}}</li>
        </ul>
      </template>
    </child>
    <child>
      模板
    </child>
  </div>
</template>
```

## axios 请求响应拦截

config.js

```js
import axios from "axios"; //引入axios依赖
import { Message } from "element-ui";
import Cookies from "js-cookie"; //引入cookie操作依赖
import router from "@/router/index"; //引入路由对象
axios.defaults.timeout = 5000;
axios.defaults.baseURL = "";

//http request 封装请求头拦截器
axios.interceptors.request.use(
  (config) => {
    var token = "";
    if (typeof Cookies.get("user") === "undefined") {
      //此时为空
    } else {
      token = JSON.parse(Cookies.get("user")).token;
    } //注意使用的时候需要引入cookie方法，推荐js-cookie
    config.data = JSON.stringify(config.data);
    config.headers = {
      "Content-Type": "application/json",
    };
    if (token != "") {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(err);
  }
);

//http response 封装后台返回拦截器
axios.interceptors.response.use(
  (response) => {
    //当返回信息为未登录或者登录失效的时候重定向为登录页面
    if (
      response.data.code == "W_100004" ||
      response.data.message == "用户未登录或登录超时，请登录！"
    ) {
      router.push({
        path: "/",
        query: { redirect: router.currentRoute.fullPath }, //从哪个页面跳转
      });
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 移除拦截器
// var myInterceptor = axios.interceptors.request.use(function () {/*...*/});
// axios.interceptors.request.eject(myInterceptor);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
/**
 * 封装导出Excal文件请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function exportExcel(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: url, // 请求地址
      data: data, // 参数
      responseType: "blob", // 表明返回服务器返回的数据类型
    }).then(
      (response) => {
        resolve(response.data);
        let blob = new Blob([response.data], {
          type: "application/vnd.ms-excel",
        });
        let fileName = "订单列表_" + Date.parse(new Date()) + ".xls";
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }
      },
      (err) => {
        reject(err);
      }
    );
  });
}
/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
```

在 main.js 中进行引用，并配置一个别名（\$ajax）来进行调用:

```js
import axios from "axios";
import "../config/axios";

Vue.prototype.$ajax = axios;
```

调用

```js
this.$ajax({
  method: "post",
  url: "/login",
  data: {
    userName: "xxx",
    password: "xxx",
  },
}).then((res) => {
  console.log(res);
});
```

## keep-alive

keep-alive 是 vue 内置组件，把你想要缓存的东西缓存到内存，避免重新渲染 Dom，vue 本身是单页面，而 keep-alive 对单页面以及 mode:history 模式下有效。
版本 2.1.0 后提供了 include/exclude 两个属性 可以针对性缓存相应的组件，2.2 后加入了 beforeRouteUpdate 钩子函数。

* 原理

1. 通过 slot 获取 keep-alive 包裹着的第一个子组件对象及其组件名
2. 根据设定的黑白名单（如果有）进行条件匹配，决定是否缓存。不匹配，直接返回组件实例（VNode）
3. 根据组件 ID 和 tag 生成缓存 Key，并在缓存对象中查找是否已缓存过该组件实例。如果存在，直接取出缓存值并更新该 key 在 this.keys 中的位置（更新 key 的位置是实现 LRU 置换策略的关键）
4. 在 this.cache 对象中存储该组件实例并保存 key 值，之后检查缓存的实例数量是否超过 max 设置值，超过则根据 LRU 置换策略删除最近最久未使用的实例（即是下标为 0 的那个 key）
5. 将该组件实例的 keepAlive 属性值设置为 true

* 属性介绍

1. include 定义了需要缓存的组件名，参数可以使用字符串或者正则字符串，例如“a,b” 或者/a|b/
2. exclude 定义了不需要缓存的组件名, 用法同上
3. max 定义最大缓存数量，超过 max，会默认把最久没有被使用过的从缓存里剔除（见源码注释）

* 钩子函数

1. 当组件第一次渲染的时候会先跟传统组件一样触发到 mounted 钩子，然后触发 activated 钩子。之后就只会触发下面两个钩子。
2. activated 当前组件处于激活状态，当组件显示的时候触发该钩子
3. deactivated 当前组件处于非激活状态，当组件隐藏的时候触发该钩子

* 常见用法

```html
<keep-alive include="test-keep-alive">
  <!-* 将缓存name为test-keep-alive的组件 -->
  <component></component>
</keep-alive>

<keep-alive include="a,b">
  <!-* 将缓存name为a或者b的组件，结合动态组件使用 -->
  <component :is="view"></component>
</keep-alive>

<!-* 使用正则表达式，需使用v-bind -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>

<!-* 动态判断 -->
<keep-alive :include="includedComponents">
  <router-view></router-view>
</keep-alive>

<keep-alive exclude="test-keep-alive">
  <!-* 将不缓存name为test-keep-alive的组件 -->
  <component></component>
</keep-alive>
```

```js
export default {
  name: 'test-keep-alive',
  data () {
    return {
        includedComponents: "test-keep-alive"
    }
  },
  deactivated: function () {
      this.productclass.name=""//查询条件
      this.loaddata(1) //查询结果的方法
  }
  activated: function () {
      this.productclass.name=""//查询条件
      this.loaddata(1) //查询结果的方法
  }
}
```

* 结合 router，缓存部分页面

1. 配置路由 router 文件

```html
<keep-alive>
  <router-view v-if="$route.meta.keepAlive">
    <!-* 这里是会被缓存的视图组件，比如 page1-->
  </router-view>
</keep-alive>

<router-view v-if="!$route.meta.keepAlive">
  <!-* 这里是不被缓存的视图组件，比如,page2 , page3 -->
</router-view>
```

```js
export default new Router({
  routes: [
    {
      path: "/",
      name: "Hello",
      component: Hello,
      meta: {
        keepAlive: false, // 不需要缓存
      },
    },
    {
      path: "/page1",
      name: "Page1",
      component: Page1,
      meta: {
        keepAlive: true, // 需要被缓存
      },
    },
  ],
});
```

2. 配置 app.vue

```html
<keep-alive>
  <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive"></router-view>
```

3. 可设置路由守卫（可选）

```js
beforeRouteEnter(to,from,next){
  if(to.name == 'test'){
    from.meta.keepAlive = true;
  }
  else{
    from.meta.keepAlive = false;
  }
  next();
}
```

* 注意事项

1. 不要在 keep-alive 同时渲染多个组件，会被忽略.
2. keep-alive 里包裹组件的子组件们都会触发 activated 和 deactivate 钩子（2.2.0+）版本后
3. keep-alive 是虚拟组件，不会生成任何 dom

## url 与 pushState

* history.pushState(state, title, url) 与 history.replaceState(state, title, url)

  * state 是一个对象，具体内容除了最大 640KB 之外没有别的限制，设置后用于 popState 事件中，能够获取 state 对象
  * title 是预留参数，没作用
  * url 会修改当前 url 最后/\*\*\*的内容

  pushState 方法就是向 history 中 push 一条记录，更改页面 url，但是不刷新页面

* popstate 事件

  popstate 与 pushState 相对应，主要在页面 url 变更的时候触发，一般绑定在 window 对象下

  ```js
  window.addEventListener("popstate", (e) => {
    console.log(e);
  });
  // bubbles: false
  // cancelBubble: false
  // cancelable: false
  // composed: false
  // currentTarget: Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
  // defaultPrevented: false
  // eventPhase: 0
  // isTrusted: true
  // path: [Window]
  // returnValue: true
  // srcElement: Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
  state: {
    a: 1;
  }
  // target: Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
  // timeStamp: 807874.8699999414
  // type: "popstate"
  // __proto__: PopStateEvent
  ```

* vue-router 页面跳转但不刷新

  vue 实现的单页应用中一般不会刷新页面，因为刷新之后页面中的 vuex 数据就不见了。

  一般情况下，url 变更的时候，如 location.href、history.push、replace 等，页面就会刷新。

  vue-router 利用 pushState，在页面前进的时候动态改变 history 的内容，添加一条记录，接着 location 跟着改变。同时根据 router 前往的路由获取对应的 js 资源文件并挂载到目标 dom 上实现页面内容的更新，但是页面本身并没有刷新。

## 引入外部 js

1. 方法 1

   改造外部 js

   ```js
   var MD5 = function (string) {};
   export { MD5 };
   ```

   页面局部引用 import \* as md5 from '路径'

2. 方法 2

   * main.js

     import XX from “路径”

     Vue.prototype.aa=XX

   * 引入的 js

     ```js
     export { 用到的函数名 };
     ```

   * 调用

     this.aa.函数()

## 从 defineProperty 到 proxy

* vue 的初始化

  vue2 中，new Vue 的时候，调用 Observer，通过 Object.defineProperty 监听 data、computed、props 属性变化，在调用 Compiler 解析模板指令，解析到属性时再通过 Watcher 绑定更新函数，使属性值变化时，Observer 的 setter 通知对应 watcher，再更新 dom，在 render 的时候，需要读取对象值，触发 getter 进行依赖收集，把 watcher 存到订阅者数组中。

  Object.defineProperty无法监听数组变化，当利用索引直接设置一个数组项时，vm.items[indexOfItem] = newValue，解决方法如下：
  ```js
  Vue.set:Vue.set(vm.items, indexOfItem, newValue)
  vm.$set:Vue.set的一个别名vm.$set(vm.items, indexOfItem, newValue)
  Array.prototype.splice:vm.items.splice(indexOfItem, 1, newValue)
  ```
  当修改数组的长度时，vm.items.length = newLength，解决方法如下：
  ```js
  vm.items.splice(newLength)
  ```

  ![vue.png](vue.png)

  当 Object.defineProperty 遍历属性时，数据规模大，则占用内存多，而且无法监听 es6 的 Set、WeakSet、Map、WeakMap、Class、属性的新加或者删除、数组元素的增加和删除，因此使用 proxy 代替，但因 proxy 不兼容 IE，因此 IE 中会依然使用 defineProperty。

  Proxy只会代理对象的第一层，判断当前Reflect.get的返回值是否为Object，如果是则再通过reactive方法做代理，这样就实现了深度观测。监测数组的时候可能触发多次get/set，可以判断key是否为当前被代理对象target自身属性，也可以判断旧值与新值是否相等，只有满足以上两个条件之一时，才有可能执行trigger

  ```js
  const observable = (obj) => {
    return new Proxy(obj, {
      get(target, property, receiver) {
        return Reflect.get(target, property, receiver);
      },
      set(target, property, value, receiver) {
        return Reflect.set(target, property, value, receiver);
      },
    });
  };
  ```

## 动态组件与异步组件

* 为什么要按需加载

  打包大型应用，js 大，影响加载，所以需要把不同路由对应的组件分割成不同的代码块，加载才高效。

* 原理

  懒加载也可理解为按需加载，即路由去到未访问过的页面才通过 jsonp 异步加载相应 js，通常首页无需配置懒加载，因为一进来就需要加载。

  懒加载原理是把配置中，不同 chunkname 的模块分开打包为各个 js，没配置 chunkname 的会以数字命名。

  router 中，普通 import 组件，相当于编译执行加载组件，而通过匿名函数 import 的方式是进入相应路由后才编译执行加载组件。相当于 promise 在何处写 then 的问题。

  import 和 require 的区别：

  * require 是 AMD 规范引入方式，require 是运行时调用，所以 require 理论上可以运用在代码的任何地方
  * import 是 es6 的一个语法标准，如果要兼容浏览器的话必须转化成 es5 的语法，import 是编译时调用，所以必须放在文件开头

* 方法

  1. es 提案的 import() (推荐)

  * Webpack 自动代码分割的异步组件 (需要 webpack>2)

    ```js
    const router = new VueRouter({
      routes: [
        {
          path: "/",
          name: "home",
          component: () => import("./Home.vue"),
        },
      ],
    });
    ```

  * 把组件按组分块

    把某个路由下的所有组件都打包在同个异步块 (chunk) 中,用注释语法来提供 chunk name(Webpack > 2.4)

    ```js
    const router = new VueRouter({
      routes: [
        {
          path: "/",
          name: "home",
          component: () =>
            import(/* webpackChunkName: "login" */ "./forgetAccount.vue"),
        },
        {
          path: "/",
          name: "home",
          component: () =>
            import(/* webpackChunkName: "login" */ "./forgetPassword.vue"),
        },
        {
          path: "/",
          name: "home",
          component: () =>
            import(/* webpackChunkName: "login" */ "./resetPassword.vue"),
        },
      ],
    });
    ```

  2. webpack 提供的 require.ensure()

  ```js
  const router = new VueRouter({
    routes: [
      {
        path: "/",
        name: "home",
        component: (resolve) =>
          require.ensure(
            [],
            () => resolve(require("../components/Home")),
            "demo"
          ),
      },
    ],
  });
  ```

  3. 异步组件

  ```js
  const router = new VueRouter({
    routes: [
      {
        path: "/",
        name: "home",
        component: (resolve) => require(["../components/Home"], resolve),
      },
    ],
  });
  ```

* 动态组件

  * 使用场景

    点击标签动态切换组件

  * 使用

    每次切换都会动态创建新组件

    ```html
    <component v-bind:is="currentTabComponent"></component>
    ```

  * 缓存

    如果希望组件第一次被创建的时候缓存下来，可以在外面包一层 keep-alive

## 开启gzip模式

vue.config.js 配置，与 outputDir 同级

```js
configeWebpack: (config) => {
  if (process.env.NODE_ENV === "production") {
    return {
      plugins: [
        new CompressionPligin({
          test: /\.js$|\.html$|\.css/,
          threshold: 10240, //超过10k压缩
          deleteOriginalAssets: false, //是否删除原文件
        }),
      ],
    };
  }
};
```

生成.js.gz 文件，一般浏览器会支持，根据 Request Headers 的 Accept-Encoding 标签进行鉴别

## 注意或优化的地方

* 注意

  * v-if 适用于数据不大可能变化的场景，因为有装载和卸载过程，更消耗性能，v-show 只是 css 切换
  * style 写上 scope，避免不同组件命名冲突

* 优化

  * 使用 v-for 时，加唯一标识符:key，加快 diff 速度
  * 列表绑定多个事件，改为事件代理
  * 开启 gzip 压缩响应信息
  * 路由懒加载(异步组件)
  * 页面图片多时，使用 v-lazy(src 替换为 v-lazy)或 v-lazy-container
  * 长期不变的列表页使用 keep-alive
  * 对于不需要改变的数据，使用 Object.freeze，这样对象就不会被劫持
  * 可视区域动态加载 https://tangbc.github.io/vue-virtual-scroll-list
  * 按需加载 bable-plugin-component

* 体验

  * app-skeleton 骨架屏

      [网页骨架屏自动生成方案（dps）](https://mp.weixin.qq.com/s/tcItM2EvY2zPXk_NQCV-4g)

      vue-skeleton-webpack-plugin

      page-skeleton-webpack-plugin

      draw-page-structure

      https://github.com/famanoder/dps

  * app-shell
  * pwa serviceworker

* SEO

  * 预渲染插件 prerender-spa-plugin
  * ssr 服务端渲染

* webpack(vue.config.js)

  * 常规配置
  ```js
  //npm install compression-webpack-plugin --save-dev
  const CompressionWebpackPlugin = require('compression-webpack-plugin')
  const path = require('path')
  const webpack = require('webpack')
  const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
  const TerserPlugin = require('terser-webpack-plugin')
  //定义gzip压缩插件
  const compress = new CompressionWebpackPlugin({
    filename: (info) => {
      return `${info.path}.gz${info.query}`;
    },
    algorithm: "gzip",
    threshold: 10240,
    test: new RegExp("\\.(" + ["js"].join("|") + ")$"),
    minRatio: 0.8,
    deleteOriginalAssets: false,
  });

  module.exports = {
    //如果有报错，可查看是否需要在main.js中import
    publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
    //放置生成的静态资源 (js、css、img、fonts) 的目录
    assetsDir: "static",
    //关闭生产环境的 source map 以加速生产环境构建
    productionSourceMap: false,
    // 默认在生成的静态资源文件名中包含hash以控制缓存
    filenameHashing: true,
    // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    parallel: require("os").cpus().length > 1,
    // PWA 插件相关配置 see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    //dll: false,
    chainWebpack: (config) => {
      //最小化代码,相当于webpack的optimization配置minimize: true，即向config.optimization.minimize传参，下方配置同理
      config.optimization.minimize(true);
      //生产环境中删除console.log
      config.optimization.minimizer(
          [
              new TerserPlugin({
                  terserOptions: {
                      warnings: false,
                      compress: {
                          drop_console: true, 
                          drop_debugger: false,
                          pure_funcs: ['console.log'] 
                      }
                  }
              })
          ]
      );
      //分割代码
      config.optimization.splitChunks({
        chunks: "all",
      });
      //压缩图片,npm install image-webpack-loader --save
      config.module
        .rule("images")
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .options({
          bypassOnDebug: true,
        })
        .end();
    },
    configureWebpack: {
      plugins: [
        // new webpack.DllReferencePlugin({
        //   context: process.cwd(),
        //   manifest: require('./public/vendor/vendor-manifest.json')
        // }),
        // // 将 dll 注入到 生成的 html 模板中
        // new AddAssetHtmlPlugin({
        //     // dll文件位置
        //     filepath: path.resolve(__dirname, './public/vendor/*.js'),
        //     // dll 引用路径
        //     publicPath: './vendor',
        //     // dll最终输出的目录
        //     outputPath: './vendor'
        // }),
        compress
      ],
    },
    devServer: {
      //在本地服务器开启gzip，线上服务器都支持gzip不需要设置
      before(app) {
        app.get(/.*.(js)$/, (req, res, next) => {
          req.url = req.url + ".gz";
          res.set("Content-Encoding", "gzip");
          next();
        });
      },
    },
  };
  ```

  * 注意：
    * 自定义配置postcss-autoprefixer，可能会使IE白屏，提示Math.sign不存在
    * 自定义配置dllPlugin，可能会使IE路由无法跳转，提示symbol没定义
    * 自定义配置babel-polifill，可能会在打包时提示android没定义

  * dllPlugin(提前打包库文件)

  webpack.dll.config.js
  ```js
  const path = require('path')
  const webpack = require('webpack')
  const {CleanWebpackPlugin} = require('clean-webpack-plugin')

  // dll文件存放的目录
  const dllPath = 'public/vendor'

  module.exports = {
    entry: {
      // 需要提取的库文件
      vendor: ['vue', 'vue-router', 'vuex', 'axios']
    },
    output: {
      path: path.join(__dirname, dllPath),
      filename: '[name].dll.js',
      // vendor.dll.js中暴露出的全局变量名
      // 保持与 webpack.DllPlugin 中名称一致
      library: '[name]_[hash]'
    },
    plugins: [
      // 清除之前的dll文件
      new CleanWebpackPlugin({
        root: path.join(__dirname, dllPath)
      }),
      // 设置环境变量
      //new webpack.DefinePlugin({
      //  'process.env': {
      //    NODE_ENV: 'production'
      //  }
      //}),
      // manifest.json 描述动态链接库包含了哪些内容
      new webpack.DllPlugin({
        path: path.join(__dirname, dllPath, '[name]-manifest.json'),
        // 保持与 output.library 中名称一致
        name: '[name]_[hash]',
        context: process.cwd()
      })
    ]
  }
  ```

  package.json
  ```js
  //script中添加后运行npm run dll,在public中生成上面的manifest文件
  "dll": "webpack --config webpack.dll.config.js"//webpack可能会提示添加参数mode,加上--mode production或--mode development即可
  ```

  vue.config.js
  ```js
  const path = require('path')
  const webpack = require('webpack')
  const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

  module.exports = {
      ...
      configureWebpack: {
          plugins: [
            new webpack.DllReferencePlugin({
              context: process.cwd(),
              manifest: require('./public/vendor/vendor-manifest.json')
            }),
            // 将 dll 注入到 生成的 html 模板中
            new AddAssetHtmlPlugin({
              // dll文件位置
              filepath: path.resolve(__dirname, './public/vendor/*.js'),
              // dll 引用路径
              publicPath: './vendor',
              // dll最终输出的目录
              outputPath: './vendor'
            })
          ]
      }
  }
  ```

  * postcss(新版本集成到 package.json)

    ```js
    module.exports = () => ({
      plugins: [
        require("autoprefixer")({
          browsers: ["last 100 versions"], //必须设置支持的浏览器才会自动添加添加浏览器兼容
        }),
        require("postcss-pxtorem")({
          rootValue: 37.5,
          propList: ["*"],
        }),
      ],
    });
    ```

  * babel

    ```js
    module.exports = {
      presets: [
        //'@vue/app',
        [
          "@vue/app",
          {
            polyfills: [
              //npm install后，main中需import '@babel/polyfill'
              "es6.promise",
              "es6.symbol",
            ],
          },
        ],
      ],
      //针对element-ui
      plugins: [
        [
          "component",
          {
            libraryName: "element-ui",
            styleLibraryName: "theme-chalk",
          },
        ],
      ],
    };

    //babel-plugin-component按需引入element组件
    //main.js=
    import { Button, Select } from "element-ui";
    Vue.use(Button);
    Vue.use(Select);
    ```

  * typescript

    * 参考

      https://segmentfault.com/a/1190000011744210?utm_source=tuicool&utm_medium=referral

    * vue-cli 选择 typescript 后可配置 tsconfig.json

      ```json
      {
        // 编译选项
        "compilerOptions": {
          // 输出目录
          "outDir": "./output",
          // 是否包含可以用于 debug 的 sourceMap
          "sourceMap": true,
          // 以严格模式解析
          "strict": true,
          // 采用的模块系统
          "module": "esnext",
          // 如何处理模块
          "moduleResolution": "node",
          // 编译输出目标 ES 版本
          "target": "es5",
          // 允许从没有设置默认导出的模块中默认导入
          "allowSyntheticDefaultImports": true,
          // 将每个文件作为单独的模块
          "isolatedModules": false,
          // 启用装饰器
          "experimentalDecorators": true,
          // 启用设计类型元数据（用于反射）
          "emitDecoratorMetadata": true,
          // 在表达式和声明上有隐含的any类型时报错
          "noImplicitAny": false,
          // 不是函数的所有返回路径都有返回值时报错。
          "noImplicitReturns": true,
          // 从 tslib 导入外部帮助库: 比如__extends，__rest等
          "importHelpers": true,
          // 编译过程中打印文件名
          "listFiles": true,
          // 移除注释
          "removeComments": true,
          "suppressImplicitAnyIndexErrors": true,
          // 允许编译javascript文件
          "allowJs": true,
          // 解析非相对模块名的基准目录
          "baseUrl": "./",
          // 指定特殊模块的路径
          "paths": {
            "jquery": ["node_modules/jquery/dist/jquery"]
          },
          // 编译过程中需要引入的库文件的列表
          "lib": ["dom", "es2015", "es2015.promise"]
        }
      }
      ```

    * 引入 ts 规范，tslint.json 文件

      ```json
      {
        "extends": "tslint-config-standard",
        "globals": {
          "require": true
        }
      }
      ```

    * 引入 typescript 前后对比

      前

      ```js
      export default {
        data() {
          return {
            msg: 123,
          };
        },

        // 声明周期钩子
        mounted() {
          this.greet();
        },

        // 计算属性
        computed: {
          computedMsg() {
            return "computed " + this.msg;
          },
        },

        // 方法
        methods: {
          greet() {
            alert("greeting: " + this.msg);
          },
        },

        props: {
          checked: Boolean,
          propA: Number,
          propB: {
            type: String,
            default: "default value",
          },
          propC: [String, Boolean],
          propD: { type: null },
        },

        watch: {
          child: {
            handler: "onChildChanged",
            immediate: false,
            deep: false,
          },
        },
      };
      ```

      后

      ```html
      <template>
        <div>
          <input v-model="msg" />
          <p>msg: {{ msg }}</p>
          <p>computed msg: {{ computedMsg }}</p>
          <button @click="greet">Greet</button>
        </div>
      </template>

      <script lang="ts">
        import Vue from "vue";
        import Component from "vue-class-component";

        @Component
        export default class App extends Vue {
          // 初始化数据
          msg = 123;

          // 声明周期钩子
          mounted() {
            this.greet();
          }

          // 计算属性
          get computedMsg() {
            return "computed " + this.msg;
          }

          // 方法
          greet() {
            alert("greeting: " + this.msg);
          }

          @Prop()
          propA: number = 1;

          @Prop({ default: "default value" })
          propB: string;

          @Prop([String, Boolean])
          propC: string | boolean;

          @Prop({ type: null })
          propD: any;

          @Watch("child")
          onChildChanged(val: string, oldVal: string) {}
        }
      </script>
      ```

      app.vue

      ```html
      <template>
        <div id="app">
          <img src="./assets/logo.png" />
          <router-view />
        </div>
      </template>

      <script lang="ts">
        import Vue from "vue";
        import Component from "vue-class-component";

        @Component({})
        export default class App extends Vue {}
      </script>

      <style>
        #app {
          font-family: "Avenir", Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-align: center;
          color: #2c3e50;
          margin-top: 60px;
        }
      </style>
      ```

  * 优秀实例参考

    https://blog.csdn.net/tzllxya/article/details/93507394

    https://www.cnblogs.com/lifefriend/p/10479341.html

## vue3.0 新特性

1. Object.defineProperty 改为 Proxy


    proxy代理对象而非对象属性，颗粒度大，开销小

2. vdom 优化


    性能由与模版整体大小相关提升为与动态内容的数量相关(动态节点更新)

3. 支持 typescript

4. composition API

    * mixin

      mixin可提取公共属性，并混入到组件。
      ```js
      // MyMixin.js
      export default {
        data: () => ({
          mySharedDataProperty: null
        }),
        methods: {
          mySharedMethod () { ... }
        }
      }
      // ConsumingComponent.js
      import MyMixin from "./MyMixin.js";

      export default {
        mixins: [MyMixin],
        data: () => ({
          myLocalDataProperty: null
        }),
        methods: {
          myLocalMethod () { ... }
        }
      }
      ```
      这样可能会遇到同名属性冲突和mixin重构报错问题

    * composition API

      定义全新的 setup 函数返回的JavaScript变量，而不是将组件的功能（例如state、method、computed等）定义为对象属性。
      ```js
      //Counter.vue旧写法
      export default {
        data: () => ({
          count: 0
        }),
        methods: {
          increment() {
            this.count++;
          }
        },
        computed: {
          double () {
            return this.count * 2;
          }
        }
      }
      // Counter.vue新写法
      import { ref, computed } from "vue";

      export default {
        setup() {
          const count = ref(0);//定义一个响应式变量，其作用与 data 变量几乎相同。计算属性的情况与此相同
          const double = computed(() => count * 2)
          function increment() {
            count.value++;//更改子属性 count 的 value 才能更改响应式变量。这是因为使用 ref 创建的响应式变量必须是对象，以便在传递时保持其响应式
          }
          return {
            count,
            double,
            increment
          }
        }
      }
      ```
      解决mixin的问题
      ```js
      import useCounter from "./useCounter.js";
      export default {
        setup () {
          //要在组件中使用该函数，只需将模块导入组件文件并调用函数。这返回定义的变量，变量可从 setup 函数中返回。
          const { someVar1, someMethod1 } = useCompFunction1();
          //代码重用,参数显式传递解决命名冲突和隐式依赖
          const { someVar2, someMethod2 } = useCompFunction2();
          return {
            someVar1,
            someMethod1,
            someVar2,
            someMethod2
          }
        }
      }
      ```
      代码完整对比
      ```html
      //vue2
      <template>
        <div class='form-element'>
          <h2> {{ title }} </h2>
          <input type='text' v-model='username' placeholder='Username' />
          
          <input type='password' v-model='password' placeholder='Password' />

          <button @click='login'>
            Submit
          </button>
          <p> 
            Values: {{ username + ' ' + password }}
          </p>
        </div>
      </template>
      <script>
      export default {
        props: {
          title: String
        },
        data () {
          return {
            username: '',
            password: ''
          }
        },
        mounted () {
          console.log('title: ' + this.title)
        },
        computed: {
          lowerCaseUsername () {
            return this.username.toLowerCase()
          }
        },
        methods: {
          login () {
            this.$emit('login', {
              username: this.username,
              password: this.password
            })
          }
        }
      }
      </script>
      ```
      ```html
      //vue3
      <template>
        <div class='form-element'>
          <h2> {{ state.title }} </h2>
          <input type='text' v-model='state.username' placeholder='Username' />
          
          <input type='password' v-model='state.password' placeholder='Password' />

          <button @click='login'>
            Submit
          </button>
          <p> 
            Values: {{ state.username + ' ' + state.password }}
          </p>
        </div>
      </template>
      <script>
      import { reactive, onMounted, computed } from 'vue'

      export default {
        props: {
          title: String
        },
        setup (props, { emit }) {
          const state = reactive({
            username: '',
            password: '',
            lowerCaseUsername: computed(() => state.username.toLowerCase())
          })

          onMounted(() => {
            console.log('title: ' + props.title)
          })

          const login = () => {
            emit('login', {
              username: state.username,
              password: state.password
            })
          }

          return {
            login,
            state
          }
        }
      }
      </script>
      ```


5. vue3新写法

  参考：
  
  [vue3 从入门到实战（上）](https://juejin.im/post/6869686131756269576#heading-0)

  [使用Vue3.0，我收获了哪些知识点（二）](https://juejin.im/post/6872113750636232712#heading-0)

  [让你30分钟快速掌握vue 3](https://juejin.im/post/6887359442354962445)

  [快速使用Vue3最新的15个常用API](https://juejin.cn/post/6897030228867022856)

  [万字长文带你全面掌握Vue3](https://juejin.cn/post/6903119693742080007)

  * 生命周期及nextTick

    ```js
    import { onMounted, onBeforeMount, nextTick} from 'vue'
    export default {
        name: 'App',
        setup() {
            nextTick(() => {
                console.log('nextTick');
            })
            onMounted(() => {
                console.log('mounted');
            })

            onBeforeMount(() => {
                console.log('beforeMounted');
            })
            console.log('hello vite Vue3')
        }
    }
    ```

  * 响应式系统和methods

    ```html
    <template>
      <div>
        <h3>vue3响应式系统和methods</h3>
        <div>年龄:{{ myAge }}</div>
        <div>明年的年龄:{{ mylastAge }}</div>
        <button @click="AgeAdd">年龄+1</button>
        <div>姓名:{{ myName }}</div>
        <div>
          爱好:
          <div v-for="(hoppy, index) in hoppys" :key="index">{{ hoppy }}</div>
        </div>
        <div>来自 {{ state1.from }}</div>
      </div>
    </template>

    <script lang="ts">
    import HelloWorld from './components/HelloWorld.vue'
    import {
      ref,
      toRefs,
      reactive,
      watchEffect,
      watch,
      computed,
      onMounted
    } from 'vue'
    export default {
      name: 'App',
      setup () {
        let myAge = ref(23) //响应式数据
        let myName = '黄力豪' //非响应式数据
        const state = reactive({
          //复杂数据响应式  类似data 基于proxy 操作数组也会触发响应式
          hoppys: ['中国象棋', 'javaScript']
        })
        const state1 = reactive({
          // 可以定义多个数据源
          from: '江西抚州'
        })
        watchEffect(() => {
          // watch 副作用函数 首次加载会触发,当值发生变化也会触发
          console.log('年龄:' + myAge.value)
          console.log('爱好:' + state.hoppys)
        })
        let mylastAge = computed(() => {
          return myAge.value + 1
        })
        setTimeout(() => {
          state.hoppys[1] = 'typeScript'
          myAge.value += 1
          myName = '力豪'
        }, 1000)
        watch([state.hoppys, myAge], newVal => {
          //可以监听多个值
          console.log('watch:' + newVal)
        })
        const methods = {
          AgeAdd () {
            myAge.value += 1
          }
        }
        return {
          myName,
          myAge,
          ...toRefs(state), //将reactive转化为ref
          state1,
          mylastAge,
          ...methods
        }
      }
    }
    </script>
    ```

  * props和ref绑定dom

    ```html
    <template>
      <div>
        <h3 ref="H3">ref,props 和一些小功能</h3>
      </div>
    </template>

    <script>
    import { ref, onMounted } from 'vue'

    export default {
      setup () {
        let H3 = ref(null)
        onMounted(() => {
          H3.value.style.color = 'red'
        })

        //还有一些小功能
        //  readonly 数据只读
        //  shallow -( reactive,ref,readonly) 只代理一层
        //  toRaw 将reactive或者readonly 的值还原
        //markRow 永远不会被代理
        //isRef isReactive 等
        //unref 如果参数是ref返回他的value否则返回参数
        return { H3 }
      }
    }
    </script>
    ```

  * 组件

    ```html
    <template>
      <div>
        <h3>组件</h3>
        
      <Hello name="黄力豪" @updateName="updateName"></Hello>
      <Age :age="33"></Age>
      <myInput> 
        <template v-slot:desc>
          <div>
            这是输入框
          </div>
        </template>
      </myInput>
      </div>
    </template>

    <script lang="ts">
    import Hello from './TSX/Hello'
    import Age from './components/Age.vue'

    export default {
      components:{
          Hello,Age
      },
      setup(){
        const updateName =()=>{
          console.log(1);
        }
        return {updateName}
      }
    }
    </script>
    ```
    age
    ```html
    <template>
      <div>
        <div>{{ props.age }}</div>
      </div>
    </template>

    <script lang="ts">
    import { reactive, isReadonly, toRaw, inject, ref, readonly } from 'vue'
    interface Props {
      age: number
    }
    import vuex from '../shared/vuex'
    export default {
      props: {
        age: {
          type: Number,
          default: 0
        }
      },
      setup (props: Props) {
        //   props 是readonly
        //不要尝试去解构props，因为这样会让props失去响应式
        // props.age = 23
        // console.log(isReadonly(props))
        props = reactive(toRaw(props)) 
        return {
          props
        }
      }
    }
    </script>
    ```
    hello
    ```js
    export default {
      setup (
        props: object,
        { attrs, emit }: { attrs: { name: string }; emit: Function }
      ) {
        return { attrs, emit }
      },
      render (props: { attrs: { name: string }; emit: Function }) {
        return (
          <div
            onClick={() => {
              props.emit('updateName')
            }}
          >
            hello {props.attrs.name}
          </div>
        )
      }
    }
    ```
    全局组件
    ```js
    import {
      reactive,
      vShow,
      vModelText,
      withDirectives,
      App,
      isReadonly
    } from 'vue'
    interface Props {
      number: number
      $slots: {
        desc: () => any[]
      }
      desc: () => {}
      input: any
      isShow: boolean
    }
    import { toRefs } from 'vue'
    const install = (app: App) => {
      app.component('myInput', {
        props: {
          number: {
            type: String
          }
        },
        setup (props: Props, { slots }) {
          const state = reactive({ input: 0, isShow: false })
          return { ...toRefs(slots), ...toRefs(state) }
        },
        data () {
          return {
            number: 0
          }
        },
        render (props: Props) {
          console.log(isReadonly(props))
          return (
            <div>
              <div v-show={props.isShow}>你看不见我</div>
              {props.desc()}
              {props.$slots.desc()[0]}
              {/* {withDirectives(<input type='text' />, [[vModelText, this.number]])} */}
              <div>{this.number}</div>
              {withDirectives(<h1>Count: 2</h1>, [[vShow, true]])}
            </div>
          )
        }
      })
    }

    export default {
      install
    }
    ```

  * 指令与css属性响应式

    ```html
    <template>
      <div>
        css 属性响应式与指令
    <h1 v-highlight="红色">这是一串被高亮为红色的字</h1>
      </div>
    </template>

    <script>
    export default {
        setup(){
          return {
              "红色": 'red',
              "字体大小": '40px',
          }  
        }
    }
    </script>

    <style vars='{红色, 字体大小}'>
      div{
          color: var(--红色);
          font-size: var(--字体大小);
      }
    </style>
    ```
    指令
    ```js
    const app = createApp(Demo)
    app.directive('highlight', {
        beforeMount(el, binding, vnode) {
            el.style.color = binding.value;
        },
        pdated(){},
        mounted(){},
        created(){}    
    });
    ```

  * 全局通信

    provide和inject
    ```html
    <template> 
      <div>
      <h3>全局通信</h3>
        {{myName}}
        <Age></Age>
        爱好：{{hoppy}}
      </div>
    </template>

    <script lang="ts">
    import {toRefs, provide,ref, inject} from 'vue'
    import vuex from './shared/vuex'
    import Age from './components/Age.vue'

    export default {
    components:{
      Age
    },
    setup(){
        const {myStore, updateName, updatedAge } = vuex
        updateName('力豪')
        updatedAge(18)
        provide('hoppy',ref('javascript'))
        let hoppy = ref(inject('hoppy') as string)
        return {...toRefs(myStore),hoppy}
    }
    }
    </script>
    ```

    vuex

    store/index.js
    ```js
    import { createStore } from 'vuex'

    export default createStore({
      state: {},
      mutations: {},
      actions: {}
    })
    ```

    main.js
    ```js
    createApp(App).use(store)
    ```

    使用
    ```js
    import router from '@/router'
    import store from '@/store'
    router.beforeEach(async (to, from, next) => {
      if (
        to.path !== '/login' &&
        store.getters['permission/getRoleMenus'].length === 0
      ) {
        await store.dispatch('permission/loadRoleMenus')
        next()
      } else {
        next()
      }
    })
    ```


  * 路由

    router.js
    ```js
    import { createRouter, createWebHashHistory } from 'vue-router'
    const router = createRouter({
      // vue-router有hash和history两种路由模式，可以通过createWebHashHistory和createWebHistory来指定
      history: createWebHashHistory(),
      routes
    })

    router.beforeEach(() => {
      
    })

    router.afterEach(() => {
      
    })
    export default router
    ```

    main.js
    ```js
    createApp(App).use(router)
    ```

    使用1
    ```js
    import { useRoute, useRouter() } from 'vue-router'

    export default {
      setup() {
        // 获取当前路由
        const route = useRoute()
        // 获取路由实例
        const router = useRouter()
        // 当当前路由发生变化时，调用回调函数
        watch(() => route, () => {
          // 回调函数
        }, {
          immediate: true,
          deep: true
        })
        
        // 路由跳转
        function getHome() {
          router.push({
            path: '/home'
          })
        }
        
        return {
          getHome()
        }
      }
    }
    ```

    使用2
    ```js
    import { onBeforeRouteUpdate, useRoute } from 'vue-router'
    export default {
      setup() {
        onBeforeRouteUpdate(() => {
          // 当当前路由发生变化时，调用回调函数
        })
      }
    }
    ```

  * 浅响应(只对对象第一层做响应式，用于性能优化)

    shallowRef，triggerRef，shallowReactive
    ```html
    <template>
      <p>{{ state.a }}</p>
      <p>{{ state.first.b }}</p>
      <p>{{ state.first.second.c }}</p>
      <button @click="change">改变</button>
    </template>

    <script>
    import {shallowRef, triggerRef} from 'vue'
    export default {
        setup() {
            const obj = {
                a: 1,
                first: {
                    b: 2,
                    second: {
                        c: 3
                    }
                }
            }

            const state = shallowRef(obj)
            console.log(state);

            function change() {
                state.value.first.b = 8
                state.value.first.second.c = 9
                // 修改值后立即驱动视图更新
                triggerRef(state)
                console.log(state);
            }

            return {state, change}
        }
    }
    </script>
    <script>
    import {shallowReactive} from 'vue'
    export default {
        setup() {
            const obj = {
                a: 1,
                first: {
                    b: 2,
                    second: {
                        c: 3
                    }
                }
            }

            const state = shallowReactive(obj)

            console.log(state)
            console.log(state.first)
            console.log(state.first.second)
        }
    }
    </script>
    ```

  * 响应式和原始数据(不响应)互转

    toRaw，toRef，markRaw
    ```html
    <script>
    import {reactive, toRaw} from 'vue'
    export default {
        setup() {
            const obj = {
                name: '前端印象',
                age: 22
            }

            const state = reactive(obj)	
            const raw = toRaw(state)//转非响应数据

            console.log(obj === raw)   // true
        }
    }
    </script>
    <script>
    // 1. 导入 toRef
    import {toRef} from 'vue'
    export default {
        setup() {
            const obj = {count: 3}
            // 2. 将 obj 对象中属性count的值转化为响应式数据
            const state = toRef(obj, 'count')

            // 3. 将toRef包装过的数据对象返回供template使用
            return {state}
        }
    }
    </script>
    <template>
      <p>{{ state.name }}</p>
      <p>{{ state.age }}</p>
      <button @click="change">改变</button>
    </template>

    <script>
    import {reactive, markRaw} from 'vue'
    export default {
        setup() {
            const obj = {
                name: '前端印象',
                age: 22
            }
            // 通过markRaw标记原始数据obj, 使其数据更新不再被追踪
            const raw = markRaw(obj)
            // 试图用reactive包装raw, 使其变成响应式数据
            const state = reactive(raw)	

            function change() {
                state.age = 90
                console.log(state);
            }

            return {state, change}
        }
    }
    </script>
    ```

  * provide/inject

    ```html
    // A.vue
    <script>
    import {provide} from 'vue'
    export default {
        setup() {
            const obj= {
                name: '前端印象',
                age: 22
            }

            // 向子组件以及子孙组件传递名为info的数据
            provide('info', obj)
        }
    }
    </script>

    // B.vue
    <script>
    import {inject} from 'vue'
    export default {
        setup() {	
            // 接收A.vue传递过来的数据
            inject('info')  // {name: '前端印象', age: 22}
        }
    }
    </script>

    // C.vue
    <script>
    import {inject} from 'vue'
    export default {
        setup() {	
            // 接收A.vue传递过来的数据
            inject('info')  // {name: '前端印象', age: 22}
        }
    }
    </script>
    ```

  * 获取当前组件实例

    vue2使用this，vue3使用getCurrentInstance()
    ```html
    <template>
      <p>{{ num }}</p>
    </template>
    <script>
    import {ref, getCurrentInstance} from 'vue'
    export default {
        setup() {	
            const num = ref(3)
            const instance = getCurrentInstance()
            console.log(instance)

            return {num}
        }
    }
    </script>
    ```

  * vuex

    useStore
    ```js
    // store 文件夹下的 index.js
    import Vuex from 'vuex'

    const store = Vuex.createStore({
        state: {
            name: '前端印象',
            age: 22
        },
        mutations: {
            ……
        },
        ……
    })

    // example.vue
    <script>
    // 从 vuex 中导入 useStore 方法
    import {useStore} from 'vuex'
    export default {
        setup() {	
            // 获取 vuex 实例
            const store = useStore()

            console.log(store)
        }
    }
    </script>
    ```

  * $refs变更

    ```html
    <template>
      <div>
        <div ref="el">div元素</div>
      </div>
    </template>

    <script>
    import { ref, onMounted } from 'vue'
    export default {
      setup() {
          // 创建一个DOM引用，名称必须与元素的ref属性名相同
          const el = ref(null)

          // 在挂载后才能通过 el 获取到目标元素
          onMounted(() => {
            el.value.innerHTML = '内容被修改'
          })

          // 把创建的引用 return 出去
          return {el}
      }
    }
    </script>
    ```

  * 总结

    1. 数据、方法，需要return，才能给template使用
    2. 失去2个生命周期:beforecreate/created，生命周期改名:beforeDestroy->onBeforeUnmount/destroyed->onUnmounted，新增生命周期:onRenderTracked/ onRenderTriggered/onErrorCaptured
    3. ref和reactive均能使数据变为响应式，ref针对单数据，需要XX.value=XXX赋值，reactive则无限制，XX.XXX = XXXX赋值，$refs也改成ref的形式
    4. 组件可定义name/props，props和context(emit,attrs,slots,parent,root,refs)传入setup后使用，用法依旧
    5. template和style的用法依旧，但template支持多个根标签了
    6. provide/inject由对象改为函数
    7. vuex由Vue.use(Vuex)，Vuex.Store({})变为Vuex.createStore({})，由this.$store.~~~变为useStore().~~~
    8. 新增 Suspense 组件，处理动态引入的组件。defineAsyncComponent可以接受返回承诺的工厂函数

    异步组件:提供了两个template 也就是两个插槽，一个是没请求回来的时候显示什么，一个是请求成功显示什么
    ```ts
    <template>
      <Suspense>
        <template #default>
          <my-component />
        </template>
        <template #fallback>
          Loading ...
        </template>
      </Suspense>
    </template>

    <script lang='ts'>
    import { defineComponent, defineAsyncComponent } from "vue";
    const MyComponent = defineAsyncComponent(() => import('./Component'));

    export default defineComponent({
      components: {
        MyComponent
      },
      setup() {
        return {}
      }
    })
    </script>
    ```
    9. 样例
    ```html
    <template>
        <div>
            <p @click="changeMessage()">{{message}}</p>
            <p @click="methods.changeMessage2()">{{state.message}}</p>
            <p @click="changeMessage3()">{{state.lowerCaseMessage}}</p>
            <p>{{newMessage}}</p>
        </div>
    </template>

    <script>
    import { ref, reactive, onMounted, computed, watch, watchEffect, onRenderTracked, onRenderTriggered, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onErrorCaptured } from "vue";
    export default {
        name: 'test',
        props: {
            propsData: String
        },
        //props,context:emit,attrs,slots
        setup(props, context) {
            //data
            const message = ref(new Date().toString());
            const state = reactive({
                message: new Date().toString(),
                lowerCaseMessage: computed(() => state.message.toLowerCase())
            })

            //computed
            const newMessage = computed(()=>{
              return message.value + Math.random().toString();
            })

            //beforeCreate created
            setTimeout(() => {
              message.value = '1'
            }, 1000)
            
            //method
            const changeMessage = () => {
                message.value = 'hello';
            }
            const methods = {
                changeMessage2() {
                    message.value = 'hello2';
                },
                changeMessage3() {
                    message.value = 'hello3';
                }
            }

            onMounted(() => {
                console.log(props, context, context.emit, context.attrs, context.slots)
                // const timer = setInterval(()=>{
                //     message.value = Math.random().toString();
                //     state.message = Math.random().toString();
                // },1000);
            })
            onBeforeUpdate(() => {
                console.log('onBeforeUpdate')
            })
            onUpdated(() => {
                console.log('onUpdated')
            })
            onBeforeUnmount(() => {
                console.log('onBeforeUnmount')
            })
            onUnmounted(() => {
                console.log('onUnmounted')
            })
            //当一个 reactive对象属性或一个ref被追踪时触发
            onRenderTracked((e)=>{
                console.log(e)
            })
            //依赖项变更被触发时
            onRenderTriggered((e)=>{
                console.log(e);
            })
            onErrorCaptured((e)=>{
                console.log(e);
            })

            //watch
            watch([message, state.lowerCaseMessage], newVal => {
              //可以监听多个值
              console.log('watch:' + newVal)
            })
            watchEffect(() => {
              // watch 副作用函数 首次加载会触发,当值发生变化也会触发
              console.log('message.value:' + message.value)
            })
            
            return {
                message,
                state,
                newMessage,
                changeMessage,
                methods,
                ...methods
            }
        }
    }
    </script>

    <style scoped>

    </style>
    ```

## vue-loader 原理

* 概念

  基于 webpack 的 loader，解析和转换.vue 文件，提取 template,script,style，核心是提取

* 作用

  1. 允许组件各部分使用其它 loader，如 sass-loader
  2. 允许.vue 自定义块和 loader 链
  3. 把 template 和 style 作为模块依赖
  4. 为每个组件模拟 scope css
  5. 开发环境热加载

* 实现

  1. selector 拆解 template,script,style
  2. template-compiler 解析 template
  3. style-compiler 解析 style
  4. babel-loader 解析 script

## 新增属性不能响应的问题

参考链接：[Vue全家桶之Vue数组变更方法和替换数组](https://baijiahao.baidu.com/s?id=1666938938874248950&wfr=spider&for=pc)

用 vm.$set() 解决对象新增属性不能响应

实现原理:

1. 数组

* 直接使用数组的7个方法触发响应式：
  * push() 往数组最后面添加一个元素，成功返回当前数组的长度
  * pop() 删除数组的最后一个元素，成功返回删除元素的值
  * shift() 删除数组的第一个元素，成功返回删除元素的值
  * unshift() 往数组最前面添加一个元素，成功返回当前数组的长度
  * splice() 有三个参数，第一个是想要删除的元素的下标（必选），第二个是想要删除的个数（必选），第三个是删除 后想要在原位置替换的值
  * sort() sort() 使数组按照字符编码默认从小到大排序，成功返回排序后的数组
  * reverse() reverse() 将数组倒序，成功返回倒序后的数组

* 新数组替换旧数组
  * 整个数组等号赋值
  * filter/concat/slice返回新数组赋值

2. 对象

先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理

## v-show与v-if

1. 区别

* 当条件不成立时，v-if不会渲染DOM元素，v-show操作的是样式(display)，切换当前DOM的显示和隐藏。
* v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；
* v-show 则适用于需要非常频繁切换条件的场景。

2. 为什么 v-for 和 v-if 不建议用在一起

当 v-for 和 v-if 处于同一个节点时，v-for 的优先级比 v-if 更高，这意味着 v-if 将分别重复运行于每个 v-for 循环中。如果要遍历的数组很大，而真正要展示的数据很少时，这将造成很大的性能浪费。

这种场景建议使用 computed，先对数据进行过滤。

## data为什么是一个函数

一个组件被复用多次的话，也就会创建多个实例。本质上，这些实例用的都是同一个构造函数。

如果data是对象的话，对象属于引用类型，会影响到所有的实例。所以为了保证组件不同的实例之间data不冲突，data必须是一个函数。

## 子组件为什么不可以修改父组件传递的Prop

* Vue提倡单向数据流,即父级props的更新会流向子组件,但是反过来则不行。
* 这是为了防止意外的改变父组件状态，使得应用的数据流变得难以理解。
* 如果破坏了单向数据流，当应用复杂时，debug 的成本会非常高。

## v-model是如何实现双向绑定

v-model是用来在表单控件或者组件上创建双向绑定的,本质是v-bind和v-on的语法糖,在一个组件上使用v-model，默认会为组件绑定名为value的prop和名为input的事件

## 虚拟Dom以及key属性的作用

* 由于在浏览器中操作DOM是很昂贵的。频繁的操作DOM，会产生一定的性能问题。这就是虚拟Dom的产生原因。
* Virtual DOM本质就是用一个原生的JS对象去描述一个DOM节点。
* 虚拟 DOM 的实现原理:
  * 用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象
  * diff 算法 — 比较两棵虚拟 DOM 树的差异
  * patch 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树
* key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确(唯一key避免复用)、更快速(利用key生成map对象获取对应节点，比遍历快)

## mixin

* Mixin 使我们能够为 Vue 组件编写可插拔和可重用的功能。
* 多个组件之间重用一组组件选项，例如生命周期 hook、 方法等，则可以将其编写为 mixin，并在组件中引用。
* 如果你在 mixin 中定义生命周期 hook，执行时将优先于组件自已的 hook。

## Vue模版编译原理

Vue的编译过程就是将template转化为render函数的过程

1. 解析模版，生成AST语法树

使用大量的正则表达式对模板进行解析，遇到标签、文本的时候都会执行对应的钩子进行相关处理

2. 优化静态节点

有一些数据首次渲染后就不会再变化，对应的DOM也不会变化。那么优化过程就是深度遍历AST树，按照相关条件对树节点进行标记。这些被标记的节点(静态节点)我们就可以跳过对它们的比对，对运行时的模板起到很大的优化作用。

3. 编译

将优化后的AST树转换为可执行的代码

## SSR

* 核心库：vue-server-renderer
* 服务端渲染，将Vue在客户端把标签渲染成HTML的工作放在服务端完成，然后再把html直接返回给客户端。
* SSR有着更好的SEO、并且首屏加载速度更快等优点。
* 开发条件会受到限制，服务器端渲染只支持beforeCreate和created两个钩子，应用程序需要处于Node.js的运行环境。
* 服务器会有更大的负载需求。

## SPA单页面的理解

SPA(single-page application)仅在 Web 页面初始化时加载资源。一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 HTML 内容的变换，UI 与用户的交互，避免页面的重新加载。

* 优点

用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染，对服务器压力小，前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理

* 缺点

初次加载耗时多，前进后退路由管理，SEO 难度较大

## hookEvent

1. 组件内部监听生命周期

以下代码相距几百行，可读性差
```js
methods: {
  handleResize() {
    ...
  }
},
mounted() {
  window.addEventListener('resize', this.handleResize)
  ...
},
...//几百行
beforeDestroy() {
  ...
  window.removeEventListener('resize', this.handleResize)
}
```

改为用$on,$once去监听所有的生命周期钩子函数
```js
methods: {
  handleResize() {
    ...
  }
},
mounted() {
  window.addEventListener('resize', this.handleResize)
  this.$once('hook:beforeDestroy', () => {
    window.removeEventListener('resize', this.handleResize)
  })
}
```

2. 外部监听生命周期函数

第三方组件没提供相应的变化事件的解决方案
```html
<template>
  <!--通过@hook:updated监听组件的updated生命钩子函数-->
  <!--组件的所有生命周期钩子都可以通过@hook:钩子函数名 来监听触发-->
  <custom-select @hook:updated="handleResize" />
</template>
```

## loading

* 全局组件loading

```html
<template>
  <transition name="custom-loading-fade">
    <!--loading蒙版-->
    <div v-show="visible" class="custom-loading-mask">
      <!--loading中间的图标-->
      <div class="custom-loading-spinner">
        <i class="custom-spinner-icon"></i>
        <!--loading上面显示的文字-->
        <p class="custom-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data: {
    // 是否显示loading
    visible: {
      type: Boolean,
      default: false
    },
    // loading上面的显示文字
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
```
```js
// loading/index.js
import Vue from 'vue'
import LoadingComponent from './loading.vue'

// 通过Vue.extend将组件包装成一个子类
const LoadingConstructor = Vue.extend(LoadingComponent)

let loading = undefined

LoadingConstructor.prototype.close = function() {
  // 如果loading 有引用，则去掉引用
  if (loading) {
    loading = undefined
  }
  // 先将组件隐藏
  this.visible = false
  // 延迟300毫秒，等待loading关闭动画执行完之后销毁组件
  setTimeout(() => {
    // 移除挂载的dom元素
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
    // 调用组件的$destroy方法进行组件销毁
    this.$destroy()
  }, 300)
}

const Loading = (options = {}) => {
  // 如果组件已渲染，则返回即可
  if (loading) {
    return loading
  }
  // 要挂载的元素
  const parent = document.body
  // 组件属性
  const opts = {
    text: '',
    ...options
  }
  // 通过构造函数初始化组件 相当于 new Vue()
  const instance = new LoadingConstructor({
    el: document.createElement('div'),
    data: opts
  })
  // 将loading元素挂在到parent上面
  parent.appendChild(instance.$el)
  // 显示loading
  Vue.nextTick(() => {
    instance.visible = true
  })
  // 将组件实例赋值给loading
  loading = instance
  return instance
}

export default Loading
```

* 指令loading

```js
import Vue from 'vue'
import LoadingComponent from './loading'
// 使用 Vue.extend构造组件子类
const LoadingContructor = Vue.extend(LoadingComponent)

// 定义一个名为loading的指令
Vue.directive('loading', {
  /**
   * 只调用一次，在指令第一次绑定到元素时调用，可以在这里做一些初始化的设置
   * @param {*} el 指令要绑定的元素
   * @param {*} binding 指令传入的信息，包括 {name:'指令名称', value: '指令绑定的值',arg: '指令参数 v-bind:text 对应 text'}
   */
  bind(el, binding) {
    const instance = new LoadingContructor({
      el: document.createElement('div'),
      data: {}
    })
    el.appendChild(instance.$el)
    el.instance = instance
    Vue.nextTick(() => {
      el.instance.visible = binding.value
    })
  },
  /**
   * 所在组件的 VNode 更新时调用
   * @param {*} el
   * @param {*} binding
   */
  update(el, binding) {
    // 通过对比值的变化判断loading是否显示
    if (binding.oldValue !== binding.value) {
      el.instance.visible = binding.value
    }
  },
  /**
   * 只调用一次，在 指令与元素解绑时调用
   * @param {*} el
   */
  unbind(el) {
    const mask = el.instance.$el
    if (mask.parentNode) {
      mask.parentNode.removeChild(mask)
    }
    el.instance.$destroy()
    el.instance = undefined
  }
})
```

## 函数式组件

函数式组件不需要实例化，无状态，没有生命周期，所以渲染性能要好于普通组件

对于纯展示性的业务组件，如详情页面，列表界面，只需要将外部传入的数据进行展现，不需要有内部状态，不需要在生命周期钩子函数里面做处理，就可以考虑使用函数式组件

函数式组件与普通组件的区别

1. 函数式组件需要在声明组件是指定functional
2. 函数式组件不需要实例化，所以没有this,this通过render函数的第二个参数来代替
3. 函数式组件没有生命周期钩子函数，不能使用计算属性，watch等等
4. 函数式组件不能通过$emit对外暴露事件，调用事件只能通过context.listeners.click的方式调用外部传入的事件
5. 因为函数式组件是没有实例化的，所以在外部通过ref去引用组件时，实际引用的是HTMLElement
6. 函数式组件的props可以不用显示声明，所以没有在props里面声明的属性都会被自动隐式解析为prop,而普通组件所有未声明的属性都被解析到$attrs里面，并自动挂载到组件根元素上面(可以通过inheritAttrs属性禁止)

```js
export default {
  // 通过配置functional属性指定组件为函数式组件
  functional: true,
  // 组件接收的外部属性
  props: {
    avatar: {
      type: String
    }
  },
  /**
   * 渲染函数
   * @param {*} h
   * @param {*} context 函数式组件没有this, props, slots等都在context上面挂着
   */
  render(h, context) {
    const { props } = context
    if (props.avatar) {
      return <img src={props.avatar}></img>
    }
    return <img src="default-avatar.png"></img>
  }
}
```
```html
<template functional>
  <div class="book">
    {{props.book.name}} {{props.book.price}}
  </div>
</template>

<script>
Vue.component('book', {
  functional: true,
  props: {
    book: {
      type: () => ({}),
      required: true
    }
  },
  render: function (createElement, context) {
    return createElement(
      'div',
      {
        attrs: {
          class: 'book'
        }
      },
      [context.props.book]
    )
  }
})
</script>
```

vue2.5+
```html
<!--在template 上面添加 functional属性-->
<template functional>
  <img :src="props.avatar ? props.avatar : 'default-avatar.png'" />
</template>
<!--根据上一节第六条，可以省略声明props-->
```

## 过滤器

组件内
```js
<!-- 在双花括号中 -->
{{ message | capitalize }}
{{ message | filterA | filterB }}
{{ message | filterA('arg1', arg2) }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>

filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

全局
```js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```

## .sync语法糖

```html
<component :foo.sync="bar"></component>
等同于
<child :bar="foo" @update:bar="e => foo = e">
更新方式
this.$emit('update:bar',newValue);
```

## 深层选择器

有时，你需要修改第三方组件的CSS，这些都是 scoped 样式，移除 scope 或打开一个新的样式是不可能的。

深层选择器 >>> /deep/ ::v-deep 可以帮助你。

```html
<style scoped>
>>> .scoped-third-party-class {
  color: gray;
}
</style>

<style scoped>
/deep/ .scoped-third-party-class {
  color: gray;
}
</style>

<style scoped>
::v-deep .scoped-third-party-class {
  color: gray;
}
</style>
```

## 递归菜单

参考链接：

[Vue3实现递归菜单组件-腾讯高级前端25k面试题](https://juejin.im/post/6864383032233721864#heading-3)

[vue-nested-menu](https://github.com/sl1673495/vue-nested-menu)

* 效果要求：

1. 每一层的菜单元素如果有 _child 属性，这一项菜单被选中以后就要继续展示这一项的所有子菜单
2. 点击其中的任意一个层级，都需要把菜单的 完整的 id 链路 传递到最外层，给父组件请求数据用。形如：[1, 7, 8]
3. 每一层的样式还可以自己定制

* 数据样例：

```js
[
  {
    id: 1,
    father_id: 0,
    status: 1,
    name: "生命科学竞赛",
    _child: [
      {
        id: 2,
        father_id: 1,
        status: 1,
        name: "野外实习类",
        _child: [
          { id: 3, father_id: 2, status: 1, name: "植物学" },
          { id: 4, father_id: 2, status: 1, name: "动物学" },
          { id: 5, father_id: 2, status: 1, name: "微生物学" },
          { id: 6, father_id: 2, status: 1, name: "生态学" },
        ],
      },
      {
        id: 7,
        father_id: 1,
        status: 1,
        name: "科学研究类",
        _child: [
          { id: 8, father_id: 7, status: 1, name: "植物学与植物生理学" },
          { id: 9, father_id: 7, status: 1, name: "动物学与动物生理学" },
          { id: 10, father_id: 7, status: 1, name: "微生物学" },
          { id: 11, father_id: 7, status: 1, name: "生态学" },
          {
            id: 21,
            father_id: 7,
            status: 1,
            name: "农学",
            _child: [
              { id: 22, father_id: 21, status: 1, name: "植物生产类" },
              { id: 23, father_id: 21, status: 1, name: "动物生产类" },
              { id: 24, father_id: 21, status: 1, name: "动物医学类" },
            ],
          },
          {
            id: 41,
            father_id: 7,
            status: 1,
            name: "药学",
          },
          { id: 55, father_id: 7, status: 1, name: "其他" },
        ],
      },
      { id: 71, father_id: 1, status: 1, name: "添加" },
    ],
  },
  {
    id: 56,
    father_id: 0,
    status: 1,
    name: "考研相关",
    _child: [
      { id: 57, father_id: 56, status: 1, name: "政治" },
      { id: 58, father_id: 56, status: 1, name: "外国语" },
    ],
  },
  {
    id: 65,
    father_id: 0,
    status: 1,
    name: "找工作",
    _child: [
      { id: 66, father_id: 65, status: 1, name: "招聘会" },
      { id: 67, father_id: 65, status: 1, name: "简历" },
    ],
  },
  {
    id: 70,
    father_id: 0,
    status: 1,
    name: "其他",
    _child: [
      {
        id: 72,
        father_id: 70,
        status: 1,
        name: "新增的根级12311111",
      },
    ],
  },
];
```

* 组件template结构

根组件
```html
<template>
  <nest-menu :data="data" :activeIds="ids" @change="activeIdsChange" />
</template>
```
递归组件
```html
<template>
  <div class="wrap">
    <div class="menu-wrap">
      <div
        class="menu-item"
        v-for="menuItem in data"
      >{{menuItem.name}}</div>
    </div>
    <nest-menu
      :key="activeId"
      :data="subMenu"
      :depth="depth + 1"
    ></nest-menu>
  </div>
</template>
```

* 原理

* 需要记录深度，有child则传depth+1
* 先把每层菜单的选中项默认设置为第一个子菜单，由于它很可能是异步获取的，所以我们最好是 watch 这个数据来做这个操作
* compute拿到下一层的数据向下传
* 点击菜单项，emit到上一层，每一层向数组push当前选中的id
* 样式区分可把depth拼接到class即可
* 注意数据源变动引发的 bug：组件渲染完成后过了一秒，菜单的最外层只剩下一项了，这时候在一秒之内点击了最外层的第二项，这个组件在数据源改变之后，会报错undefined，因为数据源已经改变了，但是组件内部的 activeId 状态依然停留在了一个已经不存在了的 id 上，所以如果activeId不存在了，需要设置为第一项，watch设为同步事件

## vue源码简述

参考链接：

[「面试」你不知道的 React 和 Vue 的 20 个区别](https://mp.weixin.qq.com/s/vZo1XlMLxrzAyALzIPlktw)

* 挂载

  初始化$mounted会挂载组件,不存在 render 函数时需要编译(compile);

* 编译

  * parse解析

    parse 调用 parseHtml 方法，方法核心是利用正则解析 template 的指令，class 和 stype，得到 AST

  * optimize优化

    optimize 作用标记 static 静态节点，后面 patch,diff会跳过静态节点

  * generate生成

    generate 是将 AST 转化为 render 函数表达式，执行 vm._render 方法将 render 表达式转化为VNode，得到 render 和 staticRenderFns 字符串

    * AST 和 VNode 

      1. 都是 JSON 对象；
      2. AST 是HTML,JS,Java或其他语言的语法的映射对象，VNode 只是 DOM 的映射对象，AST 范围更广；
      3. AST的每层的element，包含自身节点的信息(tag,attr等)，同时parent，children分别指向其父element和子element，层层嵌套，形成一棵树
      4. vnode就是一系列关键属性如标签名、数据、子节点的集合，可以认为是简化了的dom:

    * differ 算法

      1. 自主研发了一套Virtual DOM，是借鉴开源库snabbdom，
      2. 同级比较，因为在 compile 阶段的optimize标记了static 点，可以减少 differ 次数；
      3. Vue 的这个 DOM Diff 过程就是一个查找排序的过程，遍历 Virtual DOM 的节点，在 Real DOM 中找到对应的节点，并移动到新的位置上。不过这套算法使用了双向遍历的方式，加速了遍历的速度

  * render渲染
  
    vm._render 方法调用了 VNode 创建的方法createElement

* 依赖收集与监听

  1. 调用 observer()，作用是遍历对象属性进行双向绑定
  2. 在 observer 过程中会注册Object.defineProperty的 get 方法进行依赖收集，依赖收集是将Watcher 对象的实例放入 Dep 中；
  3. Object.defineProperty的 set 会调用Dep 对象的 notify 方法通知它内部所有的 Watcher 对象调用对应的 update()进行视图更新；

  * Vue 的 this 改变

      1. vue 自身维护 一个 更新队列，当你设置 this.a = 'new value'，DOM 并不会马上更新；
      2. 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更；
      3. 如果同一个 watcher 被多次触发，只会被推入到队列中一次；
      4. 也就是下一个事件循环开始时执行更新时才会进行必要的DOM更新和去重；
      5. 所以 for 循环 10000次 this.a = i vue只会更新一次，而不会更新10000次;
      6. data 变化后如果 computed 或 watch 监听则会执行;

* diff 和 patch

  1. patch 的 differ 是将同层的树节点进行比较,通过唯一的 key 进行区分，时间复杂度只有 O(n)；
  2. 上面得到 set 被触发会调用 watcher 的 update()修改视图；
  3. update 方法里面调用 patch()得到同级的 VNode 变化;
  4. update 方法里面调用createElm通过虚拟节点创建真实的 DOM 并插入到它的父节点中；
  5. createElm实质是遍历虚拟 dom，逆向解析成真实 dom；

  * 注意：
  1. v-model 可以实现双向数据流,但只是v-bind:value 和 v-on:input的语法糖;
  2. 通过 this 改变值，会触发 Object.defineProperty的 set，将依赖放入队列，下一个事件循环开始时执行更新时才会进行必要的DOM更新，是外部监听处理更新；
  3. differcompile 阶段的optimize标记了static 点，可以减少 differ 次数，而且是采用双向遍历方法；

* 关于循环加key

  1. 将使用了双向遍历的方式查找,发现 A,B,C,D都不等,先删除再创建

  2. 双向遍历的方式查找只需要创建E，删除D，改变 B、C、A的位置

* 关于循环不用index为key

  1. 如果列表是纯静态展示，不会 CRUD，这样用 index 作为 key 没得啥问题

  2. 如果是list可能会重新渲染

    ```js
    const list = [1,2,3,4];
    // list 删除 4 不会有问题,但是如果删除了非 4 就会有问题
    // 如果删除 2
    const listN= [1,3,4]
    // 这样index对应的值就变化了,整个 list 会重新渲染
    ```

* Vuex

  1. Vuex是吸收了Redux的经验，放弃了一些特性并做了一些优化，代价就是VUEX只能和VUE配合；
  2. store:通过 new Vuex.store创建 store，辅助函数mapState；
  3. getters:获取state，有辅助函数 mapGetters；
  4. action:异步改变 state，像ajax，辅助函数mapActions；
  5. mutation:同步改变 state,辅助函数mapMutations；

  * 对比
    1. Redux：view——>actions——>reducer——>state变化——>view变化（同步异步一样）
    2. Vuex：view——>commit——>mutations——>state变化——>view变化（同步操作） 
    view——>dispatch——>actions——>mutations——>state变化——>view变化（异步操作）

* 双向绑定和 vuex 是否冲突

  1. 在严格模式中使用Vuex，当用户输入时，v-model会试图直接修改属性值，但这个修改不是在mutation中修改的，所以会抛出一个错误；

  2. 当需要在组件中使用vuex中的state时，有2种解决方案：

    ```ts
    在input中绑定value(vuex中的state)，然后监听input的change或者input事件，在事件回调中调用mutation修改state的值;  

    // 双向绑定计算属性
    <input v-model="message">

    computed: {
      message: {
        get () {
          return this.$store.state.obj.message
        },
        set (value) {
          this.$store.commit('updateMessage', value)
        }
      }
    }
    ```

* Vue 的 data 必须是函数

  对象是引用类型，内存是存贮引用地址，那么子组件中的 data 属性值会互相污染，产生副作用；

  如果是函数，函数的{}构成作用域，每个实例相互独立，不会相互影响；

* Vue 的合并策略

  1. 生命周期钩子:合并为数组
  2. watch：合并为数组，执行有先后顺序；
  3. assets（components、filters、directives）：合并为原型链式结构,合并的策略就是返回一个合并后的新对象，新对象的自有属性全部来自 childVal， 但是通过原型链委托在了 parentVal 上
  4. data为function，需要合并执行后的结果，就是执行 parentVal 和 childVal 的函数，然后再合并函数返回的对象；
  5. 自定义合并策略

## 页面加载闪烁问题

参考链接：

[vue页面加载闪烁问题的解决方法](https://www.jb51.net/article/137288.htm)

这个指令可以隐藏未编译的Mustache标签直到实例准备完毕
```css
[v-cloak]{
    display:none;
}
<div v-cloak>
    {{ message }}
</div>
```

## Vue3.0数据响应机制

参考链接：

[vue 3.0 原理源码进阶](https://www.cnblogs.com/fs0196/p/12691407.html)

1. 实现响应式数据reactive

```js
const toProxy = new WeakMap(); // 存放被代理过的对象
const toRaw = new WeakMap(); // 存放已经代理过的对象
function reactive(target) {//对应vue2的defineReactive()
  // 创建响应式对象
  return createReactiveObject(target);
}
function isObject(target) {
  return typeof target === "object" && target !== null;
}
function hasOwn(target,key){
  return target.hasOwnProperty(key);
}
function createReactiveObject(target) {
  if (!isObject(target)) {
    return target;
  }
  let observed = toProxy.get(target);
  if(observed){ // 判断是否被代理过
    return observed;
  }
  if(toRaw.has(target)){ // 判断是否要重复代理
    return target;
  }
  const handlers = {
    get(target, key, receiver) {
      // 取值
      console.log("获取");
      let res = Reflect.get(target, key, receiver);
      // track(target,'get',key); // 依赖收集
      return isObject(res) ? reactive(res) : res;
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      let hadKey = hasOwn(target,key);
      let result = Reflect.set(target, key, value, receiver);
      if(!hadKey){
        console.log('更新 添加')
        // trigger(target,'add',key); // 触发添加
      }else if(oldValue !== value){
        console.log('更新 修改')
        // trigger(target,'set',key); // 触发修改
      }
      return result;
    },
    deleteProperty(target, key) {
      console.log("删除");
      const result = Reflect.deleteProperty(target, key);
      return result;
    }
  };
  // 开始代理
  observed = new Proxy(target, handlers);
  toProxy.set(target,observed);
  toRaw.set(observed,target); // 做映射表
  return observed;
}
let p = reactive({
  a: 'hello',
  b: 1,
  c: [1,2],
  d: {
    a: 'hi'
  }
});
console.log(p.a); // 获取
p.a = 'hello2'; // 更新 修改
p.b = 2; // 更新 修改
p.c = [2,3,4]; // 更新 修改
p.d = {
  a: 'hi2',
  b: 1
}; // 更新 修改
p.e = 3; // 更新 添加
console.log(p);
delete p.a; // 删除
```

2. 实现依赖收集effect与数据更新tigger

```js
//effect(()=>{
//  ...数据操作
//})
function effect(fn) {
  const effect = createReactiveEffect(fn); // 创建响应式的effect
  effect(); // 先执行一次
  return effect;
}
const activeReactiveEffectStack = []; // 存放响应式effect，依赖收集数组，对应vue2的dep[]
function createReactiveEffect(fn) {
  const effect = function() {
    // 响应式的effect
    return run(effect, fn);
  };
  return effect;
}
function run(effect, fn) {
    try {
      activeReactiveEffectStack.push(effect);
      return fn(); // 先让fn执行,执行时会触发get方法，可以将effect存入对应的key属性
    } finally {
      activeReactiveEffectStack.pop(effect);
    }
}
function trigger(target, type, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let effects = depsMap.get(key);
  if (effects) {
    effects.forEach(effect => {
      effect();
    });
  }
  // 处理如果当前类型是增加属性，如果用到数组的length的effect应该也会被执行
  if (type === "add") {
    let effects = depsMap.get("length");
    if (effects) {
      effects.forEach(effect => {
        effect();
      });
    }
  }
}
```

3. 实现ref，把原始数据转换为响应式数据

```js
function convert(val) {
  return isObject(val) ? reactive(val) : val;
}
function ref(raw) {
  raw = convert(raw);
  const v = {
    _isRef:true, // 标识是ref类型
    get value() {
      track(v, "get", "");
      return raw;
    },
    set value(newVal) {
      raw = newVal;
      trigger(v,'set','');
    }
  };
  return v;
}
//let r = ref(1);
//let c = reactive({
//    a:r
//});
//console.log(c.a.value);每次都要多来一个.value
//在get方法中判断如果获取的是ref的值，就将此值的value直接返回即可
let res = Reflect.get(target, key, receiver);
if(res._isRef){
  return res.value
}
```

4. computed实现

```js
let a = reactive({name:'youxuan'});
let c = computed(()=>{
  console.log('执行次数')
  return a.name +'webyouxuan';
})
// 不取不执行，取n次只执行一次
console.log(c.value);
console.log(c.value);
function computed(getter){
  let dirty = true;
  const runner = effect(getter,{ // 标识这个effect是懒执行
    lazy:true, // 懒执行
    scheduler:()=>{ // 当依赖的属性变化了，调用此方法，而不是重新执行effect
      dirty = true;
    }
  });
  let value;
  return {
    _isRef:true,
    get value(){
      if(dirty){
        value = runner(); // 执行runner会继续收集依赖
        dirty = false;
      }
      return value;
    }
  }
}
function effect(fn,options) {
  let effect = createReactiveEffect(fn,options);
  if(!options.lazy){ // 如果是lazy 则不立即执行
    effect();
  }
  return effect;
}
function createReactiveEffect(fn,options) {
  const effect = function() {
    return run(effect, fn);
  };
  effect.scheduler = options.scheduler;
  return effect;
}
//在trigger时判断
deps.forEach(effect => {
  if(effect.scheduler){ // 如果有scheduler 说明不需要执行effect
    effect.scheduler(); // 将dirty设置为true,下次获取值时重新执行runner方法
  }else{
    effect(); // 否则就是effect 正常执行即可
  }
});
let a = reactive({name:'youxuan'});
let c = computed(()=>{
  console.log('执行次数')
  return a.name +'webyouxuan';
})
// 不取不执行，取n次只执行一次
console.log(c.value);
a.name = 'zf10'; // 更改值 不会触发重新计算,但是会将dirty变成true

console.log(c.value); // 重新调用计算方法
```

## Vue3任意传送门Teleport

参考链接：

[Vue 3 任意传送门——Teleport](https://www.jianshu.com/p/1ecf5006b1ae)

[vue3.0 teleport](https://zhuanlan.zhihu.com/p/143042237)

[Vue3 Teleport 组件的实践及原理](https://juejin.cn/post/6900957010808963079)

1. 功能：自定义html可移动到div app之外，此html可包含子组件，用法相当于一个封装好的组件，里面自定义插槽内容，同transition和keep-alive，是内部组件，可摇树

2. 使用场景：全局modal，toast

3. 使用样例

  index.html
  ```html
  <div id="app"></div>
  <div id="teleport-target"></div>
  <div id="modal-container"></div>
  ```

  某页面
  ```html
  <teleport to="#teleport-target">
    <div v-if="visible" class="toast-wrap">
      <div class="toast-msg">我是一个 Toast 文案</div>
    </div>
  </teleport>
  <teleport to="#modal-container">
    <!-- use the modal component, pass in the prop -->
    <modal :show="showModal" @close="showModal = false">
      <template #header>
        <h3>custom header</h3>
      </template>
    </modal>
  </teleport>
  ```
  ```js
  import { ref } from 'vue';
  import Modal from './Modal.vue';
  export default {
    components: {
      Modal
    },
    setup() {
      // toast 的封装
      const visible = ref(false);
      let timer;
      const showToast = () => {
        visible.value = true;
        clearTimeout(timer);
        timer = setTimeout(() => {
          visible.value = false;
        }, 2000);
      }
      const showModal = ref(false);
      return {
        visible,
        showToast,
        showModal
      }
    }
  }
  ```

  在本页面内查看html源码，看到teleport-target，modal-container出现指定内容，并在app之外

4. 源码

  Teleport 组件通过 createBlock 进行创建，最后得到的 vnode 中会有一个 shapeFlag 属性，该属性用来表示 vnode 的类型。

  在处理 Teleport 时，最后会调用 Teleport.process 方法，将 Teleport 的 children 挂载到属性 to 对应的 DOM 元素中。

## Vue3优化diff

参考链接：

[虚拟 DOM](https://www.jianshu.com/p/580157c93c53)

[Diff 算法](https://www.jianshu.com/p/cdb4ad82df20)

[Vue3 DOM Diff 核心算法解析](https://zhuanlan.zhihu.com/p/260434581)

[Vue3的getSequence最长上升子序列](https://blog.csdn.net/webyouxuan/article/details/108414286)

[详解vue3.0 diff算法的使用(超详细)](https://www.jb51.net/article/189862.htm)

1. 不存在diff的更新方法

  只要有改变就没有一个可以复用，全部重新创建节点

2. Vue2 diff 

  优先处理特殊场景的情况，即头头比对，头尾比对，尾头比对，尾尾对比等。通过双指针实现。

  - 产生虚拟 DOM 的原因：由原本事件驱动变为数据驱动，jquery 频繁操作 DOM 可能会造成不必要的浪费
     ```js
     $("li").on("click", function () {
       $(this).show().siblings().hide();
     });
     var li = $("li");
     //优化
     li.on("click", function () {
       li.hide();
       $(this).show();
     });
     ```
   - diff 三大策略:

     1. Tree Diff:层次遍历找出不同
     2. Component Diff:组件脏检查，看组件实例是否改变，没改变，继续步骤 1，改变，到步骤 3
     3. Element Diff:发现与真实 DOM 不同，当节点处于同一层级时，Diff 提供三种 DOM 操作：删除、移动、插入。(removeChild/removeChildren/createElement/insertBefore/setTextContent/appendChild/replaceChild(new,old))

   - diff 示例
     1. 先标记新老 DOM 元素如下
        ```txt
               oldS        oldE
        old:    a   b   c   d
        new:    a   f   d   e   c
               newS            newE
        ```
     2. 比较 oldS 和 newS 发现一样，oldS++，newS++，发现 b 和 f 不一致，在 oldS 前插入 f，oldS++，newS++
        ```txt
                       oldS    oldE
        old:    a   f   b   c   d
        new:    a   f   d   e   c
                       newS    newE
        ```
     3. 此时 oldE 和 newS 相同，oldE 移动到 oldS 前，oldS++,newS++
        ```txt
                          oldS oldE
        old:    a   f   d   b   c
        new:    a   f   d   e   c
                          newS newE
        ```
     4. newE 与 oldE 相同,oldE--,newE--,此时新老都不同，oldS 前插入 newE，删除 oldS，oldS++，newS++，newE--，oldE--
        ```txt
                          oldE oldS
        old:    a   f   d   e   c
        new:    a   f   d   e   c
                          newE newS
        ```
     5. oldS > oldE，Diff 结束

3. Vue3 diff

  头头比对，尾尾对比，中间使用最长稳定序列作为基准，原地复用，仅对需要移动或已经patch的节点进行操作，最大限度地提升替换效率，相比于Vue2版本是质的提升

  方法源码

  图解见：[详解vue3.0 diff算法的使用(超详细)](https://www.jb51.net/article/189862.htm)

  ```txt
       0 1 2 3 4 5
  old: A B C D E F
  new: A B D E C I
  头头比对，尾尾对比后
       2 3 4 5
  old: C D E F
  new: D E C I
  遍历new，看new的节点从old哪个位置移过来，如果是新增，视为从0位置移动(如I)，同时old中元素不存在于new，则移除(如F)
  得到数组[3,4,2,0],表示D从3位置移过来，E从4位置移过来，C从2位置移过来，I为0表示新增
  [3,4,2,0]的最长上升子序列(贪心+二分)为[3,4]
  因此在old中，D、E不动，移动C，移除F，新增I
  ```

  该方法返回的是数组中子序列的索引值
  ```js
  function getSequence(arr) {
    const p = arr.slice()                 //  保存原始数据
    const result = [0]                    //  存储最长增长子序列的索引数组
    let i, j, u, v, c
    const len = arr.length
    for (i = 0; i < len; i++) {
      const arrI = arr[i]
      if (arrI !== 0) {
        j = result[result.length - 1]     //  j是子序列索引最后一项
        if (arr[j] < arrI) {              //  如果arr[i] > arr[j], 当前值比最后一项还大，可以直接push到索引数组(result)中去
          p[i] = j                        //  p记录第i个位置的索引变为j
          result.push(i)
          continue
        }
        u = 0                             //  数组的第一项
        v = result.length - 1             //  数组的最后一项
        while (u < v) {                   //  如果arrI <= arr[j] 通过二分查找，将i插入到result对应位置；u和v相等时循环停止
          c = ((u + v) / 2) | 0           //  二分查找 
          if (arr[result[c]] < arrI) {
            u = c + 1                     //  移动u
          } else {
            v = c                         //  中间的位置大于等于i,v=c
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1]          //  记录修改的索引
          }
          result[u] = i                   //  更新索引数组(result)
        }
      }
    }
    u = result.length
    v = result[u - 1]
    //把u值赋给result  
    while (u-- > 0) {                     //  最后通过p数组对result数组进行进行修订，取得正确的索引
      result[u] = v
      v = p[v];
    }
    return result
  }
  ```

  LeetCode 真题 300. 最长上升子序列

  1. 动态规划,时间复杂度：O(n^2),空间复杂度：O(n)

    ```js
    let lis = (nums) => {
      let len = nums.length;
      if (len == 0) return 0;
      let dp = new Array(len).fill(1);
      let pos = [];
      let res = 0;
      //i表示最新的一位数
      for (let i = 0; i < nums.length; i++) {
        //j表示i前面的所有数
        for (let j = 0; j < i; j++) {
          //找出i前比i小的位置的最长递增子序列的最大值（找到以nums[i]结尾的最长递增子序列），虽然此处不一定是整个数组中的最大值
          if (nums[j] < nums[i]) {
            //改变运算符可变型为最长不减子序列，最长下降子序列等
            dp[i] = Math.max(dp[i], dp[j] + 1); //状态转移方程
          }
        }
        //找出整个数组中的最大值
        res = Math.max(res,dp[i]);
      }
      console.log(dp);
      //[1, 1, 2, 3, 4, 5, 2, 3, 3, 4, 6, 5, 6, 7, 8, 5, 9, 10, 3]
      //dp必然出现1~res的连续整数，从后向前找出res,res-1,res-2...所在位置代表的数即可
      return res;//10
    };

    $(() => {
      let numbers = [5, 1, 3, 6, 7, 9, 2, 4, 3, 4, 10, 5, 6, 7, 8, 5, 9, 10, 3];
      console.log(lis(numbers)); //10
    });
    ```

  2. 贪心+二分,时间复杂度：O(nlogn),空间复杂度：O(n)

    ```js
    const lengthOfLIS = function(nums) {
        let len = nums.length;
        if (len <= 1) {
            return len;
        }
        let tails = [nums[0]];
        for (let i = 0; i < len; i++) {
            // 当前遍历元素 nums[i] 大于 前一个递增子序列的 尾元素时，追加到后面即可
            if (nums[i] > tails[tails.length - 1]) {
                tails.push(nums[i]);
            } else {
                // 否则，查找递增子序列中第一个大于当前值的元素，用当前遍历元素 nums[i] 替换它
                // 递增序列，可以使用二分查找
                let left = 0;
                let right = tails.length - 1;
                while (left < right) {
                    let mid = (left + right) >> 1;
                    if (tails[mid] < nums[i]) {
                        left = mid + 1;
                    } else {
                        right = mid;
                    }
                }
                tails[left] = nums[i];
            }
        }
        return tails.length;
    };
    ```
    ```js
    let lis = (nums) => {
       let top = new Array(nums.length);
       let piles = 0; // 牌堆数初始化为 0
       for (let i = 0; i < nums.length; i++) {
         let poker = nums[i]; // 要处理的扑克牌
         //二分查找:决定新来的牌插入哪一个牌堆(插入到刚好比这牌大的牌堆中)
         //牌堆顶：1 2 3 4 5 6 7 8 -> 新牌：3
         //1 2 3 4
         //3 4
         //4
         //牌堆顶：1 2 3 3 5 6 7 8 -> 替换

         //牌堆顶：1 2 3 3 5 6 7 8 -> 新牌：9
         //5 6 7 8
         //7 8
         //8
         //牌堆顶：1 2 3 3 5 6 7 8 9 -> 新建
         let left = 0,
           right = piles;
         while (left < right) {
           let mid = parseInt((left + right) / 2);
           if (top[mid] >= poker) {
             right = mid;
           } else {
             left = mid + 1;
           }
         }
         console.log("left:" + left, "piles:" + piles);
         if (left == piles) piles++; // 没找到合适的牌堆，新建一堆
         top[left] = poker; // 把这张牌放到牌堆顶
         console.log("poker top", top);
       }
       return piles; //最后牌堆数即为最长递增子序列长度，非空元素即为LIS序列
    };
    ```

## Vue Composition API 和 React Hooks

参考链接：

[Vue Composition API 和 React Hooks 对比](https://juejin.im/post/6847902223918170126)

1. 什么是 React Hook

  它可以让你在不编写 Class 的情况下，让你在函数组件里“钩入” React state 及生命周期等特性的函数

2. 解决逻辑复用方法

  * minix 与组件之间存在隐式依赖，可能产生冲突。倾向于增加更多状态，降低了应用的可预测性
  * 高阶组件 多层包裹嵌套组件，增加了复杂度和理解成本，对于外层是黑盒
  * Render Props 使用繁琐，不好维护, 代码体积过大，同样容易嵌套过深
  * Hook 通过 function 抽离的方式，实现了复杂逻辑的内部封装：逻辑代码的复用、减小了代码体积、没有 this 的烦恼

3. 使用区别

react
```js
const [currentNote, setCurrentNote] = useState("");
useEffect(() => {
  console.log(`Current note: ${currentNote}`);
});
```

vue
```js
const currentNote = ref("");
currentNote.value = "";
const state = reactive({
  name: "Mary",
  age: 25,
});
state.name = ""
```

4. 原理

  * react

    React Hook 底层是基于链表实现，调用的条件是每次组件被 render 的时候都会顺序执行所有的 Hooks

    每一个 Hook 的 next 是指向下一个 Hook 的，if 会导致顺序不正确，从而导致报错

    React 数据更改的时候，会导致重新 render，重新 render 又会重新把 Hooks 重新注册一次

    由于 React Hooks 会多次运行，所以 render 方法必须遵守规则：不要在循环内部、条件语句中或嵌套函数里调用 Hooks

    可以将 useEffect Hook 视为 componentDidMount、componentDidUpdate 及 componentWillUnmount 的合集

  * vue

    Vue Hook 只会被注册调用一次，Vue 能避开这些麻烦的问题，原因在于它对数据的响应是基于 proxy 的，对数据直接代理观察。

    只要更改 data，相关的 function 或者 template 都会被重新计算，因此避开了 React 可能遇到的性能上的问题

  * 对比

    React Hooks 会在组件每次渲染时候运行，而 Vue setup() 只在组件创建时运行一次

    react 使用 use***声明，通常为useState，vue 使用 ref 或 reactive 声明

    React 的 useRef 和 Vue 的 ref 都允许你引用一个子组件 或 要附加到的 DOM 元素。

    React Hooks 在每次渲染时都会运行，没有等价于 Vue 中 computed 函数的方法。所以可以自由地声明一个变量，其值基于状态或属性，并将指向每次渲染后的最新值

    React 中的 useContext Hook，可以作为一种读取特定上下文当前值的新方式。Vue 中类似的 API 叫 provide/inject。

    React 所有 Hooks 代码都在组件中定义,且在同一个函数中返回要渲染的 React 元素,Vue 在 template 或 render 选项中定义模板,使用单文件组件，就要从 setup() 中返回一个包含了你想输出到模板中的所有值的对象

## vue常见问题解决方案

参考链接：

[Vue 项目一些常见问题的解决方案](https://juejin.im/post/6895497352120008717)

1. 页面权限控制

route
```js
routes: [
    {
        path: '/login',
        name: 'login',
        meta: {
            roles: ['admin', 'user']
        },
        component: () => import('../components/Login.vue')
    },
    {
        path: 'home',
        name: 'home',
        meta: {
            roles: ['admin']
        },
        component: () => import('../views/Home.vue')
    },
]

// 假设角色有两种：admin 和 user
// 这里是从后台获取的用户角色
const role = 'user'
// 在进入一个页面前会触发 router.beforeEach 事件
router.beforeEach((to, from, next) => {
    if (to.meta.roles.includes(role)) {
        next()
    } else {
        next({path: '/404'})
    }
})
```

2. 登陆验证

route
```js
router.beforeEach((to, from, next) => {
    // 如果有token 说明该用户已登陆
    if (localStorage.getItem('token')) {
        // 在已登陆的情况下访问登陆页会重定向到首页
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            next({path: to.path || '/'})
        }
    } else {
        // 没有登陆则访问任何页面都重定向到登陆页
        if (to.path === '/login') {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})
```

3. 递归菜单

[递归菜单](#递归菜单)

4. 动态菜单

```js
const asyncRoutes = {
    'home': {
        path: 'home',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    't1': {
        path: 't1',
        name: 't1',
        component: () => import('../views/T1.vue')
    },
    'password': {
        path: 'password',
        name: 'password',
        component: () => import('../views/Password.vue')
    },
    'msg': {
        path: 'msg',
        name: 'msg',
        component: () => import('../views/Msg.vue')
    },
    'userinfo': {
        path: 'userinfo',
        name: 'userinfo',
        component: () => import('../views/UserInfo.vue')
    }
}

// 传入后台数据 生成路由表
menusToRoutes(menusData)

// 将菜单信息转成对应的路由信息 动态添加
function menusToRoutes(data) {
    const result = []
    const children = []

    result.push({
        path: '/',
        component: () => import('../components/Index.vue'),
        children,
    })

    data.forEach(item => {
        generateRoutes(children, item)
    })

    children.push({
        path: 'error',
        name: 'error',
        component: () => import('../components/Error.vue')
    })

    // 最后添加404页面 否则会在登陆成功后跳到404页面
    result.push(
        {path: '*', redirect: '/error'},
    )

    return result
}

function generateRoutes(children, item) {
    if (item.name) {
        children.push(asyncRoutes[item.name])
    } else if (item.children) {
        item.children.forEach(e => {
            generateRoutes(children, e)
        })
    }
}
```

5. 前进刷新后退不刷新

app.js
```html
<keep-alive include="list">
    <router-view/>
</keep-alive>
```

可以在详情页中删除对应的列表项

* 方案1
route
```js
{
    path: '/detail',
    name: 'detail',
    component: () => import('../view/detail.vue'),
    meta: {isRefresh: true}
}
```

app.js
```js
watch: {
    $route(to, from) {
        const fname = from.name
        const tname = to.name
        if (from.meta.isRefresh || (fname != 'detail' && tname == 'list')) {
            from.meta.isRefresh = false
      // 在这里重新请求数据
        }
    }
}
```

* 方案2

```html
<keep-alive>
    <router-view :key="$route.fullPath"/>
</keep-alive>
```

```js
this.$router.push({
    path: '/list',
    query: { 'randomID': 'id' + Math.random() },
})
```

6. 多个请求下 loading 的展示与关闭

```html
<div class="app">
    <keep-alive :include="keepAliveData">
        <router-view/>
    </keep-alive>
    <div class="loading" v-show="isShowLoading">
        <spin size="large"></spin>
    </div>
</div>

<script>
export default {
  name: 'home',
  data () {
    return {
      loadingCount: 0
    }
  },
  methods: {
    addLoading() {
        this.isShowLoading = true
        this.loadingCount++
    },
    isCloseLoading() {
        this.loadingCount--
        if (this.loadingCount == 0) {
            this.isShowLoading = false
        }
    }
  }
}
</script>
```

设置 axios 拦截器
```js
// 添加请求拦截器
this.$axios.interceptors.request.use(config => {
    this.addLoading()
    return config
}, error => {
    this.isShowLoading = false
    this.loadingCount = 0
    this.$Message.error('网络异常，请稍后再试')
    return Promise.reject(error)
})

// 添加响应拦截器
this.$axios.interceptors.response.use(response => {
    this.isCloseLoading()
    return response
}, error => {
    this.isShowLoading = false
    this.loadingCount = 0
    this.$Message.error('网络异常，请稍后再试')
    return Promise.reject(error)
})
```

7. 表格打印

[print.js](https://github.com/crabbly/print.js)

```js
printJS({
    printable: id, // DOM id
    type: 'html',
    scanStyles: false,
})
```

解决打印的时候表体和表头错位问题
```js
function printHTML(id) {
    const html = document.querySelector('#' + id).innerHTML
    // 新建一个 DOM
    const div = document.createElement('div')
    const printDOMID = 'printDOMElement'
    div.id = printDOMID
    div.innerHTML = html

    // 提取第一个表格的内容 即表头
    const ths = div.querySelectorAll('.el-table__header-wrapper th')
    const ThsTextArry = []
    for (let i = 0, len = ths.length; i < len; i++) {
        if (ths[i].innerText !== '') ThsTextArry.push(ths[i].innerText)
    }

    // 删除多余的表头
    div.querySelector('.hidden-columns').remove()
    // 第一个表格的内容提取出来后已经没用了 删掉
    div.querySelector('.el-table__header-wrapper').remove()

    // 将第一个表格的内容插入到第二个表格
    let newHTML = '<tr>'
    for (let i = 0, len = ThsTextArry.length; i < len; i++) {
        newHTML += '<td style="text-align: center; font-weight: bold">' + ThsTextArry[i] + '</td>'
    }

    newHTML += '</tr>'
    div.querySelector('.el-table__body-wrapper table').insertAdjacentHTML('afterbegin', newHTML)
    // 将新的 DIV 添加到页面 打印后再删掉
    document.querySelector('body').appendChild(div)
    
    printJS({
        printable: printDOMID,
        type: 'html',
        scanStyles: false,
        style: 'table { border-collapse: collapse }' // 表格样式
    })

    div.remove()
}
```

8. 自动忽略 console.log 语句

main.js
```js
export function rewriteLog() {
    console.log = (function (log) {
        return process.env.NODE_ENV == 'development'? log : function() {}
    }(console.log))
}
```

也可在配置中用terser-plugin消除console.log

## Vue3是如何变快的

参考链接：

[Vue3.0学习](https://blog.csdn.net/zlj19980305/article/details/110501737)

[Vue3教程：Vue 3.x 快在哪里？](https://juejin.cn/post/6903171037211557895)

1. diff算法优化

  见[Vue3优化diff](#Vue3优化diff)

2. hoistStatic(静态提升)

  非更新的元素在render函数中做静态提升，减少多次调用导致多次重新定义变量的问题

  静态提升:在开发过程中写函数的时候，定义一些写死的变量时，都会将变量提升出去定义，不会每次调用都重新定义一次变量
  ```js
  const PAGE_SIZE = 10
  function getData () {
    $.get('/data', {
      data: {
        page: PAGE_SIZE
      },
      ...
    })
  }
  ```

  Vue2.x中无论元素是否参与更新，每次都会重新创建，然后再渲染

  Vue3.0中对于不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用即可

  ```html
  <div>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>{{msg}}}</p>
  </div>
  ```

  没有静态提升时
  ```js
  export function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (_openBlock(), _createBlock("div", null, [
      _createVNode("p", null, "hello"),
      _createVNode("p", null, "hello"),
      _createVNode("p", null, "hello"),
      _createVNode("p", null, _toDisplayString(_ctx.msg) + "}", 1 /* TEXT */)
    ]))
  }
  ```

  静态提升之后
  ```js
  const _hoisted_1 = /*#__PURE__*/_createVNode("p", null, "hello", -1 /* HOISTED */)
  const _hoisted_2 = /*#__PURE__*/_createVNode("p", null, "hello", -1 /* HOISTED */)
  const _hoisted_3 = /*#__PURE__*/_createVNode("p", null, "hello", -1 /* HOISTED */)
  export function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (_openBlock(), _createBlock("div", null, [
      _hoisted_1,
      _hoisted_2,
      _hoisted_3,
      _createVNode("p", null, _toDisplayString(_ctx.msg) + "}", 1 /* TEXT */)
    ]))
  }
  ```

3. cacheHandlers事件监听缓存

  默认情况下 @click 事件被认为是动态变量，所以每次更新视图的时候都会追踪它的变化。但是正常情况下，我们的 @click 事件在视图渲染前和渲染后，都是同一个事件，基本上不需要去追踪它的变化

  ```html
  <div>
    <button @click="onClick">按钮</button>
  </div>
  ```

  没有开启事件监听缓存时,静态标记为8(动态属性，不包括类名和样式)，会被拉去做比较
  ```js
  export function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (_openBlock(), _createBlock("div", null, [
      _createVNode("button", { onClick: _ctx.onClick }, "按钮", 8 /* PROPS */, ["onClick"])
    ]))
  }
  ```

  开启事件监听缓存之后
  ```js
  export function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (_openBlock(), _createBlock("div", null, [
      _createVNode("button", {
        onClick: _cache[1] || (_cache[1] = (...args) => (_ctx.onClick(...args)))
      }, "按钮")
    ]))
  }
  ```

4. SSR 服务端渲染

  使用 SSR 开发时，Vue 3.0 会将静态标签直接转化为文本，相比 React 先将 jsx 转化为虚拟 DOM，再将虚拟 DOM 转化为 HTML，Vue 3.0 已经赢了。

5. StaticNode(静态节点)

  在客户端渲染的时候，只要标签嵌套得足够多，除了会静态提升，还会在编译时将其转化为 HTML 字符串
  ```js
  const _hoisted_1 = /*#__PURE__*/_createStaticVNode("<p><span>a</span><span>a</span><span>a</span><span>a</span><span>a</span></p>")
  export function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (_openBlock(), _createBlock("div", null, [
      _hoisted_1
    ]))
  }
  ```

## vue-router4

参考链接：

[Vue Router 4.0 发布！焕然一新。](https://juejin.cn/post/6903717128373796871)

1. 新增了有自动优先级排名的高级路径解析功能

  越明确的路由排名越高，越模糊则反之，无关顺序

  在旧版的 Vue Router 中需要通过路由声明的顺序来保证这个行为，而新版则无论你怎样放置，都会按照得分系统来计算该匹配哪个路由。

  ```js
  const routes = [
    {
      path: '/users',
      Component: Users
    },
    {
      path: '/:w+',
      Component: NotFound
    }
  ]
  ```

  排名
  ```js
  it('works', () => {
    checkPathOrder([
      '/a/b/c',
      '/a/b',
      '/a/:b/c',
      '/a/:b',
      '/a',
      '/a-:b-:c',
      '/a-:b',
      '/a-:w(.*)',
      '/:a-:b-:c',
      '/:a-:b',
      '/:a-:b(.*)',
      '/:a/-:b',
      '/:a/:b',
      '/:w',
      '/:w+'
    ])
  })
  ```

2. 更强大的 Devtools

  * 时间轴记录路由变化
  * 完整 route 目录，轻松调试

3. 更好的路由守卫

  去除next，加入async await
  ```js
  router.beforeEach(async (to, from) => {
    // canUserAccess() returns `true` or `false`
    return await canUserAccess(to)
  })
  ```

4. 一致的编码

  作为参数传递给 router.push() 时，不需要做任何编码，在你使用 $route 或 useRoute()去拿到参数的时候永远是解码（Decoded）的状态。

## 循环条件动态class混合使用

参考链接：

[vue如何动态绑定多个class](https://www.jianshu.com/p/e4248eb7c92a)

[vue v-for与v-if组合使用](https://www.cnblogs.com/mengfangui/p/8931002.html)

1. 动态绑定多个class

  ```html
  <!-- class 绑定 -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]">
  <!-- classA 是固定不变的，classB与classC 是根据条件来判断是否加入 -->
  <a :class="{ 'active': hash==='finish','nav-link':true}" href="#/finish">已完成</a>
  <!-- style 同理 -->
  ```

2. 循环条件

  v-for 比 v-if 有更高优先级，这意味着 v-if 将分别重复运行于每个 v-for 循环中

  * 为仅有的一些项渲染节点时，这种优先级的机制会十分有用

    不推荐
    ```html
    <li v-for="todo in todos" v-if="!todo.isComplete">
      {{ todo }}
    </li>
    ```

    可考虑用computed替代
    ```html
    computed: {
      activeUsers: function () {
        return this.users.filter(function (user) {
          return user.isActive
        })
      }
    }
    <ul>
      <li
        v-for="user in activeUsers"
        :key="user.id"
      >
      {{ user.name }}
      </li>
    </ul>
    ```

  * 有条件地跳过循环的执行，那么可以将 v-if 置于外层元素

    ```html
    <ul v-if="todos.length">
      <li v-for="todo in todos">
        {{ todo }}
      </li>
    </ul>
    <p v-else>No todos left!</p>
    ```

3. 循环动态class

  ```html
  <view class="item" v-for="item in footerInfo" :key="item.calss">
    <navigator class="link" :url="'/'+item.link">
      <view :class="['image',item.class, { active: currentRoute == item.link }]"></view>
    </navigator>
  </view>
  ```

## typescript样例

参考链接：

[vue-property-decorator的简单介绍,一看就会](https://blog.csdn.net/sllailcp/article/details/102542796/)

npm i -D vue-proporty-decorator

```ts
<template>
  <div class="mod-wel">
    <span>index {{ msg }}</span> <span @click="change">hello</span>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Emit,
  Inject,
  Model,
  Prop,
  Provide,
  Vue,
  Ref,
  Watch
} from 'vue-property-decorator'

@Component({
  layout: 'blog',
  name: 'tsExample'
})
export default class App extends Vue {
    // 初始化数据
    private msg: number = 123;

    @Prop({ type: Number, default: 0 })
    private propA?: number;

    @Prop({ default: 'default value' })
    private propB?: string;

    @Prop([String, Boolean])
    private propC?: string | boolean;

    @Watch('msg')
    onChildChanged (val: string, oldVal: string) {
      console.log(val, oldVal)
    }

    @Emit('delemit') private delEmitClick (event: MouseEvent) {}

    @Ref('aButton') readonly ref!: HTMLButtonElement;

    // 声明周期钩子
    mounted () {
      this.greet()
    }

    // 计算属性
    get computedMsg () {
      return 'computed ' + this.msg
    }

    // 方法
    public greet () {
      console.log('greeting: ' + this.msg)
    }

    public change () {
      this.msg = 789
    }
}
</script>
<style scoped>
.mod-wel {
  padding: 100px;
  text-align: center;
}
</style>
```