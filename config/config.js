const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectModule: require('mysql2')
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

const syncOptions = process.env.NODE_ENV === 'dev' ? { force: true } : { alter: true };

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
