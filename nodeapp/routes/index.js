// index page
var config = require('../config.js'),
    mongodb = require('../models/db.js');

module.exports = function (app) {
    app.get('/cosm', function(req, res) {
        res.render('cosm');
    });
    app.get('/temp', function(req, res) {
        res.render('cosm');
    });
    app.get('/', function (req, res) {
        if (config.baseUrl.indexOf(req.headers.host) < 0) {
            res.redirect(config.baseUrl);
        }
        else {
            res.render('index');
        }
    });
    app.get('/103', function(req, res) {
        res.render('103');
    });

    app.get('/log', function(req, res) {
        var db = mongodb();
        db.logs.insert({tag: req.query.tag, referer: req.header('referer'), time: new Date().getTime()});
        res.end();
    });

    app.get('/loglistall123', function(req, res) {
        var db = mongodb();
        db.logs.find({}).toArray(function(err, arr) {
            res.json(arr);
        });
    });

};

