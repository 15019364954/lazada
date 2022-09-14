<template>
	<view class="resetPwd">
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			<navigator open-type="navigate" class="back" url="/pages/userAuth/login" hover-class="none">
				<u-icon name="arrow-left" color="#FF5261" size="60rpx"></u-icon>
			</navigator>
			Login Password Reset
		</view>

		<view class="container">
			<view class="form">
				<!-- 输入手机号码 -->
				<u-input border="none" clearable type="number" v-model="form.mobile" :class="phoneFocusClass"
					placeholderClass="placeholderClass" @focus="InputFocus('phone')" @blur="InputBlur()" placeholder="Enter your Phone number">
					<view slot="prefix">
						<view class="areaCodeBox" @click="open">
							<u-text :text="PhoneCode" class="code"></u-text>
							<u-icon name="arrow-down-fill" size="20rpx" color="#005652"></u-icon>
						</view>
					</view>
				</u-input>

				<u-input border="none" clearable type="number" v-model="form.authCode" :class="authCodeFocusClass"
					placeholderClass="placeholderClass" @focus="InputFocus('authCode')" @blur="InputBlur()" placeholder="Enter your verification code">
						<view slot="suffix" >
							<u-button 
								@tap="getCode" 
								type="success" 
								class="getCode"
							>
								{{tips}}
							</u-button>
						</view>
				</u-input>

				<!-- 输入密码 -->
				<u-input v-if="plaintext" border="none" clearable type="text" v-model="form.newPassword"
					:class="pwdFocusClass" placeholderClass="placeholderClass" @focus="InputFocus('pwd')"
					@blur="InputBlur()" placeholder="Create your new login password">
					<u-icon size="40rpx" :name="plaintext?'eye-fill':'eye-off'" slot="suffix"
						@click="changPlaintext(0)"></u-icon>
				</u-input>
				<view v-if="!plaintext">
					<u-input border="none" clearable type="password" v-model="form.newPassword" :class="pwdFocusClass"
						placeholderClass="placeholderClass" @focus="InputFocus('pwd')" @blur="InputBlur()" placeholder="Confirm your new login password">
						<u-icon size="40rpx" :name="plaintext?'eye-fill':'eye-off'" slot="suffix"
							@click="changPlaintext(0)"></u-icon>
					</u-input>
				</view>

				<!-- 确认密码 -->
				<u-input v-if="plaintext2" border="none" clearable type="text" v-model="form.confirm"
					:class="cpwdFocusClascs" placeholderClass="placeholderClass" @focus="InputFocus('cpwd')"
					@blur="InputBlur()" placeholder="Confirm your new login password">
					<u-icon size="40rpx" :name="plaintext2?'eye-fill':'eye-off'" slot="suffix"
						@click="changPlaintext(1)"></u-icon>
				</u-input>
				<view v-if="!plaintext2">
					<u-input border="none" clearable type="password" v-model="form.confirm" :class="cpwdFocusClascs"
						placeholderClass="placeholderClass" @focus="InputFocus('cpwd')" @blur="InputBlur()" placeholder="Confirm your new login password">
						<u-icon size="40rpx" :name="plaintext2?'eye-fill':'eye-off'" slot="suffix"
							@click="changPlaintext(1)"></u-icon>
					</u-input>
				</view>
				<!-- Login button -->
				<wyb-button class="loginBtn" type="hollow" :ripple="true"
					@click="confirm">Save</wyb-button>
				<!-- logo -->
				<view class="logo"></view>

			</view>
		</view>
		<!-- 地区弹窗 -->
		<u-popup :show="show" @close="close" :closeable="false" mode="right" :safeAreaInsetTop="true"
			:closeOnClickOverlay="true">
			<view class="content" :style="{paddingTop: isPhone?statusBarHeight-30+'px':'30px'}">
				<u--input class="search" v-model="searchValue" prefixIcon="search" @change="handleChange"
					:clearable="true" prefixIconStyle="font-size: 22px;color: #909399"></u--input>
				<view class="scroll-element">
					<scroll-view scroll-y="true" :style="'height:'+ElementHeight+'px'">
						<view v-for="(item, index) in countryData" :key="index"
							:class="'items'+' '+(index+1==countryData.length?'lastItem':'')"
							@click="handleChecked(item)" :id="index==countryData.length?'lastItem':''">
							<view class="u-line-1 leftEn">
								{{item["en"]}}
							</view>
							<view>{{item["phone_code"]}}</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</u-popup>
		<u-code :seconds="seconds" ref="uCode" :key="keyId" @change="codeChange"
			:startText="$t('registerUser.startText')" changeText="XS" :endText="$t('registerUser.Refresh')">
		</u-code>

		<drag-btn></drag-btn>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {SendMobileAuthCode, ResetPasswordNoLogin} from '@/common/api.js';
	import {nanoid} from 'nanoid'
	import countryData from '@/common/countryCode.js';
	import md5 from "js-md5";
	export default {
		data() {
			return {
				isPhone: false,
				statusBarHeight: 50,
				phoneFocusClass: 'input',
				pwdFocusClass: 'input',
				cpwdFocusClascs: 'input',
				authCodeFocusClass: 'input',
				countryData: countryData.code, //区号数据
				show: false,
				searchValue: '',
				PhoneCode: '+91',
				ElementHeight: 400,
				area: 'India',
				form: {
					mobile: '', //手机号码
					newPassword: '', //密码
					confirm: '', //确认密码
					authCode: '', //手机验证码
				},
				plaintext: false, //是否明文密码
				plaintext2: false, //是否明文密码
				seconds: 60, //验证码倒计时
				tips: '', //验证码提示文本
				keyId: nanoid(),
				isSubmit: false,
			}
		},
		computed: {
			// 是否启用登录按钮
			loginBtnEnable() {
				const {
					confirm,
					newPassword,
					mobile,
					authCode
				} = this.form;
				if(confirm==''||mobile==''||authCode==""||newPassword=='') {
					return false;
				} else {
					return true;
				}
			},
		},
		methods: {

			/* 判断手机号有没有输入 */
			mobileRules() {
				const {
					mobile
				} = this.form;
				if (!mobile) { //空
					return this.$t('forGetPwd.mobileIsEmpty');
				}
				if (mobile.length < 5 || mobile.length > 20) { //少于5大于20
					return this.$t('forGetPwd.mobileRange');
				}
				return '';
			},
			async getCode() {
				if (this.$refs.uCode.canGetCode) {
					let mobileRules = this.mobileRules();
					if (mobileRules) {
						this.$refs.uToast.show({
							message: mobileRules,
							type: 'error',
							duration: 2000,
						})
						return;
					}
					//判断手机号码是否正确
					// 模拟向后端请求验证码
					uni.showLoading({
						title: this.$t('forGetPwd.sending')
					})
					const res = await SendMobileAuthCode({
						mobile: this.PhoneCode + this.form.mobile
					});
					uni.hideLoading();
					if (res.data.resultCode == 1) {
						let _this = this;
						_this.$refs.uCode.start();
						_this.$refs.uToast.show({
							message: _this.$t('forGetPwd.sendsuccess'),
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

			codeChange(text) {
				this.tips = text;
			},

			/* 点击是否显示密码icon */
			changPlaintext(type) {
				if (type) {
					this.plaintext2 = !this.plaintext2
				} else {
					this.plaintext = !this.plaintext
				}
			},

			/* 获取焦点*/
			InputFocus(tag) {
				if (tag == 'phone') {
					this.phoneFocusClass = 'input phoneFocus'
				} else if (tag == 'pwd') {
					this.pwdFocusClass = 'input pwdFocus'
				} else if (tag == 'cpwd') {
					this.cpwdFocusClascs = 'input cpwdFocus'
				} else {
					this.authCodeFocusClass = "input authCodeFocus"
				}
			},

			/* 失去焦点 */
			InputBlur() {
				this.phoneFocusClass = 'input';
				this.pwdFocusClass = 'input'
				this.cpwdFocusClascs = 'input'
				this.authCodeFocusClass = "input"
			},

			close() {
				this.searchValue = '';
				this.countryData = countryData.code
				this.show = false;
			},

			open() {
				this.searchValue = '';
				this.countryData = countryData.code
				this.show = true;
				let windowHeight = uni.getSystemInfoSync().windowHeight;
				this.ElementHeight = windowHeight - this.statusBarHeight - uni.upx2px(64);
			},

			// 搜索
			handleChange(value) {
				//转换成小写
				const inputValue = value.toLowerCase();
				//过滤数据
				let result = countryData.code.filter((item) => {
					return item["phone_code"].indexOf(inputValue) != -1 || item["en"].indexOf(inputValue) != -1;
				})
				//判断是否为空
				this.countryData = value ? result : countryData.code;
			},

			//处理选中号码
			handleChecked(item) {
				this.PhoneCode = item['phone_code'];
				this.area = item['en'];
				this.show = false;
			},


			/* 校验用户输入 */
			rules() {
				const {
					mobile,
					newPassword,
					confirm,
					authCode
				} = this.form;
				if (!mobile) { //空
					return this.$t('forGetPwd.mobileIsEmpty');
				}
				if (mobile.length < 5 || mobile.length > 20) { //少于5大于20
					return this.$t('forGetPwd.mobileRange');
				}
				if (!authCode) { //空
					return this.$t('forGetPwd.mobileCodeIsEmpty');
				}
				if (authCode.length != 4) { //少于4
					return this.$t('forGetPwd.mobileCodeRange');
				}
				if (!newPassword) { //空
					return this.$t('forGetPwd.pwdIsEmpty');
				}
				if (newPassword.length < 6 || newPassword.length > 12) { //少于6大于12
					return this.$t('forGetPwd.pwdRange');
				}
				if (!confirm) { //空
					return this.$t('forGetPwd.EnterConfirmpassword');
				}
				if (confirm.length < 6 || confirm.length > 12) { //少于6大于12
					return this.$t('forGetPwd.pwdRange');
				}

			},

			/* 下一步获取验证码 */
			async confirm() {
				//处理用户注册逻辑
				let rulesFail = this.rules();
				let {
					mobile,
					newPassword,
					confirm,
					authCode
				} = this.form;
				if (rulesFail) {
					this.$refs.uToast.show({
						message: rulesFail,
						type: 'error',
						duration: 2000,
					})
					return;
				}

				//判断密码和确认密码是否一致
				if (newPassword !== confirm) {
					this.$refs.uToast.show({
						message: this.$t('forGetPwd.pwdDifferent'),
						type: 'error',
						duration: 2000,
					})
					return;
				}
				let params = {
					mobile: this.PhoneCode + mobile,
					authCode: authCode,
					newPassword: md5(newPassword),
				}
				//防止重复提交
				if (this.isSubmit) {
					return;
				} else {
					this.isSubmit = true;
				}
				uni.showLoading({
					title: this.$t('forGetPwd.loading')
				});
				const res = await ResetPasswordNoLogin(params);
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
				let _that = this;
				if (res.data.resultCode === 1) {
					this.$refs.uToast.show({
						message: this.$t('forGetPwd.resetsuccess'),
						type: 'success',
						duration: 2000,
						complete() {
							uni.setStorageSync("isRemember", null);
							_that.$u.route({
								type: 'reLaunch',
								url: '/pages/userAuth/login'
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
			}
		},
		onLoad(options) {
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
		background-color: #f7f7f7 !important;
	}
</style>
<style lang="less" scoped>
	.resetPwd {
		padding-bottom: 100rpx;
			.scroll-Y {
					height: 700rpx;
			}
			.scroll-view_H {
				border-radius: 20rpx;
				font-family: 'Arial';
			}
			
			.content{
				flex-grow: 1;
				.scroll-element{
					flex-grow: 1;
				}
				.items{
					display: flex;
					justify-content: space-between;
					width: 380rpx;
					padding: 20rpx 30rpx;
				}
				.lastItem{
					padding-bottom: 100rpx;
				}
			}
			.search{
				flex-grow: initial;
				width: 380rpx;
				margin: 0 30rpx!important;
				height: 64rpx;
				padding-top: 0!important;
				padding-bottom: 0!important;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border: 1px solid #ddd;
			}
			.search /deep/ .uni-input-input{
				padding-top: 0!important;
				padding-bottom: 0!important;
				line-height: 64rpx;
				height: 64rpx;
				box-sizing: border-box;
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
	
			.back {
				width: 100rpx;
				height: 54rpx;
				display: flex;
				justify-content: flex-start;
				position: absolute;
				left: 24rpx;
			}
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
				padding-top: 80rpx;
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
	
				.phoneFocus,
				.pwdFocus,
				.cpwdFocus,
				.mobileFocus,
				.authCodeFocus {
					border: 1px solid #FF5261 !important;
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
					.getCode {
						width: 180rpx;
						height: 70rpx;
						background: linear-gradient(308deg,#ff5261 10%, #ff8588 87%);
						border-radius: 46rpx;
						border: none;
					}
					.areaCodeBox {
						display: flex;
						height: 100%;
						// margin-left: 44rpx;
						margin-right: 24rpx;
						align-items: center;
						.code {
							width: auto;
							height: 40rpx;
							font-size: 28rpx;
							font-family: "PingFangSC-Regular";
							// font-weight: 400;
							color: #005652;
							line-height: 40rpx;
							display: inline-block;
							margin-right: 12rpx !important;
							&/deep/ .u-text__value{
								font-size: 30rpx!important;
								font-weight: 700!important;
							}
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
					align-items: center;
					.protocol{
						margin-left: 20rpx;
						font-size: 24rpx;
						color: #FF5261;
						font-family: "PingFangSC-Regular";
					}
					.save {
						display: flex;
						align-items: center;
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
				}
	
				.loginBtn {
					width: 614rpx !important;
					margin-top: 80rpx;
					margin-bottom: 40rpx;
	
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
	}
</style>
