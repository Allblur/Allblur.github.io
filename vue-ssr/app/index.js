import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import createRouter from 'app/router'
import App from './app'
// import {DatePicker} from 'element-ui'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import './handsontable.full.css'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(ElementUI)

const router = createRouter()

router.beforeEach((to, from, next) => {
	next()
})

router.beforeResolve((to, from, next) => {
	next()
})

router.afterEach((to, from) => {})

new Vue({
	router,
	render: (h) => h(App)
}).$mount('#app')