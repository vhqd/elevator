// 引入 router
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

// 引入路由各页面配置
import routes from "./routes";

// 配置router对象
const router = createRouter({
  //history: createWebHashHistory(),
  history: createWebHistory(),
  routes,
});

export default router;


