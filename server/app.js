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

// Enables CORS
var enableCORS = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
 
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.end();
    }
    else {
      next();
    }
};

var app = connect()
    .use(function (req, res, next) {
        next();
    })
    .use(connect.bodyParser())
    .use(connect.cookieParser())
    .use(function (err, req, res, next) {
        if (err === null) { next(); }
        res.end('Invalid JSON:' + err.message);
    })
    .use(enableCORS)
    .use(router.match('POST',   '/login',                       user.login)) // login / create account
    .use(auth.validate())
    .use(router.match('GET',    '/users/([0-9a-f])',            user.get)) // get my user info
    .use(router.match('GET',    '/users/([0-9a-f])/disasters',  disaster.getAll)) // get my disasters
    .use(router.match('POST',   '/disasters',                   disaster.create)) // create disaster
    .use(router.match('POST',   '/disasters/([0-9a-f])',        disaster.update)) // update disaster
    .use(router.match('DELETE', '/disasters/([0-9a-f])',        disaster.remove)) // delete disaster

    .listen(config.server.port);

console.log('Server started on port: '.green + config.server.port);
