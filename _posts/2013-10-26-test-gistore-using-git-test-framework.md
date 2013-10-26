---
layout: post
title: "复用 git.git 测试框架"
---

Git 项目（git.git）有着别具一格的测试框架，使用 shell 脚本开发测试用例，
写起测试用例来一点都感觉不到拖泥带水，就和在 shell 环境中手工测试一样。
最近在重构 Gistore 项目时复用了这一 Git 项目特有的测试框架，对 Gistore
进行测试。愿这一测试框架可以被更多的项目借鉴。

## git.git 的测试框架 ##

Git 项目主要采用了 C 语言，同时还包含了 Perl、Shell 等多种开发语言的项目。
Git 项目的测试并没有采用常见的类似 JUnit 测试框架，而是采用自创的测试框架，
由 Junio Hamano 在 2005 年用 shell 脚本封装而成。在这个框架下，
写测试用例和测试套件自然也是使用 shell 脚本语言，写起测试用例来就和手工在
shell 环境下针对命令行测试没什么两样，写测试用例的过程很是“享受”。还一个原因可能是
shell 脚本语言几乎融入了每一个 \*nix 开发者的血液中。总之这个测试框架用起来非常顺手。

在 Git 项目的 `t/` 目录下存在成百上千个以 "`t<四位数字>-<测试套件名称>.sh`"
格式命名的文件。每一个 Shell 脚本文件即是一个测试套件，其中包含多个测试用例。

若打开这些 shell 脚本，会注意到每一个测试套件（`t<四位数字>-<套件名>.sh`）都包含相似的结构。

    # 引入测试套件函数库
    . ./test-lib.sh

    # 定义和执行一个测试用例
    test_expect_success '<测试用例名称>' '
            <测试断言1> &&
            <测试断言2> &&
            ...
            <测试断言n>
    '

    # 此处省略更多的测试用例
    test_expect_success ...

    ...

    # 声明测试套件结束，并对测试执行过程为测试套件生成的临时目录进行清理
    test_done

这些 shell 脚本（测试套件）都可以单独运行。例如下面示例中执行的测试套件就是我为
git-clean--interactive （交互式 git clean）写的测试套件。

    $ sh t7301-clean-interactive.sh
    ok 1 - setup
    ok 2 - git clean -i (c: clean hotkey)
    ok 3 - git clean -i (cl: clean prefix)
    ok 4 - git clean -i (quit)
    ok 5 - git clean -i (Ctrl+D)
    ok 6 - git clean -id (filter all)
    ok 7 - git clean -id (filter patterns)
    ok 8 - git clean -id (filter patterns 2)
    ok 9 - git clean -id (select - all)
    ok 10 - git clean -id (select - none)
    ok 11 - git clean -id (select - number)
    ok 12 - git clean -id (select - number 2)
    ok 13 - git clean -id (select - number 3)
    ok 14 - git clean -id (select - filenames)
    ok 15 - git clean -id (select - range)
    ok 16 - git clean -id (select - range 2)
    ok 17 - git clean -id (inverse select)
    ok 18 - git clean -id (ask)
    ok 19 - git clean -id (ask - Ctrl+D)
    ok 20 - git clean -id with prefix and path (filter)
    ok 21 - git clean -id with prefix and path (select by name)
    ok 22 - git clean -id with prefix and path (ask)
    # passed all 22 test(s)
    1..22

运行测试套件的输出结果（显示到标准输出的内容）是经过特别设计的。成功运行的测试用例显示为：

    ok <数字> - <测试用例名>

而运行失败的测试用例会显示为：

    not ok <数字> - <测试用例名>

在测试套件运行的结尾会显示如下统计信息：

    <数字>..<数字>

这种特定的输出格式被称为 TAP (Test Anything Protocol)，参见 <http://testanything.org/> 。

Junio 还用 shell 脚本封装了一个测试夹具（test harness），在 `t/` 目录下，直接执行 `make`
命令即可执行全部的测试套件，并对测试结果进行统计。此外还有其他的测试夹具可供使用，
例如名为 `prove` 的命令可以多进程并发地执行测试套件，让测试过程更高效。

    $ prove --timer --jobs 15 ./t[0-9]*.sh
    [19:17:33] ./t0005-signals.sh ................................... ok       36 ms
    [19:17:33] ./t0022-crlf-rename.sh ............................... ok       69 ms
    [19:17:33] ./t0024-crlf-archive.sh .............................. ok      154 ms
    [19:17:33] ./t0004-unwritable.sh ................................ ok      289 ms
    [19:17:33] ./t0002-gitfile.sh ................................... ok      480 ms
    ===(     102;0  25/?  6/?  5/?  16/?  1/?  4/?  2/?  1/?  3/?  1... )===


