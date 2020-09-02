/* global localStorage */

import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'

export default (props) => {
  const history = useHistory()

  function logout () {
    delete localStorage.token
    props.setUser()
    history.push('/')
  }

  let nav
  if (props.user) {
    nav = (
      <Nav>
        <Nav.Link onClick={logout}>Deslogar</Nav.Link>
      </Nav>
    )
  } else {
    nav = (
      <Nav>
        <Nav.Link as={Link} to='/'>Logar</Nav.Link>
        <Nav.Link as={Link} to='/signup'>Inscrever</Nav.Link>
      </Nav>
    )
  }

  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <Container>
        <Navbar.Brand>ConsumerHub</Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse className='justify-content-end' id='responsive-navbar-nav'>
          {nav}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
