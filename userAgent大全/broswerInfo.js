let getBrowserInfo = (ua) => {
    // If an UA is not provided, default to the current browser UA.
    if (ua === undefined) {
        ua = window.navigator.userAgent;
    }
    ua = ua.toLowerCase();

    let browser_match = /(edge)[\/]([\w.]+)/.exec(ua) ||
        /(opr)[\/]([\w.]+)/.exec(ua) ||
        /(qqbrowser)[\/]([\w.]+)/.exec(ua) ||
        /(lbbrowser)[\/]([\w.]+)/.exec(ua) ||
        /(metasr)[ ]([\w.]+)/.exec(ua) ||
        /(2345explorer)[\/]([\w.]+)/.exec(ua) ||
        /(theworld)[ ]([\w.]+)/.exec(ua) ||
        /(maxthon)[\/]([\w.]+)/.exec(ua) ||
        /(bidubrowser)[\/]([\w.]+)/.exec(ua) ||
        /(ubrowser)[\/]([\w.]+)/.exec(ua) ||
        /(ucbrowser)[\/]([\w.]+)/.exec(ua) ||
        /(micromessenger)[\/]([\w.]+)/.exec(ua) ||
        /(firefox)[\/]([\w.]+)/.exec(ua) ||
        /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(iemobile)[\/]([\w.]+)/.exec(ua) ||
        /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
        [];

    let platform_match = /(ipad)/.exec(ua) ||
        /(ipod)/.exec(ua) ||
        /(windows phone)/.exec(ua) ||
        /(iphone)/.exec(ua) ||
        /(kindle)/.exec(ua) ||
        /(silk)/.exec(ua) ||
        /(android)/.exec(ua) ||
        /(win)/.exec(ua) ||
        /(mac)/.exec(ua) ||
        /(linux)/.exec(ua) ||
        /(cros)/.exec(ua) ||
        /(playbook)/.exec(ua) ||
        /(bb)/.exec(ua) ||
        /(blackberry)/.exec(ua) ||
        [];

    let os_match = /(windows nt)[ ]([\w.]+)/.exec(ua) ||
        /(windows me)/.exec(ua) ||
        /(windows 98)/.exec(ua) ||
        /(android )([\w.]+)/.exec(ua) ||
        /(linux ppc64)/.exec(ua) ||
        /(linux ppc)/.exec(ua) ||
        /(linux i686)/.exec(ua) ||
        /(linux x86_64)/.exec(ua) ||
        /(ipad).*os ([\w.]+ )/.exec(ua) ||
        /(ipod).*os ([\w.]+ )/.exec(ua) ||
        /(iphone).*os ([\w.]+ )/.exec(ua) ||
        /(ppc mac os x )([\w.]+)/.exec(ua) ||
        /(intel mac os x )([\w.]+)/.exec(ua) ||
        /(freebsd)/.exec(ua) ||
        /(sunos i86pc)/.exec(ua) ||
        /(sunos sun4u)/.exec(ua) ||
        /(windows phone)(\sos)?([\s\w.]+)/.exec(ua) ||
        /(kindle)/.exec(ua) ||
        /(silk)/.exec(ua) ||
        /(cros)/.exec(ua) ||
        /(playbook)/.exec(ua) ||
        /(bb)/.exec(ua) ||
        /(blackberry)/.exec(ua) ||
        [];

    let net_match = /(nettype)[\/]([\w.]+)/.exec(ua) || [];

    let language_match = /(language)[\/]([\w.]+)/.exec(ua) ||
        /(zh-cn)/.exec(ua) ||
        /(zh-tw)/.exec(ua) ||
        /(zh-hk)/.exec(ua) ||
        /(en-us)/.exec(ua) ||
        /(\w\w-\w\w)/.exec(ua) ||
        [];

    let model_match = /(build)[\/]([\w.]+)/.exec(ua) ||
        /(ipad)/.exec(ua) ||
        /(ipod)/.exec(ua) ||
        /(iphone)/.exec(ua) ||
        /(huawei)/.exec(ua) ||
        /(vivo)/.exec(ua) ||
        /(oppo)/.exec(ua) ||
        /(samsung)/.exec(ua) ||
        /(sony)/.exec(ua) ||
        /(nokia)/.exec(ua) ||
        /(htc)/.exec(ua) ||
        /(zte)/.exec(ua) ||
        /(lenovo)/.exec(ua) ||
        [];

    let matched = {
        browser: browser_match[5] || browser_match[3] || browser_match[1] || "unknown",
        version: browser_match[2] || browser_match[4] || "0",
        versionNumber: browser_match[4] || browser_match[2] || "0",
        platform: platform_match[0] || "unknown",
        os: os_match[0] || "unknown",
        netType: net_match[0] || window.navigator.connection.effectiveType || "unknown",
        language: language_match[0] || "unknown",
        model: model_match[2] || model_match[0] || "unknown"
    };

    let browser = {};
    browser[matched.browser] = true;
    browser.browserVersion = matched.version;
    browser.browserVersionNumber = matched.versionNumber;
    browser.browserName = matched.browser;
    browser.os = matched.os;
    browser.netType = matched.netType;
    browser.language = matched.language;
    browser.platform = matched.platform;
    browser.model = matched.model;
    browser.domain = document.domain || ''; // 域名
    browser.url = document.URL || ''; // 当前 URL 地址
    browser.title = document.title || ''; // 当前页面标题
    browser.referrer = document.referrer || ''; // 上一个访问页面 URL 地址
    browser.lastModified = document.lastModified || ''; 
    browser.cookie = document.cookie;
    browser.characterSet = document.characterSet;
    browser.screenHeight = window.screen.height || 0; // 屏幕高度
    browser.screenWidth = window.screen.width || 0; // 屏幕宽度
    browser.colorDepth = window.screen.colorDepth || 0; // 屏幕颜色深度
    browser.devicePixelRatio = window.devicePixelRatio; 
    browser.performance = window.performance; // 性能表现
    browser.dnsTime = window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart;
    browser.tcpTime = window.performance.timing.connectEnd - window.performance.timing.connectStart;
    browser.firstPaintTime = window.performance.getEntriesByType('paint').length > 0 ? (window.performance.getEntriesByType('paint')[0].startTime || window.performance.timing.responseStart - window.performance.timing.navigationStart) : window.performance.timing.responseStart - window.performance.timing.navigationStart;
    browser.FirstContentfulPaintTime = window.performance.getEntriesByType('paint').length > 1 ? (window.performance.getEntriesByType('paint')[1].startTime || '') : '';
    browser.domRenderTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    browser.loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    browser.resourceInfo = window.performance.getEntriesByType('resource');

    if (matched.platform) {
        browser[matched.platform] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile browser
    if (browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
        browser.ipod || browser.kindle || browser.playbook || browser.silk || browser["windows phone"]) {
        browser.type = "mobile";
    }

    // These are all considered desktop platforms, meaning they run a desktop browser
    if (browser.cros || browser.mac || browser.linux || browser.win) {
        browser.type = "pc";
        browser.model = matched.browser;
    }

    // Chrome, Opera 15+ and Safari are webkit based browsers
    if (browser.chrome || browser.opr || browser.safari) {
        browser.webkit = true;
        let desc = navigator.mimeTypes['application/x-shockwave-flash'];
        if (desc) {
            browser.browserName = "360";
        }
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if (browser.rv || browser.iemobile) {
        let ie = "msie";

        matched.browser = ie;
        browser[ie] = true;
    }

    // Edge is officially known as Microsoft Edge, so rewrite the key to match
    if (browser.edge) {
        delete browser.edge;
        let msedge = "msedge";

        matched.browser = msedge;
        browser[msedge] = true;
    }

    // Blackberry browsers are marked as Safari on BlackBerry
    if (browser.safari && browser.blackberry) {
        let blackberry = "blackberry";

        matched.browser = blackberry;
        browser[blackberry] = true;
    }

    // Playbook browsers are marked as Safari on Playbook
    if (browser.safari && browser.playbook) {
        let playbook = "playbook";

        matched.browser = playbook;
        browser[playbook] = true;
    }

    // BB10 is a newer OS version of BlackBerry
    if (browser.bb) {
        let bb = "blackberry";

        matched.browser = bb;
        browser[bb] = true;
    }

    // Opera 15+ are identified as opr
    if (browser.opr) {
        let opera = "opera";

        matched.browser = opera;
        browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if (browser.safari && browser.android) {
        let android = "android";

        matched.browser = android;
        browser[android] = true;
    }

    // Kindle browsers are marked as Safari on Kindle
    if (browser.safari && browser.kindle) {
        let kindle = "kindle";

        matched.browser = kindle;
        browser[kindle] = true;
    }

    // Kindle Silk browsers are marked as Safari on Kindle
    if (browser.safari && browser.silk) {
        let silk = "silk";

        matched.browser = silk;
        browser[silk] = true;
    }

    return new Promise((resolve,reject)=>{
        let tryTimes = 0;
        let timer = setInterval(()=> {
            if(window.performance.getEntriesByType('paint').length == 0 && tryTimes < 10){
                tryTimes++;
            }
            else{
                browser.dnsTime = window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart;
                browser.tcpTime = window.performance.timing.connectEnd - window.performance.timing.connectStart;
                browser.firstPaintTime = window.performance.getEntriesByType('paint').length > 0 ? (window.performance.getEntriesByType('paint')[0].startTime || window.performance.timing.responseStart - window.performance.timing.navigationStart) : window.performance.timing.responseStart - window.performance.timing.navigationStart;
                browser.FirstContentfulPaintTime = window.performance.getEntriesByType('paint').length > 1 ? (window.performance.getEntriesByType('paint')[1].startTime || '') : '';
                browser.domRenderTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
                browser.domAnalysisTime = window.performance.timing.domComplete - window.performance.timing.domInteractive;
                browser.loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
                browser.blankTime = (window.performance.timing.domInteractive || window.performance.timing.domLoading) - window.performance.timing.fetchStart;
                browser.redirectTime = window.performance.timing.redirectEnd - window.performance.timing.redirectStart;
                browser.resourceInfo = window.performance.getEntriesByType('resource');
                clearInterval(timer);
                resolve(browser);
            }
        },1000);
    });
}