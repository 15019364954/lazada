<template>
	<view class="transfer">
		<!-- 头部导航 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" @click="goBack" class="back" color="#FE6067"></u-icon>
			{{$t('Transfer.title')}}
			<navigator url="/pages/transferRecord/transferRecord" open-type="navigate" class="rightIcon" hover-class="none">
				<u-icon name="order" color="#FE6067" size="60rpx"></u-icon>
			</navigator>
		</view>
		
		<!-- 内容区域 -->
		<view class="container" :style="{paddingTop: isPhone?statusBarHeight+'px':60+'px'}">
			<view class="content">
				<!-- 转账账号 -->
				<view class="inputTitle">{{$t('Transfer.TransferToAccount')}}</view>
				<u-input
					v-model="form.userID"
					border="none"
					inputAlign="left"
					type="text"
					:class="userIdFocusClass"
					@focus="InputFocus('userId')"
					@blur="InputBlur()"
					:placeholder="$t('Transfer.TransferToAccount')"
				>
				</u-input>
				
				<!-- 转入金额 -->
				<view class="inputTitle">{{$t('Transfer.TransferAmount')}}</view>
				<u-input
					v-model="form.sum"
					border="none"
					inputAlign="left"
					type="number"
					:class="moneyFocusClass"
					@focus="InputFocus('money')"
					@blur="InputBlur()"
					:placeholder="$t('Transfer.TransferAmount')"
				>
				</u-input>
				
				<!-- password -->
				<view class="inputTitle">{{$t('Transfer.EnterWithdrawalPWD')}}</view>
				<u-input
					v-if="plaintext"
					v-model="form.dPassword"
					border="none"
					inputAlign="left"
					type="text"
					:class="pwdFocusClass"
					@focus="InputFocus('pwd')"
					@blur="InputBlur()"
					:placeholder="$t('Transfer.EnterWithdrawalPWD')"
				>
				<u-icon size="40rpx" :name="plaintext?'eye-fill':'eye-off'" slot="suffix" @click="changPlaintext"></u-icon>
				</u-input>
				<view v-if="!plaintext">
					<u-input
						v-model="form.dPassword"
						border="none"
						inputAlign="left"
						type="password"
						:class="pwdFocusClass"
						@focus="InputFocus('pwd')"
						@blur="InputBlur()"
						:placeholder="$t('Transfer.EnterWithdrawalPWD')"
					>
					<u-icon size="40rpx" :name="plaintext?'eye-fill':'eye-off'" slot="suffix" @click="changPlaintext"></u-icon>
					</u-input>
				</view>
				
				
				<!-- 按钮组 -->
				<view class="modalBtn">
					<wyb-button class="confirmButton btn" type="hollow" :ripple="true" @click="supportConfrim">
						{{$t('Transfer.Transfer')}}
					</wyb-button>
				</view>
				
				
			</view>
			<view class="rateTips">
				<view>
					{{$t('Transfer.a')}}
				</view>
				<view>
					{{$t('Transfer.b')}}
				</view>
			</view>
		</view>
		
		
		<!-- 消息提示 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import md5 from "js-md5";
	import {nanoid} from 'nanoid'
	import {GetMyReport, UserDistill, TransferFunds} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 60,  //刘海默认高度
				isPhone: false,  //是否是手机
				form:{
					userID:'',
					sum: '', //转入金额
					dPassword: '',//提现密码
				},
				MyReport: null, 
				plaintext: false, //是否明文密码
				moneyFocusClass: 'input',
				pwdFocusClass: 'input',
				userIdFocusClass: 'input',
				isSubmit: false
			}
		},
		methods: {
			
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
					this.MyReport = res.data.resultData;
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode"+res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
			
			/* 点击是否显示密码icon */
			changPlaintext() {
				this.plaintext = !this.plaintext
			},
			
			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/Account/Account');
			},
			
			/* 获取焦点*/
			InputFocus(tag) {
				if(tag=='money') {
					this.moneyFocusClass = 'input moneyFocus'
				} else if(tag=="userId"){
					this.userIdFocusClass = 'input userIdFocus'
				} else {
					this.pwdFocusClass = 'input pwdFocus'
				}
			},
			
			/* 失去焦点 */
			InputBlur() {
				this.pwdFocusClass = 'input'
				this.moneyFocusClass = 'input'
				this.userIdFocusClass = 'input'
			},
			
			/* 扶持参数校验 */
			SuportRules() {
				const {sum, dPassword, userID} = this.form;
				//校验参数
				if(!userID) {
					return this.$t('Transfer.transferAccountEmpty');
				}
				if(!uni.$u.test.enOrNum(userID)) {
					return this.$t('registerUser.accountIsDorletters');
				}
				if(!sum) {
					return this.$t('Transfer.transferAmountEmpy');
				}
				if(sum<50) {
					return this.$t('Transfer.transferAmountRange');
				}
				if(sum>this.MyReport.balance) {
					return this.$t('Transfer.Insufficient');
				}
				//校验密码
				if(!dPassword) {
					return this.$t('Transfer.withdrawalPasswordNull');
				}
				return '';
			},
			
			/* 扶持确认 */
			async supportConfrim() {
				let ruleMsg = this.SuportRules();
				//校验表单数据
				if(ruleMsg) {
					this.$refs.uToast.show({
						message: ruleMsg,
						type: 'error ',
						duration: 2000,
					})
					return;
				}
				const {dPassword, Cycle,sum} = this.form
				const params = {
					dPassword: md5(dPassword),
					pUserID: uni.getStorageSync('userInfo').userID,
					sum: sum,
					userID: this.form.userID,
				}
				//防止重复提交
				if(this.isSubmit) {
					return;
				} else {
					this.isSubmit = true;
				}
				if(this.form.userID===uni.getStorageSync('userInfo').userID) {
					this.$refs.uToast.show({
						message: this.$t('Transfer.notAllowed'),
						type: 'error ',
						duration: 2000,
					})
					this.isSubmit = false;
					return;
				}
				//提交转入金额
				uni.showLoading();
				const res = await TransferFunds(params);
				uni.hideLoading();
				const networkError = this.$u.utils.handleNetwork(res);
				if (networkError) {
					this.$refs.uToast.show({
						message: networkError,
						type: 'error',
						duration: 2000,
						complete: ()=>{
							this.isSubmit = false;
						}
					})
					return; 
				}
				if(res.data.resultCode==1) {
					//扶持成功关闭弹窗
					this.$refs.uToast.show({
						message: this.$t('Transfer.SuccessfulTransfer'),
						type: 'success',
						duration: 2000,
						complete: ()=>{
							this.isSubmit = false;
							uni.navigateTo({
								url:'/pages/transferRecord/transferRecord'
							})
						}
					})
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode"+res.data.resultCode),
						type: 'error',
						duration: 2000,
						complete: ()=>{
							this.isSubmit = false;
						}
					})
				}
			},
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
			this.isSubmit = false;
			this.GetMyReportData();
		},
	}
