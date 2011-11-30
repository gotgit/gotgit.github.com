---
layout: post
title: "Gitolite 客户端发起安装模式被取消"
---

说明：正如 [Gitolite 官网所言][notes-install-from-client]，虽然从客户端发起安装很酷，也曾经是唯一的安装方式，
但是管理员维护两套不同公钥让技术支持不堪重负，最终在 Gitolite 2.1 版本取消了这种由客户端发起安装的安装方式，
这也让书中近三页纸（P415-P417）报废。本篇博客对 Gitolite 的安装过程做了更新，将在《Git权威指南》第二版中替换原有内容。

---

安装Gitolite（2.1版本）对服务器的要求是：

* Git版本为1.6.6或以上。
* Unix或类Unix（Linux, MacOS等）操作系统。
* 服务器开启SSH服务。

和其他Unix上软件包一样Gitolite既可通过操作系统本身提供的二进制发布包方式安装，也可通过克隆Gitolite源码库从源代码安装Gitolite。

注意：老版本的Gitolite提供了一种从客户端发起安装的模式，但该安装模式需要管理员维护两套不同公钥/私钥对（一个公钥用于无口令登录服务器以安装和更新软件，另外一个公钥用于克隆和推送 gitolite-admin 版本库），稍嫌复杂，在2.1之后的Gitolite取消了这种安装模式。

### 安装之前 ###

Gitolite搭建的Git服务器是以SSH公钥认证为基础的，无论是普通Git用户还是Gitolite的管理员都通过公钥认证访问Gitolite服务器。在Gitolite的安装过程中需要提供管理员公钥，以便在Gitolite安装完毕后管理员能够远程克隆 `gitolite-admin` 版本库（仅对管理员授权），对Gitolite服务器进行管理——添加新用户和为用户添加授权。

为此在安装Gitolite之前，管理员需要在客户端（用于远程管理Gitolite服务器的客户端）创建用于连接Gitolite服务器的SSH公钥（如果尚不存在的话），并把公钥文件拷贝到服务器上。

1. 在客户端创建SSH公钥/私钥对。

    如果管理员在客户端尚未创建公钥/私钥对，使用下面的命令会在用户主目录下创建名为 `~/.ssh/id_rsa` 的SSH私钥和名为 `~/.ssh/id_rsa.pub` 的公钥文件：


        $ ssh-keygen

2. 将公钥文件从客户端复制到服务器端，以便安装Gitolite时备用。

    可以使用 `ftp` 或U盘拷贝等方式从客户端向服务器端传送文件，不过用 `scp` 命令是非常方便的，例如服务器地址为 `server` ，相应的拷贝命令为：


        $ scp ~/.ssh/id_rsa.pub server:/tmp/admin.pub

### 以发布包形式安装 ###

常见的Linux发行版都包含了Gitolite软件包，安装Gitolite使用如下命令：

* Debian/Ubuntu：

      $ sudo aptitude install gitolite

* RedHat：

      $ sudo yum install gitolite

安装完毕后会自动创建一个专用系统账号如 `gitolite` 。在Debian平台上创建的 `gitolite` 账号使用 `/var/lib/gitolite` 作为用户主目录，而非 `/home/gitolite` 。

    $ getent passwd gitolite
    gitolite:x:114:121:git repository hosting,,,:/var/lib/gitolite:/bin/bash

安装完毕，运行如下命令完成对Gitolite的配置：

1. 切换至新创建的 `gitolite` 用户账号。

       $ sudo su - gitolite

2. 运行 `gl-setup` 命令，并以客户端复制过来的公钥文件路径作为参数。

       $ gl-setup /tmp/admin.pub

Debian等平台会在安装过程中（或运行 `sudo dpkg-reconfigure gitolite` 命令时），开启配置界面要求用户输入Gitolite专用账号、Git版本库根目录、管理员公钥文件名，然后自动执行 `gl-setup` 完成设置。

### 从源代码开始安装 ###

如果想在系统中部署多个Gitolite实例，希望部署最新的Gitolite版本，或者希望安装自己或他人对Gitolite的定制版本，就要采用从源代码进行Gitolite部署。

1. 创建专用系统账号。

   * 首先需要在服务器上创建Gitolite专用帐号。因为所有用户都要通过此帐号访问Git版本库，为方便易记一般选择更为简练的 `git` 作为专用帐号名称。

            $ sudo adduser --system --group --shell /bin/bash git

   * 注意添加的用户要能够远程登录，若系统只允许特定用户组（如 `ssh` 用户组）的用户才可以通过 SSH 协议登录，就需要将新建的 `git` 用户添加到该特定的用户组中。执行下面的命令可以将 `git` 用户添加到 `ssh` 用户组。

            $ sudo adduser git ssh

   * 取消 `git` 用户的口令，以便只能通过公钥对 `git` 账号进行认证，增加系统安全性。

            $ sudo passwd --delete git

2. 切换到专用账号。

   切换到新创建的专用账号，后续的安装都以该用户身份执行。

        $ sudo su - git

3. 在服务器端下载 Gitolite 源码。

   一个更加“Git”的方式就是克隆Gitolite的版本库。

   * 克隆官方的Gitolite版本库如下：

            $ git clone git://github.com/sitaramc/gitolite.git

   * 也可以克隆定制后的Gitolite版本库，如我在GitHub上基于Gitolite官方版本库建立的分支版本：

            $ git clone git://github.com/ossxp-com/gitolite.git

4. 安装Gitolite。

   * 若Gitolite安装到 `~/bin` 目录下（即没有安装到系统目录下），需要设置 `PATH` 环境变量以便安装过程中调用 `gl-setup` 时能够正常运行。

            $ export PATH=~/bin:$PATH

   * 运行源码目录中的 `src/gl-system-install` 执行安装。

            $ cd gitolite
            $ src/gl-system-install

   * 如果像上面那样不带参数的执行安装程序，会将Gitolite相关命令安装到 `~/bin` 目录中，相当于执行：

            $ src/gl-system-install $HOME/bin $HOME/share/gitolite/conf $HOME/share/gitolite/hooks

5. 运行 gl-setup 完成设置。

   安装完毕运行 `gl-setup` 命令，并以客户端复制过来的公钥文件路径作为参数。

        $ gl-setup /tmp/admin.pub

不带参数运行 `gl-setup` 命令会检查 Gitolite 维护的 Git 版本库是否正确设置了钩子脚本，以及正确设置了配置文件等。对于通过服务器端拷贝方式导入 Gitolite 中的 Git 版本库，只有经过此操作才能正确运行。

[notes-install-from-client]: https://github.com/sitaramc/gitolite/blob/2056c959177df094574c3928fb1ef51fe8e32757/doc/1-INSTALL.mkd#_appendix_a_the_from_client_method "Notes on obsolte install from client"
