<template>
	<view class="content">
			<view class="navbar">
				<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }"
				 @click="tabClick(index)">{{ item.text }}</view>
			</view>
			<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
				<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
					<scroll-view class="list-scroll-content" scroll-y>
						<!-- 空白页 -->
						<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>

						<!-- 订单列表 -->
						<view v-for="(item, index) in tabItem.orderList" :key="index" class="order-item">
							
							<!-- <navigator  url="/pages/Order/OrderDetail?OrderNo=item.OrderNo"> -->
							<view class="i-top b-b">
								<text class="time">{{ item.CreateTime }}</text>
								<text class="state" :style="{ color: item.stateTipColor }">{{ item.stateTip }}</text>
								<view v-if="item.OrderStatus === 4 || item.OrderStatus===5" class="del-btn" @click="deleteOrder(index,item)">
									<img src="/static/sc.png" style="vertical-align: sub;width: 20px;height: 20px;" />
								</view>
							</view>

							<scroll-view v-if="item.ChildFolder.length > 1" class="goods-box" scroll-x>
								<view v-for="(goodsItem, goodsIndex) in item.ChildFolder" :key="goodsIndex" class="goods-item">
									<image class="goods-img" :src="goodsItem.ThumbnailsUrl" mode="aspectFill" @click="changePage(item,goodsItem)"></image>
								</view>
							</scroll-view>
							<view v-if="item.ChildFolder.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.ChildFolder"
							 :key="goodsIndex"  @click="changePage(item,goodsItem)">
								<image class="goods-img" :src="goodsItem.ThumbnailsUrl" mode="aspectFill"></image>
								<view class="right">
									<text class="title clamp">{{ goodsItem.ProductName }}</text>
									<text class="attr-box">{{ goodsItem.Para0 }}{{ goodsItem.Color }}{{goodsItem.Para1}}{{goodsItem.Size}}&nbsp; x{{ goodsItem.Quantity }}</text>
									<text class="price">{{ goodsItem.SalePrice }}</text>
								</view>
							</view>

							<view class="price-box">
								共
								<text class="num">{{item.ChildFolder.length}}</text>
								件商品
								<text class="" v-if="VIPType!=0" style="color: red;">省·赚 ¥{{item.SumSavemoney}}</text>
								实付款
								<text class="price">{{ item.ProductTotalAmount }}</text>
							</view>
							<!-- </navigator> -->
							
							<view class="action-box b-t" v-if="item.OrderStatus == 0">
								<button class="action-btn" @click="deleteOrder(index,item)">取消订单</button>
								<button class="action-btn recom" @click="payNow(item)">立即支付</button>
							</view>
							<view class="action-box b-t" v-if="item.OrderStatus == 3">
								<button class="action-btn" @click="refundMoney(item)">退款</button>
								<button class="action-btn" @click="RemindSMS(item)">提醒发货</button>
							</view>
							<view class="action-box b-t" v-if="item.OrderStatus == 1">
								<button class="action-btn" @click="BuyAgin(item)">再次购买</button>
								<button class="action-btn" @click="QueryWuliu(item)">查看物流</button>
								<button class="action-btn" @click="ConfirmReceipt(index,item)">确认收货</button>
							</view>
							<!-- <view class="action-box b-t" v-if="item.OrderStatus == 2">
							<button class="action-btn" @click="EvalOrder(item)">评价</button>
							<block v-if="VIPType!=0">
								<button class="action-btn" @click="WriteOrderDiary(item)">写日记</button>
							</block>
						</view> -->
							<view class="action-box b-t" v-if="item.OrderStatus == 4">
								<block v-if="item.Para6 >=7">
									<button class="action-btn" @click="WriteOrderDiary(item)">写日记</button>
								</block>
								<block v-if="item.Para6 < 7">
									<button class="action-btn" @click="WriteOrderDiary(item)">写日记</button>
									<button class="action-btn" @click="ReqAftermarket(item)">申请售后</button>
								</block>
							</view>
							<view class="action-box b-t" v-if="item.OrderStatus == 5">
								<text>已完成</text>								
							</view>
						</view>

						<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>

	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from '@/components/empty';
	// import Json from '@/Json';
	
	var Uguid;
	import {
		mapState
	} from 'vuex'
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType']),
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [{
						state: 5,
						text: '全部',
						loadingType: 'loading',
						pagecount: 0,
						page: 1,
						orderList: []
					},
					{
						state: 0,
						text: '待付款',
						loadingType: 'loading',
						pagecount: 0,
						page: 1,
						orderList: []
					},
					{
						state: 3,
						text: '待发货',
						loadingType: 'loading',
						pagecount: 0,
						page: 1,
						orderList: []
					},
					{
						state: 1,
						text: '待收货',
						loadingType: 'loading',
						pagecount: 0,
						page: 1,
						orderList: []
					},
					// {
					// 	state: 2,
					// 	text: '待评价',
					// 	loadingType: 'more',
					// 	orderList: []
					// },
					{
						state: 4,
						text: '售后',
						loadingType: 'loading',
						pagecount: 0,
						page: 1,
						orderList: []
					}
				]
			};
		},
		onLoad(options) {
			this.navList.forEach((tabBar) => {
				tabBar.orderList=[];
			});
			if(options.state){
				this.tabCurrentIndex =options.state;
			 }			
			this.loadData(this.tabCurrentIndex);			
		},
		//下拉刷新
		onPullDownRefresh: function() {
			// 重置分页及数据
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
			let navItem = this.navList[this.tabCurrentIndex];
			if(navItem.pagecount<=navItem.orderList.length){
				navItem.loadingType="noMore";
				return;
			}	
			navItem.loadingType="More";
			this.loadData(this.tabCurrentIndex);
		},
		methods: {
			//获取订单列表
			loadData(index) {				
				let navItem = this.navList[index];
				uni.request({
						url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
						data: {
							req: 'QueryOrderList',
							account: this.Account,
							OrderStatus: navItem.state,
							page:navItem.page
						},
						success: result => {							
							if(result.data.OrderList.length>0){
								 navItem.pagecount=result.data.OrderListCount;
								 let list = result.data.OrderList;
								 let orderList = "";
								 orderList = result.data.OrderList.filter(item => {
								 	item = Object.assign(item, this.orderStateExp(item.OrderStatus));
								 	if (navItem.state === 5) {
								 		return item;
								 	}
								 	return item.OrderStatus === navItem.state;
								 });
								 orderList.forEach(item => {
								 	if (item.SumSavemoney == "" || item.SumSavemoney == null) {
								 		item.SumSavemoney = 0;
								 	}
								 	item.SumSavemoney = parseFloat(item.SumSavemoney).toFixed(2);
								 	item.ProductTotalAmount = parseFloat(item.ProductTotalAmount).toFixed(2);
								 	item.CreateTime = item.CreateTime.split("T")[0] + " " + item.CreateTime.split("T")[1].split(".")[0];
								 	if (item.UpdateTime != "" && item.UpdateTime != null) {
								 				
								 		item.Para6 = this.judgeTime(item.UpdateTime.replace(/-|T|:/g, ''));
								 	} else {
								 		item.Para6 = 0;
								 	}
								 	item.ChildFolder.forEach(item2 => {
								 		var mainsImg = item2.ThumbnailsUrl.split(',')[0];
								 		item2.ThumbnailsUrl = 'https://www.chinaaos.com' + mainsImg;
								 		var Guige = item2.SKU.split(';');
								 		if (Guige.length > 2 && item2.Color != "" && item2.Size != "") {
								 			item2.Para0 = Guige[0] + ":";
								 			item2.Color = item2.Color + ";";
								 			item2.Para1 = Guige[1] + ":";
								 			item2.Size = item2.Size + ";";
								 		} else if (Guige.length == 2 && item2.Color != "") {
								 			item2.Para0 = Guige[0] + ":";
								 			item2.Color = item2.Color + ";";
								 			item2.Para1 = "";
								 			item2.Size = "";
								 		} else {
								 			item2.Para0 = "";
								 			item2.Color = "";
								 			item2.Para1 = "";
								 			item2.Size = "";
								 		}
								 	});
								 	navItem.orderList.push(item);
								 });
								 navItem.page++;
							}
							
						
						},
						fail: (err) => {
							navItem.loadingType = "loading";
						},
						complete: (e) => {
							if(navItem.orderList.length<navItem.pagecount){
								navItem.loadingType="more";
								return
							}
							 navItem.loadingType="noMore";
						}
					});
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
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				let navItem = this.navList[e.target.current];
				navItem.page=1;
				navItem.pagecount=0;
				navItem.orderList=[];
				navItem.loadingType="loading";
				this.loadData(e.target.current);
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(index, tal) {
				uni.showLoading({
					title: '请稍后'
				});
				var guidss = tal.Guid;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'DeteleOrder',
						account: uni.getStorageSync('Account'),
						Guidss: guidss
					},
					success: result => {
						console.log("yes");
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
			//取消订单
			cancelOrder(index, item) {
				uni.showLoading({
					title: '请稍后'
				});
				setTimeout(() => {
					let {
						stateTip,
						stateTipColor
					} = this.orderStateExp(4);
					item = Object.assign(item, {
						state: 4,
						stateTip,
						stateTipColor
					});
					var guidss = item.Guid;
					uni.request({
						url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
						data: {
							req: 'CanlceOrder',
							account: uni.getStorageSync('Account'),
							Guidss: guidss
						},
						success: result => {
							console.log("yes");
							this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
							uni.hideLoading();
						},
						fail: e => {
							uni.showToast({
								icon: 'none',
								title: e.errMsg
							});
						}
					});
					uni.hideLoading();
				}, 600);
			},

			//订单状态文字和颜色
			orderStateExp(state) {
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch (+state) {
					case 0:
						stateTip = '待付款';
						break;
					case 3:
						stateTip = '待发货';
						break;
					case 1:
						stateTip = '待收货';
						break;
					case 4:
						stateTip = '已完成';
						stateTipColor = '#909399';
						break;
						// case 5:
						// 	stateTip = '已完成';
						// 	stateTipColor = '#909399';
						// 	break;

						//更多自定义
				}
				return {
					stateTip,
					stateTipColor
				};
			},
			payNow(item) {
				var OrderNo = item.OrderNo;
				uni.navigateTo({
					url: '/pages/Order/OrderSettlement?OrderNo=' + OrderNo
				});
			},
			WriteOrderDiary(item) {
				var OrderNo = item.OrderNo;
				console.log("写日记单号：" + OrderNo);
				uni.navigateTo({
					url: '/pages/AddDiary/AddDiary?OrderNo=' + OrderNo
				});
			},
			// EvalOrder(item) {
			// 	var OrderNo = item.OrderNo;
			// 	uni.navigateTo({
			// 		url: '/pages/Order/EvaluationOrder?OrderNo=' + OrderNo
			// 	});
			// },
			RemindSMS(item) {
				var RemindUser = item.UserName;
				var orderno = item.OrderNo;
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
			QueryWuliu(item) {
				var OrderNo = item.OrderNo;
				// var com = item.ExpressCompanyName;
				// var ddno = item.ShipOrderNumber;
				uni.navigateTo({
					url: '/pages/Order/Logistical?OrderNo=' + OrderNo 
				});
			},
			BuyAgin(item) {
				var OrderNo = item.OrderNo;
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
			ReqAftermarket(item) {
				var OrderNo = item.OrderNo;
				uni.navigateTo({
					url: './AfterSale?OrderNo=' + OrderNo + '&refundby='
				});
			},
			refundMoney(item) {
				var OrderNo = item.OrderNo;
				uni.navigateTo({
					url: './AfterSale?OrderNo=' + OrderNo + '&refundby=jtk'
				});
			},
			ConfirmReceipt(index, item) {
				var OrderNo = item.OrderNo;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'ConfirmReceipt',
						OrderNo: OrderNo,
					},
					success: result => {
						 //console.log(result.data.strSQL)
						uni.showToast({
							icon: 'none',
							title: "您已确认收货"
						});
						this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
						uni.hideLoading();
						
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			changePage(item,Ditem){
				var OrderNo = item.OrderNo;
				var DetailNo = Ditem.Guid;
				uni.navigateTo({
					url: '/pages/Order/OrderDetail?OrderNo=' + OrderNo+'&DetailNo='+DetailNo
				});
			}

		}
	};
</script>

<style lang="scss">
	page,
	.content {
		background: #fafafa;
		height: 100%;
	}
	.navigator-hover{
		background-color:initial;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: black;
			position: relative;

			&.current {
				color: red;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid red;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;

		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: 14px;
			color: #747474;
			position: relative;

			.time {
				flex: 1;
			}

			.state {
				color: #747474;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: 14px;
				color: #747474;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid #ddd;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		/* 多条商品 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			border-top: 1px solid whitesmoke;

			.goods-item {
				width: 160upx;
				height: 160upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
				border-radius: 8upx;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;

			.goods-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-size: 15px;
					color: black;
					line-height: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.attr-box {
					font-size: 14px;
					color: #747474;
					padding: 10upx 12upx;
				}

				.price {
					font-size: 15px;
					color: black;

					&:before {
						content: '￥';
						font-size: 14px;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: 15px;
			color: #747474;
			border-bottom: 1px solid whitesmoke;

			.num {
				margin: 0 8upx;
				color: black;
			}

			.price {
				font-size: 15px;
				color: black;

				&:before {
					content: '￥';
					font-size: 15px;
					margin: 0 2upx 0 8upx;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}

		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: 13px;
			color: black;
			background: #fff;
			border-radius: 100px;

			&:after {
				border-radius: 100px;
			}

			&.recom {
				background: #fff9f9;
				color: red;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}

	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center;
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999;
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px;
	}

	.uni-load-more__img>view {
		position: absolute;
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: 0.2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite;
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px;
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0;
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px;
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0;
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px;
	}

	.load2 {
		transform: rotate(30deg);
	}

	.load3 {
		transform: rotate(60deg);
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s;
	}

	.load2 view:nth-child(1) {
		animation-delay: 0.13s;
	}

	.load3 view:nth-child(1) {
		animation-delay: 0.26s;
	}

	.load1 view:nth-child(2) {
		animation-delay: 0.39s;
	}

	.load2 view:nth-child(2) {
		animation-delay: 0.52s;
	}

	.load3 view:nth-child(2) {
		animation-delay: 0.65s;
	}

	.load1 view:nth-child(3) {
		animation-delay: 0.78s;
	}

	.load2 view:nth-child(3) {
		animation-delay: 0.91s;
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s;
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s;
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s;
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s;
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0.2;
		}
	}
</style>
