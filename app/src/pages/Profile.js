import React from 'react'
import { useHistory } from 'react-router-dom'
import Media from 'react-bootstrap/Media'

export default (props) => {
  const history = useHistory()

  if (!props.isLogged) {
    history.push('/')
  }

  return (
    <>
      <h1>Perfil de usuário</h1>

      {(props.user &&
        <Media>
          <img
            width={128}
            className='mr-3'
            src={`/api/users/${props.user.id}/image?${Date.now()}`}
            alt='imagem de usuário'
          />
          <Media.Body>
            <p><b>ID:</b> {props.user.id}</p>
            <p><b>Nome:</b> {props.user.name}</p>
            <p><b>Email:</b> {props.user.email}</p>
          </Media.Body>
        </Media>) || <p>Carregando...</p>}
    </>
  )
}
