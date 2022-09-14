<template>
	<view class="accountPage">
		<!-- 头部导航 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-65+'px'}">
			<view class="userInfo item">
				<!-- 用户头像 -->
				<view class="avatar" @click="upload">
					<u-image :src="faceUrl" width="70rpx" height="70rpx" shape="circle" mode="scaleToFill"
						:lazyLoad="false"></u-image>
				</view>
				<view class="userId">
					<view class="user">{{MyReport&&MyReport.name}}</view>
					<view class="userlevel" v-show="MyReport&&MyReport.level">
						{{MyReport&&handleLevelName(MyReport.level)}}
					</view>
				</view>
			</view>
			<view class="language_setting item">
				<u-image src="../../static/image/my/yuyan_1.png" width="44rpx" height="44rpx" mode="scaleToFill"
					:lazyLoad="false" class="language" @click="languageSetting"></u-image>
				<u-image src="../../static/image/my/shezhi.png" width="44rpx" height="44rpx" mode="scaleToFill"
					:lazyLoad="false" class="setting" @click="setting"></u-image>
			</view>
		</view>

		<!-- 倒计时 -->
		<view class="countdown" :style="{top: statusBarHeight+'px'}" v-if="MyReport&&MyReport.level">
			<view class="time">
				<view class="icon"></view>
				<u-count-down :time="Time" format="DD:HH:mm:ss" autoStart millisecond @change="onChange">
					<view class="time">
						<text class="time__item">{{ timeData.days>=10?timeData.days:'0'+timeData.days }}&nbsp;天</text>
						<text class="time__item">{{ timeData.hours>=10?timeData.hours:'0'+timeData.hours}}&nbsp;时</text>
						<text
							class="time__item">{{ timeData.minutes>=10?timeData.minutes:'0'+timeData.minutes }}&nbsp;分</text>
						<text
							class="time__item">{{ timeData.seconds>=10?timeData.seconds:'0'+timeData.seconds }}&nbsp;秒</text>
					</view>
				</u-count-down>
			</view>
		</view>

		<view :style="{paddingTop: handleTop}"></view>

		<!-- 用户内容 -->
		<view class="userBalanceHistory">
			<view class="container">
				<view class="currentBalanceTetxt item">
					<view class="text">Current Balance</view>
					<view class="RecordText">Records</view>
				</view>
				<view class="balance item">
					<view class="balanceU" v-show="eys&&MyReport">USDT {{MyReport&&MyReport.balance}}</view>
					<view class="balanceU" v-show="!eys&&MyReport">USDT ******</view>
					<view class="eys" @click="toggleClassEys">
						<u-image src="../../static/image/my/yanjing_xianshi.png" width="44rpx" height="44rpx"
							mode="scaleToFill" :lazyLoad="false" v-show="eys"></u-image>
						<u-image src="../../static/image/my/biyanj_1.png" width="44rpx" height="44rpx"
							mode="scaleToFill" :lazyLoad="false" v-show="!eys"></u-image>
					</view>
				</view>

				<!-- 按钮组 -->
				<view class="btnGroup">
					<!-- 提现 -->
					<navigator url="/pages/withdraw/withdraw" open-type="navigate" class="btn Withdraw">{{$t('account.Withdraw')}} </navigator>
					<!-- 充值 -->
					<navigator url="/pages/recharge/recharge" open-type="navigate" class="btn Deposit">{{$t('account.Deposit')}} </navigator>
					<!-- 转账 -->
					<navigator url="/pages/transfer/transfer" open-type="navigate" class="btn Transfer">{{$t('account.Transfer')}}</navigator>
				</view>

				<!-- 分割线 -->
				<view class="line"></view>


				<!-- 收益 -->
				<view class="commission">
					<view class="row">
						<view class="col">
							<view class="title left">{{$t('account.InvitationCode')}}</view>
							<view class="num left">{{MyReport&&MyReport.invitationCode}}</view>
						</view>
						<view class="col">
							<view class="title left">{{$t('account.TodayTaskEarnings')}}</view>
							<view class="num left">${{MyReport&&MyReport.totalTodayCommission|fmtMoney}}</view>
						</view>
					</view>
					<view class="row">
						<view class="col">
							<view class="title center">{{$t('account.TodayReferralBonus')}}</view>
							<view class="num center">${{MyReport&&MyReport.totalReferralrewardToday|fmtMoney}}</view>
						</view>
						<view class="col">
							<view class="title center">{{$t('account.TotalEarnings')}}</view>
							<view class="num center">${{MyReport&&MyReport.totalRevenue|fmtMoney}}</view>
						</view>
					</view>
					<view class="row">
						<view class="col">
							<view class="title right">{{$t('account.TodayTeamEarnings')}}</view>
							<view class="num right">${{MyReport&&MyReport.totalTeamTodayCommission|fmtMoney}}</view>
						</view>
						<!-- <view class="col">
							<view class="title right">{{$t('account.TotalEarnings')}}</view>
							<view class="num right">${{MyReport&&MyReport.totalRevenue|fmtMoney}}</view>
						</view> -->
					</view>
				</view>
			</view>
		</view>

		<!-- carList -->
		<view class="carList">
			<navigator 
				class="item" 
				v-for="item in cardList"
				:url="item.url" 
				:open-type="item.type" 
				hover-class="none"
			>
				<view class="left">
					<u-image :src="item.icon" width="60rpx" height="60rpx" mode="scaleToFill"
						:lazyLoad="false"></u-image>
					<view class="text">{{item.title}}</view>
				</view>
				<u-icon name="arrow-right" color="32rpx" size="#D8D8D8"></u-icon>
			</navigator>
		</view>

		<view class="logOut">
			<!-- register button -->
			<wyb-button class="logOutBtn" type="hollow" :ripple="true" @click="Logout">{{$t('account.logout')}}
			</wyb-button>
		</view>
		<drag-btn></drag-btn>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import md5 from "js-md5";
	import moment from 'moment';
	import {
		ModifyFaceUrl,
		GetTeamReport,
		GetMyReport,
		GetPDLevelRuleList,
		GetValidityDate
	} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 65,
				isPhone: false,
				MyReport: null, //报告数据
				faceUrl: '',
				eys: true,
				endDate: null,
				timeData: {},
			}
		},
		computed: {
			/* 跳转到个人信息 */
			setting() {
				uni.navigateTo({
					url:"/pages/personalInformation/personalInformation"
				})
			},
			
			cardList() {
				return [{ //1教程
						title: this.$t('home.Tutorial'),
						url: "/pages/ReadeView/ReadeView?type=1",
						type: "navigate",
						icon: require("../../static/image/carlist/Tutorial.png"),
					},
					//2介绍
					{
						title: this.$t('home.Intro'),
						url: "/pages/ReadeView/ReadeView?type=2",
						type: "navigate",
						icon: require("../../static/image/carlist/Intro.png"),
					},
					//4佣金比例
					{
						title: this.$t('home.commisionRate'),
						url: "/pages/ReadeView/ReadeView?type=4",
						icon: require("../../static/image/carlist/commisionRate.png"),
						type: "navigate"
					},
					//5绑定手机号码
					{
						title: this.$t('account.LinkedMobileNumber'),
						url: "/pages/BindingMobile/BindingMobile",
						icon: require("../../static/image/carlist/LinkedMobileNumber.png"),
						type: "navigate"
					},
					//6钱包地址
					{
						title: this.$t('account.WalletAddress'),
						url: "/pages/walletAddress/walletAddress",
						icon: require("../../static/image/carlist/WalletAddress.png"),
						type: "navigate"
					},
					//7支付密码
					{
						title: this.$t('account.WithdrawalPassword'),
						url: "/pages/WithdrawalPassword/WithdrawalPassword",
						icon: require("../../static/image/carlist/WithdrawalPassword.png"),
						type: "navigate"
					},
					//8重置密码
					{
						title: this.$t('account.ResetPassword'),
						url: "/pages/changePassword/changePassword",
						icon: require("../../static/image/carlist/ResetPassword.png"),
						type: 'navigate'
					},
					//9官方公告
					{
						title: this.$t('account.OfficialAnnouncement'),
						url: "/pages/noticeCenter/noticeCenter",
						icon: require("../../static/image/carlist/OfficialAnnouncement.png"),
						type: 'navigate'
					},
					//10团队机制
					{
						title: this.$t('account.TeamMechanism'),
						url: "/pages/ReadeView/ReadeView?type=10",
						icon: require("../../static/image/carlist/TeamMechanism.png"),
						type: 'navigate'
					},
					{
						//11用户协议
						title: this.$t('account.UserAgreement'),
						url: "/pages/ReadeView/ReadeView?type=5",
						icon: require("../../static/image/carlist/UserAgreement.png"),
						type: 'navigate'
					},
					//12FAQ
					{
						title: this.$t('account.FAQ'),
						url: "/pages/ReadeView/ReadeView?type=9",
						icon: require("../../static/image/carlist/FAQ.png"),
						type: 'navigate'
					},
					//13关于我们
					{
						title: this.$t('account.aboutUs'),
						url: "/pages/ReadeView/ReadeView?type=8",
						icon: require("../../static/image/carlist/aboutUs.png"),
						type: 'navigate'
					},
					//14合作伙伴
					{
						title: this.$t('account.PlatformPartners'),
						url: "/pages/ReadeView/ReadeView?type=11",
						icon: require("../../static/image/carlist/PlatformPartners.png"),
						type: 'navigate'
					},
					//15系统信息
					{
						title: this.$t('account.About'),
						url: "/pages/about/about",
						icon: require("../../static/image/carlist/About.png"),
						type: 'navigate'
					},
				]
			},
			handleTop() {
				if (this.isPhone && this.MyReport && this.MyReport.level) {
					return this.statusBarHeight + 12 + 58 + 'px';
				} else if (this.isPhone && this.MyReport && !this.MyReport.level) {
					return this.statusBarHeight + 12 + 58 + 'px'
				} else if (!this.isPhone && this.MyReport && this.MyReport.level) {
					return this.statusBarHeight + 12 + 58 + 'px';
				} else if (!this.isPhone && this.MyReport && !this.MyReport.level) {
					return this.statusBarHeight + 12 + 'px'
				} else if (this.isPhone && !this.MyReport) {
					return this.statusBarHeight + 12 + 'px'
				} else {
					return 77 + 'px'
				}
			},
			Time() {
				if (this.MyReport && this.MyReport.currentDateTime && this.endDate) {
					let current = this.MyReport.currentDateTime;
					let endDate = this.endDate.replace(/\//g, "-");
					endDate = moment(endDate);
					let timeDiff = endDate.diff(moment(current), 'seconds')
					return timeDiff ? timeDiff * 1000 : 0;
				}
			}
		},
		methods: {
			languageSetting() {
				uni.navigateTo({
					url: "/pages/languageSettings/languageSettings"
				})
			},

			//动态设置tabbar国际化
			setTabBarI18n() {
				for (let i = 0; i < 4; i++) {
					let text = "";
					switch (i) {
						case 0:
							text = this.$t('tabbar.HomeText');
							break;
						case 1:
							text = this.$t('tabbar.OrderText');
							break;
						case 2:
							text = this.$t('tabbar.TeamText');
							break;
						case 3:
							text = this.$t('tabbar.AccountText');
							break;
					}
					uni.setTabBarItem({
						index: i,
						text
					});
				}
			},

			//处理等级名称显示
			handleLevelName(leveName) {
				let name = '';
				switch (leveName) {
					case "Trainee Manager":
						name = this.$t('grade.Trainee_Manager');
						break;
					case "General Manager":
						name = this.$t('grade.General_Manager');
						break;
					case "Senior Manager":
						name = this.$t('grade.Senior_Manager');
						break;
					case "Regional Manager":
						name = this.$t('grade.Regional_Manager');
						break;
					case "Regional General Manager":
						name = this.$t('grade.Regional_General_Manager');
						break;
					case "Regional Vice President":
						name = this.$t('grade.Regional_Vice_President');
						break;
					case "Regional President":
						name = this.$t('grade.Regional_President');
						break;
					case "Co-Founder":
						name = this.$t('grade.Co-Founder');
						break;
					default:
						name = "";
				}
				return name;
			},
			onChange(e) {
				this.timeData = e
			},
			/* 退出登录 */
			async Logout() {
				uni.$u.vuex('vuex_token', '');
				uni.setStorageSync('userInfo', '');
				uni.setStorageSync('isPopup', false);
				this.$u.route({
					type: 'reLaunch',
					url: '/pages/userAuth/login'
				})
			},

			toggleClassEys() {
				this.eys = !this.eys;
			},

			//上传文件
			upload() {
				let _that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						_that.faceUrl = res.tempFilePaths[0];
						//发送请求上传文件
						const params = {
							UploadType: 6,
							userID: uni.getStorageSync('userInfo').userID,
							files: _that.faceUrl,
						}
						let Timestamp = Math.round(new Date().getTime() / 1000);
						let Random = parseInt(999999 * Math.random()) + '';
						let jsonParams = JSON.stringify(_that.$u.utils.JsonToAscii(params));
						let signature = md5(jsonParams + '&' + Timestamp + '&' + Random + '&' +
							'd4rHhEcEyYiPng3o47IFiyrfjpkSI3NpuzPH84SfuAA7fNiAqny2e6B0uCqy6OASklYPAQ68J1lTqL3WTSf2gSIknbDnzGYvGeTO4ApiajY0tgnPJ3D1HIq6aAPK3v07'
						);
						let DeviceType = "Wap";
						//#ifdef APP-PLUS
						DeviceType = uni.getSystemInfoSync().platform
						//#endif
						uni.uploadFile({
							url: _that.domain + 'api/File/Upload',
							name: 'credit',
							filePath: res.tempFilePaths[0],
							formData: {
								UploadType: 6,
								UserID: uni.getStorageSync('userInfo').userID,
								Timestamp: Timestamp,
								Random: Random,
								Signature: signature,
								files: _that.faceUrl
							},
							header: {
								application: DeviceType,
								token: _that.vuex_token
							},
							success: (uploadFileRes) => {
								const res = JSON.parse(uploadFileRes.data);
								const networkError = _that.$u.utils.handleNetwork(uploadFileRes);
								if (networkError) {
									_that.$refs.uToast.show({
										message: networkError,
										type: 'error',
										duration: 1500,
									})
									return;
								}
								if (res.resultCode == 1) { //保存图片路径
									_that.faceUrl = res.resultData.uploadList[0].absoluteURL;
									_that.ModifyFace(res.resultData.uploadList[0].absoluteURL);
								}
							},
							fail: (error) => {
								_that.$refs.uToast.show({
									message: _that.$t("account.uploadfailed"),
									type: 'error',
									duration: 2000,
									complete() {
										//设置头像判断本地是否有头像
										let faceUrl = uni.getStorageSync('faceUrl');
										if (faceUrl) {
											_that.faceUrl = faceUrl;
										} else {
											_that.faceUrl =
												"/static/image/my/morentouxiang.png"
										}
									}
								})
							}
						})
					}
				});
			},

			//修改用户头像
			async ModifyFace(url) {
				const params = {
					userID: uni.getStorageSync('userInfo').userID,
					faceUrl: url
				}
				uni.showLoading({
					title: this.$t('account.editFaceUrl')
				})
				const res = await ModifyFaceUrl(params);
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
					//保存到本地
					let _that = this;
					this.$refs.uToast.show({
						message: this.$t('account.editSuccessfully'),
						type: 'success',
						duration: 2000,
						complete: () => {
							uni.setStorageSync('faceUrl', url);
						}
					})
				} else {
					this.faceUrl = uni.getStorageSync('faceUrl') || '/static/image/my/morentouxiang.png';
					//修改头像
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 1500,
					})
				}
			},
			//获取个人报告
			async GetMyReportData() {
				//获取用户ID
				const userID = uni.getStorageSync('userInfo').userID;
				const res = await GetMyReport({
					userID
				});
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

			//获取任务大厅列表
			async GetDLevelRuleList() {
				const userID = uni.getStorageSync('userInfo').userID;
				const params = {
					userID,
					pageIndex: 1,
					pageSize: 100,
				}
				const res = await GetPDLevelRuleList(params);
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
					let list = res.data.resultData.pdLevelRuleList;
					let result = list && list.length && list.filter(item => item.enable && item.state);
					let endDate = result && result.length ? result[0].endDate : null;
					this.endDate = endDate;
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
			this.$u.utils.setTabBarI18n();
			//设置头像判断本地是否有头像
			let faceUrl = uni.getStorageSync('faceUrl');
			if (faceUrl) {
				this.faceUrl = faceUrl;
			} else {
				this.faceUrl = "/static/image/my/morentouxiang.png"
			}
			this.GetMyReportData();
			this.GetDLevelRuleList();
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
		font-family: "PingFangSC-Medium";
		// font-weight: 500;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		text-align: center;
		background-color: #ffffff;
		z-index: 1000;
		padding: 0 34rpx;
		box-sizing: border-box;

		.item {
			display: flex;
			align-items: center;

			.userId {
				margin-left: 24rpx;

				.user {
					font-size: 36rpx;
					font-family: "PingFangSC-Medium";
					// font-weight: 500;
					text-align: left;
					color: #fe6067;
				}

				.userlevel {
					font-size: 28rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					text-align: left;
					color: #ffaa03;
					// line-height: 14px;
				}
			}

			.setting {
				margin-left: 30rpx;
			}
		}
	}

	.countdown {
		width: 100%;
		height: 117rpx;
		// background-color: #fff;
		position: fixed;
		padding: 0 34rpx;
		box-sizing: border-box;
		z-index: 1000;

		.time {
			width: var(100vw-68rpx);
			height: 117rpx;
			background-color: #FE6067;
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			border-bottom-right-radius: 50%;
			border-bottom-left-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			.icon {
				width: 28rpx;
				height: 28rpx;
				background: url("../../static/image/my/countDown.png")no-repeat center center;
				background-size: 28rpx 28rpx;
				margin-right: 25rpx;
			}

			.time__item {
				color: #fff;
				font-size: 28rpx;
				font-family: "Helvetica";
				font-weight: 400;
				text-align: right;
				color: #ffffff;
			}
		}
	}

	.userBalanceHistory {
		padding: 0 24rpx;

		.container {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 24rpx 20rpx;
			box-sizing: border-box;
			width: 100%;

			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;

				&.balance {
					margin-top: 10rpx;
				}

				.text {
					height: 40rpx;
					font-size: 28rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					text-align: left;
					color: #999999;
					line-height: 40rpx;
				}

				.RecordText {
					height: 40rpx;
					font-size: 28rpx;
					font-family: "PingFangSC-Medium";
					// font-weight: 500;
					text-align: right;
					color: #fe6067;
					line-height: 40rpx;
				}

				.balanceU {
					height: 44rpx;
					font-size: 44rpx;
					font-family: "Helvetica";
					// font-weight: 400;
					text-align: left;
					color: #ffaa03;
					line-height: 44rpx;
				}
			}

			.btnGroup {
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;

				.btn {
					width: 210rpx;
					height: 80rpx;
					background: linear-gradient(308deg, #ff5261 10%, #ff8588 87%);
					border-radius: 40rpx;
					line-height: 80rpx;
					text-align: center;
					font-size: 28rpx;
					font-family: "PingFangSC-Medium";
					// font-weight: 500;
					color: #ffffff;

					&.Transfer {
						border: 1px solid rgb(254, 96, 103);
						color: #FE6067 !important;
						background: #fff !important;
					}
				}
			}

			.line {
				width: 100%;
				height: 1px;
				background-color: #F5F5F5;
				margin: 30rpx 0;
			}

			.commission {
				display: flex;

				.row {
					flex: 0 0 33%;

					.title {
						text-align: left;
						height: 48rpx;
						font-size: 24rpx;
						font-family: "PingFangSC-Regular";
						// font-weight: 400;
						color: #005652;
						line-height: 24rpx;

						&.center {
							text-align: center;
						}

						&.right {
							text-align: right;
						}
					}

					.num {
						text-align: center;
						height: 24rpx;
						font-size: 28rpx;
						font-family: "Helvetica";
						// font-weight: 400;
						text-align: left;
						color: #ffaa03;
						margin-top: 16rpx;
						margin-bottom: 28rpx;

						&.center {
							text-align: center;
						}

						&.right {
							text-align: right;
						}
					}
				}
			}
		}
	}

	/* carList */
	.carList {
		margin-top: 24rpx;
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;

		.item:last-child {
			border-bottom: none;
			border-bottom-right-radius: 16rpx;
			border-bottom-left-radius: 16rpx;
		}

		.item:first-child {
			border-top-left-radius: 16rpx;
			border-top-right-radius: 16rpx;
		}

		.item {
			flex: 0 0 100%;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 40rpx;
			height: 110rpx;
			background-color: #fff;
			border-bottom: 1px solid #ddd;

			.left {
				display: flex;
				align-items: center;

				.text {
					margin-left: 24rpx;
					height: 40rpx;
					font-size: 28rpx;
					font-family: "PingFangSC-Medium";
					// font-weight: 500;
					text-align: left;
					color: #005652;
					line-height: 40rpx;
				}
			}
		}
	}

	/* 退出按钮 */
	.logOut {
		width: 100%;
		padding: 0 24rpx;
		padding-top: 48rpx;
		padding-bottom: 48rpx;
		box-sizing: border-box;

		.logOutBtn {
			width: 100% !important;
			box-sizing: border-box;

			/deep/.wyb-button {
				height: 90rpx;
				background: linear-gradient(308deg, #ff5261 10%, #ff8588 87%) !important;
				border-radius: 46rpx !important;
				line-height: 86rpx;
				text-align: center;
				// font-weight: 700;
				color: #fff !important;
				box-sizing: border-box;
				border: none !important;
				font-size: 34rpx;
				font-family: "Helvetica";
				// font-weight: 400;
			}
		}
	}
</style>
