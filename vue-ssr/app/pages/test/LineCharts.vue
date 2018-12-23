<template>
	<div :id="id" :style="style"></div>
</template>
<script>
	import echarts from 'echarts'

	export default{
		props: {
			id: {
				type: String,
				default: () => {
					return 'feegr'
				}
			},
			width: {
				type: String,
				default: '500px'
			},
			height: {
				type: String,
				default: '430px'
			},
			setOptions: {
				default: () => {
					return {
					    /*title: {
					        text: '动态数据 + 时间坐标轴'
					    },*/
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
					        data: [1,3,2]
					    }]
					}
				}
			}
		},//['id', 'width', 'height'],
		data() {
			return {
				charts: ''
			}
		},
		computed: {
			style() {
				return {
					width: this.width || '300px',
					height: this.height || '300px'
				}
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				this.charts = new echarts.init(document.getElementById(this.id))
				this.charts.setOption(this.setOptions)
				window.addEventListener('resize', this.charts.resize)
			}
		},
		watch: {
			setOptions: {
				handler: function(newVal, oVal) {
					if (this.charts) {
						if (newVal) {
							this.charts.setOption(newVal)
						} else {
							this.charts.setOption(oVal)
						}
					} else {
						this.init()
					}
				},
				deep: true
			}
		}
	}
</script>