/* global fetch, gapi */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default () => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState({})

  async function submit () {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    })
    if (res.status === 200) {
      const user = await res.json()
      if (image && image.size > 0) {
        const buffer = await image.arrayBuffer()
        await fetch(`/api/users/${user.id}/image`, {
          method: 'POST',
          body: buffer
        })
      }
      history.push(`/${user.id}`)
    }
  }

  useEffect(() => {
    async function gSignUp (gUser) {
      const idToken = gUser.getAuthResponse().id_token
      const prof = gUser.getBasicProfile()
      const imageUrl = prof.getImageUrl()

      const resp = await fetch(imageUrl)
      const buff = await resp.arrayBuffer()
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ idToken })
      })
      if (res.status === 200) {
        const user = await res.json()
        await fetch(`/api/users/${user.id}/image`, {
          method: 'POST',
          body: buff
        })
        history.push(`/${user.id}`)
      }
    }

    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init()
      auth2.isSignedIn.listen(async signed => {
        if (signed) {
          const gUser = auth2.currentUser.get()
          await gSignUp(gUser)
          auth2.signOut()
        }
      })
    })
  }, [history])

  return (
    <>
      <div>
        <h1>Inscreva-se</h1>
        <p>
          <span><b>Nome </b></span>
          <input type='text' value={name} onChange={e => setName(e.target.value)} />
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
          <span><b>Imagem </b></span>
          <input type='file' accept='image/*' onChange={e => setImage(e.target.files[0])} />
        </p>
        <p>
          <button onClick={submit}>Confirmar</button>
        </p>
        <div className='g-signin2' />
      </div>
    </>
  )
}
