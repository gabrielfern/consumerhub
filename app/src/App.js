import React from 'react'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Signin from './pages/Signin'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

export default () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Signin />
        </Route>
        <Route exact path='/signup'>
          <Signup />
        </Route>
        <Route exact path='/profile'>
          <Profile />
        </Route>
      </Switch>
    </Router>
  )
}
