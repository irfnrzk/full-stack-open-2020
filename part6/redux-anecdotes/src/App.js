import React from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const App = () => {
  return (
    <div>
      <AnecdoteList />
      <AnecdoteForm />
      <Notification />
    </div>
  )
}

export default App