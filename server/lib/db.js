"use strict";
var Sequelize = require('sequelize');
var config = require('../config');

// init Sequelize db connection
var sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
    dialect: config.db.dialect,
    port: config.db.port,
    logging: config.db.enableLogging
});

sequelize.authenticate()
.complete(function (err) {
    if (!!err) {
      console.log('Unable to connect to the database:'.red, err);
    } else {
      console.log('Connection to the database has been established successfully'.green);
    }
});

module.exports = sequelize;
