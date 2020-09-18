<template>
	<view class="content">
		<view class="Mainbody">
			<image src="https://www.chinaaos.com/static/logonimg.png" style="width:240px;height:240px;"></image>
			<!-- @tap="oauth()" -->
		</view>
		<view class="uni-btn-v">
			<view class="oauth-row" v-if="hasProvider">
				<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
					<!-- #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO -->
					<button type="primary" class="btn-margin" style="background-color: #2ea048;" @tap="oauth()">微信登录</button>
					<!-- <button type="primary" class="btn-margin" style="background-color: #2ea048;" @click="getUserInfo">微信登录</button> -->
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN || MP-BAIDU -->
					<button type="primary" class="btn-margin" open-type="getUserInfo" @getuserinfo="mpGetUserInfo">微信登录</button>
					<!-- #endif -->
				</view>
			</view>
			
			<!-- #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO -->
			<navigator url="/pages/LoginPhone" open-type="redirect" class="mobile-login">手机快速登录></navigator>
			<!-- #endif -->
			
			<!-- #ifdef MP-WEIXIN || MP-BAIDU -->
			<button  style="background-color: initial;font-size: 16px;margin-top: 10px; " open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机快速登录</button>
			<!-- #endif -->		

			
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			providerList: [],
			hasProvider: false,
			hasUserInfo: false,
			MyInfo: {},
			SessionKey:'',
			unionid_id:'',
			openid_id:''
		};
	},
	computed: mapState(['forcedLogin']),
	onLoad() {
		//#ifdef MP-WEIXIN || MP-BAIDU
		this.getWeixinProvider().then((res) => {
			this.unionid_id=res.unionid;
			this.openid_id=res.openid;
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
		getPhoneNumber: function(e) {
			// console.log(e.detail.errMsg);
			// console.log(e.detail.iv);
			// console.log(e.detail.encryptedData);
			var ency = e.detail.encryptedData;
			var iv = e.detail.iv;
			var sessionk = this.SessionKey;						
			if (e.detail.errMsg == 'getPhoneNumber:ok') {  
				uni.request({
					url: 'https://www.chinaaos.com/Handler/MiniHandler.ashx', //接口地址
					data: {
						req: 'GetPhoneNumber',
						encrypdata: ency,
						ivdata: iv,						
						sessionkey: sessionk
					},
					header: {
						'content-type': 'application/json' // 默认值
					},
					success: function(res) {
						var mm=JSON.parse(res.data);
						var phoneObj = mm.phoneNumber;
						console.log("手机号="+phoneObj);		
						uni.redirectTo({
							url: '/pages/LoginPhone?phone='+phoneObj
						});
					},fail: e => {
						uni.showLoading({
							title:"加载中。。。"
						})
					},
					complete: res => {
						
					}
				});		
			}
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
		getUserInfos(userInfo) {
			let list = JSON.stringify(userInfo);
			console.log('list:' + list);
			let openid = userInfo['openId'];
			let unionId = userInfo['unionId'];
			console.log('unionId:' + unionId);
			uni.request({
				url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
				data: {
					req: 'RegUser',
					types: '1',
					Account: '',
					UserName: userInfo['nickName'],
					HeadPortrait: userInfo['avatarUrl'],
					Phonenumber: '',
					Inviter: '',
					openid: openid,
					unionId: unionId
				},
				success: res => {
					var acc = res.data.Account;
					console.log(JSON.stringify(res.data));
					console.log('acc:' + acc);
					console.log('Inviter:' + res.data.Inviter);
					if (res.data.Inviter == '0') {
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
						this.login(acc);
						this.setVIPType(res.data.VIPType);
						this.setUnionid(unionId);
						uni.switchTab({
							url: '/pages/tabbar/my/my?shaxin=shuaxin'
						});
					}
					if (res.data.Inviter == '1') {						
						uni.navigateTo({
							url: 'InviteCode?uname='+acc
						});
					}
					if (res.data.Inviter == '2') {	
						uni.navigateTo({
							url: 'BindPhone?NickName='+res.data.username+"&HeadPortrait="+res.data.HeadPortrait+"&openid="+res.data.openid+"&unionId="+res.data.unionId
						});
					}
				},
				fail: e => {
					console.log(11111111);
				}
			});
		},
		mpGetUserInfo(Info) {
			console.log('weixin微信登录');
			let list = JSON.stringify(Info);
			console.log('list:' + list);
			let k = Info.mp.detail.userInfo;
			let uname = k['nickName'];
			let openid =this.openid_id;
			let unionid = this.unionid_id;
			console.log(uname + openid + k['avatarUrl'] + unionid);
			uni.request({
				url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
				data: {
					req: 'RegUser',
					types: '1',
					Account: '',
					UserName: uname,
					HeadPortrait: k['avatarUrl'],
					Phonenumber: '',
					Inviter: '',
					openid: openid,
					unionId: unionid
				},
				success: res => {
					var acc = res.data.Account;
					console.log('微信登录成功！');
					if (res.data.Inviter == '0') {
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
						this.login(acc);
						this.setVIPType(res.data.VIPType);
						this.setUnionid(unionid);
						uni.navigateBack();
						
					} else if (res.data.Inviter == '1') {
						uni.setStorageSync('useraccount', acc);
						uni.navigateTo({
							url: 'InviteCode'
						});
					} else if (res.data.Inviter == '2') {						
						uni.navigateTo({
							url: 'BindPhone?NickName='+res.data.username+"&HeadPortrait="+res.data.HeadPortrait
						});
					}
				},
				fail: e => {
					console.log(11111111);
				}
			});
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
	}
};
</script>

<style lang="scss">
	button:after{
		border: 0;
	}
.content {
	width: 100%;
	background-color: #fff;
}

.Mainbody {
	text-align: center;
	padding-top: 18%;
}

.uni-btn-v {
	text-align: center;
	position: fixed;
	bottom: 50px;
	width: 100%;
}

.mobile-login {
	margin-top: 20upx;
	font-size: 14px;
}

.uni-btn-v button {
	margin: 0 60upx;
}

.btn-margin {
	margin: 0 60upx;
	background-color: #2ea048;
	border-radius: 10px;
}

.navigator-hover {
	background-color: #fff;
	opacity: 0.7;
}
</style>
