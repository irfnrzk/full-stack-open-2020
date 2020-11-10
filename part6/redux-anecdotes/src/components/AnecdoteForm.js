import React from 'react'
import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/anecdoteReducer'
import { hideNotification, setNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdoteService'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const getId = () => (100000 * Math.random()).toFixed(0)

  const asObject = (anecdote) => {
    return {
      content: anecdote,
      id: getId(),
      votes: 0
    }
  }

  const addAnecdote = (event) => {
    event.preventDefault()
    const anecdote = asObject(event.target.anecdote.value)
    event.target.anecdote.value = ''
    anecdoteService
      .create(anecdote)
      .then(anecdote => {
        dispatch(createNote(anecdote))
        dispatch(setNotification(null, anecdote.content))
        setTimeout(() => {
          dispatch(hideNotification())
        }, 3000);
      })
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default AnecdoteForm