---
layout: post
title: "使用 git-svn 和 git-filter-branch 整理 SVN 版本库"
---

SVN 本身提供了如下版本库整理工具：

* svnadmin dump
* svndumpfilter include
* svndumpfilter exclude
* svnadmin load

其中 `svnadmin dump` 将整个版本库或部分提交导出为一个导出文件； `svndumpfilter`
基于配置项的路径（SVN 1.7的 svndumpfilter 还支持通配符路径）对导出文件进行过滤，
过滤结果保存为新的导出文件； `svnadmin load` 将导出文件导入到另外的版本库中，
导入过程有两个选择——维持路径不变，或导入到某个路径之下。

相对于Git提供的用于整理提交的 `git filter-branch` 命令，SVN的版本库整理工具能做的实在不多。
而且SVN的相关工具容错性太差，操作过程经常被中断，可谓步步惊心。

最近遇到的一个案例，需要将两个 SVN 版本库（bar 和 baz）的全部历史导入到另外一个 SVN 版本库（foo）中。
并要求版本库 bar 和 baz 的目录结构统一采用 foo 中规定的目录结构。面对要导入的近 20GB 数据（绝大部分是Word、Excel、PDF文档），
决定采用Git提供的工具集进行SVN版本库整理。整理过程和过程中开发的脚本记录如下。

## 将 bar 和 baz 版本库转换为本地Git库 ##

以 bar 为例，将两个版本库（bar 和 baz）转换为本地的 Git 版本库，以便使用强大的
`git filter-branch` 命令对提交逐一进行修改（如修改版本库中的文件路径）。

    $ git init git/bar
    $ cd git/bar
    $ git svn init --no-metadata file:///path/to/svn/bar
    $ git svn fetch

说明：

* SVN 版本库 bar 位于本机的路径 /path/to/svn/bar 下。
* 导出的 Git 版本库位于 git/bar 目录下。
* 因为版本库 bar 并未使用分支（未采用 trunk、branches、tags目录结构），因此执行 `git svn` 时并未使用 `-s` 等参数。

## 源版本库中文件名过长的问题 ##

Windows和Linux下文件名长度限制不同，前者255个Unicode字符，后者为255个字节。
在此次转换中就遇到 bar 版本库中存在若干文件名超长的文件，导致无法在 Linux 平台上检出。
为避免后续操作中出现错误，对其进行重命名。


首先创建一个脚本 `rename.sh`，该脚本将提供给 `git filter-branch` 命令对版本库中超长文件名进行重命名操作。

    #!/bin/sh
    
    git ls-files -s | \
    sed \
        -e "s#\(\t.*/file-name-is-too-long\).*\.pdf#\1-blahblah.pdf#"  \
    | GIT_INDEX_FILE=$GIT_INDEX_FILE.new git update-index --index-info && \
    mv "$GIT_INDEX_FILE.new" "$GIT_INDEX_FILE"

然后执行下面命令对版本库整理：

    $ cd git/bar
    $ git filter-branch --index-filter 'sh /path/to/rename.sh'
 
## 删除空白提交 ##

从SVN转换的Git版本库可能存在空白提交，例如一些仅修改了SVN属性的提交不被 `git-svn` 支持，转换成了空提交。
这些空提交会对后续操作造成干扰，执行如下命令删除空白提交：

    $ cd git/bar
    $ git  filter-branch -f --commit-filter '
      if [ "$(git rev-parse $GIT_COMMIT^^{tree} 2>/dev/null)" = "$(git rev-parse $GIT_COMMIT^{tree})" ];
      then
          skip_commit "$@";
      else
          git commit-tree "$@";
      fi' HEAD

## 向Git日志中添加MetaData ##

执行 `git log` 操作可以看到转换后的提交保持了原有SVN提交的用户名和提交时间，还记录了对应SVN的提交编号信息。
但是后续操作（`git svn dcommit`）会改变Git提交，破坏其中包含的原有SVN提交的提交者和提交时间，
因此需要用其他方法将这些信息记录下来，以便补救。

使用 `git filter-branch` 的 `--msg-filter` 过滤器逐一向提交插入原有SVN的提交者和提交时间的元信息。

    $ cd git/bar
    $ git filter-branch -f --msg-filter '
      cat &&
      echo "From: REPO-NAME, author: $GIT_AUTHOR_NAME, date: $GIT_AUTHOR_DATE"' HEAD


## 根据需要对版本库目录重新组织 ##

`git filter-branch` 至少有两个过滤器可以对提交中的目录和文件进行组织。一个是 `--tree-filter` ，
一个是 `--index-filter` 。前者的过滤器脚本写起来简单，但执行起来较后者慢至少一个数量级。

