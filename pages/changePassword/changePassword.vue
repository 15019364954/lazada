<template>
	<view>
		<!-- 自定义头部 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			{{$t('changePassword.title')}}
		</view>
		
		<view class="container" :style="{paddingTop: isPhone?statusBarHeight+'px':60+'px'}">
			<view class="form">
				<!-- 输入手机号码 -->
				<view class="inputTitle phoneInputTitle">{{$t('changePassword.currentBindMobile')}}</view>
				<u-input
					border="none"
					clearable
					:disabled="true"
					type="text"
					v-model="mobile" 
					:class="phoneFocusClass"
					placeholderClass="placeholderClass"
					@focus="InputFocus('phone')"
					@blur="InputBlur()"
				>
				</u-input>
				
				<view class="inputTitle phoneInputTitle" >{{$t('changePassword.enterMobileVerCode')}}</view>
				<u-input
					border="none"
					clearable
					type="number"
					v-model="form.authCode" 
					:class="authCodeFocusClass"
					placeholderClass="placeholderClass"
					@focus="InputFocus('authCode')"
					@blur="InputBlur()"
				>
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
				<view class="inputTitle phoneInputTitle">{{$t('changePassword.enterNewPwd')}}</view>
				<u-input
					v-if="plaintext"
					border="none"
					clearable
					type="text"
					v-model="form.newPassword"
					:class="pwdFocusClass"
					placeholderClass="placeholderClass"
					@focus="InputFocus('pwd')"
					@blur="InputBlur()"
				>
				<u-icon size="40rpx" :name="plaintext?'eye-fill':'eye-off'" slot="suffix" @click="changPlaintext(0)"></u-icon>
				</u-input>
				<view v-if="!plaintext">
					<u-input
						border="none"
						clearable
						type="password"
						v-model="form.newPassword"
						:class="pwdFocusClass"
						placeholderClass="placeholderClass"
						@focus="InputFocus('pwd')"
						@blur="InputBlur()"
					>
					<u-icon size="40rpx" :name="plaintext?'eye-fill':'eye-off'" slot="suffix" @click="changPlaintext(0)"></u-icon>
					</u-input>
				</view>
				
				<!-- 确认密码 -->
				<view class="inputTitle phoneInputTitle">{{$t('changePassword.confirmPwd')}}</view>
				<u-input
					v-if="plaintext2"
					border="none"
					clearable
					type="text"
					v-model="form.confirm"
					:class="cpwdFocusClascs"
					placeholderClass="placeholderClass"
					@focus="InputFocus('cpwd')"
					@blur="InputBlur()"
				>
				<u-icon size="40rpx" :name="plaintext2?'eye-fill':'eye-off'" slot="suffix" @click="changPlaintext(1)"></u-icon>
				</u-input>
				<view v-if="!plaintext2">
					<u-input
						border="none"
						clearable
						type="password"
						v-model="form.confirm"
						:class="cpwdFocusClascs"
						placeholderClass="placeholderClass"
						@focus="InputFocus('cpwd')"
						@blur="InputBlur()"
					>
					<u-icon size="40rpx" :name="plaintext2?'eye-fill':'eye-off'" slot="suffix" @click="changPlaintext(1)"></u-icon>
					</u-input>
				</view>
				
				<!-- 确认按钮 -->
				<view class="submitBtnGroup">
					<wyb-button class="nextStep" type="hollow" :ripple="true"
						 @click="comfrim"
					>
						 {{$t('changePassword.ConfirmBtnText')}}
					</wyb-button>
				</view>
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
		
		<u-code
		:seconds="seconds" 
		ref="uCode"
		@change="codeChange"
		:startText="$t('changePassword.startText')"
		changeText="XS"
		:endText="$t('changePassword.Refresh')"
		>
		</u-code>
		
		<!-- 消息提示 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import countryData from '@/common/countryCode.js';
	import {GetMyReport, SendMobileAuthCode,ResetPassword} from '@/common/api.js';
	import md5 from "js-md5";
	export default {
		data() {
			return {
				isPhone: false,
				statusBarHeight: 60,
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
				mobile: '', //手机号码
				form: {
					newPassword: '',//密码
					confirm: '', //确认密码
				},
				plaintext: false, //是否明文密码
				plaintext2: false, //是否明文密码
				tips: '',
				seconds:60,
				isSubmit: false,
			}
		},
		methods: {
			async getCode() {
				if(this.$refs.uCode.canGetCode) {
					//判断手机号码是否正确
					if(!this.mobile) {
						this.$refs.uToast.show({
							message: this.$t('changePassword.placeBindMobile'),
							type: 'error',
							duration: 2000,
						})
						return;
					}
					//判断手机号码是否正确
					uni.showLoading({
						title: this.$t('changePassword.sending')
					})
					const res = await SendMobileAuthCode({mobile: this.mobile});
					uni.hideLoading();
					if(res.data.resultCode == 1) {
						let _this = this;
						_this.$refs.uCode.start();
						_this.$refs.uToast.show({
							message: _this.$t('changePassword.sendsuccess'),
							type: 'success',
							duration: 2000,
						})
					} else {
						this.$refs.uToast.show({
							message: this.$t("config.resultCode"+res.data.resultCode),
							type: 'error',
							duration: 2000,
						})
					}
				}
			},
			
			codeChange(text) {
				this.tips = text;
			},
			
			//获取个人报告
			async GetMyReportData () {
				//获取用户ID
				const userID = uni.getStorageSync('userInfo').userID;
				const res = await GetMyReport({userID});
				const networkError = this.$u.utils.handleNetwork(res);
				if (networkError) {
					this.$refs.uToast.show({
						message: networkError,
						type: 'error',
						duration: 2000,
					})
					return; 
				}
				if(res.data.resultCode == 1) {
					this.mobile = res.data.resultData.mobile;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode"+res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
			
			/* 点击是否显示密码icon */
			changPlaintext(type) {
				if(type) {
					this.plaintext2 = !this.plaintext2
				} else {
					this.plaintext = !this.plaintext
				}
			},
			
			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/Account/Account');
			},
			
			/* 获取焦点*/
			InputFocus(tag) {
				if(tag=='phone') {
					this.phoneFocusClass = 'input phoneFocus'
				} else if(tag=='pwd'){
					this.pwdFocusClass = 'input pwdFocus'
				} else if(tag=='cpwd') {
					this.cpwdFocusClascs = 'input cpwdFocus'
				} else if(tag=='authCode') {
					this.authCodeFocusClass = 'input authCodeFocus'
				}
			},
			
			/* 失去焦点 */
			InputBlur() {
				this.phoneFocusClass = 'input';
				this.pwdFocusClass = 'input'
				this.cpwdFocusClascs = 'input'
				this.authCodeFocusClass = 'input'
			},
			
			close() {
				this.show = false;
			},
			
			open() {
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
					return  item["phone_code"].indexOf(inputValue) != -1||item["en"].indexOf(inputValue) != -1;
				})
				//判断是否为空
				this.countryData = value?result:countryData.code;
			},
			
			//处理选中号码
			handleChecked (item){
				this.PhoneCode = item['phone_code'];
				this.area = item['en'];
				this.show = false;
			},
			
			
			/* 校验用户输入 */
			rules() {
				const {newPassword,confirm,authCode} = this.form;
				if(!this.mobile) {//空
					return this.$t('changePassword.mobileIsEmpty');
				}
				if(this.mobile.length<5||this.mobile.length>20) {//少于5大于20
					return this.$t('changePassword.mobileRange');
				}
				if(!authCode) {//空
					return this.$t('changePassword.mobileCodeIsEmpty');
				}
				if(authCode.length!=4) {//少于5
					return this.$t('changePassword.mobileCodeRange');
				}
				if(!newPassword) {//空
					return this.$t('changePassword.pwdIsEmpty');
				}
				if(newPassword.length<6||newPassword.length>12) {//少于6大于12
					return this.$t('changePassword.pwdRange');
				}
				if(!confirm) {//空
					return this.$t('changePassword.EnterConfirmpassword');
				}
				if(confirm.length<6||confirm.length>12) {//少于6大于12
					return this.$t('changePassword.pwdRange');
				}
			},
			
			/* 下一步获取验证码 */
			async confirm() {
				//处理用户注册逻辑
				let rulesFail = this.rules();
				let {mobile,newPassword,confirm, authCode} = this.form;
				if(rulesFail) {
					this.$refs.uToast.show({
						message: rulesFail,
						type: 'error',
						duration: 2000,
					})
					return;
				}
				
				//判断密码和确认密码是否一致
				if(newPassword!==confirm) {
					this.$refs.uToast.show({
						message: this.$t('changePassword.pwdDifferent'),
						type: 'error',
						duration: 2000,
					})
					return;
				}
				//防止重复提交
				if(this.isSubmit) {
					return;
				} else {
					this.isSubmit = true;
				}
				let params = {
					mobile: this.mobile,
					authCode: authCode, 
					newPassword: md5(newPassword),
				}
				uni.showLoading({
					title: this.$t('changePassword.loading')
				});
				const res = await ResetPassword(params);
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
						message: this.$t('changePassword.resetsuccess'),
						type: 'success',
						duration: 2000,
						complete() {
							uni.$u.vuex('vuex_token','');
							uni.setStorageSync('isPopup', false);
							uni.setStorageSync('userInfo',null);
							uni.setStorageSync('isRemember',null);
							_that.$u.route({
								type: 'reLaunch',
								url:'/pages/userAuth/login'
							})
						}
					})
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode"+res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			}
		},
		
		/* 禁止安卓物理返回按键回到验证码页面 */
		onBackPress(options) {
			return false;
		},
		
		onLoad() {
			//获取系统刘海高度
			//#ifdef APP-PLUS
				let statusBarObj = this.getPhoneInfo();
				this.isPhone = true;
				this.statusBarHeight = statusBarObj.statusBarHeight+this.statusBarHeight;
			//#endif
		},
		
		onShow() {
			if(!this.$u.utils.Permissions()) return;
			this.GetMyReportData();
			this.isSubmit = false;
		}
	}
