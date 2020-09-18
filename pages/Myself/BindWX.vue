<template>
	<view class="container">

		<view class="add-address">
			<view class="add-form">
				<view class="form-item">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">微信号</span><input
						class="input"
						@input="bindinputWeChat"
						placeholder="微信号"
						:value="WechatAccount"
						auto-focus
					/>
				</view>
				<view class="form-item">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">真实姓名</span><input
						class="input"
						@input="bindinputName"
						:value="truename"
						placeholder="手机号码"
					/>
				</view>		
				
			</view>
			<view style="width: 100%;margin-top: 80upx;">
			<view class="btns" style="background-color: #FF2741;color: white;font-size: 36upx;line-height: 60upx;vertical-align: middle;width: 94%;margin: auto;border-radius: 5px;">
				<button style="background-color: #FF2741;border-radius: 5px;color: white;" @click="Onloadthis()">确定</button>
			</view>
			</view>
	</view>
	</view>
</template>

<script>
	
var uid;
import { mapState } from 'vuex';
export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'UserProfit', 'VIPType', 'IsShow']),
	data() {
		return {
			headerPosition: 'fixed',
			WechatAccount:'',
			truename:''
		};
	},
	onLoad(option){
		console.log(option.uid);
		uid=option.uid;
		this.init();
	},
	methods: {
		// 获得输入的微信号
		bindinputWeChat(e) {
			this.WechatAccount=e.target.value;
		},
		// 获得输入的姓名
		bindinputName(e) {
			this.truename=e.target.value;
		},
		init(){
			uni.request({
				url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
				data: {
					req: 'GetSelfInfo',
					account: this.Account,
				},
				success: result => {
					console.log(result)
					this.WechatAccount=result.data.ListInfo[0].WeChatAccount;
					this.truename=result.data.ListInfo[0].True_name;
				},
				fail: e => {
					uni.showToast({
						icon: 'none',
						title: e.errMsg
					});
				}
			})
		},
		Onloadthis(){
			if(this.WechatAccount==""){
				uni.showToast({
					icon: 'none',
					title: '请输入微信账号'
				});
				return;
			}
			if(this.truename==""){
				uni.showToast({
					icon: 'none',
					title: '请输入真实姓名'
				});
				return;
			}
			uni.request({
				url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
				data: {
					req: 'BindWithdraw',
					Guids: this.Account,
					AlipayAccount:'',
					True_name:this.truename,
					WeChatAccount:this.WechatAccount,
					BindCardName:'',
					AffiliatedBank:'',
					BankAccount:'',
					BindCardPhone:''
				},
				success: result => {
					console.log(result)
					uni.showToast({
						icon: 'none',
						title: '已绑定'
					});
					uni.navigateBack();
				},
				fail: e => {
					uni.showToast({
						icon: 'none',
						title: e.errMsg
					});
				}
			})
		},
	}
};
</script>

<style>
.container {
	height: 100%;
	width: 100%;
}
	.input{
		color: #747474;
		font-size: 14px;
	}
page {
	height: 100%;
	background: #f4f4f4;
}
.add-address {
	
}

.add-address .add-form {
	background: #fff;
	width: 100%;
	height: auto;
	overflow: hidden;
}

.add-address .form-item {
	height: 116rpx;
	padding-left: 31.25rpx;
	border-bottom: 1px solid #d9d9d9;
	display: flex;
	align-items: center;
	padding-right: 31.25rpx;
}

.add-address .input {
	flex: 1;
	height: 44rpx;
	line-height: 44rpx;
	overflow: hidden;
}

.add-address .form-default {
	border-bottom: 1px solid #d9d9d9;
	height: 75rpx;
	background: #fafafa;
	padding-top: 28rpx;
	font-size: 28rpx;
}



</style>
