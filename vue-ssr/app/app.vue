<template>
	<div class="app">
		<h1>{{pageName}} demo project</h1>
		<router-link :to="{name: 'app'}">首页</router-link>
		<router-link :to="{name: 'demo'}">demo页面</router-link>
		<router-view />
	</div>
</template>
<script>
	export default {
		name: 'App',
		data() {
			return {
				pageName: 'vue ssr',
				msg: 'msg text sxss'
			}
		}
	}
</script>
<style lang="less">
	@color: #323232;
	.base{
		padding: 0;
		margin: 0;
		background-color: #fff;
	}
	.app{
		.base;
		color: @color;
		font-size: 20px;
	}
</style>