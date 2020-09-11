import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default (props) => {
  const history = useHistory()

  function logout () {
    props.logout()
    history.push('/')
  }

  let nav
  if (props.isLogged) {
    nav = (
      props.user &&
        <Nav activeKey=''>
          <NavDropdown title={props.user.name} alignRight>
            <NavDropdown.Item as={Link} to='/profile' eventKey>Perfil</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/profile/edit' eventKey>Editar</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logout} eventKey>Sair</NavDropdown.Item>
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
      <Navbar.Brand as={Link} to='/'>ConsumerHub</Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse className='justify-content-end' id='responsive-navbar-nav'>
        <Form className='flex-fill my-2 my-lg-0 justify-content-center' inline>
          <Form.Control
            className='flex-fill' style={{ maxWidth: '576px' }}
            type='text' placeholder='Procurar Produto'
          />
          <Button className='mx-1 my-2 my-lg-0' variant='outline-info'>
            Procurar
          </Button>
        </Form>
        {nav}
      </Navbar.Collapse>
    </Navbar>
  )
}
