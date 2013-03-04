---
layout: post
title: "墙不住的Git官网"
---

微博中关于《Git Community Book》（Git社区书）本地化的帖子，使我想起久未造访的 [Git官网](http://git-scm.com/) ，
却吃惊地发现Git官网已遭G\\F\\W认证。值此“两会”召开、古月三昷卸任之季，G\\F\\W居然再次做出如此这般非和谐之举，
不啻于继股市暴跌后又一记对“十年和谐”响亮的耳光。

《墙不住的Git官网》这篇文章送给那些仍在攒钱买房，尚无闲钱购置境外主机以搭建VPN、SSH，也不会使用 goagent 的码农。

[Git官网](http://git-scm.com/) 的维护者是 GitHub 的 Scott Chacon，他也是
[Git社区书](https://github.com/schacon/gitbook) 的主要维护者和 [《ProGit》](https://github.com/progit/progit/) 的作者。

新设计的Git官网不但重新设计了Git的Logo，还将《ProGit》这本书贡献到官网，取代Git社区书成为官网上的官方教程。
（毕竟一人维护两套书负担太重，而且不小心会被人误解为 Copy & Paste。）

Git官网的源代码托管在GitHub，已由 [旧版网站地址](https://github.com/schacon/git-scm) 更换到新的地址：

 * <https://github.com/github/gitscm-next/>

新网站基于 Rails 构建，默认使用 sqlite 本地数据库。其中 HTML 格式的 Git 手册、ProGit电子书的源代码并不在此版本库中，
而是要执行相应的 rake 任务，从Git版本库和 ProGit版本库中获取内容、编译并保存到 sqlite 数据库中。
下面介绍一下如何在本地搭建Git官网。

## 准备

* 克隆Git版本库（可选）

  Git官网中的Git手册直接从Git项目的本地版本库中编译，会对 Git v1.0 之后的每一正式发布版本的手册进行编译。
  
  如果本地已经克隆了Git版本库，可以跳过这一步。

  如果没有克隆Git版本库，先克隆一份Git版本库。

        $ cd Your/WorkSpace/
        $ git clone git://github.com/git/git

* 克隆Git官网版本库

        $ cd Your/WorkSpace/
        $ git clone git://github.com/github/gitscm-next

* 进入到克隆出的Git官网版本库

        $ cd gitscm-next

* 安装 Ruby 1.9.2 。

  （在 `gitscm-next` 目录下的 `.ruby-version` 这个文件指定了 ruby 的版本。）

        $ rvm install 1.9.2
        $ rvm use 1.9.2

* 下载并安装依赖的 Gem 包。

  （由文件 Gemfile 设定 gem 包依赖）

        $ bundle install

## Rails 应用配置

Git新官网是一个 Rails 应用。数据库的默认配置文件 `config/database.yml` 已指定使用 sqlite3 本地数据库。
执行如下命令即可创建该本地数据库。

* 初始化本地数据库。（执行数据迁移操作）。

        $ rake db:migrate

* 导入缺省数据

        $ rake db:fixtures:load

## 第一次启动应用

* 启动Web应用

        $ script/rails server
        ...
        => Rails 3.2.11 application starting in development on http://0.0.0.0:3000
        ...

* 文档页面 404

  从上面命令的输出可以看出启动的内置Web服务器运行在 3000 端口。打开 Web 浏览器，输入地址 <http://localhost:3000/> ，
  墙外的 Git官网在本地重现了。在网站中四处转转，会发现文档部分的链接（ [doc/](http://localhost:3000/doc/) ）催悲地404了。

  这是因为相关文档需要从其他版本库获取数据并编译。

* 退出Web应用

  在控制台按下 Ctrl+C 退出运行在 3000 端口的 Web 服务。

## 编译 Git 手册

阅读版本库根目录下的 ``README.md`` 文件（GitHub上项目的说明文件），可以看到编译文档的说明。

* 编译Git手册。

  如果你有耐心，可以执行下面的命令，将Git v1.0 之后的 240 多个正式发行版本的文档逐一编译（当然很多小版本并未更新文档），并保存到数据库中。

        $ GIT_REPO=/Your/WorkSpace/git/.git rake local_index

  你也可以只编译Git某一个版本的手册。如下：

        $ GIT_REPO=/Your/WorkSpace/git/.git REBUILD_DOC=v1.8.1 rake local_index

  （关于该 rake 命令的具体实现参见脚本： `lib/tasks/local_index.rake` ）

* 访问编译的Git手册。

  再次启动Web应用，文档页面仍然显示 404 错误。编译的Git手册文档藏到哪里了呢？从 Rails 的路由文件 `config/routes.rb` 文件可以猜出Git手册页面的URL地址为：

  +  <http://localhost:3000/docs/>
 
  按 Ctrl+C 退出Web应用。

## 编译 ProGit 和其他文档

执行下面命令可以编译出其余文档，包括《ProGit》电子书。

* 更新Git下载链接，执行如下命令：

        $ rake downloads

* 编译 ProGit 电子书。

  提供您的 GitHub 账号——将如下命令中的 your_github_username 和 your_github_password 用您的用户名及口令替换。
  执行 rake 命令，通过 GitHub API （调用 octokit 包）远程读取 progit 版本库源码，编译电子书。
  
        $ export API_USER=your_github_username
        $ export API_PASS=your_github_password
        $ rake remote_genbook

至此 Git官网在本地部署完毕，运行内置 Web server：

    $ script/rails server
    ...
    => Rails 3.2.11 application starting in development on http://0.0.0.0:3000
    ...

墙外的Git官网在本地重现： <http://localhost:3000/> 。


