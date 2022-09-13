const install = (Vue, vm) => {
	
	/**
	 * 权限校验：后面会配置成全局拦截器
	 */
	const Permissions = ()=> {
		const token = uni.getStorageSync('userData').vuex_token;
		if (!token) {
			uni.setStorageSync('isPopup',false);
			//全局弹窗重置
			vm.$u.route({
				type: 'redirect',
				url: 'pages/userAuth/login'
			})
			return false
		}
		return true;
	}
	
	/**
	 * 处理网络超时和网络错误
	 */
	const handleNetwork = (res) => {
		console.log(res.errMsg);
		if(res.errMsg.indexOf("request:fail")>-1||res.errMsg.indexOf("request:fail timeout")>-1) {
			return vm.$t('config.resultCode');
		} 
		return "";
	}
	
	/**
	 * 处理返回上一页方法
	 */
	const pageToBack = (url) => {
		const pages = getCurrentPages();
		if (pages.length === 2) {
			uni.navigateBack({
				delta: 1
			});
		} else if (pages.length === 1) {
			uni.switchTab({
				url: url,
			})
		} else {
			uni.navigateBack({
				delta: 1
			});
		}
	}
	
	/**
	 *  参数格式化
	 */ 
	
	const JsonToAscii = (jsonData) => {
		let arr = [];
		for(var key in jsonData){
			arr.push(key)
		}
		arr.sort();
		let result = {};
		for(var i in arr){
			result[arr[i]] = jsonData[arr[i]];
		}
		return result;
	}
	
	
	/**
	 *  参数格式化
	 */ 
	const handleAwait = (promise) => {
		return promise.then(res=>{
			return [null, res];
		}).catch(err => [err]);
	}
	
	const encodeSearchKey = (key) => {
	    const encodeArr = [{
	      code: '%',
	      encode: '%25'
	    }, {
	      code: '?',
	      encode: '%3F'
	    }, {
	      code: '#',
	      encode: '%23'
	    }, {
	      code: '&',
	      encode: '%26'
	    }, {
	      code: '=',
	      encode: '%3D'
	    }];
	    return key.replace(/[%?#&=]/g, ($, index, str) => {
	      for (const k of encodeArr) {
	        if (k.code === $) {
	          return k.encode;
	        }
	      }
	    });
	}
	
	//动态设置tabbar国际化
	const setTabBarI18n = ()=> {
		for (let i = 0; i < 4; i++) {
			let text = "";
			switch (i) {
				case 0:
					text = vm.$t('tabbar.HomeText');
					break;
				case 1:
					text = vm.$t('tabbar.OrderText');
					break;
				case 2:
					text = vm.$t('tabbar.TeamText');
					break;
				case 3:
					text = vm.$t('tabbar.AccountText');
					break;
			}
			uni.setTabBarItem({
				index: i,
				text
			});
		}
	}
	
	vm.$u.utils = {
		Permissions,
		handleNetwork,
		pageToBack,
		JsonToAscii,
		handleAwait,
		encodeSearchKey,
		setTabBarI18n
	}
	
}
export default{
	install
}