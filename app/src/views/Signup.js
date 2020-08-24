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
    <div className='container my-3'>
      <h1>Inscreva-se</h1>
      <p>
        <button className='btn btn-secondary m-2' onClick={() => history.push('/')}>Logar</button>
      </p>
      <p>
        <span><b>Nome </b></span>
        <input className='form-control' type='text' value={name} onChange={e => setName(e.target.value)} />
      </p>
      <p>
        <span><b>Email </b></span>
        <input className='form-control' type='text' value={email} onChange={e => setEmail(e.target.value)} />
      </p>
      <p>
        <span><b>Senha </b></span>
        <input className='form-control' type='password' value={password} onChange={e => setPassword(e.target.value)} />
      </p>
      <div className='custom-file my-3'>
        <input
          type='file' className='custom-file-input'
          onChange={e => {
            const fileLabel = document.getElementById('fileLabel')
            if (e.target.files[0]) {
              fileLabel.innerText = e.target.files[0].name
            } else {
              fileLabel.innerText = 'Escolha a imagem'
            }
            setImage(e.target.files[0])
          }}
        />
        <label id='fileLabel' className='custom-file-label'>Escolha a imagem</label>
      </div>
      <p>
        <button className='btn btn-primary m-2' onClick={submit}>Confirmar</button>
      </p>
    </div>
  )
}
