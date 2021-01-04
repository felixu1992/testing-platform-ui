import {message} from "ant-design-vue"
import axios from "axios"
import Vue from "vue"
import Consts from "../consts/consts.js"
import router from "../router/index.js"
import store from "../store/index.js"

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
        // 如果最后没有 ‘/’ 结尾 则添加 ‘/’.
        // let reqUrl = config.url;
        // let lastCharOfUrl = reqUrl[reqUrl.length - 1];
        // if(lastCharOfUrl !== '/'){
        //     config.url += '/';
        // }
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
    get: function (url, params, dataHandler) {
        let paramEntries = Object.entries(params);
        if(paramEntries.length > 0) {
            url += '?';
        }
        for (let i = 0; i < paramEntries.length; i++) {
            const element = paramEntries[i];
            url +=  element[0] + '=' + element[1] + '&';
        }

        if(url[url.length -1] == '&'){
            url = url.substr(0,url.length - 1);
        }

        return _axios.get(url)
            .then((response) => {
                responseHandler(response,dataHandler)
            })
            .catch(errorHandler)

    },
    post: function (url, data,dataHandler) {
        return _axios.post(url, data)
            .then((response) => {
                responseHandler(response,dataHandler)
            })
            .catch(errorHandler)

    },
    put: function (url, data,dataHandler) {
        return _axios.put(url, data)
            .then((response) => {
                responseHandler(response,dataHandler)
            })
            .catch(errorHandler)
    },
    delete: function (url, data,dataHandler) {
        return _axios.delete(url, data)
            .then((response) => {
                responseHandler(response,dataHandler)
            })
            .catch(errorHandler)

    }
}

let responseHandler = (response,dataHandler)=>{
    //normal case:200 ~ 299
    const responseData = response.data
    let respCode = responseData.code
    if (respCode === 106){
        //106 离线状态
        message.error(responseData.message)
        //登出操作
        store.commit("doLogoff");
        //跳转到登陆页
        router.push("/login")
    } else if (respCode !== 0) {
        message.warn(responseData.message)
    }else {
        // normal case: BS code is 0
        if (dataHandler) {
            dataHandler(responseData.data)
        }
    }
}

let errorHandler = (error) => {
    message.error("操作失败: " + error.message)
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
// export {request}
export default request;
