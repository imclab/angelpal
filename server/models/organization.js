"use strict";
var db = require('../lib/db-mysql');


// get all user's organizations
module.exports.getAll = function (userId, callback) {
    db.db.query('SELECT o.id, o.name FROM organizations o LEFT JOIN user_organization uo ON o.id=uo.organization_id WHERE uo.user_id= ?', [userId], function (err, result) {
        if (err) { throw err; }
        callback(err, result);
    });
};

// create new organization
module.exports.create = function (userId, name, callback) {
    db.create('organizations', {name: name}, function (err, result) {
        if (result.insertId) {
            db.create('user_organization', {user_id: userId, organization_id: result.insertId, role: 10}, function (err, result) {
                if (result.insertId) {
                    callback(err, {server_response: 'OK'});
                } else  {
                    callback(err, false);
                }
            });
        } else {
            callback(err, false);
        }
    });
};

// get organization details
module.exports.getDetails = function (userId, organization_id, callback) {
    // check if I can see information
    db.db.query('SELECT o.id, o.name FROM organizations o LEFT JOIN user_organization uo ON o.id=uo.organization_id WHERE uo.user_id= ? AND o.id=?', [userId, organization_id], function (err, result) {
        if (err) { throw err; }
        if (result.length > 0) {
            var organizationDetails = {
                id: result[0].id,
                name: result[0].name
            };
            db.db.query('SELECT u.angellist_id, u.name, uo.role FROM users u LEFT JOIN user_organization uo ON u.angellist_id=uo.user_id WHERE uo.organization_id= ?', [organization_id], function (err, result) {
                if (err) { throw err; }
                organizationDetails.users = result;
                callback(err, organizationDetails);
            });
        } else {
            callback(err, {error: "Unauthorized"});
        }
    });
};

// invite to organization
module.exports.invite = function (userId, organization_id, invitee_id, role, callback) {
    // check if I can invite
    db.db.query('SELECT o.id FROM organizations o LEFT JOIN user_organization uo ON o.id=uo.organization_id WHERE uo.user_id= ? AND o.id=? AND uo.role=10', [userId, organization_id], function (err, result) {
        if (err) { throw err; }
        if (result.length > 0) {
            db.create('user_organization', {user_id: invitee_id, organization_id: organization_id, role: role}, function (err, result) {
                if (result.insertId) {
                    callback(err, {server_response: 'OK'});
                } else  {
                    callback(err, false);
                }
            });
        } else {
            callback(err, {error: "Unauthorized"});
        }
    });
};

// update persmission
module.exports.changePermission = function (userId, organization_id, invitee_id, role, callback) {
    // check if I can invite
    db.db.query('SELECT o.id FROM organizations o LEFT JOIN user_organization uo ON o.id=uo.organization_id WHERE uo.user_id= ? AND o.id=? AND uo.role=10', [userId, organization_id], function (err, result) {
        if (err) { throw err; }
        if (userId != invitee_id && result.length > 0) {
            db.db.query('SELECT id FROM user_organization WHERE user_id=? AND organization_id=?', [invitee_id, organization_id], function (err, result) {
                if (err) { throw err; }
                if (result.length > 0) {
                    db.update('user_organization', result[0].id, {role: role}, function (err, result) {
                        if (result.changedRows == 1) {
                            callback(err, {server_response: 'OK'});
                        } else  {
                            callback(err, false);
                        }
                    });
                } else  {
                    callback(err, false);
                }
            });
        } else {
            callback(err, {error: "Unauthorized"});
        }
    });
};

// leave organization
module.exports.leave = function (userId, organization_id, callback) {
    // db.db.query('SELECT o.id FROM organizations o LEFT JOIN user_organization uo ON o.id=uo.organization_id WHERE uo.user_id= ? AND o.id=? AND uo.role=10', [userId, organization_id], function (err, result) {
    //     if (err) { throw err; }
    //     if (result.length > 0) {
    //         db.create('user_organization', {user_id: invitee_id, organization_id: organization_id, role: role}, function (err, result) {
    //             if (result.insertId) {
    //                 callback(err, { insertId: result.insertId});
    //             } else  {
    //                 callback(err, false);
    //             }
    //         });
    //     } else {
    //         callback(err, {error: "Unauthorized"});
    //     }
    // });
};
