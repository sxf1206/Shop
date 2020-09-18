<template>
	<view class="content">
		<view class="divone">
		</view>

		<view class="maininfo" v-if="hasLogin">
			<view style="width: 90%;margin: auto;">
				<view class="userinfo">
					<view class="face">
						<image :src="Userinfo.HeadPortrait"></image>
					</view>
					<view class="info">
						<view class="username" style="height: 22px;line-height: 22px;vertical-align: middle;">
							{{ Userinfo.username }}
						</view>

						<view class="integral" style="line-height: 20px;height: 20px;vertical-align: middle;">
							邀请码:{{ Userinfo.Invitationcode }}
						</view>
					</view>
				</view>
				<view class="growpZhi">
					<view @tap="modalTap">升级VIP</view>
				</view>
			</view>
		</view>

		<view class="maininfo" v-if="!hasLogin">
			<view style="width: 90%;margin: auto;">
				<view class="userinfo">
					<view class="face">
						<image :src="Myinfo.face"></image>
					</view>
					<view class="info">
						<view class="username" style="height: 22px;line-height: 22px;vertical-align: middle;">
							{{ Myinfo.username }}
						</view>

						<view class="integral" style="line-height: 20px;height: 20px;vertical-align: middle;">
							邀请码:{{ Myinfo.integral }}
						</view>
					</view>
				</view>
				<view class="growpZhi">
					<view @tap="modalTap">升级VIP</view>
				</view>
			</view>
		</view>


		<view class="advInfo">
			<view class="advImg">
				<image src="https://www.chinaaos.com/static/vip.jpg" style="width: 100%;height: 100%;display: inline;"></image>
			</view>
			<view class="viptitle">
				<p>升级VIP会员可享权益</p>
			</view>
			<view style="width: 100%;background-color: #F3F7F7;padding-bottom:10px 10px 10px 10px;">
				<view class="vipinfo">
					<p>1、自买省钱：VIP会员购买平台商品或服务，可享6%～36%的优惠；</p>
					<p>2、分享赚钱：VIP会员可享6%～36%的分享佣金收益；</p>
					<p>3、管理收益：VIP会员推广可享平台补贴的管理收益；</p>
					<p>4、供货资格：VIP会员可申请商家入驻，上传商品或服务供其他VIP会员分销；</p>
					<p>5、运营商资格：VIP会员可申请本地生活频道当地运营商；</p>
					<p>6、专属培训：VIP会员可享平台提供的获客、分销、运营商等各种专属培训；</p>
				</view>
			</view>

			<view style="width: 100%;background-color: #F3F7F7;padding-bottom: 40px;">
				<view class="viptitle2">
					<p> ———— 礼包商品 ———— </p>
					<p class="smalltishi">购买以下礼包商品升级VIP会员</p>
				</view>
				<view style="width: 96%;margin: auto;">
					<view class="collect-list">

						<view style="width: 90%;margin: auto;">
							<view class="item" v-for="(item, index) in GoodsList" :key="index" @click="navToDetailPage(item)">
								<view style="width: 37%;">
									<image class="img" :src="item.MainIm" />
								</view>
								<view class="info">
									<view class="name">{{ item.ProductName }}</view>
									<view style="width: 100%;">
										<view class="price">￥{{ item.SalePrice}}</view>
										<view style="width: 40%;float: left;line-height: 24px;vertical-align: middle;">
											<view class="btn">立即购买</view>
										</view>
									</view>
								</view>

							</view>
						</view>

					</view>
				</view>

			</view>
		</view>

	</view>
</template>

<script>
	import uniIcon from '@/components/uni-icon/uni-icon.vue'
	var Account;
	var Uguid;
	import {
		mapState
	} from 'vuex'

	export default {
		name: 'UpLeveVIP',
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType']),
		data() {
			return {
				dateMeiB: 0,
				MeiB: 0,
				AccountBalance: 0,
				Myinfo: {
					face: 'https://www.chinaaos.com/static/mlfz_touimg.jpg',
					username: '昵称',
					integral: '无',
					VipLeve: 0
				},
				GoodsList: []
			};
		},
		components: {
			uniIcon
		},
		mounted() {
			this.GetSupriseList();
		},
		methods: {
			async GetSupriseList() {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QuerySupriseGoods'
					},
					success: result => {
						this.GoodsList = [];
						let List = result.data.SupriseGoods;
						this.GoodsList = this.GoodsList.concat(List);
						this.GoodsList.forEach(item => {
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
			//详情
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.Guid;
				console.log(id)
				uni.navigateTo({
					url: '/pages/Product/ProductDetail?gid=' + id
				});
			},
			modalTap: function(e) {

			}
		}
	};
</script>

<style lang="scss">
	.content {
		background-color: #F3F7F7;
		margin-top: 0;
	}

	.divone {
		background-color: #ff6600;
		width: 100%;
		height: 140px;
		border-bottom-right-radius: 20px;
		border-bottom-left-radius: 20px;
	}

	.maininfo {
		width: 96%;
		margin: auto;
		background-color: #dddddd;
		position: relative;
		top: -100px;
		border-radius: 15px;
		padding-top: 14px;
		padding-bottom: 34px;

		.face {
			flex-shrink: 0;
			width: 17vw;
			height: 17vw;
			float: left;

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
			width: 70%;

			.username {
				width: 100%;
				color: black;
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

	.growpZhi {
		flex-shrink: 0;
		// height: 48px;
		margin-top: -32px;
		margin-left: 16px;
		float: right;
		color: red;
		width: 62px;
		border: 1px solid;
		border-radius: 4px;
		text-align: center;
		height: 24px;
	}

	.advInfo {
		width: 100%;
		height: 240px;
		position: absolute;
		margin-top: -88px;
		margin-bottom: 80px;
		background-color: #F3F7F7;

		.advImg {
			width: 96%;
			margin: auto;
			height: 100%;
		}
	}

	.viptitle {
		width: 100%;
		text-align: center;
		height: 60px;
		line-height: 60px;
		background-color: #F3F7F7;

		p {
			color: #ff6600;
			line-height: 60px;
			vertical-align: middle;
			font-size: 16px;
		}
	}

	.viptitle2 {
		width: 100%;
		text-align: center;
		height: 70px;
		line-height: 60px;
		background-color: #F3F7F7;

		p {
			color: #ff6600;
			line-height: 60px;
			vertical-align: middle;
			font-size: 16px;
		}

		.smalltishi {
			color: #ff6600;
			vertical-align: middle;
			font-size: 10px;
			line-height: 0;
			margin-top: -12px;
		}

	}

	.vipinfo {
		width: 96%;
		margin: auto;
		border-radius: 15px;
		background-color: white;
		padding-top: 8px;
		padding-bottom: 16px;

		p {
			color: #747474;
			line-height: 24px;
			vertical-align: middle;
			font-size: 14px;
			width: 92%;
			margin: auto;
			padding-top: 8px;
		}
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
		width: 100px;
		height: 100px;
	}

	.item .info {
		float: right;
		width: 60%;
		height: 174rpx;
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

	.btn {
		font-size: 24upx;
		color: #ff2741;
		width: 60px;
		height: 24px;
		line-height: 24px;
		vertical-align: middle;
		text-align: center;
		border: 1upx solid#FF2741;
		border-radius: 25upx;
		float: right;
		margin-top: 24px;
	}
</style>
