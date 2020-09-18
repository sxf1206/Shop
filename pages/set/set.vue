<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="navTo('个人资料')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">个人资料</text>
			<text class="cell-more">
				<image class="to" src="/static/to.png"></image>
			</text>
		</view>
		<view class="list-cell b-b" @click="navTo('收货地址')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">收货地址</text>
			<text class="cell-more">
				<image class="to" src="/static/to.png"></image>
			</text>
		</view>
		

		<view class="list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch checked color="#fa436a" @change="switchChange" />
		</view>
		<!-- <view class="list-cell m-t b-b" @click="navTo('清除缓存')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<text class="cell-more">
				<image class="to" src="/static/to.png"></image>
			</text>
		</view> -->
		<view class="list-cell b-b" @click="navTo('关于商城')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于商城</text>
			<text class="cell-more">
				<image class="to" src="/static/to.png"></image>
			</text>
		</view>
		<view class="list-cell" @click="navTo('检查更新')">
			<text class="cell-tit">检查更新</text>
			<text class="cell-tip">当前版本 {{BBH}}</text>
			<text class="cell-more"></text>
		</view>
		
		
		<!--#ifdef APP-PLUS -->
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit" style="color: red;">退出登录</text>
		</view>
		<!-- #endif -->
		
		
		
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	var Account;
	export default {
		data() {
			return {
				BBH: "1.0.00"
			};
		},
		onLoad() {
			Account = uni.getStorageSync('Account');
			console.log("setaccount:" + Account);
			// #ifdef APP-PLUS
			this.BBH=plus.runtime.version;
			console.log('success', plus.runtime.version);
			// #endif
		},
		methods: {
			...mapMutations(['logout']),
			navTo(url) {
				if (url == "个人资料") {
					uni.navigateTo({
						url: '../Myself/MyDetails'
					});
				} else if (url == "收货地址") {
					uni.navigateTo({
						url: '/pages/address/address'
					});
				} else if (url == "实名认证") {
					uni.navigateTo({
						url: '/pages/Myself/Myphone'
					});
				} else if (url == "清除缓存") {
					uni.navigateTo({
						url: ''
					});
				} else if (url == "关于商城") {
					uni.navigateTo({
						url: ''
					});
				}else if (url == "检查更新") {
					// #ifdef APP-PLUS
					uni.request({
						url: 'https://www.chinaaos.com/Handler/UpdateAPPHandler.ashx', //检查更新的服务器地址
						data: {
							appid: "",
							version: this.BBH,
							imei: ""
						},
						success: (res) => {
							console.log('success', res);
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
					// #endif
				}
			},
			//退出登录
			toLogout() {
				uni.showModal({
					content: '确定要退出登录么',
					success: (e) => {
						if (e.confirm) {
							this.logout();
							uni.navigateTo({
								url: '/pages/LoginWChat',
							});
						}
					}
				});
			},
			//switch
			switchChange(e) {
				let statusTip = e.detail.value ? '打开' : '关闭';
				uni.showToast({
					title: '消息推送'
				});
			},

		}
	}
</script>

<style lang='scss'>
	page {
		background: #fafafa;
	}

	.list-cell {
		display: flex;
		align-items: baseline;
		padding: 20upx 20px;
		line-height: 60upx;
		position: relative;
		background: #fff;
		justify-content: center;
		border-bottom: 1px solid #fafafa;

		&.log-out-btn {
			margin-top: 40upx;

			.cell-tit {
				color: #747474;
				text-align: center;
				margin-right: 0;
			}
		}

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		&.m-t {
			margin-top: 16upx;
		}

		.cell-more {
			align-self: baseline;
			font-size: 14px;
			color: #747474;
			margin-left: 10upx;

			.to {
				flex-shrink: 0;
				width: 40upx;
				height: 40upx;
			}
		}

		.cell-tit {
			flex: 1;
			font-size: 16px;
			color: #747474;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 14px;
			color: #747474;
		}

		switch {
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
