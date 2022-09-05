<template>
	<view class="UserAgreement">
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			<view @click="goBack" class="back">
				<u-icon name="arrow-left" color="#FF5261" size="60rpx"></u-icon>
			</view>
			User Agreement
		</view>
		<view v-if="data" class="content">
			<rich-text :nodes="data.content"></rich-text>
		</view>
	</view>
</template>

<script>
	import md5 from "js-md5";
	import {
		nanoid
	} from 'nanoid'
	import countryData from '@/common/countryCode.js';
	import {
		RegisterPc,
		GetBaseLanguageSet,
		SendMobileAuthCodeNoBind
	} from '@/common/api.js';
	export default {
		data() {
			return {
				isPhone: false,
				statusBarHeight: 50,
				data: null
			}
		},
		methods: {
			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/index/index');
			},
			//获取内容
			async GetBaseLanguageSetData() {
				const params = {
					lid: uni.getStorageSync('lang').Name,
					tid: 5
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
				if (res.data.resultCode == 1) {
					this.data = res.data.resultData;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
		},
		onLoad() {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
		},
		onShow() {
			this.GetBaseLanguageSetData();
		}
	}
</script>
<style>
	page{
		background-color: #ffffff!important;
	}
</style>
<style lang="less" scoped>
	.header {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		font-family: "PingFangSC-Medium";
		font-weight: 500;
		text-align: right;
		color: #ff5261;
		.back {
			width: 100rpx;
			height: 54rpx;
			display: flex;
			justify-content: flex-start;
			position: absolute;
			left: 24rpx;
		}
	}
	.content{
		padding: 0 24rpx;
		padding-top: 42rpx;
		font-size: 28rpx;
		font-family: "PingFangSC-Regular";
		font-weight: 400;
		color: #005652;
		line-height: 40rpx;
	}
</style>
