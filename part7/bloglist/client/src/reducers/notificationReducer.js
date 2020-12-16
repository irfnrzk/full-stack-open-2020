const initialState = false

const notificationReducer = (state = initialState, action) => {

  switch (action.type) {
    case 'HIDE_NOTIFICATION':
      return false

    case 'SET_NOTIFICATION':
      return true

    default:
      return state
  }

}

export const hideNotification = () => {
  return {
    type: 'HIDE_NOTIFICATION'
  }
}

export const setNotification = () => {
  return {
    type: 'SET_NOTIFICATION'
  }
}

export default notificationReducer