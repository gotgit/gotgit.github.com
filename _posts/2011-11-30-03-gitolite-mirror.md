---
layout: post
title: "Gitolite 版本库镜像"
---

说明：Gitlite 2.1版本库对版本库镜像改动较大，几乎完全重写，导致《Git权威指南》P436-P437 两页内容过时。更新如下。

---

Git 版本库控制系统往往并不需要设计特别的容灾备份，因为每一个Git用户就是一个备份。但是下面的情况，就很有必要考虑容灾了。

* Git 版本库的使用者很少（每个库可能只有一个用户）。
* 版本库克隆只限制在办公区并且服务器也在办公区内（所有鸡蛋都在一个篮子里）。
* Git 版本库采用集中式的应用模型，需要建立双机热备（以便在故障出现时，实现快速的服务器切换）。

可以在两台或多台安装了Gitolite服务的服务器之间实现版本库的镜像。数据镜像的最小单位为版本库，对于任意一个Git版本库可以选择在其中一个服务器上建立主版本库（只能有一个主版本库），在其他服务器上建立的为镜像库。镜像库只接受来自主版本库的数据同步而不接受来自用户的推送。

### 启用钩子

将 Gitolite 部署目录下钩子 `post-receive.mirrorpush` 重命名为 `post-receive` ，并执行 `gl-setup` 命令为所有 Gitolite 控制下的版本库安装必须的钩子脚本。

### Gitolite服务器命名

首先要为每一台服务器架设Gitolite服务，并建议所有的服务器上Gitolite服务都架设在同一用户（如 `git` ）之下。如果Gitolite服务安装到不同的用户账号下，就必需通过文件 `~/.ssh/config` 建立SSH别名，以便能够使用正确的用户名连接服务器。

接下来为每个服务器设置一个名称，服务器之间数据镜像时就使用各自的名称进行连接。假设我们要配置的两个Gitolite服务器的其中一个名为 `server1` ，另一个名为 `server2` 。

打开 `server1` 上Gitolite的配置文件 `~/.gitolite.rc` ，进行如下设置：

    $GL_HOSTNAME = 'serer1';
    $GL_GITCONFIG_KEYS = "gitolite.mirror.*";

* 设置 `$GL_HOSTNAME` 为本服务器的别名，如 `serer1` 。
* 设量 `$GL_GITCONFIG_KEYS` 以便允许在Gitolite授权文件中为版本库动态设置配置变量。

    例如本例设置了 `GL_GITCONFIG_KEYS` 为 `gitolite.mirror.*` 后，允许在 `gitolite-admin` 管理库的 `conf/gitolite.conf` 中用 `config` 指令对版本库添加配置变量。

        repo testing
              config gitolite.mirror.master       =   "server1"
              config gitolite.mirror.slaves       =   "server2 server3"

同样对 `server2` 进行设置，只不过将 `$GL_HOSTNAME` 设置为 `serer2` 。

### 服务器之间的公钥认证

接下来每一个服务器为Gitolite的安装用户创建公钥/私钥对。

    $ sudo su - git
    $ ssh-keygen

然后把公钥拷贝到其他服务器上，并以本服务器名称命名。例如：

* `server1` 上创建的公钥复制到 `server2` 上，命名为 `server1.pub` 备用。
* `server2` 上创建的公钥复制到 `server1` 上，命名为 `server2.pub` 备用。

再运行 `gl-tool` 设置其他服务器到本服务器上的公钥认证。例如在 `server1` 上执行命令：

    $ gl-tool add-mirroring-peer server2.pub

当完成上述设置后，就可以从一个服务器发起到另外服务器的SSH连接，连接过程无需口令认证并显示相关信息。例如从 `server1` 发起到 `server2` 的连接如下：

    $ ssh git@server2 info
    Hello server1, I am server2


### 配置版本库镜像

做了前面的准备工作后，就可以开始启用版本库镜像了。下面通过一个示例介绍如何建立版本库镜像，将服务器 `server1` 上的版本库 `testing` 要镜像到服务器 `server2` 上。

首先要修改 `server1` 和 `server2` 的Gitolite管理库 `gitolite-admin` ，为 `testing` 版本库添加配置变量，如下：

    repo    testing
            config gitolite.mirror.master = "server1"
            config gitolite.mirror.slaves = "server2"

两个服务器 `server1` 和 `server2` 都要做出同样的修改，提交改动并推送到服务器上。当推送完成，两个服务器上的 `testing` 版本库的 `config` 就会被更新，包含类似如下的设置：

    [gitolite "mirror"]
            master = server1
            slaves = server2

当向服务器 `server1` 的 `testing` 版本库推送新的提交时，就会自动同步到 `server2` 上。

    $ git push git@server1:testing.git master
    [master c0b097a] test
    Counting objects: 1, done.
    Writing objects: 100% (1/1), 185 bytes, done.
    Total 1 (delta 0), reused 0 (delta 0)
    remote: (29781&) server1 ==== (testing) ===> server2
    To git@server1:testing.git
       d222699..c0b097a  master -> master


如果需要将服务器 `server1` 上所有版本库，包括 `gitolite-admin` 版本库都同步到 `server2` 上，不必对版本库逐一设置，可以采用下面的简便方法。

修改 `server1` 和 `server2` 的Gitolite管理版本库 `gitolite-admin` ，在配置文件 `conf/gitolite.conf` 最开始插入如下设置。

    repo   @all
        config gitolite.mirror.master = "server1"
        config gitolite.mirror.slaves = "server2"

然后分别提交并推送。要说明的是 `gitolite-admin` 版本库此时尚未建立同步，直到服务器 `server1` 的 `gitolite-admin` 版本库推送新的提交，才开始 `gitolite-admin` 版本库的同步。

也可以在 `server1` 服务器端执行命令开始同步。例如：

    $ gl-mirror-shell request-push gitolite-admin

Gitolite官方版本在版本库同步时有个局限，要求在镜像服务器上必需事先存在目标版本库并正确设置了 `gitolite.mirror.*` 参数，才能同步成功。例如允许用户自行创建的通配符版本库，必需在主服务器上和镜像服务器上分别创建，之后版本库同步才能正常执行。我在GitHub上的Gitolite分支项目提交了 [一个补丁][mirror-missing-repo] 解决了这个问题。

如果发现镜像没有正常工作，查看目录 `~git/.gitolite/logs` 下相关日志文件。 更多Gitolite版本库镜像的资料，参见 <http://sitaramc.github.com/gitolite/doc/mirroring.html> 。


[mirror-missing-repo]: https://github.com/ossxp-com/gitolite/commit/a29446403edda42fc67c18f2d5b3f53625412eec "Topgit branch: t/mirror-missing-repo"
