<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{ sumPrice }}</text>
		</view>

		<view class="pay-type-list">
			<view class="uni-btn-v uni-common-mt">
				<!-- #ifdef MP-WEIXIN -->
				<view class="type-item b-b">
					<view class="icon">
						<img src="https://www.chinaaos.com/static/weixinzhifu.png" style="vertical-align: middle;width: 32px;height: 32px;margin-top: 20px;" />
					</view>
					<text class="mix-btn" @click="weixinPay" :loading="loading" style="background:#2ea048">微信支付</text>
				</view>

				<!-- #endif -->

				<!-- #ifdef APP-PLUS -->
				<template v-if="providerList.length > 0">
					<view class="type-item b-b" v-for="(item, index) in providerList" :key="index">
						<view class="icon"><img :src="item.iconImg" style="vertical-align: middle;width: 32px;height: 32px;margin-top: 20px;" /></view>
						<text class="mix-btn" @click="requestPayment(item, index)" :loading="item.loading" :style="{ background: item.background }">{{ item.name }}支付</text>
						<!-- <button @click="requestPayment(item,index)" :loading="item.loading">{{item.name}}支付</button> -->
					</view>
				</template>
				<!-- #endif -->
				<view class="type-item b-b" v-if="Order_No != 'RM8888'">
					<view class="icon"><img src="/static/2_23.png" style="vertical-align: middle;width: 32px;height: 32px;margin-top: 20px;" /></view>
					<text class="mix-btn" @click="BalancePay()" :loading="loading" style="background:red">账户余额支付</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
var Account;
var Uguid;
import { mapState, mapMutations } from 'vuex';

