# vue2新手详解

## 参考教程

* [Vue.js 教程](https://cn.vuejs.org/v2/guide/)
* [基于vue-cli快速构建](https://www.jianshu.com/p/2769efeaa10a)
* [Vue2项目构建心得](https://www.jianshu.com/p/87a4fe7bf0b1)
* [vue-cli项目结构详解](https://blog.csdn.net/tanzhenyan/article/details/78871610)
* [Vue2.0 新手完全填坑攻略——从环境搭建到发布](https://www.jianshu.com/p/5ba253651c3b)
* [vue-cli#2.0项目结构分析](https://segmentfault.com/a/1190000007880723)

## 命令解析

1. 初始化项目：vue init \<template-name> \<project-name>

  template-name:

    * webpack-simple：一个简单webpack+vue-loader的模板，不包含其他功能。
    * browserify：一个全面的Browserify+vueify 的模板，功能包括热加载，linting,单元检测。
    * browserify-simple：一个简单Browserify+vueify的模板，不包含其他功能。
    * simple：一个最简单的单页应用模板。

2. 自动打开浏览器

在package.json中，修改："dev": "webpack-dev-server --inline --open --progress --config build/webpack.dev.conf.js"

## 知识点

### 项目架构

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
├── test/
|   └── unit/                        // 单元测试
|   |   ├── specs/                   // 测试规范
|   |   ├── index.js                 // 测试入口文件
|   |   └── karma.conf.js            // 测试运行配置文件
|   └── e2e/                         // 端到端测试
|   |   ├── specs/                   // 测试规范
|   |   ├── custom-assertions/       // 端到端测试自定义断言
|   |   ├── runner.js                // 运行测试的脚本
|   |   └── nightwatch.conf.js       // 运行测试的配置文件
|-- .babelrc                         // ES6语法编译配置
|-- .editorconfig                    // 定义代码格式
|-- .gitignore                       // git上传需要忽略的文件格式
|-- .postcsssrc                      // postcss配置文件
|-- README.md                        // 项目说明
|-- index.html                       // 入口页面
|-- package.json                     // 项目基本信息,包依赖信息等
```

* dependencies生产环境 与 devDependencies开发环境

    npm install 在安装 npm 包时，–save 会把依赖包名称添加到dependencies下，–save-dev 添加到devDependencies下。

### 语法基础

1. 新手注意事项
* 一个组件下只能有一个并列的div

正确
```html
<template>
    <div id="app">
        <div id="app-in">
            something
        </div>
    </div>
</template>
```

错误
```html
<template>
    <div id="app">
       something
    </div>
    <div id="app-in">
        something
    </div>
</template>
```

* 数据要写在 return 里面

正确
```html
<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
```

错误
```html
<script>
export default {
  name: 'HelloWorld',
  data () {
      msg: 'Welcome to Your Vue.js App'
  }
}
</script>
```

2. 注册组件
* 在src/components下新建{name}.vue,template、script、style按HelloWorld.vue随便写点内容
* 在其它任意vue文件内的script下import {name} from '{name}.vue的相对路径'，在export内新增：components: { {name} }，然后就可以在此vue文件的template内添加组件：<{name}></{name}>

3. 注册路由
* 取消url中的#号：mode: 'history'
* 按照path、name、component的格式写路由
* App.vue加入\<router-view/>实现路由，加入\<router-link to="/">...\</router-link>产生跳转链接
* 浏览器地址访问对应path，查看对应component页面

4. 父子级组件
* props：要让子组件使用父组件的数据，需要通过子组件的 props 选项

子组件利用props向父组件拿message和data的值，
```html
<template>
  <div id="syntaxchild">
    <div>{{message}}</div>
    <div>{{data}}</div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'syntaxchild',
  props:['message','data'],
  data () {
    return {
      
    }
  }
}
</script>
```
父组件返回静态message和动态data，:为v-bind:缩写，用于计算
```html
<template>
  <div class="syntax">
    <syntaxchild message="123" :data="message"></syntaxchild>
  </div>
</template>
<script>
import syntaxchild from '../components/syntaxchild.vue'
export default {
  name: 'syntax',
  data () {
    return {
      message: 'syntax ' + new Date().toLocaleString()
    }
  },
  components: { syntaxchild }
}
</script>
```

5. 生命周期
![avatar](lifeCycle.jpg)

```html
<script>
export default {
  name: 'syntax',
  data () {
    return {
      message: 'syntax ' + new Date().toLocaleString()
    }
  },
  created: function () {
    console.log('message is: ' + this.message)
  }
}
</script>
```

注意：
不要在选项属性或回调上使用箭头函数，比如 created: () => console.log(this.a) 或 vm.$watch('a', newValue => this.myMethod())。因为箭头函数是和父级上下文绑定在一起的，this 不会是如你所预期的 Vue 实例，经常导致 Uncaught TypeError: Cannot read property of undefined 或 Uncaught TypeError: this.myMethod is not a function 之类的错误。

6. prop

* 字符串数组
```js
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```
* 指定值类型对象
```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object
}
```
```html
<!-- 即便 `42` 是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:likes="42"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:likes="post.likes"></blog-post>

<!-- 包含该 prop 没有值的情况在内，都意味着 `true`。-->
<blog-post is-published></blog-post>

<!-- 即便 `false` 是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:is-published="false"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:is-published="post.isPublished"></blog-post>

<!-- 即便数组是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:comment-ids="post.commentIds"></blog-post>

<!-- 即便对象是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:author="{ name: 'Veronica', company: 'Veridian Dynamics' }"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:author="post.author"></blog-post>

```
* 单向数据流

所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。

额外的，每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。

这里有两种常见的试图改变一个 prop 的情形：

1. 这个 prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用。在这种情况下，最好定义一个本地的 data 属性并将这个 prop 用作其初始值：
```js
props: ['initialCounter'],
data: function () {
  return {
    counter: this.initialCounter
  }
}
```
2. 这个 prop 以一种原始的值传入且需要进行转换。在这种情况下，最好使用这个 prop 的值来定义一个计算属性：
```js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

* Prop 验证
```js
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 匹配任何类型)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组且一定会从一个工厂函数返回默认值
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

* 禁用特性继承

inheritAttrs: false
```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```

7. 过滤器
```js
{{ message | capitalize }}
{{ message | filterA | filterB }}
{{ message | filterA('arg1', arg2) }}
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

### 语法详解
1. 列表
* 数组更新检测
  * 能触发视图更新
    * 变异方法
      * push()
      * pop()
      * shift()
      * unshift()
      * splice()
      * sort()
      * reverse()
    * 替换方法
      * filter()
      * concat()
      * slice()
  * 不能触发视图更新
    * 索引直接设置一个项，vm.items[indexOfItem] = newValue
      * 更新方法：
        1. Vue.set(vm.items, indexOfItem, newValue)
        2. vm.items.splice(indexOfItem, 1, newValue)
    * 修改数组的长度，vm.items.length = newLength
      * 更新方法：
        1. vm.$set(vm.items, indexOfItem, newValue)//Vue.set的别名
        2. vm.items.splice(newLength)

```js
arr.items = arr.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```
Vue不会丢弃现有DOM后重新渲染整个列表，Vue为了使得 DOM 元素得到最大范围的重用而实现了一些智能的、启发式的方法，所以用一个含有相同元素的数组去替换原来的数组是非常高效的操作。

* 对象更新检测
  * 能触发视图更新
    * 在data中设置
    * Vue.set(vm.userProfile, 'age', 27) 或 vm.$set(vm.userProfile, 'age', 27)
    * 为已有对象赋予多个新属性，使用 Object.assign() 或 _.extend()

    错误：
    ```js
    Object.assign(vm.userProfile, {
      age: 27,
      favoriteColor: 'Vue Green'
    })
    ```
    正确：
    ```js
    vm.userProfile = Object.assign({}, vm.userProfile, {
      age: 27,
      favoriteColor: 'Vue Green'
    })
    ```

* 显示一个数组的过滤或排序副本，而不改变或重置原始数据
```html
<div v-for="n in evenNumbers" :key="n.index">{{ n }}</div>
<div v-for="n in even(numbers)" :key="n.index">{{ n }}</div>

<script>
  export default {
    data () {
      return {
        numbers: [ 1, 2, 3, 4, 5 ]
      }
    },
    computed: {
      evenNumbers: function () {
        return this.numbers.filter(function (number) {
          return number % 2 === 0
        })
      }
    },
    methods: {
      even: function (numbers) {
        return numbers.filter(function (number) {
          return number % 2 === 0
        })
      }
    }
  }
</script>
```

* 循环多个元素
```html
<ul v-for="n in numbers" :key="n.index">
  <li>{{ n }}</li>
  <li class="divider"></li>
</ul>
```

* 循环和条件并用

v-for 的优先级比 v-if 更高，这意味着 v-if 将分别重复运行于每个 v-for 循环中。
```html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```
```html
<ul v-if="todos.length">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
<p v-else>No todos left!</p>
```

2. 事件
* 事件修饰符
  * .stop
  * .prevent
  * .capture
  * .self
  * .once
  * .passive

```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a v-on:click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>

使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。
因此，用 v-on:click.prevent.self 会阻止所有的点击，
而 v-on:click.self.prevent 只会阻止对元素自身的点击。
```

* 按键修饰符
  * .enter
  * .tab
  * .delete (捕获“删除”和“退格”键)
  * .esc
  * .space
  * .up
  * .down
  * .left
  * .right

```html
<!-- 只有在 `keyCode` 是 13 时调用 `vm.submit()` -->
<input v-on:keyup.13="submit">

<!-- 同上 -->
<input v-on:keyup.enter="submit">

<!-- 缩写语法 -->
<input @keyup.enter="submit">

自定义按键修饰符别名
// 可以使用 `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112

<input @keyup.page-down="onPageDown">
```

* 系统修饰键
  * .ctrl
  * .alt
  * .shift
  * .meta

注意：在 Mac 系统键盘上，meta 对应 command 键 (⌘)。在 Windows 系统键盘 meta 对应 Windows 徽标键 (⊞)。在 Sun 操作系统键盘上，meta 对应实心宝石键 (◆)。在其他特定键盘上，尤其在 MIT 和 Lisp 机器的键盘、以及其后继产品，比如 Knight 键盘、space-cadet 键盘，meta 被标记为“META”。在 Symbolics 键盘上，meta 被标记为“META”或者“Meta”。

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

请注意修饰键与常规按键不同，在和 keyup 事件一起用时，事件触发时修饰键必须处于按下状态。换句话说，只有在按住 ctrl 的情况下释放其它按键，才能触发 keyup.ctrl。而单单释放 ctrl 也不会触发事件。如果你想要这样的行为，请为 ctrl 换用 keyCode：keyup.17。

* exact 修饰符
```html
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button @click.exact="onClick">A</button>
```

* 鼠标按钮修饰符
  * .left
  * .right
  * .middle

* v-model修饰符
  * .lazy

    在默认情况下，v-model 在每次 input 事件触发后将输入框的值与数据进行同步 (除了上述输入法组合文字时)。你可以添加 lazy 修饰符，从而转变为使用 change 事件进行同步：
    ```html
    <!-- 在“change”时而非“input”时更新 -->
    <input v-model.lazy="msg" >
    ```

  * .number

    如果想自动将用户的输入值转为数值类型，可以给 v-model 添加 number 修饰符：
    ```html
    <input v-model.number="age" type="number">
    ```

  * .trim

    如果要自动过滤用户输入的首尾空白字符，可以给 v-model 添加 trim 修饰符：
    ```html
    <input v-model.trim="msg">
    ```

* 将原生事件绑定到组件
.native对于根元素为input有效
```html
<base-input v-on:focus.native="onFocus"></base-input>
```
根元素不为input时失效，使用$listeners实现
```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```

* 对一个 prop 进行“双向绑定”
子组件
```js
this.$emit('update:title', newTitle)
```
父组件
```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```
为了方便起见，我们为这种模式提供一个缩写，即 .sync 修饰符：
```html
<text-document v-bind:title.sync="doc.title"></text-document>
```
一个对象同时设置多个 prop 的时候，也可以将这个 .sync 修饰符和 v-bind 配合使用：
```html
<text-document v-bind.sync="doc"></text-document>
```

3. 组件上的v-model
```html
<input v-model="searchText">
```
等价于
```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```
组件上
```html
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```
为了让它正常工作，这个组件内的 \<input> 必须：
* 将其 value 特性绑定到一个名叫 value 的 prop 上
* 在其 input 事件被触发时，将新的值通过自定义的 input 事件抛出

```js
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```
```html
<custom-input v-model="searchText"></custom-input>
```

一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件，但是像单选框、复选框等类型的输入控件可能会将 value 特性用于不同的目的。model 选项可以用来避免这样的冲突：
```js
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```
```html
<base-checkbox v-model="lovingVue"></base-checkbox>
```
这里的 lovingVue 的值将会传入这个名为 checked 的 prop。同时当 \<base-checkbox> 触发一个 change 事件并附带一个新的值的时候，这个 lovingVue 的属性将会被更新。

注意你仍然需要在组件的 props 选项里声明 checked 这个 prop。

4. 基础组件的自动化全局注册

许多组件只是包裹了一个输入框或按钮之类的元素，是相对通用的，它们会在各个组件中被频繁的用到,导致很多组件里都会有一个包含基础组件的长列表。

幸好如果你使用了 webpack (或在内部使用了 webpack 的 Vue CLI 3+)，那么就可以使用 require.context 只全局注册这些非常通用的基础组件。这里有一份可以让你在应用入口文件 (比如 src/main.js) 中全局导入基础组件的示例代码：

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 剥去文件名开头的 `./` 和结尾的扩展名
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})
```

5. 动态组件--关于多标签界面
组件切换时，若能保持状态，则能避免重复渲染的性能问题
```html
<component v-bind:is="currentTabComponent"></component>
```
改为
```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

6. 异步组件
我们把大型应用分割成小一些的代码块，并在需要时才从服务器加载一个模块，Vue 允许以工厂函数的方式定义组件，工厂函数会异步解析组件，Vue 只有在这个组件需要被渲染时才触发该工厂函数，且会把结果缓存起来供未来重渲染。例如：
```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```
工厂函数会收到一个 resolve 回调，它会在服务器得到组件定义时被调用，也可以调用 reject(reason) 来表示加载失败。这里的 setTimeout 是为了演示用的，如何获取组件取决于你自己。一个推荐的做法是将异步组件和 webpack 的 code-splitting 功能一起配合使用：
```js
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 `require` 语法将会告诉 webpack
  // 自动将你的构建代码切割成多个包，这些包
  // 会通过 Ajax 请求加载
  require(['./my-async-component'], resolve)
})
```
也可以使用promise
```js
Vue.component(
  'async-webpack-example',
  // 这个 `import` 函数会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```
当使用局部注册的时候，你也可以直接提供一个返回 Promise 的函数：
```js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```
异步组件工厂函数可以返回一个对象：
```js
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})
```

7. 访问元素 & 组件
* 访问根实例
```js
// Vue 根实例
new Vue({
  data: {
    foo: 1
  },
  computed: {
    bar: function () { /* ... */ }
  },
  methods: {
    baz: function () { /* ... */ }
  }
})
```
所有的子组件都可以将这个实例作为一个全局 store 来访问或使用。
```js
// 获取根组件的数据
this.$root.foo

// 写入根组件的数据
this.$root.foo = 2

// 访问根组件的计算属性
this.$root.bar

// 调用根组件的方法
this.$root.baz()
```
**对于 demo 或非常小型的有少量组件的应用来说这是很方便的。不过，在绝大多数情况下，我们强烈推荐使用 *【Vuex】* 来管理应用的状态。**

* 访问父级组件实例
$parent 属性可以用来从一个子组件访问父组件的实例。
```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```
```js
var map = this.$parent.map || this.$parent.$parent.map
```
**这样会导致失控，所以我们针对需要向任意更深层级的组件提供上下文信息时推荐使用 *【依赖注入】* 。**

* 访问子组件实例或子元素

通过 ref 特性为子组件赋予一个 ID 引用。
```html
<base-input ref="usernameInput"></base-input>
```
使用：
```js
this.$refs.usernameInput
```
可以通过其父级组件定义方法：
```js
methods: {
  // 用来从父级组件聚焦输入框
  focus: function () {
    this.$refs.input.focus()
  }
}
```
允许父级组件聚焦 <base-input> 里的输入框：
```js
this.$refs.usernameInput.focus()
```
当 ref 和 v-for 一起使用的时候，你得到的引用将会是一个包含了对应数据源的这些子组件的数组。
**注意：$refs 只会在组件渲染完成之后生效，并且它们不是响应式的，应该避免在模板或计算属性中访问 $refs。**

* 依赖注入
provide 选项允许指定想要提供给后代组件的数据/方法。
```js
provide: function () {
  return {
    getMap: this.getMap
  }
}
```
在任何后代组件里，我们都可以使用 inject 选项来接收指定想要添加在实例上的属性：
```js
inject: ['getMap']
```
相比 $parent 来说，依赖注入可以在任意后代组件中访问 getMap，而不需要暴露整个 <google-map> 实例，不需担心改变/移除子组件依赖的东西，同时这些组件之间的接口是始终明确定义的，就和 props 一样。祖先组件不需要知道哪些后代组件使用它提供的属性，后代组件不需要知道被注入的属性来自哪里。

8. 事件侦听器
Vue 实例同时在$emit接口中提供了其它的方法：
* 通过 $on(eventName, eventHandler) 侦听一个事件
* 通过 $once(eventName, eventHandler) 一次性侦听一个事件
* 通过 $off(eventName, eventHandler) 停止侦听一个事件

```js
mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```
甚至可以让多个输入框元素同时使用不同的 Pikaday
```js
mounted: function () {
  this.attachDatepicker('startDateInput')
  this.attachDatepicker('endDateInput')
},
methods: {
  attachDatepicker: function (refName) {
    var picker = new Pikaday({
      field: this.$refs[refName],
      format: 'YYYY-MM-DD'
    })

    this.$once('hook:beforeDestroy', function () {
      picker.destroy()
    })
  }
}
```

9. 循环引用
* 递归组件

组件是可以在它们自己的模板中调用自身的。不过它们只能通过 name 选项来做这件事,稍有不慎，递归组件就可能导致无限循环：
```js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```
* 组件之间的循环引用

两个组件互为对方的后代和祖先，引发错误Failed to mount component: template or render function not defined.
```html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```
```html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```
解决：
产生悖论的子组件是 <tree-folder-contents> 组件，所以等到生命周期钩子 beforeCreate 时去注册它
```js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}
```
可以使用 webpack 的异步 import：
```js
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```

10. 动画

Vue 在插入、更新或者移除 DOM 时，提供多种不同方式的应用过渡效果。
包括以下工具：

* 在 CSS 过渡和动画中自动应用 class
* 可以配合使用第三方 CSS 动画库，如 Animate.css
* 在过渡钩子函数中使用 JavaScript 直接操作 DOM
* 可以配合使用第三方 JavaScript 动画库，如 Velocity.js

(1) 单元素/组件的过渡

Vue 提供了 transition 的封装组件，可以在下列情形中给任何元素和组件添加进入/离开过渡:
* 条件渲染 (使用 v-if)
* 条件展示 (使用 v-show)
* 动态组件
* 组件根节点

过渡的类名:
* v-enter：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。
* v-enter-active：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。
* v-enter-to: 2.1.8版及以上 定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 v-enter 被移除)，在过渡/动画完成之后移除。
* v-leave: 定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
* v-leave-active：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
* v-leave-to: 2.1.8版及以上 定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 v-leave 被删除)，在过渡/动画完成之后移除。

![avatar](https://cn.vuejs.org/images/transition.png)

如果使用一个没有name的 \<transition>，则 v- 是这些类名的默认前缀。

如果你使用了 \<transition name="my-transition">，那么 v-enter 会替换为 my-transition-enter。

v-enter-active 和 v-leave-active 可以控制进入/离开过渡的不同的缓和曲线

自定义过渡的类名:
* enter-class
* enter-active-class
* enter-to-class (2.1.8+)
* leave-class
* leave-active-class
* leave-to-class (2.1.8+)

他们的优先级高于普通的类名，这对于 Vue 的过渡系统和其他第三方 CSS 动画库，如 Animate.css 结合使用十分有用。

过渡持续时间(ms)
```html
<transition :duration="1000">...</transition>
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

JavaScript 钩子

当只用 JavaScript 过渡的时候，在 enter 和 leave 中必须使用 done 进行回调。否则，它们将被同步调用，过渡会立即完成。

推荐对于仅使用 JavaScript 过渡的元素添加 v-bind:css="false"，Vue 会跳过 CSS 的检测。这也可以避免过渡过程中 CSS 的影响。
```html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```
```js
methods: {
  // --------
  // 进入中
  // --------

  beforeEnter: function (el) {
    // ...
  },
  // 此回调函数是可选项的设置
  // 与 CSS 结合时使用
  enter: function (el, done) {
    // ...
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },

  // --------
  // 离开时
  // --------

  beforeLeave: function (el) {
    // ...
  },
  // 此回调函数是可选项的设置
  // 与 CSS 结合时使用
  leave: function (el, done) {
    // ...
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled 只用于 v-show 中
  leaveCancelled: function (el) {
    // ...
  }
}
```

(2)初始渲染的过渡

可以通过 appear 特性设置节点在初始渲染的过渡
```html
<transition appear>
  <!-- ... -->
</transition>
```
这里默认和进入/离开过渡一样，同样也可以自定义 CSS 类名。
```html
<transition
  appear
  appear-class="custom-appear-class"
  appear-to-class="custom-appear-to-class" (2.1.8+)
  appear-active-class="custom-appear-active-class"
>
  <!-- ... -->
</transition>
```
自定义 JavaScript 钩子：
```html
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```

(3)多个元素的过渡

最常见的多标签过渡是一个列表和描述这个列表为空消息的元素：
```html
<transition>
  <table v-if="items.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Sorry, no items found.</p>
</transition>
```
可以这样使用，但是有一点需要注意：

当有相同标签名的元素切换时，需要通过 key 特性设置唯一的值来标记以让 Vue 区分它们，否则 Vue 为了效率只会替换相同标签内部的内容。即使在技术上没有必要，给在 \<transition> 组件中的多个元素设置 key 是一个更好的实践。

示例：
```html
<transition>
  <button v-if="isEditing" key="save">
    Save
  </button>
  <button v-else key="edit">
    Edit
  </button>
</transition>
```
在一些场景中，也可以通过给同一个元素的 key 特性设置不同的状态来代替 v-if 和 v-else，上面的例子可以重写为：
```html
<transition>
  <button v-bind:key="isEditing">
    {{ isEditing ? 'Save' : 'Edit' }}
  </button>
</transition>
```
使用多个 v-if 的多个元素的过渡可以重写为绑定了动态属性的单个元素过渡。例如：
```html
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Edit
  </button>
  <button v-if="docState === 'edited'" key="edited">
    Save
  </button>
  <button v-if="docState === 'editing'" key="editing">
    Cancel
  </button>
</transition>
```
可以重写为：
```html
<transition>
  <button v-bind:key="docState">
    {{ buttonMessage }}
  </button>
</transition>
// ...
computed: {
  buttonMessage: function () {
    switch (this.docState) {
      case 'saved': return 'Edit'
      case 'edited': return 'Save'
      case 'editing': return 'Cancel'
    }
  }
}
```

生效的进入和离开的过渡不能满足所有要求，所以 Vue 提供了 过渡模式
* in-out：新元素先进行过渡，完成之后当前元素过渡离开。
* out-in：当前元素先进行过渡，完成之后新元素过渡进入。

```html
<transition name="fade" mode="out-in">
  <!-- ... the buttons ... -->
</transition>
```

(4)多个组件的过渡
```html
<transition name="component-fade" mode="out-in">
  <component v-bind:is="view"></component>
</transition>
```
```js
new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  }
})
```
```css
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
```

(5)列表过渡

使用 \<transition-group> 组件：
* 不同于 \<transition>，它会以一个真实元素呈现：默认为一个 \<span>。你也可以通过 tag 特性更换为其他元素。
* 过渡模式不可用，因为我们不再相互切换特有的元素。
* 内部元素 总是需要 提供唯一的 key 属性值。

```html
<div id="list-demo" class="demo">
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" v-bind:key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
```

v-move 特性，它会在元素的改变定位的过程中应用。
```css
.flip-list-move {
  transition: transform 1s;
}
```

需要注意的是使用 FLIP 过渡的元素不能设置为 display: inline 。作为替代方案，可以设置为 display: inline-block 或者放置于 flex 中

(6)可复用的过渡

过渡可以通过 Vue 的组件系统实现复用。要创建一个可复用过渡组件，你需要做的就是将 \<transition> 或者 \<transition-group> 作为根组件，然后将任何子组件放置在其中就可以了。

```js
Vue.component('my-special-transition', {
  template: '\
    <transition\
      name="very-special-transition"\
      mode="out-in"\
      v-on:before-enter="beforeEnter"\
      v-on:after-enter="afterEnter"\
    >\
      <slot></slot>\
    </transition>\
  ',
  methods: {
    beforeEnter: function (el) {
      // ...
    },
    afterEnter: function (el) {
      // ...
    }
  }
})
```
函数组件更适合完成这个任务：
```js
Vue.component('my-special-transition', {
  functional: true,
  render: function (createElement, context) {
    var data = {
      props: {
        name: 'very-special-transition',
        mode: 'out-in'
      },
      on: {
        beforeEnter: function (el) {
          // ...
        },
        afterEnter: function (el) {
          // ...
        }
      }
    }
    return createElement('transition', data, context.children)
  }
})
```

(7)动态过渡

动态过渡最基本的例子是通过 name 特性来绑定动态值。

```html
<transition v-bind:name="transitionName">
  <!-- ... -->
