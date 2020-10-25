import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {

  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')
  const [error, setError] = useState(false)

  const handleOnSearch = (event) => {

    event.preventDefault()
    setNewSearch(event.target.value)

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
        })
        .catch(err => {
          setError(true)
          if (err.message === undefined) {
            setError(false)
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
                  <div>
                    <h1>{countries[0].name}</h1>
                    <div>capital {countries[0].capital}</div>
                    <div>population {countries[0].population}</div>
                    <h2>languages</h2>
                    <ul>
                      {
                        countries[0].languages.map(lang => <li key={lang.name}>{lang.name}</li>)
                      }
                    </ul>
                    <img src={countries[0].flag} alt={countries[0].name} style={{ width: '150px' }} />
                  </div> :
                  countries.map(country => <div key={country.name}>{country.name}</div>)
        }
      </div>
    </div>
  );
}

export default App;
