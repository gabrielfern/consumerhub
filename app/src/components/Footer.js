import React from 'react'
import { Link } from 'react-router-dom'
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
          <Nav.Link as={Link} to='/terms-of-service'>Termos de Uso</Nav.Link>
          <Nav.Link
            href='https://github.com/gabrielfern/consumerhub'
            target='_blank' rel='noopener noreferrer'
          >
            Código Fonte
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
