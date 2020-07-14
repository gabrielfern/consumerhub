/* global fetch, localStorage */
import React, { useState } from 'react'
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
      const { token } = await res.json()
      if (image && image.size > 0) {
        const buffer = await image.arrayBuffer()
        await fetch('/api/users/image', {
          method: 'POST',
          headers: {
            'Content-type': 'application/octet-stream',
            token: token
          },
          body: buffer
        })
      }
      localStorage.token = token
      history.push('/profile')
    }
  }

  return (
    <>
      <div>
        <h1>Inscreva-se</h1>
        <p><button onClick={() => history.push('/')}>Logar</button></p>
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
      </div>
    </>
  )
}
