const path = require('path')

module.exports = (api) => {
  api.cache(() => process.env.NODE_ENV)
  const { NODE_ENV, BABEL_ENV } = process.env
  const resolverOpts = {
    root: [path.relative(__dirname, process.cwd())],
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    alias: {
      '@': './src',
    },
  }

  let environment = []

  if ((BABEL_ENV || NODE_ENV) === 'development') {
    environment = ['@babel/plugin-syntax-dynamic-import']
  } else {
    environment = [
      '@babel/plugin-syntax-dynamic-import',
      'babel-plugin-transform-react-remove-prop-types',
      '@babel/plugin-transform-react-constant-elements',
    ]
  }

  const config = {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      ...environment,
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'lib',
          style: 'css',
        },
      ],
      ['babel-plugin-module-resolver', resolverOpts],
      '@babel/plugin-proposal-object-rest-spread',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-runtime',
    ],
  }

  return config
}
