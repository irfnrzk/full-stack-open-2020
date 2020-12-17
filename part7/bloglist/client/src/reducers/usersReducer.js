import userService from "../services/users"
import { hideNotification, setNotification } from "./notificationReducer"

const initialState = []

const usersReducer = (state = initialState, action) => {

  switch (action.type) {
    case 'INIT_USERS':
      return action.data

    default:
      return state
  }

}

export const initializeUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    console.log(users)
    dispatch({
      type: 'INIT_USERS',
      data: users
    })
  }
}
export default usersReducer