</script>

<style lang="less" scoped>
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
	
	.container{
		.form{
			margin-top: 82rpx;
			margin-top: 24rpx;
			width: 100%;
			background-color: #fff;
			padding: 24rpx 48rpx 0 40rpx;
			box-sizing: border-box;
			.input{
				margin-bottom: 30rpx;
				height: 108rpx;
				box-sizing: border-box;
				padding-left: 36rpx !important;
				border: 1px solid #005652;
				border-radius: 48rpx;
				padding-right: 20rpx!important;
				.getCode {
					width: 180rpx;
					height: 70rpx;
					background: linear-gradient(308deg,#ff5261 10%, #ff8588 87%);
					border-radius: 46rpx;
					border: none;
				}
			}
			.input /deep/ .u-text__value{
				font-size: 30rpx!important;
				min-width: 60rpx;
			}
			.aareaBox{
				position: relative;
				.areaInput{
					margin-bottom: 30rpx;
					margin-top: 32rpx;
					height: 108rpx;
					box-sizing: border-box;
					text-align: center!important;
					box-shadow: 0px 2px 10px 0px rgba(193,193,193,0.500000);
					background-color: rgba(255,255,255,1.000000);
				}
				.expandIcon{
					position: absolute;
					right: 80rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
			.inputTitle{
				font-size: 28rpx;
				font-family: "PingFangSC-Medium";
				// font-weight: 500;
				text-align: left;
				color: #005652;
				line-height: 40rpx;
			}
			.phoneInputTitle{
				.inputTitle;
				margin: 44rpx 0 32rpx 0;
			}
			.submitBtnGroup{
				padding: 0 24rpx;
				box-sizing: border-box;
				width: 100%;
			}
			.nextStep {
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
	}
	.search /deep/ .uni-input-input{
		padding-top: 0!important;
		padding-bottom: 0!important;
		line-height: 64rpx;
		height: 64rpx;
		box-sizing: border-box;
	}
</style>
