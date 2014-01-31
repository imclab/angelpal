"use strict";
var express = require('express'),
    passport = require('passport'),
    util = require('util'),
    colors = require('colors'),
    AngelListStrategy = require('passport-angellist').Strategy,
    config = require('./config');

// enable CORS
var enableCORS = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://0.0.0.0:9000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
 
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

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

app.configure('production', function(){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    config.db = env['mysql-5.1'][0]['credentials'];
});

// setup models
app.set('models', require('./models'));

// setup routes
var controllers = require('./controllers');
controllers.set(app);

// configure authentication strategy
passport.use(new AngelListStrategy({
    clientID: "2453f00f021a59cf21f247862645af45",
    clientSecret: "e72b18b0210117916f987655212f5e5f",
    callbackURL: "http://127.0.0.1:3000/auth/angellist/callback"
  }, function (accessToken, refreshToken, profile, done) {
        var User = app.get('models').User;
        User.login(profile, accessToken, done);
    }
));
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

// start server
app.listen(config.server.port);
console.log('Server started on port: '.green + config.server.port);
