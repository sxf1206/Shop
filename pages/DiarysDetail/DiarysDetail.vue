<template>
	<view  >
		<view class="guanzhu-swiper-view">
						<view class="uni-flex">
							<view style="height: 50px;"><image :src="headimg" style="width: 50px;height: 50px;border-radius: 100%;"></image></view>
							<view class="grace-news-list-title " style="flex: 1;">{{ UserName }}</view>
							<view class="grace-news-list-title-num">
								<view class="grace-news-list-guanzhu"  @click="guanzhu">{{ isGuanZhu=='1'?'已关注':'关注' }}</view>						
								<!--#ifdef APP-PLUS -->
								<image src="https://www.chinaaos.com/static/guanzhu_06.png"  @click="share"></image>
								<!--#endif-->
								
								
							</view>
						</view>
		
						<swiper indicator-dots="true"  :style="{ height: SwiperHeight}"   autoplay="true" interval="8000"   @change="change">
							<swiper-item class="swiper-item" v-for="(item, index) in swiperList" :key="index">
								<image   :src="item.src"   mode="widthFix"  ></image>						
								</swiper-item>
						</swiper>
		
						<view class="uni-padding-wrap uni-common-mt" v-if="isGoodsShow == true">
							<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll">
								<view class="scroll-view-item_H" v-for="(item, index) in Goodsarry" :key="index" @click="navToDiaryDetailPage(item)">
									<view class="uni-flex">
										<view style="width: 144upx;"><image class="product-img" :src="item.ThumbnailsUrl" mode="aspectFill"></image></view>
										<view style="flex: 1;margin-left: 20upx;">
											<view class="product-name">{{ item.ProductName }}</view>
											￥{{ item.SalePrice }} 购买
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
		
						<view class="grace-news-list-text"   v-html="desc">	</view>
						<view class="uni-flex">
							<view class="Time">{{DiaryTime}}</view>
							<view style="flex: 1;text-align: right;">
								<image :src="islike === 0 ? 'https://www.chinaaos.com/static/guanzhu.png' : '/static/guanzhuactive.png'" style="width: 26px;height: 25px;" @tap="like()"></image>
								{{ LikedNumber }}
								<image
									:src="isCollection === 0 ? '/static/guanzhu_17.png' : '/static/guanzhu_177.png'"
									@tap="Collection()"
									style="width: 25px;height: 24px;margin-left: 40upx;"
								></image>
								{{ CollectionNumber }}						
								
								<!--#ifdef MP-WEIXIN || MP-BAIDU -->
								<button class="icon fenxiang" type="primary" open-type="share" style="background-color: initial; line-height:33px;height:33px; color: initial;display: initial;padding: 0;margin-left: 12px;
		">
								 </button>
								<!--#endif-->
							</view>
						</view>
		
						
						
					</view>
		
		
		
		<view style="margin:0 15px 15px;border-top: solid 1rpx #f5f5f5;padding-top:10px;"  v-if="IsShow!=0">
			<!-- 评论区 start -->
			<view>共{{ CommentNumber }}条评论</view>
			
			<view class="uni-comment" v-if="CommentList.length > 0">
				<view class="uni-comment-list" v-for="(item, index) in CommentList" :key="index">
					<view class="uni-comment-face"><image :src="item.Photo" mode="widthFix"></image></view>
					<view class="uni-comment-body">
						<view class="uni-comment-top">
							<text>{{ item.UserName }}</text>
						</view>
						<view class="uni-comment-content">
							<rich-text :nodes="item.Content"></rich-text>
							<view class="commenttime">{{ item.CreateTime }}</view>
						</view>
						<!-- <view class="uni-comment-date">
							<view>2天前</view><view class="uni-comment-replay-btn">5回复</view>
						</view> -->
					</view>
				</view>
				
			</view>
			<!-- 评论区 end -->
						
			<view class="loading-more" v-if="isLoading==true">
				<text class="loading-more-text">{{loadingText}}</text>
			</view>
		</view>
		
		
		<!-- 输入框 -->
		<view class="input-box" :class="popupLayerClass" v-if="IsShow!=0" >
			<view class="textbox">
				<view class="text-mode">
					<view class="box"><textarea auto-height="true" :value="textMsg" :cursor="cursor" @input="textareaBlurEvent" placeholder="请输入..." /></view>
					<view class="em" @tap="chooseEmoji"><faIcon type="smile-o " size="28"></faIcon></view>
				</view>
			</view>
			<view class="send" @tap="sendmsg()"><view class="btn">发送</view></view>
		</view>
		
		<!-- 抽屉栏  @touchmove.stop.prevent="discard" -->
		<view class="popup-layer" :class="popupLayerClass">
			<!-- 表情 -->
			<swiper class="emoji-swiper" :class="{ hidden: hideEmoji }" indicator-dots="true" duration="150">
				<swiper-item v-for="(page, pid) in emojiList" :key="pid">
					<view v-for="(em, eid) in page" :key="eid" @tap="addEmoji(em)">
						<image mode="widthFix" :src="'https://www.chinaaos.com/Images/emoji/' + em.url"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- 分享 -->
		<!-- share弹窗 -->
		<view class="share" :class="shareClass" @touchmove.stop.prevent="discard" @tap="hideShare">
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="h1">分享</view>
				<view class="list">
					<view class="box">
						<image src="https://www.chinaaos.com/static/wx.png"></image>
						<view class="title">微信好友</view>
					</view>
					<view class="box">
						<image src="https://www.chinaaos.com/static/pyq.png"></image>
						<view class="title">朋友圈</view>
					</view>
					<view class="box">
						<image src="https://www.chinaaos.com/static/wb.png"></image>
						<view class="title">新浪微博</view>
					</view>
					<view class="box">
						<image src="https://www.chinaaos.com/static/qq.png"></image>
						<view class="title">QQ</view>
					</view>
				</view>
				<view class="btn" @tap="hideShare"  style="border: 0;border-top: 0;">取消</view>
			</view>
		</view>
	
	
	
	
	</view>
