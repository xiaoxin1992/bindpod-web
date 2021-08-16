import Vue from 'vue'
import Router from 'vue-router'
import cookie from '@/utils/cookie'
import {routes} from "@/router/router";

Vue.use(Router)

const includePush = Router.prototype.push

Router.prototype.push = function push(location) {
    return includePush.call(this, location).catch(err => err)

}

const router = new Router({
    routes
})
router.beforeEach((to, from, next) => {
    document.title = to.meta["title"]
    if (!to.matched.some(route => route.name === to.name)) {
        next({
            path: '/404'
        })
        return
    }
    if (cookie.get("token") === null && to.name !== "login" && to.name !== "404") {
        next({
            path: '/login'
        })
    }
    next()
})

export default router
