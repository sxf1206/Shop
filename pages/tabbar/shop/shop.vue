<template>
	<view>
		<view class="address-section">
			<view class="order-content">
				<view class="yticon icon-shouhuodizhi">
					<image :src="Photo" style="width: 64px;height: 64px;border-radius: 50%;"></image>
				
				</view>
				<view class="cen">
					<view class="top">
						<text class="name">分享赚：</text>
						<text class="mobile" style="color: #ff6600;">第{{orderbyFX}}名 &nbsp;&nbsp;<text style="color:#747474;float: right;padding-right: 24px;">“{{FXShowlog}}”</text></text>
					</view>
					<text class="address">
						<text class="name">自买省：</text>
						<text class="mobile" style="color: #ff6600;">第{{orderbyZM}}名 &nbsp;&nbsp;<text style="color:#747474;float: right;padding-right: 24px;">“{{ZMShowlog}}”</text></text>
					</text>
				</view>
			</view>
		</view>

		<view class="fixedit" :style="{ top: top }">
			<scroll-view class="grace-tab-title grace-center" scroll-x="true" id="grace-tab-title">
				<view v-for="(cate, index) in categories" :key="index" :data-cateid="cate.cateid" :data-index="index" :class="[cateCurrentIndex == index ? 'grace-tab-current' : '']"
				 @tap="tabChange">
					{{ cate.name }}
				</view>
			</scroll-view>
		</view>
		<view style="height:50px;"></view>
		<view class="indexsone" :style="{ display: onedisplay }">

			<view class="infolist" style="padding-top: 20px;">
				<view class="listsome">
					<view class="guess-section">
						<view v-for="(item, Guid) in RecommondList" :key="Guid" class="guess-item" @click="navToDetailPage(item)">
							<view class="image-wrapper">
								<image :src="item.ImagePath" mode="aspectFill"></image>
							</view>
							<text class="title clamp">{{item.ProductName}}</text>
							<text class="price">￥{{item.MinPrice}} <text style="float: right;font-size: 12px;" v-if="VIPType!=0">省·赚¥{{item.Para1}}</text>
							</text>
						</view>
					</view>
				</view>
			</view>

		</view>

		<view class="indexsone" :style="{ display: twodisplay }">
			<!-- 轮播图 -->
			<view class="swiper-view">
				<swiper class="swiper" indicator-dots="true" autoplay="true" circular="true" indicator-active-color="#ffffff">
					<swiper-item v-for="(item, index) in Banner" :key="index" class="carousel-item" @click="ChangeToDetailPage(item)">
						<image  :src="item.ImageUrl"  />
					</swiper-item>					
				</swiper>
			</view>

			<view class="infolist">
				<view>
					<view class="uni-flex uni-row" style="margin-top: 8px;">
						<view class="text" style="flex: 1;font-size: 16px;border: 0upx solid;background-color: #ff6600;color: white;">分享赚</view>
						<view class="text" style="flex: 1;font-size: 16px;border: 0upx solid;background-color: orange;color: white;">自买省</view>
					</view>
					<view style="width: 100%;display: -webkit-inline-box;">
						<view style="width: 44%;padding-left: 16px;padding-right: 8px;border-right: 1px solid #FFFFFF;background-color: #f1f1f1;">
							<view class="uni-flex uni-row">
								<view class="flex-item" style="line-height: 48px;height: 48px;">排行榜</view>
								<view class="flex-item" style="line-height: 48px;height: 48px;">今日</view>
								<view class="flex-item" style="line-height: 48px;height: 48px;">累计</view>
							</view>
						</view>
						<view style="width: 44%;padding-left: 16px;background-color: #f1f1f1;">
							<view class="uni-flex uni-row">
								<view class="flex-item" style="line-height: 48px;height: 48px;">排行榜</view>
								<view class="flex-item" style="line-height: 48px;height: 48px;">今日</view>
								<view class="flex-item" style="line-height: 48px;height: 48px;">累计</view>
							</view>
						</view>
					</view>
				</view>
				<view style="margin-bottom: 24px;">
					<view style="width: 100%;display: -webkit-inline-box;">
						<view style="width: 44%;padding-left: 16px;padding-right: 8px;border-right: 1px solid #FFFFFF;">
							<view class="uni-flex uni-row" v-for="(items, index) in FXList" :key="indexs">
								<view class="flex-item" style="line-height: 48px;height: 48px;">
									<image class="paihangbImg" :src="items.Photo"></image>
								</view>
								<view class="flex-item" style="line-height: 48px;height: 48px;">{{items.daymoney.toFixed(2)}}</view>
								<view class="flex-item" style="line-height: 48px;height: 48px;">{{items.summoney.toFixed(2)}}</view>
							</view>
						</view>
						<view style="width: 44%;padding-left: 16px;">
							<view class="uni-flex uni-row"  v-for="(item, index) in ZMSList" :key="index">
								<view class="flex-item" style="line-height: 48px;height: 48px;">
									<image class="paihangbImg" :src="item.headImg"></image>
								</view>
								<view class="flex-item" style="line-height: 48px;height: 48px;">{{item.daymoney.toFixed(2)}}</view>
								<view class="flex-item" style="line-height: 48px;height: 48px;">{{item.summoney.toFixed(2)}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>

		</view>


	</view>
</template>
<script>
	var util = require('../../../utils/util.js');
	var page = 1,
		cate = 0;
	var Account;
	var Uguid;
	import {
		mapState
	} from 'vuex'

	export default {
		name: 'vip',
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType', 'unionid']),
		data() {
			return {
				top: 0,
				Photo: "https://www.chinaaos.com/static/mlfz_touimg.jpg",
				FXnum: 0,
				ZMnum: 0,
				orderbyFX: 0,
				orderbyZM: 0,
				FXShowlog: "",
				ZMShowlog: "",
				//分类信息
				categories: [{
						cateid: 0,
						name: '今日分享推荐'
					},
					{
						cateid: 1,
						name: '达人榜'
					}
				],
				// 当前选择的分类
				cateCurrentIndex: 0,
				// 演示文章数据
				artList: [],
				onedisplay: "block",
				twodisplay: "none",
				RecommondList: [],
				ZMSList:[],
				FXList:[],
				Banner:[]
			};
		},
		mounted() {
			// #ifdef H5
			this.top = '140px';
			// #endif
			// #ifdef MP-WEIXIN
			this.top = '92px';
			// #endif
			// #ifdef APP-PLUS
			this.top = '88px';
			// #endif
			this.init();		
			this.loadData();
		},
		//下拉刷新
		onPullDownRefresh: function() {
			// 重置分页及数据
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
			this.init();
			this.loadData();
		},
		// 加载更多
		onReachBottom: function() {
			this.loadData();
		},
		methods: {
			ChangeToDetailPage(item) {
				let id = item.Url;
				if(id!=""  &&  id!=null){
					uni.navigateTo({
						url: id
					});
				}				
			},
			GetBannnerList(){
				uni.request({
						url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
						data: {
							req: 'GetVipPagesBannerList'
						},
						success: result => {							
							result.data.forEach(item => {
								item.ImageUrl='https://www.chinaaos.com'+item.ImageUrl
							});
							this.Banner=result.data;
						},
						fail: e => {
							uni.showToast({
								icon: 'none',
								title: e.errMsg
							});
						}
					});
				
				
			},
			init() {				
				uni.request({
					url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
					data: {
						req: 'GetSelfInfo',
						account: uni.getStorageSync('Account')
					},
					success: result => {
						if (result.data.ListInfo[0].Photo != "" && result.data.ListInfo[0].Photo != null) {
							this.Photo = result.data.ListInfo[0].Photo;
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
			loadData() {
				uni.showLoading({
					title:"加载中。。。"
				})
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'VIPShowInfo'
					},
					success: result => {
						let list = result.data.InfoList;
						let lists=result.data.fxinfolist;
						if(list.length<0){
							this.ZMnum=0;
							this.orderbyZM=1;
						}else{
							list.forEach(item => {
								if (item.SumSavemoney == "" || item.SumSavemoney == null) {
									item.SumSavemoney = 0;
								}
								if (item.UserName == uni.getStorageSync('Account')) {
									this.ZMnum = item.SumSavemoney;
									this.orderbyZM = item.SortNumber;
								}
							});
							if(this.orderbyZM=="0"){
								this.orderbyZM = list.length+1;
							}
						}
						if(lists.length<0){
							this.FXnum=0;
							this.orderbyFX=1;
						}else{
							lists.forEach(item => {
								if (item.SumSavemoney == "" || item.SumSavemoney == null) {
									item.SumSavemoney = 0;
								}
								if (item.UserID == uni.getStorageSync('Account')) {
									this.FXnum = item.SumSavemoney;
									this.orderbyFX = item.SortNumber;
								}
							});
							if(this.orderbyFX=="0"){
								this.orderbyFX = lists.length+1;
							}
						}
						console.log("自买省排名:" + this.orderbyZM + "___节省金额：" + this.ZMnum);
						console.log("分享赚排名:" + this.orderbyFX + "___节省金额：" + this.FXnum);
						
						if(this.FXnum==0){
							this.FXShowlog="有点着急啊！";
						}else if(this.FXnum>0 &&this.FXnum<=20){
							this.FXShowlog="继续努力呦！";
						}else if(this.FXnum>=21 && this.FXnum<=100){
							this.FXShowlog="你太棒了！";
						}else if(this.FXnum>=101 && this.FXnum<=200){
							this.FXShowlog="你已超神！";
						}else if(this.FXnum>=201){
							this.FXShowlog="赚钱达人！";
						}

						if (this.ZMnum == 0) {
							this.ZMShowlog = "节约是传统美德";
						} else if (this.ZMnum > 0 && this.ZMnum <= 20) {
							this.ZMShowlog = "继续努力呦！";
						} else if (this.ZMnum >= 21 && this.ZMnum <= 100) {
							this.ZMShowlog = "勤俭持家！";
						} else if (this.ZMnum >= 101 && this.ZMnum <= 200) {
							this.ZMShowlog = "你已超神！";
						} else if (this.ZMnum >= 201) {
							this.ZMShowlog = "省钱达人！";
						}
						result.data.ZMlist.forEach(i => {
							if(i.summoney=="" || i.summoney==null){
								i.summoney=0;
							}
							
							if(i.daymoney=="" || i.daymoney==null){
								i.daymoney=0;
							}
							
							if(i.headImg=="" ||i.headImg==null){
								i.headImg="https://www.chinaaos.com/static/mlfz_touimg.jpg";
							}
						});
						
						uni.hideLoading();
						this.ZMSList=result.data.ZMlist;
						
						result.data.FXlist.forEach(j => {
							if(j.summoney=="" || j.summoney==null){
								j.summoney=0;
							}
							
							if(j.daymoney=="" || j.daymoney==null){
								j.daymoney=0;
							}
							
							if(j.Photo=="" ||j.Photo==null){
								j.Photo="https://www.chinaaos.com/static/mlfz_touimg.jpg";
							}
						});
						this.FXList=result.data.FXlist;
						result.data.Recommond.forEach(item => {
							item.ImagePath = "https://www.chinaaos.com" + item.ImagePath;
							var p = (parseFloat(item.MinPrice) - parseFloat(item.SettlementPrice)) * 0.4;
							item.Para1 = p.toFixed(2);
						});
						this.RecommondList = result.data.Recommond;
						
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			tabChange: function(e) {
				// 选中的索引
				var index = e.currentTarget.dataset.index;
				// 具体的分类id
				var cateid = e.currentTarget.dataset.cateid;
				this.cateCurrentIndex = index;
				// 动态替换内容
				this.content = this.categories[index].name;
				// 读取分类数据
				cate = cateid; //把分类信息发送给api接口即可读取对应分类的数据
				this.onedisplay = "block";
				this.twodisplay = "none";
				if (index == "1") {
					this.onedisplay = "none";
					this.twodisplay = "block";
					this.GetBannnerList();
				}
			},
			//详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.Url;
				uni.navigateTo({
					url: '/pages/Product/ProductDetail?gid=' + id
				});
			}
		}
	};
</script>
<style lang="scss">
	page {
		background-color: white;
	}

	.address-section {
		padding: 30upx 30upx;
		background: #fff;
		position: fixed;
		z-index: 99999;
		width: 100%;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			// width: 90upx;
			// color: #888;
			// font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: #333333;
			padding-left: 10px;
		}

		.name {
			font-size: 28upx;
		}

		.address {
			margin-right: 20upx;
			color: #333333;
		}

		.icon-you {
			font-size: 28upx;
			color: #747474;
			margin-right: 30upx;
		}

		.mobile {
			padding-right: 16px;
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


	/* 分段器头部 fixed 定位 */
	.fixedit {
		width: 100%;
		position: fixed;
		z-index: 9999999;
		left: 0;
		top: 0;
		border-top: 2upx solid #F1F1F1;
	}

	.grace-tab {
		padding: 0;
	}

	.grace-tab-title {
		white-space: nowrap;
		text-align: center;
		background: #ffffff;
	}

	.grace-tab-title view {
		width: auto;
		padding: 0 12px;
		margin: 0 28px;
		line-height: 42px;
		display: inline-block;
		text-align: center;
		border-bottom: 2px solid #ffffff;
		font-size: 30upx;
	}

	.grace-tab-current {
		border-bottom: 4upx solid #ff2741 !important;
		color: #ff2741;
	}

	/* 新闻列表 */
	
	
	

	.text {
		margin: 0rpx 0rpx !important;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		color: #777;
		font-size: 26rpx;
	}

	
	

	.content {
		width: 100%;
		margin-top: 32px;
	}

	.contentinfo {
		width: 94%;
		margin: 0 auto;
	}

	.Maininfo {
		margin-top: 28upx;
		background-color: #ffe0e4;
		height: 406px;
		/*  #ifdef  APP-PLUS  */
		height: 360px;
		/*  #endif  */
		idth: 100%;
		z-index: 1;
	}

	.modleview {
		width: 94%;
		margin: 0 auto;
		vertical-align: middle;
	}

	.bigmodle {
		width: 94%;
		margin: 0 auto;
		padding-top: 16px;
	}

	.modleinfo {
		width: 100%;
		background-color: white;
		border-radius: 15upx;
		margin-top: 17px;
		z-index: 2;
	}

	.infolist {
		// background-color: #f6f7fb;
		padding-bottom: 48px;
	}

	.listsome {}

	.bigtype {
		height: 100%;
		width: 100%;
		z-index: 2;
		line-height: 110upx;
		text-align: center;
		vertical-align: middle;
		font-size: 16px;
	}

	.flex-item {
		width: 33.3%;
		height: 200upx;
		text-align: center;
		line-height: 200upx;
	}

	.flex-item-V {
		width: 100%;
		height: 150upx;
		text-align: center;
		line-height: 150upx;
	}

	.text {
		margin: 15upx 10upx;
		// padding: 0 20upx;
		// background-color: #ebebeb;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		color: #777;
		font-size: 26upx;
	}

	.desc {
		/* text-indent: 40upx; */
	}

	.uni-row {
		flex-direction: row;
	}

	.uni-flex {
		display: flex;
		flex-direction: row;
	}

	.uni-flex-item {
		flex: 1;
	}

	.swiper-view {
		padding-top: 16upx;

		.swiper {
			width: 100%;
			height: 210upx;
			image {
				width: 100%;
				height: 210upx;
			}
		}
	}


	.text {
		margin: 15upx 10upx 7upx;
		height: 70upx;
	}

	.indexsone {
		margin-top: 84px;
		/*  #ifdef  APP-PLUS  */
		margin-top: 64px;
		/*  #endif  */
	}

	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;
		padding-top: 16px;

	}

	.guess-section .guess-item {
		display: flex;
		flex-direction: column;
		width: 48%;
		padding-bottom: 40upx;
	}

	.guess-section .guess-item:nth-child(2n+1) {
		margin-right: 4%;
	}

	.guess-section .image-wrapper {
		width: 100%;
		height: 330upx;
		border-radius: 10px;
		overflow: hidden;
	}

	.guess-section image {
		width: 100%;
		height: 100%;
		opacity: 1;
	}

	.guess-section .title {
		font-size: 14px;
		color: #747474;
		line-height: 80upx;
	}

	.guess-section .price {
		font-size: 14px;
		color: red;
		line-height: 1;
	}

	.guess-section .title.clamp {
		float: left;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.paihangbImg {
		width: 40px;
		height: 40px;
		display: inline-block;
		overflow: hidden;
		position: relative;
		border-radius: 50%;
		line-height: 40px;
		vertical-align: middle;
	}
</style>
