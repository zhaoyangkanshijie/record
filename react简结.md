# react简结

* [react-cli项目构建](#react-cli项目构建)
* [react项目结构](#react项目结构)
* [react指令](#react指令)
* [typescript组件](#typescript组件)
* [react生命周期](#react生命周期)
* [react数据绑定原理](#react数据绑定原理)
* [请求后台资源](#请求后台资源)
* [父子组件通信](#父子组件通信)
* [跨级组件通信](#跨级组件通信)
* [非嵌套组件间通信](#非嵌套组件间通信)
* [react路由](#react路由)
* [react路由守卫](#react路由守卫)
* [页面传参与获取](#页面传参与获取)
* [redux](#redux)
* [使用cookie](#使用cookie)
* [react组件实例ref](#react组件实例ref)
* [单元测试](#单元测试)
* [fiber与虚拟dom](#fiber与虚拟dom)
* [高阶组件](#高阶组件)
* [hook](#hook)
* [react和vue的区别](#react和vue的区别)
* [Fragments](#Fragments)
* [插槽](#插槽)
* [分析器](#分析器)
* [setState同步异步](#setState同步异步)
* [react源码简述](#react源码简述)
* [点击外部元素](#点击外部元素)
* [react性能优化](#react性能优化)
* [错误边界](#错误边界)
* [jsx到javascript的转换过程](#jsx到javascript的转换过程)
* [react源码api](#react源码api)
* [useEffect和componentDidMount有什么差异](#useEffect和componentDidMount有什么差异)

---

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


## typescript组件

1. 参考链接

    [react+typescript给state和props定义指定类型](https://blog.csdn.net/Boale_H/article/details/106838917)

    [React + TypeScript 默认 Props 的处理](https://blog.csdn.net/sinat_17775997/article/details/102514747)

2. 详解

    ```ts
    import * as React from 'react';

    type StateType = {
        hello: string;
    };
    type propType = {
        name: string;
    };
    interface Home {
        state: StateType;
        props: propType
    }

    class Home extends React.Component {
        static defaultProps = {
            name: "stranger",
        };
        constructor(props: propType) {
            super(props);
            this.state = {
                hello: 'hi'
            }
        }

        componentDidMount() {
            this.setState({
                hello: 'Hello'
            })
        }
    
        render() {
            return <div>{this.state.hello}, {this.props.name}</div>;
        }
    }

    export default Home;
    ```

## react指令

1. 参考链接

    [与Vue相比React的指令是怎么使用？](https://www.cnblogs.com/r-mp/p/11217965.html)

    [react文档](https://react.docschina.org/docs/introducing-jsx.html)

    [React动态绑定className](https://www.jianshu.com/p/8b573482dd12)

    [React的合成事件](https://www.cnblogs.com/mengff/p/12901674.html)

    [React事件处理和原生JS事件处理](https://www.cnblogs.com/lyraLee/p/11577511.html)

2. 详解

    * 数据绑定

        需要显示的变量要写在state中，并且通过setState修改，这样值变视图变

        不需要显示的变量，可写在constructor中this.??=??，也可以写在render中，这样值变视图不变

    * 条件判断

        ```js
        render(){
            let isExist = true;
            return (
                <div>
                    {isExist && <div className="box"></div>}
                    {isExist ? <div className="box"></div>:''}
                </div>
            )
        }
        function getGreeting(user) {
            if (user) {
                return <h1>Hello, {formatName(user)}!</h1>;
            }
            return <h1>Hello, Stranger.</h1>;
        }
        ```

    * 数据传值

        ```js
        render(){
            let value = 'hello world';
            let path = 'http://www.baidu.com';
            return (
                <div>
                    <p>{value}</p>
                </div>
                <div>
                    <h1 title={value}></h1>
                    <a href={path}>百度一下</a>
                </div>
            )
        }
        ```

    * class 与 style

        ```js
        render(){
            let isExist = true;
            let classValue1 = "a b c";
            let classValue2 ='b c ' + (isExist && 'a');
            let styleValue1 = {
                width: '100px',
                height: '100px',
                background: 'red'
            };
            return (
                <div>
                    <div className={classValue2}></div>
                    <div style={styleValue1}>box</div>
                    <div style={{width: '100px', height: '50px', background: 'yellow'}}>box</div>
                </div>
            )
        }
        ```

    * 动态class

        ```html
        <p className={['title',this.state.addColor?'color':null].join(' ')}>标题</p>
        <p className={`title ${this.state.addColor?'color':null}`}>标题</p>
        ```

    * 显示与隐藏

        ```js
        render(){
            let isShow = false;
            return (
                <div>
                    <div className="box" style={{display: isShow?'':'none'}}></div>
                </div>
            )
        }
        ```

    * 循环

        ```js
        render(){
            let arr = ['a', 'b', 'c', 'd'];
            let obj = {
                a: 1,
                b: 2,
                c: 3
            }
            return (
                <div>
                    <ul>
                        {
                            arr.map((item, index)=>{
                                return <li key={index}>{item}----{index}</li>
                            })
                        }
                    </ul>

                    <ul>
                        {
                            (function(){
                                let newArr = [];
                                for(let key in obj){
                                    newArr.push(
                                        <li key={key}>{key}: {obj[key]}</li>
                                    );
                                }
                                return newArr;
                            })()
                        }
                    </ul>
                    

                    <ul>
                        {
                            Object.entries(obj).map(([key, value])=>{
                                return <li key={key}>{value}</li>
                            })
                        }
                    </ul>
                </div>
            )
        }
        ```

    * 事件绑定

        ```js
        constructor(){
            super();
            this.state = {
                message: 'hello world'
            }
        }
        render(){
            let value = 'hello react';
            return (
                <div>
                    <button onClick={(ev)=>{
                        console.log('按钮点击了1:', this.state.message);
                        console.log('按钮点击了1:', value);
                        console.log(ev);
                    }}>按钮1</button>

                    <button onClick={this.btnAction}>按钮2</button>

                    <button onClick={this.btnAction2.bind(this)}>按钮3</button>

                    <button onClick={this.btnAction3}>按钮4</button>

                    <button onClick={()=>this.btnAction4()}>按钮5</button>
                </div>
            )
        }
        btnAction(){
            console.log('按钮点击了2');
        }
        btnAction2(val1, val2, val3, ev){
            console.log('按钮点击了3: ', this.state.message);
            console.log('按钮点击了3: ', val1);
            console.log(ev);
        }
        btnAction3 = ()=>{
            console.log('按钮点击了4: ', this.state.message);
        }

        btnAction4(val, ev){
            console.log('按钮点击了5: ', this.state.message);
            console.log('按钮点击了5: ', val);
            console.log(ev);
        }
        ```

        ReactJS中的事件对象是React将原生事件对象(event)进行了跨浏览器包装过的合成事件(SyntheticEvent)

        合成事件对象的特点：

        1. 在事件处理函数中，可以正常访问事件属性。

        2. 为了性能考虑，执行完后，合成事件的事件属性将不能再访问。

            * 异步处理函数中，访问不到合成事件的属性。

            * 因为执行异步函数的时候，事件处理函数的上下文消失。

        执行完后，合成事件的属性会被重置为null。所以异步访问合成事件的属性，是无效的。

        解决方法：

        1. 用变量记录事件属性值

        ```js
        function onClick(event) {
            console.log(event); // => nullified object.
            console.log(event.type); // => "click"
            const eventType = event.type; // => "click"

            setTimeout(function() {
                console.log(event.type); // => null
                console.log(eventType); // => "click"
            }, 0);
        }
        ```

        2. e.persist()会将当前的合成事件对象，从对象池中移除，就不会回收该对象了。对象可以被异步程序访问到。

        合成事件阻止冒泡:

        1. e.stopPropagation

            只能阻止合成事件间冒泡，即下层的合成事件，不会冒泡到上层的合成事件。事件本身还都是在document上执行。最多只能阻止document事件不能再冒泡到window上。

        2. e.nativeEvent.stopImmediatePropagation

            能阻止合成事件不会冒泡到document上。

    * 函数调用

        ```js
        function formatName(user) {
            return user.firstName + ' ' + user.lastName;
        }

        const user = {
            firstName: 'Harper',
            lastName: 'Perez'
        };

        const element = (
            <h1>
                Hello, {formatName(user)}!
            </h1>
        );

        //相当于
        //const element = React.createElement(
        //    'h1',
        //    {className: 'greeting'},
        //    'Hello, world!'
        //);

        ReactDOM.render(
            element,
            document.getElementById('root')
        );
        ```

    * input双向绑定

        事件对象event中target在控制台查看为null，但是event.target却能获取到目标元素?

        因为React里面的事件并不是真实的DOM事件，而是自己在原生DOM事件上封装的合成事件。

        合成事件是由事件池来管理的，合成事件对象可能会被重用，合成事件的所有属性也会随之被清空。所以当在异步处理程序（如setTimeout等等）中或者浏览器控制台中去访问合成事件的属性，有可能就是空的。

        给出的方案：event.persist()，其实就是将当前的合成事件从事件池中移除了，所以能够继续保有对该事件的引用以及仍然能访问该事件的属性。
        ```js
        setTPLinkId(e) {
            this.setState({
                id: e.target.value
            })
        }
        render(){
            return (
                <input onChange={(e)=>this.setId(e)} value={this.state.id} />
            )
        }
        ```

## react生命周期

1. 参考链接

    [详解React生命周期(包括react16最新版)](https://www.jianshu.com/p/514fe21b9914)

    [我对 React V16.4 生命周期的理解](https://juejin.im/post/5ef6018be51d45348e278a46)

    [怎么理解react的副作用，为什么ajax、修改dom是副作用？](https://segmentfault.com/q/1010000019475078/a-1020000019477192)

2. 详解

    * 纯函数：固定输入，固定输出

    * 副作用(side effect)

        指一个 function 做了和本身运算返回值无关的事，比如：修改了全局变量、修改了传入的参数、console.log()、ajax 操作、修改 dom、设置定时器、设置订阅等。

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

1. 参考链接

    [如何理解react的单向数据流？react算mvvm么？ 他实现的双向绑定原理是啥？](http://react-china.org/t/react-react-mvvm/28000)

    [react文档](https://react.docschina.org/docs/state-and-lifecycle.html)

    [你不知道的React 和 Vue 的20个区别【面试必备】](https://juejin.im/post/5ef55acde51d4534bf67a878#heading-11)

2. 详解

    * 单向数据流

        数据从父组件通过props流向子组件，所以UI只能影响树中“低于”它们的组件

    * setState

        setState 通过一个队列机制来实现 state 更新，当执行 setState() 时，会将需要更新的 state 浅合并后,根据变量 isBatchingUpdates(默认为 false)判断是直接更新还是放入状态队列

        通过js的事件绑定程序 addEventListener 和使用setTimeout/setInterval 等 React 无法掌控的 API情况下isBatchingUpdates 为 false，同步更新。除了这几种情况外batchedUpdates函数将isBatchingUpdates修改为 true；

        放入队列的不会立即更新 state，队列机制可以高效的批量更新 state。而如果不通过setState，直接修改this.state 的值，则不会放入状态队列

        setState 依次直接设置 state 值会被合并，但是传入 function 不会被合并

        ```js
        // 情况一
        state={
            count:0
        }
        handleClick() {
            this.setState({
                count: this.state.count + 1
            })
            this.setState({
                count: this.state.count + 1
            })
            this.setState({
                count: this.state.count + 1
            })
        }
        // count 值依旧为1

        // 情况二
        increment(state, props) {
            return {
                count: state.count + 1
            }
        }

        handleClick() {
            this.setState(this.increment)
            this.setState(this.increment)
            this.setState(this.increment)
        }
        // count 值为 3
        ```

## 请求后台资源

1. 参考链接

    [react--axios](https://blog.csdn.net/qq_42813491/article/details/92641361)

2. 详解

    ```js
    const axios = require('axios');
    ...
    getDate = () => {
        const url = "...";
        axios.get(url)
            .then((response) => {
                this.setState({
                    list: response.data.list
                })
            })

    }
    componentDidMount() {
        this.getDate();
    }
    ```

## 父子组件通信

1. 参考链接

    [React 父子组件通信](https://www.jianshu.com/p/bc5a924db3a4)

2. 详解

    父组件传入state指定的值给子组件，定义回调函数callback接收子组件传值
    ```js
    import React, { Component } from 'react';

    import './App.css';

    import Child from './child'

    class App extends Component {
        constructor(props){
            super(props);
            this.state={
                msg:'父类的消息',
                name:'John',
                age:99
            }
        }

        callback=(msg,name,age)=>{
            this.setState({msg});
            this.setState({name});
            this.setState({age});
        }

        render() {
            return (
                <div className="App">
                    <p> Message: &nbsp;&nbsp;{this.state.msg}</p>
                    <Child callback={this.callback} age={this.state.age} name={this.state.name}></Child>
                </div>
            );
        }
    }

    export default App;
    ```
    子组件通过props接收父组件参数，也通过proprs中指定的回调函数传值给父组件
    ```js
    import React from "react";

    class Child extends React.Component{
        constructor(props){
            super(props);
            this.state={
                name:'Andy',
                age:31,
                msg:"来自子类的消息"
            }
        }

        change=()=>{
            this.props.callback(this.state.msg,this.state.name,this.state.age);
        }

        render(){
            return(
                <div>
                    <div>{this.props.name}</div>
                    <div>{this.props.age}</div>
                    <button onClick={this.change}>点击</button>
                </div>
            )
        }
    }

    export default Child;
    ```


## 跨级组件通信

1. 参考链接

    [React 中组件间通信的几种方式](https://www.jianshu.com/p/fb915d9c99c4)

2. 详解

    1. 利用中间组件实现多层父子通信

    2. 利用context实现跨级通信

    上层组件定义context，并提供属性类型PropTypes，提供 getChildContext 函数初始化context，提供回调函数接收底层组件传值
    ```js
    import React, { Component } from 'react';
    import PropTypes from "prop-types";
    import Sub from "./Sub";
    import "./App.css";

    export default class App extends Component{
        constructor(props) {
            super(props);
            this.state = {
                color:"red"
            };
        }
        // 父组件声明自己支持 context
        static childContextTypes = {
            color:PropTypes.string,
            callback:PropTypes.func,
        }

        // 父组件提供一个函数，用来返回相应的 context 对象
        getChildContext(){
            return{
                color:"red",
                callback:this.callback.bind(this)
            }
        }

        callback(msg){
            console.log(msg)
        }

        render(){
            return(
                <div>
                    <Sub></Sub>
                </div>
            );
        }
    }
    ```
    中间组件
    ```js
    import React from "react";
    import SubSub from "./SubSub";

    const Sub = (props) =>{
        return(
            <div>
                <SubSub />
            </div>
        );
    }

    export default Sub;
    ```
    底层组件在constructor中需传入context，也提供自己的context(含PropTypes)，使用context指定的回调函数向上层组件传值
    ```js
    import React,{ Component } from "react";
    import PropTypes from "prop-types";

    export default class SubSub extends Component{
        constructor(props,context){
            super(props,context);
        }
        // 子组件声明自己需要使用 context
        static contextTypes = {
            color:PropTypes.string,
            callback:PropTypes.func,
        }
        render(){
            const style = { color:this.context.color }
            const cb = (msg) => {
                return () => {
                    this.context.callback(msg);
                }
            }
            return(
                <div style = { style }>
                    SUBSUB
                    <button onClick = { cb("我胡汉三又回来了！") }>点击我</button>
                </div>
            );
        }
    }
    ```
    底层组件是无状态组件的情况
    ```js
    import React,{ Component } from "react";
    import PropTypes from "prop-types";

    const SubSub = (props,context) => {
        const style = { color:context.color }
        const cb = (msg) => {
            return () => {
                context.callback(msg);
            }
        }

        return(
            <div style = { style }>
                SUBSUB
                <button onClick = { cb("我胡汉三又回来了！") }>点击我</button>
            </div>
        );
    }

    SubSub.contextTypes = {
        color:PropTypes.string,
        callback:PropTypes.func,
    }

    export default SubSub;
    ```

## 非嵌套组件间通信

1. 参考链接

    [React 中组件间通信的几种方式](https://www.jianshu.com/p/fb915d9c99c4)

2. 详解

    1. 利用共同上层组件实现2重跨级组件通信

    2. 自定义事件

        npm install events --save

        通过emitter.emit(事件名称,值)发布信息

        通过emitter.addListener(事件名称,(值)=>{...})订阅信息并处理

        通过emitter.removeListener(订阅器)取消订阅

        ev.js
        ```js
        import { EventEmitter } from "events";
        export default new EventEmitter();
        ```
        App.js
        ```js
        import React, { Component } from 'react';
        import Foo from "./Foo";
        import Boo from "./Boo";
        import "./App.css";
        export default class App extends Component{
            render(){
                return(
                    <div>
                        <Foo />
                        <Boo />
                    </div>
                );
            }
        } 
        ```
        Foo.js
        ```js
        import React,{ Component } from "react";
        import emitter from "./ev"

        export default class Foo extends Component{
            constructor(props) {
                super(props);
                this.state = {
                    msg:null,
                };
            }
            componentDidMount(){
                // 声明一个自定义事件
                // 在组件装载完成以后
                this.eventEmitter = emitter.addListener("callMe",(msg)=>{
                    this.setState({
                        msg
                    })
                });
            }
            // 组件销毁前移除事件监听
            componentWillUnmount(){
                emitter.removeListener(this.eventEmitter);
            }
            render(){
                return(
                    <div>
                        { this.state.msg }
                        我是非嵌套 1 号
                    </div>
                );
            }
        }
        ```
        Boo.js
        ```js
        import React,{ Component } from "react";
        import emitter from "./ev"

        export default class Boo extends Component{
            render(){
                const cb = (msg) => {
                    return () => {
                        // 触发自定义事件
                        emitter.emit("callMe","Hello")
                    }
                }
                return(
                    <div>
                        我是非嵌套 2 号
                        <button onClick = { cb("blue") }>点击我</button>
                    </div>
                );
            }
        }
        ```

## react路由

1. 参考链接

    [React Router 中文文档](http://react-guide.github.io/react-router-cn/index.html)

    [最新 React Router 全面整理](https://zhuanlan.zhihu.com/p/101129994)

    [React Router教程](https://www.jianshu.com/p/6583b7258e78)

2. 详解

    * 库

        * react-router 核心组件
        * react-router-dom 应用于浏览器端的路由库（单独使用包含了react-router的核心部分）
        * react-router-native 应用于native端的路由

    * 路由配置

        可写在组件内，建议使用集中式路由(顶层组件定义路由)，若使用各子组件控制的分布式路由(子组件包含其下级路由)，需要跳转回父级以上页面且不刷新页面会比较麻烦。

    * 路由组件

        ```tsx
        import { BrowserRouter as Router, Redirect, Route, Link, Switch } from 'react-router-dom';
        <BrowserRouter> 浏览器的路由组件,不带#
        <HashRouter> URL格式为Hash路由组件,带#
        <MemoryRouter> 内存路由组件
        <NativeRouter> Native的路由组件
        <StaticRouter> 地址不改变的静态路由组件
        ```

        1. ...Router是所有路由组件共用的底层接口组件，它是路由规则制定的最外层的容器。

            * BrowserRouter/HashRouter组件提供了四个属性

                * basename: 字符串类型，路由器的默认根路径

                    ```html
                    <BrowserRouter basename="/admin"/>
                        ...
                        <Link to="/home"/> // 被渲染为 <a href="/admin/home">
                        ...
                    </BrowserRouter>
                    ```

                * forceRefresh: 布尔类型，在导航的过程中整个页面是否刷新

                    当设置为 true 时，在导航的过程中整个页面将会刷新。 只有当浏览器不支持 HTML5 的 history API 时，才设置为 true。

                * getUserConfirmation: 函数类型，当导航需要确认时执行的函数。默认是：window.confirm

                    ```tsx
                    // 使用默认的确认函数
                    const getConfirmation = (message, callback) => {
                        const allowTransition = window.confirm(message)
                        callback(allowTransition)
                    }

                    <BrowserRouter getUserConfirmation={getConfirmation}/>
                    ```

                * keyLength: 数字类型location.key 的长度。默认是 6

                    ```html
                    <BrowserRouter keyLength={12}/>
                    ```

            * MemoryRouter主要用在ReactNative这种非浏览器的环境中，因此直接将URL的history保存在了内存中。
            
            * StaticRouter 主要用于服务端渲染。

        2. Link路由跳转的组件

            * to

                需要跳转到的路径(pathname)或地址（location）

            * replace

                当设置为 true 时，点击链接后将使用新地址替换掉访问历史记录里面的原地址。

                当设置为 false 时(默认)，点击链接后将在原有访问历史记录的基础上添加一个新的纪录。

            * 样例

                ```tsx
                import { Link } from 'react-router-dom'
                // 字符串参数
                <Link to="/query">查询</Link>

                // 对象参数
                <Link to={{
                    pathname: '/query',
                    search: '?key=name',
                    hash: '#hash',
                    state: { fromDashboard: true }
                }}>查询</Link>
                ```

        3. NavLink组件

            NavLink是一个特殊版本的Link，可以使用activeClassName来设置Link被选中时被附加的class，使用activeStyle来配置被选中时应用的样式

            exact属性,要求location完全匹配才会附加class和style

            ```tsx
            // 选中后被添加class selected
            <NavLink to={'/'} exact activeClassName='selected'>Home</NavLink>
            // 选中后被附加样式 color:red
            <NavLink to={'/gallery'} activeStyle={{color:red}}>Gallery</NavLink>
            //activeClassName默认值为 active
            //strict: bool类型，当值为 true 时，在确定位置是否与当前 URL 匹配时，将考虑位置 pathname 后的斜线。
            ```

        4. Route组件

            * 渲染方式

                * component渲染

                    ```tsx
                    // 当location形如 http://location/时，Home就会被渲染。
                    // 因为 "/" 会匹配所有的URL，所以这里设置一个exact来强制绝对匹配。
                    <Route exact path="/" component={Home}/>
                    <Route path="/about" component={About}/>
                    ```

                * render渲染

                    ```tsx
                    <Route path="/home" render={() => {
                        console.log('额外的逻辑');
                        return (<div>Home</div>);
                    }/>
                    ```

                * children渲染

                    ```tsx
                    // 在匹配时，容器的class是light，<Home />会被渲染
                    // 在不匹配时，容器的class是dark，<About />会被渲染
                    <Route path='/home' children={({ match }) => (
                        <div className={match ? 'light' : 'dark'}>
                            {match ? <Home/>:<About>}
                        </div>
                    )}/>
                    ```

            * 路由组件props

                * match

                    match.params可以拿到从location中解析出来的参数

                    ```html
                    <Link to='/p/1' />
                    <Link to='/p/2' />
                    <Link to='/p/3' />
                    ......
                    <Route path='/p/:id' render={(match)=<h3>当前文章ID:{match.params.id}</h3>)} />
                    ```

                * location

                    location 对象不会发生改变，可以在生命周期的钩子函数中查看当前页面的位置是否发生改变，对于获取远程数据以及使用动画时非常有用。
                    ```js
                    {
                        key: 'ac3df4', // 在使用 hashHistory 时，没有 key
                        pathname: '/somewhere'
                        search: '?some=search-string',
                        hash: '#howdy',
                        state: {
                            [userDefined]: true
                        }
                    }
                    ```

                    * 在 Route component 中，以 this.props.location 的方式获取，
                    * 在 Route render 中，以 ({ location }) => () 的方式获取，
                    * 在 Route children 中，以 ({ location }) => () 的方式获取，
                    * 在 withRouter 中，以 this.props.location 的方式获取。

                    可以设置location状态，如弹出框场景
                    ```tsx
                    // 通常你只需要这样使用 location
                    <Link to="/somewhere"/>

                    // 但是你同样可以这么用
                    const location = {
                        pathname: '/somewhere'
                        state: { fromDashboard: true }
                    }

                    <Link to={location}/>
                    <Redirect to={location}/>
                    history.push(location)
                    history.replace(location)
                    ```

                    可以把 location 传入一下组件,用于等待跳转

                * history

                    history 对象通常会具有以下属性和方法：

                    * length -（ number 类型）指的是 history 堆栈的数量。
                    * action -（ string 类型）指的是当前的动作（action），例如 PUSH，REPLACE 以及 POP 。
                    * location -（ object类型）是指当前的位置（location），location 会具有如下属性：
                        * pathname -（ string 类型）URL路径。
                        * search -（ string 类型）URL中的查询字符串（query string）。
                        * hash -（ string 类型）URL的 hash 分段。
                        * state -（ string 类型）是指 location 中的状态，例如在 push(path, state) 时，state会描述什么时候 location 被放置到堆栈中等信息。这个 state 只会出现在 browser history 和 memory history 的环境里。
                    * push(path, [state]) -（ function 类型）在 hisotry 堆栈顶加入一个新的条目。
                    * replace(path, [state]) -（ function 类型）替换在 history 堆栈中的当前条目。
                    * go(n) -（ function 类型）将 history 对战中的指针向前移动 n 。
                    * goBack() -（ function 类型）等同于 go(-1) 。
                    * goForward() -（ function 类型）等同于 go(1) 。
                    * block(prompt) -（ function 类型）阻止跳转。

            * Redirect组件

                location会被重写为Redirect的to指定的新location。它的一个用途是登录重定向。
                ```html
                <Redirect to="/new"/>
                ```

            * Switch组件

                渲染匹配地址(location)的第一个Route或者Redirect

    * 样例

        ```tsx
        import * as React from 'react';
        import { BrowserRouter as Router, Redirect, Route, Link } from 'react-router-dom';
        import Home from '../pages/Home';
        import Web1Layout from '../pages/web1/Layout';
        import Web2Layout from '../pages/web2/Layout';
        import Login from '../pages/share/Login';

        const AppRouter = () => {
            return (
                <Router>
                    <h3>APP</h3>
                    <div>
                        <Link to="/home">home</Link>
                        <Link to="/web1">web1</Link>
                        <Link to="/web2">web2</Link>
                        <Link to="/login">login</Link>
                    </div>
                    <Route path='/home' exact={true} component={Home} />
                    <Route path='/web1' exact={true} component={Web1Layout} />
                    <Route path='/web2' exact={true} component={Web2Layout} />
                    <Route path='/login' exact={true} component={Login} />
                    <Redirect to='/home' />
                </Router>
            );
        }

        export default AppRouter;
        ```




## react路由守卫

1. 参考链接

    [React Router 4.0 实现路由守卫](https://www.jianshu.com/p/677433245697)
    [三分钟实现一个react-router-dom5.0的路由拦截（导航守卫）](https://blog.csdn.net/sinat_36728518/article/details/106254395)

2. 详解

    React Router 4.0 采用了声明式的组件，路由即组件，要实现路由守卫功能，就得我们自己去写了。

    router.config.ts
    ```ts
    import { HomePage } from '../pages/home/home.page';
    import { LoginPage } from '../pages/login/login.page';
    import { ErrorPage } from '../pages/error/error.page';

    interface routerConfigModel {
        path:string,
        component?:any,
        auth?:boolean
    }
    export const routerConfig:routerConfigModel[] = [
        {
            path:'/',
            component:HomePage,
            auth:true,
        },{
            path:'/home',
            component:HomePage,
            auth:true,
        },{
            path:'/login',
            component:LoginPage,
        },{
            path:'/404',
            component:ErrorPage
        }
    ];
    ```
    router.ts
    ```ts
    import * as React from 'react';
    import { HashRouter,Switch } from 'react-router-dom';
    import { FrontendAuth } from '../components/frontend-auth/frontend-auth.component'
    import { routerConfig } from './router.config'

    export class Router extends React.Component{
        render(){
            return(
                <HashRouter>
                    <Switch>
                        <FrontendAuth config={routerConfig} />
                    </Switch>
                </HashRouter>
            );
        }
    }
    ```
    frontend-auth.component.ts
    ```ts
    import * as React from 'react';
    import { Route,Redirect } from 'react-router-dom';
    import { propsModel } from './frontend-auth.model'

    export class FrontendAuth extends React.Component<any,propsModel>{
        render(){
            const { location,config } = this.props;
            const { pathname } = location;
            const isLogin = localStorage.getItem('__config_center_token')
            
            // 如果该路由不用进行权限校验，登录状态下登陆页除外
            // 因为登陆后，无法跳转到登陆页
            // 这部分代码，是为了在非登陆状态下，访问不需要权限校验的路由
            const targetRouterConfig = config.find((v:any) => v.path === pathname);
            if(targetRouterConfig && !targetRouterConfig.auth && !isLogin){
                const { component } = targetRouterConfig;
                return <Route exact path={pathname} component={component} />
            }

            if(isLogin){
                // 如果是登陆状态，想要跳转到登陆，重定向到主页
                if(pathname === '/login'){
                    return <Redirect to='/' />
                }else{
                    // 如果路由合法，就跳转到相应的路由
                    if(targetRouterConfig){
                        return <Route path={pathname} component={targetRouterConfig.component} />
                    }else{
                        // 如果路由不合法，重定向到 404 页面
                        return <Redirect to='/404' />
                    }
                }
            }else{
                // 非登陆状态下，当路由合法时且需要权限校验时，跳转到登陆页面，要求登陆
                if(targetRouterConfig && targetRouterConfig.auth){
                    return <Redirect to='/login' />
                }else{
                    // 非登陆状态下，路由不合法时，重定向至 404
                    return <Redirect to='/404' />
                }
            }
        }
    }
    ```
    frontend-auth.model.ts
    ```ts
    export interface propsModel {
        config:any[],
    }
    ```

## 页面传参与获取

1. 参考链接

    [React 跳转页面 传递传递参数，并获取参数](https://blog.csdn.net/a772116804/article/details/106645039)

    [React 页面间传参](https://www.cnblogs.com/feng3037/p/10418161.html)

2. 详解

    ```js
    //传参
    this.props.history.push("/detail", {
        dotData: record
    });
    //获取
    const messages = this.props.location.state.dotData;
    ```

    ```ts
    //传参
    <Link className={"btn_tableOp"} to={{
        pathname: '/web/credit/customer/customer/informationManager/infoManagerView',
        state: {value: 'params-test'}}}><br>查看<br></Link>
    //获取
    componentWillMount() {
        console.log(this.props.location.state.value, 'value')
    }
    //方法弊端：页面刷新后无法获取参数报错
    ```

    ```ts
    //传参
    <Link className={"btn_tableOp"} to={`/web/credit/customer/customer/informationManager/view/${record.customerCode}/${record.tradeCode}`}>查看</Link>
    //路由
    <Route path="/web/credit/customer/customer/informationManager/view/:customerCode/:tradeCode" exact component={InfoManagerView} />
    //获取
    this.props.match.params.customerCode
    ```

## redux

1. 参考链接

    [Redux 中文文档](https://www.redux.org.cn/)

    [React多组件状态共享之Redux](https://blog.csdn.net/weixin_45014444/article/details/100567842)

    [Redux中的connect方法](https://www.jianshu.com/p/caf0c3d2ebc4)
    
    [你不知道的React 和 Vue 的20个区别【面试必备】](https://juejin.im/post/6847009771355127822#heading-30)

    [redux](https://www.yuque.com/chenzilong/rglnod/tie55t)

2. 详解

    * 依赖：redux、react-redux、redux-devtools

    * 要点

        * 单一数据源
        
            * 应用中所有的 state 都以一个对象树的形式储存在一个单一的 store 中。

                * store维持应用的 state；
                * 提供 getState() 方法获取 state；
                * 提供 dispatch(action) 方法更新 state；
                * 通过 subscribe(listener) 注册监听器;
                * 通过 subscribe(listener) 返回的函数注销监听器。
            
            * 注意每个 reducer 只负责管理全局 state 中它负责的一部分。
            
            * 每个 reducer 的 state 参数都不同，分别对应它管理的那部分 state 数据。

        * State 是只读的
        
            唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。

        * 使用纯函数来执行修改
        
            只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算。

    * 使用场合

        （1）用户的使用方式复杂

        （2）不同身份的用户有不同的使用方式（比如普通用户和管理员）

        （3）多个用户之间可以协作

        （4）与服务器大量交互，或者使用了WebSocket

        （5）View要从多个来源获取数据

    * 组件场景

        （1）某个组件的状态，需要共享

        （2）某个状态需要在任何地方都可以拿到

        （3）一个组件需要改变全局状态

        （4）一个组件需要改变另一个组件的状态

    * vuex与redux对比

        1. Redux：view——>actions——>reducer——>state变化——>view变化（同步异步一样）
        2. Vuex： view——>commit——>mutations——>state变化——>view变化（同步操作） 
        3. Vuex： view——>dispatch——>actions——>mutations——>state变化——>view变化（异步操作）

    * 简写 Redux

        ```js
        function createStore(reducer) {
            let state;
            let listeners=[];
            function getState() {
                return state;
            }

            function dispatch(action) {
                state=reducer(state,action);
                listeners.forEach(l=>l());
            }

            function subscribe(listener) {
                listeners.push(listener);
                return function () {
                    const index=listeners.indexOf(listener);
                    listeners.splice(inddx,1);
                }
            }
            
            dispatch({});
            
            return {
                getState,
                dispatch,
                subscribe
            }

        }
        ```

    * react-redux实现

        1. connect 将store和dispatch分别映射成props属性对象，返回组件
        2. context 上下文 导出Provider 和 consumer
        3. Provider 一个接受store的组件，通过context api传递给所有子组件

    * 用法

        * 基础配置
        ```js
        import { createStore } from 'redux';
        import {
            INCREMENT,
            DECREMENT
        } from './actions'
        /**
        * const INCREMENT = 'increment';
        * const DECREMENT = 'decrement';
        *
        * export default { INCREMENT, DECREMENT }
        */

        /**
        * 这是一个 reducer，形式为 (state, action) => state 的纯函数。
        * 描述了 action 如何把 state 转变成下一个 state。
        *
        * state 的形式取决于你，可以是基本类型、数组、对象、
        * 甚至是 Immutable.js 生成的数据结构。惟一的要点是
        * 当 state 变化时需要返回全新的对象，而不是修改传入的参数。
        *
        * 下面例子使用 `switch` 语句和字符串来做判断，但你可以写帮助类(helper)
        * 根据不同的约定（如方法映射）来判断，只要适用你的项目即可。
        */
        function counter(state = 0, action) {
            switch (action.type) {
            case INCREMENT:
                return state + 1;
            case DECREMENT:
                return state - 1;
            default:
                return state;
            }
        }

        // 创建 Redux store 来存放应用的状态。
        // API 是 { subscribe, dispatch, getState }。
        let store = createStore(counter);

        // 可以手动订阅更新，也可以事件绑定到视图层。
        store.subscribe(() =>
            console.log(store.getState())
        );

        // 改变内部 state 惟一方法是 dispatch 一个 action。
        // action 可以被序列化，用日记记录和储存下来，后期还可以以回放的方式执行
        store.dispatch({ type: INCREMENT });
        // 1
        store.dispatch({ type: INCREMENT });
        // 2
        store.dispatch({ type: DECREMENT });
        // 1
        ```

        * 合并reducers
        ```js
        import { combineReducers } from 'redux'
        import {
            ADD_TODO,
            TOGGLE_TODO,
            SET_VISIBILITY_FILTER,
            VisibilityFilters
        } from './actions'
        const { SHOW_ALL } = VisibilityFilters

        function visibilityFilter(state = SHOW_ALL, action) {
            switch (action.type) {
                case SET_VISIBILITY_FILTER:
                return action.filter
                default:
                return state
            }
        }

        function todos(state = [], action) {
            switch (action.type) {
                case ADD_TODO:
                return [
                    ...state,
                    {
                    text: action.text,
                    completed: false
                    }
                ]
                case TOGGLE_TODO:
                return state.map((todo, index) => {
                    if (index === action.index) {
                    return Object.assign({}, todo, {
                        completed: !todo.completed
                    })
                    }
                    return todo
                })
                default:
                return state
            }
        }

        const todoApp = combineReducers({
            visibilityFilter,
            todos
        })

        export default todoApp
        ```

        * connect

            用于连接React组件与 Redux store
        
            不会改变它“连接”的组件，而是提供一个经过包裹的 connect 组件。 conenct 接受4个参数，分别是 mapStateToProps，mapDispatchToProps，mergeProps，options

            * mapStateToProps

                允许将store中的数据作为props绑定到组件中，只要store发生变化就会调用，返回的结果必须是一个纯对象，这个对象会与组件的 props 合并

                ```js
                state => ({
                    count: state.counter.count
                })

                // or
                const mapStateToProps = (state) => {
                    return ({
                        count: state.counter.count
                    })
                }
                ```

            * mapDispatchToProps

                允许我们将 action 作为 props 绑定到组件中，如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，对象所定义的方法名将作为属性名；每个方法将返回一个新的函数，函数中 dispatch 方法会将 action creator 的返回值作为参数执行。这些属性会被合并到组件的 props 中。

                ```js
                dispatch => ({
                    login: (...args) => dispatch(loginAction.login(..args)),
                })

                // or
                const mapDispatchToProps = (dispatch, ownProps) => {
                    return {
                        increase: (...args) => dispatch(actions.increase(...args)),
                        decrease: (...args) => dispatch(actions.decrease(...args))
                    }
                }
                ```

            * mergeProps

                mapStateToProps() 与 mapDispatchToProps() 的执行结果和组件自身的 props 将传入到这个回调函数中。该回调函数返回的对象将作为 props 传递到被包装的组件中。你也许可以用这个回调函数，根据组件的 props 来筛选部分的 state 数据，或者把 props 中的某个特定变量与 action creator 绑定在一起。如果你省略这个参数，默认情况下返回 Object.assign({}, ownProps, stateProps, dispatchProps) 的结果。

            * options

                可以定制 connector 的行为

            ```js
            import React from 'react'
            import PropTypes from 'prop-types'

            const Link = ({ active, children, onClick }) => {
                if (active) {
                    return <span>{children}</span>
                }

                return (
                    <a
                    href=""
                    onClick={e => {
                        e.preventDefault()
                        onClick()
                    }}
                    >
                    {children}
                    </a>
                )
            }

            Link.propTypes = {
                active: PropTypes.bool.isRequired,
                children: PropTypes.node.isRequired,
                onClick: PropTypes.func.isRequired
            }

            export default Link
            ```
            ```js
            import { connect } from 'react-redux'
            import { setVisibilityFilter } from '../actions'
            import Link from '../components/Link'

            const mapStateToProps = (state, ownProps) => {
                return {
                    active: ownProps.filter === state.visibilityFilter
                }
            }

            const mapDispatchToProps = (dispatch, ownProps) => {
                return {
                    onClick: () => {
                        dispatch(setVisibilityFilter(ownProps.filter))
                    }
                }
            }

            const FilterLink = connect(
                mapStateToProps,
                mapDispatchToProps
            )(Link)

            export default FilterLink
            ```

            * 异步与中间件

                每个 API 请求都需要 dispatch 至少三种 action：请求开始、请求成功、请求失败

                ```js
                { type: 'FETCH_POSTS' }
                { type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
                { type: 'FETCH_POSTS', status: 'success', response: { ... } }
                //or
                { type: 'FETCH_POSTS_REQUEST' }
                { type: 'FETCH_POSTS_FAILURE', error: 'Oops' }
                { type: 'FETCH_POSTS_SUCCESS', response: { ... } }
                ```

                使用 ES6 计算属性语法，使用 Object.assign() 来简洁高效地更新 state[action.subreddit]

                ```js
                return Object.assign({}, state, {
                    [action.subreddit]: posts(state[action.subreddit], action)
                })
                //or
                let nextState = {}
                nextState[action.subreddit] = posts(state[action.subreddit], action)
                return Object.assign({}, state, nextState)
                ```

                完整示例

                ```js
                //index.js
                import thunkMiddleware from 'redux-thunk'
                import { createLogger } from 'redux-logger'
                import { createStore, applyMiddleware } from 'redux'
                import { selectSubreddit, fetchPosts } from './actions'
                import rootReducer from './reducers'

                const loggerMiddleware = createLogger()

                const store = createStore(
                    rootReducer,
                    applyMiddleware(
                        thunkMiddleware, // 允许我们 dispatch() 函数
                        loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
                    )
                )

                store.dispatch(selectSubreddit('reactjs'))
                store
                .dispatch(fetchPosts('reactjs'))
                .then(() => console.log(store.getState()))
                ```
                ```js
                //actions.js
                import fetch from 'cross-fetch'

                export const REQUEST_POSTS = 'REQUEST_POSTS'
                function requestPosts(subreddit) {
                    return {
                        type: REQUEST_POSTS,
                        subreddit
                    }
                }

                export const RECEIVE_POSTS = 'RECEIVE_POSTS'
                function receivePosts(subreddit, json) {
                    return {
                        type: RECEIVE_POSTS,
                        subreddit,
                        posts: json.data.children.map(child => child.data),
                        receivedAt: Date.now()
                    }
                }

                export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
                export function invalidateSubreddit(subreddit) {
                    return {
                        type: INVALIDATE_SUBREDDIT,
                        subreddit
                    }
                }

                function fetchPosts(subreddit) {
                    return dispatch => {
                        dispatch(requestPosts(subreddit))
                        return fetch(`http://www.reddit.com/r/${subreddit}.json`)
                        .then(response => response.json())
                        .then(json => dispatch(receivePosts(subreddit, json)))
                    }
                }

                function shouldFetchPosts(state, subreddit) {
                    const posts = state.postsBySubreddit[subreddit]
                    if (!posts) {
                        return true
                    } else if (posts.isFetching) {
                        return false
                    } else {
                        return posts.didInvalidate
                    }
                }

                export function fetchPostsIfNeeded(subreddit) {

                    // 注意这个函数也接收了 getState() 方法
                    // 它让你选择接下来 dispatch 什么。

                    // 当缓存的值是可用时，
                    // 减少网络请求很有用。

                    return (dispatch, getState) => {
                        if (shouldFetchPosts(getState(), subreddit)) {
                            // 在 thunk 里 dispatch 另一个 thunk！
                            return dispatch(fetchPosts(subreddit))
                        } else {
                            // 告诉调用代码不需要再等待。
                            return Promise.resolve()
                        }
                    }
                }
                ```

                手写logger中间件

                ```js
                /**
                * 记录所有被发起的 action 以及产生的新的 state。
                */
                const logger = store => next => action => {
                    console.group(action.type)
                    console.info('dispatching', action)
                    let result = next(action)
                    console.log('next state', store.getState())
                    console.groupEnd(action.type)
                    return result
                }

                /**
                * 在 state 更新完成和 listener 被通知之后发送崩溃报告。
                */
                const crashReporter = store => next => action => {
                    try {
                        return next(action)
                    } catch (err) {
                        console.error('Caught an exception!', err)
                        Raven.captureException(err, {
                            extra: {
                                action,
                                state: store.getState()
                            }
                        })
                        throw err
                    }
                }

                /**
                * 用 { meta: { delay: N } } 来让 action 延迟 N 毫秒。
                * 在这个案例中，让 `dispatch` 返回一个取消 timeout 的函数。
                */
                const timeoutScheduler = store => next => action => {
                    if (!action.meta || !action.meta.delay) {
                        return next(action)
                    }

                    let timeoutId = setTimeout(
                        () => next(action),
                        action.meta.delay
                    )

                    return function cancel() {
                        clearTimeout(timeoutId)
                    }
                }

                /**
                * 通过 { meta: { raf: true } } 让 action 在一个 rAF 循环帧中被发起。
                * 在这个案例中，让 `dispatch` 返回一个从队列中移除该 action 的函数。
                */
                const rafScheduler = store => next => {
                    let queuedActions = []
                    let frame = null

                    function loop() {
                        frame = null
                        try {
                            if (queuedActions.length) {
                                next(queuedActions.shift())
                            }
                        } finally {
                            maybeRaf()
                        }
                    }

                    function maybeRaf() {
                        if (queuedActions.length && !frame) {
                            frame = requestAnimationFrame(loop)
                        }
                    }

                    return action => {
                        if (!action.meta || !action.meta.raf) {
                            return next(action)
                        }

                        queuedActions.push(action)
                        maybeRaf()

                        return function cancel() {
                            queuedActions = queuedActions.filter(a => a !== action)
                        }
                    }
                }

                /**
                * 使你除了 action 之外还可以发起 promise。
                * 如果这个 promise 被 resolved，他的结果将被作为 action 发起。
                * 这个 promise 会被 `dispatch` 返回，因此调用者可以处理 rejection。
                */
                const vanillaPromise = store => next => action => {
                    if (typeof action.then !== 'function') {
                        return next(action)
                    }

                    return Promise.resolve(action).then(store.dispatch)
                }

                /**
                * 让你可以发起带有一个 { promise } 属性的特殊 action。
                *
                * 这个 middleware 会在开始时发起一个 action，并在这个 `promise` resolve 时发起另一个成功（或失败）的 action。
                *
                * 为了方便起见，`dispatch` 会返回这个 promise 让调用者可以等待。
                */
                const readyStatePromise = store => next => action => {
                    if (!action.promise) {
                        return next(action)
                    }

                    function makeAction(ready, data) {
                        let newAction = Object.assign({}, action, { ready }, data)
                        delete newAction.promise
                        return newAction
                    }

                    next(makeAction(false))
                    return action.promise.then(
                        result => next(makeAction(true, { result })),
                        error => next(makeAction(true, { error }))
                    )
                }

                /**
                * 让你可以发起一个函数来替代 action。
                * 这个函数接收 `dispatch` 和 `getState` 作为参数。
                *
                * 对于（根据 `getState()` 的情况）提前退出，或者异步控制流（ `dispatch()` 一些其他东西）来说，这非常有用。
                *
                * `dispatch` 会返回被发起函数的返回值。
                */
                const thunk = store => next => action =>
                    typeof action === 'function' ?
                        action(store.dispatch, store.getState) :
                        next(action)

                    // 你可以使用以上全部的 middleware！（当然，这不意味着你必须全都使用。）
                    let todoApp = combineReducers(reducers)
                    let store = createStore(
                    todoApp,
                    applyMiddleware(
                        rafScheduler,
                        timeoutScheduler,
                        thunk,
                        vanillaPromise,
                        readyStatePromise,
                        logger,
                        crashReporter
                    )
                )
                ```


## 使用cookie

1. 参考链接

    [React-cookie](https://www.jianshu.com/p/77bca29fb784)

2. 详解

    ```js
    import { Component } from 'react';
    import cookie from 'react-cookie';

    import LoginPanel from './LoginPanel';
    import Dashboard from './Dashboard';

    export default class MyApp extends Component {
        componentWillMount() {
            this.state =  { userId: cookie.load('userId') };
        }

        onLogin(userId) {
            this.setState({ userId });
            cookie.save('userId', userId, { path: '/' });
        }

        onLogout() {
            cookie.remove('userId', { path: '/' });
        }

        render() {
            if (!this.state.userId) {
                return <LoginPanel onSuccess={this.onLogin.bind(this)} />;
            }

            return <Dashboard userId={this.state.userId} />;
        }
    }
    ```


2. 详解

## react组件实例ref

1. 参考链接

    [React 通过ref获取DOM对象或者子组件实例的用法](https://www.cnblogs.com/greatdesert/p/12697726.html)

    [Refs & DOM](https://www.yuque.com/chenzilong/rglnod/wravgb)

2. 详解

    1. 字符串格式

        ```html
        <div id="root"></div>
        <script type="text/babel">
            class RefDemo extends React.Component{
                state = {no:1}
                componentDidMount = ()=>{ this.refs.info.textContent = "no = "+this.state.no }//组件挂载完成后设置this.ref.info这个DOM节点的textContext

                test=()=>{ this.refs.info.textContent= "no = "+ ++this.state.no }//点击测试按钮后也修改this.ref.info这个DOM节点的textContext

                render(){
                    return (
                        <div>
                        <button onClick={this.test}>测试</button>
                        <p ref="info"></p>
                        </div>
                    )
                }
            }
            ReactDOM.render(<RefDemo></RefDemo>,root)
        </script>
        ```

    2. 函数格式

        ```html
        <div id="root"></div>
        <script type="text/babel">
        class RefDemo extends React.Component{
            state = {no:1}
            componentDidMount = ()=>{ this.info.textContent = "no = "+this.state.no }

            test=()=>{ this.info.textContent= "no = "+ ++this.state.no }

            render(){
                return (
                    <div>
                    <button onClick={this.test}>测试</button>
                    <p ref={ele => this.info = ele}></p>//这里以函数的形式来写，在其它逻辑内只需通过this.info就可以获取这个p节点实例了
                    </div>
                )
            }
        }
        ReactDOM.render(<RefDemo></RefDemo>,root)
        </script>
        ```

    3. createRef方法

        ```html
        <div id="root"></div>
        <script type="text/babel">
        class RefDemo extends React.Component{
            state = {no:1}
            domp = React.createRef();//执行React.createRef()返回一个{current:null}对象

            componentDidMount = ()=>{ this.domp.current.textContent = "no = "+this.state.no }

            test=()=>{ this.domp.current.textContent= "no = "+ ++this.state.no }

            render(){
            return (
                <div>
                <button onClick={this.test}>测试</button>
                <p ref={this.domp}></p>//设置ref属性，值直接指向React.createRef()的返回值即可，也就是当前的domp属性，之后在其它地方可以直接使用this.domp.current获取这个P实例了
                </div>
            )
            }
        }
        ReactDOM.render(<RefDemo></RefDemo>,root)
        </script>
        ```

    4. forwardRef(hoc高阶组件/函数式组件)

        ```js
        import React from 'react'

        // 此函数接收一个组件...
        function WithSubscription(WrappedComponent, selectData) {
        // ...并返回另一个组件...
        class WithSubscription extends React.Component {
            constructor(props) {
            super(props);
            this.handleChange = this.handleChange.bind(this);
            this.state = {
                data: selectData(this.props.DataSource, props)
            };
            }

            componentDidMount() {
            // ...负责订阅相关的操作...
            this.props.DataSource.addChangeListener(this.props.name, this.handleChange);
            }

            componentWillUnmount() {
            this.props.DataSource.removeChangeListener(this.props.name);
            }

            handleChange() {
            this.setState({
                data: selectData(this.props.DataSource, this.props)
            });
            }

            render() {
            // ... 并使用新数据渲染被包装的组件!
            // 请注意，我们可能还会传递其他属性
            return <WrappedComponent ref={this.props.forwardedRef} data={this.state.data} {...this.props} />;
            }
        };
        debugger
        return React.forwardRef((props, ref) => {
            return <WithSubscription {...props} forwardedRef={ref} />;
        });
        }

        export default WithSubscription;
        ```

## 单元测试

1. 参考链接

    [如何使用 Jest 测试 React 组件](https://www.oschina.net/translate/test-react-components-jest)

2. 详解

    由于组件与复杂的计算逻辑是分开的，因此只需对逻辑进行单元测试，使用框架jest，见【前端实战案例】-【单元测试】

## fiber与虚拟dom

1. 参考链接

    [前端面试题全面整理-带解析 涵盖CSS、JS、浏览器、Vue、React、移动web、前端性能、算法、Node](https://mp.weixin.qq.com/s/YrKGMORhB_POmfWZVWRkHg)

    [探索 React 内核：深入 Fiber 架构和协调算法](https://mp.weixin.qq.com/s/QRTvTiapVVTppIjRfL1swA)

    [React Fiber 原理介绍](https://segmentfault.com/a/1190000018250127)

    [react16源码（Fiber架构）](https://www.cnblogs.com/colorful-coco/p/9579402.html)

    [React的虚拟DOM与diff算法的理解](https://blog.csdn.net/qq_36407875/article/details/84965311)

    [你不知道的React 和 Vue 的20个区别【面试必备】](https://juejin.im/post/6847009771355127822#heading-30)

    [深入理解React16之：（一）.Fiber架构](https://www.jianshu.com/p/bf824722b496)

    [React16 diff全面讲解](https://blog.csdn.net/susuzhe123/article/details/107890118)

    [轻烤 React 核心机制 Reconciliation](https://juejin.im/post/6891242214324699143)

    [协调](https://www.yuque.com/chenzilong/rglnod/qmy155)

2. 详解

    * 虚拟dom

        从 render 方法返回的不可变 React 元素树，通常称为虚拟DOM。

    * 比较V16前后组件渲染顺序

        V16前：

        如果这是一个很大，层级很深的组件，react渲染它需要几十甚至几百毫秒，在这期间，react会一直占用浏览器主线程，任何其他的操作（包括用户的点击，鼠标移动等操作）都无法执行
        ```txt
        父(constructor,willMount,render)->
            子(constructor,willMount,render)->
                孙1(constructor,willMount,render)->
                孙1(didMount)->
                孙2(constructor,willMount,render)->
                孙2(didMount)->
                    子(didMount)->
                        父(didMount)
        ```

        V16后：

        组件更新分为两个时期：render前的生命周期为phase1,render后的生命周期为phase2

        phase1的生命周期是可以被打断的，每隔一段时间它会跳出当前渲染进程，去确定是否有其他更重要的任务。

            React 在 workingProgressTree 上复用当前 Fiber 数据结构，通过requestIdleCallback来构建新的 tree，标记需要更新的节点，放入队列中。

            如果不被打断，那么phase1执行完会直接进入render函数，构建真实的virtualDomTree

            如果组件phase1过程中被打断，即当前组件只渲染到一半，react会放弃当前组件所有干到一半的事情，去做更高优先级更重要的任务，当所有高优先级任务执行完之后，react通过callback回到之前渲染到一半的组件，从头开始渲染。

            也就是 所有phase1的生命周期函数都可能被执行多次，因为可能会被打断重来，那么我们最好就得保证phase1的生命周期每一次执行的结果都是一样的，否则就会有问题，因此，最好都是纯函数。

        phase2的生命周期是不可被打断的，React 将其所有的变更一次性更新到DOM上。

        fiber并不是为了减少组件的渲染时间，事实上也并不会减少，最重要的是现在可以使得一些更高优先级的任务，至少用户不会感觉到卡顿

    * react架构

        组件return render信息 给任务调度器(scheduler),Scheduler 决定渲染（更新）任务优先级，将高优的更新任务优先交给 Reconciler(调和器/协调器)， Reconciler负责找出前后两个 Virtual DOM（React Element）树的「差异」，并把「差异」告诉 Renderer(渲染器)。


    * fiber

        从V16开始，React 推出了该内部实例树的新实现，以及对其进行管理的算法，代号为 Fiber。

        Fiber节点由react元素转换而成，所有 fiber 节点使用这些属性： child 、 sibling 和 return 通过链表的形式连接在一起。

        第一次渲染后会产生树，处理update也会产生树，执行dom diff后会把树更新到屏幕。

        每个fiber节点都包含相关效用(使用 state 和 props 来计算 UI如何呈现的函数)，建立具有 effect 的 fiber 节点的线性链表以实现快速迭代

    * Fiber 节点结构

        ```js
        {
            tag: TypeOfWork, // fiber的类型，保存对类组件实例，DOM 节点或与 fiber 节点关联的其他 React 元素类型的引用。
            alternate: Fiber|null, // 在fiber更新时克隆出的镜像fiber，对fiber的修改会标记在这个fiber上
            return: Fiber|null, // 指向fiber树中的父节点
            child: Fiber|null, // 指向第一个子节点
            sibling: Fiber|null, // 指向兄弟节点
            effectTag: TypeOfSideEffect, // side effect类型，下文会介绍
            nextEffect: Fiber | null, // 单链表结构，方便遍历fiber树上有副作用的节点
            pendingWorkPriority: PriorityLevel, // 标记子树上待更新任务的优先级
        }
        ```

    * WorkLoop

        函数从最顶层的 HostRoot fiber 节点开始，一直找到工作未完成的节点，并进行处理，最后退出循环进行update

    * diff总述

        React 需要基于这两棵树之间的差别来判断如何有效率的更新 UI 以保证当前 UI 与最新的树保持同步。

        生成将一棵树转换成另一棵树的最小操作数，即使在最前沿的算法中，该算法的复杂程度为 O(n^3)，其中 n 是树中元素的数量。

        于是 React 在以下两个假设的基础之上提出了一套 O(n) 的启发式算法（放弃了最优解）：

        * 两个不同类型的元素会产生出不同的树
        * 开发者可以通过 key prop 来暗示哪些子元素在不同的渲染下能保持稳定

        react diff 算法做了哪些妥协呢？

        1. tree diff：只对比同一层的 dom 节点，忽略 dom 节点的跨层级移动
        2. component diff：如果不是同一类型的组件，会删除旧的组件，创建新的组件
        3. element diff：对于同一层级的一组子节点，需要通过唯一 id 进行来区分

    * 虚拟DOM树分层比较（tree diff）

        两棵树只会对同一层次的节点进行比较，忽略DOM节点跨层级的移动操作。当发现节点已经不存在，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。跨层级操作则会先销毁再创建。

    * 组件间的比较（component diff）

        如果是同一个类型的组件，则按照原策略进行Virtual DOM比较。有可能经过一轮Virtual DOM比较下来，并没有发生变化。允许用户通过shouldComponentUpdate()来判断该组件是否需要进行diff算法分析。

        如果不是同一类型的组件，则将其判断为dirty component，从而替换整个组价下的所有子节点。

    * 元素间的比较（element diff）

        当节点处于同一层级的时候，react diff 提供了三种节点操作：插入、删除、移动。

        新集合元素与旧集合元素对比，找是否存在相同的key，有相同，则看老游标<新游标，则进行移动，否则不动，key不存在则插入新元素，最后看是否存在新集合中没有但老集合中仍存在的节点，有则删除

    * react16 diff算法

        ```txt
        操作:插入
        old:key0 key1 key2
        new:key1 key2 key0
        操作:复用 复用 插入
        ```
        ```txt
        操作:插入      插入
        old:key0 key1 key2 key3
        new:key1 key0 key3 key2
        操作:复用 插入  复用 插入
        ```
        ```txt
        操作:插入      移除
        old:key0 key1 key2 key3
        new:key1 key5 key3 key0
        操作:复用 新建  复用  插入
        ```
        性能最差的一种情况
        ```txt
        操作:插入 插入
        old:key0 key1 key2
        new:key2 key0 key1
        操作:复用  插入 插入
        ```
        ```txt
        同级相同位置新老节点比较，
            如果不相同，则找map中是否存在新节点的key，
                有则复用，
                    当旧节点索引小于当前新节点替换索引时，则节点插入，
                    否则直接更新当前新节点替换索引为旧节点索引
                无则新建，当前节点不为null，插入
                被复用过的节点从 map 集合中移除
        最后遍历existingChildren，删除旧节点中没使用的元素
        ```

    * V16前(同步渲染)
    
        浏览器渲染引擎单线程, 计算DOM树时锁住整个线程, 所有行为同步发生, 有效率问题, 期间react会一直占用浏览器主线程，如果组件层级比较深，相应的堆栈也会很深，长时间占用浏览器主线程, 任何其他的操作（包括用户的点击，鼠标移动等操作）都无法执行。

        传统的diff需要除了树编号比较之外，还需要跨级比较，会两两比较树的节点，有n^2的复杂度。然后需要编辑树，编辑的树可能发生在任何节点，需要对树进行再一次遍历操作，复杂度为n。加起来就是n^3。

    * V16后(异步渲染,协调reconciliation)
    
        重写底层算法逻辑reconciliation 算法(比较两棵 DOM 树差异、从而判断哪一部分应当被更新), 引入fiber时间片, 异步渲染, react会在渲染一部分树后检查是否有更高优先级的任务需要处理(如用户操作或绘图), 处理完后再继续渲染, 并可以更新优先级, 以此管理渲染任务. 加入fiber的react将组件更新分为两个时期（phase 1 && phase 2），render前的生命周期为phase1，render后的生命周期为phase2, 1可以打断(放弃之前的计算成果), 2不能打断一次性更新. 三个will生命周期可能会重复执行, 尽量避免使用。

        react树对比是按照层级去对比的， 他会给树编号0,1,2,3,4.... 然后相同的编号进行比较。所以复杂度是n，这个好理解。

    * diff vue vs react

        * 相同点:都是同层 differ,复杂度都为 O(n);
        * 不同点:
            1. React 首位是除删除外是固定不动的,然后依次遍历对比;
            2. Vue 的compile 阶段的optimize标记了static 点,可以减少 differ 次数,而且是采用双向遍历方法;
            3. React16后改为链表树结构，Vue依然是数组
            4. React16后多了fiber，没提升性能，但白屏时间变短，Vue3增加了最长上升子序列算法

## 高阶组件

1. 参考链接

    [前端面试题全面整理-带解析 涵盖CSS、JS、浏览器、Vue、React、移动web、前端性能、算法、Node](https://mp.weixin.qq.com/s/YrKGMORhB_POmfWZVWRkHg)

    [高阶组件](https://www.yuque.com/chenzilong/rglnod/dzl1i6)

2. 详解

    高阶组件就是一个函数，且该函数(wrapper)接受一个组件作为参数，并返回一个新的组件。
    高阶组件并不关心数据使用的方式和原因，而被包裹的组件也不关心数据来自何处.

    ```js
    const EnhancedComponent = higherOrderComponent(WrappedComponent);
    ```

    react-dnd: 根组件, source, target等
    export default DragSource(type, spec, collect)(MyComponent)

    重构代码库使用HOC提升开发效率

    HOC本身没有修改传入的组件，hoc通过将组件包装在容器组件。HOC是纯函数，没有副作用。这里提到容器组件，其实和redux的connet函数是同一个方式。

    withSubscription 和包装组件之间的契约完全基于之间传递的 props。这种依赖方式使得替换 HOC 变得容易，只要它们为包装的组件提供相同的 prop 即可。

## hook

1. 参考链接

    [Hook 简介](https://react.docschina.org/docs/hooks-intro.html)

    [React Hooks 使用总结](https://juejin.im/post/6850037283535880205)

    [写React Hooks前必读](https://mp.weixin.qq.com/s/bUcsqBYdK0DHhvbJ_yTyqQ)

    [React Hook 的底层实现原理](https://mp.weixin.qq.com/s/a2nfI9fnQEh2gm2kGDRQlg)

    [干货 | React Hook的实现原理和最佳实践](https://cloud.tencent.com/developer/article/1468196)

    [React Hook 不完全指南](https://segmentfault.com/a/1190000019223106)

    [React 灵魂 23 问，你能答对几个？](https://mp.weixin.qq.com/s/uMZMcoN5Kxkp_DUHcF-_9g)

    [简单易懂的 React useState() Hook 指南（长文建议收藏）](https://blog.csdn.net/qq_36380426/article/details/103855801)

    [浅谈 useEffect](https://www.jianshu.com/p/087507e72616)

    [useEffect使用指南](https://www.jianshu.com/p/fd17ce2d7e46)

    [useContext](https://www.jianshu.com/p/e0b8745340d7)

    [useContext Hook 是如何工作的](https://blog.csdn.net/hsany330/article/details/106118421)

    [useMemo、useCallback简单理解](http://www.mamicode.com/info-detail-2836057.html)

    [useCallback 和 useMemo 及区别](https://blog.csdn.net/MFWSCQ/article/details/105136711)

    [useRef使用总结](https://juejin.cn/post/6844904174417608712)

2. 详解

    Hook 是 React 16.8 的新增特性。它可以在不编写 class 的情况下使用 state 以及其他的 React 特性，摆脱this，且不必在不同生命周期中处理业务。

    Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），而并非强制按照生命周期划分。

    * React 中提供的 hooks：

        * useState：setState
        * useReducer：setState，同时 useState 也是该方法的封装
        * useRef: refuseImperativeHandle: 给 ref 分配特定的属性
        * useContext: context，需配合 createContext 使用
        * useMemo: 可以对 setState 的优化
        * useCallback: useMemo 的变形，对函数进行优化useEffect: 类似 componentDidMount/Update, componentWillUnmount，当效果为 componentDidMount/Update 时，总是在整个更新周期的最后（页面渲染完成后）才执行
        * useLayoutEffect: 用法与 useEffect 相同，区别在于该方法的回调会在数据更新完成后，页面渲染之前进行，该方法会阻碍页面的渲染useDebugValue：用于在 React 开发者工具中显示自定义 hook 的标签

    * hook底层实现原理

        * dispatcher

            包含了hooks函数的共享对象。它将根据ReactDom的渲染阶段来动态分配或者清除，并且确保用户无法在 React 组件外访问hooks。

        * The hooks queue

            属性：

            1. 它的初始状态在首次渲染时被创建。
            2. 它的状态可以即时更新。
            3. React会在之后的渲染中记住hook的状态
            4. React会根据调用顺序为您提供正确的状态
            5. React会知道这个hook属于哪个Fiber。

            组件状态像是一个普通的对象，在处理hook时，它应该被视为一个队列，其中每个节点代表一个状态的单个模型

            当前fiber及其hooks队列中的第一个hook节点将被存储在全局变量中，只要我们调用一个hook函数（useXXX()），就会知道要在哪个上下文中运行

             一旦更新完成，一个叫做finishHooks()的函数将被调用，其中hooks队列中第一个节点的引用将存储在渲染完成的fiber对象的memoizedState属性中。这意味着hooks队列及其状态可以在外部被定位到

        * State hooks

            useState返回的结果是一个reducer状态和一个action dispatcher

        * Effect hooks

            属性：

            1. 它们是在渲染时创建的，但它们在绘制后运行。
            2. 它们将在下一次绘制之前被销毁。
            3. 它们按照已经被定义的顺序执行。

            每个effect node应该具有以下模式：

            1. tag - 一个二进制数，它将决定effect的行为
            2. create - 绘制后应该运行的回调
            3. destroy - 从create()返回的回调应该在初始渲染之前运行。
            4. inputs - 一组值，用于确定是否应销毁和重新创建effect
            5. next - 函数组件中定义的下一个effect的引用。

    * 为什么"不要在循环，条件或嵌套函数中调用 Hook， 确保总是在你的 React 函数的最顶层调用他们"?

        以 setState 为例，在 react 内部，每个组件(Fiber)的 hooks 都是以链表的形式存在 memoizeState 属性中：

        update 阶段，每次调用 setState，链表就会执行 next 向后移动一步。如果将 setState 写在条件判断中，假设条件判断不成立，没有执行里面的 setState 方法，会导致接下来所有的 setState 的取值出现偏移，从而导致异常发生。

    * 实现样例

        * 简单的useState

            ```js
            let val; // 放到全局作用域
            function useState(initVal) {
                val = val|| initVal; // 判断val是否存在 存在就使用
                function setVal(newVal) {
                    val = newVal;
                    render(); // 修改val后 重新渲染页面
                }
                return [val, setVal];
            }
            ```

        * 简单的useEffect

            ```js
            let watchArr; // 为了记录状态变化 放到全局作用域
            function useEffect(fn,watch){
                // 判断是否变化 
                const hasWatchChange = watchArr?
                !watch.every((val,i)=>{ val===watchArr[i] }):true;
                if( hasWatchChange ){
                    fn();
                    watchArr = watch;
                }
            }
            ```

        * 解决同时调用多个 useState useEffect的问题

            ```js
            // 通过数组维护变量
            let memoizedState  = [];
            let currentCursor = 0;

            function useState(initVal) {
                memoizedState[currentCursor] = memoizedState[currentCursor] || initVal;
                function setVal(newVal) {
                    memoizedState[currentCursor] = newVal;
                    render(); 
                }
                // 返回state 然后 currentCursor+1
                return [memoizedState[currentCursor++], setVal]; 
            }

            function useEffect(fn, watch) {
                const hasWatchChange = memoizedState[currentCursor]
                    ? !watch.every((val, i) => val === memoizedState[currentCursor][i])
                    : true;
                if (hasWatchChange) {
                    fn();
                    memoizedState[currentCursor] = watch;
                    currentCursor++; // 累加 currentCursor
                }
            }
            ```

    * 用法

        * API

            ```js
            // 传入初始值，作为 state
            const [state, setState] = useState(initialState)

            //  `惰性初始 state`；传入函数，由函数计算出的值作为 state
            // 此函数只在初始渲染时被调用
            const [state, setState] = useState(() => {
                const initialState = someExpensiveComputation(props)
                return initialState
            })

            useEffect(() => {
                const subscription = props.source.subscribe()
                return () => {
                    // 清除订阅
                    subscription.unsubscribe()
                }
            }, [依赖])
            ```

        1. 普通hook

            ```js
            import React, { useState } from 'react';

            function Example() {
                // useState 会返回一对值：当前状态和一个让你更新它的函数,但是它不会把新的 state 和旧的 state 进行合并
                const [count, setCount] = useState(0);
                const [age, setAge] = useState(42);
                const [fruit, setFruit] = useState('banana');
                const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);

                return (
                    <div>
                    <p>You clicked {count} times</p>
                    <button onClick={() => setCount(count + 1)}>
                        Click me
                    </button>
                    </div>
                );
            }
            ```
            等价class
            ```js
            class Example extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        count: 0
                    };
                }

                render() {
                    return (
                    <div>
                        <p>You clicked {this.state.count} times</p>
                        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
                        Click me
                        </button>
                    </div>
                    );
                }
            }
            ```
            错误代码示例：{count} 到「1」以后就加不上了，状态变更 触发 页面渲染的本质是props, state, context其中一个参数变更,每次 count 都是重新声明的变量，指向一个全新的数据；每次的 setCount 虽然是重新声明的，但指向的是同一个引用
            ```js
            function ErrorDemo() {
                const [count, setCount] = useState(0);
                const dom = useRef(null);
                useEffect(() => {
                    dom.current.addEventListener('click', () => setCount(count + 1));
                }, []);
                return <div ref={dom}>{count}</div>;
            }
            ```
            修正方法1：消除依赖
            ```js
            () => setCount(prevCount => ++prevCount)
            ```
            修正方法2：重新绑定事件
            ```js
            useEffect(() => {
                const $dom = dom.current;
                const event = () => {
                    console.log(count);
                    setCount(prev => ++prev);
                };
                $dom.addEventListener('click', event);
                return () => $dom.removeEventListener('click', event);
            }, [count]);
            ```
            修正方法3：useRef
            ```js
            const [count, setCount] = useState(0);
            const countRef = useRef(count);
            useEffect(() => {
                dom.current.addEventListener('click', () => {
                        console.log(countRef.current);
                        setCount(prevCount => {
                        const newCount = ++prevCount;
                        countRef.current = newCount;
                        return newCount;
                    });
                });
            }, []);
            ```

        2. Effect Hook

            ```js
            import React, { useState, useEffect } from 'react';

            function Example() {
                const [count, setCount] = useState(0);
                // 相当于 componentDidMount 和 componentDidUpdate:
                // 副作用函数
                useEffect(() => {
                    document.title = `You clicked ${count} times`;
                });

                const [isOnline, setIsOnline] = useState(null);

                function handleStatusChange(status) {
                    setIsOnline(status.isOnline);
                }

                //可以多次使用
                useEffect(() => {
                    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
                    // 通过返回一个函数来指定如何“清除”副作用
                    return () => {
                        ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
                    };
                });

                if (isOnline === null) {
                    return 'Loading...';
                }
                return isOnline ? 'Online' : 'Offline';
            }
            ```

            注意：

            1. 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用
            2. 只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用。（除了自定义HOOK）

            重用状态逻辑： Hook 的每次调用都有一个完全独立的 state

            抽取逻辑useFriendStatus
            ```js
            import React, { useState, useEffect } from 'react';

            function useFriendStatus(friendID) {
                const [isOnline, setIsOnline] = useState(null);

                function handleStatusChange(status) {
                    setIsOnline(status.isOnline);
                }

                useEffect(() => {
                    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
                    return () => {
                    ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
                    };
                });

                return isOnline;
            }
            ```
            组件1使用
            ```js
            function FriendStatus(props) {
                const isOnline = useFriendStatus(props.friend.id);

                if (isOnline === null) {
                    return 'Loading...';
                }
                return isOnline ? 'Online' : 'Offline';
            }
            ```
            组件2使用
            ```js
            function FriendListItem(props) {
                const isOnline = useFriendStatus(props.friend.id);

                return (
                    <li style={{ color: isOnline ? 'green' : 'black' }}>
                    {props.friend.name}
                    </li>
                );
            }
            ```

        3. useContext：不使用组件嵌套就可以订阅 React 的 Context

            ```js
            function Example() {
                const locale = useContext(LocaleContext);
                const theme = useContext(ThemeContext);
                // ...
            }
            ```

        4. useReducer:通过 reducer 来管理组件本地的复杂 state

            ```js
            function Todos() {
                const [todos, dispatch] = useReducer(todosReducer);
                // ...
            }
            ```

        5. 自定义hook：一个函数，其名称以use开头，函数内部可以调用其他的 Hook

            ```js
            // myhooks.js
            // 下面自定义了一个获取窗口长宽值的hooks
            import React, { useState, useEffect, useCallback } from 'react'

            function useWinSize() {
                const [size, setSize] = useState({
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight
                })
                const onResize = useCallback(() => {
                    setSize({
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight
                    })
                }, [])

                useEffect(() => {
                    window.addEventListener('resize', onResize)
                    return () => {
                    window.removeEventListener('reisze', onResize)
                    }
                }, [onResize])
                return size
            }
            export const useWinSize
            ```

        6. useCallback(缓存函数)和useMemo(缓存函数的返回值)

            在组件内部，那些会成为其他useEffect依赖项的方法，建议用 useCallback 包裹，或者直接编写在引用它的useEffect中

            如果function会作为props传递给子组件，一定要使用 useCallback 包裹，对于子组件来说，如果每次render都会导致传递的函数发生变化，可能会造成非常大的困扰。同时也不利于react做渲染优化

            节流防抖很容易将useCallback与useMemo混淆

            错误示例:防止用户连续点击触发多次变更，加了防抖，停止点击1秒后才触发 count + 1 ，这个组件在理想下是OK的。但我们的页面组件非常多，这个 BadDemo 可能由于父级操作就重新render了。现在假使我们页面每500毫秒会重新render一次，那么就是这样：每次render导致handleClick其实是不同的函数，那么这个防抖自然而然就失效了。
            ```js
            function BadDemo() {
                const [count, setCount] = useState(1);
                const [, setRerender] = useState(false);
                const handleClick = debounce(() => {
                    setCount(c => ++c);
                }, 1000);
                useEffect(() => {
                    // 每500ms，组件重新render
                    window.setInterval(() => {
                    setRerender(r => !r);
                    }, 500);
                }, []);
                return <div onClick={handleClick}>{count}</div>;
            }
            ```
            错误修改1:只有第一次点击会count++,因为传入useCallback的是一段执行语句，而不是一个函数声明
            ```js
            const handleClick = useCallback(
                debounce(() => {
                    setCount(count + 1);
                }, 1000),
                []
            );
            ```
            正确修改:这样保证每当 count 发生变化时，会返回一个新的加了防抖功能的新函数
            ```js
            const handleClick = useMemo(
                () => debounce(() => {
                    setCount(count + 1);
                }, 1000),
                [count]
            );
            ```
            「连续点击后1秒，真正执行逻辑，在这过程中的重复点击失效」。而如果业务逻辑改成了「点击后立即发生状态变更，再之后的1秒内重复点击无效」又失效了
            ```js
            const handleClick = useMemo( () => throttle(() => { setCount(count + 1); }, 1000), [count] );
            ```
            这样又回到「消除依赖」 或 「使用ref」

        7. 汇总

            * useState

                可用于在函数中声明响应式变量和更新状态函数

                ```js
                const [state, setState] = useState(initialState);
                // 将状态更改为 'newState' 并触发重新渲染
                setState(newState);
                // 重新渲染`state`后的值为`newState`

                const [count, setCount] = useState(0);
                return (
                    <div>
                    <p>You clicked {count} times</p>
                    <button onClick={() => setCount(count + 1)}>
                        Click me
                    </button>
                    </div>
                );

                const stateArray = useState(false);
                stateArray[0]; // => 状态值
                return <div className={stateArray[0] ? 'bulb-on' : 'bulb-off'} />;
                ```

                实现代码见实现样例

                原理：全局变量保存初始值，set函数赋新值并更新视图

            * useEffect

                可用于在会在每次渲染后都执行一些额外代码(副作用),可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。

                ```js
                function Example() {
                    const [count, setCount] = useState(0);

                    //每次渲染后都执行
                    useEffect(() => {
                        document.title = `You clicked ${count} times`;
                    });
                }
                ```

                class生命周期与useEffect转化关系
                ```js
                class FriendStatus extends React.Component {
                    constructor(props) {
                        super(props);
                        this.state = { isOnline: null };
                        this.handleStatusChange = this.handleStatusChange.bind(this);
                    }

                    componentDidMount() {
                        ChatAPI.subscribeToFriendStatus(this.props.friend.id,this.handleStatusChange);
                    }
                    componentWillUnmount() {
                        ChatAPI.unsubscribeFromFriendStatus(this.props.friend.id,this.handleStatusChange);
                    }
                    handleStatusChange(status) {
                        this.setState({
                            isOnline: status.isOnline
                        });
                    }

                    render() {
                        if (this.state.isOnline === null) {
                            return 'Loading...';
                        }
                        return this.state.isOnline ? 'Online' : 'Offline';
                    }
                }

                function FriendStatus(props) {
                    const [isOnline, setIsOnline] = useState(null);

                    useEffect(() => {
                        function handleStatusChange(status) {
                            setIsOnline(status.isOnline);
                        }
                        ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
                        // Specify how to clean up after this effect:
                        return function cleanup() {
                            ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
                        };
                    });

                    if (isOnline === null) {
                        return 'Loading...';
                    }
                    return isOnline ? 'Online' : 'Offline';
                }
                ```

                如果传递一个空数组 []作为第二参数，告诉 useEffect 不依赖于 state、props中的任意值， useEffect 就只会运行一次
                ```js
                useEffect(() => {
                    document.title = `You clicked me`;
                }, []); // 只执行1次
                ```
                
                如果传递一个数组 [count,...]作为第二参数，则依赖项发生变化时执行
                ```js
                useEffect(() => {
                    document.title = `You clicked ${count} times`;
                }, [count]); // 仅在 count 更改时更新
                ```

                原理：记录全局监控数组，看第二个参数是否存在，存在的话看传入数组与全局监控数组是否有差异，有差异或第二个参数不存在，执行传入函数内容，更新全局监控数组

            * useContext

                用于跨层级共享state，获取 Provider 提供的数据

                ```js
                const PersonContext = React.createContext();
                const { Provider } = PersonContext;
                const Grandson = () => {
                    const info = useContext(PersonContext); // 无论隔了多少层级，都可以通过useContext获取到顶层的state
                    return (
                        <>
                        <span>My family name is {info.familyName}. I am grandson. My assets is : {info.income}</span>
                        </>
                    );
                }
                const Son = () => {
                    return (
                        <>
                        <span>I am son</span>
                        <br />
                        <Grandson></Grandson>
                        </>
                    );
                }
                const App = () => {
                    const [info, setInfo] = useState({
                        income: 1000000,
                        familyName: 'wang'
                    });
                    const onClickGrand = () => {
                        setInfo(x => ({ 
                            ...x,
                            income: x.income + 1000
                        }));
                    }
                    return (
                        <Provider value={info}>
                        <button onClick={onClickGrand}>grandfather</button>
                        <br />
                        <Son></Son>
                        </Provider>
                    );
                }
                ```

                原理：useContext 接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 CountContext.Provider 的 value prop 决定。当 CountContext.Provider 更新时，该 Hook 会触发重渲染，并使用最新传递给 CountContext provider 的 context value 值。

            * useReducer

                useState 的替代方案,原理类似redux
                ```js
                function init(initialCount) {
                    return {count: initialCount};
                }

                function reducer(state, action) {
                    switch (action.type) {
                        case 'increment':
                        return {count: state.count + 1};
                        case 'decrement':
                        return {count: state.count - 1};
                        case 'reset':
                        return init(action.payload);
                        default:
                        throw new Error();
                    }
                }

                function Counter({initialCount}) {
                    const [state, dispatch] = useReducer(reducer, initialCount, init);
                    return (
                        <>
                        Count: {state.count}
                        <button
                            onClick={() => dispatch({type: 'reset', payload: initialCount})}>
                            Reset
                        </button>
                        <button onClick={() => dispatch({type: 'decrement'})}>-</button>
                        <button onClick={() => dispatch({type: 'increment'})}>+</button>
                        </>
                    );
                }
                ```

            * useCallback和useMemo

                把标签内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的 memoized 版本(相当于vue computed缓存)，该回调函数仅在指定的依赖项改变时才会更新。

                人话：useMemo、useCallback都是使参数（函数）不会因为其他不相关的参数变化而重新渲染。与useEffect类似，[ ]内可以放入你改变数值就重新渲染参数（函数）的对象。如果[ ]为空就是只渲染一次，之后都不会渲染。

                useCallback和useMemo关系：useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。

                主要区别： React.useMemo 将调用 fn 函数并返回其结果，而 React.useCallback 将返回 fn 函数而不调用它。

                ```js
                const memoDom = useMemo(() => {
                    return <div>{memoValue}</div>
                }, [])
                const callbackTest = useCallback(() => setCount(c => c + 1), [])
                ```

                场景：

                有一个父组件，其中包含子组件，子组件接收一个函数作为 props ；通常而言，如果父组件更新了，子组件也会执行更新；但是大多数场景下，更新是没有必要的，我们可以借助 useCallback 来返回函数，然后把这个函数作为 props 传递给子组件；这样，子组件就能避免不必要的更新。

                不使用
                ```js
                function Example() {
                    const [count, setCount] = useState(1);
                    const [val, setValue] = useState('');
                
                    function getNum() {
                        return Array.from({length: count * 100}, (v, i) => i).reduce((a, b) => a+b)
                    }
                
                    return <div>
                        <h4>总和：{getNum()}</h4>
                        <div>
                            <button onClick={() => setCount(count + 1)}>+1</button>
                            <input value={val} onChange={event => setValue(event.target.value)}/>
                        </div>
                    </div>;
                }
                ```

                useCallback
                ```js
                function Parent() {
                    const [count, setCount] = useState(1);
                    const [val, setValue] = useState('');
                
                    const getNum = useCallback(() => {
                        return Array.from({length: count * 100}, (v, i) => i).reduce((a, b) => a+b)
                    }, [count])
                
                    return <div>
                        <Child getNum={getNum} />
                        <div>
                            <button onClick={() => setCount(count + 1)}>+1</button>
                            <input value={val} onChange={event => setValue(event.target.value)}/>
                        </div>
                    </div>;
                }
                
                const Child = React.memo(function ({ getNum }: any) {
                    return <h4>总和：{getNum()}</h4>
                })
                ```

                useMemo
                ```js
                function Example() {
                    const [count, setCount] = useState(1);
                    const [val, setValue] = useState('');
                
                    const getNum = useMemo(() => {
                        return Array.from({length: count * 100}, (v, i) => i).reduce((a, b) => a+b)
                    }, [count])
                
                    return <div>
                        <h4>总和：{getNum()}</h4>
                        <div>
                            <button onClick={() => setCount(count + 1)}>+1</button>
                            <input value={val} onChange={event => setValue(event.target.value)}/>
                        </div>
                    </div>;
                }
                ```

            * useRef

                useRef返回一个可变的ref对象,initialValue被赋值给其返回值的.current对象,可以保存任何类型的值:dom、对象等任何可变值

                ref对象与自建一个{current：‘’}对象的区别是：useRef会在每次渲染时返回同一个ref对象，即返回的ref对象在组件的整个生命周期内保持不变。自建对象每次渲染时都建立一个新的。

                ref对象的值发生改变之后，不会触发组件重新渲染。如有需要，把它的改变动作放到useState()之前。

                ```js
                function TextInputWithFocusButton() {
                    const inputEl = useRef(null);
                    const onButtonClick = () => {
                        // `current` 指向已挂载到 DOM 上的文本输入元素
                        inputEl.current.focus();
                    };
                    return (
                        <>
                        <input ref={inputEl} type="text" />
                        <button onClick={onButtonClick}>Focus the input</button>
                        </>
                    );
                }
                ```

## react和vue的区别

1. 参考链接

    [前端面试题全面整理-带解析 涵盖CSS、JS、浏览器、Vue、React、移动web、前端性能、算法、Node](https://mp.weixin.qq.com/s/YrKGMORhB_POmfWZVWRkHg)

2. 详解

    数据是否可变: react整体是函数式的思想，把组件设计成纯组件，状态和逻辑通过参数传入，所以在react中，是单向数据流，推崇结合immutable来实现数据不可变; vue的思想是响应式的，也就是基于是数据可变的，通过对每一个属性建立Watcher来监听，当属性变化的时候，响应式的更新对应的虚拟dom。总之，react的性能优化需要手动去做，而vue的性能优化是自动的，但是vue的响应式机制也有问题，就是当state特别多的时候，Watcher也会很多，会导致卡顿，所以大型应用（状态特别多的）一般用react，更加可控。

    通过js来操作一切，还是用各自的处理方式: react的思路是all in js，通过js来生成html，所以设计了jsx，还有通过js来操作css，社区的styled-component、jss等; vue是把html，css，js组合到一起，用各自的处理方式，vue有单文件组件，可以把html、css、js写到一个文件中，html提供了模板引擎来处理。

    类式的组件写法，还是声明式的写法: react是类式的写法，api很少; 而vue是声明式的写法，通过传入各种options，api和参数都很多。所以react结合typescript更容易一起写，vue稍微复杂。

    扩展不同: react可以通过高阶组件（Higher Order Components--HOC）来扩展，而vue需要通过mixins来扩展。

    什么功能内置，什么交给社区去做: react做的事情很少，很多都交给社区去做，vue很多东西都是内置的，写起来确实方便一些，
    比如 redux的combineReducer就对应vuex的modules，
    比如reselect就对应vuex的getter和vue组件的computed，
    vuex的mutation是直接改变的原始数据，而redux的reducer是返回一个全新的state，所以redux结合immutable来优化性能，vue不需要。

## Fragments

1. 参考链接

    [react文档](https://react.docschina.org/docs/fragments.html)

2. 详解

    Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点

    如果Columns组件是以div包裹，则div紧跟tr，标签无效
    ```jsx
    class Table extends React.Component {
        render() {
            return (
                <table>
                    <tr>
                        <Columns />
                    </tr>
                </table>
            );
        }
    }
    ```
    把Columns组件改为如下
    ```jsx
    class Columns extends React.Component {
        render() {
            return (
                <React.Fragment>
                    <td>Hello</td>
                    <td>World</td>
                </React.Fragment>
            );
        }
    }
    ```
    可简写
    ```jsx
    class Columns extends React.Component {
        render() {
            return (
                <>
                    <td>Hello</td>
                    <td>World</td>
                </>
            );
        }
    }
    ```
    带 key 的 Fragments(key 是唯一可以传递给 Fragment 的属性)
    ```jsx
    function Glossary(props) {
        return (
            <dl>
            {props.items.map(item => (
                // 没有`key`，React 会发出一个关键警告
                <React.Fragment key={item.id}>
                <dt>{item.term}</dt>
                <dd>{item.description}</dd>
                </React.Fragment>
            ))}
            </dl>
        );
    }
    ```

## 插槽

1. 参考链接

    [react文档](https://react.docschina.org/docs/portals.html)

    [Portals](https://www.yuque.com/chenzilong/rglnod/vlvg3i)

2. 详解

    Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的方案。

    用法

    React 挂载了一个新的 div，并且把子元素渲染其中
    ```jsx
    render() {
        return (
            <div>
            {this.props.children}
            </div>
        );
    }
    ```

    将子元素插入到 DOM 节点中的指定位置,domNode是一个可以在任何位置的有效 DOM 节点
    ```jsx
    render() {
        return ReactDOM.createPortal(
            this.props.children,//第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 fragment。需要渲染的组件
            domNode//第二个参数（container）是一个 DOM 元素，需要渲染到的指定节点
        );
    }
    ```

## 分析器

1. 参考链接

    [react文档](https://react.docschina.org/docs/profiler.html)

2. 详解

    Profiler 能添加在 React 树中的任何地方来测量树中这部分渲染所带来的开销。 它的目的是识别出应用中渲染较慢的部分。

    样例
    ```jsx
    render(
        <App>
            <Profiler id="Panel" onRender={callback}>
            <Panel {...props}>
                <Profiler id="Content" onRender={callback}>
                <Content {...props} />
                </Profiler>
                <Profiler id="PreviewPane" onRender={callback}>
                <PreviewPane {...props} />
                </Profiler>
            </Panel>
            </Profiler>
        </App>
    );
    function onRenderCallback(
        id, // 发生提交的 Profiler 树的 “id”
        phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
        actualDuration, // 本次更新 committed 花费的渲染时间
        baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
        startTime, // 本次更新中 React 开始渲染的时间
        commitTime, // 本次更新中 React committed 的时间
        interactions // 属于本次更新的 interactions 的集合
    ) {
    // 合计或记录渲染时间。。。
    }
    ```


## setState同步异步

1. 参考链接

    [前端面试题 （一）:（React）setState为什么异步？能不能同步？什么时候异步？什么时候同步？](https://blog.csdn.net/qq_39989929/article/details/94041143)
    
    [React 架构的演变 - 从同步到异步](https://juejin.im/post/6875681311500025869#heading-2)

    [React 灵魂 23 问，你能答对几个？](https://mp.weixin.qq.com/s/uMZMcoN5Kxkp_DUHcF-_9g)

2. 详解

    1. setState为什么是异步的、什么时候是异步的？

        setState本身的执行过程是同步的，只是因为在react的合成事件与钩子函数中执行顺序在更新之前，所以不能直接拿到更新后的值，形成了所谓的异步；

    2. 能不能同步，什么时候是同步的？

        可以同步，在原生事件与setTimeout中是同步的

    * V15 setState更新机制

        setState 的主要逻辑都在 ReactUpdateQueue 中实现，在调用 setState 后，并没有立即修改 state，而是将传入的参数放到了组件内部的 _pendingStateQueue 中，之后调用 enqueueUpdate 来进行更新。

        enqueueUpdate 首先会通过 batchingStrategy.isBatchingUpdates 判断当前是否在更新流程，如果不在更新流程，会调用 batchingStrategy.batchedUpdates() 进行更新。如果在流程中，会将待更新的组件放入 dirtyComponents 进行缓存。

        atchingStrategy 是 React 进行批处理的一种策略，该策略的实现基于 Transaction,Transaction 通过 perform 方法启动，然后通过扩展的 getTransactionWrappers 获取一个数组，该数组内存在多个 wrapper 对象，每个对象包含两个属性：initialize、close。perform 中会先调用所有的 wrapper.initialize，然后调用传入的回调，最后调用所有的 wrapper.close。

        启动事务可以拆分成三步来看：

        1. 先执行 wrapper 的 initialize，此时的 initialize 都是一些空函数，可以直接跳过；
        2. 然后执行 callback（也就是 enqueueUpdate），执行 enqueueUpdate 时，由于已经进入了更新状态，batchingStrategy.isBatchingUpdates 被修改成了 true，所以最后还是会把 component 放入脏组件队列，等待更新；
        3. 后面执行的两个 close 方法，第一个方法的 flushBatchedUpdates 是用来进行组件更新的，第二个方法用来修改更新状态，表示更新已经结束。

        flushBatchedUpdates 里面会取出所有的脏组件队列进行 diff，最后更新到 DOM。

        在组件 mount 和事件调用的时候，都会调用 batchedUpdates，这个时候已经开始了事务，所以只要不脱离 React，不管多少次 setState 都会把其组件放入脏组件队列等待更新。一旦脱离 React 的管理，比如在 setTimeout 中，setState 立马变成单打独斗。

    * Concurrent 

        React 16 引入的 Fiber 架构，就是为了后续的异步渲染能力做铺垫，虽然架构已经切换，但是异步渲染的能力并没有正式上线，我们只能在实验版中使用。异步渲染指的是 Concurrent 模式(Concurrent 模式是 React 的新功能，可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整。)

        除了 Concurrent 模式，React 还提供了另外两个模式， Legacy 模式依旧是同步更新的方式，可以认为和旧版本保持一致的兼容模式，而 Blocking 模式是一个过渡版本。

        Concurrent 模式说白就是让组件更新异步化，切分时间片，渲染之前的调度、diff、更新都只在指定时间片进行，如果超时就暂停放到下个时间片进行，中途给浏览器一个喘息的时间。

        浏览器是单线程，它将 GUI 描绘，时间器处理，事件处理，JS 执行，远程资源加载统统放在一起。当做某件事，只有将它做完才能做下一件事。如果有足够的时间，浏览器是会对我们的代码进行编译优化（JIT）及进行热代码优化，一些 DOM 操作，内部也会对 reflow 进行处理。reflow 是一个性能黑洞，很可能让页面的大多数元素进行重新布局。

        浏览器的运作流程: 渲染 -> tasks -> 渲染 -> tasks -> 渲染 -> ....

        这些 tasks 中有些我们可控，有些不可控，比如 setTimeout 什么时候执行不好说，它总是不准时；资源加载时间不可控。但一些JS我们可以控制，让它们分派执行，tasks的时长不宜过长，这样浏览器就有时间优化 JS 代码与修正 reflow ！

        说明在 Concurrent 模式下，即使脱离了 React 的生命周期(在setTimeout中)，setState 依旧能够合并更新。主要原因是 Concurrent 模式下，真正的更新操作被移到了下一个事件队列中，类似于 Vue 的 nextTick。

    * 调用 setState 之后发生了什么？

        1. 在 setState 的时候，React 会为当前节点创建一个 updateQueue 的更新列队。
        2. 然后会触发 reconciliation 过程，在这个过程中，会使用名为 Fiber 的调度算法，开始生成新的 Fiber 树， Fiber 算法的最大特点是可以做到异步可中断的执行。
        3. 然后 React Scheduler 会根据优先级高低，先执行优先级高的节点，具体是执行 doWork 方法。
        4. 在 doWork 方法中，React 会执行一遍 updateQueue 中的方法，以获得新的节点。然后对比新旧节点，为老节点打上 更新、插入、替换 等 Tag。
        5. 当前节点 doWork 完成后，会执行 performUnitOfWork 方法获得新节点，然后再重复上面的过程。
        6. 当所有节点都 doWork 完成后，会触发 commitRoot 方法，React 进入 commit 阶段。
        7. 在 commit 阶段中，React 会根据前面为各个节点打的 Tag，一次性更新整个 dom 元素。

## react源码简述

参考链接：

[「面试」你不知道的 React 和 Vue 的 20 个区别](https://mp.weixin.qq.com/s/vZo1XlMLxrzAyALzIPlktw)

* React.Component

    1. 原型上挂载了setState和forceUpdate方法;
    2. 提供props,context,refs 等属性;
    3. 组件定义通过 extends 关键字继承 Component;

* 挂载

    1. render 方法调用了React.createElement方法(实际是ReactElement方法)；
    2. ReactDOM.render(component，mountNode)的形式对自定义组件/原生DOM/字符串进行挂载；
    3. 调用了内部的ReactMount.render，进而执行ReactMount._renderSubtreeIntoContainer,就是将子DOM插入容器；
    4. ReactDOM.render()根据传入不同参数会创建四大类组件，返回一个 VNode；
    5. 四大类组件封装的过程中，调用了mountComponet方法，触发生命周期，解析出 HTML；

* 组件类型和生命周期

    1. ReactEmptyComponent,ReactTextComponent,ReactDOMComponent组件没有触发生命周期;
    2. ReactCompositeComponent类型调用mountComponent方法,会触发生命周期,处理 state 执行componentWillMount钩子,执行 render,获得 html,执行componentDidMounted

* data 更新 setState

    1. setState 通过一个队列机制来实现 state 更新，当执行 setState() 时，会将需要更新的 state 浅合并后,根据变量 isBatchingUpdates(默认为 false)判断是直接更新还是放入状态队列；

    2. 通过js的事件绑定程序 addEventListener 和使用setTimeout/setInterval 等 React 无法掌控的 API情况下isBatchingUpdates 为 false，同步更新。除了这几种情况外batchedUpdates函数将isBatchingUpdates修改为 true；

    3. 放入队列的不会立即更新 state，队列机制可以高效的批量更新 state。而如果不通过setState，直接修改this.state 的值，则不会放入状态队列;

    4. setState 依次直接设置 state 值会被合并，但是传入 function 不会被合并；

        让setState接受一个函数的API的设计是相当棒的！不仅符合函数式编程的思想，让开发者写出没有副作用的函数，而且我们并不去修改组件状态，只是把要改变的状态和结果返回给 React，维护状态的活完全交给React去做。正是把流程的控制权交给了React，所以React才能协调多个setState调用的关系

    5. 更新后执行四个钩子:shouleComponentUpdate,componentWillUpdate,render,componentDidUpdate

* 数据绑定

    setState 更新 data 后,shouldComponentUpdate为 true会生成 VNode,为 false 会结束;2.VNode会调用 DOM diff,为 true 更新组件;

    * 注意

        1. 单向数据流;
        2. setSate 更新data 值后，组件自己处理;
        3. differ 是首位是除删除外是固定不动的,然后依次遍历对比;

    * AST 和 VNode 

        1. 都是 JSON 对象；
        2. AST 是HTML,JS,Java或其他语言的语法的映射对象，VNode 只是 DOM 的映射对象，AST 范围更广；
        3. AST的每层的element，包含自身节点的信息(tag,attr等)，同时parent，children分别指向其父element和子element，层层嵌套，形成一棵树
        4. vnode就是一系列关键属性如标签名、数据、子节点的集合，可以认为是简化了的dom:

    * differ 算法

        1. Virtual DOM 中的首个节点不执行移动操作（除非它要被移除），以该节点为原点，其它节点都去寻找自己的新位置; 一句话就是首位是老大,不移动;
        2. 在 Virtual DOM 的顺序中，每一个节点与前一个节点的先后顺序与在 Real DOM 中的顺序进行比较，如果顺序相同，则不必移动，否则就移动到前一个节点的前面或后面;
        3. tree diff:只会同级比较,如果是跨级的移动,会先删除节点 A,再创建对应的 A;将 O(n3) 复杂度的问题转换成 O(n) 复杂度;
        4. component diff:
        
            根据batchingStrategy.isBatchingUpdates值是否为 true;如果true 同一类型组件,按照 tree differ 对比;如果 false将组件放入 dirtyComponent,下面子节点全部替换

        5. element differ:
        
            tree differ 下面有三种节点操作:INSERT_MARKUP（插入）、MOVE_EXISTING（移动）和 REMOVE_NODE（删除）

* 关于循环加key

    1. 都是相同的节点，但由于位置发生变化，导致需要进行繁杂低效的删除、创建操作，其实只要对这些节点进行位置移动即可；

        新老集合进行 diff 差异化对比，发现 B != A，则创建并插入 B 至新集合，删除老集合 A；以此类推，创建并插入 A、D 和 C，删除 B、C 和 D；

    2. 新建：从新集合中取得 E，判断老集合中不存在相同节点 E，则创建新节点 ElastIndex不做处理E的位置更新为新集合中的位置，nextIndex++；

    3. 删除：当完成新集合中所有节点 diff 时，最后还需要对老集合进行循环遍历，判断是否存在新集合中没有但老集合中仍存在的节点，发现存在这样的节点 D，因此删除节点 D；

    4. 总结:

        显然加了 key 后操作步骤要少很多,性能更好；
        
        但是都会存在一个问题，上面场景二只需要移动首位，位置就可对应，但是由于首位是老大不能动，所以应该尽量减少将最后一个节点移动到首位

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

* Redux

    1. Redux则是一个纯粹的状态管理系统，React利用React-Redux将它与React框架结合起来；

    2. 只有一个用createStore方法创建一个 store；

    3. action接收 view 发出的通知，告诉 Store State 要改变，有一个 type 属性；

    4. reducer:纯函数来处理事件，纯函数指一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用,得到一个新的 state；

    5. 源码组成:

        1. createStore 创建仓库，接受reducer作为参数
        2. bindActionCreator 绑定store.dispatch和action 的关系  
        3. combineReducers 合并多个reducers  
        4. applyMiddleware 洋葱模型的中间件,介于dispatch和action之间，重写dispatch
        5. compose 整合多个中间件
        6. 单一数据流;state 是可读的,必须通过 action 改变;reducer设计成纯函数;

    * 对比
        1. Redux：view——>actions——>reducer——>state变化——>view变化（同步异步一样）
        2. Vuex：view——>commit——>mutations——>state变化——>view变化（同步操作） 
        view——>dispatch——>actions——>mutations——>state变化——>view变化（异步操作）

* redux 为什么要把 reducer 设计成纯函数

    1. 纯函数概念:一个函数的返回结果只依赖于它的参数(外面的变量不会改变自己)，并且在执行过程里面没有副作用(自己不会改变外面的变量)；

    2. 主要就是为了减小副作用，避免影响 state 值，造成错误的渲染；

    3. 把reducer设计成纯函数，便于调试追踪改变记录；

    4. 源码组成:

        1. connect 将store和dispatch分别映射成props属性对象，返回组件
        2. context 上下文 导出Provider和 consumer
        3. Provider 一个接受store的组件，通过context api传递给所有子组件

    5. 使用
    ```js
    function createStore(reducer) {
        let state;
        let listeners=[];
        function getState() {
            return state;
        }

        function dispatch(action) {
            state=reducer(state,action);
            listeners.forEach(l=>l());
        }

        function subscribe(listener) {
            listeners.push(listener);
            return function () {
                const index=listeners.indexOf(listener);
                listeners.splice(inddx,1);
            }
        }
        
        dispatch({});
        
        return {
            getState,
            dispatch,
            subscribe
        }

    }
    ```

* React 的 state 是对象

    因为 state 是定义在函数里面,作用域已经独立

* react16 的 fiber 理解

    1. react 可以分为 differ 阶段和 commit(操作 dom)阶段；

    2. v16 之前是向下递归算法，会阻塞；

    3. v16 引入了代号为 fiber 的异步渲染架构；

    4. fiber 核心实现了一个基于优先级和requestIdleCallback循环任务调度算法；

    5. 算法可以把任务拆分成小任务，可以随时终止和恢复任务，可以根据优先级不同控制执行顺序。

## 点击外部元素

参考链接：

[react 实现点击div外部触发事件](https://blog.csdn.net/zSY_snake/article/details/89405112)

```js
constructor(){
    this.divElement = null;
}
 
render() {
    return(
        <div ref={ node => this.divElement = node}><div/>
    )
}

componentDidMount() {
    document.addEventListener('click', this.outDivClickHandler);   
}

componentWillUnmount() {
    document.removeEventListener('click', this.outDivClickHandler);
}

outDivClickHandler(e) {
    const target = e.target;
    // 组件已挂载且事件触发对象不在div内
    if( this.divElement  && target !== this.menu && !this.divElement.contains(target)) {
        
    }  
}
```

## react性能优化

参考链接：

[Vue转React两个月来总结的性能优化方法](https://juejin.im/post/6889825025638006797)

1. 循环加key，diff算法相关
2. 精简节点，diff算法相关

    ```html
    <div className="root">
        <div>
            <h1>我的名字：{name}</h1>
        </div>
        <div>
            <p>我的简介: {content}</p>
        </div>
    </div>
    精简为
    <div className="root">
        <h1>我的名字：{name}</h1>
        <p>我的简介: {content}</p>
    </div>
    ```
3. 精简state:只把响应式数据放入state
4. useMemo缓存计算结果

    ```jsx
    import React, { useMemo } from 'react';

    export default function App() {
        const [num, setNum] = useState(0);

        // const [factorializeNum, setFactorializeNum] = useState(5);

        // 阶乘函数
        // const factorialize = (): Number => {
        //     console.log('触发了');
        //     let result = 1;
        //     for (let i = 1; i <= factorializeNum; i++) {
        //         result *= i;
        //     }
        //     return result;
        // };

        const [factorializeNum, setFactorializeNum] = useState(5);

        // 当factorializeNum值不变的时候，这个函数不会再重复触发了
        const factorialize = useMemo((): Number => {
            console.log('触发了');
            let result = 1;
            for (let i = 1; i <= factorializeNum; i++) {
            result *= i;
            }
            return result;
        }, [factorializeNum]);

        return (
            <>
            {num}
            <button onClick={() => setNum(num + factorialize())}>修改num</button>
            <button onClick={() => setFactorializeNum(factorializeNum + 1)}>修改阶乘参数</button>
            </>
        );
    }
    ```
5. 三元表达式/&&替代if else
6. 异步组件（懒加载组件）

    ```jsx
    import React from 'react';

    export default (props) => {
        return (
            <>
            <Drawer>
                <Tabs defaultActiveKey="1">
                <TabPane>
                    <React.Suspense fallback={<Loading />}>
                    {React.lazy(() => import('./Component1'))}
                    </React.Suspense>
                </TabPane>
                <TabPane>
                    <React.Suspense fallback={<Loading />}>
                    {React.lazy(() => import('./Component2'))}
                    </React.Suspense>
                </TabPane>
                </Tabs>
            </Drawer>
            </>
        );
    };
    ```
7. 减少组件的render

    * React.memo:会判断子组件的props是否有改变，如果没有，将不会重复render

        ```jsx
        import React from 'react';

        const Child = React.memo(() => {
            console.log('触发Child组件渲染');
            return (
                <h1>这是child组件的渲染内容！</h1>
            )
        });

        export default () => {
            const [num, setNum] = useState(0);
            
            return (
                <>
                {num}
                <button onClick={() => setNum(num + 1)}>num加1</button>
                <Child />
                </>
            );
        }
        ```

    * 不要直接使用内联对象

        样例
        ```jsx
        import React from 'react';

        const Child = React.memo((props) => {
            const { style } = props;
            console.log('触发Child组件渲染');
            return (
                <h1 style={style}>这是child组件的渲染内容！</h1>
            )
        });

        export default () => {
            const [num, setNum] = useState(0);
            
            return (
                <>
                {num}
                <button onClick={() => setNum(num + 1)}>num加1</button>
                <Child style={{color: 'green'}}/>
                </>
            );
        }
        ```
        修改1
        ```jsx
        // 如果传入的参数是完全独立的，没有任何的耦合
        // 可以将该参数，提取到渲染函数之外
        const childStyle = { color: 'green' };
        export default () => {
            const [num, setNum] = useState(0);
            
            return (
                <>
                {num}
                <button onClick={() => setNum(num + 1)}>num加1</button>
                <Child style={childStyle}/>
                </>
            );
        }
        // 如果传入的参数需要使用渲染函数里的参数或者方法
        // 可以使用useMemo
        export default () => {
            const [num, setNum] = useState(0);
            const [style, setStyle] = useState('green');
            // 如果不需要参数
            const childStyle = useMemo(() => ({ color: 'green' }), []);
            // 如果需要使用state或者方法
            const childStyle = useMemo(() => ({ color: style }), [style]);
            return (
                <>
                {num}
                <button onClick={() => setNum(num + 1)}>num加1</button>
                <Child style={childStyle}/>
                </>
            );
        }
        ```
        修改2
        ```jsx
        import React from 'react';

        const Child = React.memo((props) => {
            const { style } = props;
            console.log('触发Child组件渲染');
            return (
                <h1 style={style}>这是child组件的渲染内容！</h1>
            )
        });

        export default () => {
            const [num, setNum] = useState(0);
            
            return (
                <>
                {num}
                <button onClick={() => setNum(num + 1)}>num加1</button>
                <Child style={{color: 'green'}}/>
                </>
            );
        }
        ```
    * 传入组件的函数使用React.useCallback

        ```jsx
        export default () => {
            const [num, setNum] = useState(0);
            const oneFnc = useCallback(() => {
                console.log('这是传入child的方法');
            }, []);
            return (
                <>
                {num}
                <button onClick={() => setNum(num + 1)}>num加1</button>
                <Child onFnc={oneFnc} />//要避免在子组件的传入参数上直接写匿名函数<Child onFnc={() => console.log('这是传入child的方法')} />
                </>
            );
        }
        ```
    * 使用children来避免React Context子组件的重复渲染

        样例
        ```jsx
        import React, { useContext, useState } from 'react';

        const DemoContext = React.createContext();

        const Child = () => {
            console.log('触发Child组件渲染');
            return (
                <h1 style={style}>这是child组件的渲染内容！</h1>
            )
        };

        export default () => {
            const [num, setNum] = useState(0);
            return (
                <DemoContext.Provider value={num}>
                <button onClick={() => setNum(num + 1)}>num加1</button>
                <Child />
                {...一些其他需要使用num参数的组件}
                </DemoContext.Provider>
            );
        }
        ```
        修改:修改state,只是对于DemoComponent这个组件内部进行render，对于外部传入的Child组件，将不会重复渲染。
        ```jsx
        import React, { useContext, useState } from 'react';

        const DemoContext = React.createContext();

        const Child = () => {
        console.log('触发Child组件渲染');
        return (
            <h1 style={style}>这是child组件的渲染内容！</h1>
        )
        };

        function DemoComponent(props) {
        const { children } = props;
        const [num, setNum] = useState(0);
        return (
            <DemoContext.Provider value={num}>
            <button onClick={() => setNum(num + 1)}>num加1</button>
            {children}
            </DemoContext.Provider>
        );
        }

        export default () => {
        return (
            <DemoComponent>
            <Child />
            {...一些其他需要使用num参数的组件}
            </DemoComponent>
        );
        }
        ```

## 错误边界

参考链接：

[错误边界](https://www.yuque.com/chenzilong/rglnod/hbqly4)

* 用途

    用来解决系统crash，造成整个页面挂掉的问题

    部分 UI 的 JavaScript 错误不应该导致整个应用崩溃，为了解决这个问题，React 16 引入了一个新的概念 —— 错误边界。

    错误边界是一种 React 组件，这种组件可以捕获并打印发生在其子组件树任何位置的 JavaScript 错误，并且，它会渲染出备用 UI

* 无法捕获错误的场景

    1. 事件处理
    2. 异步代码
    3. ssr
    4. 非子组件错误

* 错误处理

    抛出错误后，使用 static getDerivedStateFromError() 渲染备用 UI ，使用 componentDidCatch() 打印错误信息

    错误边界的工作方式类似于 JavaScript 的 catch {}，不同的地方在于错误边界只针对 React 组件。只有 class 组件才可以成为错误边界组件。大多数情况下, 你只需要声明一次错误边界组件, 并在整个应用中使用它。

    注意错误边界仅可以捕获其子组件的错误，它无法捕获其自身的错误。如果一个错误边界无法渲染错误信息，则错误会冒泡至最近的上层错误边界，这也类似于 JavaScript 中 catch {} 的工作机制。

* 样例

    ```js
    import React from 'react'
    import Main from './Main'

    class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }

        static getDerivedStateFromError(error) {
            // 更新 state 使下一次渲染能够显示降级后的 UI
            debugger
            return { hasError: true };
        }

        componentDidCatch(error, errorInfo) {
            // 你同样可以将错误日志上报给服务器
            console.error(error, errorInfo);

            debugger
        }

        render() {
            if (this.state.hasError) {
                // 你可以自定义降级后的 UI 并渲染
                return <h1>Something went wrong.</h1>;
            }

            return this.props.children;
        }
    }

    export default ErrorBoundary;
    ```

    ```js
    import React from 'react'

    class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }

        render() {
            return <div>
            {this.state.form()}
            </div>;
        }
    }

    export default ErrorBoundary;
    ```

## jsx到javascript的转换过程

参考链接：

[jsx到javascript的转换过程](https://www.yuque.com/chenzilong/rglnod/bg3c94)

* 过程

```jsx
function Component (props) {
  return <div>{props.children}</div>
}

<div id="id" key="key1" style={{display: 'none'}} ref="123">
  <Component key="key2" name="rodchen"><span>children</span></Component>
  <span>2</span>
  <span>3</span>
</div>
```

```js
function Component() {
  return /*#__PURE__*/React.createElement("div", null, "component");
}

/*#__PURE__*/
React.createElement(
  "div", 
  {
    id: "id",
    key: "key1",
    style: {
      display: 'none'
    },
    ref: "123"
  },
  React.createElement(
    Component, 
    {
      key: "key2",
      name: "rodchen"
    },
    React.createElement("span", null, "children")
  ),
  React.createElement("span", null, "2"),
  React.createElement("span", null, "3")
);
```

## react源码api

参考链接：

[jsx到javascript的转换过程](https://www.yuque.com/chenzilong/rglnod/bg3c94)

* 版本v16.13.1

* createElement(组件类型或者元素类型或者系统内置类型, props的集合, 子节点数据)

```js
export function createElement(type, config, children) {
  // 处理参数

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}

const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };

  return element
}
```

* Component

基类
```js
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}
```

原型操作
```js
Component.prototype.isReactComponent = {};

Component.prototype.setState = function(partialState, callback) {
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.',
  );
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

* PureComponent

这里就是做了PureComponent对Component的原型继承，然后多加了一个在PureComponent的原型上属性isPureReactComponent。

这里中间用了一个ComponentDummy，是因为，需要在原型上面多加一个属性，又不能污染Component的原型。

```js
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

/**
 * Convenience component with default shallow equality check for sCU.
 */
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;
```

* createRef

```js
// an immutable object with a single mutable value
export function createRef(): RefObject {
  const refObject = {
    current: null,
  };
  if (__DEV__) {
    Object.seal(refObject);
  }
  return refObject;
}
```

* forwardRef

```js
export function forwardRef<Props, ElementType: React$ElementType>(
  render: (props: Props, ref: React$Ref<ElementType>) => React$Node,
) {
  const elementType = {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  };

  return elementType;
}
```

* context

```js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import {REACT_PROVIDER_TYPE, REACT_CONTEXT_TYPE} from 'shared/ReactSymbols';

import type {ReactContext} from 'shared/ReactTypes';

export function createContext<T>(
  defaultValue: T,
  calculateChangedBits: ?(a: T, b: T) => number,
): ReactContext<T> {
  if (calculateChangedBits === undefined) {
    calculateChangedBits = null;
  } else {
    if (__DEV__) {
      // ****
    }
  }

  const context: ReactContext<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: (null: any),
    Consumer: (null: any),
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context,
  };

  let hasWarnedAboutUsingNestedContextConsumers = false;
  let hasWarnedAboutUsingConsumerProvider = false;
  let hasWarnedAboutDisplayNameOnConsumer = false;

  if (__DEV__) {
    // ****
  } else {
    context.Consumer = context;
  }


  return context;
}
```

* Lazy

```js
export function lazy<T>(
  ctor: () => Thenable<{default: T, ...}>,
): LazyComponent<T, Payload<T>> {
  const payload: Payload<T> = {
    // We use these fields to store the result.
    _status: -1,
    _result: ctor,
  };

  const lazyType: LazyComponent<T, Payload<T>> = {
    $$typeof: REACT_LAZY_TYPE,
    _payload: payload,
    _init: lazyInitializer,
  };

  if (__DEV__) {
    // ***
  }

  return lazyType;
}
```

* useState

```js
export function useState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
```

* resolveDispatcher

```js
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  invariant(
    dispatcher !== null,
    'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' +
      ' one of the following reasons:\n' +
      '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' +
      '2. You might be breaking the Rules of Hooks\n' +
      '3. You might have more than one copy of React in the same app\n' +
      'See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.',
  );
  return dispatcher;
}
```

* ReactCurrentDispatcher

```js
const ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: (null: null | Dispatcher),
};
```

* Router

```js
class Router extends React.Component {
  static computeRootMatch(pathname) {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
  }

  constructor(props) {
    super(props);

    this.state = {
      location: props.history.location
    };

    // This is a bit of a hack. We have to start listening for location
    // changes here in the constructor in case there are any <Redirect>s
    // on the initial render. If there are, they will replace/push when
    // they mount and since cDM fires in children before parents, we may
    // get a new location before the <Router> is mounted.
    this._isMounted = false;
    this._pendingLocation = null;

    if (!props.staticContext) {
      
      // 监控hash变化
      this.unlisten = props.history.listen(location => {
        if (this._isMounted) {
          // 更新location
          this.setState({ location });
        } else {
          this._pendingLocation = location;
        }
      });
    }
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._pendingLocation) {
      this.setState({ location: this._pendingLocation });
    }
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
      this._isMounted = false;
      this._pendingLocation = null;
    }
  }

  render() {
    return (
      // context 数据，会根据location的变化渲染子节点
      <RouterContext.Provider
        value={{
          history: this.props.history,
          location: this.state.location,
          match: Router.computeRootMatch(this.state.location.pathname),
          staticContext: this.props.staticContext
        }}
      >
        <HistoryContext.Provider
          children={this.props.children || null}
          value={this.props.history}
        />
      </RouterContext.Provider>
    );
  }
}
```

* Route

```js
class Route extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          invariant(context, "You should not use <Route> outside a <Router>");

          const location = this.props.location || context.location;
    
          // 这里的computedMatch是服务语switch的，如果使用switch，这个值就会有值
          const match = this.props.computedMatch
            ? this.props.computedMatch // <Switch> already computed the match for us
            : this.props.path
            ? matchPath(location.pathname, this.props)  // match函数，是否路由命中
            : context.match;

          const props = { ...context, location, match };

          let { children, component, render } = this.props;

          // Preact uses an empty array as children by
          // default, so use null if that's the case.
          if (Array.isArray(children) && isEmptyChildren(children)) {
            children = null;
          }

          return (
            <RouterContext.Provider value={props}>
              {props.match                    // 根据match的值渲染页面
                ? children
                  ? typeof children === "function"
                    ? __DEV__
                      ? evalChildrenDev(children, props, this.props.path)
                      : children(props)
                    : children
                  : component
                  ? React.createElement(component, props)
                  : render
                  ? render(props)
                  : null
                : typeof children === "function"
                ? __DEV__
                  ? evalChildrenDev(children, props, this.props.path)
                  : children(props)
                : null}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
```

* Switch

```js
class Switch extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          invariant(context, "You should not use <Switch> outside a <Router>");

          const location = this.props.location || context.location;

          let element, match;

          // We use React.Children.forEach instead of React.Children.toArray().find()
          // here because toArray adds keys to all child elements and we do not want
          // to trigger an unmount/remount for two <Route>s that render the same
          // component at different URLs.
          React.Children.forEach(this.props.children, child => {
            // 只会渲染当前路由命中的子节点
            if (match == null && React.isValidElement(child)) {
              element = child;

              const path = child.props.path || child.props.from;

              match = path
                ? matchPath(location.pathname, { ...child.props, path })
                : context.match;
            }
          });

          return match
            ? React.cloneElement(element, { location, computedMatch: match })
            : null;
        }}
      </RouterContext.Consumer>
    );
  }
}
```

## useEffect和componentDidMount有什么差异

1. 参考链接

    [React 灵魂 23 问，你能答对几个？](https://mp.weixin.qq.com/s/uMZMcoN5Kxkp_DUHcF-_9g)

2. 详解

    useEffect 会捕获 props 和 state。所以即便在回调函数里，你拿到的还是初始的 props 和 state。如果想得到“最新”的值，可以使用 ref。