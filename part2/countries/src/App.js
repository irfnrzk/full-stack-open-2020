import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Country from './components/Country'

const App = () => {

  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')
  const [error, setError] = useState(false)
  const [show, setShow] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)

  const handleOnSearch = (event) => {

    event.preventDefault()
    setNewSearch(event.target.value)

  }

  const handleClick = (event) => {
    console.log(event.target.value)
    setSelectedIdx(countries.findIndex(country => country.name === event.target.value))
    // event.preventDefault()
    setShow(true)
  }

  useEffect(() => {

    const cancelToken = axios.CancelToken.source()

    if (newSearch.length > 0) {
      axios
        .get(
          `https://restcountries.eu/rest/v2/name/${newSearch}`,
          { cancelToken: cancelToken.token }
        )
        .then(res => {
          setCountries(res.data)
          setError(false)
          res.data.length === 1 ? setShow(true) : setShow(false)
        })
        .catch(err => {
          setError(true)
          if (err.message === undefined) {
            setError(false)
            setShow(false)
          } else {
            setCountries([])
          }
        })

      return () => {
        cancelToken.cancel()
      }
    } else {
      setCountries([])
    }

  }, [newSearch])

  return (
    <div>
      find countries
      <input
        value={newSearch}
        onChange={handleOnSearch}
      />
      <div>
        {
          error ? `Can't find request!` :
            countries.length === 0 ?
              <div>search for countries!</div> :
              countries.length > 10 ?
                <div>Too many matches, specify another filter</div> :
                countries.length === 1 ?
                  <Country country={countries[0]} /> :
                  show ?
                    <Country country={countries[selectedIdx]} /> :
                    countries.map(country =>
                      <div key={country.name}>{country.name}
                        <button value={country.name} onClick={handleClick}>show</button>
                      </div>
                    )
        }
      </div>
    </div>
  );
}

export default App;
