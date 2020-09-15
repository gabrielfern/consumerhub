import React from 'react'
import Nav from 'react-bootstrap/Nav'
import Card from 'react-bootstrap/Card'

export default (props) => {
  return (
    <>
      <h1>Painel de Controle</h1>

      <Card>
        <Card.Header>
          <Nav variant='tabs' defaultActiveKey='new-products'>
            <Nav.Item>
              <Nav.Link eventKey='new-products'>Novos Produtos</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='product-editios'>Edições de Produtos</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='reports'>Reports</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body style={{ height: '500px' }}>

        </Card.Body>
      </Card>
    </>
  )
}
