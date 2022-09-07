<template>
	<view class="uni-margin-wrap">
		<swiper class="swiper" circular :indicator-dots="false" :autoplay="autoplay" :easing-function="easing"
			:interval="interval" 
			:duration="duration" 
			:vertical="false" 
			:circular="true" 
			:previous-margin="'0rpx'"
			:next-margin="'-10rpx'"
			:display-multiple-items="2"
			>
			<swiper-item v-for="(item,index) in goodsList" :key="index" class="swiper-item-box">
				<view class="swiper-items">
					<u--image :src="item.imgUrl" width="290rpx" height="278rpx" mode="widthFix" radius="16rpx"></u--image>
					<view class="bottom">
						<view class="name u-line-1">{{item.name}}</view>
						<view class="price">prices: USDT {{item.price}}</view>
						<view class="quantity">quantity: {{item.quantity}}</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name: "rolling-membership",
		data() {
			return {
				swrapList: [], //轮播图数据
				background: ['color1', 'color2', 'color3'],
				indicatorDots: false,
				autoplay: true,
				interval: 3000,
				duration: 500,
				easing: "linner",
				goodsList:[
					{
						imgUrl: require("../../static/image/goods/1.jpg"),
						name: "Fenty Skin Full-Size Start'r Set Includes Full Sized Total Cleans'r Fat Water...",
						price: 137.680,
						quantity: 3440,
					},
					{
						imgUrl: require("../../static/image/goods/2.jpg"),
						name: "Women Pointed Toe High Heels Square Heel Slip on Pump Lady Office Shoes Footwear",
						price: 43.540,
						quantity: 2070,
					},
					{
						imgUrl: require("../../static/image/goods/3.jpg"),
						name: "Women Pointed Toe High Heels Square Heel Slip on Pump Lady Office Shoes Footwear",
						price: 43.540,
						quantity: 2070,
					},
					{
						imgUrl: require("../../static/image/goods/4.jpg"),
						name: "Women Pointed Toe High Heels Square Heel Slip on Pump Lady Office Shoes Footwear",
						price: 43.540,
						quantity: 2070,
					},
					{
						imgUrl: require("../../static/image/goods/5.jpg"),
						name: "Women Pointed Toe High Heels Square Heel Slip on Pump Lady Office Shoes Footwear",
						price: 43.540,
						quantity: 2070,
					},
					{
						imgUrl: require("../../static/image/goods/6.jpg"),
						name: "Women Pointed Toe High Heels Square Heel Slip on Pump Lady Office Shoes Footwear",
						price: 43.540,
						quantity: 2070,
					},
					{
						imgUrl: require("../../static/image/goods/7.jpg"),
						name: "Women Pointed Toe High Heels Square Heel Slip on Pump Lady Office Shoes Footwear",
						price: 43.540,
						quantity: 2070,
					},
					{
						imgUrl: require("../../static/image/goods/8.jpg"),
						name: "Women Pointed Toe High Heels Square Heel Slip on Pump Lady Office Shoes Footwear",
						price: 43.540,
						quantity: 2070,
					},
					{
						imgUrl: require("../../static/image/goods/9.jpg"),
						name: "Women Pointed Toe High Heels Square Heel Slip on Pump Lady Office Shoes Footwear",
						price: 43.540,
						quantity: 2070,
					},
					{
						imgUrl: require("../../static/image/goods/10.png"),
						name: "Women Pointed Toe High Heels Square Heel Slip on Pump Lady Office Shoes Footwear",
						price: 43.540,
						quantity: 2070,
					},
					
				]
			};
		}
	}
</script>

<style lang="less" scoped>
	.uni-margin-wrap {
		width: 100%;
		padding-left: 24rpx;
		box-sizing: border-box;
		height: 436rpx;
	}
	.swiper{
		height: 436rpx;
	}
	.swiper-item-box{
		// width: 318rpx!important;
		// padding-right: 24rpx;
		display: flex;
		justify-content: flex-start;
		.swiper-items{
			width: 318rpx;
			box-sizing: border-box;
			padding: 14rpx;
			background-color: #FE6067;
			border-radius: 16rpx;
			height: 436rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;
			.bottom{
				.name{
					width: 194rpx;
					height: 34rpx;
					font-size: 24rpx;
					font-family: "PingFangSC-Medium";
					// font-weight: 500;
					text-align: left;
					color: #ffffff;
					line-height: 34rpx;
					display: -webkit-box!important;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical!important;
				}
				.price{
					// width: 198rpx;
					height: 28rpx;
					font-size: 20rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					text-align: left;
					color: #ffffff;
					line-height: 28rpx;
				}
				.quantity{
					height: 28rpx;
					font-size: 20rpx;
					font-family: "PingFangSC-Regular";
					text-align: left;
					// font-weight: 400;
					color: #ffffff;
					line-height: 28rpx;
					margin-top: 8rpx;
				}
			}
		}
	}
</style>
