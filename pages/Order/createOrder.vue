<template>
	<view style="background: #F4F4F4;">
		<!-- 地址 -->
		<navigator url="/pages/address/address?source=1" class="address-section" v-if="shoplength > 0">
			<view class="order-content">
				<view class="yticon icon-shouhuodizhi"><image src="/static/dw.png" style="width: 26px;height: 26px;"></image></view>
				<view class="cen">
					<view class="top">
						<text class="name">{{ ShipTo }}</text>
						<text class="mobile" style="color: #747474;">{{ Phone }}</text>
					</view>
					<text class="address">{{ Address }} {{ AddressDetail }}</text>
				</view>
				<text class="yticon icon-you">></text>
			</view>
		</navigator>
		<navigator url="/pages/address/addressManage?type=add&AdressGuid=''&comefrom=order" class="address-section" v-if="shoplength < 1">
			<view class="order-content">
				<view class="yticon icon-shouhuodizhi"><image src="/static/dw.png" style="width: 26px;height: 26px;"></image></view>
				<view class="cen">
					<view class="top"><text class="name">暂无收货地址</text></view>
				</view>
				<text class="yticon icon-you" style="font-size: 12px;border: 1px solid red;border-radius: 4px;padding-left: 6px;padding-right: 6px;color: red;">新增地址</text>
			</view>
		</navigator>
			<view class="goods-section">
				<view>
					<!-- <view class="g-header b-b">
					<image class="logo" :src="item.ShopHeadImg"></image>
					<text class="name">{{item.ShopName}}</text>
				</view> -->
					<!-- 商品列表 -->
					<view class="g-item" v-for="(item, index) in OrderList" :key="index">
						<image :src="item.mainimg"></image>
						<view class="right">
							<view style="display: -webkit-box;overflow:hidden;text-overflow: elipsis;word-break: break-all;-webkit-box-orient:vertical;-webkit-line-clamp: 2">
								<text class="title clamp">{{ item.ProductName }}</text>
							</view>
							<view>
								<text class="spec">{{ item.ColorAlias }}{{ item.Para0 }}{{ item.SizeAlias }}{{ item.Para1 }}</text>
							</view>
							<view class="price-box" style="font-size: font-size: 14px;">
								<text class="price" style="color: red;" v-if="VIPType != 0">省·赚 ¥{{ item.Para2 }}</text>
							</view>
							<view class="price-box">
								<text class="price">￥{{ item.SalePrice }}</text>
								<text class="number" @input="sum($event, index)">x {{ item.GoodsCounts }}</text>
							</view>
							<block v-if="item.shopIsInvoice == 1">
								<view class="price-box" style="text-align: right;width: 100%;">
									<view style="width: 100%;text-align: right;padding-right: 28px;font-size: 12px;">发票类型：</view>
								</view>
								<view class="price-box" @click="chaneInvoice(item)">
									<view style="width: 100%;text-align: right;font-size: 12px;padding-right: 10px;color: #747474;">电子发票 ></view>
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>

			<!-- 金额明细 -->
			<view class="yt-list">
				<view class="yt-list-cell b-b" v-if="VIPType != 0">
					<text class="cell-tit clamp">省/赚</text>
					<text class="cell-tip" style="color: red;">-￥{{ savemoney }}</text>
				</view>
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">运费</text>
					<text class="cell-tip">免运费</text>
				</view>
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">小计</text>
					<text class="cell-tip">￥{{ sumPrice }}</text>
				</view>				
				<view class="yt-list-cell desc-cell">
					<text class="cell-tit clamp">备注</text>
					<input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder" />
				</view>
			</view>

			<!-- 底部 -->
			<view class="footer">
				<view class="price-content">
					<text>实付款</text>
					<text class="price-tip">￥</text>
					<text class="price">{{ sumPrice }}</text>
				</view>
				<text class="submit" @click="AddOrder()">提交订单</text>
			</view>
	</view>
</template>

