const routes = [
    {
        name: "home",
        path: "/",
        component: () => import('../pages/Home'),
        redirect: 'welcome',
        meta: {
            title: "首页"
        },
        children: [
            {
                name: "welcome",
                path: "welcome",
                component: () => import('../pages/Welcome'),
                meta: {
                    title: "欢迎"
                }

            },
            {
                name: "domain",
                path: "domain",
                component: () => import('../pages/domain/Domain'),
                meta: {
                    title: "域名管理"
                },
                children: [
                    {
                        name: "list",
                        path: "list",
                        component: ()=> import('../pages/domain/List'),
                        meta: {
                            title: "域名列表"

                        }
                    },
                    {
                        name: "add",
                        path: "add",
                        component: () => import('../pages/domain/Add'),
                        meta: {
                            title: "添加域名"
                        }
                    },
                    {
                        name: "analysis",
                        path: "analysis/:domain",
                        component: () => import('../pages/domain/Analysis'),
                        meta: {
                            title: "解析记录"
                        },
                        props: true
                    }
                ]
            },
            {
                name: "user",
                path: "user",
                component: ()=>import('../pages/user/User'),
                meta: {
                    title: "用户管理"
                },
                children: [
                    {
                        name: "domain-list",
                        path: "list",
                        component: ()=> import('../pages/user/List'),
                        meta: {
                            title: "用户列表"

                        }
                    },
                    {
                        name: "domain-permission",
                        path: "domain",
                        component: ()=> import('../pages/user/DomainPermission'),
                        meta: {
                            title: "域名授权"

                        }
                    },
                ]
            },
            {
                name: "logs",
                path: "/logs",
                component: () => import('../pages/Logs'),
                meta: {
                    title: "操作记录"
                }
            }
        ]
    },
    {
        name: "login",
        path: "/login",
        component: () => import('../pages/Login'),
        meta: {
            title: "登陆"
        }
    },
    {
        name: "404",
        path: "/404",
        component: () => import('../pages/404'),
        meta: {
            title: "404"
        }
    }
]
export {routes}
