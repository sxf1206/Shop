<template>
	<view class="swiper">
		<view class="swiper-title"></view>

		<swiper
			:style="{ height: fullHeight }"
			class="swiper-tall"
			:indicator-dots="indicatorDots"
			:autoplay="autoplay"
			:previous-margin="previousMargin"
			:next-margin="nextMargin"
			:circular="circular"
			@change="change"
			:current="swiperCurrentIndex"
		>
			<swiper-item class="swiper-container" v-for="(img, index) in imgs" :key="index" :item-id="index" :data-year="index">
				<view class="swiper-item" :style="{ background: img ? 'url(' + img + ') center no-repeat' : '', backgroundSize: 'cover' }" :animation="animationData[index]"></view>
			</swiper-item>
		</swiper>

		<view style="width: 100%;position:fixed;bottom: 0 ;padding: 0 20px;text-align: center;height: 50px;">
			<view class="saveimg" @click="save">保存图片</view>
			<!-- #ifdef APP-PLUS -->
			<view class="button saveimg " @tap="showshare" style="top: initial;position: initial;border: 0px solid #ECB100;">分享图片</view>
			<!-- #endif -->
		</view>

		<!-- #ifdef APP-PLUS -->

		<!-- <view class="uni-btn-v uni-common-mt" v-if="providerList.length > 0">
			<block v-for="(value,index) in providerList" :key="index">
				<button type="primary" v-if="value" :disabled="shareType === 5 && value.name !== '分享到微信好友'" @tap="share(value)">{{value.name}}</button>
			</block>
		</view> -->
		<!-- #endif -->

		<view class="share" :class="shareClass" @touchmove.stop.prevent="discard" @tap="hideShare">
			<view class="mask"></view>
			<view class="layer">
				<view class="h1">分享</view>
				<view class="list">
					<view class="box" v-for="(value, index) in providerList" :key="index">
						<view @tap="share(value)">
							<image :src="value.imges"></image>
							<view class="title">{{ value.name }}</view>
						</view>
					</view>
				</view>
				<view class="btn" @tap="hideShare" style="border: 0;border-top: 0;margin-top: 0px;">取消</view>
			</view>
		</view>
	</view>
