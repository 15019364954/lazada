<template>
	<view>
		<!-- 自定义头部 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			{{$t('bindMobile.title')}}
		</view>
		
		<view class="container" :style="{paddingTop: isPhone?statusBarHeight+'px':60+'px'}">
			<view class="form">
				<!-- 输入手机号码 -->
				<view class="inputTitle phoneInputTitle">{{$t('bindMobile.currentlyBindMobile')}}</view>
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
				
				<!-- 验证码 -->
				<!-- 旧手机号码oldAuthCode -->
				<view class="inputTitle phoneInputTitle">{{$t('bindMobile.enterOldMobileVerCode')}}</view>
				<u-input
				    :placeholder="$t('bindMobile.VerificationCode')"
					border="none"
					clearable
					type="number"
					v-model="form.oldAuthCode" 
					:class="oldAuthCodeFocusClass"
					placeholderClass="placeholderClass"
					@focus="InputFocus('oldAuthCode')"
					@blur="InputBlur()"
				>
						<view slot="suffix" >
							<u-button 
								@tap="getCode" 
								type="success"
								class="getCode"
							>
								{{oldTips}}
							</u-button>
						</view>
				</u-input>
				
				<view class="inputTitle phoneInputTitle">{{$t('bindMobile.entermodifiedMobile')}}</view>
				<u-input
					border="none"
					clearable
					type="number"
					v-model="form.newMobile" 
					:class="nwdMobileFocusClass"
					placeholderClass="placeholderClass"
					@focus="InputFocus('newMobile')"
					@blur="InputBlur()"
				>
					<u-text
						:text="PhoneCode"
						slot="prefix"
						prefixIcon="phone-fill"
						margin="0 3px 0 0"
						size="32rpx"
						@click="open"
					></u-text>
				</u-input>
				
				<view class="inputTitle phoneInputTitle">{{$t('bindMobile.newMobileVerCode')}}</view>
				<u-input
				    :placeholder="$t('bindMobile.VerificationCode')"
					border="none"
					clearable
					type="number"
					v-model="form.newAuthCode" 
					:class="newAuthCodeFocusClass"
					placeholderClass="placeholderClass"
					@focus="InputFocus('newAuthCode')"
					@blur="InputBlur()"
				>
						<view slot="suffix" >
							<u-button 
								@tap="newGetCode" 
								type="success" 
								class="getCode"
							>
								{{newTips}}
							</u-button>
						</view>
				</u-input>
				
				<!-- <view class="nextStep" @tap="handleVerfMobile">{{$t('bindMobile.ConfirmBtnText')}}</view> -->
			</view>
			<!-- Login button -->
			<view class="submitBtnGroup">
				<wyb-button class="nextStep" type="hollow" :ripple="true"
					 @click="handleVerfMobile"
				>
					 {{$t('bindMobile.ConfirmBtnText')}}
				</wyb-button>
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
		:seconds="oldSeconds" 
		ref="uCode"
		:key="keyId"
		@change="oldCodeChange"
		:startText="$t('bindMobile.startText')"
		changeText="XS"
		:endText="$t('bindMobile.Refresh')"
		uniqueKey="oldBindiMobile"
		>
		</u-code>
		
		<u-code
		:key="keyId2"
		:seconds="newSeconds" 
		ref="newUCode"
		@change="newCodeChange"
		:startText="$t('bindMobile.startText')"
		changeText="XS"
		:endText="$t('bindMobile.Refresh')"
		uniqueKey="newBindiMobile"
		>
		</u-code>
		
		<!-- 消息提示 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {GetMyReport, BindMobile, SendMobileAuthCode, SendMobileAuthCodeNoBind, VerifyMobileAuthCode} from '@/common/api.js';
	import countryData from '@/common/countryCode.js';
	import {nanoid} from 'nanoid'
	export default {
		data() {
			return {
				statusBarHeight: 60,  //刘海默认高度
				isPhone: false,  //是否是手机
				phoneFocusClass: 'input phoneFocus',
				oldAuthCodeFocusClass: 'input',
				nwdMobileFocusClass: 'input',
				newAuthCodeFocusClass: 'input',
				countryData: countryData.code, //区号数据
				show: false,
				searchValue: '',
				PhoneCode: '+91',
				ElementHeight: 400,
				area: 'India',
				form: {
					mobile: '',//手机号码
					oldAuthCode: '', //旧手机验证码
					newAuthCode: '', //新手机验证码
					newMobile: '', //新手机
				},
				mobile: '',
				oldSeconds: 60,
				newSeconds: 60,
				oldTips: '', 
				newTips:'',
				keyId: nanoid(),
				keyId2: nanoid(),
				isSubmit: false
			}
		},
		watch:{
			'$i18n.locale'(){
				this.$nextTick(function(){
					this.keyId = nanoid();
					this.keyId2 = nanoid();
				})
			}
		},
		methods: {
			
			oldCodeChange(text) {
				this.oldTips = text;
			},
			newCodeChange(text) {
				this.newTips = text;
			},
			
			mobileRules() {
				const {newMobile} = this.form;
				if(!newMobile) {//空
					return this.$t('bindMobile.mobileIsEmpty');
				}
				if(newMobile.length<5||newMobile.length>20) {//少于5大于20
					return this.$t('bindMobile.mobileRange');
				}
				if((this.PhoneCode+newMobile)==this.mobile) {
					return this.$t('bindMobile.userNewMobile');
				}
				return '';
			},
			
			async getCode() {
				if(this.$refs.uCode.canGetCode) {
					let {oldAuthCode} = this.form;
					//判断手机号码是否正确
					if(!this.mobile) {
						this.$refs.uToast.show({
							message: this.$t('bindMobile.bindOleMobile'),
							type: 'error',
							duration: 2000,
						})
						return;
					}
					// 模拟向后端请求验证码
					uni.showLoading({
						title: this.$t('bindMobile.sending')
					})
					const res = await SendMobileAuthCode({mobile: this.mobile});
					uni.hideLoading();
					if(res.data.resultCode == 1) {
						let _this = this;
						_this.$refs.uCode.start();
						_this.$refs.uToast.show({
							message: _this.$t('bindMobile.sendsuccess'),
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
			
			async newGetCode() {
				if(this.$refs.newUCode.canGetCode) {
					//判断手机号码是否正确
					let mobileRules = this.mobileRules();
					if(mobileRules) {
						this.$refs.uToast.show({
							message: mobileRules,
							type: 'error',
							duration: 2000,
						})
						return;
					}
					// 模拟向后端请求验证码
					uni.showLoading({
						title: this.$t('bindMobile.sending')
					})
					const res = await SendMobileAuthCodeNoBind({mobile: this.PhoneCode+this.form.newMobile});
					uni.hideLoading();
					if(res.data.resultCode == 1) {
						let _this = this;
						_this.$refs.newUCode.start();
						_this.$refs.uToast.show({
							message: _this.$t('bindMobile.sendsuccess'),
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
			
			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/Account/Account');
			},
			
			/* 获取焦点*/
			InputFocus(tag) {
				if(tag=='oldAuthCode') {
					this.oldAuthCodeFocusClass = 'input oldAuthCodeFocus'
				} else if(tag=="newMobile") {
					this.nwdMobileFocusClass = 'input newMobile'
				} else if(tag == 'newAuthCode') {
					this.newAuthCodeFocusClass = 'input newAuthCode'
				}
			},
			
			/* 失去焦点 */
			InputBlur() {
				this.oldAuthCodeFocusClass = 'input'
				this.nwdMobileFocusClass = 'input'
				this.newAuthCodeFocusClass = 'input'
			},
			
			close() {
				this.searchValue = '';
				this.countryData = countryData.code;
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
				const {newMobile, oldAuthCode,newAuthCode} = this.form;
				if(!oldAuthCode) {//空
					return this.$t('bindMobile.mobileCodeIsEmpty');
				}
				if(oldAuthCode.length!=4) {//空
					return this.$t('bindMobile.mobileCodeRange');
				}
				if(!newMobile) {//空
					return this.$t('bindMobile.mobileIsEmpty');
				}
				if(newMobile.length<5||newMobile.length>20) {//少于5大于20
					return this.$t('bindMobile.mobileRange');
				}
				if(!newAuthCode) {//空
					return this.$t('bindMobile.mobileCodeIsEmpty');
				}
				if(newAuthCode.length!=4) {//空
					return this.$t('bindMobile.mobileCodeRange');
				}
				return '';
			},
			
			async handleVerfMobile() {
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
					mobile: this.mobile,
					authCode: this.form.oldAuthCode
				}
				uni.showLoading();
				const res = await VerifyMobileAuthCode(params)
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
					//修改手机号码
					this.comfrim();
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode"+res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
			
			/* 下一步获取验证码 */
			async comfrim() {
				//发送异步请求绑定手机号码
				const params = {
					mobile: this.PhoneCode+this.form.newMobile, //电话号码
					authCode: this.form.newAuthCode, //手机验证码
					userID: uni.getStorageSync('userInfo').userID
				}
				//防止重复提交
				if(this.isSubmit) {
					return;
				} else {
					this.isSubmit = true;
				}
				uni.showLoading();
				const res = await BindMobile(params);
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
				if(res.data.resultCode == 1) {
					//绑定成功跳转到个人中心
					this.$refs.uToast.show({
						message: this.$t('bindMobile.bindsuccess'),
						type: 'success',
						duration: 2000,
						complete: () => {
							uni.switchTab({
								url:"/pages/my/my",
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
		
		onLoad(options) {
			//获取系统刘海高度
			//#ifdef APP-PLUS
				let statusBarObj = this.getPhoneInfo();
				this.isPhone = true;
				this.statusBarHeight = statusBarObj.statusBarHeight+this.statusBarHeight;
			//#endif
			this.GetMyReportData();
		},
		
		onShow() {
			if(!this.$u.utils.Permissions()) return;
			this.isSubmit = false;
		}
	}
</script>

<style lang="less" scoped>
	
	page{
		height: 100%;
		background-color: #F7F7F7;
	}
	.header{
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
		.back{
			position: absolute;
			left: 30rpx;
		}
	}
	.container{
		// display: flex;
		// justify-content: center;
		// align-items: center;
		.form{
			margin-top: 24rpx;
			width: 100%;
			background-color: #fff;
			padding: 0 48rpx 0 40rpx;
			box-sizing: border-box;
			// .title{
			// 	text-align: center;
			// 	font-family: 'Arial MT';
			// 	font-size: 62rpx;
			// 	color: #666666;
			// }
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
			.placeholderClass{
				font-size: 28rpx;
				font-family: "PingFangSC-Regular";
				// font-weight: 400;
				text-align: left;
				color: #bbbbbb;
				// line-height: 20px;
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
			.phoneFocus,.oldAuthCodeFocus, .newMobile, .newAuthCode{
			}
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
