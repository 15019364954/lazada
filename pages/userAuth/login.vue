<template>
	<view class="login">
		<!-- #ifdef H5 -->
		<view class="download" v-if="downloadShow">
			<view class="left">
				<view class="logo"></view>
				<view class="text">
					<view class="title">Logo App</view>
					<view class="title_desc">Safe，fast and concise</view>
				</view>
			</view>
			<view class="right">
				<view class="downloadBtn">Download APP</view>
				<u-icon name="close" size="30rpx" color="#fff" @click="closeDownload"></u-icon>
			</view>
		</view>
		<!-- #endif -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			Login
		</view>
		<view class="container">
			<view class="form">
				<view class="settingLanguage" @click="languageSetting">Language Settings</view>
				<view class="title">Hello,User</view>
				<view class="title_desc">Please enter your Phone and Password to login</view>
				<u-input :class="userIDFocus" placeholderClass="placeholderClass" placeholder="Enter your Phone number"
					@focus="InputFocus('userID')" @blur="InputBlur()" :clearable="true" v-model="form.userId">
					<!-- <view slot="prefix">
						<view class="areaCodeBox">
							<u-text text="+86" class="code"></u-text>
							<u-icon name="arrow-down-fill" size="20rpx" color="#005652"></u-icon>
						</view>
					</view> -->
				</u-input>
				<u-input :class="pwdFocus" placeholderClass="placeholderClass" placeholder="Enter your login password"
					@focus="InputFocus('pwd')" @blur="InputBlur()" v-if="plaintext" border="none" :clearable="true"
					type="text" :password-icon="true" v-model="form.password">
					<u-icon size="40rpx" :name="plaintext?'eye-fill':'eye-off'" slot="suffix" @click="changPlaintext">
					</u-icon>
				</u-input>

				<view v-if="!plaintext">
					<u-input border="none" :clearable="true" type="password" :class="pwdFocus"
						placeholder="Enter your login password" placeholderClass="placeholderClass"
						@focus="InputFocus('pwd')" @blur="InputBlur()" :password-icon="true" v-model="form.password">
						<u-icon size="40rpx" :name="plaintext?'eye-fill':'eye-off'" slot="suffix"
							@click="changPlaintext"></u-icon>
					</u-input>
				</view>

				<view class="save_forget">
					<view class="save">
						<view :class="savePwdClass" @click="savePwdToggleClass"></view>
						<view class="text" @click="savePwdToggleClass">Save password</view>
					</view>
					<view class="forget" @click="toForget">Forget password</view>
				</view>
				<!-- Login button -->
				<wyb-button :class="loginBtnEnable?'loginBtn':'disabledLogin'" type="hollow" :ripple="true"
					:disabled="loginBtnEnable?false:true" @click="login">Login</wyb-button>
				<!-- register button -->
				<wyb-button class="registerBtn" type="hollow" :ripple="true" @click="toRegister">Register</wyb-button>
				<!-- logo -->
				<view class="logo"></view>

			</view>
		</view>
		<drag-btn></drag-btn>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import Base64 from "base-64"
	import md5 from "js-md5";
	import {
		Login1,
		LoginEmail,
		GetAppUpgradeList,
		GetBaseLanguageSet,
		GetSite
	} from '@/common/api.js';
	export default {
		data() {
			return {
				isPhone: false,
				statusBarHeight: 50, //刘海默认高度
				userIDFocus: "input",
				pwdFocus: "input passwordInput",
				remember: false,
				downloadShow: true,
				form: {
					userId: '', //账号||邮箱
					password: '', //密码
				},
				plaintext: false, //是否明文密码
				isSubmit: false
			}
		},
		computed: {
			savePwdClass() {
				return this.remember ? "save_icon_active" : "save_icon"
			},
			// 是否启用登录按钮
			loginBtnEnable() {
				const {
					userId,
					password
				} = this.form;
				return userId && password ? true : false;
			}
		},
		methods: {
			languageSetting() {
				uni.navigateTo({
					url: "/pages/languageSettings/languageSettings"
				})
			},
			
			toRegister() {
				uni.navigateTo({
					url: "/pages/userAuth/registerUser"
				})
			},
			
			toForget() {
				uni.navigateTo({
					url: "/pages/userAuth/resetPassword"
				})
			},
			
			InputFocus(tag) {
				if (tag == 'userID') {
					this.userIDFocus = "input userIDFocus";
				} else {
					this.pwdFocus = "input passwordInput pwdFocus";
				}
			},

			InputBlur() {
				this.userIDFocus = "input";
				this.pwdFocus = "input passwordInput";
			},

			savePwdToggleClass() {
				this.remember = !this.remember;
			},

			closeDownload() {
				this.downloadShow = false;
			},

			/* 点击是否显示密码icon */
			changPlaintext() {
				this.plaintext = !this.plaintext
			},

			async GetSiteData() {
				const res = await GetSite();
				if (res.data.resultCode == 1) {
					uni.setStorageSync('isDistribution', res.data.resultData.isDistribution);
				}
			},

			/* 点击登录 */
			async login() {
				const {
					userId,
					password
				} = this.form;
				let rulesFail = this.rules();
				if (rulesFail) {
					this.$refs.uToast.show({
						message: rulesFail,
						type: 'warning',
						duration: 2000,
					})
					return;
				}
				//處理參數
				let params = {
					password: md5(this.form.password),
					userID: this.form.userId
				}

				//防止重复提交
				if (this.isSubmit) {
					return;
				} else {
					this.isSubmit = true;
				}

				//处理记住密码逻辑,记住：保存用户id+加密用户密码+是否记住参数到本地，下次进来填充
				if (this.remember) {
					uni.setStorageSync("isRemember", {
						userId: userId,
						pwd: Base64.encode(password),
						isRemmber: true
					})
				} else {
					//如果取消记住密码清除本地缓存
					uni.setStorageSync("isRemember", null);
				}
				uni.showLoading({
					title: this.$t('login.logining')
				});

				//验证成功请求登录，获取缓存用户token和用户信息到本地
				const res = await Login1({
					...params
				});
				uni.hideLoading();
				this.isSubmit = false;
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
					//缓存用户token
					uni.$u.vuex("vuex_token", res.data.resultData.accessToken);
					//保存用户信息到本地
					uni.setStorageSync('userInfo', res.data.resultData)
					//设置用户头像
					uni.setStorageSync('faceUrl', res.data.resultData.faceUrl);
					this.$refs.uToast.show({
						message: this.$t('login.loginSuccess'),
						type: 'success',
						duration: 1500,
						complete() {
							uni.switchTab({
								url: "/pages/index/index",
							})
						}
					})
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 1500,
					})
				}
			},
			/* 校验用户输入 */
			rules() {
				const {
					userId,
					password
				} = this.form;
				//如果不是邮箱按照账号规则去校验
				if (!userId) { //空
					return this.$t('login.accountIsEmpty');
				}
				if (userId.length < 3 || userId.length > 20) { //少于5大于20
					return this.$t('login.userIDRange');
				}
				if (!password) { //空
					return this.$t('login.pwdIsEmpty');
				}
				if (password.length < 6 || password.length > 12) { //少于6大于12
					return this.$t('login.pwdRange');
				}
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

		},
		onReady() {
			//页面加载完成判断用户是否记住密码
			const isRemmber = uni.getStorageSync("isRemember");
			if (isRemmber) {
				this.remember = isRemmber.isRemmber;
				this.form = {
					userId: isRemmber.userId,
					password: Base64.decode(isRemmber.pwd),
				}
			}
		},
	}
