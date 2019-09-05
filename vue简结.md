# vue简结

* [vue自带指令](#vue自带指令)
* [vue自定义指令](#vue自定义指令)
* [vue生命周期](#vue生命周期)
* [vue双向数据绑定原理](#vue双向数据绑定原理)
* [请求后台资源](#请求后台资源)
* [路由vue-router](#路由vue-router)
* [自定义组件(创建组件步骤)](#自定义组件(创建组件步骤))
* [父子组件通信](#父子组件通信)
* [vuex状态管理(组件间通信)](#vuex状态管理(组件间通信))
* [vue与jquery的区别](#vue与jquery的区别)
* [vuejs与angularjs以及react的区别](#vuejs与angularjs以及react的区别)
* [vue源码结构](#vue源码结构)
* [vue2.0和3.0的区别](#vue2.0和3.0的区别)
* [style中scoped的作用](#style中scoped的作用)
* [子组件监听父组件数值变化](#子组件监听父组件数值变化)
* [页面传参与获取](#页面传参与获取)
* [不同url复用页面，且只刷新部分组件](#不同url复用页面，且只刷新部分组件)
* [method与computed区别](#method与computed区别)
* [使用cookie](#使用cookie)
* [使用插槽](#使用插槽)
* [axios请求响应拦截](#axios请求响应拦截)

## vue自带指令

1. v-if 控制dom结构的显示隐藏，dom结构消失
2. v-show 控制dom结构的显示隐藏，dom结构不消失
3. v-for 循环显示数据
4. v-on 简写 @，@事件名
5. v-bind 简写 :，:属性，常用于样式，组件传值，如:style   :xxx
6. v-model 常用于 input 输入框中。修饰符 .trim 首尾空格过滤，.number 转数字 .lazy 与change事件同步，类似onbulr事件
7. v-once 只渲染元素或组件一次。dom再次更新时会被当成静态内容跳过。
8. v-html 代码按html格式显示

## vue自定义指令

* 全局定义指令：在vue对象的directive方法里面有两个参数，一个是指令名称，另外一个是函数。组件内定义指令：directives
* 钩子函数：bind（绑定事件触发）、inserted(节点插入的时候触发)、update（组件内相关更新）
* 钩子函数参数：el、binding

例子：
```js
Vue.directive('img', {
  inserted: function (el, binding) {
    let color = Math.floor(Math.random() * 1000000)
    el.style.backgroundColor = '#' + color // 设置随机的背景色

    let img = new Image()
    img.src = binding.value // 获得传给指令的值
    img.onload = function () {
      el.style.backgroundImage = 'url(' + binding.value + ')'
    }
  }
})
```

## vue生命周期

* 创建前/后： 
    * beforeCreate：vue实例的挂载元素$el和数据对象data都为undefined，还未初始化，无法获取data，props数据。
    * created：vue实例的数据对象data有了，$el还没有，可以获取data，props值，可以进行ajax请求，但请求信息过多，会长时间白屏。

* 载入前/后：
    * beforeMount：vue实例的$el和data都初始化了，但还是挂载之前为虚拟的dom节点，data.message还未替换。
    * mounted：vue实例挂载完成，data.message成功渲染，可以获取dom结构，可以进行ajax请求，也一般在此时请求。

* 更新前/后：
    * 当data变化时，会触发beforeUpdate和updated方法。

* keep-alive组件激活/停用时调用(在服务器端渲染期间不被调用)
  * activated
  * deactivated

* 销毁前/后：
    * 在执行destroy方法后，对data的改变不会再触发周期函数，说明此时vue实例已经解除了事件监听以及和dom的绑定，但是dom结构依然存在

## vue双向数据绑定原理

* [探讨vue的双向绑定原理及实现](https://www.cnblogs.com/zhouyideboke/p/9626804.html)

vue采用数据劫持结合发布者-订阅者模式的方式实现双向数据绑定。通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

* Object.defineProperty()

  Object.defineProperty(对象, 属性名, 属性描述符对象)

  属性描述符：
    * configurable：描述符是否能被改变
    * enumerable：描述符是否能枚举
    * value：属性值
    * writable：value能否被赋值
    * get：获取value执行的函数
    * set：设置value执行的函数

* 消息队列

  用于应对修改大量数据导致变慢的情况，使用订阅者和发布者模式，发布者在数据改变时，消息传递给订阅者，依次作出相应变化，消息订阅器采用队列的方式添加订阅者。

* DocumentFragments

  DocumentFragments是DOM节点。它们不是主DOM树的一部分。通常的用例是创建文档片段，将元素附加到文档片段，然后将文档片段附加到DOM树。在DOM树中，文档片段被其所有的子元素所代替。
  
  因为文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面对元素位置和几何上的计算。因此，使用文档片段通常会带来更好的性能。

* 具体步骤：

1. observe数据对象(即data)进行递归遍历，包括子属性对象的属性，都加上 setter和getter。给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化,在set函数中通知订阅者watcher。

2. compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图。

  * document.createDocumentFragment(); 创建文档片段(虚拟DOM)，以便操作完成后，挂载到真实DOM(就像创建一堆li，再挂载到实际存在的ul中)
  * 解析元素节点指令
  * /\{\{(.*)\}\}/，正则筛选模板语法，把表达式数据处理到虚拟DOM

3. Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是:
    * 在自身实例化时往属性订阅器(dep)里面添加自己
    * 自身必须有一个update()方法
    * 待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

    dep下使用subs[]消息队列,保存watcher，dep定义通知更新的方法

4. MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

## 请求后台资源

* 使用axios：
1. npm install axios
2. import axios from 'axios'
3. get请求
```js
// Make a request for a user with a given ID
axios.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

// Optionally the request above could also be done as
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```
4. post请求
```js
axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
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
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // Both requests are now complete
  }));
```
6. axios api
```js
// 发起一个POST请求
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
// 获取远程图片
axios({
  method:'get',
  url:'http://bit.ly/2mTM3nY',
  responseType:'stream'
})
  .then(function(response) {
  response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
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

* 使用resource
1. npm install vue-resource
2. 引入
```js
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
```
3. get请求
```js
// 传统写法
this.$http.get('/someUrl', [options]).then(function(response){
    // 响应成功回调
}, function(response){
    // 响应错误回调
});

// Lambda写法
this.$http.get('/someUrl', [options]).then((response) => {
    // 响应成功回调
}, (response) => {
    // 响应错误回调
});
```
4. restful API
```js
get(url, [options])
head(url, [options])
delete(url, [options])
jsonp(url, [options])
post(url, [body], [options])
put(url, [body], [options])
patch(url, [body], [options])
```
* options包含：
  * url
  * method(get/post等)
  * body
  * params参数
  * headers
  * timeout
  * before(类似jquery的beforeSend函数)
  * progress(ProgressEvent回调处理函数)
  * credientials(bool,跨域请求是否需要凭证)
  * emulateHTTP(bool,发送put,patch,delete请求时以post发送，请求头：X-HTTP-Method-Override)
  * emulateJSON(bool,body以application/x-www-form-urlencoded content type发送)

## 路由vue-router
* 链接跳转
```html
<router-link to="/">hello world</router-link>
```

* history模式

用于消除url中的"#"，它利用了history.pushState API来完成URL的跳转而不需要重新加载页面。

这种模式充分
```js
export default new Router({
  mode: 'history',
  routes: [...]
})
```

* 动态路由、子路由

在router目录下的index.js文件中，对path属性加上/:id。
```js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```
* vue-router导航钩子
1. 全局导航钩子router.beforeEach/afterEach(to,from,next)，用来跳转前/后进行权限判断。
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
    return {

    }
  },
  methods: {
    go() {
      this.$router.push({ name: 'HelloWorld' })
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log(this, 'beforeRouteEnter'); // undefined
    console.log(to, '组件独享守卫beforeRouteEnter第一个参数');
    console.log(from, '组件独享守卫beforeRouteEnter第二个参数');
    console.log(next, '组件独享守卫beforeRouteEnter第三个参数');
    next(vm => {
      //因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      console.log(vm);//当前组件的实例
    });
  },
  beforeRouteUpdate(to, from, next) {
    //在当前路由改变，但是该组件被复用时调用
    //对于一个带有动态参数的路径 /good/:id，在 /good/1 和 /good/2 之间跳转的时候，
    // 由于会渲染同样的good组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    console.log(this, 'beforeRouteUpdate'); //当前组件实例
    console.log(to, '组件独享守卫beforeRouteUpdate第一个参数');
    console.log(from, '组件独享守beforeRouteUpdate卫第二个参数');
    console.log(next, '组件独享守beforeRouteUpdate卫第三个参数');
    next();
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    console.log(this, 'beforeRouteLeave'); //当前组件实例
    console.log(to, '组件独享守卫beforeRouteLeave第一个参数');
    console.log(from, '组件独享守卫beforeRouteLeave第二个参数');
    console.log(next, '组件独享守卫beforeRouteLeave第三个参数');
    next();
  }
}
```
3. 单独路由独享组件
```js
const router = new VueRouter({
  routes: [
    {
      path: '/login',
      component: Login,
      beforeEnter: (to, from, next) => {
        // ...
      },
      beforeLeave: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

## 自定义组件(创建组件步骤)
1. 在components目录新建组件文件（smithButton.vue），export default {...}
2. 在需要用组件的页面中导入：import smithButton from ‘../components/smithButton.vue’
3. 注入到vue的子组件的components属性上面,components:{smithButton}
4. 在template视图view中使用，<smith-button>

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
      select: this
    };
  }
}
```
* 孙
```js
export default {
    name:'el-option',
    inject:['select'],
    created(){
      if(this.select.value===this.value){
        this.select.label=this.label;
      }
    }
}
```

## vuex状态管理(组件间通信)

Store是Vuex的一个仓库。组件一般在计算属性（computed）获取state的数据（return this.$store.state.name）,当组件从store中读取状态（state），若状态发生更新时，它会及时的响应给其他的组件（类似双向数据绑定），而且不能直接改变store的状态，改变状态的唯一方法就是提交更改（mutations）

* state：用来存放组件之间共享的数据。他跟组件的data选项类似，只不过data选项是用来存放组件的私有数据。
* getters：state的数据的筛选和过滤，可以把getters看成是store的计算属性。getters下的函数接收接收state作为第一个参数。过滤的数据会存放到$store.getters对象中。
* mutations：实际改变状态(state) 的唯一方式是通过提交(commit) 一个 mutation。mutations下的函数接收state作为参数，接收payload（载荷）作为第二个参数，用来记录开发者使用该函数的一些信息，如提交了什么，提交的东西用来干什么，包含多个字段，所以载荷一般是对象，mutations方法必须是同步方法。
* actions：mutations只能处理同步函数，actions处理异步函数。actions提交的是 mutations，而不是直接变更状态。actions可以包含任意异步操作：ajax、setTimeout、setInterval。actions 通过 store.dispatch(方法名) 触发

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  count: 1
}

const getters = {
  count: state => state.count
}

const actions = {
  count (context) {
    context.commit('count')
  }
}

const mutations = {
  add (state, n) {
    state.count += n
  },
  reduce (state) {
    state.count -= 1
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
```

## vue与jquery的区别

vue是一个mvvm（model+view+viewModel）框架，数据驱动，通过数据来显示视图层，而不是jquery的事件驱动进行节点操作。vue适用于数据操作比较多的场景。

## vuejs与angularjs以及react的区别

* 学习难度：vue < angular < react
* 社区成熟度：vue < angular、react
* vue轻量级框架。使用jsx。
* angular较完善框架，由google开发，包含服务，模板，数据双向绑定（脏检查），模块化，路由，过滤器，依赖注入等所有功能。使用typescript。
* react由facebook开发，通过对DOM的模拟（虚拟dom），最大限度地减少与DOM的交互。使用jsx。

## vue源码结构
vue2结构
```txt
|-- build                            // 项目构建(webpack)相关代码
|   |-- build.js                     // 生产环境构建代码
|   |-- check-version.js             // 检查node、npm等版本
|   |-- utils.js                     // 构建工具相关
|   |-- vue-loader.conf.js           // webpack loader配置
|   |-- webpack.base.conf.js         // webpack基础配置
|   |-- webpack.dev.conf.js          // webpack开发环境配置,构建开发本地服务器
|   |-- webpack.prod.conf.js         // webpack生产环境配置
|-- config                           // 项目开发环境配置
|   |-- dev.env.js                   // 开发环境变量
|   |-- index.js                     // 项目一些配置变量
|   |-- prod.env.js                  // 生产环境变量
|-- src                              // 源码目录
|   |-- assets                       // 资源文件(字体、图片)
|   |-- components                   // vue公共组件
|   |-- pages                        // vue页面
|   |-- router                       // vue的路由管理
|   |-- scss                         // 样式文件
|   |-- store                        // vuex状态管理
|   |-- App.vue                      // 页面入口文件
|   |-- main.js                      // 程序入口文件，加载各种公共组件
|-- static                           // 静态文件，比如一些图片，json数据等
|-- .babelrc                         // ES6语法编译配置
|-- .editorconfig                    // 定义代码格式
|-- .gitignore                       // git上传需要忽略的文件格式
|-- .postcsssrc                      // postcss配置文件
|-- README.md                        // 项目说明
|-- index.html                       // 入口页面
|-- package.json                     // 项目基本信息,包依赖信息等
```

## vue2.0和3.0的区别
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
vue-cli3.0默认项目目录与2.0的相比，更精简:
1. 移除的配置文件根目录下的，build和config等目录
2. 移除了static文件夹，新增了public文件夹，并且index.html移动到public中
3. 在src文件夹中新增了views文件夹，用于分类 视图组件 和 公共组件
4. 大部分配置 都集成到 vue.config.js这里,在项目根目录下

* 运行命令改变

原来：
```txt
npm run dev/npm run build
```
现在：
```txt
npm run serve/npm run build
```

## style中scoped的作用

* 添加scoped来使得当前样式只作用于当前组件的节点，其它组件不能设置此组件样式,因此App.vue引用公共组件不使用scoped。

* 在背后做的工作是将当前组件的节点添加一个像data-v-1233
这样唯一属性的标识，当然也会给当前style的所有样式添加[data-v-1233]

## 子组件监听父组件数值变化

这就是观察订阅者模式，vue的实现采用了watch方法。

* 父组件
```html
<template>
    <load-list :param="param" cate="hide"></load-list>
</template>
```
param是data函数里面的一个对象,子组件需要使用监听对象的watch写法

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

## 页面传参与获取
1. 传参
* 方法1
```js
this.$router.push({
  path:'/world',
  name:'world',
  params:{
    id : id
  }
})
```
* 方法2
```html
<router-link :to="{path:'/home',query:{id:'aaa'}}">跳转</router-link>
```
2. 获取
```js
export default {
    name: '',
    data () {
      return {
        id: ''
      }
    },
    created(){
       this.getParams()
    },
    methods: {
      getParams () {
        // 取到路由带过来的参数 
        var routerParams = this.$route.params.id
        // 将数据放在当前组件的数据内
        this.id = routerParams
      }
    },
    watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    }
}
```

## 不同url复用页面，且只刷新部分组件

场景：登录页面中，有忘记密码功能，所填的信息仅有部分不同，但为了区分功能，url需要改变。
方法：watch+$route(to,from)

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

## method与computed区别

1. computed是属性调用，而methods是函数调用，computed要有返回值
```html
<p class="test2-3">{{methodTest()}}</p>
<p class="test3-1">{{computedTest}}</p>
```
2. computed带有缓存功能，而methods不是

computed依赖于data中的数据，只有在它的相关依赖数据发生改变时才会重新求值，官方文档反复强调：对于任何复杂逻辑，都应当使用计算属性。

简单来说：data中依赖的值不变，刷新视图，method会重新计算，computed不会（节省内存）。

## 使用cookie

1. npm install vue-cookies
2. main.js 文件
```js
const $cookies = require('vue-cookies')
Vue.use($cookies)
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
      <slot name="slot1"></slot><!-- 具名插槽 -->
      <slot></slot><!-- 匿名插槽 -->
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
 
 export default {
    data: function(){
      return {
        data: ['zhangsan','lisi','wanwu','zhaoliu','tianqi','xiaoba']
      }
    }
}
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

## axios请求响应拦截

config.js
```js
import axios from 'axios';//引入axios依赖
import { Message } from 'element-ui';
import Cookies from 'js-cookie'; //引入cookie操作依赖
import router from '@/router/index'//引入路由对象
axios.defaults.timeout = 5000;
axios.defaults.baseURL ='';

//http request 封装请求头拦截器
axios.interceptors.request.use(
  config => {
    var token = ''
    if(typeof Cookies.get('user') === 'undefined'){
      //此时为空
    }else {
      token = JSON.parse(Cookies.get('user')).token
    }//注意使用的时候需要引入cookie方法，推荐js-cookie
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type':'application/json'
    }
    if(token != ''){
     config.headers.token = token;
    }
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
      router.push({
        path:"/",
        query:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
      })
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

在main.js中进行引用，并配置一个别名（$ajax）来进行调用:
```js
import axios from 'axios'
import '../config/axios'

Vue.prototype.$ajax = axios;
```

调用
```js
this.$ajax({
　　method: 'post',
　　url: '/login',
　　data: {
　　　　'userName': 'xxx',
　　　　'password': 'xxx'
　　}
}).then(res => {
　　console.log(res)
})
```