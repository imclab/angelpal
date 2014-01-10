"use strict";
var crypto = require('crypto');
var emitter = require('events').EventEmitter;
var util = require('util');

var secret = 'paranormalement';
function Auth() { }
util.inherits(Auth, emitter);
exports.Auth = Auth;


// Helpers (private static)
function getSalt(password) {
    var shasum = crypto.createHash('sha256');
    shasum.update((Math.random() * Math.pow(10, 15)).toString(16) + "--" + password);
    return shasum.digest('hex');
}
function encryptPassword(password, salt) {
    var shasum = crypto.createHash('sha256');
    shasum.update(salt + "--" + password);
    return shasum.digest('hex');
}
function sign(secret, s) {
    var shasum = crypto.createHmac('sha256', secret);
    shasum.update(s);
    return shasum.digest('hex');
}



// Signup - return user object in the callback
//
// throw Error if invalid login
//
Auth.prototype.signup = function (login, password, cb) {
    var self = this,
        user = { login: login };
    this.once('user', cb);

    // Check login
    if (login === '') { self.emit('user', new Error('Invalid login')); return; }

    if (password) { // oauth2 = no password
        user.salt = getSalt(password);
        user.hash = encryptPassword(password, user.salt);
    }
    self.emit('user', null, user);
};


// updatePassword - return updated salt and hash
Auth.prototype.updatePassword = function (password) {
    var params = {};
    params.salt = getSalt(password);
    params.hash = encryptPassword(password, params.salt);
    return params;
};


// Signin - return token in the callback if signin is successful
//
// Error is thrown if invalid password
Auth.prototype.signin = function (user, password, cb) {
    var self = this,
        now = new Date(),
        expirationTime,
        signature,
        token;
    this.once('token', cb);

    // Check Password
    if (password) {
        if (user.password !== encryptPassword(password, user.salt)) {
            self.emit('token', new Error('Invalid Password'));
            return;
        }
    }

    // Generate Token
    expirationTime = new Date(now.getTime() + (3600 * 24 * 7 * 1000)).getTime();   // valid 1 week
    signature = sign(secret, user.login + ':' + expirationTime + ':' + user.hash);
    token = user.login + ":" + expirationTime + ":" + signature;
    self.emit('token', null, new Buffer(token, 'ascii').toString('base64'));
};



// decodeToken - return token fields (login, expirationTime, signature) synchrousnously
//
// Error is thrown if the token is invalid
Auth.prototype.decodeToken = function (encodedtoken) {
    var token = new Buffer(encodedtoken, 'base64').toString('ascii'),
        login,
        expirationTime,
        signature;
    if (token === '') {  throw new Error('Invalid Token / Base64 Encoding'); }

    // Split params
    login = token.split(':')[0];
    expirationTime = token.split(':')[1];
    signature = token.split(':')[2];
    if (signature === undefined || isNaN(expirationTime) || expirationTime === undefined) { throw new Error('Invalid Token / Invalid Format'); }

    // Check Validity
    if (new Date().getTime() > expirationTime) { throw new Error('Invalid Token / Expired'); }

    return { 'login': login, 'expirationTime': expirationTime, 'signature': signature};
};


// authenticate - does not return anything
//
// Error is thrown if the token is invalid
Auth.prototype.authenticate = function (user, expirationTime, signature, cb) {
    var self = this;
    this.once('token', cb);

    // Check signature
    if (signature !== sign(secret, user.login + ':' + expirationTime + ':' + user.hash)) { self.emit('token', new Error('Invalid Token / Invalid Signature')); return; }

    self.emit('token', null, null);
};
