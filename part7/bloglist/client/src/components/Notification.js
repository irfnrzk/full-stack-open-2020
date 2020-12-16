import React from 'react'
import '../App.css'

const Notification = ({ message, styleClass }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={styleClass}>
      {message}
    </div>
  )
}

export default Notification