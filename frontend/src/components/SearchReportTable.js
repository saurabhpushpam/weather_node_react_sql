import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import './dashboard.css';

export default function SearchReportTable() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token')?.replace(/"/g, ''); // Retrieve the token

        if (!token) {
          setError('You must be logged in to view this data.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/allsearch', {
          headers: {
            Authorization: `${token}`,
          },
        });

        setReports(response.data);
      } catch (err) {
        console.error('Error fetching search reports:', err);
        setError('Failed to fetch search reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleback = () => {
    navigate('/weather');
  };


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>

      <div className='top-button'>

        <button className="logout-button" style={{ backgroundColor: "blue" }} onClick={handleback}>
          Back
        </button>
        {/* <div className="logout-container"> */}
        <button className="logout-button" style={{ marginLeft: "90vh" }} onClick={handleLogout}>
          Logout
        </button>
        {/* </div> */}
      </div>

      <h1 style={{ textAlign: "center" }}>Search Report</h1>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
        }}
      >
        <thead>
          <tr>
            <th style={headerCellStyle}>User Name</th>
            <th style={headerCellStyle}>Email</th>
            <th style={headerCellStyle}>City</th>
            <th style={headerCellStyle}>Temperature (°C)</th>
            <th style={headerCellStyle}>Weather</th>
            <th style={headerCellStyle}>Wind Speed (km/h)</th>
            <th style={headerCellStyle}>Humidity (%)</th>
            <th style={headerCellStyle}>Visibility (km)</th>
            <th style={headerCellStyle}>Search Time</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td style={cellStyle}>{report.username || 'Unknown'}</td>
              <td style={cellStyle}>{report.email || 'N/A'}</td>
              <td style={cellStyle}>{report.city}</td>
              <td style={cellStyle}>{report.temperature}</td>
              <td style={cellStyle}>{report.weatherDescription}</td>
              <td style={cellStyle}>{report.windSpeed}</td>
              <td style={cellStyle}>{report.humidity}</td>
              <td style={cellStyle}>{report.visibility}</td>
              <td style={cellStyle}>{new Date(report.searchTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Table styles
const headerCellStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  backgroundColor: '#f5f5f5',
  fontWeight: 'bold',
  textAlign: 'left',
};

const cellStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'left',
  color: "yellow"
};


