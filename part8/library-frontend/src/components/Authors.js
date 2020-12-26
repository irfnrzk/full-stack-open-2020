
import React, { useState } from 'react'
import SetBirthYear from './SetBirthYear'

const Authors = (props) => {
  const [author, setAuthor] = useState(null)
  if (!props.show) {
    return null
  }
  const authors = props.authors

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
            <tr key={a.name} onClick={() => { console.log(a); setAuthor(a) }}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <SetBirthYear author={author} />
    </div>
  )
}

export default Authors
