<template>
	<view class="language">
		<!-- 头部导航 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			Language Settings
		</view>
		<view class="content" :style="{paddingTop:isPhone?statusBarHeight+12+'px':62+'px'}">
			<view class="item" v-for="item in langaugeData" :key="item.lid" @click="switchLang(item)">
				<view class="left">
					<u--image :src="item.ico" width="50rpx" height="50rpx" mode="aspectFit" class="icon"></u--image>
					<view class="fullName">{{item.fullName}}</view>
				</view>
				<view class="rightIcon" v-if="item&&item.name.toUpperCase()==Name&&Name.toUpperCase()"></view>
			</view>
		</view>
	</view>
</template>

<script>
		import {mapState} from 'vuex';

	import { GetLanguage} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 50,
				isPhone: false,
				Name: uni.getStorageSync('lang') ? uni.getStorageSync('lang').Name : "en", //默认值:英文
				langaugeData: null //语言列表
			}
		},
		computed:{
			...mapState(['langName']), //展开storage里的数据属性
		},
		methods: {
			goBack() {
				this.$u.utils.pageToBack('/pages/index/index')
			},
			//语言切换
			switchLang(item) {
				uni.showLoading();
				const {
					lid,
					name,
					fullName,
					ico
				} = item;
				// 切换为英文
				this.fullName = fullName;
				uni.$u.vuex('langName', fullName);
				this.$i18n.locale = name;
				uni.setStorage({
					key: "lang",
					data: {
						LangId: lid,
						Name: name,
					}
				})
			},

			//动态设置tabbar国际化
			setTabBarI18n() {
				for (let i = 0; i < 4; i++) {
					let text = "";
					switch (i) {
						case 0:
							text = this.$t('tabbar.HomeText');
							break;
						case 1:
							text = this.$t('tabbar.OrderText');
							break;
						case 2:
							text = this.$t('tabbar.TeamText');
							break;
						case 3:
							text = this.$t('tabbar.AccountText');
							break;
					}
					uni.setTabBarItem({
						index: i,
						text
					});
				}
			},
			//获取多语言列表
			async GetLanguageData() {
				uni.showLoading();
				const res = await GetLanguage();
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
					this.langaugeData = res.data.resultData.baseLanguageList;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			}
		},
		watch: {
			'$i18n.locale'() {
				this.Name = uni.getStorageSync('lang').Name;
				this.$nextTick(function() {
					//动态设置tabbar国际化
					setTimeout(()=>{
						uni.hideLoading()
						this.$u.utils.pageToBack('/pages/index/index')
					},1000)
				})
			}
		},
		onLoad() {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
			let lid = uni.getStorageSync('lang').Name;
			if (!lid) {
				uni.setStorageSync('lang', {
					lid: '17717cf9-3115-4c7f-bdcc-e709ead9f50d',
					Name: 'EN'
				});
			}
		},
		onShow() {
			this.GetLanguageData();
		},
		onHide() {
			uni.hideLoading();
		}
	}
</script>

<style lang="less" scoped>
	.header {
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
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;
		.item{
			width: 100%;
			border-bottom: 1px solid #ddd;
			background-color: #fff;
			height: 110rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.left{
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 20rpx;
				.fullName{
					margin-left: 20rpx;
				}
			}
			.rightIcon{
				width: 40rpx;
				height: 40rpx;
				background: url("../../static/image/language/xuanzhong.png") no-repeat center center;
				background-size: 40rpx 40rpx;
				margin-right: 40rpx;
			}
		}
	}
</style>
