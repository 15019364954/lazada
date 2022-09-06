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

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
	@font-face {
		font-family: PingFangSC-Light;
		src:url('@/static/font/PingFang-Light_0.ttf');
	}
	@font-face {
		font-family: PingFangSC-Medium;
		src:url('@/static/font/PingFang-Medium_0.ttf');
	}
	@font-face {
		font-family: PingFangSC-Regular;
		src:url('@/static/font/PingFang-Regular_0.otf') format('otf'),
		url('@/static/font/PingFang-Regular_0.woff') format('woff'),
		url('@/static/font/PingFang-Regular_0.ttf') format('truetype');
	}
	@font-face {
		font-family: PingFangSC-Semibold;
		src:url('@/static/font/PingFang-Bold_0.ttf');
	}
	@font-face {
		font-family: D-Bold;
		src:url('@/static/font/d-din-bold.ttf');
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
	.uni-tabbar__label{
		font-family: "PingFangSC-Regular";
		font-weight: 700;
	}
</style>
