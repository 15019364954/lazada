<template>
	<view class="main">
		<!-- 自定义头部 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			{{$t('noticeDetail.title')}}
		</view>
		
		<view class="content" :style="{paddingTop:statusBarHeight-60+65+'px'}">
			<view class="notice">
				<rich-text :nodes="item&&item.content"></rich-text>
				<view class="date">{{$t('noticeDetail.publishDate')}}：<text>{{item&&item.publishDateTime}}</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 60,  //刘海默认高度
				isPhone: false, //是否是手机
				item: null, 
			}
		},
		methods: {
			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/index/index');
			},
		},
		onLoad(options) {
			//获取系统刘海高度
			//#ifdef APP-PLUS
				let statusBarObj = this.getPhoneInfo();
				this.isPhone = true;
				this.statusBarHeight = statusBarObj.statusBarHeight+this.statusBarHeight;
			//#endif
			this.item = JSON.parse(decodeURIComponent(options.item))
		},
		onShow() {
			if(!this.$u.utils.Permissions()) return;
		}
	}
</script>

<style lang="less" scoped>
	page{
		height: 100%;
		background-color: #f7f7f7;
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
	.content{
		padding: 60px 24rpx 0 24rpx;
		font-family: "PingFangSC-Medium";
		color: #005652;
		.notice{
			margin-top: 20rpx;
			line-height: 30px;
			background: #fff;
			padding: 20rpx;
			border-radius: 20rpx;
			.date{
				height: 36rpx;
				font-size: 24rpx;
				font-family: "PingFangSC-Regular";
				// font-weight: 400;
				text-align: right;
				color: #999999;
				line-height: 36rpx;
				margin-top: 48rpx;
				margin-bottom: 30rpx;
			}
		}
	}
</style>
