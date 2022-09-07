<template>
	<view>
		<!-- 头部导航 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			Grab a Single
		</view>

		<view class="content" :style="{paddingTop: isPhone?statusBarHeight+'px':60+'px'}">
			<!-- 收益 -->
			<view class="earnings">
				<view class="bg"></view>
				<view class="earningsbox">
					<view class="earningsContent">
						<view class="hatBg">Today's earnings</view>
						<scroll-view scroll-x="true" class="scroll-view_H u-flex u-row-between">
							<view class="income">
								<view :class="handleSelectedClass(0)" @click="handleClickItem(0)">
									<view class="title">{{$t('dailyTasks.Availablebalance')}}</view>
									<view class="money u-line-1">${{MyReport&&MyReport.balance}}</view>
								</view>
								<view :class="handleSelectedClass(1)" @click="handleClickItem(1)">
									<view class="title">{{$t('dailyTasks.Todaysearnings')}}</view>
									<view class="money">${{MyReport&&MyReport.totalTodayCommission|fmtMoney}}</view>
								</view>
								<view :class="handleSelectedClass(2)" @click="handleClickItem(2)">
									<view class="title">{{$t('dailyTasks.orders')}}</view>
									<view class="money">{{MyReport&&MyReport.totalTodayOrderNumber}}</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
			<!-- 任务说明 -->
			<view class="desc">
				<view class="orderDesc">{{$t('dailyTasks.Orderdescription')}}</view>
				<view class="descContent">
					<text class="text">(1) </text>
					{{info1}}
				</view>
				<view class="descContent">
					<text class="text">(2) </text>
					{{info2}}
				</view>
				<view class="descContent">
					<text class="text">(3) </text>
					{{$t('dailyTasks.info3')}}
				</view>
			</view>
			
			<!-- 订单列表 -->
			<orderList :orderList="orderList" :lid="this.options.lid" v-if="orderListShow"></orderList>
		</view>
		<u-toast ref="uToast"></u-toast>
		<drag-btn></drag-btn>
	</view>
</template>

<script>
	import {
		nanoid
	} from 'nanoid'
	import {
		GetOrderReport,
		GetProductList,
		GetOrderInfo
	} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 50,
				isPhone: false,
				MyReport: null, //报告数据
				active: '',
				current: 0,
				orderList: null,
				orderListShow: true
			}
		},
		computed: {
			info1() {
				return this.$t('dailyTasks.info1').replace('{0}', this.options.orderNumber);
			},
			info2() {
				return this.$t('dailyTasks.info2').replace('{0}', this.options.rate);
			},
		},
		watch: {
			'$i18n.locale'() {
				this.$nextTick(function() {
					this.info1();
					this.info2();
				})
			}
		},
		methods: {
			//处理当前选中类
			handleSelectedClass(index) {
				return this.current == index ? "incomeItem" + " " + "active" : "incomeItem";
			},

			//处理点击item
			handleClickItem(index) {
				this.current = index;
			},
			goBack() {
				this.$u.utils.pageToBack('/pages/index/index')
			},
			//获取个人报告
			async _GetMyReport() {
				//获取用户ID
				const userID = uni.getStorageSync('userInfo').userID;
				const res = await GetOrderReport({
					userID
				});
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
					this.MyReport = res.data.resultData;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},

			//获取商品列表
			async _GetProductList() {
				//发送请求获取订单信息
				const params = {
					pageSize: 100,
					lid: this.options.lid,
					userID: uni.getStorageSync('userInfo').userID
				}
				uni.showLoading();
				const res = await GetProductList(params);
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
					//设置订单信息
					res.data.resultData.productList&&res.data.resultData.productList.map((item,index)=>{
						item._id = index+1;
					})
					this.orderList = res.data.resultData.productList;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
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
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
			this.options = JSON.parse(decodeURIComponent(options.item));
		},
		onShow() {
			if (!this.$u.utils.Permissions()) return;
			this.orderListShow = true;
			this.isStart = false;
			this._GetMyReport();
			this._GetProductList();
		},
		onHide() {
			this.orderListShow = false;
		}
	}
