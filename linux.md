# Linux常用命令

* [文件属性](#文件属性)
* [文件目录管理](#文件目录管理)
* [文本编辑器](#文本编辑器)
* [包管理器](#包管理器)
* [网络管理](#网络管理)
* [进程管理](#进程管理)

## 文件属性

* 参考链接：[Linux 文件基本属性](https://www.w3cschool.cn/linux/linux-file-attr-permission.html)

* ls –l 
    
    显示一个文件的属性以及文件所属的用户和组

* chgrp [-R] 属组名文件名 

    更改文件属组，R为递归更改

* chown [–R] 属主名 文件名
* chown [-R] 属主名：属组名 文件名

    更改文件属主，也可以同时更改文件属组

* chmod [-R] xyz 文件或目录

    更改文件9个属性
    * xyz : 数字类型的权限属性，为 rwx 属性数值的相加。
    * -R : 递归，连同此目录下的所有文件都会变更

    * 文件类型：0-d-目录文件
    * 属主权限：1,2,3-r,w,x-读，写，执行
    * 属组权限：4,5,6-r,-,x-读，写，执行
    * 其它用户权限：7,8,9-r,-,x-读，写，执行

    权限分数对照
    * r:4
    * w:2
    * x:1

    例如：
    * owner = rwx = 4+2+1 = 7
    * group = rwx = 4+2+1 = 7
    * others= --- = 0+0+0 = 0

    命令例子：chmod 777 .bashrc

* chomd (u,g,o,a) (+,-,=) (r,w,x) 文件或目录

    符号类型改变文件权限
    * u:user
    * g:group
    * o:other
    * a:all
    * +:添加
    * -:去除
    * =:设定

    例如：
    * 设定文件权限：chmod u=rwx,g=rx,o=r 文件名
    * chmod a+w .bashrc

* find 位置 -name或-user 文件名正则

    例子：
    * find / -name file1 从 '/' 开始进入根文件系统搜索文件和目录 
    * find / -user user1 搜索属于用户 'user1' 的文件和目录 

* 压缩和解压

    1. tar
        解压：tar zxvf filename.tar
        压缩：tar czvf filename.tar dirname
    2. gz命令
        解压1：gunzip filename.gz
        解压2：gzip -d filename.gz
        压缩：gzip filename
    3. .tar.gz 和 .tgz
        解压：tar zxvf filename.tar.gz
        压缩：tar zcvf filename.tar.gz dirname
        压缩多个文件：tar zcvf filename.tar.gz dirname1 dirname2 dirname3.....
    4. bz2
        解压1：bzip2 -d filename.bz2
        解压2：bunzip2 filename.bz2
        压缩：bzip2 -z filename
    5. .tar.bz2
        解压：tar jxvf filename.tar.bz2
        压缩：tar jcvf filename.tar.bz2 dirname
    6. bz
        解压1：bzip2 -d filename.bz
        解压2：bunzip2 filename.bz
    7. .tar.bz
        解压：tar jxvf filename.tar.bz
    8. z命令
        解压：uncompress filename.z
        压缩：compress filename
    9. .tar.z
        解压：tar zxvf filename.tar.z
        压缩：tar zcvf filename.tar.z dirname
    10. zip
        解压：unzip filename.zip
        压缩：zip filename.zip dirname


## 文件目录管理

* 参考链接：[Linux 文件与目录管理](https://www.w3cschool.cn/linux/linux-file-content-manage.html)

* ls [-option]

    列出目录
    * -a ：全部的文件，连同隐藏档( 开头为 . 的文件) 一起列出来
    * -d ：仅列出目录本身，而不是列出目录内的文件数据
    * -l ：长数据串列出，包含文件的属性与权限等等数据；

    例如：
    * 将~目录下的所有文件列出来：ls -al ~

* ll

    列出该目录下的所有文件信息，包括隐藏的文件

* cd [相对路径或绝对路径]

    切换目录

* pwd [-P]

    显示目前所在的目录
    * -P  ：显示出确实的路径，而非使用连结 (link) 路径。

    注意：
    * pwd ：/var/mail 是连结档，连结到 /var/spool/mail
    * pwd -P ：正确的完整路径

* mkdir [-mp] 目录名称

    创建新目录
    * -m ：配置文件的权限（mkdir -m 711 test2）
    * -p ：将所需要的目录(包含上一级目录)递回创建（mkdir -p test1/test2/test3/test4 ）

* rmdir [-p] 目录名称

    删除空的目录
    * -p ：连同上一级空的目录也一起删除

* cp [-adfilprsu] 来源 目标

    复制文件或目录
    * -a ：相当于 -pdr
    * -d ：若来源档为连结档的属性(link file)，则复制连结档属性而非文件本身
    * -f ：force，若目标文件已经存在且无法开启，则移除后再尝试一次
    * -i ：若目标文件已经存在时，在覆盖时会先询问动作的进行
    * -l ：进行硬式连结(hard link)的连结档创建，而非复制文件本身
    * -p ：连同文件的属性一起复制过去，而非使用默认属性(备份常用)
    * -r ：递回持续复制，用於目录的复制行为
    * -s ：复制成为符号连结档 (symbolic link)，亦即捷径文件
    * -u ：若 目标 比 source 旧才升级 目标 

* rm [-fir] 文件或目录

    移除文件或目录
    * -f ：就是 force 的意思，忽略不存在的文件，不会出现警告信息；
    * -i ：互动模式，在删除前会询问使用者是否动作
    * -r ：递回删除

* mv [-fiu][option] 来源 目标

    移动文件与目录，或修改名称
    * -f ：force，如果目标文件已经存在，不会询问而直接覆盖
    * -i ：若目标文件已经存在时，就会询问是否覆盖
    * -u ：若目标文件已经存在，且 来源 比较新，才会更新
    * 更名：mv mvtest mvtest2

* cat [-AbEnTv] 文件

    由第一行开始显示文件内容
    * -A ：-vET 的整合选项，可列出一些特殊字符而不是空白；
    * -b ：列出行号，仅针对非空白行做行号显示，空白行不标行号！
    * -E ：将结尾的断行字节 $ 显示出来；
    * -n ：列印出行号，连同空白行也会有行号，与 -b 的选项不同；
    * -T ：将 [tab] 按键以 ^I 显示出来；
    * -v ：列出一些看不出来的特殊字符

* tac [-AbEnTv] 文件

    文件内容从最后一行开始显示

* nl [-bnw] 文件

    显示行号
    * -b ：指定行号指定的方式，主要有两种：
        * -b a ：表示不论是否为空行，也同样列出行号(类似 cat -n)
        * -b t ：如果有空行，空的那一行不要列出行号(默认值)
    * -n ：列出行号表示的方法，主要有三种：
        * -n ln ：行号在萤幕的最左方显示；
        * -n rn ：行号在自己栏位的最右方显示，且不加 0 ；
        * -n rz ：行号在自己栏位的最右方显示，且加 0 ；
    * -w ：行号栏位的占用的位数。

* more 文件

    一页一页翻动
    * 空白键 (space)：代表向下翻一页；
    * Enter：代表向下翻『一行』；
    * /字串：代表在这个显示的内容当中，向下搜寻『字串』这个关键字；
    * :f：立刻显示出档名以及目前显示的行数；
    * q：代表立刻离开 more ，不再显示该文件内容。
    * b 或 [ctrl]-b ：代表往回翻页，不过这动作只对文件有用，对管线无用。

    输出样例：
    ```md
    [root@www ~]# more /etc/man.config
    #
    # Generated automatically from man.conf.in by the
    # configure script.
    #
    # man.conf from man-1.6d
    ....(中间省略)....
    --More--(28%)  <== 重点在这一行,光标会在这里等待命令 
    ```

* less 文件

    一页一页翻动
    * 空白键：向下翻动一页；
    * [pagedown]：向下翻动一页
    * [pageup]：向上翻动一页
    * /字串：向下搜寻字串
    * ?字串：向上搜寻字串
    * n：重复前一个搜寻 (与 / 或 ? 有关)
    * N：反向的重复前一个搜寻 (与 / 或 ? 有关)
    * q：离开 less 这个程序

    输出样例：
    ```md
    [root@www ~]# more /etc/man.config
    #
    # Generated automatically from man.conf.in by the
    # configure script.
    #
    # man.conf from man-1.6d
    ....(中间省略)....
    :   <== 光标会在这里等待命令 
    ```

* head [-n number] 文件 

    取出文件前面几行(默认10行)
    * -n ：后面接数字，代表显示几行(head -n 20 /etc/man.config)

* tail [-n number] 文件 

    取出文件后面几行
    * -n ：后面接数字，代表显示几行
    * -f ：表示持续侦测后面所接的档名，要等到按下[ctrl]-c才会结束tail的侦测

* cat [-AbeEnstTuv] [--help] [--version] fileName

    把文档串连接后传到基本输出
    * -n 或 --number 由 1 开始对所有输出的行数编号
    * -b 或 --number-nonblank 和 -n 相似，只不过对于空白行不编号
    * -s 或 --squeeze-blank 当遇到有连续两行以上的空白行，就代换为一行的空白行
    * -v 或 --show-nonprinting

    例子：
    * 显示整个文件：cat filename
    * 创建一个文件：cat > filename
    * 把textfile1的内容加上行号后输入到textfile2里：cat -n textfile1 > textfile2
    * 把textfile1和textfile2的内容加上行号（空白行不加）之后将内容加到textfile3：cat -b textfile1 textfile2 >> textfile3



## 文本编辑器

* 参考链接：[Linux vi/vim](https://www.w3cschool.cn/linux/linux-vim.html)

* vi 文件

    进入vi命令模式，文件不存在则创建

    命令模式：
    * i 切换到输入模式，以输入字符
    * x 删除当前光标所在处的字符
    * : 切换到底线命令模式，以在最底一行输入命令
    * /word 光标之下寻找一个名称为 word 的字符串
    * ?word 光标之上寻找一个名称为 word 的字符串
    * dd 删除游标所在的那一整行

    输入模式：
    * 字符按键以及Shift组合，输入字符
    * ENTER，回车键，换行
    * BACK SPACE，退格键，删除光标前一个字符
    * DEL，删除键，删除光标后一个字符
    * 方向键，在文本中移动光标
    * HOME/END，移动光标到行首/行尾
    * Page Up/Page Down，上/下翻页
    * Insert，切换光标为输入/替换模式，光标将变成竖线/下划线
    * ESC，退出输入模式，切换到命令模式

    底线命令模式：
    * q 退出程序
    * w 保存文件

## 包管理器

* 参考链接：[linux yum 命令](https://www.w3cschool.cn/linux/linux-yum.html)

* yum常用命令

1. 列出所有可更新的软件清单命令：yum check-update
2. 更新所有软件命令：yum update
3. 仅安装指定的软件命令：yum install <package_name>
4. 仅更新指定的软件命令：yum update <package_name>
5. 列出所有可安裝的软件清单命令：yum list
6. 删除软件包命令：yum remove <package_name>
7. 查找软件包 命令：yum search <keyword>
8. 清除缓存命令:
    * yum clean packages: 清除缓存目录下的软件包
    * yum clean headers: 清除缓存目录下的 headers
    * yum clean oldheaders: 清除缓存目录下旧的 headers
    * yum clean, yum clean all (= yum clean packages; yum clean oldheaders) :清除缓存目录下的软件包及旧的headers






## 网络管理

* 参考链接：[Linux常用命令大全](https://blog.csdn.net/luansj/article/details/97272672)

* ifconfig

    显示以太网卡的配置 

* curl [option] [url]

    在命令行中利用URL进行数据或者文件传输
    * 发送GET请求来获取链接内容到标准输出：curl http://www.linux.com
    * 显示HTTP头，而不显示文件内容：curl -l http://www.linux.com
    * 同时显示HTTP头和文件内容：curl -i http://www.linux.com
    * 将返回结果保存到文件：curl -o save.txt http://www.linux.com
    * 同时下载多个文件:curl -o save.txt http://www.linux.com  -o save2.txt http://www.linux2.com

## 进程管理

* 参考链接：[ps -ef|grep详解](https://www.cnblogs.com/freinds/p/8074651.html)

* ps -ef | grep 关键字

    1. ps命令将某个进程显示出来，-e显示所有进程，-f显示UID,PPIP,C与STIME
    2. |是管道命令 是指ps命令与grep同时执行
    3. grep命令是查找

    样例：
    ```txt
    > ps -e|grep dae

    UID： 程序被该 UID 所拥有
    PID：就是这个程序的 ID
    PPID：则是其上级父程序的ID
    C：CPU 使用的资源百分比
    STIME：系统启动时间
    TTY： 登入者的终端机位置
    TIME： 使用掉的 CPU 时间
    CMD：下达的指令
    ```