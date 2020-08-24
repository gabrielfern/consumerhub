import {
  USER_LOGGED_CHANGE,
  USER_DATA
} from './actions'

function rootReducer (state = { logged: false }, action) {
  switch (action.type) {
    case USER_LOGGED_CHANGE:
      return Object.assign({}, state, { logged: action.logged })
    case USER_DATA:
      return Object.assign({}, state, { user: action.user })
    default:
      return state
  }
}

export default rootReducer
