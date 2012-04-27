// login pages

var passport = require('passport'),
    auth = require('../models/auth.js'),
    config = require('../config.js');

module.exports = function (app) {
    app.get('/login',
        function (req, res, next) {
            passport.authenticate(config.get(req))(req, res, next)
        },
        function (req, res) {
        });

    app.get('/login/callback',
        function (req, res, next) {
            passport.authenticate(config.get(req), {failureRedirect:'/login'})(req, res, next)
        }, auth.redirect);

    app.get('/login/admin', function (req, res, next) {
            passport.authenticate(config.get(req) + "-admin")(req, res, next)
        },
        function (req, res) {
        });

    app.get('/login/admin/callback',
        function (req, res, next) {
            passport.authenticate(config.get(req) + '-admin', {failureRedirect:'/login/admin'})(req, res, next)
        }, auth.redirectAdmin);

};

