import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import Signup from './components/Signup'
import Profile from './components/Profile'
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
          <Signup />
        </Route>
        <Route path='/:id'>
          <Profile />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
