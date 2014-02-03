"use strict";
var db = require('../initDB');

// load models
var models = [
    'User', 'Organization', 'Invitation'
];
models.forEach(function (model) {
    module.exports[model] = db.import(__dirname + '/' + model);
});
