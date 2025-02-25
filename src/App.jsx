import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

const App = () => {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState('')

  const handleInputChange = (event) => {
    setCity(event.target.value)
  }

  const handleSearch = () => {
    if (!city.trim()) {
      setError('Please enter a city name.')
      return
    }

    setError('')
    setWeather(null)
    setForecast([])

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      )
      .then((response) => {
        setWeather({
          city: response.data.name,
          temperature: response.data.main.temp,
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon,
        })

        return axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        )
      })
      .then((forecastResponse) => {
        setForecast(forecastResponse.data.list.slice(0, 5))
        setError('')
      })
      .catch((error) => {
        console.error(error)
        setError('City not found or another error occurred.')
        setWeather(null)
        setForecast([])
      })
  }

  return (
    <>
      <h1>Weather App</h1>
      <div className="card">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Get Weather</button>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-info">
            <h2>{weather.city}</h2>
            <p>{weather.temperature}°C</p>
            <p>{weather.description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="icon"
            />
          </div>
        )}

        {forecast.length > 0 && (
          <>
            <h3>Next Few Hours</h3>
            <div className="hourly">
              {forecast.map((hour, index) => (
                <div key={index} className="hour">
                  <p>{new Date(hour.dt * 1000).toLocaleTimeString()}</p>
                  <p>{hour.main.temp}°C</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                    alt="icon"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
