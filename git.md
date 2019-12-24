# git 基本命令

## git初始化和配置

* 初始化

    git init

* 配置

    1. git config user.name "名字"
    2. git config user.email "邮箱"

* 查看

    1. git config user.name
    2. git config user.email

## 忽略规则

* 创建.gitignore文件

* .gitignore编写

    * 空行或是以#开头的行即注释行将被忽略；
    * 以斜杠 “/” 结尾表示目录；
    * 以星号 “*” 通配多个字符；
    * 以问号 “?” 通配单个字符
    * 以方括号 “[]” 包含单个字符的匹配列表；
    * 以叹号 “!” 表示不忽略(跟踪)匹配到的文件或目录；
    * 可以在前面添加斜杠 “/” 来避免递归,下面的例子中可以很明白的看出来与下一条的区别。

* 示例：[如何编写gitignore文件](https://www.cnblogs.com/jingtyu/p/6831772.html)

    ```txt
    # 忽略 .a 文件
    *.a

    # 但否定忽略 lib.a, 尽管已经在前面忽略了 .a 文件
    !lib.a

    # 仅在当前目录下忽略 TODO 文件， 但不包括子目录下的 subdir/TODO
    /TODO

    # 忽略 build/ 文件夹下的所有文件
    build/

    # 忽略 doc/notes.txt, 不包括 doc/server/arch.txt
    doc/*.txt

    # 忽略所有的 .pdf 文件 在 doc/ directory 下的
    doc/**/*.pdf
    ```

## git添加和提交文件

* 查看状态

    git status

* 分区

    包含：工作区，缓存区，版本库

    1. 工作区文件（目录）添加到缓存区

        git add 文件目录/文件名（.表示所有文件）

    2. 缓存区提交到版本库

        git commit -m "操作信息"

## 日志

* 查看所有提交记录

    git log

    键盘h查看帮助，q退出

* 最近一次提交

    git log -1

* 所有记录每一次记录显示在一行

    1. git log --oneline
    2. git log --oneline --graph

## 差异比较和版本检测

master:是一个分支，指向当前分支的最新提交;

head:指向当前分支

* 比较工作区和缓存区的差异

    git diff

* 比较缓存区和版本库的差异

    git diff -cached

* 比较工作区和版本库的差异

    git diff head

* 从缓存区中取出文件

    git checkout

* 将版本库的文件取出到工作区和缓存区

    git checkout head

## 分支

提交后，git会默认为我们创建一个分支master，master指向当前的提交,head指向当前分支

* 创建分支

    git branch 分支名

* 切换到分支

    git checkout 分支名

* 创建并切换到分支

    git checkout -b 分支名

* 查看分支

    git branch

* 查看分支图

    git log --graph --decorate --oneline --simplify-by-decoration --all

* 合并另一个分支到当前分支

    git merge 另一个分支名

* 删除分支

     git branch -d 分支名

## 解决冲突

* 封存(把当前未提交的修改暂存起来，让仓库还原到最后一次提交的状态)

    1. git stash
    2. git stash save "说明信息"

* 查看封存的内容

    git stash list

    每一条stash用stash@{n}标识

* 封存恢复

    git stash apply

* 清空封存的内容

    git stash clear

* 更多：

    1. [git stash的基本使用方法](https://jingyan.baidu.com/article/49ad8bceacac6b5834d8fa9a.html)
    2. [git 冲突解决](https://www.cnblogs.com/jiangxiaobo/p/9856697.html)

## 撤销操作

通过git log查看commitID

* 从缓存区中撤销到上一个版本

    1. git reset HEAD .
    2. git reset HEAD a.txt

* 回滚到上一个版本

    git revert HEAD

    回滚后需重新推送git push origin master，同时也留下一条提交记录

* 回滚到某一操作

    git revert commitID

* 具体场景和操作

    [Git撤销&回滚操作(git reset 和 get revert)](https://blog.csdn.net/asoar/article/details/84111841)

## 标签

打标签（tag）标记一个版本号

* 创建标签

    git tag -a "指定标签名" -m "指定说明文字"

* 给指定的commit打标签

    git tag -a "指定标签名" commitID

* 删除标签

    git tag -d 标签名

* 删除远程标签

    git push origin --delete tag <tagname>

* 本地标签推送到远程

    1. 推送指定标签 git push origin v1.0.0
    2. 一次性推送全部尚未推送到远程的本地标签 git push origin --tags

* 重命名tag

    1. 删除原有tag，重新添加

        git tag -d <old-tag>  

        git tag -a <new-tag> -m"information" 

    2. 强制替换，再删除原有

        git tag -f <new-tag> <old-tag>

        git tag -d <old-tag>

* 获取指定tag代码

    1. 切换到指定标签，提示你当前处于一个“detached HEAD" 状态，因为 tag 相当于是一个快照，是不能更改它的代码的

        git checkout v1.0.0

    2. 如果要在 tag 代码的基础上做修改，你需要一个分支

        git checkout -b branch_name tag_name

    3. 切回到之前的HEAD指向（以master为例）

        git checkout master

## 推送分支

* 将本地仓库与远程库关联

    git remote add origin git@xxx

* 查看远程库详细信息

    git remote -v

* 推送该分支到远程仓库对应的分支(如master)

    git push origin master