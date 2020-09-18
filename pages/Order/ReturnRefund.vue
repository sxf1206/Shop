<template>
	<view>
		<view>
			<!-- 商品信息 -->
			<view class="g-item">
				<image :src="ThumbnailsUrl"></image>
				<view class="right">
					<view style="display: -webkit-box;overflow:hidden;text-overflow: elipsis;word-break: break-all;-webkit-box-orient:vertical;-webkit-line-clamp: 2">
						<text class="title clamp">{{ProductName}}</text>
					</view>
					<view>
						<text class="spec">{{ Para0 }}{{ Color }}{{Para1}}{{Size}}</text>
					</view>
					<view class="price-box">
						<text class="price">￥{{SalePrice}}</text>
						<text class="price" style="color: red;padding-left:12px" v-if="VIPType!=0">省/赚￥{{((SalePrice-CostPrice)*0.4).toFixed(2)}}</text>
						<text class="number">x {{Quantity}}</text>
					</view>
				</view>
			</view>

			<!-- 退货原因-->
			<view class="ordersture">
				<view class="boxtwo">
					<view class="contentInfo">

						<view class="yt-list">
							<view class="yt-list-cell b-b" @tap="chooseMsg">
								<view class="cell-tit clamp">
									<view style="color: #333333;font-size: 14px;">退款原因 <text style="font-size: 12px;padding-left:10px;color: #747474;">{{BackReason}}</text></view>
								</view>
								<text class="cell-tip active">></text>
							</view>
							<view class="yt-list-cell b-b">
								<view class="cell-tit clamp">
									<view style="color: #333333;font-size: 14px;">退款金额</view>
								</view>
								<text class="cell-tip active" style="color: red;font-size: 16px;" v-if="VIPType==0">￥{{SalePrice}}</text>
								<text class="cell-tip active" style="color: red;font-size: 16px;" v-if="VIPType!=0">￥{{BackMoney}}</text>
							</view>
						</view>

					</view>
				</view>
			</view>

			<!-- 问题描述 -->
			<view class="ordersture" style="margin-top: 16px;">
				<view class="boxone">
					<view class="contentInfo">

						<view class="yt-list">
							<view class="yt-list-cell b-b" @click="ChangeInfo()">
								<view class="cell-tit clamp">
									<view style="color: #333333;">问题描述</view>
									<view style="width: 100%;margin-top: 10px;">
										<textarea style="width: 93%;height: 44px;padding: 12px;background-color: #DDDDDD;border-radius:8px ;"
										 placeholder="必填" maxlength="500" @blur="blur" value=""></textarea>
									</view>
								</view>
							</view>
							<view class="yt-list-cell b-b">
								<view class="cell-tit clamp">
									<view style="color: #333333;">上传凭证</view>
									<view class="uni-uploader__files">
										<block v-for="(image,index) in imageList" :key="index">
											<view class="uni-uploader__file">
												<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
											</view>
										</block>
										<view class="uni-uploader__input-box">
											<view class="uni-uploader__input" @tap="chooseImage"></view>
										</view>
									</view>
								</view>
							</view>
						</view>

					</view>
				</view>
			</view>

			<!-- 提交按钮 -->
			<view class="issue-btn-box" style="margin-top: 32px;">
				<view class="save" @click="AddReturnres">提交</view>
			</view>
		</view>
	</view>
</template>

