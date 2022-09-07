<template>
	<view class="item">
		<view :class="'state '+(item&&(item.state=='1'?'':item.state=='0'?'fail':'Pending'))">
			<view v-show="item">
				{{
					item.state=="1"?$t('orderRecord.successed'):item.state=="0"?$t('orderRecord.fail'):$t('orderRecord.pending')
				}}
			</view>
		</view>
		<view class="form">
			<view class="icon"></view>
			<view class="form_address">Form: Lazada</view>
		</view>
		<view class="productName u-line-1">{{item&&item.pName}}</view>
		<view class="content">
			<u-image :src="item&&item.imgUrl" width="176rpx" height="220rpx" mode="scaleToFill" :lazyLoad="false"
				class="productImage"></u-image>
			<view class="right">
				<view class="data">
					<view class="amoney data_item">
						<view class="title">{{$t('orderRecord.Totalamount')}}</view>
						<view class="value">{{item&&item.price|fmtMoney}}</view>
					</view>
					<view class="commission data_item">
						<view class="title">{{$t('orderRecord.Commission')}}</view>
						<view class="value">+{{item&&item.commission|fmtMoney}}</view>
					</view>
				</view>

				<!-- 订单编号 -->
				<view class="orderNo">
					{{$t('orderRecord.Ordernumber')}}: {{item&&item.sortID}}
				</view>

				<!-- 日期 -->
				<view class="date">
					{{$t('orderRecord.Ordertime')}}: {{item&&item.createDate}}
				</view>


				<!-- 操作 -->
				<view class="operate" v-show="item&&item.state=='-1'">
					<view class="cancelBtn" @click="handleCancelOrder(item.oid)">{{$t('orderRecord.cancelBtnText')}}</view>
					<view class="submit" @click="handleSubmitOrder(item.oid)">{{$t('orderRecord.confirmBtnText')}}</view>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		CancelOrder,
		OrderConfirm
	} from '@/common/api.js';
	export default {
		data() {
			return {
				throttling: false, //控制订单支付
			}
		},
		props: {
			item: {
				type: Object || null,
				default: () => {
					return null
				}
			},
			paging: {
				type: Object,
				default: () => {
					return null
				}
			}
		},
		methods: {
			list() {
				let list = [{
					name: this.$t('orderRecord.all')
				}, {
					name: this.$t('orderRecord.successed')
				}, {
					name: this.$t('orderRecord.pending')
				}, {
					name: this.$t('orderRecord.fail')
				}, ];
				return list;
			},
			/* 取消订单 */
			async handleCancelOrder(oid) {
				if (this.throttling) {
					return;
				}
				this.throttling = true;
				uni.showLoading();
				const res = await CancelOrder({
					oid
				});
				uni.hideLoading();
				const networkError = this.$u.utils.handleNetwork(res);
				if (networkError) {
					this.$refs.uToast.show({
						message: networkError,
						type: 'error',
						duration: 2000,
					})
					this.throttling = false;
					return;
				}
				if (res.data.resultCode == 1) {
					this.$refs.uToast.show({
						message: this.$t('orderRecord.cancelSuccess'),
						type: 'success',
						duration: 2000,
						complete: () => {
							this.paging&&this.paging.reload();
							this.throttling = false;
						}
					})
				} else {
					this.throttling = false;
					this.$refs.uToast.show({
						message: this.$t('orderRecord.cancelFail'),
						type: 'error',
						duration: 2000,
					})
				}
			},
			async handleSubmitOrder(oid) {
				if (this.throttling) {
					return;
				}
				this.throttling = true;
				//发送提交请求
				uni.showLoading();
				const res = await OrderConfirm({
					oid
				})
				uni.hideLoading();
				const networkError = this.$u.utils.handleNetwork(res);
				if (networkError) {
					this.$refs.uToast.show({
						message: networkError,
						type: 'error',
						duration: 2000,
					})
					this.throttling = false;
					return;
				}
				if (res.data.resultCode == 1) {
					this.$refs.uToast.show({
						message: this.$t('orderRecord.submitSuccess'),
						type: 'success',
						duration: 2000,
						complete: () => {
							/* 重新获取订单列表 */
							this.$nextTick(()=>{
								this.paging&&this.paging.reload();
							})
						}
					})
				} else {
					this.throttling = false;
					this.$refs.uToast.show({
						message: this.$t('config.resultCode' + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.item {
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 16rpx;
		height: max-content;
		margin-bottom: 20rpx;
		padding: 20rpx 24rpx;
		position: relative;

		.state {
			background-color: rgb(13, 194, 83);
			width: 180rpx;
			height: 46rpx;
			border-top-right-radius: 16rpx;
			border-bottom-left-radius: 16rpx;
			position: absolute;
			right: 0;
			top: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 20rpx;
			font-family: "PingFangSC-Regular";
			// font-weight: 400;
			color: #ffffff;
			
			&.Pending{
				// background-color: #f9ae3d;
			}
			&.fail{
				// background-color: rgb(13, 194, 83);
			}
		}

		.form {
			display: flex;
			align-items: center;

			.icon {
				width: 32rpx;
				height: 32rpx;
				background: url("../../static/image/orderReport/form.png") no-repeat center center;
				background-size: 32rpx 32rpx;
			}

			.form_address {
				height: 28rpx;
				font-size: 22rpx;
				font-family: "Helvetica";
				// font-weight: 400;
				text-align: left;
				color: #bbbbbb;
				line-height: 28rpx;
				margin-left: 12rpx;
			}
		}

		.productName {
			height: 38rpx;
			font-size: 28rpx;
			font-family: "Helvetica";
			// font-weight: 400;
			text-align: left;
			color: #12584d;
			line-height: 38rpx;
			margin-top: 22rpx;
			margin-bottom: 20rpx;
		}

		.content {
			display: flex;
			align-items: center;

			.productImage {
				margin-right: 24rpx;
			}

			.right {
				flex: 1;
				box-sizing: border-box;

				.data {
					display: flex;

					.data_item {
						flex: 0 0 50%;
						display: flex;
						box-sizing: border-box;
						flex-direction: column;
						justify-content: flex-start;

						.title {
							height: 30rpx;
							font-size: 24rpx;
							font-family: "Helvetica";
							// font-weight: 400;
							text-align: left;
							color: #999999;
							line-height: 30rpx;
						}

						.value {
							height: 38rpx;
							font-size: 32rpx;
							// font-weight: 700;
							font-family: "Helvetica";
							text-align: left;
							color: #f386a4;
							line-height: 38rpx;
							margin-top: 4rpx;
							margin-bottom: 12rpx;
						}
					}
				}

				.orderNo {
					height: 32rpx;
					font-size: 22rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					text-align: left;
					color: #bbbbbb;
					line-height: 32rpx;
				}

				.date {
					.orderNo;
					margin-top: 10rpx;
					margin-bottom: 20rpx;
				}

				.operate {
					display: flex;

					.cancelBtn {
						width: 168rpx;
						height: 56rpx;
						border: 1rpx solid #fe6067;
						border-radius: 29rpx;
						text-align: center;
						line-height: 56rpx;

						font-size: 24rpx;
						font-family: "PingFangSC-Regular";
						// font-weight: 400;
						color: #fe6067;
					}

					.submit {
						.cancelBtn;
						margin-left: 46rpx;
						background-color: #FE6067;
						color: #fff;
					}
				}
			}
		}
	}
</style>
