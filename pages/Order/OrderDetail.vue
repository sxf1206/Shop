<template>
	<view style="background: #f8f8f8;margin-bottom:80px;">

		<view style="width: 100%;background-color: #ff6600;height: 80px;text-align: center;color: white;font-size: 18px;line-height: 56px;">
			<view v-if="IsGroup==1">拼团产品</view>
			<block v-if="orderStatus==0">
				等待付款
			</block>
			<block v-if="orderStatus==3 || (orderStatus==3 && ShipStatuses==0)">
				等待发货
			</block>
			<block v-if="orderStatus==1 ||  (orderStatus==3 && ShipStatuses==2)">
				等待收货
			</block>
			<block v-if="orderStatus==4 || (orderStatus==5 && BackStatus==0)">
				已完成
			</block>
			<block v-if="orderStatus==5 && BackStatus==2">
				已退款
			</block>

		</view>


		<!-- 地址 -->
		<view class="address-section" v-if="shoplength>0">
			<view class="order-content">
				<view class="yticon icon-shouhuodizhi">
					<image src="/static/dw.png" style="width: 26px;height: 26px;"></image>
				</view>
				<view class="cen">
					<view class="top">
						<text class="name">{{ShipTo}}</text>
						<text class="mobile" style="color: #747474;">{{Phone}}</text>
					</view>
					<text class="address">{{Address}} {{AddressDetail}}</text>
				</view>
				<!-- <text class="yticon icon-you">></text> -->
			</view>
		</view>
		<view class="goods-section">

			<view class="g-header b-b" @click="goshop()">
				<image class="logo" :src="shopurl"></image>
				<text style="margin-left: 10px;margin-right: 6px;">{{shopName}}</text>>
			</view>
			<!-- 商品列表 -->
			<view class="g-item" v-for="(item, index) in OrderList" :key="index" @click="navToDetailPage(item)">
				<image :src="item.ThumbnailsUrl"></image>
				<view class="right">
					<view style="display: -webkit-box;overflow:hidden;text-overflow: elipsis;word-break: break-all;-webkit-box-orient:vertical;-webkit-line-clamp: 2">
						<text class="title clamp">{{item.ProductName }}</text>
					</view>
					<view>
						<text class="spec">{{item.Para0}}{{item.Color}}{{item.Para1}}{{item.Size}}</text>
					</view>
					<view class="price-box">
						<text class="price">￥{{item.SalePrice}}</text>
						<text class="price" style="color: red;" v-if="VIPType!=0">省·赚¥{{item.Para2}}</text>
						<text class="number" @input="sum($event,index)">x {{item.Quantity}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 订单信息 -->
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">订单编号:</text>
				<view class="desc" type="text">
					<view style="float: left;">{{OrderNo}}</view>
					<view style="float: left;margin-top: 5px;width: 40px;height: 18px;line-height: 18px;vertical-align:middle;background-color: #DDDDDD;color: white;border-radius: 9px;margin-left:15px;text-align: center;vertical-align: middle;"
					 @click="copysome">
						复制
					</view>
				</view>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">下单时间:</text>
				<text class="desc" type="text">{{OrderCreatTime}}</text>
			</view>
			<view class="yt-list-cell desc-cell" v-if="orderStatus!=0">
				<text class="cell-tit clamp">支付方式:</text>
				<text class="desc" type="text">{{orderpayTypes}}支付</text>
			</view>
			<view class="yt-list-cell desc-cell" v-if="orderStatus==4 || orderStatus==1 ||  (orderStatus==3 && ShipStatuses==2)">
				<text class="cell-tit clamp">配送方式:</text>
				<text class="desc" type="text">{{orderSendtype}}</text>
			</view>
			<view class="yt-list-cell desc-cell" v-if="IsInvoice!=0">
				<text class="cell-tit clamp">发票类型:</text>
				<text class="desc" type="text">电子普通发票</text>
			</view>
			<view class="yt-list-cell desc-cell" v-if="IsInvoice!=0">
				<text class="cell-tit clamp">发票抬头:</text>
				<text class="desc" type="text">{{InvoiceTitle}} ({{InvoiceContext}})</text>
			</view>
		</view>

		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b" v-if="VIPType!=0">
				<text class="cell-tit clamp">省/赚</text>
				<text class="cell-tip" style="color: red;">-￥{{savemoney.toFixed(2)}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip">￥{{sumPrice.toFixed(2)}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">免运费</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp"></text>
				<text class="cell-tip"><text>实付款:</text><text style="color: red;">￥{{sumPrice.toFixed(2)}}</text></text>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注</text>
				<text class="desc" type="text">{{desc}}</text>
			</view>
		</view>

		<!-- 底部 -->
		<view class="footer" v-if="BackStatus==0 && orderStatus!=5">
			<!-- 待付款 -->
			<view style="margin-top: 8px;padding: 0 30rpx;" v-if="orderStatus==0">
				<view class="action-btn-group">
					<button type="primary" class=" action-btn no-border buy-now-btn" style="width: 80px" @click="payNow()">立即支付</button>
				</view>
				<view class="action-btn-group2">
					<button type="primary" class=" action-btn2 no-border buy-now-btn" style="width: 80px" @click="deleteOrder()">取消订单</button>
				</view>
			</view>
			<!-- 待发货 -->
			<view style="margin-top: 8px;padding: 0 30rpx;" v-if="orderStatus==3 || (orderStatus==3 && ShipStatuses==0)">
				<view class="action-btn-group">
					<button type="primary" class=" action-btn no-border buy-now-btn" style="width: 80px" @click="RemindSMS()">提醒发货</button>
				</view>
				<view class="action-btn-group2">
					<button type="primary" class=" action-btn2 no-border buy-now-btn" style="width: 80px" @click="refundMoney()">退款</button>
				</view>
			</view>
			<!-- 待收货 -->
			<view style="margin-top: 8px;padding: 0 30rpx;" v-if="orderStatus==1 ||  (orderStatus==3 && ShipStatuses==2)">
				<view class="action-btn-group">
					<button type="primary" class=" action-btn no-border buy-now-btn" style="width: 80px" @click="ConfirmReceipt()">确认收货</button>
				</view>
				<view class="action-btn-group2">
					<button type="primary" class=" action-btn2 no-border buy-now-btn" style="width: 80px" @click="QueryWuliu()">查看物流</button>
				</view>
				<view class="action-btn-group2">
					<button type="primary" class=" action-btn2 no-border buy-now-btn" style="width: 80px" @click="BuyAgin()">再次购买</button>
				</view>
			</view>
			<!-- 已完成 -->
			<view style="margin-top: 8px;padding: 0 30rpx;" v-if="orderStatus==4">
				<view class="action-btn-group" v-if="getorderday< 7">
					<button type="primary" class=" action-btn no-border buy-now-btn" style="width: 80px" @click="ReqAftermarket()">申请售后</button>
				</view>
				<view class="action-btn-group2" v-if="getorderday>=7">
					<button type="primary" class=" action-btn2 no-border buy-now-btn" style="width: 80px" @click="WriteOrderDiary()">写日记</button>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	var Account;
	var Uguid;
	// var dataOrder;
	import {
		mapState
	} from 'vuex'

	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType']),
		data() {
			return {
				OrderNo: "",
				DetailNo: "",
				OrderList: [],
				desc: '', //备注
				payType: 1, //1微信 2支付宝
				shoplength: 0,
				ShipTo: '',
				Phone: '',
				Address: '',
				AddressDetail: '',
				Longitude: '',
				Latitude: '',
				AdressGuid: "",
				sumPrice: 0,
				IsShowGG: "block",
				//店铺
				shopgid: "",
				shopName: "",
				shopurl: "",
				savemoney: 0,
				//发票
				IsInvoice: 0,
				InvoiceTitle: "",
				InvoiceContext: "",
				//订单
				orderStatus: 0,
				OrderCreatTime: "",
				orderpayTypes: "",
				orderSendtype: "",
				ShipStatuses: 0,
				//退款
				BackStatus: 0,
				//确认收货日期
				getorderday: 0,
				IsGroup: '',
				IsGroupActive: ''
			}
		},
		onLoad(option) {
			this.OrderNo = option.OrderNo;
			this.DetailNo = option.DetailNo;
			this.init();
			this.GetMyAddress();
			this.sum();
		},
		methods: {
			init() {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'OrderDetail',
						account: uni.getStorageSync('Account'),
						OrderNo: this.OrderNo,
						DetailNo: this.DetailNo,
					},
					success: result => {
						if (result.data.ResultType) {
							this.orderStatus = result.data.Orderinfo[0].OrderStatus;

							this.OrderCreatTime = result.data.Orderinfo[0].CreateTime.split("T")[0] + " " + result.data.Orderinfo[0].CreateTime
								.split("T")[1].split(".")[0];
							this.orderpayTypes = result.data.Orderinfo[0].PaymentTypeName;
							this.sumPrice = result.data.Orderinfo[0].ProductTotalAmount;
							if (result.data.Orderinfo[0].OrderRemarks == "" || result.data.Orderinfo[0].OrderRemarks == null) {
								this.desc = "未填写备注信息";
							} else {
								this.desc = result.data.Orderinfo[0].OrderRemarks;
							}
							if (result.data.Orderinfo[0].SumSavemoney == "" || result.data.Orderinfo[0].SumSavemoney == null) {
								this.savemoney = 0;
							} else {
								this.savemoney = parseFloat(result.data.Orderinfo[0].SumSavemoney).toFixed(2);
							}
							this.OrderList = result.data.OrderList;
							this.OrderList.forEach(item => {
								this.IsGroup = item.IsGroup;
								this.IsGroupActive = item.IsGroupActive;
								this.shopName = item.ShopName;
								this.shopgid = item.sgid;
								this.IsInvoice = item.IsInvoice;
								this.orderSendtype = this.StringExpressComName(item.ExpressCompanyNames);
								this.ShipStatuses = item.ShipStatuses;
								this.BackStatus = item.BackStatus;
								this.shopurl = 'https://www.chinaaos.com' + item.Logo;
								item.ThumbnailsUrl = 'https://www.chinaaos.com' + item.ThumbnailsUrl;
								if (uni.getStorageSync('VIPType') == 0) {
									item.Para2 = 0;
								} else {
									item.Para2 = ((parseFloat(item.SalePrice) - parseFloat(item.CostPrice)) * 0.4).toFixed(2) * parseInt(item
										.Quantity);
								}
								var Guige = item.SKU.split(';');
								if (Guige.length > 2 && item.Color != "" && item.Size != "") {
									item.Para0 = Guige[0] + ":";
									item.Color = item.Color + ";";
									item.Para1 = Guige[1] + ":";
									item.Size = item.Size + ";";
								} else if (Guige.length == 2 && item.Color != "") {
									item.Para0 = Guige[0] + ":";
									item.Color = item.Color + ";";
									item.Para1 = "";
									item.Size = "";
								} else {
									item.Para0 = "";
									item.Color = "";
									item.Para1 = "";
									item.Size = "";
								}
								if (this.orderStatus == 4 && item.UpdateTime != "" && item.UpdateTime != null) {
									this.getorderday = this.judgeTime(item.UpdateTime.replace(/-|T|:/g, ''))
								}
							});

							//发票
							if (result.data.Invoicelist.length > 0) {
								this.InvoiceTitle = result.data.Invoicelist[0].InvoiceTitle;
								this.InvoiceContext = result.data.Invoicelist[0].InvoiceContext;
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

			},
			GetMyAddress() {
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
							this.Phone = result.data.AddressInfo[0].Phone.substring(0, 3) + "****" + result.data.AddressInfo[0].Phone.substring(
								7, 11); //result.data.AddressInfo[0].Phone;
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
							this.sumPrice = this.sumPrice + (e.detail.value * this.OrderList[i].SalePrice);
						} else {
							this.sumPrice = this.sumPrice + (this.OrderList[i].GoodsCounts * this.OrderList[i].SalePrice);
						}
					}
				}
				this.sumPrice = this.sumPrice - this.savemoney.toFixed(2);
			},
			judgeTime(data) {
				var date = data.toString();
				var year = date.substring(0, 4);
				var month = date.substring(4, 6);
				var day = date.substring(6, 8);
				var d1 = new Date(year + '/' + month + '/' + day);
				var dd = new Date();
				var y = dd.getFullYear();
				var m = dd.getMonth() + 1;
				var d = dd.getDate();
				var d2 = new Date(y + '/' + m + '/' + d);
				var iday = parseInt(d2 - d1) / 1000 / 60 / 60 / 24;
				return iday;
			},
			goshop() {
				uni.navigateTo({
					url: '/pages/Shop/ShopMain?guids=' + this.shopgid
				});
			},
			payNow() {
				var OrderNo = this.OrderNo;
				uni.navigateTo({
					url: '/pages/Order/OrderSettlement?OrderNo=' + OrderNo
				});
			},
			WriteOrderDiary() {
				var OrderNo = this.OrderNo;
				console.log("写日记单号：" + OrderNo);
				uni.navigateTo({
					url: '/pages/AddDiary/AddDiary?OrderNo=' + OrderNo
				});
			},
			deleteOrder() {
				uni.showLoading({
					title: '请稍后'
				});
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'DeteleOrderDetail',
						account: uni.getStorageSync('Account'),
						OrderNo: this.OrderNo,
						DetailNo: this.DetailNo
					},
					success: result => {
						uni.showToast({
							icon: 'none',
							title: "订单已取消"
						});
						setTimeout(function() {
							uni.navigateBack();
						}, 3000);
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
				setTimeout(() => {
					this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.hideLoading();
				}, 600);
			},
			RemindSMS() {
				var RemindUser = this.ShipTo;
				var orderno = this.OrderNo;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'AddRemindSMS',
						RemindUser: RemindUser,
						account: uni.getStorageSync('Account'),
						OrderNo: orderno,
						Types: 3
					},
					success: result => {
						uni.showToast({
							icon: 'none',
							title: result.data.Msg
						});
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			QueryWuliu() {
				var OrderNo = this.OrderNo;
				uni.navigateTo({
					url: '/pages/Order/Logistical?OrderNo=' + OrderNo
				});
			},
			BuyAgin() {
				var OrderNo = this.OrderNo;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'BuyGoodsAgin',
						OrderNo: OrderNo,
						account: uni.getStorageSync('Account'),
						gnums: 1,
					},
					success: result => {
						console.log(result.data.strSQL)
						uni.navigateTo({
							url: '/pages/cart/cart'
						});
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			ReqAftermarket() {
				var OrderNo = this.OrderNo;
				uni.navigateTo({
					url: './AfterSale?OrderNo=' + OrderNo + '&refundby='
				});
			},
			refundMoney() {
				var OrderNo = this.OrderNo;
				uni.navigateTo({
					url: './AfterSale?OrderNo=' + OrderNo + '&refundby=jtk'
				});
			},
			ConfirmReceipt() {
				var OrderNo = this.OrderNo;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/MallAdminHandler.ashx',
					data: {
						req: 'GetGoodsTrue',
						OrderNo: OrderNo,
						OItemGuid: this.DetailNo
					},
					success: result => {
						uni.showToast({
							icon: 'none',
							title: "您已确认收货"
						});
						setTimeout(function() {
							uni.navigateBack();
						}, 3000);
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.ProductId;
				uni.navigateTo({
					url: '/pages/Product/ProductDetail?gid=' + id
				});
			},
			copysome() {
				uni.setClipboardData({
					data: this.OrderNo,
					success: function() {
						console.log('success');
					}
				});
			},
			StringExpressComName(i) {
				if (i == "yt") {
					i = "圆通";
				}else if(i=="sf"){
					i = "顺丰";
				}else if(i=="zt"){
					i = "中通";
				}else if(i=="tt"){
					i = "天天";
				}else if(i=="yd"){
					i = "韵达";
				}else if(i=="bs"){
					i = "百世";
				}else if(i=="ht"){
					i = "汇通";
				}else if(i=="ems"){
					i = "邮政";
				}
				return i;
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f8f8f8;
		padding-bottom: 100upx;
		margin-bottom: 60px;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;
		border-radius: 10px;
		margin-top: -20px;

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
			font-size: 28upx;
			margin-right: 24upx;
			color: #333333;
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
		background: #fff;
		padding-bottom: 1px;
		border-radius: 14px;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 60upx;
			height: 60upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: #747474;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			margin: 20upx 30upx;
			padding-bottom: 10px;

			image {
				flex-shrink: 0;
				display: block;
				width: 100px;
				height: 100px;
				border-radius: 6px;
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
				padding-top: 10upx;

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
		border-radius: 16px;
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
				max-width: 120upx;
			}
		}

		.desc {
			flex: 1;
			font-size: 14PX;
			color: #333;
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
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
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
		display: inline-block;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: #747474;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

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


	.action-btn-group {
		float: right;
		width: 80px;
		display: flex;
		height: 60upx;
		border-radius: 100px;
		overflow: hidden;
		box-shadow: 0 20upx 40upx -16upx #747474;
		box-shadow: 1px 2px 5px #747474;
		background: red;
		margin-left: 20upx;
		position: relative;

		.action-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 180upx;
			height: 100%;
			font-size: 14px;
			padding: 0;
			border-radius: 0;
			background: transparent;
		}
	}

	.action-btn-group2 {
		float: right;
		width: 80px;
		display: flex;
		height: 60upx;
		border-radius: 100px;
		overflow: hidden;
		box-shadow: 0 20upx 40upx -16upx #747474;
		box-shadow: 1px 2px 5px #747474;
		background: white;
		margin-left: 20upx;
		position: relative;

		.action-btn2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 180upx;
			height: 100%;
			font-size: 14px;
			padding: 0;
			border-radius: 0;
			background: transparent;
			color: #333;
		}
	}
</style>
