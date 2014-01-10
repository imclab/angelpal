"use strict";
var util = require('util'),
    Auth = require('../lib/auth').Auth,
    dbHelper = require('../lib/db-mysql');

// ### Get user's disasters
module.exports.getAll = function (req, res, id) {

    //check if data can be reached by this user
    var token = new Auth().decodeToken(req.cookies.auth);
    dbHelper.get('users', {login: token.login}, function (err, doc) {
        if (err) { throw err; }
        if (doc === null || doc.length == 0 || doc[0].id != id) {
            res.writeHead(401);
            res.end('disasters not reachable');
            return;
        }
    });

    dbHelper.db.query('SELECT jd.disaster_client_id, d.* FROM join_disasters AS jd RIGHT JOIN disasters AS d ON jd.disaster_server_id = d.id  WHERE ?', {user_server_id: id}, function (err, rows, fields) {
       if (err) { throw err; }
        if (rows === null) {
            res.writeHead(404);
            res.end('');
        } else {
            res.writeHead(200);
            res.end(JSON.stringify(rows));
        }
    });
    
};


// ### Create a disaster
module.exports.create = function (req, res) {

    var data = req.body;

    //get user id
    var token = new Auth().decodeToken(req.cookies.auth);
    dbHelper.get('users', {login: token.login}, function (err, doc) {
        if (err) { throw err; }
        if (doc === null || doc.length == 0) {
            res.writeHead(401);
            res.end('auth problem');
            return;
        } else {
            data.owner = doc[0].id;
            data.date = new Date(data.date);
            data.date_created = new Date();
            dbHelper.create('disasters', data, function (err, resources) {
                if (err) { throw err; }
                res.writeHead(200);
                res.end('' + resources.insertId);
            });
        }
    });
  
};


// ### Update a disaster by its id
module.exports.update = function (req, res, id) {

    var data = req.body;

    // get user id
    var token = new Auth().decodeToken(req.cookies.auth);
    dbHelper.get('users', {login: token.login}, function (err, doc) {
        if (err) { throw err; }
        if (doc === null || doc.length == 0) {
            res.writeHead(401);
            res.end('auth problem');
            return;
        } else {
            // check if user is disaster's owner
            dbHelper.db.query('SELECT * FROM disasters WHERE id=' + id + ' AND owner=' + doc[0].id, function (err, rows, fields) {
                if (err) { throw err; }
                if (rows == null || rows.length == 0) {
                    res.writeHead(404);
                    res.end('no disaster found');
                    return;
                } else {
                    dbHelper.update('disasters', id, data, function (err, doc) {
                        if (err) { throw err; }
                        res.writeHead(204);
                        res.end('');
                    });
                }
            });
        }
    });

};


// ### Delete a disaster by its id
module.exports.remove = function (req, res, id) {

    // get user id
    var token = new Auth().decodeToken(req.cookies.auth);
    dbHelper.get('users', {login: token.login}, function (err, doc) {
        if (err) { throw err; }
        if (doc === null || doc.length == 0) {
            res.writeHead(401);
            res.end('auth problem');
            return;
        } else {
            // check if user is disaster's owner
            dbHelper.db.query('SELECT * FROM disasters WHERE id=' + id + ' AND owner=' + doc[0].id, function (err, rows, fields) {
                if (err) { throw err; }
                if (rows == null || rows.length == 0) {
                    res.writeHead(404);
                    res.end('no disaster found');
                    return;
                } else {
                    dbHelper.remove('disasters', id, function (err) {
                        if (err) { throw err; }
                        dbHelper.db.query('DELETE FROM join_disasters WHERE disaster_server_id = ' + id, function (err, result) {
                            if (err) { throw err; }
                            res.writeHead(204);
                            res.end('');
                        });
                    });
                }
            });
        }
    });

};