</script>
<style>
	page {
		background: #F7F7F7 !important;
	}
</style>
<style lang="less" scoped>
	.login {
		.download {
			height: 88rpx;
			width: 100%;
			background: linear-gradient(90deg, #ff5261, #ff8588);
			display: flex;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0 24rpx;

			.left {
				display: flex;
				align-items: center;

				.logo {
					width: 136rpx;
					height: 60rpx;
					background: #ffffff;
					border-radius: 8rpx;
					background: #ffffff url("../../static/logo.png") no-repeat center center;
					background-size: 96rpx 32rpx;
					margin-right: 24rpx;
				}

				.text {
					.title {
						height: 20rpx;
						font-size: 20rpx;
						font-family: "PingFangSC-Regular";
						font-weight: 400;
						color: #ffffff;
						line-height: 20rpx;
						margin-bottom: 16rpx;
					}

					.title_desc {
						.title;
						margin-bottom: 0;
					}
				}
			}

			.right {
				display: flex;
				align-items: center;

				.downloadBtn {
					height: 32rpx;
					font-size: 22rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					color: #ffffff;
					line-height: 32rpx;
					margin-right: 30rpx;
				}
			}
		}

		.header {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			font-family: "PingFangSC-Medium";
			// font-weight: 500;
			text-align: right;
			color: #ff5261;
			box-sizing: border-box;
		}

		.container {
			width: 100%;
			box-sizing: border-box;
			padding: 0 24rpx;
			.form {
				background-color: #fff;
				height: max-content;
				display: flex;
				flex-direction: column;
				align-items: center;
				.settingLanguage {
					width: auto;
					height: 40rpx;
					font-size: 28rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					text-align: center;
					color: #ff5261;
					line-height: 40rpx;
					margin-left: auto;
					margin-top: 28rpx;
					margin-right: 44rpx;
				}

				.title {
					width: 100%;
					height: 80rpx;
					font-size: 48rpx;
					font-family: "PingFangSC-Medium";
					// font-weight: 400;
					text-align: center;
					color: #333333;
					line-height: 80rpx;
					margin-top: 80rpx;
				}

				.title_desc {
					width: 530rpx;
					font-size: 24rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					text-align: center;
					color: #999999;
					line-height: 24rpx;
					margin-bottom: 80rpx;
					margin-top: 36rpx;
				}

				/deep/ .input {
					.u-input__content__field-wrapper__field {
						font-size: 28rpx !important;
						font-family: "PingFangSC-Medium";
						// font-weight: 500;
						color: #005652 !important;
					}
				}

				.input {
					width: 614rpx;
					margin-bottom: 30rpx;
					height: 90rpx;
					box-sizing: border-box;
					box-sizing: border-box;
					margin-bottom: 40rpx;
					background-color: #F7F7F7;
					border-radius: 46rpx;
					padding-left: 40rpx !important;
					padding-right: 20rpx !important;
					border: 1px solid transparent;
					flex: auto;

					&.userIDFocus,
					&.pwdFocus {
						border: 1px solid #FF5261;
					}

					.areaCodeBox {
						display: flex;
						height: 100%;
						margin-left: 44rpx;
						margin-right: 24rpx;
						align-items: center;

						.code {
							height: 40rpx;
							font-size: 28rpx;
							font-family: "PingFangSC-Regular";
							// font-weight: 400;
							color: #005652;
							line-height: 40rpx;
							display: inline-block;
							margin-right: 12rpx !important;
						}
					}
				}

				/deep/ .placeholderClass {
					font-size: 28rpx;
					font-family: "PingFangSC-Regular";
					// font-weight: 400;
					color: #bbbbbb;
				}

				.save_forget {
					width: 614rpx;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;

					.save {
						display: flex;

						.text {
							height: 34rpx;
							font-size: 24rpx;
							font-family: "PingFangSC-Regular";
							// font-weight: 400;
							color: #999999;
							line-height: 34rpx;
						}

						.save_icon {
							width: 40rpx;
							height: 40rpx;
							background-color: #ffffff;
							border-radius: 8rpx;
							border: 1px solid #979797;
							box-sizing: border-box;
							margin-right: 16rpx;
						}

						.save_icon_active {
							.save_icon;
							background: #FF5261 url("../../static/image/userAuth/saveIcon.png") no-repeat center center;
							background-size: 32rpx 24rpx;
							border: none;
						}
					}

					.forget {
						height: 34rpx;
						font-size: 24rpx;
						font-family: "PingFangSC-Regular";
						// font-weight: 400;
						text-align: center;
						color: #999999;
						line-height: 34rpx;
					}
				}

				.disabledLogin {
					width: 614rpx !important;
					margin-top: 80rpx;

					/deep/.wyb-button {
						box-sizing: border-box;
						height: 90rpx;
						line-height: 86rpx;
						text-align: center;
						border-radius: 46rpx !important;
						background-color: #CCCCCC !important;
						font-size: 32rpx;
						font-family: "PingFangSC-Medium";
						// font-weight: 500;
						color: #ffffff !important;
						border: none !important;
						box-sizing: border-box;
					}
				}

				.loginBtn {
					width: 614rpx !important;
					margin-top: 80rpx;

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

				.registerBtn {
					width: 614rpx !important;
					margin: 40rpx;
					/deep/.wyb-button {
						height: 90rpx;
						border: 1px solid #ff5261 !important;
						border-radius: 48rpx !important;
						line-height: 86rpx;
						text-align: center;
						font-size: 32rpx;
						font-family: "PingFangSC-Medium";
						// font-weight: 700;
						color: #000000 !important;
						box-sizing: border-box;
					}
				}
			}
		}
	}
</style>
