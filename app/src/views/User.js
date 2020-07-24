import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getUserById } from '../services/api'

export default () => {
  const { userId } = useParams()
  const [id, setId] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const user = await getUserById(userId)
        setId(user.id)
        setName(user.name)
      } catch {}
    })()
  }, [userId])

  return (
    <div className='container my-3'>
      <div>
        <h1>Perfil de usuário</h1>
        <p><b>ID:</b> {id}</p>
        <p><b>Nome:</b> {name}</p>
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
