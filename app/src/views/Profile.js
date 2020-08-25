import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUser, logout } from '../redux/actions'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Media from 'react-bootstrap/Media'

function Profile (props) {
  const history = useHistory()

  useEffect(() => {
    if (!props.logged) {
      history.push('/')
    } else if (!props.user) {
      props.dispatch(getUser())
    }
  }, [props, history])

  return (
    <Container className='p-3 my-3 border rounded'>
      <h1>Perfil de usuário</h1>
      <Button variant='secondary' className='mb-4' onClick={() => props.dispatch(logout())}>
        Deslogar
      </Button>

      {(props.user &&
        <Media>
          <img
            width={128}
            className='mr-3'
            src={`/api/users/${props.user.id}/image`}
            alt='imagem de usuário'
          />
          <Media.Body>
            <p><b>ID:</b> {props.user.id}</p>
            <p><b>Nome:</b> {props.user.name}</p>
            <p><b>Email:</b> {props.user.email}</p>
          </Media.Body>
        </Media>) || <p>Carregando...</p>}
    </Container>
  )
}

export default connect(state => state)(Profile)
