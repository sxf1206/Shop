<template>
	<view>
		<!-- 海报 -->
		<canvas canvas-id="zwyPoster" :style="{ width: cansWidth, height: cansHeight }" class="isCan"  disable-scroll="false"></canvas>
		<view class="bg" @click="closeCans"></view>
		<view class="fixedBox">
			<view class="boxLeft"><button class="flexBtn btnLeft" hover-class="btnHover" @click="saveCans">保存</button></view>
			<view class="boxRight"><button class="flexBtn btnRight" hover-class="btnHover" @click="closeCans">关闭</button></view>
		</view>
	</view>
</template>

<script>
export default {
	props: {		
		posterObj: {
			type: Object,
			default: {
				himg: 'https://img0.zuipin.cn/mp_zuipin/poster/hch-pro.jpg', 
				uname: '标题', 
				gdesc: '描述', 
				gname: '', 
				pimg: 'https://img0.zuipin.cn/mp_zuipin/poster/hch-pro.jpg', 
				codeimg: 'https://img0.zuipin.cn/mp_zuipin/poster/hch-pro.jpg', 
				gnowprice: '12' ,
				savemoney: '22' 
			}
		}
	},
	data() {
		return {
			// 海报
			cansWidth: 270, //海报宽度
			cansHeight: 480 //海报高度
			// 海报
		};
	},
	created() {
		this.createCanvasImage();
	},
	computed: {
		
	},
	methods: {
		// 生成海报
		createCanvasImage() {		
			
			this.ctx = uni.createCanvasContext('zwyPoster', this);
			this.drawBaseBg('white');//绘制海报底色为白色
			this.ProductsImg(this.posterObj.pimg);			
			this.Minicodeimg(this.posterObj.codeimg); //小程序码位置			
			//this.drawText({ text: '长按扫码购买', sLeft: 0.61, sTop: 0.94, fontSize: 12, color: '#5A390F', bold: false }); //长按扫码购买位置
			
			this.circleImg(this.posterObj.himg, 0.06, 0.06, 22); //头像位置
			this.drawText({ text: '竞享价 ￥' + this.posterObj.gnowprice, sLeft: 0.06, sTop: 0.72, fontSize: 18, color: '#ff6600' });
			//this.drawText({ text: '省·赚：￥' + this.savemoney, sLeft: 0.03, sTop: 0.8, fontSize: 16, color: '#333333', lineHeight: 40 });			
			//#ifdef MP-WEIXIN || MP-BAIDU
			this.drawText({ text: this.posterObj.uname, sLeft: 0.26, sTop: 0.088, fontSize: 13, color: '#5A390F', bold: true });
			this.drawText({ text: this.posterObj.gdesc, sLeft: 0.26, sTop: 0.14, fontSize: 15, color: '#333333',});			
			this.drawText({ text: [this.posterObj.gname, ''], sLeft: 0.06, sTop: 0.78, fontSize: 14, color: '#333333', lineHeight: 20 });			
			//#endif
			
			// #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO
			this.drawText2({ text: this.posterObj.uname, sLeft: 0.26, sTop: 0.04,textnum: 18,linenum: 1, fontSize: 13, color: '#5A390F', bold: true });
			this.drawText2({ text: this.posterObj.gdesc, sLeft: 0.26, sTop: 0.094,textnum: 12,linenum: 1, fontSize: 15, color: '#333333',});			
			this.drawText2({ text: this.posterObj.gname, sLeft: 0.06, sTop: 0.73,textnum: 8,linenum: 2, fontSize: 14, color: '#333333', lineHeight: 20 });// 调用行文本换行函数
			// #endif
			wx.hideLoading();
		},		
		drawBaseBg(bgColor) {
			this.ctx.rect(0, 0, this.cansWidth, this.cansHeight);
			this.ctx.setFillStyle(bgColor);
			this.ctx.fill();			
			this.ctx.draw(true);
		},
		circleImg(img, x, y, r) {
			uni.getImageInfo({
				src: img
			}).then(image => {
				console.log("imagewidth:"+image.width)
				    console.log("imageheight:"+image.height)
				//console.log(image[1].path);
				x = Math.ceil(this.cansWidth * x);
				y = Math.ceil(this.cansHeight * y);
				this.ctx.save();
				var d = 2 * r;
				var cx = x + r;
				var cy = y + r;
				this.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
				this.ctx.clip();
				console.log('我是image', x+":"+y+":"+d+":"+d);
				this.ctx.drawImage(image[1].path, x, y, d, d);
				this.ctx.restore();
				this.ctx.draw(true);
			});
		},
		Minicodeimg(img){
			uni.getImageInfo({
				src: img
			}).then(image => {							
				this.ctx.drawImage(image[1].path, 150, 330, 100, 100);
				 this.ctx.restore();
				 this.ctx.draw(true);
			});
		},
		ProductsImg(img) {
			uni.getImageInfo({
				src: img
			}).then(image => {
				console.log("imagewidth:"+ JSON.stringify(image))
				console.log("imageheight:"+image[1].width)
				console.log("imageheight:"+image[1].height)
				console.log(image[1].path);
				var w = Math.ceil(this.cansWidth-30);
				// y = Math.ceil(this.cansHeight * y);
				// this.ctx.save();
				// var d = 2 * r;
				// var cx = x + r;
				// var cy = y + r;
				// this.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
				// this.ctx.clip();				
				this.ctx.drawImage(image[1].path, 15, 80, w, w);
				 this.ctx.restore();
				 this.ctx.draw(true);
			});
		},
		QRCodesImg(img) {
			uni.getImageInfo({
				src: img
			}).then(image => {
				console.log("imagewidth:"+ JSON.stringify(image))
				console.log("imageheight:"+image[1].width)
				console.log("imageheight:"+image[1].height)
				console.log(image[1].path);
				var w = Math.ceil(this.cansWidth-30);
				// y = Math.ceil(this.cansHeight * y);
				// this.ctx.save();
				// var d = 2 * r;
				// var cx = x + r;
				// var cy = y + r;
				// this.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
				// this.ctx.clip();		150, 330, 100, 100		
				this.ctx.drawImage(image[1].path, 150, 330, 110, 130);
				 this.ctx.restore();
				 this.ctx.draw(true);
			});
		},
		closeCans() {
			this.$parent.posterShow = false;
		},
		saveCans() {
			console.log('保存');
			uni.showLoading({
				title: '保存ing...',
				mask: true
			});
			uni.canvasToTempFilePath(
				{
					x: 0,
					y: 0,
					width: this.cansWidth * 1.5,
					height: this.cansHeight * 1.5,
					destWidth: this.cansWidth * 3,
					destHeight: this.cansHeight * 3,
					canvasId: 'zwyPoster',
					success: function(res) {
						uni.hideLoading();
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(res) {
								uni.showToast({
									title: '保存相册成功'
								});
								console.log('save success');
							},
							fail(res) {
								console.log(res);
								if (res.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
									uni.showModal({
										title: '您需要授权相册权限',
										success(res) {
											if (res.confirm) {
												uni.openSetting({
													success(res) {},
													fail(res) {
														console.log(res);
													}
												});
											}
										}
									});
								}
							}
						});
					
					
					},
					fail(res) {
						uni.hideLoading();
					}
				},
				this
			);
		},
		drawPara(item) {
			var redIndexObj = {};
			if (item.redWord.length > 0) {
				for (var i = 0; i < item.redWord.length; i++) {
					let startIndex = 0,
						index;
					while ((index = item.para.indexOf(item.redWord[i], startIndex)) > -1) {
						redIndexObj[index] = true;
						for (var j = 0; j < item.redWord[i].length; j++) {
							redIndexObj[index + j] = true;
						}
						startIndex = index + 1;
					}
				}
			}
			this.ctx.font = `normal normal ${item.fontSize}px sans-serif`;
			this.ctx.setFillStyle(item.color);
			var isLeft;
			if (item.sLeft == 'center') {
				isLeft = this.cansWidth * (0.5 - item.sMaxWidth / 2) - item.fontSize;
			} else {
				isLeft = item.sLeft * this.cansWidth;
			}
			var maxWidth = Math.floor(this.cansWidth * item.sMaxWidth);
			var tempList = item.para.split('');
			var nowText = '',
				isCol = 0,
				textWidth = 0;
			for (var i = 0; i < tempList.length; i++) {
				if (i > 0) {
					nowText += tempList[i - 1];
				} else {
					nowText += tempList[0];
				}
				textWidth = this.ctx.measureText(nowText).width;
				if (textWidth > maxWidth) {
					isCol++;
					nowText = '占';
					textWidth = this.ctx.measureText(nowText).width;
				}
				if (redIndexObj[i]) {
					this.ctx.save();
					if (item.bold) this.ctx.font = `normal bold ${item.fontSize}px sans-serif`;
					this.ctx.setFillStyle(item.redColor);
				}
				this.ctx.fillText(tempList[i], isLeft + textWidth, item.sTop * this.cansHeight + item.titleHeight * isCol);
				this.ctx.restore();
			}
			this.ctx.draw(true);
		},
		drawBg(item) {
			if (item.sLeft == 'center') {
				this.ctx.drawImage(item.url, this.cansWidth * (0.5 - item.sWidth / 2), this.cansHeight * item.sTop, this.cansWidth * item.sWidth, this.cansHeight * item.sHeight);
			} else {
				this.ctx.drawImage(item.url, this.cansWidth * item.sLeft, this.cansHeight * item.sTop, this.cansWidth * item.sWidth, this.cansHeight * item.sHeight);
			}
			this.ctx.draw(true);
		},
		drawText2(item){			
		  var isLeft;
		  if (item.sLeft == 'center') {
		  	isLeft = this.cansWidth * 0.5 - (item.fontSize * item.text.length) / 2;
		  } else {
		  	isLeft = item.sLeft * this.cansWidth;
		  }
		  this.ctx.save();
		  if (item.bold) this.ctx.font = `normal bold ${item.fontSize}px sans-serif`;
		  this.ctx.setFillStyle(item.color);
		  this.ctx.setFontSize(item.fontSize);		  
		  this.ctx.fillText(item.text.substring(0, item.textnum), isLeft, item.sTop * this.cansHeight +  23, 380);		
		  if(item.linenum>1){
			  this.ctx.fillText(item.text.substring(item.textnum+1, item.textnum+item.textnum+1), isLeft, item.sTop * this.cansHeight +  46, 380);
			  this.ctx.fillText(item.text.substring((item.textnum*3)+1, (item.textnum*4)+1), isLeft, item.sTop * this.cansHeight +  69, 380);
		   }
		  this.ctx.draw(true);
		  this.ctx.restore();
		},
		drawText(item) {
			var isLeft;
			if (item.sLeft == 'center') {
				isLeft = this.cansWidth * 0.5 - (item.fontSize * item.text.length) / 2;
			} else {
				isLeft = item.sLeft * this.cansWidth;
			}
			this.ctx.save();
			if (item.bold) this.ctx.font = `normal bold ${item.fontSize}px sans-serif`;
			this.ctx.setFillStyle(item.color);
			this.ctx.setFontSize(item.fontSize);
			if (item.text instanceof Array) {
				if (!item.lineHeight) item.lineHeight = item.fontSize + 2;
				for (var i = 0; i < item.text.length; i++) {
					var row = this.canvasMultiLineText(item.text[i],4,120); //计算绘制的2行文本
					
					if (row.length > 0) {
						for (var b = 0; b < row.length; b++) {
							this.ctx.fillText(row[b], isLeft, item.sTop * this.cansHeight + b * 23, 140);
						}
					} else {
						this.ctx.fillText(item.text[i], isLeft, item.sTop * this.cansHeight + item.lineHeight * i, 140);
					}
				}
			} else {				
				var row = this.canvasMultiLineText(item.text,1,155); //计算绘制的2行文本	
				if (row.length > 0) {
					for (var b = 0; b < row.length; b++) {						
						this.ctx.fillText(row[b], isLeft, item.sTop * this.cansHeight + b * 23, 170);
					}
				} else {					
					this.ctx.fillText(item.text, isLeft, item.sTop * this.cansHeight, 170);
				}			
				
			}
			this.ctx.draw(true);
			this.ctx.restore();
		},
		canvasMultiLineText(text,linenum,textwidth) {
			const context = this.ctx;
			var chr = text.split(''); //这个方法是将一个字符串分割成字符串数组
			var temp = '';
			var row = [];
			for (var a = 0; a < chr.length; a++) {
				if (context.measureText(temp).width < textwidth) {
					temp += chr[a];
				} else {
					a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
					row.push(temp);
					temp = '';
				}
			}
			row.push(temp);
			
			//如果数组长度大于2 则截取前两个
			if (row.length > linenum) {
				var rowCut = row.slice(0, linenum);				
				var rowPart = rowCut;
				var test = '';
				var empty = [];
				for (var a = 0; a < rowPart.length; a++) {
					if (context.measureText(test).width < textwidth) {
						test += rowPart[a];
					} else {
						break;
					}
				}
				empty.push(test); // 处理后面加省略号
				var group = empty[0] + '...';
				rowCut.splice(linenum - 1, 1, group);
				row = rowCut;
			}
			return row;
		}
	}
};
</script>

