import React, { useState } from 'react'

const Blog = ({ blog, addLike, removeBlog, username }) => {
  const [visible, setVisible] = useState(false)

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
    <div className='blog_content' style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button name='toggleView'
          onClick={() => { setVisible(!visible) }}
        >{!visible ? 'view' : 'hide'}
        </button>
      </div>
      <div className={!visible ? 'd-none' : null}>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes} <button name='likes' onClick={updateLikes}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <button
          style={{
            display: (blog.user.username === username) ? '' : 'none'
          }}
          name='deleteBlog'
          onClick={deletePost}
        >remove</button>
      </div>
    </div >
  )
}

export default Blog
