<template>
	<view class="con">
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">
					平台分类
					<text style="color: red;">*</text>
				</view>
				<view class="uni-input" @click="showMulLinkageThreePicker">{{ pickerText }}</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">
					商品名称
					<text style="color: red;">*</text>
				</view>
				<input class="uni-input" maxlength="60" @input="bindinputProductName" placeholder="请输入..." />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">广告词</view>
				<view class="uni-textarea"><textarea placeholder="请输入..." @input="bindinputShortDescription" /></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">
					结算价
					<text style="color: red;">*</text>
				</view>
				<input class="uni-input" maxlength="10" type="number" placeholder="请输入..." @input="bindinputSettlementPrice" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">
					商城价
					<text style="color: red;">*</text>
				</view>
				<input class="uni-input" maxlength="10" type="number" placeholder="请输入..." @input="bindinputMinSalePrice" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">
					市场价
					<text style="color: red;">*</text>
				</view>
				<input class="uni-input" maxlength="10" type="number" placeholder="请输入..." @input="bindinputMarketPrice" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">
					库存
					<text style="color: red;">*</text>
				</view>
				<input class="uni-input" maxlength="10" type="number" placeholder="请输入..." @input="bindinputtxtStock" />
			</view>

			<view class="uni-form-item uni-column">
				<view class="title">包装清单</view>
				<view class="uni-textarea"><textarea placeholder="请输入..." @input="bindinputPackaging" /></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">单日最多发货量</view>
				<input class="uni-input" maxlength="10" type="number" placeholder="请输入..." @input="bindinputDeliveringNum" />
			</view>

			<view class="uni-form-item uni-column">
				<view class="title">
					售后服务
					<text style="color: red;">*</text>
					<text>(注：至少选择2项)</text>
				</view>
				<checkbox-group @change="checkboxChange" class="title">
					<label>
						<checkbox value="1" color="#FFCC33" style="transform:scale(0.7)" />
						极速退款
					</label>
					<label>
						<checkbox value="2" color="#FFCC33" style="transform:scale(0.7)" />
						全场包邮
					</label>
					<label>
						<checkbox value="3" color="#FFCC33" style="transform:scale(0.7)" />
						7天退换
					</label>
					<label>
						<checkbox value="4" color="#FFCC33" style="transform:scale(0.7)" />
						48小时发货
					</label>
					<label>
						<checkbox value="5" color="#FFCC33" style="transform:scale(0.7)" />
						假一赔四
					</label>
				</checkbox-group>
				<view class="uni-textarea"><textarea placeholder-style="color:#F76260" placeholder="其他售后描述" @input="bindinputAfterSalesDes" /></view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">
					主图
					<text style="color: red;">*</text>
				</view>
				<view class="uni-uploader-body title" style="background-color: #fff;">
					<view class="uni-uploader__files">
						<block v-for="(image, index) in imageList" :key="index">
							<view class="uni-uploader__file"><image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image></view>
						</block>
						<view class="uni-uploader__input-box"><view class="uni-uploader__input" @tap="chooseImage"></view></view>
					</view>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">
					商品描述图
					<text style="color: red;">*</text>
				</view>
				<view class="uni-uploader-body title" style="background-color: #fff;">
					<view class="uni-uploader__files">
						<block v-for="(image, index) in imagedescList" :key="index">
							<view class="uni-uploader__file"><image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image></view>
						</block>
						<view class="uni-uploader__input-box"><view class="uni-uploader__input" @tap="DescChooseImage"></view></view>
					</view>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title" style="color:red;">
					注：多规格属性请到电脑端操作。
				</view>
			</view>
			
		</view>
      <view class="save" @click="SaveDate()">发布商品</view>


		<mpvue-picker
			:themeColor="themeColor"
			ref="mpvuePicker"
			:mode="mode"
			:deepLength="deepLength"
			:pickerValueDefault="pickerValueDefault"
			@onConfirm="onConfirm"
			@onCancel="onCancel"
			:pickerValueArray="pickerValueArray"
		></mpvue-picker>
	</view>
</template>

