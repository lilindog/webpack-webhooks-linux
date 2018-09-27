## linux环境下的webpack webhooks服务器
---
*目前仅能运行于linux环境，使用gitee作为仓库，使用webpack打包工具*

---

### 配置
|config.json||
|-|-|
|port|服务运行端口 \<number\>|
|api|webhooks请求api \<string\> 例：“/webhooks” 首个字符必须为正斜杠|
|pass|webhooks请求时携带的密码 \<string\>|
|sourceDir|webpack项目所在目录 \<string\> 必须为绝对路径|

---
### 注意
！！！ webpack项目要事先克隆好，并解决git拉取需要密码的问题。本服仅提供拉取和webpack编译。