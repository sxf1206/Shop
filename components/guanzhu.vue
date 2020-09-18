<template>
	<view >
		<view id="vm" class="pubu" v-cloak>
			<ul id="show" class="yg yg_l">
				<li v-for="(item,index) in gzdata" :key="index" v-if="index%2==0">
					<view style="position: relative;"   @click="navToDiaryDetailPage(item)">
						<image  style="width: 100%;border-radius: 8px 8px 0 0;"  :src="item.ImgList"  mode="widthFix"></image>
					</view>
					<p>{{item.Title}}</p>
					<view class="u_xinx" >
						<img :src="item.Photo" alt="">
						<span>{{item.UserName}}</span>
						<span style="float: right;top: -1px;">{{item.LikedNumber}}</span>
						<img :src="item.islike===0?'https://www.chinaaos.com/static/guanzhu.png':'/static/guanzhuactive.png'" style="width: 19px;height: 17px;margin-top: 2px;float: right;border-radius:0;"
						 mode="widthFix"  @tap="like(index)">
					</view>
				</li>
			</ul>
			<ul class="yg yg_r">
				<li v-for="(item,index) in gzdata" :key="index" v-if="index%2==1">
					<view style="position: relative;"  @click="navToDiaryDetailPage(item)">
						<image  style="width: 100%;border-radius: 8px 8px 0 0;"  :src="item.ImgList"  mode="widthFix"></image>
					</view>
					<p>{{item.Title}}</p>
					<view class="u_xinx" >
						<img :src="item.Photo" alt="">
						<span>{{item.UserName}}</span>
						<span style="float: right;top: -1px;">{{item.LikedNumber}}</span>
						<img :src="item.islike===0?'https://www.chinaaos.com/static/guanzhu.png':'/static/guanzhuactive.png'" style="width: 19px;height: 17px;margin-top: 2px;float: right;border-radius:0;"
						 mode="widthFix"  @tap="like(index)">
					</view>

					
				</li>
			</ul>
			<view style="clear: both;"></view>
		</view>



	</view>

</template>

<script>
	import {
			mapState
		} from 'vuex'
	export default {		
		name: 'tabguanzhu',
		props: {
			gzdata: {
				type: Array,
				default: function(e) {
					return {}
				}
			},
			tabCur: {
				type: Number,
				default () {
					return 0;
				}
			},
		},
		computed: {
			...mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo', 'VIPType', 'IsShow']),
			isImgRight() {
				return 2;//this.Mediadata.article_type === 2
			},
			isImgLeft() {
				return 1;//this.Mediadata.article_type === 1
			},
			showImg() {
				return '';//this.Mediadata.image_list || this.Mediadata.image_url
			}
		},
		methods: {
			addCustomer(){
				uni.navigateTo({
					url: '/pages/AddDiary/AddDiary'
				});
			},
			close(e) {
				this.$emit('close');
			},
			bindClick() {
				this.$emit('click');
			},
			like(index) {				
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/LoginWChat'
					});
					return;
				}
				
				var guids=this.gzdata[index].Guid;
				if (this.gzdata[index].islike === 0) {
					this.gzdata[index].islike = 1;
					this.gzdata[index].LikedNumber =this.gzdata[index].LikedNumber+ 1;
					
				} else {
					this.gzdata[index].islike = 0;
					this.gzdata[index].LikedNumber =this.gzdata[index].LikedNumber-1;
				}				
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					method: 'GET',
					data: {
						req: 'SetLike',
						account: this.Account,
						dguid: guids
					},
					success: res => {												
						
					},
					complete: res => {
						//uni.hideLoading();
						//uni.stopPullDownRefresh();
					}
				});
				
			},
			navToDiaryDetailPage(item) {				
				let id = item.Guid;
				uni.navigateTo({
					url: '/pages/DiarysDetail/DiarysDetail?dguid=' + id
				});
			},
		}
	}
</script>




<!--css样式-->
<style >
  /* [v-cloak]{
    display: none!important;
  }
  *{	
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
  // body{
  //   width: 95%;
  //   margin: 10px auto;
  // }
  
  
  
  
  
  .pubu {
  	width: calc(100% - 16px);
  	margin-left: 8px;
  	padding-top: 16upx;
  }
  
  .yg img {
  	width: 100%;
  	border-radius: 8px 8px 0 0;
  }
  
  .yg p {
  	line-height: 44upx;
  	font-size: 26upx;
  	padding: 0 5px 5px;
  	overflow: hidden;
  	text-overflow: ellipsis;
  	white-space: nowrap;
  	text-overflow: ellipsis;
  	display: -webkit-box;
  	-webkit-line-clamp: 2;
  	-webkit-box-orient: vertical;
  	overflow: hidden;
  	color: #333333;
  }
  
  .yg_l,
  .yg_r {
  	width: calc(50% - 5px);
  }
  
  .yg li {
  	background: #fff;
  	margin-bottom: 10px;
  	border-radius: 8px;
  }
  
  .yg_l {
  	float: left;
  }
  
  .yg_r {
  	float: right;
  }
  
  .u_xinx {
  	margin: 4px 0;
  }
  
  .u_xinx img {
  	width: 24px;
  	height: 24px;
  	border-radius: 50%;
  	display: inline-block;
  } 
  
  .u_xinx span {
  	position: relative;
  	top: -8px;
  	color: #333333;
  	font-size: 24upx;
  	margin-left: 10upx;
  } 
 
  
  .btn-plusempty{
  	width: 100upx;
  	height: 100upx;
  	background: rgb(255, 102, 0);
  	position: fixed;
	z-index: 10;
  	bottom: 50upx;
  	right: 20upx;
  	border-radius: 100%;
  	overflow: hidden;
  	text-align: center;
  	line-height: 110upx;
  }
  
  .plusempty-img{
  	width: 50upx;
  	height: 50upx;
  	margin-top: 30upx;
  }
  .bottom-btn-hover{
  	background: #0564c7!important;;
  } */
  
</style>
