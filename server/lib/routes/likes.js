"use strict";

var authorization = require('./middlewares/authorization');
var likes = require('../controllers/likes');


module.exports.init = function (app) {


	/**
	 *	Like a jam
	 */
	 app.post('/jams/:jamId/likes', authorization.requiresAuthentication, likes.likeJam);


	/**
	 *	Unlike a jam
	 */
	 app.delete('/jams/:jamId/likes', authorization.requiresAuthentication, likes.unlikeJam);


}
