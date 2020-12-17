import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlog } from './reducers/blogReducer'
import { login, logout, initializeUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import users from './services/users'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    if (user) {
      dispatch(initializeBlog())
      dispatch(initializeUsers())
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps  

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(login(username, password))
    setUsername('')
    setPassword('')
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    dispatch(logout())
  }

  const loginForm = () => (
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

  const blogFormRef = useRef()

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>{user.name} logged in
        <button
          name='logout'
          onClick={handleLogout}
        >logout</button>
      </div>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <CreateBlog />
      </Togglable>
      <div className='blog_list'>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            username={JSON.parse(window.localStorage.getItem('loggedBloglistUser')).username}
          />
        )}
      </div>
      {
        userForm()
      }
    </div>
  )

  const userForm = () => (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        {
          users.map(el => (
            <tr>
              <td>{el.name ? el.name : el.username}</td>
              <td>{el.blogs.length}</td>
            </tr>
          ))
        }
      </table>
    </div>
  )

  return (
    <div>
      {user === null ?
        loginForm() :
        blogForm()
      }
    </div>
  )
}

export default App