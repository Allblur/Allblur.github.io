import Vue from 'vue'
import {DatePicker} from 'element-ui'
import App from './App'

/* eslint-disable no-new */
Vue.config.productionTip = false
//是否开启工具调试
Vue.config.devtools = process.env.NODE_ENV === 'development'

Vue.use(DatePicker)

new Vue({
	render: h => h(App)
}).$mount('#app')
