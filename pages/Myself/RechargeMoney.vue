<template>
	<view style="background-color: #f8f8f8;">
		<view class="header">
			<view class="title">充值金额</view>
			<view class="uni-form-item uni-column">
				<view class="title" style="position: absolute;font-size: 40px;padding:0;">￥</view>
				<input class="uni-input" type="number" @input="bindinputPhone" style="font-size: 40px;margin-left: 27px;height: 44px;line-height: 44px;" />
			</view>
		</view>

		<view class="header" style="margin-top: 10px;"><view class="title">注：充值到总收益里的账户余额</view></view>

		<view class="Next" @click="RMoney()">下一步</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
	data: function() {
		return {
			Money: 0
		};
	},
	onLoad() {},
	methods: {
		bindinputPhone(e) {
			this.Money = e.target.value;
		},
		RMoney() {
			if (this.Money <= 0) {
				uni.showToast({
					icon: 'none',
					title: '请输入充值金额'
				});
				return;
			}
			uni.navigateTo({
				url: '/pages/money/pay?SumMoney=' + this.Money + '&OrderNo=RM8888'+new Date().getTime()
			});
		}
	}
};
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
	}
.header {
	background-color: #fff;
	width: 92%;
	padding: 4% 4% 4%;
}
.title {
	font-size: 16px;
}

.Next {
	text-align: -webkit-center;
	margin: 20px 20px 0;
	height: 40px;
	color: #fff;
	line-height: 40px;
	background-color: #2ea048;
	border-radius: 10px;
}
</style>
