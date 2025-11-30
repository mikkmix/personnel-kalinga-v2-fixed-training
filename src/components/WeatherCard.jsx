import React, { useEffect, useState } from "react";
import "../styles/weather-card.css";

const API_KEY = "b92dd4a2d36476f40d39c0b8e8114a62";

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateClock(); // initialize immediately
    const clockInterval = setInterval(updateClock, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        if (response.ok) {
          setWeather(data);
        } else {
          console.error("API error:", data);
          setErrorMsg("Unable to load weather data.");
          setWeather(null);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
        setErrorMsg("Error fetching weather.");
        setWeather(null);
      }
    };

    // Get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          fetchWeather(latitude, longitude);

          // Refresh weather every 60 seconds
          const weatherInterval = setInterval(
            () => fetchWeather(latitude, longitude),
            60000
          );

          return () => clearInterval(weatherInterval);
        },
        (err) => {
          console.error(err);
          setErrorMsg("Location permission denied.");
        }
      );
    } else {
      setErrorMsg("Geolocation not supported in this browser.");
    }
  }, []);

  if (errorMsg) {
    return (
      <div className="card weather">
        <h3>Weather</h3>
        <p>⚠️ {errorMsg}</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="card weather">
        <h3>Weather</h3>
        <p>Loading weather...</p>
      </div>
    );
  }

  return (
    <div className="card weather">
      <div className="weather-top">
        {/* LEFT SIDE */}
        <div className="left">
          <h2>{weather.name}</h2>
          <p>{currentTime}</p>
          <p className="condition">{weather.weather[0].description}</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <h1>{Math.round(weather.main.temp)}°C</h1>

          <div className="details">
            <p>Precipitation: {weather.clouds.all}%</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind: {Math.round(weather.wind.speed * 3.6)} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
