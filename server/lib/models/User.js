"use strict";

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', 
    {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        picture_url: DataTypes.STRING,
        angellist_id: DataTypes.STRING,
        angellist_token: DataTypes.STRING,
        description: DataTypes.STRING
    },
    {
    	tableName: 'users'
    });

    return User;
};