</transition>
```

(8)状态过渡

对于数据元素本身的动效:
* 数字和运算
* 颜色的显示
* SVG 节点的位置
* 元素的大小和其他的属性

所有的原始数字都被事先存储起来，可以直接转换到数字，就可以结合 Vue 的响应式和组件系统，使用第三方库来实现切换元素的过渡状态。
* tween.js
* color-js

11. 混入

混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。

```js
// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
```

* 选项合并

当组件和混入对象含有同名选项时，这些选项将以恰当的方式混合。

比如，数据对象在内部会进行浅合并 (一层属性深度)，在和组件的数据发生冲突时以组件数据优先。
```js
var mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})
```
同名钩子函数将混合为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。
```js
var mixin = {
  created: function () {
    console.log('混入对象的钩子被调用')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('组件钩子被调用')
  }
})

// => "混入对象的钩子被调用"
// => "组件钩子被调用"
```
值为对象的选项，例如 methods, components 和 directives，将被混合为同一个对象。两个对象键名冲突时，取组件对象的键值对。
```js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
})

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```
注意：Vue.extend() 也使用同样的策略进行合并。

* 全局混入

也可以全局注册混入对象。一旦使用全局混入对象，将会影响到 所有 之后创建的 Vue 实例。使用恰当时，可以为自定义对象注入处理逻辑。
```js
// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// => "hello!"
```
谨慎使用全局混入对象，因为会影响到每个单独创建的 Vue 实例 (包括第三方模板)。大多数情况下，只应当应用于自定义选项，就像上面示例一样。也可以将其用作 Plugins 以避免产生重复应用

* 自定义选项合并策略

自定义选项将使用默认策略，即简单地覆盖已有值。如果想让自定义选项以自定义逻辑合并，可以向 Vue.config.optionMergeStrategies 添加一个函数：
```js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal
}
```
对于大多数对象选项，可以使用 methods 的合并策略：
```js
var strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```
更多高级的例子可以在 Vuex 的 1.x 混入策略里找到：
```js
const merge = Vue.config.optionMergeStrategies.computed
Vue.config.optionMergeStrategies.vuex = function (toVal, fromVal) {
  if (!toVal) return fromVal
  if (!fromVal) return toVal
  return {
    getters: merge(toVal.getters, fromVal.getters),
    state: merge(toVal.state, fromVal.state),
    actions: merge(toVal.actions, fromVal.actions)
  }
}
```

12. 自定义指令

当页面加载时，input获得焦点
```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
如果想注册局部指令，组件中也接受一个 directives 的选项：
```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```
```html
<input v-focus>
```

