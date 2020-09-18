<template>
	<view class="container">

		<view class="add-address">
			<view class="add-form">
				<view class="form-item">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">姓名</span><input
						class="input"
						@input="bindinputName"
						placeholder="请输入银行卡认证的真实姓名"
						:value="bindname"
						auto-focus
					/>
				</view>
				<view class="form-item">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">所属银行</span><input
						class="input"
						@input="bindinputYH"
						:value="suoshubank"
						placeholder="请输入所属银行"
					/>
				</view>
				<view class="form-item">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">银行卡号</span><input
						class="input"
						@input="bindinputnumber"
						:value="bankcard"
						placeholder="请输入银行卡账号"
					/>
				</view>
				<view class="form-item">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">银行支行</span><input
						class="input"
						@input="bindinputzhihang"
						:value="bankcard"
						placeholder="请输入银行卡支行"
					/>
				</view>
				<view class="form-item">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">手机号码</span><input
						class="input"
						@input="bindinputPhone"
						placeholder="请输入手机号码"
						:value="bindphone"
					/>
				</view>
				<view class="form-item">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">验证码</span><input
						class="input"
						@input="bindinputYanzhen"
						:value="yanzhencode"
						placeholder="请输入验证码"
					/>
					<span style="width: 80px;color: #FF2741;border:1upx solid #FF2741;height:23px;font-size: 24upx;border-radius:5px;text-align: center;line-height: 23px;vertical-align: middle;">获取验证码</span>
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
	var uid;import { mapState } from 'vuex';
export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'UserProfit', 'VIPType', 'IsShow']),
	data() {
		return {
			headerPosition: 'fixed',
			bindname:'',
			suoshubank:'',
			bankcard:'',
			bindphone:'',
			yanzhencode:'',
			bankzhihang:''
		};
	},
	onLoad(option){
		console.log(option.uid);
		uid=option.uid;
		this.init();
	},
	methods: {
		// 获得输入的绑卡姓名
		bindinputName(e) {
			this.bindname=e.target.value;
		},
		// 获得输入的所属银行
		bindinputYH(e) {
			this.suoshubank=e.target.value;
		},
		// 获得输入的银行卡号
		bindinputnumber(e) {
			this.bankcard=e.target.value;
		},
		bindinputzhihang(e) {
			this.bankzhihang=e.target.value;
		},
		
		// 获得输入的所绑定手机
		bindinputPhone(e) {
			this.bindphone=e.target.value;
		},
		// 获得输入的验证码
		bindinputYanzhen(e) {
			this.yanzhencode=e.target.value;
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
					this.bindname=result.data.ListInfo[0].BindCardName;
					this.suoshubank=result.data.ListInfo[0].AffiliatedBank;
					this.bankcard=result.data.ListInfo[0].BankAccount;
					this.bindphone=result.data.ListInfo[0].BindCardPhone;
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
			if(this.bindname==""){
				uni.showToast({
					icon: 'none',
					title: '请输入银行卡认证的真实姓名'
				});
				return;
			}
			if(this.suoshubank==""){
				uni.showToast({
					icon: 'none',
					title: '请输入所属银行'
				});
				return;
			}
			if(this.bankcard==""){
				uni.showToast({
					icon: 'none',
					title: '请输入银行卡号'
				});
				return;
			}			
			
			if(this.bankzhihang==""){
				uni.showToast({
					icon: 'none',
					title: '请输入银行卡支行'
				});
				return;
			}
			if(this.bindphone==""){
				uni.showToast({
					icon: 'none',
					title: '请输入绑卡手机号'
				});
				return;
			}
			if(this.yanzhencode==""){
				uni.showToast({
					icon: 'none',
					title: '请输入验证码'
				});
				return;
			}
			uni.request({
				url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
				data: {
					req: 'BindWithdraw',
					Guids: this.Account,
					AlipayAccount:'',
					True_name:'',
					WeChatAccount:'',
					BindCardName:this.bindname,
					AffiliatedBank:this.suoshubank,
					BankAccount:this.bankcard,
					BindCardPhone:this.bankzhihang,					
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
