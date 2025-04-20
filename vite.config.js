import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 根据不同环境设置不同的环境变量
  const envPrefix = 'APP_';

  return {
    plugins: [react(), cloudflare(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      hmr: {
        overlay: false
      }
    },
    define: {
      // 可以在这里定义全局常量
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    // 环境变量前缀设置
    envPrefix,
  };
});
