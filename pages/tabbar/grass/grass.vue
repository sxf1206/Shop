<template>
	<view style="background-color: #f8f8f8;">
		<view class="container999" catchtouchmove="false">
			<poster v-if="posterShow" :posterObj.sync="posterData"></poster>
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
		<!-- 文章内容区 -->

		<view v-for="(item, index) in artList" :key="index">
			<!-- 一张图 -->
			<view v-if="item.GrassImg.length < 3" open-type="navigate">
				<view class="grace-news-list-img-news">
					<view class="uni-flex uni-row" style="padding-bottom: 4px;">
						<view style="height: 50px;width: 50px;float: left;">
							<image :src="item.touxiang" style="width: 50px;height: 50px;border-radius: 100%;" ></image>
						</view>
						<view class="grace-news-list-title " style="flex: 1;width: 50%;float: left;">{{ item.DisplayName }}</view>
						<!-- <view class="grace-news-list-title-num" style="width: 160upx;float: left;">{{ item.ShareCount }}次分享</view> -->
					</view>
					<view class="grace-news-list-title-main">
						<rich-text :nodes="item.GrassTitlle" />
					</view>
					<view class="grace-news-list-img-big">
						<block v-if="item.GrassImg.length>1">
							<image :src="img"  mode="aspectFill" v-for="(img, i) in item.GrassImg" :key="i"  @tap="previewImage(item.GrassImg,i)"></image>
                        </block>
						<block v-else>
							<image :src="img"  mode="widthFix" v-for="(img, i) in item.GrassImg" :key="i"  @tap="previewImage(item.GrassImg,i)"></image>
						</block>						
					</view>
					<view class="grace-news-list-time">发布时间：{{ item.ptime }}</view>
					<view class="uni-flex uni-row" style="margin-bottom: 4px;">
						<view v-if="item.GrassImg.length <= 0" class="grace-news-list-saveimg" style="width: 45%;float: left;font-size: 16px;">
							<!-- <image src="/static/save_09.png"></image>
									保存到相册 -->
						</view>
						<view v-else class="grace-news-list-saveimg" @click="save(index)" style="width: 45%;float: left;font-size: 16px;">
							<image src="/static/save_09.png"></image>
							保存到相册
						</view>
						<view style="width: 55%;text-align: -webkit-right;float: left;font-size: 16px;">
							<view class="uni-flex uni-row">
								<view style="margin-left: 18%;vertical-align:middle;background-color: #ff6600;color: white;border-radius: 9px;text-align: center;;padding: 3px 6px;"
								 @tap="openPost(item)">
									推广海报
								</view>
								<view style="margin-left: 10%;vertical-align:middle;background-color: #ff2741;color: white;border-radius: 9px;text-align: center;;padding: 3px 6px;"
								 @click="copysome(item)">
									复制文字
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 三张图 -->
			<view v-if="item.GrassImg.length >= 3">
				<view class="grace-news-list-img-news">
					<view class="uni-flex uni-row" style="padding-bottom: 4px;">
						<view style="height: 50px;width: 50px;float: left;">
							<image :src="item.touxiang" style="width: 50px;height: 50px;border-radius: 100%;"  ></image>
						</view>
						<view class="grace-news-list-title " style="flex: 1;width: 50%;float: left;">{{ item.DisplayName }}</view>
						<!-- <view class="grace-news-list-title-num" style="width: 160upx;float: left;">{{ item.ShareCount }}次分享</view> -->
					</view>
					<view class="grace-news-list-title-main">
						<!-- {{item.GrassTitlle}} -->
						<rich-text :nodes="item.GrassTitlle" />
					</view>
					<view class="grace-news-list-imgs">
						
						<image :src="img"    mode="aspectFill"   v-for="(img, i) in item.GrassImg" :key="i"  @tap="previewImage(item.GrassImg,i)"></image>
					</view>
					<view class="grace-news-list-time">发布时间：{{ item.ptime }}</view>
					<view class="uni-flex uni-row" style="margin-bottom: 4px;">
						<view class="grace-news-list-saveimg" @click="save(index)" style="width: 45%;float: left;font-size: 16px;">
							<image src="/static/save_09.png"></image>
							保存到相册
						</view>
						<view style="width: 55%;text-align: -webkit-right;float: left;font-size: 16px;">
							<view class="uni-flex uni-row">
								<view style="margin-left: 18%;vertical-align:middle;background-color: #ff6600;color: white;border-radius: 9px;text-align: center;;padding: 3px 6px;"
								 @tap="openPost(item)">
									推广海报
								</view>
								<view style="margin-left: 10%;vertical-align:middle;background-color: #ff2741;color: white;border-radius: 9px;text-align: center;padding: 3px 6px;"
								 @click="copysome(item)">
									复制文字
								</view>
							</view>
						</view>
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
	import htmlParser from '@/common/html-parser'
	import poster from '../../../components/zywPoster.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'


	var Uguid;
	import {
		mapState
	} from 'vuex'

	var util = require('../../../utils/util.js');
	var page = 1,CountPages=0,
		cate = 1;		

	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType', 'unionid', 'IsShow']),
		components: {
			uniPopup,
			poster
		},
		data() {
			return {
				top: 0,
				//分类信息
				categories: [{
						cateid: 1,
						name: '热门推荐'
					},
					{
						cateid: 0,
						name: '分享素材'
					}
				],
				// 当前选择的分类
				cateCurrentIndex: 0,
				artList: [],
				imgList: [],
				typeids: '',
				shareText: '',
				sharehref: '',
				GPimgList: [],
				posterData: {},
				posterShow: false,
				codeimgurl: '',
				userimg: '',
				gdesc: '',
				gbeginimg: '',
				gname: '',
				gnowprice: '',
				isLoading:false,
				loadingText: '正在加载...',
				NewsList:''
			};
		},
		onLoad() {
			// #ifdef H5
			this.top = '44px';
			// #endif
			page = 1;		
			
			this.typeids = 1;
			this.getNewsList();
		},
		onShareAppMessage(e) {
			var mm = e.target.id;
			this.shareText = this.artList[mm].GrassTitlle;
			if (this.artList[mm].GrassImg.length <= 0) {
				this.imgList = '';
			} else {
				this.imgList = this.artList[mm].GrassImg[0].Path;
			}

			return {
				title: this.shareText ? this.shareText : '欢迎',
				path: '/pages/tabbar/grass/grass',
				imageUrl: this.imgList
			};
		},
		//下拉刷新
		onPullDownRefresh: function() {
			// 重置分页及数据
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
			page = 1;
			CountPages=0;
			this.getNewsList();
		},
		// 加载更多
		onReachBottom: function() {
			if(CountPages<=this.artList.length){
			   this.isLoading=true;
			   this.loadingText="- 我是有底线的 -";
			   return;
			}
			this.getNewsList();
		},
		methods: {
			openPost(item) {
				if (uni.getStorageSync('Account') == "" || uni.getStorageSync('Account') == undefined) {
					uni.navigateTo({
						url: '/pages/LoginWChat'
					});
					return false;
				}
				console.log("该广告广告广告" + item.Goodsid);
				if (item.Goodsid != "" && item.Goodsid != "null" && item.Goodsid != "undefined" && item.Goodsid != null) {
					wx.showLoading({
						title: '海报生成中...'
					})
					
					this.codeImg(item.Goodsid).then((res) => {
						console.log("codeImg好好：" + item.Goodsid);
						this.codeimgurl = res.pic;
						this.userimg = res.userImg;

						this.GetGrassGoods(item.Goodsid).then((res) => {
							console.log("GetGrassGoods啧啧：" + item.Goodsid);
							if (res.length > 0) {
								var MainImlist = res[0].ImagePath;
								var mains = MainImlist.split(',')[0];
								Object.assign(this.posterData, {
									himg: this.userimg,
									uname: this.Userinfo.username,
									gdesc: res[0].ShortDescription,
									pimg: "https://www.chinaaos.com" + mains,
									gname: res[0].ProductName,
									codeimg: this.codeimgurl,
									gnowprice: res[0].SalePrice,
									savemoney: ''
								})
							}
						});

						//this.$forceUpdate();//强制渲染数据
						setTimeout(() => {
							this.posterShow = true;
							this.shareClass = 'hide';
							setTimeout(() => {
								this.shareClass = 'none';
							}, 150);

						}, 600);

					});

				} else {

					uni.showToast({
						icon: 'none',
						title: "该描述未指定商品"
					});
				}

			},
			codeImg(gid) {
				var bb = gid;
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
						data: {
							req: 'GetAccessToken_new',
							longurl: bb + '_' + this.Account + '_2',
							UserImg: this.Userinfo.HeadPortrait
						},
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success: function(res) {
							var src2 = res.data.pic;
							resolve(res.data);
						}
					});
				})
			},
			GetGrassGoods(gid) {
				var bb = gid;
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
						data: {
							req: 'GetGrassGoods',
							Goodsid: bb
						},
						success: function(res) {
							if (res.data.GrassGoodsList.length > 0) {
								var list = res.data.GrassGoodsList;
								resolve(res.data.GrassGoodsList);
							}
						}
					});
				})
			},
			// 数据和分页是模拟的实际也是这样写
			getNewsList: function() {
				this.isLoading=true;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'GetGrassByTypeList',
						typeId: this.typeids,
						page:page,
						IsShow:this.IsShow
					},
					success: result => {
						page++;
						CountPages=result.data.GrassCount; //总页数						
						let List = result.data.GrassByTypeIdList;
						this.artList = this.artList.concat(List);
						this.artList.forEach(item => {
							var mains = JSON.parse(item.GrassImg);
							var imglistnopath=[];
							mains.forEach(items => {
								items.Path = 'https://www.chinaaos.com' + items.Path;
								imglistnopath.push(items.Path);
							});
							
							item.GrassImg = imglistnopath;
							item.touxiang = 'https://www.chinaaos.com' + item.touxiang;
							item.ptime = item.ptime.replace('T', ' ').substring(0, 16);
							item.GrassTitlle = item.GrassTitlle.replace(/\<img/gi, '<img style="width:24px;height:24px"');
						});
					},
					fail: e => {
						this.isLoading=true;
					},complete: res => {
						this.isLoading = false;
					}
				});
			},
			tabChange: function(e) {
				this.loadingText='正在加载...';
				// 选中的索引
				var index = e.currentTarget.dataset.index;
				// 具体的分类id
				var cateid = e.currentTarget.dataset.cateid;
				this.cateCurrentIndex = index;
				// 动态替换内容
				this.content = this.categories[index].name;
				// 读取分类数据
				cate = cateid; //把分类信息发送给api接口即可读取对应分类的数据
				// 重置分页及数据
				page = 1;
				this.artList = [];
				// 加载对应分类数据覆盖上一个分类的展示数据 加载更多是继续使用这个分类
				if (cateid == '1') {
					this.typeids = 1;
				} else {
					this.typeids = 0;
				}				
				this.getNewsList();
			},
			save(v) {
				var Someimg = this.artList[v].GrassImg;
				uni.showActionSheet({
					itemList: ['保存图片到相册'],
					success: () => {
						// #ifdef APP-PLUS || H5
						Someimg.forEach(items => {
							plus.gallery.save(
								items.Path,
								function() {
									uni.showToast({
										title: '保存成功',
										icon: 'none'
									});
								},
								function() {
									console.log('保存失败');
								}
							);
						});
						//#endif

						// #ifdef MP-WEIXIN
						Someimg.forEach(items => {
							uni.downloadFile({
								url: items.Path,
								success: (res) => {
									if (res.statusCode === 200) {
										uni.saveImageToPhotosAlbum({
											filePath: res.tempFilePath,
											success: function() {
												uni.showToast({
													title: "保存成功",
													icon: "none"
												});
											},
											fail: function() {
												uni.showToast({
													title: "保存失败，请稍后重试",
													icon: "none"
												});
											}
										});
									}
								}
							})
						});
						// #endif
					}
				});
			},
			formatImg(html) {
				var newContent = html.replace(/<img.*?(?:>|\/>)/gi, function(match, capture) {
					var alt = match.match(/alt=[\'\"]?([^\'\"]*)[\'\"]?/i);
					return alt[1];
				});
				return newContent.replace(/<[^>]+>/g, "");
			},
			copysome(item) {
				var GrassTitlle = this.formatImg(item.GrassTitlle.replace(/&nbsp;/ig, ""));
				uni.setClipboardData({
					data: GrassTitlle,
					success: function() {
						console.log('success');
					}
				});
			},
			previewImage: function(item,i) {
				var current = item[i];
				uni.previewImage({
					current: current,
					urls: item
				})
			}
		}
	};
