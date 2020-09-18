<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="ShipTo" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="Phone" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">地区</text>
			<text class="input">{{addressName}}</text>
			<button @click="showMulLinkageThreePicker" style="width: 76px;font-size: 12px;">选择地区</button>
			<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
			 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		</view>
		<view class="row b-b">
			<text class="tit">门牌号</text>
			<input class="input" type="text" v-model="AddressDetail" placeholder="街道、楼号、门牌" placeholder-class="placeholder" />
		</view>

		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="IsDefault" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">保存收货地址</button>
		<button class="add-btn2" @click="delAddress" v-if="Contorltype=='edit'">删除收货地址</button>
	</view>
</template>

<script>
	import mpvuePicker from '../../components/mpvue-picker/mpvuePicker.vue';
	import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'
	import cityData from '../../common/city.data.js';
	var Account;
	var Uguid;
	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			mpvuePicker,
			mpvueCityPicker
		},
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
		data() {
			return {
				ShipTo: '',
				Phone: '',
				addressName: '省-市-区',
				Address: '',
				AddressDetail: '',
				IsDefault: false,
				latitude: "",
				longitude: "",
				AdressGuid: "",
				manageType: "add",
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#007AFF',
				comefrom: '',
				Contorltype: ''
			}
		},
		onLoad(option) {
			this.comefrom = option.comefrom;
			this.Contorltype = option.type;
			let title = '新增收货地址';
			if (option.type == 'edit' && option.AdressGuid != "") {
				title = '编辑收货地址'
				this.AdressGuid = option.AdressGuid;
				this.manageType = option.type;
				this.init(this.manageType, this.AdressGuid);
			}
			uni.setNavigationBarTitle({
				title
			});
		},
		methods: {
			init(manageType, AdressGuid) {
				console.log("类型：" + manageType + "-----------guid：" + AdressGuid);
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QueryAdressBySelf',
						account: uni.getStorageSync('Account'),
						Guid: this.AdressGuid
					},
					success: result => {
						this.ShipTo = result.data.AddressList[0].ShipTo;
						this.Phone = result.data.AddressList[0].Phone;
						this.addressName = result.data.AddressList[0].Address;
						this.Address = result.data.AddressList[0].Address;
						this.AddressDetail = result.data.AddressList[0].AddressDetail;
						if (result.data.AddressList[0].IsDefault == 1) {
							this.IsDefault = true;
						} else {
							this.IsDefault = false;
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
			switchChange(e) {
				this.IsDefault = e.detail.value;
			},

			//地图选择地址
			// chooseLocation() {
			// 	uni.chooseLocation({
			// 		success: (data) => {
			// 			this.addressName = data.name;
			// 			this.Address = data.name;
			// 			this.latitude = data.latitude;
			// 			this.longitude = data.longitude;
			// 		}
			// 	})
			// },// 三级联动选择
			onCancel(e) {
				console.log(e)
			},
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				// this.addressName = JSON.stringify(e);
				this.addressName = JSON.parse(JSON.stringify(e)).label;
				this.Address = JSON.parse(JSON.stringify(e)).label;
			},
			//提交
			confirm() {
				if (this.ShipTo == "" || this.ShipTo == null) {
					uni.showToast({
						title: '请填写收货人姓名'
					});
					return;
				}
				if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.Phone)) {
					uni.showToast({
						title: '请输入正确的手机号码'
					});
					return;
				}
				if (this.Address == "" || this.Address == null) {
					uni.showToast({
						title: '请选择城市'
					});
					return;
				}
				if (this.AddressDetail == "" || this.AddressDetail == null) {
					uni.showToast({
						title: '请填写门牌号信息'
					});
					return;
				}
				var Ischecked = "";
				if (this.IsDefault == true) {
					Ischecked = 1;
				} else {
					Ischecked = 0;
				}
				uni.showLoading({
					title:"加载中。。。"
				})
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'InsertAddress',
						account: uni.getStorageSync('Account'),
						AdressGuid: this.AdressGuid,
						ShipTo: this.ShipTo,
						Phone: this.Phone,
						Address: this.Address,
						AddressDetail: this.AddressDetail,
						IsDefault: Ischecked,
						latitude: this.latitude,
						longitude: this.longitude,
						miantype: this.manageType
					},
					success: result => {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: result.data.Msg
						});
						setTimeout(() => {
							if (this.comefrom == "") {
								uni.navigateTo({
									url: './address'
								})
							} else {
								uni.navigateBack();
							}
						}, 800);
					},
					fail: e => {

						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			delAddress() {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'DelAdressById',
						account: uni.getStorageSync('Account'),
						Guid: this.AdressGuid
					},
					success: result => {
						uni.showToast({
							icon: 'none',
							title: "删除成功"
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 800);
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
	}
</script>

<style lang="scss">
	page {
		background-color: #f3f3f3 !important;
		padding-top: 16upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: #747474;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: #747474;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: #747474;
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: 14px;
		color: #fff;
		background-color: red;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

	.add-btn2 {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: 14px;
		color: #ff6600;
		background-color: white;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(90, 63, 96, 0.4);
		margin-top: -20px;
	}
</style>
