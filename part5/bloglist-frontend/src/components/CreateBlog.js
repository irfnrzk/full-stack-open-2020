import React, { useState } from 'react'

const CreateBlog = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: null,
    author: null,
    url: null
  })

  const handlePost = (event) => {
    event.preventDefault()
    createBlog(newBlog)
  }

  return (
    <>
      <h2>create new</h2>
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
    </>
  )
}

export default CreateBlog