
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription
} from '@apollo/client'
import Login from './components/Login'
import Recommended from './components/Recommended'

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

const ALL_ME = gql`
  query {
    me {
      username,
      favoriteGenre
    }
  }
`

const ALL_RECOMMENDED_BOOKS = gql`
  query allBooks($genre: String!){
    allBooks(genre: $genre){
      title,
      author{
        name
      },
      published
    }
  }
`

const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title,
      published
      author {
        name
      }
    }
  }
`

const BOOK_ADDED = gql`
  subscription{
    bookAdded{
      title
      author{
        name
      }
    }
  }
`

const App = () => {
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const genres = useQuery(ALL_GENRES)
  const me = useQuery(ALL_ME)
  const [getBooks, result] = useLazyQuery(ALL_RECOMMENDED_BOOKS, { fetchPolicy: 'no-cache' })
  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      alert(error.graphQLErrors[0].message)
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_BOOKS })
      store.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...dataInStore,
          allBooks: [...dataInStore.allBooks, response.data.addBook]
        }
      })
    }
  })

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
      window.alert(`${subscriptionData.data.bookAdded.title} by ${subscriptionData.data.bookAdded.author.name} has been added!`)
    }
  })

  const client = useApolloClient()
  const [page, setPage] = useState('authors')

  if (authors.loading || books.loading || genres.loading || me.loading) {
    return <div>loading...</div>
  }

  const showGenre = () => {
    getBooks({ variables: { genre: me.data.me.favoriteGenre } })
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
        <button onClick={() => { showGenre(); setPage('recommended') }}>recommended</button>
        <button onClick={handleLogout}>logout</button>
      </>
    )
  }

  const handleAddBook = (param) => {
    addBook(param)
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
        addBook={handleAddBook}
      />

      <Recommended
        show={page === 'recommended'}
        genre={me.data.me ? me.data.me.favoriteGenre : null}
        books={result.data}
      />

      <Login
        show={page === 'login'}
      />

    </div>
  )
}

export default App