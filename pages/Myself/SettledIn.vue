<template>
	<view style="width: 100%;">
		<view class="content">
			<view style="margin-bottom: 20upx;height: 80px;width: 100%;">
				<image src="https://www.chinaaos.com/static/zsznimg.jpg" style="height: 100%;width: 100%;" @click="readsome"></image>
			</view>

			<view class="title">
				<view>1.请选择所属城市 <text class="xing">*</text></view>
				<textarea class="uni-input" maxlength="50" placeholder="请选择" :value="pickerText" @click="showMulLinkageTwoPicker"
				 disabled></textarea>
				<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
				 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
			</view>

			<view class="title">
				<view>2.请选择店铺类型 <text class="xing">*</text></view>
				<radio-group @change="radioChange">
					<view class="uni-padding-wrap">
						<label class="radio" v-for="(item, index) in items" :key="item.value" style="margin-right: 50upx;">
							<radio :value="item.value" :checked="index === current" />{{item.name}}
						</label>
					</view>
				</radio-group>
			</view>

			<view class="title">
				<view>3.商家头像(店铺) <text class="xing">*</text></view>
				<view class="uni-uploader__files">
					<block v-for="(image,index) in imageList4" :key="index">
						<view class="uni-uploader__file">
							<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage4"></image>
						</view>
					</block>
					<view class="uni-uploader__input-box">
						<view class="uni-uploader__input" @tap="chooseImage4"></view>
					</view>
				</view>
			</view>

			<view class="title">
				<view>4.请输入店铺全称 <text class="xing">*</text></view>
				<input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeyDianpuNameInput" />
			</view>

			<view class="Typecontent" :style="{ display: onedisplay }">
				<view class="title">
					<view>5.营业执照统一社会信用代码 <text class="xing">*</text></view>
					<!-- <image src="../../static/bdsc.png" style="width: 100px;height: 100px;margin-top: 14px;border-radius: 15px;"></image> -->
					<view class="uni-uploader__files">
						<block v-for="(image,index) in imageList" :key="index">
							<view class="uni-uploader__file">
								<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage4"></image>
							</view>
						</block>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage"></view>
						</view>
					</view>
				</view>

				<view class="title">
					<view>6.申请人身份证 <text class="xing">*</text></view>
					<!-- <image src="../../static/bdsc.png" style="width: 100px;height: 100px;margin-top: 14px;border-radius: 15px;"></image> -->
					<view class="uni-uploader__files">
						<block v-for="(image,index) in imageList2" :key="index">
							<view class="uni-uploader__file">
								<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage2"></image>
							</view>
						</block>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage2"></view>
						</view>
					</view>
				</view>

				<view class="title">
					<view>7.授权经销证明 <text class="xing">(代理商必填)</text></view>
					<!-- <image src="../../static/bdsc.png" style="width: 100px;height: 100px;margin-top: 14px;border-radius: 15px;"></image> -->
					<view class="uni-uploader__files">
						<block v-for="(image,index) in imageList3" :key="index">
							<view class="uni-uploader__file">
								<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage3"></image>
							</view>
						</block>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage3"></view>
						</view>
					</view>
				</view>

				<view class="title">
					<view>8.商家图片(店铺)</view>
					<!-- <image src="../../static/bdsc.png" style="width: 100px;height: 100px;margin-top: 14px;border-radius: 15px;"></image> -->
					<view class="uni-uploader__files">
						<block v-for="(image,index) in imageList5" :key="index">
							<view class="uni-uploader__file">
								<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage5"></image>
							</view>
						</block>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage5"></view>
						</view>
					</view>
				</view>
				<view class="title">
					<view>9.商家描述(店铺) <text class="xing">*</text></view>
					<!-- <input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeyShopmarkInput" /> -->
					<textarea class="uni-textarea" placeholder="请输入" @input="onKeyShopmarkInput"></textarea>
				</view>

				<view class="title">
					<view>10.请输入商家详细地址 <text class="xing">*</text></view>
					<input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeySjdzInput" />
				</view>

				<view class="title">
					<view>11.请输入联系人姓名 <text class="xing">*</text></view>
					<input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeyLxrxmInput" />
				</view>

				<view class="title">
					<view>12.请输入联系人电话 <text class="xing">*</text></view>
					<input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeyLxrdhInput" />
				</view>

				<view class="title">
					<view>13.请输入联系人邮箱 <text class="xing">*</text></view>
					<input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeyLxryxInput" />
				</view>
			</view>

			<view class="Typecontent" :style="{ display: twodisplay }">
				<view class="title">
					<view>5.申请人身份证 <text class="xing">*</text></view>
					<!-- <image src="../../static/bdsc.png" style="width: 100px;height: 100px;margin-top: 14px;border-radius: 15px;"></image> -->
					<view class="uni-uploader__files">
						<block v-for="(image,index) in imageList2" :key="index">
							<view class="uni-uploader__file">
								<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage2"></image>
							</view>
						</block>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage2"></view>
						</view>
					</view>
				</view>

				<view class="title">
					<view>6.教师资格证 <text class="xing"></text></view>
					<!-- <image src="../../static/bdsc.png" style="width: 100px;height: 100px;margin-top: 14px;border-radius: 15px;"></image> -->
					<view class="uni-uploader__files">
						<block v-for="(image,index) in imageList3" :key="index">
							<view class="uni-uploader__file">
								<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage3"></image>
							</view>
						</block>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage3"></view>
						</view>
					</view>
				</view>

				<view class="title">
					<view>7.商家图片(店铺)</view>
					<!-- <image src="../../static/bdsc.png" style="width: 100px;height: 100px;margin-top: 14px;border-radius: 15px;"></image> -->
					<view class="uni-uploader__files">
						<block v-for="(image,index) in imageList5" :key="index">
							<view class="uni-uploader__file">
								<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage5"></image>
							</view>
						</block>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage5"></view>
						</view>
					</view>
				</view>
				<view class="title">
					<view>8.商家描述(店铺) <text class="xing">*</text></view>
					<!-- <input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeyShopmarkInput" /> -->
					<textarea class="uni-textarea" placeholder="请输入" @input="onKeyShopmarkInput"></textarea>
				</view>

				<view class="title">
					<view>9.请输入商家详细地址 <text class="xing">*</text></view>
					<input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeySjdzInput" />
				</view>

				<view class="title">
					<view>10.请输入联系人姓名 <text class="xing">*</text></view>
					<input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeyLxrxmInput" />
				</view>

				<view class="title">
					<view>11.请输入联系人电话 <text class="xing">*</text></view>
					<input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeyLxrdhInput" />
				</view>
			</view>

			<view class="Typecontent" :style="{ display: threedisplay }">
				<view class="title">
					<view>5.申请人身份证 <text class="xing">*</text></view>
					<!-- <image src="../../static/bdsc.png" style="width: 100px;height: 100px;margin-top: 14px;border-radius: 15px;"></image> -->
					<view class="uni-uploader__files">
						<block v-for="(image,index) in imageList2" :key="index">
							<view class="uni-uploader__file">
								<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage2"></image>
							</view>
						</block>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage2"></view>
						</view>
					</view>
				</view>

				<view class="title">
					<view>6.营业执照统一社会信用代码 <text class="xing"></text></view>
					<!-- <image src="../../static/bdsc.png" style="width: 100px;height: 100px;margin-top: 14px;border-radius: 15px;"></image> -->
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

				<view class="title">
					<view>7.商家图片(店铺)</view>
					<!-- <image src="../../static/bdsc.png" style="width: 100px;height: 100px;margin-top: 14px;border-radius: 15px;"></image> -->
					<view class="uni-uploader__files">
						<block v-for="(image,index) in imageList5" :key="index">
							<view class="uni-uploader__file">
								<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage5"></image>
							</view>
						</block>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage5"></view>
						</view>
					</view>
				</view>
				<view class="title">
					<view>8.商家描述(店铺) <text class="xing">*</text></view>
					<!-- <input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeyShopmarkInput" /> -->
					<textarea class="uni-textarea" placeholder="请输入" @input="onKeyShopmarkInput"></textarea>
				</view>

				<view class="title">
					<view>9.请输入商家详细地址 <text class="xing">*</text></view>
					<input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeySjdzInput" />
				</view>

				<view class="title">
					<view>10.请输入联系人姓名 <text class="xing">*</text></view>
					<input class="uni-input" maxlength="50" placeholder="请输入" @input="onKeyLxrxmInput" />
				</view>

				<view class="title">
					<view>11.请输入联系人电话 <text class="xing">*</text></view>
					<input class="uni-input"  type="number"  maxlength="50" placeholder="请输入" @input="onKeyLxrdhInput" />
				</view>
			</view>

			<view style="font-size: 24upx;text-align: center;">提交入驻信息后，平台将于3-5个工作日联系您，请保持电话畅通！</view>
			<view>
				<checkbox-group style="text-align: center;">
					<label>
						<checkbox value="cb" color="#ff6600" style="transform:scale(0.7)" :checked="ruzhucheck" @click="ruzhucheck88(this)" />
						我已同意并阅读<text style="color: #ff6600;" @click="readXY">竞享商家入驻协议</text>
					</label>
				</checkbox-group>
			</view>
		</view>

		<view class="ruzhu" @click="baseSave()">申请入驻</view>

	</view>