</template>

<script>
var util = require('@/utils/util.js');
import faIcon from '@/components/fa-icon/fa-icon.vue';
import { EmojiList, EmojiAll } from '@/common/emoji.js';
import {mapState} from 'vuex';	
export default {
	computed:mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo','IsShow']),
	components: {
		faIcon
	},
	data() {
		return {
			Guid: '',
			headimg: 'https://www.chinaaos.com/static/mlfz_touimg.jpg',
			UserName: '',
			UserAccount: '',
			SwiperHeight:'300px',
			swiperList: [],
			desc: '',
			LikedNumber: '',
			CollectionNumber: '',
			CommentNumber: 0,
			isGuanZhu: 0,
			islike: 0,
			isCollection: 0,
			isGoodsShow: false,
			Goodsarry: [],
			// 聊天输入框相关
			textMsg: '', //输入文本
			cursor: 0, //输入框中光标位置
			CommentList: [],
			// 表情包 自己上传图床，我的图床不定期会删除，100K/秒的最大速度，请放过。。。。。
			emojiList: EmojiList,
			hideEmoji: false, //隐藏表情
			//弹出抽屉
			popupLayerClass: '', //打开抽屉的类
			hideMore: true, //隐藏更多控制
			shareClass: '',
			tjaccount:'',
			DiaryTime:'',
			pagecount: 0,
			page: 1,
			isLoading:false,
			loadingText: '正在加载...',
		};
	},	
	onShareAppMessage() {
		return {
			title: this.desc ? this.desc : "欢迎",
			path: "/pages/DiarysDetail/DiarysDetail?dguid=" + this.Guid+ "&tjaccount=" + this.UserAccount +
					"&tjGoodsSource=1",
			imageUrl: '',
		}
	},
	onLoad(option) {		
		var gid = option.dguid;
		this.Guid = gid;
		
		// #ifdef MP
		if(option.tjaccount){
			this.tjaccount=option.tjaccount;					
		}
		//小程序隐藏返回按钮
		this.showBack = false;
		// #endif
		this.init(gid);
		this.DiaryCommentList(gid);
	},
	//下拉刷新
	onPullDownRefresh() {
		this.page = 1;
		this.pagecount=0;
		this.init(this.Guid);
		this.DiaryCommentList(this.Guid);
	},
	//加载更多
	onReachBottom() {		
		if(this.pagecount<=this.CommentList.length){
			this.isLoading=true;
			this.loadingText="- 我是有底线的 -";
			return;
		}			
		this.DiaryCommentList(this.Guid);
	},
	methods: {
		change:function(e){			
		   let img = this.swiperList[e.detail.current].src;
			this.GetSwiperHeight(img);
		},
		GetSwiperHeight(e){
			 var winWid = uni.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度		
			uni.getImageInfo({
				src: e
			}).then(image => {				
				var imgh=image[1].height;//图片高度
				var imgw=image[1].width;//图片宽度
				var swiperH= parseFloat(winWid*imgh/imgw).toFixed(2) + "px"//等比设置swiper的高度。  即 屏幕宽度 / swiper高度 =
				this.SwiperHeight=swiperH;
			});
		},
		init(i) {
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				data: {
					req: 'GetDiaryDetail',
					gGuid: i,
					account: this.Account
				},
				success: result => {
					this.UserAccount=result.data.DiarysInfo[0]['Account'];
					this.UserName = result.data.DiarysInfo[0]['UserName'];
					this.headimg = result.data.DiarysInfo[0]['Photo'];
					var ImgList = JSON.parse(result.data.DiarysInfo[0]['ImgList']);					
					this.GetSwiperHeight('https://www.chinaaos.com'+ImgList[0]);
					ImgList.forEach(item => {
						var ll = {
							src: 'https://www.chinaaos.com' + item
						};
						this.swiperList.push(ll);
					});
					this.desc = result.data.DiarysInfo[0]['Contents'];
					this.islike = result.data.DiarysInfo[0]['islike'];
					this.isCollection = result.data.DiarysInfo[0]['isCollection'];
					this.LikedNumber = result.data.DiarysInfo[0]['LikedNumber'];
					this.CollectionNumber = result.data.DiarysInfo[0]['CollectionNumber'];
					this.CommentNumber = result.data.DiarysInfo[0]['CommentNumber'];
					this.DiaryTime=util.getDateDiff(result.data.DiarysInfo[0]['CreateTime']);
					var g = result.data.DGoodsList;
					if (g.length > 0) {
						this.isGoodsShow = true;
						g.forEach(item => {
							item.ThumbnailsUrl = 'https://www.chinaaos.com' + item.ThumbnailsUrl;
							item.ProductName = item.ProductName.substring(0, 10) + '...';
						});
						this.Goodsarry = g;
					}					
				},
				complete: res => {					
				},				
				fail: e => {
					
				}
			});
		},
		DiaryCommentList(i) {
			this.isLoading=true;
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				data: {
					req: 'GetDiaryDetailComment',
					gGuid: i,
					account: this.Account,
					page:this.page
				},
				success: result => {					
					if(result.data.CommentListCount>0){
						this.pagecount=result.data.CommentListCount;
						result.data.CommentList.forEach(item => {
							item.UserName = item.UserName;
							item.CreateTime = util.getDateDiff(item.CreateTime);
						});
						this.CommentList =this.CommentList.concat(result.data.CommentList) ;
						this.page++;
					}				
				},
				fail: e => {
					this.isLoading=true;
				},complete: res => {
					this.isLoading = false;						
				}
			});
		},
		like(index) {
			if(!this.hasLogin){						
				uni.navigateTo({
					url: '/pages/LoginWChat',
				});		
				return;
			}	
			var guids = this.Guid;
			if (this.islike === 0) {
				this.islike = 1;
				this.LikedNumber = this.LikedNumber + 1;
			} else {
				this.islike = 0;
				this.LikedNumber = this.LikedNumber - 1;
			}
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				method: 'GET',
				data: {
					req: 'SetLike',
					account: this.Account,
					dguid: guids
				},
				success: res => {},
				complete: res => {
					//uni.hideLoading();
					//uni.stopPullDownRefresh();
				}
			});
		},
		scroll: function(e) {
			//console.log(e);
			//this.old.scrollTop = e.detail.scrollTop
		},
		navToDiaryDetailPage(item) {
			let id = item.ProductId;
			uni.navigateTo({
				url: '/pages/Product/ProductDetail?gid=' + id+"&tjaccount="+this.UserAccount+"&tjGoodsSource=1"
			});
		},
		Collection(index) {
			if(!this.hasLogin){						
				uni.navigateTo({
					url: '/pages/LoginWChat',
				});		
						return;
			}	
			var guids = this.Guid;
			if (this.isCollection === 0) {
				this.isCollection = 1;
				this.CollectionNumber = this.CollectionNumber + 1;
			} else {
				this.isCollection = 0;
				this.CollectionNumber = this.CollectionNumber - 1;
			}
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				method: 'GET',
				data: {
					req: 'SetCollection',
					account: this.Account,
					dguid: guids
				},
				success: res => {},
				complete: res => {
					//uni.hideLoading();
					//uni.stopPullDownRefresh();
				}
			});
		},
		//输入框失去焦点
		textareaBlurEvent(event) {
			this.textMsg = event.detail.value;
			this.cursor = event.detail.cursor || 0;
		},
		sendmsg() {			
			if(!this.hasLogin){		
				uni.navigateTo({
					url: '/pages/LoginWChat',
				});		
				return;
			}	
			
			var guids = this.Guid;
			let contents = this.textMsg;
			setTimeout(() => {
				this.textMsg = '';
			}, 0);
			contents = this.replaceEmoji(contents);
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				method: 'GET',
				data: {
					req: 'SendMsg',
					account: this.Account,
					dguid: guids,
					contents: contents
				},
				success: res => {
					console.log('成功');
					var ll = {
						Photo: this.Userinfo.HeadPortrait,
						UserName: this.Userinfo.username,
						Content: contents
					};
					this.CommentList.push(ll);
					this.hideDrawer();
				},
				complete: res => {
					//uni.hideLoading();
					//uni.stopPullDownRefresh();
				}
			});
		
		},
		//添加表情
		addEmoji(em) {
			let cursor = this.cursor,
				text = this.textMsg,
				start,
				end;
			if (cursor === 0) {
				this.textMsg = em.alt + text;
				return;
			}
			start = text.substring(0, cursor);
			end = text.substr(cursor);
			this.textMsg = start + em.alt + end;
		}, // 选择表情
		chooseEmoji() {
			if (this.hideEmoji) {
				this.hideEmoji = false;
				this.popupLayerClass = 'showLayer';
			} else {
				this.hideDrawer();
			}
		}, // 隐藏抽屉
		hideDrawer() {
			this.popupLayerClass = '';
			setTimeout(() => {
				this.hideEmoji = true;
			}, 150);
		}, //替换表情符号为图片 微信开发者工具会出现所有表情在最前面的情况
		replaceEmoji(str) {
			let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, item => {
				for (let i = 0; i < EmojiAll.length; i++) {
					let EM = EmojiAll[i];
					if (EM.alt == item) {
						let onlinePath = 'https://www.chinaaos.com/Images/emoji/';
						let imgstr = '<img src="' + onlinePath + EM.url + '">';
						return imgstr;
					}
				}
			});
			return replacedStr;
		},
		share() {
			console.log('111111');
			this.shareClass = 'show';
		},
		hideShare() {
			this.shareClass = 'hide';
			setTimeout(() => {
				this.shareClass = 'none';
			}, 150);
		},guanzhu(){
			if(!this.hasLogin){						
				uni.navigateTo({
					url: '/pages/LoginWChat',
				});		
						return;
			}	
			//AOS_DiaryGuanZhu
			if (this.isGuanZhu === 0) {
				this.isGuanZhu = 1;
			} else {
				this.isGuanZhu = 0;
		    }							
			var  gzaccount=this.UserAccount;
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				method: 'GET',
				data: {
					req: 'DiaryGuanzhu',
					account: this.Account,
					gzaccount: gzaccount
				},
				success: res => {
					
				},
				complete: res => {
					
				}
			});
					
			
		}
	}
};
</script>

