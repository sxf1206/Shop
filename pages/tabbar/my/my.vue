<template>
	<view class="contont">
		<view class="headers">
			<view v-if="hasLogin" class="userinfo">
				<view class="face">
					<image :src="Userinfo.HeadPortrait"></image>
				</view>
				<view class="info">
					<view v-if="VIPType == 0" class="username" style="height: 22px;line-height: 22px;vertical-align: middle;">{{ Userinfo.username }}</view>
					<view v-if="VIPType != 0" class="username" style="height: 22px;line-height: 22px;vertical-align: middle;">{{ Userinfo.username }}&nbsp;&nbsp;VIP</view>
					<view class="integral" style="line-height: 20px;height: 20px;vertical-align: middle;">
						邀请码:{{ Userinfo.Invitationcode }}
						<view style="width: 40px;height: 18px;line-height: 18px;vertical-align:middle;background-color: #FFE0E4;color: white;border-radius: 9px;margin-left:15px;text-align: center;vertical-align: middle;"
						 @click="copysome">
							复制
						</view>
					</view>
				</view>
			</view>
			<view v-if="!hasLogin" class="userinfo">
				<view class="face">
					<image :src="Myinfo.face"></image>
				</view>
				<view class="info">
					<view class="username" style="height: 22px;line-height: 22px;vertical-align: middle;">{{ Myinfo.username }}</view>
					<view class="integral" style="line-height: 20px;height: 20px;vertical-align: middle;">邀请码:{{ Myinfo.integral }}</view>
				</view>
			</view>

			<view class="setting">
				<image src="https://www.chinaaos.com/static/setting.png" @tap="GoMyInfo()"></image>
			</view>
		</view>

		<view class="orders">
			<view class="baccolor">
				<view class="box">
					<view style="width: 94%;">
						<view class="smallbox" style="margin-right: 2%;">
							<view style="border-left: 0upx solid #ffc4c4;width: 100%;height: 20vw;">
								<view style="width: 90%;float: right;" v-if="!hasLogin">
									<view style="line-height: 24upx;font-size: 28upx;margin-bottom: 25px;">佣金收益</view>
									<view style="line-height: 50upx;font-size: 22px;color: #FF2741;">
										<image src="/static/2_23.png" style="width: 30upx;height: 30upx;"></image>
										<span style="padding-left: 15upx;font-size: 16px;">0</span>
									</view>
								</view>
								<view style="width: 90%;float: right;" v-if="hasLogin">
									<view style="line-height: 24upx;font-size: 28upx;margin-bottom: 25px;">佣金收益</view>
									<view style="line-height: 50upx;font-size: 22px;color: #FF2741;" @tap="WatchWallet(1)">
										<image src="/static/2_23.png" style="width: 30upx;height: 30upx;"></image>
										<span style="padding-left: 15upx;font-size: 16px;">{{ UserProfit.ProductProfit }}</span>
									</view>
								</view>
							</view>
						</view>
						<view class="smallbox" style="margin-right: 2%;">
							<view style="border-left: 1upx solid #ffc4c4;width: 100%;height: 20vw;">
								<view style="width: 90%;float: right;" v-if="!hasLogin">
									<view style="line-height: 24upx;font-size: 28upx;margin-bottom: 25px;">管理收益</view>
									<view style="line-height: 50upx;font-size: 22px;color: #FF2741;">
										<image src="/static/2_23.png" style="width: 30upx;height: 30upx;"></image>
										<span style="padding-left: 15upx;font-size: 16px;">0</span>
									</view>
								</view>

								<view style="width: 90%;float: right;" v-if="hasLogin">
									<view style="line-height: 24upx;font-size: 28upx;margin-bottom: 25px;">管理收益</view>
									<view style="line-height: 50upx;font-size: 22px;color: #FF2741;" @tap="WatchWallet(2)">
										<image src="/static/2_23.png" style="width: 30upx;height: 30upx;"></image>
										<span style="padding-left: 15upx;font-size: 16px;">{{ UserProfit.ProductProfit }}</span>
									</view>
								</view>
							</view>
						</view>
						<view class="smallbox">
							<view style="border-left: 1upx solid #ffc4c4;width: 100%;height: 20vw;">
								<view style="width: 90%;float: right;" v-if="!hasLogin">
									<view style="line-height: 24upx;font-size: 28upx;margin-bottom: 25px;">总收益</view>

									<view style="line-height: 50upx;font-size: 22px;color: #FF2741;">
										<image src="/static/2_23.png" style="width: 30upx;height: 30upx;"></image>
										<span style="padding-left: 15upx;font-size: 16px;">0</span>
									</view>
								</view>

								<view style="width: 90%;float: right;" v-if="hasLogin">
									<view style="line-height: 24upx;font-size: 28upx;margin-bottom: 25px;">总收益</view>
									<view style="line-height: 50upx;font-size: 22px;color: #FF2741;" @tap="WatchWallet(3)">
										<image src="/static/2_23.png" style="width: 30upx;height: 30upx;"></image>
										<span style="padding-left: 15upx;font-size: 16px;">{{ UserProfit.TotleProfit }}</span>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="ordersture">
			<view class="boxtwo">
				<view class="contentInfo">
					<view style="line-height: 80upx;height: 80upx;vertical-align: middle;font-size: 30upx;color: #333;border-bottom: 1upx solid #F7F7F7;">
						我的订单
						<span style="text-align: right;float: right;font-size: 24upx;color: #747474;" @tap="allappointment()">全部订单></span>
					</view>

					<view style="line-height: 72px;height: 72px;vertical-align: middle;width: 100%;padding-top: 20upx;">
						<view class="listlist" v-for="(row, k) in orderTypeLise" :key="k" hover-class="hover" @tap="toPage(row)">
							<view style="line-height: 34px;width: 100%;text-align:center;">
								<image :src="row.icon" style="width:26px;height:23px;vertical-align:middle;"></image>
							</view>
							<view style="line-height: 34px;font-size: 26upx;width: 100%;text-align:center;color: #747474;">{{ row.name }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="ordersother">
			<view class="boxthree">
				<view class="contentInfo">
					<view style="line-height: 80px;height: 80px;vertical-align: middle;width: 100%;padding-top: 20upx;">
						<block v-for="(others, m) in severList" :key="m">
							<block v-if="VIPType == 0  &&  others.name == '添加商品'"></block>
							<block v-if="IsShow == 0  &&  others.name == '商家入驻'"></block>							
							<block v-else>
								<view class="listlistTwo" hover-class="hover" @tap="toPage(others)">
									<view style="line-height: 34px;width: 100%;text-align:center;">
										<image :src="others.icon" style="width:38px;height:36px;vertical-align:middle;"></image>
									</view>
									<view style="line-height: 34px;font-size: 26upx;width: 100%;text-align:center;color: #747474;">{{ others.name }}</view>
								</view>
							</block>
						</block>
					</view>
				</view>
			</view>
		</view>
		<view class="goods">
			<view class="d-header"><text>为你推荐</text></view>
			<view class="goodsinfo">
				<view class="guess-section">
					<view v-for="(item, Guid) in productList" :key="Guid" class="guess-item" @click="navToDetailPage(item)">
						<view class="image-wrapper">
							<image :src="item.ImagePath" mode="aspectFill"></image>
						</view>
						<text class="title clamp">{{ item.ProductName }}</text>
						<text class="price">
							￥{{ item.MinPrice }}
							<text style="float: right;" v-if="VIPType != 0">省·赚¥{{ item.Para1 }}</text>
						</text>
					</view>
				</view>
			</view>
		</view>

        <view class="loading-more" v-if="isLoading==true">
			<text class="loading-more-text">{{loadingText}}</text>
		</view>
		
		<!-- <uni-popup :show="type === 'middle-img'" position="middle" mode="insert" @hidePopup="togglePopup('')">
			<view class="uni-center center-box" style="margin-top: 100px;">
				<image class="image" :src="codeimg" style="width: 260px;height: 260px;"/>
			</view>
		</uni-popup> -->
	</view>
</template>
<script>
	
	var page,CountPages=0;
	import {
		mapState
	} from 'vuex';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'UserProfit', 'VIPType', 'IsShow']),
		components: {
			uniPopup
		},
		data() {
			return {
				isLoading:false,
				loadingText: '正在加载...',
				dateMeiB: 0,
				MeiB: 0,
				AccountBalance: 0,
				Myinfo: {
					face: 'https://www.chinaaos.com/static/mlfz_touimg.jpg',
					username: '昵称',
					integral: '无',
					VipLeve: 0
				},
				productList: [],
				orderTypeLise: [
					//name-标题 icon-图标 badge-角标
					{
						name: '全部订单',
						icon: 'https://www.chinaaos.com/static/I2_10.png',
						url: '/pages/Order/order?state=0'
					},
					{
						name: '待付款',
						icon: 'https://www.chinaaos.com/static/I2_12.png',
						url: '/pages/Order/order?state=1'
					},
					{
						name: '待收货',
						icon: 'https://www.chinaaos.com/static/I2_14.png',
						url: '/pages/Order/order?state=3'
					},
					{
						name: '退款/售后',
						icon: 'https://www.chinaaos.com/static/I2_16.png',
						url: '/pages/Order/order?state=5'
					}
				],
				severList: [{
						name: '邀请',
						icon: 'https://www.chinaaos.com/static/I2_30.png',
						url: '/pages/Myself/MyInvitation'
					},
					{
						name: '收藏',
						icon: 'https://www.chinaaos.com/static/I2_24.png',
						url: '/pages/Myself/MyCollection'
					},
					{
						name: '粉丝',
						icon: 'https://www.chinaaos.com/static/I2_32.png',
						url: '/pages/Myself/myfance'
					},
					{
						name: '购物车',
						icon: 'https://www.chinaaos.com/static/I2_44.png',
						url: '/pages/cart/cart'
					},
					{
						name: '会员培训',
						icon: 'https://www.chinaaos.com/static/I2_39.png',
						url: '/pages/notice/notice'
					},
					{
						name: '新手指导',
						icon: 'https://www.chinaaos.com/static/I2_41.png',
						url: '/pages/notice/Guidance'
					},
					{
						name: '官方客服',
						icon: 'https://www.chinaaos.com/static/I2_27.png',
						url: '/pages/Myself/myQR'
					},
					{
						name: '商家入驻',
						icon: 'https://www.chinaaos.com/static/I2_46.png',
						url: '/pages/Myself/SettledIn'
					},
					{
						name: '添加商品',
						icon: 'https://www.chinaaos.com/static/jiap.png',
						url: '/pages/Myself/AddProduct'
					}
					// ,
					// {
					// 	name: '我的微课',
					// 	icon: 'https://www.chinaaos.com/static/I2_46.png',
					// 	url: ''
					// }
					//,
					// {
					// 	name: '兴趣标签',
					// 	icon: 'https://www.chinaaos.com/static/I2_49.png',
					// 	url: '/pages/Myself/interest'
					// }
				]
			};
		},
		mounted(option) {
			page=1;
			this.getList();
		},
		//下拉刷新
		onPullDownRefresh() {			
			page=1;
			this.getList();
		},
		// 加载更多
		onReachBottom: function() {
			if(CountPages<=this.productList.length){
			   this.isLoading=true;
			   this.loadingText="- 我是有底线的 -";
			   return;
			}
			this.getList();
		},
		methods: {
			GoMyInfo() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/LoginWChat'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/set/set'
				});
			},
			getList() {
				this.isLoading =true;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					method: 'GET',
					data: {
						req: 'LikeGoodsList',
						page:page,
						IsShow:this.IsShow
					},
					success: res => {
						res.data.Lovely.forEach(item => {
							item.ImagePath = "https://www.chinaaos.com" + item.ImagePath;
							var p = (parseFloat(item.MinPrice) - parseFloat(item.SettlementPrice)) * 0.4;
							item.Para1 = p.toFixed(2);
						});
						CountPages=res.data.LovelyCount;						
						this.productList = this.productList.concat(res.data.Lovely);
						page++;
					},
					fail: e => {
						this.isLoading=true;
					},
					complete: res => {
						this.isLoading =false;
					}
				});
			},
			allappointment() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/LoginWChat'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/Order/order?state=0'
				});
			},
			WatchWallet(e) {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/LoginWChat'
					});
					return;
				}
				if (this.VIPType == "0") {
					uni.switchTab({
						url: "/pages/tabbar/shop/VIP"
					});
					return;
				}				
				
				var urls = '';
				if (e == '1') {
					urls = '/pages/Myself/ProductProfit'
				} else if (e == '2') {
					urls = '/pages/Myself/ManageProfit'
				} else {
					urls = '/pages/Myself/MyWallet'
				}
				uni.navigateTo({
					url: urls
				});
			},
			//用户点击列表项
			toPage(item) {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/LoginWChat'
					});
					return;
				}
				if (this.VIPType == "0" && (item.name == "邀请" || item.name == "粉丝" || item.name == "会员培训" || item.name == "新手指导" ||
						item.name == "商家入驻" || item.name == "添加商品")) {
					uni.switchTab({
						url: "/pages/tabbar/shop/VIP"
					});
					return;
				} else {
					uni.navigateTo({
						url: item.url
					});
				}

			},
			//详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.Url;
				uni.navigateTo({
					url: '/pages/Product/ProductDetail?gid=' + id
				});
			},
			copysome() {
				uni.setClipboardData({
					data: this.Userinfo.Invitationcode,
					success: function() {
						console.log('success');
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f6f7fb;
		padding-bottom: 100upx;
	}

	.userinfo {
		width: 90%;
		display: flex;

		.face {
			flex-shrink: 0;
			width: 17vw;
			height: 17vw;

			image {
				width: 100%;
				height: 100%;
				border-radius: 100%;
			}
		}

		.info {
			display: flex;
			flex-flow: wrap;
			padding-left: 30upx;
			padding-top: 24rpx;

			.username {
				width: 100%;
				color: #fff;
				font-size: 30upx;
				font-family: 宋体;
			}

			.integral {
				display: flex;
				align-items: center;
				height: 40upx;
				color: #fff;
				background-color: rgba(0, 0, 0, 0);
				border-radius: 20upx;
				font-size: 30upx;
				font-family: 宋体;
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

	.headers {
		border: 0px;
		background-color: #ff6600;
		width: 92%;
		height: 30vw;
		padding: 4% 4% 0;
		display: flex;
		align-items: center;
	}

	.hover {
		background-color: #eee;
	}

	.orders {
		z-index: 22;
		border: 0px;
		background-color: #ff6600;
		height: 11vw;
		padding: 0 20upx;
		margin-bottom: calc(11vw + 40upx);
		// display: flex;
		align-items: flex-start;
		// border-radius: 0 0 100% 100%;
		margin-top: -4upx;

		.box {
			width: 98%;
			padding: 0 1%;
			height: 30vw;
			background-color: #ffe0e4;
			border-radius: 24upx;
			box-shadow: 0 0 20upx rgba(0, 0, 0, 0.15);
			margin-bottom: 40upx;
			display: flex;
			align-items: center;
			justify-content: center;

			.smallbox {
				width: 32%;
				float: left;
				height: 20vw;
				// background: #007AFF;
			}
		}
	}

	.ordersture {
		border: 0px;
		padding: 0 20upx;
		margin: auto;
		padding-top: 26px;

		.boxtwo {
			width: 98%;
			padding: 0 1%;
			height: 34vw;
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

	.listlist {
		width: 25%;
		float: left;
		line-height: 72px;
		vertical-align: middle;
	}

	.ordersother {
		border: 0px;
		padding: 0 20upx;
		margin: auto;
		padding-top: 17px;

		.boxthree {
			width: 98%;
			padding: 0 1%;
			height: 78vw;
			background-color: white;
			border-radius: 24upx;
			box-shadow: 0 0 20upx rgba(0, 0, 0, 0.15);
			align-items: center;
			justify-content: center;

			.contentInfo {
				width: 100%;
				margin: auto;
			}
		}
	}

	.listlistTwo {
		width: 25%;
		float: left;
		line-height: 80px;
		vertical-align: middle;
		margin-top: 8px;
	}

	.list {
		width: 100%;
		border-bottom: solid 26upx #f1f1f1;

		.li {
			width: 92%;
			height: 100upx;
			padding: 0 4%;
			border-bottom: solid 1upx #e7e7e7;
			display: flex;
			align-items: center;

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
				padding-left: 20upx;
				width: 100%;
				color: #666;
				font-size: 15px;
			}

			.to {
				flex-shrink: 0;
				width: 40upx;
				height: 40upx;
			}
		}
	}

	.goodsinfo {
		margin: auto;
		width: 100%;
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
