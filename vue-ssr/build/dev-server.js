const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMidleware = require('webpack-hot-middleware')
const historyApiFallback = require('connect-history-api-fallback')
const webpackConfig = require('./webpack.base.config')

const app = express()
const compiler = webpack(webpackConfig)
const devMiddleware = webpackDevMiddleware(compiler, {
	publicPath: webpackConfig.output.publicPath,
	stats: {
		colors: true,
		chunks: false
	}
})

const hotMiddleware = webpackHotMidleware(compiler)

//此处还未配置完成
// 修改保存后，及时刷新页面
/*compiler.plugin('compilation', function(compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
		hotMiddleware.publish({ action: 'reload' })
		cb()
	})
})*/

app.use(historyApiFallback())
app.use(devMiddleware)
app.use(hotMiddleware)

const staticPath = path.posix.join('/', 'static')
app.use(staticPath, express.static('./static'))

const port = 3333

module.exports = app.listen(port, function (err) {
	if (err) {
		throw new Error(err)
	}
	console.log('Listening at http://localhost:' + port + '\n')
})