<script>
var Account;
var Uguid;
// var dataOrder;
import { mapState } from 'vuex';

export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType']),
	data() {
		return {
			OrderList: [],
			MPOrderList: [],
			desc: '', //备注
			payType: 1, //1微信 2支付宝
			shoplength: 0,
			ShipTo: '',
			Phone: '',
			Address: '',
			AddressDetail: '',
			Longitude: '',
			Latitude: '',
			AdressGuid: '',
			sumPrice: 0,
			IsShowGG: 'block',
			savemoney: 0,
			getnow: '',
			Freight:0//运费
		};
	},
	onLoad() {
		this.getnow = 'Fp' + new Date().getTime();
		console.log(this.getnow);
		this.init();
		let dataOrder = JSON.parse(uni.getStorageSync('buylist'));
		this.OrderList = dataOrder;
		this.OrderList.forEach(item => {
			if (uni.getStorageSync('VIPType') == 0) {
				item.Para2 = 0;
			} else {
				item.Para2 = ((parseFloat(item.GoodsPrices) - parseFloat(item.SetTlementPrice)) * 0.4).toFixed(2) * parseInt(item.GoodsCounts);
			}
		});
		this.sum();
	},
	methods: {
		init() {
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				data: {
					req: 'AddressBySelf',
					account: uni.getStorageSync('Account'),
					Guid: this.AdressGuid
				},
				success: result => {
					this.shoplength = result.data.AddressInfo.length;
					if (this.shoplength > 0) {
						this.ShipTo = result.data.AddressInfo[0].ShipTo;
						this.Phone = result.data.AddressInfo[0].Phone;
						this.Address = result.data.AddressInfo[0].Address;
						this.AddressDetail = result.data.AddressInfo[0].AddressDetail;
						this.Longitude = result.data.AddressInfo[0].Longitude;
						this.Latitude = result.data.AddressInfo[0].Latitude;
					}
				},
				fail: e => {
					uni.showToast({
						icon: 'none',
						title: e.errMsg
					});
				}
			});
		},
		// 合计
		sum(e, index) {
			if (uni.getStorageSync('VIPType') == 0) {
				this.savemoney = 0;
			}
			this.sumPrice = 0;
			let len = this.OrderList.length;
			for (let i = 0; i < len; i++) {
				if (this.OrderList[i].selected) {
					if (e && i == index) {
						this.sumPrice = this.sumPrice + e.detail.value * this.OrderList[i].SalePrice;
						this.savemoney = parseFloat(this.savemoney) + this.OrderList[i].Para2;
					} else {
						this.sumPrice = this.sumPrice + this.OrderList[i].GoodsCounts * this.OrderList[i].SalePrice;
						this.savemoney = parseFloat(this.savemoney) + this.OrderList[i].Para2;
					}
				}
			}
			console.log(this.savemoney);
			this.sumPrice = (this.sumPrice - this.savemoney).toFixed(2);
		},
		AddOrder() {
			if (
				this.ShipTo == null ||
				this.ShipTo == '' ||
				this.Phone == null ||
				this.Phone == '' ||
				this.Address == null ||
				this.Address == '' ||
				this.AddressDetail == null ||
				this.AddressDetail == ''
			) {
				uni.showToast({
					icon: 'none',
					title: '收货地址不能为空'
				});
				return;
			}
			var allorder = this.OrderList;
			var GoodsGuid = '';
			var GoodsNum = '';
			var sGuids = '';
			var sNames = '';
			var savemoney = '';
			if (this.OrderList.length > 0) {
				this.OrderList.forEach(item => {
					GoodsGuid += "'" + item.Guid + "',";
					GoodsNum += item.GoodsCounts + ',';
					sGuids += item.ShopGuid + ',';
					sNames += item.ShopName + ',';
					savemoney += item.Para2 + ',';
				});
			}
			var kk = GoodsGuid.substring(0, GoodsGuid.length - 1);
			var Numss = GoodsNum.substring(0, GoodsGuid.length - 1);
			var sgd = sGuids.substring(0, sGuids.length - 1);
			var sns = sNames.substring(0, sNames.length - 1);
			var smoney = savemoney.substring(0, savemoney.length - 1);
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				data: {
					req: 'AddOrderInfo',
					account: this.Account,
					UserRemark: '',
					ShipTo: this.ShipTo,
					CellPhone: this.Phone,
					RegionFullName: this.AddressDetail,
					Address: this.Address,
					ReceiveLongitude: this.Longitude,
					ReceiveLatitude: this.Latitude,
					ExpressCompanyName: '',
					ProductTotalAmount: this.sumPrice,
					OrderRemarks: this.desc,
					GoodsGuid: kk,
					GoodsNum: Numss,
					SumSavemoney: this.savemoney,
					sgd: sgd,
					sns: sns,
					smoney: smoney,
					getnow: this.getnow,
					Freight:this.Freight
				},
				success: result => {
					if (result.data.ResultType) {
						console.log(result.data.strSQL);
						var SumMoney = this.sumPrice;
						uni.redirectTo({
							url: '/pages/money/pay?SumMoney=' + SumMoney + '&OrderNo=' + result.data.OrderNo
						});
					}
				},
				fail: e => {
					console.log(3333333);
					uni.showToast({
						icon: 'none',
						title: e.errMsg
					});
				}
			});
		},
		stopPrevent() {},
		chaneInvoice(item) {
			var shopid = item.ShopGuid;
			var truelyPrice = parseFloat(item.SalePrice) - parseFloat(item.Para2);
			var ProductName = item.ProductName;
			var getnow = this.getnow;
			var gid = item.GoodsNo;
			uni.navigateTo({
				url: '/pages/Order/Invoice?Shopid=' + shopid + '&sumPrice=' + truelyPrice + '&name=' + ProductName + '&getnowcode=' + getnow + '&GoodsGuids=' + gid
			});
		},
		// formSubmit: function(e) {
		// 	let formId = e.detail.formId;
		// 	uni.showToast({
		// 		icon: 'none',
		// 		title: formId
		// 	});
		// 	uni.request({
		// 		url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
		// 		data: {
		// 			req: 'AddTemplateMsg',
		// 			formId: formId
		// 		},
		// 		success: result => {
		// 			console.log('success');
		// 			this.AddOrder();
		// 		},
		// 		fail: e => {
		// 			uni.showToast({
		// 				icon: 'none',
		// 				title: e.errMsg
		// 			});
		// 		}
		// 	});
		// }
	}
};
</script>

