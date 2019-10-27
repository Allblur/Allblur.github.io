<template>
	<div class="app">
		<h1>this is demo page</h1>
		 <div class="block">
			<span class="demonstration">默认</span>
			<el-date-picker
				v-model="value4"
				type="datetimerange"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期">
			</el-date-picker>
		</div>
		<div style="margin-top: 30px">
			<hot-table :settings="hotSettings" :colHeaders="colHeaders" width="600" height="300" licenseKey="non-commercial-and-evaluation"></hot-table>
			<!-- <hot-table :data="data" rowHeaders="true" colHeaders="true"></hot-table> -->
		</div>
	</div>
</template>
<script>
	import { HotTable } from '@handsontable/vue';
	import Handsontable from 'handsontable';

	export default{
		name: 'demoPage',
		props: ['route'],
		data() {
			return {
				value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
				colHeaders: ['A', 'B'],
				hotSettings: {
        			data: [
        				['A1', 'http://ecx.images-amazon.com/images/I/51bRhyVTVGL._SL50_.jpg'],
            			['A2', 'http://ecx.images-amazon.com/images/I/51gdVAEfPUL._SL50_.jpg']
        			],
        			columns: [
        				{},
        				{
        					renderer: function(instance, td, row, col, prop, value, cellProperties) {
        						Handsontable.renderers.TextRenderer.apply(this, arguments);
        						// console.log("instance, td, row, col, prop, value, cellProperties===>>", instance, td, row, col, prop, value, cellProperties)
        						return td;
        					}
        				}
        			],
        		},
				data: [
		          ["", "Ford", "Volvo", "Toyota", "Honda"],
		          ["2016", 10, 11, 12, 13],
		          ["2017", 20, 11, 14, 13],
		          ["2018", 30, 15, 12, 13]
		        ],
			}
		},
		components: {
     		 HotTable
    	},
		beforeRouteEnter(to, from, next) {
			console.log('before route enter')
			next()
		},
		beforeRouteUpdate(to, from, next) {},
		beforeRouteLeave(to, from, next) {
			next()
		},
		mounted() {
			console.log('route prop===>>>>', this.route)
		}
	}
</script>