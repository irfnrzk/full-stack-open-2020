import React, { useState, useEffect } from 'react'
import Notification from '../components/Notification'
import { useSelector, useDispatch } from 'react-redux'
import { login, initializeUser } from '../reducers/userReducer'

const Login = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps  

  if (user) {
    return null
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(login(username, password))
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <h1>login in to application</h1>
      <Notification />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

export default Login