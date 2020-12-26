
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useQuery } from '@apollo/client'

const ALL_AUTHORS = gql`
  query {
    allAuthors{
      name,
      born,
      bookCount
    }
  }
`
export const ALL_BOOKS = gql`
  query {
    allBooks{
      title,
      published,
      author {
        name
      }
    }
  }
`

const App = () => {
  const authors = useQuery(ALL_AUTHORS, {
    // pollInterval: 2000
  })
  const books = useQuery(ALL_BOOKS, {
    // pollInterval: 2000
  })
  const [page, setPage] = useState('authors')

  if (authors.loading || books.loading) {
    return <div>loading...</div>
  }

  console.log(books.data.allBooks ? 'ada' : 'xde')

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'}
        authors={authors.data.allAuthors}
      />

      <Books
        show={page === 'books'}
        books={books.data.allBooks}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App