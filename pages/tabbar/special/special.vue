<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.Guid" class="f-item b-b" :class="{active: item.Guid === currentId}" @click="tabtap(item)">
				{{item.Name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="item in slist" :key="item.Guid"  v-if="item.children.length>0"  class="s-list" :id="'main-'+item.Guid">
				<text class="s-item">{{item.Name}}</text>
				<view class="t-list">
					<view @click="navToList(item.Guid, titem.Guid)"  class="t-item" v-for="titem in item.children" :key="titem.Guid">
						<image :src="titem.Icon" style="border-radius: 8px;"></image>
						<text>{{titem.Name}}</text>
					</view>
				</view>
			</view>
			
			<view class="loading-more" v-if="isLoading==true">
				<text class="loading-more-text">{{loadingText}}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	var page=1,pagecount=0;
	import {
		mapState
	} from 'vuex'
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account','IsShow']),
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				flist: [],
				slist: [],
				isLoading:false,
				loadingText: '正在加载...'
			}
		},
		onLoad() {
			page=1;
			this.flist=[];
			this.slist=[];
			this.loadData();
			this.loadDataTwo();
		},
		//下拉刷新
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
			this.onLoad();
			this.loadDataTwo();
		},// 加载更多
		onReachBottom: function() {
			if(pagecount<=this.slist.length){
			   this.isLoading=true;
			   this.loadingText="- 我是有底线的 -";
			   return;
			}		
		},
		methods: {			
			async loadData(){	
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QueryGoodsCategory',
						IsShow:this.IsShow
					},
					success: result => {						
						this.flist=result.data.bigtype;
					},
					fail: e => {
						
					}
				});
			},
			async loadDataTwo(){
				this.isLoading=true;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QueryGoodsCategoryTwo',
						IsShow:this.IsShow,
					},
					success: result => {
						this.currentId = result.data.bigtypeTwo[0].Pguid;
						result.data.bigtypeTwo.forEach(item=>{
							item.children.forEach(items=>{
								items.Icon="https://www.chinaaos.com/"+items.Icon;	
							})  							
						}) 
						this.slist=this.slist.concat(result.data.bigtypeTwo);
						pagecount= result.data.bigtypeTwoCount;
					},
					fail: e => {
						this.isLoading=true;
					},
					complete: res => {
						this.isLoading = false;
					}
					
				});
				
			},
			//一级分类点击
			tabtap(item){
				if(!this.sizeCalcState){
					this.calcSize();
				}				
				this.currentId = item.Guid;
				let index = this.slist.findIndex(sitem=>sitem.Pguid === item.Guid);
				this.tabScrollTop = this.slist[index].top;
			},
			//右侧栏滚动
			asideScroll(e){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].Pguid;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.slist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.Guid);
					view.fields({
						size: true
					}, data => {
						if(data!=null){
							item.top = h;
							h += data.height;
							item.bottom = h;
						}						
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(sid, tid){
				uni.navigateTo({
					url: `/pages/Product/list?fid=${this.currentId}&sid=${sid}&tid=${tid}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: #747474;
		position: relative;
		&.active{
			color: red;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: white;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: #747474;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		
		image{
			width: 140upx;
			height: 140upx;
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
