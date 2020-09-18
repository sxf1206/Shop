<template>
	<view>
		<view style="padding-top: 20px;background-color: #ff6600;padding-bottom: 8px;position: fixed;z-index: 999;width: 100%;">
			<view class="search">
				<!-- #ifdef APP-PLUS -->
				<image src="/static/zy-search/voice.svg" mode="aspectFit" @click="startRecognize()" class="voice-icon" style="margin-top: 12px;margin-left: 16px;"></image>
				<!-- #endif -->
				<template v-if="false">
					<input maxlength="20" focus type="text" value="" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词搜索"
					 v-model.trim="searchText" />
				</template>
				<template v-else>
					<input maxlength="20" type="text" value="" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词搜索"
					 v-model.trim="searchText" />
				</template>
				<image src="/static/zy-search/search.svg" mode="aspectFit" @click="searchStart()" class="search-icon"></image>
				<view class="closeview" @click="closeseach()">取消</view>
			</view>
			<view class="navbar" style="position: fixed;margin-top: 74px;">
				<view class="nav-item" :style="{color:color1}" @click="tabClick(0)">综合排序</view>
				<view class="nav-item" :style="{color:color2}" @click="tabClick(1)">销量优先</view>
				<view class="nav-item" :style="{color:color3}" @click="tabClick(2)">
					<text>价格</text>
					<view class="p-box">
						<text :class="{ active: priceOrder === 1 }" class="yticon icon-shang"></text>
						<text :class="{ active: priceOrder === 2 }" class="yticon icon-shang xia"></text>
					</view>
				</view>
				<!-- <text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text> -->
			</view>
		</view>
		<view class="goods-list" style="padding-top: 132px;">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.MainIm" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{ item.ProductName }}</text>
				<view class="price-box">
					<text class="price">{{ item.SalePrice }}</text>
					<!-- <text>已售 {{item.SaleCounts}}</text> -->
					<text style="color: red;" v-if="VIPType!=0">
						省·赚¥{{item.Para1}}
					</text>
				</view>
				
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType']),
		data() {
			return {
				searchText: '',
				searchtype:'',
				goodsList: [],
				loadingType: 'more',
				priceOrder:0,
				color1:"#747474",
				color2:"#747474",
				color3:"#747474"
			};
		},
		onLoad(options) {
			this.searchText = options.searchText;
			this.init();
		},
		//下拉刷新
		onPullDownRefresh() {
			uni.showLoading();
			this.page = 1;
			this.init();
		},
		methods: {
			init() {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'searchThanMore',
						searchText: this.searchText,
						searchtype:this.searchtype,
						priceOrder:this.priceOrder
					},
					success: result => {
						this.goodsList = [];
						let List = result.data.ProList;
						this.goodsList = this.goodsList.concat(List);
						this.goodsList.forEach(item => {
							var mains = item.ImagePath.split(',')[0];
							item.MainIm = 'https://www.chinaaos.com' + mains;
							item.Para1 = ((parseFloat(item.SalePrice) - parseFloat(item.SetTlementPrice)) * 0.4).toFixed(2);
						});

						if (this.pagecount <= 10) {
							this.loadingType = "没有更多数据了";
							return;
						} else {
							this.page++;
						}

					},
					complete: res => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			searchStart: function() { //触发搜索
				let _this = this;
				if (_this.searchText == '') {
					uni.showToast({
						title: '请输入关键字',
						icon: 'none',
						duration: 1000
					});
					return false;
				} else {
					uni.getStorage({
						key: 'search_cache',
						success(res) {
							let list = res.data;
							console.log(list);
							if (list.length > 5) {
								for (let item of list) {
									if (item == _this.searchText) {
										return false;
									}
								}
								list.pop();
								list.unshift(_this.searchText);
							} else {
								for (let item of list) {
									if (item == _this.searchText) {
										return false;
									}
								}
								list.unshift(_this.searchText);
							}
							_this.hList = list;
							uni.setStorage({
								key: 'search_cache',
								data: _this.hList
							});
						},
						fail() {
							_this.hList = [];
							_this.hList.push(_this.searchText);
							uni.setStorage({
								key: 'search_cache',
								data: _this.hList
							});
						}
					});
					this.init();
				}
			},
			startRecognize: function() { //语音输入
				let _this = this;
				let options = {};
				options.engine = 'iFly';
				options.punctuation = false; // 是否需要标点符号 
				options.timeout = 10 * 1000;
				plus.speech.startRecognize(options, function(s) {
					_this.searchText = _this.searchText + s;
				});
			},
			closeseach: function() {
				uni.navigateBack();
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
			tabClick(typeid){
				if(typeid=="0"){
					this.color1="red";
					this.color2="#747474";
					this.color3="#747474";
				}else if(typeid=="1"){
					this.color1="#747474";
					this.color2="red";
					this.color3="#747474";
				}else if(typeid=="2"){
					this.color1="#747474";
					this.color2="#747474";
					this.color3="red";
				}
				this.searchtype=typeid;
				if (typeid === 2) {
					this.priceOrder = this.priceOrder === 1 ? 2 : 1;
				} else {
					this.priceOrder = 0;
				}
				this.init();
			}
		}
	}
