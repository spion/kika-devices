// index page
var config = require('../config.js');

module.exports = function (app) {
    app.get('/', function (req, res) {
        if (config.baseUrl.indexOf(req.headers.host) < 0) {
            res.redirect(config.baseUrl);
        }
        else {
            res.render('index');
        }
    });
};

