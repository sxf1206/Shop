<template>
	<view class="content">
		<view class="maininfo">		
			<view class="indexsone">
				<view class="list" v-for="(row, index) in ListInfo" :key="index"  >
					<view style="width: 90%;margin: auto;">
						<view style="float: left;width: 100%;">
							<view class="tableft">
								
								<view class="tabtop">
									<view style="width: 70%;float: left;">
										<!-- {{row.types}} -->
										<view v-if="row.types === 1">
											提现至支付宝
										</view>
										<view v-else-if="row.types === 2">
											提现至微信
										</view>
										<view v-else-if="row.types === 3">
											提现至银行卡
										</view>
										<view v-else>									
										</view>
									</view>
									<view class="priceinfo">
										<block v-if="row.WithdrawStates === 1">
											-
										</block>
										￥{{row.WithdrawRMB}}</view>
								</view>
								<view class="tabtop">
									<view style="width: 50%;float: left;font-size: 28upx;color: #747474;">
										{{row.CreateTime}}
									</view>
									<view class="timeinfo">
										<view v-if="row.WithdrawStates === 0" style="color: black;">
											提现申请中
										</view>
										<view v-else-if="row.WithdrawStates === 1">
											提现成功
										</view>
										<view v-else-if="row.WithdrawStates === 2" style="color: #ff6600;">
											{{row.Reason==''?'提现失败':row.Reason}}
										</view>
										<view v-else>
											
										</view>
									</view>
								</view>
								
								 
							</view>
						</view>
					</view>
				</view>				
			</view>
		</view>
	</view>
</template>

<script>
		var uid;
	export default {
		data() {
			return {
				ListInfo:[],
				tixining:false,
				tixinOK:false,
				tixinNo:false
			};
		},
		onLoad(option){			
			this.init(option.Month);
		},
		methods: {
			init(Month){		
				console.log(Month);
				uni.request({
						url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
						data: {
							req: 'GetDrawDetail',
							account:uni.getStorageSync('Account'),
							Month: Month							
						},
						success: result => {
							result.data.ListInfo.forEach(item => {
								item.CreateTime=item.CreateTime.replace('T',' ');								
							});
							this.ListInfo=result.data.ListInfo;
						},
						fail: e => {
							uni.showToast({
								icon: 'none',
								title: e.errMsg
							});
						}
					});
				
				}
		}
	}
	
</script>

<style lang="scss">
	page{
		background-color: #f4f8fb;
	}
	.content{
		background-color: #fff;
	}
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
		border-bottom: 4upx solid #FF2741 !important;
		color: #333;
	}
	.uni-input {
		height: 40upx;
		padding: 12upx 25upx;
		line-height: 50upx;
		font-size: 28upx;
		background: #fff;
		flex: 1;
		width: 100%;
		border-bottom: 0upx solid #f4f8fb;
		margin: left;
		float: left;
		text-align: left
	}
	
	.indexsone{
		width: 100%;display: block;padding-top: 20upx;background-color: #f4f8fb;
	}
	.tabactive{
		display: block;
	}
	.list{
		width: 100%;background-color: white;height: 140upx;line-height: 140upx;vertical-align:middle;border-bottom: 1upx solid #f1f1f1;
	}
	.timeinfo{
		font-size: 24upx;text-align: right;width: 50%;float: left;color: #FF2741;overflow: hidden;
	}
	.phoneinfo{
		line-height: 38upx;font-size: 24upx;color: black;text-align: left;
	}
	.tabtop{
		line-height: 46upx;font-size: 32upx;color: black;width: 100%;
	}
	.tableft{
		line-height: 84upx;vertical-align: middle;text-align: left;padding:14px 0;
	}
	.priceinfo{
		line-height: 46upx;font-size: 34upx;color: black;width: 100%;text-align:right;
	}
	.titleinfo{
		height: 30px;background-color: #f4f8fb;width: 90%;margin: auto;line-height: 40px;vertical-align: middle;font-size: 30upx;text-align: left;color: #747474
	}
	.maininfo{
		padding: 0;
	}
</style>
