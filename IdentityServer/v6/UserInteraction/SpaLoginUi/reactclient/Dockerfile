# 指定基础镜像
FROM node:latest as builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npx vite build

# 构建生成最终镜像
FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
