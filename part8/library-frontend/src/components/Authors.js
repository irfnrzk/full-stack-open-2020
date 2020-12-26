
import React, { useEffect, useState } from 'react'
import SetBirthYear from './SetBirthYear'

const Authors = (props) => {
  const [author, setAuthor] = useState(null)

  useEffect(() => {
    if (authors.length > 0) {
      setAuthor(authors[0])
    }
    // eslint-disable-next-line
  }, [])

  if (!props.show) {
    return null
  }
  const authors = props.authors

  const handleSelect = (e) => {
    setAuthor(authors.filter(a => a.name === e.target.value)[0])
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <h2>Set birthyear</h2>
      </div>
      <select onChange={handleSelect}>
        {
          authors.map(x => (
            <option key={x.name} value={x.name}>{x.name}</option>
          ))
        }
      </select>
      <SetBirthYear author={author} />
    </div>
  )
}

export default Authors
