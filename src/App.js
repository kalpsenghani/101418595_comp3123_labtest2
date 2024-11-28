import React, { useState } from "react";
import axios from "axios";
import './App.css'; 

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState([]);

  const apiKey = "0891b3bf65ba5853d69eb185466f8c80"; 

  const handleSearch = async () => {
    if (!city) return;

    try {
      // Fetch current weather
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      setWeather(weatherResponse.data);
      setError("");

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );

      const dailyForecast = forecastResponse.data.list.filter((entry) =>
        entry.dt_txt.includes("15:00:00")
      );
      setForecast(dailyForecast);
    } catch (err) {
      setError("City not found!");
      setWeather(null);
      setForecast([]);
    }
  };

  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Get Weather</button>
      </div>
      {error && <div className="error">{error}</div>}
      {weather && (
        <>
          <div className="weather-container">
            <div className="weather-main">
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <div className="temperature">{Math.round(weather.main.temp)}°C</div>
              <div className="weather-description">
                {weather.weather[0].description}
              </div>
              <div className="weather-details">
                <ul>
                  <li>Humidity: {weather.main.humidity}%</li>
                  <li>Wind Speed: {weather.wind.speed} m/s</li>
                  <li>Pressure: {weather.main.pressure} hPa</li>
                  <li>Min Temp: {Math.round(weather.main.temp_min)}°C</li>
                  <li>Max Temp: {Math.round(weather.main.temp_max)}°C</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Weekly Forecast */}
          <div className="forecast-container">
            {forecast.map((day) => (
              <div className="forecast-day" key={day.dt}>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
                <h4>{new Date(day.dt_txt).toLocaleDateString()}</h4>
                <div className="temperature">
                  {Math.round(day.main.temp)}°C
                </div>
                <div className="weather-description">
                  {day.weather[0].description}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherApp;
