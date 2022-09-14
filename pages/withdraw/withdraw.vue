<template>
	<view class="withdraw">
		<!-- 头部导航 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back">
			</u-icon>
			{{$t('withdraw.title')}}
			<navigator url="/pages/withdrawalsRecords/withdrawalsRecords" open-type="navigate" class="rightIcon"
				hover-class="none">
				<u-icon name="order" color="#FE6067" size="60rpx"></u-icon>
			</navigator>
		</view>

		<view class="content" :style="{paddingTop: isPhone?statusBarHeight+'px':72+'px'}">
			<!-- 当前余额 -->
			<view class="currentBalance">
				<view class="box">
					<view class="text">Current Balance</view>
					<view class="balance">${{MyReport&&MyReport.balance}}</view>
				</view>
			</view>

			<!--  -->
			<view class="contanner">
				<view class="title">Select withdrawal amount</view>
				<view class="list">
					<view v-for="(item,index) in moneyList" :class="'item'+' '+(current==index?'active':'')"
						@click="handleMoneyChange(index)" :key="item.id+index">
						{{item.label}}
					</view>
				</view>
				<view class="formC">
					<view class="title">Please enter the withdrawal amount</view>
					<u--input border="bottom" type="number" class="enterAmountInput"
						placeholder="Please enter the withdrawal amount" v-model="money" :clearable="true"></u--input>
				</view>

				<!-- Login button -->
				<wyb-button class="comfrimBtn" type="hollow" :ripple="true" @click="handleDeposit">
					{{$t('withdraw.ConfirmBtnText')}}
				</wyb-button>

				<!-- 提现规则 -->
				<view class="rules">
					<view class="tips">
						{{$t('withdraw.noBingdTips1')}}
					</view>
					<view class="tips">
						{{$t('withdraw.noBingdTips2')}}
					</view>
					<view class="tips">
						{{$t('withdraw.noBingdTips3')}}
					</view>
					<view class="tips">
						{{$t('withdraw.noBingdTips4')}}
					</view>
					<view class="tips">
						{{$t('withdraw.noBingdTips5')}}
					</view>
					<view class="tips">
						{{$t('withdraw.noBingdTips6')}}
					</view>
					<view class="tips">
						{{$t('withdraw.noBingdTips7')}}
					</view>
				</view>
			</view>
		</view>


		<!-- 提现输入密码窗口 -->
		<u-popup :show="show" mode="center" class="withdrawPopup" zIndex="10070">
			<view class="content">
				<!-- 提现金额 -->
				<view class="money">
					<view class="moneyTips">{{$t('withdraw.amount')}}:</view>
					<view class="moneyValue">${{money}}</view>
				</view>
				<!-- title -->
				<view class="title">{{$t('withdraw.TipsTitle')}}</view>
				<u-input v-if="plaintext" type="text" :placeholder="$t('withdraw.pleaseEnterPwd')" border="none"
					clearable :class="pwdFocusClass" @focus="InputFocus()" @blur="InputBlur()" v-model="pwd">
					<u-icon size="40rpx" :name="plaintext?'eye-fill':'eye-off'" slot="suffix" @click="changPlaintext">
					</u-icon>
				</u-input>
				<view v-if="!plaintext">
					<u-input type="password" :placeholder="$t('withdraw.pleaseEnterPwd')" border="none" clearable
						:class="pwdFocusClass" @focus="InputFocus()" @blur="InputBlur()" v-model="pwd">
						<u-icon size="40rpx" :name="plaintext?'eye-fill':'eye-off'" slot="suffix"
							@click="changPlaintext"></u-icon>
					</u-input>
				</view>

				<!-- 按钮组 -->
				<view class="btnGroup">
					<!-- Login button -->
					<wyb-button class="Cancel itemBtn" type="hollow" :ripple="true" @click="cancel">
						{{$t('withdraw.CancelBtnText')}}
					</wyb-button>
					<!-- Login button -->
					<wyb-button class="confirm itemBtn" type="hollow" :ripple="true" @click="confirm">
						{{$t('withdraw.ConfirmBtnText')}}
					</wyb-button>
				</view>
			</view>
		</u-popup>

		<!-- 消息提示 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import md5 from "js-md5";
	import {
		nanoid
	} from 'nanoid'
	import {
		GetMyReport,
		UserDistill
	} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 60, //刘海默认高度
				isPhone: false, //是否是手机
				MyReport: null, //个人报告用来判断是否绑定钱包
				moneyList: [{
						label: "$10",
						value: 10,
						id: nanoid()
					},
					{
						label: "$50",
						value: 50,
						id: nanoid()
					},
					{
						label: "$100",
						value: 100,
						id: nanoid()
					},
					{
						label: "$500",
						value: 500,
						id: nanoid()
					},
					{
						label: "$1000",
						value: 1000,
						id: nanoid()
					},
				],
				money: '10', //
				current: 0, //当前选中的金额
				show: false, //显示提现弹窗
				pwdFocusClass: 'input',
				pwd: '', //提现密码
				plaintext: false, //是否明文密码

			}
		},

		methods: {
			/* 点击是否显示密码icon */
			changPlaintext() {
				this.plaintext = !this.plaintext
			},

			//取消
			cancel() {
				this.show = false;
				this.pwd = ''
			},
			/* 获取焦点*/
			InputFocus() {
				this.pwdFocusClass = 'input pwdFocusClass'
			},

			/* 失去焦点 */
			InputBlur() {
				this.pwdFocusClass = 'input'
			},
			//提现规则校验
			rule() {
				let money = Number(this.money);
				if (!money) { //提示用户输入提现金额
					return this.$t('withdraw.enterwithdrawamount');
				}
				if (money <= 0) {
					return this.$t('withdraw.enteramounterror');
				}
				if ((money < 1000) && money != 10 && money != 50 && money != 100 && money != 500 && money != 1000) {
					return this.$t('withdraw.moneyLimitTips');
				}
				return "";
			},

			//提现前处理
			handleDeposit() {
				//1.输入金额格式校验
				let ruleMessage = this.rule();
				if (ruleMessage) {
					this.$refs.uToast.show({
						message: ruleMessage,
						type: 'error',
						duration: 3000,
					})
					return;
				}
				//可以打开弹窗
				this.show = true;
			},

			//选中金额
			handleMoneyChange(index) {
				this.current = index;
				this.money = this.moneyList[index].value;
			},
			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/Account/Account');
			},
			/* 获取个人报告 */
			async GetMyReportData() {
				//获取用户ID
				const userID = uni.getStorageSync('userInfo').userID;
				uni.showLoading();
				const res = await GetMyReport({
					userID
				});
				uni.hideLoading()
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
				} else {
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
			//确认
			async confirm() {
				//校验密码
				if (!this.pwd) { //提示用户输入提现密码
					this.$refs.uToast.show({
						message: this.$t('withdraw.TipsTitle'),
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
				//直接提现
				const params = {
					money: this.money, //提现金额
					dPassword: md5(this.pwd), //取款密码
					userID: uni.getStorageSync('userInfo').userID
				}
				uni.showLoading({
					title: this.$t('withdraw.loading')
				});
				const res = await UserDistill(params);
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
				if (res.data.resultCode == 1) { //提现成功跳转到提现记录
					//提取成功跳转到个人中心
					this.show = false;
					this.$refs.uToast.show({
						message: this.$t('withdraw.submitsuccess'),
						type: 'success',
						duration: 2000,
						complete() {
							this.isSubmit = false;
							uni.switchTab({
								url: "/pages/my/my",
							})
						}
					})
				} else if (res.data.resultCode == 123) { //用户没有设置提现密码提示用户设置提现密码
					this.show = false;
					this.$refs.uToast.show({
						message: this.$t('config.resultCode123'),
						type: 'error',
						duration: 2000,
					})
				} else {
					this.show = false;
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
		},

		onLoad() {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
		},

		onShow() {
			if (!this.$u.utils.Permissions()) return;
			this.isSubmit = false;
		},

		onReady() {
			this.GetMyReportData();
		}
	}
</script>

<style lang="less" scoped>
	.header {
		text-align: center;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		font-family: "PingFangSC-Medium";
		background-color: #F8F7FC;
		font-size: 20px;
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

		.rightIcon {
			position: absolute;
			right: 40rpx;
			width: 100rpx;
			height: 100rpx;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
	}

	.content {

		// padding: 0 24rpx;
		.currentBalance {
			padding: 0 24rpx;

			.box {
				padding: 44rpx;
				background-color: #fff;
			}

			.text {
				height: 28rpx;
				font-size: 28rpx;
				font-family: "PingFangSC-Regular";
				// font-weight: 400;
				text-align: left;
				color: #999999;
				line-height: 28rpx;
				margin-bottom: 16rpx;
			}

			.balance {
				width: 74px;
				height: 48rpx;
				font-size: 48rpx;
				font-family: "Helvetica";
				// font-weight: 400;
				text-align: left;
				color: #ffaa03;
				line-height: 48rpx;
			}
		}

		.contanner {
			background-color: #fff;
			margin-top: 24rpx;
			padding: 24rpx;

			.title {
				height: 28rpx;
				font-size: 28rpx;
				font-family: "PingFangSC-Regular";
				// font-weight: 400;
				text-align: left;
				color: #999999;
				line-height: 28rpx;
			}

			.list {
				margin: 20rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				// justify-content: space-between;
				.item {
					flex: 0 0 180rpx;
					height: 80rpx;
					background: #ffffff;
					border: 1px solid #999999;
					border-radius: 42rpx;
					text-align: center;
					line-height: 80rpx;
					margin-right: 30rpx;
					margin-bottom: 30rpx;

					font-size: 30rpx;
					font-family: "Helvetica";
					// font-weight: 400;
					color: #999999;

					&.active {
						border: 1px solid #FE6067;
						color: #333333;
					}
				}

				& .item:nth-child(3) {
					margin-right: 0;
				}
			}

			.enterAmountInput {
				height: 100rpx;
				padding: 0 21rpx !important;
				border-bottom: 1px solid #FE6067 !important;
				margin-bottom: 80rpx;
			}

			/deep/ .enterAmountInput {
				.u-input__content__field-wrapper__field {
					font-size: 28rpx !important;
					font-family: "PingFangSC-Medium";
					// font-weight: 500;
					color: #005652 !important;
				}
			}

			.rules {
				font-size: 28rpx;
				font-family: "PingFangSC-Regular";
				// font-weight: 400;
				text-align: left;
				color: #bbbbbb;
				line-height: 40rpx;

				.tips {
					margin-bottom: 20rpx;
				}
			}

			.comfrimBtn {
				width: 100% !important;
				margin-bottom: 80rpx;
			}

			.comfrimBtn /deep/.wyb-button {
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

	/* 提现窗口 */
	.withdrawPopup {
		&/deep/ .u-popup__content {
			border-radius: 20rpx;
		}

		.content {
			width: 600rpx;
			padding: 30rpx;
			box-sizing: border-box;

			.money {
				display: flex;
				font-family: "PingFangSC-Regular";
				font-size: 36rpx;

				.moneyTips {
					margin-right: 20rpx;
					color: #666666;
					font-family: "PingFangSC-Regular";
				}

				.moneyValue {
					font-size: 40rpx;
					color: #ffaa03;
				}
			}

			.title {
				margin: 20rpx 0 20rpx 0;
				font-family: "PingFangSC-Regular";
				font-size: 30rpx;
				color: #666666;
			}

			.input {
				margin-bottom: 30rpx;
				height: 108rpx;
				box-sizing: border-box;
				border: 1px solid #ddd;
				padding-left: 36rpx !important;
				padding-right: 20rpx !important;
				font-family: "PingFangSC-Regular";
			}

			/deep/ .uni-input-input {
				font-family: "PingFangSC-Regular";
			}

			.pwdFocusClass {
				border: 1px solid red;
			}

			.btnGroup {
				display: flex;
				margin: 40rpx 0;
				justify-content: space-around;

				// .itemBtn {
				// 	width: 200rpx;
				// 	height: 80rpx;
				// 	line-height: 80rpx;
				// 	text-align: center;
				// 	font-family: 'Arial';
				// 	color: #FFFFFF;
				// 	background-color: rgba(81, 98, 193, 1.000000);
				// 	letter-spacing: 1rpx;
				// 	border-radius: 24rpx;

				// 	&/deep/ .u-button__text {
				// 		font-size: 30rpx !important;
				// 	}
				// }

				.itemBtn {
					width: 200rpx !important;
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
	}
</style>
