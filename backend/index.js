const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/userRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const { sequelize } = require('./config/db');
const cors = require('cors');

dotenv.config();

const app = express();


app.use(cors());
app.use(bodyParser.json());


sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));


app.use('/api', authRoutes);
app.use('/api', weatherRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the Weather App API!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
