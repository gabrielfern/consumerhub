/* global localStorage */

import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createUser, uploadUserImage } from '../services/api'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default () => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState({})
  const [imageLabel, setImageLabel] = useState('')

  if (localStorage.token) {
    history.push('/profile')
  }

  async function submit () {
    const token = await createUser({ name, email, password })
    if (token) {
      localStorage.token = token
      if (image && image.size > 0) {
        await uploadUserImage(await image.arrayBuffer())
      }
      history.push('/profile')
    }
  }

  return (
    <Container className='p-3 my-3 border rounded'>
      <h1>Inscreva-se</h1>

      <Form>
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type='text' value={name} onChange={e => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='text' value={email} onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type='password' value={password} onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Escolha a imagem</Form.Label>
          <Form.File
            custom
            label={imageLabel}
            data-browse='Selecionar'
            onChange={e => {
              if (e.target.files[0]) {
                setImageLabel(e.target.files[0].name)
              } else {
                setImageLabel('')
              }
              setImage(e.target.files[0])
            }}
          />
        </Form.Group>
      </Form>

      <Button className='mb-4' onClick={submit}>
        Confirmar
      </Button>
    </Container>
  )
}
