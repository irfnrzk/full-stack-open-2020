import React, { useRef } from 'react'
import {
  Switch, Route, Link, useParams
} from "react-router-dom"
import Blog from '../components/Blog'
import CreateBlog from '../components/CreateBlog'
import Notification from '../components/Notification'
import Togglable from '../components/Toggleable'
import { useSelector } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@material-ui/core'
import MenuHeader from './MenuHeader'


const Home = () => {
  const blogFormRef = useRef()
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)

  if (!user) {
    return null
  }

  return (
    <div>
      <MenuHeader />
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
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {blogs.map(blog =>
                  <TableRow key={blog.id}>
                    <TableCell>
                      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                    </TableCell>
                    <TableCell>
                      {blog.author}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
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