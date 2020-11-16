import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let USER_INFO_LOCAL_STORAGE_KEY = "testing_platform_logged_in_user_info"
export default new Vuex.Store({
  state: {
    //从localStorage中获取用户信息 如果有 则处于登录状态
    loggedInUserInfo: localStorage.getItem(USER_INFO_LOCAL_STORAGE_KEY) ? JSON.parse(localStorage.getItem(USER_INFO_LOCAL_STORAGE_KEY)) : null
  },
  mutations: {
    //登录操作
    doLogin(state,userInfo){
      localStorage.setItem(USER_INFO_LOCAL_STORAGE_KEY,JSON.stringify(userInfo));
      state.loggedInUserInfo = userInfo;
    },

    //注销登录操作
    doLogoff(state){
      state.loggedInUserInfo = null;
      localStorage.removeItem(USER_INFO_LOCAL_STORAGE_KEY);
    }
  },
  getters:{
    loggedIn: (state) => {
      return state.loggedInUserInfo;
    }
  },
  actions: {
  },
  modules: {
  }
})
