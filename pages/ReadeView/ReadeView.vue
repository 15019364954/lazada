<template>
	<view class="main">
		<!-- 头部导航 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			{{type&&title['title_'+type]}}
		</view>
		<view class="content" :style="{paddingTop:statusBarHeight-50+65+'px'}">
			<view class="container">
				<rich-text :nodes="data&&data.content"></rich-text>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import {GetBaseLanguageSet} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 50,  //刘海默认高度
				isPhone: false, //是否是手机
				type: 0,
				data: '', //字符串内容
			}
		},
		computed:{
			title() {
				const title = {
					"title_5": this.$t('render.userAgreement'),
					"title_9": this.$t('render.FAQ'),
					"title_10": this.$t('render.TeamMechanism'),
					"title_11": this.$t('render.PlatformPartners'),
					"title_1": this.$t('render.Tutorial'),
					"title_2": this.$t('render.Intro'),
					"title_8": this.$t('render.AboutUs'),
					"title_4": this.$t('render.CommissionRate'),
				}
				return title;
			}
		},
		methods: {
			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/Account/Account');
			},
			
			//获取内容
			async GetBaseLanguageSetData(type) {
				const params = {
					lid: uni.getStorageSync('lang').Name,
					tid: type
				}
				uni.showLoading();
				const res = await GetBaseLanguageSet(params);
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
				if(res.data.resultCode == 1) {
					this.data = res.data.resultData;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode"+res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			}
		},
		onLoad(options) {
			const {type} = options;
			//获取系统刘海高度
			//#ifdef APP-PLUS
				let statusBarObj = this.getPhoneInfo();
				this.isPhone = true;
				this.statusBarHeight = statusBarObj.statusBarHeight+this.statusBarHeight;
			//#endif
			this.type = type;
			this.GetBaseLanguageSetData(type);
		},
		onShow() {
			if(!this.$u.utils.Permissions()) return;
		}
	}
</script>

<style lang="scss" scoped>
	page{
		height: 100%;
		background-color: #f7f7f7;
	}
	.header{
		width: 100%;
		position: fixed;
		font-family: "PingFangSC-Medium";
		// font-weight: 500;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		background-color: #fff;
		border-bottom: 2rpx solid #ddd;
		font-size: 32rpx;
		color: #FE6067;
		z-index: 1000;
		box-sizing: border-box;
		
		.back {
			width: 100rpx;
			height: 54rpx;
			position: absolute;
			left: 24rpx;
		}
	}
	.content{
		padding: 60px 40rpx 40rpx 40rpx;
		width: 100%;
		box-sizing: border-box;
		font-family: "PingFangSC-Medium";
		color: #005652;
		.container{
			width: 100%;
			box-sizing: border-box;
			line-height: 30px;
		}
	}
	.content /deep/ img{
		width: auto!important;
		height: auto!important;
		max-width: 100%!important;
		max-height: 100% !important;
	}
</style>
