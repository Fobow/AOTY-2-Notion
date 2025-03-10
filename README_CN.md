# 一键个人音乐库

![Example Usage](./pics/demo.gif)

## 使用

1. 打开[aoty](https://www.albumoftheyear.org/)
2. 点击专辑封面，进入专辑详情页
3. 点击页面右上角的“添加到Notion”按钮，即可将专辑信息添加到你的Notion个人音乐库中
4. 在自己的Notion数据库中，可以记录自己对专辑的评价、感想等。Notion的数据库有很多额外功能，可以实现轻松管理自己的收听记录。

## 安装

### 准备工作

1. Notion 账号和 Notion API。确保你知道以下几个变量：
   * 数据库id。获取数据库id的一种简单方法是直接查看数据库的url，像 https://www.notion.so/$DATABASE_ID?v=xxx&pvs=x
   ```$DATABASE_ID: your database id```
   * API token。参考 [Notion API](https://developers.notion.com/reference/capabilities) 获取你的API url和token。
   ```$API_URL: your notion API url```
   ```$TOKEN: your notion API token```
2. 跨域请求代理。由于我们在web 插件中调用Notion API。但是aoty.org 和 notion.so 的域名不同，所以需要一个跨域请求代理。这里推荐使用Cloudflare Workers，因为它免费且易于部署。
   * 一个云服务器，e.g., ```https://woker.xxx.workers.dev```
   * 一个云服务器端点，e.g., ```$WORKER_URL=https://woker.xxx.workers.dev/addAlbum```
  
3. 浏览器插件。这里推荐使用Tampermonkey。

### 安装

1. 将 `./worker.js` 部署到跨域请求代理（比如Cloudflare Workers）。这里需要配置你的API token。
2. 将 `./aoty2notion.js` 安装到浏览器插件。这里需要配置你的数据库id和云服务器端点（比如```https://woker.xxx.workers.dev/addAlbum```）。
3. 现在你就可以在 aoty.org 上点击“添加到Notion”按钮，将专辑信息添加到你的Notion个人音乐库中。

### 扩展

网页--跨域请求代理--Notion API框架应该具有通用性。你可以使用其他网站更新你的Notion数据库，只要这些网站提供结构化信息。比如rym，豆瓣电影，IMDB， 甚至amazon，淘宝等等（如果你想记录你的购物清单）。

## ToDo

- [ ] 添加对其他音乐网站的支持，如 rateyourmusic.com
- [ ] 同时保存到Apple Music和Spotify
- [ ] 处理一些异常情况：
  - [x] 比如专辑没有封面。
  - [ ] 专辑没有发行日期。
