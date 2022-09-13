<template>
	<view class="orderRecord">
		<view class="header" :style="{height: statusBarHeight+'px',paddingTop: statusBarHeight-50+'px'}">
			{{$t('orderRecord.title')}}
		</view>

		<z-paging :style="{top:isPhone?statusBarHeight+'px':50+'px'}" ref="paging" class="z-paging"
			v-model="productList" :fixed="true" preload-page="7" lower-threshold="100rpx"
			:hide-empty-view="hideEmptyView" @query="queryList" :refresher-default-text="refresherDefaultText"
			:refresher-pulling-text="refresherPullingText" :refresher-refreshing-text="refresherRefreshingText"
			:refresher-complete-text="refresherCompleteText" :loading-more-default-text="loadingMoreDefaultText"
			:loading-more-loading-text="loadingMoreLoadingText" :loading-more-no-more-text="loadingMoreNoMoreText"
			:loading-more-fail-text="loadingMoreFailText" :empty-view-text="emptyViewText"
			:empty-view-reload-text="emptyViewReloadText" :empty-view-error-text="emptyViewErrorText">
			<view class="list">
				<view class="item" v-for="item in productList" :key="item&&item.sortID">
					<recordItem :item="item" :paging="paging"></recordItem>
				</view>
			</view>
		</z-paging>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import recordItem from './item';
	import {
		nanoid
	} from 'nanoid';
	import {
		GetOrderList,
		CancelOrder,
		OrderConfirm
	} from '@/common/api.js';
	export default {
		data() {
			return {
				current: 0, //当前选中的选项卡
				hideEmptyView: true, //默认开启空数据图
				productList: [], //产品列表数据
				state: "", //默认获取全部 “”是全部 0是未完成 1是完成
				statusBarHeight: 50, //刘海默认高度
				isPhone: false, //是否是手机
				zPadingShow: false, //是否显示虚拟列表
				throttling: false, //控制订单支付
				paging: null,
			}
		},
		components: {
			recordItem
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
			}
		},
		onShow() {
			if (!this.$u.utils.Permissions()) return;
			this.$u.utils.setTabBarI18n();
			if(this.productList.length>1&&this.$refs.paging) {
				this.$refs.paging.reload();
			}
		},
		methods: {
			//实现图片预览功能
			previewImg(imgUrl) {
				uni.previewImage({
					// 当前打开的图片
					current: 0,
					// 预览图片链接
					urls: [imgUrl]
				})
			},
			list() {
				let list = [{
					name: this.$t('orderRecord.all')
				}, {
					name: this.$t('orderRecord.successed')
				}, {
					name: this.$t('orderRecord.pending')
				}, {
					name: this.$t('orderRecord.fail')
				}, ];
				return list;
			},
			//获取产品列表数据
			async queryList(pageNo, pageSize) {
				//这里的pageNo和pageSize会自动计算好
				const params = {
					state: this.state, //0失败，1成功， "全部"
					pageIndex: pageNo,
					pageSize: pageSize,
					userID: uni.getStorageSync('userInfo').userID,
				}
				uni.showLoading();
				const res = await GetOrderList(params);
				uni.hideLoading();
				const networkError = this.$u.utils.handleNetwork(res);
				if (networkError) {
					this.$refs.uToast.show({
						message: networkError,
						type: 'error',
						duration: 2000,
						complete: () => {
							this.hideEmptyView = false
							this.$refs.paging.complete(false);
						}
					})
					return;
				}
				if (res.data.resultCode == 1) {
					uni.hideLoading();
					//如果有数据关闭空数据图
					this.hideEmptyView = res.data.resultData.orderList.length > 0 ? true : false;
					res.data.resultData.orderList.map(item => {
						item.uuid = nanoid();
					})
					this.$refs.paging.complete(res.data.resultData.orderList);
				} else {
					uni.hideLoading();
					this.hideEmptyView = false;
					this.$refs.paging.complete(false);
					this.$refs.uToast.show({
						message: this.$t("config.resultCode" + res.data.resultCode),
						type: 'error',
						duration: 2000,
					})
				}
			}
		},
		onLoad() {
			//获取系统刘海高度
			//#ifdef APP-PLUS
			let statusBarObj = this.getPhoneInfo();
			this.isPhone = true;
			this.statusBarHeight = statusBarObj.statusBarHeight + this.statusBarHeight;
			//#endif
			this.$nextTick(()=>{
				this.paging = this.$refs.paging;
			})
		}
	}
</script>

<style lang="less" scoped>
	.header {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #ddd;
		font-size: 32rpx;
		font-family: "Helvetica";
		font-weight: 700;
		color: #fe6067;
		background-color: #fff;
		z-index: 100;
	}

	.z-paging {
		.list {
			padding: 20rpx 24rpx;
		}
	}
</style>
