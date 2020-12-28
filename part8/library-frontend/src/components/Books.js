import React, { useEffect, useState } from 'react'

const Books = (props) => {
  const [filteredBooks, setFilteredBooks] = useState([])
  const [genre, setGenre] = useState(null)
  const books = props.books

  useEffect(() => {
    setFilteredBooks(books)
  }, [books])

  if (!props.show) {
    return null
  }

  const genres = props.genres

  const handleClick = (e) => {
    e.preventDefault()
    setGenre(e.target.value)
    setFilteredBooks(books.filter(x => x.genres.includes(e.target.value)))
  }

  const handleAll = (e) => {
    e.preventDefault()
    setGenre(null)
    setFilteredBooks(books)
  }

  return (
    <div>
      <h2>books</h2>
      <div>in genre {genre ? genre : 'ALL'}</div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {genres.map(genre => <button key={genre} value={genre} onClick={handleClick}>{genre}</button>)}
        <button onClick={handleAll}>all genres</button>
      </div>
    </div>
  )
}

export default Books