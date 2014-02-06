"use strict";
var express = require('express');
var passport = require('passport');
var AngelListStrategy = require('passport-angellist').Strategy;
var config = require('../config');
var Errors = null;
var User = null;

module.exports = {

	initialize: function (app, errors) {
		Errors = errors;
		User = app.get('models').User;

		// configure authentication strategy with Angellist
		passport.use(new AngelListStrategy(
		{
		    clientID: config.angellist.clientID,
		    clientSecret: config.angellist.clientSecret,
		    callbackURL: "http://localhost:" + config.server.port + "/auth/angellist/callback"
	 	}, 	function (accessToken, refreshToken, profile, done) {
		        User.login(profile, accessToken, done);
		    }
		));
		passport.serializeUser(function (user, done) {
		    done(null, user);
		});
		passport.deserializeUser(function (user, done) {
		    done(null, user);
		});
	},

	authenticate: function () {
		return passport.authenticate('angellist');
	},

	authenticationCallback: function () {
		return passport.authenticate('angellist', { failureRedirect: config.client.loginFailedUrl + config.client.port });
	},

	authenticationSuccessful: function (req, res) {
		res.redirect(config.client.loginSuccessUrl + config.client.port + '?token=' + req.user.token);
	},

	authenticationRequired: function (req, res, next) {
		var token = req.headers.authorization;
		if (token != null) {
			User.find({where: {token: token}}).success(function (user) {
				if (user != null) {
					req.user = user;
					return next();
				} else {
					return next(new Errors.Unauthorized('User is not logged in'));
				}
			});
	    } else {
	        return next(new Errors.Unauthorized('User is not logged in'));
	    }
	}

};
