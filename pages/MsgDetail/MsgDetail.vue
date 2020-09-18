<template>
	<view>
		
		<view class="detail-desc">
			<view class="d-header"><text>{{Name}}</text></view>
			<rich-text :nodes="Container" class="descTuwen"></rich-text>		
		
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Name: '',
				Container: ''
			};
		},
		onLoad(option) {
			var gid = option.gid;			
			
			this.init(gid);
		},
		onReady() {
			
		},		
		methods: {
			init(i) {
				
				uni.request({
					url: 'https://www.chinaaos.com/Handler/APPHandler.ashx',
					data: {
						req: 'GetNewDetail',
						gGuid: i
					},
					success: result => {						
						this.Name=result.data[0]["Name"];
						this.Container = result.data[0]["Container"].replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
						
					},
					fail: e => {
						uni.showToast({
							icon: 'none',
							title: e.errMsg
						});
					}
				});
			}
		
		}
	
	}

</script>

<style>
/*  详情 */
	.detail-desc {		
		margin: 20upx;
	}
	.detail-desc img {		
		width: 100%;
	}

</style>
