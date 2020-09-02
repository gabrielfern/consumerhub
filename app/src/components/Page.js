import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Signup from '../pages/Signup'
import Profile from '../pages/Profile'
import Signin from '../pages/Signin'

export default (props) => {
  return (
    <div className='flex-fill'>
      <Switch>
        <Route exact path='/'>
          <Signin />
        </Route>
        <Route exact path='/signup'>
          <Signup />
        </Route>
        <Route exact path='/profile'>
          <Profile {...props} />
        </Route>
      </Switch>
    </div>
  )
}
