import Vue from 'vue'
import _axios from 'axios'
import VueAxios from 'vue-axios'

let conf = {
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
}

let axios = _axios.create(conf)

axios.interceptors.request.use(conf => {
  if (localStorage.getItem('testing-platform-token')) {
    conf.headers.common['Authorization'] = 'token ' + localStorage.getItem('testing-platform-token')
  }
  return conf
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response.data
}, error => {
  if (error.response) {
    // switch (error.response.status) {
    //   // 返回401，清除token信息并跳转到登录页面
    //   case 401:
    //     localStorage.removeItem('token');
    //     router.replace({
    //       path: '/login'
    //       //登录成功后跳入浏览的当前页面
    //       // query: {redirect: router.currentRoute.fullPath}
    //     })
    // }
    // 返回接口返回的错误信息
    return Promise.reject(error.response.data)
  }
})

Vue.use(VueAxios, axios)
