---
layout: post
title: "完成博客迁移"
---

用 Git 维护博客？酷！

今天完成了博客平台的迁移，将原来用 WordPress 维护的 [公司博客](http://blog.ossxp.com/) 迁移到新的域名： <http://www.worldhello.net> 。新的博客不使用任何常规的博客系统，而是用 MarkDown 等标记语言撰写纯文本格式的博客，用工具 [Jekyll](http://github.com/mojombo/jekyll) 编译，用 Git 做版本控制，版本库位于 [GitHub](https://github.com/gotgit/gotgit.github.com) 上。

如果查看一下新博客的服务器IP，会发现博客就架设在 GitHub 上。

    $ ping www.worldhello.net
    PING www.worldhello.net (207.97.227.245): 56 data bytes
    64 bytes from 207.97.227.245: icmp_seq=0 ttl=49 time=447.121 ms
    ...

    $ ping gotgit.github.com
    PING gotgit.github.com (207.97.227.245): 56 data bytes
    64 bytes from 207.97.227.245: icmp_seq=0 ttl=49 time=440.295 ms

已将大约255篇历史博客自动迁移过来，但博客作者信息没有导出，要说明的是很多博客并非由我所写，而分别由：王胜、崔锐、雷巍巍、崔桂林等人贡献。
还有历史评论无法迁移，新的博客评论使用 [Disqus](disqus.com) 的通用评论系统，可以长久保持。 WorldHello.net 上的历史文章将随后导入。

新的 WorldHello.net 网站将主要作为 《Git权威指南》 和 《GotGitHub》 等书的网站入口，并以博客形式维护相关技术资料。
