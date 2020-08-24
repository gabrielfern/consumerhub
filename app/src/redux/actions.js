/* global localStorage, fetch */
import {
  authUser,
  getUser as apiGetUser,
  gauthUser,
  uploadUserImage,
  createUser
} from '../services/api'
export const USER_LOGGED_CHANGE = 'USER_LOGGED_CHANGE'
export const USER_DATA = 'USER_DATA'

export function checkLoggedUser () {
  return dispatch => {
    if (localStorage.token) {
      dispatch({
        type: USER_LOGGED_CHANGE,
        logged: true
      })
    }
  }
}

export function login (email, password) {
  return async dispatch => {
    const token = await authUser(email, password)
    localStorage.token = token
    dispatch({
      type: USER_LOGGED_CHANGE,
      logged: true
    })
  }
}

export function gLogin (gUser) {
  return async dispatch => {
    const idToken = gUser.getAuthResponse().id_token
    const { token, isNewUser } = await gauthUser(idToken)
    if (token) {
      localStorage.token = token
      if (isNewUser) {
        const imageUrl = gUser.getBasicProfile().getImageUrl()
        const resp = await fetch(imageUrl)
        await uploadUserImage(await resp.arrayBuffer())
      }
      dispatch({
        type: USER_LOGGED_CHANGE,
        logged: true
      })
    }
  }
}

export function signup (name, email, password, image) {
  return async dispatch => {
    const token = await createUser({ name, email, password })
    if (token) {
      localStorage.token = token
      if (image && image.size > 0) {
        await uploadUserImage(await image.arrayBuffer())
      }
      dispatch({
        type: USER_LOGGED_CHANGE,
        logged: true
      })
    }
  }
}

export function logout () {
  return async dispatch => {
    delete localStorage.token
    dispatch({
      type: USER_LOGGED_CHANGE,
      logged: false
    })
    dispatch({
      type: USER_DATA
    })
  }
}

export function getUser () {
  return async (dispatch, getState) => {
    if (!getState().user) {
      const user = await apiGetUser()
      dispatch({
        type: USER_DATA,
        user
      })
    }
  }
}
