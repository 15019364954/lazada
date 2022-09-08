<template>
	<view class="reports">
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			{{$t('teamReport.title')}}
		</view>
		<view class="tabs" :style="{top: statusBarHeight+'px'}">
			<v-tabs height="40px" v-model="current" :tabs="list()" :scroll="false" @change="Tabchage" color="#A6C4C3"
				activeColor="#FE6067" lineColor="#FE6067" lineRadius="24rpx">
			</v-tabs>
		</view>
		<view class="" :style="{paddingTop: isPhone?statusBarHeight+40+'px':50+40+'px'}"></view>
		<view class="container">
			<!-- 分享信息 -->
			<view class="shareMessage">
				<!-- 邀请码 -->
				<view class="invCode">
					<view class="title">{{$t('account.InvitationCode')}}</view>
					<view class="code_copy">
						<view class="code">{{MyReport&&MyReport.invitationCode}}</view>
						<view class="copy">Copy</view>
					</view>
				</view>

				<!-- 链接 -->
				<view class="invLink">
					<view class="title">Share link</view>
					<view class="link_copy">
						<view class="link">https://go-bays.com/#/pages/l…</view>
						<view class="copy">Copy</view>
					</view>
				</view>

				<!-- 媒体分享 -->
				<view class="media">
					<view class="item">
						<u-image src="../../static/image/team/What_sApp.png" width="40rpx" height="40rpx"
							mode="scaleToFill" :lazyLoad="false" class="setting"></u-image>
						<view class="text">What'sApp</view>
					</view>
					<view class="item">
						<u-image src="../../static/image/team/telegram.png" width="40rpx" height="40rpx"
							mode="scaleToFill" :lazyLoad="false" class="setting"></u-image>
						<view class="text">Telegram</view>
					</view>
					<view class="item">
						<u-image src="../../static/image/team/youxiang.png" width="40rpx" height="40rpx"
							mode="scaleToFill" :lazyLoad="false" class="setting"></u-image>
						<view class="text">Email</view>
					</view>
					<view class="item">
						<u-image src="../../static/image/team/facebook.png" width="40rpx" height="40rpx"
							mode="scaleToFill" :lazyLoad="false" class="setting"></u-image>
						<view class="text">Facebook</view>
					</view>
					<view class="item">
						<u-image src="../../static/image/team/twitter.png" width="40rpx" height="40rpx"
							mode="scaleToFill" :lazyLoad="false" class="setting"></u-image>
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
					<view class="title">{{$t('teamReport.MyTeam')}}</view>
				</view>

				<!-- 团队人数 -->
				<view class="messageModul_content">
					<view class="top">
						<view class="item">
							<view class="item_text left">{{$t('teamReport.TotalMister')}}</view>
							<view class="item_value">
								<view class="icon"></view>
								{{teamData&&teamData.ztNumber}}
							</view>
						</view>
						<view class="item">
							<view class="item_text center">{{$t('teamReport.TotalCo')}}</view>
							<view class="item_value center">
								<view class="icon"></view>
								{{teamData&&teamData.threeDNumber}}
							</view>
						</view>
						<view class="item">
							<view class="item_text right">{{$t('teamReport.TotalReg')}}</view>
							<view class="item_value right">
								<view class="icon"></view>
								{{teamData&&teamData.teamSize}}
							</view>
						</view>
					</view>
					<!-- <view class="viewRecord">
						View Records
					</view> -->
				</view>

				<!-- 推荐奖励 -->
				<view class="messageModul_title">
					<view class="icon"></view>
					<view class="title">{{$t('teamReport.EarningDetails')}}</view>
				</view>
				<view class="EarningDetails">
					<view class="top">
						<view class="item">
							<view class="left">
								<view class="item_value">${{teamData&&teamData.referralreward|fmtMoney}}</view>
								<view class="item_text">
									<view>
										{{$t('teamReport.ReferralBonus')}}
									</view>
								</view>
							</view>
							<view class="viewRecord" @click="goDetail(1)">
								View Records
							</view>
						</view>
						<view class="item">
							<view class="left">
								<view class="item_value">${{teamData&&teamData.totalOrderCommission|fmtMoney}}</view>
								<view class="item_text">
									<view>
										{{$t('teamReport.TaskEarnings')}}
									</view>
								</view>
							</view>
							<view class="viewRecord" @click="goDetail(2)">
								View Records
							</view>
						</view>
						<view class="item">
							<view class="left">
								<view class="item_value">${{teamData&&teamData.totalTeamCommission|fmtMoney}}</view>
								<view class="item_text">
									<view>
										{{$t('teamReport.TeamEarnings')}}
									</view>
								</view>
							</view>
							<view class="viewRecord" @click="goDetail(3)">
								View Records
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import md5 from "js-md5";
	import moment from 'moment';
	import {
		ModifyFaceUrl,
		GetTeamReport,
		GetMyReport
	} from '@/common/api.js';
	export default {
		data() {
			return {
				isPhone: false,
				statusBarHeight: 50, //刘海默认高度
				teamData: null, //团队报告数据
				MyReport: null,
				current: 0, //当前选中的选项卡

			}
		},
		methods: {
			list() {
				let list = [
					this.$t('teamReport.Yearly'),
					this.$t('teamReport.Monthly'),
					this.$t('teamReport.Weekly'),
				];
				return list;
			},
			// 列表切换
			Tabchage(item) {
				let index = item
				this.current = index;
				/* 根据条件设置时间发送请求 */
				if (index == 0) { //一年
					this.start = moment().subtract(364, 'days').startOf('days').format('YYYY-MM-DD HH:mm:ss');
					this.end = moment().endOf('days').format('YYYY-MM-DD HH:mm:ss');
				} else if (index == 1) { //一个月
					this.start = moment().subtract(29, 'days').startOf('days').format('YYYY-MM-DD HH:mm:ss');
					this.end = moment().endOf('days').format('YYYY-MM-DD HH:mm:ss');
				} else { //一周
					this.start = moment().subtract(6, 'days').startOf('days').format('YYYY-MM-DD HH:mm:ss');
					this.end = moment().endOf('days').format('YYYY-MM-DD HH:mm:ss');
				}
				/* 获取团队报告数据和获取收入详情数据 */
				this.GetTeamReportData();
			},
			//获取个人报告
			async GetMyReportData() {
				//获取用户ID
				const userID = uni.getStorageSync('userInfo').userID;
				const res = await GetMyReport({
					userID
				});
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
					this.MyReport = res.data.resultData;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
			/* 获取团队报告 */
			async GetTeamReportData() {
				//参数开始时间和结束时间
				const params = {
					startDate: moment().subtract(6, 'days').startOf('days').format('YYYY-MM-DD HH:mm:ss'),
					endDate: moment().endOf('days').format('YYYY-MM-DD HH:mm:ss'),
					userID: uni.getStorageSync('userInfo').userID
				}
				uni.showLoading();
				const res = await GetTeamReport(params);
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
					this.teamData = res.data.resultData;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
			goDetail(type) {
				this.$u.route({
					type: 'navigateTo',
					url: `pages/teamReports-record/teamReports-record?type=${type}`,
				})
			}
		},
		onShow() {
			/* 获取一年日期 */
			this.start = moment().subtract(364, 'days').startOf('days').format('YYYY-MM-DD HH:mm:ss');
			this.end = moment().endOf('days').format('YYYY-MM-DD HH:mm:ss');
			this.current = 0;
			this.GetTeamReportData();
			this.GetMyReportData();
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
	page {
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

	.tabs {
		position: fixed;
		left: 0;
		top: 60px;
		width: 100%;
		z-index: 99999;
		background-color: #fff;
		font-size: 36rpx;
		font-family: 'Arial';
		color: #888888;
	}

	.tabs /deep/ .v-tabs__container-line {
		height: 4rpx !important;
	}
	.tabs /deep/ .v-tabs__container-item{
		font-family: "PingFangSC-Regular";
		// font-size: 40rpx!important;
	}

	.container {
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;

		/* 分享信息 */
		.shareMessage {
			width: 100%;
			min-height: 300rpx;
			border-radius: 16rpx;
			background-color: #fff;
			margin-top: 24rpx;
			margin-bottom: 30rpx;
			padding: 30rpx 24rpx;
			box-sizing: border-box;

			.invCode {
				margin-bottom: 48rpx;

				.title {
					height: 34rpx;
					font-size: 24rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					text-align: left;
					color: #005652;
					line-height: 34rpx;
				}

				.code_copy {
					margin-top: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.code {
						height: 64rpx;
						font-size: 36rpx;
						font-family: "Helvetica";
						// font-weight: 400;
						text-align: left;
						color: #fe6067;
						line-height: 64rpx;
					}

					.copy {
						width: 160rpx;
						height: 64rpx;
						background: linear-gradient(308deg, #ff5261 10%, #ff8588 87%);
						border-radius: 40rpx;
						box-shadow: 0px 0px 20rpx 6rpx rgba(0, 0, 0, 0.10);
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
			.invLink {
				margin-bottom: 48rpx;

				.title {
					height: 34rpx;
					font-size: 24rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					text-align: left;
					color: #005652;
					line-height: 34rpx;
				}

				.link_copy {
					margin-top: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.link {
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

					.copy {
						width: 160rpx;
						height: 64rpx;
						background: linear-gradient(308deg, #ff5261 10%, #ff8588 87%);
						border-radius: 40rpx;
						box-shadow: 0px 0px 20rpx 6rpx rgba(0, 0, 0, 0.10);
						line-height: 64rpx;
						font-size: 28rpx;
						font-family: "Helvetica";
						font-weight: 400;
						text-align: center;
						color: #ffffff;

					}
				}
			}

			.media {
				display: flex;
				flex-wrap: wrap;

				.item {
					flex: 0 0 33.33%;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					margin-top: 20rpx;

					.text {
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

		.messageModul {
			padding-bottom: 30rpx;

			.messageModul_title {
				margin-top: 30rpx;
				display: flex;
				align-items: center;
				margin-bottom: 18rpx;

				.icon {
					width: 8rpx;
					height: 28rpx;
					border-radius: 4rpx;
					background-color: #FE6067;
					margin-right: 8rpx;
				}

				.title {
					height: 40rpx;
					font-size: 28rpx;
					font-family: "PingFangSC-Medium";
					// font-weight: 500;
					text-align: left;
					color: #005652;
					line-height: 40rpx;
				}
			}

			.messageModul_content {
				width: 100%;
				// min-height: 200rpx;
				background-color: #fff;
				border-radius: 16rpx;
				box-sizing: border-box;
				padding: 30rpx 24rpx;

				.top {
					display: flex;
					justify-content: space-between;
					.item {
						flex: 0 0 33%;
						box-sizing: border-box;
					}

					.item_text {
						height: 80rpx;
						font-size: 28rpx;
						font-family: "PingFangSC-Regular";
						// font-weight: 400;
						text-align: right;
						color: #005652;

						&.left {
							text-align: left;
						}

						&.center {
							text-align: center;
						}

						&.right {
							text-align: right;
						}
					}

					.item_value {
						height: 32rpx;
						font-size: 32rpx;
						font-family: "D-Bold";
						// font-weight: 400;
						color: #ffaa03;
						line-height: 32rpx;
						margin-top: 16rpx;
						display: flex;
						justify-content: flex-start;

						.icon {
							width: 24rpx;
							height: 24rpx;
							background: url("../../static/image/team/yonghu.png") no-repeat center center;
							background-size: 24rpx 24rpx;
							margin-right: 17rpx;
						}

						&.right {
							justify-content: flex-end;
						}

						&.center {
							justify-content: center;
						}
					}
				}

				.viewRecord {
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
			
			.EarningDetails{
				background-color: #fff;
				border-radius: 16rpx;
				box-sizing: border-box;
				padding: 30rpx 24rpx;
				.item{
					display: flex;
					align-items: flex-end;
					margin-top: 20rpx;
					padding-bottom: 20rpx;
					.left{
						flex: 0 0 260rpx;
						padding-right: 30rpx;
					}
					.item_text {
						width: 100%;
						box-sizing: border-box;
						height: 80rpx;
						font-size: 28rpx;
						font-family: "PingFangSC-Regular";
						// font-weight: 400;
						text-align: left;
						color: #005652;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						margin-top: 20rpx;
					}
					.item_value{
						height: 32rpx;
						font-size: 32rpx;
						font-family: "D-Bold";
						// font-weight: 400;
						color: #ffaa03;
						line-height: 32rpx;
						margin-top: 16rpx;
						text-align: left;
					}
					.viewRecord{
						width: 100%;
						height: 80rpx;
						border: 1px solid transparent;
						background-image: linear-gradient(to right, #fff, #fff), linear-gradient(90deg, #e64340, #005652);
						background-clip: padding-box, border-box;
						background-origin: padding-box, border-box;
						border-radius: 42rpx;
						box-sizing: border-box;
						text-align: center;
						line-height: 80rpx;
						font-size: 30rpx;
						font-family: "Helvetica";
						// font-weight: 700;
						text-align: center;
						color: #fe6067;
					}
				}
			}
		}
	}
</style>
