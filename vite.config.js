import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import BASE from "./src/config/index";
import createVitePlugins from './vite/plugins'

const EUSE_ENV = process.env.EUSE_ENV;
const NODE_ENV = process.env.NODE_ENV;
const baseURL = BASE[NODE_ENV].baseURL;
console.log(baseURL);
console.log(NODE_ENV);
console.log(EUSE_ENV);

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    // vite 相关配置
    server: {
      port: 8081,
      open: true,
      host: true,
      proxy: {
        // '/api': {
        //   target: baseURL,
        //   changeOrigin: true,
        //   rewrite: (p) => p.replace(/^\/api/, ''),
        // },
      },
    },
    /* build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          //生产环境时移除console.log()
          drop_console: true,
          drop_debugger: true,
        },
      },
    }, */
  }
})