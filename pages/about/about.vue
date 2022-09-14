<template>
	<view class="main" :style="{height:screenHeight+'px'}">
		<!-- 自定义头部 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			{{$t('about.title')}}
		</view>
		<view class="content" :style="{paddingTop:statusBarHeight-60+65+'px'}">
			<view class="container">
				<u-image width="300rpx" height="300rpx" :src="logo" class="logo"></u-image>
				<view class="version">{{$t('about.system')}}：<text class="os">{{system}}</text></view>
				
				<!-- app版本内容 -->
				<!-- #ifndef H5 -->
				<view class="version">{{$t('about.versionCode')}}：<text class="os">v100</text></view>
				<view class="version">{{$t('about.versionName')}}：<text class="os">{{current_version}}</text></view>
				<!-- #endif -->
				
				<!-- #ifdef H5 -->
				<view class="item">
					<view class="left">{{$t('about.versionInfo')}}</view>
					<view class="right">{{$t('about.versionCur')}}</view>
				</view>
				<!-- #endif -->
				
				<!-- #ifndef H5 -->
				<view class="item" @click="update">
					<view class="left">{{$t('about.versionInfo')}}</view>
					<view class="right" v-if="!isUpdate">{{$t('about.versionCur')}}</view>
					<view class="right" v-if="isUpdate">
						{{$t('about.versionNew')}}
						<text class="newVersion">{{newVersion}}</text>
					</view>
				</view>
				<!-- #endif -->
			</view>
		</view>
		
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {GetAppUpgradeList, GetSite} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 60,  //刘海默认高度
				isPhone: false, //是否是手机
				logo:'',
				system: '',
				appUpgradeList: null, //热更新数据
				oldVersion: '', //旧版本号
				isUpdate: false, //是否需要更新
				newVersion: '', //最新的版本号
				current_version: '', //当前app版本号
				screenHeight: '',
			}
		},
		methods: {
			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/Account/Account');
			},
			
			//获取网站信息
			async GetSiteData () {
				const response = await GetSite();
				//设置用户头像
				if (response.data.resultCode === 1) {
					//保存用户头像
					this.logo = response.data.resultData.logo;
				}
			},
			
			//#ifndef H5
			//点击更新版本
			update() {
				if(this.isUpdate) {
					this.$u.vuex('vuex_token','');
					uni.setStorageSync('userInfo','');
					uni.setStorageSync('isPopup', false);
					this.$u.route({
						type:'reLaunch',
						url: '/pages/guide/guide'
					})
				}
			},
			//查询是否需要更新版本
			async GetAppUpgradeListData() {
				//判断之前检测本地有没有版本号，如果没有添加本地版本号
				let _version = '1.0.0';
				if(!uni.getStorageSync('_version')) {
					uni.setStorageSync('_version', _version);
				}
				const res = await GetAppUpgradeList();
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
					let _that = this;
					_that.appUpgradeList = res.data.resultData.appUpgradeList[0];
					let data = res.data.resultData.appUpgradeList;
					let versionName = data[0].versionName;
					let versionCode = versionName.replace(/\./g,'');
					plus.runtime.getProperty(plus.runtime.appid, (widgetInfo)=>{
						//判断当前app的版本是否与本地的旧版本一致，如果不一致以app版本作为旧版本
						let systemVersion = widgetInfo.version;
						if(uni.getStorageSync('_version')!==systemVersion) {
							//判断系统app的版本是否大于本地的旧版本
							let odVersion = uni.getStorageSync('_version').replace(/\./g,'');
							let styVersion = systemVersion.replace(/\./g,'');
							if(Number(odVersion)<Number(styVersion)){
								uni.setStorageSync('_version', systemVersion);
							}
						}
						_that.current_version = uni.getStorageSync('_version');
						let version = uni.getStorageSync('_version').replace(/\./g,'');
						let oldVersionCode = Number(version);
						_that.oldVersion = oldVersionCode;
						_that.newVersion = versionName;
						if(oldVersionCode<Number(versionCode)) {
							//保存最新版本号到本地
							// uni.setStorageSync('last_version', versionName);
							//判断是否需要更新版本
							this.isUpdate = true;
						}
					})
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode"+res.data.resultCode),
						type: 'error',
						duration: 1500,
					})
				}
			},
			//#endif
		},
		onLoad() {
			//获取系统刘海高度
			//#ifdef APP-PLUS
				let statusBarObj = this.getPhoneInfo();
				this.isPhone = true;
				this.statusBarHeight = statusBarObj.statusBarHeight+this.statusBarHeight;
			//#endif
			this.GetSiteData()//获取网站信息
			let _that = this;
			uni.getSystemInfo({
				success(res) {
					_that.system = res.system;
				}
			})
		},
		onReady() {
			this.screenHeight = uni.getSystemInfoSync().windowHeight;
		},
		onShow() {
			if(!this.$u.utils.Permissions()) return;
			//#ifndef H5
			this.GetAppUpgradeListData()
			//#endif
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		font-size: 26rpx;
		height: 100%;
		color: #666;
		background-color: rgba(248, 247, 252, 0.56);
	}
	page {
		height: 100%;
		background-color: #F7F7F7;
	}
	
	.header {
		text-align: center;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		font-family: "PingFangSC-Medium";
		background-color: #fff;
		font-size: 32rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FE6067;
		letter-spacing: 1rpx;
		z-index: 1000;
		border-bottom: 1px solid #ddd;
	
		.back {
			position: absolute;
			left: 30rpx;
		}
	}
	.container{
		min-height: 500px;
		display: flex;
		flex-direction: column;
		align-items: center;
		.logo{
			margin-top: 50rpx;
			margin-bottom: 20rpx;
		}
		.version{
			font-family: "PingFangSC-Medium";
			.os{
				color: #f33;
			}
		}
		.item{
			display: flex;
			margin-top: 100rpx;
			background-color: #fff;
			justify-content: space-between;
			width: 100%;
			line-height: 100rpx;
			padding: 0 20rpx;
			box-sizing: border-box;
			font-family: "PingFangSC-Medium";
			.newVersion{
				color: #f33;
			}
		}
	}
</style>
