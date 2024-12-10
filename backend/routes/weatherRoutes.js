const express = require("express");
const user_routes = express();

const auth = require("../Middleware/authmiddleware.js");

const weather_controller = require("../controllers/weatherController");

const bodyParser = require("body-parser");
user_routes.use(bodyParser.json());
user_routes.use(bodyParser.urlencoded({ extended: true }));


user_routes.get('/search-weather/:city', auth, weather_controller.searchWeather);
user_routes.get('/allsearch', weather_controller.getAllSearchReports);
module.exports = user_routes;