<style  lang="scss">
	page {
		background-color: #f8f8f8;
		padding-bottom: 100upx;
	}
	
	@font-face {
		font-family: 'HMfont-home';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}
	
	.icon {
		font-family: 'HMfont-home' !important;
		font-size: 49upx;
		font-style: normal;	
		&.fenxiang {
			&:before {
				content: '\e642';
			}
		 }
		}
	
	button:after {
		border:0;
	}
	
.guanzhu-swiper-view {
	background-color: #fff;
	margin: 10upx 0;
}

.guanzhu-swiper-view .swiper-item {
	width: 100%;
	height: 100%;
}

.guanzhu-swiper-view .swiper-item image {
	width: 100%;
	height: 100%;
}

.guanzhu-swiper-view .uni-flex {
	padding: 20upx;
}

.guanzhu-swiper-view .grace-news-list-title {
	font-weight: 600;
	font-size: 32upx;
	height: 50px;
	line-height: 50px;
	margin-left: 16upx;
}

.guanzhu-swiper-view .grace-news-list-title-num {
	font-size: 30upx;
	color: #ff2741;
	align-items: center;
	width: 260upx;
	text-align: right;
	padding-top: 5px;
}

.grace-news-list-guanzhu {
	display: inline-block;
	border: 2upx solid #ff2741;
	padding: 6upx 20upx;
	border-radius: 20px;
	font-weight: 600;
	width: 84upx;
	text-align: -webkit-center;
}

