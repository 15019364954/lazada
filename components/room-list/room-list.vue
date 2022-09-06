<template>
	<view class="room-list">
		<view class="item" v-for="(item,index) in TaskHallData">
			<u--image :src="item.imgUrl" width="166rpx" height="166rpx" mode="widthFix"></u--image>
			<view class="content">
				<view class="name">{{item.levelName}}</view>
				<view class="taskNum">Do daily tasks: {{item.orderNumber}}</view>
				<view class="bottom">
					<view class="score">
						<view :class="handlerStartShow(index)[0]?handlerStartShow(index)[0]+' xx':'xx'"></view>
						<view :class="handlerStartShow(index)[1]?handlerStartShow(index)[1]+' xx':'xx'"></view>
						<view :class="handlerStartShow(index)[2]?handlerStartShow(index)[2]+' xx':'xx'"></view>
						<view :class="handlerStartShow(index)[3]?handlerStartShow(index)[3]+' xx':'xx'"></view>
						<view :class="handlerStartShow(index)[4]?handlerStartShow(index)[4]+' xx':'xx'"></view>
					</view>
					<!-- 进入play -->
					<view class="playBtn" v-if="handleIsenableClass(item)" @click="handleForestall(item)">
						{{$t('task-hall.Enter')}}
					</view>
					<!-- 申请按钮 -->
					<view class="ApplyBtn" @click="Apply(item)" v-if="!handleIsenableClass(item)&&!item.remark">
						{{$t('task-hall.Apply')}}
					</view>
					<!-- 暂未开启敬请期待 -->
					<view class="disableBtn" v-if="item.remark" @click="Apply(item)">{{item&&ApplyContent(item)}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "room-list",
		props: {
			TaskHallData: {
				type: Array || Object,
				default: () => {
					return null
				}
			}
		},
		data() {
			return {

			};
		},
		watch: {
			TaskHallData() {
				console.log(this.TaskHallData);
			}
		},
		methods: {
			/* 处理星星显示 */
			handlerStartShow(index) {
				switch (index) {
					case 0:
						return ['xxSelectAll', '', '', '', '']
						break;
					case 1:
						return ['xxSelectAll', 'half', '', '', '']
						break;
					case 2:
						return ['xxSelectAll', 'xxSelectAll', '', '', '']
						break;
					case 3:
						return ['xxSelectAll', 'xxSelectAll', 'half', '', '']
						break;
					case 4:
						return ['xxSelectAll', 'xxSelectAll', 'xxSelectAll', '', '']
						break;
					case 5:
						return ['xxSelectAll', 'xxSelectAll', 'xxSelectAll', 'half', '']
						break;
					case 6:
						return ['xxSelectAll', 'xxSelectAll', 'xxSelectAll', 'xxSelectAll', '']
						break;
					case 7:
						return ['xxSelectAll', 'xxSelectAll', 'xxSelectAll', 'xxSelectAll', 'xxSelectAll']
						break;
					default:
						break;
				}
			},
			/* 处理按钮状态 */
			//state=true && enable = true，已经开启房间
			//state=false && enable = true 房间显示未开启可以去申请
			//enable = false，房间不能进去，变灰，按钮显示备注信息
			handleIsenableClass(item) {
				const {
					state,
					enable,
					remark
				} = item;
				if (state && enable) {
					return true;
				}
				if (state == false && enable == true) {
					return false
				}
				if (enable == false) {
					return false
				}
			},
			//处理等级名称显示
			handleLevelName(leveName) {
				let name = '';
				switch (leveName) {
					case "Trainee Manager":
						name = this.$t('grade.Trainee_Manager');
						break;
					case "General Manager":
						name = this.$t('grade.General_Manager');
						break;
					case "Senior Manager":
						name = this.$t('grade.Senior_Manager');
						break;
					case "Regional Manager":
						name = this.$t('grade.Regional_Manager');
						break;
					case "Regional General Manager":
						name = this.$t('grade.Regional_General_Manager');
						break;
					case "Regional Vice President":
						name = this.$t('grade.Regional_Vice_President');
						break;
					case "Regional President":
						name = this.$t('grade.Regional_President');
						break;
					case "Co-Founder":
						name = this.$t('grade.Co-Founder');
						break;
					default:
						name = "";
				}
				return name;
			},
			//点击模块
			handleItemClick(item) {
				const {
					state,
					enable,
					remark
				} = item;
				if (!remark && state && enable) { //调用play
					this.handleForestall(item);
				}
				if (state == false && enable == true && !remark) { //Apply
					this.Apply(item);
				}
				if (remark) {
					this.Apply(item);
				}
			},

			/* 判断处理显示备注按钮内容 */
			ApplyContent(item) {
				if (item && item.remark) {
					if (item.remark == "敬请期待") {
						return this.$t('task-hall.stayTuned');
					} else {
						return this.$t('task-hall.notOpenYet');
					}
				}
			},

			/* 抢单 */
			handleForestall(item) {
				const {
					rate,
					imgUrl,
					levelName
				} = item;
				let params = JSON.stringify(item);
				// 获取用户报告信息
				if (item.state && item.enable) {
					this.$u.route({
						type: 'navigateTo',
						url: 'pages/forestall/forestall',
						params: {
							item: encodeURIComponent(params)
						}
					})
				}
			},

			/* 点击申请按钮 */
			Apply(item) {
				this.$u.route({
					type: 'navigateTo',
					url: 'pages/Apply/Apply',
					params: {
						item: JSON.stringify(item)
					}
				})
			},
		},
		mounted() {
			console.log(this.roomData);
		}
	}
