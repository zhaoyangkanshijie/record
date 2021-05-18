# nginx

* [命令操作](#命令操作)
* [配置文件详解](#配置文件详解)
* [模块分类](#模块分类)
* [负载均衡](#负载均衡)
* [反向代理](#反向代理)
* [配置邮箱](#配置邮箱)
* [配置https](#配置https)
* [目录信息分享](#目录信息分享)
* [限制访问速度](#限制访问速度)
* [记录access日志](#记录access日志)
* [配置缓存服务器](#配置缓存服务器)

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

## 配置文件详解

1. 参考链接：

    * [Nginx配置详解](https://www.cnblogs.com/knowledgesea/p/5175711.html)
    * [Nginx 配置文件nginx.conf中文详解](https://www.w3cschool.cn/nginx/nginx-d1aw28wa.html)

2. 详解：

    * 配置文件位置：~/conf/nginx.conf
    * 注释符：#
    * 文件内容
    ```conf
    ######Nginx配置文件nginx.conf中文详解#####

    #定义Nginx运行的用户和用户组
    user www www;

    #nginx进程数，建议设置为等于CPU总核心数。
    worker_processes 8;
    
    #全局错误日志定义类型，[ debug | info | notice | warn | error | crit ]
    error_log /usr/local/nginx/logs/error.log info;

    #进程pid文件
    pid /usr/local/nginx/logs/nginx.pid;

    #指定进程可以打开的最大描述符：数目
    #工作模式与连接数上限
    #这个指令是指当一个nginx进程打开的最多文件描述符数目，理论值应该是最多打开文件数（ulimit -n）与nginx进程数相除，但是nginx分配请求并不是那么均匀，所以最好与ulimit -n 的值保持一致。
    #现在在linux 2.6内核下开启文件打开数为65535，worker_rlimit_nofile就相应应该填写65535。
    #这是因为nginx调度时分配请求到进程并不是那么的均衡，所以假如填写10240，总并发量达到3-4万时就有进程可能超过10240了，这时会返回502错误。
    worker_rlimit_nofile 65535;


    events
    {
        #参考事件模型，use [ kqueue | rtsig | epoll | /dev/poll | select | poll ]; epoll模型
        #是Linux 2.6以上版本内核中的高性能网络I/O模型，linux建议epoll，如果跑在FreeBSD上面，就用kqueue模型。
        #补充说明：
        #与apache相类，nginx针对不同的操作系统，有不同的事件模型
        #A）标准事件模型
        #Select、poll属于标准事件模型，如果当前系统不存在更有效的方法，nginx会选择select或poll
        #B）高效事件模型
        #Kqueue：使用于FreeBSD 4.1+, OpenBSD 2.9+, NetBSD 2.0 和 MacOS X.使用双处理器的MacOS X系统使用kqueue可能会造成内核崩溃。
        #Epoll：使用于Linux内核2.6版本及以后的系统。
        #/dev/poll：使用于Solaris 7 11/99+，HP/UX 11.22+ (eventport)，IRIX 6.5.15+ 和 Tru64 UNIX 5.1A+。
        #Eventport：使用于Solaris 10。 为了防止出现内核崩溃的问题， 有必要安装安全补丁。
        use epoll;

        #单个进程最大连接数（最大连接数=连接数*进程数）
        #根据硬件调整，和前面工作进程配合起来用，尽量大，但是别把cpu跑到100%就行。每个进程允许的最多连接数，理论上每台nginx服务器的最大连接数为。
        worker_connections 65535;

        #keepalive超时时间。
        keepalive_timeout 60;

        #客户端请求头部的缓冲区大小。这个可以根据你的系统分页大小来设置，一般一个请求头的大小不会超过1k，不过由于一般系统分页都要大于1k，所以这里设置为分页大小。
        #分页大小可以用命令getconf PAGESIZE 取得。
        #[root@web001 ~]# getconf PAGESIZE
        #4096
        #但也有client_header_buffer_size超过4k的情况，但是client_header_buffer_size该值必须设置为“系统分页大小”的整倍数。
        client_header_buffer_size 4k;

        #这个将为打开文件指定缓存，默认是没有启用的，max指定缓存数量，建议和打开文件数一致，inactive是指经过多长时间文件没被请求后删除缓存。
        open_file_cache max=65535 inactive=60s;

        #这个是指多长时间检查一次缓存的有效信息。
        #语法:open_file_cache_valid time 默认值:open_file_cache_valid 60 使用字段:http, server, location 这个指令指定了何时需要检查open_file_cache中缓存项目的有效信息.
        open_file_cache_valid 80s;

        #open_file_cache指令中的inactive参数时间内文件的最少使用次数，如果超过这个数字，文件描述符一直是在缓存中打开的，如上例，如果有一个文件在inactive时间内一次没被使用，它将被移除。
        #语法:open_file_cache_min_uses number 默认值:open_file_cache_min_uses 1 使用字段:http, server, location  这个指令指定了在open_file_cache指令无效的参数中一定的时间范围内可以使用的最小文件数,如果使用更大的值,文件描述符在cache中总是打开状态.
        open_file_cache_min_uses 1;
        
        #语法:open_file_cache_errors on | off 默认值:open_file_cache_errors off 使用字段:http, server, location 这个指令指定是否在搜索一个文件时记录cache错误.
        open_file_cache_errors on;
    }
    
    #设定http服务器，利用它的反向代理功能提供负载均衡支持
    http
    {
        #文件扩展名与文件类型映射表
        include mime.types;

        #默认文件类型
        default_type application/octet-stream;

        #默认编码
        #charset utf-8;

        #服务器名字的hash表大小
        #保存服务器名字的hash表是由指令server_names_hash_max_size 和server_names_hash_bucket_size所控制的。参数hash bucket size总是等于hash表的大小，并且是一路处理器缓存大小的倍数。在减少了在内存中的存取次数后，使在处理器中加速查找hash表键值成为可能。如果hash bucket size等于一路处理器缓存的大小，那么在查找键的时候，最坏的情况下在内存中查找的次数为2。第一次是确定存储单元的地址，第二次是在存储单元中查找键 值。因此，如果Nginx给出需要增大hash max size 或 hash bucket size的提示，那么首要的是增大前一个参数的大小.
        server_names_hash_bucket_size 128;

        #客户端请求头部的缓冲区大小。这个可以根据你的系统分页大小来设置，一般一个请求的头部大小不会超过1k，不过由于一般系统分页都要大于1k，所以这里设置为分页大小。分页大小可以用命令getconf PAGESIZE取得。
        client_header_buffer_size 32k;

        #客户请求头缓冲大小。nginx默认会用client_header_buffer_size这个buffer来读取header值，如果header过大，它会使用large_client_header_buffers来读取。
        large_client_header_buffers 4 64k;

        #设定通过nginx上传文件的大小
        client_max_body_size 8m;

        #开启高效文件传输模式，sendfile指令指定nginx是否调用sendfile函数来输出文件，对于普通应用设为 on，如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络I/O处理速度，降低系统的负载。注意：如果图片显示不正常把这个改成off。
        #sendfile指令指定 nginx 是否调用sendfile 函数（zero copy 方式）来输出文件，对于普通应用，必须设为on。如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络IO处理速度，降低系统uptime。
        sendfile on;

        #开启目录列表访问，合适下载服务器，默认关闭。
        autoindex on;

        #此选项允许或禁止使用socket的TCP_CORK的选项，此选项仅在使用sendfile的时候使用
        tcp_nopush on;
        
        tcp_nodelay on;

        #长连接超时时间，单位是秒
        keepalive_timeout 120;

        #FastCGI相关参数是为了改善网站的性能：减少资源占用，提高访问速度。下面参数看字面意思都能理解。
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
        fastcgi_buffer_size 64k;
        fastcgi_buffers 4 64k;
        fastcgi_busy_buffers_size 128k;
        fastcgi_temp_file_write_size 128k;

        #gzip模块设置(压缩报文，节约带宽)
        gzip on; #开启gzip压缩输出
        gzip_min_length 1k;    #最小压缩文件大小
        gzip_buffers 4 16k;    #压缩缓冲区
        gzip_http_version 1.0;    #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
        gzip_comp_level 2;    #压缩等级
        gzip_types text/plain application/x-javascript text/css application/xml;    #压缩类型，默认就已经包含textml，所以下面就不用再写了，写上去也不会有问题，但是会有一个warn。
        gzip_vary on;

        #开启限制IP连接数的时候需要使用
        #limit_zone crawler $binary_remote_addr 10m;

        #负载均衡配置
        #link-----------见负载均衡-------------
        
        #虚拟主机的配置
        server
        {
            #监听端口
            listen 80;

            #域名可以有多个，用空格隔开
            server_name www.w3cschool.cn w3cschool.cn;
            index index.html index.htm index.php;
            root /data/www/w3cschool;

            #对******进行负载均衡
            location ~ .*.(php|php5)?$
            {
                fastcgi_pass 127.0.0.1:9000;
                fastcgi_index index.php;
                include fastcgi.conf;
            }
            
            #图片缓存时间设置
            location ~ .*.(gif|jpg|jpeg|png|bmp|swf)$
            {
                expires 10d;
            }
            
            #JS和CSS缓存时间设置
            location ~ .*.(js|css)?$
            {
                expires 1h;
            }
            
            #日志格式设定
            #$remote_addr与$http_x_forwarded_for用以记录客户端的ip地址；
            #$remote_user：用来记录客户端用户名称；
            #$time_local： 用来记录访问时间与时区；
            #$request： 用来记录请求的url与http协议；
            #$status： 用来记录请求状态；成功是200，
            #$body_bytes_sent ：记录发送给客户端文件主体内容大小；
            #$http_referer：用来记录从那个页面链接访问过来的；
            #$http_user_agent：记录客户浏览器的相关信息；
            #通常web服务器放在反向代理的后面，这样就不能获取到客户的IP地址了，通过$remote_add拿到的IP地址是反向代理服务器的iP地址。反向代理服务器在转发请求的http头信息中，可以增加x_forwarded_for信息，用以记录原有客户端的IP地址和原来客户端的请求的服务器地址。
            log_format access '$remote_addr - $remote_user [$time_local] "$request" '
            '$status $body_bytes_sent "$http_referer" '
            '"$http_user_agent" $http_x_forwarded_for';
            
            #定义本虚拟主机的访问日志
            access_log  /usr/local/nginx/logs/host.access.log  main;
            access_log  /usr/local/nginx/logs/host.access.404.log  log404;
            
            #link-----------location配置反向代理，见反向代理----------------
            
            
            #设定查看Nginx状态的地址
            location /NginxStatus {
                stub_status on;
                access_log on;
                auth_basic "NginxStatus";
                auth_basic_user_file confpasswd;
                #htpasswd文件的内容可以用apache提供的htpasswd工具来产生。
            }
            
            #本地动静分离反向代理配置
            #所有jsp的页面均交由tomcat或resin处理
            location ~ .(jsp|jspx|do)?$ {
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_pass http://127.0.0.1:8080;
            }
            
            #所有静态文件由nginx直接读取不经过tomcat或resin
            location ~ .*.(htm|html|gif|jpg|jpeg|png|bmp|swf|ioc|rar|zip|txt|flv|mid|doc|ppt|
            pdf|xls|mp3|wma)$
            {
                expires 15d; 
            }
            
            location ~ .*.(js|css)?$
            {
                expires 1h;
            }
        }
    }

    #link----------配置邮箱-------------

    #link----------配置ssl-------------

    ######Nginx配置文件nginx.conf中文详解#####
    ```

## 模块分类

1. 参考链接：

    * [Nginx 的模块化体系结构](https://www.w3cschool.cn/nginx/yg731pe9.html)

2. 详解：

    * event module: 搭建了独立于操作系统的事件处理机制的框架，及提供了各具体事件的处理。包括 ngx_events_module， ngx_event_core_module和ngx_epoll_module 等。

    * phase handler: 负责处理客户端请求并产生待响应内容，比如 ngx_http_static_module 模块，负责客户端的静态页面请求处理并将对应的磁盘文件准备为响应内容输出。

    * output filter: 负责对输出的内容进行处理，可以对输出进行修改。例如，可以实现对输出的所有 html 页面增加预定义的 footbar 一类的工作，或者对输出的图片的 URL 进行替换之类的工作。

    * upstream: 实现反向代理的功能，将真正的请求转发到后端服务器上，并从后端服务器上读取响应，发回客户端。upstream 模块是一种特殊的 handler，只不过响应内容不是真正由自己产生的，而是从后端服务器上读取的。

    * load-balancer: 负载均衡模块，实现特定的算法，在众多的后端服务器中，选择一个服务器出来作为某个请求的转发服务器。

## 负载均衡

1. 参考链接：

    * [Nginx 配置文件nginx.conf中文详解](https://www.w3cschool.cn/nginx/nginx-d1aw28wa.html)
    * [Nginx之负载均衡](https://www.cnblogs.com/jimisun/p/8254192.html)

2. 详解：

    * 完整配置
    ```conf
    #http下，server上
    upstream jh.w3cschool.cn {
        
        #upstream的负载均衡，weight是权重，可以根据机器配置定义权重。weigth参数表示权值，权值越高被分配到的几率越大。
        server 192.168.80.121:80 weight=3;
        server 192.168.80.122:80 weight=2;
        server 192.168.80.123:80 weight=3;

        #nginx的upstream目前支持4种方式的分配
        #1、轮询（默认）
        #每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除。
        #2、weight
        #指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况。
        #例如：
        #upstream bakend {
        #    server 192.168.0.14 weight=10;
        #    server 192.168.0.15 weight=10;
        #}
        #2、ip_hash
        #每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题。
        #例如：
        #upstream bakend {
        #    ip_hash;
        #    server 192.168.0.14:88;
        #    server 192.168.0.15:80;
        #}
        #3、fair（第三方）
        #按后端服务器的响应时间来分配请求，响应时间短的优先分配。
        #upstream backend {
        #    server server1;
        #    server server2;
        #    fair;
        #}
        #4、url_hash（第三方）
        #按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，后端服务器为缓存时比较有效。
        #例：在upstream中加入hash语句，server语句中不能写入weight等其他的参数，hash_method是使用的hash算法
        #upstream backend {
        #    server squid1:3128;
        #    server squid2:3128;
        #    hash $request_uri;
        #    hash_method crc32;
        #}

        #tips:
        #upstream bakend{#定义负载均衡设备的Ip及设备状态}{
        #    ip_hash;
        #    server 127.0.0.1:9090 down;
        #    server 127.0.0.1:8080 weight=2;
        #    server 127.0.0.1:6060;
        #    server 127.0.0.1:7070 backup;
        #}
        #在需要使用负载均衡的server中增加 proxy_pass http://bakend/;

        #每个设备的状态设置为:
        #1.down表示单前的server暂时不参与负载
        #2.weight为weight越大，负载的权重就越大。
        #3.max_fails：允许请求失败的次数默认为1.当超过最大次数时，返回proxy_next_upstream模块定义的错误
        #4.fail_timeout:max_fails次失败后，暂停的时间。
        #5.backup： 其它所有的非backup机器down或者忙的时候，请求backup机器。所以这台机器压力会最轻。

        #nginx支持同时设置多组的负载均衡，用来给不用的server来使用。
        #client_body_in_file_only设置为On 可以讲client post过来的数据记录到文件中用来做debug
        #client_body_temp_path设置记录文件的目录 可以设置最多3层目录
        #location对URL进行匹配.可以进行重定向或者进行新的代理 负载均衡
    }
    ```
    * 简易配置
    ```conf
    upstream backend  {
        server backend1.example.com weight=5;
        server backend2.example.com:8080;
        server unix:/tmp/backend3;
    }
    
    server {
        location / {
            proxy_pass  http://backend;
        }
    }
    ```

## 反向代理

1. 参考链接：

    * [Nginx 配置文件nginx.conf中文详解](https://www.w3cschool.cn/nginx/nginx-d1aw28wa.html)
    * [Nginx 反向代理配置--简单入门级](https://blog.csdn.net/scorpio_meng/article/details/86427425)

2. 详解：

    * 完整配置
    ```conf
    #对 "/" 启用反向代理
    location / {
        proxy_pass http://127.0.0.1:88;
        #将被代理服务器的响应头中的location字段进行修改后返回给客户端
        #如proxy_redirect http://192.168.1.154:8080/wuman/  http://www.boke.com/wuman/;
        proxy_redirect off;

        #重定义发往后端服务器的请求头
        #语法格式： 
        #proxy_set_header Field Value;
        #常见的设置如： 
        #proxy_set_header Host $proxy_host; 
        #proxy_set_header X-Real-IP $remote_addr; 
        #proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Real-IP $remote_addr;
        #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        #以下是一些反向代理的配置，可选。
        proxy_set_header Host $host;

        #允许客户端请求的最大单文件字节数
        client_max_body_size 10m;

        #缓冲区代理缓冲用户端请求的最大字节数，
        #如果把它设置为比较大的数值，例如256k，那么，无论使用firefox还是IE浏览器，来提交任意小于256k的图片，都很正常。如果注释该指令，使用默认的client_body_buffer_size设置，也就是操作系统页面大小的两倍，8k或者16k，问题就出现了。
        #无论使用firefox4.0还是IE8.0，提交一个比较大，200k左右的图片，都返回500 Internal Server Error错误
        client_body_buffer_size 128k;

        #表示使nginx阻止HTTP应答代码为400或者更高的应答。
        proxy_intercept_errors on;

        #后端服务器连接的超时时间_发起握手等候响应超时时间
        #nginx跟后端服务器连接超时时间(代理连接超时)
        proxy_connect_timeout 90;

        #后端服务器数据回传时间(代理发送超时)
        #后端服务器数据回传时间_就是在规定时间之内后端服务器必须传完所有的数据
        proxy_send_timeout 90;

        #连接成功后，后端服务器响应时间(代理接收超时)
        #连接成功后_等候后端服务器响应时间_其实已经进入后端的排队之中等候处理（也可以说是后端服务器处理请求的时间）
        proxy_read_timeout 90;

        #设置代理服务器（nginx）保存用户头信息的缓冲区大小
        #设置从被代理服务器读取的第一部分应答的缓冲区大小，通常情况下这部分应答中包含一个小的应答头，默认情况下这个值的大小为指令proxy_buffers中指定的一个缓冲区的大小，不过可以将其设置为更小
        proxy_buffer_size 4k;

        #proxy_buffers缓冲区，网页平均在32k以下的设置
        #设置用于读取应答（来自被代理服务器）的缓冲区数目和大小，默认情况也为分页大小，根据操作系统的不同可能是4k或者8k
        proxy_buffers 4 32k;

        #高负荷下缓冲大小（proxy_buffers*2）
        proxy_busy_buffers_size 64k;

        #设置在写入proxy_temp_path时数据的大小，预防一个工作进程在传递文件时阻塞太长
        #设定缓存文件夹大小，大于这个值，将从upstream服务器传
        proxy_temp_file_write_size 64k;
    }
    ```
    * 简易配置
    ```conf
    #dns需配置域名与ip对应关系 192.168.1.106 www.tomcat.com
    upstream tomcat_server{
        server 192.168.1.106:8080;
    }

    server{
        listen 80;
        server_name www.tomcat.com;

        location / {
            proxy_pass http://tomcat_server;#指定代理服务器
            proxy_set_header Host $http_host;#响应头信息返回服务器
        }
    }
    ```

## 配置邮箱

1. 参考链接：

    * [Nginx 的配置系统](https://www.w3cschool.cn/nginx/hwa71pe6.html)

2. 详解

    写在http后，与http同级，实现 email 相关的 SMTP/IMAP/POP3 代理时，共享的一些配置项
    ```conf
    mail {
        auth_http  127.0.0.1:80/auth.php;
        pop3_capabilities  "TOP"  "USER";
        imap_capabilities  "IMAP4rev1"  "UIDPLUS";

        server {
            listen     110;
            protocol   pop3;
            proxy      on;
        }
        server {
            listen      25;
            protocol    smtp;
            proxy       on;
            smtp_auth   login plain;
            xclient     off;
        }
    }
    ```

## 配置https

1. 参考链接：

    * [Nginx 的配置系统](https://www.w3cschool.cn/nginx/hwa71pe6.html)
    * [nginx配置https](https://jingyan.baidu.com/article/8275fc865886cd46a13cf674.html)
    * [windows下用nginx配置https服务器](https://www.cnblogs.com/luxiaoyao/p/10034009.html)
    * [linux下nginx配置SSL证书](https://blog.csdn.net/qq_39291929/article/details/79113717)

2. 详解

    * 配置
    ```conf
    upstream tomcat_server{
        server 192.168.1.106:8080;
    }

    server {
        listen       443 ssl;
        server_name  www.tomcat.com;

        ssl_certificate      cert.pem;
        ssl_certificate_key  cert.key;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;

        location / {
            proxy_pass         http://tomcat_server;
        }
    }
    ```

    * 生成证书

        1. 进入你想创建证书和私钥的目录cd /usr/local/nginx/ssl
        2. 创建服务器私钥，命令会让你输入一个口令openssl genrsa -des3 -out server.key 1024
        3. 创建签名请求的证书（CSR）openssl req -new -key server.key -out server.csr
        4. 设置信息
        5. 最后标记证书使用上述私钥和CSR：openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

## 目录信息分享

1. 参考链接：

    * [前端必备的Nginx知识](https://juejin.cn/post/6963437199811411975)

2. 详解

    使用autoindex可以将一个目录信息分享给用户，用户根据自己需求打开对应目录。

    开启了autoindex后，还是不会返回目录结构。可能是因为配置index指令，index指令优先级会大于autoindex指令。

    index：当访问/时会返回index指令的文件内容。index file，默认值是index.html，可以出现在http、server和location指令块中。

    autoindex：当url以/结尾时，尝试以html/xml/json等格式返回root/alias中指向目录的目录结构

## 限制访问速度

1. 参考链接：

    * [前端必备的Nginx知识](https://juejin.cn/post/6963437199811411975)

2. 详解

    因为公网带宽是有限的，当有许多用户同时访问时，他们是一个增强关系。这时可能需要用户访问一些大文件时限制访问速度，以确保能有足够的带宽使得其他用户能够访问一些例如css，js等基础文件。

    set $limit_rate 1k;

## 记录access日志

1. 参考链接：

    * [前端必备的Nginx知识](https://juejin.cn/post/6963437199811411975)

2. 详解

    log_format格式允许设置一个名字，这就可以对不同用途时记录不同格式的日志文件。

    ```txt
    log_format main '$remote_addr - $remote_user [$time_local] "$request" ' '$status $body_bytes_sent "$http_referer" ' '"$http_user_agent" "$http_x_forwarded_for" '
    ```

    * 内置变量：

        * $remote_addr:表示远端的ip地址，也就是浏览器的ip地址
        * $remote_user：表示用户名提供基本身份验证
        * $time_local：表示访问时间
        * $request：完整的原始请求行
        * $status：表示响应状态
        * $body_bytes_sent：发送给客户端的body字节数
        * $http_referer：表示从哪跳转过来
        * $http_user_agent：用户浏览器的类别，版本以及操作系统的一些信息
        * $http_x_forwarded_for：客户端请求头中的"X-Forwarded-For"

    access_log所在哪个server块中，就表示这类请求的日志都记录在access_log设置的地方

    ```txt
    server {
        ...
        access_log logs/access.log main;
    } 
    ```

## 配置缓存服务器

1. 参考链接：

    * [前端必备的Nginx知识](https://juejin.cn/post/6963437199811411975)

2. 详解

    当nginx作为反向代理时，通常只有动态请求也就是不同用户访问同一个url时看到的内容是不同的，这是才会交由上游服务处理。有些内容一段时间内不会发生变化的，为了减轻上游服务的处理压力，就会让nginx缓存上游服务的返回信息一段时间。在这段时间内，是不会向上游服务请求的。

    首先配置proxy_cache_pass指令，比如缓存文件写在哪、文件的命名方式、开多大的共享内存等控制缓存的属性

    ```txt
    proxy_cache_path /opt/niginx/nginxcache levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;
    ```

    使用的时候，只需配置proxy_cache指令即可

    ```txt
    server {
        ...
        location / {
            ...
            proxy_cache my_cache;
            proxy_cache_key $host$uri$is_args$args;
            proxy_cache_valid 200 304 302 1d;
            ...
        }
    }
    ```

    同一个url访问时，对不同的用户可能返回的内容是不同的。所以key的配置中需要包含用户的变量，$host$uri$is_args$args是一个比较简单的key，只跟host、uri和一些参数作为整体key。 vaild指定是针对哪些响应不返回。