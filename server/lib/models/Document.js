"use strict";
var Comment = require('./').Company;
var User = require('./').User;
var Process = require('./').Process;

module.exports = function(sequelize, DataTypes) {
    var Document = sequelize.define('Document', 
    {
        title: DataTypes.STRING
    },
    {
        tableName: 'documents'
    });

    Process.hasMany(Document);
    Document.belongsTo(Process);
    User.hasMany(Document);
    Document.belongsTo(User);
    
    return Document;
};
