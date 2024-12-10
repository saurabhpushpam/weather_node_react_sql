const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});


const NewUser = sequelize.define('NewUser', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'newuser',
  timestamps: false,
});



const SearchReport = sequelize.define('SearchReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  weatherDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  windSpeed: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  humidity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  visibility: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  searchTime: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'search_report',
  timestamps: false,
});



SearchReport.belongsTo(NewUser, { foreignKey: 'userId', as: 'user' });

NewUser.hasMany(SearchReport, { foreignKey: 'userId', as: 'searchReports' });



sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

module.exports = { sequelize, NewUser, SearchReport };

