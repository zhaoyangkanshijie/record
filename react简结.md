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
* [fiber](#fiber)
* [高阶组件](#高阶组件)
* [hook](#hook)
* [react和vue的区别](#react和vue的区别)
* [Fragments](#Fragments)
* [插槽](#插槽)
* [分析器](#分析器)

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

        执行完后，合成事件的属性会被重置为null。所以异步访问合适事件的属性，是无效的。

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
        2. context 上下文 导出Provider,,和 consumer
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

2. 详解

    * 虚拟dom

        从 render 方法返回的不可变 React 元素树，通常称为虚拟DOM。

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

    * 虚拟DOM树分层比较（tree diff）

        两棵树只会对同一层次的节点进行比较，忽略DOM节点跨层级的移动操作。当发现节点已经不存在，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。跨层级操作则会先销毁再创建。

    * 组件间的比较（component diff）

        如果是同一个类型的组件，则按照原策略进行Virtual DOM比较。有可能经过一轮Virtual DOM比较下来，并没有发生变化。允许用户通过shouldComponentUpdate()来判断该组件是否需要进行diff算法分析。

        如果不是同一类型的组件，则将其判断为dirty component，从而替换整个组价下的所有子节点。

    * 元素间的比较（element diff）

        当节点处于同一层级的时候，react diff 提供了三种节点操作：插入、删除、移动。

        新集合元素与旧集合元素对比，找是否存在相同的key，有相同，则看老游标<新游标，则进行移动，否则不动，key不存在则插入新元素，最后看是否存在新集合中没有但老集合中仍存在的节点，有则删除

    * V16前(同步渲染)
    
        浏览器渲染引擎单线程, 计算DOM树时锁住整个线程, 所有行为同步发生, 有效率问题, 期间react会一直占用浏览器主线程，如果组件层级比较深，相应的堆栈也会很深，长时间占用浏览器主线程, 任何其他的操作（包括用户的点击，鼠标移动等操作）都无法执行。

        传统的diff需要除了树编号比较之外，还需要跨级比较，会两两比较树的节点，有n^2的复杂度。然后需要编辑树，编辑的树可能发生在任何节点，需要对树进行再一次遍历操作，复杂度为n。加起来就是n^3。

    * V16后(异步渲染)
    
        重写底层算法逻辑reconciliation 算法(比较两棵 DOM 树差异、从而判断哪一部分应当被更新), 引入fiber时间片, 异步渲染, react会在渲染一部分树后检查是否有更高优先级的任务需要处理(如用户操作或绘图), 处理完后再继续渲染, 并可以更新优先级, 以此管理渲染任务. 加入fiber的react将组件更新分为两个时期（phase 1 && phase 2），render前的生命周期为phase1，render后的生命周期为phase2, 1可以打断(放弃之前的计算成果), 2不能打断一次性更新. 三个will生命周期可能会重复执行, 尽量避免使用。

        react树对比是按照层级去对比的， 他会给树编号0,1,2,3,4.... 然后相同的编号进行比较。所以复杂度是n，这个好理解。

    * diff vue vs react

        * 相同点:都是同层 differ,复杂度都为 O(n);
        * 不同点:
            1. React 首位是除删除外是固定不动的,然后依次遍历对比;
            2. Vue 的compile 阶段的optimize标记了static 点,可以减少 differ 次数,而且是采用双向遍历方法;

## 高阶组件

1. 参考链接

    [前端面试题全面整理-带解析 涵盖CSS、JS、浏览器、Vue、React、移动web、前端性能、算法、Node](https://mp.weixin.qq.com/s/YrKGMORhB_POmfWZVWRkHg)

2. 详解

    高阶组件就是一个函数，且该函数(wrapper)接受一个组件作为参数，并返回一个新的组件。
    高阶组件并不关心数据使用的方式和原因，而被包裹的组件也不关心数据来自何处.

    react-dnd: 根组件, source, target等
    export default DragSource(type, spec, collect)(MyComponent)

    重构代码库使用HOC提升开发效率

## hook

1. 参考链接

    [Hook 简介](https://react.docschina.org/docs/hooks-intro.html)

    [React Hooks 使用总结](https://juejin.im/post/6850037283535880205)

    [写React Hooks前必读](https://mp.weixin.qq.com/s/bUcsqBYdK0DHhvbJ_yTyqQ)

    [React Hook 的底层实现原理](https://mp.weixin.qq.com/s/a2nfI9fnQEh2gm2kGDRQlg)

2. 详解

    Hook 是 React 16.8 的新增特性。它可以在不编写 class 的情况下使用 state 以及其他的 React 特性。

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


    * 用法

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
            this.props.children,
            domNode
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
