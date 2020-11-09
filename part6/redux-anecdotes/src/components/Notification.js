import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  const anecdotes = useSelector(state => state.anecdotes)
  const notification = useSelector(state => state.notification)

  return (
    <div>
      {
        notification.length > 0 ?
          notification
            .map(list =>
              <div style={style} key={list.id}>
                {
                  list.content_id ?
                    anecdotes.filter(anecdote => anecdote.id === list.content_id)[0].content
                    : list.content
                }
              </div>
            )
          : null
      }
    </div>
  )
}

export default Notification