</script>

<style lang="less" scoped>
	page{
		height: 100%;
		background-color: #F7f7f7;
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
		height: 60px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		letter-spacing: 1rpx;
		z-index: 1000;
		border-bottom: 2rpx solid #ddd;
		color: #FE6067;
		.back{
			position: absolute;
			left: 30rpx;
		}
		.rightIcon{
			position: absolute;
			right: 40rpx;
			width: 100rpx;
			height: 100rpx;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
	}
	
	.container{
		padding-bottom:120rpx;
	}
	.content{
		// width: 566rpx;
		background-color: #fff;
		box-sizing: border-box;
		padding: 30rpx 60rpx;
		margin-top: 24rpx;
		.modalBtn{
			margin-top: 54rpx;
			display: flex;
			justify-content: space-around;
			.btn {
				width: 100% !important;
				// margin-bottom: 80rpx;
			}
			.btn /deep/.wyb-button {
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
		
		.cycle{
			display: flex;
			justify-content: space-between;
			.item {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
				.icon{
					width: 34rpx;
					height: 32rpx;
					background-color: #dcdbe3;
					margin-right: 10rpx;
					&.active{
						background-color: #4F62C0;
					}
				}
				.value{
					height: 22rpx;
					font-size: 20rpx;
					font-family: 'Arial';
					color: #4F62C0;
					line-height: 22rpx;
				}
			}
		}
		.inputTitle{
			font-size: 32rpx;
			font-family: 'Arial MT';
			color: #4F62C0;
			margin-bottom: 28rpx;
			font-family: "Helvetica";
			// font-weight: 400;
			text-align: left;
			color: #005652;
			line-height: 28rpx;
		}
		.input{
			margin-bottom: 30rpx;
			height: 108rpx;
			border-bottom: 1px solid #c6c6c6;
			box-sizing: border-box;
			padding-left: 36rpx !important;
			padding-right: 20rpx !important;
		}
		.input /deep/ .input-placeholder{
			font-size: 28rpx;
			font-family: "PingFangSC-Regular";
			// font-weight: 400;
			text-align: left;
			color: #bbbbbb;
		}
		.moneyFocus, .pwdFocus, .userIdFocus{
			// background: url('@/static/image/userAuth/fouce_input.png') no-repeat center center;
			// background-size: 100% 100%;
		}
		
	}
	
	
	/* 费率 */
	.rateTips{
		width: 100%;
		box-sizing: border-box;
		margin-top: 60rpx;
		font-size: 28rpx;
		font-family: 'Arial';
		color: #666666;
		padding:40rpx;
		line-height: 40rpx;
		padding: 0 24rpx;
		
		font-family: "PingFangSC-Regular";
		// font-weight: 400;
		text-align: left;
		color: #bbbbbb;
	}
</style>
