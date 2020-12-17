import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useSelector, useDispatch } from 'react-redux'
import { hideNotification, setNotification } from './reducers/notificationReducer'
import { initializeBlog } from './reducers/blogReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState('some error happened...')
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const [styleClass, setStyleClass] = useState('')

  useEffect(() => {
    if (user) {
      dispatch(initializeBlog())
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps  

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      console.log(user)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setSuccessMessage('wrong username or password')
      setStyleClass('error')
      dispatch(setNotification())

      // reset notification
      setTimeout(() => {
        dispatch(hideNotification())
      }, 2000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const deletePost = (id) => {
    // console.log(id)
    const title = blogs.filter(blog => blog.id === id)[0].title
    const author = blogs.filter(blog => blog.id === id)[0].author
    if (window.confirm(`Remove blog ${title} by ${author}?`))
      blogService
        .remove(id)
        .then(updatedBlog => { // eslint-disable-line
          // update list
          // setBlogs(blogs
          //   .filter(blog =>
          //     blog.id !== id
          //   )
          //   .sort((a, b) => b.likes - a.likes)
          // )
          setSuccessMessage(`${title} by ${author} removed`)
          setStyleClass('success')
          dispatch(setNotification())

          // reset notification
          setTimeout(() => {
            dispatch(hideNotification())
          }, 2000)
        })
        .catch(err => {
          setSuccessMessage(err.response.data)
          setStyleClass('error')
          dispatch(setNotification())

          // reset notification
          setTimeout(() => {
            dispatch(hideNotification())
          }, 2000)
        })
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