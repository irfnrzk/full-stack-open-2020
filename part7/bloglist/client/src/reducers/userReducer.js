import blogService from '../services/blogs'
import loginService from '../services/login'
import { hideNotification, setNotification } from './notificationReducer'

const initialState = null

const userReducer = (state = initialState, action) => {

  switch (action.type) {
    case 'ADD_USER':
      return action.data

    case 'REMOVE_USER':
      return null

    default:
      return state
  }

}

export const initializeUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({
        type: 'ADD_USER',
        data: user
      })
    }
  }
}

export const login = (username, password) => {
  return async dispatch => {
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch({
        type: 'ADD_USER',
        data: user
      })
    } catch (exception) {
      dispatch(setNotification('wrong username or password', 'error'))

      // // reset notification
      setTimeout(() => {
        dispatch(hideNotification())
      }, 2000)
    }
  }
}

export const logout = () => {
  return {
    type: 'REMOVE_USER'
  }
}

export default userReducer