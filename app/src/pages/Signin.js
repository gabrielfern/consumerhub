/* global fetch, localStorage, gapi */

import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { authUser, gauthUser, uploadUserImage } from '../services/api'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default (props) => {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (props.user && props.user.id) {
      history.push('/')
    }
  }, [history, props])

  async function submit () {
    const token = await authUser(email, password)
    if (token) {
      localStorage.token = token
      history.push('/profile')
    }
  }

  useEffect(() => {
    async function gSignIn (gUser) {
      const idToken = gUser.getAuthResponse().id_token
      const { token, isNewUser } = await gauthUser(idToken)
      if (token) {
        localStorage.token = token
        if (isNewUser) {
          const imageUrl = gUser.getBasicProfile().getImageUrl()
          const resp = await fetch(imageUrl)
          await uploadUserImage(await resp.arrayBuffer())
        }
        history.push('/profile')
      }
    }

    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init()
      gapi.signin2.render('g-signin2', {
        onsuccess: async () => {
          const gUser = auth2.currentUser.get()
          await gSignIn(gUser)
          auth2.signOut()
        }
      })
    })
  }, [history])

  return (
    <Container className='p-3 my-3 border rounded'>
      <h1>Logue</h1>

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
