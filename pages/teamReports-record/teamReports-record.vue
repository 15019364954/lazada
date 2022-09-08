<template>
	<view>
		<!-- 头部导航 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			{{handlerTitle}}
		</view>

		<!-- 列表 -->
		<z-paging :style="{top:isPhone?statusBarHeight+12+'px':62+'px'}" ref="paging" class="z-paging"
			v-model="CommissionList" :fixed="true" preload-page="10" lower-threshold="100rpx"
			:hide-empty-view="hideEmptyView" @query="queryList" :refresher-default-text="refresherDefaultText"
			:refresher-pulling-text="refresherPullingText" :refresher-refreshing-text="refresherRefreshingText"
			:refresher-complete-text="refresherCompleteText" :loading-more-default-text="loadingMoreDefaultText"
			:loading-more-loading-text="loadingMoreLoadingText" :loading-more-no-more-text="loadingMoreNoMoreText"
			:loading-more-fail-text="loadingMoreFailText" :empty-view-text="emptyViewText"
			:empty-view-reload-text="emptyViewReloadText" :empty-view-error-text="emptyViewErrorText">
			<view class="list">
				<view class="item" v-for="item in CommissionList" >
					<view class="title">commission</view>
					<view class="num">{{item.money}}</view>
					<view class="userID">ID: {{item.userID}}</view>
					<view class="date">{{item.createTime}}</view>
				</view>
			</view>
		</z-paging>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import md5 from "js-md5";
	import moment from 'moment';
	import {
		GetReferralrewardDetail,
		GetOrderCommissionDetail,
		GetTeamCommissionDetail
	} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 50,
				isPhone: false,
				CommissionList: [], //遍历的数据，组件返回来
				hideEmptyView: true, //默认开启空数据图
				type: "",
			}
		},
		methods: {
			goBack() {
				this.$u.utils.pageToBack('/pages/index/index')
			},
			/* 获取刷单佣金明细 */
			async queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				const params = {
					pageIndex: pageNo,
					pageSize: pageSize,
					userID: uni.getStorageSync('userInfo').userID,
					startDate: moment().subtract(364, 'days').startOf('days').format('YYYY-MM-DD HH:mm:ss'),
					endDate: moment().endOf('days').format('YYYY-MM-DD HH:mm:ss'),
				}
				let requestUrl = this.type=='1'?GetReferralrewardDetail:this.type=='2'?GetOrderCommissionDetail:GetTeamCommissionDetail;
				uni.showLoading();
				const res = await requestUrl(params);
				uni.hideLoading();
				const networkError = this.$u.utils.handleNetwork(res);
				if (networkError) {
					this.$refs.uToast.show({
						message: networkError,
						type: 'error',
						duration: 2000,
					})
					this.$refs.paging.complete(false);
					return;
				}
				if (res.data.resultCode == 1) {
					if(this.type=="1") {
						this.hideEmptyView = res.data.resultData.referralrewardList.length > 0 ? true : false;
						this.$refs.paging.complete(res.data.resultData.referralrewardList);
					}
					if(this.type=="2") {
						this.hideEmptyView = res.data.resultData.orderCommissionList.length > 0 ? true : false;
						this.$refs.paging.complete(res.data.resultData.orderCommissionList);
					}
					if(this.type=="3") {
						this.hideEmptyView = res.data.resultData.teamCommissionList.length > 0 ? true : false;
						this.$refs.paging.complete(res.data.resultData.teamCommissionList);
					}
				} else {
					this.hideEmptyView = false;
					this.$refs.paging.complete(false);
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
		},
		computed: {
			//继续下拉刷新refresherDefaultText
			refresherDefaultText() {
				return this.$t('config.refresher.default');
			},
			//松开立即刷新refresherPullingText
			refresherPullingText() {
				return this.$t('config.refresher.pulling');
			},
			//正在刷新refresherRefreshingText
			refresherRefreshingText() {
				return this.$t('config.refresher.refreshing');
			},
			//刷新成功refresherCompleteText  null
			refresherCompleteText() {
				return this.$t('config.refresher.refreshing');
			},

			//点击加载更多loadingMoreDefaultText
			loadingMoreDefaultText() {
				return this.$t('config.loading.more.default');
			},
			//正在加载loadingMoreLoadingText
			loadingMoreLoadingText() {
				return this.$t('config.loading.more.loading')
			},
			//没有更多了loadingMoreNoMoreText
			loadingMoreNoMoreText() {
				return this.$t('config.loading.more.no.more')
			},
			//加载失败点击重新加载loadingMoreFailText
			loadingMoreFailText() {
				return this.$t('config.loading.more.fail')
			},
			//没有数据哦~emptyViewText
			emptyViewText() {
				return this.$t('config.empty.view')
			},
			//重新加载emptyViewReloadText
			emptyViewReloadText() {
				return this.$t('config.empty.view.reload')
			},
			//很抱歉，加载失败emptyViewErrorText
			emptyViewErrorText() {
				return this.$t('config.empty.view.error')
			},
			handlerTitle() {
				if(this.type=="1") {
					return this.$t('teamReport.ReferralBonus')
				} 
				if(this.type=="2") {
					return this.$t('teamReport.TaskCommission')
				}
				if(this.type=="3") {
					return this.$t('teamReport.TeamCommission')
				}
				return "";
			}
		},
		onLoad(options) {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
			this.type = options.type;
		},
		onShow() {
			if (!this.$u.utils.Permissions()) return;
		},
		onHide() {
			this.showLoading = false;
		}
	}
</script>

<style lang="less" scoped>
	.header {
		width: 100%;
		position: fixed;
		font-family: "PingFangSC-Medium";
		// font-weight: 500;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		background-color: #fff;
		border-bottom: 2rpx solid #ddd;
		font-size: 32rpx;
		color: #FE6067;
		z-index: 1000;
		box-sizing: border-box;

		.back {
			width: 100rpx;
			height: 54rpx;
			position: absolute;
			left: 24rpx;
		}
	}
	.z-paging{
		padding: 0 24rpx;
		width: 100%;
		box-sizing: border-box;
	}
	
	.item{
		width: 100%;
		background: #FFF;
		margin-bottom: 24rpx;
		padding: 24rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
		.title{
			height: 24rpx;
			font-size: 24rpx;
			font-family: "PingFangSC-Regular";
			// font-weight: 400;
			text-align: left;
			color: #ffaa03;
			line-height: 24rpx;
		}
		.num{
			margin-top: 22rpx;
			margin-bottom: 48rpx;
			height: 36rpx;
			line-height: 36rpx;
			font-size: 36rpx;
			font-family: "Helvetica";
			// font-weight: 400;
			text-align: left;
			color: #0dc253;
		}
		.userID{
			height: 24rpx;
			font-size: 24rpx;
			font-family: "PingFangSC-Regular";
			// font-weight: 400;
			text-align: left;
			color: #a6c4c3;
			line-height: 24rpx;
		}
		.date{
			.userID;
			margin-top: 20rpx;
		}
	}
</style>