根据路径转换的需求，编写过滤器脚本，如脚本 `transform.sh` ：

    #!/bin/sh
    
    if test -z "$GIT_INDEX_FILE"; then
        GIT_INDEX_FILE=.git/index
    fi
    
    git ls-files -s | \
    sed \
        -e "s#\(\t\)#\1new-root/#"  \
        -e "s#\(\tnew-root\)\(/old-path-1/\)#\1/new-path-1/#" \
        -e "s#\(\tnew-root\)\(/old-path-2/\)#\1/new-path-2/#" \
        -e "s#\(\tnew-root\)\(/old-path-3/\)#\1/new-path-3/#" \
    | GIT_INDEX_FILE=$GIT_INDEX_FILE.new git update-index --index-info && \
    mv "$GIT_INDEX_FILE.new" "$GIT_INDEX_FILE"

然后执行如下命令对提交进行逐一过滤，将老的目录结构转换为新的目录结构：

    $ cd git/bar
    $ git filter-branch --index-filter 'sh /path/to/transform.sh'

## 用git-svn克隆目标版本库（foo） ##

执行如下命令将导入的目标版本库转换为本地的 Git 版本库，如下：

    $ git init git/foo
    $ cd git/foo
    $ git svn init --no-metadata file:///path/to/svn/foo
    $ git svn fetch

然后将 bar 整理好的分支变基到当前的 master 分支上：

    $ cd git/foo
    $ git fetch ../../git/bar
    $ git branch bar/master FETCH_HEAD
    $ git co bar/master
    $ git rebase -k --onto master --root

说明：

* 使用 -k 参数，执行效率更高，因为会直接调用 cherry-pick 进行变基，而不需要执行 `git format-patch` 命令将提交预先转换为补丁文件。

在执行过程中遇到冲突中断的情况，这时需要解决冲突后执行：

    $ git cherry-pick --continue

然后执行如下命令将不在SVN版本库中的Git提交提交到SVN版本库 foo 中。

    $ git svn dcommit --rmdir 

说明：

* 使用 `--rmdir` 命令是为了避免在 SVN 版本库中残留由于目录移动产生的空目录。
* 使用 `git svn dcommit` 在SVN版本库中创建的新提交，其提交者是当前登录用户，提交时间是当前时间。
  即新的SVN提交丢失了原有SVN提交的用户名和时间信息。马上利用之前在提交说明中添加的元信息进行补救。


## 修正提交时间和提交者 ##

编写如下脚本 `parse-git-log.rb`，读取Git日志对元信息进行处理。

    #!/usr/bin/ruby

    require 'date'

    def to_iso8601(date)
        if date =~ /^[0-9]{10}/
          DateTime.strptime(date, '%s').iso8601.gsub(/\+[0-9]*:[0-9]*$/, '.000000Z')
        else
          raise "Error: wrong date format: #{date}"
        end
    end

    def parse_git_log(io)
      svndict={}
      commit, author, date, log, rev = []
      io.each_line do |line|
        line.strip!
        if line =~ /^commit ([0-9a-f]{40})/
          commit = $1
          author, date, log, rev = []
        elsif line =~ /^From: .*, author: (.*), date: @([0-9]+)/
          author = $1
          date = $2
        elsif line =~ /git-svn-id: .+@([0-9]+) .*/
          rev = $1
          if author.nil? or author.empty?
            STDERR.puts "Warning: no author for commit: #{commit}"
            next
          elsif date.nil? or date.empty?
            STDERR.puts "Warning: no author for commit: #{commit}"
            next
          end
          svndict[rev] = {}
          svndict[rev][:author] = author
          svndict[rev][:date] = to_iso8601 date
        end
      end
      svndict
    end

    url = 'file:///path/to/svn/foo'
    svndict = {}

    if ARGV.size == 1
      if File.exist? ARGV[0]
        File.open(ARGV[0]) do |io|
          svndict = parse_git_log io
        end
      else
        STDERR.puts "Read git log from STDIN"
        url = ARGV[0]
        svndict = parse_git_log STDIN
      end
    else
      puts <<-EOF
      Usage:
          #{File.basename $0} git-log.txt
          #{File.basename $0} url-of-svn < git-log.txt
      EOF
      exit 0
    end

    svndict.keys.map{|x| x.to_i}.sort.reverse.each do |rev|
      author = svndict[rev.to_s][:author]
      date = svndict[rev.to_s][:date]
      puts "svn ps --revprop -r #{rev} svn:date   \"#{date}\" #{url}"
      puts "svn ps --revprop -r #{rev} svn:author \"#{author}\" #{url}"
    end

然后执行如下命令，读取Git日志，将Git提交中的元信息转换为修正 SVN 提交历史的命令脚本 `fix-svn-log.sh`。

    $ cd git/foo
    $ git log | ruby parse-git-log.rb file:///path/to/svn/foo > fix-svn-log.sh

然后执行如下命令修改 SVN 的属性，还原原有SVN的提交用户和提交实现信息：

    $ sh fix-svn-log.sh

因为此操作实际上执行 `svn ps --revprop` 命令，需要SVN版本库 foo 中创建一个可执行的 `pre-revprop-change` 钩子脚本。

至此版本库转换完毕。怎么样 `git filter-branch` 命令够强大吧。
