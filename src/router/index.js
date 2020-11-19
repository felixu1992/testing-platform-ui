import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
import Login from '../views/login/Login'
import Register from '../views/register/Register'
import Contacts from '../views/contacts/Contacts'
import ContactsGroup from '../views/contacts-group/ContactsGroup'
import Files from '../views/files/Files'
import FilesGroup from '../views/files-group/FilesGroup'
import Projects from '../views/projects/Projects'
import TestRecs from '../views/test-recs/TestRecs'

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
    name: 'Login',
    component: Login
  }
  ,
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: Contacts
  },
  {
    path: '/contacts-group',
    name: 'ContactsGroup',
    component: ContactsGroup
  },
  {
    path: '/files',
    name: 'Files',
    component: Files
  },
  {
    path: '/files-group',
    name: 'FilesGroup',
    component: FilesGroup
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects
  },
  {
    path: '/test-recs',
    name: 'TestRecs',
    component: TestRecs
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

Vue.prototype.routeTo = function (path) {
  router.push(path)
}
export default router
