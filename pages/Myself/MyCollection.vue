<template>
	<view class="container">
		<view class="collect-list">
			<view style="width: 96%;margin: auto;">
				<view class="item" @click="openGoods" @touchstart="touchStart" @touchend="touchEnd" v-for="(item, index) of collectList":key="item.Guid":data-index="index">
					<!-- <view class="shoptype">
						<image class="shoptitle" src="/static/dianpu.png"></image>{{item.ProductName}}<span style="color: #ddd;padding-left: 14upx;">></span>
					</view> -->
					<view style="width: 30%;">
						<image class="img" :src="item.MainIm" />
					</view>
					<view class="info">
						<view class="name">{{ item.ProductName }}</view>
						<view class="subtitle">10人已收藏</view>
						<view v-if="item.FavoriteTypes === 0">
							<view style="width: 100%;">
								<view class="price">￥{{ item.MarketPrice}}</view>
								<view style="width: 40%;float: left;line-height: 24px;vertical-align: middle;">
									<view class="btn">加入购物车</view>
								</view>
							</view>
						</view>
						<view v-else>
							<view style="width: 100%;">
								<view class="price"></view>
								<view style="width: 40%;float: left;line-height: 24px;vertical-align: middle;">
									<view class="btn" style="width: 60px;">去兑换</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="d-header"><text>队长猜你喜欢</text></view>
		<view class="goods">
			<view class="goodsinfo">
				<view class="guess-section">
					<view v-for="(item, Guid) in productList" :key="Guid" class="guess-item" @click="navToDetailPage(item)">
						<view class="image-wrapper">
							<image :src="item.ImagePath" mode="aspectFill"></image>
						</view>
						<text class="title clamp">{{item.ProductName}}</text>
						<text class="price">￥{{item.MinPrice}}<text style="float: right;font-size: 12px;" v-if="VIPType!=0">省·赚¥{{item.Para1}}</text></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
var uname;
	import {
		mapState
	} from 'vuex';