## 测试 Gistore ##

[Gistore](https://github.com/jiangxin/gistore/) 是我在2010年写的一个工具，
以 Git 作为后端存储实现对磁盘文件的备份，并作为独立的一章写到了《Git权威指南》
一书中。 

    Gistore = Git + Store

最近用 Ruby 语言重写了 Gistore。这是因为 Gistore 最初的设计依赖 mount 命令，
需要将备份目录挂载到临时工作区，故只能用于有限的平台上，且可能需要 root 用户权限。
考虑到 Git 的 gitignore 语法增加了对双星号（**）通配符的支持，是不是用
gitignore 机制实现 Gistore 更好呢？改用 Ruby 实现是因为最近几年 Ruby 用得多，
而且使用 Thor （一个实现命令行编程框架的 Ruby 包，被很多著名软件如 bundle、rails
等使用）可以更容易实现工具的命令行扩展。

软件重构的质量需要测试用例来保证。Ruby 虽然内置了强大的测试框架，但像 Gistore
这类大量调用外部命令的应用，采用 Git 项目的测试框架可能更理想。于是在我 Gistore
项目中重用了 Git 项目的测试框架。

使用该测试框架的注意事项如下：


### 用 && 组合多个测试断言 ###

下面的测试用例中，因为在第二句断言（false）后面丢掉了一个 && ，
导致前两个断言未对测试用例施加影响。

    #!/bin/sh
    #

    . ./test-lib.sh

    test_expect_success 'test framework assertion' '
            true &&
            false
            true
    '

    test_done

### 用 test_cmp 断言测试输出 ###

该测试框架中最常用到的断言除了 shell 本身包含的 `test` 命令外，就是 `test_cmp` 断言。
实际上 `test_cmp` 就是对 `diff` 命令的简单封装。具体的使用过程是先将预期结果写入文件
`expect` ，测试输出写入 `actual` 文件，再用 `test_cmp` 比较 `expect` 和 `actual` 文件，
内容一致则成功，否则失败。例如下面的测试用例代码：

    cat >expect << EOF
    root/doc/COPYRIGHT
    root/src/README.txt
    root/src/images/test-binary-1.png
    root/src/images/test-binary-2.png
    root/src/lib/a/foo.c
    root/src/lib/b/bar.o
    root/src/lib/b/baz.a
    EOF
    
    test_expect_success 'initialize for commit' '
            prepare_work_tree &&
            gistore init --repo repo.git &&
            gistore add --repo repo.git root/src &&
            gistore add --repo repo.git root/doc &&
            gistore commit --repo repo.git &&
            test "$(count_git_commits repo.git)" = "1" &&
            gistore repo repo.git ls-tree --name-only \
                    -r HEAD | sed -e "s#^${cwd#/}/##g" > actual &&
            test_cmp expect actual
    '

### 用 test_must_fail 断言命令失败或异常 ###

该测试框架中有两个看起来很像的方法 `test_expect_failure` 和 `test_must_fail`，
前一个函数类似于 `test_expect_success`，以命令参数的方式引入一个测试用例并进行测试。
后一个是用于测试用例中的测试断言。

函数 `test_expect_failure` 通过命令行参数引入的测试用例，无论执行成功与否，
测试都不会中断。测试用例执行失败会显示：

    not ok 1 - test framework assertion # TODO known breakage
    # still have 1 known breakage(s)

测试成功会显示：

    ok 1 - test framework assertion # TODO known breakage vanished
    # 1 known breakage(s) vanished; please update test(s)

函数 `test_must_fail` 作为测试断言，用于确认一个命令会以失败结束（返回非0值）。
例如下面测试用例用于测试对所有注册的备份任务执行备份时（即执行 `gistore commit-all`
命令时），如果有一个或多个 Gistore 备份任务的指向丢失时，其它备份任务的备份不会受到影响，
并且 `gistore commit-all` 命令运行结束后要返回非零值。

    test_expect_success 'commit-all while missing task repo' '
            gistore task add hello repo1.git &&
            gistore task add world repo2.git &&
            test "$(count_git_commits repo1.git)" = "4" &&
            test "$(count_git_commits repo2.git)" = "3" &&
            do_hack &&
            gistore commit-all &&
            test "$(count_git_commits repo1.git)" = "5" &&
            test "$(count_git_commits repo2.git)" = "4" &&
            mv repo1.git repo1.git.moved &&
            do_hack &&
            test_must_fail gistore commit-all &&
            test "$(count_git_commits repo2.git)" = "5" &&
            mv repo1.git.moved repo1.git &&
            mv repo2.git repo2.git.moved &&
            test_must_fail gistore commit-all &&
            test "$(count_git_commits repo1.git)" = "6"
    '

### 测试用例设置依赖条件按需运行 ###

因为 Git 1.8.2 之后才为 gitignore 引入双星号（\*\*）通配符，而之前版本的 Git 并不支持，
这会导致某些测试用例结果不一致。 

Git项目的测试框架在设计之初就考虑到了这种情况，可以通过设置依赖条件在某些情况下关闭特定测试用例的运行。

首先在测试框架中根据执行环境的不同，预置特定的依赖条件，例如下面的代码使得当 Git 命令的版本是
1.8.2 或更新的版本时，预置 `GIT_CAP_WILDMATCH` 依赖条件。

    if test $(gistore check-git-version 1.8.2) -ge 0; then
    	test_set_prereq GIT_CAP_WILDMATCH
    fi

然后在定义测试用例的 `test_expect_success` 的第一个参数中写入相应的依赖条件。
例如如下的测试用例只在 Git 1.8.2 以上环境下运行。


    # Before git v1.7.4,  filenames in git-status are NOT quoted.
    # So strip double quote before compare with this.
    cat >expect << EOF
     M root/doc/COPYRIGHT
     M root/src/README.txt
     D root/src/images/test-binary-1.png
     D root/src/lib/b/baz.a
    ?? root/src/lib/a/foo.h
    EOF
    
    test_expect_success GIT_CAP_WILDMATCH 'status --git (1)' '
    	gistore commit --repo repo.git && \
    	echo "hack" >> root/doc/COPYRIGHT && \
    	echo "hack" >> root/src/README.txt && \
    	touch root/src/lib/a/foo.h && \
    	rm root/src/images/test-binary-1.png && \
    	rm root/src/lib/b/baz.a && \
    	gistore status --repo repo.git --git -s \
    		| sed -e "s#${cwd#/}/##g" | sed -e "s/\"//g" > actual &&
    	test_cmp expect actual
    '

### 进行函数级测试 ###

Git项目的测试框架主要是进行集成测试，如果需要进行函数级测试，还需要下点功夫。
即需要对函数进行简单的命令行封装，用命令行调用的方式对函数进行测试。

在 Git 项目中就用代码 "`test-path-utils.c`" 对路径处理相关函数进行封装，在测试用例 `t0060`
中调用 `test-path-utils` 进行相关测试。

    . ./test-lib.sh
    
    relative_path() {
            expected=$(test-path-utils print_path "$3")
            test_expect_success $4 "relative path: $1 $2 => $3" \
            "test \"\$(test-path-utils relative_path '$1' '$2')\" = '$expected'"
    }
    
    relative_path /foo/a/b/c/       /foo/a/b/       c/
    relative_path /foo/a/b/c/       /foo/a/b        c/
    relative_path /foo/a//b//c/     ///foo/a/b//    c/              POSIX
    relative_path /foo/a/b          /foo/a/b        ./
    relative_path /foo/a/b/         /foo/a/b        ./
    relative_path /foo/a            /foo/a/b        ../
    relative_path /                 /foo/a/b/       ../../../


在 Gistore 项目中，我也用到了类似的方法。通过隐含子命令 `check-git-version`
对 `Gistore.git_version_compare` 方法进行封装，并在测试用例 `t0020` 中进行针对性测试。

    test_expect_success 'compare two versions' '
            test $(gistore check-git-version 1.8.5 1.8.5) -eq 0 &&
            test $(gistore check-git-version 1.8.4 1.8.4.1) -eq -1 &&
            test $(gistore check-git-version 1.7.5 1.7.11) -eq -1 &&
            test $(gistore check-git-version 1.7.11 1.7.5) -eq 1 &&
            test $(gistore check-git-version 1.7.11 1.7.5) -eq 1 &&
            test $(gistore check-git-version 1.7.11 2.0) -eq -1 &&
            test $(gistore check-git-version 2.0 1.8.5) -eq 1
    '

更多测试用例的写法，参见如下链接：

* [Git 项目中的测试用例的说明文件](https://github.com/git/git/blob/master/t/README)
* [Git 项目中的测试用例](https://github.com/git/git/tree/master/t)
* [Gistore 项目中的测试用例](https://github.com/jiangxin/gistore/tree/master/t)

插播小广告：

* [学习Git，读《Git权威指南》](http://www.worldhello.net/gotgit/bookstore.html)
* [Gistore: 以Git为后端的备份解决方案](https://github.com/jiangxin/gistore)
