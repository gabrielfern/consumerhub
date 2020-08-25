/* global gapi */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { checkLoggedUser, login, gLogin } from '../redux/actions'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

function Signin (props) {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (props.logged) {
      history.push('/profile')
    } else {
      props.dispatch(checkLoggedUser())
    }
  }, [props, history])

  async function submit () {
    props.dispatch(login(email, password))
  }

  useEffect(() => {
    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init()
      gapi.signin2.render('g-signin2', {
        onsuccess: async () => {
          const gUser = auth2.currentUser.get()
          props.dispatch(gLogin(gUser))
          auth2.signOut()
        }
      })
    })
  }, [props, history])

  return (
    <Container className='p-3 my-3 border rounded'>
      <h1>Logue</h1>
      <Button variant='secondary' className='mb-4' onClick={() => history.push('/signup')}>
          Cadastrar
      </Button>

      <Form>
        <Form.Group>
          <Form.Label>Email </Form.Label>
          <Form.Control
            type='text' value={email} onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Senha </Form.Label>
          <Form.Control
            type='password' value={password} onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>
      </Form>

      <Button className='mb-4' onClick={submit}>
        Entrar
      </Button>
      <div id='g-signin2' />
    </Container>
  )
}

export default connect(state => state)(Signin)
