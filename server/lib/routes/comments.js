"use strict";

var authorization = require('./middlewares/authorization');
var comments = require('../controllers/comments');


module.exports.init = function (app) {


	/**
	 *	Get jam's comments
	 */
	 app.get('/jams/:jamId/comments', authorization.requiresAuthentication, comments.getJamComments);


	/**
	 *	Add Comment to jam
	 */
	 app.post('/jams/:jamId/comments', authorization.requiresAuthentication, comments.addJamComment);


	/**
	 *	Delete Comment from jam
	 */
	 app.delete('/jams/:jamId/comments/:commentId', authorization.requiresAuthentication, comments.deleteJamComment);


}
