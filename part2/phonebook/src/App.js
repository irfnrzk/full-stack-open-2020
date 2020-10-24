import React, { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
    console.log(persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase())))
  }

  const addName = (event) => {
    event.preventDefault()

    console.log(newName)
    console.log(persons)
    console.log(persons.filter(person => person.name === newName))

    // check if name already exists
    if (persons.filter(person => person.name === newName)[0]) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat({ name: newName, number: newNumber }))
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with
        <input
          value={newSearch}
          onChange={handleSearchChange}
        />
      </div>
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <div>
          name:
          <input
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>number:
          <input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {
          (newSearch === '') ?
            persons.map(person => <li key={person.name}>{person.name} {person.number}</li>) :
            persons
              .filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
              .map(person => <li key={person.name}>{person.name} {person.number}</li>)
        }
      </ul>
    </div>
  )
}

export default App