</script>

<style lang="less" scoped>
	.room-list {
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;
		margin-bottom: 24rpx;

		.item {
			height: 220rpx;
			background: #ffffff url("../../static/image/index/room_item_bg.png") no-repeat center center;
			background-size: 100% 220rpx;
			box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);
			margin-bottom: 24rpx;
			border-radius: 16rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 28rpx 24rpx 28rpx 28rpx;
		}

		.content {
			flex: 1;
			margin-left: 20rpx;

			.name {
				height: 40rpx;
				font-size: 28rpx;
				font-family: "PingFangSC-Medium";
				font-weight: 500;
				text-align: left;
				color: #333333;
				line-height: 40rpx;
			}

			.taskNum {
				height: 34rpx;
				font-size: 24rpx;
				font-family: "PingFangSC-Regular";
				font-weight: 400;
				text-align: left;
				color: #666666;
				line-height: 34rpx;
			}

			.bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.score{
					display: flex;
					.xx{
						width: 28rpx;
						height: 28rpx;
						background: url("../../static/image/index/xxUnselected.png") no-repeat center center;
						background-size: 28rpx 28rpx;
						margin-right: 10rpx;
						&.xxSelectAll{
							background: url("../../static/image/index/xx_all.png") no-repeat center center;
							background-size: 28rpx 28rpx;
						}
						&.half{
							background: url("../../static/image/index/half.png") no-repeat center center;
							background-size: 28rpx 28rpx;
						}
					}
					
				}
				.playBtn {
					width: 170rpx;
					height: 60rpx;
					background: linear-gradient(308deg, #ff5261 10%, #ff8588 87%);
					border-radius: 26rpx;
					text-align: center;
					line-height: 60rpx;
					font-size: 24rpx;
					font-family: "PingFangSC-Medium";
					font-weight: 500;
					color: #ffffff;
				}

				.ApplyBtn {
					width: 210rpx;
					height: 60rpx;
					background: #e1e1e1;
					border-radius: 26rpx;
					line-height: 60rpx;
					text-align: center;
					font-size: 24rpx;
					font-family: "PingFangSC-Medium";
					font-weight: 500;
					color: #999999;
				}

				.disableBtn {
					width: 240rpx;
					height: 60rpx;
					background: #e1e1e1;
					border-radius: 26rpx;
					text-align: center;
					font-size: 24rpx;
					font-family: "PingFangSC-Medium";
					font-weight: 500;
					color: #999999;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}
</style>
