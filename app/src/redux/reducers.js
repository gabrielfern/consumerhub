import { combineReducers } from 'redux'
import {
  CHANGE_LOGGED_STATUS,
  CHANGE_USER_DATA
} from './actions'

const initialState = {
  isLogged: false
}

function user (state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOGGED_STATUS:
      return Object.assign({}, state, { isLogged: action.isLogged })
    case CHANGE_USER_DATA:
      return Object.assign({}, state, { data: action.data })
    default:
      return state
  }
}

export default combineReducers({
  user
})
