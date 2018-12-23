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
		<div v-for="(item, inx) in [1,2,3,4,5,6,7,8,9,10]">
			<line-charts :id="'lintCharts'+inx" :setOptions="setOptions"></line-charts>
		</div>
	</div>
</template>
<script>
	import LineCharts from './LineCharts'

	export default{
		name: 'lmdvo',
		data() {
			return {
				value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
				data: [],
				setOptions: {
				    dataZoom: [{
				    	show: true,
				    	start: 30,
				    	end: 70
				    }],
				    toolbox: {
				        feature: {
				            /*dataZoom: {
				                yAxisIndex: 'none'
				            },
				            restore: {},*/
				            saveAsImage: {}
				        }
				    },
				    tooltip: {
				        trigger: 'axis',
				        formatter: function (params) {
				        	// console.log('params==>>>', params)
				            params = params[0];
				            var date = new Date(params.name);
				            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1]+'Kb';
				        },
				        axisPointer: {
				            animation: false
				        }
				    },
				    xAxis: {
				        type: 'time',
				        splitLine: {
				            show: false
				        }
				    },
				    yAxis: {
				        type: 'value',
				        boundaryGap: [0, '50%'],
				        splitLine: {
				            show: false
				        }
				    },
				    series: [{
				        name: '模拟数据',
				        type: 'line',
				        showSymbol: false,
				        hoverAnimation: false,
				        data: []
				    }]
				}
			}
		},
		components: {
			LineCharts
		},
		mounted() {
			this.smsm()
		},
		methods: {
			smsm(n) {
				function dd(n) {
					function randomData(n) {
					    now = new Date(+now + oneDay)
					    value = Math.random()*0.001
					    return {
					        name: now.toString(),
					        value: [
					            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
					            value
					        ]
					    }
					}

					var data = [];
					var now = +new Date(2010, 9, 3)
					var oneDay = 24 * 3600 * 1000
					var value = Math.random() * 0.0001*n
					for (var i = 0; i < 90; i++) {
						var d = randomData(i)
					    data.push(d)
					}
					return data
				}
				this.setOptions.series[0].data = dd(n)
				setTimeout(() => {
					var nn = Math.random() * 100
					this.smsm(nn)
				}, 3000)

				
				/*
				function randomData() {
				    now = new Date(+now + oneDay);
				    value = value + Math.random()*0.001;
				    return {
				        name: now.toString(),
				        value: [
				            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
				            value
				        ]
				    }
				}

				var data = [];
				var now = +new Date(1997, 9, 3);
				var oneDay = 24 * 3600 * 1000;
				var value = Math.random() * 0.0001;
				for (var i = 0; i < 1000; i++) {
				    data.push(randomData());
				}

				option = {
				    title: {
				        text: '动态数据 + 时间坐标轴'
				    },
				    tooltip: {
				        trigger: 'axis',
				        formatter: function (params) {
				            params = params[0];
				            var date = new Date(params.name);
				            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1]+'Kb';
				        },
				        axisPointer: {
				            animation: false
				        }
				    },
				    xAxis: {
				        type: 'time',
				        splitLine: {
				            show: false
				        }
				    },
				    yAxis: {
				        type: 'value',
				        boundaryGap: [0, '50%'],
				        splitLine: {
				            show: false
				        }
				    },
				    series: [{
				        name: '模拟数据',
				        type: 'line',
				        showSymbol: false,
				        hoverAnimation: false,
				        data: data
				    }]
				};


				 */
			}
		}
	}
</script>