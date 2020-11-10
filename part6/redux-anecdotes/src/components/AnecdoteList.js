import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import Filter from './Filter'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    const anecdoteToVote = anecdotes.find(n => n.id === id)
    const updateAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1
    }
    dispatch(addVote(updateAnecdote))
    dispatch(setNotification(`you voted '${anecdoteToVote.content}'`, 3000))
  }

  return (
    <>
      <h2>Anecdotes</h2>
      <Filter />
      {anecdotes
        .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        )}
    </>
  )
}

export default AnecdoteList