<style lang="scss">
page {
	background: #f4f4f4;
	padding-bottom: 100upx;
	margin-bottom: 60px;
}

.address-section {
	padding: 30upx 0;
	background: #fff;
	position: relative;

	.order-content {
		display: flex;
		align-items: center;
	}

	.icon-shouhuodizhi {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90upx;
		color: #888;
		font-size: 44upx;
	}

	.cen {
		display: flex;
		flex-direction: column;
		flex: 1;
		font-size: 28upx;
		color: #333333;
	}

	.name {
		font-size: 34upx;
		margin-right: 24upx;
	}

	.address {
		margin-top: 16upx;
		margin-right: 20upx;
		color: #333333;
	}

	.icon-you {
		font-size: 32upx;
		color: #747474;
		margin-right: 30upx;
	}

	.a-bg {
		position: absolute;
		left: 0;
		bottom: 0;
		display: block;
		width: 100%;
		height: 5upx;
	}
}

.goods-section {
	margin-top: 16upx;
	background: #f4f4f4;
	padding-bottom: 1px;

	.g-header {
		display: flex;
		align-items: center;
		height: 84upx;
		padding: 0 30upx;
		position: relative;
	}

	.logo {
		display: block;
		width: 50upx;
		height: 50upx;
		border-radius: 100px;
	}

	.name {
		font-size: 30upx;
		color: #747474;
		margin-left: 24upx;
	}

	.g-item {
		display: flex;
		padding: 10px;
		border-radius: 8px;
		background-color: #ffffff;
		margin-top: 10px;
		image {
			flex-shrink: 0;
			display: block;
			width: 100px;
			height: 100px;
			border-radius: 6px;
			padding-top: 5px;
		}

		.right {
			flex: 1;
			padding-left: 24upx;
			overflow: hidden;
		}

		.title {
			font-size: 30upx;
			color: #333333;
		}

		.spec {
			font-size: 26upx;
			color: #747474;
			background-color: #ddd;
			opacity: 0.5;
			border-radius: 2px;
		}

		.price-box {
			display: flex;
			align-items: center;
			font-size: 32upx;
			color: #333333;
			.price {
				margin-bottom: 4upx;
			}
			.number {
				font-size: 26upx;
				color: #747474;
				margin-left: 20upx;
			}
		}

		.step-box {
			position: relative;
		}
	}
}

