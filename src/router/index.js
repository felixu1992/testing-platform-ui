import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'
import Home from '../views/home/Home.vue'
import Login from '../views/login/Login'
import Register from '../views/register/Register'
import ErrorsPage from "../views/common/errors-page/ErrorsPage";
import UpdateContact from "@/views/contacts/update-contact/UpdateContact";
import AddContact from "@/views/contacts/add-contact/AddContact";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: '首页',
        component: Home,
        children: []
    },
    {
        path: '/login',
        name: '登陆',
        component: Login
    },
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
                name: '联系人列表',
                component: () => import('@/views/contacts/list/ContactList')
            },
            {
                path: 'add-contact',
                name: '联系人新增',
                component: AddContact
            },
            {
                path: 'update-contact',
                name: '联系人编辑',
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
                name: '联系人分组列表',
                component: () => import('@/views/contacts-group/list/ContactGroupList')
            }
        ]
    },
    {
        path: '/file',
        name: '文件',
        component: () => import('@/views/files/index'),
        redirect: '/file/list',
        children: [
            {
                path: 'list',
                name: '文件列表',
                component: () => import('@/views/files/list/FileList')
            },
            {
                path: 'add-file',
                name: '添加文件',
                component: () => import('@/views/files/add-file/AddFile')
            },
            {
                path: 'update-file',
                name: '更新文件',
                component: () => import('@/views/files/update-file/UpdateFile')
            }
        ]
    },
    {
        path: '/file-group',
        name: '文件分组',
        component: () => import('@/views/files-group/index'),
        redirect: '/file-group/list',
        children: [
            {
                path: 'list',
                name: '文件分组列表',
                component: () => import('@/views/files-group/list/FileGroupList')
            }
        ]
    },
    {
        path: '/project-group',
        name: '项目分组',
        component: () => import('@/views/projects-group/index'),
        redirect: '/project-group/list',
        children: [
            {
                path: 'list',
                name: '项目分组列表',
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
                name: '项目列表',
                component: () => import('@/views/projects/list/ProjectList')
            },
            {
                path: 'detail',
                name: '项目详情',
                component: () => import('@/views/projects/detail/Project')
            },
            {
                path: 'add-project',
                name: '项目新增',
                component: () => import('@/views/projects/add/AddProject')
            },
            {
                path: 'update-project',
                name: '项目编辑',
                component: () => import('@/views/projects/update/UpdateProject')
            },
            {
                path: 'case',
                name: '用例',
                component: () => import('@/views/projects/case/index'),
                redirect: '/project/case/list',
                children: [
                    {
                        path: 'list',
                        name: '用例列表',
                        component: () => import('@/views/projects/case/list/CaseList')
                    },
                    {
                        path: 'add-case',
                        name: '用例新增',
                        component: () => import('@/views/projects/case/add-case/AddCase')
                    },
                    {
                        path: 'update-case',
                        name: '用例编辑',
                        component: () => import('@/views/projects/case/update-case/UpdateCase')
                    }
                ]
            }
        ]
    },
    {
        path: '/record',
        name: '测试记录',
        component: () => import('@/views/record/index'),
        redirect: '/record/list',
        children: [
            {
                path: 'list',
                name: '记录列表',
                component: () => import('@/views/record/list/RecordList')
            },
            {
                path: 'report',
                name: '测试报告',
                component: () => import('@/views/record/report/index'),
                redirect: '/record/report/list',
                children: [
                    {
                        path: 'list',
                        name: '报告列表',
                        component: () => import('@/views/record/report/list/ReportList')
                    },
                    {
                        path: 'detail',
                        name: '执行详情',
                        component: () => import('@/views/record/report/detail/Report')
                    }
                ]
            }
        ]
    },
    {
        path: '/errors',
        name: 'ErrorsPage',
        component: ErrorsPage
    }
    ]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

Vue.prototype.routeTo = function (path) {
    store.commit('routeTo', path);
    router.push(path)
}
export default router
