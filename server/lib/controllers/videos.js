"use strict";

var Sequelize = require('sequelize');
var Errors = require('../errors');
var Utils = require('../utils');
var Models = require('../models');

var Jam = Models.Jam;
var Video = Models.Video;
var Note = Models.Note;


exports.addVideoToJam = function (req, res, next) {
	
	var postData = req.body;

	// check data
	if (!postData || !postData.video_blob || postData.video_blob.length == 0 || !postData.audio_blob || postData.audio_blob.length == 0) {
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

		// create video
		Video.create({ instrument: postData.instrument, userId: req.user.id })
		.success(function (newVideo) {

			// save audio and video files to disk
			Utils.writeFileToDisk(newVideo.id + '.webm', postData.video_blob, function (err) {
				if (err) {
					return next(new Errors.Error(err, 'Server error'));
				} else {
					// add relation
					jam.addVideos(newVideo)
					.success(function () {
						res.send(newVideo);
					})
					.error(function (error) {
						return next(new Errors.Error(error, 'Server error'));
					});
				}
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

exports.getVideoStream = function (req, res, next) {

	// get jam
	Jam.find({ 
		where: Sequelize.and(
			{ id: req.params.jamId }, 
			Sequelize.or(
				{ privacy: 0 }, 
				{ userId: req.user.id }
			)
		) 
	})
	.success(function (jam) {
		if (jam == null) { return next(new Errors.BadRequest('Jam not found')); }

		jam.getVideos({
			where: {
				id: req.params.videoId
			}
		})
		.success(function (videos) {
			if (videos == null || videos.length == 0) { return next(new Errors.BadRequest('Video not found')); }

			Utils.readFileFromDisk(req.params.videoId + '.webm', function (error, file) {
				if (error) {
					return next(new Errors.BadRequest('Video not found'));
				} else {
					res.writeHead(200, {'Content-Type': 'video/mpeg' });
					res.end(file, 'binary');
				}
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

exports.deleteVideoFromJam = function (req, res, next) {

	// get video
	Video.find({ 
		where: { 
			id: req.params.videoId,
			jamId: req.params.jamId
		}
	}).success(function (video) {
		if (video == null) { return next(new Errors.BadRequest('Video not found')); }

		// check if user can delete video
		Jam.find({
			where: {
				id: req.params.jamId
			}
		})
		.success(function (jam) {
			// jam owners can delete videos
			if (jam.userId == req.user.id || video.userId == req.user.id) {
				video.destroy()
				.success(function () {
					Utils.deleteFileFromDisk(req.params.videoId + '.webm', function (error) {
						if (error) {
							return next(new Errors.BadRequest('Video not found'));
						} else {
							res.send(200);	
						}
					})
				})
				.error(function (error) {
					return next(new Errors.Error(error, 'Server error'));
				});
			} else {
				if (video == null) { return next(new Errors.BadRequest('You cannot delete this video')); }
			}
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});

	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};

exports.noteVideo = function (req, res, next) {

 	var postData = req.body;

	// check data
	if (!postData.value || postData.value.length == 0 || postData.value > 5 || postData.value < 1) {
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

		// create / update note
		Note.findOrCreate({ userId: req.user.id, videoId: req.params.videoId })
		.success(function (note) {
			note.value = postData.value;
			note.save()
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
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};
