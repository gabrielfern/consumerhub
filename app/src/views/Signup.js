import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { checkLoggedUser, signup } from '../redux/actions'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

function Signup (props) {
  const history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState({})
  const [imageLabel, setImageLabel] = useState('')

  useEffect(() => {
    if (props.logged) {
      history.push('/profile')
    } else {
      props.dispatch(checkLoggedUser())
    }
  }, [props, history])

  async function submit () {
    props.dispatch(signup(name, email, password, image))
  }

  return (
    <Container className='p-3 my-3 border rounded'>
      <h1>Inscreva-se</h1>
      <Button variant='secondary' className='mb-4' onClick={() => history.push('/')}>
          Logar
      </Button>

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

export default connect(state => state)(Signup)