<script>
	var Account;
	var Uguid;
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {
		mapState
	} from 'vuex'

	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType']),
		components: {
			uniPopup
		},
		data() {
			return {
				msgContents: ["不喜欢/不合适", "质量问题", "卖家发错货"],
				GoodsList: [],
				OrderNo: "",
				GoodsNo: "",
				OrderGuid: "",
				ThumbnailsUrl: "",
				ProductName: "",
				Para0: "",
				Color: "",
				Para1: "",
				Size: "",
				SalePrice: 0,
				CostPrice: 0,
				Quantity: 0,
				remarkinfo: "",
				EorrorPic: "",
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 0,
				ReturnType: 0,
				BackReason: "",
				BackMoney: 0
			}
		},
		onLoad(options) {
			this.OrderNo = options.OrderNo;
			this.OrderGuid = options.OrderGuid;
			this.ReturnType = options.types;
			console.log(this.OrderNo + "______" + this.OrderGuid);

			this.imageList = [],
				this.sourceTypeIndex = 2,
				this.sourceType = ['拍照', '相册', '拍照或相册'],
				this.sizeTypeIndex = 2,
				this.sizeType = ['压缩', '原图', '压缩或原图'],
				this.countIndex = 0;
			this.init();
			this.chooseMsg();
		},
		methods: {
			init() {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QueryGoodsByOrderItem',
						OrderNo: this.OrderNo,
						OrderGuid: this.OrderGuid
					},
					success: result => {
						if (result.data.ResultType) {
							this.GoodsNo = result.data.GoodsList[0].ProductId;
							console.log(result.data.GoodsList[0].ProductId);
							this.OrderGuid = result.data.GoodsList[0].Guid;
							this.ProductName = result.data.GoodsList[0].ProductName;
							var mainsImg = result.data.GoodsList[0].ThumbnailsUrl.split(',')[0];
							this.ThumbnailsUrl = 'https://www.chinaaos.com' + mainsImg;
							var Guige = result.data.GoodsList[0].SKU.split(';');
							if (Guige.length > 2 && result.data.GoodsList[0].Color != "" && result.data.GoodsList[0].Size != "") {
								this.Para0 = Guige[0] + ":";
								this.Color = result.data.GoodsList[0].Color + ";";
								this.Para1 = Guige[1] + ":";
								this.Size = result.data.GoodsList[0].Size + ";";
							} else if (Guige.length == 2 && result.data.GoodsList[0].Color != "") {
								this.Para0 = Guige[0] + ":";
								this.Color = result.data.GoodsList[0].Color + ";";
								this.Para1 = "";
								this.Size = "";
							} else {
								this.Para0 = "";
								this.Color = "";
								this.Para1 = "";
								this.Size = "";
							}
							this.SalePrice = result.data.GoodsList[0].SalePrice;
							this.CostPrice = result.data.GoodsList[0].CostPrice;
							this.Quantity = result.data.GoodsList[0].Quantity;
							this.BackMoney = ((result.data.GoodsList[0].SalePrice - (result.data.GoodsList[0].SalePrice - result.data.GoodsList[
								0].CostPrice) * 0.4) * result.data.GoodsList[0].Quantity).toFixed(2);
						}
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			blur(e) {
				var id = e.target.id;
				this.remarkinfo = e.detail.value
			},
			chooseMsg() { //选择原因
			    uni.showActionSheet({
			        itemList: this.msgContents,
			        success: (res) => {
			            this.BackReason = this.msgContents[res.tapIndex];
			        }
			    })
			},
			AddReturnres() {
				if(this.remarkinfo==""){
					uni.showToast({
						icon: 'none',
						title: "请填写问题描述"
					});
					return
				}
				var back_money=this.SalePrice;
				if(this.VIPType=="1" ||  this.VIPType=="2"){
					back_money=this.BackMoney;					
				}	
				
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'ReturnGoods',
						Orderno: this.OrderNo,
						OrderItemGuid: this.OrderGuid,
						GoodsGuid:this.GoodsNo,
						account: this.Account,
						BackMoney: back_money,
						BackReason: this.BackReason,
						QuestionRemark: this.remarkinfo,
						Imgpath: this.EorrorPic.substring(0, this.EorrorPic.length - 1),
						ReturnType: this.ReturnType
					},
					success: result => {
						uni.showToast({
							icon: 'none',
							title: "您已提交申请"
						});
						setTimeout(function() {
							uni.navigateTo({
								url: '/pages/Order/AfterSale?OrderNo=' + this.OrderNo  + '&refundby='
							});
						}, 2000);
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			isFullImg: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经上传过图片了，是否替换图片",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			chooseImage: async function() {
				if (this.imageList.length === 10) {
					let isContinue = await this.isFullImg();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					success: (chooseImageRes) => {
						this.imageList = this.imageList.concat(chooseImageRes.tempFilePaths);
						const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log("imageList：" + this.imageList);
						var imginfo = "";
						tempFilePaths.forEach(item => {
							uni.uploadFile({
								url: 'https://www.chinaaos.com/Handler/APPHandler.ashx?req=Imgsss', //仅为示例，非真实的接口地址
								filePath: item,
								name: 'file',
								formData: {
									'user': 'test'
								},
								success: (uploadFileRes) => {
									imginfo = JSON.parse(uploadFileRes.data);
									this.EorrorPic = this.EorrorPic.concat(imginfo["src"] + ",");
									console.log("EorrorPic：" + this.EorrorPic);
								}
							});
						});
					}
				});
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			}
		}
	}
</script>

<style lang="scss">
	.g-item {
		display: flex;
		margin: 20upx 30upx;
		padding-bottom: 10px;

		image {
			flex-shrink: 0;
			display: block;
			width: 100px;
			height: 100px;
			border-radius: 6px;
		}

		.right {
			flex: 1;
			padding-left: 24upx;
			overflow: hidden;
		}

		.title {
			font-size: 30upx;
			color: #333333;
		}

		.spec {
			font-size: 26upx;
			color: #747474;
			background-color: #ddd;
			opacity: 0.5;
			border-radius: 2px;
		}

		.price-box {
			display: flex;
			align-items: center;
			font-size: 32upx;
			color: #333333;
			padding-top: 10upx;

			.price {
				margin-bottom: 4upx;
			}

			.number {
				font-size: 26upx;
				color: #747474;
				margin-left: 20upx;
			}
		}

		.step-box {
			position: relative;
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
		margin-bottom: 50px;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 10upx 10upx 10upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: red;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: #747474;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: black;

			&.disabled {
				color: #747474;
			}

			&.active {
				color: #747474;
			}

			&.red {
				color: red;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: 14PX;
			color: #747474;
		}
	}


	.ordersture {
		border: 0px;
		padding: 0 20upx;
		margin: auto;

		.boxtwo {
			width: 98%;
			padding: 0 1%;
			height: 24vw;
			background-color: white;
			border-radius: 24upx;
			box-shadow: 0 0 20upx rgba(0, 0, 0, 0.15);
			align-items: center;
			justify-content: center;

			.contentInfo {
				width: 94%;
				margin: auto;
			}
		}
	}

	.ordersture {
		border: 0px;
		padding: 0 20upx;
		margin: auto;

		.boxone {
			width: 98%;
			padding: 0 1%;
			// height: 66vw;
			background-color: white;
			border-radius: 24upx;
			box-shadow: 0 0 20upx rgba(0, 0, 0, 0.15);
			align-items: center;
			justify-content: center;

			.contentInfo {
				width: 98%;
				margin: auto;
			}
		}
	}

	.uni-uploader__input-box {
		margin: 10rpx;
		width: 168rpx;
		height: 168rpx;
		border: 2rpx solid #D9D9D9;

	}

	.uni-uploader__file {
		width: 168rpx;
		height: 168rpx;

	}

	.uni-uploader__img {
		width: 168rpx;
		height: 168rpx;

	}

	.uni-popup-bottom {
		bottom: 0;
		width: 100%;
		min-height: 550rpx !important;
		line-height: 100rpx;
		text-align: center;
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;

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
		margin: 10% 10% 0;
	}
</style>
