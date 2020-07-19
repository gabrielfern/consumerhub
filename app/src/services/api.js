/* global fetch, localStorage */

export async function getUser () {
  const res = await fetch('/api/users', {
    headers: {
      token: localStorage.token
    }
  })
  return res.json()
}

export async function createUser (user) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  if (res.status === 200) {
    return (await res.json()).token
  }
}

export async function uploadUserImage (buffer) {
  await fetch('/api/users/image', {
    method: 'POST',
    headers: {
      'Content-type': 'application/octet-stream',
      token: localStorage.token
    },
    body: buffer
  })
}

export async function authUser (email, password) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  if (res.status === 200) {
    return (await res.json()).token
  }
}

export async function gauthUser (idToken) {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ idToken })
  })
  if (res.status < 202) {
    const token = (await res.json()).token
    const isNewUser = res.status === 201
    return { token, isNewUser }
  }
}

export async function getProduct (productId) {
  const res = await fetch(`/api/products/${productId}`)
  return res.json()
}

export async function getProducts () {
  const res = await fetch('/api/products')
  return res.json()
}
