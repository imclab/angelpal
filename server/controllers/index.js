"use strict";
var passport = require('passport'),
	authentication = require('./authentication.js'),
	organization = require('./organization.js');




module.exports.set = function(app) {

	passport.ensureAuthenticated = function (req, res, next) {
		
	    if (req.isAuthenticated()) { 
	    	return next();
	    } else {
	        res.writeHead(401);
	        res.end('Not logged in');
	    }
	}

	app.get('/', function (req, res) {
	    res.render('index');
	});

	authentication.set(app);
	organization.set(app);

}
