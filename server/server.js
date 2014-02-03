"use strict";
var express = require('express');
var colors = require('colors');
var passport = require('passport');
var config = require('./config');
var security = require('./lib/security');
var errors = require('./lib/errors');

// enable CORS
var enableCORS = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://0.0.0.0:9000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
};

// configure server
var app = express();
app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(enableCORS);
    app.use(passport.initialize());
    app.use(app.router);
	app.use(errors.dispatch);
});

// production variables
app.configure('production', function () {
    // AppFog
    var env = JSON.parse(process.env.VCAP_SERVICES);
    config.db = env['mysql-5.1'][0]['credentials'];
    
    config.server.port = 80;
});

// setup models
app.set('models', require('./lib/models'));

// setup security
security.initialize(app, errors);

// setup routes
require('./lib/routes').init(app, config, security, errors);

// start server
app.listen(config.server.port);
console.log('Server started on port: '.green + config.server.port);
