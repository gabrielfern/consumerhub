import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Signup from '../pages/Signup'
import Profile from '../pages/Profile'
import Signin from '../pages/Signin'
import Home from '../pages/Home'
import ProfileEdit from '../pages/ProfileEdit'
import ProductList from '../pages/ProductList'
import ProductCreate from '../pages/ProductCreate'
import Product from '../pages/Product'
import ControlCenter from '../pages/ControlCenter'

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
        <Route exact path='/profile/edit'>
          <ProfileEdit {...props} />
        </Route>
        <Route exact path='/products'>
          <ProductList {...props} />
        </Route>
        <Route exact path='/products/new'>
          <ProductCreate {...props} />
        </Route>
        <Route exact path='/product/:productId'>
          <Product {...props} />
        </Route>
        <Route exact path='/control'>
          <ControlCenter {...props} />
        </Route>
      </Switch>
    </Container>
  )
}
