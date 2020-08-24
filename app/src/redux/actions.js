/* global localStorage */
import { authUser, getUser as apiGetUser } from '../services/api'
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
