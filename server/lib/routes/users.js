"use strict";

var authorization = require('./middlewares/authorization');
var users = require('../controllers/users');


module.exports.init = function (app) {


	/**
	*	Am I logged in ? Returns user information
	*/
	app.get('/me', authorization.requiresAuthentication, users.getLoggedInUser);
	

	/**
	*	Get a user profile
	*/
	app.get('/users/:userId', authorization.requiresAuthentication, users.getUserProfile);


	/**
	*	Update user
	*/
	app.put('/users/:userId', authorization.requiresAuthentication, users.updateUser);


	/**
	*	Delete account
	*/
	app.delete('/users/:userId', authorization.requiresAuthentication, users.deleteAccount);


	/**
	*	Get a user's friends list
	*/
	app.get('/users/:userId/friends', authorization.requiresAuthentication, users.getFriendsList);


	/**
	 *	Follow user
	 */
	 app.post('/users/:userId/follow', authorization.requiresAuthentication, users.followUser);


	/**
	 *	Unfollow user
	 */
	 app.delete('/users/:userId/follow', authorization.requiresAuthentication, users.unfollowUser);


};