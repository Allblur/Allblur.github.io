<template>
	<div class="app">
		<h1>this is home page</h1>
		<input type="checkbox" v-model="checkboxData" :value="checkbox1">
		<input type="checkbox" v-model="checkboxData" :value="checkbox2">
	</div>
</template>
<script>
	export default{
		name: 'homePage',
		data() {
			return {
				checkboxData: [[1,2,3], [4,5,6]],
				checkbox1: [1,2,3],
				checkbox2: [3,4,5]
			}
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.checkbox2 = [4,5,6]
				}, 10*1000);
			})
		}
	}
</script>