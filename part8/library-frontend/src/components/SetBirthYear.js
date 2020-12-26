
import React, { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const EDIT_BIRTHYEAR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo)  {
      name
      born
    }
  }
`

const SetBirthYear = ({ author }) => {
  const [bornYear, setBornYear] = useState(0)
  const [editBirthYear] = useMutation(EDIT_BIRTHYEAR)

  useEffect(() => {
    if (author) {
      setBornYear(author.born)
    }
  }, [author])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (author) {
      const name = author.name
      const setBornTo = Number(bornYear)
      editBirthYear({ variables: { name, setBornTo } })
    } else {
      alert('Nothing to update!')
    }
  }

  return (
    <>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <input
            type='text'
            value={author ? author.name : ''}
            disabled
          />
        </div>
        <div>
          born
          <input
            type='number'
            onChange={({ target }) => { setBornYear(target.value) }}
            value={bornYear ? bornYear : ''}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </>
  )

}

export default SetBirthYear