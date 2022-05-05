import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import installElementPlus from "./plugins/element";
import resize from "@/directives/resize.js";
import "./assets/reset.css";

// 判断taken和用户信息进行页面重定向拦截
import './permission' // permission control

const app = createApp(App);

//注册Element-Plus
installElementPlus(app);
app.directive("resize", resize);
app.use(router).use(store).mount("#app");
