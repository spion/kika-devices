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
    app.get('/xively', function(req, res) {
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

};

