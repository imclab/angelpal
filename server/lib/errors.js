"use strict"
module.exports = {

	dispatch: function (err, req, res, next) {
		var message = err.message;
		var status = err.status || 500;
		if (status == 500) {
			console.error(err.error || err);
		}
		res.json({ message: message }, status);
	},

	Error: function (message) {
		this.message = message;
		this.status = 500;
	},

	Unauthorized: function (message) {
		this.message = message;
		this.status = 401;
	},

	BadRequest: function (message) {
		this.message = message;
		this.status = 400;
	}

};
