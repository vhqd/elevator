import development from "./config.development";
import release from "./config.release";
import production from "./config.production";

const BASE = {
  // 开发、测试环境
  development,
  // 预发布环境
  release,
  // 生产环境
  production,
};

export default BASE;
