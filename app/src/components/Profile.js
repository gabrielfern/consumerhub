/* global fetch, localStorage */
import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'

export default () => {
  const { id } = useParams()
  const history = useHistory()
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
        setName(user.name)
        setEmail(user.email)
      } catch {}
    })()
  }, [id])

  function logout () {
    delete localStorage.token
    history.push('/')
  }

  return (
    <>
      <div>
        <h1>Perfil de usuário</h1>
        <p><button onClick={logout}>Deslogar</button></p>
        <p><b>Nome:</b> {name}</p>
        <p><b>Email:</b> {email}</p>
      </div>
      <div>
        <br />
        <img
          src={`/api/users/${id}/image`} alt='imagem de usuário'
          style={{ display: 'block', maxWidth: '100%' }}
          onError={() => {
            fetch('/api/users/image', {
              headers: { token: localStorage.token }
            }).then(r => r.blob()).then(d => {
              document.getElementsByTagName('img')[0].src = window.URL.createObjectURL(d)
            })
          }}
        />
      </div>
    </>
  )
}