export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType', 'unionid']),
	data() {
		return {
			payType: 0,
			orderInfo: {},
			sumPrice: '0.00',
			OrderNo: '',
			Order_No: '', //用于区分是不是充值的单号
			loading: false,
			price: 0,
			providerList: [],
			TotleBalance: 0,
			IsTotleBalance: 0
		};
	},
	onLoad(options) {
		console.log(options.OrderNo);
		this.sumPrice = options.SumMoney;
		this.OrderNo = options.OrderNo;
		this.Order_No = options.OrderNo.substring(0, 6);

		// #ifdef APP-PLUS
		uni.getProvider({
			service: 'payment',
			success: e => {
				console.log('payment success:' + JSON.stringify(e));
				let providerList = [];
				e.provider.map(value => {
					switch (value) {
						case 'alipay':
							providerList.push({
								name: '支付宝',
								id: value,
								loading: false,
								iconImg: '/static/alipay.png',
								background: '#1296db'
							});
							break;
						case 'wxpay':
							providerList.push({
								name: '微信',
								id: value,
								loading: false,
								iconImg: 'https://www.chinaaos.com/static/weixinzhifu.png',
								background: 'green'
							});
							break;
						default:
							break;
					}
				});
				this.providerList = providerList;
			},
			fail: e => {
				console.log('获取支付通道失败：', e);
			}
		});
		// #endif
		this.init();
	},

	methods: {
		...mapMutations(['setVIPType']),
		init() {
			console.log('888888888888:' + this.Account);
			uni.request({
				url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
				data: {
					req: 'GetSelfInfo',
					account: this.Account
				},
				success: result => {
					this.TotleBalance = result.data.ListInfo[0].TotalAmount;
				},
				fail: e => {
					uni.showToast({
						icon: 'none',
						title: e.errMsg
					});
				}
			});
		},
		BalancePay() {
			console.log('账户余额支付');
			this.payType = 3;
			this.IsTotleBalance = 1;
			var gm = parseFloat(this.sumPrice);
			var tb = parseFloat(this.TotleBalance);
			if (gm > tb) {
				uni.showToast({
					icon: 'none',
					title: '账户余额不足'
				});
				return;
			}

			this.ChangeOrderStatus();
		},
		weixinPay() {
			this.payType = 1;
			console.log('发起支付');
			this.loading = true;
			uni.login({
				success: e => {
					console.log('login success', e);
					uni.request({
						url: 'https://www.chinaaos.com/Handler/MiniWXPayHandler.ashx?_amount=' + this.sumPrice + '&_orderid=' + this.OrderNo + '&code=' + e.code,
						success: res => {							
							console.log('pay request success', res);
							if (res.statusCode !== 200) {
								uni.showModal({
									content: '支付失败，请重试！',
									showCancel: false
								});
								return;
							}

							let paymentData = JSON.parse(res.data);
							uni.requestPayment({
								timeStamp: paymentData.timeStamp,
								nonceStr: paymentData.nonceStr,
								package: paymentData.package,
								signType: 'MD5',
								paySign: paymentData.paySign,
								success: res => {
									this.ChangeOrderStatus();
									uni.showToast({
										title: '支付成功!'
									});
									uni.redirectTo({
										url: '/pages/money/paySuccess'
									});
								},
								fail: res => {
									uni.showModal({
										content: '支付失败! ',
										showCancel: false
									});
								},
								complete: () => {
									this.loading = false;
								}
							});
						},
						fail: e => {
							console.log('fail', e);
							this.loading = false;
							uni.showModal({
								content: '支付失败! ',
								showCancel: false
							});
						}
					});
				},
				fail: e => {
					console.log('fail', e);
					this.loading = false;
					uni.showModal({
						content: '支付失败!',
						showCancel: false
					});
				}
			});
		},
		async requestPayment(e, index) {
			console.log('支付方式：' + e.name);
			this.providerList[index].loading = true;
			let orderInfo = await this.getOrderInfo(e.id);
			console.log('得到订单信息', JSON.stringify(orderInfo));
			if (orderInfo.statusCode !== 200) {
				console.log('获得订单信息失败', orderInfo);
				uni.showModal({
					content: '获得订单信息失败',
					showCancel: false
				});
				return;
			}
			uni.requestPayment({
				provider: e.id,
				orderInfo: orderInfo.data,
				success: e => {
					this.ChangeOrderStatus();
					console.log('success', e);
					uni.showToast({
						title: '支付成功!'
					});
					uni.redirectTo({
						url: '/pages/money/paySuccess'
					});
				},
				fail: e => {
					console.log('fail', e);
					uni.showModal({
						content: '支付失败! ',
						showCancel: false
					});
				},
				complete: () => {
					this.providerList[index].loading = false;
				}
			});
		},
		getOrderInfo(e) {
			let appid = '';
			// #ifdef APP-PLUS
			appid = plus.runtime.appid;
			// #endif
			this.payType = 2;
			let url = 'https://www.chinaaos.com/Handler/WebApiHandler.ashx?req=GetPayInfo&_amount=' + this.sumPrice + '&_orderid=' + this.OrderNo; //支付宝
			if (e == 'wxpay') {
				this.payType = 1;
				url = 'https://www.chinaaos.com/Handler/APPWXPAYHandler.ashx?_amount=' + this.sumPrice + '&_orderid=' + this.OrderNo;
			}
			return new Promise(res => {
				uni.request({
					url: url,
					success: result => {
						console.log(result);
						res(result);
					},
					fail: e => {
						res(e);
					}
				});
			});
		},
		ChangeOrderStatus() {
			var Order_No = this.OrderNo.substring(0, 6);
			console.log('Order_No' + Order_No);
			if (Order_No == 'RM8888') {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'UserRechargeMoney',
						OrderNo: this.OrderNo,
						account: uni.getStorageSync('Account'),
						moneys: this.sumPrice,
						OrderType: 1
					},
					success: result => {
						if (result.data.ResultType == true) {
							uni.switchTab({
								url: '/pages/tabbar/my/my'
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: '充值失败！'
							});
						}
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			} else {
				console.log('改变' + this.OrderNo + '订单状态');
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'ChangeOrderState',
						OrderNo: this.OrderNo,
						account: this.Account,
						OrderType: this.payType,
						IsBalance: this.IsTotleBalance,
						moneys: this.sumPrice
					},
					success: result => {
						if (result.data.ResultType == true) {
							if (result.data.setVIP == '1') {
								this.setVIPType('1');
							}
							if (result.data.paytypes == '3') {
								//使用账户余额支付
								uni.redirectTo({
									url: '/pages/money/paySuccess'
								});
							}
						}
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
.app {
	width: 100%;
}

.price-box {
	background-color: #fff;
	height: 265upx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 28upx;
	color: #909399;

	.price {
		font-size: 50upx;
		color: #303133;
		margin-top: 12upx;

		&:before {
			content: '￥';
			font-size: 40upx;
		}
	}
}

.pay-type-list {
	margin-top: 20upx;
	background-color: #fff;
	padding-left: 60upx;

	.type-item {
		height: 120upx;
		padding: 20upx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-right: 60upx;
		font-size: 30upx;
		position: relative;
	}

	.icon {
		width: 100upx;
		font-size: 52upx;
	}

	.icon-erjiye-yucunkuan {
		color: #fe8e2e;
	}

	.icon-weixinzhifu {
		color: #36cb59;
	}

	.icon-alipay {
		color: #01aaef;
	}

	.tit {
		font-size: 14px;
		color: #747474;
		/* margin-bottom: 4upx; */
	}

	.con {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: 14px;
		color: #747474;
	}
}

.mix-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 630upx;
	height: 80upx;
	margin: 80upx auto 30upx;
	font-size: 14px;
	color: #fff;
	/* background-color: red; */
	border-radius: 10upx;
	box-shadow: 1px 2px 5px #dddddd;
}
</style>
