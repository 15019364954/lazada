import App from './App'
import Vue from 'vue'
// 引入语言包
import IN from '@/common/locales/IN.js';
import en from '@/common/locales/en.js';
import de from '@/common/locales/de.js';
// 引入并使用vue-i18n
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// 构造i18n对象
const i18n = new VueI18n({
	locale:  uni.getStorageSync("lang")?uni.getStorageSync("lang").Name.toUpperCase():'EN',//处理默认语言，本地存储||en
	messages: {
		'IN': IN, 
		'EN': en,
		'DE': de,
	}
})

Vue.filter("fmtMoney",(num)=>{
	 // 保留到小数点后两位
	if( !num || num == '' || isNaN(num) )  return '0.00'
	let result = parseFloat(num);
	result = Math.floor(num*100) /100;
	let s_x = result.toString();
	let pos_decimal = s_x.indexOf('.');
	if(pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x+='.';
	}
	while(s_x.length <= pos_decimal + 2) {
		s_x+='0';
	}
	return s_x;
})


Vue.prototype.$store = store
Vue.prototype.domain = 'https://zalando-api.com/';

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
uni.$u.config.unit = 'rpx'

// 引入store
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);
import store from '@/store';

Vue.config.productionTip = false
App.mpType = 'app'

//获取系统导航栏信息
Vue.prototype.getPhoneInfo = function(){
	const phoneInfo = uni.getSystemInfoSync();// 获取手机系统信息
	let statusBarObj = {
		statusBarHeight: 0/* 状态栏默认高度 */
		//如果自己有需要其他属性的话，可以往这里添加
	}
	// 设置状态栏高度（H5顶部无状态栏小程序有状态栏需要撑起高度）
	statusBarObj.statusBarHeight = phoneInfo.statusBarHeight;
	return statusBarObj;
}

const app = new Vue({
	i18n,
	store,
    ...App
})

//自定义小工具
import utils from '@/common/util.js'
Vue.use(utils, app);

// 引入请求封装，将app参数传递到配置中
require('./common/request.js')(app);
app.$mount()
