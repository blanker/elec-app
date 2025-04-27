import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import path from 'path'; // 确保引入 path 模

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSvgr({
      mixedImport: true,
      svgrOptions: {
        exportType: 'named',
      },
    })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    aliasStrategy: 'prefer-alias',
  },
  output: {
    // 设置资源前缀为相对路径，确保 popup.html 能找到 JS/CSS 等文件
    assetPrefix: './',
    // 你可能还需要配置输出目录名，默认为 dist
    // distPath: 'dist',
  },
});
