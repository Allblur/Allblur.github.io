import VueRouter from 'vue-router'
import routes from './routes'

export default () => {
	return new VueRouter({
		routes,
		mode: 'history',
		scrollBehavior(to, from, savedPosition) {
			return savedPosition ? savedPosition : {
				x: 0,
				y: 0
			}
		}
	})
}