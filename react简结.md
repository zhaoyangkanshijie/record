# react简结

* [react-cli项目构建](#react-cli项目构建)
* [react项目结构](#react项目结构)
* [react指令](#react指令)
* [react生命周期](#react生命周期)
* [react数据绑定原理](#react数据绑定原理)
* [请求后台资源](#请求后台资源)
* [react路由](#路由)
* [父子组件通信](#父子组件通信)
* [页面传参与获取](#页面传参与获取)
* [redux](#redux)
* [使用cookie](#使用cookie)
* [拦截器](#拦截器)

## react-cli项目构建

1. 参考链接

    [react创建项目](https://www.jianshu.com/p/38e7fa41a4d5)

    [react+ts 快速创建项目](https://www.jianshu.com/p/5ebcf0dda9ec)

    [React ts 项目搭建](https://blog.csdn.net/BradyCC/article/details/104543817)

2. 详解

    * 创建项目

        npm install create-react-app -g

        create-react-app 项目名 

        (或：npx create-react-app 项目名 --template typescript)

        cd 项目名

        npm install

        npm start

    * 其它依赖安装

        npm install react-router-dom react-redux redux antd node-sass sass-loader axios lodash whatwg-fetch es6-promise

        import正确即可用

## react项目结构

1. 参考链接

    [从零开始一步一步搭建Typescript+React+Redux项目——创建项目结构（一）](https://www.jianshu.com/p/1798094ea2eb)

2. 详解

    ```txt
    /src
        /assets
            /images
        /components
        /pages
        /redux
        /sass
        /test
        app、index等入口文件
    ```

## react指令

## react生命周期

1. 参考链接

    [详解React生命周期(包括react16最新版)](https://www.jianshu.com/p/514fe21b9914)

    [我对 React V16.4 生命周期的理解](https://juejin.im/post/5ef6018be51d45348e278a46)

2. 详解

    * React 在 V16.3 版本中，为下面三个生命周期函数加上了 UNSAFE：

        * UNSAFE_componentWillMount

            此处ajax的结果一定赶不上render，ajax应放在componentDidMount中

            服务器端渲染，ajax会被执行多次，也应放在componentDidMount中

            有人会将事件监听器（或订阅）添加到 UNSAFE_componentWillMount 中，但这可能导致服务器渲染（永远不会调用 componentWillUnmount）和异步渲染（在渲染完成之前可能被中断，导致不调用 componentWillUnmount）的内存泄漏

        * UNSAFE_componentWillReceiveProps

            有时候组件在 props 发生变化时会产生多次调用问题，应该使用 componentDidUpdate

        * UNSAFE_componentWillUpdate

            在异步模式下使用 UNSAFE_componentWillUpdate 都是不安全的，因为外部回调可能会在一次更新中被多次调用，应该使用 componentDidUpdate

        V17删除以上生命周期

        V16前后区别：由同步渲染改为异步渲染(fiber机制)

    * React 在 V16.3 版本中，新增了两个生命周期函数：

        * static getDerivedStateFromProps

            只有在 props 发生变化的时候才会调用，setState 和 forceUpdate 时则不会

        * getSnapshotBeforeUpdate

            大多数开发者使用 UNSAFE_componentWillUpdate 的场景是配合 componentDidUpdate，分别获取 rerender 前后的视图状态，进行必要的处理。但随着 React 新的 suspense、time slicing、异步渲染等机制的到来，render 过程可以被分割成多次完成，还可以被暂停甚至回溯，这导致 UNSAFE_componentWillUpdate 和 componentDidUpdate 执行前后可能会间隔很长时间，足够使用户进行交互操作更改当前组件的状态，这样可能会导致难以追踪的 BUG。React 新增的 getSnapshotBeforeUpdate 方法就是为了解决这问题

            getSnapshotBeforeUpdate 还有一个十分明显的好处：它调用的结果会作为第三个参数传入 componentDidUpdate，避免了 UNSAFE_componentWillUpdate 和 componentDidUpdate 配合使用时将组件临时的状态数据存在组件实例上浪费内存，getSnapshotBeforeUpdate 返回的数据在 componentDidUpdate 中用完即被销毁，效率更高。

    * V16之前的生命周期(同步渲染)

        * 组件初始化(initialization)阶段

            将父组件的props注入给子组件，定义this.state的初始内容

        * 组件的挂载(Mounting)阶段

            * componentWillMount

                在组件挂载到DOM前调用，且只会被调用一次，在这边调用this.setState不会引起组件重新渲染，少用

            * render

                根据组件的props和state ，return UI，由React自身根据此元素去渲染出页面DOM。不能在里面执行this.setState，会有改变组件状态的副作用。

            * componentDidMount

                组件挂载到DOM后调用，且只会被调用一次

            * 组件的更新(update)阶段

                * 更新机制

                    setState引起的state更新或父组件重新render引起的props更新，更新后的state和props相对之前无论是否有变化，都将引起子组件的重新render。

                * 父组件重新render

                    1. 直接使用,每当父组件重新render导致的重传props，子组件将直接跟着重新渲染，无论props是否有变化。可通过shouldComponentUpdate方法优化。

                    ```js
                    class Child extends Component {
                    shouldComponentUpdate(nextProps){ // 应该使用这个方法，否则无论props是否有变化都将会导致组件跟着重新渲染
                            if(nextProps.someThings === this.props.someThings){
                                return false
                            }
                        }
                        render() {
                            return <div>{this.props.someThings}</div>
                        }
                    }
                    ```

                    2. 在componentWillReceiveProps方法中，将props转换成自己的state,在componentWillReceiveProps中调用 this.setState() 将不会引起第二次渲染。

                    ```js
                    class Child extends Component {
                        constructor(props) {
                            super(props);
                            this.state = {
                                someThings: props.someThings
                            };
                        }
                        componentWillReceiveProps(nextProps) { // 父组件重传props时就会调用这个方法
                            this.setState({someThings: nextProps.someThings});
                        }
                        render() {
                            return <div>{this.state.someThings}</div>
                        }
                    }
                    ```

                * 组件本身调用setState，无论state有没有变化。可通过shouldComponentUpdate方法优化。

                    ```js
                    class Child extends Component {
                        constructor(props) {
                            super(props);
                            this.state = {
                                someThings:1
                            }
                        }
                        shouldComponentUpdate(nextStates){ // 应该使用这个方法，否则无论state是否有变化都将会导致组件重新渲染
                            if(nextStates.someThings === this.state.someThings){
                                return false
                            }
                        }

                        handleClick = () => { // 虽然调用了setState ，但state并无变化
                            const preSomeThings = this.state.someThings
                            this.setState({
                                someThings: preSomeThings
                            })
                        }

                        render() {
                            return <div onClick = {this.handleClick}>{this.state.someThings}</div>
                        }
                    }
                    ```

                * componentWillReceiveProps(nextProps)

                    响应 Props 变化之后进行更新的唯一方式，参数nextProps是父组件传给当前组件的新props。但父组件render方法的调用不能保证重传给当前组件的props是有变化的，所以在此方法中根据nextProps和this.props来查明重传的props是否改变

                * shouldComponentUpdate(nextProps, nextState)

                    通过比较nextProps，nextState及当前组件的this.props，this.state，返回true时当前组件将继续执行更新过程，返回false则当前组件更新停止，以此可用来减少组件的不必要渲染

                * componentWillUpdate(nextProps, nextState)

                    在调用render方法前执行，在这边可执行一些组件更新发生前的工作，一般较少用。

                * render

                    重新调用

                * componentDidUpdate(prevProps, prevState)

                    在组件更新后被调用，可以操作组件更新的DOM，prevProps和prevState这两个参数指的是组件更新前的props和state

        * 卸载阶段

            * componentWillUnmount

                在组件被卸载前调用，可以在这里执行一些清理工作，比如清楚组件中使用的定时器，清除componentDidMount中手动创建的DOM元素等，以避免引起内存泄漏。

    * V16.4+ 的生命周期(异步渲染fiber)

        * 挂载阶段

            * constructor

                第一行执行 super(props)，否则我们无法在构造函数里拿到 this，然后初始化state

            * getDerivedStateFromProps

                不能在这函数里使用 this,在更新时接收到新的 props,可以根据新的 props 和当前的 state 来调整新的 state,主要用于在重新渲染期间手动对滚动位置进行设置等场景中
                ```js
                class Example extends React.Component {
                    static getDerivedStateFromProps(props, state) {
                        //根据 nextProps 和 prevState 计算出预期的状态改变，返回结果会被送给 setState
                        // ...
                    }
                }
                ```

            * UNSAVE_componentWillMount

                避免在此方法中引入任何副作用或订阅,改用 componentDidMount()

            * render

                返回需要渲染的东西，不应该包含其它的业务逻辑，如数据请求，业务逻辑移到 componentDidMount 和 componentDidUpdate 中。

                当 render 被调用时，它会检查 this.props 和 this.state 的变化并返回以下类型之一：

                * 原生的 DOM，如 div
                * React 组件
                * 数组或 Fragment
                * Portals（插槽）
                * 字符串和数字，被渲染成文本节点
                * Boolean 或 null，不会渲染任何东西

            * componentDidMount

                在组件插入 DOM 树中立即调用，可进行数据请求、添加订阅，订阅可在componentWillUnmount() 里取消订阅

                可以在 componentDidMount() 里直接调用 setState()。它将触发额外渲染，但此渲染会发生在浏览器更新屏幕之前。如此保证了即使在 render() 两次调用的情况下，用户也不会看到中间状态。

        * 更新阶段

            指当组件的 props 发生了改变，或组件内部调用了 setState 或者发生了 forceUpdate，则进行更新。

            * UNSAFE_componentWillReceiveProps

            * getDerivedStateFromProps

            * shouldComponentUpdate(nextProps, nextState){}

                根据此函数的返回值来判断是否进行重新渲染，true 表示重新渲染，false 表示不重新渲染，默认返回 true

                首次渲染或者当我们调用 forceUpdate 时并不会触发此方法。此方法仅用于性能优化，返回 false 并不会阻止子组件在 state 更改时重新渲染，返回 false，则不会调用 UNSAFE_componentWillUpdate()，render() 和 componentDidUpdate()

            * UNSAFE_componentWillUpdate

            * render

            * getSnapshotBeforeUpdate(prevProps, prevState)

                在 render 之后，在更新之前被调用，可以去获取 DOM 信息，计算得到并返回一个 snapshot，这个 snapshot 会作为 componentDidUpdate 的第三个参数传入。如果你不想要返回值，返回 null，这个方法一定要和 componentDidUpdate 一起使用

                在重新渲染过程中手动保留滚动位置等情况下非常有用
                ```js
                getSnapshotBeforeUpdate(prevProps, prevState) {
                    console.log('#enter getSnapshotBeforeUpdate');
                    return 'foo';
                }

                componentDidUpdate(prevProps, prevState, snapshot) {
                    console.log('#enter componentDidUpdate snapshot = ', snapshot);
                }
                ```

            * componentDidUpdate

                更新后会被立即调用。首次渲染不会执行此方法,可以操作 DOM，和发起服务器请求，还可以 setState，但是注意一定要用 if 语句控制，否则会导致无限循环

                如无配合getSnapshotBeforeUpdate，第三个参数为null
                ```js
                componentDidUpdate(prevProps) {
                    // 典型用法（不要忘记比较 props）：
                    if (this.props.userID !== prevProps.userID) {
                        this.fetchData(this.props.userID);
                    }
                }
                ```

        * 卸载阶段

            * componentWillUnmount

                清除 timer，取消网络请求或清除在 componentDidMount() 中创建的订阅等，不能setState()

        * 其他不常用的生命周期函数

            * static getDerivedStateFromError(error)

                会在后代组件抛出错误后被调用。它将抛出的错误作为参数，并返回一个值以更新 state。getDerivedStateFromError() 会在渲染阶段调用，因此不允许出现副作用。如遇此类情况，改用 componentDidCatch()。

            * componentDidCatch(error, info)

                在后代组件抛出错误后被调用，error抛出的错误。info带有 componentStack key 的对象，其中包含有关组件引发错误的栈信息。

                如果发生错误，你可以通过调用 setState 使用 componentDidCatch() 渲染降级 UI，但在未来的版本中将不推荐这样做。可以使用静态 getDerivedStateFromError() 来处理降级渲染。

## react数据绑定原理

## 请求后台资源

## 路由

## 父子组件通信

## 页面传参与获取

## redux

## 使用cookie

## 拦截器


