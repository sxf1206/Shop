<template>
	<view>
		<view v-for="(item, index) in GoodsList" :key="index" style="margin-bottom: 48px;">
			<!-- 商品信息 -->
			<view class="g-item">
				<image :src="item.ThumbnailsUrl"></image>
				<view class="right">
					<view style="display: -webkit-box;overflow:hidden;text-overflow: elipsis;word-break: break-all;-webkit-box-orient:vertical;-webkit-line-clamp: 2">
						<text class="title clamp">{{item.ProductName}}</text>
					</view>
					<view>
						<text class="spec">{{ item.Para0 }}{{ item.Color }}{{item.Para1}}{{item.Size}}</text>
					</view>
					<view class="price-box">
						<text class="price">￥{{item.SalePrice}}</text>
						<text class="price" style="color: red;padding-left:12px" v-if="VIPType!=0">省/赚￥{{item.Para2}}</text>
						<text class="number" @input="sum($event,index)">x {{item.Quantity}}</text>
					</view>
				</view>
			</view>

			<!-- 退货状态-->
			<view v-if="item.BackStatus==1">
				<view v-if="item.BackStatus==1" class="d-header"><text>商家正在处理</text></view>
				
				<view v-if="item.ReturnType==0" style="width: 100%;margin-top: 12px;">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate uni-navigate-right uni-media-list ">
							物流公司
							<view class="uni-list-cell-right" style="text-align: right;">
								<picker :range="theme" @change="themeTypeChange" :value="themeTypeIndex" mode="selector">
									<view class="uni-input">{{ theme[themeTypeIndex] }}</view>
								</picker>
							</view>
						</view>
					</view>
					<view class="row b-b">
						<text class="tit">物流单号</text>
						<input class="input" type="text" v-model="LogisticsNo" placeholder="请输入物流单号" placeholder-class="placeholder" />
					</view>
					<button class="add-btn" @click="confirm(item)" v-if="item.LogisticsNo=='' || item.LogisticsNo==null ">提交</button>
				</view>
			</view>

			<view v-if="item.BackStatus==2 && item.ReturnType==0 " class="d-header"><text>商品退货退款成功</text></view>

			<view v-if="item.BackStatus==2 && (item.ReturnType==1 ||  item.ReturnType==3) " class="d-header"><text>退款成功</text></view>

			<view v-if="item.BackStatus==2 && item.ReturnType==2 " class="d-header"><text>补寄中,详情请联系客服！</text></view>

			<view v-if="item.BackStatus==4" class="d-header"><text>不符合退货/退款、补寄要求，商家拒绝退货/退款/补寄！</text></view>

			<!-- 退货原因-->
			<view class="ordersture" v-if="item.BackStatus==0">
				<view class="boxtwo" :style="{height:boxtwoheight}">
					<view class="contentInfo">

						<view class="yt-list" v-if="refundby==''">

							<block v-if="item.IsGiftPack=='1'">
								<view class="yt-list-cell b-b" style="border-top: 1px solid #ddd;">
									<view class="cell-tit clamp">
										<view style="color: #333333;">礼包产品</view>
										<view style="font-size: 12px;">不支持退款！</view>
									</view>
									<text class="cell-tip active"></text>
								</view>
							</block>
							<block v-else>
								<view class="yt-list-cell b-b" @click="ChangeInfo(item,'0')">
									<view class="cell-tit clamp">
										<view style="color: #333333;font-size: 16px;">退货退款</view>
										<view style="font-size: 12px;">已收到货，需退还已收到的货物</view>
									</view>
									<text class="cell-tip active">></text>
								</view>

								<view class="yt-list-cell b-b" @click="ChangeInfo(item,'1')" style="border-top: 1px solid #ddd;">
									<view class="cell-tit clamp">
										<view style="color: #333333;">仅退款</view>
										<view style="font-size: 12px;">包含商品少发、拒收、物流异常、生鲜、质量问题</view>
									</view>
									<text class="cell-tip active">></text>
								</view>

							</block>

							<view class="yt-list-cell b-b" @click="ChangeInfo(item,'2')" style="border-top: 1px solid #ddd;">
								<view class="cell-tit clamp">
									<view style="color: #333333;">补寄</view>
									<view style="font-size: 12px;">包含商品少发、物流异常、需要补寄</view>
								</view>
								<text class="cell-tip active">></text>
							</view>
						</view>

						<view class="yt-list" v-if="refundby=='jtk'">
							<block v-if="item.IsGiftPack=='1'">
								<view class="yt-list-cell b-b" style="border-top: 1px solid #ddd;">
									<view class="cell-tit clamp">
										<view style="color: #333333;">礼包产品</view>
										<view style="font-size: 12px;">不支持退款！</view>
									</view>
									<text class="cell-tip active"></text>
								</view>
							</block>
							<block v-else>
								<view class="yt-list-cell b-b" @click="ChangeInfo(item,'3')" style="border-top: 1px solid #ddd;">
									<view class="cell-tit clamp">
										<view style="color: #333333;">仅退款</view>
										<view style="font-size: 12px;">包含商品少发、拒收、物流异常、生鲜、质量问题</view>
									</view>
									<text class="cell-tip active">></text>
								</view>

							</block>


						</view>

					</view>
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
				GoodsList: [],
				OrderNo: "",
				GoodsNo: "",
				OrderGuid: "",
				refundby: "",
				boxtwoheight: "48vw",
				LogisticsNo: "",
				theme: ['顺丰', '圆通', '申通', '中通','天天','韵达','百世','汇通','邮政'],
				themeTypeIndex: 0,
			}
		},
		onLoad(options) {
			this.refundby = options.refundby;
			this.OrderNo = options.OrderNo;
			if (this.refundby == "jtk") {
				this.boxtwoheight = "17vw";
			}
			console.log(this.OrderNo);
			this.init();
		},
		methods: {
			init() {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QueryGoodsByOrder',
						OrderNo: this.OrderNo
					},
					success: result => {
						if (result.data.ResultType) {
							this.GoodsNo = result.data.GoodsList[0].ProductId;
							console.log(result.data.GoodsList[0].ProductId);
							this.OrderGuid = result.data.GoodsList[0].Guid;
							this.GoodsList = result.data.GoodsList;
							this.GoodsList.forEach(item => {
								var mainsImg = item.ThumbnailsUrl.split(',')[0];
								item.ThumbnailsUrl = 'https://www.chinaaos.com' + mainsImg;
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
								item.Para2 = ((parseFloat(item.SalePrice) - parseFloat(item.CostPrice)) * 0.4).toFixed(2);
							})
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
							this.savemoney = parseFloat(this.savemoney) + this.OrderList[i].Para2;
						} else {
							this.sumPrice = this.sumPrice + (this.OrderList[i].GoodsCounts * this.OrderList[i].SalePrice);
							this.savemoney = parseFloat(this.savemoney) + this.OrderList[i].Para2;
						}
					}
				}
				console.log(this.savemoney);
				this.sumPrice = this.sumPrice - this.savemoney.toFixed(2);
			},
			ChangeInfo(item, types) {
				if (types == "0") {
					uni.navigateTo({
						url: './ReturnRefund?OrderGuid=' + item.Guid + '&OrderNo=' + this.OrderNo + '&types=' + types
					});
				} else if (types == "1") {
					uni.navigateTo({
						url: './Refund?OrderGuid=' + item.Guid + '&OrderNo=' + this.OrderNo + '&types=' + types
					});
				} else if (types == "2") {
					uni.navigateTo({
						url: './SupplementaryMail?OrderGuid=' + item.Guid + '&OrderNo=' + this.OrderNo + '&types=' + types
					});
				} else if (types == "3") {
					uni.navigateTo({
						url: './Refund?OrderGuid=' + item.Guid + '&OrderNo=' + this.OrderNo + '&types=' + types
					});
				}
			},
			themeTypeChange: function(e) {
				this.themeTypeIndex = e.target.value;
			},
			confirm(item){
				var oid=item.oid;
				var rid=item.rid;
				var LogisticsCom="";
				if(this.LogisticsNo=="" ||　this.LogisticsNo== null){
					uni.showToast({
						icon: 'none',
						title: "物流单号不能为空"
					});
					return
				}
				if(this.themeTypeIndex=="0"){
					LogisticsCom="顺丰";
				}else if(this.themeTypeIndex=="1"){
					LogisticsCom="圆通";
				}else if(this.themeTypeIndex=="2"){
					LogisticsCom="申通";
				}else if(this.themeTypeIndex=="3"){
					LogisticsCom="中通";
				}else if(this.themeTypeIndex=="4"){
					LogisticsCom="天天";
				}else if(this.themeTypeIndex=="5"){
					LogisticsCom="韵达";
				}else if(this.themeTypeIndex=="6"){
					LogisticsCom="百世";
				}else if(this.themeTypeIndex=="7"){
					LogisticsCom="汇通";
				}else if(this.themeTypeIndex=="8"){
					LogisticsCom="邮政";
				}
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'UpdateReturnInfo',
						LogisticsCom: LogisticsCom,
						LogisticsNo: this.LogisticsNo,
						OrderNo:this.OrderNo,
						oid: oid,
						rid: rid,
					},
					success: result => {
						debugger
						if(result.data.ResultType){
							uni.showToast({
								icon: 'none',
								title: "提交成功"
							});
							this.init();
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
</script>

<style lang="scss">
	.g-item {
		display: flex;
		margin: 20upx 30upx;

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

	.yt-list {
		margin-top: 16upx;
		background: #fff;
		margin-bottom: 50px;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 10upx 10upx 10upx;
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
			font-size: 14PX;
			color: #747474;
		}
	}


	.ordersture {
		border: 0px;
		padding: 0 20upx;
		margin: auto;
		padding-top: 10px;

		.boxtwo {
			width: 98%;
			padding: 0 1%;
			height: 48vw;
			background-color: white;
			border-radius: 24upx;
			box-shadow: 0 0 20upx rgba(0, 0, 0, 0.15);
			align-items: center;
			justify-content: center;

			.contentInfo {
				width: 94%;
				margin: auto;
			}
		}
	}

	.d-header {
		display: flex;
		justify-content: center;
		text-align: center;
		align-items: center;
		height: 80upx;
		font-size: 14px;
		color: #747474;
		position: relative;

		text {
			padding: 0 20upx;
			background: #fff;
			position: relative;
			z-index: 1;
		}

		&:after {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translateX(-50%);
			width: 300upx;
			height: 0;
			content: '';
			border-bottom: 1px solid #ccc;
		}
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 90upx;
		background: #fff;
		border-top-color:1px solid #F4F4F4;

		.tit {
			flex-shrink: 0;
			width: 146upx;
			font-size: 30upx;
			color: #333;
		}

		.input {
			height: 90upx;
			flex: 1;
			font-size: 30upx;
			color: #333;
			background-color: #f8f8f8;
			padding-left: 12px;
		}
	}
	.uni-list-cell::after {
		height: 0px;
	}
	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: 14px;
		color: #fff;
		background-color: red;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
