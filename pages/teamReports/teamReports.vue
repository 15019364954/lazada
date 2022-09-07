<template>
	<view class="reports">
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			{{$t('teamReport.title')}}
		</view>
		<view class="" :style="{paddingTop: isPhone?statusBarHeight+'px':50+'px'}"></view>
		
		<view class="container">
			<!-- 分享信息 -->
			<view class="shareMessage">
				<!-- 邀请码 -->
				<view class="invCode">
					<view class="title">Referral Code</view>
					<view class="code_copy">
						<view class="code">P7OFIEB0</view>
						<view class="copy">Copy</view>
					</view>
				</view>
				
				<!-- 链接 -->
				<view class="invLink">
					<view class="title">Referral Code</view>
					<view class="link_copy">
						<view class="link">https://go-bays.com/#/pages/l…</view>
						<view class="copy">Copy</view>
					</view>
				</view>
				
				<!-- 媒体分享 -->
				<view class="media">
					<view class="item">
						<u-image src="../../static/image/team/What_sApp.png" width="40rpx" height="40rpx" mode="scaleToFill"
						:lazyLoad="false" class="setting"></u-image>
						<view class="text">What'sApp</view>
					</view>
					<view class="item">
						<u-image src="../../static/image/team/telegram.png" width="40rpx" height="40rpx" mode="scaleToFill"
						:lazyLoad="false" class="setting"></u-image>
						<view class="text">Telegram</view>
					</view>
					<view class="item">
						<u-image src="../../static/image/team/youxiang.png" width="40rpx" height="40rpx" mode="scaleToFill"
						:lazyLoad="false" class="setting"></u-image>
						<view class="text">Email</view>
					</view>
					<view class="item">
						<u-image src="../../static/image/team/facebook.png" width="40rpx" height="40rpx" mode="scaleToFill"
						:lazyLoad="false" class="setting"></u-image>
						<view class="text">Facebook</view>
					</view>
					<view class="item">
						<u-image src="../../static/image/team/twitter.png" width="40rpx" height="40rpx" mode="scaleToFill"
						:lazyLoad="false" class="setting"></u-image>
						<view class="text">Twitter</view>
					</view>
					<view class="item">
						<u-image src="../../static/image/team/line.png" width="40rpx" height="40rpx" mode="scaleToFill"
						:lazyLoad="false" class="setting"></u-image>
						<view class="text">Line</view>
					</view>
				</view>
			</view>
			
			<!-- 信息模块 -->
			<view class="messageModul">
				<view class="messageModul_title">
					<view class="icon"></view>
					<view class="title">Referral Rewards</view>
				</view>
				<view class="messageModul_content">
					<view class="top">
						<view class="item">
							<view class="item_text left">Today's commission</view>
							<view class="item_value">10</view>
						</view>
						<view class="item">
							<view class="item_text center">Today's commission</view>
							<view class="item_value center">10</view>
						</view>
						<view class="item">
							<view class="item_text right">Today's commission</view>
							<view class="item_value right">10</view>
						</view>
					</view>
					<view class="viewRecord">
						View Records
					</view>
				</view>
				
				<view class="messageModul_title">
					<view class="icon"></view>
					<view class="title">Referral Rewards</view>
				</view>
				<view class="messageModul_content">
					<view class="top">
						<view class="item">
							<view class="item_text left">Today's commission</view>
							<view class="item_value">10</view>
						</view>
						<view class="item">
							<view class="item_text center">Today's commission</view>
							<view class="item_value center">10</view>
						</view>
						<view class="item">
							<view class="item_text right">Today's commission</view>
							<view class="item_value right">10</view>
						</view>
					</view>
					<view class="viewRecord">
						View Records
					</view>
				</view>
				
				<view class="messageModul_title">
					<view class="icon"></view>
					<view class="title">Referral Rewards</view>
				</view>
				<view class="messageModul_content">
					<view class="top">
						<view class="item">
							<view class="item_text left">Today's commission</view>
							<view class="item_value">10</view>
						</view>
						<view class="item">
							<view class="item_text center">Today's commission</view>
							<view class="item_value center">10</view>
						</view>
						<view class="item">
							<view class="item_text right">Today's commission</view>
							<view class="item_value right">10</view>
						</view>
					</view>
					<view class="viewRecord">
						View Records
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isPhone: false,
				statusBarHeight: 50, //刘海默认高度
			}
		},
		methods: {

		},
		onLoad() {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
		},
	}
</script>
<style>
	page{
		background-color: #f7f7f7;
	}
