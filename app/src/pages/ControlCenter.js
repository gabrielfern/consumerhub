import React from 'react'
import { Switch, Route, Link, useLocation } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import NewProductsList from '../components/controlCenter/NewProductsList'
import ProductEditionsList from '../components/controlCenter/ProductEditionsList'
import ReportsList from '../components/controlCenter/ReportsList'
import Categories from '../components/controlCenter/Categories'
import Users from '../components/controlCenter/Users'

export default (props) => {
  const query = new URLSearchParams(useLocation().search)

  return (
    <>
      <h1>Painel de Controle</h1>

      <Nav variant='tabs' className='mb-3' activeKey={query.get('tab') || 'staging'}>
        <Nav.Item>
          <Nav.Link as={Link} to='/control-center' eventKey='staging'>
            Produtos em análise
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
        {props.user && props.user.type === 'admin' &&
          <Nav.Item>
            <Nav.Link as={Link} to='/control-center?tab=users' eventKey='users'>
              Usuários
            </Nav.Link>
          </Nav.Item>}
      </Nav>

      <Switch location={{ pathname: query.get('tab') || 'staging' }}>
        <Route exact path='staging'>
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
        <Route exact path='users'>
          <Users {...props} />
        </Route>
      </Switch>
    </>
  )
}
