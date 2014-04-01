"use strict";

var Sequelize = require('sequelize');
var Errors = require('../errors');
var Models = require('../models');

var Jam = Models.Jam;
var Comment = Models.Comment;


exports.getJamComments = function (req, res, next) {

	var pagination = req.query.pagination || 20;
	if (pagination <= 0) { pagination = 20; }
	var page = req.query.page || 1;
	if (page <= 0) { page = 1; }

	// get comments + user info
	Comment.daoFactoryManager.sequelize.query('SELECT c.id, c.content, c.createdAt, c.userId, u.name as ownerName, u.facebook_id as ownerFacebookId, u.picture_url as ownerPictureUrl'
	+ ' FROM comments c LEFT JOIN users u ON u.id=c.userId LEFT JOIN jams j ON c.jamId=j.id'
	+ ' WHERE c.jamId=? AND (j.privacy=0 OR j.userId=?) ORDER BY c.createdAt DESC LIMIT ' + (page == 1 ? 0 : ((page - 1) * pagination + 1)) + ',' + pagination
		, null, { raw: true }, [req.params.jamId, req.user.id])
	.success(function (rows) {
		
		var result = {
			pagination: pagination,
			page: page,
			comments: rows
		}
		res.send(result);
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};

exports.addJamComment = function (req, res, next) {

	var postData = req.body;

	// check data
	if (!postData.content || postData.content.length == 0) {
		return next(new Errors.BadRequest('Missing fields'));
	}

	// get jam
	Jam.find({ 
		where: Sequelize.and(
			{ id: req.params.jamId }, 
			Sequelize.or(
				{ privacy: 0 }, 
				{ userId: req.user.id }
			)
		) 
	}).success(function (jam) {
		if (jam == null) { return next(new Errors.BadRequest('Jam not found')); }

		// create comment
		Comment.create({ content: postData.content, userId: req.user.id, jamId: jam.id })
		.success(function (newComment) {
			res.send(newComment);
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};

exports.deleteJamComment = function (req, res, next) {

	// get comment
	Comment.find({ 
		where: { 
			id: req.params.commentId,
			jamId: req.params.jamId,
			userId: req.user.id
		}
	}).success(function (comment) {
		if (comment == null) { return next(new Errors.BadRequest('Comment not found')); }

		// delete comment
		comment.destroy()
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
