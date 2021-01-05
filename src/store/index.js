import Vue from 'vue'
import Vuex from 'vuex'
import Consts from '../consts/consts'

Vue.use(Vuex)

let USER_INFO_KEY = Consts.USER_INFO_LOCAL_STORAGE_KEY;
export default new Vuex.Store({
    state: {
        //从localStorage中获取用户信息 如果有 则处于登录状态
        loggedInUserInfo: localStorage.getItem(USER_INFO_KEY) ? JSON.parse(localStorage.getItem(USER_INFO_KEY)) : null,
        currentRoute: sessionStorage.getItem(Consts.CURRENT_ROUTE)
    },
    mutations: {
        //登录操作
        doLogin(state, userInfo) {
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
            state.loggedInUserInfo = userInfo;
        },

        //注销登录操作
        doLogoff(state) {
            state.loggedInUserInfo = null;
            localStorage.removeItem(USER_INFO_KEY);
        },
        routeTo(state, route) {
            state.currentRoute = route;
            sessionStorage.setItem(Consts.CURRENT_ROUTE, route)
        }
    },
    getters: {
        loggedIn: (state) => {
            return state.loggedInUserInfo != null;
        }
    },
    actions: {},
    modules: {}
})
