<template>
	 <view class="tabbar" :style="{'padding-bottom': paddingBottomHeight + 'rpx'}">
		<view :class="'tabbar-item'+' '+(index==2?'buttItem':'')"
			v-for="(item, index) in list" 
			:key="index" 
			@click="tabbarChange(item.path)"
		>
			<u-image class="item-img" :src="item&&item.icon_a" v-if="current == index&&index!=2" width="46rpx" height="46rpx"></u-image>
			<u-image class="item-img" :src="item&&item.icon" v-if="(current != index&&index!=2)" width="46rpx" height="46rpx"></u-image>
			<view :class="'item-name'+' '+((current == index)?'tabbarActive':'')" v-if="item&&item.texts&&index!=2">{{item&&item.texts}}</view>
			<view :class="'button-3d-2'+' '+(current==2?'activeBtn':'')" v-if="item&&index==2" @click="tabbarChange(item.path)"></view>
		</view>
	</view>
</template>
<script>
	export default {
		name:"tab-bar",
		 props: {
			current: String
		},
		data() {
			return {
				paddingBottomHeight: 0,  //苹果X以上手机底部适配高度
			};
		},
	  created() {
			let that = this;
			uni.getSystemInfo({
				success: function (res) {
					let model = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
					model.forEach(item => {
						//适配iphoneX以上的底部，给tabbar一定高度的padding-bottom
						if(res.model.indexOf(item) != -1 && res.model.indexOf('iPhone') != -1) {
							that.paddingBottomHeight = 40;
						}
					})
				}
			});
		},
		computed:{
			list(){
				return [
						{
							texts: this.$t('tabbar.HomeText'),  
							icon: '../../static/image/tabbar/home_n.png',  //未选中图标
							icon_a: '../../static/image/tabbar/home_y.png',  //选中图片
							path: "/pages/index/index",  //页面路径
						},
						{
							texts: this.$t('tabbar.OrderText'),
							icon: '../../static/image/tabbar/orderRecord_n.png',  //未选中图标
							icon_a: '../../static/image/tabbar/orderRecord_y.png',  //选中图片
							path: "/pages/orderRecord/orderRecord",
						}
						,{
							texts: this.$t('tabbar.HomeText'),
							icon: '../../static/image/tabbar/home_n.png',  //未选中图标
							icon_a: '../../static/image/tabbar/home_y.png',  //选中图片
							path: '/pages/lottery/lottery',
						},
						{
							texts: this.$t('tabbar.TeamText'),
							icon: '../../static/image/tabbar/team_n.png',  //未选中图标
							icon_a: '../../static/image/tabbar/team_y.png',  //选中图片
							path: "/pages/teamReports/teamReports",
						},
						{
							texts: this.$t('tabbar.AccountText'),
							icon: '../../static/image/tabbar/my_n.png',  //未选中图标
							icon_a: '../../static/image/tabbar/my_y.png',  //选中图片
							path: "/pages/my/my",
						}
				]
			}
		},
		watch: {
		},
		methods: {
			tabbarChange(path) {
				uni.switchTab({
					url: path
				})
			}
		}
	}
</script>

<style lang="less">
	.tabbarActive{
        color: #fff !important;
    }
    .tabbar{
        position: fixed;
        bottom: 0;
        // left: 0;
        // right: 0;
        display: flex;
		z-index:999999999999999;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 100rpx;
        background-color: rgb(79, 98, 192);
        .tabbar-item{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100rpx;
			&.buttItem{
				width: 100rpx;
				position:relative;
				.button-3d-2{
					
				}
			}
            .item-img{
                margin-bottom: 4rpx;
            }
            .item-name{
                font-size: 24rpx;
                color: #fff;
				font-family: 'Arial';
            }
			.button-3d-2{
			  background: url('../../static/image/tabbar/lottery_n.png') no-repeat center center;
			  background-size: 80rpx 80rpx;
			  height: 80rpx;
			  width: 80rpx;
			  z-index:1000;
			  &.activeBtn{
			  background: url('../../static/image/tabbar/lottery_y.png') no-repeat center center;
			  background-size: 80rpx 80rpx;
			  }
			}
			.tuofeng{
				position: absolute;
				top: -34rpx;
				width: 160rpx;
				height:54rpx;
				background: url("../../static/image/tabbar/tuofeng.png") no-repeat center center;
				background-size: 160rpx 22rpx;
			}
        }
    }
</style>
