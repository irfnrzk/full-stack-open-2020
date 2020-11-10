import React from 'react'
import { connect } from 'react-redux'
// import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import Filter from './Filter'

const AnecdoteList = (props) => {
  // const anecdotes = useSelector(state => state.anecdotes)
  // const filter = useSelector(state => state.filter)
  // const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    const anecdoteToVote = props.anecdotes.find(n => n.id === id)
    const updateAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1
    }
    // console.log(updateAnecdote)
    props.addVote(updateAnecdote)
    props.setNotification(`you voted '${anecdoteToVote.content}'`, 3000)
  }

  return (
    <>
      <h2>Anecdotes</h2>
      <Filter />
      {props.anecdotes
        .filter(anecdote => anecdote.content.toLowerCase().includes(props.filter.toLowerCase()))
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

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter
  }
}

const mapDispatchToProps = {
  addVote,
  setNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)