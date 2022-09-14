<template>
	<view>
		<!-- 自定义头部 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			{{$t('personalInformation.title')}}
		</view>
		<view class="main" :style="{
				paddingTop:statusBarHeight+12+'px',
			}">

			<view class="content">
				<view class="userInPruct">
					<view class="title">Modify the picture</view>
					<view class="avatar" @click="upload">
						<u-image :src="faceUrl" width="140rpx" height="140rpx" shape="circle" mode="scaleToFill"
							:lazyLoad="false"></u-image>
					</view>
				</view>
				<view class="inputTitle">{{$t('personalInformation.Systemaccount')}}</view>
				<u-input border="none" clearable :disabled="true" type="text" v-model="userID" class="input"
					placeholderClass="placeholderClass">
				</u-input>
				<view class="inputTitle">Mobile Phone</view>
				<view @click="goSettingDeatilPage('mobile')">
					<u-input border="none" clearable :disabled="true" type="text" v-model="MyReport&&MyReport.mobile"
						class="input" placeholderClass="placeholderClass" >
						<view slot="suffix">
							<u-icon name="arrow-right" color="#D8D8D8" size="32rpx"></u-icon>
						</view>
					</u-input>
				</view>
				<view class="inputTitle">{{$t('personalInformation.Nickname')}}</view>
				<view @click="goSettingDeatilPage('name')">
					<u-input border="none" clearable :disabled="true" type="text" v-model="MyReport&&MyReport.name"
						class="input" placeholderClass="placeholderClass">
						<view slot="suffix">
							<u-icon name="arrow-right" color="#D8D8D8" size="32rpx"></u-icon>
						</view>
					</u-input>
				</view>

				<view class="inputTitle">wallet address</view>
				<view @click="goSettingDeatilPage('wallet')">
					<u-input border="none" clearable :disabled="true" type="text" v-model="wallet" class="input"
						placeholderClass="placeholderClass">
						<view slot="suffix">
							<u-icon name="arrow-right" color="#D8D8D8" size="32rpx"></u-icon>
						</view>
					</u-input>
				</view>

			</view>
		</view>

		<!-- 提示信息 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		GetMyReport,
		GetSite
	} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 60, //刘海默认高度
				isPhone: false, //是否是手机
				website: null, //网站信息
				MyReport: null,
				wallet: '', //钱包地址
				userID: uni.getStorageSync('userInfo').userID,
				faceUrl: '',
			}
		},
		methods: {
			goSettingDeatilPage(type) {
				let url = '';
				if (type == "mobile") {
					url = "/pages/BindingMobile/BindingMobile";
				}
				if (type == "name") {
					url = "/pages/nickName/nickName";
				}
				if (type == "wallet") {
					url = "/pages/walletAddress/walletAddress";
				}
				uni.redirectTo({
					url:url
				})
			},

			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/Account/Account');
			},

			//获取网站信息
			async GetSiteData() {
				const res = await GetSite();
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
					//保存网站信息
					this.website = res.data.resultData;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
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
					//判断是否有钱包地址
					if (res.data.resultData.wallet) {
						//处理钱包地址截取前两位和后两位中间使用***代替
						let start = res.data.resultData.wallet.slice(0, 2);
						let end = res.data.resultData.wallet.slice(-2);
						let wallet = start + "***" + end;
						this.wallet = wallet;
					}
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
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
			}
		},
		onLoad() {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
			this.GetSiteData();
			this.GetMyReportData();
		},
		onPullDownRefresh() { //下拉刷新时调用
			this.GetSiteData();
			this.GetMyReportData();
			/* 终止刷新 */
		},
		onShow() {
			if (!this.$u.utils.Permissions()) return;
			let faceUrl = uni.getStorageSync('faceUrl');
			if (faceUrl) {
				this.faceUrl = faceUrl;
			} else {
				this.faceUrl = "/static/image/my/morentouxiang.png"
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		background-color: #F7F7F7;
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

	.main {
		padding-top: 60px;
		min-height: 300px;

		.content {
			min-height: 300px;
			background-color: #fff;
			border-top-right-radius: 30rpx;
			border-top-left-radius: 30rpx;
			padding: 50rpx 20rpx;

			.userInPruct {
				.title {
					height: 40rpx;
					font-size: 28rpx;
					font-family: "PingFangSC-Medium";
					// font-weight: 500;
					text-align: left;
					color: #333333;
					line-height: 40rpx;
				}

				.avatar {
					display: flex;
					justify-content: center;
					margin-top: 24rpx;
					margin-bottom: 50rpx;
				}
			}

			.inputTitle {
				height: 40rpx;
				font-size: 28rpx;
				font-family: "PingFangSC-Medium";
				// font-weight: 500;
				text-align: left;
				color: #005652;
				line-height: 40rpx;
				margin-bottom: 12rpx;
			}

			.input {
				height: 90rpx;
				background: #ffffff;
				border: 1px solid #005652;
				border-radius: 48rpx;
				margin-bottom: 40rpx;
				background-color: #fff !important;
				padding: 0 30rpx !important;
				padding-right: 40rpx !important;
			}
		}
	}
</style>
