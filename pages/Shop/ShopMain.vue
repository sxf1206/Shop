<template>
	<view>
		<!-- 店铺 -->
		<view class="eva-section" style="height: 72px;position: fixed;width: 100%;z-index: 999;background-color: #fff;">
			<view class="e-header">
				<image :src="dianpuTX" style="width: 55px;height: 55px;border-radius: 4px;margin: 10px 0 0 10px;"></image>
				<text style="padding-left: 16px;color: #333333;position: absolute;top: 25px;">{{dianpuMC}}</text>
				<text style="position: fixed;right: 5%;padding-top: 28px;">
					<!-- ><image src="/static/youjiantou.png" style="width: 26px;height: 26px;padding-top: 32px;"></image> -->
				</text>
			</view>
		</view>

		<view class="eva-section" id="tab">
			<view class="uni-flex uni-row">
				<view class="flex-item" :style="{color:color1,background:backcolor1}" @click="getGoodsByShop">商品服务</view>
				<view class="flex-item" :style="{color:color2,background:backcolor2}" @click="getShop">商家介绍</view>
			</view>
		</view>



		<view class="contentInfo" style="">
			<view :style="{display:displayone}">
				<view class="goods-list">
					<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
						<view class="image-wrapper">
							<image :src="item.MainIm" mode="aspectFill"></image>
						</view>
						<text class="title clamp">{{ item.ProductName }}</text>
						<view class="price-box">
							<text class="price" style="color: red;" >{{ item.SalePrice }}</text>
							<!-- <text>已售 {{item.SaleCounts}}</text> -->
							<text style="color: red;" v-if="VIPType!=0">
								省·赚¥{{item.Para1}}
							</text>
						</view>
					</view>
				</view>
				<uni-load-more :status="loadingType"></uni-load-more>
			</view>

			<view :style="{display:displaytwo}">
				<view style="margin-left: 14px;margin-right: 14px;">
					<view><text>商家描述：</text></view>
					<view><text style="color: #747474;"> &nbsp;&nbsp;&nbsp;&nbsp;{{ shopremark }}</text></view>
					<view v-if="imgList.length < 1">

					</view>
					<view style="margin-top: 16px;"><text>商家图片：</text></view>
					<view class="carousel">
						<scroll-view scroll-x>
							<view class="scoll-wrapper">
								<view v-for="(item, index) in imgList" :key="index" class="floor-item">
									<image :src="item.src" mode="aspectFill"></image>
								</view>
							</view>
						</scroll-view>

					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	var Account;
	var Uguid;
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			uniLoadMore
		},
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo','VIPType']),
		data() {
			return {
				dianpuTX: "../../static/touxiang.png",
				dianpuMC: "",
				shopGuids: "",
				loadingType: 'more',
				displayone: "block",
				displaytwo: "none",
				displaythree: "none",
				color1: "#F76260",
				backcolor1: "#f4f4ef",
				color2: "",
				backcolor2: "#fff",
				color3: "",
				backcolor3: "#fff",
				shopremark: "",
				imgList: [],
				goodsList: [],
				pagecount: 0,
				page: 1
			};
		},
		onLoad(option) {
			// #ifdef MP
			//小程序隐藏返回按钮
			this.showBack = false;
			// #endif
			this.shopGuids = option.guids;
			this.QueryShopInfo();
			this.goodsList = [];
			this.getGoodsByShop();
		},
		onPullDownRefresh: function() {
			// 重置分页及数据
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
			this.QueryShopInfo();
			this.page=1;
			this.goodsList = [];
			this.getGoodsByShop();
		},
		// 加载更多
		onReachBottom: function() {
			if(this.pagecount<=this.goodsList.length){
			    this.loadingType="noMore";
			 	return;
			 }	
			 this.loadingType="More";			
			this.getGoodsByShop();
		},
		methods: {
			//下拉刷新
			
			QueryShopInfo() {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QuerySomeOneShop',
						sgid: this.shopGuids
					},
					success: result => {
						if (result.data.ResultType) {
							this.imgList = [];
							if (result.data.ShopInfo[0].Logo == null) {
								this.dianpuTX = "https://www.chinaaos.com/Images/jx128128.png";
							} else {
								this.dianpuTX = "https://www.chinaaos.com" + result.data.ShopInfo[0].Logo;
							}

							this.dianpuMC = result.data.ShopInfo[0].ShopName;
							this.shopremark = result.data.ShopInfo[0].ShopMarks;
							var MainImlist = result.data.ShopInfo[0].ShopPicture;
							if (MainImlist == null) {
								MainImlist = "";
							} else {
								var mains = MainImlist.split(',');
								mains.forEach(item => {
									if (item != "") {
										var ll = {
											src: "https://www.chinaaos.com" + item
										};
										this.imgList.push(ll);
									}
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
			},
			getGoodsByShop() {
				this.displayone = "block";
				this.displaytwo = "none";
				this.displaythree = "none";
				this.color1 = "#F76260";
				this.backcolor1 = "#f4f4ef";
				this.color2 = "";
				this.backcolor2 = "#fff";
				this.color3 = "";
				this.backcolor3 = "#fff";
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QueryGoodsByShop',
						sgid: this.shopGuids,
						page:this.page
					},
					success: result => {
						if (result.data.ResultType) {
							this.pagecount=result.data.ShopGoodListCount;
							this.goodsList = result.data.ShopGoodList;
							if (this.goodsList.length < 0) {
								this.loadingType = "该商家没有更多商品";
							} else {
								this.goodsList.forEach(item => {
									var mains = "";
									if (item.ImagePath.split(',').length < 0) {
										mains = "";
									} else {
										mains = item.ImagePath.split(',')[0];
									}
									item.MainIm = 'https://www.chinaaos.com' + mains;
									item.Para1 =((parseFloat(item.SalePrice) - parseFloat(item.SetTlementPrice))*0.4).toFixed(2);
								});
								this.page++;
							}
						}
					},
					complete: res => {
						if(this.goodsList.length<this.pagecount){
							this.loadingType="more";
							return
						}
					     this.loadingType="noMore";
					},				
					fail: e => {
						this.loadingType="loading";
					}
				});
			},
			getShop() {
				this.displayone = "none";
				this.displaytwo = "block";
				this.displaythree = "none";
				this.color1 = "";
				this.backcolor1 = "#fff";
				this.color2 = "#F76260";
				this.backcolor2 = "#f4f4ef";
				this.color3 = "";
				this.backcolor3 = "#fff";
			},
			getShopGrass() {
				this.displayone = "none";
				this.displaytwo = "none";
				this.displaythree = "block";
				this.color1 = "";
				this.backcolor1 = "#fff";
				this.color2 = "";
				this.backcolor2 = "#fff";
				this.color3 = "F76260";
				this.backcolor3 = "#f4f4ef";
			},
			//商品详情
			navToDetailPage(item) {
				let id = item.Guid;
				console.log(id)
				uni.navigateTo({
					url: '/pages/Product/ProductDetail?gid=' + id
				});
			},
			// GoShopDetail(){
			// 	console.log(this.shopGuids);
			// 	uni.navigateTo({
			// 		url: '/pages/Shop/ShopDetail?sid=' + this.shopGuids
			// 	});
			// }

		},
	};
