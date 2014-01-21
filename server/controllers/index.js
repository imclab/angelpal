"use strict";
var passport = require('passport'), 
	authentication = require('./authentication.js'),
	organization = require('./organization.js');


passport.ensureAuthenticated = function (req, res, next) {
	// testing...
	req.user = {
		angellist_id: 479639,
		name: 'GG'
	}
	return next();

    if (req.isAuthenticated()) { return next(); }
    else {
        res.writeHead(401);
        res.end('Not logged in');
    }
}

module.exports.set = function(app) {

	app.get('/', function (req, res) {
	    res.writeHead(200);
	    res.end('Server is running !');
	});

	authentication.set(app);
	organization.set(app);

}