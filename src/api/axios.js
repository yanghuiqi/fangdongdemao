import axios from "axios";
import qs from "qs";
import { Message } from "element-ui";
import router from "../router";

const Axios = axios.create({
  baseURL: "/", // 因为我本地做了反向代理
  timeout: 10000,
  responseType: "json",
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  }
});

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (
      config.method === "post"
    ) {
      // 序列化
      config.data = qs.stringify(config.data);
      // 温馨提示,若是贵公司的提交能直接接受json 格式,可以不用 qs 来序列化的
    }

    // 若是有做鉴权token , 就给头部带上token
    // 若是需要跨站点,存放到 cookie 会好一点,限制也没那么多,有些浏览环境限制了 localstorage 的使用
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token;
    }
    return config;
  },
  error => {
    // error 的回调信息,看贵公司的定义
    Message({
      //  饿了么的消息弹窗组件,类似toast
      showClose: true,
      message: error,
      type: "error.data.error.message"
    });
    return Promise.reject(error.data.error.message);
  }
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    //对响应数据做些事
    if (res.data && !res.data.success) {
      Message({
        //  饿了么的消息弹窗组件,类似toast
        showClose: true,
        message: res.data.error.message.message
          ? res.data.error.message.message
          : res.data.error.message,
        type: "error"
      });
      return Promise.reject(res.data.error.message);
    }
    return res;
  },
  error => {
    // 用户登录的时候会拿到一个基础信息,比如用户名,token,过期时间戳
    // 直接丢localStorage或者sessionStorage
    if (!window.localStorage.getItem("loginUserBaseInfo")) {
      // 若是接口访问的时候没有发现有鉴权的基础信息,直接返回登录页
      router.push({
        path: "/login"
      });
    } else {
      // 若是有基础信息的情况下,判断时间戳和当前的时间,若是当前的时间大于服务器过期的时间
      // 乖乖的返回去登录页重新登录
      let lifeTime =
        JSON.parse(window.localStorage.getItem("loginUserBaseInfo")).lifeTime *
        1000;
      let nowTime = new Date().getTime(); // 当前时间的时间戳
      console.log(nowTime, lifeTime);
      console.log(nowTime > lifeTime);
      if (nowTime > lifeTime) {
        Message({
          showClose: true,
          message: "登录状态信息过期,请重新登录",
          type: "error"
        });
        router.push({
          path: "/login"
        });
      } else {
        // 下面是接口回调的satus ,因为我做了一些错误页面,所以都会指向对应的报错页面
        if (error.response.status === 403) {
          router.push({
            path: "/error/403"
          });
        }
        if (error.response.status === 500) {
          router.push({
            path: "/error/500"
          });
        }
        if (error.response.status === 502) {
          router.push({
            path: "/error/502"
          });
        }
        if (error.response.status === 404) {
          router.push({
            path: "/error/404"
          });
        }
      }
    }
    // 返回 response 里的错误信息
    let errorInfo =  error.data.error ? error.data.error.message : error.data;
    return Promise.reject(errorInfo);
  }
);

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, "$http", { value: Axios });
  }
};

import Vue from "vue";
import Router from "vue-router";
import layout from "@/components/layout/layout";
// 版块有点多,版块独立路由管理,里面都是懒加载引入
import customerManage from "./customerManage"; // 客户管理
import account from "./account"; //登录
import adManage from "./adManage"; // 广告管理
import dataStat from "./dataStat"; // 数据统计
import logger from "./logger"; // 日志
import manager from "./manager"; // 管理者
import putonManage from "./putonManage"; // 投放管理
import error from "./error"; // 服务端错误
import { Message } from "element-ui";

Vue.use(Router);

// 请跳过这一段,看下面的
const router = new Router({
  hashbang: false,
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/adver",
      component: layout,
      children: [
        ...customerManage,
        ...adManage,
        ...dataStat,
        ...putonManage,
        ...manager,
        ...logger
      ]
    },
    ...account,
    ...error
  ]
});

// 路由拦截
// 差点忘了说明,不是所有版块都需要鉴权的
// 所以需要鉴权,我都会在路由meta添加添加一个字段requireLogin,设置为true的时候
// 这货就必须走鉴权,像登录页这些不要,是可以直接访问的!!!
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireLogin)) {
    // 判断是否需要登录权限
    if (window.localStorage.getItem("loginUserBaseInfo")) {
      // 判断是否登录
      let lifeTime =
        JSON.parse(window.localStorage.getItem("loginUserBaseInfo")).lifeTime *
        1000;
      let nowTime = (new Date()).getTime(); // 当前时间的时间戳
      if (nowTime < lifeTime) {
        next();
      } else {
        Message({
          showClose: true,
          message: "登录状态信息过期,请重新登录",
          type: "error"
        });
        next({
          path: "/login"
        });
      }
    } else {
      // 没登录则跳转到登录界面
      next({
        path: "/login"
      });
    }
  } else {
    next();
  }
});

export default router;
export default {
    // 请求地址
    url: "/user",
    // 请求类型
    method: "get",
    // 请根路径
    baseURL: "http://www.mt.com/api",
    // 请求前的数据处理
    transformRequest: [function(data) {}],
    // 请求后的数据处理
    transformResponse: [function(data) {}],
    // 自定义的请求头
    headers: { "x-Requested-With": "XMLHttpRequest" },
    // URL查询对象
    params: { id: 12 },
    // 查询对象序列化函数
    paramsSerializer: function(params) {},
    // request body
    data: { key: "aa" },
    // 超时设置s
    timeout: 1000,
    // 跨域是否带Token
    withCredentials: false,
    // 自定义请求处理
    adapter: function(resolve, reject, config) {},
    // 身份验证信息
    auth: { uname: "", pwd: "12" },
    // 响应的数据格式 json / blob /document /arraybuffer / text / stream
    responseType: "json",
    // xsrf 设置
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
  
    // 下传和下载进度回调
    onUploadProgress: function(progressEvent) {
      Math.round(progressEvent.loaded * 100 / progressEvent.total);
    },
    onDownloadProgress: function(progressEvent) {},
  
    // 最多转发数，用于node.js
    maxRedirects: 5,
    // 最大响应数据大小
    maxContentLength: 2000,
    // 自定义错误状态码范围
    validateStatus: function(status) {
      return status >= 200 && status < 300;
    },
    // 用于node.js
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
  
    // 用于设置跨域请求代理
    proxy: {
      host: "127.0.0.1",
      port: 8080,
      auth: {
        username: "aa",
        password: "2123"
      }
    },
    // 用于取消请求
    cancelToken: new CancelToken(function(cancel) {})
  };
