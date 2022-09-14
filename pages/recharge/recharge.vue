<template>
	<view class="withdraw">
		<!-- 头部导航 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back">
			</u-icon>
			{{$t('recharge.title')}}
			<navigator url="/pages/rechargeRecord/rechargeRecord" open-type="navigate" class="rightIcon"
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
				<view class="title">Please select the deposit amount</view>
				<view class="list">
					<view v-for="(item,index) in moneyList" :class="'item'+' '+(current==index?'active':'')"
						@click="handleMoneyChange(index)" :key="item.id+index">
						{{item.label}}
					</view>
				</view>
				<view class="formC">
					<view class="title">Please enter the deposit amount</view>
					<u--input border="bottom" type="number" class="enterAmountInput"
						placeholder="Please enter the deposit amount" v-model="money" :clearable="true"></u--input>
				</view>

				<!-- Login button -->
				<wyb-button class="comfrimBtn" type="hollow" :ripple="true" @click="handleClickRecharge">
					{{$t('recharge.ConfirmBtnText')}}
				</wyb-button>

				<!-- 提现规则 -->
				<view class="rules">
					<view class="tips">
						{{$t('recharge.a')}}
					</view>
					<view class="tips">
						{{$t('recharge.b')}}
					</view>
					<view class="tips">
						{{$t('recharge.c')}}
					</view>
				</view>
			</view>
		</view>


		<!-- 提现输入密码窗口 -->
		<u-popup :show="show" mode="center" class="withdrawPopup" zIndex="10070">
			<view class="content">
				<view class="notPayTitle">{{$t('recharge.NotPay')}}</view>
				<!-- 按钮组 -->
				<view class="btnGroup">
					<!-- Login button -->
					<wyb-button class="confirm itemBtn" type="hollow" :ripple="true" @click="confirm">
						{{$t('recharge.ConfirmBtnText')}}
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
		UserDistill,
		UserPay
	} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 60, //刘海默认高度
				isPhone: false, //是否是手机
				MyReport: null, //个人报告用来判断是否绑定钱包
				moneyList: [{
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
						label: "$300",
						value: 300,
						id: nanoid()
					},
					{
						label: "$1000",
						value: 1000,
						id: nanoid()
					},
					{
						label: "$3000",
						value: 3000,
						id: nanoid()
					},
					{
						label: "$5000",
						value: 5000,
						id: nanoid()
					},
					{
						label: "$10000",
						value: 10000,
						id: nanoid()
					},
					{
						label: "$20000",
						value: 20000,
						id: nanoid()
					},
					{
						label: "$30000",
						value: 30000,
						id: nanoid()
					},
				],
				money: '50', //
				current: 0, //当前选中的金额
				show: false, //显示提现弹窗
				pwdFocusClass: 'input',
				pwd: '', //提现密码
				plaintext: false, //是否明文密码
				isSubmit: false,

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
			//金额参数处理
			MoneyRules() {
				if (!this.money) {
					return this.$t('recharge.moneyIsEmpty');
				}
				if (this.money <= 0) {
					return this.$t('recharge.moneyFomart');
				}
				if (this.money < 10) {
					return this.$t('recharge.rang');
				}
				if (this.money > 1000000) {
					return this.$t('recharge.rang');
				}
				return "";
			},

			//确认跳转到充值记录界面
			confirm() {
				//关闭弹窗
				this.show = false;
				//跳转到充值记录界面
				this.$u.route({
					type: "navigateTo",
					url: "/pages/rechargeRecord/rechargeRecord"
				})
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
			/* 确认 */
			async handleClickRecharge() {
				if(this.isSubmit) {
					return;
				}
				this.isSubmit = true;
				const MoneyRulesMsg = this.MoneyRules();
				//校验参数
				if (MoneyRulesMsg) {
					this.$refs.uToast.show({
						message: MoneyRulesMsg,
						type: 'warning ',
						duration: 2000,
					})
					return;
				}
				const params = {
					description: "", //描述
					money: this.money,
					payType: 9, //支付类型
					userID: uni.getStorageSync('userInfo').userID
				}
				//发送请求查询是否有未支付订单，如果没有允许打开支付界面
				uni.showLoading();
				const res = await UserPay(params);
				uni.hideLoading();
				if (res.data.resultCode == 1) { //不存在未支付订单//获取订单信息
					this.isSubmit = false;
					//获取订单id传给支付界面携带id到支付界面
					this.$u.route({
						type: "navigateTo",
						url: `/pages/payMent/payMent?id=${res.data.resultData}`
					})
				} else if (res.data.resultCode == 113) { //存在未支付订单弹框提示，跳转到充值记录界面
					//显示弹框内容
					this.show = true;
					this.isSubmit = false;
				} else {
					this.isSubmit = false;
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

			.notPayTitle {
				font-size: 30rpx;
				font-family: "PingFangSC-Medium";
				color: #666666;
				line-height: 40rpx;
			}
			.btnGroup {
				display: flex;
				margin: 40rpx 0;
				justify-content: space-around;
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
