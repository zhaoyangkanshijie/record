# vue源码解读

于2020-02-21从https://github.com/vuejs/vue处clone的版本

* [目录结构](#目录结构)
* [初始化过程](#初始化过程)
* vue实例
    * [initMixin](#initMixin)
        * 合并option,统一数据格式
        * 初始化生命周期
        * 初始化事件
        * 初始化render(vdom相关)
        * 生命周期函数钩子callHook
        * 初始化依赖注入数据
            * defineReactive值变为响应式
                * dep依赖收集器
                * defineProperty/proxy劫持getter和setter
                * dep.subs 添加订阅者
                * dep.notify() 派发更新
        * 初始化state
            * 初始化props
            * 初始化methods
            * 初始化data
                * Observer给对象添加getter和setter
            * 初始化computed
                * dirty 
                * 延时watcher
            * 初始化watch
        * 初始化provide
        * $mount渲染函数

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

    [Vue源码学习系列03——Vue构造函数解析(一): 选项规范化(normalize)](https://blog.csdn.net/qq_25324335/article/details/88312316)

    [Vue源码学习系列04——Vue构造函数解析(二): 选项合并策略(optionMergeStrategies)](https://blog.csdn.net/qq_25324335/article/details/88312449)

    [Vue之event(事件)](https://www.jianshu.com/p/efc97de3989a)

    [Vue源码探究-虚拟DOM的渲染](https://segmentfault.com/a/1190000017231906)

    [Vue源码系列9------创建 VNode-----createElement](https://blog.csdn.net/refreeom/article/details/90236763)

    [Vue源码学习之initInjections和initProvide](https://blog.csdn.net/qq_34179086/article/details/88081602)

    [解读 Vue 之 Reactive](https://blog.csdn.net/qq3401247010/article/details/77131998)

    [Vue源码解读（十三）---派发更新](https://blog.csdn.net/guxin_duyin/article/details/102308813)

    [深入理解响应式原理（一）](https://blog.csdn.net/messizhao/article/details/103529315)

    [【vue】源码解析（2）vue中的监听器watcher用法](https://www.jianshu.com/p/7cd99f07fccf)

    [Vue $mount （解析 $mount 源码）](https://www.jianshu.com/p/402e712ab90f)

    [Vue编译器源码分析(三) -compileToFunctions的作用](https://zhuanlan.zhihu.com/p/87596719)

    [Vue编译器源码分析(四) - compile 解析](https://zhuanlan.zhihu.com/p/88105240)

    [Vue编译器源码分析(五) - AST 抽象语法树](https://zhuanlan.zhihu.com/p/88363312)

2. 详解

    * 原型挂载_init，传入的options是通过new Vue()传进来，值形如{render: h => h(App),}
    
    * _init绑定vue实例vm，定义_uid不断自增，标记_isVue避免被observer标记

    * 绑定$options，使用mergeOptions函数合并option(包含extend、mixins)，合并之后，可以获取$options.data访问Vue实例化传入的data

        1. mergeOptions(parent,children,vm)

            非生产环境下会遍历检查options.components合规的组件名：字母开头，不是内置标签和保留字

        2. props处理成相同的格式normalizeProps(child, vm)

            * props正确的配置如下
                ```vue
                props: ['name']
                props: {
                    name: String
                }
                props: {
                    name: {
                        type: String,
                        required: true
                    }
                }
                ```

            * 最终解析如下
                ```vue
                props: { name: { type: null }}
                props: { name: { type: String }}
                props: { name: { type: String, required: true }}
                ```

        3. inject处理成相同的格式normalizeInject(child, vm)

            * inject正确的配置如下
                ```vue
                inject: ['foo', 'bar']
                inject: {
                    foo: { default: 'hello' }
                }
                ```

            * 最终解析如下
                ```vue
                inject: { 'foo': {from: 'foo'}, 'bar': {from: 'bar'} }
                inject: { foo: {from: 'foo', default: 'hello'}}
                ```

        4. directives处理成相同的格式normalizeDirectives(child)

            * directives正确的配置如下
                ```vue
                directives: {
                    focus: {
                        inserted(){...},
                        update(){....}
                    },
                    remove(){....}
                }
                ```

            * 最终解析如下
                ```vue
                directives: {
                    focus: {
                        inserted(){...},
                        update(){....}
                    },
                    remove:{
                        bind(){...}
                        update(){...}
                    }
                }
                ```

        5. 对于extend和mixins，递归调用mergeOptions

        6. mergeField

            可以重写默认合并策略

    * 执行代理的过程initProxy(vm)，见/core/instance/proxy.js

        代理set、has、get检查代理对象名称是否合规（非保留字段）

    * 挂载vm._self = vm
        1. 初始化生命周期initLifecycle(vm)

            初始化一些属性，如$refs，_isMounte等

        2. 初始化事件initEvents(vm)

            创建_events空对象，如果存在监听器，就更新组件的监听器。(目前不存在监听器)
            
            更新具体为遍历on对象，拿到当前事件值cur和旧事件值old，对事件名执行normalizeEvent方法。
            
            如果old未定义，cur=on[name]=createFnInvoker(cur),即把on[name]指向createFnInvoker返回的值。接下来执行add(event.name,cur,event.once,event.capture,event.passive,event.params)方法。它就是通过addEventListener在真实dom上绑定事件了。

            createFnInvoker，最终会返回一个invoker函数。

            invoker函数，先拿到传进来的on[name]赋值给fns。如果它是一个数组，遍历它依次去执行其内定义的函数，否则直接执行fns，通过它创建了一个回调函数。

            如果old定义了且old和cur不相同，直接把old.fns指向cur，同时把on[name]指向old，我们只要把invoker.fns改变即可,不需要重新创建事件。

        3. 初始化组件render相关属性方法($createElement,$attrs,$listeners)initRender(vm)

            初始化虚拟DOM的渲染：

            * 初始化根虚拟节点、静态树节点、获取配置对象、设置父占位符节点、存储父节点上下文、将子虚拟节点转换成格式化的对象结构存储在实例的$slots属性、初始化$scopedSlots属性为空对象。

            * 为实例绑定渲染虚拟节点函数_c和$createElement，内部实际调用模板编译的渲染函数createElement，并获得恰当的渲染上下文，参数按顺序分别是：标签、数据、子节点、标准化类型、是否标准化标识

            * 对节点的属性和事件监听器进行状态观察

            关于创建虚拟节点函数_createElement(context, tag, data, children, normalizationType)

            * 参数解析：_createElement 方法有 5 个参数，context 表示 VNode 的上下文环境，它是 Component 类型；tag 表示标签，它可以是一个字符串，也可以是一个 Component；data 表示 VNode 的数据，它是一个 VNodeData 类型，可以在 flow/vnode.js 中找到它的定义；children 表示当前 VNode 的子节点，它是任意类型的，它接下来需要被规范为标准的 VNode 数组；normalizationType 表示子节点规范的类型，类型不同规范的方法也就不一样，它主要是参考 render 函数是编译生成的还是用户手写的。

            * vnode节点定义，参考/core/vdom/vnode.js,定义tag、data、children、text等属性

            * Virtual DOM 实际上是一个树状结构，每一个 VNode 可能会有若干个子节点，这些子节点应该也是 VNode 的类型，因此需要规范化children

                * normalizeChildren 方法的调用场景有 2 种，一个场景是 render 函数是用户手写的，当 children 只有一个节点的时候，Vue 允许用户把 children 写成基础类型用来创建单个简单的文本节点，这种情况会调用 createTextVNode 创建一个文本节点的 VNode；另一个场景是当编译 slot、v-for 的时候会产生嵌套数组的情况，会调用 normalizeArrayChildren 方法

                    * normalizeArrayChildren 递归遍历，解除嵌套，变成基础类型，通过 createTextVNode 方法转换成 VNode 类型，如果 children 是一个列表并且列表还存在嵌套的情况，则根据 nestedIndex 去更新它的 key，如果存在两个连续的 text节点，会把它们合并成一个 text 节点。经过对 children 的规范化，children 变成了一个类型为 VNode 的 Array。

                * simpleNormalizeChildren 方法调用场景是 render 函数是编译生成的。编译生成的 children 都已经是 VNode 类型的，但有一个例外，functional component 函数式组件返回的是一个数组而不是一个根节点，所以会通过 Array.prototype.concat 方法把整个 children 数组打平，让它的深度只有一层。

            * 规范化children后，对 tag 做判断，如果是 string 类型，创建一个普通 VNode，如果是为已注册的组件名，通过 createComponent 创建一个组件类型的 VNode，否则创建一个未知的标签的 VNode，最后返回一个vnode

        4. 调用beforeCreate生命周期callHook(vm, 'beforeCreate')

            执行callHook函数的时候，检查vm.$options[hook]是否存在，如hook为beforeCreate，如果存在就apply或call手写的函数逻辑

        5. 初始化依赖注入数据initInjections(vm)

            在初始化data/props之前被调用，主要作用是初始化vue实例的inject，处理的方法是resolveInejct。

            先建立一个存放结果的空对象，由于provide支持Symbols作为key，所以要对symbol和普通的对象进行不同的处理。

            通过vm的$parent循环向上查找provide中和inject对应的属性，直到查找到根组件或者找到为止，然后返回结果。

            结果传递给defineReactive处理。

            defineReactive 中的 Dep 是一个处理依赖关系的对象(依赖收集器)，具体实现在 core/observer/dep.js，Dep 主要起到连接 reactive data 与 watcher的作用，每一个 reactive data 的创建，都会随着创建一个 dep 实例。

            创建完 dep 实例后，通过 Observer 遍历data对象对每一个键值调用defineReactive 方法，再通过defineProperty劫持data的getter和setter。
            
            当 watcher 执行 getter 的时候，watcher 会被塞入 Dep.target，用来存放监听器里面的update()，然后通过调用 dep.depend() 方法，这个数据的 dep 就和 watcher 创建了连接，即把this存入subs数组中。

            创建连接之后，当 data 被更改，触发了 setter 就可以通过 dep.notify() 通知到所有与 data的dep 创建了关联的 watcher。从而让各个 watcher 做出响应。

            具体的update方法在src/core/observer/watcher.js，其派发更新的逻辑在 src/core/observer/scheduler.js 的queueWatcher(this)，其实现逻辑为：watcher 先添加到⼀个队列⾥，⽤ has 对象保证同⼀个 Watcher 只添加⼀次，通过 wating 保证对 nextTick(flushSchedulerQueue) 的调⽤逻辑只有⼀次，这样不会每次数据改变都触发 watcher 的回调。

            flushSchedulerQueue在对 queue 排序后，遍历拿到对应的 watcher ，执⾏ watcher.run()

            run 函数执⾏ this.get()获取当前的值，对于渲染 watcher ⽽⾔，它在执⾏ this.get() ⽅法求值的时候，会执⾏ getter ⽅法，把watcher移入渲染队列targetStack，排队更新视图，最后逐一清除队列元素，移除所有 subs 中的 watcer 的订阅,重新赋值。

        6. 初始化state(data,props,methods,watch,computed)

            判断vm.$options类型，对props，methods，data，computed，watch进行初始化。

            * props

                遍历定义的 props 配置,调用 defineReactive 方法把每个 prop 对应的值变成响应式，可以通过 vm._props.xxx 访问到定义 props 中对应的属性，响应式原理和过程见上方。

                通过 proxy 把 vm._props.xxx 的访问代理到 vm.xxx 上，此处与data同理，代码中，只需要访问this.xxx，而不需要访问vm._data.xxxx，具体实现为劫持get和set，把vm._props[sourceKey][key]变为vm[sourceKey][key]

            * methods

                遍历methods，检查函数名是否合规，合规的执行bind()函数

            * data

                遍历 data 函数返回对象，通过 proxy 把每一个值 vm._data.xxx 都代理到 vm.xxx 上，过程类似props。

                调用 observe 方法观测整个 data 的变化，位于src/core/observer/index.js，observe 方法的作用就是给非 VNode 的对象类型数据添加一个 Observer，如果已经添加过则直接返回，否则在满足一定条件下去实例化一个 Observer 对象实例。

                Observer 是一个类，它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新。其构造函数实例化 Dep 对象，执行 def 函数把自身实例添加到数据对象 value 的 \_\_ob\_\_ 属性上,如果value为数组，会调用 observeArray 方法，再次执行 observe，如果value是对象，调用 walk 方法遍历对象的 key 调用 defineReactive 方法

            * computed

                从vm.$options获取到computed的key和value，在非ssr模式下，watchers[key]创建watcher实例，以便依赖收集。

                创建完 watcher，就通过 Object.defineProperty 把 computed 的 key 挂载到 vm 上。

                在get中，调用 createComputed 方法，Gettercomputed data 的 watcher 是 lazy 的，当 computed data 中引用的 data 发生改变后，是不会立马重新计算值的，而只是标记一下 dirty 为 true，然后当这个 computed data 被引用的时候，上面的 getter 逻辑就会判断 watcher 是否为 dirty，如果是，就重新计算值。

                watcher.depend 收集 computed data 中用到的 data 的依赖，从而能够实现当 computed data 中引用的 data 发生更改时，也能触发到 render。

            * watch

                从vm.$options获取到watch的key和value，如果用户在option有设置watch则执行此方法，如果在methods有定义则执行此方法，否则则执行手写的watch方法$watch

                $watch位于/src/core/observer/watcher.js，第一个参数expOrFn是要监听的属性或方法，数据变化后后触发watcher的run()更新视图，原理在initInjections提及

        7. initProvide(vm)

            $options里的provide赋值到当前实例上。

        8. 调用created生命周期callHook(vm, 'created')

    * $mount渲染函数

        现分析位于dist/vue.js，还有其它版本dist/vue.esm.js,dist/vue.common.dev.js

        限制el不能挂载到 body、HTML 的跟节点上

        如果没有定义 render 方法，则会把 el 或者 options.template 字符串转成 render 方法，过程调用compileToFunctions

            * 函数参数

                参数1：模板字符串template

                参数2：选项对象

                    1/2 换行符或制表符做兼容处理
                    3/4 编译{{}}完整可用和是否保留html注释

            * 函数执行

                获取key，缓存字符串模板的编译结果，防止重复编译

                compile函数对模板进行编译，返回结果对象compiled

                    compile 的源码也位于vue.js中，方法createCompilerCreator

                    挂载配置选项到finalOptions，添加warn方法，收集错误信息到errors数组，收集提示信息到tips数组

                    baseCompile函数传入字符串模板(template)和最终的编译器选项(finalOptions)，通过抽象语法树来检查模板中是否存在错误表达式的，通过 detectErrors 函数实现，将compiled.ast 作为参数传递给 detectErrors 函数，该函数最终返回一个数组，该数组中包含了所有错误的收集

                    baseCompile 函数是在 createCompilerCreator 函数调用时传递的实参。
                    
                    里面 parse 方法会用正则等方式解析 template 模板中的指令、class、style等数据，形成AST

                        parseHTML 函数进行词法分析

                        

                    optimize 的主要作用是标记 static 静态节点，这是 Vue 在编译过程中的一处优化，后面当 update 更新界面时，会有一个 patch 的过程， diff 算法会直接跳过静态节点，从而减少了比较的过程，优化了 patch 的性能。

                    generate 方法生成目标平台所需的代码，将 AST 转化成 render function 字符串的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。

                    baseCompile最终返回了抽象语法树( ast )，渲染函数( render )，静态渲染函数( staticRenderFns )组成的对象

                在 res 对象上添加一个 render 属性，这个 render 属性，就是最终生成的渲染函数，它的值是通过 createFunction 创建出来的。

                    * 第一个参数 code 为函数体字符串，该字符串将通过new Function(code) 的方式创建为函数

                    * 第二个参数 errors 是一个数组，创建函数发生错误时用来收集错误

                res.staticRenderFns 是一个函数数组，是通过对compiled.staticRenderFns遍历生成的，说明：compiled 除了包含 render 字符串外，还包含一个字符串数组staticRenderFns ，且这个字符串数组最终也通过 createFunction 转为函数。staticRenderFns 的主要作用是渲染优化。



        最后调用原型上的 $mount 方法挂载