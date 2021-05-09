process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'development'
process.env.APP_ENV = 'development'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const clearConsole = require('react-dev-utils/clearConsole')
const {
  choosePort,
  createCompiler,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils')
const baseConfig = require('./webpack.config.dev')

const isInteractive = process.stdout.isTTY

const start = async (defaultPort) => {
  try {
    const host = '0.0.0.0'
    const port = await choosePort(host, defaultPort)

    if (!port) {
      return
    }

    const urls = prepareUrls('http', host, port)
    const config = baseConfig
    const devSocket = {
      warnings: warnings =>
        devServer.sockWrite(devServer.sockets, 'warnings', warnings),
      errors: errors => devServer.sockWrite(devServer.sockets, 'errors', errors),
    }
    const compiler = createCompiler({
      config,
      devSocket,
      urls,
      useYarn: true,
      webpack,
    })
    const devServer = new WebpackDevServer(compiler, config.devServer)

    // Launch WebpackDevServer.
    devServer.listen(port, host, err => {
      if (err) {
        console.log(err)

        return
      }
      if (isInteractive) {
        clearConsole()
      }
    })

    ;['SIGINT', 'SIGTERM'].forEach(sig => {
      process.on(sig, () => {
        devServer.close()
        process.exit()
      })
    })
  } catch (err) {
    if (err && err.message) {
      console.log(err.message)
    }
    process.exit(1)
  }
}

start(9090)