.yt-list {
	margin-top: 16upx;
	background: #fff;
	margin-bottom: 50px;
}

.yt-list-cell {
	display: flex;
	align-items: center;
	padding: 10upx 30upx 10upx 40upx;
	line-height: 70upx;
	position: relative;

	&.cell-hover {
		background: #fafafa;
	}

	&.b-b:after {
		left: 30upx;
	}

	.cell-icon {
		height: 32upx;
		width: 32upx;
		font-size: 22upx;
		color: #fff;
		text-align: center;
		line-height: 32upx;
		background: #f85e52;
		border-radius: 4upx;
		margin-right: 12upx;

		&.hb {
			background: #ffaa0e;
		}

		&.lpk {
			background: #3ab54a;
		}
	}

	.cell-more {
		align-self: center;
		font-size: 24upx;
		color: red;
		margin-left: 8upx;
		margin-right: -10upx;
	}

	.cell-tit {
		flex: 1;
		font-size: 26upx;
		color: #747474;
		margin-right: 10upx;
	}

	.cell-tip {
		font-size: 26upx;
		color: black;

		&.disabled {
			color: #747474;
		}

		&.active {
			color: #747474;
		}

		&.red {
			color: red;
		}
	}

	&.desc-cell {
		.cell-tit {
			max-width: 90upx;
		}
	}

	.desc {
		flex: 1;
		font-size: 14px;
		color: #747474;
	}
}

/* 支付列表 */
.pay-list {
	padding-left: 40upx;
	margin-top: 16upx;
	background: #fff;

	.pay-item {
		display: flex;
		align-items: center;
		padding-right: 20upx;
		line-height: 1;
		height: 110upx;
		position: relative;
	}

	.icon-weixinzhifu {
		width: 80upx;
		font-size: 40upx;
		color: #6bcc03;
	}

	.icon-alipay {
		width: 80upx;
		font-size: 40upx;
		color: #06b4fd;
	}

	.icon-xuanzhong2 {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60upx;
		height: 60upx;
		font-size: 40upx;
		color: #747474;
	}

	.tit {
		font-size: 32upx;
		color: #747474;
		flex: 1;
	}
}

.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 995;
	display: flex;
	align-items: center;
	width: 100%;
	height: 90upx;
	justify-content: space-between;
	font-size: 30upx;
	background-color: #fff;
	z-index: 998;
	color: #747474;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

	.price-content {
		padding-left: 30upx;
	}

	.price-tip {
		color: red;
		margin-left: 8upx;
	}

	.price {
		font-size: 36upx;
		color: red;
	}

	.submit {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 280upx;
		height: 100%;
		color: #fff;
		font-size: 32upx;
		background-color: red;

		button {
			color: #fff;
			font-size: 32upx;
			background-color: red;
			border: 0px solid rgba(0, 0, 0, 0) !important;
		}
	}
}
button:after {
	border: 0;
}
</style>
