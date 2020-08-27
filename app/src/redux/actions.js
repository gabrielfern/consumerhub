/* global localStorage, fetch */
import * as api from '../services/api'

export const CHANGE_LOGGED_STATUS = 'CHANGE_LOGGED_STATUS'
export const CHANGE_USER_DATA = 'CHANGE_USER_DATA'

export function checkLoggedUser () {
  return dispatch => {
    if (localStorage.token) {
      dispatch({
        type: CHANGE_LOGGED_STATUS,
        isLogged: true
      })
    }
  }
}

export function login (email, password) {
  return async dispatch => {
    const token = await api.authUser(email, password)
    localStorage.token = token
    dispatch({
      type: CHANGE_LOGGED_STATUS,
      isLogged: true
    })
  }
}

export function gLogin (gUser) {
  return async dispatch => {
    const idToken = gUser.getAuthResponse().id_token
    const { token, isNewUser } = await api.gauthUser(idToken)
    if (token) {
      localStorage.token = token
      if (isNewUser) {
        const imageUrl = gUser.getBasicProfile().getImageUrl()
        const resp = await fetch(imageUrl)
        await api.uploadUserImage(await resp.arrayBuffer())
      }
      dispatch({
        type: CHANGE_LOGGED_STATUS,
        isLogged: true
      })
    }
  }
}

export function signup (name, email, password, image) {
  return async dispatch => {
    const token = await api.createUser({ name, email, password })
    if (token) {
      localStorage.token = token
      if (image && image.size > 0) {
        await api.uploadUserImage(await image.arrayBuffer())
      }
      dispatch({
        type: CHANGE_LOGGED_STATUS,
        isLogged: true
      })
    }
  }
}

export function logout () {
  return async dispatch => {
    delete localStorage.token
    dispatch({
      type: CHANGE_LOGGED_STATUS,
      isLogged: false
    })
    dispatch({
      type: CHANGE_USER_DATA
    })
  }
}

export function getUser () {
  return async (dispatch, getState) => {
    if (!getState().user.data) {
      const user = await api.getUser()
      dispatch({
        type: CHANGE_USER_DATA,
        data: user
      })
    }
  }
}
