"use strict";
var util = require('util'),
    request = require('request'),
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

// ### Login / create AngelPal account if needed
module.exports.login = function (req, res) {
    var requestParams = req.body;
    if (requestParams === undefined || !requestParams.code) {
        res.writeHead(400);
        res.end('Missing field');
        return; 
    }

    // login with Angellist API
    var urlLogin = "https://angel.co/api/oauth/token?client_id=2453f00f021a59cf21f247862645af45&client_secret=e72b18b0210117916f987655212f5e5f&code=" 
                + requestParams.code + "&grant_type=authorization_code";
    request({
        uri: urlLogin,
        method: "POST",
        timeout: 10000
    }, function (error, response, body) {

        // retrieve access token
        var accessToken = JSON.parse(body).access_token;

        // get user profile
        var urlMe = "https://api.angel.co/1/me?access_token=" + accessToken;
        request({
            uri: urlMe,
            method: "GET"
        }, function (error, response, body) {
            body = JSON.parse(body);
            if (body.id) {
                db.get('users', { 'angellist_id': body.id }, function (err, doc) {
                    if (err) { throw err; }
                    var user;
                    if (doc && doc.length == 0) {
                        // create new AngelPal account
                        user = {
                            angellist_id: body.id,
                            access_token: accessToken,
                            name: body.name,
                            email: body.email
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
                        delete user.access_token;
                    }

                     // send cookie to client
                    res.writeHead(200);//, [['Set-Cookie', 'auth=' + accessToken + '; max-age:' + '7200']]);
                    res.end(JSON.stringify(user));
                });
            }
        });

    });




    // db.get('users', { 'login': user.login }, function (err, doc) {
    //     if (err) { throw err; }
    //     if (doc && doc.length > 0) {
    //         auth.signin(doc[0], user.password, function (err, token) {
    //             if (err) {
    //                 res.writeHead(401);
    //                 res.end(err.toString());
    //             }
    //             res.writeHead(200, [
    //                 ['Set-Cookie', 'auth=' + token + '; max-age:' + '3600']
    //             ]);
    //             res.end(doc[0].id.toString());
    //         });
    //     } else {
    //         res.writeHead(404);
    //         res.end('user ' + user.login + ' not found');
    //     }
    // });



    // auth.signup(user.login, user.password, function (err, newUser) {
    //     if (err) { throw err; }
    //     db.assertDoesNotExist('users', { login: newUser.login }, function (err) {
    //         if (err) {
    //             if (err.message.match(/Existing user/)) {
    //                 res.writeHead(409);
    //                 res.end(err.message);
    //                 return;
    //             } else {
    //                 throw err;
    //             }
    //         }
    //         newUser.modtime = (new Date()).getTime();
    //         db.create('users', newUser, function (err, resources) {
    //             if (err) { throw err; }
    //             var userId = resources[0]._id.toString();
    //             res.writeHead(200);
    //             res.end(userId);
    //         });
    //     });
    // });

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
