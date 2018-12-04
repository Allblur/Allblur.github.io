import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import createRouter from 'app/router'
import App from './app'

Vue.use(VueRouter)
Vue.use(Vuex)

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