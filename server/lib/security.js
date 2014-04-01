"use strict";

var config = require('../config');
var passport = require('passport');
var AngelListStrategy = require('passport-angellist').Strategy;

var users = require('./controllers/users');


exports.init = function () {

	// Use angellist strategy
	passport.use(new AngelListStrategy({
		    clientID: config.angellist.clientID,
		    clientSecret: config.angellist.clientSecret,
		    callbackURL: "http://localhost:" + config.server.port + "/auth/angellist/callback"
	 	}, 	function (accessToken, refreshToken, profile, done) {
		        users.login(profile, accessToken, done);
		    }
		));
		passport.serializeUser(function (user, done) {
		    return done(null, user);
		});
		passport.deserializeUser(function (user, done) {
		    return done(null, user);
	});

};
