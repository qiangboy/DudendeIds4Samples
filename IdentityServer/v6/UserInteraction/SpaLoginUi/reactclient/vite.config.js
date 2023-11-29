import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   // 配置前端服务地址和端口
   server: {
    host: '0.0.0.0',
    port: 8080,
    // 是否开启 https
    https: false,
  }
})
