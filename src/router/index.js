import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
import Index from '../views/index/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/view/index',
      name: 'Index',
      component: Index
    }
  ]
})
