const Home = () => import(/* webpackChunkName: "app" */ 'app/views/Home')
const Demo = () => import(/* webpackChunkName: "app" */ 'app/views/Demo')

const routes = [
	{
		path: '/',
		component: Home,
		name: 'app',
		meta: {
			title: 'app home page'
		}
	},
	{
		path: '/demo',
		component: Demo,
		name: 'demo',
		props: (route) => ({
			route: route
		}),
		meta: {
			title: 'app demo page'
		},
		beforeEnter(to, from, next) {
			console.log('tooo====>>>', to)
			next()
		}
	}
]

export default routes