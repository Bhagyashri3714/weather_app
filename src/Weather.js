import { useState, useEffect } from "react";
import "./Weather.css"; 

function Weather() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [cityToSearch, setCityToSearch] = useState("");

  const apiKey = "YD5F23XRXC86QLASQ8KRGKYWA";

  useEffect(() => {
    if (!cityToSearch) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchWeather = async () => {
      try {
        setError("");

        const response = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityToSearch}?unitGroup=metric&key=${apiKey}&contentType=json`,
          { signal }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch data");
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch cancelled due to cleanup.");
        } else {
          setError("Failed to fetch weather data.");
        }
      }
    };

    fetchWeather();

    return () => controller.abort();
  }, [cityToSearch]);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (!location) {
      setError("Please enter a location.");
      return;
    }
    setCityToSearch(location);
  };

  return (
    <>
      <div className="container">
        <h2 className="title">🌤 Weather App</h2>

        <form className="form-box" onSubmit={onSubmitHandler}>
          <input
            type="text"
            placeholder="Enter a city..."
            className="input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button className="btn-search">Search</button>
        </form>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-card">
            <h3 className="city-name">{weather.resolvedAddress}</h3>
            <p className="temp">{weather.currentConditions.temp}°C</p>
            <p className="conditions">{weather.currentConditions.conditions}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Weather;
