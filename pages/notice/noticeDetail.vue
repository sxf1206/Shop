<template>
	<view>
		<!-- <uni-nav-bar class="titlea" left-icon="back" :title="newstitle" @click-left="back" /> -->
		<view style="padding: 0 30upx;overflow: hidden;font-size: 30upx;margin-bottom: 30upx;">						
			<rich-text :nodes="desc"/>
		</view>
		<view style="text-align: right;padding-bottom: 24px;padding-right: 16px;"> {{FabuT}}</view>
		<!-- <video src="" enable-danmu danmu-btn controls></video> -->
	</view>
</template>

<script>
	// #ifdef MP-ALIPAY
	import htmlParser from '@/common/html-parser'
	// #endif
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon/uni-icon.vue'
	export default {
		components: {
			uniNavBar,
			uniIcon
		},
		data() {
			return {
				newgid: "",
				newstitle: "",
				desc: "",
				FabuT: "",
				banner:{}
			}
		},
		onLoad(option) {
			
			try {
				this.banner = JSON.parse(decodeURIComponent(option.ngid));
			} catch (error) {
				this.banner = JSON.parse(option.ngid);
			}
			this.newgid = this.banner.Guid;
			this.GetInfo();
			uni.setNavigationBarTitle({
				title: this.banner.Title
			});
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			GetInfo() {				
				uni.request({
					url: 'https://www.chinaaos.com/Handler/sysmgrHandler.ashx',
					data: {
						req: 'GetNewsInfo',
						Guids: this.newgid
					},
					success: result => {						
						this.newstitle = result.data[0].Title;						
						// // #ifdef MP-ALIPAY
						// this.desc = htmlParser(result.data[0].Contents);
						// // #endif
						// // #ifndef MP-ALIPAY
						// this.desc = result.data[0].Contents;
						// // #endif						
						this.desc =result.data[0].Contents.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');						
						this.FabuT = result.data[0].CreateTime.replace('T',' ').substring(0,19);
						
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			}
		},
		onPullDownRefresh() {
			console.log('onPullDownRefresh')
			setTimeout(function() {
				uni.stopPullDownRefresh()
				console.log('stopPullDownRefresh')
			}, 1000)
		}
	}
</script>

<style lang="scss">
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff
	}

	view {
		font-size: 28upx;
		line-height: inherit
	}

	.example {
		padding: 0 30upx 30upx
	}

	.example-title {
		font-size: 32upx;
		line-height: 32upx;
		color: #777;
		margin: 40upx 25upx;
		position: relative
	}

	.example .example-title {
		margin: 40upx 0
	}

	.example-body {
		padding: 0 40upx
	}

	.uni-common-mt {
		color: #7a7e83;
		font-size: 28upx;
		padding: 30upx;
	}

	.title {
		font-size: 15px;
		line-height: 20px;
		color: #333333;
		padding: 15px;
	}

	.city {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-left: 8px;
		white-space: nowrap;
	}

	.input-view {
		width: 92%;
		display: flex;
		background-color: #e7e7e7;
		height: 30px;
		border-radius: 15px;
		padding: 0 4%;
		flex-wrap: nowrap;
		margin: 7px 0;
		line-height: 30px;
	}

	.input-view .uni-icon {
		line-height: 30px !important;
	}

	.input-view .input {
		height: 30px;
		line-height: 30px;
		width: 94%;
		padding: 0 3%;
	}

	.titlea {
		margin-top: 80px;
		// #ifdef H5
		margin-top: 0rpx;
		// #endif
		// #ifdef MP-WEIXIN
		margin-top: 80px;
		// #endif
		// #ifdef APP-PLUS
		margin-top: 80px;
		// #endif
	}

	.descTuwen div {
		width: 100%;
		margin-left: 16px;
		margin-right: 16px;
		white-space: normal;

		p {
			white-space: normal;
			
			span {
				white-space: normal;
			}
		}
	}

	.descTuwen image {

		width: 100%;
	}
</style>
