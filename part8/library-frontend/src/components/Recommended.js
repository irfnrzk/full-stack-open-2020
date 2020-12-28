import React from 'react'

const Recommended = (props) => {

  if (!props.show) {
    return null
  }

  if (!props.books) {
    return <>loading...</>
  }

  return (
    <>
      <h2>recommendation</h2>
      <div>
        books in your favorite genre <b>{props.genre}</b>
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
            {props.books.allBooks.map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )

}

export default Recommended