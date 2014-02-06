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
    

    User.login = function (profile, accessToken, callback) {
        // find or create AngelPal account
        User.findOrCreate({ angellist_id: profile.id }, 
            { 
                angellist_id: profile.id, 
                name: profile.displayName, 
                email: profile._json.email, 
                token: accessToken
            })
            .success(function (user, created) {
                if (created) {
                    // add pending invitations
                    var Organization = require('./').Organization,
                        Invitation = require('./').Invitation;
                        
                    // get pending invitations for this user
                    Invitation.findAll({
                        angellist_id: profile.id
                    })
                    .success(function (invitations) {
                        for (var i in invitations) {
                            var invitation = invitations[i];
                            Organization.find({ id: invitation.organization_id })
                            .success(function (organization) {
                                user.addOrganization(organization, {role: invitation.role});
                                invitation.destroy();
                            });
                        }
                    });
                }
                return callback(false, user);
            })
            .error(function (error) {
                return callback(error, false);
            });
    };


    return User;
};