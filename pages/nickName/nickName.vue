<template>
	<view>
		<!-- 自定义头部 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			{{$t('Nickname.title')}}
		</view>
		
		<view class="content" :style="{paddingTop: isPhone?statusBarHeight+12+'px':60+12+'px'}">
			<!-- 钱包地址 -->
			<view class="form">
				<view class="inputTitle">{{$t('Nickname.currentMobile')}}</view>
				<u-input
					border="none"
					clearable
					type="text"
					:disabled="true"
					v-model="form.mobile" 
					:class="mobileFocusClass"
					placeholderClass="placeholderClass"
					@focus="InputFocus('mobile')"
					@blur="InputBlur()"
				>
				</u-input>
				
				<view class="inputTitle" >{{$t('Nickname.verificationCodeTitle')}}</view>
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
				
				<view class="inputTitle">{{$t('Nickname.editNickName')}}</view>
				<u-input
					border="none"
					inputAlign="left"
					type="text"
					clearable
					:class="nameFocusClass"
					placeholderClass="placeholderClass"
					v-model="form.name"
					@focus="InputFocus('name')"
					@blur="InputBlur()"
				>
				</u-input>
				
				<!-- 确认按钮 -->
				<view class="submitBtnGroup">
					<wyb-button class="nextStep" type="hollow" :ripple="true"
						 @click="handleEditNickName"
					>
						 {{$t('Nickname.Confirm')}}
					</wyb-button>
				</view>
			</view>
		</view>
		
		<u-code
		:seconds="seconds" 
		ref="uCode"
		@change="codeChange"
		:startText="$t('Nickname.startText')"
		changeText="XS"
		:endText="$t('Nickname.Refresh')"
		>
		</u-code>
		
		<!-- 提示信息 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {GetMyReport, BindName, SendMobileAuthCode} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 60,  //刘海默认高度
				isPhone: false, //是否是手机
				tips: '',
				name: '',
				seconds: 60, //验证码倒计时
				mobileFocusClass: 'input',
				authCodeFocusClass: 'input',
				nameFocusClass:'input',
				form: {
					mobile: '', 
					authCode:'',
					name: ''
				},
				nickNameFocusClass: 'input nickNameFocus',
				isSubmit: false,
			}
		},
		methods: {
			/* 获取焦点*/
			InputFocus(tag) {
				if(tag=='name') {
					this.nameFocusClass = 'input nameFocus'
				} else if (tag=="authCode"){
					this.authCodeFocusClass = 'input authCodeFocus'
				} else {
					this.mobileFocusClass = 'input mobileFocus'
				}
			},
			
			/* 失去焦点 */
			InputBlur() {
				this.nameFocusClass = 'input'
				this.authCodeFocusClass= 'input'
				this.mobileFocusClass = 'input'
			},
			codeChange(text) {
				this.tips = text;
			},
			
			async getCode() {
				if(this.$refs.uCode.canGetCode) {
					let {mobile} = this.form;
					if(!mobile) {
						this.$refs.uToast.show({
							message: this.$t('Nickname.firstBindMobile'),
							type: 'error',
							duration: 2000,
						})
						return;
					}
					//判断手机号码是否正确
					// 模拟向后端请求验证码
					uni.showLoading({
						title: this.$t('Nickname.sending')
					})
					const res = await SendMobileAuthCode({mobile: mobile});
					uni.hideLoading();
					if(res.data.resultCode == 1) {
						let _this = this;
						_this.$refs.uCode.start();
						_this.$refs.uToast.show({
							message: _this.$t('Nickname.sendsuccess'),
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
			
			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/Account/Account');
			},
			//获取个人报告
			async GetMyReportData () {
				uni.showLoading();
				//获取用户ID
				const userID = uni.getStorageSync('userInfo').userID;
				const res = await GetMyReport({userID});
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
				if(res.data.resultCode == 1) {
					this.$set(this.form,'mobile', res.data.resultData.mobile);
					this.$set(this.form,'name', res.data.resultData.name);
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode"+res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
			
			//规则校验函数
			rules() {
				const {name, mobile, authCode} = this.form;
				if(!mobile) {
					return this.$t('Nickname.firstBindMobile')
				}
				if(!authCode) {
					return this.$t('Nickname.mobileCodeIsEmpty');
				}
				if(authCode.length!=4) {
					return  this.$t('Nickname.mobileCodeRange');
				}
				if(!name) {
					return this.$t('Nickname');
				}
				return ''
			},
			
			/* 修改昵称 */
			async handleEditNickName() {
				let rulesFail = this.rules();
				if(rulesFail) {
					this.$refs.uToast.show({
						message: rulesFail,
						type: 'error',
						duration: 2000,
					})
					return;
				}
				const params = {
					name: this.form.name,
					mobile: this.form.mobile,
					authCode: this.form.authCode,
					userID: uni.getStorageSync('userInfo').userID
				}
				//防止重复提交
				if(this.isSubmit) {
					return;
				} else {
					this.isSubmit = true;
				}
				uni.showLoading();
				const res = await BindName(params);
				uni.hideLoading();
				const networkError = this.$u.utils.handleNetwork(res);
				if (networkError) {
					this.$refs.uToast.show({
						message: networkError,
						type: 'error',
						duration: 2000,
						complete:() =>{
							this.isSubmit = false;
						}
					})
					return; 
				}
				if(res.data.resultCode == 1) {
					//再次获取钱包信息
					this.$refs.uToast.show({
						message: this.$t('Nickname.editSuccessfully'),
						type: 'success',
						duration: 2000,
						complete:() =>{
							this.isSubmit = false;
							uni.switchTab({
								url:'/pages/my/my'
							})
						}
					})
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode"+res.data.resultCode),
						type: 'error',
						duration: 2000,
						complete:() =>{
							this.isSubmit = false;
						}
					})
				}
			}
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
		},
		onHide() {
			uni.hideLoading();
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
	.content{
	}
	.inputTitle{
		margin-top: 12rpx;
		margin-bottom: 20rpx;
		font-size: 28rpx;
		color: #666666;
		line-height: 32rpx;
	}
	
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
	.nameFocus, .authCodeFocus, .mobileFocus{
	}
	.form{
		width: 100%;
		box-sizing: border-box;
		padding-top: 60rpx;
		padding: 24rpx 24rpx;
		background-color: #fff;
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
</style>
