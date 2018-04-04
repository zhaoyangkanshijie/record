# CentOS7 环境部署

## mysql安装：

用MariaDB代替

教程：http://blog.csdn.net/lipingping951462/article/details/51898191

导入数据库：http://blog.csdn.net/guochaoxxl/article/details/52784565

### Centos7 下mysql大小写敏感:

1. 编辑/etc/my.cnf文件,在[mysqld]节下 添加 lower_case_table_names=1 参数，并设置相应的值 (备注：为0时大小写敏感，为1时大小写不敏感，默认为0)。（必须是在[mysqld]节点下添加，否则没有效果）

2. 重启mariadb：
systemctl restart mariadb.service


### Jexus 大小写敏感解决：
1. cd /usr/jexus/ 
2. vim jws
3. 将#export MONO_IOMAP="all"前面的“#”去掉!
4. 重启Jexus服务: /usr/jexus/jws restart


## .net 环境搭建

教程：http://blog.csdn.net/u010098331/article/details/51647977

## 远程传文件夹
```shell
$ scp -r TPLINKmWebsite root@172.31.249.6:/var/www
```
命令含义：
* TPLINKmWebsite #起始路径文件
* root@172.31.249.6:/var/www #目的路径

## 防火墙设置
### 关闭防火墙
```shell
systemctl stop firewalld.service             #停止firewall
systemctl disable firewalld.service        #禁止firewall开机启动
```

### 开启端口
```shell
firewall-cmd --zone=public --add-port=80/tcp --permanent
```
 命令含义：
* --zone #作用域
* --add-port=80/tcp #添加端口，格式为：端口/通讯协议
* --permanent #永久生效，没有此参数重启后失效

### 重启防火墙
```shell
firewall-cmd --reload
```

## tomcat
```shell
systemctl start tomcat
systemctl restart tomcat
systemctl stop tomcat
/usr/share/tomcat
输入命令开启日志打印输出，命令# tail -f catalina.out
ctrl+c退出打印，返回命令行
```
## ps命令显示进程
```shell
ps -ef|grep tomcat
```

## nginx
* nginx提示地址或端口被占用解决
http://blog.csdn.net/mtm2012/article/details/42775647

* DNS重启失效的解决
https://www.cnblogs.com/lcword/p/5917468.html

* 各种报错，以下必须写到nginx.conf下，不能include
```txt
    upstream smb {
        server 192.168.153.132:8080;
    }

    upstream security {
        server 192.168.153.132:8081;
    }

    upstream service {
        server 192.168.153.132:8082;
    }

    upstream web {
        server 192.168.153.132:8083;
    }

    upstream webm {
        server 192.168.153.132:8084;
    }

    server {
        listen       8090;
        server_name  192.168.153.132:8090;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            proxy_pass   http://smb;
            index  index.html index.htm;
        }     
    }

    server {
        listen       8091;
        server_name  192.168.153.132:8091;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            proxy_pass   http://security;
            index  index.html index.htm;
        }     
    }

    server {
        listen       8092;
        server_name  192.168.153.132:8092;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            proxy_pass   http://service;
            index  index.html index.htm;
        }     
    }

    server {
        listen       8093;
        server_name  192.168.153.132:8093;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            proxy_pass   http://web;
            index  index.html index.htm;
        }     
    }

    server {
        listen       8094;
        server_name  192.168.153.132:8094;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            proxy_pass   http://webm;
            index  index.html index.htm;
        }     
    }
```

---
## 更多参考：
1. Linux常用操作：https://github.com/xpsilvester/Notes/tree/master/Linux
2. workbranch使用教程：https://jingyan.baidu.com/article/3f16e003c2da162591c103e4.html
3. windows-mysql安装教程：<br>
3.1 http://www.jb51.net/article/127626.htm<br>
3.2 http://blog.csdn.net/JLongSL/article/details/56484762
4. centos-mysql安装教程：<br>
4.1 http://blog.csdn.net/u011673111/article/details/50962862<br>
4.2 http://blog.csdn.net/zhu19774279/article/details/51602001
5. centos-workbranch安装教程：http://blog.csdn.net/zzpzheng/article/details/48575963
6. centos-asp.net环境搭建：http://blog.csdn.net/u010098331/article/details/51647977
7. centos-nginx安装：http://blog.csdn.net/u012402276/article/details/51985172
8. centos-php/apache安装：http://www.linuxidc.com/Linux/2014-12/111030.htm
9. mysql大小写设置不敏感：https://www.cnblogs.com/xinhuaxuan/p/6537879.html

## centos6 命令记录
* sudo /etc/init.d/mysqld restart #重启mysql
* sudo /etc/init.d/mysqld stop #停止mysql
* sudo /etc/init.d/mysqld start #启动mysql
* sudo /etc/init.d/httpd restart #重启Apche
* sudo /usr/jexus/jws start #启动Jexus
* sudo /usr/local/nginx-1.11.2/sbin/nginx #启动nginx
* sudo /usr/local/nginx-1.11.2/sbin/nginx -s reload #重启nginx
* sudo /usr/local/nginx-1.11.2/sbin/nginx -s stop #停止nginx
* service iptables restart #重启防火墙