.grace-news-list-title-num image {
	width: 20px;
	height: 4px;
	margin-left: 40upx;
}

.grace-news-list-text {
	color: #333333;
	padding: 10upx 20upx;
}

.pl_nick {
	font-weight: 600;
}

.pl_see {
	text-align: center;
	color: #666666;
}

.pl_add {
	flex: 1;
	height: 30px;
	line-height: 30px;
	color: #666666;
	margin-left: 6upx;
}

.guanzhu-swiper-view .Time {
	line-height: 66upx;
	color: #666666;
	font-size: 24upx;
}

.pl_myimg {
	width: 30px;
	height: 30px;
	border-radius: 100%;
}

.guanzhu-swiper-view .share {
	background-color: #ff2742;
	color: #fff;
	height: 96upx;
	line-height: 96upx;
	text-align: center;
	font-size: 32upx;
	margin: 0 20upx 20upx;
	border-radius: 14upx;
}

.guanzhu-swiper-view .share image {
	width: 46upx;
	height: 46upx;
	margin-bottom: -10upx;
	margin-right: 20upx;
}

.guanzhu-swiper-view .product {
	margin: 20upx;
	padding: 20upx 20upx 10upx;
	background-color: #f5f5f5;
}
///产品
.product-name {
	color: #333333;
	font-weight: 600;
	min-height: 98upx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	text-align: justify;
	overflow: hidden;
}
.product-img {
	width: 144upx;
	height: 144upx;
	border-radius: 14upx;
}

