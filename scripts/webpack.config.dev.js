/* eslint-env node */
const webpack = require('webpack')
const path = require('path')
const { merge } = require('webpack-merge')
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware')
const ignoredFiles = require('react-dev-utils/ignoredFiles')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const baseWebpackConfig = require('./webpack.config')
const { appPublic, appSrc } = require('./config')

const baseConfig = baseWebpackConfig

const config = merge(baseConfig, {
  entry: ['react-dev-utils/webpackHotDevClient'],
  
  mode: 'development',
  devtool: 'cheap-module-source-map',
  output: {
    pathinfo: true,
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    // see https://github.com/webpack/webpack/issues/6642#issuecomment-370222543
    globalObject: 'this',
    devtoolModuleFilenameTemplate: (info) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  devServer: {
    disableHostCheck: true,
    // Enable gzip compression of generated files
    compress: true,
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: 'none',
    contentBase: appPublic,
    // By default files from `contentBase` will not trigger a page reload.
    watchContentBase: true,
    // Enable hot reloading server. It will provide /sockjs-node/ endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the Webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    publicPath: '/',
    quiet: true,
    watchOptions: {
      ignored: ignoredFiles(appSrc),
    },
    host: '0.0.0.0',
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    before(app, server) {
      // This lets us fetch source contents from webpack for the error overlay
      app.use(evalSourceMapMiddleware(server))
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware())
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
})

module.exports = config
