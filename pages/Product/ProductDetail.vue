<template>
	<view style="background-color: #f8f8f8;">
		
			<view class="container999" catchtouchmove="false">
				<poster v-if="posterShow" :posterObj.sync="posterData"></poster>
			</view>

			<view class="status" :style="{ opacity: afterHeaderOpacity }"></view>

			<!-- #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO -->
			<view class="header">
				<!-- 头部-默认显示 -->
				<view class="before" :style="{ opacity: 1 - afterHeaderOpacity, zIndex: beforeHeaderzIndex }">
					<view class="back">
						<view class="icon xiangqian" @tap="back" v-if="showBack"></view>
					</view>
					<view class="middle"></view>
					<!-- <view class="icon-btn">
					<view class="icon"></view>
					<view class="icon fenxiang" @tap="share"></view>
				</view> -->
				</view>
				<!-- 头部-滚动渐变显示 -->
				<view class="after" :style="{ opacity: afterHeaderOpacity, zIndex: afterHeaderzIndex }">
					<view class="back">
						<view class="icon xiangqian" @tap="back" v-if="showBack"></view>
					</view>
					<view class="middle">
						<view v-for="(anchor, index) in anchorlist" :class="[selectAnchor == index ? 'on' : '']" :key="index" @tap="toAnchor(index)">{{ anchor.name }}</view>
					</view>
					<view class="icon-btn">
						<!-- <view class="icon cart" @tap="joinCart"></view>
					<view class="icon fenxiang" @tap="share"></view> -->
					</view>
				</view>
			</view>

			<!-- #endif -->
			<!-- 商品图片 -->
			<view class="carousel">
				<swiper indicator-dots circular="true"     autoplay="true"    duration="400">
					<swiper-item class="swiper-item" v-for="(item, index) in imgList" :key="index">
						<view class="image-wrapper">
							<image :src="item.src" class="loaded" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<view class="introduce-section">
				<view style="padding-right: 30upx;">
					<text class="title">{{gname}}
					</text>
					<view class="somedesc">
						<text>{{gdesc}} </text>
					</view>
				</view>

				<view class="price-box" style="width: 100%;">
					<view style="width: 80%;display: -webkit-inline-box;">
						<text class="price-tip">¥</text>
						<text class="price">{{gnowprice}}</text>
						<text class="m-price" :style="{ display: pricedisplay }">¥{{goldprice}} </text>
						<text class="price" style="color: red;margin-left: 15px;" v-if="VIPType!=0">
							省·赚¥{{savemoney}}
						</text>
					</view>
					<view style="width: 20%;text-align: center;color: #747474;margin-right: -15px;">

						<!--#ifdef APP-PLUS -->
						<!-- #endif -->
						<view style="background-color: #ddd;border-top-left-radius: 16px;border-bottom-left-radius: 16px;">
							<view class="icon fenxiang" @tap="share" style="font-size: 17px;"><text style="font-size: 14px;">分享</text></view>
						</view>

					</view>
					<!-- <text class="coupon-tip">{{gzhekou}}折</text> -->

				</view>
			</view>

			<view class="eva-section" :style="{display:isGuigenull}">
				<view class="c-row b-b" @click="toggleSpec" :style="{display:isGuigenull}">
					<text class="tit">选择</text>
					<!-- #ifdef H5 -->
					<view v-if="haslength" style="display: inline-block;vertical-align: middle;padding-bottom: 4px;width: 91%;">
						<view class="con" style="position: absolute;padding-left: 20px;padding-top: 1px;">
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">{{ sItem.name }}</text>
						</view>
						<text class="yticon icon-you" style="float:right;">></text>
					</view>
					<!-- #endif -->

					<!-- #ifdef MP-WEIXIN || MP-BAIDU -->
					<view v-if="haslength" style="display: inline-block;vertical-align: middle;padding-bottom: 4px;width: 91%;">
						<view class="con" style="position: absolute;padding-left: 20px;padding-top: 1px;">
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">{{ sItem.name }}</text>
						</view>
						<text class="yticon icon-you" style="float:right;">></text>
					</view>
					<!-- #endif -->

					<!--#ifdef APP-PLUS-->
					<view v-if="haslength" style="display: inline-block;vertical-align: middle;padding-bottom: 4px;width: 92%;">
						<view class="con" style="position: absolute;padding-left: 20px;padding-top: 1px;">
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">{{ sItem.name }}</text>
						</view>
						<text class="yticon icon-you" style="float:right;">></text>																										
					</view>
					<!-- #endif -->
					<view v-if="!haslength" style="display: inline-block;vertical-align: middle;padding-bottom: 5px;">
						<view class="con">
							<text class="selected-text">{{GuigeNameOne}} {{GuigeNameTwo}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 拼团 -->
			<view class="eva-section" v-if="IsGroupActive">
				<block v-if="IsAdvanceSale">
					<text class="tit" style="margin-bottom: 5px;color: red;">预售时间 {{GroupActive.StartTime}}</text>
				</block>
				<block v-if="!IsAdvanceSale">
					<text class="tit" style="margin-bottom: 5px;">参与拼团进度 {{GroupActive.GroupCount}}人成团</text>
					<view class="progress-box" style="margin-bottom: 5px;">
						<progress :percent="(GroupActive.OkGroupCount/GroupActive.GroupCount)*100" activeColor="#fa436a" active
						 stroke-width="6" />
					</view>
					<text style="color: red;font-size: 12px;">注：拼团成功，48小时内发货；拼团失败，退款原路返回。</text>
				</block>
			</view>

			<!-- 服务 -->
			<view class="eva-section" :style="{display:isInfonull}">
				<view class="e-header">
					<text class="tit">服务</text>
					<text style="padding-left: 16px;">{{IsQuickRefund}}&nbsp;{{IsFreeShipping}}&nbsp;{{IsRefund}}&nbsp;{{IsDelivery}}&nbsp;{{IsCompensate}}</text>
				</view>
			</view>


			<!-- 评价 -->
			<!-- <view class="eva-section" id="comments">
			<view class="e-header" @click="QueryEval">
				<text class="tit">评价</text>
				<text>({{evalcounts}})</text>
				<text class="tip">好评率 100%</text>
				<text class="yticon icon-you">></text>
			</view>
		</view> -->

			<!-- 店铺 -->
			<view class="eva-section" style="max-height: 280px;" id="comments"  >
				<block  v-if="IsShow!=0">
				<view class="e-header">
					<image :src="dianpuTX" style="width: 55px;height: 55px;border-radius: 4px;margin-top: 24px;"></image>
					<text style="padding-left: 16px;margin-top: 24px;color: #333333;">{{dianpuMC}}</text>
					<text class="" style="font-size: 12px;margin-top: 14px;width: 62px;border: 1px solid;border-radius: 4px;text-align: center;height: 20px;position: absolute;left: 80%;"
					 @click="GoShop">
						进店逛逛
					</text>
				</view>
				<view style="width: 100%;margin-top: 40px;" class="shopcontent">
					<view class="carousel">
						<scroll-view scroll-x>
							<view class="scoll-wrapper">
								<view v-for="(item2, index2) in ShopGoodsimgList" :key="index2" class="floor-item" @click="navToDetailPage(item2)">
									<image :src="item2.ImagePath" mode="aspectFill" style="width: 140px;height: 140px;"></image>
									<br />
									<div class="title clamp">{{ item2.ProductName }}</div>
									<text class="price">￥{{ item2.SalePrice }}</text>
									<!-- <text style="color: red;text-align: right;margin-left: 12px;" v-if="VIPType!=0">
										省·赚¥{{item2.Para1}}
									</text> -->
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
                 </block>
			</view>

			<view class="detail-desc">
				<view class="d-header"><text>图文详情</text></view>

				<rich-text :nodes="desc" class="descTuwen"></rich-text>
				<view class="d-header"><text>购买须知</text></view>
				<view class="buyDetial" style="margin: 0 20px;">
					<view class="buyDtitlle">
						<image class="buyDimg" src="https://www.chinaaos.com/static/img/zhengpin2.png"></image>
						<view class="DtitlleTitlle"> 正品保障</view>
					</view>
					<view class="buyDInfo">
						竞享保证所有在本平台销售的商品均采自国内外正规供应商或品牌商，坚持正品保障，承诺售后无忧。
					</view>

					<view class="buyDtitlle">
						<image class="buyDimg" src="https://www.chinaaos.com/static/img/myf.png"></image>
						<view class="DtitlleTitlle"> 运费说明</view>
					</view>
					<view class="buyDInfo">
						竞享在售商品支持全国范围包邮，除港澳台、部分偏远地区(如新疆、西藏、内蒙古等)和特殊情况以外，您需要承担运费，具体运费金额以订单确认页给出的金额为准。
					</view>

					<view class="buyDtitlle">
						<image class="buyDimg" src="https://www.chinaaos.com/static/img/shuifei2.png"></image>
						<view class="DtitlleTitlle"> 税费说明</view>
					</view>
					<view class="buyDInfo">
						根据海关政策，竞享在售保税、直邮商品须收取税费。部分保税、直邮商品税费由竞享承担。具体收税税率以商详页说明给出的税率为准，收税金额以订单确认页给出的金额为准。
					</view>

					<view class="buyDtitlle">
						<image class="buyDimg" src="https://www.chinaaos.com/static/img/dfh.png"></image>
						<view class="DtitlleTitlle"> 发货说明</view>
					</view>
					<view class="buyDInfo">
						订单付款成功后48小时内发货 (上述情况不包含店主礼包、预售商品和大促活动商品，且跨境商品涉及清关，节假日等因素可能有所延迟，敬请谅解!)
					</view>

					<view class="buyDtitlle">
						<image class="buyDimg" src="https://www.chinaaos.com/static/img/kuaidi2.png"></image>
						<view class="DtitlleTitlle"> 快递说明</view>
					</view>
					<view class="buyDInfo">
						竞享与多家快递公司合作，保证国内大多数地区均有快递可以送达，暂不支持指定快递。
					</view>

					<view class="buyDtitlle">
						<image class="buyDimg" src="https://www.chinaaos.com/static/img/qs.png"></image>
						<view class="DtitlleTitlle"> 签收说明</view>
					</view>
					<view class="buyDInfo">
						收到商品后需要您当场验货确认无误后再签收，如果是包装完好且本人签收后再反馈少发、错发等类似问题，请自理。若非当面签收后发现异常请第一时间联系快递核实。
					</view>

					<view class="buyDtitlle">
						<image class="buyDimg" src="https://www.chinaaos.com/static/img/qitian.png"></image>
						<view class="DtitlleTitlle"> 不支持7天无理由退换</view>
					</view>
					<view class="buyDInfo">
						本商品不支持7天无理由退换货。
					</view>

					<view class="buyDtitlle">
						<image class="buyDimg" src="https://www.chinaaos.com/static/img/kf.png"></image>
						<view class="DtitlleTitlle"> 客服说明</view>
					</view>
					<view class="buyDInfo">
						在竞享APP直接联系在线客服。<br />
						客服在线时间：早上09:00至晚上21:00，节假日正常工作。
					</view>

					<view class="buyDtitlle">
						<image class="buyDimg" src="https://www.chinaaos.com/static/img/jiag.png"></image>
						<view class="DtitlleTitlle"> 价格说明</view>
					</view>
					<view class="buyDInfo">
						划线价格：划线的价格可能是商品的专柜吊牌价或正品零售价指导价或该商商品的曾经展示过的销售价等，仅供您参考。
						未划线价格：未划线的价格是商品在尽享上的销售标价，具体的成交价格可能因使用优惠券、优惠活动等会发生变化，最终以订单确认页价格为准。
					</view>

					<view class="buyDtitlle">
						<image class="buyDimg" src="https://www.chinaaos.com/static/img/xiangou.png"></image>
						<view class="DtitlleTitlle"> 限购说明</view>
					</view>
					<view class="buyDInfo" style="margin-bottom: 60px;">
						为尽可能保障普通用户的购买需求，避免违规囤积货物，特此约定:商品遵循同一用户限购政策，若通过各种手段绕过限购政策进行购实，平台有权采取包含但不限于货品不发、追回货物、不发放奖励等方式进行处理(包括但不限于同一账户、相似P、相似收贷地址、相似收件人、相同支付账号等维度识别出同一人，均视力同一用户)。
					</view>
				</view>
			</view>

			<!-- 底部操作菜单 -->
			<view class="page-bottom">
				<view class="p-b-btn">
					<!--#ifdef MP-WEIXIN -->
					<img src="https://www.chinaaos.com/static/lastkf.png" style="width: 21px;height: 21px;overflow: initial;"></img>
					<view style="margin-top: 3px;height: 14px;line-height: 14px;">
						<button open-type='contact' style="font-size: 14px;padding: 0 !important;color: #747474;background: 0,0,0,0;margin-top: -9px;">客服</button>
					</view>
					
					<!--#endif-->
					<!--#ifdef APP-PLUS || H5 -->
					<img src="https://www.chinaaos.com/static/lastkf.png" style="width: 23px;height: 23px;overflow: initial;" @click="changeMsgPage"></img>
					<text @click="changeMsgPage" style="margin-top: 5px;height: 14px;line-height: 14px;">客服</text>
					<!--#endif-->
				</view>
				<navigator url="/pages/cart/cart" open-type="navigate" class="p-b-btn">
					<img src="https://www.chinaaos.com/static/lastgwc.png" style="width: 26px;height: 26px;overflow: initial;"></image>
					<text style="margin-top: 2px;height: 14px;line-height: 14px;">购物车</text>
				</navigator>
				<view class="p-b-btn" :class="{ active: favorite }" @click="AddFavorite(gguid)">
					<img src="https://www.chinaaos.com/static/lastsc.png" style="width: 21px;height: 21px;overflow: initial;"></img>
					<text style="margin-top: 6px;height: 14px;line-height: 14px;">收藏</text>
				</view>

				<view class="action-btn-group" v-if="IsGroupActive">
					<block v-if="FinishGroupActive==0">
						<button type="primary" class=" action-btn no-border buy-now-btn" @click="BuyNow(gguid)" style="width: 360rpx;">预购下单</button>
					</block>
					<block v-if="FinishGroupActive==1">
						<button type="primary" class=" action-btn no-border buy-now-btn" style="width: 360rpx;">拼团成功</button>
					</block>
				</view>

				<view class="action-btn-group  actiongroup2" v-if="!IsGroupActive">
					<button type="primary" class=" action-btn no-border buy-now-btn" @click="BuyNow(gguid)">立即购买</button>
					<button type="primary" class=" action-btn no-border add-cart-btn" @click="addcar(gguid)">加入购物车</button>
				</view>
			</view>

			<!-- 规格-模态层弹窗 -->
			<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
				<!-- 遮罩层 -->
				<view class="mask"></view>
				<!--#ifdef APP-PLUS -->
				<view class="layer attr-content" style="width: 100%;padding: 0;" @click.stop="stopPrevent">
					<!--#endif-->
					<!--#ifdef MP-WEIXIN -->
					<view class="layer attr-content" style="width: 100%;padding: 0;padding-bottom: 48px;" @click.stop="stopPrevent">
						<!--#endif-->
						<!--#ifdef H5 -->
						<view class="layer attr-content" style="width: 100%;padding: 0;padding-bottom: 24px;" @click.stop="stopPrevent">
							<!--#endif-->
							<view class="a-t" style="width: 90%;margin: auto;">
								<image :src="gbeginimg"></image>
								<view class="right">
									<text class="price">¥{{gnowprice2}}</text>
									<text class="stock">库存：{{gkucun}}件</text>
									<view class="selected">
										已选：
										<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">{{ sItem.name }}</text>
									</view>
								</view>
							</view>
							<view v-for="(item, index) in specList" :key="index" class="attr-list" style="width: 90%;margin: auto;">
								<text>{{ item.name }}</text>
								<view class="item-list">
									<text v-for="(childItem, childIndex) in specChildList" v-if="childItem.pid === item.id" :key="childIndex"
									 class="tit" :class="{ selected: childItem.selected }" @click="selectSpec(childIndex, childItem.pid)">
										{{ childItem.name }}
									</text>
								</view>
							</view>
							<button class="btn" @click="Checkedfinish(gguid)" style="width: 90%;margin: auto;position: absolute;bottom: 0;margin-left: 18px;">完成</button>
						</view>
					</view>

					<!-- 分享 -->
					<!-- share弹窗 -->
					<view class="share" :class="shareClass" @touchmove.stop.prevent="discard" @tap="hideShare">
						<view class="mask"></view>
						<view class="layer" @tap.stop="discard">
							<view class="h1">分享</view>
							<view class="list">
								<!--#ifdef APP-PLUS || H5 -->
								<view class="box" @tap="shareByFriend()" style="width: 33.3%;">
									<image src="https://www.chinaaos.com/static/wx.png"></image>
									<view class="title">
										微信好友
									</view>
								</view>

								<view class="box" @tap="shareByCircle('pyq')" style="width: 33.3%;">
									<image src="https://www.chinaaos.com/static/pyq.png"></image>
									<view class="title">
										朋友圈
									</view>
								</view>
								<view class="box" @click="openPost" style="width: 33.3%;">
									<image src="https://www.chinaaos.com/static/whaibao.png"></image>
									<view class="title">
										生成海报
									</view>
								</view>
								<!--#endif-->
								<!-- #ifdef MP-WEIXIN || MP-BAIDU -->

								<view class="box" style="width: 50%;">
									<button class="" type="primary" open-type="share" style="background-color: initial; line-height: 51.7pxpx;height:51.7px; color: initial;">

										<image src="https://www.chinaaos.com/static/wx.png"></image>
									</button>

									<view class="title">
										微信
									</view>
								</view>
								<view class="box" @click="openPost" style="width: 50%;">
									<image src="https://www.chinaaos.com/static/whaibao.png"></image>
									<view class="title">
										生成海报
									</view>
								</view>
								<!-- <text @click="openPost">生成海报</text> -->
								<!-- #endif -->



							</view>
							<view class="btn" @tap="hideShare" style="border: 0;border-top: 0;margin-top: 0px;">
								取消
							</view>
						</view>


					</view>


					<!-- 插屏弹窗 -->
	</view>
</template>

<script>
	import htmlParser from '@/common/html-parser'
	import poster from '../../components/zywPoster.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'


	var Uguid;
	import {
		mapState
	} from 'vuex'

	function parseImgs(nodes) {
		nodes.forEach(node => {
			if (
				node.name === 'img' &&
				node.attrs
			) {
				const width = 100 + "%";
				node.attrs.style = `width:${width};`
			}
			if (Array.isArray(node.children)) {
				parseImgs(node.children)
			}
		})
		return nodes
	}


	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType', 'unionid', 'IsShow']),
		components: {
			uniPopup,
			poster
		},
		data() {
			return {

				gguid: '',
				gname: '',
				gdesc: "",
				gnowprice: 0,
				gnowprice2: 0,
				goldprice: 0,
				pricedisplay: "block",
				gzhekou: 0,
				gkucun: 0,
				xiaoliang: 0,
				gbeginimg: "https://www.chinaaos.com/static/mlfz_touimg.jpg",
				//控制渐变标题栏的参数
				beforeHeaderzIndex: 11, //层级
				afterHeaderzIndex: 10, //层级
				beforeHeaderOpacity: 1, //不透明度
				afterHeaderOpacity: 0, //不透明度
				//是否显示返回按钮
				// #ifndef MP
				showBack: true,
				// #endif
				imgList: [],
				currentSwiper: 0, //轮播图下标
				shareClass: '',
				anchorlist: [], //导航条锚点
				selectAnchor: 0, //选中锚点
				serviceClass: '', //服务弹窗css类，控制开关动画
				specClass: 'none',
				specSelected: [],
				favorite: true,
				SalesDeslist: [],
				desc: '',
				specList: [],
				specChildList: [],
				haslength: true,
				GuigeNameOne: "",
				GuigeNameTwo: "",
				skuId: "",
				IsCompensate: "",
				IsDelivery: "",
				IsRefund: "",
				IsFreeShipping: "",
				IsQuickRefund: "",
				isGuigenull: "none",
				isInfonull: "none",
				dianpuTX: "https://www.chinaaos.com/static/mlfz_touimg.png",
				dianpuMC: "",
				shopGuids: "",
				InfoList: [],
				evalcounts: "0",
				savemoney: 0,
				tjaccount: '', //商品推荐人
				tjGoodsSource: 0, //商品推荐的来源
				posterShow: false,
				codeimgurl: '',
				userimg: '',
				posterData: {},
				IsInvoice: "",
				ShopGoodsimgList: [],
				IsGroupActive: 0,
				GroupActive: [],
				IsAdvanceSale: false,
				FinishGroupActive: 0,
				CheckedfinishType: "",
				uid: '',
				newaccount: 0,
				Goldimg: '',
				imgUrl: ''
			}
		},
		onShareAppMessage() {
			var info = "¥" + this.gnowprice + "  " + this.gname;
			return {
				title: info ? info : "欢迎",
				path: "/pages/Product/ProductDetail?gid=" + this.gguid + "&tjaccount=" + this.Account +
					"&tjGoodsSource=2",
				imageUrl: this.imgUrl,
			}
		},
		onLoad(option) {
			
			var gid = "";
			if (option.scene) {
				gid = decodeURIComponent(option.scene);
				this.GetUnionid().then((res) => {
					console.log("uuuuuuuu：" + res);
					this.init(gid, 0, res);
					this.uid = res;
				});

			} else {
				gid = option.gid;
				if (option.tjaccount) {
					this.tjaccount = option.tjaccount;
					this.tjGoodsSource = option.tjGoodsSource;
				}
				this.init(gid, 1, '');
			}

			// #ifdef MP
			//小程序隐藏返回按钮
			this.showBack = false;


			// #endif		




		},
		onReady() {
			this.calcAnchor();
		},
		onPageScroll(e) {
			//锚点切换
			this.selectAnchor = e.scrollTop >= this.anchorlist[2].top ? 2 : e.scrollTop >= this.anchorlist[1].top ? 1 : 0;
			//导航栏渐变
			let tmpY = 375;
			e.scrollTop = e.scrollTop > tmpY ? 375 : e.scrollTop;
			this.afterHeaderOpacity = e.scrollTop * (1 / tmpY);
			this.beforeHeaderOpacity = 1 - this.afterHeaderOpacity;
			//切换层级
			this.beforeHeaderzIndex = e.scrollTop > 0 ? 10 : 11;
			this.afterHeaderzIndex = e.scrollTop > 0 ? 11 : 10;
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {},
		mounted() {},
		methods: {
			GetUnionid() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							var m = loginRes['code'];
							uni.request({
								url: 'https://www.chinaaos.com/Handler/WxAjaxHandler.ashx', //接口地址
								data: {
									code: m
								},
								header: {
									'content-type': 'application/json' //默认值
								},
								success: function(res) {
									var t = JSON.parse(res.data);
									resolve(t.unionid);
								}
							});
						}
					})
				})
			},
			openPost() {
				if (this.newaccount == "1" && (uni.getStorageSync('Account') == "" || uni.getStorageSync('Account') == undefined)) {
					uni.navigateTo({
						url: '/pages/LoginPhone?scene='+this.tjaccount
					});
					return false;
				}
				if (uni.getStorageSync('Account') == "" || uni.getStorageSync('Account') == undefined) {
					uni.navigateTo({
						url: '/pages/LoginWChat'
					});
					return false;
				}
				wx.showLoading({
					title: '海报生成中...'
				})
				this.codeImg(this.gguid).then((res) => {
					this.codeimgurl = res.pic;
					this.userimg = res.userImg;
					console.log("codeimgurl:" + this.codeimgurl+"____userimg:"+this.userimg+"____gguid:"+this.gguid+"____gdesc:"+this.gdesc);
					Object.assign(this.posterData, {
						himg: this.userimg, //用户头像
						uname: this.Userinfo.username, //用户名称
						gdesc: this.gdesc, //描述
						pimg: this.gbeginimg, //图片
						gname: this.gname, //名称
						codeimg: this.codeimgurl, //二维码
						gnowprice: this.gnowprice, //现价
						savemoney: '' 
					})

					//this.$forceUpdate();//强制渲染数据
					setTimeout(() => {
						this.posterShow = true;
						this.shareClass = 'hide';
						setTimeout(() => {
							this.shareClass = 'none';
						}, 150);

					}, 600)

				});
			},
			codeImg(gid) {
				var bb = gid;
				//console.log(this.Userinfo.HeadPortrait);
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
						data: {
							req: 'GetAccessToken_new',
							longurl: bb + '_' + this.Account + '_2',
							UserImg: this.Userinfo.HeadPortrait
						},
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success: function(res) {
							var src2 = res.data.pic;
							resolve(res.data);

						}
					});

				})

			},
			init(i, t, u) {
				uni.showLoading({
					title: "加载中。。。"
				})
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QueryGoodsDetail',
						gGuid: i,
						types: t,
						unionid: u
					},
					success: result => {
						uni.hideLoading();
						if (result.data.ResultType == false) {
							uni.showToast({
								icon: 'none',
								title: "产品不存在!"
							});
							return;
						}

						if (t == "0") {
							this.tjaccount = result.data.tjaccount;
							this.tjGoodsSource = result.data.tjGoodsSource;
							this.newaccount = result.data.newaccount;
						}
						
						var IsGroup =result.data.GroupActive;
						if (IsGroup != '') {
							this.IsGroupActive = 1;
							this.GroupActive = IsGroup[0];
							this.IsAdvanceSale = IsGroup[0].isyushou == "0" ? false : true;
							if (IsGroup[0].GroupCount <= IsGroup[0].OkGroupCount || IsGroup[0].ISSuccess == "1" || IsGroup[0].ISSuccess ==
								"2") {
								this.FinishGroupActive = 1;
							}

						}

						this.evalcounts = result.data.evalcounts;
						let list = JSON.stringify(result.data.goodsInfo);
						var MainImlist = result.data.goodsInfo[0].ImagePath;
						this.Goldimg = MainImlist.split(',')[0];
						var mains = MainImlist.split(',');
						mains.forEach(item => {
							if (item != "") {
								var ll = {
									src: "https://www.chinaaos.com" + item
								};
								this.imgList.push(ll);
							}
						});
						this.shopGuids = result.data.goodsInfo[0].ShopId;
						this.QueryShopInfo(result.data.goodsInfo[0].ShopId);
						this.gbeginimg = this.imgList[0].src;
						this.gguid = result.data.goodsInfo[0].Guid;
						this.gname = result.data.goodsInfo[0].ProductName;
						this.gdesc = result.data.goodsInfo[0].ShortDescription;
						this.gnowprice = result.data.goodsInfo[0].SalePrice;
						this.gnowprice2 = result.data.goodsInfo[0].SalePrice;
						this.savemoney = ((parseFloat(result.data.goodsInfo[0].SalePrice) - parseFloat(result.data.goodsInfo[0].SetTlementPrice)) *
							0.4).toFixed(2);
						this.xiaoliang = result.data.goodsInfo[0].SaleCounts;

						const nodes = htmlParser(result.data.goodsInfo[0].Contents);
						this.desc = parseImgs(nodes)

						if (result.data.goodsInfo[0].AfterSalesDes == "" || result.data.goodsInfo[0].AfterSalesDes == null) {
							this.AfterSalesDes = "无";
						} else {
							var SalesDeslist = result.data.goodsInfo[0].AfterSalesDes;
							var Descs = SalesDeslist.split('；');
							Descs.forEach(item => {
								if (item != "") {
									this.SalesDeslist.push(item);
								}
							});
						}

						if (result.data.goodsInfo[0].MarketPrice != "" && result.data.goodsInfo[0].MarketPrice != null) {
							this.goldprice = result.data.goodsInfo[0].MarketPrice;
						} else {
							this.pricedisplay = "none";
						}

						if (result.data.goodsInfo[0].Stock == "" || result.data.goodsInfo[0].Stock == null) {
							this.gkucun = 0;
						} else {
							this.gkucun = result.data.goodsInfo[0].Stock;
						}

						if ((result.data.goodsInfo[0].IsQuickRefund == 0 || result.data.goodsInfo[0].IsQuickRefund == null) && (result
								.data.goodsInfo[0].IsFreeShipping == 0 || result.data.goodsInfo[0].IsFreeShipping == null) && (result.data.goodsInfo[
								0].IsRefund == 0 || result.data.goodsInfo[0].IsRefund == null) && (result.data.goodsInfo[0].IsDelivery == 0 ||
								result.data.goodsInfo[0].IsDelivery == null) && (result.data.goodsInfo[0].IsCompensate == 0 || result.data.goodsInfo[
								0].IsCompensate == null)) {
							this.isInfonull = "none";
						} else {
							this.isInfonull = "block";
							if (result.data.goodsInfo[0].IsQuickRefund == "1") {
								this.IsQuickRefund = "极速退款";
							}

							if (result.data.goodsInfo[0].IsFreeShipping == "1") {
								this.IsFreeShipping = "全场包邮";
							}

							if (result.data.goodsInfo[0].IsRefund == "1") {
								this.IsRefund = " 7天退换";
							}

							if (result.data.goodsInfo[0].IsDelivery == "1") {
								this.IsDelivery = " 48小时发货";
							}

							if (result.data.goodsInfo[0].IsCompensate == "1") {
								this.IsCompensate = " 假一赔四";
							}
						}
						this.specList = result.data.specList;
						this.specChildList = result.data.specChildList;
						if (this.specChildList.length == 1) {
							this.haslength = false;
							this.isGuigenull = "block";
							this.skuId = this.specChildList[0].Guid;
							if (this.specChildList[0].name == null || this.specChildList[0].name == "" || this.specChildList[0].name ==
								undefined) {
								this.GuigeNameOne = "";
							} else {
								this.GuigeNameOne = this.specChildList[0].name;
							}
						} else if (this.specChildList.length < 1) {
							this.isGuigenull = "none";
							this.GuigeNameOne = "notGuige";
							this.skuId = "";
						} else {
							this.isGuigenull = "block";
						}
						console.log(this.skuId);
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			},
			QueryShopInfo(i) {
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QuerySomeOneShop',
						sgid: i
					},
					success: result => {
						if (result.data.ResultType) {
							this.dianpuTX = "https://www.chinaaos.com" + result.data.ShopInfo[0].Logo;
							this.dianpuMC = result.data.ShopInfo[0].ShopName;
							this.IsInvoice = result.data.ShopInfo[0].IsInvoice;
							result.data.ShopGoodsimg.forEach(item => {
								item.ImagePath = 'https://www.chinaaos.com' + item.ImagePath.split(',')[0];
								item.Para1 = ((parseFloat(item.SalePrice) - parseFloat(item.SetTlementPrice)) * 0.4).toFixed(2);
							});
							this.ShopGoodsimgList = this.ShopGoodsimgList.concat(result.data.ShopGoodsimg);
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
			GoShop() {
				uni.navigateTo({
					url: '/pages/Shop/ShopMain?guids=' + this.shopGuids
				});
			},
			//规格弹窗开关
			toggleSpec() {
				this.CheckedfinishType == "";
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//选择规格完成
			Checkedfinish(id) {
				console.log(id + "__" + this.CheckedfinishType)
				if (this.CheckedfinishType == "") {
					this.toggleSpec();
				} else if (this.CheckedfinishType == "buy") {
					this.BuyNow(id);					
					// this.formSubmit();
				} else if (this.CheckedfinishType == "cart") {
					this.addcar(id);
				}
			},
			//选择规格
			selectSpec(index, pid) {
				let list = this.specChildList;
				list.forEach(item => {
					if (item.pid === pid) {
						this.$set(item, 'selected', false);
					}
				});
				this.$set(list[index], 'selected', true);
				//存储已选择
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
					}
				});
				this.GuigeNameOne = this.specSelected[0].name;
				if (this.specSelected.length <= 1) {
					this.GuigeNameTwo = "";
				} else {
					this.GuigeNameTwo = this.specSelected[1].name;
				}

				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'ChangeGuigeByPrice',
						gGuid: this.gguid,
						GuigeNameOne: this.GuigeNameOne,
						GuigeNameTwo: this.GuigeNameTwo
					},
					success: result => {
						if (result.data.Guigeinfo.length > 0) {
							this.gnowprice2 = result.data.Guigeinfo[0].SalePrice;
							this.gkucun = result.data.Guigeinfo[0].Stock;
							this.skuId = result.data.Guigeinfo[0].Guid;
							console.log(this.skuId);
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
			//收藏
			AddFavorite(v) {
				if (this.newaccount == "1" && (uni.getStorageSync('Account') == "" || uni.getStorageSync('Account') == undefined)) {
					
					uni.navigateTo({
						url: '/pages/LoginPhone?scene='+this.tjaccount
					});
					return false;
				}
				if (uni.getStorageSync('Account') == "" || uni.getStorageSync('Account') == undefined) {
					uni.navigateTo({
						url: '/pages/LoginWChat'
					});
					return false;
				}
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'AddFavorite',
						GGuid: v,
						account: uni.getStorageSync('Account')
					},
					success: result => {
						uni.showToast({
							icon: "none",
							title: result.data.Msg
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
			stopPrevent() {},
			//返回上一页
			back() {
				uni.navigateBack();
			},
			share() {
				var imgUrl = "";
				var oldimg = this.Goldimg;
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'WXShareImg',
						imgPath: this.Goldimg,
						saleprice: this.gnowprice,
						Marketprice: this.goldprice,
					},
					success: res => {
						if (res.data.resultType) {
							imgUrl = res.data.resUrl
							this.imgUrl = imgUrl;
						}
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});

				this.shareClass = 'show';

			},
			hideShare() {
				this.shareClass = 'hide';
				setTimeout(() => {
					this.shareClass = 'none';
				}, 150);


			},
			joinCart() {
				// 跳转购物车

				if (this.newaccount == "1" && (uni.getStorageSync('Account') == "" || uni.getStorageSync('Account') == undefined)) {
					
					uni.navigateTo({
						url: '/pages/LoginPhone?scene='+this.tjaccount
					});
					return false;
				}
				if (uni.getStorageSync('Account') == "" || uni.getStorageSync('Account') == undefined) {
					uni.navigateTo({
						url: '/pages/LoginWChat'
					});
					return false;

				}


				return uni.navigateTo({
					url: '/pages/cart/cart'
				});

			},
			toAnchor(index) {
				//跳转锚点
				this.selectAnchor = index;
				uni.pageScrollTo({
					scrollTop: this.anchorlist[index].top,
					duration: 200
				});
			},
			calcAnchor() {
				//计算锚点高度
				this.anchorlist = [{
						name: '主图',
						top: 0
					},
					{
						name: '店铺',
						top: 0
					},
					{
						name: '详情',
						top: 0
					}
				];
				let commentsView = uni.createSelectorQuery().select('#comments');
				commentsView.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
					statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(100);
					this.anchorlist[1].top = data.top - headerHeight - statusbarHeight;
					this.anchorlist[2].top = data.bottom - headerHeight - statusbarHeight;
				}).exec();
			},
			BuyNow(id) {
				
				if (this.newaccount == "1" && (uni.getStorageSync('Account') == "" || uni.getStorageSync('Account') == undefined)) {
					uni.navigateTo({
						url: '/pages/LoginPhone?scene='+this.tjaccount
					});
					return false;
				}
				if (uni.getStorageSync('Account') == "" || uni.getStorageSync('Account') == undefined) {
					uni.navigateTo({
						url: '/pages/LoginWChat'
					});
					return false;
				}

				if (this.IsAdvanceSale == true && this.IsGroupActive == 1) {
					uni.showToast({
						icon: "none",
						title: "预售还未开始！"
					});
					return false;
				}
				//#ifdef MP-WEIXIN
				if (this.IsGroupActive == 1) {
					wx.requestSubscribeMessage({
						tmplIds: ['BzvYsoi24IgI0mlk6nxtacgg0rEVcyLPpLe0hgQEkfc', 'bXxlIwM_9A9vyGBL960ezC9_9Jyxiwl-iW2b5LORNhs',
							'KK6mbED3QReHw660Hbi3rCqq9vPKb-YU7cu8ykPBmrM'
						],
						success(res) {
							console.log("success:" + res);
						},
						fail(res) {
							console.log("fail:" + res);
						},
						complete(res) {
							console.log("complete:" + res);
						}
					})
				
				} else {
					wx.requestSubscribeMessage({
						tmplIds: ['BzvYsoi24IgI0mlk6nxtacgg0rEVcyLPpLe0hgQEkfc', 'zVDl0hk0t2XClX9n_r_oiwGPovtUrTsbr1xElD-FJ8Y',
							'JTJgFWhvsFuCMLNaU5FSdf7bdQBQZGmBcqp2TeA5Ing'
						],
						success(res) {
							console.log("success:" + res);
						},
						fail(res) {
							console.log("fail:" + res);
						},
						complete(res) {
							console.log("complete:" + res);
						}
					})
				}
				
				//#endif
				var Spec = "";
				var Speclistss = [];
				var specSelected = this.specSelected;
				let list = JSON.stringify(specSelected);
				Speclistss = JSON.parse(list);
				Speclistss.forEach(item => {
					Spec += item.name + " ";
				});
				var thisSpec = Spec;
				if ((thisSpec == "" || thisSpec == null) && (this.GuigeNameOne == "" || this.GuigeNameOne == null)) {
					if (this.specClass === 'show') {
						this.specClass = 'hide';
						setTimeout(() => {
							this.specClass = 'none';
						}, 250);
					} else if (this.specClass === 'none') {
						this.specClass = 'show';
						this.CheckedfinishType = "buy";
					}
					return
				}
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QueryGoodsStorck',
						thisSpec: thisSpec,
						gGuid: id
					},
					success: result => {
						if (result.data.Stock > 0) {
							console.log("IsGroupActive:" + this.IsGroupActive);
							uni.navigateTo({
								url: '/pages/Order/OrderBySomeOne?GGuid=' + id + '&SGuid=' + this.skuId + '&shopid=' + this.shopGuids +
									'&tjaccount=' + this.tjaccount + '&tjGoodsSource=' + this.tjGoodsSource + '&IsGroupActive=' + this.IsGroupActive
							});
							this.specClass = 'none';
						} else {
							uni.showToast({
								icon: 'none',
								title: "库存不足"
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
			// 			this.BuyNow(this.gguid);
			// 		},
			// 		fail: e => {
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: e.errMsg
			// 			});
			// 		}
			// 	});
			// },
			addcar(id) {
				//#ifdef MP-WEIXIN
				wx.requestSubscribeMessage({
					tmplIds: ['zVDl0hk0t2XClX9n_r_oiwGPovtUrTsbr1xElD-FJ8Y', 'JTJgFWhvsFuCMLNaU5FSdf7bdQBQZGmBcqp2TeA5Ing',
						'BzvYsoi24IgI0mlk6nxtacgg0rEVcyLPpLe0hgQEkfc'
					],
					success(res) {
						console.log("success:" + res);
					},
					fail(res) {
						console.log("fail:" + res);
					},
					complete(res) {
						console.log("complete:" + res);
					}
				});
				//#endif
				if (this.newaccount == "1" && (uni.getStorageSync('Account') == "" || uni.getStorageSync('Account') == undefined)) {
					uni.navigateTo({
						url: '/pages/LoginPhone?scene='+this.tjaccount
					});
					return false;
				}
				if (uni.getStorageSync('Account') == "" || uni.getStorageSync('Account') == undefined) {
					uni.navigateTo({
						url: '/pages/LoginWChat'
					});
					return false;

				}

				var Spec = "";
				var Speclistss = [];
				var specSelected = this.specSelected;
				let list = JSON.stringify(specSelected);
				Speclistss = JSON.parse(list);
				Speclistss.forEach(item => {
					Spec += item.name + " ";
				});
				var thisSpec = Spec;
				if ((thisSpec == "" || thisSpec == null) && (this.GuigeNameOne == "" || this.GuigeNameOne == null)) {
					if (this.specClass === 'show') {
						this.specClass = 'hide';
						setTimeout(() => {
							this.specClass = 'none';
						}, 250);
					} else if (this.specClass === 'none') {
						this.specClass = 'show';
						this.CheckedfinishType = "cart";
					}
					return
				}

				console.log(thisSpec);
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'QueryGoodsStorck',
						thisSpec: thisSpec,
						gGuid: id
					},
					success: result => {
						if (result.data.Stock > 0) {

							uni.request({
								url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
								data: {
									req: 'AddCar',
									GGuid: id,
									account: uni.getStorageSync('Account'),
									gnums: 1,
									Spec: thisSpec,
									gprices: this.gnowprice2,
									SKUGuid: this.skuId,
									tjaccount: this.tjaccount,
									tjGoodsSource: this.tjGoodsSource,
									ShopGuid: this.shopGuids,
									ShopName: this.dianpuMC,
									ShopHeadImg: this.dianpuTX,
									ShopIsInvoice: this.IsInvoice
								},
								success: result => {
									uni.showToast({
										icon: "none",
										title: '已加入购物车'
									});
									this.specClass = 'none';
								},
								fail: e => {
									uni.showToast({
										icon: 'none',
										title: e.errMsg
									});
								}
							});

						} else {
							uni.showToast({
								icon: 'none',
								title: "库存不足"
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
			async shareByFriend() {
				var info = "¥" + this.gnowprice + "  " + this.gname;
				//小程序
				uni.share({
					provider: 'weixin',
					scene: 'WXSceneSession',
					type: 5,
					imageUrl: this.imgUrl,
					title: info,
					miniProgram: {
						id: 'gh_76b9b84bfd03',
						path: "pages/Product/ProductDetail?gid=" + this.gguid + "&tjaccount=" + this.Account +
							"&tjGoodsSource=2",
						type: 0,
						webUrl: 'https://www.chinaaos.com'
					},
					success: ret => {
						console.log(JSON.stringify(ret));
					},
					fail(e) {
						console.log(e.message);
					}
				});
			},
			async shareByCircle(shareType) {
				var types = shareType;
				if (types == 'pyq') {
					uni.share({
						provider: "weixin",
						scene: "WXSenceTimeline",
						type: 0,
						href: "http://jxsc.chinaaos.com/#/pages/Product/ProductDetail?gid=" + this.gguid, //"https://www.chinaaos.com/Modules/App/Product/GoodsDetail.html?gguid=" + this.gguid,
						//title: this.gname//"竞享商城分享",
						summary: this.gname,
						imageUrl: this.gbeginimg,
						success: function(res) {
							uni.showToast({
								title: "分享成功"
							});
						},
						fail: function(err) {
							console.log("fail:" + JSON.stringify(err));
						}
					});
				}
			},
			changeMsgPage() {
				uni.navigateTo({
					url: "/pages/Msg/chat?name=客服008"
				})
			},
			//详情
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.Guid;
				console.log(id)
				uni.navigateTo({
					url: '/pages/Product/ProductDetail?gid=' + id
				});
			},
			discard() {}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
		padding-bottom: 160upx;
	}

	@keyframes showPopup {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	@keyframes hidePopup {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	@keyframes showLayer {
		0% {
			transform: translateY(0);
		}

		100% {
			transform: translateY(-100%);
		}
	}

	@keyframes hideLayer {
		0% {
			transform: translateY(-100%);
		}

		100% {
			transform: translateY(0);
		}
	}

	@font-face {
		font-family: 'HMfont-home';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}

	.icon {
		font-family: 'HMfont-home' !important;
		font-size: 26upx;
		font-style: normal;

		&.fenxiang {
			&:before {
				content: '\e642';
			}
		}

		&.xiangqian {
			&:before {
				content: '\e634';
			}
		}

		&.xiangyou {
			&:before {
				content: '\e637';
			}
		}

		&.shoucangsel {
			&:before {
				content: '\e62c';
			}
		}

		&.shoucang {
			&:before {
				content: '\e62e';
			}
		}

		&.tongzhi {
			&:before {
				content: '\e729';
			}
		}

		&.kefu {
			&:before {
				content: '\e61e';
			}
		}

		&.cart {
			&:before {
				content: '\e614';
			}
		}

		&.jia {
			&:before {
				content: '\e641';
			}
		}

		&.jian {
			&:before {
				content: '\e643';
			}
		}
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
		background-color: #fff;
	}

	.header {
		width: 100%;
		background-color: initial;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);

		/*  #endif  */
		.before,
		.after {
			width: 92%;
			padding: 0 4%;
			height: 100upx;
			display: flex;
			align-items: center;
			position: fixed;
			top: 0;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);
			/*  #endif  */

			.back {
				width: 125upx;
				height: 60upx;
				flex-shrink: 0;

				.icon {
					margin-left: -10%;
					width: 60upx;
					height: 60upx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 42upx;
				}
			}

			.middle {
				width: 100%;
			}

			.icon-btn {
				width: 125upx;
				height: 60upx;
				flex-shrink: 0;
				display: flex;

				.icon {
					&:first-child {
						margin-right: 5upx;
					}

					width: 60upx;
					height: 60upx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 42upx;
				}
			}
		}

		.before {
			.back {
				.icon {
					color: #fff;
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 100%;
				}
			}

			.icon-btn {
				.icon {
					color: #fff;
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 100%;
				}
			}
		}

		.after {
			background-color: #fff;

			.back {
				.icon {
					color: #666;
				}
			}

			.icon-btn {
				.icon {
					color: #666;
				}
			}

			.middle {
				font-size: 32upx;
				height: 90upx;
				display: flex;
				justify-content: center;
				align-items: center;

				view {
					padding: 0 3%;
					margin: 0 3%;
					display: flex;
					justify-content: center;
					align-items: center;

					&.on {
						margin-bottom: -4upx;
						color: #f47952;
						border-bottom: solid 4upx #e4e7ed;
					}
				}
			}
		}
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 0 10upx 30upx;

		.title {
			font-size: 32upx;
			color: black;
			height: 50upx;
			line-height: 50upx;
		}

		.somedesc {
			font-size: 28upx;
			color: #747474;
			// height: 20px;
			line-height: 20px;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: red;
		}

		.price {
			font-size: 16px;
			color: red;
		}

		.m-price {
			margin: 0 12upx;
			color: #747474;
			text-decoration: line-through;
			line-height: 30px;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: #f47952;
			font-size: 14px;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: 14px;
			color: #747474;

			text {
				flex: 1;
			}
		}
	}

	/* 分享 */
	.share {
		display: none;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.15s linear both;
			}

			.layer {
				animation: showLayer 0.15s linear both;
			}
		}

		&.hide {
			display: block;

			.mask {
				animation: hidePopup 0.15s linear both;
			}

			.layer {
				animation: hideLayer 0.15s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			background-color: rgba(0, 0, 0, .5);
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			z-index: 11;
		}

		.layer {
			width: 92%;
			position: fixed;
			z-index: 12;
			padding: 0 4%;
			bottom: 0;
			background-color: rgba(255, 255, 255, 0.9);

			.list {
				width: 100%;
				display: flex;
				padding: 6upx 0 20upx 0;

				.box {
					width: 25%;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;

					image {
						width: 13.8vw;
						height: 13.8vw;
					}

					.title {
						margin-top: 10upx;
						display: flex;
						justify-content: center;
						width: 100%;
						font-size: 26upx;
					}
				}
			}

			.btn {
				width: 100%;
				height: 100upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28upx;

			}

			.h1 {
				width: 100%;
				height: 80upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 34upx;
			}
		}
	}

	.c-list {
		font-size: 14px;
		color: #747474;
		background: #fff;

		.c-row {
			width: 100%;
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
			border-bottom: 1upx solid #f5f5f5;
		}

		.tit {
			width: 140upx;
		}

		.con {
			color: red;
			display: inline-block;
			vertical-align: middle;
			margin-left: 16px;
			padding-bottom: 1px;

			.selected-text {
				margin-right: 10upx;
				float: left;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: 14px;
			color: #747474;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: #747474;
			line-height: 24px;
		}

		.red {
			color: red;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: 14px;
			color: #747474;

			.tit {
				font-size: 14px;
				color: #747474;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 14px;
			color: #747474;
			padding-left: 26upx;

			.con {
				font-size: 14px;
				color: #747474;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #ddd;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;

		image {

			width: 100%;
		}

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: 14px;
			color: #747474;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}

		.descTuwen {}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: 14px;
				color: #747474;
				line-height: 42upx;

				.price {
					font-size: 16px;
					color: red;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: 14px;
			color: #747474;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: 14px;
				color: #747474;
			}

			.selected {
				background: #fbebee;
				color: #747474;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 36px;
				line-height: 36px;
				border-radius: 55px;
				background: #fa436a;
				font-size: 16px;
				color: #fff;
				margin: 16px auto 11px;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 0upx;
		bottom: 0upx;
		z-index: 8;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100upx;
		background: #fff;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			color: #747474;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: #747474;
			}

			&.active,
			&.active .yticon {
				color: #747474;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}


		.actiongroup2 {
			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, 0.5);
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
			margin-left: 20upx;
			position: relative;

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: 14px;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}

	.buyDetial {
		.buyDtitlle {
			display: inline-block;

			.buyDimg {
				width: 24px;
				height: 24px;
				float: left;
			}

			.DtitlleTitlle {
				float: left;
				font-size: 13px;
			}
		}

		.buyDInfo {
			font-size: 12px;
			color: #747474;
			margin-bottom: 20px;
		}
	}

	.flex-item {
		width: 33.3%;
		height: 24px;
		text-align: center;
		line-height: 24px;
		color: #747474;
		// display: -webkit-inline-box;
	}

	.flex-item-V {
		width: 100%;
		height: 24px;
		text-align: center;
		line-height: 24px;
	}

	.spec {
		font-size: 20upx;
		background-color: #f3f3f3;
		color: #F76260;
		height: 14px;
		width: 14px;
		display: flex;
		align-items: center;
		// margin: 14upx 10upx;
		border-radius: 50%;
		line-height: 18px;
		vertical-align: middle;
		position: relative;


		p {
			font-size: 10px;
		}
	}

	.spec2 {
		font-size: 20upx;
		background-color: #f3f3f3;
		color: #F76260;
		height: 14px;
		width: 14px;
		display: flex;
		align-items: center;
		margin: 14upx 10upx;
		border-radius: 50%;
		line-height: 18px;
		vertical-align: middle;
		position: relative;
		float: right;

		p {
			font-size: 10px;
		}
	}


	button:after {
		border: 0;
	}

	.button-hover[type=primary] {
		color: #fff;
		background-color: #fff;

	}


	.container999 {
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.shopcontent {

		.carousel {
			height: 220px !important;
			width: 100%;
		}

		.floor-item {
			width: 180px !important;
			height: 220px !important;
			margin-right: 12px;
		}

		.scoll-wrapper {
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-align: start;
			-webkit-align-items: flex-start;
			-ms-flex-align: start;
			align-items: flex-start;
			height: 220px;
		}

		.scoll-wrapper .floor-item .price {
			float: left;
			color: red;
		}

		.scoll-wrapper .title.clamp {
			float: left;
			width: 140px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	/* 提示窗口 */
	.uni-tip {
		padding: 15px;
		width: 300px;
		background: #fff;
		box-sizing: border-box;
		border-radius: 10px;
	}

	.uni-tip-title {
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}

	.uni-tip-content {
		padding: 15px;
		font-size: 14px;
		color: #666;
		text-align: center;
	}

	.uni-tip-group-button {
		margin-top: 10px;
		display: flex;
	}

	.uni-tip-button {
		width: 100%;
		text-align: center;
		font-size: 14px;
		color: #3b4144;
	}
</style>
