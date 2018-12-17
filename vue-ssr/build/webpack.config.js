const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')

const SCRIPTS_DEV = process.env.npm_package_scripts_dev.split(' ')[1].split('=')[1]
const isDev = (SCRIPTS_DEV === 'development' && process.argv.length === 2) || process.env.NODE_ENV === 'development'

// console.log('process.argv====>>>>>', process.argv)
// console.log('process.env.NODE_ENV===>>>>', process.env.NODE_ENV)

/*
	配置多页应用时获取入口文件
	@pathArr 路径：['../app/views/*.js']
 */
const getEntry = function(pathArr) {
	let entries = {}, basename, tmp, pathname;
	if (typeof (pathArr) != "object") {
		pathArr = [pathArr]
	}
	pathArr.forEach((itemPath) => {
		glob.sync(itemPath).forEach(function (entry) {
			basename = path.basename(entry, path.extname(entry))
			if (entry.split('/').length > 4) {
				tmp = entry.split('/').splice(-3)
				pathname = tmp.splice(0, 1) + '/' + basename // 正确输出js和html的路径
				entries[pathname] = entry
			} else {
				entries[basename] = entry
			}
		})
	})
	return entries
}

const entries = getEntry(['./app/pages/*.js', './app/pages/**/*.js'])

const webpackConfig = {
	mode: isDev ? 'development' : 'production',
	target: 'web',
	entry: entries,//path.join(__dirname, '../app/index.js'),
	output: {
		filename: path.posix.join('static/scripts', '[name].[hash:8].js'),
		chunkFilename: path.posix.join('static/scripts', '[name].[id].[hash:8].js'),
		publicPath: isDev ? '/' : 'http://www.omoideo.com',
		path: path.join(__dirname, '../dist')
	},
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
			/*{
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				enforce: 'pre'
			},*/
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
			},
			{
				test: /\.(woff2?|eot|ttf|otf|woff)(\?.*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							name: 'static/[path][name].[hash:8].[ext]'
						}
					}
				]
			}
		]
	},
	optimization: isDev ? {} : {
		splitChunks: {
			chunks: 'all'
		},
		runtimeChunk: true
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: isDev ? JSON.stringify('development') : JSON.stringify('production')
			}
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, '../app/index.html')
		}), 
		new VueLoaderPlugin()
	]
}

if (isDev) {
	webpackConfig.module.rules.push({
		test: /\.css$/,
		use: ['vue-style-loader', 'css-loader']
	})

	webpackConfig.module.rules.push({
		test: /\.less$/,
		use: [
			'vue-style-loader',
			'css-loader',
			{
				loader: 'postcss-loader',
				options: {
					sourceMap: false
				}
			},
			'less-loader'
		]
	})
} else {
	webpackConfig.module.rules.push({
		test: /\.css$/,
		use: ExtractTextPlugin.extract({
			fallback: 'vue-style-loader',
			use: 'css-loader'
		})
	})

	webpackConfig.module.rules.push({
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
	})

	webpackConfig.plugins.push(new ExtractTextPlugin({
		filename: 'styles.[hash:8].css'//'[name].[contentHash:8].css'
	}))
}

module.exports = webpackConfig