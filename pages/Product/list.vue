<template>
	<view class="content">
		<view class="navbar" :style="{ position: headerPosition, top: headerTop }">
			<view class="nav-item" :style="{color:color1}" @click="tabClick(0)">综合排序</view>
			<view class="nav-item" :style="{color:color2}" @click="tabClick(1)">销量优先</view>
			<view class="nav-item" :style="{color:color3}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{ active: priceOrder === 1 }" class="yticon icon-shang"></text>
					<text :class="{ active: priceOrder === 2 }" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
		</view>
		<view class="goods-list">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper"><image :src="item.MainIm" mode="aspectFill"></image></view>
				<text class="title clamp">{{ item.ProductName }}</text>
				<view class="price-box">
					<text class="price">{{ item.SalePrice }}</text>
					<text style="color: red;" v-if="VIPType!=0">
						省·赚¥{{item.Para1}}
					</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>

		<view class="cate-mask" :class="cateMaskState === 0 ? 'none' : cateMaskState === 1 ? 'show' : ''" @click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.Guid">
						<view class="cate-item b-b two">{{ item.Name }}</view>
						<view v-for="tItem in item.child" :key="tItem.Guid" class="cate-item b-b" :class="{ active: tItem.Guid == cateId }" @click="changeCate(tItem)">
							{{ tItem.Name }}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

export default {
	components: {
		uniLoadMore
	},	
	computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo','VIPType']),
	data() {
		return {
			cateMaskState: 0, //分类面板展开状态
			headerPosition: 'fixed',
			headerTop: '0px',
			loadingType: 'loading', //加载更多状态
			// filterIndex: 0,
			cateId: 0, //已选三级分类id
			sid:0,
			priceOrder: 0, //1 价格从低到高 2价格从高到低
			cateList: [],
			goodsList: [],
			pagecount:0,
			page:1,
			searchtype:"",
			color1:"#747474",
			color2:"#747474",
			color3:"#747474"
		};
	},

	onLoad(options) {
		// #ifdef H5
		this.headerTop ='88upx';
		// #endif
		this.goodsList =[];
		this.cateId = options.tid;
		this.sid=options.sid;
		this.loadCateList(options.fid, options.sid);
		this.loadData(options.tid, options.sid);
	},
	onPageScroll(e) {
		//兼容iOS端下拉时顶部漂移
		if (e.scrollTop >= 0) {
			this.headerPosition = 'fixed';
		} else {
			this.headerPosition = 'absolute';
		}
	},
	//下拉刷新
	onPullDownRefresh() {
		this.goodsList =[];
		this.page=1;
		this.loadData(this.cateId,this.sid);
	},
	//加载更多
	onReachBottom() {
		if(this.pagecount<=this.goodsList.length){
			this.loadingType="noMore";
			return;
		}		
		this.loadingType="More";
		this.loadData(this.cateId,this.sid);
	},
	methods: {
		//加载分类
		async loadCateList(fid, sid) {
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				data: {
					req: 'QueryGoodsBigTypes'
				},
				success: result => {
					let list = result.data.bigtype;
					let cateList = list.filter(item => item.Pguid == fid);
					cateList.forEach(item => {
						let tempList = list.filter(val => val.Pguid == item.Guid);
						item.child = tempList;
					});
					this.cateList = cateList;
				},
				fail: e => {
					uni.showToast({
						icon: 'none',
						title: e.errMsg
					});
				}
			});
		},
		//加载商品 ，带下拉刷新和上滑加载
		async loadData(type = 'add', loading) {	
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				data: {
					req: 'SpecialGoods',
					typeid: type,
					page: this.page,
					searchtype:this.searchtype,
					priceOrder:this.priceOrder
				},
				success: result => {					
					this.pagecount=result.data.pagecount;
					let gList = result.data.typeListInfo;
					gList.forEach(item => {
						var mains = item.ImagePath.split(',')[0];
						item.MainIm = 'https://www.chinaaos.com' + mains;							
						item.Para1 =((parseFloat(item.SalePrice) - parseFloat(item.SetTlementPrice))*0.4).toFixed(2);		
					});
					this.goodsList = this.goodsList.concat(gList);
					this.page++;				
					console.log(this.pagecount+"="+this.goodsList.length);
				},
				complete: res => {
					
					if(this.goodsList.length<this.pagecount){
						this.loadingType="more";						
					}else{
						 this.loadingType="noMore";
					}				    
			    },				
				fail: e => {
					this.loadingType="loading";
				}
			});
		},
		//筛选点击
		tabClick(typeid) {
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
			this.page=1;
			this.goodsList =[];
			this.loadData(this.cateId,this.sid)
			
		},
		//显示分类面板
		toggleCateMask(type) {
			let timer = type === 'show' ? 10 : 300;
			let state = type === 'show' ? 1 : 0;
			this.cateMaskState = 2;
			setTimeout(() => {
				this.cateMaskState = state;
			}, timer);
		},
		//分类点击
		changeCate(item) {
			this.cateId = item.Guid;
			this.sid=item.Pguid;
			this.toggleCateMask();
			uni.pageScrollTo({
				duration: 300,
				scrollTop: 0
			});
			this.loadData(this.cateId, item.PGuid);
		},
		//详情
		navToDetailPage(item) {
			//测试数据没有写id，用title代替
			let id = item.Guid;
			console.log(id)
			uni.navigateTo({
				url: '/pages/Product/ProductDetail?gid='+id
			});
		},
		stopPrevent() {}
	}
};
</script>

<style lang="scss">
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

page,
.content {
	background: #fff;
}
.content {
	padding-top: 96upx;
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

/* 分类 */
.cate-mask {
	position: fixed;
	left: 0;
	top: var(--window-top);
	bottom: 0;
	width: 100%;
	background: rgba(0, 0, 0, 0);
	z-index: 95;
	transition: 0.3s;

	.cate-content {
		width: 630upx;
		height: 100%;
		background: #fff;
		float: right;
		transform: translateX(100%);
		transition: 0.3s;
	}
	&.none {
		display: none;
	}
	&.show {
		background: rgba(0, 0, 0, 0.4);

		.cate-content {
			transform: translateX(0);
		}
	}
}
.cate-list {
	display: flex;
	flex-direction: column;
	height: 100%;
	.cate-item {
		display: flex;
		align-items: center;
		height: 90upx;
		padding-left: 30upx;
		font-size: 28upx;
		color: #555;
		position: relative;
	}
	.two {
		height: 64upx;
		color: #303133;
		font-size: 30upx;
		background: #f8f8f8;
	}
	.active {
		color: red;
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
