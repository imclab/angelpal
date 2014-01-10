"use strict";
module.exports.match = function (method, path, cb) {
    return function (req, res, next) {
        var regex = new RegExp('^' + path + '$'),
            match,
            params = [req, res],
            url = req.url.split('?')[0],   // remove url parameters
            i;
        if (req.method !== method) { return next(); }
        match = regex.exec(url);
        if (match === null) { return next(); }

        for (i = 0; i < match.length - 1; i = i + 1) {
            params.push(match[i + 1]);
        }
        cb.apply(undefined, params);
    };
};
