"use strict";

var Sequelize = require('sequelize');
var Errors = require('../errors');
var Models = require('../models');

var Jam = Models.Jam;
var Like = Models.Like;


exports.likeJam = function (req, res, next) {

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

		// create like
		Like.findOrCreate({ userId: req.user.id, jamId: jam.id })
		.success(function (newlike) {
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

exports.unlikeJam = function (req, res, next) {

	// get like
	Like.find({ 
		where: { 
			jamId: req.params.jamId,
			userId: req.user.id
		}
	}).success(function (like) {
		if (like == null) { return next(new Errors.BadRequest('like not found')); }

		// delete like
		like.destroy()
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
