<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell cell-pd">
				<view class="uni-uploader">					
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-for="(image, index) in imageList" :key="index">
								<view class="uni-uploader__file"><image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image></view>
							</block>
							<view class="uni-uploader__input-box"><view class="uni-uploader__input" @tap="chooseImage"></view></view>
						</view>
					</view>
				</view>
			</view>

			<view class="uni-form-item uni-column"><input class="uni-input" maxlength="50"  placeholder="填写标题会有更多的赞哦~"  @input="bindinputTitle" /></view>
			<view class="uni-textarea"><textarea  placeholder-style="color:#909090" placeholder="添加正文"   maxlength="1000"      @input="bindinputDesc" /></view>
             
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate uni-navigate-right uni-media-list ">
					参与话题
					<view class="uni-list-cell-right" style="text-align: right;">
						<picker :range="theme" @change="themeTypeChange" :value="themeTypeIndex" mode="selector">
							<view class="uni-input">{{ theme[themeTypeIndex] }}</view>
						</picker>
					</view>
				</view>
			</view>
			<view class="line_theme"></view>
			<!-- <view class="uni-list-cell">
				<view class="uni-list-cell-navigate uni-navigate-right uni-media-list ">
					添加地点
					<view class="uni-list-cell-right" style="text-align: right;"><view class="uni-input">上海</view></view>
				</view>
			</view> -->
		</view>

		<view class="save" @click="SaveDate()">发布笔记</view>
		
			 
	</view>
</template>
<script>
var sourceType = [['camera'], ['album'], ['camera', 'album']];
var sizeType = [['compressed'], ['original'], ['compressed', 'original']];
import { mapState } from 'vuex';
export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
	data() {
		return {
			imgList: [],
			imageList: [],
			sourceTypeIndex: 2,
			sourceType: ['拍照', '相册', '拍照或相册'],
			sizeTypeIndex: 2,
			themeTypeIndex: 0,
			sizeType: ['压缩', '原图', '压缩或原图'],
			theme: ['Young', '享说', '好课', '心愿墙'],
			countIndex: 8,
			count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
			Title: '',
			Desc: '',
			OrderNo: '',
			Desctext:''
		};
	},
	onReady(option) {
		console.log('riji:' + JSON.stringify(option));		
		if (option != undefined) {
			this.OrderNo = option.OrderNo;
		}
	},
	onUnload() {
		   (this.imageList = []),
			(this.sourceTypeIndex = 2),
			(this.sourceType = ['拍照', '相册', '拍照或相册']),
			(this.sizeTypeIndex = 2),
			(this.sizeType = ['压缩', '原图', '压缩或原图']),
			(this.countIndex = 8);
		
	},
	methods: {
		sourceTypeChange: function(e) {
			this.sourceTypeIndex = e.target.value;
		},
		sizeTypeChange: function(e) {
			this.sizeTypeIndex = e.target.value;
		},
		themeTypeChange: function(e) {
			this.themeTypeIndex = e.target.value;
		},
		countChange: function(e) {
			this.countIndex = e.target.value;
		},
		chooseImage: async function() {
			if (this.imageList.length === 9) {
				let isContinue = await this.isFullImg();
				console.log('是否继续?', isContinue);
				if (!isContinue) {
					return;
				}
			}			
			uni.chooseImage({
				sourceType: sourceType[this.sourceTypeIndex],
				sizeType: sizeType[this.sizeTypeIndex],
				count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
				success: res => {					
					this.imageList = this.imageList.concat(res.tempFilePaths);
					const tempFilePaths = res.tempFilePaths;
					for (var i = 0; i < tempFilePaths.length; i++) {
						var imguel = tempFilePaths[i];
						uni.uploadFile({
							url: 'https://www.chinaaos.com/Handler/APPHandler.ashx?req=Imgsss', //仅为示例，非真实的接口地址
							filePath: imguel,
							name: 'file',
							formData: {
								user: 'test'
							},
							success: uploadFileRes => {
								var imginfo = JSON.parse(uploadFileRes.data);
								console.log(imginfo['src']);
								this.imgList = this.imgList.concat(imginfo['src']);
							}
						});
					}
				}
			});
		},
		isFullImg: function() {
			return new Promise(res => {
				uni.showModal({
					content: '已经有9张图片了,是否清空现有图片？',
					success: e => {
						if (e.confirm) {
							this.imageList = [];
							res(true);
						} else {
							res(false);
						}
					},
					fail: () => {
						res(false);
					}
				});
			});
		},
		previewImage: function(e) {
			var current = e.target.dataset.src;
			uni.previewImage({
				current: current,
				urls: this.imageList
			});
		},
		bindinputTitle(event) {
			this.Title = event.target.value;
		},
		bindinputDesc(event) {
			this.Desc = event.target.value;
		},
		SaveDate() {
			if(this.imgList.length==0){
				uni.showToast({
					icon: 'none',
					title: '请上传图片'
				});
				return;				
			}
			
			let desc = this.Desc;
			let arr = [];
			 this.Desc.split('\n').forEach(item=>arr.push(`<p>${item.trim()}</p>`));
			 this.Desctext =arr.join('<p></p>');   
			let themes = this.themeTypeIndex;
			if (desc == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入正文'
				});
				return;
			}
			uni.request({
				url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
				data: {
					req: 'AddDiary',
					Account: this.Account,
					Title: this.Title,
					Desc: this.Desctext,
					theme: themes,
					Imglist: this.imgList,
					Address: '上海市',
					OrderNo: this.OrderNo
				},
				success: res => {
					if (res.data.ResultType == true) {
						uni.navigateBack();
					} else {
						wx.showToast({
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
		}
	}
};
</script>

<style>
.cell-pd {
	padding: 22upx 30upx;
}

.list-pd {
	margin-top: 50upx;
}

.uni-textarea {
	border-top: 1px solid #e6e6e6;
	border-bottom: 1px solid #e6e6e6;
	margin: 0 3%;
	width: 94%;
}
.uni-textarea textarea{
	height:160px;
	padding: 9px 0;
}
.uni-textarea uni-textarea {
	width: auto;
	padding: 9px 0;
	line-height: 1.6;
	font-size: 15px;
	height: 82px;
	border-top: 1px solid #e6e6e6;
	border-bottom: 1px solid #e6e6e6;
}

.uni-list-cell::after {
	height: 0px;
}
.uni-list:after {
	height: 1px;
	left: 3%;
	right: 3%;
	background-color: #e6e6e6;
}
.line_theme {
	margin-left: 3%;
	margin-right: 3%;
	border-bottom: 1px solid #e6e6e6;
}

.uni-form-item {
	padding: 0;
}

.uni-uploader__input-box {
	border-radius: 10px;
}

.uni-uploader__img {
	border-radius: 10px;
}
.save {
	width: 80%;
	color: #fff;
	background-color: red;
	height: 45px;
	line-height: 45px;
	text-align: center;
	font-size: 16px;
	border-radius: 20px;
	position: fixed;
	bottom: 20px;
	right: 10%;
}
</style>