</script>
<style>
	.container999 {
		display: flex;
		align-items: center;
		justify-content: center;

	}

	page {
		background-color: #f4f8fb;
	}

	/* 分段器头部 fixed 定位 */
	.fixedit {
		width: 100%;
		position: fixed;
		z-index: 99;
		left: 0;
		top: 0;
		border-top: 2upx solid #f4f8fb;
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
	.grace-news-list {
		width: 100%;
	}

	.grace-news-list>navigator {
		display: block;
		width: 100%;
		margin: 12upx 0;
	}

	.grace-news-list-img {
		width: 200upx;
		flex-shrink: 0;
	}

	.grace-news-list-saveimg {
		flex: 1;
		height: 30px;
		line-height: 30px;
	}

	.grace-news-list-saveimg image {
		width: 20px;
		height: 20px;
		margin-right: 16upx;
		margin-bottom: -4px;
	}

	.grace-news-list-time {
		margin-bottom: 10upx;
		color: #666666;
		font-size: 28upx;
	}

	.grace-news-list-share {
		height: 30px;
		line-height: 30px;
	}

	.grace-news-list-share image {
		width: 24px;
		height: 24px;
	}

	.grace-news-list-title {
		font-weight: 600;
		font-size: 32upx;
		height: 50px;
		line-height: 50px;
		margin-left: 16upx;
	}

	.grace-news-list-title-num {
		font-size: 28upx;
		color: #666;
		font-weight: initial;
		height: 50px;
		line-height: 50px;
	}

	.grace-news-list-title-main {
		line-height: 1.5em;
		font-size: 32upx;
		width: 100%;
		padding: 10upx 0;
	}

	.grace-news-list-img-news {
		margin: 12rpx 0;

		flex-wrap: wrap;
		background-color: #fff;
		padding: 15px;
	}

	.grace-news-list-imgs {
		margin: 10upx 0;
	}

	.grace-news-list-imgs image {
		width: 31.5%;
		max-height: 96px;
		max-width: 31.5%;
		padding-right: 1.5%;
		object-fit: cover;
	}

	.grace-news-list-img-big {
		width: 100%;
		padding: 18upx 0;
	}

	.grace-news-list-img-big image {
		width: 47%;
		margin: 0 1%;
	}

	button:after {
		border: 0;
	}

	.button-hover[type='primary'] {
		color: #fff;
		background-color: #fff;
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
