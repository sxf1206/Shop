<template name="kefu">

	<view class="swiper-tab-bar">
		<!-- 状态栏 -->
		<view class="status" :style="{ position: headerPosition, top: headerTop, opacity: afterHeaderOpacity }"></view>

		<view class="header" :style="{ position: headerPosition, top: headerTop, opacity: afterHeaderOpacity }">
			<wuc-tab :tab-list="tabList3" textFlex :tabCur.sync="TabCur3" tab-class="bg-white" select-class="text-orange"
			 @change="headtabChange"></wuc-tab>

			<view style="display:flex;padding-left:20upx;margin-top:20upx;">
				<view class="addr" @click="showCity()">
					<view class="icon location"></view>{{city}}
				</view>
				<view class="input-box">
					<input placeholder="默认关键字" placeholder-style="color:#c0c0c0;" @tap="toSearch()" />
					<view class="icon search"></view>
				</view>				
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>

		<swiper :current="TabCur3" class="tabswiper" duration="300" @change="swiperChange3">
			<swiper-item v-for="(item, indextab) in tabList3" :key="indextab">
				<scroll-view class="swiperlist" scroll-y @scrolltolower="loadMore(indextab)">
					<view v-if="TabCur3 == 0">
						<!-- 轮播 -->
						<view class="carousel-section">
							<view class="titleNview-background" :style="{ backgroundColor: titleNViewBackground }"></view>
							<swiper class="carousel" circular autoplay="true" @change="swiperChange">
								<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="ChangeToDetailPage(item)">
									<image :src="item.ImageUrl" />
								</swiper-item>
							</swiper>
							<!-- 自定义swiper指示器 -->
							<view class="swiper-dots">
								<text class="num">{{ swiperCurrent + 1 }}</text>
								<text class="sign">/</text>
								<text class="num">{{ swiperLength }}</text>
							</view>
						</view>
						<!-- 分类 -->
						<view class="cate-section"  v-if="IsShow!=0">
							<scroll-view class="floor-list" scroll-x>
								<view class="scoll-wrapper">
									<view class="floor-item" style="width: 20%">
										<view class="cate-item" @click="navToList('','竞享优选')">
											<image src="https://www.chinaaos.com/static/temp/JXYX.png"></image>
											<text>竞享优选</text>
										</view>
									</view>
									<view class="floor-item" style="width: 20%" >
										<view class="cate-item" @click="navToList('JXService')">
											<image src="https://www.chinaaos.com/static/temp/JXFW.png"></image>
											<text>竞享服务</text>
										</view>
									</view>
									<view class="floor-item" style="width: 20%" >
										<view class="cate-item" @click="navToList('6ee6c76d-26d4-4efc-8a06-91108fe7cd88','美丽坊')">
											<image src="https://www.chinaaos.com/static/temp/mlf.png"></image>
											<text>美丽坊</text>
										</view>
									</view>
									<!-- <view class="floor-item" style="width: 20%" v-if="IsShow!=0">
										<view class="cate-item" @click="navToList('82a3fa31-15d0-4698-bf15-393dec9de4d2')">
											<image src="https://www.chinaaos.com/static/temp/stcp.jpg"></image>
											<text>生态产品</text>
										</view>
									</view> -->
									<view class="floor-item" style="width: 20%" >
										<view class="cate-item" @click="navToList('fb015fce-d34e-46b3-a778-4a25573e5da8','吃货街')">
											<image src="https://www.chinaaos.com/static/temp/chj.png"></image>
											<text>吃货街</text>
										</view>
									</view>
									<view class="floor-item" style="width: 20%" >
										<view class="cate-item" @click="navToList('090c07f3-d3e4-455f-b870-7ed7031b92c9','微课堂')">
											<image src="https://www.chinaaos.com/static/temp/JYPX.png"></image>
											<text>微课堂</text>
										</view>
									</view>
									<view class="floor-item" style="width: 20%" >
										<view class="cate-item" @click="navToList('c8c44dfb-c612-420a-b708-d92ab147ec43','童书馆')">
											<image src="https://www.chinaaos.com/static/temp/TSG.png"></image>
											<text>童书馆</text>
										</view>
									</view>
									<!-- <view class="floor-item" style="width: 20%" v-if="IsShow!=0">
										<view class="cate-item" @click="navToList('f5be8e32-072b-4067-b9a3-b9fbe60c1297')">
											<image src="https://www.chinaaos.com/static/temp/BAYZ.png"></image>
											<text>步道驿站</text>
										</view>
									</view> -->
								</view>
							</scroll-view>
						</view>

						<view class="ad-1" v-if="IsShow!=0">
							<image :src="advertisementimg" mode="scaleToFill" @click="advertisementToList()"></image>
						</view>

						<!--公告-->
						<view    class="uni-swiper-msg" style="background-color: white;margin-top: 6px;padding: 12px 9px; width: 95%;"  >
							<view class="uni-swiper-msg-icon" style="width: 22%;">
								<span style="font-size: 14px;">竞享头条</span>
							</view>
							<swiper vertical="true" autoplay="true" circular="true" interval="3000" style="ma">
								<swiper-item v-for="(item, index) in msg" :key="index" @click="NewToDetailPage(item)">
									{{item.Name}}
								</swiper-item>
							</swiper>
						</view>

						<!-- 秒杀楼层 -->
						<view class="seckill-section m-t" style="color: red;">
							<view class="s-header">
								爆款热卖
								<text class="tip">24h </text>
								<view class="uni-countdown">
									<view class="uni-countdown__number">{{ countdownnum.hh }}</view>
									<view class="uni-countdown__splitor">:</view>
									<view class="uni-countdown__number">{{ countdownnum.mm }}</view>
									<view class="uni-countdown__splitor">:</view>
									<view class="uni-countdown__number">{{ countdownnum.ss }}</view>

								</view>
							</view>
							<scroll-view class="floor-list" scroll-x>
								<view class="scoll-wrapper">
									<view v-for="(item, index) in flashsaleList" :key="index" class="floor-item" @click="navToDetailPage(item)">
										<image :src="item.ImagePath" mode="aspectFill"></image>
										<br />
										<div class="title clamp">{{ item.ProductName }}</div>
										<text class="price">￥{{ item.MinPrice }}</text>
									</view>
								</view>
							</scroll-view>
						</view>

						<!-- 团购楼层 -->
						<view class="f-header m-t">
							<image src="https://www.chinaaos.com/static/temp/h1.png"></image>
							<view class="tit-box">
								<text class="tit">拼团预售</text>
								<text class="tit2">Boutique Group Buying</text>
							</view>
							<text class="yticon icon-you"></text>
						</view>
						<view class="group-section">
							<swiper class="g-swiper" :duration="500">
								<swiper-item class="g-swiper-item" v-for="(item, index) in FightGroupList" :key="index" v-if="index % 2 === 0">
									<view class="g-item left" @click="navToDetailPageByUrl(index)">
										<image :src="item.ImagePath" mode="aspectFill"></image>
										<view class="t-box">
											<div class="title clamps">{{item.ProductName }}</div>
											<br />
											<view class="price-box">
												<text class="price">￥{{item.MinPrice }} <text style="float: right;font-size: 12px;" v-if="VIPType!=0">省·赚¥{{item.Para1}}</text></text>
												<!-- <text class="m-price">￥188</text> -->
											</view>

											<view class="pro-box">
												<view class="progress-box"><progress :percent="(item.OkGroupCount/item.GroupCount)*100" activeColor="#fa436a"
													 active stroke-width="6" /></view>
												<text>{{item.GroupCount }}人成团</text>
											</view>
										</view>
									</view>
									<view class="g-item right" @click="navToDetailPageByUrl(index+1)">
										<image :src="FightGroupList[index + 1].ImagePath" mode="aspectFill"></image>
										<view class="t-box">
											<div class="title clampss">{{ FightGroupList[index + 1].ProductName }}</div>
											<br />
											<view class="price-box">
												<text class="price">￥{{ FightGroupList[index + 1].MinPrice }} <text style="float: right;font-size: 12px;"
													 v-if="VIPType!=0">省·赚¥{{FightGroupList[index + 1].Para1}}</text></text>
											</view>
											<view class="pro-box">
												<view class="progress-box"><progress :percent="(FightGroupList[index + 1].OkGroupCount/FightGroupList[index + 1].GroupCount)*100"
													 activeColor="#fa436a" active stroke-width="6" /></view>
												<text>{{ FightGroupList[index + 1].GroupCount }}人成团</text>
											</view>
										</view>
									</view>
								</swiper-item>
							</swiper>
						</view>


						<view class="f-header m-t">
							<image src="https://www.chinaaos.com/static/temp/h1.png"></image>
							<view class="tit-box">
								<text class="tit">好货精选</text>
								<text class="tit2">Guess You Like It</text>
							</view>
							<text class="yticon icon-you"></text>
						</view>

						<view class="guess-section">
							<view v-for="(item, Guid) in LovelyList" :key="Guid" class="guess-item" @click="navToDetailPage(item)">
								<view class="image-wrapper">
									<image :src="item.ImagePath" mode="aspectFill"></image>
								</view>
								<text class="title clamp">{{item.ProductName}}</text>
								<text class="price">￥{{item.MinPrice}} <text style="float: right;font-size: 12px;" v-if="VIPType!=0">省·赚¥{{item.Para1}}</text>
								</text>
							</view>
						</view>

					</view>
					<view v-if="TabCur3 == 1" >
						<block v-if="guanzhuswiperList.length>0">
							<guanzhu :gzdata="guanzhuswiperList"></guanzhu>
						</block>
					</view>
					<view v-if="TabCur3 >= 2" >	

						<block v-if="tabItemdata.length>0">
							<uni-media-list :Mediadata="tabItemdata" :tabCur.sync="TabCur3"></uni-media-list>
						</block>

					</view>
				
				<view class="loading-more" v-if="isLoading==true">
					<text class="loading-more-text">{{loadingText}}</text>
				</view>
				</scroll-view>
			</swiper-item>
		</swiper>

        <block  v-if="TabCur3 >= 2" >
		<view class="Diaryheader">			
			<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" tab-class="bg-white wuc-tab d_fixed" select-class="text-blue"
			 @change="tabChange"></wuc-tab>
			
		</view>
		
        	<view class="btn-plusempty" @click="addCustomer" v-if="IsShow!=0">
        		<image src="https://www.chinaaos.com/static/jiahao.png" class="plusempty-img"></image>
        	</view>        	
        </block>

		<uni-popup :show="showtypes === 'middle-img'" position="middle" mode="insert" @hidePopup="togglePopup('')" v-if="IsShowAD==1">
			<view class="uni-center center-box">
				<image class="image" :src="ADpic" @tap="changeurl" />
			</view>
		</uni-popup>

	</view>