.guanzhu-swiper-view .product-price {
	color: #ff2741;
	font-size: 32upx;
	font-weight: 600;
}

.yprice {
	font-size: 28upx;
	font-weight: 100;
	color: #666666;
	text-decoration: line-through;
	margin-left: 18upx;
}

////

.scroll-view_H {
	white-space: nowrap;
	width: 100%;
}

.scroll-view-item {
	height: 300upx;
	line-height: 300upx;
	text-align: center;
	font-size: 36upx;
}

.scroll-view-item_H {
	display: inline-block;
	width: 80%;
	font-size: 36upx;
	margin-right: 15px;
	background-color: #f5f5f5;
	border-radius: 14upx;
}
.scroll-view-item_H:last-child {
	margin-right: 0;
}

.commenttime {
	color: #666666;
	font-size: 12px;
	line-height: 19px;
	display: inline;
	/* margin-left: 10px; */
}

/////////////////////

.input-box {
	width: 98%;
	min-height: 100upx;
	padding: 0 1%;
	background-color: #f2f2f2;
	display: flex;
	position: fixed;
	z-index: 20;
	bottom: -2upx;
	-webkit-transition: all 0.15s linear;
	-o-transition: all 0.15s linear;
	transition: all 0.15s linear;
	border-bottom: solid 1rpx #ddd;
}
.input-box.showLayer {
	-webkit-transform: translate3d(0, -42vw, 0);
	transform: translate3d(0, -42vw, 0);
}
.input-box .voice,
.input-box .more {
	flex-shrink: 0;
	width: 90upx;
	height: 100upx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.input-box .send {
	//H5发送按钮左边距
	/* #ifdef H5 */
	margin-left: 20upx;
	/* #endif */
	flex-shrink: 0;
	width: 100upx;
	height: 100upx;
	display: flex;
	align-items: center;
}
.input-box .send .btn {
	width: 90upx;
	height: 56upx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: linear-gradient(to right, #f09b37, #eb632c);
	color: #fff;
	border-radius: 6upx;
	font-size: 24upx;
	/* #ifdef MP-WEIXIN */
	margin-top: 0upx;
	/* #endif */
	
}
.input-box .textbox {
	width: 100%;
	min-height: 70upx;
	margin-top: 15upx;
}

.input-box .textbox .text-mode {
	width: 100%;
	min-height: 70upx;
	display: flex;
	background-color: #fff;
	border-radius: 40upx;
}
.input-box .textbox .text-mode .box {
	width: 100%;
	padding-left: 30upx;
	min-height: 70upx;
	display: flex;
	align-items: center;
}
.input-box .textbox .text-mode .box textarea {
	width: 100%;
}
.input-box .textbox .text-mode .em {
	flex-shrink: 0;
	width: 80upx;
	padding-left: 10upx;
	height: 70upx;
	display: flex;
	justify-content: center;
	align-items: center;
}

///表情
/* 
.popup-layer {
	transition: all 0.15s linear;
	width: 96%;
	height: 42vw;
	padding: 20upx 2%;
	background-color: #f3f3f3;
	border-top: solid 1upx #ddd;
	position: fixed;
	z-index: 20;
	top: 100%;
}
.popup-layer .showLayer {
	transform: translate3d(0, -42vw, 0);
}
 */

.popup-layer.showLayer {
	-webkit-transform: translate3d(0, -42vw, 0);
	transform: translate3d(0, -42vw, 0);
}
.popup-layer {
	-webkit-transition: all 0.15s linear;
	-o-transition: all 0.15s linear;
	transition: all 0.15s linear;
	width: 96%;
	height: 42vw;
	padding: 20rpx 2%;
	background-color: #f3f3f3;
	border-top: solid 1rpx #ddd;
	position: fixed;
	z-index: 20;
	top: 100%;
}

.popup-layer .emoji-swiper {
	height: 40vw;
}
.popup-layer .emoji-swiper swiper-item {
	display: flex;
	align-content: flex-start;
	flex-wrap: wrap;
}
.popup-layer .emoji-swiper swiper-item view {
	width: 12vw;
	height: 12vw;
	display: flex;
	justify-content: center;
	align-items: center;
}
.popup-layer .emoji-swiper swiper-item view image {
	width: 8.4vw;
	height: 8.4vw;
}

.popup-layer .more-layer {
	width: 100%;
	height: 42vw;
}

.popup-layer .more-layer .list {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
}
.popup-layer .more-layer .list .box {
	width: 18vw;
	height: 18vw;
	border-radius: 20upx;
	background-color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 3vw 2vw 3vw;
}
.popup-layer .more-layer .list .box .icon {
	font-size: 70upx;
}

/* 分享 */
.share {
	display: none;	
    position: fixed;
    z-index: 20;
    bottom: -1px;
}

.share.show{
	display: block;
}
.share .show .mask {
	animation: showPopup 0.15s linear both;
}

.share .show .layer {
	animation: showLayer 0.15s linear both;
}

.share .hide {
	display: block;
}
.share .hide .mask {
	animation: hidePopup 0.15s linear both;
}

.share .hide .layer {
	animation: hideLayer 0.15s linear both;
}

.share .none {
	display: none;
}

.share .mask {
	background-color: rgba(0, 0, 0, 0.5);
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	z-index: 11;
}

.share .layer {
	width: 92%;
	position: fixed;
	z-index: 12;
	padding: 0 4%;
	bottom: 0;
	background-color: rgba(255, 255, 255, 0.9);
}

.share .layer .list {
	width: 100%;
	display: flex;
	padding: 10upx 0 30upx 0;
}

.share .layer .list .box {
	width: 25%;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}

.share .layer .list .box image {
	width: 13.8vw;
	height: 13.8vw;
}

.share .layer .list .box .title {
	margin-top: 10upx;
	display: flex;
	justify-content: center;
	width: 100%;
	font-size: 26upx;
}

.share .layer .btn {
	width: 100%;
	height: 100upx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28upx;
	border-top: solid 1upx #666666;
}

.share .layer .h1 {
	width: 100%;
	height: 80upx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 34upx;
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
