import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Media from 'react-bootstrap/Media'
import Badge from 'react-bootstrap/Badge'
import Image from '../components/Image'

export default (props) => {
  const history = useHistory()

  useEffect(() => {
    if (!props.isLogged) {
      history.push('/signin')
    }
  }, [history, props.isLogged])

  return (
    <>
      <h1>Perfil de usuário</h1>

      {(props.user &&
        <Media>
          <Image
            width='128px'
            src={`/api/users/${props.user.id}/image?${props.userImageVersion}`}
          />
          <Media.Body className='m-2'>
            <p>
              <b>ID: </b>
              {props.user.id + ' '}
              {props.user.type !== 'user' &&
                <Badge variant='secondary'>{props.user.type}</Badge>}
            </p>
            <p><b>Nome:</b> {props.user.name}</p>
            <p><b>Email:</b> {props.user.email}</p>
          </Media.Body>
        </Media>) || <p>Carregando...</p>}
    </>
  )
}
