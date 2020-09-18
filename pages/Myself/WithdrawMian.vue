<template>
	<view class="container">
		<view class="add-address">
			<view class="add-form">
				<view class="form-item">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">提现方式</span>
					<picker :range="theme" @change="themeTypeChange" :value="themeTypeIndex" mode="selector">
						<view class="uni-input">{{ theme[themeTypeIndex] }}</view>
					</picker>
				</view>
				<view class="form-item" v-if="show==true">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">{{TypeName}}</span>
					<text>{{bankcard}}</text>
				</view>
				
				<view class="form-item">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">真实姓名</span>
					<input class="input" @input="bindinputName" :value="truename"  readonly="readonly" />
				</view>
				<view class="form-item">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">提现金额</span>
					<input class="input" @input="bindinputnumber" :value="Withdrawnum" placeholder="请输入提现金额" />
					<span style="width: 120px;height:23px;font-size: 24upx;border-radius:5px;text-align: center;line-height: 23px;vertical-align: middle;">可提现金额为{{Money}}元</span>
									
				</view>
				<view class="form-item">
					<span style="padding-right: 26upx;font-size: 30upx;width:80px;">账户余额</span>
					<input class="input"    :value="accountbalance" readonly />
					
				</view>
			</view>
			<view style="color: red;padding: 15px;">注：账户余额满一百才能提现！</view>
			<view style="width: 100%;margin-top: 40upx;">
				<view
					class="btns"
					style="background-color: #FF2741;color: white;font-size: 36upx;line-height: 60upx;vertical-align: middle;width: 94%;margin: auto;border-radius: 25px;"
				>
					<button style="background-color: #FF2741;border-radius: 25px;color: white;" @click="SubmitThis()">确定</button>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
var uid;
import { mapState } from 'vuex';

export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
	data() {
		return {
			headerPosition: 'fixed',
			show: false,
			TypeName: '',
			bankcard: '',
			truename: '',
			Withdrawnum: '',
			accountbalance: '',
			Money: 0,
			themeTypeIndex: 0,
			theme: ['请选择', '支付宝', '微信', '银行卡'],
			MemberInfo:{}
		};
	},
	onLoad() {
		this.init();
	},
	methods: {
		
		// 获得绑卡姓名
		bindinputName(e) {
			this.truename = e.target.value;
		},
		// 获得输入的提现金额
		bindinputnumber(e) {
			this.Withdrawnum = e.target.value;
		},		
		init() {			
			uni.request({
				url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
				data: {
					req: 'GetSelfInfo',
					account: this.Account
				},
				success: res => {						
					if (res.data.ResultType == true) {
						this.MemberInfo=res.data.ListInfo[0];
						this.truename=res.data.ListInfo[0].True_name;
					    this.accountbalance=parseFloat(res.data.ListInfo[0].TotalAmount).toFixed(2);	
						if (parseFloat(res.data.ListInfo[0].TotalAmount) > 100) {
							 this.Money = parseFloat(res.data.ListInfo[0].TotalAmount).toFixed(2);
						}	
					}
				},
				fail: e => {
					uni.showToast({
						icon: 'none',
						title: '网络异常,请稍后重试'
					});
				}
			});
			
		},
		themeTypeChange: function(e) {
			this.themeTypeIndex = e.target.value;
			var mm=this.MemberInfo;
			if(e.target.value=="1"){
				if(mm["AlipayAccount"]=="" ||  mm["AlipayAccount"]==null){
					uni.showToast({ icon: 'none', title: '还没绑定支付宝账号' });
					
					setTimeout(() => {
						uni.navigateBack();					
					}, 2500)		
					return;
				}
				this.show=true;
				this.TypeName="支付宝";
				this.bankcard=mm["AlipayAccount"];
			}
			if(e.target.value=="2"){
				if(mm["WeChatAccount"]==""  ||  mm["WeChatAccount"]==null){
					uni.showToast({ icon: 'none', title: '还没绑定微信账号' });					
					setTimeout(() => {
						uni.navigateBack();					
					}, 2500)		
					return;
				}	
				this.show=true;
				this.TypeName="微信";
				this.bankcard=mm["WeChatAccount"];
			}
			if(e.target.value=="3"){
				if(mm["BankAccount"]==""  ||  mm["BankAccount"]==null){
					uni.showToast({ icon: 'none', title: '还没绑定银行卡账号' });
					setTimeout(() => {
						uni.navigateBack();					
					}, 2500)		
					return;
				}	
				this.show=true;
				this.TypeName=mm["BindCardName"];;
				this.bankcard=mm["BankAccount"];
			}
		},
		SubmitThis() {
			if (this.bankcard =='') {
				uni.showToast({ icon: 'none', title: '请选择体现方式' });
				return;
			}
			if (this.truename == '') {
				uni.showToast({ icon: 'none', title: '真实姓名不能为空' });
				return;
			}
			if (this.Withdrawnum == '') {
				uni.showToast({ icon: 'none', title: '提现金额不能为空' });
				return;
			}
			if (this.Withdrawnum < '1') {
				uni.showToast({ icon: 'none', title: '最低提现金额为1元' });
				return;
			}
			if (this.Withdrawnum * 1 > this.accountbalance * 1) {
				uni.showToast({ icon: 'none', title: '余额不足' });
				return;
			}			
			uni.showLoading({
				title:"加载中..."
			})
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				data: {
					req: 'UserWithdraw',
					Account: this.Account,
					types: this.themeTypeIndex,
					truename: this.truename,
					bankcard: this.bankcard,
					Withdrawnum: this.Withdrawnum
				},
				success: res => {
					uni.hideLoading();					
					if (res.data.ResultType == true) {
						uni.showToast({
							icon: 'none',
							title: '提交成功！'
						});						
						setTimeout(() => {
							uni.navigateBack();					
						}, 2000)	
					} else {
						uni.showToast({
							icon: 'none',
							title: '添加失败！'
						});
					}
				},
				fail: e => {
					uni.showToast({
						icon: 'none',
						title: '网络异常,请稍后重试'
					});
				}
			});
					
			
		},
		Changetype() {
			this.show = true;
		}
	}
};
</script>

