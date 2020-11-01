import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState('some error happened...')
  const [showNotification, setShowNotification] = useState(false)
  const [styleClass, setStyleClass] = useState('')

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      )
    }
  }, [user])

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
      setStyleClass(`error`)
      setShowNotification(true)

      // reset notification
      setTimeout(() => {
        setShowNotification(false)
      }, 2000);
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(blog => {
        setBlogs(blogs.concat(blog))
        setSuccessMessage(`a new blog ${blog.title} by ${blog.author} added`)
        setStyleClass(`success`)
        setShowNotification(true)

        // reset notification
        setTimeout(() => {
          setShowNotification(false)
        }, 2000)
      })
  }

  const updateLikes = (blogObject) => {
    blogService
      .update({ ...blogObject, likes: blogObject.likes + 1 })
      .then(updatedBlog => {
        // update list
        setBlogs(blogs.map(blog =>
          blog.id !== updatedBlog.id ? blog : updatedBlog)
        )
      })
  }

  const loginForm = () => (
    <>
      <h1>login in to application</h1>
      {
        showNotification &&
        <Notification message={successMessage} styleClass={styleClass} />
      }
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
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
      {
        showNotification &&
        <Notification message={successMessage} styleClass={styleClass} />
      }
      <div>{user.name} logged in
        <button
          onClick={handleLogout}
        >logout</button>
      </div>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <CreateBlog createBlog={addBlog} />
      </Togglable>
      <div>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            addLike={updateLikes}
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