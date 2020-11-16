import {message,notification} from "ant-design-vue"
import axios from "axios"
import Vue from "vue"

let config = {
    baseURL: process.env.VUE_APP_AXIOS_BAESE,
    timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config)

_axios.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        // console.log("config.data",config.data)
        //登录之后的每一次请求都要带着token

        //设置调用版本
        return config
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error)
    }
)

// Add a response interceptor
_axios.interceptors.response.use(
    function(response) {
        const responseData = response.data
        console.log(responseData)
        //todo -----
        if (data.code !== 200){
            notification.error("操作失败")
        }
        return response
    },
    function(error) {
        // Do something with response error
        return Promise.reject(error)
    }
)

const request = {
    get: async function (url, data) {
        return await _axios.get(url, data)
            .then((resolve) => resolve.data)
            .catch(errorHandler)

    },
    post: async function (url, data) {
        return await _axios.post(url, data)
            .then((resolve) => resolve.data)
            .catch(errorHandler)

    },
    put: async function (url, data) {
        return await _axios.put(url, data)
            .then((resolve) => resolve.data)
            .catch(errorHandler)
    },
    delete: async function (url, data) {
        return await _axios.delete(url, data)
            .then((resolve) => resolve.data)
            .catch(errorHandler)

    }
}

let errorHandler = (error) => {
    message.error("操作失败",error)
}

Plugin.install = function(Vue) {
    Vue.axios = _axios;
    window.axios = _axios;
    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return _axios
            }
        },
        $axios: {
            get() {
                return _axios
            }
        },
        request:{
            get() {
                return request
            }
        }
    })
}
Vue.use(Plugin);
export {request}
export default _axios
