# nginx

* [命令操作](#命令操作)
* [基本配置文件](#基本配置文件)
* [正反向代理](#正反向代理)
* [负载均衡](#负载均衡)

## 命令操作

1. 参考链接：

    * [Linux下nginx 的常用命令](https://www.cnblogs.com/sunxun/p/9339836.html)
    * [nginx 常用命令](https://segmentfault.com/a/1190000019204857)

2. 详解：

    * 查看进程号:ps -ef|grep nginx
    * 打开:路径+nginx(下同理) 如:sudo /usr/local/nginx-1.11.2/sbin/nginx
    * 重新加载配置|重启|停止|退出: nginx -s reload|reopen|stop|quit
    * 测试配置是否有语法错误: nginx -t
    * 更多：nginx [-?hvVtq] [-s signal] [-c filename] [-p prefix] [-g directives]
        * -?,-h : 打开帮助信息
        * -v : 显示版本信息并退出
        * -V : 显示版本和配置选项信息，然后退出
        * -t : 检测配置文件是否有语法错误，然后退出
        * -q : 在检测配置文件期间屏蔽非错误信息
        * -s signal : 给一个 nginx 主进程发送信号：stop（停止）, quit（退出）, reopen（重启）, reload（重新加载配置文件）
        * -p prefix : 设置前缀路径（默认是：/usr/local/Cellar/nginx/1.2.6/）
        * -c filename : 设置配置文件（默认是：/usr/local/etc/nginx/nginx.conf）
        * -g directives : 设置配置文件外的全局指令

## 基本配置文件

1. 参考链接：

    * [Nginx配置详解](https://www.cnblogs.com/knowledgesea/p/5175711.html)

2. 详解：

    * 配置文件位置：~/conf/nginx.conf
    * 注释符：#
    * 文件内容
    ```conf
    #全局块:配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等。
    ...

    #例如：
    #配置用户或者组，默认为nobody nobody。
    user administrator administrators;  

    #允许生成的进程数，默认为1
    worker_processes 2;

    #指定nginx进程运行文件存放地址
    pid /nginx/pid/nginx.pid;

    #制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
    error_log log/error.log debug;  

    #events块:配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。
    events {
        ...
        #例如：
        #设置网路连接序列化，防止惊群现象发生，默认为on
        accept_mutex on;

        #设置一个进程是否同时接受多个网络连接，默认为off
        multi_accept on;

        #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
        use epoll;

        #最大连接数，默认为512
        worker_connections 1024;
    }

    #http块:可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。
    http
    {
        #http全局块
        ...

        #例如：
        #文件扩展名与文件类型映射表
        include mime.types;

        #默认文件类型，默认为text/plain
        default_type  application/octet-stream;

        #取消服务日志
        access_log off;

        #自定义格式
        #$remote_addr与$http_x_forwarded_for:用以记录客户端的ip地址；
        #$remote_user:用来记录客户端用户名称；
        #$time_local:用来记录访问时间与时区；
        #$request:用来记录请求的url与http协议；
        #$status:用来记录请求状态；成功是200，
        #$body_bytes_s ent:记录发送给客户端文件主体内容大小；#$http_referer:用来记录从那个页面链接访问过来的；#$http_user_agent:记录客户端浏览器的相关信息；
        log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for';

        #combined为日志格式的默认值
        access_log log/access.log myFormat;

        #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
        sendfile on;

        #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
        sendfile_max_chunk 100k;

        #连接超时时间，默认为75s，可以在http，server，location块。
        keepalive_timeout 65;

        #upstream模块
        upstream mysvr {
            server 127.0.0.1:7878;
            server 192.168.10.121:3333 backup;  #热备份
        }

        #错误页
        error_page 404 https://www.baidu.com; 

        #server块:配置虚拟主机的相关参数，一个http中可以有多个server。
        server
        {
            #server全局块
            ...

            #例如：
            #单连接请求上限次数。
            keepalive_requests 120;

            #监听端口
            listen 4545;

            #监听地址
            server_name  127.0.0.1;

            #location块:配置请求的路由，以及各种页面的处理情况。
            location [PATTERN] #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。如:~*^.+$,如:/,如:/api
            {
                ...

                #例如：
                #根目录
                root /usr/wwwroot;

                #设置默认页
                index index.html index.htm;

                #添加头部
                add_header 'Access-Control-Allow-Origin' '*';

                #请求转向mysvr 定义的服务器列表
                proxy_pass  http://mysvr:7675/api;  

                #拒绝的ip
                deny 127.0.0.1;

                #允许的ip
                allow 172.18.5.54;
            }
            location [PATTERN] 
            {
                ...
                #例如：php配置
                root           html;
                fastcgi_pass   127.0.0.1:9000;
                fastcgi_index  index.php;
                fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
                nclude        fastcgi_params;
            }
        }
        server
        {
            ...
            #例如：https配置
            listen       443 ssl;
            server_name  localhost;

            ssl_certificate      cert.pem;
            ssl_certificate_key  cert.key;

            ssl_session_cache    shared:SSL:1m;
            ssl_session_timeout  5m;

            ssl_ciphers  HIGH:!aNULL:!MD5;
            ssl_prefer_server_ciphers  on;

            location / {
                root   html;
                index  index.html index.htm;
            }
        }
        ...     #http全局块
        #例如：配置错误页
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root   html;
        }
    }
    ```






























