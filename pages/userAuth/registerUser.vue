<template>
	<view class="login">
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			<navigator open-type="navigate" class="back" url="/pages/userAuth/login" hover-class="none">
				<u-icon name="arrow-left" color="#FF5261" size="60rpx"></u-icon>
			</navigator>
			Register
		</view>
		<view class="container" :style="{paddingTop: isPhone?statusBarHeight+12+'px':50+12+'px'}">
			<view class="form">
				<view class="settingLanguage" @click="languageSetting">Language Settings</view>
				<view class="title">Hello,User</view>
				<view class="title_desc">Please enter your Phone and Password to login</view>
				<!-- 账号 -->
				<u-input :placeholder="$t('registerUser.createAccountPlace')" border="none" clearable type="text"
					v-model="form.userId" :class="accountFocusClass" placeholderClass="placeholderClass"
					@focus="InputFocus('account')" @blur="InputBlur()">
				</u-input>

				<!-- 昵称 -->
				<u-input :placeholder="$t('registerUser.nickName')" border="none" clearable class="input"
					v-model="form.name" :class="nameFocusClass" placeholderClass="placeholderClass"
					@focus="InputFocus('name')" @blur="InputBlur()">
				</u-input>

				<!-- 密码 -->
				<u-input v-if="plaintext" :placeholder="$t('registerUser.enterPwdPlace')" border="none" clearable
					v-model="form.password" type="text" :class="pwdFocusClass" placeholderClass="placeholderClass"
					@focus="InputFocus('pwd')" @blur="InputBlur()">
					<u-icon size="40rpx" :name="plaintext?'eye-fill':'eye-off'" slot="suffix"
						@click="changPlaintext(0)"></u-icon>
				</u-input>
				<view v-if="!plaintext">
					<!-- 密码 -->
					<u-input :placeholder="$t('registerUser.enterPwdPlace')" border="none" clearable
						v-model="form.password" type="password" :class="pwdFocusClass"
						placeholderClass="placeholderClass" @focus="InputFocus('pwd')" @blur="InputBlur()">
						<u-icon size="40rpx" :name="plaintext?'eye-fill':'eye-off'" slot="suffix"
							@click="changPlaintext(0)"></u-icon>
					</u-input>
				</view>
				<!-- 确认密码 -->
				<u-input v-if="plaintext2" type="text" :placeholder="$t('registerUser.comfrimPwdPlace')" border="none"
					clearable v-model="form.confirm" :class="cpwdFocusClascs" placeholderClass="placeholderClass"
					@focus="InputFocus('cpwd')" @blur="InputBlur()">
					<u-icon size="40rpx" :name="plaintext2?'eye-fill':'eye-off'" slot="suffix"
						@click="changPlaintext(1)"></u-icon>
				</u-input>
				<view v-if="!plaintext2">
					<!-- 确认密码 -->
					<u-input :placeholder="$t('registerUser.comfrimPwdPlace')" border="none" clearable
						v-model="form.confirm" type="password" :class="cpwdFocusClascs"
						placeholderClass="placeholderClass" @focus="InputFocus('cpwd')" @blur="InputBlur()">
						<u-icon size="40rpx" :name="plaintext2?'eye-fill':'eye-off'" slot="suffix"
							@click="changPlaintext(1)"></u-icon>
					</u-input>
				</view>
				<!-- 邀请码 -->
				<view class="required">
					<u-input :placeholder="$t('registerUser.invitationCode')" border="none" clearable
						v-model="form.invitationCode" type="number" :class="inCodeFocusClass"
						placeholderClass="placeholderClass" @focus="InputFocus('inCode')" @blur="InputBlur()">
					</u-input>
				</view>

				<!-- 手机号码 -->
				<u-input :placeholder="$t('registerUser.mobile')" border="none" clearable type="number"
					v-model="form.mobile" :class="mobileFocusClass" placeholderClass="placeholderClass"
					@focus="InputFocus('mobile')" @blur="InputBlur()">
					<view slot="prefix">
						<view class="areaCodeBox" @click="open">
							<u-text :text="PhoneCode" class="code"></u-text>
							<u-icon name="arrow-down-fill" size="20rpx" color="#005652"></u-icon>
						</view>
					</view>
				</u-input>

				<!-- 验证码 -->
				<!-- 手机号码 -->
				<u-input :placeholder="$t('registerUser.mobileCode')" border="none" clearable type="number"
					v-model="form.authCode" :class="authCodeFocusClass" placeholderClass="placeholderClass"
					@focus="InputFocus('authCode')" @blur="InputBlur()">
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

				<view class="save_forget">
					<view class="save">
						<view :class="savePwdClass" @click="remoberPassword"></view>
						<view class="text" @click="remoberPassword">{{$t('registerUser.agree')}}</view>
					</view>
					<view class="protocol" @click="handleProtocol">《 {{$t('registerUser.Agreements')}} 》</view>
				</view>
				<!-- Login button -->
				<wyb-button class="loginBtn" type="hollow" :ripple="true"
					@click="submit">Register</wyb-button>
				<!-- logo -->
				<view class="logo"></view>

			</view>
		</view>
		<!-- 地区弹窗 -->
				<u-popup 
					:show="show" 
					@close="close" 
					:closeable="false"
					mode="right"
					:safeAreaInsetTop="true"
					:closeOnClickOverlay="true"
				>
					<view class="content" :style="{paddingTop: isPhone?statusBarHeight-30+'px':'30px'}">
						<u--input
							class="search"
							v-model="searchValue"
							prefixIcon="search"
							@change="handleChange"
							:clearable	="true"
							prefixIconStyle="font-size: 22px;color: #909399"
						></u--input>
						<view class="scroll-element">
							<scroll-view scroll-y="true" :style="'height:'+ElementHeight+'px'">
								<view 
									v-for="(item, index) in countryData" 
									:key="index" 
									:class="'items'+' '+(index+1==countryData.length?'lastItem':'')" 
									@click="handleChecked(item)"
									:id="index==countryData.length?'lastItem':''"
								>
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
			:startText="$t('registerUser.startText')" changeText="XS"
			:endText="$t('registerUser.Refresh')">
		</u-code>

		<drag-btn></drag-btn>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import md5 from "js-md5";
	import {
		nanoid
	} from 'nanoid'
	import countryData from '@/common/countryCode.js';
	import {
		RegisterPc,
		GetBaseLanguageSet,
		SendMobileAuthCodeNoBind
	} from '@/common/api.js';
	export default {
		data() {
			return {
				isPhone: false,
				statusBarHeight: 50,
				accountFocusClass: 'input',
				pwdFocusClass: 'input',
				cpwdFocusClascs: 'input',
				inCodeFocusClass: 'input',
				nameFocusClass: 'input',
				emailFocusClass: 'input',
				mobileFocusClass: 'input',
				authCodeFocusClass: 'input',
				form: {
					userId: '', //账号
					password: '', //密码
					confirm: '', //确认密码
					invitationCode: "", //邀请码
					name: '', //昵称
					email: '', //邮箱
					mobile: '', //手机号码
					authCode: '',
					agree: false, //是否同意用户协议
				},
				data: '', //用户协议内容
				showProtocol: false, //是否显示用户协议
				plaintext: false, //是否明文密码
				plaintext2: false, //是否明文密码
				PhoneCode: '+91',
				seconds: 60, //验证码倒计时
				tips: '', //验证码提示文本
				ElementHeight: 400,
				countryData: countryData.code, //区号数据
				searchValue: '',
				show: false,
				keyId: nanoid(),
				isSubmit: false
			}
		},
		computed: {
			savePwdClass() {
				return this.form.agree ? "save_icon_active" : "save_icon"
			},
			// 是否启用登录按钮
			loginBtnEnable() {
				const {
					userId,
					password,
					confirm,
					invitationCode,
					name,
					mobile,
					agree,
					authCode
				} = this.form;
				if(userId==''||password==''||confirm==''||invitationCode==''||name==''||mobile==''||authCode==""||agree==false) {
					return false;
				} else {
					return true;
				}
			},
			otpStyle() {
				const {mobile} = this.form;
				let reg = /\d/;
				if(mobile&&!reg.test(this.tips)) {
					return 'getCode active'
				}
				if(mobile&&reg.test(this.tips)){
					return 'getCode'
				}
				if(mobile==''){
					return 'getCode';
				}
			}
		},
		methods: {
			languageSetting() {
				uni.navigateTo({
					url: "/pages/languageSettings/languageSettings"
				})
			},
			
			close() {
				this.show = false;
				this.searchValue = '';
				this.countryData = countryData.code; //区号数据
			},

			open() {
				this.show = true;
				this.searchValue = '';
				this.countryData = countryData.code; //区号数据
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
				this.show = false;
			},

			mobileRules() {
				const {
					mobile
				} = this.form;
				if (!mobile) { //空
					return this.$t('registerUser.mobileIsEmpty');
				}
				if (mobile.length < 5 || mobile.length > 20) { //少于5大于20
					return this.$t('registerUser.mobileRange');
				}
				return '';
			},

			codeChange(text) {
				this.tips = text;
			},

			async getCode() {
				if (this.$refs.uCode.canGetCode) {
					let {
						mobile,
						newPassword,
						confirm
					} = this.form;
					//判断手机号码是否正确
					let mobileRules = this.mobileRules();
					if (mobileRules) {
						this.$refs.uToast.show({
							message: mobileRules,
							type: 'error',
							duration: 2000,
						})
						return;
					}
					// 模拟向后端请求验证码
					uni.showLoading({
						title: this.$t('registerUser.sending')
					})
					const res = await SendMobileAuthCodeNoBind({
						mobile: this.PhoneCode + mobile
					});
					uni.hideLoading();
					if (res.data.resultCode == 1) {
						let _this = this;
						_this.$refs.uCode.start();
						_this.$refs.uToast.show({
							message: _this.$t('registerUser.sendsuccess'),
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
				if (tag == 'account') {
					this.accountFocusClass = 'input accountFocus'
				} else if (tag == 'pwd') {
					this.pwdFocusClass = 'input pwdFocus'
				} else if (tag == 'cpwd') {
					this.cpwdFocusClascs = 'input cpwdFocus'
				} else if (tag == 'name') {
					this.nameFocusClass = 'input inCodeFocus'
				} else if (tag == 'email') {
					this.emailFocusClass = 'input emailFocus'
				} else if (tag == "mobile") {
					this.mobileFocusClass = 'input mobileFocus'
				} else if (tag == "authCode") {
					this.authCodeFocusClass = 'input authCodeFocus'
				} else {
					this.inCodeFocusClass = 'input inCodeFocus'
				}
			},

			/* 失去焦点 */
			InputBlur() {
				this.pwdFocusClass = 'input'
				this.accountFocusClass = 'input'
				this.cpwdFocusClascs = 'input'
				this.inCodeFocusClass = 'input'
				this.nameFocusClass = 'input'
				this.emailFocusClass = 'input'
				this.mobileFocusClass = 'input'
				this.authCodeFocusClass = 'input'
			},

			/* 同意用户协议 */
			remoberPassword() {
				this.$set(this.form, 'agree', !this.form.agree);
				console.log(this.form);
			},

			//规则校验函数
			rules() {
				const {
					userId,
					password,
					confirm,
					invitationCode,
					name,
					agree,
					authCode,
					mobile
				} = this.form;
				if (!userId) { //空
					return this.$t('registerUser.accountIsEmpty');
				}
				if (userId.length < 3 || userId.length > 20) { //少于3大于20
					return this.$t('registerUser.userIDRange');
				}
				if (!uni.$u.test.enOrNum(userId)) {
					return this.$t('registerUser.accountIsDorletters');
				}
				if (!name) {
					return this.$t('registerUser.nickNameIsEmpty');
				}
				if (name.length < 3 || name.length > 20) {
					return this.$t('registerUser.nickNameRang');
				}
				if (!mobile) { //空
					return this.$t('registerUser.mobileIsEmpty');
				}
				if (mobile.length < 5 || mobile.length > 20) { //少于5大于20
					return this.$t('registerUser.mobileRange');
				}
				if (!authCode) { //空
					return this.$t('registerUser.mobileCodeIsEmpty');
				}
				if (authCode.length != 4) { //少于5大于5
					return this.$t('registerUser.mobileCodeRange');
				}
				if (!password) { //空
					return this.$t('registerUser.pwdIsEmpty');
				}
				if (password.length < 6 || password.length > 12) { //少于6大于12
					return this.$t('registerUser.pwdRange');
				}
				if (!confirm) { //空
					return this.$t('registerUser.EnterConfirmpassword');
				}
				if (confirm.length < 6 || confirm.length > 12) { //少于6大于12
					return this.$t('registerUser.pwdRange');
				}

				if (!invitationCode) { //空
					return this.$t('registerUser.referenceCode');
				}
				if (invitationCode.length < 8 || invitationCode.length > 8) { //8
					return this.$t('registerUser.referenceCode');
				}
				/* 判断是否同意用户协议 */
				if (agree == false) {
					return this.$t('registerUser.RedOragree');
				}
			},

			//注册账号
			async submit() {
				//处理用户注册逻辑
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
					name: this.form.name,
					// email: this.form.email,
					password: md5(this.form.password),
					userID: this.form.userId,
					mobile: this.PhoneCode + this.form.mobile,
					authCode: this.form.authCode,
					invitationCode: this.form.invitationCode
				}
				//判断密码和确认密码是否一致
				const {
					password,
					confirm
				} = this.form;
				if (password !== confirm) {
					this.$refs.uToast.show({
						message: this.$t('registerUser.pwdDifferent'),
						type: 'error',
						duration: 1500,
					})
					return;
				}
				//防止重复提交
				if (this.isSubmit) {
					return;
				} else {
					this.isSubmit = true;
				}
				uni.showLoading({
					title: this.$t('registerUser.registering')
				});
				//验证成功请求注册，跳转到账号登录页面
				const res = await RegisterPc({
					...params
				});
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
				let _that = this;
				if (res.data.resultCode === 1) {
					this.$refs.uToast.show({
						message: this.$t('registerUser.registerSuccess'),
						type: 'success',
						duration: 2000,
						complete() {
							uni.setStorageSync("isRemember", null);
							//缓存用户token
							uni.$u.vuex("vuex_token", res.data.resultData.accessToken);
							//保存用户信息到本地
							uni.setStorageSync('userInfo', res.data.resultData)
							/* 清空头像 */
							uni.setStorageSync('faceUrl', '')
							_that.$u.route({
								type: 'switchTab',
								url: '/pages/index/index'
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

			//获取内容
			async GetBaseLanguageSetData(isShow) {
				const params = {
					lid: uni.getStorageSync('lang').Name,
					tid: 5
				}
				const res = await GetBaseLanguageSet(params);
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
					if (isShow) {
						this.showProtocol = true;
					}
					this.data = res.data.resultData;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},

			//点击用户协议
			handleProtocol() {
				uni.navigateTo({
					url:"/pages/UserAgreement/UserAgreement"
				})
			}
		},
		onLoad(options) {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
			if (options.hasOwnProperty('vcode')) {
				this.$set(this.form, 'invitationCode', options.vcode);
			}

		},
		onShow() {
			this.GetBaseLanguageSetData();
			this.isSubmit = false;
		}
	}
</script>
<style>
	page {
		background: #F7F7F7 !important;
	}
</style>
<style lang="less" scoped>
	.login {
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
					margin-top: 20rpx;
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

				.accountFocus,
				.pwdFocus,
				.cpwdFocus,
				.inCodeFocus,
				.emailFocus,
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
