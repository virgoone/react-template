import React from 'react'
import ReactDOM from 'react-dom'
import 'normalize.css'

const init = () => {
  const App = require('./App').default

  ReactDOM.render(<App />, document.getElementById('root'))
}

if (__DEV__) {
  module.hot.accept('./App', init)
}

init()