// login pages

var passport = require('passport'),
    auth = require('../models/auth.js');

module.exports = function (app) {
    app.get('/login', passport.authenticate('twitter'), function (req, res) { });
    app.get('/login/callback', passport.authenticate('twitter', {failureRedirect:'/login'}), auth.redirect);
    app.get('/login/admin', passport.authenticate('twitter-admin'), function (req, res) { });
    app.get('/login/admin/callback', passport.authenticate('twitter-admin', {failureRedirect:'/login/admin'}), auth.redirectAdmin);


    //app.get('/logout', function(req, res) {
    //    if (res.isAuthenticated()) res.cookie.clear
    //})
};

