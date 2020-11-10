const initialState = []

const notificationReducer = (state = initialState, action) => {
  // console.log('state now: ', state)
  // console.log('action', action)

  switch (action.type) {
    case 'HIDE_NOTIFICATION':
      const cloneState = [...state]
      cloneState.splice(0, 1)

      return cloneState

    case 'SET_NOTIFICATION':
      const newState = {
        id: action.data.id,
        content: action.data.content
      }
      return [...state, newState]

    default:
      return state
  }
}

export const hideNotification = () => {
  return {
    type: 'HIDE_NOTIFICATION'
  }
}

let count = 0;
export const setNotification = (anecdote, time) => {
  const _id = count
  count++
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        id: _id,
        content: anecdote
      }
    })
    setTimeout(() => {
      dispatch({
        type: 'HIDE_NOTIFICATION'
      })
    }, time)
  }
}

export default notificationReducer