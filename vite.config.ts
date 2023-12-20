/*
 * @Author: yuxuan-ctrl 
 * @Date: 2023-12-15 14:52:29
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2023-12-20 11:07:39
 * @FilePath: \Open-Lineage-Web-Vue\vite.config.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 获取 .env 环境配置文件
  const { VITE_PUBLIC_PATH } = loadEnv(mode, process.cwd());

  return {
    base: VITE_PUBLIC_PATH,
    plugins: [vue()],
  };
});