</template>


<script>
	import {
		mapState
	} from 'vuex';
	import amap from '@/common/SDK/amap-wx.js';
	import WucTab from '@/components/wuc-tab.vue';
	import uniMediaList from '@/components/tab-nvue/mediaList.vue';
	import guanzhu from '@/components/guanzhu.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
    var pagecount=0,page=1;
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType', 'IsShow']),
		data() {
			return {
				titleNViewBackground: '#fff',
				swiperCurrent: 0,
				swiperLength: 0,
				afterHeaderOpacity: 1, //不透明度
				headerPosition: 'fixed',
				zindex: 88,
				headerTop: null,
				city: '上海',
				//分类信息
				tabList3: [{
						name: '推荐'
					},
					{
						name: '关注'
					},
					{
						name: '日记'
					}
				],
				TabCur3: 0,
				TabCur: 0,
				guanzhuswiperList: [],
				tabItemdata: [],
				tabItemdata2: [],
				tabList: [{
					name: 'Young'
				}, {
					name: '享说'
				}, {
					name: '好课'
				}, {
					name: '心愿墙'
				}],
				categoryHeight: '150px',
				currentPageindex: 0,
				isLoading:false,
				loadingText: '正在加载...',
				carouselList: [],
				goodsList: [],
				flashsaleList: [],
				FightGroupList: [],
				choicegoodsList: [],
				LovelyList: [],
				msg: [],
				visible: true,
				showtypes: "middle-img",
				ADUrl: "",
				ADpic: "",
				IsShowAD: 0,
				advertisementimg: "",
				advertisementurl: "",
				countdownnum: {
					hh: 0,
					mm: 0,
					ss: 0
				}
			};
		},
		name: "kefu",
		props: {
			qq: {
				type: Number,
				default: 3112949144
			},
			damping: {
				type: Number,
				default: 10
			},
			direction: {
				type: String,
				default: "all"
			},
			position: {
				type: Number,
				default: 4
			}
		},
		onLoad() {
			this.countTime();
			this.getList();
			this.getListGoods();
			//#ifdef APP-PLUS
			var model = ''; //手机型号
			var platform = ''; //客户端平台
			uni.getSystemInfo({
				success: (res) => {
					model = res.model;
					platform = res.platform;
				}
			})
			console.log(plus.push.getClientInfo().clientid);
			console.log(plus.runtime.appid);
			console.log(uni.getStorageSync('Account'));
			console.log(model);
			console.log(platform);

			if (this.Account) {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					method: 'GET',
					data: {
						req: 'setAPPId',
						account: this.Account,
						types: plus.push.getClientInfo().clientid,
						appid: plus.runtime.appid,
						model: model,
						platform: platform
					},
					success: res => {
						console.log("plus_Info Ok!" + res.data.strSQL);
					},
					complete: res => {

					}
				});
			}
			//#endif

		},
		//下拉刷新
		onPullDownRefresh() {	
			page=1;
			pagecount=0;
			if(this.TabCur3==0){				
				this.getList();
				this.LovelyList=[];
				this.getListGoods();
			}
			if(this.TabCur3==1){
				if(this.Account){
					this.guanzhuswiperList = [];
					this.guanzhusList();
				}				
			}
			if(this.TabCur3==2){
				this.tabItemdata=[];
				this.getDiarysList(this.TabCur);
			}	
		},
		components: {
			WucTab,
			uniMediaList,
			guanzhu,
			uniPopup
		},
		methods: {
			addCustomer() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/LoginWChat'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/AddDiary/AddDiary'
				});

			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.carouselList[index].background;
			},
			headtabChange(index) {				
				this.TabCur = 0;
			},
			tabChange(index) {
				this.TabCur = index;
				this.tabItemdata=[];
				page=1;
				pagecount=1;
				this.getDiarysList(index);
			},
			loadMore(e) {
				if(e=="0"){
					if(pagecount<=this.LovelyList.length){
						this.isLoading=true;
						this.loadingText="- 我是有底线的 -";
						return;
					}					
					this.getListGoods();
				}
				if(e=="1"){					
					if(pagecount<=this.guanzhuswiperList.length){
						this.isLoading=true;
						this.loadingText="- 我是有底线的 -";
						return;
					}
					 this.guanzhusList();
				}
				if(e=="2"){
					if(pagecount<=this.tabItemdata.length){
						this.isLoading=true;
						this.loadingText="- 我是有底线的 -";
						return;
					}
					this.getDiarysList(this.TabCur);
				}			
			},
			swiperChange3(e) {
				this.isLoading=false;
				pagecount=0;
				page=1;
				let {current} = e.target;
				this.TabCur3 = current;
				if (current == "1") {
					if (!this.hasLogin) {
						uni.navigateTo({
							url: '/pages/LoginWChat',
						});
						return;
					}
					this.guanzhuswiperList = [];
					this.guanzhusList();
				}
				if (current == "2") {
					this.tabItemdata = [];
					this.getDiarysList('0');
				}
			},
			toSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			selcity() {
				uni.navigateTo({
					url: '/pages/tabbar/home/selcity'
				})
			},
			showCity() {
				uni.navigateTo({
					url: '/pages/tabbar/selcity'
				})
			},
			//详情页
			navToDetailPage(item) {
				let id = item.Url;
				uni.navigateTo({
					url: '/pages/Product/ProductDetail?gid=' + id
					//url: '/pages/Product/ProductDetail?scene=JR3yMf'
				});
			},
			ChangeToDetailPage(item) {
				let id = item.Url;
				uni.navigateTo({
					url: id
				});
			},
			navToDetailPageByUrl(index) {
				var url = this.FightGroupList[index].Url;
				uni.navigateTo({
					url: '/pages/Product/ProductDetail?gid=' + url
				});
			},
			NewToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.Guid;
				uni.navigateTo({
					url: '/pages/MsgDetail/MsgDetail?gid=' + id
				});
			},			
			getList() {				
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					method: 'GET',
					data: {
						req: 'APPBannerList',
						account: '',
						IsShow:this.IsShow
					},
					success: res => {
						var PList = res.data.FightGroup;
						this.swiperLength = res.data.banner.length;
						res.data.banner.forEach(item => {
							item.ImageUrl = "https://www.chinaaos.com" + item.ImageUrl;
						});
						res.data.flashsale.forEach(item => {
							item.ImagePath = "https://www.chinaaos.com" + item.ImagePath;
						});
						PList.forEach(item => {
							item.ImagePath = "https://www.chinaaos.com" + item.ImagePath;
							var p = (parseFloat(item.MinPrice) - parseFloat(item.SettlementPrice)) * 0.4;
							item.Para1 = p.toFixed(2);
						});			
						this.carouselList = res.data.banner;
						this.flashsaleList = res.data.flashsale;
						this.FightGroupList = this.FightGroupList.concat(PList);
						this.msg = res.data.NewList;
						var mmss = res.data.Advertisement[0];
						this.advertisementimg = "https://www.chinaaos.com" + mmss.ImageUrl;
						this.advertisementurl = mmss.Url;
						//广告
						this.ADUrl = res.data.ADUrl;
						this.ADpic = res.data.ADpic;
						this.IsShowAD = res.data.IsShowAD;
					},
					fail: e => {
						//this.isLoading = true;
					},
					complete: res => {
						//this.isLoading = false;
					}
				});
			
			},
			getListGoods(){
				this.isLoading=true;
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
						this.pagecount=res.data.LovelyCount;						
						this.LovelyList = this.LovelyList.concat(res.data.Lovely);
						page++;
					},
					fail: e => {
						this.isLoading = true;
					},
					complete: res => {
						this.isLoading = false;
					}
				});	
			},
			changeurl() {
				uni.navigateTo({
					url: './ADDetail?url=' + this.ADUrl
				});
			},
			advertisementToList() {
				console.log(this.advertisementurl);
				uni.navigateTo({
					url: this.advertisementurl
				});
			},
			navToList(id,t) {
				if (id == "") {
					uni.navigateTo({
						url: "/pages/Product/listbigType?fid=&sid=&tid=&title="+t
					})
				} else if (id == "JXService") {
					uni.navigateTo({
						url: "/pages/tabbar/home/JXService"
					});
				} else {
					uni.navigateTo({
						url: "/pages/Product/listbigType?fid="+id+"&sid="+id+"&tid="+id+"&title="+t
					})
				}
			},
			getDiarysList(v) {
				var Account = this.Account;	
				this.isLoading =true;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					method: 'GET',
					data: {
						req: 'GetDiarys',
						account: Account,
						types: v,
						page:page,
						IsShow:this.IsShow
					},
					success: res => {
						if(res.data.DList.length>0){
							pagecount=res.data.DListCount;
							res.data.DList.forEach(item => {
								item.ImgList = "https://www.chinaaos.com" + JSON.parse(item.ImgList)[0];
								item.UserName=this.UserNamesubstring(item.UserName);
							});
							this.tabItemdata = this.tabItemdata.concat(res.data.DList);
							page++;
						}						
					},
					fail: e => {
						this.isLoading=true;
					},
					complete: res => {
						this.isLoading = false;
					}
				});
			},
			guanzhusList() {				
				this.isLoading = true;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					method: 'GET',
					data: {
						req: 'GetGZDiaryslist',
						account: this.Account,
						page:page
					},
					success: res => {			
						if(res.data.DList.length>0){
							pagecount=res.data.DListCount;
							res.data.DList.forEach(item => {
								item.ImgList = "https://www.chinaaos.com" + JSON.parse(item.ImgList)[0];
								item.UserName=this.UserNamesubstring(item.UserName);
							});
							this.guanzhuswiperList = this.guanzhuswiperList.concat(res.data.DList);
							page++;
						}
						
					},fail: e => {
						this.isLoading=true;
					},
					complete: res => {
						if(this.guanzhuswiperList.length==0){
							this.isLoading=true;
							this.loadingText="暂无关注";
						}else{
							this.isLoading = false;
						}
					}
				});

			},
			UserNamesubstring(v){
				if(v.length>8){
					return v.substring(0,8)+"...";
				}
				return v;				
			},

			onTap() {
				//#ifdef H5
				uni.setClipboardData({
					data: this.qq
				});
				uni.showModal({
					title: "客服QQ",
					content: this.qq.toString(),
					confirmText: "复制成功",
					showCancel: false
				});
				var locatUrl = "mqqapi://card/show_pslcard?src_type=internal&version=1&uin=" + this.qq +
					"&card_type=person&source=sharecard";
				var ifr = document.createElement("iframe");
				ifr.src = locatUrl;
				ifr.style.display = "none";
				document.body.appendChild(ifr);
				//#endif
				//#ifdef APP-PLUS
				plus.runtime.openURL("mqqapi://card/show_pslcard?src_type=internal&version=1&uin=" + this.qq +
					"&card_type=person&source=sharecard",
					function(res) {
						console.log(res);
					});
				//#endif
				console.log("tap")
			},
			togglePopup(type) {
				this.showtypes = type
			},
			countTime() {
				var that = this;
				var date = new Date();
				var now = date.getTime();
				var eee = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 23:59:59';
				var endDate = new Date(eee); //设置截止时间
				var end = endDate.getTime();
				var leftTime = end - now; //时间差                              
				var d, h, m, s, ms;
				if (leftTime >= 0) {
					d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
					h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
					m = Math.floor(leftTime / 1000 / 60 % 60);
					s = Math.floor(leftTime / 1000 % 60);
					ms = Math.floor(leftTime % 1000);
					ms = ms < 100 ? "0" + ms : ms
					s = s < 10 ? "0" + s : s
					m = m < 10 ? "0" + m : m
					h = h < 10 ? "0" + h : h,
						Object.assign(this.countdownnum, {
							hh: h,
							mm: m,
							ss: s
						})
					//递归每秒调用countTime方法，显示动态时间效果
					setTimeout(that.countTime, 100);
				} else {
					console.log('已截止')
				}
			}

		}
	};
