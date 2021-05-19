const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { appSrc, appIndex, appHtml } = require('./config.js')
const { APP_ENV } = process.env
let __DEV__ = process.env.NODE_ENV === 'development'
const variables = {
  __DEV__,
  APP_ENV,
}
const stringified = Object.keys(variables).reduce(
  (acc, key) => {
    acc[key] = JSON.stringify(variables[key])

    return acc
  },
  {
    'process.env.APP_ENV': JSON.stringify(APP_ENV),
  },
)

function getStyleLoaders(external) {
  function getLoaders(useable) {
    return [
      // eslint-disable-next-line no-nested-ternary
      useable
        ? 'style-loader/useable'
        : __DEV__
        ? 'style-loader'
        : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          // turn on sourceMap will cause FOUC
          // see https://github.com/webpack-contrib/css-loader/issues/613
          sourceMap: false,
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          // turn on sourceMap will cause FOUC
          // see https://github.com/webpack-contrib/css-loader/issues/613
          sourceMap: false,
        },
      },
    ]
  }

  if (!external) {
    return [
      {
        resourceQuery: /useable/,
        use: getLoaders(true),
      },
      {
        use: getLoaders(),
      },
    ]
  }

  return getLoaders()
}

let minify

if (!__DEV__) {
  minify = {
    removeComments: false,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  }
}
module.exports = {
  mode: 'development',
  entry: [appIndex],
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.jsx', '.js', '.less'],
    alias: {
      '@': appSrc,
    },
  },
  module: {
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.(svg|png|jpe?g|ttf|eot|woff|woff2|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/[name].[hash:6].[ext]',
        },
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [appSrc],
        loader: 'babel-loader',
        options: {
          cacheDirectory: false,
          highlightCode: true,
        },
      },
      {
        test: /\.less$/,
        enforce: 'pre',
        include: [appSrc, /node_modules/],
        use: [
          {
            loader: 'less-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      {
        test: /\.(css|less)$/,
        include: [appSrc],
        oneOf: getStyleLoaders(),
      },
      {
        test: /\.(css|less)$/,
        exclude: [appSrc],
        use: getStyleLoaders(true),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: appHtml,
      minify,
    }),
    new webpack.DefinePlugin(stringified),
  ],
}
