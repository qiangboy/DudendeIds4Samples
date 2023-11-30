# 指定基础镜像
FROM node:latest as builder
WORKDIR /app

COPY ["reactclient/package-lock.json", "reactclient/"]
RUN npm ci --omit=dev
COPY . .
RUN npx vite build

# 构建生成最终镜像
FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
