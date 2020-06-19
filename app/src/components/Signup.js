import React, { useState } from 'react'

export default () => {
  let [name, setName] = useState('')
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')

  function submit() {
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    }).then(res => {
      if (res.status === 200) {
        setName('')
        setEmail('')
        setPassword('')
        res.json().then(console.log)
      }
    })
  }

  return (
    <>
      <h1>Se inscreva</h1>
      <span> Nome </span>
      <input type='text' value={name} onChange={e => setName(e.target.value)} />
      <span> Email </span>
      <input type='text' value={email} onChange={e => setEmail(e.target.value)} />
      <span> Senha </span>
      <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
      <span> </span>
      <button onClick={submit}>Confirmar</button>
    </>
  )
}
