<script>
	/**
	 * vuex管理登陆状态，具体可以参考官方登陆模板示例
	 */
	import {
		mapMutations
	} from 'vuex';
export default {	
	methods: {
		...mapMutations(['login']),
		...mapMutations(['Get_UserProfit']),
		...mapMutations(['setVIPType']),
		...mapMutations(['setIsShow']),
	},
	onLaunch: function() {
		console.log('App Launch');
		let wx_isshow = uni.getStorageSync('IsShow') || 0;
		console.log("wx_isshow:"+wx_isshow);
		uni.request({
			url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
			data: {
				req: 'MiniShenHe'
			},
			success: res => {				
				console.log("IsShow:"+res.data.IsShow);
				if(wx_isshow=="0"  &&  res.data.IsShow!="0"){
					this.setIsShow(res.data.IsShow);
				}
			},
			fail: e => {
				
			}
		});
		
		// #ifdef APP-PLUS
		// 锁定屏幕方向
		plus.screen.lockOrientation('portrait-primary'); //锁定
		// 检测升级
		console.log('success', plus.runtime.appid);
		console.log('success', plus.runtime.version);
		console.log('success', plus.device.imei);
		uni.request({
			url: 'https://www.chinaaos.com/Handler/UpdateAPPHandler.ashx', //检查更新的服务器地址
			data: {
				appid: plus.runtime.appid,
				version: plus.runtime.version,
				imei: plus.device.imei
			},
			success: (res) => {
				
				console.log('success909090：', res);
				if (res.statusCode == 200 && res.data.isUpdate) {
					let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android;
					// 提醒用户更新
					uni.showModal({
						title: '更新提示',
						content: res.data.note ? res.data.note : '是否选择更新',
						success: (showResult) => {
							if (showResult.confirm) {
								plus.runtime.openURL(openUrl);
							}
						}
					})
				}
			}
		})
		var domModule = weex.requireModule('dom');
		            domModule.addRule('fontFace', {
		                'fontFamily': "uniicons",
		                'src': "url('./static/uni.ttf')"
		            });
		// #endif		
		
		let userInfo = uni.getStorageSync('Account') || '';	
	  
		if(userInfo!=undefined  &&  userInfo!=''){			
			//更新登陆状态
			uni.request({
				url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
				data: {
					req: 'GetUserProfit',
					account: userInfo
				},
				success: res => {						
					if (res.data.ResultType == true) {
						var VIPProfit=parseFloat(res.data.ListInfo[0].VIPProfit).toFixed(2);
						var ProductProfit=parseFloat(res.data.ListInfo[0].ProductProfit).toFixed(2);
						var TotleProfit=parseFloat(res.data.ListInfo[0].TotleProfit).toFixed(2);							
						var MyProfit={
							VIPProfit:VIPProfit,
							ProductProfit:ProductProfit,
							TotleProfit:TotleProfit,
						};
						console.log("MyProfit:"+JSON.stringify(MyProfit));
						this.Get_UserProfit(MyProfit);		
						this.setVIPType(res.data.ListInfo[0].VIPType);											
					}
				},
				fail: e => {
					uni.showToast({
						icon: 'none',
						title: '网络异常,请稍后重试'
					});
				}
			});
						
		}
		
		
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	}
};
</script>

<style>
/*每个页面公共css */ 

/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';

	/* 以下样式用于 hello uni-app 演示所需 */
	page {
		background-color: #fff;
		height: 100%;
		font-size: 28upx;
		line-height: 1.8;
	}

	.uni-header-logo {
		padding: 30upx;
		text-align: center;
		margin-top: 10upx;
	}

	.uni-header-logo image {
		width: 140upx;
		height: 140upx;
	}

	.uni-hello-text {
		color: #7A7E83;
	}

	.uni-hello-addfile {
		text-align: center;
		line-height: 300upx;
		background: #FFF;
		padding: 50upx;
		margin-top: 10px;
		font-size: 38upx;
		color: #808080;
	}

</style>
