<template>
	<view>
		<!-- 自定义头部 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			{{$t('online.title')}}
		</view>
		<web-view 
			:src="onlineUrl" 
			:style="{
				top:statusBarHeight+'px',
				height: screenHeight-60+'px'
			}"
		>
		</web-view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {GetSite} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 60,  //刘海默认高度
				isPhone: false,  //是否是手机
				screenHeight:0, //屏幕高度
				onlineUrl: '', //客服链接
			}
		},
		methods: {
			//返回上一页
			goBack() {
				/* 判断是否登录 */
				if(!uni.getStorageSync('userInfo').userID){
					uni.reLaunch({
					    url: '/pages/userAuth/login'
					});
				} else {
					this.$u.utils.pageToBack('/pages/index/index')
				}
			},
			//获取网站信息
			async GetSiteData () {
				uni.showLoading();
				const res = await GetSite();
				uni.hideLoading();
				const networkError = this.$u.utils.handleNetwork(res);
				if (networkError) {
					this.$refs.uToast.show({
						message: networkError,
						type: 'error',
						duration: 2000,
					})
					return; 
				}
				if (res.data.resultCode === 1) {
					const customer = {
						"姓名": uni.getStorageSync('userInfo').userID||'陌生人',
						"账号": uni.getStorageSync('userInfo').userID||'陌生人',
						"电话": uni.getStorageSync('userInfo').mobile || '陌生人'
					}
					let jsonObj = JSON.stringify(customer);
					let onLine = res.data.resultData.onlineUrl;
					this.onlineUrl = onLine+'&customer='+encodeURI(jsonObj);
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode"+res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
		},
		onLoad(options) {
			//获取系统刘海高度
			//#ifdef APP-PLUS
				let statusBarObj = this.getPhoneInfo();
				this.isPhone = true;
				this.statusBarHeight = statusBarObj.statusBarHeight+this.statusBarHeight;
			//#endif
		},
		onReady() {
			this.GetSiteData();
			this.screenHeight = uni.getSystemInfoSync().screenHeight;
			//#ifdef APP-PLUS
			let height = uni.getSystemInfoSync().screenHeight-(uni.getSystemInfoSync().statusBarHeight+60)
			let top = uni.getSystemInfoSync().statusBarHeight+60;
			var currentWebview = this.$scope.$getAppWebview().children()[0];
		   //设置高度样式
			currentWebview.setStyle({
				top: top,
				height: height,
				scalable: false  //webview的页面是否可以缩放，双指放大缩小
			})
			//#endif
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #F8F7FC;
	}
	.header{
		text-align: center;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #F8F7FC;
		font-size: 20px;
		height: 60px;
		line-height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999999999;
		font-size: 38rpx;
		font-family: "PingFangSC-Medium";
		// font-weight: 700;
		box-sizing: border-box;
		letter-spacing: 1rpx;
		color: #FE6067;
		.back{
			 position: absolute;
			 left: 20rpx;
		}
	}
</style>
