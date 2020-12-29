import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'
import Home from '../views/home/Home.vue'
import Login from '../views/login/Login'
import Register from '../views/register/Register'
import Contacts from '../views/contacts/Contacts'
import ContactsGroup from '../views/contacts-group/ContactsGroup'
import Files from '../views/files/Files'
import FilesGroup from '../views/files-group/FilesGroup'
import Projects from '../views/projects/Projects'
import TestRecs from '../views/test-recs/TestRecs'
import ErrorsPage from "../views/common/errors-page/ErrorsPage";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[]
  },
  {
    path: '/login',
    name: '登陆',
    component: Login
  }
  ,
  {
    path: '/register',
    name: '注册',
    component: Register
  },
  {
    path: '/contacts',
    name: '联系人',
    component: Contacts
  },
  {
    path: '/contacts-group',
    name: '联系人分组',
    component: ContactsGroup
  },
  {
    path: '/files',
    name: '文件',
    component: Files,
    children:[]
  },
  {
    path: '/files-group',
    name: '文件分组',
    component: FilesGroup
  },
  {
    path: '/projects',
    name: '项目列表',
    component: Projects
  },
  {
    path: '/test-recs',
    name: '测试记录',
    component: TestRecs
  }
  ,
  {
    path: '/errors',
    name: 'ErrorsPage',
    component: ErrorsPage
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

Vue.prototype.routeTo = function (path) {
  store.commit('routeTo',path);
  router.push(path)
}
export default router
