"use strict";
var mysql = require('mysql'),
	config = require('../config');

//database
function MysqlDb() {
	this.db = mysql.createConnection({
	    host: config.mysqlDb.host,
	    user: config.mysqlDb.user,
	    password: config.mysqlDb.password,
	});
	this.db.connect();
	this.db.query('USE ' + config.mysqlDb.name, function(err, rows, fields) {
		if (err) { throw err; }
	});
}


// ### get
MysqlDb.prototype.get = function (resource, query, callback) {
	console.log('GET '.grey + resource);
    this.db.query('SELECT * FROM ' + resource + ' WHERE ?', query, function (err, rows, fields) {
    	if (err) { throw err; }
		callback(err, rows);
    });
};


// ## create
MysqlDb.prototype.create = function (resource, object, callback) {
	console.log('INSERT INTO '.grey + resource);
	this.db.query('INSERT INTO ' + resource + ' SET ?', object, function (err, result) {
    	if (err) { throw err; }
		callback(err, result);
    });
};


// ### Update a resource
MysqlDb.prototype.update = function (resource, id, object, callback) {
    console.log('UPDATE '.grey + resource);
	this.db.query('UPDATE ' + resource + ' SET ? WHERE id = ' + id, object, function (err, result) {
    	if (err) { throw err; }
		callback(err, result);
    });
};


// ## remove
MysqlDb.prototype.remove = function (resource, id, callback) {
	console.log('DELETE '.grey + resource + ' ' + id);
    this.db.query('DELETE FROM ' + resource + ' WHERE id = ? LIMIT 1', [id], function (err, result) {
    	if (err) { throw err; }
		callback(err, result);
    });
};

module.exports = new MysqlDb();
