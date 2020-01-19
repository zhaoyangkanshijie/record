
var url = require("url"),
fs = require("fs"),
http=require("http");
http.createServer(function (req, res) {
  var pathName = url.parse(req.url).pathname.replace(/\//, '')
  console.log(pathName);
  if(pathName.indexOf('v1')>-1){
    res.setHeader("Content-Type","text/html;charset='utf-8'");
    fs.readFile("./index1.html","utf-8",function(err,data){
      if(err) {
        console.log("index1.html loading is failed :"+err);
      }
      else{
          res.end(data);
      }
    });
  }
  else if(pathName.indexOf('v2')>-1){
    res.setHeader("Content-Type","text/html;charset='utf-8'");
    fs.readFile("./index2.html","utf-8",function(err,data){
      if(err) {
        console.log("index2.html loading is failed :"+err);
      }
      else{
          res.end(data);
      }
    });
  }
  else if(pathName.indexOf('checkMVVM')>-1){
    //假装查询到应该返回哪个版本的页面
    if(new Date().getTime() % 2 == 0){
        res.writeHead(302,{
            'Location': 'http://localhost:5000/v3'
        });
        res.end();
    }
    else{
        res.writeHead(302,{
            'Location': 'http://localhost:5000/v4'
        });
        res.end();
    }
  }
  else if(pathName.indexOf('checkMVC')>-1){
      //假装查询到应该返回哪个版本的页面
      if(new Date().getTime() % 2 == 0){
          res.writeHead(302,{
              'Location': 'http://localhost:4000/v1'
          });
          res.end();
      }
      else{
          res.writeHead(302,{
              'Location': 'http://localhost:4000/v2'
          });
          res.end();
      }
  }
  else{
    res.write('404');
    res.end();
  }
}).listen(3000);