import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Errror from './components/Error';
import WeatherSearch from './components/weatherSearch';
import SearchReportTable from './components/SearchReportTable';


const App = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('token')) || null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/" element={<Register />} />
        <Route path="/weather" element={user ? <WeatherSearch /> : <Navigate to="/login" />} />
        <Route path="/report" element={user ? <SearchReportTable /> : <Navigate to="/login" />} />
        <Route path='*' element={<Errror />} />

      </Routes>
    </Router>
  );
};

export default App;

