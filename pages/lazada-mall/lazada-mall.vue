<template>
	<view class="lazadaMall">
		<view class="lazadaMall-bg"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				statusBarHeight: 50,
				isPhone: false,
			}
		},
		methods: {
			
		},
		onLoad(options) {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
			uni.showLoading();
			this.Time = setTimeout(() => {
				uni.hideLoading();
				this.$u.route({
					type:'redirectTo',
					url: `/pages/lazada-mall-detail/lazada-mall-detail?item=${options.item}`
				})
			},2000)
		},
	}
</script>

<style lang="less" scoped>
	page{
		height: 100%;
	}
	.lazadaMall{
		position: relative;
		height: 100%;
		.lazadaMall-bg{
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			position: absolute;
			background: url("../../static/image/store/lazada.png")no-repeat center center;
			background-size: 100% 100%;
		}
		.detail{
			position: absolute;
			z-index: 100;
			width: 100%;
			min-height: 100%;
			background-color: #fff;
			color: #000;
			.header {
				width: 100%;
				position: fixed;
				font-family: "PingFangSC-Medium";
				font-weight: 500;
				top: 0;
				left: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;
				background-color: #f7f7f7;
				font-size: 32rpx;
				color: #FE6067;
				z-index: 1000;
				.back {
					width: 100rpx;
					height: 54rpx;
					position: absolute;
					left: 24rpx;
				}
			}
		}
	}
</style>