</template>
<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			screenHeight: 0,
			animationData: {
				0: {},
				1: {},
				2: {},
				3: {},
				4: {},
				5: {}
			},
			title: '0',
			indicatorDots: false,
			autoplay: false,
			previousMargin: uni.upx2px(82) + 'px',
			nextMargin: uni.upx2px(82) + 'px',
			circular: true,
			zoomParam: 1.1,
			swiperCurrentIndex: 0,
			data: [],
			max: 0,
			imgs: [],
			image: '',
			shareType: 2,
			providerList: [],
			shareClass: '' //分享弹窗css类，控制开关动画
		};
	},
	computed: {
		...mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
		fullHeight() {
			const res = uni.getSystemInfoSync();
			return res.windowHeight - uni.upx2px(60) - (res.statusBarHeight + 44) + 'px';
		}
	},
	onLoad() {
		this.Imglist();
		this.animation = uni.createAnimation();
		this.animation.scale(this.zoomParam).step();
		this.animationData[0] = this.animation.export();
		this.image = this.imgs[0];

		// #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO
		uni.getProvider({
			service: 'share',
			success: e => {
				console.log('success', e);
				let data = [];
				for (let i = 0; i < e.provider.length; i++) {
					switch (e.provider[i]) {
						case 'weixin':
							data.push({
								name: '微信好友',
								id: 'weixin',
								imges: 'https://www.chinaaos.com/static/wx.png',
								sort: 0
							});
							data.push({
								name: '朋友圈',
								id: 'weixin',
								imges: 'https://www.chinaaos.com/static/pyq.png',
								type: 'WXSenceTimeline',
								sort: 1
							});
							break;
						case 'sinaweibo':
							data.push({
								name: '新浪微博',
								imges: 'https://www.chinaaos.com/static/wb.png',
								id: 'sinaweibo',
								sort: 2
							});
							break;
						case 'qq':
							data.push({
								name: 'QQ',
								imges: 'https://www.chinaaos.com/static/qq.png',
								id: 'qq',
								sort: 3
							});
							break;
						default:
							break;
					}
				}
				this.providerList = data.sort((x, y) => {
					return x.sort - y.sort;
				});
			},
			fail: e => {
				console.log('获取分享通道失败', e);
				uni.showModal({
					content: '获取分享通道失败',
					showCancel: false
				});
			}
		});
		// #endif
	},
	methods: {
		change(e) {
			this.swiperCurrentIndex = e.detail.current;
			this.title = e.detail.currentItemId;
			let nn = this.imgs[e.detail.currentItemId];
			this.image = nn;
			for (let key in this.animationData) {
				if (e.detail.currentItemId == key) {
					this.animation.scale(this.zoomParam).step();
					this.animationData[key] = this.animation.export();
				} else {
					this.animation.scale(1.0).step();
					this.animationData[key] = this.animation.export();
				}
			}
		},
		async share(e) {
			console.log('分享通道:' + e.id + '； 分享类型:' + this.shareType);
			if (!this.image && (this.shareType === 2 || this.shareType === 0)) {
				uni.showModal({
					content: '分享图片不能为空',
					showCancel: false
				});
				return;
			}

			let shareOPtions = {
				provider: e.id,
				scene: e.type && e.type === 'WXSenceTimeline' ? 'WXSenceTimeline' : 'WXSceneSession', //WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏
				type: this.shareType,
				success: e => {
					console.log('success', e);
					uni.showModal({
						content: '分享成功',
						showCancel: false
					});
				},
				fail: e => {
					console.log('fail', e);
					uni.showModal({
						content: e.errMsg,
						showCancel: false
					});
				},
				complete: function() {
					console.log('分享操作结束!');
				}
			};

			switch (this.shareType) {
				case 2:
					shareOPtions.imageUrl = this.image;
					break;
				default:
					break;
			}

			uni.share(shareOPtions);
		},
		// 分享
		showshare() {
			this.shareClass = 'show';
		},
		hideShare() {
			this.shareClass = 'hide';
			setTimeout(() => {
				this.shareClass = 'none';
			}, 150);
		}, //保存图片到相册
		save() {
			var nnn = this.image;			
			
			
			//#ifdef MP-WEIXIN || MP-BAIDU
			uni.showLoading({
				title:"保存中..."
			})
			uni.downloadFile({
					url: nnn,
					success: (res) =>{
						if (res.statusCode === 200){
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.hideLoading();
									uni.showToast({
										title: "保存成功",
										icon: "none"
									});
								},
								fail: function() {
									uni.showToast({
										title: "保存失败，请稍后重试",
										icon: "none"
									});
								}
							});
						}
					}
				})
		   //#endif
		   
		   // #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO
			uni.showActionSheet({
				itemList: ['保存图片到相册'],
				success: () => {
					plus.gallery.save(nnn, function() {						
						uni.showToast({
							title:'保存成功',
							icon:'none'
						})
					}, function() {
						uni.showToast({
							title:'保存失败，请重试！',
							icon:'none'
						})
					});
				}
			});
			
			// #endif
		},
		Imglist() {
			uni.showLoading({
				title: '加载中...'
			});
			uni.request({
				url: 'https://www.chinaaos.com/Handler/GetPicHandler.ashx',
				data: {
					Account: this.Account,
					PreCode: this.Userinfo.Invitationcode
				},
				success: res => {
					uni.hideLoading();
					this.imgs.push('https://www.chinaaos.com/Invitation/' + this.Account + '/1.jpg');
					this.imgs.push('https://www.chinaaos.com/Invitation/' + this.Account + '/2.jpg');
					this.imgs.push('https://www.chinaaos.com/Invitation/' + this.Account + '/3.jpg');
					this.imgs.push('https://www.chinaaos.com/Invitation/' + this.Account + '/4.jpg');
					this.imgs.push('https://www.chinaaos.com/Invitation/' + this.Account + '/5.jpg');
				},
				fail: e => {
					uni.showToast({
						icon: 'none',
						title: '网络异常,请稍后重试'
					});
				}
			});
		}
	}
};
</script>

<style>
page {
	display: flex;
	flex-wrap: wrap;
}

.swiper-container {
	display: flex;
	align-items: center;
}

.swiper-item {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-left: auto;
	margin-right: auto;
	height: 888upx;
	width: 500upx;
	line-height: 300upx;
	text-align: center;
	broder-radius: 6upx;
	margin-bottom: 50upx;
}

.swiper-tall {
	display: flex;
	align-items: center;
}

.swiper-title {
	width: 750upx;
	text-align: center;
}

.saveimg {
	background-color: #ff3952;
	padding: 8px 0;
	color: #fff;
	text-align: center;
	border-radius: 20px;
	margin: 0 10px;
	height: 40px;
	line-height: 24px;
	display: initial;
	width: 140px;
	font-size: 14px;
	padding: 10px 30px;
}

.share {
	display: none;
}

.show {
	display: block;
}

.hide {
	display: block;
}

.none {
	display: none;
}

.mask {
	background-color: rgba(0, 0, 0, 0.5);
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	z-index: 21;
}

.layer {
	width: 96%;
	position: fixed;
	z-index: 22;
	padding: 0 2%;
	bottom: 0px;
	background-color: rgba(255, 255, 255, 0.9);
}

.layer .list {
	width: 100%;
	display: flex;
	padding: 10upx 0 30upx 0;
}

.layer .list .box {
	width: 25%;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}

.layer .list .box image {
	width: 13.8vw;
	height: 13.8vw;
}

.layer .list .box .title {
	margin-top: 10upx;
	display: flex;
	justify-content: center;
	width: 100%;
	font-size: 26upx;
}

.layer .btn {
	width: 100%;
	height: 100upx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28upx;
	border-top: solid 1upx #eaeaea;
}

.layer .h1 {
	width: 100%;
	height: 80upx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 34upx;
}
</style>
