/* global fetch, gapi, localStorage */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { authUser, gauthUser, uploadUserImage } from '../services/api'

export default () => {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (localStorage.token) {
    history.push('/profile')
  }

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
    <>
      <div>
        <h1>Logue</h1>
        <p>
          <button onClick={() => history.push('/signup')}>Cadastrar</button>
          <button onClick={() => history.push('/products')}>Produtos</button>
        </p>
        <p>
          <span><b>Email </b></span>
          <input type='text' value={email} onChange={e => setEmail(e.target.value)} />
        </p>
        <p>
          <span><b>Senha </b></span>
          <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
        </p>
        <p>
          <button onClick={submit}>Entrar</button>
        </p>
        <div id='g-signin2' />
      </div>
    </>
  )
}