* 钩子函数

  * bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
  * inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  * update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
  * componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
  * unbind：只调用一次，指令与元素解绑时调用。

* 钩子函数参数

  * el：指令所绑定的元素，可以用来直接操作 DOM 。
  * binding：一个对象，包含以下属性：
  * name：指令名，不包括 v- 前缀。
  * value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
  * oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
  * expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
  * arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
  * modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
  * vnode：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
  * oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

除了 el 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行。

```html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
```
```js
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```
```txt
name:"demo"
value:"hello!"
expression:"message"
argument:"foo"
modifiers:{"a":true,"b":true}
vnode keys:tag,data,children,text,elm,ns,context,fnContext,fnOptions,fnScopeld,key,componentOptions,componentInstance,parent,raw,isStatic,isRootInsert,isComment,isCloned,isOnce,asyncFactory,asyncMeta,isAsyncPlaceholder
```

* 函数简写

在很多时候，你可能想在 bind 和 update 时触发相同行为，而不关心其它的钩子。比如这样写:
```js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

* 对象字面量

如果指令需要多个值，可以传入一个 JavaScript 对象字面量。记住，指令函数能够接受所有合法的 JavaScript 表达式。
```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```
```js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```

13. 渲染函数 & JSX

使用场景：
```html
<anchored-heading :level="1">Hello world!</anchored-heading>
```
```html
<template>
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
</template>
```
```js
Vue.component('anchored-heading', {
  template: '#anchored-heading-template',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```
改写：
```jsx
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // tag name 标签名称
      this.$slots.default // 子组件中的阵列
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

* createElement 参数
```js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签字符串，组件选项对象，或者
  // 解析上述任何一种的一个 async 异步函数，必要参数。
  'div',

  // {Object}
  // 一个包含模板相关属性的数据对象
  // 这样，您可以在 template 中使用这些属性。可选参数。
  {
    // (详情见下一节)
  },

  // {String | Array}
  // 子节点 (VNodes)，由 `createElement()` 构建而成，
  // 或使用字符串来生成“文本节点”。可选参数。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

* data 对象
```js
{
  // 和`v-bind:class`一样的 API
  // 接收一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 和`v-bind:style`一样的 API
  // 接收一个字符串、对象或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 正常的 HTML 特性
  attrs: {
    id: 'foo'
  },
  // 组件 props
  props: {
    myProp: 'bar'
  },
  // DOM 属性
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器基于 `on`
  // 所以不再支持如 `v-on:keyup.enter` 修饰器
  // 需要手动匹配 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅对于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  // 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 作用域插槽格式
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其他组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其他特殊顶层属性
  key: 'myKey',
  ref: 'myRef'
}
```

示例：
```js
var getChildrenTextContent = function (children) {
  return children.map(function (node) {
    return node.children
      ? getChildrenTextContent(node.children)
      : node.text
  }).join('')
}

Vue.component('anchored-heading', {
  render: function (createElement) {
    // 创建 kebabCase 风格的ID
    var headingId = getChildrenTextContent(this.$slots.default)
      .toLowerCase()
      .replace(/\W+/g, '-')
      .replace(/(^\-|\-$)/g, '')

    return createElement(
      'h' + this.level,
      [
        createElement('a', {
          attrs: {
            name: headingId,
            href: '#' + headingId
          }
        }, this.$slots.default)
      ]
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

约束:

VNodes 必须唯一

组件树中的所有 VNodes 必须是唯一的。这意味着，下面的 render function 是无效的：
```jsx
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // 错误-重复的 VNodes
    myParagraphVNode, myParagraphVNode
  ])
}
```
如果你真的需要重复很多次的元素/组件，你可以使用工厂函数来实现。例如，下面这个例子 render 函数完美有效地渲染了 20 个重复的段落：
```jsx
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

使用render,会失去v-if，v-for，v-model，代替方法：
```jsx
props: ['items'],
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'No items found.')
  }
}
```
```jsx
props: ['value'],
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

* 事件 & 按键修饰符

对于 .passive、.capture 和 .once事件修饰符, Vue 提供了相应的前缀可以用于 on：

|Modifier(s)|	Prefix|
|---|---|
|.passive|&|
|.capture|!|
|.once|~|
|.capture.once .once.capture|~!|
|.stop|event.stopPropagation()|
|.prevent|event.preventDefault()|
|.self|if (event.target !== event.currentTarget) return|
|Keys:.enter, .13|if (event.keyCode !== 13) return (change 13 to another key code for other key modifiers)|
|Modifiers Keys:.ctrl, .alt, .shift, .meta|if (!event.ctrlKey) return (change ctrlKey to altKey, shiftKey, or metaKey, respectively)|

例如:
```jsx
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
}

on: {
  keyup: function (event) {
    // 如果触发事件的元素不是事件绑定的元素
    // 则返回
    if (event.target !== event.currentTarget) return
    // 如果按下去的不是 enter 键或者
    // 没有同时按下 shift 键
    // 则返回
    if (!event.shiftKey || event.keyCode !== 13) return
    // 阻止 事件冒泡
    event.stopPropagation()
    // 阻止该元素默认的 keyup 事件
    event.preventDefault()
    // ...
  }
}
```

* 插槽

你可以从 this.$slots 获取 VNodes 列表中的静态内容：
```jsx
render: function (createElement) {
  // `<div><slot></slot></div>`
  return createElement('div', this.$slots.default)
}
```
还可以从 this.$scopedSlots 中获得能用作函数的作用域插槽，这个函数返回 VNodes：
```jsx
props: ['message'],
render: function (createElement) {
  // `<div><slot :text="message"></slot></div>`
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.message
    })
  ])
}
```
如果要用渲染函数向子组件中传递作用域插槽，可以利用 VNode 数据中的 scopedSlots 域：
```jsx
render: function (createElement) {
  return createElement('div', [
    createElement('child', {
      // pass `scopedSlots` in the data object
      // in the form of { name: props => VNode | Array<VNode> }
      scopedSlots: {
        default: function (props) {
          return createElement('span', props.text)
        }
      }
    })
  ])
}
```

* 函数式组件

```jsx
Vue.component('my-component', {
  functional: true,
  // Props 可选
  props: {
    // ...
  },
  // 为了弥补缺少的实例
  // 提供第二个参数作为上下文
  render: function (createElement, context) {
    // ...
  }
})
```

  组件需要的一切都是通过上下文传递，包括：

  * props：提供所有 prop 的对象
  * children: VNode 子节点的数组
  * slots: 返回所有插槽的对象的函数
  * data：传递给组件的数据对象，作为 createElement 的第二个参数传入组件
  * parent：对父组件的引用
  * listeners: (2.3.0+) 一个包含了所有在父组件上注册的事件侦听器的对象。这只是一个指向 data.on 的别名。
  * injections: (2.3.0+) 如果使用了 inject 选项，则该对象包含了应当被注入的属性。

依赖传入 props 的值的 smart-list 组件例子
```jsx
var EmptyList = { /* ... */ }
var TableList = { /* ... */ }
var OrderedList = { /* ... */ }
var UnorderedList = { /* ... */ }

Vue.component('smart-list', {
  functional: true,
  props: {
    items: {
      type: Array,
      required: true
    },
    isOrdered: Boolean
  },
  render: function (createElement, context) {
    function appropriateListComponent () {
      var items = context.props.items

      if (items.length === 0)           return EmptyList
      if (typeof items[0] === 'object') return TableList
      if (context.props.isOrdered)      return OrderedList

      return UnorderedList
    }

    return createElement(
      appropriateListComponent(),
      context.data,
      context.children
    )
  }
})
```

* 向子元素或子组件传递特性和事件

```jsx
Vue.component('my-functional-button', {
  functional: true,
  render: function (createElement, context) {
    // 完全透明的传入任何特性、事件监听器、子结点等。
    return createElement('button', context.data, context.children)
  }
})
```

14. 插件

插件通常会为 Vue 添加全局功能。插件的范围没有限制——一般有下面几种：

* 添加全局方法或者属性，如: vue-custom-element
* 添加全局资源：指令/过滤器/过渡等，如 vue-touch
* 通过全局 mixin 方法添加一些组件选项，如: vue-router
* 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。
* 一个库，提供自己的 API，同时提供上面提到的一个或多个功能，如 vue-router

Vue.js 的插件应当有一个公开方法 install 。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象：
```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

通过全局方法 Vue.use() 使用插件：
```js
// 调用 `MyPlugin.install(Vue)`
// 用 Browserify 或 webpack 提供的 CommonJS 模块环境时
var Vue = require('vue')
var VueRouter = require('vue-router')

// 不要忘了调用此方法
Vue.use(VueRouter)
//也可以传入一个选项对象：
Vue.use(MyPlugin, { someOption: true })
```

15. 单元测试

* 简单的断言

你不必为了可测性在组件中做任何特殊的操作，导出原始设置就可以了：
```html
<template>
  <span>{{ message }}</span>
</template>

<script>
  export default {
    data () {
      return {
        message: 'hello!'
      }
    },
    created () {
      this.message = 'bye!'
    }
  }
</script>
```
然后随着 Vue 导入组件的选项，你可以使用许多常见的断言：
```js
// 导入 Vue.js 和组件，进行测试
import Vue from 'vue'
import MyComponent from 'path/to/MyComponent.vue'

// 这里是一些 Jasmine 2.0 的测试，你也可以使用你喜欢的任何断言库或测试工具。

describe('MyComponent', () => {
  // 检查原始组件选项
  it('has a created hook', () => {
    expect(typeof MyComponent.created).toBe('function')
  })

  // 评估原始组件选项中的函数的结果
  it('sets the correct default data', () => {
    expect(typeof MyComponent.data).toBe('function')
    const defaultData = MyComponent.data()
    expect(defaultData.message).toBe('hello!')
  })

  // 检查 mount 中的组件实例
  it('correctly sets the message when created', () => {
    const vm = new Vue(MyComponent).$mount()
    expect(vm.message).toBe('bye!')
  })

  // 创建一个实例并检查渲染输出
  it('renders the correct message', () => {
    const Constructor = Vue.extend(MyComponent)
    const vm = new Constructor().$mount()
    expect(vm.$el.textContent).toBe('bye!')
  })
})
```

* 编写可被测试的组件

很多组件的渲染输出由它的 props 决定。事实上，如果一个组件的渲染输出完全取决于它的 props，那么它会让测试变得简单，就好像断言不同参数的纯函数的返回值。看下面这个例子：
```html
<template>
  <p>{{ msg }}</p>
</template>

<script>
  export default {
    props: ['msg']
  }
</script>
```

你可以在不同的 props 中，通过 propsData 选项断言它的渲染输出：
```js
import Vue from 'vue'
import MyComponent from './MyComponent.vue'

// 挂载元素并返回已渲染的文本的工具函数
function getRenderedText (Component, propsData) {
  const Constructor = Vue.extend(Component)
  const vm = new Constructor({ propsData: propsData }).$mount()
  return vm.$el.textContent
}

describe('MyComponent', () => {
  it('renders correctly with different props', () => {
    expect(getRenderedText(MyComponent, {
      msg: 'Hello'
    })).toBe('Hello')

    expect(getRenderedText(MyComponent, {
      msg: 'Bye'
    })).toBe('Bye')
  })
})
```

* 断言异步更新

由于 Vue 进行 异步更新 DOM 的情况，一些依赖 DOM 更新结果的断言必须在 Vue.nextTick 回调中进行：
```js
// 在状态更新后检查生成的 HTML
it('updates the rendered message when vm.message updates', done => {
  const vm = new Vue(MyComponent).$mount()
  vm.message = 'foo'

  // 在状态改变后和断言 DOM 更新前等待一刻
  Vue.nextTick(() => {
    expect(vm.$el.textContent).toBe('foo')
    done()
  })
})
```

15. vuex状态管理

每一个 Vuex 应用的核心就是 store（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的状态 (state)。Vuex 和单纯的全局对象有以下两点不同：

Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

* 数据共享

当 sourceOfTruth 发生变化，vmA 和 vmB 都将自动的更新引用它们的视图。子组件们的每个实例也会通过 this.$root.$data 去访问。(不方便调试)

```js
const sourceOfTruth = {}

const vmA = new Vue({
  data: sourceOfTruth
})

const vmB = new Vue({
  data: sourceOfTruth
})
```

* store 模式

```js
var store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}
```

如果在模块化构建系统中，请确保在开头调用了 Vue.use(Vuex)
```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```
```js
store.commit('increment')

console.log(store.state.count) // -> 1
```

* 在 Vue 组件中获得 Vuex 状态
```js
// 创建一个 Counter 组件
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

* mapState 辅助函数

当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

* Getter

```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

通过属性访问,Getter 会暴露为 store.getters 对象，可以以属性的形式访问这些值：
```js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
Getter 也可以接受其他 getter 作为第二个参数：

getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
store.getters.doneTodosCount // -> 1
```
我们可以很容易地在任何组件中使用它：
```js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

通过方法访问,让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。
```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

mapGetters 辅助函数将 store 中的 getter 映射到局部计算属性：
```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

* Mutation

更改 Vuex 的 store 中的状态的唯一方法

提交载荷（Payload）

你可以向 store.commit 传入额外的参数，即 mutation 的 载荷（payload）：
```js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
store.commit('increment', 10)
```
在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读：
```js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
store.commit('increment', {
  amount: 10
})
```
```js
store.commit({
  type: 'increment',
  amount: 10
})
```

Mutation 必须是同步函数

我们正在 debug 一个 app 并且观察 devtool 中的 mutation 日志。每一条 mutation 被记录，devtools 都需要捕捉到前一状态和后一状态的快照。然而，异步函数中的回调让这不可能完成：因为当 mutation 触发的时候，回调函数还没有被调用，devtools 不知道什么时候回调函数实际上被调用——实质上任何在回调函数中进行的状态的改变都是不可追踪的。

在组件中提交 Mutation
```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

* Action

Action 类似于 mutation，不同在于：

1. Action 提交的是 mutation，而不是直接变更状态。
2. Action 可以包含任意异步操作。

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```
Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。

```js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

分发 Action
```js
store.dispatch('increment')
```

在 action 内部执行异步操作
```js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

载荷方式和对象方式
```js
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

购物车示例
```js
actions: {
  checkout ({ commit, state }, products) {
    // 把当前购物车的物品备份起来
    const savedCartItems = [...state.cart.added]
    // 发出结账请求，然后乐观地清空购物车
    commit(types.CHECKOUT_REQUEST)
    // 购物 API 接受一个成功回调和一个失败回调
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失败操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

在组件中分发 Action
```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

组合 Action

action1
```js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

```js
store.dispatch('actionA').then(() => {
  // ...
})
```
action2
```js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```
组合
```js
actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

* Module

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：

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

模块的局部状态
```js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++
    }
  },

  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  },

  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

命名空间

默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。

如果希望模块具有更高的封装度和复用性，可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

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

在带命名空间的模块内访问全局内容

若需要在全局命名空间内分发 action 或提交 mutation，将 { root: true } 作为第三参数传给 dispatch 或 commit 即可。

```js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // 在这个模块的 getter 中，`getters` 被局部化了
      // 你可以使用 getter 的第四个参数来调用 `rootGetters`
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // 在这个模块中， dispatch 和 commit 也被局部化了
      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

在带命名空间的模块注册全局 action

若需要在带命名空间的模块注册全局 action，你可添加 root: true，并将这个 action 的定义放在函数 handler 中。

```js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

带命名空间的绑定函数
```js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo',
    'some/nested/module/bar'
  ])
}
```

可以通过使用 createNamespacedHelpers 创建基于某个命名空间辅助函数。它返回一个对象，对象里有新的绑定在给定命名空间值上的组件绑定辅助函数：

```js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // 在 `some/nested/module` 中查找
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // 在 `some/nested/module` 中查找
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

如果你开发的插件（Plugin）提供了模块并允许用户将其添加到 Vuex store，可能需要考虑模块的空间名称问题。对于这种情况，你可以通过插件的参数对象来允许用户指定空间名称：

```js
// 通过插件的参数对象得到空间名称
// 然后返回 Vuex 插件函数
export function createPlugin (options = {}) {
  return function (store) {
    // 把空间名字添加到插件模块的类型（type）中去
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

模块动态注册
```js
// 注册模块 `myModule`
store.registerModule('myModule', {
  // ...
})
// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

模块重用
```js
const MyReusableModule = {
  state () {
    return {
      foo: 'bar'
    }
  },
  // mutation, action 和 getter 等等...
}
```

总结

```js
const store = new Vuex.Store({
    state: {
        name: 'weish',
        age: 22
    },
    getters: {
        personInfo(state) {
            return `My name is ${state.name}, I am ${state.age}`;
        }
    }
    mutations: {
        SET_AGE(state, age) {
            commit(age, age);
        }
    },
    actions: {
        nameAsyn({commit}) {
            setTimeout(() => {
                commit('SET_AGE', 18);
            }, 1000);
        }
    },
    modules: {
        a: modulesA
    }
}
```

vuex 包含有五个基本的对象：

* state：存储状态。也就是变量；
* getters：派生状态。也就是set、get中的get，有两个可选参数：state、getters分别可以获取state中的变量和其他的getters。外部调用方式：store.getters.personInfo()。就和vue的computed差不多；
* mutations：提交状态修改。也就是set、get中的set，这是vuex中唯一修改state的方式，但不支持异步操作。第一个参数默认是state。外部调用方式：store.commit('SET_AGE', 18)。和vue中的methods类似。
* actions：和mutations类似。不过actions支持异步操作。第一个参数默认是和store具有相同参数属性的对象。外部调用方式：store.dispatch('nameAsyn')。
* modules：store的子模块，内容就相当于是store的一个实例。调用方式和前面介绍的相似，只是要加上当前子模块名，如：store.a.getters.xxx()。

├── index.html
├── main.js
├── components
└── store
    ├── index.js          # 我们组装模块并导出 store 的地方
    ├── state.js          # 跟级别的 state
    ├── getters.js        # 跟级别的 getter
    ├── mutation-types.js # 根级别的mutations名称（官方推荐mutions方法名使用大写）
    ├── mutations.js      # 根级别的 mutation
    ├── actions.js        # 根级别的 action
    └── modules
        ├── m1.js         # 模块1
        └── m2.js         # 模块2

16. 数据请求

* $http请求服务

vue中的$http服务，需要引入vue-resource.js
```js
this.$http.get('url',{
        param1:value1,  
        param2:value2  
    }).then(function(response){  
        // response.data中获取ResponseData实体
    },function(response){  
        // 发生错误
    });

this.$http.post('url',{  
        param1:value1,  
        param2:value2  
    },{  
        emulateJSON:true  
    }).then(function(response){  
        // response.data中获取ResponseData实体
    },function(response){  
        // 发生错误
    });
```

* axios

```js
axios.get('url', {
        params: {
            param1: value1,
            param2:value2
        }
    }).then(function (response) {
        // response.data中获取ResponseData实体
    }).catch(function (error) {
        // 发生错误
    });

axios.post('/user', {
        firstName: 'Fred',
        lastName: 'Flintstone'
    }).then(function (response) {
        // response.data中获取ResponseData实体
    }).catch(function (error) {
        // 发生错误
    });
```

方案一：改写原型链

首先在 main.js 中引入 axios
```js
import axios from 'axios'
```
这时候如果在其它的组件中，是无法使用 axios 命令的。但如果将 axios 改写为 Vue 的原型属性，就能解决这个问题
```js
Vue.prototype.$ajax = axios
```
在 main.js 中添加了这两行代码之后，就能直接在组件的 methods 中使用 $ajax 命令

```js
methods: {
  submitForm () {
    this.$ajax({
      method: 'post',
      url: '/user',
      data: {
        name: 'wise',
        info: 'wrong'
      }
   })
}
```

方案二：在 Vuex 中封装

```js
actions: {
    // 封装一个 ajax 方法
    saveForm (context) {
      axios({
        method: 'post',
        url: '/user',
        data: context.state.test02
      })
    }
  }
```

* jquery

```js
import jquery from 'jquery'

$.ajax({
    url:'url',
    type:'POST', //GET、PUT、DELETE
    async:true,    //是否异步
    data:{
        name:'zhang',
        age:28
    },
    timeout:5000,    //超时时间
    dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
    beforeSend:function(xhr){
        // 发送前处理
    },
    success:function(data,textStatus,jqXHR){
        // 调用成功，解析response中的data到自定义的data中
    },
    error:function(xhr,textStatus){
        // 调用时，发生错误
    },
    complete:function(){
        // 交互后处理
    }
})
```

17. 路由对象

$route为当前router跳转对象里面可以获取name、path、query、params等

* $route.path 

字符串，等于当前路由对象的路径，会被解析为绝对路径，如 "/home/news" 。

* $route.params 

对象，包含路由中的动态片段和全匹配片段的键值对

* $route.query 

对象，包含路由中查询参数的键值对。例如，对于 /home/news/detail/01?favorite=yes ，会得到$route.query.favorite == 'yes' 。

* $route.router 

路由规则所属的路由器（以及其所属的组件）。

* $route.matched 

数组，包含当前匹配的路径中所包含的所有片段所对应的配置参数对象。

* $route.name 

当前路径的名字，如果没有使用具名路径，则名字为空。


$router为VueRouter实例，想要导航到不同URL，则使用$router.push方法

返回上一个history也是使用$router.go方法
