import md5 from "js-md5";

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://767518.com' : 'https://dealsdirect-webapi.com';

module.exports = (vm) => {
    // 初始化请求配置
    uni.$u.http.setConfig((config) => {
        config.baseURL = 'https://dealsdirect-webapi.com';
		config.dataType = 'json';
		config.showLoading = false;
		config.loadingTime = 800;
		config.originalData = true;
		config.loadingMask = true;
		config.timeout = 20000;
        return config
    })
	
	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => { 
	   if(!config.data){
			config.data = {};
		}
		config.header.token = vm.vuex_token;
		//获取设备信息
		let DeviceType = "Wap";
		//#ifdef APP-PLUS
		DeviceType = uni.getSystemInfoSync().platform
		//#endif
		config.header.application = DeviceType;
		//设置通用参数
		let Timestamp = Math.round(new Date().getTime() / 1000);
		let Random = parseInt(999999 * Math.random()) + '';
		let jsonParams = JSON.stringify(vm.$u.utils.JsonToAscii(config.data));
		let signature = md5(jsonParams+ '&' + Timestamp + '&' + Random + '&' + 'd4rHhEcEyYiPng3o47IFiyrfjpkSI3NpuzPH84SfuAA7fNiAqny2e6B0uCqy6OASklYPAQ68J1lTqL3WTSf2gSIknbDnzGYvGeTO4ApiajY0tgnPJ3D1HIq6aAPK3v07');
		config.data['timestamp'] = Timestamp;
		config.data['random'] = Random;
		config.data['signature'] = signature;
		return config;
	}, config => { // 可使用async await 做异步操作
	    return Promise.reject(config)
	})
	
	// 响应拦截
	uni.$u.http.interceptors.response.use((res) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
		//国际化处理响应message
		if(res.errMsg=="request:ok"&&res&&res.data.resultCode != 1){
			//对响应数据的操作
			if(res.data.resultCode == 401 || res.data.resultCode == 8){
				//提示用户信息
				//清空token
				//清除用户ID
				vm.$u.vuex('vuex_token','');
				uni.setStorageSync('isPopup', false);
				//跳转到登录
				setTimeout(()=>{
					vm.$u.route({
						type: 'reLaunch',
						url: 'pages/userAuth/login'
					})
				},500)
			}
		}
		return res
	}, (res) => {
		// 对响应错误做点什么 （statusCode !== 200）
		return Promise.reject(res)
	})
}