"use strict";
var passport = require('passport');

module.exports.set = function(app) {
    

    /**
    *	Login
    */
    app.get('/auth/angellist', passport.authenticate('angellist'));
	

    /**
    *	OAuth Redirection
    */
	app.get('/auth/angellist/callback', 
		passport.authenticate('angellist', { failureRedirect: 'http://google.fr' }), // Authentication failure, redirect to Web App Home
	    function (req, res) { // Successful authentication, redirect to Web App Feeds
	        res.redirect('/feeds');
	    }
	);


	/**
	*	Logout
	*/
	app.get('/logout', function (req, res){
	    req.logout();
	    res.writeHead(200);
	    res.end('Logout OK');
	});

}
