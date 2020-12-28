import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
      value
    }
  }
`

const Login = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      alert(error.graphQLErrors[0].message)
    }
  })

  if (!props.show) {
    return null
  }

  const handleSumbit = async (e) => {
    e.preventDefault()
    console.log({ variables: { username, password } })

    login({ variables: { username, password } })
      .then(res => {
        if (res) {
          localStorage.setItem('token', res.data.login.value)
          setUsername('')
          setPassword('')
          window.location.reload()
        }
      })
      .catch(err => {
        console.log(err)
        alert(err.message)
      })
  }

  return (
    <>
      <form onSubmit={handleSumbit}>
        <div>
          name
          <input
            type='username'
            onChange={({ target }) => (setUsername(target.value))}
          />
        </div>
        <div>
          password
          <input
            type='password'
            onChange={({ target }) => (setPassword(target.value))}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </>
  )

}

export default Login