<template>
	<view>
		<!-- 自定义头部 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back">
			</u-icon>
			{{$t('payMent.title')}}
		</view>

		<view class="container" :style="{paddingTop: isPhone?statusBarHeight+'px':60+'px'}">
			<view class="contentBox">

				<!-- from表单 -->
				<view class="from">
					<!-- 充值金额 -->
					<view class="inputTitle">{{$t('payMent.RechargeAmount')}}</view>
					<view @click="copy(form.money)">
						<u-input v-model="form.money" border="none" inputAlign="left" type="text" :disabled="true"
							class="input money">
						</u-input>
					</view>

					<!-- 钱包地址 -->
					<view class="inputTitle">{{$t('payMent.RechargeWalletAddress')}}</view>
					<view @click="copy(form.payAccount)">
						<u-input v-model="form.payAccount" border="none" inputAlign="left" type="text" :disabled="true"
							class="input">
							<template slot="suffix">
								<u-icon name="../../static/image/payMent/copyIcon.png" size="40rpx" color="#FE6067" @click="copy(form.payAccount)" class="back"></u-icon>
							</template>
						</u-input>
					</view>
					<!-- 所属区块 -->
					<view class="inputTitle">{{$t('payMent.Network')}}</view>
					<view @click="copy(form.payTypeName)">
						<u-input v-model="form.payTypeName" border="none" inputAlign="left" type="text" :disabled="true"
							class="input">
						</u-input>
					</view>

					<!-- TXID -->
					<view class="inputTitle">{{$t('payMent.Txid')}}</view>
					<u-input v-model="form.txid" border="none" clearable :placeholder="$t('payMent.txidPlhods')"
						inputAlign="left" type="text" class="input Txid">
					</u-input>
				</view>

			<!-- usdt -->
			<!-- usdt -->
			<view class="usdt">
				<view class="left">
					<u-icon name="/static/image/payMent/usdt.png" width="86rpx" height="86rpx"></u-icon>
					<view class="TRC20">
						USDT-TRC-20
					</view>
				</view>
				<view class="rightTag">
					<u-icon name="/static/image/payMent/one.png" width="54rpx" height="54rpx" class="one"></u-icon>
					<u-icon name="/static/image/payMent/two.png" width="54rpx" height="54rpx" class="two"></u-icon>
					<u-icon name="/static/image/payMent/three.png" width="54rpx" height="54rpx" class="three"></u-icon>
				</view>
			</view>

			<!-- 上传凭证 -->
			<view class="certificate">
				<view class="title">
					{{$t('payMent.UploadPaymentVoucher')}}
				</view>
				<view class="UploadImageView" @click="upload">
					<u-image width="368rpx" height="334rpx" :src="Baseurl" mode='aspectFill'></u-image>
				</view>
			</view>

			<!-- 按钮组 -->
			<view class="btnGroup">
				<!-- Login button -->
				<wyb-button class="confirm itemBtn" type="hollow" :ripple="true" @click="submit">
					{{$t('payMent.Confirm')}}
				</wyb-button>
			</view>
			</view>
		</view>

		<!-- 消息提示 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import md5 from "js-md5";
	import {
		UpdateUserPay,
		GetUserPay
	} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 60, //刘海默认高度
				isPhone: false, //是否是手机
				form: {
					payTypeName: "", //所属区块
					money: "", //充值金额
					payAccount: "", //钱包地址
					txid: '',
				},
				billOfCredit: '', //图片上传url
				pdid: "",
				Baseurl: "../../static/image/payMent/credit.png",
				isSubmit: false
			}
		},
		methods: {
			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/Account/Account');
			},
			handleCopy(type) {
				if (type == 1) {
					this.$refs.uToast.show({
						message: this.$t('copy.copySuccess'),
						type: 'success',
						icon: true,
						position: 'center',
						duration: 2000,
					})
				} else {
					this.$refs.uToast.show({
						message: this.$t('copy.copyError'),
						type: 'error',
						icon: true,
						position: 'center',
						duration: 1000,
					})
				}
			},
			//复制方法调用系统api
			copy(content) {
				// 触发方法
				content = '' + content;
				const _that = this;
				//#ifdef APP-PLUS
				uni.setClipboardData({
					data: content,
					showToast: false,
					success: function() {
						_that.handleCopy(1);
					},
					error: (e) => {
						_that.handleCopy(0);
					}
				});
				//#endif
				//#ifdef H5
				_that.$copyText(content).then(e => {
					_that.handleCopy(1);
				}, function(e) {
					_that.handleCopy(0);
				})
				//#endif
			},

			//获取充值记录
			async GetUserPayRecord(pdid) {
				this.pdid = pdid;
				const params = {
					pdid,
					userID: uni.getStorageSync('userInfo').userID
				}
				const res = await GetUserPay(params);
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
					//设置数据到form中
					const {
						payTypeName,
						money,
						payAccount
					} = res.data.resultData;
					this.form = {
						payTypeName,
						money,
						payAccount
					}
					//处理时间
					this.userPayData = res.data.resultData;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},

			rules() {
				const {
					txid
				} = this.form;
				if (!txid) {
					return this.$t('payMent.payNumber');
				}
				if (txid.length > 200) {
					return this.$t('payMent.txtIDRange');
				}
				return;
			},

			//上传文件
			upload() {
				let _that = this;
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						_that.Baseurl = res.tempFilePaths[0];
						//发送请求上传文件
						const params = {
							UploadType: 6,
							userID: uni.getStorageSync('userInfo').userID,
							files: _that.Baseurl,
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
						uni.showLoading();
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
								files: _that.url
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
										duration: 2000,
									})
									return;
								}
								if (res.resultCode == 1) { //保存图片路径
									uni.hideLoading();
									_that.$refs.uToast.show({
										message: _that.$t('payMent.uploadSuccess'),
										type: 'success',
										duration: 2000,
										complete: () => {
											_that.billOfCredit = res.resultData
												.uploadList[0].absoluteURL;
										}
									})
								}
							},
							fail: (error) => {
								uni.hideLoading();
								_that.$refs.uToast.show({
									message: _that.$t('payMent.uploadfailed'),
									type: 'error',
									duration: 2000,
									complete: () => {
										_that.Baseurl =
											"../../static/image/payMent/credit.png"
									}
								})
							}
						})
					}
				});
			},

			//点击请求支付
			async submit() {
				//判断txid和是否充值已经结束
				// if(this.endTime) return;
				let txidRules = this.rules();
				if (txidRules) {
					this.$refs.uToast.show({
						message: txidRules,
						type: 'warning ',
						duration: 2000,
					})
					return;
				}
				//防止重复提交
				if (this.isSubmit) {
					return;
				} else {
					this.isSubmit = true;
				}
				//执行充值
				const params = {
					billOfCredit: this.billOfCredit,
					pdid: this.pdid,
					txid: this.form.txid,
					userID: uni.getStorageSync('userInfo').userID,
				}
				uni.showLoading({
					title: this.$t('payMent.loading')
				});
				//发送请求
				const res = await UpdateUserPay(params);
				uni.hideLoading();
				const networkError = this.$u.utils.handleNetwork(res);
				if (networkError) {
					this.$refs.uToast.show({
						message: networkError,
						type: 'error',
						duration: 2000,
						complete: () => {
							this.isSubmit = false;
						}
					})
					return;
				}
				if (res.data.resultCode == 1) { //充值成功跳转到个人中心
					//成功后跳转到个人中心
					this.$refs.uToast.show({
						message: this.$t('payMent.submitsuccess'),
						type: 'success',
						duration: 2000,
						complete: () => {
							this.isSubmit = false;
							uni.switchTab({
								url: '/pages/my/my'
							})
						}
					})
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
						complete: () => {
							this.isSubmit = false;
						}
					})
				}
			}
		},
		onLoad(options) {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
			const {
				id
			} = options;
			//获取用户支付订单
			this.GetUserPayRecord(id);
		},

		onShow() {
			if (!this.$u.utils.Permissions()) return;
			this.isSubmit = false;
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		background-color: #F0F2F5;
	}

	.header {
		text-align: center;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		font-family: "PingFangSC-Medium";
		background-color: #fff;
		height: 60px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		border-bottom: 2rpx solid #ddd;
		font-size: 32rpx;
		color: #FE6067;
		z-index: 1000;

		.back {
			position: absolute;
			left: 30rpx;
		}
	}

	.container {
		width: 100%;
		box-sizing: border-box;
		// padding: 0 60rpx;
		margin-top: 24rpx;
		
		.contentBox{
			background-color: #fff;
			padding: 30rpx;
		}

		.from {
			width: 100%;
			padding: 0 20rpx;
			box-sizing: border-box;

			.input {
				margin-bottom: 30rpx;
				height: 108rpx;
				width: 100%;
				padding-left: 20rpx !important;
				box-sizing: border-box;
				box-sizing: border-box;
				padding-right: 30rpx !important;
				border: 1px solid #005652;
				border-radius: 48rpx;
			}

			/deep/ .uni-input-input {
				font-family: "Helvetica";
				color: #888888;
				// font-weight: bold;
				text-decoration: underline;
				display: -webkit-box !important;
				overflow: hidden;
				text-overflow: ellipsis;
				word-break: break-all;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical !important;
				// font-weight: 400;
				text-align: left;
			}

			.Txid {
				padding-left: 36rpx !important;

				&/deep/ .uni-input-input {
					text-decoration: none;
				}
			}

			.money {
				&/deep/ .uni-input-input {
					color: red;
				}
			}

			/deep/ .placeholderClass {
				height: 32rpx;
				font-size: 28rpx;
				// font-family: 'Arial';
				color: #888888 !important;
				line-height: 32rpx;
			}
			
			.Txid /deep/ .placeholderClass {
				height: 32rpx;
				font-size: 28rpx;
				font-family: 'Arial';
				color: #888888 !important;
				line-height: 32rpx;
			}

			.inputTitle {
				height: 32rpx;
				font-size: 28rpx;
				color: #005652;
				line-height: 32rpx;
				margin: 20rpx 0;
				font-family: "Helvetica";
				// font-weight: 400;
				text-align: left;
			}
		}

		/* usdt */
		/* USDT */
		.usdt {
			width: 100%;
			display: flex;
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 24rpx;
			justify-content: space-between;
			align-items: center;
			// box-shadow: rgba(0, 0, 0, 0.03) 0px 2px 5px 4px;
			background-color: rgba(255, 255, 255, 1.000000);
			box-shadow: #ccc 0px 2px 7px 1px;
			.left {
				display: flex;
				align-items: center;

				.TRC20 {
					height: 34rpx;
					font-size: 32rpx;
					font-family: 'Arial';
					color: #666666;
					margin-left: 38rpx;
					line-height: 34rpx;
				}
			}

			.rightTag {
				display: flex;
				position: relative;
				width: 108rpx;
				height: 54rpx;

				.one {
					position: absolute;
					left: 0;
					z-index: 100;
				}

				.two {
					position: absolute;
					left: 27rpx;
					z-index: 200;
				}

				.three {
					position: absolute;
					left: 54rpx;
					z-index: 300;
				}
			}
		}

		/* 上传凭证 */
		.certificate {
			.title {
				height: 34rpx;
				font-size: 32rpx;
				font-family: 'Arial';
				color: #005652;
				line-height: 34rpx;
				margin: 60rpx 0 34rpx 0;
			}

			.UploadImageView {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 40rpx 0;
				background: #F8F7FC;
			}
		}

		/* 按钮组 */
		.btnGroup {
			display: flex;
			justify-content: center;
			margin: 84rpx 0 84rpx 0;
			.itemBtn {
				width: 100% !important;
				// margin-bottom: 80rpx;
			}
			.itemBtn /deep/.wyb-button {
				box-sizing: border-box;
				height: 90rpx;
				line-height: 86rpx;
				text-align: center;
				border-radius: 46rpx !important;
				background: linear-gradient(308deg, #ff5261 10%, #ff8588 87%) !important;
				font-size: 32rpx;
				font-family: "PingFangSC-Medium";
				// font-weight: 500;
				color: #ffffff !important;
				border: none !important;
				box-sizing: border-box;
			}
		}
	}
</style>
