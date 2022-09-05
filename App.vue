<script>
	export default {
		onLaunch: function() {
			let lid = uni.getStorageSync('lang').Name;
			if(!lid) {
				uni.setStorageSync('lang',{
					lid: '17717cf9-3115-4c7f-bdcc-e709ead9f50d',
					Name: 'en'
				});
			}
		},
	}
</script>

<style lang="less">
	@font-face {
		font-family: PingFangSC-Light;
		src:url('@/static/font/PingFang-Light_0.ttf');
	}
	@font-face {
		font-family: PingFangSC-Medium;
		src:url('@/static/font/PingFang-Medium_0.ttf');
		font-weight: 500;
	}
	@font-face {
		font-family: PingFangSC-Regular;
		src:url('@/static/font/PingFang-Regular_0.ttf');
		font-weight: 400;
	}
	@font-face {
		font-family: PingFang-Heavy;
		src:url('@/static/font/PingFang-Heavy_0.ttf');
	}
	@font-face {
		font-family: PingFang-ExtraLight;
		src:url('@/static/font/PingFang-ExtraLight_0.ttf');
	}
	@font-face {
		font-family: Helvetica;
		src:url('@/static/font/Helvetica.ttf');
	}
	/*每个页面公共css */
</style>
