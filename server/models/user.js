"use strict";
var util = require('util'),
    Auth = require('../lib/auth').Auth,
    db = require('../lib/db-mysql');


// ### Get a user by its id
module.exports.get = function (req, res, id) {
    //check if data can be reached by this user
    var token = new Auth().decodeToken(req.cookies.auth);
    db.get('users', {login: token.login}, function (err, doc) {
        if (err) { throw err; }
        if (doc === null || doc.length == 0 || doc[0].id != id) {
            res.writeHead(401);
            res.end('user not reachable');
            return;
        }
    });

    db.get('users', {id: id}, function (err, doc) {
        if (err) { throw err; }
        if (doc === null || doc.length == 0) {
            res.writeHead(404);
            res.end('user ' + id + ' not found');
        } else {
            res.writeHead(200);
            delete doc[0].salt;
            delete doc[0].password;
            res.end(JSON.stringify(doc[0]));
        }
    });
};

// ### Create a user
module.exports.signup = function (req, res) {
    var user = req.body,
        auth = new Auth();
    if (user === undefined) {
        res.writeHead(400);
        res.end('Missing field');
        return; 
    } else if (req.oauth) {
        user.login = req.oauth.user;
    } else if (!user.hasOwnProperty('login') || !user.hasOwnProperty('password')) {
        res.writeHead(400);
        res.end('Missing field');
        return;
    }

    auth.signup(user.login, user.password, function (err, newUser) {
        if (err) { throw err; }
        db.assertDoesNotExist('users', { login: newUser.login }, function (err) {
            if (err) {
                if (err.message.match(/Existing user/)) {
                    res.writeHead(409);
                    res.end(err.message);
                    return;
                } else {
                    throw err;
                }
            }
            newUser.modtime = (new Date()).getTime();
            db.create('users', newUser, function (err, resources) {
                if (err) { throw err; }
                var userId = resources[0]._id.toString();
                res.writeHead(200);
                res.end(userId);
            });
        });
    });

};


// ### Signin = get authentication token
//
// It is return in the cookie 'auth'
module.exports.signin = function (req, res) {
    var user = req.body,
        auth = new Auth();

    if (user === undefined) { return;}
    if (req.oauth) {
        user.login = req.oauth.user;
    } else if (!user.hasOwnProperty('login') || !user.hasOwnProperty('password')) {
        res.writeHead(400);
        res.end('Missing field');
        return;
    }

    db.get('users', { 'login': user.login }, function (err, doc) {
        if (err) { throw err; }
        if (doc && doc.length > 0) {
            auth.signin(doc[0], user.password, function (err, token) {
                if (err) {
                    res.writeHead(401);
                    res.end(err.toString());
                }
                res.writeHead(200, [
                    ['Set-Cookie', 'auth=' + token + '; max-age:' + '3600']
                ]);
                res.end(doc[0].id.toString());
            });
        } else {
            res.writeHead(404);
            res.end('user ' + user.login + ' not found');
        }
    });
};
