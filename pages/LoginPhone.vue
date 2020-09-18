<template>
	<view class="content">
		<view class="top">
			<view style="margin: auto;width:200px;height:200px">
				<image src="https://www.chinaaos.com/static/logonimg.png" style="width:200px;height:200px;"></image>
			</view>
		</view>
		<view style="margin-top:5upx ;">
			
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
			<view style="margin:auto ;width: 90%;"  >
				<view class="than">验证码</view>
				<view class="add-address">
					<view class="add-form">
						<view class="form-item">
							<input type="number" class="input" @input="bindinputYanzhen" :value="yanzhenvalue" placeholder="手机验证码" />
							<button class="mini-btn" @click="getVerificationCode()" :disabled="!codelogin.canGet">
								<span v-show="!codelogin.canGet">{{ codelogin.waitTime }}</span>
								<span v-show="codelogin.canGet">获取验证码</span>
							</button>
						</view>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<view style="margin-top: 60upx;">
				<view class="uni-btn-v" style="width: 90%;width:90%;margin:auto;">									
					<!-- #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO -->
					<button type="primary" class="btn-margin" @click="LoginPhone()" style="background-color:#00BFFF;color: white;">登录</button>
					<!-- #endif -->
					
					<!-- #ifdef MP-WEIXIN || MP-BAIDU -->
					<button type="primary"   v-if="IsgetPhoneNumber==0"   class="btn-margin" open-type="getUserInfo"   @getuserinfo="mpGetUserInfo" style="background-color:#00BFFF;color: white;">登录</button>
					<button type="primary"   v-if="IsgetPhoneNumber==1"   class="btn-margin" open-type="getPhoneNumber"  @getphonenumber="getPhoneNumber"  style="background-color:#00BFFF;color: white;">使用手机号登录</button>
					
					<!-- #endif -->						
				</view>
			</view>
			<view class="login-msg">
				登录即代表同意竞享商城
				<span style="color: #00BFFF;">《竞享商城会员使用协议》</span>
			</view>
		</view>
	</view>
</template>

<script>

import { mapState, mapMutations } from 'vuex';