</template>

<script>
	import mpvuePicker from '../../components/mpvue-picker/mpvuePicker.vue';
	import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'
	import cityData from '../../common/city.data.js';
	import {
		mapState
	} from 'vuex'
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]

	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
		components: {
			mpvuePicker,
			mpvueCityPicker
		},
		data() {
			return {
				items: [{
						value: '0',
						name: '商品'
					},
					{
						value: '1',
						name: '在线课',
						checked: 'true'
					},
					{
						value: '2',
						name: '本地生活',
						checked: 'true'
					}
				],
				current: 0,
				onedisplay: "block",
				twodisplay: "none",
				threedisplay: "none",
				mulLinkageTwoPicker: cityData,
				themeColor: '#007AFF',
				pickerText: '',
				DpqcInput: "",
				Shopmark: "",
				SjdzInput: "",
				LxrxmInput: "",
				LxrdhInput: "",
				LxryxInput: "",
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray: [],
				imageList: [],
				shophead: "",
				shopPic: "",
				yinyezhizhao: "",
				shengfenzhen: "",
				jinyingzhengming: "",
				imageList2: [],
				imageList3: [],
				imageList4: [],
				imageList5: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 0,
				count: [1],
				ruzhucheck: false,
				ShopTypeId: ""
			};
		},
		computed: {},
		onLoad(option) {

		},
		onUnload() {
			this.imageList = [],
				this.imageList2 = [],
				this.imageList3 = [],
				this.imageList4 = [],
				this.imageList5 = [],
				this.sourceTypeIndex = 2,
				this.sourceType = ['拍照', '相册', '拍照或相册'],
				this.sizeTypeIndex = 2,
				this.sizeType = ['压缩', '原图', '压缩或原图'],
				this.countIndex = 0;
		},
		methods: {
			radioChange(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
				if (this.current == "1") {
					this.onedisplay = "none";
					this.twodisplay = "block";
					this.threedisplay = "none";
				} else if (this.current == "2") {
					this.onedisplay = "none";
					this.twodisplay = "none";
					this.threedisplay = "block";
				} else {
					this.onedisplay = "block";
					this.twodisplay = "none";
					this.threedisplay = "none";
				}
			},
			onKeyDianpuNameInput(event) {
				this.DpqcInput = event.target.value
			},
			onKeyShopmarkInput(event) {
				this.Shopmark = event.target.value
			},
			onKeySjdzInput(event) {
				this.SjdzInput = event.target.value
			},
			onKeyLxrxmInput(event) {
				this.LxrxmInput = event.target.value
			},
			onKeyLxrdhInput(event) {
				this.LxrdhInput = event.target.value
			},
			onKeyLxryxInput(event) {
				this.LxryxInput = event.target.value
			},
			// 二级联动选择
			showMulLinkageTwoPicker() {
				this.pickerValueArray = this.mulLinkageTwoPicker
				this.mode = 'multiLinkageSelector'
				this.deepLength = 2
				this.pickerValueDefault = [0, 0]
				this.$refs.mpvuePicker.show()
			},
			onConfirm(e) {
				this.pickerText = JSON.stringify(e.label).replace(/\"/g, " ")
			},
			onCancel(e) {
				console.log("8888" + e)
			},
			ruzhucheck88(e) {
				if (this.ruzhucheck == false) {
					this.ruzhucheck = true;
				} else {
					this.ruzhucheck = false;
				}

			},
			baseSave() {
				var Rzchecked = this.ruzhucheck; //是否同意协议
				var Dptype = this.current; //店铺类型
				if (this.pickerText == "" || this.pickerText == null) {
					uni.showToast({
						icon: 'none',
						title: "带*号的必填项不能为空"
					});
					return;
				}
				if (Dptype == "0") {
					this.ShopTypeId = "0";
					if (this.DpqcInput == "" || this.SjdzInput == "" || this.LxrxmInput == "" || this.LxrdhInput == "" || this.LxryxInput ==
						"" || this.imageList.length < 1 || this.imageList2.length < 1 || this.imageList4.length < 1 || this.Shopmark ==
						"") {
						uni.showToast({
							icon: 'none',
							title: "带*号的必填项不能为空"
						});
						return;
					}
				} else if (Dptype == "1") {
					this.ShopTypeId = "1";
					if (this.imageList2.length < 1 || this.imageList4.length < 1 || this.SjdzInput == "" || this.LxrxmInput == "" ||
						this.LxrdhInput == "" || this.Shopmark == "") {
						uni.showToast({
							icon: 'none',
							title: "带*号的必填项不能为空"
						});
						return;
					}

				} else if (Dptype == "2" || this.SjdzInput == "" || this.LxrxmInput == "" || this.LxrdhInput == "" || this.Shopmark ==
					"" || this.imageList4.length < 1) {
					this.ShopTypeId = "2";
					if (this.imageList2.length < 1) {
						uni.showToast({
							icon: 'none',
							title: "带*号的必填项不能为空"
						});
						return;
					}
				}

				if (Rzchecked != true) {
					uni.showToast({
						icon: 'none',
						title: "请阅读并同意入驻协议"
					});
					return;
				} else {

					uni.request({
						url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
						data: {
							req: 'BusinessmenStationed',
							SName: this.DpqcInput,
							CRegionId: this.pickerText,
							CAddress: this.SjdzInput,
							CName: this.LxrxmInput,
							CPhone: this.LxrdhInput,
							CEmail: this.LxryxInput,
							BNumPhoto: this.yinyezhizhao,
							IDCardUrl: this.shengfenzhen,
							OCodePhoto: this.jinyingzhengming,
							account: uni.getStorageSync('Account'),
							ShopTypeId: this.ShopTypeId,
							ShopPicture: this.shopPic.substring(0, this.shopPic.length - 1),
							Logo: this.shophead,
							ShopMarks: this.Shopmark
						},
						success: result => {
							uni.showToast({
								icon: 'none',
								title: result.data.Msg
							});
							setTimeout(function(){
								uni.navigateBack();
							}, 3000);
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
				if (this.imageList.length === 1) {
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
						var imguel = tempFilePaths[0];
						uni.uploadFile({
							url: 'https://www.chinaaos.com/Handler/APPHandler.ashx?req=Imgsss', //仅为示例，非真实的接口地址
							filePath: imguel,
							name: 'file',
							formData: {
								'user': 'test'
							},
							success: (uploadFileRes) => {
								var imginfo = JSON.parse(uploadFileRes.data);
								this.yinyezhizhao = imginfo["src"];
								console.log(this.yinyezhizhao);
							}
						});
					}
				});
			},
			readsome() {
				uni.navigateTo({
					url: './ZSZN',
				});
			},
			readXY() {
				uni.navigateTo({
					url: './GHXY',
				});
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			isFullImg2: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经上传过图片了，是否替换图片",
						success: (e) => {
							if (e.confirm) {
								this.imageList2 = [];
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
			chooseImage2: async function() {
				if (this.imageList2.length === 1) {
					let isContinue = await this.isFullImg2();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}

				uni.chooseImage({
					success: (chooseImageRes) => {
						this.imageList2 = this.imageList2.concat(chooseImageRes.tempFilePaths);
						const tempFilePaths = chooseImageRes.tempFilePaths;
						var imguel2 = tempFilePaths[0];
						uni.uploadFile({
							url: 'https://www.chinaaos.com/Handler/APPHandler.ashx?req=Imgsss', //仅为示例，非真实的接口地址
							filePath: imguel2,
							name: 'file',
							formData: {
								'user': 'test'
							},
							success: (uploadFileRes) => {
								var imginfo2 = JSON.parse(uploadFileRes.data);
								this.shengfenzhen = imginfo2["src"];
								console.log(this.shengfenzhen);
							}
						});
					}
				});
			},
			previewImage2: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList2
				})
			},
			isFullImg3: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经上传过图片了，是否替换图片",
						success: (e) => {
							if (e.confirm) {
								this.imageList3 = [];
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
			chooseImage3: async function() {
				if (this.imageList3.length === 1) {
					let isContinue = await this.isFullImg3();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					success: (chooseImageRes) => {
						this.imageList3 = this.imageList3.concat(chooseImageRes.tempFilePaths);
						const tempFilePaths = chooseImageRes.tempFilePaths;
						var imguel3 = tempFilePaths[0];
						uni.uploadFile({
							url: 'https://www.chinaaos.com/Handler/APPHandler.ashx?req=Imgsss', //仅为示例，非真实的接口地址
							filePath: imguel3,
							name: 'file',
							formData: {
								'user': 'test'
							},
							success: (uploadFileRes) => {
								var imginfo3 = JSON.parse(uploadFileRes.data);
								this.jinyingzhengming = imginfo3["src"];
								console.log(this.jinyingzhengming);
							}
						});
					}
				});
			},
			previewImage3: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList3
				})
			},
			isFullImg4: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经上传过图片了，是否替换图片",
						success: (e) => {
							if (e.confirm) {
								this.imageList4 = [];
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
			chooseImage4: async function() {
				if (this.imageList4.length === 1) {
					let isContinue = await this.isFullImg4();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					success: (chooseImageRes) => {
						this.imageList4 = this.imageList4.concat(chooseImageRes.tempFilePaths);
						const tempFilePaths = chooseImageRes.tempFilePaths;
						var imguel4 = tempFilePaths[0];
						uni.uploadFile({
							url: 'https://www.chinaaos.com/Handler/APPHandler.ashx?req=Imgsss', //仅为示例，非真实的接口地址
							filePath: imguel4,
							name: 'file',
							formData: {
								'user': 'test'
							},
							success: (uploadFileRes) => {
								var imginfo4 = JSON.parse(uploadFileRes.data);
								this.shophead = imginfo4["src"];
								console.log("imageList4：" + this.shophead);
							}
						});
					}
				});
			},
			previewImage4: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList4
				})
			},
			isFullImg5: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经上传过图片了，是否替换图片",
						success: (e) => {
							if (e.confirm) {
								this.imageList5 = [];
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
			chooseImage5: async function() {
				if (this.imageList5.length === 10) {
					let isContinue = await this.isFullImg5();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					success: (chooseImageRes) => {
						this.imageList5 = this.imageList5.concat(chooseImageRes.tempFilePaths);
						const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log("imageList5：" + this.imageList5);
						var imginfo5 = "";
						tempFilePaths.forEach(item => {
							uni.uploadFile({
								url: 'https://www.chinaaos.com/Handler/APPHandler.ashx?req=Imgsss', //仅为示例，非真实的接口地址
								filePath: item,
								name: 'file',
								formData: {
									'user': 'test'
								},
								success: (uploadFileRes) => {
									imginfo5 = JSON.parse(uploadFileRes.data);
									this.shopPic = this.shopPic.concat(imginfo5["src"] + ",");
									console.log("shopPic：" + this.shopPic);
								}
							});
						});
					}
				});
			},
			previewImage5: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList5
				})
			}
		}
	};
