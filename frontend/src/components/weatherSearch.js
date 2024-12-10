import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function WeatherSearch() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error messages
  const [user, setUser] = useState(null); // For storing user info

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token')?.replace(/"/g, ''); // Retrieve token from localStorage

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
        setUser(response.data.data); // Set user info
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Failed to fetch user information.');
      }
    };

    fetchUserDetails();
  }, []);

  const searchWeather = async () => {
    const token = localStorage.getItem('token')?.replace(/"/g, ''); // Retrieve token from localStorage
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
      const response = await axios.get('http://localhost:5000/api/search-weather', {
        params: { city }, // Send city as a query parameter
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setWeather(response.data);
    } catch (err) {
      setError('Error fetching weather. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      {/* User Info Section */}
      {user && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3>User Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <h2>Weather Search</h2>
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
        disabled={!city || loading} // Disable button if city is empty or loading
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
          <pre style={{ fontSize: '14px', lineHeight: '1.5' }}>
            {JSON.stringify(weather, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
