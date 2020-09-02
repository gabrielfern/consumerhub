import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Signup from '../pages/Signup'
import Profile from '../pages/Profile'
import Signin from '../pages/Signin'

export default () => {
  return (
    <div className='flex-fill'>
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
    </div>
  )
}
