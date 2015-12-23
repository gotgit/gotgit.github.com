---
layout: post
title: "做一个有品位的程序员"
---

——“能够写出漂亮代码的程序员就是有品味的程序员么？”

——“还不够。品味来自于每一个细节，有品位的程序员会把每一次提交做小、做对、做好，尽量做到整个开发的过程的无可挑剔，这样才够逼格，才可以称为有品位。”

熟练使用 Git，会让程序员更有品味。

## 提交做小

写小提交就是将问题解耦：“Do one thing and do it well”。开源项目的提交通常都很小，每个提交只修改一个到几个文件，每次只修改几行到几十行。
找一个你熟悉的开源项目，在仓库中执行下面的命令，可以很容易地统计出来每个提交的修改量。

    $ git log --no-merges --pretty="" --shortstat
    2 files changed, 25 insertions(+), 4 deletions(-)
    1 file changed, 4 insertions(+), 12 deletions(-)
    2 files changed, 30 insertions(+), 1 deletion(-)
    3 files changed, 15 insertions(+), 5 deletions(-)

而我看到的很多公司内外的项目则不是这样，动辄成百上千的文件修改，一次改动成千上万行源代码。试问这样的提交能拿来给人看么？

可是在开发过程中，程序员一旦进入状态，往往才思如泉涌，写出一个大提交。比如我又一次向 Git 贡献代码时，
提交还不算太大，就被 Git 的维护者 Junio 吐槽，要我拆分提交，便于评审：

    TODO

那么如何将提交拆分为若干个小提交呢？

### 拆分当前提交（松耦合）

先以拆分最新的提交为例，可以如下操作：

1. 将当前提交撤销，重置到上一次提交。撤销提交的改动保留在工作区中。

        $ git reset HEAD^

2. 通过补丁块拣选方式选择要提交的修改。Git 会逐一显示工作区更改，如果确认此处改动要提交，输入“y“。

        $ git add -p

3. 以撤销提交的提交说明为蓝本，撰写新的提交。

        $ git commit -e -C HEAD@{1}

4. 对于工作区其余的修改进行提交，完成一个提交拆分为两个的操作。

        $ git add -u
        $ git commit

### 拆分当前提交（紧耦合）

如果要拆分的提交，不同的实现逻辑耦合在一起，难以通过补丁块拣选（`git add -p`）的方式修改提交，怎么办？这时可以
直接编辑文件，删除要剥离出此次提交的修改，然后执行：

    $ git commit --amend

然后执行下面的命令，还原原有的文件修改，然后再提交。如下：

    $ git checkout HEAD@{1} -- .
    $ git commit

同样完成了一个提交拆分为两个提交的操作。

### 拆分历史某个提交

如果要拆分的是历史提交（如提交 54321），而非当前提交，则可以执行交互式变基（`git rebase -i`），如下：

    $ git rebase -i 54321^

Git 会自动将参与变基的提交写在一个动作文件中，还会自动打开编辑器（比如 vi 编辑器）。在编辑器中显示内容示例如下：

    pick 54321 要拆分的提交
    pick ...   其他参与变基的提交

将要拆分的提交 54321 前面的关键字 `pick` 修改为 `edit`，保存并退出。变基操作随即开始执行。

首先会在提交 54321 处停下来，这时要拆分的提交成为了当前提交，参照前面“拆分当前提交”的方法对提交 54321 进行拆分。拆分结束再执行
`git rebase --continue` 完成整个变基操作。

## 提交做对

“好的文章不是写出来的，而是改出来的。” 代码提交也是如此。

程序员写完代码，往往迫不及待地敲下：`git commit`，然后发现提交中少了一个文件，或者提交了多余的文件，或者发现提交中包含错误无法编译，或者提交说明中出现了错别字。

Git 提供了一个修改当前提交的快捷命令：`git commit --amend`，相信很多人都用过，不再赘述。

如果你发现错误出现在上一个提交或其他历史提交中怎么办呢？我有一个小窍门，在《Git权威指南》里我没有写到哦。

比如发现历史提交 `54321` 中包含错误，直接在当前工作区中针对这个错误进行修改，然后执行下面命令。

    git commit --fixup 54321

