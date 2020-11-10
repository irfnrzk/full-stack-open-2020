import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import anecdoteService from './services/anecdoteService'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    anecdoteService
      .getAll()
      .then(anecdotes =>
        dispatch(initializeAnecdotes(anecdotes))
      )
  }, [dispatch])

  return (
    <div>
      <AnecdoteList />
      <AnecdoteForm />
      <Notification />
    </div>
  )
}

export default App