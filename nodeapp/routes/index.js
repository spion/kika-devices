// index page

var config = require('../models/config.js');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {lang:config.domain(req).lang});
    });
};

