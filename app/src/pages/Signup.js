import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { createUser, uploadUserImage } from '../services/api'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import FileChooser from '../components/FileChooser'
import Image from '../components/Image'

export default (props) => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState()
  const [imageURL, setImageURL] = useState('')

  useEffect(() => {
    if (props.isLogged) {
      history.push('/profile')
    }
  }, [history, props.isLogged])

  useEffect(() => {
    if (image) {
      setImageURL(URL.createObjectURL(image))
    } else {
      setImageURL('')
    }
  }, [image])

  async function submit (e) {
    e.preventDefault()
    const status = await createUser({ name, email, password })
    if (image) {
      await uploadUserImage(await image.arrayBuffer())
    }
    if (status === 200) {
      props.loadUser()
    } else {
      window.alert('Falha ao criar usuário')
    }
  }

  return (
    <>
      <h1>Inscreva-se</h1>

      <Form onSubmit={submit}>
        <Form.Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                required type='text' minLength='3' maxLength='50'
                value={name} onChange={e => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                required type='email' value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Senha</Form.Label>
              <Form.Control
                required type='password' minLength='3' maxLength='30'
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6} className='d-flex flex-column justify-content-between'>
            <Image
              width='128px'
              src={imageURL}
            />
            <Form.Group>
              <Form.Label>Escolha a imagem</Form.Label>
              <FileChooser imageOnly setFile={setImage} maxSize={5e6} />
            </Form.Group>
          </Col>
        </Form.Row>
        <div className='py-3 text-center'>
          <Button type='submit' className='mb-4'>
            Confirmar
          </Button>
        </div>
      </Form>
    </>
  )
}
