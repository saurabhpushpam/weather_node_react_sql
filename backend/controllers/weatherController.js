const axios = require('axios');
const db = require('../config/db');

const searchWeather = async (req, res) => {
  const { city } = req.body;

  try {

    const response = await axios.get(`http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${city}`);

    const weatherData = JSON.stringify(response.data);
    console.log(weatherData);

    res.status(200).send(weatherData);

  } catch (err) {
    console.error('Error fetching weather data:', err);
    res.status(500).send('Error fetching weather data');
  }
};


module.exports = {
  searchWeather,

}
