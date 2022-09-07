<template>
	<view class="Apply">
		<!-- 头部导航 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#fff" @click="goBack" class="back"></u-icon>
			Room introduction
		</view>
		<view class="content">
			<view class="name">{{item&&handleLevelName(item.levelName)}}</view>
			<view class="amount">
				<view class="amountIcon"></view>
				<view class="amountNumber">$ {{item&&item.minSum}}</view>
			</view>
			<!-- 推荐指数 -->
			<view class="recommended">
				<view class="title">Recommended</view>
				<view class="score" v-if="item">
					<view :class="handlerStartShow()[0]?handlerStartShow()[0]+' xx':'xx'"></view>
					<view :class="handlerStartShow()[1]?handlerStartShow()[1]+' xx':'xx'"></view>
					<view :class="handlerStartShow()[2]?handlerStartShow()[2]+' xx':'xx'"></view>
					<view :class="handlerStartShow()[3]?handlerStartShow()[3]+' xx':'xx'"></view>
					<view :class="handlerStartShow()[4]?handlerStartShow()[4]+' xx':'xx'"></view>
				</view>
			</view>

			<!-- 佣金比例 -->
			<view class="rateContent">
				<!-- 佣金比例 -->
				<view class="item">
					<view class="title">{{$t('apply.CommissionRate')}}</view>
					<view class="num">{{item&&item.rate}}%</view>
				</view>
				<!-- 订单数量 -->
				<view class="item">
					<view class="title">{{$t('apply.TaskCount')}}</view>
					<view class="num">{{item&&item.orderNumber}}</view>
				</view>
				<!-- 最小金额 -->
				<view class="item">
					<view class="title">{{$t('apply.ActivationAmount')}}</view>
					<view class="num">${{item&&item.minSum}}</view>
				</view>
			</view>

			<!-- 提示信息 -->
			<view class="tips">
				<!-- 申请提示 -->
				<view class="title">{{$t('apply.ApplicationTips')}}</view>
				<!-- 提示文本 -->
				<view class="tipsText">
					{{$t('apply.Tips')}}
				</view>
			</view>


			<view class="btnBox">
				<!-- 申请按钮 -->
				<wyb-button class="btn" type="hollow" :ripple="true" @click="Apply" v-if="!item.remark">
					{{$t('apply.btnText')}}</wyb-button>
				<view class="remark" v-if="item.remark"></view>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		RequestRoom
	} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 50, //刘海默认高度
				item: null,
			}
		},
		methods: {
			goBack() {
				this.$u.utils.pageToBack('/pages/index/index')
			},
			//处理等级名称显示
			handleLevelName(leveName) {
				let name = '';
				switch (leveName) {
					case "Trainee Manager":
						name = this.$t('grade.Trainee_Manager');
						break;
					case "General Manager":
						name = this.$t('grade.General_Manager');
						break;
					case "Senior Manager":
						name = this.$t('grade.Senior_Manager');
						break;
					case "Regional Manager":
						name = this.$t('grade.Regional_Manager');
						break;
					case "Regional General Manager":
						name = this.$t('grade.Regional_General_Manager');
						break;
					case "Regional Vice President":
						name = this.$t('grade.Regional_Vice_President');
						break;
					case "Regional President":
						name = this.$t('grade.Regional_President');
						break;
					case "Co-Founder":
						name = this.$t('grade.Co-Founder');
						break;
					default:
						name = "";
				}
				return name;
			},
			/* 禁用状态类 */
			isDisabledClass() {
				if (this.item && this.item.remark) {
					return true;
				} else {
					return false;
				}
			},
			/* 申请刷单房间 */
			async Apply() {
				//判断是否有备注
				if (this.item.remark) {
					return;
				}
				let params = {
					lid: this.item.lid,
					userID: uni.getStorageSync('userInfo').userID
				}
				//防止重复提交
				if (this.isSubmit) {
					return;
				} else {
					this.isSubmit = true;
				}
				uni.showLoading({
					title: this.$t('apply.applyIng')
				});
				const res = await RequestRoom(params);
				uni.hideLoading();
				this.isSubmit = false;
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
					this.$refs.uToast.show({
						message: this.$t('apply.applySuccess'),
						type: 'success',
						duration: 2000,
						complete: () => {
							uni.switchTab({
								url: "/pages/index/index",
							})
						}
					})
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
			/* 处理星星显示 */
			handlerStartShow() {
				if (this.item == null) return;
				let index = this.item.indexKey;
				switch (index) {
					case 0:
						return ['xxSelectAll', '', '', '', '']
						break;
					case 1:
						return ['xxSelectAll', 'half', '', '', '']
						break;
					case 2:
						return ['xxSelectAll', 'xxSelectAll', '', '', '']
						break;
					case 3:
						return ['xxSelectAll', 'xxSelectAll', 'half', '', '']
						break;
					case 4:
						return ['xxSelectAll', 'xxSelectAll', 'xxSelectAll', '', '']
						break;
					case 5:
						return ['xxSelectAll', 'xxSelectAll', 'xxSelectAll', 'half', '']
						break;
					case 6:
						return ['xxSelectAll', 'xxSelectAll', 'xxSelectAll', 'xxSelectAll', '']
						break;
					case 7:
						return ['xxSelectAll', 'xxSelectAll', 'xxSelectAll', 'xxSelectAll', 'xxSelectAll']
						break;
					default:
						break;
				}
			}
		},
		onLoad(options) {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
			if (options.item) {
				this.item = JSON.parse(options.item);
				console.log(this.item)
			}
		},
		onShow() {
			this.isSubmit = false;
		}
	}
