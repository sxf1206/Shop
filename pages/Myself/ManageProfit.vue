<template>
	<view class="content">
		<view  class="headers">			
			<view class="title">
				管理收益总额(元)
			</view>
		</view> 
		<view  class="headers">	
			<view class="moneycount">￥{{AccountBalance}}</view>			
		</view> 
		
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" >
				<view class="uni-media-list"  style="height: 64px;">
					<view class="uni-media-list-logo" style="line-height: 42px;">
						头像
					</view>
					<view class="uni-media-list-body">
						手机号
					</view>
					<view class="uni-pull-right" style="line-height: 42px;width: 50px;text-align: right;">
						金额
					</view>
				</view>
			</view>
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in list" :key="key">
				<view class="uni-media-list"  style="height: 64px;">
					<view class="uni-media-list-logo">
						<image v-if="showImg" :src="value.Photo"></image>
					</view>
					<view class="uni-media-list-body">
						{{value.BuyAccount}}
					</view>
					<view class="uni-pull-right" style="line-height: 42px;width: 50px;text-align: right;">
						￥{{value.GetMoney}}
					</view>
				</view>
			</view>
		</view>	
	
	</view>
</template>


<script>
	var uid;
	import {
			mapState
		} from 'vuex'
	
	export default {
	    computed:mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
		data: function() {
			return {
				AccountBalance:0,
				showImg: false,
				list: []
				
			};
		},
		onLoad() {
			setTimeout(() => {
				this.showImg = true;
			}, 400)
			this.init();
		},
		methods:{
			init(){
				console.log(this.Account);
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					method: 'GET',
					data: {
						req: 'GetvipProfit',
						account:this.Account
					},
					success: res => {										
						if(res.data.ResultType==true){
							res.data.Profitlist.forEach(item => {
								item.BuyAccount =item.BuyAccount.substring(0,3)+"****"+item.BuyAccount.substring(7,11);		
								item.GetMoney=parseFloat(item.GetMoney).toFixed(2);																				
							});
							this.list=res.data.Profitlist;
							this.AccountBalance=parseFloat(res.data.VIPProfit).toFixed(2);
						}
					},
					complete: res => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}
				});
						
				
				
			}
			
			
		},
	};
	
</script>

<style lang="scss">
	
	page {
		background-color: #f4f8f9;
		padding-bottom: 100upx;
	}
	
	.content{
		padding-top: 24px;
		/*  #ifdef  APP-PLUS  */
		padding-top: 40px;
		/*  #endif  */
    background-color: #FF6600;
		width: 100%;
	}
	
	.headers {
		border:0px;		width: 92%;	height: 10vw;	padding: 0 4% 4%;display: flex;align-items: center;	vertical-align: middle;line-height: 30vw;
	}
	
	.title{
		color: #fff;
		font-size: 30upx;
		width: 100%;
		text-align: left;
		line-height: 15px;
		height: 15px;
		vertical-align: middle;
		
	}
	.moneycount{
		color: white;
		font-size: 58upx;
		width: 100%;
		margin: auto;
		text-align: left;
		line-height: 30px;
		height: 30px;
		vertical-align: middle;
	}
	
	.uni-media-list-body{		
		text-align: -webkit-center;
		line-height: 42px;
	}
	.uni-media-list-logo {
		width: 50px;
	}
	.uni-media-list-logo image{
		border-radius: 50%;
		height: 42px;
		width: 42px;
	}
	
	.uni-list-cell::after {
		right: 15px;
	}
</style>
