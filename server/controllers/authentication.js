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
		passport.authenticate('angellist', { failureRedirect: 'http://localhost:9000' }),
		function (req, res) {
			res.redirect('http://localhost:9000/feeds');
		}
	);


	/**
	*	Logout
	*/
	app.post('/logout', function (req, res) {
	    req.logout();
	    res.writeHead(200);
	    res.end('Logout OK');
	});


	/**
	*	Am I logged in ?
	*/
	app.get('/me', function (req, res) {
	    res.send(req.isAuthenticated() ? '1' : '0');
	});

}
