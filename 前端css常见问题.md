# 前端css常见问题

- [已知或者未知宽度的垂直水平居中](#已知或者未知宽度的垂直水平居中)
- [三角形](#三角形)
- [flexible 与高清屏](#flexible与高清屏)
- [css 并列自适应布局](#css并列自适应布局)
- [css 旋转、拖拽、手势移动](#css旋转、拖拽、手势移动)
- [css 伪类和伪元素](#css伪类和伪元素)
- [css 幽灵空白节点](#css幽灵空白节点)
- [flex](#flex)
- [overflow:hidden 清除浮动的原理](#overflow:hidden清除浮动的原理)
- [css样式穿透](#css样式穿透)
- [grid](#grid)
- [css比较函数](#css比较函数)
- [before和after边框效果](#before和after边框效果)
- [sass比css方便的地方](#sass比css方便的地方)
- [禁止选中文本](#禁止选中文本)
- [更改选中文本的背景颜色](#更改选中文本的背景颜色)
- [在不使用br的情况下将文本换行](#在不使用br的情况下将文本换行)
- [设置字与字之间的间距](#设置字与字之间的间距)
- [媒体查询手机屏幕横屏竖屏](#媒体查询手机屏幕横屏竖屏)
- [硬件加速](#硬件加速)
- [position:sticky](#position:sticky)
- [scroll-snap-type滚动轮播](scroll-snap-type滚动轮播)
- [图片相关](#图片相关)

---


### 已知或者未知宽度的垂直水平居中

1. 参考链接：

   [一年半经验，百度，有赞，阿里前端面试总结](https://zhuanlan.zhihu.com/p/83803079)

2. 详解：

   ```scss
   // 1
   .wrapper {
     position: relative;
     .box {
       position: absolute;
       top: 50%;
       left: 50%;
       width: 100px;
       height: 100px;
       margin: -50px 0 0 -50px;
     }
   }

   // 2
   .wrapper {
     position: relative;
     .box {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
     }
   }
   // 3
   .wrapper {
     .box {
       display: flex;
       justify-content: center;
       align-items: center;
       height: 100px;
     }
   }

   // 4
   .wrapper {
     display: table;
     .box {
       display: table-cell;
       vertical-align: middle;
     }
   }
   ```

   - 弹窗窗口不定宽高居中 + 窗口带图标不定宽标题居中

      ```html
      <div class="mask">
          <div class="modal">
            <div class="head-group">
                <div class="head-icon"></div>
                <p class="head-word">提示</p>
            </div>
          </div>
      </div>
      ```
      ```scss
      .mask{
          position: fixed;
          width: 100%;
          height: 100%;
          background-color: rgba($color: #000000, $alpha: 0.2);
          z-index: 999;
          top: 0;
          left: 0;

          .modal{
              background: #FFFFFF;
              box-shadow: 0 2px 10px 0 rgba(0,0,0,0.20);
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%,-50%);
              text-align: center;

              .head-group{
                  height: 24px;
                  display: inline-block;

                  .head-icon{
                      width: 24px;
                      height: 24px;
                      @include bg($imagePath,"warning_24","png");
                      background-size: 100% 100%;
                      background-position: center center;
                      background-repeat: no-repeat;
                      float: left;
                  }

                  .head-word{
                      font-size: 16px;
                      color: #333333;
                      line-height: 24px;
                      float: left;
                      margin-left: 8px;
                  }
              }
          }
      }
      ```


### 三角形

1.  参考链接：

    - [CSS 绘制三角形和箭头](http://www.divcss5.com/rumen/r50847.shtml)
    - [CSS 实现带阴影效果的三角形](https://blog.csdn.net/foreversober/article/details/74361402)
    - [十道大厂面试题(含答案)总结](https://mp.weixin.qq.com/s/o553cr1FHLz40PpxbO8oOw)
    - [CSS八种让人眼前一亮的HOVER效果](https://juejin.im/post/6861501624993447950#heading-4)

2.  详解：

    - 三角形原理

      ```css
      /*<div class="box"></div>*/
      .box {
        width: 0;
        height: 0;
        border-width: 100px;
        border-style: solid;
        border-color: red green blue yellow;
      }
      ```

      1. 可以看到 div 呈现的正方形由 4 个三角形组成，上右下左分别为红绿蓝黄。
      2. border-color 控制上右下左 4 个三角形颜色。
      3. 调节 border-width 可控制三角形斜边长度。
      4. 调节 width 和 height 可使 4 个三角形变为梯形，中间多出宽为 width，高为 height 的正方形。

    - 普通三角形

      border-color 三个方向设置为透明，即可得到一个方向的三角形。

      ```css
      /*<div class="box"></div>*/
      .box {
        width: 0;
        height: 0;
        border-width: 100px;
        border-style: solid;
        border-color: red transparent transparent transparent;
      }
      ```

    - 不同角度的三角形

      ```css
      /*<div class="box"></div>*/
      .box {
        width: 0;
        height: 0;
        border-width: 100px;
        border-style: solid;
        border-color: red transparent transparent transparent;
        transform: rotate(45deg); /*顺时针旋转45°*/
      }
      ```

    - 箭头

      ```css
      /*<div class="left"></div>*/
      .left {
        position: relative;
      }
      .left:before,
      .left:after {
        position: absolute;
        content: "";
        border-width: 10px;
        border-color: transparent #fff transparent transparent;
        border-style: solid;
      }
      .left:before {
        border-right-color: #0099cc;
      }
      .left:after {
        left: 1px; /*覆盖并错开1px*/
        border-right-color: #fff; /*当前body背景色*/
      }
      ```

      1. 通过 before 和 after 制造 2 个三角形
      2. 伪元素通过设置 content 占有空间
      3. 通过 after 借助背景色和位置偏移，部分覆盖 before，产生箭头

    - 带阴影三角形的对话框

      ```css
      /*<div class="box"></div>*/
      .box {
        position: relative;
        width: 600px;
        height: 400px;
        background: #fff;
        border: 1px solid #ccc;
        box-shadow: 2px 2px 2px #ccc;
      }
      .box:after {
        position: absolute;
        top: 380px;
        left: 300px;
        content: "";
        border-style: solid;
        border-width: 20px;
        border-color: #fff #fff transparent transparent;
        transform: rotate(135deg);
        box-shadow: 2px -2px 2px #ccc;
      }
      ```

      1. 先建造带阴影的矩形对话框
      2. 设置 border-color 建造半个正方形大小的三角形，使三角形能覆盖住对话框的阴影
      3. 定位、旋转、设置三角形阴影

      box-shadow 相关：

        box-shadow: 水平阴影的位置(必需,允许负值) 垂直阴影的位置(必需,允许负值) [模糊距离] [阴影尺寸] [阴影颜色] [阴影向内(设置inset，外部为outset)];

        ```html
        <div id="neon-btn">
          <button class="btn one">Hover me</button>
          <button class="btn two">Hover me</button>
          <button class="btn three">Hover me</button>
        </div>

        <style>
          #neon-btn {
            display: flex;
            align-items: center;
            justify-content: space-around;
            height: 100vh;
            background: #031628;
          }

          .btn {
            border: 1px solid;
            background-color: transparent;
            text-transform: uppercase;
            font-size: 14px;
            padding: 10px 20px;
            font-weight: 300;
          }

          .one {
            color: #4cc9f0;
          }

          .two {
            color: #f038ff;
          }

          .three {
            color: #b9e769;
          }

          .btn:hover {
            color: white;
            border: 0;
          }

          .one:hover {
            background-color: #4cc9f0;
            -webkit-box-shadow: 10px 10px 99px 6px rgba(76, 201, 240, 1);
            -moz-box-shadow: 10px 10px 99px 6px rgba(76, 201, 240, 1);
            box-shadow: 10px 10px 99px 6px rgba(76, 201, 240, 1);
          }

          .two:hover {
            background-color: #f038ff;
            -webkit-box-shadow: 10px 10px 99px 6px rgba(240, 56, 255, 1);
            -moz-box-shadow: 10px 10px 99px 6px rgba(240, 56, 255, 1);
            box-shadow: 10px 10px 99px 6px rgba(240, 56, 255, 1);
          }

          .three:hover {
            background-color: #b9e769;
            -webkit-box-shadow: 10px 10px 99px 6px rgba(185, 231, 105, 1);
            -moz-box-shadow: 10px 10px 99px 6px rgba(185, 231, 105, 1);
            box-shadow: 10px 10px 99px 6px rgba(185, 231, 105, 1);
          }
        </style>
        ```

      - 扇形

        ```css
        .sector {
          width: 0;
          height: 0;
          border: solid 100px red;
          border-color: red transparent transparent transparent;
          border-radius: 100px;
        }
        ```

        先画一个三角形，再设置 border-radius 使边变圆


### flexible 与高清屏

1. 参考链接

   [flexible.js 原理解析](https://blog.csdn.net/weixin_33738555/article/details/91466094)

   [移动端 1px 问题的几种常见解决方案](https://mp.weixin.qq.com/s/Q-VrgN9QhNqZDaRsZ8MENA?)

   [移动端适配方案 flexible.js](https://www.cnblogs.com/interdrp/p/9042749.html)

2. 详解

   - flexible 源码

     精简版

     ```js
     // 首先是一个立即执行函数，执行时传入的参数是window和document
     (function flexible(window, document) {
       var docEl = document.documentElement; // 返回文档的root元素
       var dpr = window.devicePixelRatio || 1;
       // 获取设备的dpr，即当前设置下物理像素与虚拟像素的比值

       // 调整body标签的fontSize，fontSize = (12 * dpr) + 'px'
       // 设置默认字体大小，默认的字体大小继承自body
       function setBodyFontSize() {
         if (document.body) {
           document.body.style.fontSize = 12 * dpr + "px";
         } else {
           document.addEventListener("DOMContentLoaded", setBodyFontSize);
         }
       }
       setBodyFontSize();

       // set 1rem = viewWidth / 10
       // 设置root元素的fontSize = 其clientWidth / 10 + ‘px’
       function setRemUnit() {
         var rem = docEl.clientWidth / 10;
         docEl.style.fontSize = rem + "px";
       }

       setRemUnit();

       // 当页面展示或重新设置大小的时候，触发重新
       window.addEventListener("resize", setRemUnit);
       window.addEventListener("pageshow", function (e) {
         if (e.persisted) {
           setRemUnit();
         }
       });

       // 检测0.5px的支持，支持则root元素的class中有hairlines
       if (dpr >= 2) {
         var fakeBody = document.createElement("body");
         var testElement = document.createElement("div");
         testElement.style.border = ".5px solid transparent";
         fakeBody.appendChild(testElement);
         docEl.appendChild(fakeBody);
         if (testElement.offsetHeight === 1) {
           docEl.classList.add("hairlines");
         }
         docEl.removeChild(fakeBody);
       }
     })(window, document);
     ```

     详细版

     ```js
     (function (win, lib) {
       var doc = win.document;
       var docEl = doc.documentElement;
       var metaEl = doc.querySelector('meta[name="viewport"]');
       var flexibleEl = doc.querySelector('meta[name="flexible"]');
       var dpr = 0;
       var scale = 0;
       var tid;
       var flexible = lib.flexible || (lib.flexible = {});

       if (metaEl) {
         console.warn("将根据已有的meta标签来设置缩放比例");
         var match = metaEl
           .getAttribute("content")
           .match(/initial\-scale=([\d\.]+)/);
         if (match) {
           scale = parseFloat(match[1]);
           dpr = parseInt(1 / scale);
         }
       } else if (flexibleEl) {
         var content = flexibleEl.getAttribute("content");
         if (content) {
           var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
           var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
           if (initialDpr) {
             dpr = parseFloat(initialDpr[1]);
             scale = parseFloat((1 / dpr).toFixed(2));
           }
           if (maximumDpr) {
             dpr = parseFloat(maximumDpr[1]);
             scale = parseFloat((1 / dpr).toFixed(2));
           }
         }
       }
       if (!dpr && !scale) {
         var isAndroid = win.navigator.appVersion.match(/android/gi);
         var isIPhone = win.navigator.appVersion.match(/iphone/gi);
         var devicePixelRatio = win.devicePixelRatio;
         if (isIPhone) {
           // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
           if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
             dpr = 3;
           } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
             dpr = 2;
           } else {
             dpr = 1;
           }
         } else {
           // 其他设备下，仍旧使用1倍的方案
           dpr = 1;
         }
         scale = 1 / dpr;
       }
       docEl.setAttribute("data-dpr", dpr);
       if (!metaEl) {
         metaEl = doc.createElement("meta");
         metaEl.setAttribute("name", "viewport");
         metaEl.setAttribute(
           "content",
           "initial-scale=" +
             scale +
             ", maximum-scale=" +
             scale +
             ", minimum-scale=" +
             scale +
             ", user-scalable=no"
         );
         if (docEl.firstElementChild) {
           docEl.firstElementChild.appendChild(metaEl);
         } else {
           var wrap = doc.createElement("div");
           wrap.appendChild(metaEl);
           doc.write(wrap.innerHTML);
         }
       }
       function refreshRem() {
         var width = docEl.getBoundingClientRect().width;
         if (width / dpr > 540) {
           width = 540 * dpr;
         }
         var rem = width / 10;
         docEl.style.fontSize = rem + "px";
         flexible.rem = win.rem = rem;
       }
       win.addEventListener(
         "resize",
         function () {
           clearTimeout(tid);
           tid = setTimeout(refreshRem, 300);
         },
         false
       );
       win.addEventListener(
         "pageshow",
         function (e) {
           if (e.persisted) {
             clearTimeout(tid);
             tid = setTimeout(refreshRem, 300);
           }
         },
         false
       );
       if (doc.readyState === "complete") {
         doc.body.style.fontSize = 12 * dpr + "px";
       } else {
         doc.addEventListener(
           "DOMContentLoaded",
           function (e) {
             doc.body.style.fontSize = 12 * dpr + "px";
           },
           false
         );
       }

       refreshRem();
       flexible.dpr = win.dpr = dpr;
       flexible.refreshRem = refreshRem;
       flexible.rem2px = function (d) {
         var val = parseFloat(d) * this.rem;
         if (typeof d === "string" && d.match(/rem$/)) {
           val += "px";
         }
         return val;
       };
       flexible.px2rem = function (d) {
         var val = parseFloat(d) / this.rem;
         if (typeof d === "string" && d.match(/px$/)) {
           val += "rem";
         }
         return val;
       };
     })(window, window["lib"] || (window["lib"] = {}));
     ```

   - 解析

     1. rem

        以 rem 为单位，其值是相对 root html 元素，与 em 这个相对于父元素的单位不同，rem 与 px 转换的 base 设置在 html 的 font-size 上，base 为 clientWidth 除以 10。

     2. clientWidth

        clientWidth 是元素内部的宽度，包括 padding，但不包括 border，margin 和垂直的滚动条

     3. Document​.document​Element

        返回文档的 root 元素，HTML 元素

     4. window.devicePixelRatio

        返回当前显示设备下物理像素与设备独立像素的比值，设置在 html 的 data-dpr 上，用于设置 css

        ```css
        [data-dpr="2"] div {
          font-size: 24px;
        }
        ```

        data-dpr 通过 window.devicePixelRatio 获取，并设置在 html 头上，font-size 为 clientWidth/10\*dpr，base 为 clientWidth/10，scale 相关参数为 1/dpr

        ```html
        <html lang="en" data-dpr="3" style="font-size: 112.5px;">
          <meta
            name="viewport"
            content="initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no"
          />
        </html>
        ```

        所以 flexible 做了以上 3 件事：

        - 动态改写 meta 标签
        - 给 html 元素添加 data-dpr 属性，并且动态改写 data-dpr 的值
        - 给 html 元素添加 font-size 属性，并且动态改写 font-size 的值

        提示：flexible 会将视觉稿分成 100 份（主要为了以后能更好的兼容 vh 和 vw），而每一份被称为一个单位 a。同时 1rem 单位被认定为 10a。

        换算:1a = 7.5px,1rem = 75px

     5. viewport 相关

        ```html
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        ```

        - width:可视区域的宽度，值可为数字或关键词 device-width
        - height:同 width
        - intial-scale:页面首次被显示是可视区域的缩放级别，取值 1.0 则页面按实际尺寸显示，无任何缩放
        - maximum-scale=1.0, minimum-scale=1.0;可视区域的缩放级别，
          maximum-scale 用户可将页面放大的程序，1.0 将禁止用户放大到实际尺寸之上。
        - user-scalable:是否可对页面进行缩放，no 禁止缩放

        注意：缩放是类似 css 中的 scale

     6. sass 配置

        ```scss
        // px转换为rem，字体rem方案
        @function pxToRem($px, $base: 750px) {
          $min: 1 / $base * 10 * 1;
          $result: $px / $base * 10 * 1;

          @if $result < 0.027 and $result > 0 {
            @return 2px;
          } @else {
            @return $px / $base * 10 * 1rem;
          }
        }
        // @function调用：font-size: pxToRem(96px);
        //字体px方案
        @mixin font-dpr($font-size) {
          font-size: $font-size;

          [data-dpr="2"] & {
            font-size: $font-size * 2;
          }

          [data-dpr="3"] & {
            font-size: $font-size * 3;
          }
        }
        // @mixin调用：@include font-dpr(30px);
        // 设置dpr下的图片
        @mixin img-dpr($url, $pattern) {
          background-image: url($url);

          [data-dpr="2"] & {
            background-image: url(str-replace-first(
              $url,
              $pattern,
              "@2x" + $pattern
            ));
          }

          [data-dpr="3"] & {
            background-image: url(str-replace-first(
              $url,
              $pattern,
              "@3x" + $pattern
            ));
          }
        }
        ```

   - 原理

     设置 meta，其主要作用的是 width=device-width，document.documentElement.clientWidth 就等于设备独立像素的宽度

     root 元素设置 fontSize 为 document.documentElement.clientWidth 的十分之一，这样 1rem 就等于 document.documentElement.clientWidth/10

     rem 并非是完美的适配方案，使用了 rem，最后渲染时还是转换成 px，这时小数部分就四舍五入

   - 高清屏

     PC 端 dpr 均为 1。

     移动端高清屏 2x 或 3x 中，设置 border 为 1px，但显示会很粗，实际占用物理像素 3px，
     这是因为设备像素和屏幕像素差别的原因。

     例如：iPhone6 的 dpr 为 2，物理像素是 750（x 轴）,它的逻辑像素为 375。也就是说，1 个逻辑像素，在 x 轴和 y 轴方向，需要 2 个物理像素来显示，即：dpr=2 时，表示 1 个 CSS 像素由 4 个物理像素点组成。

     - 解决方法

       1. media 设置 border 为小数点

       ```css
       .border {
         border: 1px solid #999;
       }
       @media screen and (-webkit-min-device-pixel-ratio: 2) {
         .border {
           border: 0.5px solid #999;
         }
       }
       @media screen and (-webkit-min-device-pixel-ratio: 3) {
         .border {
           border: 0.333333px solid #999;
         }
       }
       ```

       IOS7 及以下和 Android 等其他系统里，0.5px 将会被显示为 0px。解决方案是通过 JavaScript 检测浏览器能否处理 0.5px 的边框，如果可以，给 html 标签元素添加个 class。

       ```js
       $(document).ready(function() {
           if (window.devicePixelRatio && devicePixelRatio >= 2) {
               var testElem = document.createElement('div');
               testElem.style.border = '.5px solid transparent';
               document.body.appendChild(testElem);
           }
           if (testElem.offsetHeight == 1) {
               document.querySelector('html').classList.add('hairlines');
           }
               document.body.removeChild(testElem);
           }
       })
       ```

       ```css
       div {
         border: 1px solid #bbb;
       }
       .hairlines div {
         border-width: 0.5px;
       }
       ```

       2. flexible

       flexible 会自动修改

       在 devicePixelRatio=2 时，设置 meta：

       ```html
       <meta
         name="viewport"
         content="width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no"
       />
       ```

       在 devicePixelRatio=2 时，设置 meta：

       ```html
       <meta
         name="viewport"
         content="width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no"
       />
       ```

       3. css3 伪类+transform

       把原先元素的 border 去掉，然后利用:before 或者:after 重做 border，并 scale 缩小一半，原先的元素相对定位，新做的 border 绝对定位。

       ```css
       .box {
         width: 100px;
         height: 100px;
         position: relative;
       }

       /*手机端实现真正的一像素边框*/
       .border-1px,
       .border-bottom-1px,
       .border-top-1px,
       .border-left-1px,
       .border-right-1px {
         position: absolute;
         width: 100px;
         height: 100px;
       }

       /*线条颜色 黑色*/
       .border-1px::after,
       .border-bottom-1px::after,
       .border-top-1px::after,
       .border-left-1px::after,
       .border-right-1px::after {
         background-color: #000;
       }

       /*底边边框一像素*/
       .border-bottom-1px::after {
         content: "";
         position: absolute;
         left: 0;
         bottom: 0;
         width: 100%;
         height: 1px;
         transform-origin: 0 0;
       }

       /*上边边框一像素*/
       .border-top-1px::after {
         content: "";
         position: absolute;
         left: 0;
         top: 0;
         width: 100%;
         height: 1px;
         transform-origin: 0 0;
       }

       /*左边边框一像素*/
       .border-left-1px::after {
         content: "";
         position: absolute;
         left: 0;
         top: 0;
         width: 1px;
         height: 100%;
         transform-origin: 0 0;
       }

       /*右边边框1像素*/
       .border-right-1px::after {
         content: "";
         box-sizing: border-box;
         position: absolute;
         right: 0;
         top: 0;
         width: 1px;
         height: 100%;
         transform-origin: 0 0;
       }

       /*边框一像素*/
       .border-1px::after {
         content: "";
         box-sizing: border-box;
         position: absolute;
         left: 0;
         top: 0;
         width: 100%;
         height: 100%;
         border: 1px solid gray;
       }

       /*设备像素比*/
       /*显示屏最小dpr为2*/
       @media (-webkit-min-device-pixel-ratio: 2) {
         .border-bottom-1px::after,
         .border-top-1px::after {
           transform: scaleY(0.5);
         }

         .border-left-1px::after,
         .border-right-1px::after {
           transform: scaleX(0.5);
         }

         .border-1px::after {
           width: 200%;
           height: 200%;
           transform: scale(0.5);
           transform-origin: 0 0;
         }
       }

       /*设备像素比*/
       @media (-webkit-min-device-pixel-ratio: 3) {
         .border-bottom-1px::after,
         .border-top-1px::after {
           transform: scaleY(0.333);
         }

         .border-left-1px::after,
         .border-right-1px::after {
           transform: scaleX(0.333);
         }

         .border-1px::after {
           width: 300%;
           height: 300%;
           transform: scale(0.333);
           transform-origin: 0 0;
         }
       }
       ```

       ```html
       <div class="box">
         <div class="border-bottom-1px"></div>
         <div class="border-top-1px"></div>
         <div class="border-left-1px"></div>
         <div class="border-right-1px"></div>
       </div>
       ```

       4. border-image

       border 使用 image

       ```css
       .border-image-1px {
         border-bottom: 1px solid #666;
       }

       @media only screen and (-webkit-min-device-pixel-ratio: 2) {
         .border-image-1px {
           border-bottom: none;
           border-width: 0 0 1px 0;
           border-image: url(../img/linenew.png) 0 0 2 0 stretch;
         }
       }
       ```

       5. background-image

       原理同上

       ```css
       .background-image-1px {
         background: url(../img/line.png) repeat-x left bottom;
         background-size: 100% 1px;
       }
       ```

       6. postcss-write-svg

       ```css
       @svg 1px-border {
         height: 2px;
         @rect {
           fill: var(--color, black);
           width: 100%;
           height: 50%;
         }
       }
       .example {
         border: 1px solid transparent;
         border-image: svg(1px-border param(--color #00b1ff)) 2 2 stretch;
       }
       ```

       编译后

       ```css
       .example {
         border: 1px solid transparent;
         border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E")
           2 2 stretch;
       }
       ```


### css 并列自适应布局

1. 参考链接：

   - [十道大厂面试题(含答案)总结](https://mp.weixin.qq.com/s/o553cr1FHLz40PpxbO8oOw)

2. 详解：

   左边 2 列，右边 1 列，中间自适应

   ```html
   <div class="parent" style="width: 200px">
     <div class="child child1" style="width: 20px">1</div>
     <div class="child child2" style="width: 20px">2</div>
     <div class="child child3" style="width: 20px">3</div>
   </div>
   ```

   ```css
   /* 1 display: flex; */
   .parent {
     background-color: burlywood;
     display: flex;
   }
   .child {
     background-color: black;
     font-size: 20px;
     color: white;
   }
   .child3 {
     margin-left: auto;
   }

   /* 2 position: absolute; */
   .parent {
     background-color: burlywood;
     position: relative;
   }
   .child {
     font-size: 20px;
     color: white;
   }
   .child1 {
     background-color: black;
     position: absolute;
     left: 0;
   }
   .child2 {
     background-color: black;
     position: absolute;
     left: 20px;
   }
   .child3 {
     background-color: black;
     position: absolute;
     right: 0;
   }

   /* 3 float */
   .parent {
     background-color: burlywood;
   }
   .child1 {
     background-color: black;
     float: left;
   }
   .child2 {
     background-color: red;
     float: left;
   }
   .child3 {
     float: right;
     background-color: blue;
   }

   /* 4 display: table; */
   .parent {
     background-color: burlywood;
     display: table;
   }
   .child {
     background-color: black;
     display: table-cell;
     height: 20px;
   }
   .child3 {
     display: block;
     margin-left: auto;
   }

   /* 5 transform: translate */
   .parent {
     background-color: burlywood;
     position: relative;
   }
   .child {
     background-color: black;
     position: absolute;
     top: 0;
     left: 0;
   }
   .child2 {
     transform: translate(20px, 0);
   }
   .child3 {
     transform: translate(180px, 0);
   }

   /* 6 display: grid; */
   .parent {
     background-color: burlywood;
     display: grid;
     grid-template-columns: repeat(10, 1fr);
   }
   .child {
     background-color: black;
     font-size: 20px;
     color: white;
   }
   .child3 {
     grid-column: 10 / 11;
   }

   /* 7 display: inline-block; */
   .parent {
     background-color: burlywood;
     font-size: 0;
   }
   .child {
     background-color: black;
     display: inline-block;
     font-size: 20px;
     color: white;
   }
   .child3 {
     margin-left: 140px;
   }
   ```


### css 旋转、拖拽、手势移动

1. 参考链接：

   [CSS3 动画（360 度旋转、旋转放大、放大、移动）](https://www.cnblogs.com/guozhe/p/5912664.html)

   [HTML5 CSS3 专题 : 拖放 （Drag and Drop）](https://www.cnblogs.com/wzjhoutai/p/6858022.html)

   [CSS八种让人眼前一亮的HOVER效果](https://juejin.im/post/6861501624993447950#heading-0)

   [特效属性「Transform」+ 矩阵 matrix](https://www.jianshu.com/p/f943e2014c39)

2. 详解：

  关键词：transform,translate,scale,rotate,skew(倾斜度数),transition,animation,@keyframes,drag 系列事件,cursor

  transition 和 animation 的区别：

  1. transition 是 css 过渡效果，需要和 hover 等事件配合，由事件触发。动画过程中所有样式属性都要一起变化
  2. animation 基于帧动画，配合 keyframes 使用，可以设定每一帧的单一样式变化和时间以及循环次数。

  * transform:matrix

    transform: matrix(a,b,c,d,e,f)

    ```txt
    a c e   x   ax+cy+e
    b d f . y = bx+dy+f
    0 0 1   1   0+0+1
    x' = ax + cy +  e   // 即：x坐标
    y' = bx + dy + f    // 即：y坐标
    ```

    纯平移:transform: matrix(1, 0, 0, 1, x轴偏移量，y轴偏移量)
    ```txt
    x' = ax + cy +  e  = 1*0 + 0*0 + 30 = 30
    y' = bx + dy + f = 0*1 + 1*0 + 30 = 30
    ```

    纯缩放:transform: matrix(s, 0, 0, s, 0, 0)
    ```txt
    x' = ax+cy+e = s*x+0*y+0 = s*x;
    y' = bx+dy+f = 0*x+s*y+0 = s*y;
    transform: matrix(sx,0,0,sy,0,0); 等同于 scale(sx, sy);
    ```

    纯旋转:transform: matrix(cosθ,sinθ,-sinθ,cosθ,0,0)
    ```txt
    x' = x*cosθ-y*sinθ+0 = x*cosθ-y*sinθ
    y' = x*sinθ+y*cosθ+0 = x*sinθ+y*cosθ
    ```

    纯拉伸:transform: matrix(1,tan(θy),tan(θx),1,0,0)
    ```txt
    x' = x+y*tan(θx)+0 = x+y*tan(θx)
    y' = x*tan(θy)+y+0 = x*tan(θy)+y
    对应于skew(θx + "deg"，θy+ "deg")
    ```

  * 视距

    transform: perspective(100px);

    perspective: 100px;

  * 变换原点

    transform-origin: x y;

  普通平移
  ```html
  <div id="send-btn">
    <button>
      // 这里是一个svg的占位
      Send
    </button>
  </div>
  ```
  ```css
  #send-btn{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  button {
    background: #5f55af;
    border: 0;
    border-radius: 5px;
    padding: 10px 30px 10px 20px;
    color: white;
    text-transform: uppercase;
    font-weight: bold;
  }

  button svg {
    display: inline-block;
    vertical-align: middle;
    padding-right: 5px;
  }

  button:hover svg {
    animation: fly 2s ease 1;
  }

  @keyframes fly {
    0% {
      transform: translateX(0%);
    }

    50% {
      transform: translateX(300%);
    }

    100% {
      transform: translateX(0);
    }
  }
  ```

  带旋转平移制造闪亮效果
  ```html
  <div id="shiny-shadow">
    <button><span>Hover me</span></button>
  </div>

  <style>
    #shiny-shadow {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #1c2541;
    }

    button {
      border: 2px solid white;
      background: transparent;
      text-transform: uppercase;
      color: white;
      padding: 15px 50px;
      outline: none;
      overflow: hidden;
      position: relative;
    }

    span {
      z-index: 20;  
    }

    button:after {
      content: '';
        display: block;
        position: absolute;
        top: -36px;
        left: -100px;
        background: white;
        width: 50px;
        height: 125px;
        opacity: 20%;
        transform: rotate(-45deg);
    }

    button:hover:after {
      left: 120%;
      transition: all 600ms cubic-bezier(0.3, 1, 0.2, 1);
      -webkit-transition: all 600ms cubic-bezier(0.3, 1, 0.2, 1);
    }
  </style>
  ```

### css 伪类和伪元素

1. 参考链接：

   [伪元素&伪类](https://www.jianshu.com/p/8b610fdf0d48)

2. 详解：

   - 伪元素

     - 描述

       创建 DOM 不存在的元素，并添加样式

     - 详细

       - :before/E:before 在 E 元素内部创建一个行内元素，作为 E 的第一个孩子,需要使用 content 属性来指定要插入的内容。被插入的内容实际上不在文档树中。

       - E::after/E:after 作为 E 的最后一个孩子

       - E::first-letter/E:first-letter 匹配 E 元素内容的第一个字母

       - E::first-lineE/:first-line 匹配 E 元素内容的第一行,这个伪元素只能用在块元素中，不能用在内联元素中

       - E::selection 应用于文档中被用户高亮的部分（比如使用鼠标或其他选择设备选中的部分）改变字体大小，添加背景色等等,在火狐浏览器使用时需要添加-moz 前缀。该伪元素只支持双冒号的形式；

       - E::placeholder 匹配占位符的文本，只有元素设置了 placeholder 属性，才能生效;用于修改 input 默认的灰色文字的样式，字体大小和字体颜色等等；为了浏览器兼容性，一般写为： input::-webkit-input-placeholder

   - 伪类

     - 描述

       已有元素处于某个状态时，为其添加对应的样式

     - 详细

       - 状态相关

         - :hover
         - :visited
         - :active
         - :focus

       - 表单相关

         - :checked
         - :disabled
         - :required
         - :read-only

       - 选择器

         - :first-child
         - :last-child
         - :nth-child 先选中第几个孩子，再看前方选择器是否匹配
         - :first-of-type
         - :last-of-type
         - :nth-of-type 先选中前方指定的选择器的所有元素，再看是第几个


### css 幽灵空白节点

1. 参考链接：

   [vertical-align 到底怎么用](https://www.jianshu.com/p/ce7e4a997a2c)

   [css 中的 baseline](https://www.cnblogs.com/xsd1/p/11943908.html)

   [幽灵空白节点](https://www.jianshu.com/p/590fe42b1e8c)

2. 详解

   - 描述

     内联元素的所有解析和渲染表现就如同每个行框盒子的前面有一个“空白节点”一样。这个“空白节点”永远透明，不占据任何宽度，看不见也无法通过脚本获取，就好像幽灵一样，但又确确实实地存在，表现如同文本节点一样。

   - 原因

     vertical-align 默认对齐方式和 line-height 文字的高度造成的

   - 场景

     span 没有任何内容，却能撑起 div 高度，为方便观看，可解开注释 3，解决办法可分开解除前 2 个注释

     ```html
     <style type="text/css">
       .box {
         background-color: yellow;
         /*font-size: 0;注释1*/
         /*line-height: 0;注释2*/
       }
       .box,
       .box > span {
         outline: 1px solid #333;
       }
       .box > span {
         /*vertical-align: top;注释3*/
       }
     </style>
     <div class="box">
       <span style="display:inline-block; width: 100px;"></span>
     </div>
     ```

   - 解决方法

     1. 让 vertical-align 失效

        display:block/float/position:absolute

     2. 使用其他 vertical-align 值,而非默认 baseline

        top/middle/bottom

        - 关于 baseline

          inline+inline-block(overflow:hidden)+inline 会出现中间元素不贴底边对齐的情况

          vertical-align 默认值为 baseline，表示与其父元素基线相对齐，对于行内元素(inline,inline-block)，以小写 x 的底边对齐，对于 inline-block+overflow:hidden，产生块级元素，以盒子底边对齐，对于这种情况，需要设置 vertical-align: top;或者 vertical-align: bottom;

     3. 修改 line-height 值，或修改 font-size

        行高足够小，下面没有高度区域支撑，或 font-size:0


### flex

1.  参考链接：

    [第 154 题：弹性盒子中 flex: 0 1 auto 表示什么意思](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/380)

    [Flex 布局语法教程](https://www.runoob.com/w3cnote/flex-grammar.html)

2.  详解

    1. flex: flex-grow flex-shrink flex-basis|auto|initial|inherit;

        flex :flex-grow flex-shrink flex-basis
        ```css
        .item {
          flex-grow: 0;
          flex-shrink: 1;
          flex-basis: auto;
        }
        ```
        
        * flex-grow 剩余空间索取

            默认值为0，不索取

            eg:父元素400，子元素A为100px，B为200px.则剩余空间为100

            此时A的flex-grow 为1，B为2，

            则A=100px+33.3333px; B=200px+66.6667px

        * flex-shrink 子元素总宽度大于复制元素如何缩小

            父400px,A 200px,B 300px

            AB总宽度超出父元素100px;

            如果A不减少，则flex-shrink ：0,B减少；

        * flex-basis

            该属性用来设置元素的宽度，当然width也可以用来设置元素的宽度，如果设置了width和flex-basis，那么flex-basis会覆盖width值。

    2. Flex布局

        ```css
        .box{
            display: flex;
        }

        .box{
            display: inline-flex;
        }

        .box{
            display: -webkit-flex; /* Safari */
            display: flex;
        }
        ```

        单行文字居中，多行文字居左
        ```css
        display: flex;
        flex-direction: row;
        justify-content: center;
        ```

    3. flex-direction:主轴的方向（即项目的排列方向）

        * row（默认值）：主轴为水平方向，起点在左端。
        * row-reverse：主轴为水平方向，起点在右端。
        * column：主轴为垂直方向，起点在上沿。
        * column-reverse：主轴为垂直方向，起点在下沿。

    4. flex-wrap:一条轴线排不下，如何换行

        * nowrap:（默认）不换行
        * wrap：换行，第一行在上方
        * wrap-reverse：换行，第一行在下方

    5. flex-flow:flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap

        ```css
        .box {
            flex-flow: <flex-direction> <flex-wrap>;
        }
        ```

    6. justify-content：主轴方向对齐方式，如从左到右对齐方式

        * flex-start（默认值）：左对齐
        * flex-end：右对齐
        * center：居中(类似水平居中)
        * space-between：两端对齐，项目之间的间隔都相等
        * space-around：每个项目两侧的间隔相等,项目之间的间隔比项目与边框的间隔大一倍

    7. align-items：交叉轴(与主轴垂直的轴)上对齐方式，如从上到下对齐方式

        * flex-start：交叉轴的起点对齐
        * flex-end：交叉轴的终点对齐
        * center：交叉轴的中点对齐(类似垂直居中)
        * baseline: 项目的第一行文字的基线对齐
        * stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度

    8. align-content:多根轴线的对齐方式，如果项目只有一根轴线，该属性不起作用，整体对齐方式

        * flex-start：与交叉轴的起点对齐
        * flex-end：与交叉轴的终点对齐
        * center：与交叉轴的中点对齐(类似水平垂直居中)
        * space-between：与交叉轴两端对齐，轴线之间的间隔平均分布
        * space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍
        * stretch（默认值）：轴线占满整个交叉轴

    9. order：项目的排列顺序。数值越小，排列越靠前，默认为0。

        ```css
        .item {
            order: <integer>;
        }
        ```

    10. align-self:允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

          ```css
          .item {
              align-self: auto | flex-start | flex-end | center | baseline | stretch;
          }
          ```

### overflow:hidden 清除浮动的原理

1. 参考链接：

   [为什么"overflow:hidden"能清除浮动的影响](https://www.jianshu.com/p/7e04ed3f4bea)

   [【建议收藏】css晦涩难懂的点都在这啦](https://juejin.im/post/6888102016007176200)

2. 详解：

   - BFC

     BFC（Block Formatting Context），块级格式化上下文(块级元素)，它规定了内部的块级元素(父子关系)的布局方式，空网页下只有 body 一个块级上下文。

     - BFC 布局规则

       - 内部块级元素从上到下排布
       - 同一 BFC 的兄弟块级元素会 margin 合并，否则不会
       - margin 与 border 相接触
       - 块级元素不会与 float 元素重叠
       - 计算块级元素高度时，里面的浮动元素也参与计算

     - 创建 BFC

       - float 的值不为 none
       - overflow 的值不为 visible
       - position 的值为 fixed / absolute
       - display 的值为 table-cell / table-caption / inline-block / flex / inline-flex

     - 用途

       - 清除元素内部浮动：计算BFC的高度时，自然也会检测浮动或者定位的盒子高度
       - 解决外边距合并(塌陷)问题：盒子垂直方向的距离由margin决定。属于同一个BFC的两个相邻盒子的margin会发生重叠
       - 制作右侧自适应的盒子问题：普通流体元素BFC后，为了和浮动元素不产生任何交集，顺着浮动边缘形成自己的封闭上下文

   ```html
   <body>
     <div class="parent">
       <div class="child1"></div>
       <div class="child2"></div>
     </div>
   </body>
   ```

   ```css
   .parent {
     width: 300px;
     background: #ddd;
     border: 1px solid;
     overflow: hidden;
   }
   .child1 {
     width: 100px;
     height: 100px;
     background: pink;
     float: left;
   }
   .child2 {
     width: 200px;
     height: 50px;
     background: red;
   }
   ```

   在 parent 加入 overflow: hidden 前，parent 高度为 50px，加入后高度为 100px，所以父元素 overflow: hidden，可以清除包含块内子元素的浮动。

   - IFC

      行级格式化上下

      - 布局规则：

        - 内部的盒子会在水平方向，一个个地放置(默认就是IFC)
        - IFC的高度，由里面最高盒子的高度决定(里面的内容会撑开父盒子)
        - 当一行不够放置的时候会自动切换到下一行


### css样式穿透

1. 参考链接：

   [CSS3神奇的样式 pointer-events: none;解决JS鼠标事件穿透到子标签](https://blog.csdn.net/weixin_42703239/article/details/89217573)

   [12 个实用的前端开发技巧总结](https://mp.weixin.qq.com/s/m-5D2261jTQ_TJccvObxSQ)

2. 详解：

  * 场景1

    img css穿透input file，覆盖默认样式，同时使input可点击

    ```css
    img {
      pointer-events: none;
    }
    ```
    
  * 场景2

    获取鼠标相对标签，parent和child盒子中，event.offsetX 和 event.offsetY不一致，因此需要css样式穿透使child不可点，是坐标一直相对于parent

    ```html
    <style>
        .parent{
          width:400px;
          height:400px;
          padding: 50px;
          margin:100px;
          background:#f20;
        }
        .child{
          width:200px;
          height:200px;
          padding:50px;
          background:#ff0;
          pointer-events: none;   /* 不接受鼠标事件 */
        }
        .child-child{
          width:50px;
          height:50px;
          background:#00d;
          pointer-events: none;   /* 不接受鼠标事件 */
        }
    </style>

    <div  class="parent"  id="parent">
          <div  class="child">
                  <div  class="child-child">

                  </div>
          </div>
    </div>

    <script>
        let  parent = document.getElementById("parent");
        parent.addEventListener("click",function(event){
            console.info( event.offsetX );
        });
    </script>
    ```

### grid

1. 参考链接：

   [最强大的 CSS 布局 —— Grid 布局](https://juejin.im/post/5f1e70315188252e937c088b)

2. 详解：

    IE 10 以下不支持

    display：grid 或 display：inline-grid 来创建一个网格容器，inline容器为行内元素

    ```css
    .wrapper {
      display: grid;
      /*  声明了三列，宽度分别为 200px 100px 200px */
      grid-template-columns: 200px 100px 200px;
      grid-gap: 5px;
      /*  声明了两行，行高分别为 50px 50px  */
      grid-template-rows: 50px 50px;
      /*  2行，而且行高都为 50px  */
      /*  grid-template-rows: repeat(2, 50px);  */
    }
    ```

    auto-fill 关键字：表示自动填充，让一行（或者一列）中尽可能的容纳更多的单元格。grid-template-columns: repeat(auto-fill, 200px) 表示列宽是 200 px，但列的数量是不固定的，只要浏览器能够容纳得下，就可以放置元素
    
    ```css
    .wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fill, 200px);/*类似固定宽度float:left*/
      grid-gap: 5px;
      grid-auto-rows: 50px;
    }
    ```

    fr 关键字：Grid 布局还引入了一个另外的长度单位来帮助我们创建灵活的网格轨道。fr 单位代表网格容器中可用空间的一等份。grid-template-columns: 200px 1fr 2fr 表示第一个列宽设置为 200px，后面剩余的宽度分为两部分，宽度分别为剩余宽度的 1/3 和 2/3
    
    ```css
    .wrapper {
      display: grid;
      grid-template-columns: 200px 1fr 2fr;/*后两列按比例自动缩放*/
      grid-gap: 5px;
      grid-auto-rows: 50px;
    }
    ```

    minmax() 函数：我们有时候想给网格元素一个最小和最大的尺寸，minmax() 函数产生一个长度范围，表示长度就在这个范围之中都可以应用到网格项目中。它接受两个参数，分别为最小值和最大值。grid-template-columns: 1fr 1fr minmax(300px, 2fr) 的意思是，第三个列宽最少也是要 300px，但是最大不能大于第一第二列宽的两倍。
    
    ```css
    .wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr minmax(300px, 2fr);/*类似min-width和max-width*/
      grid-gap: 5px;
      grid-auto-rows: 50px;
    }
    ```

    auto 关键字：由浏览器决定长度。通过 auto 关键字，我们可以轻易实现三列或者两列布局。

    ```css
    .wrapper {
      display: grid;
      grid-template-columns: 100px auto 100px;/*类似flex自动伸缩*/
      grid-gap: 5px;
      grid-auto-rows: 50px;
    }
    ```

    grid-row-gap 属性、grid-column-gap 属性分别设置行间距和列间距。

    ```css
    .wrapper {
      display: grid;
      grid-template-columns: 200px 100px 100px;
      grid-auto-rows: 50px;
      /*grid-gap: 10px 20px;*/
      grid-row-gap: 10px;
      grid-column-gap: 20px;
    }
    ```

    grid-template-areas 属性用于定义区域，一个区域由一个或者多个单元格组成,值得注意的是 . 符号代表空的单元格，也就是没有用到该单元格。

    ```css
    .wrapper {
      display: grid;
      grid-gap: 10px;
      grid-template-columns: 120px  120px  120px;
      grid-template-areas:
        ". header  header"
        "sidebar content content";
      background-color: #fff;
      color: #444;
    }

    .sidebar {
      grid-area: sidebar;
    }

    .content {
      grid-area: content;
    }

    .header {
      grid-area: header;
    }
    ```

    grid-auto-flow 属性控制着自动布局算法怎样运作，精确指定在网格中被自动布局的元素怎样排列。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行，这个顺序由 grid-auto-flow 属性决定，默认值是 row。

    ```css
    .wrapper {
      display: grid;
      grid-template-columns: 100px 200px 100px;
      /*让下面长度合适的元素填满空白，可以设置 grid-auto-flow: row dense*/
      grid-auto-flow: row;/*列优先column*/
      grid-gap: 5px;
      grid-auto-rows: 50px;
    }
    ```

    justify-items 属性设置单元格内容的水平位置（左中右），align-items 属性设置单元格的垂直位置（上中下）

    ```css
    .container {
      justify-items: start | end | center | stretch(平铺占满) | space-around (每个项目两侧的间隔相等) | space-between (项目与项目的间隔相等，项目与容器边框之间没有间隔) | space-evenly(项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔);
      align-items: start | end | center | stretch;
    }
    ```

    可以指定网格项目所在的四个边框，分别定位在哪根网格线，从而指定项目的位置
    * grid-column-start 属性：左边框所在的垂直网格线
    * grid-column-end 属性：右边框所在的垂直网格线
    * grid-row-start 属性：上边框所在的水平网格线
    * grid-row-end 属性：下边框所在的水平网格线

    ```css
    .wrapper {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 20px;
      grid-auto-rows: minmax(100px, auto);
    }
    .one {
      grid-column-start: 1;
      grid-column-end: 2;
      background: #19CAAD;
    }
    .two { 
      grid-column-start: 2;
      grid-column-end: 4;
      grid-row-start: 1;
      grid-row-end: 2;
      /* 如果有重叠，就使用 z-index */
      z-index: 1;
      background: #8CC7B5;
    }
    .three {
      grid-column-start: 3;
      grid-column-end: 4;
      grid-row-start: 1;
      grid-row-end: 4;
      background: #D1BA74;
    }
    .four {
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 2;
      grid-row-end: 5;
      background: #BEE7E9;
    }
    .five {
      grid-column-start: 2;
      grid-column-end: 2;
      grid-row-start: 2;
      grid-row-end: 5;
      background: #E6CEAC;
    }
    .six {
      grid-column: 3;
      grid-row: 4;
      background: #ECAD9E;
    }
    ```

    justify-self 属性设置单元格内容的水平位置（左中右），跟 justify-items 属性的用法完全一致，但只作用于单个项目

    align-self 属性设置单元格内容的垂直位置（上中下），跟align-items属性的用法完全一致，也是只作用于单个项目

    ```css
    .item {
      justify-self: start | end | center | stretch;
      align-self: start | end | center | stretch;
    }
    ```

    fr 实现等分响应式

    ```css
    .wrapper {
      margin: 50px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 10px 20px;
      grid-auto-rows: 50px;
    }
    ```

    repeat + auto-fit——固定列宽，改变列数量

    ```css
    .wrapper {
      margin: 50px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      grid-gap: 10px 20px;
      grid-auto-rows: 50px;
    }
    ```

    repeat+auto-fit+minmax-span-dense 解决空缺问题

    ```css
    .wrapper, .wrapper-1 {
      margin: 50px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      grid-gap: 10px 20px;
      grid-auto-rows: 50px;
    }

    .wrapper-1 {
      grid-auto-flow: row dense;
    }
    ```

### css比较函数

1. 参考链接：

   [一文学会使用 CSS 中的 min(), max(), clamp() 以及它们的使用场景](https://juejin.im/post/6857662252816793607#heading-4)

2. 详解：

    * 兼容性
    
      不兼容IE,Edge79+,firefox75+,chrome79+,safari11.1+

    * 单位

      %，em，rem，vw/vh

      可以用于数学表达式：10 * (1vw + 1vh) / 2

    * min

      能比较不同单位，并取最小值
      ```css
      .element {
          width: min(50%, 500px);
      }
      ```

    * max

      能比较不同单位，并取最大值
      ```css
      .element {
          width: max(50%, 500px);
      }
      ```

    * clamp

      能比较不同单位，并限定范围区间
      ```css
      .element {
          width: clamp(200px, 50%, 1000px);
      }
      ```

    * 应用场景

      响应式、自适应页面宽度、字体等

    * 在不兼容浏览器处理方法

      1. 手动添加回退方案

        ```css
        .hero {
            padding: 4rem 1rem;
            padding: clamp(2rem, 10vmax, 10rem) 1rem;
        }
        ```

      2. 使用 CSS @supports

        ```css
        .hero {
            /* 默认值，用于不支持的浏览器 */
            padding: 4rem 1rem;
        }

        @supports (width: min(10px, 5vw)) {
          /* 用于支持的浏览器  */
          .hero {
            padding: clamp(2rem, 10vmax, 10rem) 1rem;
          }
        }
        ```

### before和after边框效果

1. 参考链接：

   [CSS八种让人眼前一亮的HOVER效果](https://juejin.im/post/6861501624993447950#heading-8)

2. 详解：

  ```html
  <div id="draw-border">
    <button>Hover me</button>
  </div>

  <style>
    #draw-border {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }

    button {
      border: 0;
      background: none;
      text-transform: uppercase;
      color: #4361ee;
      font-weight: bold;
      position: relative;
      outline: none;
      padding: 10px 20px;
      box-sizing: border-box;
    }

    button::before, button::after {
      box-sizing: inherit;
      position: absolute;
      content: '';
      border: 2px solid transparent;
      width: 0;
      height: 0;
    }

    button::after {
      bottom: 0;
      right: 0;
    }

    button::before {
      top: 0;
      left: 0;
    }

    button:hover::before, button:hover::after {
      width: 100%;
      height: 100%;
    }

    button:hover::before {
      border-top-color: #4361ee;
      border-right-color: #4361ee;
      transition: width 0.3s ease-out, height 0.3s ease-out 0.3s;
    }

    button:hover::after {
      border-bottom-color: #4361ee;
      border-left-color: #4361ee;
      transition: border-color 0s ease-out 0.6s, width 0.3s ease-out 0.6s, height 0.3s ease-out 1s;
    }
  </style>
  ```

### sass比css方便的地方

1. 参考链接：

   [sass](https://www.sass.hk/)

2. 详解：

  1. 嵌套

    ```scss
    .container{

      .box{

        &.active{

        }

        &:hover{

        }

        &::after{

        }
      }
    }
    ```

  2. 变量

    ```scss
    $imagePath: "/public/images/";//用于设置background，不用每次都写路径
    $step: 3;//用于计算一行中每一块的宽度
    $activeColor: #00A8FF;//定义公共active颜色
    $errorColor: #FF3B30;//定义公共error颜色
    ```

  3. 函数与继承

    ```scss
    @function pxToRem($px, $base: 375px) {
        $min: 1 / $base * 10 * 1;
        $result: $px / $base * 10 * 1;

        @if $result < 0.027 and $result > 0 {
            @return 2px;
        }

        @else {
            @return $px / $base * 10 * 1rem;
        }
    }

    @mixin bg($path,$name,$ext) {
        [data-dpr="1"] & {
            background-image: url($path+$name+"."+$ext);
        }

        [data-dpr="2"] & {
            background-image: url($path+$name+"@2x."+$ext);
        }

        [data-dpr="3"] & {
            background-image: url($path+$name+"@3x."+$ext);
        }
    }

    .box{
      height: pxToRem(60px);
      @include bg($imagePath,"hint_24","png");
    }
    ```

  4. 循环

    ```scss
    .icon{
        width: pxToRem(24px);
        height: pxToRem(24px);
        background-size: 100% 100%;
        background-position: center center;

        @for $i from 1 through $step{
            &.icon#{$i}{
                @include bg($imagePath,"step#{$i}_normal","png");
            }
        }
    }
    ```

  5. 计算

    ```scss
    $step: 3;
    .box{
      width: (100%/$step);
      height: percentage(211/(211+8+124));
    }
    ```

### 禁止选中文本

1. 参考链接

  [这五个有用的 CSS 属性完全被我忽视了](https://mp.weixin.qq.com/s/aYWI2ZV1Pg8NM4_4C2u83Q)

2. 详解

  ```css
  element {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10+ and Edge */
    user-select: none; /* Standard syntax */
  }
  ```

### 更改选中文本的背景颜色

1. 参考链接

  [这五个有用的 CSS 属性完全被我忽视了](https://mp.weixin.qq.com/s/aYWI2ZV1Pg8NM4_4C2u83Q)

2. 详解

  ```css
  ::selection {
    color: #ececec;
    background: #222831;
  }
  ```

### 在不使用br的情况下将文本换行

1. 参考链接

  [这五个有用的 CSS 属性完全被我忽视了](https://mp.weixin.qq.com/s/aYWI2ZV1Pg8NM4_4C2u83Q)

2. 详解

  ```css
  element {
    white-space: pre-wrap; /*pre-wrap*/
    white-space: pre-line; /*pre-line*/
  }
  ```

### 设置字与字之间的间距

1. 参考链接

  [这五个有用的 CSS 属性完全被我忽视了](https://mp.weixin.qq.com/s/aYWI2ZV1Pg8NM4_4C2u83Q)

2. 详解

  ```css
  element {
    word-spacing: 6px; /* word spacing wow such */
  }
  ```

### 媒体查询手机屏幕横屏竖屏

1. 参考链接

  [这五个有用的 CSS 属性完全被我忽视了](https://mp.weixin.qq.com/s/aYWI2ZV1Pg8NM4_4C2u83Q)

2. 详解

  ```css
  /*手机横屏时执行*/
  @media screen and (orientation:landscape){
      .txtle{
          color: red
      }
  }
  
  /*手机竖屏时执行*/
  @media screen and (orientation:portrait){
      #wrap{
          display:none;
      }
  }
  ```

### 硬件加速

1. 参考链接

  [【建议收藏】css晦涩难懂的点都在这啦](https://juejin.im/post/6888102016007176200)

2. 详解

  * 硬件加速

    将浏览器的渲染过程交给GPU(图形处理器Graphics Processing Unit)处理，创建了一个新的复合图层，而不是使用自带的比较慢的渲染器。

  * 浏览器什么时候会创建一个独立的复合图层呢？

    * 3D或者CSS transform
    * video和canvas标签
    * css filters(滤镜效果)
    * 元素覆盖时，比如使用了z-index属性

  * 为什么硬件加速会使页面流畅

    transform属性不会触发浏览器的repaint（重绘），而绝对定位absolute中的left和top则会一直触发repaint（重绘）。

  * 为什么transform没有触发repaint呢？

    transform动画由GPU控制，支持硬件加载，并不需要软件方面的渲染。并不是所有的CSS属性都能触发GPU的硬件加载，事实上只有少数的属性可以，比如transform、opacity、filter

  * 如何用CSS开启硬件加速

    CSS animation、transform以及transition不会自动开启GPU加速，而是由浏览器的缓慢的软件渲染引擎来执行

    当浏览器检测到页面中某个DOM元素应用了某些CSS规则时就会开启，最显著的特征的元素是3D变化。如translate3d(250px,250px,250px);rotate3d(250px,250px,250px,-120deg);scale3d(0.5,0.5,0.5);

### position:sticky

1. 参考链接

  [使用 position:sticky 实现粘性布局](https://www.cnblogs.com/coco1s/p/6402723.html)

  [CSS中position属性（sticky）](https://segmentfault.com/a/1190000018861422)

2. 详解

  * 兼容性

    Firefox47+,Chrome56+,Safari9.1+,IOS Safari8.4+

  * 描述

    * position:sticky不脱离文档流
    * 当元素在容器中被滚动超过指定的偏移值时，元素在容器内固定在指定位置。亦即如果你设置了top: 50px，那么在sticky元素到达距离相对定位的元素顶部50px的位置时固定，不再向上移动（相当于此时fixed定位）
    * 元素固定的相对偏移是相对于离它最近的具有滚动框的祖先元素，如果祖先元素都不可以滚动，那么是相对于viewport来计算元素的偏移量

  * 使用场景

    特效产品专题

  * 样例

    静态
    ```html
    <style>
      .container {
        background: #eee;
        width: 600px;
        height: 2000px;
        margin: 0 auto;
      }

      .sticky-box {
        position: sticky;
        height: 60px;
        margin-bottom: 30px;
        background: #ff7300;
        top: 10px;
      }

      div {
        font-size: 30px;
        text-align: center;
        color: #fff;
        line-height: 60px;
      }
    </style>
    <div class="container">
      <div class="sticky-box">内容1</div>
      <div class="sticky-box">内容2</div>
      <div class="sticky-box">内容3</div>
      <div class="sticky-box">内容4</div>
    </div>
    <div class="container" style="background: #000;">
      <div>hello</div>
    </div>
    ```

    带动效
    ```html
    <style>
      body,p{
        margin: 0;
        padding: 0;
      }
      #main{

      }

      .block{
        position: relative;
        width: 100%;
        height: 1920px;
      }

      .bg-pink{
        background-color: pink;
      }
      .bg-greed{
        background-color: green;
      }
      .bg-blue{
        background-color: blue;
      }
      .bg-yellow{
        background-color: yellow;
      }

      .container{
        width: 100%;
        min-height: 100vh;
        position: sticky;
        top: 0;
        overflow: hidden;
      }

      .word{
        margin: 100px 0 0 100px;
        color: bisque;
      }
    </style>
    <script>
      let oldY = window.scrollY;
      window.onscroll = function(){
        let distance = document.getElementById("distance");
        distance.innerHTML = window.scrollY + '    ' + distance.getBoundingClientRect().top;
        console.log(window.scrollY,distance.getBoundingClientRect().top)
        if(distance.getBoundingClientRect().top == 100 && window.scrollY != oldY){
          distance.style.transform = `translate3d(${oldY-1920}px,0px,${oldY-1920}px)`;
          oldY = window.scrollY;
        }
        else if(distance.getBoundingClientRect().top < 100 && window.scrollY != oldY){
          distance.style.transform = `translate3d(980px,0px,980px)`;
          oldY = window.scrollY;
        }
        else{
          distance.style.transform = `translate3d(0px,0px,0px)`;
          oldY = window.scrollY;
        }
      }
    </script>
    <div id="main">
      <div class="block bg-pink">
        
      </div>
      <div class="block bg-blue">
        <div class="container">
          <p id="distance" class="word">test</p>
        </div>
      </div>
      <div class="block bg-yellow">
        
      </div>
    </div>
    ```

### scroll-snap-type滚动轮播

1. 参考链接

  [不可思议，纯 css 都能图片滚动](https://juejin.im/post/6895584191073927175)

2. 详解

  不兼容IE、safari，慎用，样例代码见文末github

### 图片相关

1. 参考链接

  [前端优秀实践不完全指南](https://juejin.cn/post/6932647134944886797)

2. 详解

  