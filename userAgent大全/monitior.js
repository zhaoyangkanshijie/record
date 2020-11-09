let monitorInfo = {
    eventType: '',
    happenTime: -1,
    target: null,
    content: null
}

let startTime = new Date().getTime();
let stayTime = 0;
let stayInPage = true;

let browserMonitor = () => {
    clickEvent();
    copyEvent();
    unloadEvent();
    hashchangeEvent();
    popstateEvent();
}

let clickEvent = () => {
    window.addEventListener("click",function(event){
        let info = JSON.parse(JSON.stringify(monitorInfo));
        info.eventType = event.type;
        info.happenTime = event.timeStamp;
        info.target = event.target.nodeName;
        info.content = event.target.textContent.slice(100);
        console.log(info);
    });
}

let copyEvent = () => {
    window.addEventListener("copy",function(event){
        let info = JSON.parse(JSON.stringify(monitorInfo));
        info.eventType = event.type;
        info.happenTime = event.timeStamp;
        info.target = event.target.nodeName;
        info.content = window.getSelection().toString();
        console.log(info);
    });
}

let unloadEvent = () => {
    window.addEventListener('unload', () => {
        // var client = new XMLHttpRequest();
        // client.open('POST', '/log', false);// 第三个参数表示同步发送
        // client.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        // client.send(data);
        navigator.sendBeacon('/log', {
            url: document.URL,
            stayTime: stayTime + (new Date().getTime() - startTime)
        });
    }, false);
}

let hashchangeEvent = () => {
    window.addEventListener("hashchange",function(event){
        console.log("hashchange");
        navigator.sendBeacon('/log', {
            url: document.URL,
            stayTime: stayTime + (new Date().getTime() - startTime)
        });
        let startTime = new Date().getTime();
        let stayTime = 0;
        let stayInPage = true;
    });
}

let popstateEvent = () => {
    window.addEventListener("popstate",function(event){
        console.log("popstate");
        navigator.sendBeacon('/log', {
            url: document.URL,
            stayTime: stayTime + (new Date().getTime() - startTime)
        });
        let startTime = new Date().getTime();
        let stayTime = 0;
        let stayInPage = true;
    });
}

let visibilitychangeEvent = () => {
    document.addEventListener('visibilitychange', function() {
        if(stayInPage){
            stayTime += new Date().getTime() - startTime;
            stayInPage = !stayInPage;
        }
        else{
            startTime = new Date().getTime();
            stayInPage = !stayInPage;
        }
    })
}

browserMonitor();