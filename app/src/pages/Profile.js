/* global localStorage */

import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getUser } from '../services/api'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Media from 'react-bootstrap/Media'

export default () => {
  const history = useHistory()
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser()
        setId(user.id)
        setName(user.name)
        setEmail(user.email)
      } catch {}
    })()
  }, [])

  function logout () {
    delete localStorage.token
    history.push('/')
  }

  return (
    <Container className='p-3 my-3 border rounded'>
      <h1>Perfil de usuário</h1>
      <Button variant='secondary' className='mb-4' onClick={logout}>
        Deslogar
      </Button>

      {(id &&
        <Media>
          <img
            width={128}
            className='mr-3'
            src={`/api/users/${id}/image`}
            alt='imagem de usuário'
          />
          <Media.Body>
            <p><b>ID:</b> {id}</p>
            <p><b>Nome:</b> {name}</p>
            <p><b>Email:</b> {email}</p>
          </Media.Body>
        </Media>) || <p>Carregando...</p>}
    </Container>
  )
}
