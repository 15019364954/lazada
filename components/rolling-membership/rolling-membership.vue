<template>
	<view class="uni-margin-wrap">
		<swiper class="swiper" circular :indicator-dots="false" :autoplay="autoplay" :easing-function="easing"
			:interval="interval" :duration="duration" :vertical="true" :circular="true">
			<swiper-item class="swiper-item-box" v-for="(item,index) in member" :key="index">
				<view class="swiper-items">
					<view class="left">
						<u--image :src="item.avatar" width="66rpx" height="66rpx" mode="widthFix"></u--image>
						<view class="userINfo">
							<view class="name">{{item.userName}}</view>
							<view class="userID">{{item.userId}}</view>
						</view>
					</view>
					<view class="level">{{item.level}}</view>
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
				interval: 1500,
				duration: 5000,
				easing: "linner",
				member:[
					{
						avatar: require("../../static/image/vipAvatar/1.png"),
						userName: 'Vendy phang',
						userId: '62*******3289',
						level: 'Trainee Manager',
					},
					{
						avatar: require("../../static/image/vipAvatar/2.png"),
						userName: 'Fu sin',
						userId: '62*******5928',
						level: 'Senior Manager',
					},
					{
						avatar: require("../../static/image/vipAvatar/3.png"),
						userName: 'RetnaSoe',
						userId: '62*******5781',
						level: 'Senior Manager',
					},
					{
						avatar: require("../../static/image/vipAvatar/4.png"),
						userName: 'Atan fam',
						userId: '62*******0909',
						level: 'Trainee Manager',
					},
					{
						avatar: require("../../static/image/vipAvatar/5.png"),
						userName: 'Meg ing',
						userId: '62*******5372',
						level: 'Manager',
					},
					{
						avatar: require("../../static/image/vipAvatar/6.png"),
						userName: 'Johar kasdi',
						userId: '62*******6835',
						level: 'Senior Manager',
					},
					{
						avatar: require("../../static/image/vipAvatar/7.png"),
						userName: 'Febrii Listianto',
						userId: '62*******1934',
						level: 'Senior Manager',
					},
					{
						avatar: require("../../static/image/vipAvatar/8.png"),
						userName: 'Rose Cerry',
						userId: '62*******6849',
						level: 'Manager',
					},
					{
						avatar: require("../../static/image/vipAvatar/9.png"),
						userName: 'Ting Ting',
						userId: '62*******2389',
						level: 'Manager',
					},
					{
						avatar: require("../../static/image/vipAvatar/10.png"),
						userName: 'Budin Chun Phing',
						userId: '62*******5720',
						level: 'Manager',
					},
				]
			};
		}
	}
</script>

<style lang="less" scoped>
	.uni-margin-wrap {
		width: 690rpx;
		width: 100%;
		height: 180rpx;
	}

	.swiper {
		height: 180rpx;
	}

	/deep/ .uni-swiper-slide-frame {
		height: 50% !important;
	}

	.swiper-items {
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.left{
			display: flex;
			align-items: center;
			.userINfo{
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: flex-start;
				margin-left: 20rpx;
				.name{
					height: 24rpx;
					font-size: 24rpx;
					font-family: "PingFangSC-Medium";
					// font-weight: 500;
					color: #333333;
					text-align: left;
					line-height: 24rpx;
				}
				.userID{
					height: 20rpx;
					font-size: 20rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					color: #666666;
					line-height: 20rpx;
					margin-top: 8rpx;
					text-align: left;
				}
			}
		}
		.level{
			height: 34rpx;
			font-size: 24rpx;
			font-family: "PingFangSC-Medium";
			// font-weight: 500;
			text-align: left;
			color: #fe6067;
			line-height: 34rpx;
		}
	}
</style>