</style>
<style lang="less" scoped>
	.header {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #ddd;
		font-size: 32rpx;
		font-family: "Helvetica";
		font-weight: 700;
		color: #fe6067;
		background-color: #fff;
		z-index: 100;
	}
	
	
	.container{
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;
		/* 分享信息 */
		.shareMessage{
			width: 100%;
			min-height: 300rpx;
			border-radius: 16rpx;
			background-color: #fff;
			margin-top: 24rpx;
			margin-bottom: 30rpx;
			padding: 30rpx 24rpx;
			box-sizing: border-box;
			.invCode{
				margin-bottom: 48rpx;
				.title{
					height: 34rpx;
					font-size: 24rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					text-align: left;
					color: #005652;
					line-height: 34rpx;
				}
				
				.code_copy{
					margin-top: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.code{
						height: 64rpx;
						font-size: 36rpx;
						font-family: "Helvetica";
						// font-weight: 400;
						text-align: left;
						color: #fe6067;
						line-height: 64rpx;
					}
					.copy{
						width: 160rpx;
						height: 64rpx;
						background: linear-gradient(308deg,#ff5261 10%, #ff8588 87%);
						border-radius: 40rpx;
						box-shadow: 0px 0px 20rpx 6rpx rgba(0,0,0,0.10); 
						line-height: 64rpx;
						font-size: 28rpx;
						font-family: "Helvetica";
						font-weight: 400;
						text-align: center;
						color: #ffffff;
					}
				}
			}
			
			/* 分享链接 */
			.invLink{
				margin-bottom: 48rpx;
				.title{
					height: 34rpx;
					font-size: 24rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					text-align: left;
					color: #005652;
					line-height: 34rpx;
				}
				
				.link_copy{
					margin-top: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.link{
						height: 64rpx;
						font-size: 36rpx;
						font-family: "Helvetica";
						// font-weight: 400;
						text-align: left;
						color: #fe6067;
						line-height: 64rpx;
						display: -webkit-box !important;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical !important;
						margin-right: 20rpx;
					}
					.copy{
						width: 160rpx;
						height: 64rpx;
						background: linear-gradient(308deg,#ff5261 10%, #ff8588 87%);
						border-radius: 40rpx;
						box-shadow: 0px 0px 20rpx 6rpx rgba(0,0,0,0.10); 
						line-height: 64rpx;
						font-size: 28rpx;
						font-family: "Helvetica";
						font-weight: 400;
						text-align: center;
						color: #ffffff;
						
					}
				}
			}
			
			.media{
				display: flex;
				flex-wrap: wrap;
				.item{
					flex: 0 0 33.33%;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					margin-top: 20rpx;
					.text{
						margin-left: 20rpx;
						height: 24rpx;
						font-size: 24rpx;
						font-family: "PingFangSC-Regular";
						// font-weight: 400;
						text-align: left;
						color: #005652;
						line-height: 24rpx;
					}
				}
			}
		}
		
		.messageModul{
			padding-bottom: 30rpx;
			.messageModul_title{
				margin-top: 30rpx;
				display: flex;
				align-items: center;
				margin-bottom: 18rpx;
				.icon{
					width: 8rpx;
					height: 28rpx;
					border-radius: 4rpx;
					background-color: #FE6067;
					margin-right: 8rpx;
				}
				.title{
					height: 40rpx;
					font-size: 28rpx;
					font-family: "PingFangSC-Medium";
					// font-weight: 500;
					text-align: left;
					color: #005652;
					line-height: 40rpx;
				}
			}
			
			.messageModul_content{
				width: 100%;
				min-height: 200rpx;
				background-color: #fff;
				border-radius: 16rpx;
				box-sizing: border-box;
				padding: 30rpx 24rpx;
				.top{
					display: flex;
					justify-content: space-between;
					.item_text{
						height: 80rpx;
						font-size: 28rpx;
						font-family: "PingFangSC-Regular";
						// font-weight: 400;
						text-align: right;
						color: #005652;
						&.left{
							text-align: left;
						}
						&.center{
							text-align: center;
						}
						&.right{
							text-align: right;
						}
					}
					.item_value{
						height: 32rpx;
						font-size: 32rpx;
						font-family: "D-Bold";
						// font-weight: 400;
						text-align: left;
						color: #ffaa03;
						line-height: 32rpx;
						margin-top: 16rpx;
						&.right{
							text-align: right;
						}
						&.center{
							text-align: center;
						}
					}
				}
				.viewRecord{
					width: 100%;
					height: 80rpx;
					border: 1px solid transparent;
					background-image: linear-gradient(to right, #fff, #fff), linear-gradient(90deg, #ff8588, #ff5261);
					background-clip: padding-box, border-box;
					  background-origin: padding-box, border-box;
					border-radius: 42rpx;
					box-sizing: border-box;
					text-align: center;
					line-height: 80rpx;
					margin-top: 64rpx;
					font-size: 30rpx;
					font-family: "Helvetica";
					// font-weight: 700;
					text-align: center;
					color: #fe6067;
				}
			}
		}
	}
</style>
