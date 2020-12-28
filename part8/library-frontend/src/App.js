
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useApolloClient, useQuery } from '@apollo/client'
import Login from './components/Login'

const ALL_AUTHORS = gql`
  query {
    allAuthors{
      name,
      born,
      bookCount
    }
  }
`
const ALL_BOOKS = gql`
  query {
    allBooks{
      title,
      published,
      genres,
      author {
        name
      }
    }
  }
`

const ALL_GENRES = gql`
  query {
    allGenres
  }
`

const App = () => {
  const authors = useQuery(ALL_AUTHORS, {
    // pollInterval: 2000
  })
  const books = useQuery(ALL_BOOKS, {
    // pollInterval: 2000
  })
  const genres = useQuery(ALL_GENRES, {
    // pollInterval: 2000
  })
  const client = useApolloClient()
  const [page, setPage] = useState('authors')

  if (authors.loading || books.loading) {
    return <div>loading...</div>
  }

  const Buttons = () => {

    const handleLogout = () => {
      localStorage.clear()
      client.resetStore()
      window.location.reload()
    }

    return (
      <>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={handleLogout}>logout</button>
      </>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          localStorage.getItem('token') ?
            <Buttons /> :
            <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors
        show={page === 'authors'}
        authors={authors.data.allAuthors}
      />

      <Books
        show={page === 'books'}
        books={books.data.allBooks}
        genres={genres.data.allGenres}
      />

      <NewBook
        show={page === 'add'}
      />

      <Login
        show={page === 'login'}
      />

    </div>
  )
}

export default App