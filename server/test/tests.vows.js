"use strict";
var assert = require('assert');
var APIeasy = require('api-easy');
var suite = APIeasy.describe('api');
var config = require('../config');

// Global Settings
suite.use('localhost', config.server.port);


suite.get('/')
    .expect(200)
    .export(module);

suite.get('/bobby')
    .expect(404)
    .export(module);

/**
*   Authentification
*/
suite.get('/me')
    .expect(401)
    .export(module);
suite.setHeader('Authorization', '654321')
    .get('/me')
    .expect(401)
    .export(module);
suite.setHeader('Authorization', '123456')
    .get('/me')
    .expect(200)
    .export(module);

/**
*   Organizations
*/
suite.setHeader('Authorization', '123456')
    .get('/organizations')
    .expect(200)
    .get('/organizationsAdmin')
    .expect(200)
    .post('/organizations')
    .expect(400)
    .export(module);

// suite.setHeader('Authorization', '123456')
//     .post('/organizations', { "name": 'orga test' })
//     .expect(200)
//     .export(module);

// suite.setHeader('Cookie', 'auth=' + encodeBase64('xxx:1111111:xxx') + ';')    // expired
//     .get('/xxx')
//     .expect(401)
//     .expect('Invalid token (expired)', function (err, res, body) {
//         assert.equal(body, 'Invalid Token');
//     })
//     .export(module);
// suite.setHeader('Cookie', 'auth=' + encodeBase64('xxx:2000000000000:xxx') + ';')    // login not found
//     .get('/xxx')
//     .expect(401)
//     .expect('Invalid token (login not found)', function (err, res, body) {
//         assert.equal(body, 'Invalid Token');
//     })
//     .export(module);
 