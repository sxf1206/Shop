<template>
	<view>		
	
		<UpLeveVIP v-if="VIPType=='0' ||  VIPType=='' "></UpLeveVIP> 
		<vip v-if="VIPType!='0'  && VIPType!=''"></vip> 
		
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	
	export default {
		computed:mapState(['forcedLogin', 'hasLogin', 'Account', 'Userinfo','UserProfit','VIPType']),
		data() {
		return {
				PageCur: ''
			}
		},
		onLoad(){
			console.log("klklk:"+this.VIPType);
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	
</style>
