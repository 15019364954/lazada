<template>
	<view class="orderList">
		<view class="item" v-for="(item,index) in dataList" :key="item.oid" @click="_GetOrderInfo(item)">
			<u--image :src="item.imgUrl" width="200rpx" height="200rpx" mode="widthFix" class="productImg"
				radius="16rpx">
				<!-- <view slot="error" style="font-size: 24rpx;" class="errorImage"></view> -->
			</u--image>
			<view class="bottom">
				<view class="name">
					<view class="text u-line-2">{{item.pName}}</view>
				</view>
				<view class="productPriceText">Commodity prices</view>
				<view class="productPrice">{{item.price}}</view>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		GetOrderInfo
	} from '@/common/api.js';
	export default {
		name: "orderList",
		props: {
			orderList: {
				type: Array || null,
				default: () => {
					return null;
				}
			},
			lid: {
				type: String||null,
				default: () => {
					return null
				}
			},
		},
		data() {
			return {
				dataList: null,
				Timer: null,
			};
		},
		watch: {
			'orderList'(next, pre) {
				//首次截取前十条
				if (next.length) {
					this.dataList = next.slice(0, 12);
					let _this = this;
					_this.$nextTick(() => {
						_this.Timer = setInterval(() => {
							console.log(1111);
							//获取当前显示数据的最大的id值，截取数据源中的数据添加进去
							let copyData = [..._this.dataList].sort((a, b) => {
								return a._id - b._id;
							});
							if (copyData[copyData.length - 1]['_id'] <= 96) {
								//截取四条数据
								let id = copyData[copyData.length - 1]['_id'];
								let arr = next.slice(id, id + 4);
								let randomNum = _this.getRandomNum(0, 9, 4);
								for (let i = 0; i < 4; i++) {
									_this.$set(_this.dataList, randomNum[i], arr[i])
								}
							} else {
								this.dataList = next.slice(0, 12);
							}
						}, 3000);
					})
				}
			}
		},
		destroyed() {
			clearInterval(this.Timer)
			this.Timer = null;
		},
		methods: {
			//生成四个不重复随机数
			getRandomNum(min, max, countNum) {
				let arr = [];
				for (let i = 0; i < countNum; i++) {
					let number = Math.floor(Math.random() * (max - min) + min);
					if (arr.indexOf(number) == -1) { //去除重复项
						arr.push(number)
					} else {
						i--;
					}
				}
				return arr;
			},

			//获取商品列表
			async _GetOrderInfo(item) {
				//发送请求获取订单信息
				const params = {
					pageSize: 100,
					lid: this.lid,
					pid: item.pid,
					userID: uni.getStorageSync('userInfo').userID
				}
				uni.showLoading();
				const res = await GetOrderInfo(params);
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
					//跳转到商城页面
					let data = JSON.stringify(res.data.resultData);
					this.$u.route({
						type: 'navigateTo',
						url: `/pages/lazada-mall/lazada-mall?item=${encodeURIComponent(data)}`,
					})
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.orderList {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 40rpx;

		.item {
			flex: 0 0 47%;
			height: max-content;
			background-color: #fff;
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 28rpx 20rpx;
			justify-content: space-between;
			box-sizing: border-box;

			.bottom {
				margin-top: 20rpx;

				.name {
					height: 72rpx;
					font-size: 26rpx;
					font-family: 'PingFangSC-Medium';
					font-weight: 500;
					text-align: left;
					color: #333333;
					display: flex;
					align-items: center;
				}

				.productPriceText {
					height: 32rpx;
					font-size: 22rpx;
					font-family: "PingFangSC-Regular";
					font-weight: 400;
					text-align: left;
					color: #999999;
					line-height: 32rpx;
					margin-top: 8rpx;
					margin-bottom: 12rpx;
				}

				.productPrice {
					height: 36rpx;
					font-size: 26rpx;
					font-family: "PingFangSC-Medium";
					font-weight: 500;
					text-align: left;
					color: #f89665;
					line-height: 36rpx;
				}
			}
		}
	}
</style>
