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
        content_id: action.data.content_id,
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

export const setNotification = (id, anecdote) => {
  const _id = count
  count++
  return {
    type: 'SET_NOTIFICATION',
    data: {
      id: _id,
      content_id: id,
      content: anecdote
    }
  }
}

export default notificationReducer