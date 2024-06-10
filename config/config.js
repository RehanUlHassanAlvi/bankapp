const { Sequelize } = require('sequelize');
require('dotenv').config();

const caCert = Buffer.from(process.env.DB_CA_CERT, 'base64').toString('utf-8');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: 25536,
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      ca: caCert,
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 60000, // 60 seconds
    idle: 10000,
  },
  connectTimeout: 60000, // 60 seconds
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

const syncOptions = process.env.NODE_ENV === 'dev' ? { force: false } : { alter: true };

sequelize.sync(syncOptions)
  .then(() => {
    if (syncOptions.force) {
      console.log('UserDetails table created and data reset');
    } else {
      console.log('UserDetails table synchronized without data reset');
    }
  })
  .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
