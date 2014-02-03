"use strict";
var passport = require('passport');

module.exports.set = function(app) {
    

    /**
    *	Login
    */
    app.get('/auth/angellist', passport.authenticate('angellist'));
	

    /**
    *	OAuth Callback
    */
	app.get('/auth/angellist/callback', 
		passport.authenticate('angellist', { failureRedirect: 'http://0.0.0.0:9000' }),
		function (req, res) {
			res.redirect('http://0.0.0.0:9000/?token=' + req.user.token);
		}
	);


	/**
	*	Am I logged in ? Returns user information
	*/
	app.get('/me', passport.ensureAuthenticated, function (req, res) {
		req.user.token = '';
	    res.send(req.user);
	});

}
