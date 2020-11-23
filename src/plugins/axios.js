import {message} from "ant-design-vue"
import axios from "axios"
import Vue from "vue"
import Consts from "../consts/consts.js"
import router from "../router/index.js"

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
        let loggedInUserStr = localStorage.getItem(Consts.USER_INFO_LOCAL_STORAGE_KEY);
        if (loggedInUserStr){
            let loggedInUser = JSON.parse(loggedInUserStr);
            config.headers["Authorization"] = "token " + loggedInUser.token;
        }
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
        let httpCode = response.status
        if (httpCode >= 200 && httpCode < 300) {
            return response
        }else if (httpCode >= 400){
            // larger than 400
            return Promise.reject(new Error(response.statusText))
        }else{
            //300 ~ 399 currently do nothing
            // message.warn("redirect response")
            let msg = "httpCode:"+ httpCode
            return Promise.reject(new Error(msg))
        }
    },
    function(error) {
        // Do something with response error
        return Promise.reject(error)
    }
)

const request = {
    get: async function (url, data) {
        return await _axios.get(url, data)
            .then(responseHandler)
            .catch(errorHandler)

    },
    post: async function (url, data) {
        return _axios.post(url, data)
            .then(responseHandler)
            .catch(errorHandler)

    },
    put: async function (url, data) {
        return await _axios.put(url, data)
            .then(responseHandler)
            .catch(errorHandler)
    },
    delete: async function (url, data) {
        return await _axios.delete(url, data)
            .then(responseHandler)
            .catch(errorHandler)

    }
}

let responseHandler = (response)=>{
    //normal case:200 ~ 299
    const responseData = response.data
    if (responseData.code !== 0){
        if (responseData.code === 106){
            //106 离线状态
            router.push("/login")
        }
        //businuss logic error
        return Promise.reject(new Error(responseData.message))
    }else {
        // normal case: BS code is 0
        return responseData.data
    }
}

let errorHandler = (error) => {
    message.error("操作失败: "+error.message)
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
