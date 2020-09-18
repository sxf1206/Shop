<template>
	<view>
		<view class="fixedit" :style="{ top: top }">
			<scroll-view class="grace-tab-title grace-center" scroll-x="true" id="grace-tab-title">
				<view v-for="(cate, index) in categories" :key="index"	:data-cateid="cate.cateid"	:data-index="index" :class="[cateCurrentIndex == index ? 'grace-tab-current' : '']"		@tap="tabChange"
				>
					{{ cate.name }}
				</view>
			</scroll-view>
		</view>
		<view  v-if="FanceList.length<=0" style="text-align: center; margin-top: 40%;">
			你还没有粉丝哟~
		</view>	
		<!--#ifdef MP-WEIXIN-->
		<view class="uni-list"  v-if="FanceList.length>0">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in FanceList" :key="key">
				<view class="uni-media-list">
					<view class="uni-media-list-logo">
						<image  class="headimg" v-if="showImg" :src="value.Photo"></image>
					</view>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">
						  {{value.UserName}}-V{{value.VIPType}}
						<text class="time"> {{value.CreateTime}}</text>
						</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{value.Account}}</view>
					</view>
				</view>
			</view>
		</view>	
	<!--#endif-->
	<!--#ifdef APP-PLUS || H5 -->	
		<view class="uni-list"  v-if="FanceList.length>0" style="margin-top: 45px;">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in FanceList" :key="key">
				<view class="uni-media-list">
					<view class="uni-media-list-logo">
						<image  class="headimg" v-if="showImg" :src="value.Photo"></image>
					</view>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">
						  {{value.UserName}}-V{{value.VIPType}}
						<text class="time"> {{value.CreateTime}}</text>
						</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{value.Account}}</view>
					</view>
				</view>
			</view>
		</view>	
	<!--#endif-->
	</view>
</template>

<script>
var _self;
var code;
import { mapState } from 'vuex';

export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
	data() {
		return {
			top: 0,
			cateCurrentIndex: 0,
			categories: [{ cateid: 0, name: '全部' }, { cateid: 1, name: '直邀' }, { cateid: 2, name: '推荐' }],
			showImg: false,
			FanceList: [
				
			]
		};
	},
	onLoad(option) {
		setTimeout(() => {
			this.showImg = true;
		}, 400)
		this.init('0');
		
	},
	methods: {
		formartDate: function(time) {
			return time.substring(0, 10);
		},
		init(t) {
			this.FanceList=[];
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				data: {
					req: 'Getfensi',
					account:this.Account,
					types:t
				},
				success: result => {
					if(result.data.zjmember.length>0){
						result.data.zjmember.forEach(item => {
							item.CreateTime =item.CreateTime.replace('T',' ').substring(0,10);		
							item.Account=item.Account.replace(item.Account.substring(3,7), "****")
						});
						this.FanceList=result.data.zjmember;
						
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
		tabChange: function(e) {
			// 选中的索引
			var index = e.currentTarget.dataset.index;
			var cateid = e.currentTarget.dataset.cateid;
			console.log(cateid);			
			this.cateCurrentIndex=cateid;
			this.init(cateid);
		}
	}
};
</script>

<style lang="scss">

/* 分段器头部 fixed 定位 */
.fixedit {
	width: 100%;
	// position: fixed;
	z-index: 99;
	left: 0;
	top: 0;
	border-bottom: 2upx solid #f4f8fb;
}
.grace-tab {
	padding: 0;
}
.grace-tab-title {
	white-space: nowrap;
	text-align: center;
	background: #ffffff;
	color: #747474;
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
	color: #333;
}
.headimg {
	border-radius: 50%;
}
.time{
	    float: right;
		font-size:12px;
}
.uni-media-list-logo {	
	width: 84rpx;
	height: 84rpx;

}

.uni-list{
	/*  #ifdef  MP-WEIXIN  */
				margin-top: 46px;
	/*  #endif  */


}
</style>
