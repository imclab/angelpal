"use strict";
var Comment = require('./').Company;
var User = require('./').User;
var Process = require('./').Process;

module.exports = function(sequelize, DataTypes) {
    var Message = sequelize.define('Message', 
    {
        content: DataTypes.STRING
    },
    {
        tableName: 'messages'
    });

    Process.hasMany(Message);
    Message.belongsTo(Process);
    User.hasMany(Message);
    Message.belongsTo(User);

    return Message;
};
