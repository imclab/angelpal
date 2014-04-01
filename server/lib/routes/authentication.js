"use strict";

var passport = require('passport');
var config = require('../../config');
var Utils = require('../utils');


module.exports.init = function (app) {
    

    /**
    *	Angellist Login
    */
    app.get('/auth/angellist', passport.authenticate('angellist'));
	

    /**
    *	Angellist OAuth Callback
    */
	app.get('/auth/angellist/callback', passport.authenticate('angellist', { 
		failureRedirect: config.client.loginFailedUrl + config.client.port 
	}), function (req, res) {
		res.redirect(config.client.loginSuccessUrl + config.client.port + '#?token=' + Utils.encrypt(req.user.facebook_token));
	});


    /**
    *   Logout
    */
    app.post('/logout', function (req, res) {
        res.clearCookie('jam_token');
        res.send(200);
    });


}
