"use strict";
var User = require('./').User;

module.exports = function(sequelize, DataTypes) {
    var Company = sequelize.define('Company', 
    {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        category: DataTypes.INTEGER
    },
    {
    	tableName: 'companies'
    });


    var UserCompanies = sequelize.define('UserCompanies', {
        status: DataTypes.INTEGER,
    },
    {
        tableName: 'user_companies'
    });


    Company.hasMany(User, {through: UserCompanies});
    User.hasMany(Company, {through: UserCompanies});

    return Company;
};