</script>

<style lang="less" scoped>
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}
	
	.yticon {
		font-family: 'yticon' !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
	.icon-yiguoqi1:before {
		content: '\e700';
	}
	
	.icon-iconfontshanchu1:before {
		content: '\e619';
	}
	
	.icon-iconfontweixin:before {
		content: '\e611';
	}
	
	.icon-alipay:before {
		content: '\e636';
	}
	
	.icon-shang:before {
		content: '\e624';
	}
	
	.icon-shouye:before {
		content: '\e626';
	}
	
	.icon-shanchu4:before {
		content: '\e622';
	}
	
	.icon-xiaoxi:before {
		content: '\e618';
	}
	
	.icon-jiantour-copy:before {
		content: '\e600';
	}
	
	.icon-fenxiang2:before {
		content: '\e61e';
	}
	
	.icon-pingjia:before {
		content: '\e67b';
	}
	
	.icon-daifukuan:before {
		content: '\e68f';
	}
	
	.icon-pinglun-copy:before {
		content: '\e612';
	}
	
	.icon-dianhua-copy:before {
		content: '\e621';
	}
	
	.icon-shoucang:before {
		content: '\e645';
	}
	
	.icon-xuanzhong2:before {
		content: '\e62f';
	}
	
	.icon-gouwuche_:before {
		content: '\e630';
	}
	
	.icon-icon-test:before {
		content: '\e60c';
	}
	
	.icon-icon-test1:before {
		content: '\e632';
	}
	
	.icon-bianji:before {
		content: '\e646';
	}
	
	.icon-jiazailoading-A:before {
		content: '\e8fc';
	}
	
	.icon-zuoshang:before {
		content: '\e613';
	}
	
	.icon-jia2:before {
		content: '\e60a';
	}
	
	.icon-huifu:before {
		content: '\e68b';
	}
	
	.icon-sousuo:before {
		content: '\e7ce';
	}
	
	.icon-arrow-fine-up:before {
		content: '\e601';
	}
	
	.icon-hot:before {
		content: '\e60e';
	}
	
	.icon-lishijilu:before {
		content: '\e6b9';
	}
	
	.icon-zhengxinchaxun-zhifubaoceping-:before {
		content: '\e616';
	}
	
	.icon-naozhong:before {
		content: '\e64a';
	}
	
	.icon-xiatubiao--copy:before {
		content: '\e608';
	}
	
	.icon-shoucang_xuanzhongzhuangtai:before {
		content: '\e6a9';
	}
	
	.icon-jia1:before {
		content: '\e61c';
	}
	
	.icon-bangzhu1:before {
		content: '\e63d';
	}
	
	.icon-arrow-left-bottom:before {
		content: '\e602';
	}
	
	.icon-arrow-right-bottom:before {
		content: '\e603';
	}
	
	.icon-arrow-left-top:before {
		content: '\e604';
	}
	
	.icon-icon--:before {
		content: '\e744';
	}
	
	.icon-zuojiantou-up:before {
		content: '\e605';
	}
	
	.icon-xia:before {
		content: '\e62d';
	}
	
	.icon--jianhao:before {
		content: '\e60b';
	}
	
	.icon-weixinzhifu:before {
		content: '\e61a';
	}
	
	.icon-comment:before {
		content: '\e64f';
	}
	
	.icon-weixin:before {
		content: '\e61f';
	}
	
	.icon-fenlei1:before {
		content: '\e620';
	}
	
	.icon-erjiye-yucunkuan:before {
		content: '\e623';
	}
	
	.icon-Group-:before {
		content: '\e688';
	}
	
	.icon-you:before {
		content: '\e606';
	}
	
	.icon-forward:before {
		content: '\e607';
	}
	
	.icon-tuijian:before {
		content: '\e610';
	}
	
	.icon-bangzhu:before {
		content: '\e679';
	}
	
	.icon-share:before {
		content: '\e656';
	}
	
	.icon-yiguoqi:before {
		content: '\e997';
	}
	
	.icon-shezhi1:before {
		content: '\e61d';
	}
	
	.icon-fork:before {
		content: '\e61b';
	}
	
	.icon-kafei:before {
		content: '\e66a';
	}
	
	.icon-iLinkapp-:before {
		content: '\e654';
	}
	
	.icon-saomiao:before {
		content: '\e60d';
	}
	
	.icon-shezhi:before {
		content: '\e60f';
	}
	
	.icon-shouhoutuikuan:before {
		content: '\e631';
	}
	
	.icon-gouwuche:before {
		content: '\e609';
	}
	
	.icon-dizhi:before {
		content: '\e614';
	}
	
	.icon-fenlei:before {
		content: '\e706';
	}
	
	.icon-xingxing:before {
		content: '\e70b';
	}
	
	.icon-tuandui:before {
		content: '\e633';
	}
	
	.icon-zuanshi:before {
		content: '\e615';
	}
	
	.icon-zuo:before {
		content: '\e63c';
	}
	
	.icon-shoucang2:before {
		content: '\e62e';
	}
	
	.icon-shouhuodizhi:before {
		content: '\e712';
	}
	
	.icon-yishouhuo:before {
		content: '\e71a';
	}
	
	.icon-dianzan-ash:before {
		content: '\e617';
	}
	.search {
		padding: 30upx 30upx 0;
		position: relative;

		input {
			width: 66%;
			background-color: #F7F7F7;
			padding: 10upx 74upx;
			font-size: 28upx;
			border-radius: 50upx;
		}

		.voice-icon {
			width: 36upx;
			height: 36upx;
			padding: 16upx 20upx 16upx 0;
			position: absolute;
			left: 16upx;
			top: 4upx;
			z-index: 10;
		}

		.search-icon {
			width: 36upx;
			height: 36upx;
			padding: 16upx 20upx 16upx 0;
			position: absolute;
			right: 66px;
			top: 14px;
			z-index: 10;
		}

		.closeview {
			position: absolute;
			right: 16px;
			top: 19px;
			z-index: 10;
		}
	}

	.s-block {
		margin-top: 30upx;

		.header {
			font-size: 32upx;
			padding: 30upx;
			position: relative;

			image {
				width: 36upx;
				height: 36upx;
				padding: 10upx;
				position: absolute;
				right: 40upx;
				top: 24upx;
			}
		}

		.list {
			display: flex;
			flex-wrap: wrap;

			view {
				width: 50%;
				color: #8A8A8A;
				font-size: 28upx;
				box-sizing: border-box;
				text-align: center;
				padding: 20upx 0;
				border-top: 2upx solid #FFF;
				border-left: 2upx solid #FFF;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				background-color: #F7F7F7;
			}
		}
	}

	.s-circle {
		margin-top: 30upx;

		.header {
			font-size: 32upx;
			padding: 30upx;
			border-bottom: 2upx solid #F9F9F9;
			position: relative;

			image {
				width: 36upx;
				height: 36upx;
				padding: 10upx;
				position: absolute;
				right: 40upx;
				top: 24upx;
			}
		}

		.list {
			display: flex;
			flex-wrap: wrap;
			padding: 0 30upx 20upx;

			view {
				padding: 8upx 30upx;
				margin: 20upx 30upx 0 0;
				font-size: 28upx;
				color: #8A8A8A;
				background-color: #F7F7F7;
				box-sizing: border-box;
				text-align: center;
				border-radius: 20upx;
			}
		}
	}

	.wanted-block {
		margin-top: 30upx;

		.header {
			font-size: 32upx;
			padding: 30upx;
		}

		.list {
			display: flex;
			flex-wrap: wrap;

			view {
				width: 50%;
				color: #8A8A8A;
				font-size: 28upx;
				box-sizing: border-box;
				text-align: center;
				padding: 20upx 0;
				border-top: 2upx solid #FFF;
				border-left: 2upx solid #FFF;
				background-color: #F7F7F7;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}

	.wanted-circle {
		margin-top: 30upx;

		.header {
			font-size: 32upx;
			padding: 30upx;
		}

		.list {
			display: flex;
			flex-wrap: wrap;
			padding: 0 30upx 20upx;

			view {
				padding: 8upx 30upx;
				margin: 20upx 30upx 0 0;
				font-size: 28upx;
				color: #8A8A8A;
				background-color: #F7F7F7;
				box-sizing: border-box;
				text-align: center;
				border-radius: 20upx;
			}
		}
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.06);
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: #747474;
			position: relative;

			&.current {
				color: #747474;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid #747474;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: #747474;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

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
