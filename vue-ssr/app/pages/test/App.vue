<template>
	<div>;dcpemfepmp
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
	</div>
</template>
<script>
	export default{
		name: 'lmdvo',
		data() {
			return {
				value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
			}
		}
	}
</script>