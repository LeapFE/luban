# 服务端渲染部署指南

## 使用 PM2

[PM2](https://pm2.keymetrics.io) 是一款优秀的进程守护管理工具，用它管理线上应用非常方便。
假设项目根目录下有 `start.js` 作为服务端侧的启动文件：
```javascript
const express = require("express");
const { render } = require("./dist/server");

const app = express();

app.use(async (req, res) => {
  try {
    const { document } = await render({ path: req.path });

    res.send(document);  
  } catch (e) {
    console.log(e);
    res.send("some thing wrong");
  }
});

app.listen(3000, () => {
  console.log("listening up at 3000");
});
```

在服务器上安装 PM2 后，可以在终端这样启动：
```shell
pm2 start start.js --name <app_name> --watch
```

这样应用会监听宿主机的 3000 端口，不过服务器一般不会向外网暴露 3000 端口，可以使用 [nginx](http://nginx.org/) 这样的具有反向代理功能的 http 服务将请求转发给 Nodejs 服务。
以下为精简过的 nginx 配置：

```text
http {
    # ...
    server {
        listen       80;
        # 注意将 server_name 替换为真实的域名
        server_name  your.servername.com;

        location / {
            proxy_set_header X_Real_IP $remote_addr;
            proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_pass http://127.0.0.1:3000;
            proxy_redirect off;
        }
    }
    # ...
}
```
将 `server_name` 配置为真实的 host 地址，就可以将指定访问域名的请求转发到 Nodejs 服务。
上述只是只是配置了 HTTP 服务，意味着只能以 HTTP 协议访问应用，如何配置 HTTPS 服务可以查阅[配置https服务](http://nginx.org/en/docs/http/configuring_https_servers.html)。

## 使用 Docker
[docker](https://docs.docker.com/) 是一款可用于开发、搬用和运行容器应用的开放平台。利用 docker 可以应用构建为镜像，再将镜像以容器的形式启动，可以获得一致的运行环境和快速的部署、交付软件能力。

1. 创建服务端侧工作目录
    如果使用 [Express](https://expressjs.com/) 来构建服务，那么服务端侧的启动只有三部分依赖：Express 和客户端侧静态文件以及提供生成文档的 *server.js*，所以为了保持依赖最少，需要一个服务端侧工作空间：

  ```shell
  server
    ├── package.json
    ├── package-lock.json
    ├── index.js
  ```

在项目根目录新建目录 *server*，并安装 Express，*index.js* 文件的内容和[使用PM2](#使用-pm2)一节的 *start.js* 文件内容一样。

2. 创建 Dockerfile 文件

   ```dockerfile
   FROM node:10-alpine as client_builder
   WORKDIR /client
   COPY package.json package-lock.json /client/
   RUN npm install --ignore-scripts
   COPY . /client/
   RUN npm run build
   
   FROM node:10-alpine as server_builder
   WORKDIR /server
   COPY server/package.json server/package-lock.json /server/
   RUN npm install
   
   FROM node:10-alpine
   WORKDIR /app
   COPY server/index.js /app/index.js
   COPY --from=client_builder client/dist /app/dist
   COPY --from=server_builder server/node_modules /app/node_modules
   ```

这里采用的 docker@17.05 支持的新特性：[多阶段构建](https://docs.docker.com/develop/develop-images/multistage-build/)来构建应用的镜像。

需要注意的是，第3行和第4行，先将 *package.json* 和 *package-lock.json* 进行复制，然后再安装依赖并忽略执行依赖包中指定的脚本([--ignore-scripts](https://docs.npmjs.com/cli/v7/commands/npm-install#ignore-scripts))，比如 'postinstall'，这样可以将 *node_modules* 进行缓存，大大缩小下次构建的时间。

最后，从 `client_builder` 复制客户端静态资源文件 *dist* 目录，从 `server_builder` 复制 *node_modules*，从构建上下文复制启动文件 *index.js*，这样启动应用的所有依赖就都准备好了。

::: tip
上面 *Dockerfile* 中第3行到地6行其实可以合并为两行：

```dockerfile
# ...
COPY . /client/
RUN npm install && npm run build
# ...
```

这样的做法可以有效的减少构建时的层数(4层减少到2层)，但是这也意味着每次构建时(源码变动的情况下)都需要重新安装依赖，无形中增加了构建的时间。
:::

3. 构建镜像
    构建镜像很简单，只需要指定一下镜像标签和版本：

  ```shell
  docker build --file "Dockerfile" --tag my-ssr-app:v1 "."
  ```

这样一个名叫 "my-ssr-app:v1" 的镜像就构建好了。

4. 运行镜像
    将镜像运行为容器需要执行 `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]` 命令，并附带一些参数：

  ```shell
  docker run --detach --env PORT=3000 --expose 3000 --name my-ssr-app --publish 3000:3000 my-ssr-app:v1 node index.js
  ```

上面这个命令的意思是：以 *my-ssr-app:v1* 为镜像启动一个名叫 *my-ssr-app* 的容器，并在后台运行这个容器，同时开放容器的 3000 端口并把宿主机的 3000 端口映射到容器的 3000 端口，最后在容器内执行 `node index.js` 命令，这个 Nodejs 应用就会监听容器的 3000 端口从而对外提供服务。

如果使用 nginx 做反向代理，就可以将指定域名的请求转发到宿主机的 3000 端口，从而让 Nodejs 应用真正的对外提供服务。

### 使用 docker-compose
[docker-compose](https://docs.docker.com/compose/) 是一个可以定义和运行多个 docker 应用的工具，通过一个 yml 格式的配置文件配置应用的服务，最后只需一个命令(极少的参数)就可以启动、停止容器应用。

1. 创建 *docker-compose.yml* 文件

   ```yml
   version: "3.3"
   
   services:
   	my-ssr-app:
       build: .
       container_name: my-ssr-app
       ports:
         - "3000:3000"
       expose:
         - "3000"
       environment:
         - "PORT=3000"
         - "NODE_ENV=production"
       command: node index.js
   ```

在这个文件中定义了一个名叫 'my-ssr-app' 的服务，启动该服务时，会在当前目录下寻找到 *Dockerfile* 构建镜像，然后启动一个名叫 'my-ssr-app' 的容器，暴露容器的 3000 端口，把宿主机的 3000 端口映射到容器的 3000 端口，设置了一些环境变量，最后在容器内运行 `node index.js`，启动 Nodejs 应用。

2. 运行服务

   ```shell
   docker-compose -f docker-compose.yml up -d --build
   ```

终端执行 `docker ps -a` 就会发现一个名叫 'my-ssr-app' 的容器已经运行起来了:

![image-20210601145323002](https://i.loli.net/2021/06/01/8GeouZndSrMfQcI.png)

同样的，使用 nginx 可以将指定域名的请求转发到宿主机的 3000 端口，从而让 Nodejs 应用真正的对外提供服务。

## 使用 Traefik

>[Traefik](https://doc.traefik.io/traefik/) 是一款开源的边缘路由器，和 [nginx](http://nginx.org/) 一样，traefik 接收系统的请求然后找到合适的服务去处理请求。它具有以下特点：
>
>1. 热更新。配置文件更新无需重启 traefik
>2. 服务发现和负载均衡
>3. 支持 [Docker](https://docs.docker.com)、[Kubernetes](https://kubernetes.io/)、[Http](https://developer.mozilla.org/zh-CN/docs/Web/HTTP) 和 [Redis](https://redis.io/) 等多种基础设施组件

<img src="https://doc.traefik.io/traefik/assets/img/traefik-architecture.png" alt="traefik" style="zoom:30%;" />





