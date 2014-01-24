"use strict";
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', 
    {
        angellist_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        token: DataTypes.STRING
    },
    {
    	tableName: 'users'
    });

    User.sync();
    
    return User;
};
