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

  async function submit () {
    await authUser(email, password)
    props.loadUser()
  }

  useEffect(() => {
    if (props.isLogged) {
      history.push('/')
    }

    async function gSignIn (gUser) {
      const idToken = gUser.getAuthResponse().id_token
      const { isNewUser } = await gauthUser(idToken)
      if (isNewUser) {
        const imageUrl = gUser.getBasicProfile().getImageUrl()
        const resp = await fetch(imageUrl)
        await uploadUserImage(await resp.arrayBuffer())
      }
      props.loadUser()
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
    </>
  )
}
