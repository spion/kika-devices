var mongodb = require('../models/db.js');

var getCounters = require('../services/counters').getCounters;

module.exports = function (app) {

    app.get("/status", function (req, res) {
        var callback = res.json.bind(res);
        var maxResults = req.query && req.query.limit && parseInt(req.query.limit,10) ? parseInt(req.query.limit,10) : 86400;
        var since = new Date().getTime() - 24 * 60 * 60 * 1000;

        getCounters(since, maxResults, callback);
    });
};
