---
layout: post
title: "Gitolite 通配符版本库自定义授权"
---

《Git权威指南》第一版，在介绍 Gitolite 通配符版本库的创建一节（即书 P429 页），关于创建者自定义授权的相关内容存在瑕疵，授权文件中缺乏对 `READERS` 和 `WRITERS` 的设置，在新的 Gitolite 中不能正常设置授权。本博客对相关内容进行更新。

---

### 每个人创建自己的版本库

授权文件如下：

    1  @administrators = jiangxin admin
    2
    3  repo    users/CREATOR/[a-zA-Z].*
    4          C   =  @all
    5          RW+ =  CREATOR
    6          RW  =  WRITERS
    7          R   =  READERS @administrators 

关于授权的说明：

* 第4条指令，设置用户可以在自己的名字空间（ `/usrs/<userid>/` ）下，自己创建版本库。例如下面就是用户 `dev1` 执行 `git push` 命令在Gitolite服务器上自己的名字空间下创建版本库。

        dev1$ git push git@server:users/dev1/repos1.git master

* 第5条指令，设置版本库创建者对版本库具有完全权限。
  
    即用户 `dev1` 拥有对其自建的 `users/dev1/repos1.git` 拥有最高权限。

* 第7条指令，让管理员组 `@administrators` 的用户对于 `users/` 下用户自建的版本库拥有读取权限。

那么第6、7条授权指令中出现的 `WRITERS` 和 `READERS` 是如何定义的呢？实际上这两个变量可以看做是两个用户组，不过这两个用户组不是在Gitolite授权文件中设置，而是由版本库创建者执行 `ssh` 命令创建的。

版本库 `users/dev1/repos1.git` 的创建者 `dev1` 可以通过 `ssh` 命令连接服务器，使用 `setperms` 命令为自己的版本库设置角色。命令 `setperms` 的唯一一个参数就是版本库名称。当执行命令时，会自动进入一个编辑界面，手动输入角色定义后，按下 `^D`（Ctrl+D）结束编辑。如下所示：

    dev1$ ssh git@server setperms users/dev1/repos1.git
    READERS dev2 dev3
    WRITERS jiangxin
    ^D

即在输入 setperms 命令后，进入一个编辑界面，输入 ^D（Ctrl+D）结束编辑。也可以将角色定义文件保存到文件中，用 `setperms` 加载。如下：

    dev1$ cat > perms << EOF
    READERS dev2 dev3
    WRITERS jiangxin
    EOF

    dev1$ ssh git@server setperms users/dev1/repos1.git < perms
    New perms are:
    READERS dev2 dev3
    WRITERS jiangxin

当版本库创建者 `dev1` 对版本库 `users/dev1/repos1.git` 进行了如上设置后，Gitolite在进行授权检查时会将 `setperms` 设置的角色定义应用到授权文件中。故此版本库 `users/dev1/repos1.git` 中又补充了新的授权：

* 用户 `dev2` 和 `dev3` 具有读取权限。

* 用户 `jiangxin` 具有读写权限。

版本库 `users/dev1/repos1.git` 的建立者 `dev1` 可以使用 `getperms` 查看自己版本库的角色设置。如下：

    dev1$ ssh git@server getperms users/dev1/repos1.git
    READERS dev2 dev3
    WRITERS jiangxin

如果在用户自定义授权中需要使用 `READERS` 和 `WRITERS` 之外的角色，管理员可以通过修改 `gitolite.rc` 文件中的变量 `$GL_WILDREPOS_PERM_CATS` 实现。该变量的默认设置如下：

    $GL_WILDREPOS_PERM_CATS = "READERS WRITERS";
