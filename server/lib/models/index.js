"use strict";

module.exports.init = function(db) {

	// load models
	var models = ['User', 'Company', 'Process', 'Message', 'Document', 'Comment'];

	models.forEach(function (model) {
	    module.exports[model] = db.import(__dirname + '/' + model);
	});

};
