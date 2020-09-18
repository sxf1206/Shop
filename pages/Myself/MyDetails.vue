<template>
	<view>	
		<view class="list">
			<view class="li">
				<view class="text">头像</view>
				<view class="icon" style="text-align: right;line-height: 4.3">
					<image :src="headimg"></image>
				</view>				
			</view>
		</view>
		<view class="list" v-for="(list, list_i) in severList" :key="list_i">
			<view class="li"    v-for="(li, li_i) in list"  	@tap="toPage(list_i, li_i)"
				v-bind:class="{ noborder: li_i == list.length - 1 }"
				hover-class="hover"
				:key="li.name"
			>
				<view class="text">{{ li.name }}</view>
				<view style="text-align: right;font-size: 13px;width:100%;line-height: 3.5;">{{ li.content }}</view>				
			</view>
		</view>
	</view>
</template>


<script>
	import aa from'../../components/qrcode/qrcode.vue'
	var uname;
var Account;
var Uguid;
	import {
		mapState
	} from 'vuex'

export default {
    computed:mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo']),
	data() {
		return {
			headimg:'',
			showClearIcon: false,
			headerPosition: 'fixed',
			//#ifdef APP-PLUS
			isH5Plus: true,
			//#endif
			//#ifndef APP-PLUS
			isH5Plus: false,
			//#endif
			userinfo: {},
			severList: [
				[
					{ name: '昵称', icon: '',content:'',toimg:'' },
					{ name: '生日', icon: '',content:'',toimg:'' },
				]
			],
		};
	},
	onLoad(option) {
		this.init();
	},
	methods:{
		//点击列表
			toPage(list_i, li_i) {
			uni.showToast({ title: this.severList[list_i][li_i].name });		
		},
		init() {
			uni.request({
				url: 'https://www.chinaaos.com/Handler/LoginsHandler.ashx',
				data: {
					req: 'GetSelfInfo',
					account: uni.getStorageSync('Account'),
				},
				success: result => {
					this.headimg=result.data.ListInfo[0].Photo;
					this.severList[0][0].content=result.data.ListInfo[0].UserName;
					this.severList[0][1].content=result.data.ListInfo[0].BirthDay.split("T")[0] ;
					// this.severList[0][1].content=result.data.ListInfo[0].Phonenumber;
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
};
</script>

<style lang="scss">
page {
	background-color: #fafafa;
}
.hover {
	background-color: #eee;
}


.list {
	width: 100%;
	.li {
		width: 92%;
		height: 100upx;
		padding: 0 4%;
		border-bottom: solid 1upx #e7e7e7;
		display: flex;
		align-items: left;
		background-color: white;
		&.noborder {
			border-bottom: 0;
		}
		.icon {
			flex-shrink: 0;
			width: 50upx;
			height: 50upx;
			image {
				width: 50upx;
				height: 50upx;
			}
		}
		.text {
			text-align: left;
			width: 100%;
			color: #666;
			font-size: 15px;
			line-height: 3.5;

		}
		.to {
			flex-shrink: 0;
			width: 40upx;
			height: 40upx;
		}
	}
}
.add-address {
	background: #ff570a;
	text-align: center;
	width: 100%;
	height: 99rpx;
	line-height: 99rpx;
	position: fixed;
	border-radius: 0;
	border: none;
	color: #fff;
	font-size: 29rpx;
	bottom: 0;
	left: 0;
}
</style>