</script>

<style>
	.uni-list-cell {
		justify-content: flex-start
	}

	page {
		background-color: #f3f7f7;
	}

	.content {
		/* padding: 20upx; */
	}

	.Goodscontent {
		padding: 0upx;
	}

	.title {
		background-color: #fff;
		padding: 20upx;
		font-size: 36upx;
		font-weight: 600;
		margin-bottom: 20upx;
		border-radius: 10upx;
	}

	.xing {
		color: red;
		position: absolute;
		right: 50upx;
	}

	.uni-input {
		border: 1px solid #c0c0c0;
		border-radius: 10upx;
		padding: 0 20upx;
		color: #666666;
		font-weight: 100;
		margin: 24upx 0;
	}

	.uni-textarea {
		border: 1px solid #c0c0c0;
		border-radius: 10upx;
		padding: 10upx 20upx;
		color: #666666;
		font-weight: 100;
		margin: 24upx 0;
		width: auto;
		height: 150px;
		display: block;
		position: relative;
		font-size: 13px;
		line-height: normal;
	}

	.uni-padding-wrap {
		width: auto;
		padding: 16upx 0;
	}

	.uni-radio-input {
		border-radius: 10%;
	}

	.ruzhu {
		background-color: #ff2742;
		color: #fff;
		height: 50px;
		line-height: 50px;
		text-align: center;
		margin-top: 12px;
	}
</style>
