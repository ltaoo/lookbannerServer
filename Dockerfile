# Lookbanner
#
# VERSION 1.0.0

# 设置基础镜像为 node:6.9.2-slim
FROM node:6.9.2-slim
# 添加自己的详细信息
MAINTAINER ltaoo "litaowork@aliyun.com"
# 设置环境变量
# ENV REFRESHED_AT 2016-12-28
ENV HTTP_PORT 8000
# 添加指定文件到目录
# ADD sources.list /etc/apt/sources.list
# 拷贝当前目录到 /app 目录
COPY . /app
# 指定进入容器后的路径，之后的命名就基于该路径
WORKDIR /app
# RUN 指令用来运行命令
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 8000
CMD ["node", "start.js"]