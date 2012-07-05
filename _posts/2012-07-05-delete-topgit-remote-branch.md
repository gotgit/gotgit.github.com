---
layout: post
title: "Topgit 本地和远程分支的删除同步以及 git fetch --prune 分析"
---

在 Google Group （需翻墙）上网友提了一个问题：“[Topgit 本地特性分支删除后，如何清理远程版本库中相应分支？](https://groups.google.com/forum/?fromgroups#!topic/gotgit/CSHRbi_JAcA)” 

这是一个非常好的问题，我也曾遇到，一直是以手工清除远程分支（及 Topgit 跟踪分支）的。

    $ git push origin :t/feature-branch
    $ git push origin :top-bases/t/feature-branch

好吧，为什么不“懒惰”一点，把清理远程版本库对应分支的工作写在 Topgit 代码中呢？于是写了一个补丁，
见： 

* <https://github.com/ossxp-com/topgit/blob/master/debian/patches/t/delete-remote-branch.diff>

同步删除远程版本库的 Topgit 特性分支和跟踪分支只完成了硬币的一面，另外一面是当远程版本库的 Topgit
特性分支和跟踪分支被他人删除后，如何本地获知？

直觉告诉我只要把 `tg-remote.sh` 代码中的 `git fetch` 命令换做 `git fetch --prune` 即可。
可是一试之下，大失所望，竟然将本地版本库所有 `refs/remotes/origin/top-bases/` 下的引用全部删除！
难道这是 `git fetch --prune` 的 Bug？

重新编译Git（去掉 -O2 增加 -ggdb 编译参数），以便用 `gdb` 调试。

    $ gdb --args git fetch --prune

最终从 `builtin/fetch.c` 的函数 `query_refspecs()` 返回值中看出端倪。

首先一个 Topgit 管理下的版本库，配置文件中会有如下的 fetch 配置：

    [remote "origin"]
        fetch = +refs/heads/*:refs/remotes/origin/*
        url = ...
        fetch = +refs/top-bases/*:refs/remotes/origin/top-bases/*

其中的两条 `fetch` 配置，将远程版本库的 `refs/heads/*` 和 `refs/top-bases/*` 两个名字空间的引用
都获取到本地 `refs/remotes/origin` 名字空间下。

为清理本地陈旧的远程分支，先要根据上面两条 `fetch` 配置指令，反查出在远程版本库中的引用名称（见
`remote.c` 的 `match_name_with_pattern()` 函数）。对于 `refs/remotes/origin/top-bases/t/feature` 名字
的引用，在反查时上面两条 `fetch` 都能够返回查询结果，分别为：

* `refs/heads/top-bases/t/feature` 和
* `refs/top-bases/t/feature`

两个查询结果，前一个错，后一个对。按照上面顺序出现的 `fetch` 指令，导致解析出来的引用名称为前一个（错误的），
显然无法在远程版本库的引用中找到，于是认为是过时的，于是将 `refs/remotes/origin/top-bases/t/feature` 删除。
一个最简单的解决方案是将上述两条 `fetch` 语句颠倒顺序，即可成功实现 `git fetch --prune` 。

Topgit 实现获取远程服务器特性分支时自动清理本地远程分支的补丁如下：

* <https://github.com/ossxp-com/topgit/blob/master/debian/patches/t/prune-stale-remote-branch.diff>
