const initialState = ''

const filterReducer = (state = initialState, action) => {
  // console.log('state now: ', state)
  // console.log('action', action)

  switch (action.type) {
    case 'FILTER_INPUT':
      const updatedInput = action.data
      return updatedInput

    default:
      return state
  }
}

export const filterText = (text) => {
  return {
    type: 'FILTER_INPUT',
    data: text
  }
}

export default filterReducer