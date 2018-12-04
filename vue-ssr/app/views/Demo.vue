<template>
	<div class="app">
		<h1>this is demo page</h1>
	</div>
</template>
<script>
	export default{
		name: 'demoPage',
		props: ['route'],
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