import React, { useRef } from 'react'
import {
  Switch, Route, Link, useParams
} from "react-router-dom"
import Blog from '../components/Blog'
import CreateBlog from '../components/CreateBlog'
import Notification from '../components/Notification'
import Togglable from '../components/Toggleable'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../reducers/userReducer'


const Home = () => {
  const blogFormRef = useRef()
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    dispatch(logout())
  }


  const padding = { padding: 5 }

  if (!user) {
    return null
  }

  return (
    <div>
      <div style={{ background: '#d3d3d3', padding: '5px' }}>
        <Link style={padding} to="/blogs">blogs</Link>
        <Link style={padding} to="/users">users</Link>
        <span style={padding}>{user.name} logged in</span>
        <button
          name='logout'
          onClick={handleLogout}
        >logout</button>
      </div>
      <Notification />
      <Switch>
        <Route path="/users/:id">
          <UserBlog users={users} />
        </Route>
        <Route path="/users">
          <Users users={users} />
        </Route>
        <Route path="/blogs/:id">
          <Blog
            blogs={blogs}
            username={JSON.parse(window.localStorage.getItem('loggedBloglistUser')).username}
          />
        </Route>
        <Route path="/blogs">
          <h2>blogs</h2>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <CreateBlog />
          </Togglable>
          <div className='blog_list'>
            {blogs.map(blog =>
              <div key={blog.id} className='blog_content' style={blogStyle}>
                <div>
                  <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
                </div>
              </div>
            )}
          </div>
        </Route>
      </Switch>
    </div>
  )
}

const Users = ({ users }) => (
  <div>
    <h2>users</h2>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {
          users.map(el => (
            <tr key={el.id}>
              <td><Link to={`/users/${el.id}`}>{el.name ? el.name : el.username}</Link></td>
              <td>{el.blogs.length}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
)

const UserBlog = ({ users }) => {
  const id = useParams().id
  const user = users.find(n => n.id === id)
  if (!user) {
    return null
  }

  const Content = ({ user }) => {
    return (
      <div>
        <h3>added blogs</h3>
        <ul>
          {
            user.blogs.map(user => (
              <li key={user.id}>{user.title}</li>
            ))
          }
        </ul>
      </div>
    )
  }

  return (
    <div>
      <h2>{user.name ? user.name : user.username}</h2>
      {
        user.blogs.length === 0 ? <div>No entries</div> :
          <Content user={user} />
      }
    </div>
  )
}

export default Home