export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType']),
	data() {
		return {
			headerPosition: 'fixed',
			typeId: 0,
			collectList: [],
			 productList: []
		};
	},
	onLoad() {
		this.loadFList();
		this.getList();
	},
	methods: {
		//加载集合
		async loadFList() {
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				data: {
					req: 'QueryFavorite',
					account:uni.getStorageSync('Account')
				},
				success: result => {
					this.collectList =[];
					let goodsList = result.data.Flists;
					this.collectList = this.collectList.concat(goodsList);
					this.collectList.forEach(item => {
						var mains = item.ImagePath.split(',')[0];
						item.MainIm = 'https://www.chinaaos.com' + mains;
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
		getList() {
			this.loadingText = '加载中...';
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				method: 'GET',
				data: {
					req: 'APPBannerList',
					account: ''
				},
				success: res => {
					
					res.data.Lovely.forEach(item => {
						item.ImagePath = "https://www.chinaaos.com" + item.ImagePath;
						var p = (parseFloat(item.MinPrice) - parseFloat(item.SettlementPrice)) * 0.4;
						item.Para1 = p.toFixed(2);
					});
					this.productList = this.productList.concat(res.data.Lovely);
				},
				complete: res => {
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
			});
		},
		// 长按删除，点击进入商品详情
		async openGoods(event) {
			let goodsId = this.collectList[event.currentTarget.dataset.index].ProductId;
			// 触摸时间距离页面打开的毫秒数
			var touchTime = this.touch_end - this.touch_start;
			// console.log(touchTime);
			// 如果按下时间大于350为长按
			if (touchTime > 350) {
				var that = this;
				wx.showModal({
					title: '',
					content: '取消收藏？',
					success: async function(res) {
						// console.log('确定取消收藏', res);
						if (res.confirm) {
							//const res = await api.CollectAddOrDelete({ typeId: that.typeId, valueId: goodsId });
							if (res.errno === 0) {
								wx.showToast({
									title: '删除成功',
									icon: 'success',
									duration: 2000
								});
								that.getCollectList();
							}
						}
					}
				});
			} else {
				console.log(goodsId);
				wx.navigateTo({
					url: '/pages/Product/ProductDetail?gid=' + goodsId
				});
			}
		},
		// 按下事件开始
		touchStart(e) {
			this.touch_start = e.timeStamp;
		},
		// 按下事件结束
		touchEnd(e) {
			this.touch_end = e.timeStamp;
		},
	},
	//详情页
	navToDetailPage(item) {
		//测试数据没有写id，用title代替
		let id = item.Url;
		uni.navigateTo({
			url: '/pages/Product/ProductDetail?gid=' + id
		});
	},
	// 原生的分享功能
	onShareAppMessage: function() {
		return {
			title: 'xbyjShop',
			desc: '仿网易严选小程序商城',
			path: '/pages/ucenter/collect'
		};
	}
};
</script>

<style lang="scss">
page {
	background: #f4f4f4;
	min-height: 100%;
}

.container {
	background: #f4f4f4;
	min-height: 100%;
}

.collect-list {
	width: 100%;
	height: auto;
	overflow: hidden;
	background: #fff;
	border-top: 1px solid #e1e1e1;
}

.item {
	height: 236rpx;
	width: 100%;
	background: #fff;
	padding: 30rpx 0 30rpx 0;
	border-bottom: 1px solid #f7f7f7;
}

.item:last-child {
	border-bottom: 1px solid #fff;
}

.item .img {
	float: left;
	width: 200rpx;
	height: 200rpx;
}

.item .info {
	float: right;
	width: 66%;
	height: 200rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-left: 20rpx;
	float: left;
}

.item .info .name {
	font-size: 28rpx;
	color: #333;
	line-height: 40rpx;
	display: -webkit-box;
	min-height: 80upx;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	text-align: justify;
	overflow: hidden;
}

.item .info .subtitle {
	margin-top: 8rpx;
	font-size: 24rpx;
	color: #888;
	line-height: 40rpx;
}

.item .info .price {
	margin-top: 60rpx;
	font-size: 28rpx;
	color: #ff2741;
	line-height: 40rpx;
	width: 60%;
	float: left;
}
.shoptype {
	width: 100%;
	text-align: left;
	line-height: 80upx;
	vertical-align: middle;
	font-size: 28upx;
	color: #333;
	margin-top: -12px;
}
.shoptitle {
	width: 30upx;
	height: 30upx;
	vertical-align: middle;
	padding-right: 14upx;
}
.btn {
	font-size: 24upx;
	color: #ff2741;
	width: 78px;
	height: 24px;
	line-height: 24px;
	vertical-align: middle;
	text-align: center;
	border: 1upx solid#FF2741;
	border-radius: 25upx;
	float: right;
	margin-top: 24px;
}
.goodsinfo {
	margin: auto;
	width: 100%;
}
/* product */
.uni-product-list {
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	flex-direction: row;
	margin-top: -30px;
	padding: 0upx;
}

.uni-product {
	margin: 8px;
	display: flex;
	flex-direction: column;
	height: 295px;
	background-color: white;
	border-radius: 5px;
	padding: 0px;
}

.image-view {
	height: 330upx;
	width: 330upx;
	margin: 12upx 0;
}

.uni-product-image {
	height: 330upx;
	width: 330upx;
	border-radius: 5px;
}

.uni-product-title {
	width: 300upx;
	word-break: break-all;
	display: -webkit-box;
	overflow: hidden;
	line-height: 1.5;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	font-size: 13px;
	margin: auto;
}
.uni-product-detail {
	margin: auto;
	width: 300upx;
	word-break: break-all;
	display: -webkit-box;
	overflow: hidden;
	line-height: 1.5;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	font-size: 11px;
	color: #747474;
	margin-top: 8px;
}

.uni-product-price {
	margin-top: 10upx;
	font-size: 30upx;
	line-height: 1.5;
	position: relative;
	border-top: 1upx solid #f4f4f4;
	text-align: center;
}

.uni-product-price-original {
	padding-left: 16upx;
	font-size: 26upx;
	color: #747474;
}

.uni-product-price-favour {
	color: #ff2741;
	margin-left: 10upx;
}

.uni-product-btn {
	margin-top: 10upx;
	font-size: 30upx;
	position: relative;
	text-align: right;
	padding-right: 19rpx;
	padding-bottom: 8px;
}
.uni-product-tip {
	/* // position: absolute; */
	right: 10upx;
	background-color: #ff3333;
	color: #ffffff;
	padding: 0 10upx;
	border-radius: 5upx;
}


/* 猜你喜欢 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.guess-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
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

		.price {
			font-size: 14px;
			color: red;
			line-height: 1;
		}

		.title.clamp {
			float: left;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.d-header {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80upx;
		font-size: 14px;
		color: #747474;
		position: relative;
	
		text {
			padding: 0 20upx;
			background: #ddd;
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
</style>
