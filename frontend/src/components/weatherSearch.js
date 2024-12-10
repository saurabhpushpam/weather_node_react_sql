import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function WeatherSearch() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error messages
  const [user, setUser] = useState(null); // For storing user info

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token')?.replace(/"/g, '');

      if (!token) {
        alert('You are not logged in. Please log in to continue.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/user`, {
          headers: {
            Authorization: `${token}`
          }
        });
        setUser(response.data.data);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Failed to fetch user information.');
      }
    };

    fetchUserDetails();
  }, []);


  const handlereport = () => {
    navigate('/report');
  };

  const searchWeather = async () => {
    const token = localStorage.getItem('token')?.replace(/"/g, '');
    if (!token) {
      alert('You are not logged in. Please log in to continue.');
      return;
    }

    if (!city.trim()) {
      setError('City name cannot be empty.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/search-weather/${city}`, {
        // params: { city },
        headers: {
          Authorization: `${token}`
        }
      });

      // setWeather(response.data);
      const data = response.data;
      const filteredWeather = {

        region: data.location.name,
        province: data.location.region,
        country: data.location.country,
        localtime: data.location.localtime,

        temperature: data.current.temperature,
        weather_description: data.current.weather_descriptions[0],
        wind_speed: data.current.wind_speed,
        humidity: data.current.humidity,
        visibility: data.current.visibility,

      };

      setWeather(filteredWeather);

    } catch (err) {
      setError('Error fetching weather. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      {/* <p style={{ color: "white", fontSize: "22px", fontWeight: "900" }}>
        <Link to="/report">click here for search report</Link>
      </p> */}
      <button className="logout-button" style={{ backgroundColor: "#adee09", color: "black", fontSize: "18px", fontWeight: "700", width: "100%" }} onClick={handlereport}>
        click for search report
      </button>
      {/* User Info Section */}
      {user && (
        <div style={{ marginBottom: '20px', marginTop: "20px", textAlign: 'center', width: '100%', height: "15%", backgroundColor: "black" }}>
          <h3 style={{ color: "yellow", fontSize: "22px", fontWeight: "900" }}>User Information</h3>
          <p style={{ color: "white", fontSize: "16px", fontWeight: "700" }}><strong>Name:</strong> {user.name}</p>
          <p style={{ color: "white", fontSize: "16px", fontWeight: "700" }}><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <h2 style={{ color: "orange", marginBottom: "10px" }}>Weather Search</h2>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={e => setCity(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      <button
        onClick={searchWeather}
        disabled={!city || loading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: loading ? '#ddd' : '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Loading...' : 'Search'}
      </button>
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}
      {weather && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h3>Weather Details</h3>
          <pre style={{ fontSize: '18px', color: 'blue', lineHeight: '1.5' }}>
            {JSON.stringify(weather, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
