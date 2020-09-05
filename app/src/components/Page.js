import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Signup from '../pages/Signup'
import Profile from '../pages/Profile'
import Signin from '../pages/Signin'
import Home from '../pages/Home'

export default (props) => {
  return (
    <div className='flex-fill'>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route exact path='/signin'>
          <Signin {...props} />
        </Route>
        <Route exact path='/signup'>
          <Signup {...props} />
        </Route>
        <Route exact path='/profile'>
          <Profile {...props} />
        </Route>
      </Switch>
    </div>
  )
}