</script>

<style lang="scss">
	.scoll-wrapper {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: start;
		-webkit-align-items: flex-start;
		-ms-flex-align: start;
		align-items: flex-start;
		height: 160px;
	}

	.floor-item {
		width: 160px;
		margin-right: 20upx;
		color: #747474;
		line-height: 1.8;
		height: 160px;
		float: left;

		image {
			height: 160px;
			width: 160px;
			border-radius: 3px;
			display: inline-block;
			overflow: hidden;
			position: relative;
		}
	}

	.carousel {
		height: 160px !important;
		width: 100%
	}

	page {
		background-color: #f8f8f8;
		padding-bottom: 160upx;
	}

	.flex-item {
		width: 50%;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;

	}

	.contentInfo {
		// margin-left: 4px;
		// margin-right: 4px;
		padding-top: 138px;
		background-color: #f8f8f8;
		z-index: 9;
	}


	@font-face {
		font-family: 'HMfont-home';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}



	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
		background-color: #fff;
	}

	.header {
		width: 100%;
		background-color: initial;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);

		/*  #endif  */
		.before,
		.after {
			width: 92%;
			padding: 0 4%;
			height: 100upx;
			display: flex;
			align-items: center;
			position: fixed;
			top: 0;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);
			/*  #endif  */

			.back {
				width: 125upx;
				height: 60upx;
				flex-shrink: 0;

				.icon {
					margin-left: -10%;
					width: 60upx;
					height: 60upx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 42upx;
				}
			}

			.middle {
				width: 100%;
			}

			.icon-btn {
				width: 125upx;
				height: 60upx;
				flex-shrink: 0;
				display: flex;

				.icon {
					&:first-child {
						margin-right: 5upx;
					}

					width: 60upx;
					height: 60upx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 42upx;
				}
			}
		}

		.before {
			.back {
				.icon {
					color: #fff;
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 100%;
				}
			}

			.icon-btn {
				.icon {
					color: #fff;
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 100%;
				}
			}
		}

		.after {
			background-color: #fff;

			.back {
				.icon {
					color: #666;
				}
			}

			.icon-btn {
				.icon {
					color: #666;
				}
			}

			.middle {
				font-size: 32upx;
				height: 90upx;
				display: flex;
				justify-content: center;
				align-items: center;

				view {
					padding: 0 3%;
					margin: 0 3%;
					display: flex;
					justify-content: center;
					align-items: center;

					&.on {
						margin-bottom: -4upx;
						color: #f47952;
						border-bottom: solid 4upx #e4e7ed;
					}
				}
			}
		}
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}


	#tab {
		height: 30px;
		border-top: 1px solid #f4f4ef;
		padding: 0;
		position: fixed;
		top: 115px;
		/*  #ifdef  APP-PLUS  */
		top: 74px;
		/*  #endif  */
		/*  #ifdef  MP-WEIXIN  */
		top: 72px;
		/*  #endif  */
		width: 100%;
		z-index: 999;

	}



	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		// background: #fff;

		.goods-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n + 1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: 14px;
			color: #747474;
			line-height: 80upx;
		}

		.clamp {
			overflow: hidden;
			-o-text-overflow: ellipsis;
			text-overflow: ellipsis;
			white-space: nowrap;
			display: block;
		}

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: #747474;
		}

		.price {
			font-size: 14px;
			color: red;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}
	}
</style>
