import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { hideNotification, setNotification } from '../reducers/notificationReducer'
import Filter from './Filter'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    dispatch(addVote(id))
    dispatch(setNotification(id))
    setTimeout(() => {
      dispatch(hideNotification(id))
    }, 3000);
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