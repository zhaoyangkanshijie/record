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

* 销毁前/后：
    * 在执行destroy方法后，对data的改变不会再触发周期函数，说明此时vue实例已经解除了事件监听以及和dom的绑定，但是dom结构依然存在

## vue双向数据绑定原理

vue采用数据劫持结合发布者-订阅者模式的方式实现双向数据绑定。通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

* 具体步骤：

1. observe数据对象进行递归遍历，包括子属性对象的属性，都加上 setter和getter。给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化。

2. compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图

3. Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是:
    * 在自身实例化时往属性订阅器(dep)里面添加自己
    * 自身必须有一个update()方法
    * 待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

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

## 路由vue-router
* 链接跳转
```html
<router-link to="/">hello world</router-link>
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

## vuex状态管理(组件间通信)

Store是Vuex的一个仓库。组件一般在计算属性（computed）获取state的数据（return this.$store.state.name）,当组件从store中读取状态（state），若状态发生更新时，它会及时的响应给其他的组件（类似双向数据绑定），而且不能直接改变store的状态，改变状态的唯一方法就是提交更改（mutations）

* state：用来存放组件之间共享的数据。他跟组件的data选项类似，只不过data选项是用来存放组件的私有数据。
* getters：state的数据的筛选和过滤，可以把getters看成是store的计算属性。getters下的函数接收接收state作为第一个参数。过滤的数据会存放到$store.getters对象中。
* mutations：实际改变状态(state) 的唯一方式是通过提交(commit) 一个 mutation。mutations下的函数接收state作为参数，接收payload（载荷）作为第二个参数，用来记录开发者使用该函数的一些信息，如提交了什么，提交的东西用来干什么，包含多个字段，所以载荷一般是对象，mutations方法必须是同步方法。
* actions：mutations只能处理同步函数，actions处理同步函数。actions提交的是 mutations，而不是直接变更状态。actions可以包含任意异步操作：ajax、setTimeout、setInterval。

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

const actions = {}

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








