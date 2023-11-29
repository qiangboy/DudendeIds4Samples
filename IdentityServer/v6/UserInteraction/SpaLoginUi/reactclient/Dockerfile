# 基础镜像
FROM node:14-alpine

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 文件复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm ci --only=production

# 复制所有源代码到工作目录
COPY . .

# 构建 React 应用
RUN npm run build

# 配置 Nginx 服务器来提供静态内容
FROM nginx:alpine

# 拷贝构建好的 React 应用到 Nginx 的默认静态文件路径
COPY --from=0 /app/build /usr/share/nginx/html

# 暴露80端口作为访问接口
EXPOSE 80

# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]