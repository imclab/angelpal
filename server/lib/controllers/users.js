"use strict";

var Sequelize = require('sequelize');
var Errors = require('../errors');
var Models = require('../models');

var User = Models.User;
var Friend = Models.Friend;
var Video = Models.Video;
var Comment = Models.Comment;
var Jam = Models.Jam;


exports.getUserProfile = function (req, res, next) {

	User.find(
		{ 
			where: { 
				id: req.params.userId 
			}, 
			attributes: ['name', 'picture_url', 'facebook_id', 'createdAt', 'vignette_one', 'vignette_two', 'vignette_three'], 
			include: [{ 
				model: Jam,
				required: false,
			}]
		})
		.success(function (user) {
			if (user == null) { return next(new Errors.BadRequest('User not found')); }
			else if (user.id != req.user.id) {
				var i = user.jams.length;
				while (i--) {
					if (user.jams[i].privacy != 0) {
						user.jams.splice(i, 1);
					}
				}
			}
			Friend.findAll(
				{	
					where: {
						userId: req.user.id,
						friendId: req.params.userId
					}
				})
			.success(function (friends) {
				user.doIFollowHim = friends.length > 0;
				res.send(user);
			})
			.error(function (error) {
				return next(new Errors.Error(error, 'Server error'));
			});
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});

};

exports.updateUser = function (req, res, next) {

	var postData = req.body;

	// get user
	User.find(
		{ 
			where: {
				id: req.user.id
			} 
		})
		.success(function (user) {
			if (user == null) { return next(new Errors.BadRequest('User not found')); }

			user.vignette_one = postData.vignette_one || user.vignette_one;
			user.vignette_two = postData.vignette_two || user.vignette_two;
			user.vignette_three = postData.vignette_three || user.vignette_three;
			
			user.save(['vignette_one', 'vignette_two', 'vignette_three'])
			.success(function () {
				res.send(200);
			})
			.error(function (error) {
				return next(new Errors.Error(error, 'Server error'));
			});
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});

};

exports.deleteAccount = function (req, res, next) {

	User.find({ 
			where: { 
				id: req.params.userId 
			}
		})
		.success(function (user) {
			if (user == null) { return next(new Errors.BadRequest('User not found')); }

			// delete videos
			Video.destroy({
				userId: req.user.id
			});

			// delete comments
			Comment.destroy({
				userId: req.user.id
			});

			// hide all jams
			Jam.update({
				privacy: 1
			}, {
				userId: req.user.id
			});

			// delete user
			user.destroy()
			.success(function () {
				res.send(200);	
			})
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});

};

exports.getFriendsList = function (req, res, next) {

		var pagination = req.query.pagination || 20;
		if (pagination <= 0) { pagination = 20; }
		var page = req.query.page || 1;
		if (page <= 0) { page = 1; }
		
		Friend.daoFactoryManager.sequelize.query('SELECT f.id, u.name, u.facebook_id, u.picture_url, u.vignette_one, u.vignette_two, u.vignette_three'
		+ ' FROM friends f LEFT JOIN users u ON u.id=f.friendId'
		+ ' WHERE f.userId=? ORDER BY f.createdAt DESC LIMIT ' + (page == 1 ? 0 : ((page - 1) * pagination + 1)) + ',' + pagination
			, null, { raw: true }, [req.params.userId])
		.success(function (rows) {

			var result = {
				pagination: pagination,
				page: page,
				friends: rows
			}
			res.send(result);
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});

};

exports.followUser = function (req, res, next) {

	// get both users
	User.findAll({ 
		where: Sequelize.or(
			{ id: req.params.userId }, 
			{ id: req.user.id }
		) 
	}).success(function (users) {
		if (users == null || users.length != 2) { return next(new Errors.BadRequest('User not found')); }

		// add relationship
		Friend.findOrCreate({ userId: req.user.id, friendId: req.params.userId })
		.success(function (newFriend) {
			res.send(200);
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};

exports.unfollowUser = function (req, res, next) {

	// get Friend
	Friend.destroy({
			userId: req.user.id,
			friendId: req.params.userId
	}).success(function () {
		res.send(200);
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});
	
};

exports.login = function (profile, accessToken, done) {

    // find or create account
    User.findOrCreate({ 
    		facebook_id: profile.id 
    	},
    	{ 
            name: profile.displayName,
            picture_url: 'facebook',
            facebook_id: profile.id,
            facebook_token: accessToken
        })
        .success(function (user, created) {
            return done(false, user);
        })
        .error(function (error) {
            return done(error, false);
        });

};

exports.getLoggedInUser = function (req, res, next) {

	req.user.facebook_token = null;
    res.send(req.user);
    
};

exports.getUserByToken = function (token, next) {

    User.find({where: {facebook_token: token}})
    .success(function (user) {
		if (user != null) {
			return next(user, null);
		} else {
			return next(null, new Errors.BadRequest('User not found'));
		}
	})
	.error(function (error) {
		return next(null, new Errors.Error(error, 'Server error'));
    });

};

exports.getUserById = function (id, next) {

	User.find({where: {id: id}}).success(function (user) {
		if (user != null) {
			return next(user, null);
		} else {
			return next(null, new Errors.BadRequest('User not found'));
		}
	})
	.error(function (error) {
		return next(null, new Errors.Error(error, 'Server error'));
    });

};
