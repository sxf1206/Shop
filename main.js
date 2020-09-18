import Vue from 'vue'
import App from './App'
import store from './store'

import vip from './pages/tabbar/shop/shop.vue'
Vue.component('vip',vip)

import UpLeveVIP from './pages/tabbar/shop/UpLeveVIP.vue'
Vue.component('UpLeveVIP',UpLeveVIP)



const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}


Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$api = {prePage};
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()
