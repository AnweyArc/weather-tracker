import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHalf, faClock, faWind, faSun, faGauge } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/weatherform.module.css';

const WeatherForm = () => {
  const [place, setPlace] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (place.length > 1) { // Trigger suggestions only if input length is greater than 1
        try {
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}&limit=2`
          );
          setSuggestions(response.data.results.map(result => result.formatted));
        } catch (err) {
          setError('Failed to fetch suggestions');
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [place]);

  const fetchWeather = async (e) => {
    e.preventDefault();
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
      // WeatherAPI request
      const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${place}`);
      setWeather(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching weather data:', err); // Log error for debugging
      setError('Failed to fetch weather data');
      setWeather(null);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setPlace(suggestion);
    setSelectedSuggestion(suggestion);
    setSuggestions([]);
  };

  return (
    <div className={styles.weatherFormContainer}>
      <div className={styles.weatherFormCard}>
        <form onSubmit={fetchWeather} className="flex flex-col">
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Enter place name"
            className={styles.weatherFormInput}
          />
          {suggestions.length > 0 && (
            <ul className={styles.weatherFormSuggestions}>
              {suggestions.slice(0, 1).map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={styles.weatherFormSuggestionItem}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <div className="flex-grow" /> {/* Spacer to push the button down */}
          <button type="submit" className={styles.weatherFormButton}>
            Get Weather
          </button>
        </form>
        {error && <p className={styles.weatherFormError}>{error}</p>}
        {weather && (
          <div className={styles.weatherFormWeatherInfo}>
            <div className="header text-2xl font-semibold">
              <span>Weather in {weather.location.name}</span>
            </div>
            <div className="infoItem">
              <FontAwesomeIcon icon={faClock} />
              <span>{weather.location.localtime}</span>
            </div>
            <div className="infoItem">
              <FontAwesomeIcon icon={faSun} />
              <span>{weather.current.condition.text}</span>
            </div>
            <div className="infoItem">
              <FontAwesomeIcon icon={faTemperatureHalf} />
              <span>{weather.current.temp_c}°C</span>
            </div>
            <div className="infoItem">
              <FontAwesomeIcon icon={faWind} />
              <span>{weather.current.wind_kph} km/h</span>
            </div>
            <div className="infoItem">
              <FontAwesomeIcon icon={faGauge} />
              <span>Pressure: {weather.current.pressure_in} in</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherForm;
