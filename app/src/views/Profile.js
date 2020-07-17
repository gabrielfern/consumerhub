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
    <>
      <div>
        <h1>Perfil de usuário</h1>
        <p><button onClick={logout}>Deslogar</button></p>
        <p><b>ID:</b> {id}</p>
        <p><b>Nome:</b> {name}</p>
        <p><b>Email:</b> {email}</p>
      </div>
      <div>
        <br />
        <img
          src={`/api/users/image/${id}`} alt='imagem de usuário'
          style={{ display: 'block', maxWidth: '100%' }}
        />
      </div>
    </>
  )
}