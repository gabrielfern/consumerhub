import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { createUser, uploadUserImage } from '../services/api'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FileChooser from '../components/FileChooser'

export default (props) => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState({})

  useEffect(() => {
    if (props.isLogged) {
      history.push('/')
    }
  }, [history, props])

  async function submit () {
    await createUser({ name, email, password })
    if (image && image.size > 0) {
      await uploadUserImage(await image.arrayBuffer())
    }
    props.loadUser()
  }

  return (
    <>
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
          <FileChooser setFile={setImage} />
        </Form.Group>
      </Form>

      <Button className='mb-4' onClick={submit}>
        Confirmar
      </Button>
    </>
  )
}