<script>
import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
import cityData from '@/common/city.data.js';
var sourceType = [['camera'], ['album'], ['camera', 'album']];
var sizeType = [['compressed'], ['original'], ['compressed', 'original']];
import { mapState } from 'vuex';
export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
	components: {
		mpvuePicker
	},
	data() {
		return {
			imgList: '',
			imageList: [],
			imgdescList: '',
			imagedescList: [],
			sourceTypeIndex: 2,
			sourceType: ['拍照', '相册', '拍照或相册'],
			sizeTypeIndex: 2,
			sizeType: ['压缩', '原图', '压缩或原图'],
			countIndex: 8,
			count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
			mulLinkageTwoPicker: [],
			themeColor: '#007AFF',
			pickerText: '请选择', //平台分类
			CategoryGuid: '',
			deepLength: 1,
			mode: '',
			pickerValueDefault: [0],
			pickerValueArray: [],
			ProductName: '', //产品名称
			ShortDescription: '', //广告
			SettlementPrice: '', //结算价
			MinSalePrice: '', //商城价
			MarketPrice: '', //市场价
			txtStock: '', //库存
			Packaging: '',
			DeliveringNum: '',
			IsQuickRefund: '0',
			IsFreeShipping: '0',
			IsRefund: '0',
			IsDelivery: '0',
			IsCompensate: '0',
			AfterSalesDes: '',
			CheckboxLength: 0
		};
	},
	mounted() {
		uni.request({
			url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
			data: {
				req: 'QueryCategory'
			},
			success: res => {
				this.mulLinkageTwoPicker = res.data;
			},
			fail: e => {
				uni.showToast({
					icon: 'none',
					title: '网络异常,请稍后重试'
				});
			}
		});
	},
	methods: {
		onCancel(e) {
			console.log(e);
		},
		// 三级联动选择
		showMulLinkageThreePicker() {
			this.pickerValueArray = this.mulLinkageTwoPicker;
			this.mode = 'multiLinkageSelector';
			this.deepLength = 3;
			this.pickerValueDefault = [0, 0, 1];
			this.$refs.mpvuePicker.show();
		},
		onConfirm(e) {
			debugger;
			this.pickerText = e.label;
			var mm = '';
			for (var i = 0; i < e.value.length; i++) {
				mm += e.value[i] + ',';
			}
			this.CategoryGuid = mm;
			console.log(this.pickerText + ':' + this.CategoryGuid);
		},
		bindinputProductName(e) {
			this.ProductName = e.target.value;
			console.log('ProductName:' + this.ProductName);
		},
		bindinputShortDescription(e) {
			this.ShortDescription = e.target.value;
		},
		bindinputSettlementPrice(e) {
			this.SettlementPrice = e.target.value;
		},
		bindinputMinSalePrice(e) {
			this.MinSalePrice = e.target.value;
		},
		bindinputMarketPrice(e) {
			this.MarketPrice = e.target.value;
		},
		bindinputtxtStock(e) {
			this.txtStock = e.target.value;
		},
		bindinputPackaging(e) {
			this.Packaging = e.target.value;
		},
		bindinputDeliveringNum(e) {
			this.DeliveringNum = e.target.value;
		},
		bindinputAfterSalesDes(e) {
			this.AfterSalesDes = e.target.value;
		},
		checkboxChange: function(e) {
			var values = e.detail.value;
			this.CheckboxLength = values.length;
			console.log(values.length);
			if (values.includes('1')) {
				this.IsQuickRefund = 1;
			}
			if (values.includes('2')) {
				this.IsFreeShipping = 1;
			}
			if (values.includes('3')) {
				this.IsRefund = 1;
			}
			if (values.includes('4')) {
				this.IsDelivery = 1;
			}
			if (values.includes('5')) {
				this.IsCompensate = 1;
			}
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
					console.log(JSON.stringify(res.tempFilePaths));
					this.imageList = this.imageList.concat(res.tempFilePaths);
					const tempFilePaths = res.tempFilePaths;
					for (var i = 0; i < tempFilePaths.length; i++) {
						var imguel = tempFilePaths[i];
						uni.uploadFile({
							url: 'https://www.chinaaos.com/Handler/UploadHandler.ashx?types=goods',
							filePath: imguel,
							name: 'file',
							formData: {
								user: 'test'
							},
							success: uploadFileRes => {
								var imginfo = JSON.parse(uploadFileRes.data);
								var mm = imginfo.data['src'] + ',';
								console.log('主图88：' + mm);
								this.imgList = this.imgList + mm;
								console.log('主图66：' + this.imgList);
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
		DescChooseImage: async function() {
			if (this.imagedescList.length === 9) {
				let isContinue = await this.isFullImg();
				console.log('是否继续?', isContinue);
				if (!isContinue) {
					return;
				}
			}
			uni.chooseImage({
				sourceType: sourceType[this.sourceTypeIndex],
				sizeType: sizeType[this.sizeTypeIndex],
				count: this.imagedescList.length + this.count[this.countIndex] > 9 ? 9 - this.imagedescList.length : this.count[this.countIndex],
				success: res => {
					console.log(JSON.stringify(res.tempFilePaths));
					this.imagedescList = this.imagedescList.concat(res.tempFilePaths);
					const tempFilePaths = res.tempFilePaths;
					for (var i = 0; i < tempFilePaths.length; i++) {
						var imguel = tempFilePaths[i];
						uni.uploadFile({
							url: 'https://www.chinaaos.com/Handler/UploadHandler.ashx?types=wxgoodsdesc',
							filePath: imguel,
							name: 'file',
							formData: {
								user: 'test'
							},
							success: uploadFileRes => {
								var imginfo = JSON.parse(uploadFileRes.data);
								var mm = '<p><img src="' + imginfo.data['src'] + '" _src="' + imginfo.data['src'] + '" style="" "/></p>';
								this.imgdescList = this.imgdescList + mm;
							}
						});
					}
				}
			});
		},
		SaveDate() {
			let pText = this.pickerText;
			let pname = this.ProductName;
			let SPrice = this.SettlementPrice;
			let MSPrice = this.MinSalePrice;
			let MPrice = this.MarketPrice;
			let Stock = this.txtStock;
			let IPath = this.imgList;
			let Contents = this.imgdescList;

			if (pText == '' || pname == '' || SPrice == '' || MSPrice == '' || MPrice == '' || Stock == '' || IPath == '' || Contents == '') {
				wx.showToast({
					icon: 'none',
					title: '*为必填项,请填写'
				});
				return;
			}
			if (this.CheckboxLength < 2) {
				wx.showToast({
					icon: 'none',
					title: '售后服务必须选择2项!'
				});
				return;
			}

			uni.request({
				url: 'https://www.chinaaos.com/Handler/WebHandler.ashx',
				data: {
					req: 'Wx_Addsjproduct',
					Account: this.Account,
					CategoryGuid: this.CategoryGuid,
					pickerText: pText,
					ProductName: pname,
					ShortDescription: this.ShortDescription,
					SettlementPrice: SPrice,
					MinSalePrice: MSPrice,
					MarketPrice: MPrice,
					txtStock: Stock,
					Packaging: this.Packaging,
					DeliveringNum: this.DeliveringNum,
					IsQuickRefund: this.IsQuickRefund,
					IsFreeShipping: this.IsFreeShipping,
					IsRefund: this.IsRefund,
					IsDelivery: this.IsDelivery,
					IsCompensate: this.IsCompensate,
					AfterSalesDes: this.AfterSalesDes,
					ImagePath: IPath,
					desContents: Contents,
					FreightTemplateId: '0' //运费模板
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
	},
	onBackPress() {
		if (this.$refs.mpvuePicker.showPicker) {
			this.$refs.mpvuePicker.pickerCancel();
			return true;
		}
	},
	onUnload() {
		if (this.$refs.mpvuePicker.showPicker) {
			this.$refs.mpvuePicker.pickerCancel();
		}
		(this.imageList = []),
			(this.sourceTypeIndex = 2),
			(this.sourceType = ['拍照', '相册', '拍照或相册']),
			(this.sizeTypeIndex = 2),
			(this.sizeType = ['压缩', '原图', '压缩或原图']),
			(this.countIndex = 8);
	}
};
</script>

<style  lang="scss">
	.con{
		background-color: #f6f7fb;
		padding-bottom:10%;
	}
page {
	background-color: #f6f7fb;
}

.uni-common-mt {
margin-top: 0rpx;

}

.uni-textarea uni-textarea {
	padding: 7px 12px;
	width: initial;
}
uni-radio-group,
uni-checkbox-group {
	width: initial;
	padding: 3px 10px;
}
uni-radio-group uni-label,
uni-checkbox-group uni-label {
	padding-right: 30px;
}
radio-group, checkbox-group {
width: initial;
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
