"use strict";
module.exports = {

	server: {
	    port : 3000
	},

	db: {
	    name : 'angelpal',
	    host : 'localhost',
	    user : 'root',
	    password: 'root',
	    port: 3306,
	    dialect: 'mysql'
	},

	smtp: {
		service: 'Gmail',
		user: 'giggs.apps@gmail.com',
		pass: 'putain666'
	},

	client: {
		baseUrl: 'http://0.0.0.0:9000',
		loginFailedUrl: 'http://0.0.0.0:9000',
		loginSuccessUrl: 'http://0.0.0.0:9000?token='
	}

};
