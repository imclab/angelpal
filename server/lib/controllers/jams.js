"use strict";

var Sequelize = require('sequelize');
var Errors = require('../errors');
var Models = require('../models');

var Jam = Models.Jam;
var User = Models.User;
var Like = Models.Like;
var Video = Models.Video;
var Comment = Models.Comment;


exports.createNewJam = function (req, res, next) {

	var postData = req.body;

	// check data
	if (!postData.name || postData.name.length == 0) {
		return next(new Errors.BadRequest('Missing fields'));
	}

	// get user
	User.find({ where: {facebook_token: req.user.facebook_token} })
	.success(function (user) {
		if (user == null) { return next(new Errors.BadRequest('User not found')); }

		Jam.create({ name: postData.name, privacy: postData.privacy })
		.success(function (newJam) {
			Like.create({ userId: req.user.id, jamId: newJam.id });
			user.addJam(newJam)
			.success(function () {
				res.send(newJam);
			})
			.error(function (error) {
				return next(new Errors.Error(error, 'Server error'));
			});
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};

exports.updateJam = function (req, res, next) {

	var postData = req.body;

	// get jam
	Jam.find({ 
		where: {
			id: req.params.jamId,
			userId: req.user.id
		} 
	})
	.success(function (jam) {
		if (jam == null) { return next(new Errors.BadRequest('Jam not found')); }

		jam.name = postData.name || jam.name;
		jam.privacy = postData.privacy || jam.privacy;
		
		jam.save(['name', 'privacy'])
		.success(function () {
			res.send(jam);
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};

exports.deleteJam = function (req, res, next) {

	// get Jam
	Jam.find({ 
		where: { 
			id: req.params.jamId,
			userId: req.user.id
		}
	}).success(function (jam) {
		if (jam == null) { return next(new Errors.BadRequest('Jam not found')); }

		// delete likes
		Like.destroy({
			jamId: jam.id
		});

		// delete comments
		Comment.destroy({
			jamId: jam.id
		});

		// delete jam
		jam.destroy()
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

exports.getJamDetails = function (req, res, next) {

	// get jam + owner info + number of likes in one request
	Jam.daoFactoryManager.sequelize.query('SELECT j.*, u.name as ownerName, u.facebook_id as ownerFacebookId, u.picture_url as ownerPictureUrl, count(l.id) as nbLikes'
	+ ' FROM jams j LEFT JOIN users u ON u.id=j.userId LEFT OUTER JOIN likes l ON l.jamId=j.id'
	+ ' WHERE j.id=? AND (j.privacy=0 OR j.userId=?)'
		, null, { raw: true }, [req.params.jamId, req.user.id])
	.success(function (rows) {
		if (rows == null || rows.length == 0 || rows[0].id == null) { return next(new Errors.BadRequest('Jam not found')); }
		var jam = rows[0];

		// do I like it already ?
		Like.count({
			where: {
				jamId: jam.id,
				userId: req.user.id
			}
		})
		.success(function (result) {
			jam.doILikeIt = result > 0;

			// get jam's videos
			Jam.daoFactoryManager.sequelize.query('SELECT v.id, v.instrument, v.createdAt, v.userId, u.name as ownerName, u.facebook_id as ownerFacebookId, u.picture_url as ownerPictureUrl, AVG(n.value) AS note'
			+ ' FROM videos v LEFT JOIN users u ON u.id=v.userId LEFT OUTER JOIN notes n ON n.videoId=v.id'
			+ ' WHERE v.jamId=? GROUP BY v.id ORDER BY v.createdAt DESC'
				, null, { raw: true }, [req.params.jamId])
			.success(function (rows) {					
				jam.videos = rows;
				res.send(jam);
			})
			.error(function (error) {
				return next(new Errors.Error(error, 'Server error'));
			});
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};

exports.getJamFeeds = function (req, res, next) {

	var pagination = req.query.pagination || 20;
	if (pagination <= 0) { pagination = 20; }
	var page = req.query.page || 1;
	if (page <= 0) { page = 1; }

	var orderBy;
	var feedsType = req.query.feedsType || 'popular';
	if (feedsType == 'recent') {
		orderBy = 'j.createdAt DESC, nbLikes DESC';
	} else if (feedsType == 'ourfavorites') {
		orderBy = 'j.star DESC, nbLikes DESC, j.createdAt DESC';
	} else {
		orderBy = 'nbLikes DESC, j.createdAt DESC';
	}

	// get  user info
	Comment.daoFactoryManager.sequelize.query('SELECT j.*, u.name as ownerName, u.facebook_id as ownerFacebookId, u.picture_url as ownerPictureUrl, COUNT(l.id) as nbLikes, IF (l.userId=?, 1, 0) as doILikeIt'
	+ ' FROM jams j LEFT JOIN users u ON u.id=j.userId LEFT OUTER JOIN likes l ON l.jamId=j.id ' + (feedsType == 'friendsJams' ? 'LEFT JOIN friends f ON j.userId=f.friendId' : '')
	+ ' WHERE j.privacy=0 ' + (feedsType == 'friendsJams' ? 'AND f.userId=' + req.user.id : '') + ' GROUP BY j.id ORDER BY ' + orderBy + ' LIMIT ' + (page == 1 ? 0 : ((page - 1) * pagination + 1)) + ',' + pagination
		, null, { raw: true }, [req.user.id, req.user.id])
	.success(function (rows) {
	
		var result = {
			pagination: pagination,
			page: page,
			jams: rows
		}
		res.send(result);
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};

