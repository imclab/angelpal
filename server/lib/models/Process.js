"use strict";
var Company = require('./').Company;
var Message = require('./').Message;
var Document = require('./').Document;

module.exports = function(sequelize, DataTypes) {
    var Process = sequelize.define('Process', 
    {
        name: DataTypes.STRING,
        status: DataTypes.INTEGER
    },
    {
    	tableName: 'processes'
    });

    Process.belongsTo(Company, {foreignKey: 'investor'});
    Process.belongsTo(Company, {foreignKey: 'startup'});

    return Process;
};
