<template>
	<view>
		<!-- 自定义头部 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			{{$t('bindWallet.title')}}
		</view>

		<!-- 内容区域 -->
		<view class="container" :style="{paddingTop: isPhone?statusBarHeight+'px':60+'px'}">
			<!-- from表单 -->
			<view class="from">

				<!-- 欢迎 -->
				<view class="top">
					<view class="desc">{{$t('bindWallet.informationBelow')}}</view>
				</view>
				<view class="inputTitle">{{$t('bindWallet.currentMobileText')}}</view>
				<u-input border="none" clearable type="text" :disabled="true" v-model="form.mobile"
					:class="mobileFocusClass" placeholderClass="placeholderClass" @focus="InputFocus('mobile')"
					@blur="InputBlur()">
				</u-input>

				<view class="inputTitle">{{$t('bindWallet.enterMobileVerCode')}}</view>
				<u-input border="none" clearable type="number" v-model="form.authCode" :class="authCodeFocusClass"
					placeholderClass="placeholderClass" @focus="InputFocus('authCode')" @blur="InputBlur()">
					<view slot="suffix">
						<u-button
							@tap="getCode" 
							type="success" 
							class="getCode"
						>
							{{tips}}
						</u-button>
					</view>
				</u-input>

				<!-- 钱包地址 -->
				<view class="inputTitle">{{$t('bindWallet.enterWalletAddressTrc20')}}</view>
				<u-input border="none" inputAlign="left" type="text" :class="walletFocusClass"
					placeholderClass="placeholderClass" @focus="InputFocus('wallet')" @blur="InputBlur()"
					v-model="form.wallet">
				</u-input>

				<view class="btnGroup">
					<wyb-button class="confirm itemBtn" type="hollow" :ripple="true"
						 @click="handleBindWallet"
					>
						 {{$t('bindWallet.ConfirmBtnText')}}
					</wyb-button>
				</view>


			</view>

			<!-- 底部温馨提示 -->
			<view class="bottom">
				<view style="margin-bottom: 20rpx;">
					{{$t('bindWallet.bottomTips1')}}
				</view>
				<view style="margin-bottom: 20rpx;">
					{{$t('bindWallet.bottomTips2')}}
				</view>
				<view style="margin-bottom: 20rpx;">
					{{$t('bindWallet.bottomTips3')}}
				</view>
				<view style="margin-bottom: 20rpx;">
					{{$t('bindWallet.bottomTips4')}}
				</view>
			</view>
		</view>

		<u-code :seconds="seconds" ref="uCode" @change="codeChange" :startText="$t('bindWallet.startText')"
			changeText="XS" :endText="$t('bindWallet.Refresh')">
		</u-code>

		<!-- 提示信息 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		GetMyReport,
		BindWallet,
		SendMobileAuthCode
	} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 60, //刘海默认高度
				isPhone: false, //是否是手机
				nameFocusClass: 'input',
				walletFocusClass: 'input',
				mobileFocusClass: 'input',
				authCodeFocusClass: 'input',
				hasWallet: false, //是否有钱包地址
				seconds: 60, //验证码倒计时
				tips: '', //验证码提示文本
				form: {
					wallet: '',
					mobile: '',
					authCode: ''
				},
				isSubmit: false
			}
		},
		methods: {

			codeChange(text) {
				this.tips = text;
			},

			async getCode() {
				if (this.$refs.uCode.canGetCode) {
					let {
						mobile
					} = this.form;
					//判断手机号码是否正确
					// 模拟向后端请求验证码
					uni.showLoading({
						title: this.$t('bindWallet.sending')
					})
					const res = await SendMobileAuthCode({
						mobile: mobile
					});
					uni.hideLoading();
					if (res.data.resultCode == 1) {
						let _this = this;
						_this.$refs.uCode.start();
						_this.$refs.uToast.show({
							message: _this.$t('bindWallet.sendsuccess'),
							type: 'success',
							duration: 2000,
						})
					} else {
						this.$refs.uToast.show({
							message: this.$t("config.resultCode" + res.data.resultCode),
							type: 'error',
							duration: 2000,
						})
					}
				}
			},

			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/Account/Account');
			},

			/* 获取焦点*/
			InputFocus(tag) {
				if (tag == 'name') {
					this.nameFocusClass = 'input nameFocus'
				} else if (tag == "wallet") {
					this.walletFocusClass = 'input walletFocus'
				} else if (tag == "authCode") {
					this.authCodeFocusClass = 'input authCodeFocus'
				} else {
					this.mobileFocusClass = 'input mobileFocus'
				}
			},

			/* 失去焦点 */
			InputBlur() {
				this.nameFocusClass = 'input'
				this.walletFocusClass = 'input'
				this.authCodeFocusClass = 'input'
				this.mobileFocusClass = 'input'
			},

			//规则校验函数
			rules() {
				const {
					name,
					wallet,
					authCode
				} = this.form;
				if (!authCode) {
					return this.$t('bindWallet.mobileCodeIsEmpty');
				}
				if (authCode.length != 4) {
					return this.$t('bindWallet.mobileCodeRange');
				}
				if (!wallet) {
					return this.$t('bindWallet.walletaddressIsEmpty');
				}
				if (wallet.startsWith('T') == false) {
					return this.$t('bindWallet.startWithError');
				}
				if (wallet.length !== 34) {
					return this.$t('bindWallet.startWithError');
				}
				return ''
			},

			//绑定钱包
			async handleBindWallet() {
				//提交前校验
				let rulesFail = this.rules();
				if (rulesFail) {
					this.$refs.uToast.show({
						message: rulesFail,
						type: 'error',
						duration: 2000,
					})
					return;
				}
				const params = {
					wallet: this.form.wallet,
					mobile: this.form.mobile,
					authCode: this.form.authCode,
					userID: uni.getStorageSync('userInfo').userID
				}
				//防止重复提交
				if (this.isSubmit) {
					return;
				} else {
					this.isSubmit = true;
				}
				uni.showLoading();
				const res = await BindWallet(params);
				this.isSubmit = false;
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
					//再次获取钱包信息
					this.$refs.uToast.show({
						message: this.$t('bindWallet.EditedSuccess'),
						type: 'success',
						duration: 2000,
						complete: () => {
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
					//判断是否有钱包地址
					if (res.data.resultData.wallet) {
						this.hasWallet = true;
						this.form = {
							wallet: res.data.resultData.wallet,
							mobile: res.data.resultData.mobile
						}
					} else {
						this.hasWallet = false;
						this.form = {
							wallet: '',
							mobile: res.data.resultData.mobile
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
		onLoad(options) {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
		},

		onShow() {
			if (!this.$u.utils.Permissions()) return;
			this.GetMyReportData();
			this.isSubmit = false;
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

	.container {
		// display: flex;
		width: 100%;
		box-sizing: border-box;

		.from {
			width: 100%;
			box-sizing: border-box;
			background-color: #fff;
			padding: 0 24rpx;
			background-color: #fff;

			.top {
				.hello {
					height: 70rpx;
					font-size: 62rpx;
					font-weight: bold;
					font-family: "PingFangSC-Medium";
					color: #666666;
					line-height: 70rpx;
					text-align: center;
				}

				.desc {
					text-align: center;
					font-size: 28rpx;
					color: #888888;
					line-height: 32rpx;
					margin-top: 24rpx;
					padding-top: 20rpx;
				}
			}

			.inputTitle {
				margin-top: 44rpx;
				margin-bottom: 20rpx;
				font-size: 28rpx;
				font-family: "PingFangSC-Medium";
				// font-weight: 500;
				text-align: left;
				color: #005652;
				line-height: 40rpx;
			}

			.input {
				margin-bottom: 30rpx;
				height: 108rpx;
				box-sizing: border-box;
				padding-left: 36rpx !important;
				padding-right: 36rpx !important;
				border: 1px solid #005652;
				border-radius: 48rpx;
				padding-right: 20rpx !important;
				.getCode {
					width: 180rpx;
					height: 70rpx;
					background: linear-gradient(308deg,#ff5261 10%, #ff8588 87%);
					border-radius: 46rpx;
					border: none;
				}
			}

			.walletFocus,
			.nameFocus,
			.mobileFocus,
			.authCodeFocus {}

			.btnGroup{
				padding: 0 24rpx;
				box-sizing: border-box;
				width: 100%;
			}
			.itemBtn {
				width: 100% !important;
				margin-top: 80rpx;
				margin-bottom: 40rpx;
				box-sizing: border-box;
			
				/deep/.wyb-button {
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
	}

	.bottom {
		font-size: 28rpx;
		font-family: "PingFangSC-Regular";
		// font-weight: 400;
		text-align: left;
		color: #bbbbbb;
		line-height: 28rpx;
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;
		padding-bottom: 40rpx;
	}
</style>
