import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [isDayTime, setIsDayTime] = useState(true);

  const fetchWeather = async () => {
    const apiKey = "3e8d873f6a66da43f01f03d9ed7c8080";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('City not found');

      const data = await response.json();
      setWeather(data);
      setError('');

    
      const currentTime = new Date().getTime() / 1000;  
      setIsDayTime(currentTime >= data.sys.sunrise && currentTime <= data.sys.sunset);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) fetchWeather();
  };

  return (
    <div className={`app ${isDayTime ? 'day' : 'night'}`}>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
        </div>
      )}

      <div className="background-animation">
        {weather && weather.weather[0].main === 'Rain' && <div className="rain"></div>}
        {weather && weather.weather[0].main !== 'Rain' && <div className="clouds"></div>}
      </div>
    </div>
  );
};

export default App;
