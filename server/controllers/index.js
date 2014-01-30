"use strict";
var passport = require('passport'),
	authentication = require('./authentication.js'),
	organization = require('./organization.js');


module.exports.set = function(app) {

	var User = app.get('models').User;

	passport.ensureAuthenticated = function (req, res, next) {
		var token = req.headers.authorization
		if (token != null) {
			User.find({where: {token: token}}).success(function (user) {
				if (user != null) {
					req.user = user;
					return next();
				} else {
					res.writeHead(401);
	        		res.end('Not logged in');
				}
			});
	    } else {
	        res.writeHead(401);
	        res.end('Not logged in');
	    }
	}

	app.get('/', function (req, res) {
	    res.send('Server is running fine !');
	});

	authentication.set(app);
	organization.set(app);

}
