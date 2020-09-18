<template>
	<view class="contents">
		<view class="top">邀请码或邀请人手机号</view>
		<view class="than">请填写邀请码或邀请人手机号</view>
		<view style="margin-top: 80upx;">
			<view style="margin:auto ;width: 90%;">
				<view class="add-address">
					<view class="add-form">
						<view class="form-item">
							<input class="input" @input="bindinputcode" :value="codevalue" placeholder=" " style="font-size: 32px;"/>
						</view>
					</view>
				</view>
			</view>
			<view style="line-height: 60upx;font-size: 24upx;width: 90%;margin: auto;vertical-align: middle;">长按粘贴邀请码</view>
			<view style="margin-top: 80upx;">
				<view class="uni-btn-v" style="width: 90%;width:90%;margin:auto;">
					<button @click="thislogin()" style="background-color:#00BFFF;color: white;">确定</button>
					<!-- <block v-if="contens === false">
					<button  @click="changeMain()" style="background-color:#EEEEEE;color: white;">登录</button>
				</block> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var _self;
	var uname;
	
	// import service from '../service.js';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	
	export default {
		data() {
			return {
				codevalue: '',
				MyInfo: {}
			};
		},
		 computed: mapState(['forcedLogin']),
		onLoad(option) {
			uname=option.uname;
			_self = this;
		},
		methods: {
			...mapMutations(['login']),
			...mapMutations(['Set_Userinfo']),
			...mapMutations(['setVIPType']),
			...mapMutations(['Get_UserProfit']),
			...mapMutations(['setUnionid']),
			bindinputcode(e) {
				_self.codevalue = e.target.value;
			},
			thislogin() {				
				var Account =uname;
				if (_self.codevalue == '') {					
					uni.showToast({
						icon: 'none',
						title: '请输入邀请码'
					});	
					return;
				}
				uni.request({
					url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
					data: {
						req: 'Invitationcode',
						Account: Account,
						Inviter: _self.codevalue
					},
					success: res => {							
						console.log(res);						
						if(res.data.ResultType==true){	
							this.MyInfo["username"] = res.data.username;
							this.MyInfo["HeadPortrait"] = res.data.HeadPortrait;
							this.MyInfo["openid"] = res.data.openid;
							this.MyInfo["Invitationcode"] = res.data.Invitationcode;							
							var VIPProfit=parseFloat(res.data.VIPProfit).toFixed(2);
							var ProductProfit=parseFloat(res.data.ProductProfit).toFixed(2);
							var TotleProfit=parseFloat(res.data.TotleProfit).toFixed(2);
							var MyProfit={
								VIPProfit:VIPProfit,
								ProductProfit:ProductProfit,
								TotleProfit:TotleProfit,
							};
							let mm = this.MyInfo;
							this.Set_Userinfo(mm);
							this.Get_UserProfit(MyProfit);
						    this.login(Account);
							this.setVIPType(res.data.VIPType);
							this.setUnionid(res.data.UnionId);
							uni.switchTab({
								url: '/pages/tabbar/my/my'
							});							
						}else{
							uni.showToast({
								icon: 'none',
								title: '邀请码不存在'
							});				
												
						}
						
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: '邀请码不存在'
						});
					}
				});
			}
		}
	};
</script>

<style>
	page {background-color:#fff;}
	.content {
		width: 100%;
	}
	.top {
		width: 90%;
		margin: auto;
		text-align: left;
		font-size: 34upx;
		color: black;
		line-height: 80upx;
		vertical-align: middle;
	}
	.than {
		line-height: 70upx;
		vertical-align: middle;
		width: 90%;
		margin: auto;
		text-align: left;
		font-size: 30upx;
		color: #666;
	}
	.input {
		color: #333;
		font-size: 18px;
	}
	.add-address .add-form {
		background: #fff;
		width: 100%;
		height: auto;
		overflow: hidden;
	}
	
	.add-address .form-item {
		height: 80rpx;
		
		border-bottom: 2px solid #d9d9d9;
		display: flex;
		align-items: center;
	}
	
	.add-address .input {
		flex: 1;
		height: 54rpx;
		line-height: 54rpx;
		overflow: hidden;
	}
	
	.add-address .form-default {
		border-bottom: 1px solid #d9d9d9;
		height: 75rpx;
		background: #fafafa;
		padding-top: 28rpx;
		font-size: 28rpx;
	}
	.button-hover[type='primary'] {
		color: white !important;
		background-color: #179b16 !important;
		width: 90% !important;
	}
</style>
