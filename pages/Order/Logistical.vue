<template>
	<view class="content">
		<view class="itemlist" v-for="(item, index) in GoodsList" :key="index">
			<view class="order-item">
				<view class="goods-box-single">
					<image class="goods-img" mode="aspectFill" :src="item.ThumbnailsUrl"></image>
					<view class="right">
						<text class="title clamp">{{item.ProductName}}</text>
						<text class="attr-box">{{ item.Para0 }}{{ item.Color }}{{item.Para1}}{{item.Size}}</text>

					</view>

				</view>
				<view style="padding-bottom: 13px;">
					<uni-steps :options="item.Para2" :active="item.Para3" direction="column" />
				</view>
			</view>
			<!-- <view style="margin:0 24upx;padding-bottom: 13px;">
				<uni-steps :options="list2" :active="active" direction="column" />
			</view> -->
		</view>
	</view>
</template>

<script>
	var Account;
	var Uguid;
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
		components: {
			uniSteps
		},
		data() {
			return {
				OrderNo: "",
				GoodsList: [],
				active: 0,
				list2: []
			}
		},
		onLoad(options) {
			this.OrderNo = options.OrderNo;
			// this.com = options.com;
			// this.ddno = options.ddno;
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
								this.Logistacal(item.ExpressCompanyNames, item.ShipOrderNumbers).then((res) => {
									item.Para2 = res;
									item.Para3 = res.length;
								})
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
			Logistacal(e, s) {
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'https://www.chinaaos.com/Handler/WLHandler.ashx',
						data: {
							com: e, //this.com,
							ddno: s, //this.ddno
						},
						success: res => {
							this.list2 = res.data.result.list;
							resolve(res.data.result.list);
						},
						fail: e => {
							console.log(e);
							uni.showToast({
								icon: 'none',
								title: e.errMsg
							});
						}
					});


				})



			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F9F9F9;
	}

	.itemlist {
		background-color: white;
	}



	.content {
		height: 100%;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding: 0px 16px 0px 16px;
		background: #fff;
		margin-top: 24upx;

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
				font-size: 18px;
				color: black;
				line-height: 2;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.attr-box {
				font-size: 14px;
				color: #747474;
				padding: 10upx 0upx;
			}

			.price {
				font-size: 15px;
				color: black;

				&:before {
					// content: '￥';
					font-size: 14px;
					margin: 0 2upx 0 8upx;
				}
			}
		}
	}

	.uni-steps-items.uni-steps-column .uni-steps-item-title {
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
		white-space: pre-wrap !important;
		overflow: hidden;

	}
</style>
