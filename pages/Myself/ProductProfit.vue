<template>
	<view class="content">
		<view class="headers">
			<view class="cate-section">
				<view class="cate-item">
					到账佣金(元)
					<text class="moneycount">￥{{dzProfit}}</text>
				</view>
				<view class="cate-item">
					预期佣金(元)
					<text class="moneycount">￥{{yqProfit}}</text>
				</view>
			</view>	
		</view>
		<view class="cate-section">
			<view class="cate-item cate-item-item" >
				直推销售额：￥{{ztMoney}}				
			</view>
			<view class="cate-item cate-item-item" >
				直推预期佣金：￥{{ztyqProfit}}				
			</view>
			<view class="cate-item cate-item-item" >
				团队销售额：￥{{teammoney}}				
			</view>
			<view class="cate-item cate-item-item" >
				团队预期佣金：￥{{teamyqProfit}}				
			</view>
		</view>

		<view class="uni-list">
			<view style="width: 92%;padding:4% 4% 0;font-size: 12px;color: red;">
				注：订单签收后15天，不发生退货、换货等售后问题的订单，对应的佣金收益将由预期佣金转入到账佣金。
			</view>

			<view class="uni-list-cell" hover-class="uni-list-cell-hover">
				<view class="uni-media-list" style="height: 64px;">
					<view class="uni-media-list-logo" style="line-height: 42px;">明细</view>
					<view class="uni-media-list-body" style="text-align: -webkit-center;">产品信息</view>
					<view class="uni-pull-right right-pull" >销售金额</view>
					<view class="uni-pull-right" style="line-height: 42px;width: 50px;text-align: right;">佣金</view>
				</view>
			</view>
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value, key) in list" :key="key">
				<view class="uni-media-list" style="height: 64px;">
					<view class="uni-media-list-logo" v-if="value.Types==2">团队</view>
					<view class="uni-media-list-logo" v-if="value.Types==1"><image v-if="showImg" :src="value.Photo"></image></view>
					<view class="uni-media-list-body">
						<view class="uni-flex uni-row">
							<view class="text" style="width:42px;"><image v-if="showImg" :src="value.ImagePath"></image></view>
							<view class="text" style="flex: 1;line-height: 1.5;margin-left: 3px;">{{ value.ProductName }}</view>
						</view>
					</view>
					<view class="uni-pull-right right-pull" >￥{{ value.SalePrice }}</view>
					<view class="uni-pull-right" style="line-height: 42px;width: 50px;text-align: right;">
						<block v-if="value.Isdel==0">
							+{{ value.GetMoney }}
						</block>
						<block v-else>
							<text style="color: red;">-{{ value.GetMoney}}</text>
						</block>						
						
						</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>

import {
		mapState
	} from 'vuex'

export default {
    computed:mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
	data: function() {
		return {
			dzProfit: 0,
			yqProfit: 0,
			ztMoney: 0,
			ztyqProfit: 0,
			teammoney: 0,
			teamyqProfit: 0,
			showImg: false,
			list: []
		};
	},
	onLoad() {
		setTimeout(() => {
			this.showImg = true;
		}, 400);
		
		this.init();
		
	},
	methods: {
		init(){
			
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				method: 'GET',
				data: {
					req: 'GetGoodsProfit',
					account: this.Account
				},
				success: res => {										
					if(res.data.ResultType==true){
						this.teammoney=parseFloat(res.data.teammoney).toFixed(2);
						this.teamyqProfit=parseFloat(res.data.teamyqProfit).toFixed(2);
						this.ztMoney=parseFloat(res.data.ztMoney).toFixed(2);
						this.ztyqProfit=parseFloat(res.data.ztyqProfit).toFixed(2);						
						this.yqProfit=(parseFloat(res.data.teamyqProfit)+parseFloat(res.data.ztyqProfit)).toFixed(2);
						
						res.data.Profitlist.forEach(item => {
							if(item.ImagePath!=null){
								item.ImagePath = "https://www.chinaaos.com" + item.ImagePath.split(',')[0];
							}else{
								item.ImagePath = "https://www.chinaaos.com" + item.ImagePath;								
							}	
							item.GetMoney=parseFloat(item.GetMoney).toFixed(2);	
						});
						this.list=res.data.Profitlist;
					}
				},
				complete: res => {
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
			});
					
			
			
		}
		
		
	}
};
</script>

<style lang="scss">
page {
	background-color: #f4f8f9;
	padding-bottom: 100upx;
}

.content {
	padding-top: 24px;
	/*  #ifdef  APP-PLUS  */
	padding-top: 24px;
	/*  #endif  */
	background-color: #ff6600;
	width: 100%;
}

.headers {
	border: 0px;
	width: 92%;
	padding: 0 4% 0;
	display: flex;
	align-items: center;
	vertical-align: middle;
	line-height: 30vw;
}

.moneycount {
	color: white;
	font-size: 58upx;
	margin: auto;
	text-align: -webkit-center;
	vertical-align: middle;
}

.uni-media-list-body {
	text-align: left;
	line-height: 42px;
	margin-left: 10px;
}
.uni-media-list-body image{
	height: 42px;
	width: 42px;
}
.uni-media-list-logo {
	width: 50px;
}
.uni-media-list-logo image {
	border-radius: 50%;
	height: 42px;
	width: 42px;
}

/* 分类 */
.cate-section {
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex-wrap: wrap;
	padding: 10upx 0;
	color: #fff;
}

.cate-section .cate-item {
	width: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	font-size: 30upx;
}
.cate-item-item{
	display: -webkit-inline-box;margin-bottom: 10px;
}
.right-pull{
	line-height: 42px;width: 80px;text-align: center;
	
}
.uni-list-cell::after {
	right: 15px;
}
</style>
