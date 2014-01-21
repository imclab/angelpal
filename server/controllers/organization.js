"use strict";
var passport = require('passport'),
	organization = require('../models/organization.js');

module.exports.set = function(app) {
    

	 /**
	 *	Get all my organizations
	 */
	app.get('/organizations', passport.ensureAuthenticated, function (req, res) {
		organization.getAll(req.user.angellist_id, function (err, result) {
			if (err) {
				res.writeHead(500);
				res.end('Server error');
			} else {
				res.send(result);
			}
		});
	});


	/**
	 *	Create new organization
	 */
	app.post('/organizations', passport.ensureAuthenticated, function (req, res) {
		var postData = req.body;

		// check data
		if (!postData.name || postData.name.length == 0) {
			res.writeHead(401);
			res.end('Missing fields');
			return;
		}

		organization.create(req.user.angellist_id, postData.name, function (err, result) {
			if (err) {
				res.writeHead(500);
				res.end('Server error');
			} else {
				res.send(result);
			}
		});
	});


	/**
	 *	Get organization details
	 */
	app.get('/organizations/:id', passport.ensureAuthenticated, function (req, res) {
		organization.getDetails(req.user.angellist_id, req.params.id, function (err, result) {
			if (err) {
				res.writeHead(500);
				res.end('Server error');
			} else {
				res.send(result);
			}
		});
	});


	/**
	 *	Invite to organization
	 */
	app.post('/organizations/:id/users/:userId', passport.ensureAuthenticated, function (req, res) {
		var postData = req.body;

		// check data
		if (!postData.role) {
			res.writeHead(401);
			res.end('Missing fields');
			return;
		}

		organization.invite(req.user.angellist_id, req.params.id, req.params.userId, postData.role, function (err, result) {
			if (err) {
				res.writeHead(500);
				res.end('Server error');
			} else {
				res.send(result);
			}
		});
	});


	/**
	 *	Update permissions
	 */
	app.post('/organizations/:id/users/:userId/changePermission', passport.ensureAuthenticated, function (req, res) {
		var postData = req.body;

		// check data
		if (!postData.role) {
			res.writeHead(401);
			res.end('Missing fields');
			return;
		}

		organization.changePermission(req.user.angellist_id, req.params.id, req.params.userId, postData.role, function (err, result) {
			if (err) {
				res.writeHead(500);
				res.end('Server error');
			} else {
				res.send(result);
			}
		});
	});


}
