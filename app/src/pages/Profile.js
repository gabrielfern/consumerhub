/* global localStorage */

import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getUser } from '../services/api'
import Container from 'react-bootstrap/Container'
import Media from 'react-bootstrap/Media'

export default (props) => {
  const history = useHistory()
  const { setUser } = props

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser()
        setUser(user)
      } catch {
        delete localStorage.token
        setUser()
        history.push('/')
      }
    })()
  }, [history, setUser])

  return (
    <Container className='p-3 my-3 border rounded'>
      <h1>Perfil de usuário</h1>

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
