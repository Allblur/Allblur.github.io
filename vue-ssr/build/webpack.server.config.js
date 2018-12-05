const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')

const SCRIPTS_DEV = process.env.npm_package_scripts_dev.split(' ')[1].split('=')[1]
const isDev = (SCRIPTS_DEV === 'development' && process.argv.length === 2) || process.env.NODE_ENV === 'development'

// console.log('process.argv====>>>>>', process.argv)
// console.log('process.env.NODE_ENV===>>>>', process.env.NODE_ENV)

const webpackConfig = {
	target: 'node',
	mode: 'production',
	entry: path.join(__dirname, '../app/index.js'),
	output: {
		libraryTarget: 'commonjs2',
		filename: 'server-entry.js',
		path: path.join(__dirname, '../dist-server')
	},
	externals: Object.keys(require('../package.json').dependencies),
	resolve: {
		extensions: ['.js', '.vue', '.json'],
	    alias: {
	      	'@': path.resolve(__dirname, '../app'),
	      	'server': path.resolve(__dirname, '../server'),
	      	'app': path.resolve(__dirname, '../app'),
	      	'src': path.resolve(__dirname, '../app'),
	      	'components': path.resolve(__dirname, '../app/components')
	    }
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'vue-style-loader',
					use: ['css-loader']
				})
			},
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					fallback: 'vue-style-loader',
					use: [
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: true
							}
						},
						'less-loader'
					]
				})
			},
			{
				test: /\.(jpg|jpeg|png|svg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 1024,
							name: 'static/[path][name].[hash:8].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production'),
				'VUE_ENV': JSON.stringify('server')
			}
		}),
		new ExtractTextPlugin({
			filename: 'styles.[hash:8].css'
		}),
		new VueLoaderPlugin()
	]
}

module.exports = webpackConfig