</script>
<style lang="scss">
	@font-face {
		font-family: "HMfont-home";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
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
				color: #000000;
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

	page {
		background-color: #f5f5f5;
		height: 100%;
	}

	.swiper-tab-bar {
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		height: 100%;
		background-color: #f8f8f8;
	}

	.swiper-tab-bar .tabswiper {
		height: calc(100% - 164upx);
		/*  #ifdef  APP-PLUS  */
		height: calc(100% - 100upx);
		padding-bottom: 104upx;
		/*  #endif  */
	}

	.swiper-tab-bar .swiperlist {
		width: 750upx;
		height: 100%;
	}

	.cu-bar {
		display: flex;
		position: relative;
		align-items: center;
		min-height: 100upx;
		justify-content: space-between;
	}

	.cu-bar .action {
		display: flex;
		align-items: center;
		height: 100%;
		justify-content: center;
		max-width: 100%;
		background-color: #ffffff;
	}

	.cu-bar .action:first-child {
		margin-left: 30upx;
		font-size: 30upx;
	}

	.solid,
	.solid-bottom {
		position: relative;
	}

	.solid::after,
	.solid-bottom::after {
		content: ' ';
		width: 200%;
		height: 200%;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: inherit;
		transform: scale(0.5);
		transform-origin: 0 0;
		pointer-events: none;
		box-sizing: border-box;
	}

	.solid::after {
		border: 1upx solid rgba(0, 0, 0, 0.1);
	}

	.solid-bottom::after {
		border-bottom: 1upx solid rgba(0, 0, 0, 0.1);
	}

	.text-orange {
		color: #333333;
	}

	.padding {
		padding: 30upx;
		margin: 30upx;
	}

	.margin-top {
		margin-top: 30upx;
	}

	.bg-white {
		background-color: #fff;
		color: #333333;
		text-align: center;
	}
	
	.Diaryheader {
		width: 100%;
		align-items: center;
		position: fixed;
		top: 164rpx;
		z-index: 10;		
		display: initial;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
	}

	.header {
		width: 100%;
		height: 164upx;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		display: initial;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
	}

	.header .addr {
		width: 130upx;
		height: 60upx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		font-size: 28upx;
	}

	.header .addr .icon {
		height: 60upx;
		margin-right: 5upx;
		display: flex;
		align-items: center;
		font-size: 42upx;
		color: #ffc50a;
	}

	.header .input-box {
		width: 78%;
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
		margin-right: -22px;
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

	.uni-list:after {
		height: 0;
	}

	.place {
		
		height: 164upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: 205upx;
		// var(--status-bar-height);
		/*  #endif  */
	}

	.m-t {
		margin-top: 16upx;
	}

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		// padding-top: 10px;

	}

	.carousel-section .titleNview-placing {
		height: var(--status-bar-height);
		padding-top: 44px;
		box-sizing: content-box;
	}

	.carousel-section .titleNview-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 350upx; 
		transition: 0.4s;
	}

	.carousel {
		width: 100%;
		height: 350upx;
	}

	.carousel .carousel-item {
		width: 100%;
		height: 100%;
		padding: 0upx;
		overflow: hidden;
	}

	.carousel image {
		width: 100%;
		height: 100%;
		border-radius: 10upx;
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;
	}

	.swiper-dots .num {
		width: 36upx;
		height: 36upx;
		border-radius: 50px;
		font-size: 24upx;
		color: #fff;
		text-align: center;
		line-height: 36upx;
	}

	.swiper-dots .sign {
		position: absolute;
		top: 0;
		left: 50%;
		line-height: 36upx;
		font-size: 12upx;
		color: #fff;
		transform: translateX(-50%);
	}


	.swiper-view .swiper {
		width: 100%;
		height: 380upx;
	}

	.swiper-view .swiper.swiper-view .swiper image {
		width: 100%;
		height: 380upx;
	}




	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;
		// margin-top: 28px;
	}

	.cate-section .cate-item {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* 原图标颜色太深,不想改图了,所以加了透明度 */
	.cate-item image {
		width: 88upx;
		height: 88upx;
		margin-bottom: 14upx;
		border-radius: 50%;
		opacity: 0.7;
		box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
	}

	.ad-1 {
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		background: #fff;
	}

	.ad-1 image {
		width: 100%;
		height: 100%;
	}


	/* 秒杀专区 */
	.seckill-section {
		padding: 4upx 30upx 24upx;
		background: #fff;
	}

	.seckill-section .s-header {
		display: flex;
		align-items: center;
		height: 92upx;
		line-height: 1;
	}

	.seckill-section .s-header .s-img {
		width: 140upx;
		height: 30upx;
	}

	.seckill-section .s-header .tip {
		color: #747474;
		margin: 0 20upx 0 40upx;
	}

	.seckill-section .s-header .timer {
		display: inline-block;
		width: 40upx;
		height: 36upx;
		text-align: center;
		line-height: 36upx;
		margin-right: 14upx;
		color: #fff;
		border-radius: 2px;
		background: rgba(0, 0, 0, 0.8);
	}

	.seckill-section .s-header .icon-you {
		color: #747474;
		flex: 1;
		text-align: right;
	}


	.seckill-section .floor-list {
		white-space: nowrap;
	}

	.floor-list {
		white-space: nowrap;
	}


	.seckill-section .scoll-wrapper {
		display: flex;
		align-items: flex-start;
		height: 139px;
	}

	.scoll-wrapper {
		display: flex;
		align-items: flex-start;
	}

	.seckill-section .floor-item {
		width: 150upx;
		margin-right: 20upx;
		color: #747474;
		line-height: 1.8;
		height: 139px;
		float: left;
	}

	.floor-item {
		margin-right: 25px;
		color: #747474;
		line-height: 1.8;
		float: left;
	}

	.seckill-section .floor-item image {
		width: 150upx;
		height: 150upx;
		border-radius: 6upx;
	}

	.seckill-section .floor-item .price {
		float: left;
		color: red;
	}

	.seckill-section .title.clamp {
		float: left;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}



	.f-header {
		display: flex;
		align-items: center;
		height: 140upx;
		padding: 6upx 30upx 8upx;
		background: #fff;
	}

	.f-header image {
		flex-shrink: 0;
		width: 80upx;
		height: 80upx;
		margin-right: 20upx;
	}

	.f-header .tit-box {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.f-header .tit {
		color: #747474;
		line-height: 1.3;
	}

	.f-header .tit2 {
		color: #747474;
	}

	.f-header .icon-you {
		color: #747474;
	}



	/* 团购楼层 */
	.group-section {
		background: #fff;

	}

	.group-section .g-swiper {
		height: 650upx;
		padding-bottom: 30upx;
	}

	.group-section .g-swiper-item {
		width: 100%;
		padding: 0 30upx;
		display: flex;
	}

	.group-section image {
		width: 100%;
		height: 460upx;
		border-radius: 4px;
	}

	.group-section .g-item {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.group-section .left {
		flex: 1.2;
		margin-right: 24upx;
	}

	.group-section .left .t-box {
		padding-top: 20upx;
	}

	.group-section .right {
		flex: 0.8;
		flex-direction: column-reverse;

	}

	.group-section .right .t-box {
		padding-bottom: 20upx;
	}

	.group-section .t-box {
		height: 160upx;
		color: #747474;
		line-height: 1.6;
	}

	.group-section .price {
		color: red;
	}

	.group-section .m-price {
		text-decoration: line-through;
		color: #747474;
		margin-left: 8upx;
	}

	.group-section .pro-box {
		display: flex;
		align-items: center;
		margin-top: 10upx;
		color: #747474;
		padding-right: 10upx;
	}

	.group-section .progress-box {
		flex: 1;
		border-radius: 10px;
		overflow: hidden;
		margin-right: 8upx;
	}

	.group-section .title.clamps {
		float: left;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.group-section .title.clampss {
		float: left;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}



	/* 猜你喜欢 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

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





	////
	.pubu {
		width: calc(100% - 16px);
		margin-left: 8px;
		padding-top: 16upx;
	}

	.yg img {
		width: 100%;
		border-radius: 8px 8px 0 0;
	}

	.yg p {
		line-height: 44upx;
		font-size: 26upx;
		padding: 0 10px 5px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		color: #333333;
	}

	.yg_l,
	.yg_r {
		width: calc(50% - 5px);
	}

	.yg li {
		background: #fff;
		margin-bottom: 10px;
		border-radius: 8px;
	}

	.yg_l {
		float: left;
	}

	.yg_r {
		float: right;
	}

	.u_xinx {
		margin: 4px 0;
		padding: 0 10px 5px
	}

	.u_xinx img {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		display: inline-block;
	}

	.u_xinx span {
		position: relative;
		top: -5px;
		color: #333333;
		font-size: 24upx;
		margin-left: 10upx;
	}



	.btn-plusempty {
		width: 49px;
		height: 49px;
		background: #fff;
		position: fixed;
		z-index: 10;
		bottom: 50upx;
		right: 20upx;
		border-radius: 100%;
		text-align: center;
		line-height: 110upx;
	}

	.plusempty-img {
		width: 50px;
		height: 50px;
	}

	.bottom-btn-hover {
		background: #0564c7 !important;
		;
	}



	//广告
	.center-box {
		width: 500upx;
		height: 760upx;
	}

	.uni-popup-middle {
		top: 56% !important;
	}

	.uni-mask {
		z-index: 999 !important;
	}

	.uni-list-item {
		text-align: left;
		line-height: 80upx;
		border-bottom: 1px #f5f5f5 solid;
	}

	.uni-list-item:last-child {
		border: none;
	}

	.center-box .image {
		width: 100%;
		height: 100%;
	}

	.bottom-title {
		line-height: 60upx;
		font-size: 24upx;
		padding: 15upx 0;
	}

	.bottom-content {
		display: flex;
		flex-wrap: wrap;
		padding: 0 35upx;
	}

	.bottom-content-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 15upx;
		width: 25%;
		box-sizing: border-box;
	}

	.bottom-content-image {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 90upx;
		height: 90upx;
		overflow: hidden;
		background: #007aff;
		border-radius: 10upx;
	}

	.bottom-content-text {
		font-size: 26upx;
		color: #333;
		margin-top: 10upx;
	}

	.bottom-btn {
		height: 90upx;
		line-height: 90upx;
		border-top: 1px #f5f5f5 solid;
	}

	.bottom-content-image.wx {
		background: #00ce47;
	}

	.bottom-content-image.qq {
		background: #00b6f6;
	}

	.bottom-content-image.sina {
		background: #ff766a;
	}

	.bottom-content-image.copy {
		background: #07ccd0;
	}

	.icon {
		font-family: 'iconfont';
		font-size: 40upx;
		color: #fff;
	}

	.uni-close-bottom:after {
		content: '';
		position: absolute;
		width: 0px;
		border: 0px #f5f5f5 solid !important;
		top: 0px !important;
		bottom: 30px;
		left: 50%;
		-webkit-transform: translate(-50%, -0%);
		-ms-transform: translate(-50%, -0%);
		transform: translate(-50%, -0%);
		opacity: 0.8;
	}

	.uni-close-bottom,
	.uni-close-right {
		position: absolute;
		bottom: -54px !important;
		text-align: center;
		border-radius: 50%;
		color: #f5f5f5;
		font-size: 33px;
		font-weight: bold;
		opacity: 0.8;
		z-index: -1;
	}

	.uni-countdown {
		padding: 2upx 0;
		display: inline-flex;
		flex-wrap: nowrap;
		justify-content: center
	}

	.uni-countdown__splitor {
		color: #000000;
		justify-content: center;
		line-height: 44upx;
		padding: 0 5upx;
		font-size: 28upx
	}

	.uni-countdown__number {
		line-height: 44upx;
		justify-content: center;
		height: 44upx;
		border-radius: 6upx;
		margin: 0 5upx;
		font-size: 28upx;
		border: 1px solid #000;
		font-size: 24upx;
		padding: 0 10upx;
		border-color: black;
		color: #FFFFFF;
		background: black;
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
