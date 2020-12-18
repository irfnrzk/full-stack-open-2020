import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../reducers/userReducer'
import {
  AppBar,
  Toolbar,
  IconButton,
  Button
} from '@material-ui/core'

const MenuHeader = () => {

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    dispatch(logout())
  }
  const padding = { padding: 5 }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Button color="inherit">
          <Link to="/blogs">blogs</Link>
        </Button>
        <Button color="inherit">
          <Link to="/users">users</Link>
        </Button>
        <Button onClick={handleLogout}>logout</Button>
        <span style={padding}>{user.name} logged in</span>
        {/* <button
          name='logout'
          onClick={handleLogout}
        >logout</button> */}
      </Toolbar>
    </AppBar >
  )


}

export default MenuHeader