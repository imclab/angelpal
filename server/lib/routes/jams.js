"use strict";

var authorization = require('./middlewares/authorization');
var jams = require('../controllers/jams');


module.exports.init = function (app) {


	/**
	 *	Create new jam
	 */
	app.post('/jams', authorization.requiresAuthentication, jams.createNewJam);


	/**
	 *	Update jam
	 */
	app.put('/jams/:jamId', authorization.requiresAuthentication, jams.updateJam);


	/**
	 *	Delete jam
	 */
	 app.delete('/jams/:jamId', authorization.requiresAuthentication, jams.deleteJam);


	/**
	 *	Get jam details
	 */
	app.get('/jams/:jamId', authorization.requiresAuthentication, jams.getJamDetails);


	/**
	 *	Get jam's feeds
	 */
	app.get('/feeds', authorization.requiresAuthentication, jams.getJamFeeds);


};
