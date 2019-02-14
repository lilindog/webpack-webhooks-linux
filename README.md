## linux环境下的webpack webhooks服务器

### 简介
在开发的同时，本地代码提交到远程，有可能需要实时自动更新（部署）到服务器；该服务就提供了自动拉取，自动编译的功能。

### 配置
|config.json||
|-|-|
|port|服务运行端口 \<number\>|
|api|webhooks请求api \<string\> 例：“/webhooks” 首个字符必须为正斜杠|
|pass|webhooks请求时携带的密码 \<string\>|
|sourceDir|webpack项目所在目录 \<string\> 必须为绝对路径|
|logPath|webhooks服务日志存放目录\<string\> 缺省为该服务目录。 绝对、相对路径都可以|

---
### 注意
*目前仅能运行于linux环境，使用gitee作为仓库，使用webpack打包工具*
！！！ webpack项目要事先克隆好，并解决git拉取需要密码的问题。本服仅提供拉取和webpack编译。
