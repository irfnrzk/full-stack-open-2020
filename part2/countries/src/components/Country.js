import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Weather from './Weather'

const Country = ({ country }) => {

  const [setWeather, setNewWeather] = useState([])

  useEffect(() => {

    const cancelToken = axios.CancelToken.source()

    axios
      .get(
        `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${country.name}`,
        { cancelToken: cancelToken.token }
      )
      .then(res => {
        setNewWeather([res.data])
      })
      .catch(err => {
      })

    return () => {
      cancelToken.cancel()
    }

  }, [country])

  return (
    <>
      <div>
        <h1>{country.name}</h1>
        <div>capital {country.capital}</div>
        <div>population {country.population}</div>
        <h2>Spoken languages</h2>
        <ul>
          {
            country.languages.map(lang => <li key={lang.name}>{lang.name}</li>)
          }
        </ul>
        <img src={country.flag} alt={country.name} style={{ width: '150px' }} />
        {
          setWeather.length > 0 ?
            <Weather country={country} weather={setWeather[0]} /> : <></>
        }
      </div>
    </>
  )

}

export default Country