<template>
	<view>
		<view class="status" :style="{ position: headerPosition }"></view>
		<view class="header" :style="{ position: headerPosition }">
			<view class="input">我的二维码</view>
		</view>
		
	<view class="qrcode">
		<image class="image" v-if="img != ''" :src="img" :style="{ width: size+'px', height: size + 'px' }"/>
	</view>
	</view>
</template>
<script>
	import QR from "./qrcode.js";
	export default {
		name: 'number-box',
		props: { 
			val: {
				type: String,
				default: ''
			},
			size:{
				type:Number,
				default:200
			}
		},
		data(){
			return{
				headerPosition: 'fixed',
				img:''
			}
		},
		onLoad() {
			let val = String('http://www.aoswork.com')
			if(val == ''){
				return false
			}
			let img = QR.createQrCodeImg(val, {
				size: parseInt(200)
			})
			this.img = img;
		},
		onUnload(){
		},
		methods: {
			creatQrcode(){
				let val = String('http://www.aoswork.com')
				if(val == ''){
					return false
				}
				let img = QR.createQrCodeImg(val, {
					size: parseInt(this.size)
				})
				this.img = img;
			},
			clearQrcode(){
				this.img = '';
			}
		},
		watch:{
			size(newVal, oldVal){
				if(newVal != oldVal){
					this.size = newVal;
					this.creatQrcode()
				}
			}
		}
	}
</script>
<style>
	.qrcode{
		display: flex;
		justify-content: center;
	/*  #ifdef  MP-WEIXIN  */
	padding-top: 180upx;
	/* #endif */	
	/*  #ifdef  APP-PLUS  */
	margin-top:180upx;
	/* #endif */
	}
	.status {
			width: 100%;
			height: 0;
			/*  #ifdef  APP-PLUS  */
			height: var(--status-bar-height);
			/*  #endif  */
			background-color: #ff570a;
			position: fixed;
			top: 0;
			z-index: 999;
		}
		
		.header {
			width: 100%;
			height: 100upx;
			/*  #ifdef  MP-WEIXIN  */
			height: 160upx;
			/* #endif */
			background-color: #ff570a;
			display: flex;
			position: absolute;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);
			/*  #endif  */
			z-index: 996;
		}
		.input {
			margin: auto;
			color: white;
		}
		.image{
			width: 200px;
			height: 200px;
		}
</style>
