import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import Signup from './views/Signup'
import Profile from './views/Profile'
import Signin from './views/Signin'
import Product from './views/Product'
import ProductList from './views/ProductList'
import CreateProduct from './views/CreateProduct'
import Review from './views/Review'
import CreateReview from './views/CreateReview'
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
        <Route exact path='/signup'>
          <Signup />
        </Route>
        <Route exact path='/profile'>
          <Profile />
        </Route>
        <Route exact path='/product/:productId'>
          <Product />
        </Route>
        <Route exact path='/products'>
          <ProductList />
        </Route>
        <Route exact path='/products/new'>
          <CreateProduct />
        </Route>
        <Route exact path='/review/:reviewId'>
          <Review />
        </Route>
        <Route exact path='/product/:productId/newReview'>
          <CreateReview />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
