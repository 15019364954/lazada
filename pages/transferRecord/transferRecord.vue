<template>
	<view>
		<!-- 自定义头部 -->
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-60+'px'}">
			<!-- 客服 -->
			<u-icon name="arrow-left" size="40rpx" color="#FE6067" @click="goBack" class="back"></u-icon>
			{{$t('TransferRecord.TransferRecord')}}
		</view>
		
		<view class="searchCondition" :style="{top: statusBarHeight+12+'px'}">
			<view class="dateBox">
				<view class="start inputDate" @click="handleSelectDate('start')">{{start}}</view>
				<view>-</view>
				<view class="end inputDate"  @click="handleSelectDate('end')">{{end}}</view>
				<u-button :text="$t('TransferRecord.Search')" type="primary" class="search" @click="search"></u-button>
			</view>
		</view>
		
		<z-paging
		    v-if="true"
			:style="{top:isPhone?statusBarHeight+40+12+'px':60+40+21+'px'}"
			ref="paging"
			:use-virtual-list="true"
			class="z-paging"
			v-model="dataList" 
			:fixed="true"
			preload-page="10"
			lower-threshold="100rpx"
			:hide-empty-view="hideEmptyView"
			@query="queryList"
			:refresher-default-text="refresherDefaultText"
			:refresher-pulling-text="refresherPullingText"
			:refresher-refreshing-text="refresherRefreshingText"
			:refresher-complete-text="refresherCompleteText"
			:loading-more-default-text="loadingMoreDefaultText"
			:loading-more-loading-text="loadingMoreLoadingText"
			:loading-more-no-more-text="loadingMoreNoMoreText"
			:loading-more-fail-text="loadingMoreFailText"
			:empty-view-text = "emptyViewText"
			:empty-view-reload-text = "emptyViewReloadText"
			:empty-view-error-text = "emptyViewErrorText"
		>
			<view :class="userID&&userID==item.userID?'active item':'item'" slot="cell" slot-scope="{item,index}" :id="`zp-${item.zp_index}`">
				<!-- 转入账号 -->
				<view class="itemflex">
					<view class="c_key">{{userID&&userID==item.userID?$t('TransferRecord.FromAccount'):$t('TransferRecord.TransferAccount')}}</view>
					<view class="c_value redText">
					{{userID&&userID==item.userID?item.pUserID:item.userID}}
					</view>
				</view>
				 <!-- 扶持金额 -->
				 <view class="itemflex">
					 <view class="c_key">{{$t('TransferRecord.TransferAmount')}}</view>
					 <view class="c_value redText">${{item.sum|fmtMoney}}</view>
				 </view>
				 <!-- 使用时间 -->
				 <view class="itemflex">
					 <view class="c_key ">{{$t('TransferRecord.TransferTime')}}</view>
					 <view class="c_value redText">{{item.createDate}}</view>
				 </view>
			</view>
		</z-paging>
		
		<!-- 日期选择组件 -->
		<view v-if="DateShow">
			<u-datetime-picker mode="date"
				:show="DateShow"
				visibleItemCount="8"
				v-model="dateValue"
				itemHeight="68"
				@cancel="cancel"
				@confirm="hanldeDateChange"
				:confirmText="$t('TransferRecord.confirmText')"
				:cancelText="$t('TransferRecord.cancelText')"
			>
			</u-datetime-picker>
		</view>
		
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import moment from 'moment';
	import {GetUnionFundsList} from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: 60,  //刘海默认高度
				isPhone: false,  //是否是手机
				DateShow: false,//是否显示日期弹框
				start:"2022-03-01", //开始时间
				end: "2022-03-26", //结束时间
				dateValue: '', //时间选择插件日期
				DateType: "start", //当前选择时间类型
				hideEmptyView: false,
				dataList:[],
				userID: ''
			}
		},
		computed:{
			//继续下拉刷新refresherDefaultText
			refresherDefaultText() {
				return this.$t('config.refresher.default');
			},
			//松开立即刷新refresherPullingText
			refresherPullingText(){
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
			}
		},
		methods: {
			
			//返回上一页
			goBack() {
				this.$u.utils.pageToBack('/pages/Account/Account');
			},
			
			/* 取消时间选择 */
			cancel() {
				this.DateShow = false;
			},
			
			/* 搜索 */
			search() {
				this.$refs.paging.reload();
			},
			
			//点击input选择时间
			handleSelectDate(type) {
				//设置日期空间显示的日期
				if (type=='start') {
					this.dateValue = moment(this.start).valueOf();
					this.DateShow = true;
				} else {
					this.dateValue = moment(this.end).endOf('day').valueOf();
					this.DateShow = true;
				}
				this.DateType = type;
			},
			
			//日期变化
			hanldeDateChange(date) {
				if(this.DateType=="start"){
					this.start = moment(date.value).format('YYYY-MM-DD');
				} else {
					this.end = moment(date.value).format('YYYY-MM-DD');
				}
				this.DateShow = false;
			},
			
			//获取产品列表数据
			async queryList(pageNo, pageSize) {
				//这里的pageNo和pageSize会自动计算好
				const params = {
					pageIndex: pageNo,
					pageSize: pageSize,
					userID: uni.getStorageSync('userInfo').userID,
					startDate: this.start?this.start+" " +"00:00:00":'',
					endDate: this.start?this.end+" " + "23:59:59":'',
				}
				uni.showLoading();
				const res = await GetUnionFundsList(params);
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
				if(res.data.resultCode == 1) {
					//如果有数据关闭空数据图
					this.hideEmptyView = res.data.resultData.unionFundsList.length>0?true:false;
					this.$refs.paging.complete(res.data.resultData.unionFundsList);
				} else {
					this.hideEmptyView = false;
					this.$refs.paging.complete(false);
					this.$refs.uToast.show({
						message: this.$t("config.resultCode"+res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			},
		},
		onLoad(options) {
			//获取系统刘海高度
			//#ifdef APP-PLUS
				let statusBarObj = this.getPhoneInfo();
				this.isPhone = true;
				this.statusBarHeight = statusBarObj.statusBarHeight+this.statusBarHeight;
			//#endif
			const {userID} = options;
			/* 设置默认时间 */
			this.start =  moment().subtract(14, 'days').startOf('days').format('YYYY-MM-DD');
			this.end = moment().endOf('days').format('YYYY-MM-DD');
		},
		
		onShow() {
			if(!this.$u.utils.Permissions()) return;
			this.userID = uni.getStorageSync('userInfo').userID;
		}
	}
</script>

<style lang="scss" scoped>
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
		height: 60px;
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
	/* 搜索条件 */
	.searchCondition{
		position: fixed;
		left: 0;
		top: 60px;
		width: 100%;
		// height: 102px;
		z-index: 2000;
		box-sizing: border-box;
		font-size: 36rpx;
		font-family: 'Arial';
		color: #888;
		.tabs{
			height: 40px;
			line-height: 40px;
		}
		.tabs /deep/ .v-tabs__container-item {
			font-family: "PingFangSC-Regular";
			// font-size: 40rpx!important;
		}
		.tabs /deep/ .v-tabs__container-line {
			height: 4rpx !important;
		}
		.dateBox{
			display: flex;
			justify-content: space-around;
			align-items: center;
			// margin: 11px 0;
			background-color: rgba(248, 247, 252, 0.56);
			.inputDate{
				background-color: rgba(238,250,251,1.000000);
				border-radius: 4px;
				height: 40px;
				line-height: 34px;
				box-sizing: border-box;
				padding: 0rpx 10rpx;
				border: 2px solid rgba(215,242,247,1);
				font-size: 28rpx;
				font-family: 'PingFangSC-Medium';
				color: #666666;
			}
			.search{
				width: 200rpx;
				height: 40px;
				color: #fff;
				margin: 0;
				line-height: 40px;
				border: none;
				box-sizing: border-box;
				font-family: 'PingFangSC-Medium';
				background-color: #f56c6c;
				&/deep/ .u-button__text{
					font-size: 30rpx!important;
				}
			}
		}
	}
	
	.z-paging{
		padding: 0 30rpx;
		.active{
			border: 1px solid green!important;
		}
		.item{
			box-shadow: rgba(204, 201, 201, 0.5) 0px 2px 6px 0px;
			background-color: #fff;
			padding: 40rpx 30rpx;
			margin: 20rpx 0;
			border-radius: 18rpx;
			font-family: "Helvetica";
			color: #666666;
			font-size: 24rpx;
			// border: 1px solid red;
			.segmentation {
				padding: 0 38rpx;
				display: flex;
				justify-content: center;
				.line{
					border-bottom: 2rpx solid #EBEBEB;
					width: 100%;
				}
			}
			.itemflex{
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
				line-height: 36rpx;
				.state{
					font-size: 28rpx;
				}
				.redText{
					font-size: 28rpx;
					color: #9E2C2C;
				}
				.date{
					display: flex;
					.c_title{
						// font-weight: bold;
						font-size: 32rpx;
					}
					.crcl{
						font-size: 28rpx;
						font-family: 'Arial';
						color: #4F62C0;
						text-decoration: underline;
						margin-left: 34rpx;
					}
				}
			}
		}
	}
</style>
