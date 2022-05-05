import ElementPlus from "element-plus"; //引入插件
import * as ElIconModules from "@element-plus/icons-vue";
import "element-plus/theme-chalk/index.css"; //默认css样式
import zhCn from "element-plus/es/locale/lang/zh-cn"; //引入中文包

export default (app) => {
  // 统一注册Icon图标
  for (const iconName in ElIconModules) {
    if (Reflect.has(ElIconModules, iconName)) {
      const item = ElIconModules[iconName];
      app.component(iconName, item);
    }
  }
  app.use(ElementPlus, { locale: zhCn });
};
