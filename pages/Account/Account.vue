<template>
	<view>
		<view  @click="Logout">退出登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			/* 退出登录 */
			async Logout() {
				uni.$u.vuex('vuex_token','');
				uni.setStorageSync('userInfo','');
				uni.setStorageSync('isPopup', false);
				this.$u.route({
					type:'reLaunch',
					url: '/pages/userAuth/login'
				})
			},
		}
	}
</script>

<style>

</style>
