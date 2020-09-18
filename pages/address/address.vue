<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.IsDefault" class="tag" style="width: 28px;padding: 5rpx !important;">默认</text>
					<text class="address">{{item.Address}} {{item.AddressDetail}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.ShipTo}}</text>
					<text class="mobile">{{item.Phone}}</text>
				</view>
			</view>
			<view class="yticon icon-bianji" @click.stop="addAddress('edit', item.Guid)">
				<image src="/static/bianji.png" style="width: 22px;height: 22px;"></image>
			</view>
		</view>
		
		<button class="add-btn" @click="addAddress('add','')">新增地址</button>
	</view>
</template>

<script>
	var Account;
	var Uguid;
		import {
			mapState
		} from 'vuex'
	
	export default {
		    computed:mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
		data() {
			return {
				source: 0,
				addressList: [],
				AdressGuid:"",
			}
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
			this.init();
		},
		onLoad(option){
			console.log(option.source);
			this.source = option.source;
			this.init();
		},
		onShow(){
			this.init();
		},
		methods: {
			init(){
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QueryAdressBySelf',
						account:uni.getStorageSync('Account'),
						Guid:this.AdressGuid
					},
					success: result => {
						 let list = JSON.stringify(result.data.AddressList);
						this.addressList=JSON.parse(list);
						this.addressList.forEach(item=>{
							if(item.IsDefault==1){
								item.IsDefault=true;
							}else{
								item.IsDefault=false;
							}
						});
					
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			onPullDownRefresh() {
				this.init();
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			//选择地址
			checkAddress(item){
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					// this.$api.prePage().addressData = item;
					this.$api.prePage().ShipTo = item.ShipTo;
					this.$api.prePage().Phone = item.Phone;
					this.$api.prePage().Address = item.Address;
					this.$api.prePage().AddressDetail = item.AddressDetail;
					this.$api.prePage().Longitude = item.Longitude;
					this.$api.prePage().Latitude = item.Latitude;
					uni.navigateBack()
				}
			},
			addAddress(mtype, AdressGuid){
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${mtype}&AdressGuid=${AdressGuid}&comefrom=''`
				})
				// uni.navigateTo({
				// 	url: '/pages/address/addressManage?type=${mtype}&data=${AdressGuid}'
				// })
			},
			//添加或修改成功之后回调
			refreshList(data, type){
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.addressList.unshift(data);
				console.log(data, type);
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
		background-color: #fafafa
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
		border-bottom: 2px solid #fafafa;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			color: black;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: #747474;
		}
	}
	.u-box{
		font-size: 28upx;
		color: black;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		width: 40px;
		font-size: 40upx;
		color: #747474;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: red;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
