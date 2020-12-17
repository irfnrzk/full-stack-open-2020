const initialState = {
  visibility: false,
  message: '',
  style: ''
}

const notificationReducer = (state = initialState, action) => {

  switch (action.type) {
    case 'HIDE_NOTIFICATION':
      return { ...state, visibility: false, message: action.data.message, style: action.data.style }

    case 'SET_NOTIFICATION':
      return { ...state, visibility: true, message: action.data.message, style: action.data.style }

    default:
      return state
  }

}

export const hideNotification = () => {
  return {
    type: 'HIDE_NOTIFICATION',
    data: {
      message: '',
      style: ''
    }
  }
}

export const setNotification = (message, style) => {
  return {
    type: 'SET_NOTIFICATION',
    data: {
      message: message,
      style: style
    }
  }
}

export default notificationReducer