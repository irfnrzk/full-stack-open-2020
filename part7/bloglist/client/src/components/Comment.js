import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addComment } from '../reducers/blogReducer'

const Comment = ({ blog }) => {
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')

  if (blog.comments.length === 0) {
    return (
      <>
        not available
      </>
    )
  }

  const handlePost = (e) => {
    e.preventDefault()
    dispatch(addComment(blog.id, comment))
  }

  const handleChange = (e) => {
    setComment(e.target.value)
  }

  return (
    <>
      <div>
        <form onSubmit={handlePost}>
          <input
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">add comment</button>
        </form>
      </div>
      <ul>
        {
          blog.comments.map(comment => (
            <li key={comment.id}>{comment.body}</li>
          ))
        }
      </ul>
    </>
  )

}

export default Comment