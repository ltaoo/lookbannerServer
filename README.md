# node 采集 + koa 后端

使用 node 采集电商网站首页 banner，使用 sqlite 保存数据，koa 搭建后端提供接口给前端调用。

## Dockerfile

进入项目目录后，运行
```bash
docker build -t <username/repositoryName:tag> .
```
可以构建镜像，使用`docker images`可以查看生成的镜像。

```bash
docker run --name <containerName> -d -p 3000:3000 <imageId>
```

表示运行容器，运行成功后就可以在本地打开`127.0.0.1:3000`访问了。

## collect

存放采集 banner 的代码。使用`node collect/index.js`即可采集 banner，并将数据保存至数据库。

## start.js

应用入口，`node start.js`即可启动应用。