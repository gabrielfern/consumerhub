import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'

export default () => {
  return (
    <Navbar bg='light' variant='light'>
      <Container>
        <span className='text-muted'>
          © 2020 ConsumerHub
        </span>
        <Nav>
          <Nav.Link href='https://github.com/gabrielfern/consumerhub#readme'>Sobre</Nav.Link>
          <Nav.Link>Termos de Uso</Nav.Link>
          <Nav.Link href='https://github.com/gabrielfern/consumerhub'>Código Fonte</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
