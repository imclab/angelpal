"use strict";

module.exports = function(sequelize, DataTypes) {
    var Invitation = sequelize.define('Invitation', 
    {
        angellist_id: DataTypes.INTEGER,
        organization_id: DataTypes.INTEGER,
        role: DataTypes.INTEGER
    },
    {
        tableName: 'invitations'
    });

    Invitation.sync();
    
    return Invitation;
};
