import React from 'react'

const Comment = ({ blog }) => {

  if (blog.comments.length === 0) {
    return (
      <>
        not available
      </>
    )
  }

  return (
    <>
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