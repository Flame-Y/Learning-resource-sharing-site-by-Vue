# 学习资源分享网站（Vue）使用引导

## !!!注意： webpack-dev-server 的版本可能有问题
```
# 删除webpack-dev-server
npm uninstall webpack-dev-server

# 安装webpack-dev-server
npm install webpack-dev-server@2.9.1
```
## 安装 / 启动项目 

```
# 克隆项目
git clone https://github.com/Flame-Y/Learning-resource-sharing-site-by-Vue.git

# 安装依赖
npm install/cnpm install

# 启动服务
npm start/cnpm install

用npm好像有点问题 打不开就换cnpm
```

#### 暂存问题

1.换肤功能仅限导航栏部分，不使用redux的情况没有较好的整体换色解决方案

2.在线运行时，接口无法正常请求，疑似后台接口没配置Nginx相关

3.普通用户无法进行按评论数从高到低返回的请求，无法实现热榜功能