var util = require('../utils/util.js');
let code = '';

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
			MyInfo: {},
			providerList: [],
			hasProvider: false,
			openid :'',
			unionId:'',
			uname:'',
			HeadPortrait :'',
			phone :'',
			Inviter:'',
			weixintypes:2,
			IsgetPhoneNumber:0,
			SessionKey:''
				
		};
	},
	computed: {
		...mapState(['forcedLogin', 'hasLogin', 'Account','unionid']),
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
		
		//#ifdef MP-WEIXIN || MP-BAIDU		
		this.getWeixinProvider().then((res) => {			
			this.unionId = res.unionid;
			this.openid = res.openid;
			this.SessionKey=res.session_key;			
		});		
		
		if (option.scene) {	//推荐人手机号码		
		    this.Inviter=option.scene;
		}
		
		if(option.phone){////微信授权获取的手机号码	
			this.phonevalue=option.phone;	
		}else{
			this.IsgetPhoneNumber=1;
		}		
		
		//#endif
		
	},
	methods: {
		...mapMutations(['login']),
		...mapMutations(['Set_Userinfo']),
		...mapMutations(['setVIPType']),
		...mapMutations(['Get_UserProfit']),
	    ...mapMutations(['setUnionid']),
		getPhone(e) {
			var sessionk = this.SessionKey;
			return new Promise((resolve, reject) => {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/MiniHandler.ashx', //接口地址
					data: {
						req: 'GetPhoneNumber',
						encrypdata: e.encryptedData,
						ivdata: e.iv,
						sessionkey: sessionk
					},
					header: {
						'content-type': 'application/json' // 默认值
					},
					success: function(res) {
						var mm = JSON.parse(res.data);						
						var phoneObj = mm.phoneNumber;						
						console.log('手机号=' + phoneObj);
						uni.setStorageSync('getPhoneNumber', phoneObj);	
						resolve(phoneObj);			
					}
				});
			});
		},
		getPhoneNumber: function(e) {			
			if (e.detail.errMsg == 'getPhoneNumber:ok') {
				this.getPhone(e.detail).then(res => {
					this.phonevalue=res;
					this.IsgetPhoneNumber=0;
				});					
			}	
		},
		getVerificationCode() { 
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
					code = res.data.Code;
				}
			});

			timeCountdown(this.codelogin);
		},
		bindinputPhone(e) {
			this.phonevalue = e.target.value;
		},
		bindinputYanzhen(e) {
			this.yanzhenvalue = e.target.value;
		},
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
			})
		},
		mpGetUserInfo(Info) {
			this.weixintypes=3;
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
			   var b = this.yanzhenvalue;			
			   if (this.yanzhenvalue != code) {
			   	wx.showToast({
			   		icon: 'none',
			   		title: '验证码输入错误'
			   	});
			   	return;
			   }	
			// #endif
					
			let list = JSON.stringify(Info);
			console.log(list);
			let k = Info.mp.detail.userInfo;
			this.uname = k['nickName'];
			this.HeadPortrait = k['avatarUrl'];
			this.logins();			
		},
		LoginPhone() {
			if (this.phonevalue == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入手机号'
				});
				return;
			}			
			
			if (this.yanzhenvalue == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入验证码'
				});
				return;
			}
			var b = this.yanzhenvalue;
			if (this.yanzhenvalue != code) {
				uni.showToast({
					icon: 'none',
					title: '验证码输入错误'
				});
				return;
			}			
			
			if(this.unionid){
				this.oauth();
				console.log("微信授权");
			}else{				
				console.log("直接登录");
				this.logins();
			}						
		},
		logins(){
			console.log("this.unionId:"+this.unionId);
			console.log("直接登录");
			uni.request({
				url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
				data: {
					req: 'RegUser',
					types: this.weixintypes,
					Account: this.phonevalue,
					UserName: this.uname,
					HeadPortrait: this.HeadPortrait,
					Phonenumber: this.phonevalue,
					Inviter: this.Inviter,
					openid: this.openid,
					unionId:this.unionId
				},
				success: res => {					
					let Inviters = res.data.Inviter;
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
						this.login(this.phonevalue);
						this.setVIPType(res.data.VIPType);
						this.setUnionid(res.data.UnionId);												
						var pages = getCurrentPages();
						var currPage = pages[pages.length - 2]; //上一页页面
						console.log(currPage);// ，就可以看到data里mydata的值了
						if(currPage!=undefined){ //判断上一页面是否存在 
							uni.navigateBack();							
						}else{
							uni.switchTab({
								url: '/pages/tabbar/my/my'
							});
						}						
						
					} else {						
						uni.navigateTo({
							url: 'InviteCode?uname='+this.phonevalue
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
		getUserInfos(userInfo){			
			let list = JSON.stringify(userInfo);
			//console.log('list888888:' + list);			
			this.openid = userInfo['openId'];
			this.unionId =userInfo['unionId'];	
			this.uname = userInfo['nickName'];
			this.HeadPortrait = userInfo['avatarUrl'];
			this.logins();
		},
		oauth() {
			uni.login({
				provider: 'weixin',
				success: res => {
					uni.getUserInfo({
						provider: 'weixin',
						success: infoRes => {							
							console.log('infoRes:' + JSON.stringify(infoRes.userInfo));
							// #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO
							this.getUserInfos(infoRes.userInfo);
							// #endif							
						}
					});
				},
				fail: err => {
					console.error('授权登录失败：' + JSON.stringify(err));
				}
			});
		},
		initProvider() {
			const filters = ['weixin'];
			uni.getProvider({
				service: 'oauth',
				success: res => {
					if (res.provider && res.provider.length) {
						for (let i = 0; i < res.provider.length; i++) {
							if (~filters.indexOf(res.provider[i])) {
								this.providerList.push({
									value: res.provider[i],
									image: 'https://www.chinaaos.com/static/wx.png'
								});
							}
						}
						this.hasProvider = true;
					}
				},
				fail: err => {
					console.error('获取服务供应商失败：' + JSON.stringify(err));
				}
			});
		}
	},
	onReady() {
		this.initProvider();
		console.log('909090909');
	}
};
</script>

<style>
page {
	background-color: #fff;
}

.content {
	width: 100%;
	background-color: #fff;
}

.top {
	width: 90%;
	margin: auto;
	text-align: left;
	font-size: 34upx;
	color: black;
	line-height: 80upx;
	vertical-align: middle;
	padding-top: 40px;
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
	color: #fff !important;
	background-color: #00BFFF;
	width: 100% ;
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

.login-msg {
	width: 90%;
	margin: auto;
	line-height: 80upx;
	font-size: 24upx;
	color: #333;
	vertical-align: middle;
	text-align: center;
}

uni-button[disabled]:not([type]),
uni-button[disabled][type='default'] {
	color: #fff;
	background-color: #00bfff;
}
</style>
