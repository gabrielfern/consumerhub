/* global fetch, localStorage */

export async function getUser () {
  const res = await fetch('/api/user', {
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
    localStorage.token = (await res.json()).token
  }
}

export async function uploadUserImage (buffer) {
  await fetch('/api/user/image', {
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
    localStorage.token = (await res.json()).token
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
    localStorage.token = (await res.json()).token
    const isNewUser = res.status === 201
    return { isNewUser }
  }
}

export async function editUser (password, name, email, newPassword) {
  const body = { values: {} }
  if (password) {
    body.password = password
    name && Object.assign(body.values, { name })
    email && Object.assign(body.values, { email })
    newPassword && Object.assign(body.values, { password: newPassword })
  } else {
    name && Object.assign(body.values, { name })
  }

  const res = await fetch('/api/user', {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify(body)
  })
  if (password && res.status === 200) {
    localStorage.token = (await res.json()).token
  }
}

export async function createProduct () {
  const res = await fetch('/api/staging', {
    method: 'POST',
    headers: {
      token: localStorage.token
    }
  })
  if (res.status === 200) {
    return await res.json()
  }
}

export async function uploadProductImage (productId, imageNumber, buffer) {
  await fetch(`/api/staging/image/${imageNumber}?id=${productId}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/octet-stream',
      token: localStorage.token
    },
    body: buffer
  })
}

export async function editProduct (product) {
  await fetch(`/api/staging?id=${product.id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify(product)
  })
}

export async function getStagingProducts () {
  const res = await fetch('/api/staging', {
    headers: {
      token: localStorage.token
    }
  })
  return res.json()
}

export async function getStagingProduct (productId) {
  const res = await fetch(`/api/staging?id=${productId}`, {
    headers: {
      token: localStorage.token
    }
  })
  return res.json()
}

export async function getStagingProductImage (productId, imageNumber) {
  const res = await fetch(`/api/staging/image/${imageNumber}?id=${productId}`, {
    headers: {
      token: localStorage.token
    }
  })
  return res.blob()
}
