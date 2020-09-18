<template>
	<view class="content">
		<view class="cate-section">
			<view class="cate-item cate-item-item">累计收益：￥{{ SumProfit }}</view>
			<view class="cate-item cate-item-item">账户余额：￥{{ TotleProfit }}</view>
			<view class="cate-item cate-item-item">当月收益：￥{{ MonthProfit }}</view>
			<view class="cate-item cate-item-item">可提现：￥{{ TMmoney }}</view>
		</view>

		<view class="list">
			<view class="li" @tap="Recharge()">
				<view class="text">充值</view>
				<image class="to" src="/static/to.png"></image>
			</view>
		</view>

		<view class="list" v-for="(list, list_i) in severList" :key="list_i">
			<view class="li" v-for="(li, li_i) in list" @tap="toPage(list_i, li_i)" v-bind:class="{ noborder: li_i == list.length - 1 }" hover-class="hover" :key="li.name">
				<view class="text">{{ li.name }}</view>
				<view class="text" style="text-align: right;">{{ li.conte }}</view>
				<image class="to" src="/static/to.png"></image>
			</view>
		</view>

		<view class="uni-list">
			<block v-for="(list, index) in lists" :key="index">
				<view class="uni-list-cell uni-collapse">
					<view class="uni-list-cell-navigate uni-navigate-bottom" :class="list.show ? 'uni-active' : ''" @click="trigerCollapse(index)">{{ list.title }}</view>
					<view class="uni-collapse-content" :class="list.show ? 'uni-active' : ''">
						<view v-if="list.type === 'list'">
							<view class="uni-list">
								<view class="uni-list-cell" hover-class="uni-list-cell-hover">
									<view class="uni-list-cell-navigate uni-navigate-right" @tap="GoZFB()">支付宝</view>
								</view>
								<view class="uni-list-cell" hover-class="uni-list-cell-hover">
									<view class="uni-list-cell-navigate uni-navigate-right" @tap="GoWX()">微信</view>
								</view>
								<view class="uni-list-cell" hover-class="uni-list-cell-hover">
									<view class="uni-list-cell-navigate uni-navigate-right" @tap="GoYHK()">银行卡</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>

		<view class="uni-list" style="margin-top: 10px;">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover">
				<view class="uni-media-list" style="height: 64px;">
					<view class="uni-media-list-logo" style="line-height: 42px;width: 80px;margin-right: 0px;">月份</view>
					<view class="uni-media-list-body" style="text-align: -webkit-center;">收益</view>
					<view class="uni-pull-right" style="line-height: 42px;width: 80px;text-align: right;">已提现</view>
				</view>
			</view>
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value, key) in list" :key="key">
				<view class="uni-media-list" style="height: 64px;">
					<view class="uni-media-list-logo" style="line-height: 42px;width: 80px;margin-right: 0px;">{{ value.months }}月</view>
					<view class="uni-media-list-body">￥{{ value.Profit}}</view>
					<view @tap="QueryDetail(value.months)" class="uni-pull-right" style="line-height: 42px;width: 80px;text-align: right;color: #ff6600;">
						￥ {{ value.Withdrawmoney > 0 ? value.Withdrawmoney : 0 }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';

export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
	data: function() {
		return {
			SumProfit: 0,
			TotleProfit: 0,
			MonthProfit: 0,
			TMmoney: 0,
			list: [],
			severList: [[{ name: '提现', icon: '/static/to.png', conte: '', type: '' }]],
			lists: [
				{
					title: '提现绑定',
					type: 'list',
					show: false
				}
			]
		};
	},
	onLoad() {
		this.init();
	},
	methods: {
		init() {
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				method: 'GET',
				data: {
					req: 'GetMyProfit',
					account: this.Account
				},
				success: res => {					
					if (res.data.ResultType == true) {
						this.TotleProfit = parseFloat(res.data.TotalAmount).toFixed(2);
						this.SumProfit = parseFloat(res.data.SUMProfit).toFixed(2);
						this.MonthProfit = parseFloat(res.data.MonthProfit).toFixed(2);
						if (parseFloat(res.data.TotalAmount) > 100) {
							this.TMmoney = parseFloat(res.data.TotalAmount).toFixed(2);
						}
						res.data.AllMonthProfitList.forEach(item => {
							item.Profit=parseFloat(item.Profit).toFixed(2);	
						});
						
						this.list = res.data.AllMonthProfitList;
					}
				},
				complete: res => {
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
			});
		},
		Recharge() {
			uni.navigateTo({
				url: 'RechargeMoney'
			});
		},
		//点击列表
		toPage(list_i, li_i) {
			uni.navigateTo({
				url: 'WithdrawMian'
			});
		},
		trigerCollapse(e) {
			for (let i = 0, len = this.lists.length; i < len; ++i) {
				if (e === i) {
					this.lists[i].show = !this.lists[i].show;
				} else {
					this.lists[i].show = false;
				}
			}
		},
		GoZFB() {
			uni.navigateTo({
				url: 'Bindzfb'
			});
		},
		GoWX() {
			uni.navigateTo({
				url: 'BindWX'
			});
		},
		GoYHK() {
			uni.navigateTo({
				url: 'Bindyhk'
			});
		},
		QueryDetail(e) {
			uni.navigateTo({
				url: 'DrawDetail?Month=' + e
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f8f8f8;
	padding-bottom: 100upx;
}

.uni-list-cell-hover {
background-color: #fff;

}


.content {
	width: 100%;
	background-color: #f8f8f8;
}

.headers {
	border: 0px;
	width: 92%;
	padding: 0 4% 0;
	display: flex;
	align-items: center;
	vertical-align: middle;
	line-height: 30vw;
}

.moneycount {
	color: white;
	font-size: 58upx;
	margin: auto;
	text-align: -webkit-center;
	vertical-align: middle;
}

.uni-media-list-body {
	text-align: -webkit-center;
	line-height: 42px;
	margin-left: 0px;
}

/* 分类 */
.cate-section {
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex-wrap: wrap;
	padding: 40upx 0;
	color: #fff;
	background-color: #ff6600;
}

.cate-section .cate-item {
	width: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	font-size: 30upx;
}
.cate-item-item {
	display: -webkit-inline-box;
	margin-bottom: 10px;
}
.right-pull {
	line-height: 42px;
	width: 80px;
	text-align: center;
}
.uni-list-cell::after {
	right: 15px;
}

.list {
	width: 100%;
	border-bottom: solid 26upx #f4f8f9;
	.li {
		width: 92%;
		height: 100upx;
		padding: 0 4%;
		border-bottom: solid 1upx #e7e7e7;
		display: flex;
		align-items: center;
		background-color: white;
		&.noborder {
			border-bottom: 0;
		}
		.icon {
			flex-shrink: 0;
			width: 50upx;
			height: 50upx;
			image {
				width: 50upx;
				height: 50upx;
			}
		}
		.text {
			width: 100%;
			color: #333;
			font-size: 15px;
			text-align: left;
		}
		.to {
			flex-shrink: 0;
			width: 40upx;
			height: 40upx;
		}
	}
}
</style>
