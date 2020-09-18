<template>
	<view style="background: #F4F4F4;">
		<view class="header">
			<view class="input-box">
				<input placeholder="默认关键字" placeholder-style="color:#c0c0c0;" @tap="toSearch(this)" @input="onKeyInput"/>
				<view class="icon search"></view>
			</view>
			<view class="icon-btn">
				<view class="setting">
					<image src="https://www.chinaaos.com/static/msg.png" @tap="readMsg()"></image>
				</view>
			</view>
		</view>
		<view style="padding-top: 44px;">
			<view class="order-item" v-for="(item, index) of SList" :key="item.Guid" :data-index="index" @click="GoShop(item.Guid)" v-if="item.ChildFolder.length>0">
				<view class="goods-box-single">
					<image class="goods-img" mode="aspectFill" :src="item.Logo"></image>
					<view class="right">
						<!-- #ifdef H5-->
						<text class="title clamp" style="margin-top: 26px;">{{item.ShopName}} <text style="float: right;">></text></text>
						<!--#endif-->
						<!-- #ifdef  APP-PLUS -->
						<text class="title clamp" style="margin-top: 20px;">{{item.ShopName}} <text style="float: right;">></text></text>
						<!--#endif-->
						<!-- #ifdef  MP-WEIXIN -->
						<text class="title clamp" style="margin-top: 20px;">{{item.ShopName}} <text style="float: right;">></text></text>
						<!--#endif-->
						<!-- <text class="attr-box">{{item.CompanyAddress}}</text>
						<text class="price">{{item.ContactsPhone}}</text> -->
					</view>
				</view>
				<view style="margin-right: 15px;">
					<view class="carousel" v-if="item.ChildFolder.length>1">
						<scroll-view scroll-x>
							<view class="scoll-wrapper">
								<view v-for="(item2, index2) in item.ChildFolder" :key="index2" class="floor-item" @click="navToDetailPage(item2)">
									<image :src="item2.ImagePath" mode="aspectFill"></image>
									<br />
									<div class="title clamp">{{ item2.ProductName }}</div>
									<text class="price" style="color: red;" >￥{{ item2.SalePrice }}</text>
									<!-- <text style="color: red;" v-if="VIPType!=0">
										省·赚¥{{item2.Para1}}
									</text> -->
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>

       <view class="loading-more" v-if="isLoading==true">
       	<text class="loading-more-text">{{loadingText}}</text>
       </view>

	</view>
</template>

<script>
	var Account;
	var Uguid;
	import {
		mapState
	} from 'vuex'
var page = 1,CountPages=0;
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo','VIPType']),
		data() {
			return {
				SList: [],
				SName: "",
				isLoading:false,
				loadingText: '正在加载...'
			}
		},
		onLoad() {
			this.SList=[];
			this.init();
		},
		//下拉刷新
		onPullDownRefresh: function() {
			// 重置分页及数据
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
			this.SList=[];
			page = 1;
			CountPages=0;
			this.init();
		},
		// 加载更多
		onReachBottom: function() {
			if(CountPages<=this.SList.length){
			   this.isLoading=true;
			   this.loadingText="- 我是有底线的 -";
			   return;
			}
			this.init();
		},
		methods: {			
			init() {
				this.isLoading=true;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QueryAosShop',
						shopname: this.SName,
						page:page
					},
					success: result => {
						console.log(result.data.sql);
						let list = result.data.Shoplist;
						list.forEach(item => {
							if (item.Logo == "" || item.Logo == null) {
								item.Logo = "https://www.chinaaos.com/Images/jx128128.png";
							} else {
								item.Logo = 'https://www.chinaaos.com' + item.Logo;
							}
							item.ChildFolder.forEach(item2 => {
								item2.ImagePath = 'https://www.chinaaos.com' + item2.ImagePath.split(",")[0];
								item2.Para1 =((parseFloat(item2.SalePrice) - parseFloat(item2.SetTlementPrice))*0.4).toFixed(2);
							});
						});
						this.SList = this.SList.concat(list);
						CountPages=result.data.SListCount; //总页数	
						page++;
					},
					fail: e => {
						this.isLoading=true;
					},complete: res => {
						this.isLoading = false;
					}
				});
			},
			onKeyInput: function(event) {
				this.SName = event.target.value
			},
			toSearch() {
				console.log(this.SName);
				this.SList=[];
				page = 1;
				CountPages=0;
				this.init();
			},
			GoShop(id) {
				uni.navigateTo({
					url: '/pages/Shop/ShopMain?guids=' + id
				});
			},
			readMsg() {
				uni.navigateTo({
					url: '/pages/notice/Guidance',
				});
			},
			//详情页
			navToDetailPage(item) {
				let id = item.Guid;
				uni.navigateTo({
					url: '/pages/Product/ProductDetail?gid=' + id
				});
			},
		}
	}