<style lang="scss" scoped>
.bg {
	width: 100vw;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 998;
	background-color: rgba(0, 0, 0, 0.8);
}
.fixedBox {
	width: 100%;
	height: 100upx;
	position: fixed;
	bottom: 30upx;
	left: 0;
	display: flex;
	z-index: 1000;
	.boxLeft,
	.boxRight {
		width: 50%;
		height: 100%;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1000;
		justify-content: center;
		.flexBtn {
			position: relative;
			z-index: 1000;
			width: 200upx;
			height: 60upx;
			text-align: center;
			line-height: 55upx;
			font-size: 24upx;
			border-bottom: 6upx #f58365 solid;
			border-radius: 32upx;
			color: white;
			background: linear-gradient(to left, #f58365, #ff188a);
		}
	}
}
.btnHover {
	height: 55upx !important;
	border-bottom: 0 #f6be3c solid !important;
	transform: translateY(3px) translateZ(0px) !important;
}
.isCan {
	
	display: flex;
	z-index: 1000;
	
	border: 6px solid #fff;
	border-radius: 10px;
	position: fixed;
	left: 0;
	// z-index: 999;
	width: 270px;
	height: 480px;
	right: 0;
	bottom: 130upx;
	margin: 0 auto;
	background-size: 100%;
}
</style>
