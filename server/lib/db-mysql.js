"use strict";
var mysql = require('mysql'),
	config = require('../config');

//database
function MysqlDb() {
	this.db = mysql.createConnection({
	    host: config.mysqlDb.host,
	    user: config.mysqlDb.user,
	    password: 'root',
	});
	this.db.connect();
	this.db.query('USE ' + config.mysqlDb.name, function(err, rows, fields) {
		if (err) { throw err; }
	});
}


// ### All
MysqlDb.prototype.all = function (resource, query, callback) {
	console.log('GET ALL '.debug + resource);
	this.db.query('SELECT * FROM ' + resource + ' WHERE ?', query, function (err, rows, fields) {
		if (err) { throw err; }
		callback(err, rows);
	});
};


// ### get
MysqlDb.prototype.get = function (resource, query, callback) {
	console.log('GET '.debug + resource);
    this.db.query('SELECT * FROM ' + resource + ' WHERE ?', query, function (err, rows, fields) {
    	if (err) { throw err; }
		callback(err, rows);
    });
};


// ## create
MysqlDb.prototype.create = function (resource, object, callback) {
	console.log('INSERT INTO '.debug + resource);
	this.db.query('INSERT INTO ' + resource + ' SET ?', object, function (err, result) {
    	if (err) { throw err; }
		callback(err, result);
    });
};


// ### Update a resource
MysqlDb.prototype.update = function (resource, id, object, callback) {
    console.log('UPDATE '.debug + resource);
	this.db.query('UPDATE ' + resource + ' SET ? WHERE id = ' + id, object, function (err, result) {
    	if (err) { throw err; }
		callback(err, result);
    });
};


// ## remove
MysqlDb.prototype.remove = function (resource, id, callback) {
	console.log('DELETE '.debug + resource + ' ' + id);
    this.db.query('DELETE FROM ' + resource + ' WHERE id = ? LIMIT 1', [id], function (err, result) {
    	if (err) { throw err; }
		callback(err, result);
    });
};

// ### Assert that a resource does not exists
MysqlDb.prototype.assertDoesNotExist = function (resource, query, callback) {
    this.db.query('SELECT * FROM ' + resource + ' WHERE ?', query, function (err, rows, fields) {
    	if (err) { throw err; }
    	else if (rows.length > 0) {
    		var error = new Error('Existing ' + resource + ' ' + util.inspect(query));
            console.log(error.message);
    		callback(error);
    	} else {
			callback();
		}
    });
};

module.exports = new MysqlDb();
