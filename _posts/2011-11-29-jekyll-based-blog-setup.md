---
layout: post
title: "用 Git 维护博客？酷！"
---

今天完成了博客平台的迁移，将原来用 WordPress 维护的 [公司博客](http://blog.ossxp.com/) 迁移到新的域名： <http://www.worldhello.net> 。

### 新博客平台的特点及优势

* 用 Markdown 标记语言撰写博客。相比 HTML，Markdown 标记语言可以写出“所见即所得”的源文件，编辑更加简单方便。

* 博客采用纯静态页面，提高了博客网站吞吐量。

  使用 [Jekyll](http://github.com/mojombo/jekyll) 将 Markdown 撰写的文档编译为博客。

* 用 Git 做版本控制，版本库位于 [GitHub](https://github.com/gotgit/gotgit.github.com) 上。

* 使用独立域名指向 GitHub 上的博客网站。

  如果查看一下新博客的独立域名，会发现其指向 GitHub。

        $ ping www.worldhello.net
        PING www.worldhello.net (207.97.227.245): 56 data bytes
        64 bytes from 207.97.227.245: icmp_seq=0 ttl=49 time=447.121 ms
        ...

        $ ping gotgit.github.com
        PING gotgit.github.com (207.97.227.245): 56 data bytes
        64 bytes from 207.97.227.245: icmp_seq=0 ttl=49 time=440.295 ms

* 通过 JavaScript 加载 [Disqus](http://disqus.com/) 的通用评论系统，使得静态页面组成的博客网站可以嵌入评论等动态内容。

### 博客数据的迁移

原博客站点（http://blog.ossxp.com/）共有历史博客 255 篇，通过原博客的 RSS Feed 导出并转换为静态页面导入到 Jekyll 架构下的新博客。


但博客作者信息没有导出，要着重说明的是：很多博客并非由我所写，而分别由：王胜、崔锐、雷巍巍、崔桂林等人贡献。历史评论无法迁移，如果以前的博客就采用 Disqus 的外部评论系统，就不会因迁移造成评论数据损失。

### Whodo 历史文档迁移

2002-2006 年陆续用 [DocBook](http://www.worldhello.net/doc/docbook_howto/)
及 [FreeMind](http://www.worldhello.net/doc/freemind/freemind.mm.htm) 撰写了一些技术文章，
并在 2006 年将这些历史文章重新整理，尝试建立一个名为 [WHODO](http://www.worldhello.net/doc/whodo_howto/)
的项目，以期像 [The Linux Documentation Project](http://tldp.org/) 一样建立一种易于维护的开放文档平台。

但技术的发展一日千里，一方面作为标记语言 DocBook 在易用性上被 Markdown、reStructuredText、AsciiDoc 等超越，
另一方面诸如 [维基百科](http://en.wikipedia.org) 等平台的成功，指明了知识共享的正确方向。

为了向下兼容，此次博客平台迁移，将 WHODO 项目及相关文档也迁移到新的平台。

* WHODO 项目的文档，见 <http://www.worldhello.net/doc/> 。
* WHODO 项目的版本库位于 [GitHub](https://github.com/gotgit/) 下以 doc 开头的版本库。

  - [doc 版本库](https://github.com/gotgit/doc) 保存了编译后的 HTML 文档。
  - 一个文档对应一个唯一的版本库，如 docbook_howto 文档对应于 [doc-docbook_howto 版本库](https://github.com/gotgit/doc-docbook_howto/) 。
  - 采用 Android repo 工具将各个零散版本库组织一起，见 [Manifests 版本库](https://github.com/gotgit/manifests/) 。

* Repo 工具的用法，以及编译 WHODO 文档的过程：

  - 下载 repo 脚本。

        $ curl -L -k https://github.com/ossxp-com/repo/raw/master/repo > ~/bin/repo
        $ chmod a+x ~/bin/repo

  - 创建工作区目录。

        $ mkdir whodo
        $ cd whodo

  - Repo 初始化及下载 manifests.git 库。

        $ repo init -u git://github.com/gotgit/manifests.git

  - 下载所有相关版本库并检出到工作区。

        $ repo sync
        $ ls -F
        doc/ src/

  - 编译网页。（编译所需工具太繁杂，尚未整理）

        $ repo start whodo
        $ make -C src

  - 更新后的 HTML 文件在 [doc 版本库](https://github.com/gotgit/doc) 中提交。

        $ cd doc
        $ git add -A
        $ git commit

  - 推送至 GitHub 服务器。

        $ repo config repo.pushurl ssh://git@github.com/github/
        $ repo push

### 书稿的入口和维护

[《Git权威指南》](http://www.worldhello.net/gotgit/) / [Git版本库](http://gotgit.github.com/gotgit/) 和
[《GotGitHub》](http://www.worldhello.net/gotgithub/) / [Git版本库](http://gotgit.github.com/gotgithub/) 
等书的资源或代码同样托管于 GitHub，网站 <http://www.worldhello.net> 作为这些书稿的网站入口，
并通过博客等方式对文稿的修订和更新进行维护。

感谢 GitHub，让以上的这一切成为可能。
