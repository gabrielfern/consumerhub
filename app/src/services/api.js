/* global fetch, localStorage */

export async function getUser (userId) {
  let path = '/api/user'
  if (userId) {
    path = `/api/users/${userId}`
  }
  const headers = {}
  if (localStorage.token) {
    headers.token = localStorage.token
  }
  const res = await fetch(path, { headers })
  return res.json()
}

export async function getAll () {
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
    localStorage.token = (await res.json()).token
  }
  return res.status
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
  return res.status
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
  return res.status
}

export async function changeUserType (userId, type) {
  await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ type })
  })
}

export async function deleteUser (userId, password) {
  let path = '/api/user'
  const body = {}
  if (userId) {
    path = `/api/users/${userId}`
  } else {
    body.password = password
  }
  const res = await fetch(path, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify(body)
  })
  return res.status
}

export async function getStagingProducts (userId) {
  const query = userId ? `?userId=${userId}` : ''
  const res = await fetch(`/api/staging${query}`, {
    headers: {
      token: localStorage.token
    }
  })
  return res.json()
}

export async function getStagingProduct (productId, userId) {
  const query = `?id=${productId}&userId=${userId}`
  const res = await fetch(`/api/staging${query}`, {
    headers: {
      token: localStorage.token
    }
  })
  return res.json()
}

export async function createStagingProduct (productId) {
  const query = productId ? `?id=${productId}` : ''
  const res = await fetch('/api/staging' + query, {
    method: 'POST',
    headers: {
      token: localStorage.token
    }
  })
  if (res.status === 200) {
    return res.json()
  }
}

export async function editStagingProduct (product) {
  await fetch(`/api/staging?id=${product.id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify(product)
  })
}

export async function deleteStagingProduct (productId, userId, msg) {
  const query = `?id=${productId}&userId=${userId}`
  await fetch(`/api/staging${query}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ msg })
  })
}

export async function uploadStagingProductImage (productId, imageNumber, buffer) {
  await fetch(`/api/staging/image/${imageNumber}?id=${productId}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/octet-stream',
      token: localStorage.token
    },
    body: buffer
  })
}

export async function getProducts () {
  const res = await fetch('/api/products')
  return res.json()
}

export async function getProduct (productId) {
  const res = await fetch(`/api/products/${productId}`)
  if (res.status === 200) {
    return res.json()
  }
}

export async function createProduct (productId, userId, msg) {
  const query = `?id=${productId}&userId=${userId}`
  await fetch(`/api/products${query}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ msg })
  })
}

export async function editProduct (productId, userId, msg) {
  await fetch(`/api/products/${productId}?userId=${userId}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ msg })
  })
}

export async function deleteProduct (productId) {
  await fetch(`/api/products/${productId}`, {
    method: 'DELETE',
    headers: {
      token: localStorage.token
    }
  })
}

export async function getProductReviews (productId) {
  const headers = {}
  if (localStorage.token) {
    headers.token = localStorage.token
  }
  const res = await fetch(`/api/products/${productId}/reviews`, {
    headers
  })
  return res.json()
}

export async function createReview (review) {
  await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify(review)
  })
}

export async function editReview (review) {
  await fetch(`/api/reviews/${review.id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify(review)
  })
}

export async function deleteReview (reviewId) {
  await fetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    }
  })
}

export async function getUserReviews (userId) {
  const res = await fetch(`/api/reviews?userId=${userId}`)
  return res.json()
}

export async function voteReview (reviewId, type) {
  await fetch(`/api/reviews/${reviewId}/votes`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ type })
  })
}

export async function deleteReviewVote (reviewId) {
  await fetch(`/api/reviews/${reviewId}/votes`, {
    method: 'DELETE',
    headers: {
      token: localStorage.token
    }
  })
}

export async function getNotifications () {
  const res = await fetch('/api/notifications', {
    headers: {
      token: localStorage.token
    }
  })
  return res.json()
}

export async function editNotification (notificationId, isRead) {
  await fetch(`/api/notifications/${notificationId}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ isRead })
  })
}

export async function deleteNotification (notificationId) {
  await fetch(`/api/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      token: localStorage.token
    }
  })
}

export async function getCategories () {
  const res = await fetch('/api/categories')
  return res.json()
}

export async function createCategory (name) {
  await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ name })
  })
}

export async function editCategory (name, newName) {
  await fetch(`/api/categories?name=${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ name: newName })
  })
}

export async function deleteCategory (name) {
  await fetch(`/api/categories?name=${encodeURIComponent(name)}`, {
    method: 'DELETE',
    headers: {
      token: localStorage.token
    }
  })
}

export async function getProductCategories (productId) {
  const res = await fetch(`/api/products/${productId}/categories`)
  return res.json()
}

export async function setProductCategory (productId, name) {
  await fetch(`/api/products/${productId}/categories`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ name })
  })
}

export async function removeProductCategory (productId, name) {
  await fetch(`/api/products/${productId}/categories`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ name })
  })
}

export async function getFriends () {
  const res = await fetch('/api/user/friends', {
    headers: {
      token: localStorage.token
    }
  })
  return res.json()
}

export async function getFriendships () {
  const res = await fetch('/api/user/friendships', {
    headers: {
      token: localStorage.token
    }
  })
  return res.json()
}

export async function getFriendshipWith (userId) {
  const res = await fetch(`/api/user/friendships/${userId}`, {
    headers: {
      token: localStorage.token
    }
  })
  if (res.status === 200) {
    return res.json()
  }
}

export async function addFriend (userId) {
  await fetch('/api/user/friends', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ user: userId })
  })
}

export async function acceptFriend (userId) {
  await fetch('/api/user/friends', {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ user: userId })
  })
}

export async function deleteFriend (userId) {
  await fetch('/api/user/friends', {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ user: userId })
  })
}

export async function getReports (type, idName, idValue) {
  const query = `?type=${type}&${idName}=${idValue}`
  const res = await fetch(`/api/reports${query}`, {
    headers: {
      token: localStorage.token
    }
  })
  if (res.status === 200) {
    return res.json()
  }
}

export async function createReport (type, idName, idValue, text) {
  const query = `?type=${type}&${idName}=${idValue}`
  await fetch(`/api/reports${query}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.token
    },
    body: JSON.stringify({ text })
  })
}

export async function deleteReport (type, idName, idValue, userId) {
  let query = `?type=${type}&${idName}=${idValue}`
  if (userId) {
    query += '&userId=' + userId
  }
  await fetch(`/api/reports${query}`, {
    method: 'DELETE',
    headers: {
      token: localStorage.token
    }
  })
}
