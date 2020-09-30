/* global fetch, gapi */

import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { authUser, gauthUser, uploadUserImage } from '../services/api'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default (props) => {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function submit (e) {
    e.preventDefault()
    await authUser(email, password)
    props.loadUser()
  }

  useEffect(() => {
    if (props.isLogged) {
      history.push('/profile')
    }

    async function gSignIn (gUser) {
      const idToken = gUser.getAuthResponse().id_token
      const resp = await gauthUser(idToken)
      if (resp && resp.isNewUser) {
        const imageUrl = gUser.getBasicProfile().getImageUrl()
        const resp = await fetch(imageUrl)
        await uploadUserImage(await resp.arrayBuffer())
      }
      if (resp) {
        props.loadUser()
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
  }, [history, props])

  return (
    <>
      <h1>Logue</h1>

      <Form onSubmit={submit}>
        <Form.Group>
          <Form.Label>Email </Form.Label>
          <Form.Control
            required type='email' minLength='5' maxLength='50'
            value={email} onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Senha </Form.Label>
          <Form.Control
            required type='password' minLength='3' maxLength='21'
            value={password} onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type='submit' className='mb-4'>
          Entrar
        </Button>
      </Form>

      <div id='g-signin2' />
    </>
  )
}
