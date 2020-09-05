import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Signup from '../pages/Signup'
import Profile from '../pages/Profile'
import Signin from '../pages/Signin'
import Home from '../pages/Home'

export default (props) => {
  return (
    <Container className='flex-fill my-3'>
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
    </Container>
  )
}
