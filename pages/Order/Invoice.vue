<template>
	<view class="bigmore">
		<view class="contion">
			<view class="viewsty">发票类型</view>

			<view class="viewsty">
				<radio-group @change="radioChange">
					<view class="uni-padding-wrap">
						<label class="radio" v-for="(item, index) in items" :key="item.value" style="margin-right: 50upx;">
							<radio :value="item.value" :checked="index === current" />{{item.name}}
						</label>
					</view>
				</radio-group>
			</view>

			<view class="remarkinfo">
				电子发票与纸质发票具有相同的法律效力，可以作为报销、售后、维权凭证，<text style="color: red;">使用电子发票，不易丢失，更方便环保</text>。
			</view>

			<view :style="{display:Isdisplay}">
				<view class="viewsty">发票抬头</view>

				<view class="viewsty">
					<radio-group @change="radioChange2">
						<view class="uni-padding-wrap">
							<label class="radio" v-for="(item, index) in items2" :key="item.value" style="margin-right: 50upx;">
								<radio :value="item.value" :checked="index === current2" />{{item.name}}
							</label>
						</view>
					</radio-group>
				</view>

				<view :style="{display:onedisplay}">
					<view class="row b-b">
						<text class="tit">手机号码</text>
						<input class="input" type="number" v-model="SJHM" placeholder="请输入手机号码" placeholder-class="placeholder" />
					</view>
					<view class="row b-b">
						<text class="tit">电子邮箱</text>
						<input class="input" type="text" v-model="DZYX" placeholder="可不填" placeholder-class="placeholder" />
					</view>
				</view>

				<view :style="{display:twodisplay}">
					<view class="row b-b">
						<text class="tit">单位名称</text>
						<input class="input" type="text" v-model="DWMC" placeholder="请填写单位名称" placeholder-class="placeholder" />
					</view>
					<view class="row b-b">
						<text class="tit">识别号</text>
						<input class="input" type="text" v-model="SBH" placeholder="请填写识别号" placeholder-class="placeholder" />
					</view>
					<view class="row b-b">
						<text class="tit">手机号码</text>
						<input class="input" type="number" v-model="SJHM" placeholder="请输入手机号码" placeholder-class="placeholder" />
					</view>
					<view class="row b-b">
						<text class="tit">电子邮箱</text>
						<input class="input" type="text" v-model="DZYX" placeholder="可不填" placeholder-class="placeholder" />
					</view>
				</view>

			</view>
		</view>
		<view class="shuoming">
			<view style="width: 90%;margin:0 auto;padding-bottom: 48px;">
				<view class="viewsty">发票须知</view>
				<view class="remarkinfo">1、开具发票需要您先确认收货。 </view>
				<view class="remarkinfo">2、电子发票在订单完成后，在订单详情中下载和查看。</view>
				<view class="remarkinfo">3、如您下单时未选择开票，自然年内，仍可通过订单详情在收货后重新申请开票。</view>
				<view class="remarkinfo">4、退货后原开具发票自动失效，将不能再作为有效依据。</view>
				<view class="remarkinfo">5、开具统一发票的多个商品部分退货的，原发票将作废，并重新开具与实际等额的发票。</view>
				<view class="viewsty" style="color: #333333;">查看更多发票常见问题></view>
			</view>
		</view>

		<button class="add-btn" @click="btnTrue()">确认</button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
		data() {
			return {
				items: [{
						value: '0',
						name: '不开发票'
					},
					{
						value: '1',
						name: '电子发票',
						checked: 'true'
					}
				],
				current: 0,
				items2: [{
						value: '0',
						name: '个人'
					},
					{
						value: '1',
						name: '企业',
						checked: 'true'
					}
				],
				current2: 0,
				Isdisplay: "none",
				onedisplay: "block",
				twodisplay: "none",
				SJHM: "",
				DZYX: "",
				DWMC: "",
				SBH: "",
				ProductName: "",
				summoney: "",
				getnowcode:"",
				GoodsGuid:""
			}
		},
		onLoad(option) {
			console.log(option.getnowcode);
			this.ProductName = option.name;
			this.summoney = option.sumPrice;
			this.getnowcode=option.getnowcode;
			this.GoodsGuid=option.GoodsGuids;
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
					this.Isdisplay = "block";
				} else {
					this.Isdisplay = "none";
				}
			},
			radioChange2(evt) {
				for (let i = 0; i < this.items2.length; i++) {
					if (this.items2[i].value === evt.target.value) {
						this.current2 = i;
						break;
					}
				}
				if (this.current2 == "1") {
					this.onedisplay = "none";
					this.twodisplay = "block";
				} else {
					this.onedisplay = "block";
					this.twodisplay = "none";
				}
			},
			btnTrue() {
				var InvoiceContext = "";
				var titleN = "";
				if (this.current == "0") {
					uni.navigateBack();
				} else {
					if (this.current2 == "0") {
						if (this.SJHM == "" || this.SJHM == null) {
							uni.showToast({
								icon: 'none',
								title: "手机号不能为空！"
							});
							return;
						}
						InvoiceContext = "个人";
						titleN = this.Userinfo.username;
					} else {
						if (this.DWMC == "" || this.DWMC == null) {
							uni.showToast({
								icon: 'none',
								title: "单位名称不能为空！"
							});
							return;
						}
						if (this.SBH == "" || this.SBH == null) {
							uni.showToast({
								icon: 'none',
								title: "识别号不能为空！"
							});
							return;
						}
						if (this.SJHM == "" || this.SJHM == null) {
							uni.showToast({
								icon: 'none',
								title: "手机号不能为空！"
							});
							return;
						}
						InvoiceContext = "企业";
						titleN = this.DWMC;
					}
					
					
					uni.request({
						url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
						data: {
							req: 'AddInvoiceList',
							UserId: uni.getStorageSync('Account'),
							InvoiceType: this.current,
							InvoiceTitle: titleN,
							InvoiceCode: this.SBH,
							InvoiceContext: InvoiceContext,
							RealName: this.Userinfo.username,
							CellPhone: this.SJHM,
							Email: this.DZYX,
							GoodsName: this.ProductName,
							OrderMoney: this.summoney,
							getnowcode:this.getnowcode,
							GoodsGuid:this.GoodsGuid,
						},
						success: result => {
							debugger
							console.log("yes");
							uni.navigateBack();
						},
						fail: e => {
							debugger
							uni.showToast({
								icon: 'none',
								title: e.errMsg
							});
						}
					});

				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
	}

	.viewsty {
		line-height: 12vw;
	}

	.bigmore {
		width: 100%;
	}

	.contion {
		width: 90%;
		margin: auto;
		text-align: left;
	}

	.remarkinfo {
		line-height: 7vw;
		border-bottom: 1px #F7F7F7 solid;
		margin-top: 16px;
		padding-bottom: 10px;
	}

	.shuoming {
		margin-top: 12px;
		background-color: #F1F2F3;
		color: #747474;
	}

	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 48px;
		font-size: 32upx;
		color: #fff;
		background-color: #ff6600;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		height: 84upx;
		background: #fff;
		border: 1px solid #f4f4f4;
		margin-top: 14px;

		.tit {
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: #747474;
			padding-left: 10px;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: #747474;
			padding-left: 16px
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: #747474;
		}
	}
</style>
