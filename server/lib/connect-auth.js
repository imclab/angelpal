"use strict";
var Auth = require('./auth').Auth,
    auth = new Auth(),
    util = require('util'),
    db = require('./db-mysql');


module.exports.validate = function () {
    return function (req, res, next) {
        var token;

        // bypass authentication for signup and signin
        if ((req.url === '/users' && req.method === 'POST')
                   || (req.url === '/users/signin' && req.method === 'POST')) {
            return next();
        }
        if (!req.cookies.auth) {
            res.writeHead(401);
            res.end('Missing Cookie auth');
            return;
        }

        // Decode Token
        try {
            token = auth.decodeToken(req.cookies.auth);
            db.get('users', { login: token.login }, function (err, doc) {
                if (err) { throw err; }
                if (doc && doc.length > 0) {
                    auth.authenticate(doc[0], token.expirationTime, token.signature, function (err) {
                        if (err) {
                            console.log(err.message);
                            res.writeHead(401);
                            res.end('Invalid Token');
                        } else {
                            req.user = doc[0].id.toString();
                            console.log('user ' + req.user + ' validated');
                            return next();
                        }
                    });
                } else {
                    res.writeHead(401);
                    res.end('Invalid Token');
                }
            });
        } catch (err) {
            console.log(err.message);
            res.writeHead(401);
            res.end('Invalid Token');
        }
    };
};
