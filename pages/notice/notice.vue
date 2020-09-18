<template>
	<view>
		<view class="notice-item" v-for="(item, index) in noticeList" :key="index">
			<text class="time">{{item.CreateTime}}</text>
			<view class="content">
				<text class="title">{{item.Title}}</text>

				<view class="img-wrapper" v-if="item.MainImg!='' &&  item.MainImg!=null ">
					<rich-text :nodes="item.MainImg"></rich-text>
				</view>

				<text class="introduce" v-if="item.Summarize!='' &&  item.Summarize!=null ">{{item.Summarize}}</text>
				<view class="bot b-t" @click="GoNewDetail(item)">
					<text>查看详情</text>
					<text class="more-icon yticon icon-you">></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var Account;
	var Uguid;
	import {
		mapState
	} from 'vuex'

	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
		data() {
			return {
				noticeList: [],
				ImgIsShow: "block"
			};
		},
		onLoad() {
			this.GetNotice();
		},
		methods: {
			GetNotice() {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'GetNoticeList',
						Types: '2'
					},
					success: result => {
						
						this.noticeList = result.data.noticeList;
						this.noticeList.forEach(item => {
							item.CreateTime =item.CreateTime.replace('T',' ').substring(0,19);
							var str = item.Contents;
							//匹配图片（g表示匹配所有结果i表示区分大小写）
							var imgReg = /<img.*?(?:>|\/>)/gi;
							//匹配src属性
							var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
							var mm=str.match(imgReg);
							if(mm!=null){
								var arr = str.match(imgReg)[0].replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
								item.MainImg = arr;
							}else{
								item.MainImg = '';
							}			
							
						});						
						var mm=this.noticeList;
						debugger
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			GoNewDetail(detail){
				console.log(detail);
				uni.navigateTo({
					url: '/pages/notice/noticeDetail?ngid='+ encodeURIComponent(JSON.stringify(detail))
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}

	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #7d7d7d;
	}

	.content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	}

	.title {
		display: flex;
		align-items: center;
		height: 90upx;
		font-size: 32upx;
		color: #303133;
	}

	.img-wrapper {
		width: 100%;
		height: 260upx;
		position: relative;
		overflow: hidden;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16upx 0;
		font-size: 28upx;
		color: #606266;
		line-height: 38upx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}
</style>
