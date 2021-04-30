# vueSSR简结

## 参考链接

* [Vue SSR 指南](https://ssr.vuejs.org/zh/guide/build-config.html)
* [Nuxt源码精读](https://juejin.cn/post/6917247127315808270)
* [nuxt缓存实践](https://juejin.cn/post/6844903623483195399)
* [Nuxt 性能优化-页面缓存](https://my.oschina.net/u/158675/blog/4304453)
* [异步数据](https://www.nuxtjs.cn/guide/async-data)
* [SplitChunks & Lodash & Vuetify tree shaking](https://ithelp.ithome.com.tw/articles/10207669)
* [分享：nuxt中间件](https://blog.csdn.net/awseda/article/details/106227729)
* [官网文档webpack配置](https://zh.nuxtjs.org/docs/2.x/configuration-glossary/configuration-build)
* [nuxtjs 全局变量添加 asyncData 也可访问](http://quanzhan.applemei.com/webStack/TXpnNE5RPT0=)

## 目录

* [什么是服务器端渲染SSR](#什么是服务器端渲染SSR)
* [为什么使用服务器端渲染SSR](#为什么使用服务器端渲染SSR)
* [服务器端渲染与预渲染](#服务器端渲染与预渲染)
* [简单通过vue-server-renderer实现ssr](#简单通过vue-server-renderer实现ssr)
* [ssr代码约束](#ssr代码约束)
* [使用vue-router的路由](#使用vue-router的路由)
* [数据预取和状态](#数据预取和状态)
* [store](#store)
* [客户端激活](#客户端激活)
* [什么是nuxt？](#什么是nuxt？)
* [nuxt源码架构](#nuxt源码架构)
* [ssr核心原理](#ssr核心原理)
* [nuxt中间件](#nuxt中间件)
* [nuxt路由生成策略](#nuxt路由生成策略)
* [nuxt缓存](#nuxt缓存)
* [nuxt请求到渲染](#nuxt请求到渲染)
* [nuxt预渲染数据](#nuxt预渲染数据)
* [nuxt的api属性和方法](#nuxt的api属性和方法)
* [nuxt优化](#nuxt优化)
* [nuxt插件](#nuxt插件)
* [nuxt全局变量](#nuxt全局变量)
* [nuxt后端restfulApi](#nuxt后端restfulApi)
* [nuxt部署](#nuxt部署)

## 什么是服务器端渲染SSR

Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

服务器渲染的 Vue.js 应用程序也可以被认为是"同构"或"通用"，因为应用程序的大部分代码都可以在服务器和客户端上运行。

## 为什么使用服务器端渲染SSR

* 与传统 SPA (单页应用程序 (Single-Page Application)) 相比，服务器端渲染 (SSR) 的优势主要在于：

    * 更好的 SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。

    * 更快的内容到达时间 (time-to-content)，特别是对于缓慢的网络情况或运行缓慢的设备。

* 使用服务器端渲染 (SSR) 时还需要有一些权衡之处：

    * 开发条件所限。浏览器特定的代码，只能在某些生命周期钩子函数 (lifecycle hook) 中使用；一些外部扩展库 (external library) 可能需要特殊处理，才能在服务器渲染应用程序中运行。

    * 涉及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态单页面应用程序 (SPA) 不同，服务器渲染应用程序，需要处于 Node.js server 运行环境。

    * 更多的服务器端负载。在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用 CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 (high traffic) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。

## 服务器端渲染与预渲染

    服务器端渲染 (SSR) 只是用来改善少数营销页面的 SEO，那么你可能需要预渲染。

    无需使用 web 服务器实时动态编译 HTML，而是使用预渲染方式，在构建时 (build time) 简单地生成针对特定路由的静态 HTML 文件。
    
    优点是设置预渲染更简单，并可以将你的前端作为一个完全静态的站点。

    可以使用 prerender-spa-plugin 轻松地添加预渲染。

## 简单通过vue-server-renderer实现ssr

```js
const Vue = require('vue');
const server = require('express')();

const template = require('fs').readFileSync('./index.template.html', 'utf-8');

const renderer = require('vue-server-renderer').createRenderer({
  template,
});

const context = {
    title: 'vue ssr',
    metas: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
};

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`,
  });

  renderer
  .renderToString(app, context, (err, html) => {
    console.log(html);
    if (err) {
      res.status(500).end('Internal Server Error')
      return;
    }
    res.end(html);
  });
})

server.listen(8080);
```

## ssr代码约束

* 服务器上的数据响应

  因为实际的渲染过程需要确定性，所以我们也将在服务器上“预取”数据 ("pre-fetching" data) - 这意味着在我们开始渲染时，我们的应用程序就已经解析完成其状态。

  将数据进行响应式的过程在服务器上是多余的，所以默认情况下禁用。禁用响应式数据，还可以避免将「数据」转换为「响应式对象」的性能开销。

* 组件生命周期钩子

  由于没有动态更新，所有的生命周期钩子函数中，只有 beforeCreate 和 created 会在服务器端渲染 (SSR) 过程中被调用。

  任何其他生命周期钩子函数中的代码（例如 beforeMount 或 mounted），只会在客户端执行。应该避免在 beforeCreate 和 created 生命周期时产生全局副作用的代码，例如在其中使用 setInterval 设置 timer。

  由于在 SSR 期间并不会调用销毁钩子函数，所以 timer 将永远保留下来。为了避免这种情况，请将副作用代码移动到 beforeMount 或 mounted 生命周期中。

* 访问特定平台(Platform-Specific) API

  通用代码不可接受特定平台的 API，因此如果你的代码中，直接使用了像 window 或 document，这种仅浏览器可用的全局变量，则会在 Node.js 中执行时抛出错误，反之也是如此。

  axios 是一个 HTTP 客户端，可以向服务器和客户端都暴露相同的 API。

* 自定义指令

  大多数自定义指令直接操作 DOM，因此会在服务器端渲染 (SSR) 过程中导致错误。有两种方法可以解决这个问题：

  1. 推荐使用组件作为抽象机制，并运行在「虚拟 DOM 层级(Virtual-DOM level)」（例如，使用渲染函数(render function)）。

  2. 如果你有一个自定义指令，但是不是很容易替换为组件，则可以在创建服务器 renderer 时，使用 directives 选项所提供"服务器端版本(server-side version)"。

## 使用vue-router的路由

```js
// router.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: () => import('./components/Home.vue') },
      { path: '/item/:id', component: () => import('./components/Item.vue') }
    ]
  })
}
```
```js
// app.js
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

export function createApp () {
  // 创建 router 实例
  const router = createRouter()

  const app = new Vue({
    // 注入 router 到根 Vue 实例
    router,
    render: h => h(App)
  })

  // 返回 app 和 router
  return { app, router }
}
```
服务器端路由逻辑
```js
// entry-server.js
import { createApp } from './app'

export default context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
    // 以便服务器能够等待所有的内容在渲染前，
    // 就已经准备就绪。
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()

    // 设置服务器端 router 的位置
    router.push(context.url)

    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      // Promise 应该 resolve 应用程序实例，以便它可以渲染
      resolve(app)
    }, reject)
  })
}
```
服务器用法
```js
// server.js
const createApp = require('/path/to/built-server-bundle.js')

server.get('*', (req, res) => {
  const context = { url: req.url }

  createApp(context).then(app => {
    renderer.renderToString(app, (err, html) => {
      if (err) {
        if (err.code === 404) {
          res.status(404).end('Page not found')
        } else {
          res.status(500).end('Internal Server Error')
        }
      } else {
        res.end(html)
      }
    })
  })
})
```
客户端入口
```js
// entry-client.js

import { createApp } from './app'

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#app')
})
```

## 数据预取和状态

* 数据预取存储容器 (Data Store)

  在服务器端渲染(SSR)期间，我们本质上是在渲染我们应用程序的"快照"，所以如果应用程序依赖于一些异步数据，那么在开始渲染过程之前，需要先预取和解析好这些数据。

  在挂载 (mount) 到客户端应用程序之前，需要获取到与服务器端应用程序完全相同的数据 - 否则，客户端应用程序会因为使用与服务器端应用程序不同的状态，然后导致混合失败。

  为了解决这个问题，获取的数据需要位于视图组件之外，即放置在专门的数据预取存储容器(data store)或"状态容器(state container)）"中。首先，在服务器端，我们可以在渲染之前预取数据，并将数据填充到 store 中。

  store样例
  ```js
  // store.js
  import Vue from 'vue'
  import Vuex from 'vuex'

  Vue.use(Vuex)

  // 假定我们有一个可以返回 Promise 的
  // 通用 API（请忽略此 API 具体实现细节）
  import { fetchItem } from './api'

  export function createStore () {
    return new Vuex.Store({
      state: {
        items: {}
      },
      actions: {
        fetchItem ({ commit }, id) {
          // `store.dispatch()` 会返回 Promise，
          // 以便我们能够知道数据在何时更新
          return fetchItem(id).then(item => {
            commit('setItem', { id, item })
          })
        }
      },
      mutations: {
        setItem (state, { id, item }) {
          Vue.set(state.items, id, item)
        }
      }
    })
  }
  ```

  app.js
  ```js
  // app.js
  import Vue from 'vue'
  import App from './App.vue'
  import { createRouter } from './router'
  import { createStore } from './store'
  import { sync } from 'vuex-router-sync'

  export function createApp () {
    // 创建 router 和 store 实例
    const router = createRouter()
    const store = createStore()

    // 同步路由状态(route state)到 store
    sync(store, router)

    // 创建应用程序实例，将 router 和 store 注入
    const app = new Vue({
      router,
      store,
      render: h => h(App)
    })

    // 暴露 app, router 和 store。
    return { app, router, store }
  }
  ```

* 带有逻辑配置的组件 (Logic Collocation with Components)

  我们需要通过访问路由，来决定获取哪部分数据 - 这也决定了哪些组件需要渲染。所以在路由组件中放置数据预取逻辑，是很自然的事情。

  我们将在路由组件上暴露出一个自定义静态函数 asyncData。注意，由于此函数会在组件实例化之前调用，所以它无法访问 this。需要将 store 和路由信息作为参数传递进去：

  ```html
  <!-- Item.vue -->
  <template>
    <div>{{ item.title }}</div>
  </template>

  <script>
  export default {
    asyncData ({ store, route }) {
      // 触发 action 后，会返回 Promise
      return store.dispatch('fetchItem', route.params.id)
    },
    computed: {
      // 从 store 的 state 对象中的获取 item。
      item () {
        return this.$store.state.items[this.$route.params.id]
      }
    }
  }
  </script>
  ```

* 服务器端数据预取 (Server Data Fetching)

  在 entry-server.js 中，我们可以通过路由获得与 router.getMatchedComponents() 相匹配的组件，如果组件暴露出 asyncData，我们就调用这个方法。然后我们需要将解析完成的状态，附加到渲染上下文(render context)中。

  ```js
  // entry-server.js
  import { createApp } from './app'

  export default context => {
    return new Promise((resolve, reject) => {
      const { app, router, store } = createApp()

      router.push(context.url)

      router.onReady(() => {
        const matchedComponents = router.getMatchedComponents()
        if (!matchedComponents.length) {
          return reject({ code: 404 })
        }

        // 对所有匹配的路由组件调用 `asyncData()`
        Promise.all(matchedComponents.map(Component => {
          if (Component.asyncData) {
            return Component.asyncData({
              store,
              route: router.currentRoute
            })
          }
        })).then(() => {
          // 在所有预取钩子(preFetch hook) resolve 后，
          // 我们的 store 现在已经填充入渲染应用程序所需的状态。
          // 当我们将状态附加到上下文，
          // 并且 `template` 选项用于 renderer 时，
          // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
          context.state = store.state

          resolve(app)
        }).catch(reject)
      }, reject)
    })
  }
  ```

  当使用 template 时，context.state 将作为 window.__INITIAL_STATE__ 状态，自动嵌入到最终的 HTML 中。而在客户端，在挂载到应用程序之前，store 就应该获取到状态：

  ```js
  // entry-client.js

  const { app, router, store } = createApp()

  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }
  ```

* 客户端数据预取 (Client Data Fetching)

  处理数据预取有两种不同方式：

    1. 在路由导航之前解析数据

      使用此策略，应用程序会等待视图所需数据全部解析之后，再传入数据并处理当前视图。

      好处在于，可以直接在数据准备就绪时，传入视图渲染完整内容，但是如果数据预取需要很长时间，用户在当前视图会感受到"明显卡顿"。因此，如果使用此策略，建议提供一个数据加载指示器 (data loading indicator)。

      可以通过检查匹配的组件，并在全局路由钩子函数中执行 asyncData 函数，来在客户端实现此策略。注意，在初始路由准备就绪之后，我们应该注册此钩子，这样我们就不必再次获取服务器提取的数据。

      ```js
      // entry-client.js

      // ...忽略无关代码

      router.onReady(() => {
        // 添加路由钩子函数，用于处理 asyncData.
        // 在初始路由 resolve 后执行，
        // 以便我们不会二次预取(double-fetch)已有的数据。
        // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
        router.beforeResolve((to, from, next) => {
          const matched = router.getMatchedComponents(to)
          const prevMatched = router.getMatchedComponents(from)

          // 我们只关心非预渲染的组件
          // 所以我们对比它们，找出两个匹配列表的差异组件
          let diffed = false
          const activated = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c))
          })

          if (!activated.length) {
            return next()
          }

          // 这里如果有加载指示器 (loading indicator)，就触发

          Promise.all(activated.map(c => {
            if (c.asyncData) {
              return c.asyncData({ store, route: to })
            }
          })).then(() => {

            // 停止加载指示器(loading indicator)

            next()
          }).catch(next)
        })

        app.$mount('#app')
      })
      ```

    2. 匹配要渲染的视图后，再获取数据

      此策略将客户端数据预取逻辑，放在视图组件的 beforeMount 函数中。

      当路由导航被触发时，可以立即切换视图，因此应用程序具有更快的响应速度。然而，传入视图在渲染时不会有完整的可用数据。因此，对于使用此策略的每个视图组件，都需要具有条件加载状态。

      这可以通过纯客户端 (client-only) 的全局 mixin 来实现：

      ```js
      Vue.mixin({
        beforeMount () {
          const { asyncData } = this.$options
          if (asyncData) {
            // 将获取数据操作分配给 promise
            // 以便在组件中，我们可以在数据准备就绪后
            // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
            this.dataPromise = asyncData({
              store: this.$store,
              route: this.$route
            })
          }
        }
      })
      ```

      从 user/1 到 user/2）时，也应该调用 asyncData 函数。我们也可以通过纯客户端 (client-only) 的全局 mixin 来处理这个问题：

      ```js
      Vue.mixin({
        beforeRouteUpdate (to, from, next) {
          const { asyncData } = this.$options
          if (asyncData) {
            asyncData({
              store: this.$store,
              route: to
            }).then(next).catch(next)
          } else {
            next()
          }
        }
      })
      ```

* Store 代码拆分 (Store Code Splitting)

  ```js
  // store/modules/foo.js
  export default {
    namespaced: true,
    // 重要信息：state 必须是一个函数，
    // 因此可以创建多个实例化该模块
    state: () => ({
      count: 0
    }),
    actions: {
      inc: ({ commit }) => commit('inc')
    },
    mutations: {
      inc: state => state.count++
    }
  }
  ```

  我们可以在路由组件的 asyncData 钩子函数中，使用 store.registerModule 惰性注册(lazy-register)这个模块

  ```html
  // 在路由组件内
  <template>
    <div>{{ fooCount }}</div>
  </template>

  <script>
  // 在这里导入模块，而不是在 `store/index.js` 中
  import fooStoreModule from '../store/modules/foo'

  export default {
    asyncData ({ store }) {
      store.registerModule('foo', fooStoreModule)
      return store.dispatch('foo/inc')
    },

    // 重要信息：当多次访问路由时，
    // 避免在客户端重复注册模块。
    destroyed () {
      this.$store.unregisterModule('foo')
    },

    computed: {
      fooCount () {
        return this.$store.state.foo.count
      }
    }
  }
  </script>
  ```

## store

/store/index.js
```js
export const state = () => ({
  list: []
})

export const mutations = {
  add(state, text) {
    state.list.push({
      text,
      done: false
    })
  },
  remove(state, { todo }) {
    state.list.splice(state.list.indexOf(todo), 1)
  },
  toggle(state, todo) {
    todo.done = !todo.done
  }
}
```

会自动编译
```js
new Vuex.Store({
  state: () => ({
    counter: 0
  }),
  mutations: {
    increment(state) {
      state.counter++
    }
  },
  modules: {
    todos: {
      namespaced: true,
      state: () => ({
        list: []
      }),
      mutations: {
        add(state, { text }) {
          state.list.push({
            text,
            done: false
          })
        },
        remove(state, { todo }) {
          state.list.splice(state.list.indexOf(todo), 1)
        },
        toggle(state, { todo }) {
          todo.done = !todo.done
        }
      }
    }
  }
})
```

页面直接使用
```js
this.$store.state.xxx
```

## 客户端激活

客户端激活指的是 Vue 在浏览器端接管由服务端发送的静态 HTML，使其变为由 Vue 管理的动态 DOM 的过程。

由于服务器已经渲染好了 HTML，我们显然无需将其丢弃再重新创建所有的 DOM 元素。相反，我们需要"激活"这些静态的 HTML，然后使他们成为动态的

如果你检查服务器渲染的输出结果，你会注意到应用程序的根元素上添加了一个特殊的属性：
```html
<div id="app" data-server-rendered="true">
```

data-server-rendered 特殊属性，让客户端 Vue 知道这部分 HTML 是由 Vue 在服务端渲染的，并且应该以激活模式进行挂载。注意，这里并没有添加 id="app"，而是添加 data-server-rendered 属性：你需要自行添加 ID 或其他能够选取到应用程序根元素的选择器，否则应用程序将无法正常激活。

在没有 data-server-rendered 属性的元素上，还可以向 $mount 函数的 hydrating 参数位置传入 true，来强制使用激活模式(hydration)：
```js
// true强制使用应用程序的激活模式
app.$mount('#app', true)
```

## 什么是nuxt？

Nuxt是Vue开源社区提供的一整套基于Vue生态的SSR解决方案，包含脚手架、初始化工程目录、调试/构建服务等，其中SSR功能底层依旧依赖的是vue-server-renderer这个模块。

## nuxt源码架构

```txt
// 工程核心目录结构
├─ distributions   
    ├─ nuxt                 // nuxt指令入口，同时对外暴露@nuxt/core、@nuxt/builder、@nuxt/generator、getWebpackConfig
    ├─ nuxt-start           // nuxt start指令，同时对外暴露@nuxt/core
├─ lerna.json               // lerna配置文件
├─ package.json         
├─ packages                 // 工作目录
    ├─ babel-preset-app     // babel初始预设
    ├─ builder              // 根据路由构建动态当前页ssr资源，产出.nuxt资源
    ├─ cli                  // 脚手架命令入口
    ├─ config               // 提供加载nuxt配置相关的方法
    ├─ core                 //  Nuxt实例，加载nuxt配置，初始化应用模版，渲染页面，启动SSR服务
    ├─ generator            // Generato实例，生成前端静态资源（非SSR）
    ├─ server               // Server实例，基于Connect封装开发/生产环境http服务，管理Middleware
    ├─ types                // ts类型
    ├─ utils                // 工具类
    ├─ vue-app              // 存放Nuxt应用构建模版，即.nuxt文件内容
    ├─ vue-renderer         // 根据构建的SSR资源渲染html
    └─ webpack              // webpack相关配置、构建实例
├─ scripts
├─ test
└─ yarn.lock
```

## ssr核心原理

nuxt底层调用了vue-server-renderer这个方法库渲染html资源

html渲染的过程从本质上看非常简洁，假设我们有一个模版+资源映射表：

1. 读取资源映射表，在node环境加载并执行js bundle，创建Vue实例渲染得到html片段
2. 读取html模版，匹配{{{}}}中的方法
3. 实现renderResourceHints、renderStyles、renderScripts方法，核心是根据资源映射表创建对应的link、style、script标签。
4. 将html片段及上面创建的标签插入到html模版中。

```html
<!--html模版-->
<html>
  <head>
    <!--资源预加载-->
    {{{ renderResourceHints() }}}
    <!--style样式-->
    {{{ renderStyles() }}}
  </head>
  <body>
    <!--vue-ssr-outlet-->
    <!--js资源-->
    {{{ renderScripts() }}}
  </body>
</html>
```
```json
{
    publicPath: "xx/xx/",
    initial: [
        "css/xxx.css"
        "js/xxx.js"
    ],
    async: [
        "css/xxx.css"
        "js/xxx.js"
    ]
}
```

## nuxt中间件

可以在nuxt.config.js中追加serverMiddleware属性来配置服务端中间件

nuxt中间件调用过程可以方便我们处理:代理、缓存、日志、监控、数据处理等等。

middleware/stats.js
```js
export default function (context) {
  context.userAgent = process.server ? context.req.headers['user-agent'] : navigator.userAgent
}
```

pages/index.vue
```js
export default {
  middleware: 'stats'
}
```

## nuxt路由生成策略

@nuxt/builder
```js
class Builder {
    async build() {
        ...
        // 检查文件目录是否存在
        await this.validatePages()
        // 生成路由并且产出模版文件 
        await this.generateRoutesAndFiles()
    }
    
    async generateRoutesAndFiles() {
        ...
        // 根据文件结构生成路由表
        await this.resolveRoutes(templateContext)
        // 产出模版文件
        await this.compileTemplates(templateContext)
    }
}
```
```txt
pages/
--| _slug/
-----| comments.vue
-----| index.vue
--| user/
-----| index.vue
-----| one.vue
--| index.vue
```
```js
router: {
  routes: [
    {
      name: 'index',
      path: '/',
      component: 'pages/index.vue'
    },
    {
      name: 'slug',
      path: '/:slug',
      component: 'pages/_slug/index.vue'
    },
    {
      name: 'slug-comments',
      path: '/:slug/comments',
      component: 'pages/_slug/comments.vue'
    },
    {
      name: 'user',
      path: '/user',
      component: 'pages/user/index.vue'
    },
    {
      name: 'user-one',
      path: '/user/one',
      component: 'pages/user/one.vue'
    }
  ]
}
```

动态路由组件中定义参数校验方法，见[nuxt的api属性和方法](#nuxt的api属性和方法)第8点

## nuxt缓存

1. 组件级别的缓存

  nuxt.config.js
  ```js
  const LRU = require('lru-cache')
  module.exports = {
    render: {
      bundleRenderer: {
        cache: LRU({
          max: 1000,                     // 最大的缓存个数
          maxAge: 1000 * 60 * 15        // 缓存15分钟
        })
      }
    }
  }
  ```
  在需做缓存的vue组件上增加name以及serverCacheKey字段，以确定缓存的唯一键值
  ```js
  export default {
    name: 'AppHeader',
    props: ['type'],
    serverCacheKey: props => props.type
  }
  ```

  新的请求到来时，只要父组件传下来的type属性之前处理过，就可以复用之前的渲染缓存结果，以增进性能

  如果该组件除了依赖父组件的type属性，还依赖于别的属性，serverCacheKey这里也要做出相应的改变，因此，如果组件依赖于很多的全局状态，或者，依赖的状态取值非常多，意味需要缓存会被频繁被设置而导致溢出，其实就没有多大意义了，在lru-cache的配置中，设置的最大缓存个数是1000，超出部分就会被清掉
  
  何时使用组件缓存?

  在以下情况，你不应该缓存组件：

  * 它具有可能依赖于全局状态的子组件。
  * 它具有对渲染上下文产生副作用(side effect)的子组件。

2. API级别的缓存

  在服务端渲染的场景中，往往会将请求放在服务端去做，渲染完页面再返回给浏览器，而有些接口是可以去做缓存的，比如单纯获取配置数据的接口，对接口的缓存可以加快每个请求的处理速度，更快地释放掉请求，从而增进性能

  ```js
  import axios from 'axios'
  import md5 from 'md5'
  import LRU from 'lru-cache'

  // 给api加3秒缓存
  const CACHED = LRU({
    max: 1000,
    maxAge: 1000 * 3
  })

  function request (config) {
    let key
    // 服务端才加缓存，浏览器端就不管了
    if (config.cache && !process.browser) {
      const { params = {}, data = {} } = config
      key = md5(config.url + JSON.stringify(params) + JSON.stringify(data))
      if (CACHED.has(key)) {
        // 缓存命中
        return Promise.resolve(CACHED.get(key))
      }
    }
    return axios(config)
      .then(rsp => {
        if (config.cache && !process.browser) {
          // 返回结果前先设置缓存
          CACHED.set(key, rsp.data)
        }
        return rsp.data
      })
  }

  const api = {
    getGames: params => request({
      url: '/gameInfo/gatGames',
      params,
      cache: true
    })
  }
  ```

3. 页面级别的缓存

  在不依赖于登录态以及过多参数的情况下，如果并发量很大，可以考虑使用页面级别的缓存， 在nuxt.config.js增加serverMiddleware属性

  ```js
  const nuxtPageCache = require('nuxt-page-cache')

  module.exports = {
    serverMiddleware: [
      nuxtPageCache.cacheSeconds(1, req => {
        if (req.query && req.query.pageType) {
          return req.query.pageType
        }
        return false
      })
    ]
  }
  ```

  上面的例子根据链接后面的参数pageType去做缓存，如果链接后面有pageType参数，就做缓存，缓存时间为1秒，也就是说在1秒内相同的pageType请求，服务端只会执行一次完整的渲染

  重新封装：如果缓存命中，直接将原先的计算结果返回，大大提供了性能
  ```js
  const LRU = require('lru-cache')

  let cacheStore = new LRU({
    max: 100,         // 设置最大的缓存个数
    maxAge: 200
  })

  module.exports.cacheSeconds = function (secondsTTL, cacheKey) {
    // 设置缓存的时间
    const ttl = secondsTTL * 1000
    return function (req, res, next) {
      // 获取缓存的key值
      let key = req.originalUrl
      if (typeof cacheKey === 'function') {
        key = cacheKey(req, res)
        if (!key) { return next() }
      } else if (typeof cacheKey === 'string') {
        key = cacheKey
      }

      // 如果缓存命中，直接返回
      const value = cacheStore.get(key)
      if (value) {
        return res.end(value, 'utf-8')
      }

      // 缓存原先的end方案
      res.original_end = res.end

      // 重写res.end方案，由此nuxt调用res.end实际上是调用该方法，
      res.end = function () {
        if (res.statusCode === 200) {
          // 设置缓存
          cacheStore.set(key, data, ttl)
        }
        // 最终返回结果
        res.original_end(data, 'utf-8')
      }
    }
  }
  ```

  另一种写法：

  1. 新建服务器端中间件处理缓存文件 ~/utils/server-middleware/pageCache.js(可结合上方代码修改)

  ```js
  const LRU = require('lru-cache');
  export const cachePage = new LRU({
    max: 100, // 缓存队列长度 最大缓存数量
    maxAge: 1000 * 60 * 180, // 缓存时间 单位：毫秒
  });
  export default function(req, res, next) {
    const url = req._parsedOriginalUrl;
    const pathname = url.pathname;
    // 本地开发环境不做页面缓存(也可开启开发环境进行调试)
    if (process.env.NODE_ENV !== 'development') {
      // 只有首页才进行缓存
      if (['/'].indexOf(pathname) > -1) {
        const existsHtml = cachePage.get('indexPage');
        if (existsHtml) {
          //  如果没有Content-Type:text/html 的 header，gtmetrix网站无法做测评
          res.setHeader('Content-Type', ' text/html; charset=utf-8');
          return res.end(existsHtml.html, 'utf-8');
        } else {
          res.original_end = res.end;
          res.end = function(data) {
            if (res.statusCode === 200) {
              // 设置缓存
              cachePage.set('indexPage', {
                html: data,
              });
            }
            res.original_end(data, 'utf-8');
          };
        }
      }
    }
    next();
  }
  ```

  2. nuxt.config.js
  ```js
  serverMiddleware: [
    {
      path: '/',
      handler: '~/utils/server-middleware/pageCache.js',
    },
  ]
  ```

  3. 清理缓存

  pageCahe.js
  ```js
  if (pathname === '/cleancache') {
    cachePage.reset();
    res.statusCode = 200;
  }
  ```
  nuxt.config.js中
  ```js
  {
    path: '/cleancache',
    handler: '~/utils/server-middleware/pageCache.js',
  },
  ```

## nuxt请求到渲染

  请求->服务器初始化->中间件运行(nuxt.config.js/匹配layout/匹配页面)->校验参数->异步数据处理(asyncData->beforeCreate->created->fetch)->客户端渲染->路由跳转nuxt-link回到中间件运行

  客户端渲染->vue生命周期(beforeMount后续)

## nuxt预渲染数据

  1. asyncData:可以在服务端执行async Data获取数据

    方法是在组件初始化前被调用的，并且是在服务端调用所以该方法是没有办法通过 this 来引用的，但可以传入第一个参数context来引用上下文

    ```html
    <template>
      <div class="container">
        <p>{{ result }}</p>
      </div>
    </template>
    <script>
    export default Vue.extend({
      async asyncData ({ app }) {
        // called every time before loading the component
        const response = await app.$axios.get('***')
        const result = response.data
        return { result }
      },
      data () {
        return {
          result: ''
        }
      }
    })
    </script>
    ```

    使用回调函数
    ```js
    export default {
      asyncData({ params }, callback) {
        axios.get(`https://my-api/posts/${params.id}`).then(res => {
          callback(null, { title: res.data.title })
        })
      }
    }
    ```

    返回对象:如果组件的数据不需要异步获取或处理，可以直接返回指定的字面对象作为组件的数据。
    ```js
    export default {
      data() {
        return { foo: 'bar' }
      }
    }
    ```

    使用 req/res(request/response) 对象:在服务器端调用asyncData时，可以访问用户请求的req和res对象。
    ```js
    export default {
      async asyncData({ req, res }) {
        // 请检查您是否在服务器端
        // 使用 req 和 res
        if (process.server) {
          return { host: req.headers.host }
        }

        return {}
      }
    }
    ```

    访问动态路由数据：如果你定义一个名为_slug.vue的文件，您可以通过context.params.slug来访问它。
    ```js
    export default {
      async asyncData({ params }) {
        const slug = params.slug // When calling /abc the slug will be "abc"
        return { slug }
      }
    }
    ```

    错误处理
    ```js
    export default {
      asyncData({ params, error }) {
        return axios
          .get(`https://my-api/posts/${params.id}`)
          .then(res => {
            return { title: res.data.title }
          })
          .catch(e => {
            error({ statusCode: 404, message: 'Post not found' })
          })
      }
    }
    ```
    ```js
    export default {
      asyncData({ params }, callback) {
        axios
          .get(`https://my-api/posts/${params.id}`)
          .then(res => {
            callback(null, { title: res.data.title })
          })
          .catch(e => {
            callback({ statusCode: 404, message: 'Post not found' })
          })
      }
    }
    ```

  2. fetch应对的是vuex

    fetch 是在组件实例化之后被调用的，可以访问到 this

    ```html
    <template>
      <h1>Stars: {{ $store.state.stars }}</h1>
    </template>

    <script>
      export default {
        fetch({ store, params }) {
          return axios.get('http://my-api/stars').then(res => {
            store.commit('setStars', res.data)
          })
        }
      }
    </script>

    <template>
      <h1>Stars: {{ $store.state.stars }}</h1>
    </template>

    <script>
      export default {
        async fetch({ store, params }) {
          await store.dispatch('GET_STARS')
        }
      }
    </script>

    //store/index.js
    export const actions = {
      async GET_STARS({ commit }) {
        const { data } = await axios.get('http://my-api/stars')
        commit('SET_STARS', data)
      }
    }
    ```

    可直接修改本地数据
    ```js
    export default {
      data() {
        return {
          todos: []
        };
      },
      async fetch() {
        const { data } = await axios.get(
          `https://jsonplaceholder.typicode.com/todos`
        );
        // `todos` has to be declared in data()
        this.todos = data;
      }
    };
    ```

    可以通过 methods 来调用
    ```html
    <button @click="$fetch">Refresh Data</button>
    <script>
    export default {
      methods: {
        refresh() {
          this.$fetch();
        }
      }
    };
    </script>
    ```

## nuxt的api属性和方法

1. 使用 head 方法设置当前页面的头部标签

```html
<template>
  <h1>{{ title }}</h1>
</template>

<script>
  export default {
    data() {
      return {
        title: 'Hello World!'
      }
    },
    head() {
      return {
        title: this.title,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'My custom description'
          }
        ]
      }
    }
  }
</script>
```

2. 设置内部router-view组件的key属性

```js
export default {
  key(route) {
    return route.fullPath
  }
}
```

3. layouts 根目录下的所有文件都属于个性化布局文件，可以在页面组件中利用 layout 属性来引用。

```js
export default {
  layout: 'blog',
  // 或
  layout(context) {
    return 'blog'
  }
}
```

4. loading:loading 属性提供了禁用特定页面上的默认加载进度条的选项。

默认情况下，Nuxt.js 使用自己的组件来显示路由跳转之间的进度条。

```html
<template>
  <h1>My page</h1>
</template>

<script>
  export default {
    loading: false
  }
</script>
```

5. 在应用中的特定页面设置中间件

pages/secret.vue
```html
<template>
  <h1>Secret page</h1>
</template>

<script>
  export default {
    middleware: 'authenticated'
  }
</script>
```

middleware/authenticated.js
```js
export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.authenticated) {
    return redirect('/login')
  }
}
```

6. scrollToTop 属性用于控制页面渲染前是否滚动至页面顶部

默认情况下，从当前页面切换至目标页面时，Nuxt.js 会让目标页面滚动至顶部。但是在嵌套子路由的场景下，Nuxt.js 会保持当前页面的滚动位置，除非在子路由的页面组件中将 scrollToTop 设置为 true。

```html
<template>
  <h1>子页面组件</h1>
</template>

<script>
  export default {
    scrollToTop: true
  }
</script>
```

7. 路由切换时的过渡动效

更多配置参考：[API: transition 属性](https://www.nuxtjs.cn/api/pages-transition)
```html
<transition name="test"></transition>
<transition name="test" mode="out-in"></transition>
<script>
export default {
  // 可以是字符
  transition: 'test'
  // 或对象
  transition: {
    name: 'test',
    mode: 'out-in'
  }
  // 或函数
  transition(to, from) {
    if (!from) {
      return 'slide-left'
    }
    return +to.query.page < +from.query.page ? 'slide-right' : 'slide-left'
  }
}
</script>
```

8. validate 方法可以在动态路由对应的页面组件中配置一个校验方法用于校验动态路由参数的有效性。

```js
validate({ params, query }) {
  return true // 如果参数有效
  return false // 参数无效，Nuxt.js 停止渲染当前页面并显示错误页面
}
```
```js
async validate({ params, query, store }) {
  // await operations
  return true // 如果参数有效
  return false // 将停止Nuxt.js呈现页面并显示错误页面
}
```
```js
validate({ params, query, store }) {
  return new Promise((resolve) => setTimeout(() => resolve()))
}
```
```js
export default {
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id)
  }
}
```
```js
export default {
  validate({ params, store }) {
    // 校验 `params.id` 是否存在
    return store.state.categories.some(category => category.id === params.id)
  }
}
```
```js
export default {
  async validate({ params, store }) {
    // 使用自定义消息触发内部服务器500错误
    throw new Error('Under Construction!')
  }
}
```

9. watchQuery属性,监听参数字符串更改并在更改时执行组件方法 (asyncData, fetch, validate, layout, ...)

```js
export default {
  //要为所有参数字符串设置监听，设置：watchQuery: true
  watchQuery: ['page']
}
```

## nuxt优化

1. splitChunks分包:chunk被切分，按需加载

nuxt.config.js
```js
module.exports = {
  build: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    }
  }
}
```

2. LodashModuleReplacementPlugin:lodash tree-shaking缩减大小

npm i -D lodash-webpack-plugin

nuxt.config.js
```js
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

module.exports = {
  build: {
    extend(config, ctx) {
			config.plugins.unshift(new LodashModuleReplacementPlugin)
			// rules[2].use[0] is babel-loader
			config.module.rules[2].use[0].options.plugins = ['lodash']
    }
  }
}
```

3. 缓存见[nuxt缓存](#nuxt缓存)

4. 其它webpack配置

由于有eslint检测，因此看不出优化后文件大小变化
```js
build: {
  transpile: [/^element-ui/], // babel编译指定模块
  // analyze: true,
  optimization: {
    minimize: true, // tree-shaking
    splitChunks: {
      chunks: 'all'
    } // 分包
  },
  parallel: true, // 多线程build，实验属性
  sourceMap: false, // 索源文件
  collapseBooleanAttributes: true,
  decodeEntities: true,
  minifyCSS: true,
  minifyJS: true,
  processConditionalComments: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: true,
  trimCustomFragments: true,
  useShortDoctype: true,
  /*
  ** You can extend webpack config here
  */
  extend (config, ctx) {

  }
}
```


## nuxt插件

/plugins/request-cache.js
```js
import axios from 'axios'
import LRU from 'lru-cache'

// 给api加3秒缓存
const CACHED = new LRU({
  max: 1000,
  maxAge: 1000
})

const request = (config) => {
  // 服务端才加缓存，浏览器端就不管了
  // if (config.cache && !process.browser) {}
  const { params = {}, data = {} } = config
  const key = config.method + config.url + JSON.stringify(params) + JSON.stringify(data)
  if (CACHED.has(key)) {
    // 缓存命中
    return Promise.resolve(CACHED.get(key))
  }
  return axios(config)
    .then((rsp) => {
      CACHED.set(key, rsp.data)
      return rsp.data
    })
}

// const callback = (string) => {
//   console.log('That was easy!', string)
// }

// 只注入服务端
// export default ({ app }, inject) => {
//   // Set the function directly on the context.app object
//   app.requestCache = callback
// }
// 注入服务端和浏览器端
export default ({ app }, inject) => {
  inject('requestCache', request)
}
```

vue页面使用
```js
async asyncData (context) {
  // called every time before loading the component
  let result = 'test'
  result = await context.app.$requestCache({
    method: 'get',
    url: 'https://***/api/values'
  })
  return { result }
}
```

## nuxt全局变量

/plugins/webconfig.js
```js
import Vue from 'vue' // vue 文件引入 - 方便在vue方法内容直接 this 调取

const urlPrefix = 'http://localhost:6666/'

const main = {
  install (Vue) {
    Vue.prototype.urlPrefix = urlPrefix // 变量的内容 后期可以在vue中 this->$api.xxx 使用
  }
}

Vue.use(main) // 这里不能丢

// 这里是 为了在 asyncData 方法中使用
export default ({ app }, inject) => {
  // Set the function directly on the context.app object
  app.$api = urlPrefix // 名称
}
```

nuxt.config.js
```js
{ src: '@/plugins/webconfig.js', ssr: false },
```

页面
```js
mounted () {
  console.log('mounted')
  this.prefix = (this as any).urlPrefix
},
```

## nuxt后端restfulApi

写法同koa2，在nuxt代码中穿插即可

错误日志样例：

/plugins/errorHandler.js
```js
import Vue from 'vue'
import axios from 'axios'

// 系统错误捕获
const getErr = async (err, _this, info) => {
  await axios.post('/api/getErr', { err: err.stack, hook: info })
}

const errorHandler = (error, vm, info) => {
  getErr(error, vm, info)
}

Vue.config.errorHandler = errorHandler
Vue.prototype.$throw = (error, vm, info) => errorHandler(error, vm, info)
```

nuxt.config.js
```js
plugins: [
  { src: '@/plugins/errorHandler.js', ssr: false }
],
```

index.vue
```js
created () {
  console.log('created')
  this.$axios.post('/api/getErr', { err: 'err.stack', hook: 'info' })
},
```

服务端index.js
```js
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const getErr = require('../utils/routes/api/getErr.js')
async function start () {
  ...
  //必须加入bodyparser、json中间件，才能获取ctx.request.body
  app.use(bodyparser())
  app.use(json())
  app.use(getErr.routes()).use(getErr.allowedMethods())
  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })
  ...
}
```

路由逻辑：/utils/routes/api/getErr.js
```js
const fs = require('fs')
const router = require('koa-router')()

router.post('/api/getErr', async (ctx, next) => {
  const time = new Date()
  fs.writeFile(
    './logs/' + time.getTime() + '.txt',
    '报错内容:' + ctx.request.body.err + '\r\n' +
    '所在钩子:' + ctx.request.body.hook + '\r\n' +
    '报错时间:' + time.toLocaleString() + '\r\n',
    (err) => {
      if (err) { throw err }
    })
  ctx.body = {
    e: ctx.request.body
  }
})

module.exports = router
```

## nuxt部署

生产环境文件:.nuxt node_modules server/ static/(看是否有资源文件引用，assets同理) middleware/(如在/server/index.js有引用) nuxt.config.js package.json

npm run build

npm run start 成功后改用pm2

pm2 start npm --name "nuxtExample" -- run start --watch

如果更新后不生效，可能pm2程序没彻底关闭，可执行如下命令：

lsof -i tcp:20001 查看pm2的pid，其中20001是我们配置的端口号，下面的PID为1037

COMMAND  PID USER   FD   TYPE    DEVICE SIZE/OFF NODE NAME
node    1037 

kill -9 {pid} pid是上面看到的pid