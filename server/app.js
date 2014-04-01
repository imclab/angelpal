"use strict";

var express = require('express');
var colors = require('colors');
var passport = require('passport');
var config = require('./config');
var errors = require('./lib/errors');

// enable CORS
var enableCORS = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.client.baseUrl + config.server.port);
    res.setHeader('Access-Control-Allow-Origin', config.client.baseUrl + config.client.port);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Set-Cookie');
    next();
};

// configure express server
var app = express();
app.configure(function () {
	app.use(express.cookieParser());
    app.use(express.json());
	app.use(express.urlencoded());
    app.use(express.limit('20mb'));
    app.use(enableCORS);
    app.use(passport.initialize());
    app.use(app.router);
	app.use(errors.dispatch);
});

// production configuration
app.configure('production', function () {
	config.db.enableLogging = false;
});

// setup database
var db = require('./lib/db');

// setup models
require('./lib/models').init(db);

// create database
db.sync({force: true});

// setup security
require('./lib/security').init();

// setup routes
require('./lib/routes').init(app);

// start server
app.listen(config.server.port);
console.log('Server started on port: '.green + config.server.port);
