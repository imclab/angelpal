"use strict";
var authentication = require('./authentication.js');
var organization = require('./organization.js');

module.exports.init = function(app, config, security, errors) {

	app.get('/', function (req, res, next) {
	    res.send('Server is running fine !');
	});

	authentication.init(app, config, security, errors);
	organization.init(app, config, security, errors);

}
