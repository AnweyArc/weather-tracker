import { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="relative w-full max-w-md p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <form onSubmit={fetchWeather} className="flex flex-col">
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Enter place name"
            className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
          {suggestions.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-12 max-h-32 overflow-y-auto z-10">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg mt-4 hover:bg-blue-700 transition-colors">
            Get Weather
          </button>
        </form>
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {weather && (
          <div className="mt-6 p-4 bg-white shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold">Weather in {weather.location.name}</h2>
            <p className="mt-2 text-lg">Temperature: {weather.current.temp_c}°C</p>
            <p className="text-lg">Condition: {weather.current.condition.text}</p>
            <p className="text-lg">Wind Speed: {weather.current.wind_kph} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherForm;
