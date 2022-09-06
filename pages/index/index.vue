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


			<!-- 底部分割线 -->
			<view class="DividingLine">
				<view class="line"></view>
				<view class="text">Our partners</view>
			</view>

			<!-- 合作伙伴 -->
			<view class="Partner">
				<view class="PartnerBg"></view>
			</view>

			<!-- 分享秀 -->
			<view class="shareShow">
				<view class="title">Our Superstars Show</view>
				<view class="messageBox">
					<view class="avatar"></view>
					<view class="messageContent">
						<view class="messageTitle">Lupita Nyong’o</view>
						<view class="messageContainer">
							I‘m a single mether and I don't have time to take care of my son during the week. Since i
							came across the platform, I have been working hard and making a lot of money with only a
							small investment. With the money I earned form the platform, I also opened my own
							brick-and-mortar
						</view>
					</view>
				</view>
				<!-- 底部 -->
				<view class="bottom">
					<view class="title_1">Earn Money From Home</view>
					<view class="title_1">Start earning in 2minutes</view>
					<view class="item">
						<u--image src="../../static/image/index/message_classIcon1.png" width="40rpx" height="40rpx"
							mode="widthFix"></u--image>
						<view class="text">1. Choose a grouping group and click “Profit”</view>
					</view>
					<view class="item">
						<u--image src="../../static/image/index/message_classIcon2.png" width="40rpx" height="40rpx"
							mode="widthFix"></u--image>
						<view class="text">2. Choose a grouping group and click “Profit”</view>
					</view>
					<view class="item">
						<u--image src="../../static/image/index/message_classIcon3.png" width="40rpx" height="40rpx"
							mode="widthFix"></u--image>
						<view class="text">3. Choose a grouping group and click “Profit”</view>
					</view>
					<view class="item">
						<u--image src="../../static/image/index/message_classIcon4.png" width="40rpx" height="40rpx"
							mode="widthFix"></u--image>
						<view class="text">4. Choose a grouping group and click “Profit”</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 弹窗公告 -->
		<u-popup :show="PoupShow" @close="close" bgColor="transparent" class="popUpAnnouncement" mode="center"
			:mask-close-able="false" :closeable="false">
			<view class="content">
				<view class="title">
					Information
					<u-icon name="close" color="#BBBBBB" size="36rpx" class="close_icon"  @click="close"></u-icon>
				</view>
				<scroll-view class="scroll-view_H" scroll-y="true" scroll-left="120" style="height:300rpx">
					<rich-text :nodes="NoticeData"></rich-text>
				</scroll-view>
				<wyb-button class="close" type="hollow" :ripple="true" @click="close">Confirm</wyb-button>
			</view>
		</u-popup>

		<drag-btn></drag-btn>
		
		<u-toast ref="uToast"></u-toast>
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
				TaskHallData: null,
				PoupShow: false, //是否显示弹窗
				NoticeData: "", //全局弹窗数据
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
			//关闭全局公告
			close() {
				this.PoupShow = false;
				uni.setStorageSync('isPopup', true);
			},
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

			//获取首页弹窗公告
			async GetNoticeList() {
				const params = {
					pageIndex: 1,
					pageSize: 10,
				}
				const res = await GetMsgNoticeList(params);
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
					const msgNoticeList = res.data.resultData.msgNoticeList;
					this.NoticeData = res.data.resultData.msgNoticeList[0].content;
					//滚动通知的内容需要匹配去掉html标记
					//循环剔除标记
					let Noticelist = []
					for (const elem of msgNoticeList) {
						let content = elem.content.replace(/<[^>]+>/g, "");
						content = content.replace(/&nbsp;/g, "  ");
						Noticelist = [...Noticelist, content];
					}
					this.Noticelist = Noticelist.join('。');
					//判断公告是否已经显示
					if (uni.getStorageSync('isPopup')) {
						this.PoupShow = false //设置会false
					} else {
						if (uni.getStorageSync('isDistribution') == "1") {
							this.PoupShow = true
							uni.setStorageSync('isPopup', true)
						}
					}
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
			/* 获取公告内容 */
			this.GetNoticeList();
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

		/* 分割线 */
		.DividingLine {
			margin: 24rpx 0;
			padding: 0 24rpx;
			height: 34rpx;
			display: flex;
			position: relative;
			align-items: center;

			.line {
				width: 100%;
				height: 1rpx;
				background-color: #E1E1E1;
			}

			.text {
				position: absolute;
				width: 150rpx;
				height: 34rpx;
				line-height: 34rpx;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				background-color: #F7F7F7;
				font-size: 24rpx;
				font-family: 'PingFangSC-Regular';
				font-weight: 400;
				text-align: center;
				color: #999999;
			}
		}

		/* 合作伙伴 */
		.Partner {
			padding: 0 24rpx;
			width: 100%;
			box-sizing: border-box;
			padding-bottom: 48rpx;

			.PartnerBg {
				width: 100%;
				height: 132rpx;
				background: url("../../static/image/index/partners.png") no-repeat center center;
				background-size: 100% 132rpx;
			}
		}

		/* 分享秀 */
		.shareShow {
			width: 100%;
			box-sizing: border-box;
			height: max-content;
			padding: 36rpx 48rpx;
			background-color: #3F3F47;

			.title {
				height: 52rpx;
				font-size: 38rpx;
				font-family: "PingFangSC-Medium";
				font-weight: 500;
				text-align: left;
				color: #fe6067;
				line-height: 52rpx;
				margin-bottom: 20rpx;
			}

			.messageBox {
				display: flex;

				.avatar {
					flex: 0 0 70rpx;
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					background: url("../../static/image/index/userMessage.jpg")no-repeat center center;
					background-size: 70rpx 70rpx;
				}

				.messageContent {
					margin-left: 14rpx;

					.messageTitle {
						height: 40rpx;
						font-size: 28rpx;
						font-family: "PingFangSC-Regular";
						font-weight: 400;
						text-align: left;
						color: #fe6067;
						line-height: 40rpx;
						margin-left: 14rpx;
					}

					.messageContainer {
						box-sizing: border-box;
						width: 527rpx;
						height: 358rpx;
						background: url("../../static/image/index/userMessageBg.png")no-repeat center center;
						background-size: 527rpx 358rpx;
						margin-top: 8rpx;
						padding: 10rpx 26rpx 6rpx 53rpx;

						font-size: 28rpx;
						font-family: "PingFangSC-Regular";
						font-weight: 400;
						text-align: left;
						color: #bbbbbb;
						line-height: 38rpx;

						display: -webkit-box !important;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
						-webkit-line-clamp: 9;
						-webkit-box-orient: vertical !important;
					}
				}
			}

			/* 底部分类 */
			.bottom {
				.title_1 {
					margin-top: 48rpx;
					margin-bottom: 32rpx;
					height: 52rpx;
					font-size: 38rpx;
					font-family: "PingFangSC-Semibold";
					font-weight: 600;
					text-align: left;
					color: #fe6067;
					line-height: 52rpx;
				}

				.item {
					display: flex;
					align-items: center;

					.text {
						margin-left: 22rpx;
						height: 80rpx;
						font-size: 28rpx;
						font-family: "PingFangSC-Regular";
						font-weight: 400;
						text-align: left;
						color: #666666;
						line-height: 80rpx;
					}
				}
			}
		}
	}

	/* 弹出公告 */
	.popUpAnnouncement {
		.content {
			width: 618rpx;
			height: 610rpx;
			border-radius: 16rpx;
			background-color: #ffffff;
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-evenly;
			.title{
				width: 100%;
				height: 44rpx;
				font-size: 32rpx;
				font-family: "PingFangSC-Medium";
				font-weight: 700;
				text-align: center;
				color: #025551;
				line-height: 44rpx;
				position: relative;
				.close_icon{
					position: absolute;
					right: 32rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
			.scroll-view_H{
				width: 530rpx;
				font-size: 46rpx;
				font-family: "PingFangSC-Semibold";
				font-weight: 600;
				text-align: left;
				color: #333333;
				line-height: 56rpx;
			}
			.close {
				width: 530rpx !important;
				/deep/.wyb-button {
					height: 84rpx;
					border: none !important;
					border-radius: 42rpx !important;
					line-height: 84rpx;
					text-align: center;
					font-size: 26rpx;
					font-family: "PingFangSC-Medium";
					font-weight: 700;
					color: #fff !important;
					box-sizing: border-box;
					background: linear-gradient(304deg,#ff8588 8%, #ff5261 85%);
				}
			}
		}
	}
</style>
