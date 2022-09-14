<template>
	<view class="main">
		<!-- 自定义头部 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			{{$t('OfficialAnnouncement.title')}}
		</view>
		
		<view class="content" :style="{paddingTop:statusBarHeight+12+'px'}">
			<view class="list">
				<view class="item" v-for="item in Noticelist" @click="handleNotice(item)">
					<!-- <u-icon name="volume" size="60" color="#F9262D"></u-icon> -->
					<view class="right">
						<view class="title u-line-1">{{item.title}}</view>
						<view class="date">{{$t('OfficialAnnouncement.publishDate')}}：<text>{{item.publishDateTime}}</text></view>
					</view>
					<u-icon name="arrow-right" size="40" color="#C0C1CD"></u-icon>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { GetMsgNoticeList} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 60,  //刘海默认高度
				isPhone: false, //是否是手机
				Noticelist:null, //公告列表数据
			}
		},
		methods: {
			
			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/Account/Account');
			},
			
			/* 获取弹窗公告 */
			async GetNoticeList () {
				uni.showLoading();
				const params = {
					pageIndex: 1,
					pageSize: 100,
				}
				const res = await GetMsgNoticeList(params);
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
				if(res.data.resultCode == 1) {
					const msgNoticeList = res.data.resultData.msgNoticeList;
					//循环剔除标记
					this.Noticelist  = msgNoticeList;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode"+res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
			
			//点击跳转到公告详情
			handleNotice(item) {
				let data = JSON.stringify(item);
				this.$u.route({
					type:'navigateTo',
					url: `/pages/noticeDeatil/noticeDeatil?item=${encodeURIComponent(data)}`
				})
			}
		},
		onLoad() {
			//获取系统刘海高度
			//#ifdef APP-PLUS
				let statusBarObj = this.getPhoneInfo();
				this.isPhone = true;
				this.statusBarHeight = statusBarObj.statusBarHeight+this.statusBarHeight;
			//#endif
		},
		onShow() {
			if(!this.$u.utils.Permissions()) return;
			this.GetNoticeList();
		}
	}
</script>

<style lang="scss" scoped>
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
		padding-top: 60px;
		.list{
			margin-top: 20rpx;
			padding: 0 20rpx;
			width: 100%;
			box-sizing: border-box;
			padding-bottom: 80rpx;
			background-color: #fff;
			.item{
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #ddd;
				padding: 20rpx 0;
				width: 100%;
				font-family: 'Arial';
				box-sizing: border-box;
				.right{
					flex-grow: 1;
					margin-left: 20rpx;
					box-sizing: border-box;
					.title{
						height: 28rpx;
						font-size: 28rpx;
						font-family: "PingFangSC-Medium";
						// font-weight: 500;
						text-align: left;
						color: #005652;
						line-height: 28rpx;
					}
					.date{
						height: 24rpx;
						font-size: 24rpx;
						font-family: "PingFangSC-Regular";
						// font-weight: 400;
						text-align: left;
						color: #999999;
						line-height: 24rpx;
						margin-top: 20rpx;
					}
				}
			}
		}
	}
</style>
