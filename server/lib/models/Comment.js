"use strict";
var User = require('./').User;
var Document = require('./').Document;
var Message = require('./').Message;

module.exports = function(sequelize, DataTypes) {
    var Comment = sequelize.define('Comment', 
    {
        content: DataTypes.STRING,
        target: DataTypes.INTEGER
    },
    {
        tableName: 'comments'
    });

    User.hasMany(Comment);
    Comment.belongsTo(User);
    Document.hasMany(Comment);
    Comment.belongsTo(Document);
    Message.hasMany(Comment);
    Comment.belongsTo(Message);
    
    return Comment;
};
