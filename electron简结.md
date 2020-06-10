# electron简结

- [主进程和渲染进程](#主进程和渲染进程)
- [渲染进程调用nodejs](#渲染进程调用nodejs)
- [主进程和渲染进程通信](#主进程和渲染进程通信)
- [渲染进程之间通信](#渲染进程之间通信)
- [项目打包](#项目打包)
- [设置窗口默认最大化和全屏](#设置窗口默认最大化和全屏)
- [自定义菜单栏](#自定义菜单栏)
- [获取操作系统mac地址](#获取操作系统mac地址)
- [窗体样式](#窗体样式)
- [remote](#remote)
- [对话框](#对话框)
- [系统功能](#系统功能)
- [程序保护](#程序保护)
- [最小化到托盘](#最小化到托盘)

---

## 主进程和渲染进程

1. 参考链接

    [想要试试Electron ，不如看看这篇爬坑总结](https://juejin.im/post/5ede23c6e51d45783f11023d)

2. 详解

    * 主进程

        * 运行package.json中的main脚本的进程是主进程。
        * 一个electron应用有且只有一个主进程。
        * 主进程可以进行GUI相关的原生API操作。

    * 渲染进程

        * Electron 使用了 Chromium 来展示 web 页面，所以 Chromium 的多进程架构也被使用到。
        * 每个web页面运行在它自己的渲染进程中。
        * 使用BrowserWindow类开启一个渲染进程并将这个实例运行在该进程中，当一个BrowserWindow实例被销毁后，相应的渲染进程也会被终止。
        * 渲染进程中不能调用原生资源，但是渲染进程中同样包含Node.js环境，所以可以引入Node.js模块，在Node.js支持下，可以在页面中和操作系统进行一些底层交互。

## 渲染进程调用nodejs

1. 参考链接

    [想要试试Electron ，不如看看这篇爬坑总结](https://juejin.im/post/5ede23c6e51d45783f11023d)

2. 详解

    主进程（main.js）：设置后可使用module和require全局变量
    ```js
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,  //设置为true就可以在这个渲染进程中调用Node.js
        }
    })
    ```

## 主进程和渲染进程通信

1. 参考链接

    [想要试试Electron ，不如看看这篇爬坑总结](https://juejin.im/post/5ede23c6e51d45783f11023d)

2. 详解

    主进程和渲染进程之间可以通过ipcRenderer 和 ipcMain模块通信。

    * 主进程主动向渲染进程发送消息

        主进程（main.js）
        ```js
        //主进程向渲染进程发送消息，'did-finish-load':当导航完成时发出事件，onload 事件也完成
        win.webContents.on('did-finish-load', () => {
            win.webContents.send('msg', '消息来自主进程')
        })
        ```

        渲染进程(index.html)
        ```html
        <script>
            const {ipcRenderer} = require('electron')
            ipcRenderer.on('msg', (event, message) => {
                console.log(message) // 消息来自主进程
            })
        </script>
        ```

    * 渲染进程主动向主进程发送消息

        渲染进程(index.html)
        ```js
        const {ipcRenderer} = require('electron')
        ipcRenderer.send('indexMsg','消息来自渲染进程')
        ```
        
        复制代码主进程（main.js）
        ```js
        const {ipcMain} = require('electron')
        ipcMain.on('indexMsg',(event,msg) => {
            console.log(msg) //消息来自渲染进程
        })
        ```

## 渲染进程之间通信

1. 参考链接

    [想要试试Electron ，不如看看这篇爬坑总结](https://juejin.im/post/5ede23c6e51d45783f11023d)

2. 详解

    * 全局共享属性

        ```js
        //主进程
        global.sharedObject = {
        user: ''
        }

        //渲染进程一
        const {remote} = require('electron')
        remote.getGlobal('sharedObject').user = 'xmanlin'

        //渲染进程二
        const {remote} = require('electron')
        console.log(remote.getGlobal('sharedObject').user) //xmanlin
        ```

    * ipcRenderer.sendTo()

        ```js
        ipcRenderer.sendTo(webContentsId, channel, [, arg1][, arg2][, ...])
        ipcRenderer.sendTo(windowId, 'ping', 'someThing')
        //webContentsId : Number
        //channel : String
        //...args : any[]
        ```

        主进程（main.js）
        ```js
        //创建一个新的渲染进程
        let win2 =  new BrowserWindow({
            width: 800,
            height: 600,
        })

        //为渲染进程设置唯一id
        win2.id = 2
        ```

        页面1
        ```html
        <script>
            const {ipcRenderer} = require('electron')
            //向id为2的渲染进程发送消息
            ipcRenderer.sendTo(2,'msg1','来自渲染进程1的消息')
        </script>
        ```

        页面2
        ```html
        <script>
            const {ipcRenderer} = require('electron')
            ipcRenderer.on('msg1', (event, message) => {
                console.log(message) // 来自渲染进程1的消息
            })
        </script>
        ```

    * 主进程做消息中转站

        ```js
        //主进程
        ipcMain.on('msg1', (event, message) => {
            yourWindow.webContents.send('msg2', message);
        }

        //渲染进程1
        ipcRenderer.send('msg1', '来自渲染进程1的消息')

        //渲染进程2
        ipcRenderer.on('msg2', (event, message) => {
            console.log(message)  //来自渲染进程1的消息
        })
        ```

## 项目打包

1. 参考链接

    [想要试试Electron ，不如看看这篇爬坑总结](https://juejin.im/post/5ede23c6e51d45783f11023d)

2. 详解

    electron-builder可以打包为exe可执行文件，还可以打包为可安装程序

    npm install electron-builder --save-dev

    package.json 的build命令："build": "node .electron-vue/build.js && electron-builder"

    可以指定参数
    ```txt
    --mac, -m, -o, --macos   macOS打包
    --linux, -l              Linux打包
    --win, -w, --windows     Windows打包
    --mwl                    同时为macOS，Windows和Linux打包
    --x64                    x64 (64位安装包)
    --ia32                   ia32(32位安装包) 
    ```

    注意：项目路径需要全英文才能打包

## 设置窗口默认最大化和全屏

1. 参考链接

    [想要试试Electron ，不如看看这篇爬坑总结](https://juejin.im/post/5ede23c6e51d45783f11023d)

2. 详解

    * 默认最大化

        ```js
        //主进程（main.js）
        let win = new BrowserWindow({show: false})
        win.maximize()
        win.show()
        ```

    * 默认全屏

        ```js
        //主进程（main.js）
        let win = new BrowserWindow({fullscreen: true})
        ```

## 自定义菜单栏

1. 参考链接

    [想要试试Electron ，不如看看这篇爬坑总结](https://juejin.im/post/5ede23c6e51d45783f11023d)

    [使用 Electron 自定义菜单](https://segmentfault.com/a/1190000008473121)

    [用JS开发跨平台桌面应用，从原理到实践](https://juejin.im/post/5cfd2ec7e51d45554877a59f#heading-12)

2. 详解

    使用 Menu 和 MenuItem 模块可以自定义应用程序菜单. 如果没有设置任何菜单, Electron 将默认生成一个最小的菜单

    MenuItem的几个重要参数：

    * label：菜单显示的文字
    * click：点击菜单后的事件处理函数
    * role：系统预定义的菜单，例如copy(复制)、paste(粘贴)、minimize(最小化)...
    * enabled：指示是否启用该项目，此属性可以动态更改
    * submenu：子菜单，也是一个MenuItem的数组

    主进程
    ```js
    const electron = require('electron')
    const BrowserWindow = electron.BrowserWindow
    const Menu = electron.Menu
    const app = electron.app

    let template = [{
    label: '编辑',
    submenu: [{
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
    }, {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
    }, {
        type: 'separator'
    }, {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
    }, {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
    }, {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
    }, {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
    }]
    }, {
    label: '查看',
    submenu: [{
        label: '重载',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
        if (focusedWindow) {
            // 重载之后, 刷新并关闭所有的次要窗体
            if (focusedWindow.id === 1) {
            BrowserWindow.getAllWindows().forEach(function (win) {
                if (win.id > 1) {
                win.close()
                }
            })
            }
            focusedWindow.reload()
        }
        }
    }, {
        label: '切换全屏',
        accelerator: (function () {
        if (process.platform === 'darwin') {
            return 'Ctrl+Command+F'
        } else {
            return 'F11'
        }
        })(),
        click: function (item, focusedWindow) {
        if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        }
        }
    }, {
        label: '切换开发者工具',
        accelerator: (function () {
        if (process.platform === 'darwin') {
            return 'Alt+Command+I'
        } else {
            return 'Ctrl+Shift+I'
        }
        })(),
        click: function (item, focusedWindow) {
        if (focusedWindow) {
            focusedWindow.toggleDevTools()
        }
        }
    }, {
        type: 'separator'
    }, {
        label: '应用程序菜单演示',
        click: function (item, focusedWindow) {
        if (focusedWindow) {
            const options = {
            type: 'info',
            title: '应用程序菜单演示',
            buttons: ['好的'],
            message: '此演示用于 "菜单" 部分, 展示如何在应用程序菜单中创建可点击的菜单项.'
            }
            electron.dialog.showMessageBox(focusedWindow, options, function () {})
        }
        }
    }]
    }, {
    label: '窗口',
    role: 'window',
    submenu: [{
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
    }, {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
    }, {
        type: 'separator'
    }, {
        label: '重新打开窗口',
        accelerator: 'CmdOrCtrl+Shift+T',
        enabled: false,
        key: 'reopenMenuItem',
        click: function () {
        app.emit('activate')
        }
    }]
    }, {
    label: '帮助',
    role: 'help',
    submenu: [{
        label: '学习更多',
        click: function () {
        electron.shell.openExternal('http://electron.atom.io')
        }
    }]
    }]

    function addUpdateMenuItems (items, position) {
    if (process.mas) return

    const version = electron.app.getVersion()
    let updateItems = [{
        label: `Version ${version}`,
        enabled: false
    }, {
        label: '正在检查更新',
        enabled: false,
        key: 'checkingForUpdate'
    }, {
        label: '检查更新',
        visible: false,
        key: 'checkForUpdate',
        click: function () {
        require('electron').autoUpdater.checkForUpdates()
        }
    }, {
        label: '重启并安装更新',
        enabled: true,
        visible: false,
        key: 'restartToUpdate',
        click: function () {
        require('electron').autoUpdater.quitAndInstall()
        }
    }]

    items.splice.apply(items, [position, 0].concat(updateItems))
    }

    function findReopenMenuItem () {
    const menu = Menu.getApplicationMenu()
    if (!menu) return

    let reopenMenuItem
    menu.items.forEach(function (item) {
        if (item.submenu) {
        item.submenu.items.forEach(function (item) {
            if (item.key === 'reopenMenuItem') {
            reopenMenuItem = item
            }
        })
        }
    })
    return reopenMenuItem
    }

    if (process.platform === 'darwin') {
    const name = electron.app.getName()
    template.unshift({
        label: name,
        submenu: [{
        label: `关于 ${name}`,
        role: 'about'
        }, {
        type: 'separator'
        }, {
        label: '服务',
        role: 'services',
        submenu: []
        }, {
        type: 'separator'
        }, {
        label: `隐藏 ${name}`,
        accelerator: 'Command+H',
        role: 'hide'
        }, {
        label: '隐藏其它',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
        }, {
        label: '显示全部',
        role: 'unhide'
        }, {
        type: 'separator'
        }, {
        label: '退出',
        accelerator: 'Command+Q',
        click: function () {
            app.quit()
        }
        }]
    })

    // 窗口菜单.
    template[3].submenu.push({
        type: 'separator'
    }, {
        label: '前置所有',
        role: 'front'
    })

    addUpdateMenuItems(template[0].submenu, 1)
    }

    if (process.platform === 'win32') {
        const helpMenu = template[template.length - 1].submenu
        addUpdateMenuItems(helpMenu, 0)
    }

    //生命周期
    app.on('ready', function () {
        const menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
    })

    app.on('browser-window-created', function () {
        let reopenMenuItem = findReopenMenuItem()
        if (reopenMenuItem) reopenMenuItem.enabled = false
    })

    app.on('window-all-closed', function () {
        let reopenMenuItem = findReopenMenuItem()
        if (reopenMenuItem) reopenMenuItem.enabled = true
    })
    ```

    可以使用 Menu 和 MenuItem 模块创建上下文或右键单击菜单

    主进程
    ```js
    const electron = require('electron')
    const BrowserWindow = electron.BrowserWindow
    const Menu = electron.Menu
    const MenuItem = electron.MenuItem
    const ipc = electron.ipcMain
    const app = electron.app

    const menu = new Menu()
    menu.append(new MenuItem({ label: 'Hello' }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }))

    app.on('browser-window-created', function (event, win) {
        win.webContents.on('context-menu', function (e, params) {
            menu.popup(win, params.x, params.y)
        })
    })

    ipc.on('show-context-menu', function (event) {
        const win = BrowserWindow.fromWebContents(event.sender)
        menu.popup(win)
    })
    ```

    渲染器进程
    ```js
    const ipc = require('electron').ipcRenderer

    // 告诉主进程在单击示例按钮时显示菜单
    const contextMenuBtn = document.getElementById('context-menu')
    contextMenuBtn.addEventListener('click', function () {
        ipc.send('show-context-menu')
    })
    ```

    指定一个accelerator属性来指定操作的快捷键
    ```js
    {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
    }
    ```

    globalShortcut来注册全局快捷键
    ```js
    globalShortcut.register('CommandOrControl+N', () => {
        dialog.showMessageBox({
            type: 'info',
            message: '嘿!',
            detail: '你触发了手动注册的快捷键.',
        })
    })
    ```

## 获取操作系统mac地址

1. 参考链接

    [想要试试Electron ，不如看看这篇爬坑总结](https://juejin.im/post/5ede23c6e51d45783f11023d)

2. 详解

    ```js
    var os=require("os");
    //获取mac地址
    var mac = ''
    var networkInterfaces=os.networkInterfaces();
    for(var i in networkInterfaces){
        for(var j in networkInterfaces[i]){
            if(networkInterfaces[i][j]["family"]==="IPv4" && networkInterfaces[i][j]["mac"]!=="00:00:00:00:00:00" && networkInterfaces[i][j]["address"]!=="127.0.0.1"){
                mac = networkInterfaces[i][j]["mac"]
            }
        }
    }
    ```

## 窗体样式

1. 参考链接

    [用JS开发跨平台桌面应用，从原理到实践](https://juejin.im/post/5cfd2ec7e51d45554877a59f#heading-12)

2. 详解

    主进程模块BrowserWindow用于创建和控制浏览器窗口

    ```js
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        // ...
    });
    mainWindow.loadURL('http://www.conardli.top/');
    ```

    无框窗口

    ```js
    new BrowserWindow({
        width: 200,
        height: 200,
        titleBarStyle: 'hidden',
        frame: false
    });
    ```

    窗口拖拽

    ```css
    .header {
        -webkit-user-select: none;
        -webkit-app-region: drag;
    }
    ```
    在可拖拽区域内部设置 -webkit-app-region: no-drag则可以指定特定不可拖拽区域。

    透明窗口

    ```js
    new BrowserWindow({
        transparent: true,
        frame: false
    });
    ```

## remote

1. 参考链接

    [用JS开发跨平台桌面应用，从原理到实践](https://juejin.im/post/5cfd2ec7e51d45554877a59f#heading-12)

2. 详解

    remote 模块为渲染进程（web页面）和主进程通信（IPC）提供了一种简单方法。可以调用 main 进程对象的方法, 而不必显式发送进程间消息。

    ```js
    import { remote } from 'electron';
    remote.dialog.showErrorBox('主进程才有的dialog模块', '我是使用remote调用的')
    ```

    在调用远程对象的方法、函数或者通过远程构造函数创建一个新的对象，实际上都是在发送一个同步的进程间消息。

    在渲染进程中创建的 dialog 对象其实并不在我们的渲染进程中，它只是让主进程创建了一个 dialog 对象，并返回了这个相对应的远程对象给了渲染进程。

## 对话框

1. 参考链接

    [用JS开发跨平台桌面应用，从原理到实践](https://juejin.im/post/5cfd2ec7e51d45554877a59f#heading-12)

2. 详解

    1. 错误提示
    
        ```js
        remote.dialog.showErrorBox('错误', '这是一个错误弹框！')
        ```

    2. 对话框

        可以为指定几种不同的类型： "none", "info", "error", "question" 或者 "warning"
        ```js
        remote.dialog.showMessageBox({
            type: 'info',
            title: '提示信息',
            message: '这是一个对话弹框！',
            buttons: ['确定', '取消']
        }, (index) => {
            this.setState({ dialogMessage: `【你点击了${index ? '取消' : '确定'}！！】` })
        })
        ```

    3. 文件框

        用于打开或选择系统目录
        ```js
        remote.dialog.showOpenDialog({
            properties: ['openDirectory', 'openFile']
        }, (data) => {
            this.setState({ filePath: `【选择路径：${data[0]}】 ` })
        })
        ```

    4. 信息框

        ```js
        let options = {
            title: '信息框标题',
            body: '我是一条信息～～～',
        }
        let myNotification = new window.Notification(options.title, options)
            myNotification.onclick = () => {
            this.setState({ message: '【你点击了信息框！！】' })
        }
        ```

## 系统功能

1. 参考链接

    [用JS开发跨平台桌面应用，从原理到实践](https://juejin.im/post/5cfd2ec7e51d45554877a59f#heading-12)

2. 详解

    1. 版本信息

        主进程的process
        ```js
        process.versions.electron：electron版本信息
        process.versions.chrome：chrome版本信息
        process.versions.node：node版本信息
        process.versions.v8：v8版本信息
        ```

    2. 当前应用根目录

        ```js
        remote.app.getAppPath()
        ```

    3. 获取当前系统根目录

        nodejs
        ```js
        os.homedir();
        ```

    4. 复制粘贴

        clipboard在渲染进程和主进程都可使用，用于在系统剪贴板上执行复制和粘贴操作。
        ```js
        //以纯文本的形式写入剪贴板
        clipboard.writeText(text[, type])
        //以纯文本的形式获取剪贴板的内容
        clipboard.readText([type])
        ```

    5. 截图

        desktopCapturer用于从桌面捕获音频和视频的媒体源的信息。它只能在渲染进程中被调用。
        ```js
        getImg = () => {
            this.setState({ imgMsg: '正在截取屏幕...' })
            const thumbSize = this.determineScreenShotSize()
            let options = { types: ['screen'], thumbnailSize: thumbSize }
            desktopCapturer.getSources(options, (error, sources) => {
                if (error) return console.log(error)
                sources.forEach((source) => {
                    if (source.name === 'Entire screen' || source.name === 'Screen 1') {
                        const screenshotPath = path.join(os.tmpdir(), 'screenshot.png')
                        fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
                            if (error) return console.log(error)
                            shell.openExternal(`file://${screenshotPath}`)
                            this.setState({ imgMsg: `截图保存到: ${screenshotPath}` })
                        })
                    }
                })
            })
        }

        determineScreenShotSize = () => {
            const screenSize = screen.getPrimaryDisplay().workAreaSize
            const maxDimension = Math.max(screenSize.width, screenSize.height)
            return {
                width: maxDimension * window.devicePixelRatio,
                height: maxDimension * window.devicePixelRatio
            }
        }
        ```

## 程序保护

1. 参考链接

    [用JS开发跨平台桌面应用，从原理到实践](https://juejin.im/post/5cfd2ec7e51d45554877a59f#heading-12)

2. 详解

    electron提供了crashReporter来记录崩溃日志，可以通过crashReporter.start创建一个崩溃报告器
    ```js
    import { BrowserWindow, crashReporter, dialog } from 'electron';
    // 开启进程崩溃记录
    crashReporter.start({
    productName: 'electron-react',
    companyName: 'ConardLi',
    submitURL: 'http://xxx.com',  // 上传崩溃日志的接口
    uploadToServer: false
    });
    function reloadWindow(mainWin) {
    if (mainWin.isDestroyed()) {
        app.relaunch();
        app.exit(0);
    } else {
        // 销毁其他窗口
        BrowserWindow.getAllWindows().forEach((w) => {
        if (w.id !== mainWin.id) w.destroy();
        });
        const options = {
        type: 'info',
        title: '渲染器进程崩溃',
        message: '这个进程已经崩溃.',
        buttons: ['重载', '关闭']
        }
        dialog.showMessageBox(options, (index) => {
        if (index === 0) mainWin.reload();
        else mainWin.close();
        })
    }
    }
    export default function () {
    const mainWindow = BrowserWindow.fromId(global.mainId);
    mainWindow.webContents.on('crashed', () => {
        const errorMessage = crashReporter.getLastCrashReport();
        console.error('程序崩溃了！', errorMessage); // 可单独上传日志
        reloadWindow(mainWindow);
    });
    }
    ```

    当程序发生崩溃时，崩溃报日志将被储存在临时文件夹中名为YourName Crashes的文件文件夹中。submitURL用于指定崩溃日志上传服务器。 在启动崩溃报告器之前，可以通过调用app.setPath('temp', 'my/custom/temp')API来自定义这些临时文件的保存路径。还可以通过crashReporter.getLastCrashReport()来获取上次崩溃报告的日期和ID。

## 最小化到托盘

1. 参考链接

    [用JS开发跨平台桌面应用，从原理到实践](https://juejin.im/post/5cfd2ec7e51d45554877a59f#heading-12)

2. 详解

    监听窗口的关闭事件，阻止用户关闭操作的默认行为，将窗口隐藏
    ```js
    function checkQuit(mainWindow, event) {
        const options = {
            type: 'info',
            title: '关闭确认',
            message: '确认要最小化程序到托盘吗？',
            buttons: ['确认', '关闭程序']
        };
        dialog.showMessageBox(options, index => {
            if (index === 0) {
                event.preventDefault();
                mainWindow.hide();
            } else {
                mainWindow = null;
                app.exit(0);
            }
        });
    }
    function handleQuit() {
        const mainWindow = BrowserWindow.fromId(global.mainId);
        mainWindow.on('close', event => {
            event.preventDefault();
            checkQuit(mainWindow, event);
        });
    }
    ```

    创建任务托盘
    ```js
    export default function createTray() {
        const mainWindow = BrowserWindow.fromId(global.mainId);
        const iconName = process.platform === 'win32' ? 'icon.ico' : 'icon.png'
        tray = new Tray(path.join(global.__dirname, iconName));
        const contextMenu = Menu.buildFromTemplate([
            {
            label: '显示主界面', click: () => {
                mainWindow.show();
                mainWindow.setSkipTaskbar(false);
            }
            },
            {
            label: '退出', click: () => {
                mainWindow.destroy();
                app.quit();
            }
            },
        ])
        tray.setToolTip('electron-react');
        tray.setContextMenu(contextMenu);
    }
    ```