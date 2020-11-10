class browserMonitor{
    constructor(){
        this.startTime = new Date().getTime();
        this.stayTime = 0;
        this.stayInPage = true;
        this.clickEvent();
        this.copyEvent();
        this.unloadEvent();
        this.hashchangeEvent();
        this.popstateEvent();
        this.elementErrorEvent();
        this.windowErrorEvent();
        this.promiseErrorEvent();
    }
    clickEvent(){
        document.addEventListener("click",(event)=>{
            console.log(event,event.target)
            navigator.sendBeacon('/monitor/event', JSON.stringify({
                url: document.URL,
                eventType: event.type,
                happenTime: event.timeStamp,
                target: event.target.nodeName,
                content: event.target.innerHTML.slice(0,100).trim()
            }));
        },false);
    }
    copyEvent(){
        document.addEventListener("copy",(event)=>{
            navigator.sendBeacon('/monitor/event', JSON.stringify({
                url: document.URL,
                eventType: event.type,
                happenTime: event.timeStamp,
                target: event.target.nodeName,
                content: window.getSelection().toString()
            }));
        },false);
    }
    unloadEvent(){
        window.addEventListener('unload', () => {
            // var client = new XMLHttpRequest();
            // client.open('POST', '/log', false);// 第三个参数表示同步发送
            // client.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
            // client.send(data);
            navigator.sendBeacon('/monitor/leave', JSON.stringify({
                url: document.URL,
                stayTime: this.stayTime + (new Date().getTime() - this.startTime)
            }));
        }, false);
    }
    hashchangeEvent(){
        window.addEventListener("hashchange",(event)=>{
            console.log("hashchange");
            navigator.sendBeacon('/monitor', JSON.stringify({
                url: document.URL,
                stayTime: this.stayTime + (new Date().getTime() - this.startTime)
            }));
            this.startTime = new Date().getTime();
            this.stayTime = 0;
            this.stayInPage = true;
        });
    }
    popstateEvent(){
        window.addEventListener("popstate",(event)=>{
            console.log("popstate");
            navigator.sendBeacon('/monitor', JSON.stringify({
                url: document.URL,
                stayTime: this.stayTime + (new Date().getTime() - this.startTime)
            }));
            this.startTime = new Date().getTime();
            this.stayTime = 0;
            this.stayInPage = true;
        });
    }
    visibilitychangeEvent(){
        document.addEventListener('visibilitychange', (e)=>{
            console.log(e)
            if(this.stayInPage){
                this.stayTime += new Date().getTime() - this.startTime;
                this.stayInPage = !this.stayInPage;
            }
            else{
                this.startTime = new Date().getTime();
                this.stayInPage = !this.stayInPage;
            }
        })
    }
    elementErrorEvent(){
        document.addEventListener('error', (e) => {
            const target = e.target
            if (target != window) {
                navigator.sendBeacon('/monitor/error', JSON.stringify({
                    url: document.URL,
                    type: target.localName,
                    row: -1,
                    col: -1,
                    source: target.src || target.href,
                    msg: (target.src || target.href) + ' is load error',
                    time: new Date().getTime()
                }));
            }
        }, true)
    }
    windowErrorEvent(){
        window.onerror = (msg, url, row, col, error)=>{
            navigator.sendBeacon('/monitor/error', JSON.stringify({
                url: document.URL,
                type: 'javascript',
                row: row,
                col: col,
                source: url,
                msg: error && error.stack? error.stack : msg,
                time: new Date().getTime()
            }));
        }
    }
    promiseErrorEvent(){
        document.addEventListener('unhandledrejection', (e) => {
            navigator.sendBeacon('/monitor/error', JSON.stringify({
                url: document.URL,
                type: 'promise',
                row: -1,
                col: -1,
                source: '',
                msg: (e.reason && e.reason.msg) || e.reason || '',
                time: new Date().getTime()
            }));
        })
    }
}
new browserMonitor();