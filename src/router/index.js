import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
import Layout from "../layout/Layout";
import Index from '../views/index/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/platform',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: '/home',
          name: 'Index',
          meta: {
            title: '首页'
          },
          component: Index
        }
      ]
    }
  ]
})