</script>
<style>
	page {
		background-color: #f7f7f7;
	}
</style>
<style lang="less" scoped>
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

	.content {
		padding-left: 28rpx;
		padding-right: 28rpx;
		width: 100%;
		box-sizing: border-box;

		.earnings {
			width: 100%;
			position: relative;

			.bg {
				width: 100%;
				height: 200rpx;
				background: url("../../static/image/index/room_item_bg.png") no-repeat center center;
				background-size: 100% 200rpx;
				position: absolute;
			}

			.earningsbox {
				position: relative;
				z-index: 100;
				padding-top: 60rpx;

				.earningsContent {
					width: 100%;
					min-height: 300rpx;
					background-color: #fff;
					border-top-left-radius: 16rpx;
					border-top-right-radius: 16rpx;
					position: relative;

					.hatBg {
						position: absolute;
						left: 50%;
						transform: translate(-50%, -50%);
						width: 388rpx;
						height: 68rpx;
						background: url("../../static/image/index/hat.png") no-repeat center center;
						background-size: 388rpx 68rpx;
						font-size: 28rpx;
						font-family: 'PingFangSC-Medium';
						font-weight: 500;
						text-align: center;
						color: #ffffff;
						line-height: 68rpx;
					}

					.scroll-view_H {
						padding-top: 80rpx;
						padding-left: 24rpx;
					}

					::-webkit-scrollbar {
						display: none;
						width: 0 !important;
						height: 0 !important;
						-webkit-appearance: none;
						background: transparent;
					}

					/* 收益滑块 */
					.income {
						// margin-top: 100rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						flex-wrap: nowrap;

						.incomeItem {
							width: 252rpx;
							flex-shrink: 0;
							width: 234rpx;
							height: 156rpx;
							padding: 10rpx;
							font-size: 28rpx;
							background-color: #fff;
							display: flex;
							border: 1px solid #E1E1E1;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							margin-right: 40rpx;
							background: #fff;
							border-radius: 16rpx;
							box-sizing: border-box;

							&.active {
								font-size: 32rpx;
								font-weight: 500;
								padding: 0;
								border: 1px solid #fe6067;
								background: #f7e8e987;

								.money {
									font-size: 24rpx;
									font-family: "PingFangSC-Semibold";
									font-weight: 600;
									text-align: left;
									color: #fe6067;
								}

								.title {
									font-size: 26rpx;
									font-family: "PingFangSC-Regular";
									font-weight: 400;
									text-align: center;
									color: #fe6067;
								}
							}

							.title {
								font-size: 26rpx;
								font-family: "PingFangSC-Regular";
								font-weight: 400;
								text-align: center;
								color: #444444;
							}

							.money {
								font-size: 24rpx;
								font-family: "PingFangSC-Semibold";
								font-weight: 600;
								text-align: center;
								color: #333333;
							}
						}
					}
				}
			}
		}

		/* 描述 */
		.desc {
			width: 100%;
			min-height: 300rpx;
			border-bottom-right-radius: 16rpx;
			border-bottom-left-radius: 16rpx;
			background-color: #fff;
			padding: 0 24rpx;
			box-sizing: border-box;
			padding-bottom: 40rpx;

			.orderDesc {
				height: 36rpx;
				font-size: 26rpx;
				font-family: 'PingFangSC-Medium';
				font-weight: 500;
				text-align: left;
				color: #444444;
				line-height: 36rpx;
			}

			.descContent {
				margin: 20rpx 0;
				font-size: 22rpx;
				font-family: "PingFangSC-Regular";
				font-weight: 400;
				text-align: left;
				color: #999999;
				line-height: 32rpx;
			}
		}
	}
</style>
