/* global localStorage */

import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import NavDropdown from 'react-bootstrap/NavDropdown'

export default (props) => {
  const history = useHistory()

  function logout () {
    delete localStorage.token
    props.setUser()
    history.push('/')
  }

  let nav
  if (props.user && props.user.id) {
    nav = (
      <Nav activeKey=''>
        <NavDropdown title={props.user.name}>
          <NavDropdown.Item as={Link} to='/profile' eventKey>Perfil</NavDropdown.Item>
          <NavDropdown.Item onClick={logout} eventKey>Deslogar</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    )
  } else {
    nav = (
      <Nav activeKey=''>
        <Nav.Link as={Link} to='/signin' eventKey>Logar</Nav.Link>
        <Nav.Link as={Link} to='/signup' eventKey>Inscrever</Nav.Link>
      </Nav>
    )
  }

  return (
    <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to='/'>ConsumerHub</Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse className='justify-content-end' id='responsive-navbar-nav'>
          {nav}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
