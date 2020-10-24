import React from 'react';

const Persons = ({ newSearch, persons }) => {
  return (
    <>
      <ul>
        {
          (newSearch === '') ?
            persons.map(person => <li key={person.name}>{person.name} {person.number}</li>) :
            persons
              .filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
              .map(person => <li key={person.name}>{person.name} {person.number}</li>)
        }
      </ul>
    </>
  )
}

export default Persons