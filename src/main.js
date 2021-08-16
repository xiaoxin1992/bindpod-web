import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import api from '@/api'
import store from '@/store'
import cookie from '@/utils/cookie'
import 'default-passive-events'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.prototype.$api = api
Vue.prototype.$cookie = cookie

Vue.use(ElementUI)
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')

