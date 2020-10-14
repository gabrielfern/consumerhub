import React from 'react'
import { Switch, Route, Link, useLocation } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import NewProductsList from '../components/controlCenter/NewProductsList'
import ProductEditionsList from '../components/controlCenter/ProductEditionsList'
import ReportsList from '../components/controlCenter/ReportsList'
import Categories from '../components/controlCenter/Categories'

export default (props) => {
  const query = new URLSearchParams(useLocation().search)

  return (
    <>
      <h1>Painel de Controle</h1>

      <Nav variant='tabs' className='mb-3' activeKey={query.get('tab') || 'new-products'}>
        <Nav.Item>
          <Nav.Link as={Link} to='/control-center' eventKey='new-products'>
            Novos Produtos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to='/control-center?tab=categories' eventKey='categories'>
            Categorias
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to='/control-center?tab=reports' eventKey='reports'>
            Reports
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Switch location={{ pathname: query.get('tab') || 'new-products' }}>
        <Route exact path='new-products'>
          <NewProductsList {...props} />
        </Route>
        <Route exact path='categories'>
          <Categories {...props} />
        </Route>
        <Route exact path='product-editions'>
          <ProductEditionsList {...props} />
        </Route>
        <Route exact path='reports'>
          <ReportsList {...props} />
        </Route>
      </Switch>
    </>
  )
}
