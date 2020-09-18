<template>
	<view>
		<view class="status" :style="{position:headerPosition,top:statusTop}"></view>
		<!-- 商品列表 -->
		<view class="goods-list" style="padding-bottom: 100upx;">
			<view class="tis" v-if="goodsList.length==0">购物车是空的哦~</view>
			<view class="row" v-for="(row,index) in goodsList" :key="index">
				<!-- 删除按钮 -->
				<view class="menu" @tap.stop="deleteGoods(row.guids)">
					<view class="icon shanchu"></view>
				</view>
				<!-- 商品 -->
				<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)"
				 @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
					<!-- checkbox -->
					<view class="checkbox-box" @tap="selected(index)">
						<view class="checkbox">
							<view :class="[row.selected?'on':'']"></view>
						</view>
					</view>
					<!-- 商品信息 -->
					<view class="goods-info" @tap="toGoods(row.gid)">
						<view class="img">
							<image :src="row.mainimg"></image>
						</view>
						<view class="info">
							<view class="title">{{row.name}}</view>
							<view class="spec">
								{{row.ColorAlias}}{{row.Para0}}{{row.SizeAlias}}{{row.Para1}}
								<text style="color: red;" v-if="VIPType!=0">
									省·赚¥{{ row.Para2 }}
								</text>
							</view>
							<view class="price-number">
								<view class="price">￥{{row.GoodsPrices}}</view>
								<view class="number">
									<view class="sub" @tap.stop="sub(index,row)">
										<view class="icon jian"></view>
									</view>
									<view class="input" @tap.stop="discard">
										<input type="number" v-model="row.GoodsCounts" @input="sum($event,index)" />
									</view>
									<view class="add" @tap.stop="add(index,row)">
										<view class="icon jia"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 脚部菜单 -->
		<view class="footer" :style="{bottom:footerbottom}">
			<view class="checkbox-box" @tap="allSelect">
				<view class="checkbox">
					<view :class="[isAllselected?'on':'']"></view>
				</view>
				<view class="text">全选</view>
			</view>
			<view class="delBtn" @tap="deleteList" v-if="selectedList.length>0">删除</view>
			<view class="settlement">
				<view class="sum">总计:<view class="money">￥{{sumPrice}}</view>
				</view>

				<view class="btn" @tap="toConfirmation">结算
					<!-- ({{selectedList.length}}) -->
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
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType', 'unionid']),
		data() {
			return {
				sumPrice: '0.00',
				headerPosition: "fixed",
				headerTop: null,
				statusTop: null,
				selectedList: [],
				isAllselected: false,
				goodsList: [],
				//控制滑动效果
				theIndex: null,
				oldIndex: null,
				isStop: false
			}
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
			this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
		},
		//下拉刷新
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
			this.init();
		},
		onLoad() {
			//兼容H5下结算条位置
			// #ifdef H5
			this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight + 'px';
			// #endif
			// #ifdef APP-PLUS
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
			this.init();
		},
		methods: {
			init() {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QueryShoppingCount',
						account: uni.getStorageSync('Account')
					},
					success: result => {

						let list = JSON.stringify(result.data.SCarInfo);
						this.goodsList = JSON.parse(list);
						this.goodsList.forEach(item => {
							var mains = item.mainimg.split(',')[0];
							item.mainimg = 'https://www.chinaaos.com' + mains;

							var Guigelist = item.Specifications.split(' ');
							if (Guigelist.length > 2) {
								item.ColorAlias = item.ColorAlias + ":";
								item.Para0 = Guigelist[0] + ";";
								item.SizeAlias = item.SizeAlias + ":";
								item.Para1 = Guigelist[1] + ";";
							} else if (Guigelist.length == 2) {
								item.ColorAlias = item.ColorAlias + ":";
								item.Para0 = Guigelist[0] + ";";
								item.Para1 = "";
								item.SizeAlias = "";
							} else {
								item.ColorAlias = "";
								item.Para0 = "";
								item.Para1 = "";
								item.SizeAlias = "";
							}
							item.Para2 = (((parseFloat(item.GoodsPrices) - parseFloat(item.SetTlementPrice)) * 0.4).toFixed(2)) *
								parseInt(item.GoodsCounts);
						});

					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			//控制左滑删除效果
			touchStart(index, event) {
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
			},
			touchMove(index, event) {
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];

				if (this.isStop || Math.abs(moveX) < 5) {
					return;
				}

				if (Math.abs(moveY) > Math.abs(moveX)) { // 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}

				if (moveX < 0) {
					this.theIndex = index;
					this.isStop = true;
				} else if (moveX > 0) {
					if (this.theIndex != null && this.oldIndex == this.theIndex) {
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(() => {
							this.oldIndex = null;
						}, 150)
					}
				}

			},
			touchEnd(index, $event) {
				this.isStop = false;
			},
			//侧滑删除
			deleteGoods(id) {
				id = "'" + id + "'";
				let len = this.goodsList.length;
				for (let i = 0; i < len; i++) {
					if (id == this.goodsList[i].id) {
						this.goodsList.splice(i, 1);
						break;
					}
				}
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'DeleteByCar',
						GGuid: id
					},
					success: result => {
						uni.showToast({
							icon: 'none',
							title: result.data.Msg
						});
						this.selectedList.splice(this.selectedList.indexOf(id), 1);
						this.sum();
						this.oldIndex = null;
						this.theIndex = null;
						this.init();
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			//商品跳转
			toGoods(e) {
				console.log(e)
				uni.navigateTo({
					url: '../Product/ProductDetail?gid=' + e
				});
			},
			//跳转确认订单页面
			toConfirmation() {
				let tmpList = [];
				let len = this.goodsList.length;
				for (let i = 0; i < len; i++) {
					if (this.goodsList[i].selected) {
						tmpList.push(this.goodsList[i]);
					}
				}
				//console.log(JSON.stringify(tmpList));
				if (tmpList.length < 1) {
					uni.showToast({
						title: '请选择商品结算',
						icon: 'none'
					});
					return;
				}
				uni.setStorageSync('buylist', JSON.stringify(tmpList));
				uni.navigateTo({
					url: '/pages/Order/createOrder'
				})
				// uni.setStorage({
				// 	key: 'buylist',
				// 	data: JSON.stringify(tmpList),
				// 	success: () => {
				// 		uni.navigateTo({
				// 			url: '/pages/Order/createOrder'
				// 		})
				// 	}
				// })
			},
			// formSubmit: function(e) {				
			// 	let formId = e.detail.formId;
			// 	uni.request({
			// 		url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
			// 		data: {
			// 			req: 'AddTemplateMsg',
			// 			formId: formId,
			// 		},
			// 		success: result => {
			// 			console.log("success");
			// 			this.toConfirmation();
			// 		},
			// 		fail: e => {
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: e.errMsg
			// 			});
			// 		}
			// 	});
			// },
			// 删除商品s
			deleteList() {
				let len = this.selectedList.length;
				var gguid = "";
				for (let i = 0; i < len; i++) {
					gguid += "'" + this.selectedList[i] + "',";
				}
				this.selectedList = [];
				this.isAllselected = this.selectedList.length == this.goodsList.length && this.goodsList.length > 0;
				this.sum();
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'DeleteByCar',
						GGuid: gguid.substring(0, gguid.length - 1)
					},
					success: result => {
						uni.showToast({
							icon: 'none',
							title: result.data.Msg
						});
						this.sumPrice = 0.00;
						this.oldIndex = null;
						this.theIndex = null;
						this.init();
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			// 选中商品
			selected(index) {
				this.goodsList[index].selected = this.goodsList[index].selected ? false : true;
				let i = this.selectedList.indexOf(this.goodsList[index].guids);
				i > -1 ? this.selectedList.splice(i, 1) : this.selectedList.push(this.goodsList[index].guids);
				this.isAllselected = this.selectedList.length == this.goodsList.length;
				this.sum();
			},
			//全选
			allSelect() {
				let len = this.goodsList.length;
				let arr = [];
				for (let i = 0; i < len; i++) {
					this.goodsList[i].selected = this.isAllselected ? false : true;
					arr.push(this.goodsList[i].guids);
				}
				this.selectedList = this.isAllselected ? [] : arr;
				this.isAllselected = this.isAllselected || this.goodsList.length == 0 ? false : true;
				this.sum();
			},
			// 减少数量
			sub(index, row) {
				if (this.goodsList[index].GoodsCounts <= 1) {
					return;
				}
				var CarGuid = row.Guid;
				var SkuGuid = row.SKUGuid;
				var GoodsNo = row.GoodsNo;
				var GoodsCounts = this.goodsList[index].GoodsCounts;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'ChangeCarCounts',
						CarGuid: CarGuid,
						SkuGuid: SkuGuid,
						GoodsNo: GoodsNo,
						GoodsCounts: GoodsCounts,
						changetype: 'jian'
					},
					success: result => {
						if (result.data.ResultType) {
							console.log("yes");
							this.goodsList[index].GoodsCounts--;
							this.sum();
						} else {
							uni.showToast({
								icon: 'none',
								title: result.data.Msg
							});
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
			// 增加数量
			add(index, row) {
				var CarGuid = row.Guid;
				var SkuGuid = row.SKUGuid;
				var GoodsNo = row.GoodsNo;
				var GoodsCounts = this.goodsList[index].GoodsCounts;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'ChangeCarCounts',
						CarGuid: CarGuid,
						SkuGuid: SkuGuid,
						GoodsNo: GoodsNo,
						GoodsCounts: GoodsCounts,
						changetype: 'jia'
					},
					success: result => {
						if (result.data.ResultType) {
							console.log("yes");
							this.goodsList[index].GoodsCounts++;
							this.sum();
						} else {
							uni.showToast({
								icon: 'none',
								title: result.data.Msg
							});
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
			// 合计
			sum(e, index) {
				this.sumPrice = 0;
				let len = this.goodsList.length;
				for (let i = 0; i < len; i++) {
					if (this.goodsList[i].selected) {
						if (e && i == index) {
							this.sumPrice = this.sumPrice + (e.detail.value * this.goodsList[i].GoodsPrices);
						} else {
							this.sumPrice = this.sumPrice + (this.goodsList[i].GoodsCounts * this.goodsList[i].GoodsPrices);
						}
					}
				}
				this.sumPrice = this.sumPrice.toFixed(2);
			},
			discard() {
				//丢弃
			}


		}
	}
</script>
<style lang="scss">
	page {
		position: relative;
		background-color: #f3f7f7;
	}

	@font-face {
		font-family: "HMfont-home";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAOEAAsAAAAAB7wAAAM1AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqDAIJNATYCJAMQCwoABCAFhG0HPhu1BsiOw7jha84s8T+CgOyq6unevTlAeAkRhAhQBjj8eJfmMg/oB5whSgaFspy7AqbpwE3Py3/j9j+X07uGyFHr21lua9HYi9rUCzDeGtBYmw4o0AJJ0BvGLmiJxyEAC3yIQhSVPL9BF4U5TgBi7ChtQzfjQKFYWEdgrFiqEBsxoGurtMfAhuD74g8JQgcNg8ScWjf8xoPz7/nfD8iFpoV0eQi86XQAWwUSiAIUiJGVhgEaUSAKiYXau0kKoKOjwVRthd8PmExIBRvmWH95INCQIIyYqVYAJKGghO/5Dg4B3wtxaPD9QAoS4IOM1gEzYBbAMkT16iIQGPxsopS5ScAcK23LiaBDpzyk1aGLHtsvhVrL7adDD55016wPXnDfcr7T3lcE2TVcP2fNhZM7WeiEhVp44vx9C5vVD6+eEgaLTZvEot3HL1lawlnXLK3XnISDllbWwmrmGjlRLdxq2bpme1RAeqXtzWh6g0F//wCCnRiN2diwr2+Yse3iEs20g05Q5tT0BikOXwKf79vsoEvb6p6xjVhHP92nwDJmX+9hwsf26dXbPiNvZ/98x67/+5T+ev0aWxbXCwOX41zLxia+O73B6Y57fN1u6GvN+Zmbc8XITigTAcB0Rl6X8QB4hDgEpoXypZz2q37D5FVnVa9t1n/dUgHw8uKMq9BmWqjoJoP3zevM+zG8jmVKE5hKpRShw9WTFZW04D7TscAC+B0RcOD9FHLnzqkg0HFOQMMMb5DoBKGKGgUGLEkCIzq5YEEkpastcWQyDYQyByJYBkBgx2nQsOEaSOx4girqOzDgwj8wYickWNAiHLe0JESMsiicTLaQh84PBm6WKlst/TD9hXQV25wWBLQP4jJw435MXD58RynxFDPKT30golBxluAtOI3iOMOcs5Bc2fFF8sPd2OFVBO24WQJ9CmEIG4HwQAb4ARmFS0aK8qoL/cLnXyA0FTE23FBSZf+AYEqCzpF4YojrgN5J004lt/LKFD7RHDAVQYEMh8lIQErAICImJgOZWD0ohHARdhg5wJdzSKxVaXhX6c7y8uQN1wAWmLOU0IQUShiQo0fZTceadqaMdP2uXwEAAAAA') format('woff2');
	}

	.icon {
		font-family: "HMfont-home" !important;
		font-size: 60upx;
		font-style: normal;
		color: #000000;

		&.jia {
			&:before {
				content: "\e641";
			}
		}

		&.jian {
			&:before {
				content: "\e643";
			}
		}

		&.shanchu {
			&:before {
				content: "\e6a4";
			}
		}

	}

	.checkbox-box {
		display: flex;
		align-items: center;

		.checkbox {
			width: 35upx;
			height: 35upx;
			border-radius: 100%;
			border: solid 2upx #f06c7a;
			display: flex;
			justify-content: center;
			align-items: center;

			.on {
				width: 25upx;
				height: 25upx;
				border-radius: 100%;
				background-color: #f06c7a;
			}
		}

		.text {
			font-size: 28upx;
			margin-left: 10upx;
		}
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
	}


	.goods-list {
		width: 100%;
		padding-top: 10px;

		.tis {
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			padding-top: 80px;
		}

		.row {

			height: calc(30vw + 40upx);
			margin: 20upx auto;

			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;

			.menu {
				.icon {
					color: #fff;
					// font-size: 25upx;
				}

				position: absolute;
				width: 30%;
				height: 98%;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}

			.carrier {
				@keyframes showMenu {
					0% {
						transform: translateX(0);
					}

					100% {
						transform: translateX(-30%);
					}
				}

				@keyframes closeMenu {
					0% {
						transform: translateX(-30%);
					}

					100% {
						transform: translateX(0);
					}
				}

				&.open {
					animation: showMenu 0.25s linear both;
				}

				&.close {
					animation: closeMenu 0.15s linear both;
				}

				background-color: #fff;

				.checkbox-box {
					padding-left: 20upx;
					flex-shrink: 0;
					height: 22vw;
					margin-right: 20upx;
				}

				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				display: flex;
				align-items: center;

				.goods-info {
					width: 100%;
					display: flex;
					padding-right: 20upx;

					.img {
						width: 27vw;
						height: 27vw;
						border-radius: 10upx;
						overflow: hidden;
						flex-shrink: 0;
						margin-right: 10upx;

						image {
							width: 27vw;
							height: 27vw;
						}
					}

					.info {
						width: 100%;
						height: 27vw;
						overflow: hidden;
						display: flex;
						flex-wrap: wrap;
						position: relative;

						.title {
							width: 100%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							// text-align: justify;
							overflow: hidden;
							line-height: 20px;
							height: 40px;
						}

						.spec {
							font-size: 20upx;
							background-color: #f3f3f3;
							color: #a7a7a7;
							height: 30upx;
							display: flex;
							align-items: center;
							margin: 0 10upx;
							border-radius: 2px;
							margin-bottom: 6vw;
						}

						.price-number {
							position: absolute;
							width: 100%;
							bottom: 0upx;
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							font-size: 28upx;
							height: 60upx;

							.price {
								color: #ff2742;
								font-weight: 600;
								font-size: 32upx;
							}

							.number {
								display: flex;
								justify-content: center;
								align-items: flex-end;

								.input {
									width: 60upx;
									height: 45upx;
									margin: 0 10upx;
									background-color: #fff;
									color: #666666;

									input {
										width: 60upx;
										height: 45upx;
										min-height: 45upx;
										display: flex;
										justify-content: center;
										align-items: center;
										text-align: center;
										font-size: 26upx;
									}
								}

								.sub,
								.add {
									width: 45upx;
									height: 45upx;
									background-color: #f3f3f3;
									border-radius: 5upx;

									.icon {
										font-size: 22upx;
										width: 45upx;
										height: 45upx;
										display: flex;
										justify-content: center;
										align-items: center;

									}
								}
							}
						}
					}
				}
			}
		}
	}

	.footer {
		width: 97%;
		padding: 0 0 0 3%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;

		.delBtn {
			border: solid 1upx #f06c7a;
			color: #f06c7a;
			padding: 0 30upx;
			height: 50upx;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.settlement {
			width: 60%;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.sum {
				width: 50%;
				font-size: 28upx;
				margin-right: 20upx;
				display: flex;
				justify-content: flex-end;

				.money {
					font-weight: 600;
				}
			}

			.btn {
				width: 120upx;
				padding: 0 50upx;
				height: 80upx;
				background-color: #ff2742;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 0px;

				button {
					color: #fff;
					font-size: 32upx;
					background-color: initial;
					border: 0px solid rgba(0, 0, 0, 0) !important;
				}
			}
		}
	}


	button:after {
		border: 0;
	}
</style>
