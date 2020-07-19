/* global localStorage */
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createUser, uploadUserImage } from '../services/api'

export default () => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState({})

  if (localStorage.token) {
    history.push('/profile')
  }

  async function submit () {
    const token = await createUser({ name, email, password })
    if (token) {
      localStorage.token = token
      if (image && image.size > 0) {
        await uploadUserImage(await image.arrayBuffer())
      }
      history.push('/profile')
    }
  }

  return (
    <>
      <div>
        <h1>Inscreva-se</h1>
        <p>
          <button onClick={() => history.push('/')}>Logar</button>
          <button onClick={() => history.push('/products')}>Produtos</button>
        </p>
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
