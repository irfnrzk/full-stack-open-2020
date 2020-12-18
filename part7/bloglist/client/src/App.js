import React, { useEffect, } from 'react'
import {
  Switch, Route, Redirect
} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlog } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import Login from './components/Login'
import Home from './components/Home'
import Container from '@material-ui/core/Container'

const App = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      dispatch(initializeBlog())
      dispatch(initializeUsers())
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps  

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  return (
    <Container maxWidth="lg">
      <Switch>
        <Route path="/users">
          {!localStorage.getItem('loggedBloglistUser') ? <Redirect to="/login" /> : <Home />}
        </Route>
        <Route path="/blogs">
          {!localStorage.getItem('loggedBloglistUser') ? <Redirect to="/login" /> : <Home />}
        </Route>
        <Route path="/login">
          {localStorage.getItem('loggedBloglistUser') ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route path="/">
          {!localStorage.getItem('loggedBloglistUser') ? <Redirect to="/login" /> : <Redirect to="/blogs" />}
        </Route>
      </Switch>
    </Container>
  )
}

export default App