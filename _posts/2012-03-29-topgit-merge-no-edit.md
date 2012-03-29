---
layout: post
title: "New hack for topgit: git-merge--no-edit"
---

Git 1.7.10 对 ``git merge`` 提供了一个改进，而这个改进可能会带来兼容性问题，
会导致某些依赖 ``git merge`` 自动完成的工具受到影响。而 Topgit 就中招了。

Junio 的 [一篇博客][blogspot] 专门对这个问题做了描述。简单的说就是Git 1.7.10 起，
执行 ``git merge`` 时，成功的合并不会使用默认的（没有意义的）提交说明自动提交，
而是会打开一个编辑器等待用户输入提交说明。


这个改动会使得调用 ``git merge`` 的工具在执行时被打断。Topgit 的 ``tg update``
等命令即受此影响。

这个 [GitHub上的提交][commit] 即用于解决此问题：

    From: Jiang Xin <worldhello.net@gmail.com>
    Subject: [PATCH] No stop to edit for the new merge behavior of git
    
    In Git 1.7.10, Merge will stop and wait for a merge commit log. This
    backward-incompatible improvement that will break topgit. To fix it,
    just export GIT_MERGE_AUTOEDIT=no.
    
    See: http://git-blame.blogspot.jp/2012/02/anticipating-git-1710.html
    
    Signed-off-by: Jiang Xin <worldhello.net@gmail.com>
    
    ---
     tg.sh |    2 ++
     1 个文件被修改，插入 2 行(+)
    
    diff --git a/tg.sh b/tg.sh
    index 9082d88..b7661c2 100644
    --- a/tg.sh
    +++ b/tg.sh
    @@ -430,6 +430,8 @@ get_temp()
     ## Initial setup
     
     set -e
    +# suppress the merge log editor feature since git 1.7.10
    +export GIT_MERGE_AUTOEDIT=no
     git_dir="$(git rev-parse --git-dir)"
     root_dir="$(git rev-parse --show-cdup)"; root_dir="${root_dir:-.}"
     # Make sure root_dir doesn't end with a trailing slash.
    -- 
    tg: (d279e29..) t/git-merge-no-edit (depends on: tgmaster)



 [blogspot]: http://git-blame.blogspot.jp/2012/02/anticipating-git-1710.html
 [commit]: https://github.com/ossxp-com/topgit/commit/0c0fa52bf82f4ad22a4927b9ab5c400595ad9602
