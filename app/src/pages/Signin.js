/* global fetch, gapi */

import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { authUser, gauthUser, uploadUserImage } from '../services/api'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import gLogo from '../assets/Google__G__Logo.webp'

export default (props) => {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const gButton = useRef()

  async function submit (e) {
    e.preventDefault()
    const status = await authUser(email, password)
    if (status === 200) {
      props.loadUser()
    } else if (status === 401) {
      window.alert('Senha errada')
    } else {
      window.alert('Falha ao realizar login')
    }
  }

  useEffect(() => {
    if (props.isLogged) {
      history.push('/profile')
    }

    async function gSignIn (gUser) {
      const idToken = gUser.getAuthResponse().id_token
      const resp = await gauthUser(idToken)
      if (resp.isNewUser) {
        const imageUrl = gUser.getBasicProfile().getImageUrl()
        const resp = await fetch(imageUrl)
        await uploadUserImage(await resp.arrayBuffer())
      }
      if (resp.isNewUser !== undefined) {
        props.loadUser()
      } else if (resp.status === 401) {
        window.alert('Usuário não Google, precisa logar com email e senha')
      } else {
        window.alert('Falha ao realizar login')
      }
    }

    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init()
      auth2.attachClickHandler(
        gButton.current, {}, gSignIn,
        () => window.alert('Falha ao autenticar com o Google')
      )
    })
  }, [history, props])

  return (
    <>
      <h1>Logue</h1>

      <Row>
        <Col md={6}>
          <Form onSubmit={submit}>
            <Form.Group>
              <Form.Label>Email </Form.Label>
              <Form.Control
                required type='email' value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Senha </Form.Label>
              <Form.Control
                required type='password' minLength='3' maxLength='30'
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className='py-3 text-center'>
              <Button type='submit'>
                Entrar
              </Button>
            </div>
          </Form>
        </Col>

        <Col md={6} className='py-3 d-flex flex-column justify-content-center align-items-center'>
          <p className='text-muted'>Ou use uma conta Google</p>
          <Button ref={gButton} variant='outline-primary'>
            <img src={gLogo} style={{ width: '1.2em' }} alt='' />
            &nbsp;Entre com o Google
          </Button>
        </Col>
      </Row>
    </>
  )
}
