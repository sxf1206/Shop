<template>
	<view class="allpage">
		<!-- 店铺 -->
		<view class="headsty">
			<view class="Contents">
				<view class="headImg">
					<image :src="dianpuTX"></image>
				</view>
				<view class="name">
					<text>{{dianpuMC}}</text>
				</view>
			</view>
			<view class="GNtext">
				<text>专营商品、百货</text>
			</view>
		</view>

		<!-- 服务 -->
		<view class="leveInfo">
			<view class="uni-padding-wrap uni-common-mt">
				<view class="progress-box">
					<text>描述相符</text><progress percent="76" show-info stroke-width="8" activeColor="#ff6600" border-radius="10"/>
				</view>
				<view class="progress-box">
					<text>卖家服务</text><progress percent="76" show-info stroke-width="8" activeColor="#ff6600" border-radius="10"/>
				</view>
				<view class="progress-box">
					<text>物流服务</text><progress percent="76" show-info stroke-width="8" activeColor="#ff6600" border-radius="10"/>
				</view>
			</view>
		</view>

		<!-- 基本信息 -->
		<view class="anotherinfo">
			<text>基础信息</text>
			<view class="ZZinfo">
				<text>工商执照</text>
				<br />
				<image :src="GSZZ"></image>
			</view>
			<view class="ZZinfo">
				<text>开店时间</text>
				<text style="float: right;">{{KDSJ}}</text>
			</view>
		</view>

	</view>

</template>

<script>
	import uniIcon from '@/components/uni-icon/uni-icon.vue'
	var Account;
	var Uguid;
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			uniLoadMore,
			uniIcon
		},
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
		data() {
			return {
				dianpuTX: "../../static/touxiang.png",
				dianpuMC: "",
				shopGuids: "",
				GSZZ: "",
				KDSJ: ""
			};
		},
		onLoad(option) {
			// #ifdef MP
			//小程序隐藏返回按钮
			this.showBack = false;
			// #endif
			this.shopGuids = option.sid;
			this.QueryShopInfo();
			this.getGoodsByShop();
		},
		methods: {
			//下拉刷新
			onPullDownRefresh: function() {
				// 重置分页及数据
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
				this.QueryShopInfo();
			},
			QueryShopInfo() {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QuerySomeOneShop',
						sgid: this.shopGuids
					},
					success: result => {
						if (result.data.ResultType) {
							this.dianpuTX = "https://www.chinaaos.com" + result.data.ShopInfo[0].Logo;
							this.dianpuMC = result.data.ShopInfo[0].ShopName;
							this.GSZZ = "https://www.chinaaos.com" + result.data.ShopInfo[0].BusinessLicenceNumberPhoto;
							this.KDSJ = result.data.ShopInfo[0].UpdateTime.split("T")[0] + " " + result.data.ShopInfo[0].UpdateTime.split(
								"T")[1].split(".")[0]
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
	page {
		background-color: #F5F5F5;
	}

	.allpage {
		width: 100%;
	}

	.headsty {
		height: 138px;
		margin: 10px;
		background-color: #FFFFFF;
		border-radius: 10px;

		.Contents {
			padding: 16px 11px;
			display: -webkit-inline-box;

			.headImg {
				width: 74px;
				height: 74px;
				border-radius: 4px;

				image {
					width: 100%;
					height: 100%;
					border-radius: 4px;
				}
			}


			.name {
				height: 74px;
				line-height: 74px;
				vertical-align: middle;
				padding-left: 16px;

				text {
					color: #333333;
					font-size: 18px;
				}
			}

		}

	}

	.GNtext {
		margin-top: -4px;

		text {
			padding-left: 16px;
			color: #747474;
			line-height: 24px;
			font-size: 15px;
		}
	}

	.leveInfo {
		height: 180px;
		margin: 10px;
		background-color: #FFFFFF;
		border-radius: 10px;
		padding: 11px 11px;
	}

	.uni-padding-wrap {
		width: auto;
		padding: 0;
	}

	.progress-box {
		display: flex;
		height: 50upx;
		margin-bottom: 60upx;

		text {
			width: 28%;
		}
		
	}

	.uni-icon {
		line-height: 1.5;
	}

	.progress-cancel {
		margin-left: 40upx;
	}


	.uni-progress {
		.uni-progress-bar {
			border-radius: 10px;

			.uni-progress-inner-bar {
				border-radius: 10px;
			}
		}
	}

	.anotherinfo {
		height: 224px;
		margin: 10px;
		background-color: #FFFFFF;
		border-radius: 10px;
		padding: 11px 11px;

		text {
			font-size: 18px;
			color: black;
		}

		.ZZinfo {
			padding-top: 10px;

			text {
				font-size: 14px;
			}

			image {
				width: 100px;
				height: 100px;
				margin-top: 9px;
			}
		}
	}
</style>
