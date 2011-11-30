---
layout: post
title: "Gitolite 管理员自定义命令"
---

通配符版本库的删除操作在实际应用中也常常遇到，《Git权威指南》 P439 页的 ADC 相关内容需要扩展。更新如下：

---

管理员在服务器特定目录下保存一些可执行脚本，当执行类似下面的命令时，会自动调用相应的可执行脚本 `<command>` 。

    $ ssh git@server <command> <args>...

在 Gitolite 源码的 `contrib/adc` 目录下维护了一些有用的管理员自定义命令，可以直接拿来使用。

* 管理员为自定义命令创建目录。

        $ mkdir ~git/adc-bin

* 将 ADC 脚本拷贝到该目录中。

        $ cp /path/to/gitolite/src/contrib/adc/* ~git/adc-bin/

* 修改 `.gitolite.rc` 配置文件，设定 `$GL_ADC_PATH` 变量。

        $GL_ADC_PATH = "/home/git/adc-bin";

注意：ADC 脚本可能会带来安全性问题，管理员在开发新的 ADC 脚本要尤为小心，还要注意 ADC 脚本名称不要和 Gitolite 内置的命令重名，否则会覆盖 Gitolite 相应的内置命令，导致 Gitolite 无法正常运行。

常用的管理员自定义命令有：

* 解锁版本库。

  版本库的创建者可以为版本库加锁和解锁。只有处于解锁状态的版本库才可以被删除。解锁版本库命令：

        $ ssh git@server unlock name/of/repo.git

* 版本库加锁。

  版本库的创建者可以为版本库加锁和解锁。新创建的通配符版本库默认处于锁定状态，处于锁定状态的版本库不能被删除。加锁版本库命令：

        $ ssh git@server lock name/of/repo.git

* 删除版本库。

   执行下面的命令会永久删除版本库。

        $ ssh git@server rm name/of/repo.git

   我对 ADC 脚本进行了定制，会将版本库移动到指定的目录下而不是直接删除。参见 [相关补丁][t/adc_enhanced] 。

* 超级用户读取和设置他人创建的版本库授权。

  默认只有版本库创建者才能为自己创建的版本库授权以及读取权限。名为 `su-getperms` 和 `su-setperms` 的 ADC 脚本可以让 Gitolite 管理员读取和设置他人创建的版本库授权。如：

        $ ssh git@server su-getperms username name/of/repo.git


[t/adc_enhanced]: https://github.com/ossxp-com/gitolite/commit/b6f4f020095a07be4b445d549c07f294f900ee27
