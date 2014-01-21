"use strict";
var db = require('../lib/db-mysql');


// find user or create account if it does not exist
module.exports.findOrCreate = function (profile, callback) {
    db.get('users', {angellist_id: profile.id}, function (err, doc) {
        if (err) { throw err; }
        var user;
        if (doc.length == 0) {
            // create new AngelPal account
            user = {
                angellist_id: profile.id,
                name: profile.displayName,
                email: profile._json.email
            };
            db.create('users', user, function (err, doc) {
                if (err) {
                    res.writeHead(500);
                    res.end('Server error');
                    throw err;
                }
            });
        } else {
            user =  doc[0];
        }

        callback(err, user);
    });
};

// find user by id
module.exports.findById = function (id, callback) {
    db.get('users', {angellist_id: id}, function (err, doc) {
        if (err) { throw err; }
        if (doc.length > 0) {
            callback(err, doc[0]);
        } else {
            callback(err, false);
        }
    });
};
