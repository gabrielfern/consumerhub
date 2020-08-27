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
    if (!props.isLogged) {
      history.push('/')
    } else if (!props.data) {
      props.dispatch(getUser())
    }
  }, [props, history])

  return (
    <Container className='p-3 my-3 border rounded'>
      <h1>Perfil de usuário</h1>
      <Button variant='secondary' className='mb-4' onClick={() => props.dispatch(logout())}>
        Deslogar
      </Button>

      {(props.data &&
        <Media>
          <img
            width={128}
            className='mr-3'
            src={`/api/users/${props.data.id}/image`}
            alt='imagem de usuário'
          />
          <Media.Body>
            <p><b>ID:</b> {props.data.id}</p>
            <p><b>Nome:</b> {props.data.name}</p>
            <p><b>Email:</b> {props.data.email}</p>
          </Media.Body>
        </Media>) || <p>Carregando...</p>}
    </Container>
  )
}

export default connect(state => state.user)(Profile)
