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
				<view class="userId">{{MyReport&&MyReport.name}}</view>
			</view>
			<view class="language_setting item">
				<u-image src="../../static/image/my/yuyan_1.png" width="44rpx" height="44rpx" mode="scaleToFill"
					:lazyLoad="false" class="language"></u-image>
				<u-image src="../../static/image/my/shezhi.png" width="44rpx" height="44rpx" mode="scaleToFill"
					:lazyLoad="false" class="setting"></u-image>
			</view>
		</view>

		<!-- 用户内容 -->
		<view class="userBalanceHistory" :style="{paddingTop: isPhone?statusBarHeight+12+'px':77+'px'}">
			<view class="container">
				<view class="currentBalanceTetxt item">
					<view class="text">Current Balance</view>
					<view class="RecordText">Records</view>
				</view>
				<view class="balance item">
					<view class="balanceU" v-show="eys">USDT {{MyReport&&MyReport.balance}}</view>
					<view class="balanceU" v-show="!eys">USDT ******</view>
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
					<view class="btn Withdraw">{{$t('account.Withdraw')}} </view>
					<!-- 充值 -->
					<view class="btn Deposit">{{$t('account.Deposit')}} </view>
					<!-- 转账 -->
					<view class="btn Transfer">{{$t('account.Transfer')}}</view>
				</view>

				<!-- 分割线 -->
				<view class="line"></view>


				<!-- 收益 -->
				<view class="commission">
					<view class="row">
						<view class="col">
							<view class="title left">Today's orders</view>
							<view class="num left">3</view>
						</view>
						<view class="col">
							<view class="title left">Today's orders</view>
							<view class="num left">3</view>
						</view>
					</view>
					<view class="row">
						<view class="col">
							<view class="title center">Today's orders</view>
							<view class="num center">3</view>
						</view>
						<view class="col">
							<view class="title center">Today's orders</view>
							<view class="num center">3</view>
						</view>
					</view>
					<view class="row">
						<view class="col">
							<view class="title right">Today's orders</view>
							<view class="num right">3</view>
						</view>
						<view class="col">
							<view class="title right">Today's orders</view>
							<view class="num right">3</view>
						</view>
					</view>
				</view>


			</view>
		</view>

		<!-- carList -->
		<view class="carList">
			<view class="item" v-for="item in 10">
				<view class="left">
					<u-image src="../../static/image/my/car1.png" width="60rpx" height="60rpx" mode="scaleToFill"
						:lazyLoad="false"></u-image>
					<view class="text">Achievements</view>
				</view>
				<u-icon name="arrow-right" color="32rpx" size="#D8D8D8"></u-icon>
			</view>
		</view>
		
		<view class="logOut" >
			<!-- register button -->
			<wyb-button class="logOutBtn" type="hollow" :ripple="true" @click="Logout">{{$t('account.logout')}}</wyb-button>
		</view>
		<drag-btn></drag-btn>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import md5 from "js-md5";
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
			}
		},
		methods: {
			/* 退出登录 */
			async Logout() {
				return;
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
		},
		onShow() {
			if (!this.$u.utils.Permissions()) return;
			//设置头像判断本地是否有头像
			let faceUrl = uni.getStorageSync('faceUrl');
			if (faceUrl) {
				this.faceUrl = faceUrl;
			} else {
				this.faceUrl = "/static/image/my/morentouxiang.png"
			}
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
		font-family: "PingFangSC-Medium";
		font-weight: 500;
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
				font-size: 36rpx;
				font-family: "PingFangSC-Medium";
				font-weight: 500;
				text-align: left;
				color: #fe6067;
			}

			.setting {
				margin-left: 30rpx;
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
					font-weight: 400;
					text-align: left;
					color: #999999;
					line-height: 40rpx;
				}

				.RecordText {
					height: 40rpx;
					font-size: 28rpx;
					font-family: "PingFangSC-Medium";
					font-weight: 500;
					text-align: right;
					color: #fe6067;
					line-height: 40rpx;
				}

				.balanceU {
					height: 44rpx;
					font-size: 44rpx;
					font-family: "Helvetica";
					font-weight: 400;
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
					font-weight: 500;
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
						height: 24rpx;
						font-size: 24rpx;
						font-family: "PingFangSC-Regular";
						font-weight: 400;
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
						font-weight: 400;
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
					font-weight: 500;
					text-align: left;
					color: #005652;
					line-height: 40rpx;
				}
			}
		}
	}
	
	/* 退出按钮 */
	.logOut{
		width: 100%;
		padding: 0 24rpx;
		padding-top: 48rpx;
		padding-bottom: 100rpx;
		box-sizing: border-box;
		.logOutBtn {
			width: 100% !important;
			box-sizing: border-box;
			/deep/.wyb-button {
				height: 90rpx;
				background: linear-gradient(308deg,#ff5261 10%, #ff8588 87%)!important;
				border-radius: 46rpx!important;
				line-height: 86rpx;
				text-align: center;
				font-weight: 700;
				color: #fff !important;
				box-sizing: border-box;
				border: none!important;
				font-size: 34rpx;
				font-family: "Helvetica";
				font-weight: 400;
			}
		}
	}
</style>
