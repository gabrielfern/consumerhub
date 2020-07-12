/* global fetch, localStorage */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default () => {
  const history = useHistory()
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/users', {
          headers: {
            token: localStorage.token
          }
        })
        const user = await res.json()
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
        <p><b>Id:</b> {id}</p>
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