</script>

<style lang="scss">
	@font-face {
		font-family: "HMfont-home";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}

	page,
	.content {
		background: #ff6600;
		height: 100%;
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
				border-radius: 50%;
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
					// content: '￥';
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

	.floor-item {
		width: 100px;
		margin-right: 20upx;
		color: #747474;
		line-height: 1.8;
		height: 140px;
		float: left;

		image {
			height: 80px;
			width: 80px;
			border-radius: 3px;
			display: inline-block;
			overflow: hidden;
			position: relative;
		}
	}

	.carousel {
		height: 140px !important;
		width: 100%
	}

	.scoll-wrapper {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: start;
		-webkit-align-items: flex-start;
		-ms-flex-align: start;
		align-items: flex-start;
		height: 140px;
	}

	.scoll-wrapper .floor-item .price {
		float: left;
		color: red;
	}

	.scoll-wrapper .title.clamp {
		float: left;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.header {
		position: fixed;
		width: 100%;
		background-color: #ff6600;
		z-index: 99;
		height: 40px;
		margin-top: -8px;
		padding-top: 8px;
		padding-left: 16px;
	}

	.header .input-box {
		width: 85%;
		height: 60upx;
		background-color: #eaeaea;
		border-radius: 30upx;
		position: relative;
		display: flex;
		align-items: center;
	}

	.header .input-box .icon {
		display: flex;
		align-items: center;
		position: absolute;
		top: 0;
		right: 0;
		width: 60upx;
		height: 60upx;
		font-size: 34upx;
		color: #c0c0c0;
	}

	.header .input-box input {
		width: 80%;
		padding-left: 28upx;
		height: 28upx;
		font-size: 28upx;
	}

	.header .icon-btn {
		width: 120upx;
		height: 60upx;
		flex-shrink: 0;
		display: flex;
		float: right;
		margin-right: 6px;
	}

	.header .icon-btn .icon {
		width: 60upx;
		height: 60upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 42upx;
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height);
		//覆盖样式
		/*  #endif  */
	}

	.icon {
		font-family: "HMfont-home" !important;
		font-size: 60upx;
		font-style: normal;
		color: #000000;

		&.yuyin {
			&:before {
				content: "\e64e";
			}
		}

		&.tongzhi {
			&:before {
				content: "\e729";
			}
		}

		&.search {
			&:before {
				content: "\e628";
			}
		}

		&.location {
			&:before {
				content: "\e611";
			}
		}

		&.xia {
			&:before {
				content: "\e689";
			}
		}
	}

	.setting {
		flex-shrink: 0;
		width: 6vw;
		height: 6vw;
		margin-top: -27px;
		margin-left: 16px;

		image {
			width: 100%;
			height: 100%;
		}
	}
	
	.to {
	-webkit-flex-shrink: 0;
	-ms-flex-negative: 0;
	flex-shrink: 0;
	width: 40rpx;
	height: 40rpx;
	
	}
	
	.loading-more {
		align-items: center;
		justify-content: center;
		padding-top: 14px;
		padding-bottom: 14px;
		text-align: center;
	}
	
	.loading-more-text {
		font-size: 28upx;
		color: #999;
	}

</style>
