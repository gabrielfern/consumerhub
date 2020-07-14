/* global fetch, gapi, localStorage */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default () => {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function submit () {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    if (res.status === 200) {
      const { token } = await res.json()
      localStorage.token = token
      history.push('/profile')
    }
  }

  useEffect(() => {
    async function gSignIn (gUser) {
      const idToken = gUser.getAuthResponse().id_token

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ idToken })
      })

      if (res.status === 200) {
        const { token } = await res.json()
        localStorage.token = token
        history.push('/profile')
      } else if (res.status === 201) {
        const { token } = await res.json()
        localStorage.token = token

        const imageUrl = gUser.getBasicProfile().getImageUrl()
        const resp = await fetch(imageUrl)
        const buff = await resp.arrayBuffer()
        await fetch('/api/users/image', {
          method: 'POST',
          headers: {
            'Content-type': 'application/octet-stream',
            token: token
          },
          body: buff
        })

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
        <p><button onClick={() => history.push('/signup')}>Cadastrar</button></p>
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
