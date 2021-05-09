/* eslint-env node */
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { appSrc, appBuild } = require('./config.js')
const baseWebpackConfig = require('./webpack.config')
const baseConfig = baseWebpackConfig

const config = merge(baseConfig, {
  mode: 'production',
  devtool: false,
  externals: {
    // prettier-ignore
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  output: {
    path: appBuild,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
    devtoolModuleFilenameTemplate: (info) =>
      path.relative(appSrc, info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
        // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: false,
        },
      }),
    ],
    moduleIds: 'hashed',
    chunkIds: 'named',
    splitChunks: {
      name: false,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      minSize: 10000,
      cacheGroups: {
        /**
         * https://github.com/webpack-contrib/mini-css-extract-plugin/issues/85
         * 把所有css打包到一个文件是一个好做法吗？
         * Cons: 对性能有影响
         * Pros: 可以解决低端浏览器不支持link onload事件，导致异步加载一直pendding的问题
         * https://github.com/webpack-contrib/mini-css-extract-plugin/issues/294
         */
        styles: {
          name: 'styles',
          test: (module) =>
            module.nameForCondition &&
            /\.(css|less)$/.test(module.nameForCondition()) &&
            !/^javascript/.test(module.type),
          chunks: 'all',
          enforce: true,
        },
        vendors: {
          name: 'vendors',
          test: (module) =>
            module.resource &&
            /\.js$/.test(module.resource) &&
            /node_modules/.test(module.resource),
          chunks: 'initial',
        },
      },
    },
    runtimeChunk: { name: 'runtime' },
  },
  plugins: [
    new ScriptExtHtmlWebpackPlugin({
      inline: [
        // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/85
        /styles.*\.js$/, // temporary fix style.js issue
      ],
      // 记录加载失败的资源
      custom: [
        {
          test: /\.js$/,
          attribute: 'crossorigin',
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),
  ],
})

module.exports = config
