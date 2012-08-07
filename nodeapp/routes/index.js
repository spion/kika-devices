// index page
var config = require('../config.js');

module.exports = function (app) {
    app.get('/temp', function(req, res) {
        res.render('temp');
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
    })
};