你会发现使用了 `--fixup` 参数的提交命令，不再询问你提交说明怎么写，而是直接把错误提交 `54321`
的提交说明的第一行拿来，在前面增加一个前缀“fixup!”，如下：

    fixup! 原提交说明

如果一次没有改对，还可以再接着改，甚至你还可以针对这个修正提交进行 fixup，产生如下格式的提交说明：

    fixup! fixup! 原提交说明

当开发工作完成后，待推送/评审的提交中出现大量的包含“fixup!”前缀的提交该如何处理呢？

如果你执行过一次下面的命令，即针对错误提交 54321 及其后面所有提交执行交互式变基（注意其中的 `--autosquash` 参数），你就会惊叹 Git 设计的是这么巧妙：

    $ git rebase -i --autosquash 54321^

交互式变基弹出的编辑器内自动对提交进行排序，将提交 54321 连同它的所有修正提交压缩为一个提交。

对于“提交做对”，很多开源项目还通过单元测试用例提供保障。对于这样的项目，在提交代码时往往要求提供相应的测试用例。
Git 项目本身就对测试用例有着很高的要求，其测试框架也非常有意思。我曾经针对Git的单元测试框架写过博客，参见：
[复用 git.git 测试框架](http://www.worldhello.net/2013/10/26/test-gistore-using-git-test-framework.html)。

## 提交做好

仅仅做到提交做小、提交做对，往往还不够，还要通过撰写详细的提交说明让评审者信服，这样才能够让提交尽快通过评审合入项目仓库中。

例如今年7月份在华为公司内部的 Git 服务器上发现一个异常，最终将问题定位到 Git 工具本身。整个代码改动只有区区一行：

* 提交：[receive-pack: crash when checking with non-exist HEAD](https://github.com/git/git/commit/b112b14d7869bf3c000abb84cd22e57dd811d031)

你能猜到提交说明写了多少么？写了20多行！

    receive-pack: crash when checking with non-exist HEAD
    
    If HEAD of a repository points to a conflict reference, such as:
    
    * There exist a reference named 'refs/heads/jx/feature1', but HEAD
      points to 'refs/heads/jx', or
    
    * There exist a reference named 'refs/heads/feature', but HEAD points
      to 'refs/heads/feature/bad'.
    
    When we push to delete a reference for this repo, such as:
    
            git push /path/to/bad-head-repo.git :some/good/reference
    
    The git-receive-pack process will crash.
    
    This is because if HEAD points to a conflict reference, the function
    `resolve_refdup("HEAD", ...)` does not return a valid reference name,
    but a null buffer.  Later matching the delete reference against the null
    buffer will cause git-receive-pack crash.
    
    Signed-off-by: Jiang Xin <worldhello.net@gmail.com>
    Signed-off-by: Junio C Hamano <gitster@pobox.com>

Git 对于提交说明的格式有着如下约定俗成的规定：

* 提交主题

  提交说明第一行是提交主题，是整个提交的概要性描述。可以在提交主题中添加所更改的模块名称作为前缀（如：receive-pack:）。
  提交主题（即提交说明的第一行）尽量保持在50字节以内（Gerrit 的commit_log检查插件似乎有着稍微宽泛一些的要求）。
  这是因为对于像 Linux、Git 这样的开源项目，是以邮件列表作为代码评审的平台，提交主题要作为邮件的标题，而邮件标题本身有长度上的限制。

* 提交主题后的空行

  必须要在提交说明的第一行和后续的提交说明中间留一个空行！如果没有这个空行，很多 Git 客户端会将连续几行的提交说明合在一起作为提交描述。这样显然太糟了。

* 提交说明主体

  提交主题之外的提交说明也有长度的限制，最好以72字节为限，超过则断行。因为 GitHub 在显示提交说明时支持 Markdown 语法，
  所以作为一个有品位的程序员学些 Markdown 的语法，让你的提交说明的可读性变得更强吧。
  
  我总结过一个 Markdown 和其他文本标记语言的语法说明，可供参考：
  
  - [轻量级标记语言语法参考](http://www.worldhello.net/gotgithub/appendix/markups.html)

* 签名区

  在提交说明最后是签名区。签名区可以看出这个提交的参与者、评审记录等等。

最后，让我们一起学习成为一名有品位的程序员吧。并依靠你对代码的品味，高质量严要求，守护你的项目吧。
