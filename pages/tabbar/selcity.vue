<template>
	<view class="content">
		<uni-select :listData="listData" :quickPanelData="quickPanelData" @chooseItem="chooseItem"></uni-select>
	</view>
</template>

<script>
	import city from '../../common/city.js'
	import uniSelect from '../../components/lee-select/lee-select.vue'
	export default {
		components:{
			uniSelect
		},
		data() {
			return {
				listData: city,
				quickPanelData:[
					{
					title:'当前城市',
					navName: '当前',
					data:['上海'],
					height: 150
				},
				{
					title:'热门城市',
					navName: '热',
					data:['上海','北京','成都','昆明','西安'],
					height: 224
				}
				]
				
			}
		},
		methods: {
			chooseItem(item) {
				console.log(item)
			}
		},
		onLoad() {

		}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
	}
</style>