<style>
.container {
	height: 100%;
	width: 100%;
}
.input {
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

.default-input {
	margin: 0 auto;
	display: block;
	width: 240rpx;
	height: 40rpx;
	padding-left: 50rpx;
	line-height: 40rpx;
	background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/checkbox-sed825af9d3-a6b8540d42.png) 1rpx -448rpx no-repeat;
	background-size: 38rpx 486rpx;
	font-size: 28rpx;
}

.default-input.selected {
	background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/checkbox-sed825af9d3-a6b8540d42.png) 0 -192rpx no-repeat;
	background-size: 38rpx 486rpx;
}

.region-select {
	width: 100%;
	height: 600rpx;
	background: #fff;
	position: fixed;
	z-index: 10;
	left: 0;
	bottom: 0;
}

.region-select .hd {
	height: 108rpx;
	width: 92%;
	border-bottom: 1px solid #f4f4f4;
	padding: 46rpx 30rpx 0 30rpx;
}

.region-select .region-selected {
	float: left;
	height: 60rpx;
	display: flex;
}

.region-select .region-selected .item {
	max-width: 140rpx;
	margin-right: 30rpx;
	text-align: left;
	line-height: 60rpx;
	height: 100%;
	color: #333;
	font-size: 28rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.region-select .region-selected .item.disabled {
	color: #999;
}

.region-select .region-selected .item.selected {
	color: #b4282d;
}

.region-select .done {
	float: right;
	height: 60rpx;
	width: 60rpx;
	border: none;
	background: #fff;
	line-height: 60rpx;
	text-align: center;
	color: #333;
	font-size: 28rpx;
}

.region-select .done.disabled {
	color: #999;
}

.region-select .bd {
	height: 492rpx;
	width: 100%;
	padding: 0 30rpx;
	overflow-y: auto;
}

.region-select .region-list {
	height: auto;
	overflow: scroll;
}

.region-select .region-list .item {
	width: 100%;
	height: 104rpx;
	line-height: 104rpx;
	text-align: left;
	color: #333;
	font-size: 28rpx;
}

.region-select .region-list .item.selected {
	color: #b4282d;
}

.bg-mask {
	height: 100%;
	width: 100%;
	background: rgba(0, 0, 0, 0.4);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 8;
}

/* 列表 */
.uni-list {
	background-color: #ffffff;
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
}
.uni-list:after {
	position: absolute;
	z-index: 10;
	right: 0;
	bottom: 0;
	left: 0;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}
.uni-list::before {
	position: absolute;
	z-index: 10;
	right: 0;
	top: 0;
	left: 0;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}
.uni-list-cell {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.uni-list-cell-hover {
	background-color: #eee;
}
.uni-list-cell-pd {
	padding: 22upx 50upx;
}
.uni-list-cell-left {
	font-size: 28upx;
	padding: 0 30upx;
}
.uni-list-cell-db,
.uni-list-cell-right {
	flex: 1;
}
.uni-list-cell::after {
	position: absolute;
	z-index: 3;
	right: 0;
	bottom: 0;
	left: 30upx;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}
.uni-list .uni-list-cell:last-child::after {
	height: 0upx;
}
.uni-list-cell-last.uni-list-cell::after {
	height: 0upx;
}
.uni-list-cell-divider {
	position: relative;
	display: flex;
	color: #999;
	background-color: #f7f7f7;
	padding: 15upx 20upx;
}
.uni-list-cell-divider::before {
	position: absolute;
	right: 0;
	top: 0;
	left: 0;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}
.uni-list-cell-divider::after {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0upx;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}
.uni-list-cell-navigate {
	font-size: 30upx;
	padding: 22upx 30upx;
	line-height: 48upx;
	position: relative;
	display: flex;
	box-sizing: border-box;
	width: 100%;
	flex: 1;
	justify-content: space-between;
	align-items: center;
}
.uni-list-cell-navigate {
	padding-right: 36upx;
}
.uni-navigate-badge {
	padding-right: 50upx;
}
.uni-list-cell-navigate.uni-navigate-right:after {
	font-family: uniicons;
	content: '\e583';
	position: absolute;
	right: 24upx;
	top: 50%;
	color: #bbb;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
}
.uni-list-cell-navigate.uni-navigate-bottom:after {
	font-family: uniicons;
	content: '\e581';
	position: absolute;
	right: 24upx;
	top: 50%;
	color: #bbb;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
}
.uni-list-cell-navigate.uni-navigate-bottom.uni-active::after {
	font-family: uniicons;
	content: '\e580';
	position: absolute;
	right: 24upx;
	top: 50%;
	color: #bbb;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
}
.uni-collapse.uni-list-cell {
	flex-direction: column;
}
.uni-list-cell-navigate.uni-active {
	background: #eee;
}
.uni-list.uni-collapse {
	box-sizing: border-box;
	height: 0;
	overflow: hidden;
}
.uni-collapse .uni-list-cell {
	padding-left: 20upx;
}
.uni-collapse .uni-list-cell::after {
	left: 52upx;
}
.uni-list.uni-active {
	height: auto;
}
</style>
