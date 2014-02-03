"use strict";
var Sequelize = require('sequelize'),
    config = require('../config');

// init Sequelize db connection
var sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
    dialect: "mysql",
    port:    3306
});
sequelize  
.authenticate()
.complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database:'.red, err);
    } else {
      console.log('Connection to the database has been established successfully'.green);
    }
});

// load models
var models = [
    'User', 'Organization', 'Invitation'
];
models.forEach(function (model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

module.exports.sequelize = sequelize;
