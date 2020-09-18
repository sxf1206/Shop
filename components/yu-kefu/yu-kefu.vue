<template name="kefu">
	<view>
		<movable-area class="movable-area">
			<movable-view class="online-contact" :position="position" :x="x" :y="y" :direction="direction" :damping="damping" @change="onChange" @tap="onTap" @touchend="onTouchend">
				<button open-type="contact" class="online-contact-button">
					<image class="online-contact-image" src="../../static/yu-kefu/kefu.jpg" mode="aspectFit"></image>
				</button>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				x:0,
				y:0,
				x1:0,
				x2:0,
				y1:0,
				y2:0,
				move:{
					x:0,
					y:0
				}
			}
		},
		name: "kefu",
		props: {
			qq: {
				type: Number,
				default: 309930292
			},
			damping:{
				type: Number,
				default: 10
			},
			direction:{
				type: String,
				default: "all"
			},
			position:{
				type: Number,
				default: 4
			}
		},
		methods: {
			onChange(e){
				if(e.detail.source==="touch"){
					this.move.x=e.detail.x;
					this.move.y=e.detail.y;
				}
			},
			onTouchend(){
				this.x=this.move.x;
				this.y=this.move.y;
				setTimeout(()=>{
					if(this.move.x<this.x2/2) this.x=this.x1;
					else this.x=this.x2;
					console.log(this.x,this.y)
				},100)
			},
			onTap(){
				//#ifdef H5
				uni.setClipboardData({data: this.qq});
				uni.showModal({
					title:"客服QQ",
					content: this.qq.toString(),
					confirmText:"复制成功",
					showCancel: false
				});
				var locatUrl = "mqqapi://card/show_pslcard?src_type=internal&version=1&uin="+this.qq+"&card_type=person&source=sharecard";
				var ifr = document.createElement("iframe");
				ifr.src = locatUrl;
				ifr.style.display = "none";
				document.body.appendChild(ifr);
				//#endif
				//#ifdef APP-PLUS
					plus.runtime.openURL("mqqapi://card/show_pslcard?src_type=internal&version=1&uin="+this.qq+"&card_type=person&source=sharecard", function(res) {
						console.log(res);
					});
				//#endif
				console.log("tap")
			}
		},
		mounted() {
			uni.getSystemInfo({
			    success: (res) => {
					this.x1=0;
					this.x2=parseInt(res.windowWidth)-50;
					this.y1=0;
					this.y2=parseInt(res.windowHeight)-50;
					setTimeout(()=>{
						if(this.position==1 || this.position==2) this.y=parseInt(this.y2*0.2);
						if(this.position==3 || this.position==4) this.y=parseInt(this.y2*0.8);
						if(this.position==1 || this.position==3) this.x=parseInt(this.x1);
						if(this.position==2 || this.position==4) this.x=parseInt(this.x2);
					},1000)
				}
			})
		}
	}
</script>
<style>
	.movable-area{
		position: fixed;
		width: 100%;
		height: 100%;
		z-index: 100;
		pointer-events: none;
	}
	
	.online-contact{
		pointer-events: auto;
	}
	
	.online-contact .online-contact-button{
		width: 50px;
		height: 50px;
		background: rgba(0,0,0,0);
		border: none;
		padding: 0;
		margin: 0;
	}
	
	.online-contact .online-contact-button::after{
		content:inherit;
		border: none;
		padding: 0;
		margin: 0;
	}
	
	.online-contact .online-contact-image{
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
</style>
