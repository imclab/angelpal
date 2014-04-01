"use strict";

module.exports.init = function (app) {

	// serve app
	app.get('/', function (req, res, next) {
	    res.send('Server is running !');
	});

	// init routes
	var routes = ['authentication', 'jams', 'users', 'comments', 'likes', 'videos'];

	for (var i = 0; i < routes.length; i++) {
		require('./' + routes[i] + '.js').init(app);
	}

}
