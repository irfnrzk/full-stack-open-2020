import React from 'react'
import {
  useParams, Redirect
} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { addLike, deleteBlog } from '../reducers/blogReducer'

const Blog = ({ blogs, username }) => {
  const dispatch = useDispatch()
  const redirectToBlog = useSelector(state => state.redirectToBlog)

  const id = useParams().id
  const blog = blogs.find(n => n.id === id)
  if (!blog) {
    return null
  }

  const updateLikes = (event) => {
    event.preventDefault()
    dispatch(addLike({
      id: blog.id,
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes
    }))
  }

  const deletePost = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id, blog.title, blog.author))
    }
  }

  if (redirectToBlog) {
    return <Redirect to="/blogs" />;
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
        <div>
          {blog.likes} likes
          <button name='likes' onClick={updateLikes}>like</button>
        </div>
        <div>added by {blog.author}</div>
        <button
          style={{
            display: (blog.user.username === username) ? '' : 'none'
          }}
          name='deleteBlog'
          onClick={deletePost}
        >remove</button>
      </div>
    </div>
  )
}

export default Blog
