import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"), // 这里是将src目录配置别名为 @ 方便在项目中导入src目录下的文件
    },
  },
  optimizeDeps: {
    include: ["echarts", "axios", "mockjs"],
  },
  json: {
    //是否支持从 .json 文件中进行按名导入
    namedExports: true,
    //若设置为 true 导入的json会被转为 export default JSON.parse("..") 会比转译成对象字面量性能更好
    stringify: false,
  },
  build: {
    target: "modules",
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    host: "localhost",
    port: 3000,
  },
});
