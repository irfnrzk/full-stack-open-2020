import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

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

  const handleDeletePerson = (event) => {

    const _id = parseInt(event.target.attributes['data-id'].value);

    event.preventDefault();
    if (window.confirm(`Delete ${event.target.attributes['data-name'].value}`)) {
      personService
        .remove(_id)
        .then(res => {
          setPersons(persons.filter(n => n.id !== _id))
        })
    }

  }

  const addName = (event) => {
    event.preventDefault()

    // console.log(newName)
    // console.log(persons)
    // console.log(persons.filter(person => person.name === newName))

    const personObject = {
      name: newName,
      number: newNumber
    }

    // check if name already exists
    if (persons.filter(person => person.name === newName)[0]) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const _id = persons.filter(person => person.name === newName)[0].id;
        personService
          .update(_id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== _id ? person : returnedPerson))
            // console.log(persons)
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        newSearch={newSearch}
        handleSearchChange={handleSearchChange}
      />
      <h2>add a new</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        newSearch={newSearch}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  )
}

export default App