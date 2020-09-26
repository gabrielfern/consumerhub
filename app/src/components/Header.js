import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Image from '../components/Image'

export default (props) => {
  const history = useHistory()
  const [search, setSearch] = useState('')

  function logout () {
    props.logout()
    history.push('/signin')
  }

  let nav
  if (props.isLogged) {
    nav = (
      props.user &&
        <Nav activeKey=''>
          {props.user.type !== 'user' &&
            <Nav.Link as={Link} to='/control-center' eventKey>Painel de Controle</Nav.Link>}
          <NavDropdown
            title={
              <div className='d-inline-block align-top'>
                <Image
                  width='24px'
                  src={`/api/users/${props.user.id}/image?${props.userImageVersion}`}
                />
              </div>
            }
            alignRight
          >
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
            value={search} onChange={e => setSearch(e.target.value)}
            type='text' placeholder='Nome do Produto'
          />
          <Button
            as={Link} to={search ? '/products?s=' + search : '/products'}
            className='mx-1 my-2 my-lg-0' variant='outline-info'
          >
            Procurar
          </Button>
        </Form>
        {nav}
      </Navbar.Collapse>
    </Navbar>
  )
}
