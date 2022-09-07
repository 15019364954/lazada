<template>
	<view class="lazadaMall">
		<!-- 头部导航 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			Lazada-mall
		</view>
		<view class="content" :style="{paddingTop:statusBarHeight+12+'px'}">
			<view class="productImgBox">
				<u--image :src="item.imgUrl" width="604rpx" height="603rpx" mode="widthFix" class="productImg"
					radius="16rpx" @click="previewImg(item.imgUrl)">
				</u--image>
			</view>

			<view class="name">{{item.pName}}</view>
			<view class="price">Price: USDT {{item.price | fmtMoney}}</view>
			<view class="Earnings">Earnings: USDT {{item.profit | fmtMoney}}</view>
			<view class="orderNo">Order No: {{item.sortID}}</view>
			<view class="Time">Time: {{item.createDate}}</view>
			<view class="total">Total: USDT {{item.price+item.profit | fmtMoney}}</view>

			<view class="btnGroup">
				<view class="cancelBtn btn" @click="handleCancelOrder">Cancel</view>
				<view class="orderBtn btn" @click="submit">Place Order</view>
			</view>
		</view>
		<u-toast ref="uToast" z-index="99999999999999999999999999"/>
		<drag-btn></drag-btn>
	</view>
</template>

<script>
	import {
		nanoid
	} from 'nanoid';
	import {
		OrderConfirm,
		CancelOrder
	} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 50,
				isPhone: false,
				item: null,
				throttling: false, //控制订单支付
			}
		},
		methods: {
			goBack() {
				this.$u.utils.pageToBack('/pages/index/index')
			},
			//实现图片预览功能
			previewImg(imgUrl) {
				uni.previewImage({
					// 当前打开的图片
					current: 0,
					// 预览图片链接
					urls: [imgUrl]
				})
			},

			/* 取消订单 */
			async handleCancelOrder() {
				uni.showLoading();
				const res = await CancelOrder({
					oid: this.item.oid
				});
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
					this.$refs.uToast.show({
						message: this.$t('store.CancelSuccess'),
						type: 'success',
						duration: 2000,
						complete: () => {
							this.$u.utils.pageToBack('/pages/index/index')
						}
					})
				} else {
					this.$refs.uToast.show({
						message: this.$t('store.cancelFail'),
						type: 'error',
						duration: 2000,
					})
				}
			},

			//提交订单信息
			async submit() {
				if (this.throttling) {
					return;
				}
				this.throttling = true;
				const _that = this;
				uni.showLoading();
				const res = await OrderConfirm({
					oid: this.item.oid
				})
				uni.hideLoading();
				const networkError = this.$u.utils.handleNetwork(res);
				if (networkError) {
					this.$refs.uToast.show({
						title: networkError,
						type: 'error',
						duration: 2000,
					})
					this.throttling = false;
					return;
				}
				if (res.data.resultCode == 1) {
					this.$refs.uToast.show({
						message: _that.$t('store.Submitsuccess'),
						type: 'success',
						duration: 2000,
						complete: () => {
							this.throttling = false;
							this.$u.utils.pageToBack('/pages/index/index')
						}
					})
				} else {
					this.throttling = false;
					this.$refs.uToast.show({
						message: _that.$t('config.resultCode' + res.data.resultCode),
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
			this.item = JSON.parse(decodeURIComponent(options.item))
			console.log(this.item);
		},
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
		box-sizing: border-box;

		.back {
			width: 100rpx;
			height: 54rpx;
			position: absolute;
			left: 24rpx;
		}
	}

	.content {
		padding: 0 24rpx;

		.productImgBox {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			box-sizing: border-box;
			height: 604rpx;
			background-color: #fff;
			border-radius: 16rpx;
			margin-top: ;
		}

		.name {
			font-size: 50rpx;
			font-family: "PingFangSC-Regular";
			font-weight: 400;
			text-align: left;
			color: #333333;
			line-height: 68rpx;
			margin-top: 40rpx;
			margin-bottom: 60rpx;
		}

		.price {
			height: 48rpx;
			font-size: 34rpx;
			font-family: "PingFangSC-Medium";
			font-weight: 500;
			text-align: left;
			color: #333333;
			line-height: 48rpx;
			margin-bottom: 8rpx;
		}

		.Earnings {
			.price;
			color: #0DC253;
		}

		.orderNo {
			height: 36rpx;
			font-size: 26rpx;
			font-family: "PingFangSC-Regular";
			font-weight: 400;
			text-align: left;
			color: #333333;
			line-height: 36rpx;
			margin-bottom: 8rpx;
		}

		.Time {
			height: 36rpx;
			font-size: 26rpx;
			font-weight: 400;
			font-family: "PingFangSC-Regular";
			text-align: left;
			color: #999999;
			line-height: 36rpx;
			margin-bottom: 8rpx;
		}

		.total {
			height: 48rpx;
			font-size: 34rpx;
			font-family: "PingFangSC-Medium";
			font-weight: 500;
			text-align: left;
			line-height: 48rpx;
			color: #333333;
		}

		.btnGroup {
			display: flex;
			justify-content: space-between;
			padding-top: 70rpx;
			padding-bottom: 100rpx;

			.btn {
				width: 338rpx;
				height: 90rpx;
				border: 1px solid #3665f2;
				border-radius: 22px;
				background-color: #fff;
				font-size: 30rpx;
				font-family: "PingFangSC-Medium";
				font-weight: 500;
				color: #3564f1;
				text-align: center;
				line-height: 90rpx;
				box-sizing: border-box;

				&.orderBtn {
					background-color: #3665F2;
					color: #ffffff;
				}
			}
		}
	}
</style>
