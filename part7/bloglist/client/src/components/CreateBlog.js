import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

const CreateBlog = () => {
  const dispatch = useDispatch()
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handlePost = (event) => {
    event.preventDefault()
    dispatch(createBlog(newBlog))
    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
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
            value={newBlog.title}
            onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
          />
        </div>
        <div>
          author
          <input
            type="text"
            name="author"
            value={newBlog.author}
            onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
          />
        </div>
        <div>
          url
          <input
            type="url"
            name="url"
            value={newBlog.url}
            onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default CreateBlog