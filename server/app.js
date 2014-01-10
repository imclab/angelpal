"use strict";
var connect = require('connect'),
    util = require('util'),
    router = require('./lib/router'),
    auth = require('./lib/connect-auth'),
    user = require('./models/user'),
    disaster = require('./models/disaster'),
    config = require('./config');

// logs colors
var colors = require('colors');
colors.setTheme({
  success: 'green',
  error: 'red',
  info: 'yellow',
  debug: 'grey'
});

var app = connect()
    .use(function (req, res, next) {
        next();
    })
    .use(connect.bodyParser())
    .use(connect.cookieParser())
    .use(function (err, req, res, next) {
        if (err === null) { next(); }
        res.writeHead(400);
        res.end('Invalid JSON:' + err.message);
    })
    .use(auth.validate())
    .use(router.match('GET',    '/users/([0-9a-f])',            user.get)) // get my user info
    .use(router.match('GET',    '/users/([0-9a-f])/disasters',  disaster.getAll)) // get my disasters
    .use(router.match('POST',   '/users',                       user.signup)) // create account
    .use(router.match('POST',   '/users/signin',                user.signin)) // login
    .use(router.match('POST',   '/disasters',                   disaster.create)) // create disaster
    .use(router.match('POST',   '/disasters/([0-9a-f])',        disaster.update)) // update disaster
    .use(router.match('DELETE', '/disasters/([0-9a-f])',        disaster.remove)) // delete disaster

    .listen(config.server.port);

console.log('Server started on port: '.green + config.server.port);
