/* global localStorage */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getUser } from '../services/api'

export default () => {
  const history = useHistory()
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser()
        setId(user.id)
        setName(user.name)
        setEmail(user.email)
      } catch {}
    })()
  }, [])

  function logout () {
    delete localStorage.token
    history.push('/')
  }

  return (
    <div className='container my-3'>
      <div>
        <h1>Perfil de usuário</h1>
        <p>
          <button className='btn btn-secondary m-2' onClick={logout}>Deslogar</button>
          <button className='btn btn-secondary m-2' onClick={() => history.push('/products')}>Produtos</button>
        </p>
        <p><b>ID:</b> {id}</p>
        <p><b>Nome:</b> {name}</p>
        <p><b>Email:</b> {email}</p>
      </div>
      <div>
        {id &&
          <img
            src={`/api/users/${id}/image`} alt='imagem de usuário'
            style={{ display: 'block', maxWidth: '100%' }}
          />}
      </div>
    </div>
  )
}
