import axios from "axios";
import { ElNotificationFnError, ElNotificationFn } from "../common";
import router from "../router";
import { getToken, removeToken } from '@/utils/auth'

let parmas = { baseURL: "/api" };
let api = axios.create(parmas);

const toLogin = () => {
  router.replace({
    path: "/login",
  });
};

// 允许携带cookie
api.defaults.withCredentials = true;

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。

    const token = getToken();
    token && (config.headers["Authorization"] = `Bearer ${token}`);
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);
// 响应拦截器
api.interceptors.response.use(
  //请求成功
  (response) => {
    const res = response.data;
    /* if (res.code !== 200 && res.status !== 200) {
            return Promise.reject(res);
          } else {
            return res;
          } */
    return res;
  },
  //请求失败
  (error) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在30分钟的范围
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit('changeNetwork', false);
    }
  }
);

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      removeToken()
      ElNotificationFnError("登录过期，请重新登录");
      toLogin();
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      removeToken()
      ElNotificationFnError("登录过期，请重新登录");
      toLogin();
      break;
    // 404请求不存在
    case 404:
      ElNotificationFn("请求的资源不存在");
      break;
  }
};

export default api;
