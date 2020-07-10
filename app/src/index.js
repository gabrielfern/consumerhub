import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import Signup from './components/Signup'
import Profile from './components/Profile'
import Signin from './components/Signin'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path='/'>
          <Signin />
        </Route>
        <Route path='/signup'>
          <Signup />
        </Route>
        <Route path='/profile'>
          <Profile />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
