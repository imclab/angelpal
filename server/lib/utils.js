"use strict";
var fs = require('fs');
var crypto = require('crypto');
var config = require('../config');


String.prototype.replaceAll = function (find, replace) {
	var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
}

module.exports = {

	writeFileToDisk: function (fileName, data, callback) {
		fs.writeFile(__dirname.replaceAll('lib', '') + 'uploads/videos/' + fileName, data, callback);
	},

	readFileFromDisk: function (fileName, callback) {
		fs.readFile(__dirname.replaceAll('lib', '') + 'uploads/videos/' + fileName, callback);
	},

	deleteFileFromDisk: function (fileName, callback) {
		fs.unlink(__dirname.replaceAll('lib', '') + 'uploads/videos/' + fileName, callback);
	},

	encrypt: function (data) {
		var cipher = crypto.createCipher(config.crypto.algorithm, config.crypto.key);  
		return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
	},

	decrypt: function (data) {
		var decipher = crypto.createDecipher(config.crypto.algorithm, config.crypto.key);
		return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
	}

};
