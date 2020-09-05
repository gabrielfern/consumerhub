/* global localStorage */

import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getUser } from '../services/api'
import Media from 'react-bootstrap/Media'

export default (props) => {
  const history = useHistory()
  const { user, setUser } = props

  useEffect(() => {
    (async () => {
      try {
        if (!user && localStorage.token) {
          const user = await getUser()
          setUser(user)
        } else if (!user) {
          history.push('/')
        }
      } catch {
        delete localStorage.token
        setUser()
        history.push('/')
      }
    })()
  }, [history, user, setUser])

  return (
    <>
      <h1>Perfil de usuário</h1>

      {(props.isLogged() &&
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
    </>
  )
}
