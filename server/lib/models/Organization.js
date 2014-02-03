"use strict";
var User = require('./').User;

module.exports = function(sequelize, DataTypes) {
    var Organization = sequelize.define('Organization', 
    {
        name: DataTypes.STRING
    },
    {
        tableName: 'organizations'
    });

    var UserRoles = sequelize.define('UserRoles', {
        role: DataTypes.INTEGER
    },
    {
        tableName: 'user_roles'
    });

    // Many to Many relation with User
    Organization.hasMany(User, { through: UserRoles });
    User.hasMany(Organization, { through: UserRoles });

    Organization.sync();
    
    return Organization;
};
