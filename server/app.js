"use strict";
var express = require('express'),
    passport = require('passport'),
    util = require('util'),
    colors = require('colors'),
    AngelListStrategy = require('passport-angellist').Strategy,
    user = require('./models/user'),
    config = require('./config');

// enable CORS
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

// configure authentication strategy
passport.use(new AngelListStrategy({
    clientID: "2453f00f021a59cf21f247862645af45",
    clientSecret: "e72b18b0210117916f987655212f5e5f",
    callbackURL: "http://127.0.0.1:3000/auth/angellist/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    user.findOrCreate(profile, function (err, user) {
        return done(err, user);
    });
  }
));
passport.serializeUser(function (user, done) {
    done(null, user.angellist_id);
});
passport.deserializeUser(function (id, done) {
    user.findById(id, function (err, user) {
        done(err, user);
    });
});

// configure server
var app = express();
app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(enableCORS);
    app.use(express.session({ secret: 'bobby lapointe' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

// setup routes
var controllers = require('./controllers');
controllers.set(app);

// start server
app.listen(config.server.port);

console.log('Server started on port: '.green + config.server.port);
