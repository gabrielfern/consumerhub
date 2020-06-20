import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default () => {
  const { id } = useParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/users/${id}`)
        const user = await res.json()
        setName(user.name)
        setEmail(user.email)
      } catch {}
    })()
  }, [id])

  return (
    <>
      <div>
        <h1>Perfil de usuário</h1>
        <p><b>Nome:</b> {name}</p>
        <p><b>Email:</b> {email}</p>
      </div>
      <div>
        <br />
        <img src={`/api/users/${id}/image`} alt='imagem de usuário' />
      </div>
    </>
  )
}
