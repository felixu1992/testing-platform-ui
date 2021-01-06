import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'
import Home from '../views/home/Home.vue'
import Login from '../views/login/Login'
import Register from '../views/register/Register'
import Files from '../views/files/Files'
import FilesGroup from '../views/files-group/FilesGroup'
import TestRecs from '../views/test-recs/TestRecs'
import ErrorsPage from "../views/common/errors-page/ErrorsPage";
import AddFile from '../views/files/add-file/AddFile'
import UpdateFile from '../views/files/update-file/UpdateFile'
import UpdateContact from "@/views/contacts/update-contact/UpdateContact";
import AddContact from "@/views/contacts/add-contact/AddContact";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: []
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
        path: '/contact',
        name: '联系人',
        component: () => import('@/views/contacts/index'),
        redirect: '/contact/list',
        children: [
            {
                path: 'list',
                name: '列表',
                component: () => import('@/views/contacts/list/ContactList')
            },
            {
                path: 'add-contact',
                name: '新增',
                component: AddContact
            },
            {
                path: 'update-contact',
                name: '编辑',
                component: UpdateContact
            }
        ]
    },
    {
        path: '/contact-group',
        name: '联系人分组',
        component: () => import('@/views/contacts-group/index'),
        redirect: '/contact-group/list',
        children: [
            {
                path: 'list',
                name: '列表',
                component: () => import('@/views/contacts-group/list/ContactGroupList')
            }
        ]
    },
    {
        path: '/files',
        name: '文件',
        component: Files,
        children: [
            {
                path: 'add-file',
                name: '添加文件',
                component: AddFile
            },
            {
                path: 'update-file',
                name: '更新文件',
                component: UpdateFile
            }
        ]
    },
    {
        path: '/files-group',
        name: '文件分组',
        component: FilesGroup
    },
    {
        path: '/project-group',
        name: '项目分组',
        component: () => import('@/views/projects-group/index'),
        redirect: '/project-group/list',
        children: [
            {
                path: 'list',
                name: '列表',
                component: () => import('@/views/projects-group/list/ProjectGroupList')
            }
        ]
    },
    {
        path: '/project',
        name: '项目',
        component: () => import('@/views/projects/index'),
        redirect: '/project/list',
        children: [
            {
                path: 'list',
                name: '列表',
                component: () => import('@/views/projects/list/ProjectList')
            },
            {
                path: 'add-project',
                name: '新增',
                component: () => import('@/views/projects/add/AddProject')
            },
            {
                path: 'update-project',
                name: '编辑',
                component: () => import('@/views/projects/update/UpdateProject')
            }
        ]
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
    store.commit('routeTo', path);
    router.push(path)
}
export default router
