"use strict";
var util = require('util'),
    assert = require('assert'),
    APIeasy = require('api-easy'),
    suite = APIeasy.describe('api'),
    config = require('../config');

function encodeBase64(s) { return new Buffer(s, 'ascii').toString('base64');}

// Global Settings
suite.use('localhost', config.server.port);


// Unauthorized (User-independent)
suite.get('/xxx')
    .expect(401)
    .expect('Missing token', function (err, res, body) {
        assert.equal(body, 'Missing Cookie auth');
    })
    .export(module);

suite.setHeader('Cookie', 'auth=xxx; ')      // invalid format
    .get('/xxx')
    .expect(401)
    .expect('Invalid token (format)', function (err, res, body) {
        assert.equal(body, 'Invalid Token');
    })
    .export(module);
suite.setHeader('Cookie', 'auth=' + encodeBase64('xxx:xxx:xxx') + ';')      // invalid format
    .get('/xxx')
    .expect(401)
    .expect('Invalid token (format)', function (err, res, body) {
        assert.equal(body, 'Invalid Token');
    })
    .export(module);
suite.setHeader('Cookie', 'auth=' + encodeBase64('xxx:1111111:xxx') + ';')    // expired
    .get('/xxx')
    .expect(401)
    .expect('Invalid token (expired)', function (err, res, body) {
        assert.equal(body, 'Invalid Token');
    })
    .export(module);
suite.setHeader('Cookie', 'auth=' + encodeBase64('xxx:2000000000000:xxx') + ';')    // login not found
    .get('/xxx')
    .expect(401)
    .expect('Invalid token (login not found)', function (err, res, body) {
        assert.equal(body, 'Invalid Token');
    })
    .export(module);


// Unautorized (User-dependent)
suite.setHeader('Content-Type', 'application/json')
    .post('/users', {"login":"bobby", "password": "test"})
    .expect(404)
    .next()
    .setHeader('Content-Type', 'text/plain; charset=us-ascii') // default Content-Type
    .setHeader('Cookie', 'auth=' + encodeBase64('bobby:2000000000000:xxx') + ';')    // invalid signature
    .get('/xxx')
    .expect(401)
    .expect('Invalid token (invalid signature)', function (err, res, body) {
        assert.equal(body, 'Invalid Token');
    })
    .export(module);


// Signin
suite.post('/users/signin', "{'login' : 'bobby'}")
    .setHeader('Content-Type', 'application/json')
    .expect(400)
    .expect('Error Missing field', function (err, res, body) {
        assert.equal(body, 'Missing field');
    })
    .export(module);
suite.post('/users/signin', {"login":"unknown", "password": "unknown"})
    .setHeader('Content-Type', 'application/json')
    .expect(404)
    .expect('login not found', function (err, res, body) {
        assert.equal(body, 'user unknown not found');
    })
    .export(module);
suite.post('/users/signin', {"login":"bobby", "password": "unknown"})
    .setHeader('Content-Type', 'application/json')
    .expect(401)
    .expect(' Invalid Password', function (err, res, body) {
        assert.equal(body, 'Error: Invalid Password');
    })
    .export(module);
suite.post('/users/signin', {"login":"bobby", "password": "test"})
    .setHeader('Content-Type', 'application/json')
    .expect(200)
    .expect('Get userid and Cookie token', function (err, res, body) {
        assert.ok(body.match(/[0-9a-f]/));
        var cookie = res.headers['set-cookie'][0];
        assert.equal(cookie.substring(0, 5), 'auth=');
        assert.equal(cookie.substring(cookie.indexOf('; max-age:') + 10), '3600');
    })
    .export(module);


// Get user
suite.setHeader('Content-Type', 'application/json')
    .post('/users/signin', {"login":"bobby", "password": "test"})
    .expect(200)
    .expect('Get userid and Cookie token', function (err, res, body) {
        assert.ok(body.match(/[0-9a-f]/));
        assert.equal(res.headers['set-cookie'][0].substring(0, 5), 'auth=');
        suite.before('setAuth', function (outgoing) {
            outgoing.uri = outgoing.uri.replace('ID', body);
            return outgoing;
        });  
    })
    .next()
    .setHeader('Content-Type', 'text/plain; charset=us-ascii') // default Content-Type
    .get('/users/1')
    .expect(200)
    .expect('Get user', function (err, res, body) {
        var user = JSON.parse(body);
        assert.equal(user.login, 'bobby');
    })
    .next()
    .setHeader('Content-Type', 'text/plain; charset=us-ascii') // default Content-Type
    .get('/users/2')
    .expect(401)
    .export(module);

// Get my disasters
suite.setHeader('Content-Type', 'application/json')
    .post('/users/signin', {"login":"bobby", "password": "test"})
    .expect(200)
    .expect('Get userid and Cookie token', function (err, res, body) {
        assert.ok(body.match(/[0-9a-f]/));
        assert.equal(res.headers['set-cookie'][0].substring(0, 5), 'auth=');
        suite.before('setAuth', function (outgoing) {
            outgoing.uri = outgoing.uri.replace('ID', body);
            return outgoing;
        });  
    })
    .next()
    .setHeader('Content-Type', 'text/plain; charset=us-ascii') // default Content-Type
    .get('/users/1/disasters')
    .expect(200)
    .next()
    .setHeader('Content-Type', 'text/plain; charset=us-ascii') // default Content-Type
    .get('/users/2/disasters')
    .expect(401)
    .export(module);



// Create, update and delete disaster
suite.setHeader('Content-Type', 'application/json')
    .post('/users/signin', {"login":"bobby", "password": "test"})
    .expect(200)
    .expect('Get userid and Cookie token', function (err, res, body) {
        assert.ok(body.match(/[0-9a-f]/));
        assert.equal(res.headers['set-cookie'][0].substring(0, 5), 'auth=');
        suite.before('setAuth', function (outgoing) {
            outgoing.uri = outgoing.uri.replace('ID', body);
            return outgoing;
        });  
    })
    .next()
    .post('/disasters', {"id": 1, "date": new Date().getTime()})
    .expect(200)
    .expect('Create new disaster', function (err, res, body) {
        assert.ok(parseInt(body) > 0);
    })
    .next()
    .post('/disasters/1', {"date": new Date().getTime()})
    .expect(204)
    .next()
    .post('/disasters/0', {"date": new Date().getTime()})
    .expect(404)
    .next()
    .setHeader('Content-Type', 'text/plain; charset=us-ascii') // default Content-Type
    .del('/disasters/1')
    .expect(204)
    .next()
    .setHeader('Content-Type', 'text/plain; charset=us-ascii') // default Content-Type
    .del('/disasters/0')
    .expect(404)
    .next()
    .export(module);
