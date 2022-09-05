<template>
	<view class="homePage">
		<view class="header">
			<view class="left">
				<view class="text">
					<view class="title">Logo App</view>
					<view class="title_desc">Safe，fast and concise</view>
				</view>
			</view>
			<view class="logo"></view>
			<!-- #ifdef H5 -->
			<view class="right">
				<view class="downloadBtn"></view>
			</view>
			<!-- #endif -->
		</view>

		<!-- 容器 -->
		<view class="container" :style="{
				paddingTop:isPhone?statusBarHeight+'px':60+'px',
			}">
			<!-- 轮播图 -->
			<view class="wrap">
				<u-swiper radius="20rpx" mode="none" imgMode="scaleToFill" :list="swrapList" width="600" height='350'
					keyName="imgUrl" indicatorStyle="bottom: 10rpx" :indicator="true" indicatorActiveColor="#4F63C1"
					indicatorMode="dot">
				</u-swiper>
			</view>


			<!-- open room -->
			<view class="openRoom">
				<view class="content">
					<view class="top">
						<view class="labaIcon"></view>
						<view class="text">Open room</view>
					</view>
					<!-- 滚动消息 -->
					<rolling-membership></rolling-membership>
				</view>
			</view>

			<!-- 商品滚动列表 -->
			<view class="goods-parent">
				<rolling-goods></rolling-goods>
			</view>

			<!-- 房间列表 -->
			<room-list :TaskHallData="TaskHallData"></room-list>
		</view>
	</view>
</template>

<script>
	import {
		GetMsgNoticeList,
		GetPPromotionList,
		GetPDLevelRuleList
	} from '@/common/api.js';

	export default {
		data() {
			return {
				isPhone: false,
				statusBarHeight: 50, //刘海默认高度
				swrapList: [], //轮播图数据
				background: ['color1', 'color2', 'color3'],
				indicatorDots: false,
				autoplay: true,
				interval: 1500,
				duration: 5000,
				easing: "linner",
				TaskHallData: null
			}
		},
		onLoad() {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
		},
		methods: {
			//获取优惠活动列表
			async GetPromotionList() {
				const params = {
					pageIndex: 1,
					pageSize: 3,
				}
				const res = await GetPPromotionList(params);
				const networkError = this.$u.utils.handleNetwork(res);
				if (networkError) {
					this.$refs.uToast.show({
						message: networkError,
						type: 'error',
						duration: 1500,
					})
					return;
				}
				if (res.data.resultCode == 1) {
					//根据类型处理数据
					this.swrapList = res.data.resultData.pPromotionList;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 1500,
					})
				}
			},

			//获取任务大厅列表
			async GetDLevelRuleList() {
				const userID = uni.getStorageSync('userInfo').userID;
				const params = {
					userID,
					pageIndex: 1,
					pageSize: 100,
				}
				const res = await GetPDLevelRuleList(params);
				uni.stopPullDownRefresh();
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
					//根据类型处理数据
					const data = res.data.resultData.pdLevelRuleList;
					this.TaskHallData = data;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
		},
		onShow() {
			if (!this.$u.utils.Permissions()) return;
			/* 获取优惠活动列表 */
			this.GetPromotionList();
			/* 获取佣金大厅列表 */
			this.GetDLevelRuleList();
		}
	}
</script>

<style lang="less" scoped>
	page {
		background-color: #f7f7f7;
	}

	.header {
		background-color: #fff;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		color: #464646 !important;
		font-size: 40rpx;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10000;
		padding: 0 28rpx;
		width: 100%;
		box-sizing: border-box;
		box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.10);

		.logo {
			width: 170rpx;
			height: 56rpx;
			background: #ffffff;
			border-radius: 8rpx;
			background: #ffffff url("../../static/logo.png") no-repeat center center;
			background-size: 170rpx 56rpx;
		}

		.left {
			width: 180rpx;
			position: absolute;
			left: 28rpx;

			.text {
				.title {
					font-size: 20rpx;
					font-family: "PingFangSC-Regular";
					font-weight: 400;
					color: #666;
					line-height: 24rpx;
					margin-bottom: 16rpx;
				}

				.title_desc {
					.title;
					margin-bottom: 0;
					color: #FF5261;
					font-size: 28rpx;
				}
			}
		}

		.right {
			position: absolute;
			right: 28rpx;

			.downloadBtn {
				width: 110rpx;
				height: 52rpx;
				background: url("../../static/image/index/appdownload.gif")no-repeat center center;
				background-size: 110rpx 52rpx;
			}
		}
	}

	.container {
		.wrap {
			padding: 24rpx;
			width: 100%;
			box-sizing: border-box;
		}

		.openRoom {
			padding: 0 24rpx;

			.content {
				width: 100%;
				background-color: #ffffff;
				border-radius: 16rpx;
				min-height: 200rpx;
				padding: 26rpx 28rpx;
				box-sizing: border-box;

				.top {
					display: flex;
					align-items: center;

					.labaIcon {
						width: 28rpx;
						height: 28rpx;
						background: url("../../static/image/index/laba.png") no-repeat center center;
						background-size: 28rpx 28rpx;
						margin-right: 12rpx;
					}

					.text {
						height: 40rpx;
						font-size: 28rpx;
						font-family: "PingFangSC-Medium";
						font-weight: 500;
						color: #333333;
						line-height: 40rpx;
					}
				}
			}
		}

		/* 滚动商品 */
		.goods-parent {
			margin: 24rpx 0;
		}
	}
</style>
