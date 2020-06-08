// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const asyncRouterMap = [

    // 数据统计
    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: '首页' },
        redirect: '/user',
        children: [
            // 登录页面
            {
                path: '/user',
                component: UserLayout,
                redirect: '/user/login',
                hidden: true,
                children: [
                    {
                        path: 'login',
                        name: 'login',
                        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
                    }
                ]
            },
            // 数据统计
            {
                path: '/statistics',
                name: 'statistics',
                component: () => import('@/views/statistics/Statistics'),
                meta: {
                    title: '数据统计',
                    keepAlive: true,
                    hiddenHeaderContent: true,
                    icon: 'line-chart'
                }
            },
            // 用户管理
            {
                path: '/manageuser/list',
                name: 'manageuser',
                component: RouteView,
                meta: {
                    title: '用户管理',
                    keepAlive: true,
                    icon: 'solution'
                },
                hideChildrenInMenu: true,
                redirect: '/manageuser/list',
                children: [
                    {
                        path: '/manageuser/list',
                        name: 'userlist',
                        component: () => import('@/views/manageuser/ManageUser'),
                        meta: { title: '用户列表', hiddenHeaderContent: true, keepAlive: true }
                    },
                    {
                        path: '/manageuser/userdetail',
                        name: 'userdetail',
                        component: () => import('@/views/manageuser/UserDetail'),
                        meta: { title: '用户详情', keepAlive: true }
                    }
                ]
            },
            // 文章管理
            {
                path: '/managearticle',
                name: 'managearticle',
                component: () => import('@/views/managearticle/ManageArticle'),
                meta: {
                    title: '文章管理',
                    keepAlive: true,
                    hiddenHeaderContent: true,
                    icon: 'home'
                }
            },
            // 投诉列表
            {
                path: '/complaintlist',
                name: 'complaintlist',
                component: () => import('@/views/complaintlist/ComplaintList'),
                meta: {
                    title: '投诉管理',
                    keepAlive: true,
                    hiddenHeaderContent: true,
                    icon: 'mail'
                }
            },

            // 个人中心
            {
                path: '/personalcenter',
                name: 'personalcenter',
                component: () => import('@/views/personalcenter/PersonalCenter'),
                meta: {
                    title: '个人中心',
                    keepAlive: true,
                    hiddenHeaderContent: true,
                    icon: 'setting'
                }
            }
        ]
    },
    {
        path: '*', redirect: '/404', hidden: true
    }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
    {
        path: '/user',
        component: UserLayout,
        redirect: '/user/login',
        hidden: true,
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
            }
        ]
    },
    {
        path: '/404',
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
    }

]
