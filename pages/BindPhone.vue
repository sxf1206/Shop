<template>
	<view class="content">		
		<view style="margin-top:20upx ;">
			<!-- #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO -->
			<view style="margin:auto ;width: 90%;">
				<view class="than">手机号码</view>
				<view class="add-address">
					<view class="add-form">
						<view class="form-item">
							<span style="padding-right: 26upx;font-size: 30upx;width:28px;">+86</span>
							<input type="number" class="input" @input="bindinputPhone" placeholder="请输入手机号码" :value="phonevalue" auto-focus />
						</view>
					</view>
				</view>
			</view>
			<view style="margin:auto ;width: 90%;">
				<view class="than">验证码</view>
				<view class="add-address">
					<view class="add-form">
						<view class="form-item">
							<input type="number" class="input" @input="bindinputYanzhen" :value="yanzhenvalue" placeholder="手机验证码" />
							<button class="mini-btn" @click="Getyanzhen()" :disabled="!codelogin.canGet">
								<span v-show="!codelogin.canGet">{{ codelogin.waitTime }}</span>
								<span v-show="codelogin.canGet">获取验证码</span>
							</button>
						</view>
					</view>
				</view>
			</view>

			<view style="margin-top: 80upx;">
				<view class="uni-btn-v" style="width: 90%;width:90%;margin:auto;"><button @click="changeMain()" style="background-color:#00BFFF;color: white;">登录</button></view>
			</view>
			<!-- #endif -->

			<!-- #ifdef MP-WEIXIN || MP-BAIDU -->
			
			<view style="margin: auto;width:200px;height:200px">
				<image src="https://www.chinaaos.com/static/logonimg.png" style="width:200px;height:200px;"></image>
			</view> <!-- 占位符 -->
			
			<view style="margin-top: 80upx;">
				<view class="uni-btn-v" style="width: 90%;width:90%;margin:auto;">
					<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" style="background-color:#00BFFF;color: white;">登录</button>
				</view>
			</view>
			<!-- #endif -->

			<view style="width: 90%;margin: auto; line-height: 80upx;font-size:24upx;color: #333;vertical-align: middle;text-align: center;">
				登录即代表同意竞先商城
				<span style="color: #00BFFF;">《竞先商城会员使用协议》</span>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

var util = require('../utils/util.js');

function timeCountdown(obj) {
	//obj包括timer、waitTime 、canGet

	const TIME_COUNT = 60; //默认倒计时秒数
	if (!obj.timer) {
		obj.waitTime = TIME_COUNT;
		obj.canGet = false;
		obj.timer = setInterval(() => {
			if (obj.waitTime > 0 && obj.waitTime <= TIME_COUNT) {
				obj.waitTime--;
			} else {
				obj.canGet = true;
				clearInterval(obj.timer); //清空定时器
				obj.timer = null;
			}
		}, 1000);
	}
	return {
		timer: obj.timer,
		canGet: obj.canGet,
		waitTime: obj.waitTime + 's重新发送'
	};
}
let codes = '';

