const express = require("express");
const user_routes = express();

const auth = require('../Middleware/authmiddleware');

const user_controller = require("../controllers/userController");

const bodyParser = require("body-parser");
user_routes.use(bodyParser.json());
user_routes.use(bodyParser.urlencoded({ extended: true }));


user_routes.post('/register', user_controller.signup);
user_routes.post('/login', user_controller.login);
user_routes.get('/user', auth, user_controller.getuser);


module.exports = user_routes;
