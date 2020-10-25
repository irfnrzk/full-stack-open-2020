import React from 'react';

const Persons = ({ newSearch, persons, handleDeletePerson }) => {
  return (
    <>
      <ul>
        {
          (newSearch === '') ?
            persons.map(person =>
              <li key={person.id}>{person.name} {person.number}
                <button
                  data-id={person.id}
                  data-name={person.name}
                  onClick={handleDeletePerson}
                >delete</button>
              </li>
            ) :
            persons
              .filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
              .map(person =>
                <li key={person.id}>{person.name} {person.number}
                  <button
                    data-id={person.id}
                    data-name={person.name}
                    onClick={handleDeletePerson}
                  >delete</button>
                </li>
              )
        }
      </ul>
    </>
  )
}

export default Persons