import React from 'react'

const Weather = ({ country, weather }) => {

  return (
    <>
      <h2>Weather in {country.capital}</h2>
      <div><strong>temperature:</strong> {weather.current.temperature} Celcius</div>
      <img
        src={weather.current.weather_icons}
        alt={weather.current.weather_icons}
        style={{ width: '150px' }}
      />
      <div><strong>wind:</strong> {weather.current.wind_speed} mph direction {weather.current.wind_dir}</div>
    </>
  )

}

export default Weather