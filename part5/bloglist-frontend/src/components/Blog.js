import React, { useState } from 'react'

const Blog = ({ blog, addLike, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const updateLikes = (event) => {
    event.preventDefault()
    addLike({
      id: blog.id,
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes
    })
  }

  const deletePost = (event) => {
    event.preventDefault()
    removeBlog(blog.id)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button
          onClick={() => { setVisible(!visible) }}
        >{!visible ? 'view' : 'hide'}
        </button>
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes} <button onClick={updateLikes}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <button
          style={{
            display: (blog.user.username === JSON.parse(window.localStorage.getItem('loggedBloglistUser')).username) ? '' : 'none'
          }}
          onClick={deletePost}
        >remove</button>
      </div>
    </div >
  )
}

export default Blog