</script>
<style>
	page {
		width: 100%;
		min-height: 100%;
		background: url("../../static/image/apply/applyBg.png")no-repeat center center;
		background-size: cover;
	}
</style>
<style lang="less" scoped>
	page {
		width: 100%;
		min-height: 100%;
		background: url("../../static/image/apply/applyBg.png")no-repeat center center;
		background-size: cover;
	}

	.header {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: "PingFangSC-Medium";
		// font-weight: 500;
		text-align: right;
		background-color: transparent;
		font-size: 32rpx;
		color: #ffffff;
		box-sizing: border-box;

		.back {
			width: 100rpx;
			height: 54rpx;
			position: absolute;
			left: 24rpx;
		}
	}

	.content {
		margin-top: 48rpx;
		padding: 0 28rpx 0 36rpx;
		width: 100%;
		box-sizing: border-box;

		.name {
			height: 64rpx;
			font-size: 46rpx;
			font-family: "PingFangSC-Semibold";
			// font-weight: 600;
			text-align: left;
			color: #ffffff;
			line-height: 64rpx;
		}

		.amount {
			display: flex;
			align-items: center;
			margin-top: 40rpx;

			.amountIcon {
				width: 60rpx;
				height: 60rpx;
				background: url("../../static/image/index/moneyIcon.png") no-repeat center center;
				background-size: 60rpx 60rpx;
			}

			.amountNumber {
				margin-left: 50rpx;
				height: 48rpx;
				font-size: 44rpx;
				font-family: "D-Bold";
				// font-weight: 700;
				text-align: left;
				color: #f5cc5e;
				line-height: 48rpx;
			}
		}

		.recommended {
			margin-top: 64rpx;

			.title {
				height: 42rpx;
				font-size: 30rpx;
				font-family: "PingFangSC-Semibold";
				// font-weight: 600;
				text-align: left;
				color: #ffffff;
				line-height: 42rpx;
			}

			.score {
				display: flex;
				margin: 28rpx 0 72rpx 0;

				.xx {
					width: 40rpx;
					height: 40rpx;
					background: url("../../static/image/index/xxUnselected.png") no-repeat center center;
					background-size: 40rpx 40rpx;
					margin-right: 10rpx;

					&.xxSelectAll {
						background: url("../../static/image/index/xx_all.png") no-repeat center center;
						background-size: 40rpx 40rpx;
					}

					&.half {
						background: url("../../static/image/index/half.png") no-repeat center center;
						background-size: 40rpx 40rpx;
					}
				}
			}
		}

		/* 佣金内容 */
		.rateContent {
			.item {
				display: flex;
				justify-content: space-between;
				margin-bottom: 76rpx;

				.title {
					height: 42rpx;
					font-size: 30rpx;
					// font-weight: 600;
					font-family: "PingFangSC-Semibold";
					text-align: left;
					color: #ffffff;
					line-height: 42rpx;
				}

				.num {
					height: 34rpx;
					font-size: 30rpx;
					font-family: "D-Bold";
					// font-weight: 700;
					text-align: right;
					color: #f5cc5e;
					line-height: 34rpx;
				}
			}
		}

		/* tips */
		.tips {
			.title {
				height: 42rpx;
				font-size: 30rpx;
				font-family: "PingFangSC-Semibold";
				// font-weight: 600;
				text-align: left;
				color: #ffffff;
				line-height: 42rpx;
			}

			.tipsText {
				font-size: 26rpx;
				font-family: "PingFangSC-Regular";
				// font-weight: 400;
				text-align: left;
				color: #ffffff;
				line-height: 36rpx;
				padding-top: 24rpx;
				padding-bottom: 88rpx;
			}
		}

		.btnBox {
			width: 100%;
			display: flex;
			justify-content: center;
			padding-bottom: 100rpx;
		}

		.btn {
			width: 100% !important;

			/deep/.wyb-button {
				height: 84rpx;
				border: none !important;
				border-radius: 42rpx !important;
				line-height: 84rpx;
				text-align: center;
				font-size: 26rpx;
				font-family: "PingFangSC-Medium";
				// font-weight: 700;
				color: #fff !important;
				box-sizing: border-box;
				background: linear-gradient(304deg, #ff8588 8%, #ff5261 85%);
			}
		}

		.remark {
			height: 84rpx;
		}
	}
</style>
