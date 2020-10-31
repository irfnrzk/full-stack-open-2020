import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({
    title: null,
    author: null,
    url: null
  })
  // const [errorMessage, setErrorMessage] = useState(null)

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
      // setErrorMessage('Wrong credentials')
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const handlePost = (event) => {
    event.preventDefault()
    // console.log(newBlog)
    blogService
      .create(newBlog)
      .then(blog =>
        setBlogs(blogs.concat(blog))
      )
  }

  const loginForm = () => (
    <>
      <h1>login in to application</h1>
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

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <div>{user.name} logged in
        <button
          onClick={handleLogout}
        >logout</button>
      </div>
      <br />
      <div>
        <h1>create new</h1>
        <form onSubmit={handlePost}>
          <div>
            title
            <input
              type="text"
              name="title"
              onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
            />
          </div>
          <div>
            author
            <input
              type="author"
              name="author"
              onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
            />
          </div>
          <div>
            url
            <input
              type="url"
              name="url"
              onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
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