export default {
	data() {
		return {
			tempLogin: {
				//定义一个临时对象
				canGet: true,
				timer: null,
				waitTime: 60
			},
			phonevalue: '',
			yanzhenvalue: '',
			code: '',
			MyInfo: {},
			weixintypes: 2,
			openid :'',
			unionId:'',
			SessionKey:'',
			nickname:'',
			HeadPortrait:''
		};
	},
	computed: {
		codelogin() {
			//最终对象
			if (!this.tempLogin.canGet) {
				return timeCountdown(this.tempLogin);
			} else {
				return this.tempLogin;
			}
		}
	},
	onLoad(option) {
		this.nickname=option.NickName;
		this.HeadPortrait=option.HeadPortrait;
		if(option.openid){
			this.unionId = option.unionId;
			this.openid = option.openid;
		}		
		//#ifdef MP-WEIXIN || MP-BAIDU
		this.weixintypes = 3;
		this.getWeixinProvider().then(res => {
			this.unionId = res.unionid;
			this.openid = res.openid;
			this.SessionKey=res.session_key;			
		});
		//#endif
	},
	methods: {
		...mapMutations(['login']),
		...mapMutations(['Set_Userinfo']),
		...mapMutations(['setVIPType']),
		...mapMutations(['Get_UserProfit']),
		...mapMutations(['setUnionid']),
		getWeixinProvider() {
			return new Promise((resolve, reject) => {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						var m = loginRes['code'];
						uni.request({
							url: 'https://www.chinaaos.com/Handler/WxAjaxHandler.ashx', //接口地址
							data: {
								code: m
							},
							header: {
								'content-type': 'application/json' //默认值
							},
							success: function(res) {
								console.log('res:' + JSON.stringify(res));
								var t = JSON.parse(res.data);
								resolve(t);
							}
						});
					}
				});
			});
		},
		getPhone(e) {
			
			return new Promise((resolve, reject) => {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/MiniHandler.ashx', //接口地址
					data: {
						req: 'GetPhoneNumber',
						encrypdata: e.encryptedData,
						ivdata: e.iv,
						sessionkey: this.SessionKey
					},
					header: {
						'content-type': 'application/json' // 默认值
					},
					success: function(res) {
						var mm = JSON.parse(res.data);						
						var phoneObj = mm.phoneNumber;					
						resolve(phoneObj);			
					}
				});
			});
		},
		getPhoneNumber: function(e) {
			if (e.detail.errMsg == 'getPhoneNumber:ok') {
				this.getPhone(e.detail).then(res => {
					this.phonevalue=res;
					this.changeMain();
				});				
			}
		},
		bindinputPhone(e) {
			this.phonevalue = e.target.value;
		},
		bindinputYanzhen(e) {
			this.yanzhenvalue = e.target.value;
		},
		changeMain() {
			var username =this.nickname;
			var HeadPortrait = this.HeadPortrait;
			var openid = this.openid;
			var unionId = this.unionId;
			console.log(username + HeadPortrait + unionId);
			
			if (this.phonevalue == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入手机号'
				});
				return;
			}			

			// #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO			
			if (this.yanzhenvalue == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入验证码'
				});
				return;
			}
			if (this.yanzhenvalue != codes) {
				wx.showToast({
					icon: 'none',
					title: '验证码输入错误'
				});
				return;
			}
			// #endif

			uni.request({
				url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
				data: {
					req: 'AddRegUser',
					types: this.weixintypes,
					Account: this.phonevalue,
					UserName: username,
					HeadPortrait: HeadPortrait,
					openid: openid,
					unionId: unionId
				},
				success: res => {
					console.log('登录成功！');
					let Inviters = res.data.Inviter;
					let account = res.data.Account;
					if (Inviters == '0') {
						this.MyInfo['username'] = res.data.username;
						this.MyInfo['HeadPortrait'] = res.data.HeadPortrait;
						this.MyInfo['openid'] = res.data.openid;
						this.MyInfo['Invitationcode'] = res.data.Invitationcode;
						var VIPProfit = parseFloat(res.data.VIPProfit).toFixed(2);
						var ProductProfit = parseFloat(res.data.ProductProfit).toFixed(2);
						var TotleProfit = parseFloat(res.data.TotleProfit).toFixed(2);
						var MyProfit = {
							VIPProfit: VIPProfit,
							ProductProfit: ProductProfit,
							TotleProfit: TotleProfit
						};
						let mm = this.MyInfo;
						this.Set_Userinfo(mm);
						this.Get_UserProfit(MyProfit);
						this.login(account);
						this.setVIPType(res.data.VIPType);
						this.setUnionid(res.data.UnionId);
						uni.switchTab({
							url: '/pages/tabbar/my/my?shaxin=shuaxin'
						});
					} else {						
						uni.navigateTo({
							url: 'InviteCode?uname='+account
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
		Getyanzhen() {
			if (util.isBlank(this.phonevalue) == true) {
				uni.showToast({
					icon: 'none',
					title: '请输入手机号'
				});
				return;
			}

			uni.request({
				url: 'https://www.chinaaos.com/Handler/SMSHandler.ashx',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					req: 'getCheckCode',
					tenantId: 'AOS',
					account: this.phonevalue,
					phone: this.phonevalue
				},
				success: function(res) {
					codes = res.data.Code;
					console.log(codes);
				}
			});
			timeCountdown(this.codelogin);
		}
	}
};
</script>

<style>
.content {
	width: 100%;
	background-color: #ffffff;
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
	line-height: 100upx;
	vertical-align: middle;
	width: 100%;
	margin: auto;
	text-align: left;
	font-size: 30upx;
	color: #333;
	margin-top: 26upx;
}

.input {
	color: #333;
	font-size: 14px;
}

.add-address .add-form {
	background: #fff;
	width: 100%;
	height: auto;
	overflow: hidden;
}

.add-address .form-item {
	height: 80rpx;
	border-bottom: 1px solid #d9d9d9;
	display: flex;
	align-items: center;
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

.button-hover[type='primary'] {
	color: white !important;
	background-color: #179b16 !important;
	width: 90% !important;
}

page {
	background-color: #fff;
}

.yz {
	text-align: center;
	line-height: 26px;
	vertical-align: middle;
	height: 26px;
}

.mini-btn {
	width: 100px;
	color: #fff;
	height: 34px;
	line-height: 24px;
	font-size: 14px;
	padding: 6px 6px;
	text-align: center;
	vertical-align: middle;
	background-color: #00bfff;
}
</style>
