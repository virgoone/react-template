import React, { Component } from 'react'
import { Router, Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { History, Location } from 'history'
import history from '@/globals/history'
import routes from '@/routes'

interface AppRouterProps {
  history?: History
  location?: Location | undefined
  match?: any
}

@(withRouter as any)
class AppRouter extends Component<AppRouterProps> {
  render() {
    return (
      <Switch location={this.props.location}>
        {routes.map((route) => (
          <Route
            exact
            key={route.key || route.path}
            path={route.path}
            component={route.component}
          />
        ))}
        <Redirect
          from="/"
          push
          to={{ pathname: '/', state: { from: location.pathname } }}
        />
      </Switch>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <AppRouter />
      </Router>
    )
  }
}

export default App
