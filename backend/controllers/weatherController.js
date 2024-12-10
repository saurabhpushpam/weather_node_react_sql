// const axios = require('axios');
// const db = require('../config/db');

// const searchWeather = async (req, res) => {
//   // const { city } = req.body;
//   const city = req.params.city;

//   try {

//     const response = await axios.get(`http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${city}`);

//     const weatherData = JSON.stringify(response.data);
//     console.log(weatherData);

//     res.status(200).send(weatherData);

//   } catch (err) {
//     console.error('Error fetching weather data:', err);
//     res.status(500).send('Error fetching weather data');
//   }
// };


// module.exports = {
//   searchWeather,

// }




const axios = require('axios');
// const { SearchReport } = require('../models'); // Assuming you have a Sequelize model for SearchReport
// const { NewUser } = require('../models'); // Assuming you have a Sequelize model for NewUser
const { SearchReport } = require('../config/db');
const { NewUser } = require('../config/db');

const searchWeather = async (req, res) => {
  const city = req.params.city;
  const userId = req.user.id; // Assuming `userId` is set by an authentication middleware

  try {
    // Fetch weather data from the API
    const response = await axios.get(`http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${city}`);
    const weatherData = response.data;

    if (!weatherData || !weatherData.current || !weatherData.location) {
      return res.status(404).send('Invalid weather data received.');
    }

    // Log the search data into the `search_report` table
    await SearchReport.create({
      userId,
      city: weatherData.location.name,
      temperature: weatherData.current.temperature,
      weatherDescription: weatherData.current.weather_descriptions?.[0] || 'N/A',
      windSpeed: weatherData.current.wind_speed,
      humidity: weatherData.current.humidity,
      visibility: weatherData.current.visibility,
      searchTime: new Date(),
    });

    console.log(`Weather search logged for userId: ${userId}, city: ${city}`);

    // Respond with the weather data
    res.status(200).json(weatherData);

  } catch (err) {
    console.error('Error fetching weather data:', err);
    res.status(500).send('Error fetching weather data');
  }
};



// const getAllSearchReports = async (req, res) => {
//   try {
//     const reports = await SearchReport.findAll({
//       include: {
//         model: NewUser,   // Associated model
//         as: 'user',       // Association alias
//         attributes: ['username', 'email'], // Sirf username fetch karna hai
//       },
//       order: [['searchTime', 'DESC']],
//     });

//     res.status(200).json(reports);
//   } catch (err) {
//     console.error('Error fetching search reports:', err);
//     res.status(500).send('Error fetching search reports');
//   }
// };



const getAllSearchReports = async (req, res) => {
  try {
    const reports = await SearchReport.findAll({
      include: {
        model: NewUser,   // Associated model
        as: 'user',       // Association alias
        attributes: ['username', 'email'], // Only fetch username and email
      },
      order: [['searchTime', 'DESC']], // Order by search time in descending order
      raw: true, // Flatten the results to avoid nested objects
    });

    // Map over the reports to format them
    const formattedReports = reports.map(report => ({
      username: report['user.username'], // Extract username from user object
      email: report['user.email'], // Extract email from user object
      city: report.city,
      temperature: report.temperature,
      weatherDescription: report.weatherDescription,
      windSpeed: report.windSpeed,
      humidity: report.humidity,
      visibility: report.visibility,
      searchTime: report.searchTime,
    }));

    res.status(200).json(formattedReports); // Return the formatted reports
  } catch (err) {
    console.error('Error fetching search reports:', err);
    res.status(500).send('Error fetching search reports');
  }
};


module.exports = {
  searchWeather,
  getAllSearchReports
};
