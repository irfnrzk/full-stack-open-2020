import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [successMessage, setSuccessMessage] = useState('some error happened...')
  const [showNotification, setShowNotification] = useState(false)
  const [styleClass, setStyleClass] = useState('')

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
    const _name = event.target.attributes['data-name'].value;

    event.preventDefault();
    if (window.confirm(`Delete ${event.target.attributes['data-name'].value}`)) {
      personService
        .remove(_id)
        .then(res => {
          // delete from list
          setPersons(persons.filter(n => n.id !== _id))
        })
        .catch(err => {
          // trigger notification
          setSuccessMessage(`Information of ${_name} has alread been removed from server`)
          setStyleClass(`error`)
          setShowNotification(true)

          // reset notification
          setTimeout(() => {
            setShowNotification(false)
          }, 2000);
        })
    }

  }

  const addName = (event) => {
    event.preventDefault()

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
            // update list
            setPersons(persons.map(person => person.id !== _id ? person : returnedPerson))

            // reset fields
            setNewName('')
            setNewNumber('')

            // trigger notification
            setSuccessMessage(`Updated ${newName}'s phone number`)
            setStyleClass(`success`)
            setShowNotification(true)

            // reset notification
            setTimeout(() => {
              setShowNotification(false)
            }, 2000);
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          // add to list
          setPersons(persons.concat(returnedPerson))

          // reset fields
          setNewName('')
          setNewNumber('')

          // trigger notification
          setSuccessMessage(`Added ${newName}`)
          setStyleClass(`success`)
          setShowNotification(true)

          // reset notification
          setTimeout(() => {
            setShowNotification(false)
          }, 2000);
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {
        showNotification &&
        <Notification message={successMessage} styleClass={styleClass} />
      }
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